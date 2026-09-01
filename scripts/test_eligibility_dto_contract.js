import { eligibilityService } from '../src/services/eligibilityService.js';
import { apiClient } from '../src/services/apiClient.js';

function runDTOContractTests() {
  console.log('=============================================================================');
  console.log('SCHOLAR AI — ELIGIBILITY DTO CONTRACT & PARSER REGRESSION SUITE');
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

  // 1. Create a mock 63-element backend response matching Spring Boot DTO
  const mockBackendDTO = {
    allResults: Array.from({ length: 63 }, (_, i) => ({
      scholarshipId: `sch-${i + 1}`,
      scholarshipName: `Scholarship ${i + 1}`,
      evaluationStatus: i < 25 ? 'ELIGIBLE' : (i === 25 ? 'POSSIBLE_MATCH' : 'NOT_ELIGIBLE'),
      tier: i < 15 ? 'STRONG_MATCH' : (i < 25 ? 'GOOD_MATCH' : (i === 25 ? 'POSSIBLE_MATCH' : 'INELIGIBLE')),
      isEligible: i < 25,
      matchScore: i < 25 ? 90 : 30,
      matchedCriteria: ['Income criteria met', 'Education level satisfied'],
      failedCriteria: i >= 26 ? ['Academic score below threshold'] : [],
      missingInformation: i === 25 ? ['Income certificate verification needed'] : [],
      deadlineStatus: 'OPEN',
      scholarship: {
        id: `sch-${i + 1}`,
        name: `Scholarship ${i + 1}`,
        provider: 'Ministry of Education',
        governmentLevel: 'CENTRAL',
        state: 'ALL_INDIA'
      }
    })),
    summary: {
      eligibleCount: 25,
      possibleCount: 1,
      ineligibleCount: 37,
      totalCount: 63
    }
  };

  // Mock apiClient.get
  const originalGet = apiClient.get;

  // Test 1: Standard allResults response
  console.log('\n--- TEST 1: Parsing Standard Backend Response with allResults ---');
  apiClient.get = async () => mockBackendDTO;

  eligibilityService.getEvaluations().then(res => {
    assert(res.allResults.length === 63, 'Parsed exactly 63 evaluation objects');
    assert(res.eligible.length === 25, 'Found 25 eligible scholarships');
    assert(res.possible.length === 1, 'Found 1 possible scholarship');
    assert(res.ineligible.length === 37, 'Found 37 ineligible scholarships');
    assert(res.strongMatches.length === 15, 'Found 15 strong matches');
    assert(res.goodMatches.length === 10, 'Found 10 good matches');
    
    // Invariant check
    const invariant = res.eligible.length + res.possible.length + res.ineligible.length === res.allResults.length;
    assert(invariant, `Classification invariant holds: 25 + 1 + 37 === 63`);

    // Test 2: Alternative results field response
    console.log('\n--- TEST 2: Parsing Response with results key ---');
    apiClient.get = async () => ({ results: mockBackendDTO.allResults });

    return eligibilityService.getEvaluations();
  }).then(res2 => {
    assert(res2.allResults.length === 63, 'Parsed 63 objects from results key');

    // Test 3: Alternative evaluations field response
    console.log('\n--- TEST 3: Parsing Response with evaluations key ---');
    apiClient.get = async () => ({ evaluations: mockBackendDTO.allResults });

    return eligibilityService.getEvaluations();
  }).then(res3 => {
    assert(res3.allResults.length === 63, 'Parsed 63 objects from evaluations key');

    // Test 4: Error handling on missing results array
    console.log('\n--- TEST 4: Error Throwing on Invalid Contract ---');
    apiClient.get = async () => ({ unexpected: true });

    return eligibilityService.getEvaluations()
      .then(() => {
        assert(false, 'Should throw on missing results array');
      })
      .catch(err => {
        assert(err.message.includes('expected results array'), 'Throws clear contract error on malformed response');
      });
  }).then(() => {
    apiClient.get = originalGet;
    console.log('\n=============================================================================');
    console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log('=============================================================================');

    if (failed > 0) process.exit(1);
  }).catch(err => {
    apiClient.get = originalGet;
    console.error('Unhandled test failure:', err);
    process.exit(1);
  });
}

runDTOContractTests();
