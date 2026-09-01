import { MASTER_SCHOLARSHIP_REGISTRY } from '../src/data/scholarships/index.js';
import { evaluateAllScholarships } from '../src/engine/eligibilityEngine.js';
import { normalizeScholarship } from '../src/services/scholarshipService.js';
import { eligibilityService } from '../src/services/eligibilityService.js';

function runDashboardScholarshipLoadingTests() {
  console.log('=============================================================================');
  console.log('SCHOLAR AI — POST-ONBOARDING DASHBOARD SCHOLARSHIP PIPELINE REGRESSION SUITE');
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

  // Test Profile
  const completedProfile = {
    fullName: 'Test Flow User',
    dateOfBirth: '2003-05-15',
    dob: '2003-05-15',
    gender: 'MALE',
    nationality: 'INDIAN',
    educationLevel: 'UNDERGRADUATE',
    course: 'B.Tech Computer Science and Engineering',
    branch: 'Computer Science',
    currentYear: 3,
    institutionName: 'Anna University',
    class12Percentage: 88.5,
    currentCgpa: 8.5,
    annualFamilyIncome: 250000,
    annualIncome: 250000,
    incomeSource: 'SALARY',
    category: 'OBC',
    domicileState: 'Tamil Nadu',
    state: 'Tamil Nadu',
    onboardingComplete: true,
    isOnboarded: true,
    onboardingStep: 5
  };

  // 1. Test Catalog Availability
  console.log('\n--- TEST 1: Scholarship Catalog Pipeline ---');
  const normRegistry = MASTER_SCHOLARSHIP_REGISTRY.map(normalizeScholarship);
  assert(normRegistry.length > 0, `Published catalog contains ${normRegistry.length} scholarships`);

  // 2. Test Local Deterministic Evaluation
  console.log('\n--- TEST 2: Deterministic Decision Tree Classification ---');
  const evalResults = eligibilityService.evaluateAll(completedProfile, normRegistry);
  assert(evalResults.allResults.length === normRegistry.length, `Evaluated all ${normRegistry.length} scholarships in catalog`);
  assert(evalResults.eligible.length > 0, `Found ${evalResults.eligible.length} eligible scholarships for student profile`);
  
  // 3. Test Classification Invariant
  console.log('\n--- TEST 3: Classification Invariant (Total == Eligible + Possible + Ineligible) ---');
  const sumCategories = evalResults.eligible.length + evalResults.possible.length + evalResults.ineligible.length;
  assert(evalResults.allResults.length === sumCategories, `Classification invariant holds: ${evalResults.allResults.length} === ${sumCategories}`);
  assert(evalResults.summary.totalCount === evalResults.allResults.length, `Summary totalCount matches: ${evalResults.summary.totalCount}`);

  // 4. Test Strong/Good Matches Grouping
  console.log('\n--- TEST 4: Match Tier Stratification ---');
  const totalEligibleStratified = evalResults.strongMatches.length + evalResults.goodMatches.length;
  assert(totalEligibleStratified === evalResults.eligible.length, `Stratified matches (${evalResults.strongMatches.length} strong + ${evalResults.goodMatches.length} good) equal eligible count (${evalResults.eligible.length})`);

  console.log('\n=============================================================================');
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('=============================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runDashboardScholarshipLoadingTests();
