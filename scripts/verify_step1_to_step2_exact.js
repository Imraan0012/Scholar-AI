import { mapSupabaseProfileToDTO, mapDTOToSupabaseRow, profileService } from '../src/services/profileService.js';

function runStep1ToStep2ExactTests() {
  console.log('=============================================================================');
  console.log('SCHOLAR AI — STEP 1 -> STEP 2 PROGRESSION & ROUTE GUARD EXACT REGRESSION SUITE');
  console.log('=============================================================================');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      failed++;
    }
  }

  const mockUser = { id: 'u-student-001', email: 'student@scholarai.in' };

  // ── TEST 1: Step 1 Save Payload & Database Row Verification
  console.log('\n--- TEST 1: Database value after Step 1 save ---');
  const step1Input = {
    fullName: 'Mohamed Imraan',
    email: 'student@scholarai.in',
    phone: '9876543210',
    mobile: '9876543210',
    dateOfBirth: '2003-05-15',
    dob: '2003-05-15',
    nationality: 'INDIAN',
    gender: 'MALE',
    onboardingStep: 2,
    onboardingComplete: false,
    isOnboarded: false
  };

  const dbRowAfterStep1 = mapDTOToSupabaseRow(mockUser.id, step1Input);
  assert(dbRowAfterStep1.user_id === mockUser.id, 'User ID matches on profile row');
  assert(dbRowAfterStep1.onboarding_complete === false, 'Database onboarding_complete value is FALSE');
  assert(dbRowAfterStep1.onboarding_step === 2, 'Database onboarding_step value is 2');
  assert(dbRowAfterStep1.full_name === 'Mohamed Imraan', 'Personal details full_name saved');

  // ── TEST 2: DTO reconstruction from DB Row
  console.log('\n--- TEST 2: DTO mapping from DB Row ---');
  const dtoAfterStep1 = mapSupabaseProfileToDTO(dbRowAfterStep1);
  assert(dtoAfterStep1.onboardingComplete === false, 'DTO onboardingComplete is FALSE');
  assert(dtoAfterStep1.onboardingStep === 2, 'DTO onboardingStep is 2');
  assert(dtoAfterStep1.fullName === 'Mohamed Imraan', 'DTO full_name is preserved');

  // ── TEST 3: getFirstIncompleteStep evaluation
  console.log('\n--- TEST 3: Step calculation after Step 1 ---');
  const nextStep = profileService.getFirstIncompleteStep(dtoAfterStep1);
  assert(nextStep === 2, 'Next incomplete step is 2 (Academic Background)');

  // ── TEST 4: Exact Route Guard Simulation
  console.log('\n--- TEST 4: Route Guard Decision State Machine ---');

  function evaluateRouteGuard(view, currentUser, authLoading, profileStatus, profile) {
    if (authLoading) return { action: 'HOLD_VIEW', targetView: view, reason: 'auth_loading' };

    const isProtected = ['dashboard', 'onboarding', 'analysis', 'results', 'admin'].includes(view);
    if (isProtected && !currentUser) {
      return { action: 'REDIRECT_LOGIN', targetView: 'landing', reason: 'unauthenticated' };
    }

    if (currentUser) {
      if (profileStatus === 'loading' || profileStatus === 'error' || profileStatus === 'unauthenticated') {
        return { action: 'HOLD_VIEW', targetView: view, reason: 'profile_status_' + profileStatus };
      }

      const isCompleted = Boolean(profile?.onboardingComplete === true || profile?.isOnboarded === true);

      if (view === 'onboarding') {
        if (isCompleted) {
          return { action: 'REDIRECT_DASHBOARD', targetView: 'dashboard', reason: 'profile_complete' };
        } else {
          return { action: 'ALLOW', targetView: 'onboarding', reason: 'profile_incomplete' };
        }
      }

      if (['dashboard', 'results', 'analysis'].includes(view)) {
        if (profileStatus === 'not_found' || !isCompleted) {
          return { action: 'REDIRECT_ONBOARDING', targetView: 'onboarding', reason: 'profile_incomplete' };
        }
        return { action: 'ALLOW', targetView: view, reason: 'profile_complete' };
      }
    }

    return { action: 'ALLOW', targetView: view, reason: 'public_view' };
  }

  // Regression Test 1: User is on /onboarding, fills Step 1, saves to context (profileStatus=loaded, onboardingComplete=false, step=2)
  const guardAfterStep1 = evaluateRouteGuard('onboarding', mockUser, false, 'loaded', dtoAfterStep1);
  assert(guardAfterStep1.action === 'ALLOW', 'Route guard ALLOWS user to remain on /onboarding after Step 1 save');
  assert(guardAfterStep1.targetView === 'onboarding', 'Target view remains /onboarding');
  assert(guardAfterStep1.reason === 'profile_incomplete', 'Reason is profile_incomplete');

  // Regression Test 2: If a user with partial profile attempts to navigate to /dashboard directly
  const guardDashboardAttempt = evaluateRouteGuard('dashboard', mockUser, false, 'loaded', dtoAfterStep1);
  assert(guardDashboardAttempt.action === 'REDIRECT_ONBOARDING', 'Attempt to access /dashboard with partial profile redirects to /onboarding');
  assert(guardDashboardAttempt.targetView === 'onboarding', 'Target view is redirected to /onboarding');

  // Regression Test 3: User with Step 4 completed (onboardingStep=4, onboardingComplete=false)
  const dtoStep4 = {
    ...dtoAfterStep1,
    educationLevel: 'UNDERGRADUATE',
    course: 'B.Tech CSE',
    annualFamilyIncome: 250000,
    category: 'OBC',
    domicileState: 'Tamil Nadu',
    onboardingStep: 4,
    onboardingComplete: false
  };
  const guardStep4 = evaluateRouteGuard('onboarding', mockUser, false, 'loaded', dtoStep4);
  assert(guardStep4.action === 'ALLOW', 'User on Step 4 stays on /onboarding (Category & State of Residence)');
  assert(guardStep4.targetView === 'onboarding', 'Target view remains /onboarding on Step 4');

  // Regression Test 4: Fully completed user (onboardingComplete=true) visiting /onboarding
  const dtoStep5Complete = {
    ...dtoStep4,
    onboardingStep: 5,
    onboardingComplete: true,
    isOnboarded: true
  };
  const guardCompleteOnboarding = evaluateRouteGuard('onboarding', mockUser, false, 'loaded', dtoStep5Complete);
  assert(guardCompleteOnboarding.action === 'REDIRECT_DASHBOARD', 'Completed user on /onboarding redirects to /dashboard');
  assert(guardCompleteOnboarding.targetView === 'dashboard', 'Target view is /dashboard for completed user');

  // Regression Test 5: Fully completed user visiting /dashboard
  const guardCompleteDashboard = evaluateRouteGuard('dashboard', mockUser, false, 'loaded', dtoStep5Complete);
  assert(guardCompleteDashboard.action === 'ALLOW', 'Completed user is ALLOWED on /dashboard');
  assert(guardCompleteDashboard.targetView === 'dashboard', 'Target view is /dashboard');

  console.log('\n=============================================================================');
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('=============================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runStep1ToStep2ExactTests();
