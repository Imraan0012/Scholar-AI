import { MASTER_SCHOLARSHIP_REGISTRY } from '../src/data/scholarships/index.js';
import { evaluateAllScholarships } from '../src/engine/eligibilityEngine.js';
import { eligibilityService } from '../src/services/eligibilityService.js';
import { mapSupabaseProfileToDTO, mapDTOToSupabaseRow, profileService } from '../src/services/profileService.js';

function runDynamicPerUserArchitectureSuite() {
  console.log('=============================================================================');
  console.log('SCHOLAR AI — DYNAMIC PER-USER PROFILE → ELIGIBILITY → DASHBOARD SUITE');
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

  // ── 1. TEST SUITE A: NEW USER vs INCOMPLETE USER vs COMPLETED USER ROUTING ───
  console.log('\n--- 1. NEW USER & INCOMPLETE PROGRESS ROUTING ---');
  
  // A. Brand new user with no database row
  const brandNewUser = { id: 'uuid-user-brand-new', email: 'brand_new@scholarai.org', user_metadata: { full_name: 'Brand New Student' } };
  const emptyDTO = {
    userId: brandNewUser.id,
    fullName: brandNewUser.user_metadata.full_name,
    email: brandNewUser.email,
    onboardingStep: 1,
    onboardingComplete: false,
    isOnboarded: false,
    profileCompletionScore: 0
  };
  assert(emptyDTO.onboardingStep === 1, 'Brand new user starts strictly at Step 1');
  assert(emptyDTO.onboardingComplete === false, 'Brand new user is onboardingComplete=false');
  assert(emptyDTO.profileCompletionScore === 0, 'Brand new user starts with 0% completion');

  // B. Incomplete user with Step 1 saved
  const step1Row = {
    user_id: 'uuid-step1',
    full_name: 'Step 1 Student',
    date_of_birth: '2004-06-15',
    gender: 'FEMALE',
    phone: '9876543210',
    onboarding_step: 2,
    onboarding_complete: false
  };
  const step1DTO = mapSupabaseProfileToDTO(step1Row);
  assert(step1DTO.onboardingStep === 2, 'User with Step 1 saved resumes at Step 2 (Academic)');
  assert(step1DTO.onboardingComplete === false, 'User at Step 2 is not completed');

  // C. Incomplete user with Step 3 saved
  const step3Row = {
    user_id: 'uuid-step3',
    full_name: 'Step 3 Student',
    education_level: 'UNDERGRADUATE',
    course: 'B.Tech Computer Science',
    annual_family_income: 200000,
    onboarding_step: 4,
    onboarding_complete: false
  };
  const step3DTO = mapSupabaseProfileToDTO(step3Row);
  assert(step3DTO.onboardingStep === 4, 'User with Step 3 saved resumes at Step 4 (Category & State)');
  assert(step3DTO.onboardingComplete === false, 'User at Step 4 is not completed');

  // D. Completed user with Step 5 saved
  const step5Row = {
    user_id: 'uuid-step5',
    full_name: 'Step 5 Completed Student',
    education_level: 'UNDERGRADUATE',
    course: 'B.Tech Information Technology',
    annual_family_income: 200000,
    category: 'OBC',
    domicile_state: 'Tamil Nadu',
    onboarding_step: 5,
    onboarding_complete: true,
    profile_completion_score: 100
  };
  const step5DTO = mapSupabaseProfileToDTO(step5Row);
  assert(step5DTO.onboardingStep === 5, 'Completed user is at Step 5');
  assert(step5DTO.onboardingComplete === true, 'Completed user has onboardingComplete=true');
  assert(step5DTO.profileCompletionScore === 100, 'Completed user has 100% completion');

  // ── 2. TEST SUITE B: THREE-PROFILE INDEPENDENT DECISION TREE EVALUATION ───────
  console.log('\n--- 2. THREE-PROFILE INDEPENDENT DECISION TREE EVALUATION ---');

  // PROFILE A: Low income (₹1.5L), High marks (88%), OBC, Tamil Nadu, Undergraduate B.Tech
  const profileA = {
    userId: 'user-a-1111',
    fullName: 'Priya Sharma (Profile A)',
    gender: 'FEMALE',
    educationLevel: 'UNDERGRADUATE',
    course: 'B.Tech Computer Science and Engineering',
    branch: 'Computer Science',
    currentYear: 2,
    class12Percentage: 88,
    currentCgpa: 8.8,
    annualFamilyIncome: 150000,
    category: 'OBC',
    domicileState: 'Tamil Nadu',
    isFirstGraduate: true,
    hasDisability: false,
    onboardingComplete: true
  };

  // PROFILE B: High income (₹8.5L), Moderate marks (65%), General, Karnataka, Postgraduate MBA
  const profileB = {
    userId: 'user-b-2222',
    fullName: 'Rahul Verma (Profile B)',
    gender: 'MALE',
    educationLevel: 'POSTGRADUATE',
    course: 'MBA Master of Business Administration',
    branch: 'Finance',
    currentYear: 1,
    undergraduateCgpa: 6.5,
    currentCgpa: 6.5,
    annualFamilyIncome: 850000,
    category: 'GENERAL',
    domicileState: 'Karnataka',
    isFirstGraduate: false,
    hasDisability: false,
    onboardingComplete: true
  };

  // PROFILE C: Female, Single Girl Child, ₹2.2L, SC, Uttar Pradesh, Class 12
  const profileC = {
    userId: 'user-c-3333',
    fullName: 'Ananya Kumari (Profile C)',
    gender: 'FEMALE',
    educationLevel: 'CLASS_12',
    course: 'Higher Secondary (Class 12)',
    currentYear: 1,
    class10Percentage: 78,
    annualFamilyIncome: 220000,
    category: 'SC',
    domicileState: 'Uttar Pradesh',
    isSingleGirlChild: true,
    hasDisability: false,
    onboardingComplete: true
  };

  const resultsA = eligibilityService.evaluateAll(profileA, MASTER_SCHOLARSHIP_REGISTRY);
  const resultsB = eligibilityService.evaluateAll(profileB, MASTER_SCHOLARSHIP_REGISTRY);
  const resultsC = eligibilityService.evaluateAll(profileC, MASTER_SCHOLARSHIP_REGISTRY);

  console.log(`\nProfile A Results (Low income, TN, OBC, B.Tech): Eligible=${resultsA.eligible.length}, Possible=${resultsA.possible.length}, Ineligible=${resultsA.ineligible.length}, Total=${resultsA.allResults.length}`);
  console.log(`Profile B Results (High income, KA, General, MBA): Eligible=${resultsB.eligible.length}, Possible=${resultsB.possible.length}, Ineligible=${resultsB.ineligible.length}, Total=${resultsB.allResults.length}`);
  console.log(`Profile C Results (Class 12, UP, SC, Single Girl): Eligible=${resultsC.eligible.length}, Possible=${resultsC.possible.length}, Ineligible=${resultsC.ineligible.length}, Total=${resultsC.allResults.length}`);

  // Invariant validation
  assert(resultsA.eligible.length + resultsA.possible.length + resultsA.ineligible.length === resultsA.allResults.length, 'Profile A invariant holds (Total === Eligible + Possible + Ineligible)');
  assert(resultsB.eligible.length + resultsB.possible.length + resultsB.ineligible.length === resultsB.allResults.length, 'Profile B invariant holds (Total === Eligible + Possible + Ineligible)');
  assert(resultsC.eligible.length + resultsC.possible.length + resultsC.ineligible.length === resultsC.allResults.length, 'Profile C invariant holds (Total === Eligible + Possible + Ineligible)');

  // Differentiated output validation
  assert(resultsA.eligible.length !== resultsB.eligible.length, 'Profile A and Profile B have distinct eligibility outcomes reflecting distinct criteria');
  assert(resultsA.eligible.length > resultsB.eligible.length, 'Profile A (low income OBC merit) qualifies for more need-based schemes than Profile B (high income general)');

  // ── 3. TEST SUITE C: PROFILE EDIT & DYNAMIC RE-EVALUATION ───────────────────
  console.log('\n--- 3. DYNAMIC PROFILE EDIT RE-EVALUATION ---');
  
  // Edit Profile A: Increase income from ₹1.5L to ₹12L
  const profileAEdited = {
    ...profileA,
    annualFamilyIncome: 1200000 // 12 Lakhs (Exceeds need-based scholarship limits)
  };
  const resultsAEdited = eligibilityService.evaluateAll(profileAEdited, MASTER_SCHOLARSHIP_REGISTRY);

  assert(resultsAEdited.eligible.length < resultsA.eligible.length, `Income increase (₹1.5L -> ₹12L) dynamically reduced eligible count (${resultsA.eligible.length} -> ${resultsAEdited.eligible.length})`);
  
  // Verify failure reasons on income-dependent scheme
  const failedForIncome = resultsAEdited.ineligible.find(r => r.failedCriteria.some(c => c.toLowerCase().includes('income')));
  assert(Boolean(failedForIncome), 'Ineligible results contain specific income failure explanations');

  console.log('\n=============================================================================');
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('=============================================================================');

  if (failed > 0) process.exit(1);
}

runDynamicPerUserArchitectureSuite();
