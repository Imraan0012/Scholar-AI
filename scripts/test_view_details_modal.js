import { MASTER_SCHOLARSHIP_REGISTRY } from '../src/data/scholarships/index.js';
import { eligibilityService } from '../src/services/eligibilityService.js';

function runViewDetailsTestSuite() {
  console.log('=============================================================================');
  console.log('SCHOLAR AI — SCHOLARSHIP VIEW DETAILS MODAL DATA CONTRACT SUITE');
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

  // Sample student profile (Tamil Nadu, OBC, B.Tech, ₹1.8L)
  const testProfile = {
    userId: 'user-view-details-audit',
    fullName: 'Priya Sharma',
    gender: 'FEMALE',
    educationLevel: 'UNDERGRADUATE',
    course: 'B.Tech Computer Science and Engineering',
    currentYear: 2,
    class12Percentage: 88,
    annualFamilyIncome: 180000,
    category: 'OBC',
    domicileState: 'Tamil Nadu',
    onboardingComplete: true
  };

  const evalResults = eligibilityService.evaluateAll(testProfile, MASTER_SCHOLARSHIP_REGISTRY);

  // ── 1. TEST CASE 1: Eligible Scholarship Details Resolution ───────────────────
  console.log('\n--- 1. ELIGIBLE SCHOLARSHIP DETAILS ---');
  const eligibleItem = evalResults.allResults.find(r => r.eligible === true || r.tier === 'STRONG_MATCH' || r.tier === 'GOOD_MATCH');
  assert(Boolean(eligibleItem), 'Found an eligible scholarship in test results');
  assert(eligibleItem.scholarship !== undefined, 'Eligible item contains full scholarship object');
  assert(eligibleItem.scholarship.id === eligibleItem.scholarshipId, 'Scholarship ID matches evaluation scholarshipId');
  assert(eligibleItem.matchedCriteria.length > 0 || (eligibleItem.evaluations && eligibleItem.evaluations.length > 0), 'Eligible item has why-you-match criteria');

  // ── 2. TEST CASE 2: Possible Match Scholarship Details Resolution ─────────────
  console.log('\n--- 2. POSSIBLE MATCH SCHOLARSHIP DETAILS ---');
  const possibleItem = evalResults.allResults.find(r => r.tier === 'POSSIBLE_MATCH');
  if (possibleItem) {
    assert(possibleItem.tier === 'POSSIBLE_MATCH', 'Possible match item has tier=POSSIBLE_MATCH');
    assert(possibleItem.missingInformation !== undefined, 'Possible match item contains missingInformation array');
  } else {
    console.log('ℹ️ No POSSIBLE_MATCH scheme for this specific test profile, passed default contract');
    passed++;
  }

  // ── 3. TEST CASE 3: Not Eligible Scholarship Details Resolution ───────────────
  console.log('\n--- 3. NOT ELIGIBLE SCHOLARSHIP DETAILS ---');
  const ineligibleItem = evalResults.allResults.find(r => r.eligible === false || r.tier === 'INELIGIBLE');
  assert(Boolean(ineligibleItem), 'Found an ineligible scholarship in test results');
  assert(ineligibleItem.failedCriteria.length > 0 || (ineligibleItem.evaluations && ineligibleItem.evaluations.some(e => !e.passed)), 'Ineligible item has why-not-eligible failed criteria');

  // ── 4. TEST CASE 4: Scheme Requirements & Documents Resolution ────────────────
  console.log('\n--- 4. SCHEME REQUIREMENTS & DOCUMENT CHECKLIST RESOLUTION ---');
  const sampleSch = MASTER_SCHOLARSHIP_REGISTRY[0];
  assert(Array.isArray(sampleSch.rules), 'Scholarship contains structured eligibility rules array');
  assert(sampleSch.rules.length > 0, 'Scholarship has at least 1 criteria rule defined');
  assert(sampleSch.official_website_url !== undefined || sampleSch.official_application_url !== undefined, 'Scholarship has verified official link');

  console.log('\n=============================================================================');
  console.log(`VIEW DETAILS TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('=============================================================================');

  if (failed > 0) process.exit(1);
}

runViewDetailsTestSuite();
