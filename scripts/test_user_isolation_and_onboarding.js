import { mapSupabaseProfileToDTO, mapDTOToSupabaseRow } from '../src/services/profileService.js';
import { eligibilityService } from '../src/services/eligibilityService.js';
import { MASTER_SCHOLARSHIP_REGISTRY } from '../src/data/scholarships/index.js';

function createEmptyProfile(user = null) {
  const meta = user?.user_metadata || {};
  return {
    id: null,
    userId: user?.id || null,
    fullName: meta.full_name || meta.name || user?.name || '',
    email: user?.email || '',
    course: '',
    annualFamilyIncome: '',
    category: 'GENERAL',
    domicileState: '',
    onboardingStep: 1,
    onboardingComplete: false,
    isOnboarded: false,
    profileCompletionScore: 0
  };
}

function runUserIsolationTests() {
  console.log('=============================================================================');
  console.log('SCHOLAR AI — MULTI-USER ISOLATION & ONBOARDING REGRESSION SUITE');
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

  // 1. User A (Completed Profile)
  const userA = { id: 'user-a-uuid-1111', email: 'account_a@scholarai.org', user_metadata: { full_name: 'Account A Student' } };
  const userARow = {
    id: 'prof-a-id',
    user_id: userA.id,
    full_name: 'Account A Student',
    email: userA.email,
    education_level: 'UNDERGRADUATE',
    course: 'B.Tech Computer Science and Engineering',
    annual_family_income: 250000,
    category: 'OBC',
    domicile_state: 'Tamil Nadu',
    onboarding_step: 5,
    onboarding_complete: true,
    profile_completion_score: 100
  };

  const profileADTO = mapSupabaseProfileToDTO(userARow);

  console.log('\n--- TEST 1: User A (Existing Completed Profile) ---');
  assert(profileADTO.userId === userA.id, 'Profile A belongs to User A');
  assert(profileADTO.onboardingComplete === true, 'Profile A is marked onboardingComplete=true');
  assert(profileADTO.onboardingStep === 5, 'Profile A is at onboardingStep=5');

  const evalA = eligibilityService.evaluateAll(profileADTO, MASTER_SCHOLARSHIP_REGISTRY);
  assert(evalA.allResults.length === MASTER_SCHOLARSHIP_REGISTRY.length, `User A evaluated ${evalA.allResults.length} scholarships`);
  assert(evalA.eligible.length > 0, `User A has ${evalA.eligible.length} eligible scholarships`);

  // 2. User B (Brand New User with NO profile)
  console.log('\n--- TEST 2: User B (Brand New User Isolation) ---');
  const userB = { id: 'user-b-uuid-2222', email: 'account_b_new@scholarai.org', user_metadata: { full_name: 'New Student B' } };
  const profileBEmpty = createEmptyProfile(userB);

  assert(profileBEmpty.userId === userB.id, 'Profile B has User B ID');
  assert(profileBEmpty.fullName === 'New Student B', 'Profile B has User B name');
  assert(profileBEmpty.onboardingComplete === false, 'New User B is onboardingComplete=false');
  assert(profileBEmpty.onboardingStep === 1, 'New User B starts at Step 1');
  assert(profileBEmpty.course === '', 'New User B course is empty');
  assert(profileBEmpty.annualFamilyIncome === '', 'New User B annual income is empty');

  // 3. Verify that User B does NOT inherit User A's data
  console.log('\n--- TEST 3: Cross-User Contamination Prevention ---');
  assert(profileBEmpty.userId !== profileADTO.userId, 'User B and User A have distinct userIds');
  assert(profileBEmpty.onboardingComplete !== profileADTO.onboardingComplete, 'User B is incomplete while User A is complete');
  assert(profileBEmpty.course !== profileADTO.course, 'User B has no course from User A');

  // 4. Incomplete Profile step progression
  console.log('\n--- TEST 4: Partial Onboarding Step Routing ---');
  const userBStep2Row = {
    id: 'prof-b-id',
    user_id: userB.id,
    full_name: 'New Student B',
    date_of_birth: '2004-08-20',
    phone: '9876543210',
    onboarding_step: 2,
    onboarding_complete: false
  };
  const profileBStep2 = mapSupabaseProfileToDTO(userBStep2Row);
  assert(profileBStep2.onboardingStep === 2, 'User B correctly resumes from Step 2');
  assert(profileBStep2.onboardingComplete === false, 'User B at Step 2 is not complete');

  console.log('\n=============================================================================');
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('=============================================================================');

  if (failed > 0) process.exit(1);
}

runUserIsolationTests();
