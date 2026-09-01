import { mapSupabaseProfileToDTO, mapDTOToSupabaseRow, profileService } from '../src/services/profileService.js';

function runUnitTests() {
  console.log('=============================================================================');
  console.log('SCHOLAR AI — ONBOARDING WORKFLOW & COMPLETION UNIT TEST SUITE');
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

  // ── TEST 1: mapSupabaseProfileToDTO - Intermediate steps must never mark complete
  console.log('\n--- Test Group 1: mapSupabaseProfileToDTO mappings ---');

  const rowStep1 = {
    id: 'p-001',
    user_id: 'u-001',
    full_name: 'Arun Kumar',
    email: 'arun@example.com',
    gender: 'MALE',
    date_of_birth: '2003-05-15',
    nationality: 'INDIAN',
    onboarding_step: 1,
    onboarding_complete: false
  };
  const dto1 = mapSupabaseProfileToDTO(rowStep1);
  assert(dto1.onboardingComplete === false, 'Step 1 row produces onboardingComplete = false');
  assert(dto1.onboardingStep === 1, 'Step 1 row produces onboardingStep = 1');

  const rowStep4 = {
    ...rowStep1,
    education_level: 'UNDERGRADUATE',
    course: 'B.Tech CSE',
    annual_family_income: 200000,
    category: 'OBC',
    domicile_state: 'Tamil Nadu',
    onboarding_step: 4,
    onboarding_complete: false
  };
  const dto4 = mapSupabaseProfileToDTO(rowStep4);
  assert(dto4.onboardingComplete === false, 'Step 4 row produces onboardingComplete = false');
  assert(dto4.onboardingStep === 4, 'Step 4 row produces onboardingStep = 4');

  // CRITICAL TEST: onboarding_step = 5 in DB without onboarding_complete MUST NOT mark complete
  const rowStep5Incomplete = {
    ...rowStep4,
    onboarding_step: 5,
    onboarding_complete: false
  };
  const dto5Incomplete = mapSupabaseProfileToDTO(rowStep5Incomplete);
  assert(dto5Incomplete.onboardingComplete === false, 'Step 5 incomplete row produces onboardingComplete = false (CRITICAL)');
  assert(dto5Incomplete.onboardingStep === 5, 'Step 5 incomplete row produces onboardingStep = 5');

  // Completed profile
  const rowStep5Complete = {
    ...rowStep5Incomplete,
    onboarding_step: 5,
    onboarding_complete: true,
    profile_completion_score: 100
  };
  const dto5Complete = mapSupabaseProfileToDTO(rowStep5Complete);
  assert(dto5Complete.onboardingComplete === true, 'Step 5 complete row produces onboardingComplete = true');
  assert(dto5Complete.onboardingStep === 5, 'Step 5 complete row produces onboardingStep = 5');
  assert(dto5Complete.profileCompletionScore === 100, 'Step 5 complete row produces score = 100');

  // ── TEST 2: mapDTOToSupabaseRow - DB row creation for each step
  console.log('\n--- Test Group 2: mapDTOToSupabaseRow persistence mappings ---');

  const step1DTO = {
    fullName: 'Arun Kumar',
    email: 'arun@example.com',
    dob: '2003-05-15',
    gender: 'MALE',
    nationality: 'INDIAN',
    onboardingStep: 2,
    onboardingComplete: false
  };
  const row1 = mapDTOToSupabaseRow('u-001', step1DTO);
  assert(row1.onboarding_step === 2, 'Step 1 save sets onboarding_step = 2');
  assert(row1.onboarding_complete === false, 'Step 1 save sets onboarding_complete = false (CRITICAL)');
  assert(row1.user_id === 'u-001', 'Step 1 save links user_id');

  const step4DTO = {
    ...step1DTO,
    educationLevel: 'UNDERGRADUATE',
    course: 'B.Tech CSE',
    annualFamilyIncome: 200000,
    category: 'OBC',
    domicileState: 'Tamil Nadu',
    onboardingStep: 5,
    onboardingComplete: false
  };
  const row4 = mapDTOToSupabaseRow('u-001', step4DTO);
  assert(row4.onboarding_step === 5, 'Step 4 save sets onboarding_step = 5');
  assert(row4.onboarding_complete === false, 'Step 4 save sets onboarding_complete = false');

  const step5DTO = {
    ...step4DTO,
    onboardingStep: 5,
    onboardingComplete: true
  };
  const row5 = mapDTOToSupabaseRow('u-001', step5DTO);
  assert(row5.onboarding_step === 5, 'Step 5 final save sets onboarding_step = 5');
  assert(row5.onboarding_complete === true, 'Step 5 final save sets onboarding_complete = true');
  assert(row5.profile_completion_score === 100, 'Step 5 final save sets score = 100');

  // ── TEST 3: getFirstIncompleteStep sequential step progression
  console.log('\n--- Test Group 3: getFirstIncompleteStep progression ---');

  // Fresh user with blank profile
  const emptyProfile = { fullName: '', email: '', gender: '', dob: '' };
  assert(profileService.getFirstIncompleteStep(emptyProfile) === 1, 'Empty profile requires Step 1');

  // Step 1 done
  const postStep1Profile = {
    fullName: 'Arun Kumar',
    email: 'arun@example.com',
    gender: 'MALE',
    dob: '2003-05-15',
    nationality: 'INDIAN',
    onboardingStep: 2,
    onboardingComplete: false
  };
  assert(profileService.getFirstIncompleteStep(postStep1Profile) === 2, 'Profile after Step 1 requires Step 2');

  // Step 2 done
  const postStep2Profile = {
    ...postStep1Profile,
    educationLevel: 'UNDERGRADUATE',
    course: 'B.Tech CSE',
    onboardingStep: 3,
    onboardingComplete: false
  };
  assert(profileService.getFirstIncompleteStep(postStep2Profile) === 3, 'Profile after Step 2 requires Step 3');

  // Step 3 done
  const postStep3Profile = {
    ...postStep2Profile,
    annualFamilyIncome: 250000,
    onboardingStep: 4,
    onboardingComplete: false
  };
  assert(profileService.getFirstIncompleteStep(postStep3Profile) === 4, 'Profile after Step 3 requires Step 4');

  // Step 4 done
  const postStep4Profile = {
    ...postStep3Profile,
    category: 'OBC',
    domicileState: 'Tamil Nadu',
    onboardingStep: 5,
    onboardingComplete: false
  };
  assert(profileService.getFirstIncompleteStep(postStep4Profile) === 5, 'Profile after Step 4 requires Step 5 (NOT COMPLETE)');

  // Step 5 done (complete)
  const postStep5Profile = {
    ...postStep4Profile,
    onboardingComplete: true
  };
  assert(profileService.getFirstIncompleteStep(postStep5Profile) === 6, 'Completed profile returns 6 (fully complete)');

  // ── TEST 4: View Routing Logic Simulation
  console.log('\n--- Test Group 4: View Routing Guard Simulation ---');

  function calculateActiveView(currentUser, view, profile, profileStatus) {
    const isProtected = ['dashboard', 'onboarding', 'analysis', 'results', 'admin'].includes(view);
    const requiresOnboarding = ['dashboard', 'results'].includes(view);
    const isCompleted = profile?.onboardingComplete === true || profile?.isOnboarded === true;

    return (!currentUser && isProtected)
      ? 'landing'
      : (currentUser && requiresOnboarding && (!isCompleted || profileStatus === 'not_found'))
        ? 'onboarding'
        : view;
  }

  const mockUser = { id: 'u-123', email: 'test@example.com' };

  // Scenario A: Unauthenticated user trying to access dashboard -> redirected to landing
  assert(calculateActiveView(null, 'dashboard', null, 'unauthenticated') === 'landing', 'Unauthenticated user on /dashboard -> landing');

  // Scenario B: Authenticated user with no profile trying to access dashboard -> redirected to onboarding
  assert(calculateActiveView(mockUser, 'dashboard', null, 'not_found') === 'onboarding', 'New user on /dashboard -> onboarding');

  // Scenario C: Authenticated user who just finished Step 1 (profileStatus = loaded, onboardingComplete = false) trying to access dashboard
  assert(calculateActiveView(mockUser, 'dashboard', postStep1Profile, 'loaded') === 'onboarding', 'User after Step 1 trying to access dashboard -> LOCKED TO ONBOARDING (CRITICAL)');

  // Scenario D: Authenticated user who completed Step 4 trying to access dashboard -> locked to onboarding
  assert(calculateActiveView(mockUser, 'dashboard', postStep4Profile, 'loaded') === 'onboarding', 'User after Step 4 trying to access dashboard -> LOCKED TO ONBOARDING');

  // Scenario E: Authenticated completed user accessing dashboard -> allowed to dashboard
  assert(calculateActiveView(mockUser, 'dashboard', postStep5Profile, 'loaded') === 'dashboard', 'Completed user on /dashboard -> dashboard');

  console.log('\n=============================================================================');
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('=============================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runUnitTests();
