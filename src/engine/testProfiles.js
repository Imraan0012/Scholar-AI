// =============================================================================
// SCHOLAR AI — TEST PROFILE EVALUATION HARNESS
// Evaluates the 5 Real-World Test Profiles against the Official Knowledge Base.
// =============================================================================

import { OFFICIAL_SCHOLARSHIP_DATABASE } from '../data/scholarshipDatabase.js';
import { evaluateAllScholarships } from './eligibilityEngine.js';
import { rankRecommendations } from './recommendationModel.js';

export const TEST_PROFILES = [
  {
    id: 'STUDENT_A',
    title: 'Student A — Class 12 Passed, Tamil Nadu, High Marks, Low Income',
    profile: {
      fullName: 'Kavitha Ramaswamy',
      educationLevel: 'CLASS_12_PASSED',
      course: 'B.Sc Physics',
      currentYear: 1,
      class10Percentage: 94.0,
      class12Percentage: 93.5,
      cgpa: 0,
      annualIncome: 180000, // ₹1.8 Lakhs
      domicileState: 'Tamil Nadu',
      category: 'OBC',
      gender: 'FEMALE',
      hasDisability: false,
      isMinority: false
    }
  },
  {
    id: 'STUDENT_B',
    title: 'Student B — UG Engineering, Tamil Nadu, OBC, Middle Income',
    profile: {
      fullName: 'Suresh Kumar',
      educationLevel: 'UNDERGRADUATE',
      course: 'B.Tech',
      currentYear: 2,
      class10Percentage: 86.0,
      class12Percentage: 84.5,
      cgpa: 8.2,
      annualIncome: 220000, // ₹2.2 Lakhs
      domicileState: 'Tamil Nadu',
      category: 'OBC',
      gender: 'MALE',
      hasDisability: false,
      isMinority: false
    }
  },
  {
    id: 'STUDENT_C',
    title: 'Student C — PG Student, SC, Low Income',
    profile: {
      fullName: 'Pooja Meshram',
      educationLevel: 'POSTGRADUATE',
      course: 'M.Tech',
      currentYear: 1,
      class10Percentage: 82.0,
      class12Percentage: 78.0,
      cgpa: 8.7,
      annualIncome: 150000, // ₹1.5 Lakhs
      domicileState: 'Maharashtra',
      category: 'SC',
      gender: 'FEMALE',
      hasDisability: false,
      isMinority: false
    }
  },
  {
    id: 'STUDENT_D',
    title: 'Student D — UG Student with Benchmark Disability (PwD)',
    profile: {
      fullName: 'Rohan Deshmukh',
      educationLevel: 'UNDERGRADUATE',
      course: 'B.Com',
      currentYear: 1,
      class10Percentage: 78.0,
      class12Percentage: 74.0,
      cgpa: 7.5,
      annualIncome: 200000, // ₹2.0 Lakhs
      domicileState: 'Maharashtra',
      category: 'GENERAL',
      gender: 'MALE',
      hasDisability: true,
      disabilityPercentage: 55,
      isMinority: false
    }
  },
  {
    id: 'STUDENT_E',
    title: 'Student E — High Income Student (Affluent Household)',
    profile: {
      fullName: 'Vikramaditya Singhania',
      educationLevel: 'UNDERGRADUATE',
      course: 'B.Tech',
      currentYear: 1,
      class10Percentage: 92.0,
      class12Percentage: 89.0,
      cgpa: 8.9,
      annualIncome: 1600000, // ₹16 Lakhs
      domicileState: 'Delhi',
      category: 'GENERAL',
      gender: 'MALE',
      hasDisability: false,
      isMinority: false
    }
  }
];

export function runAllProfileTests() {
  console.log('=============================================================================');
  console.log('SCHOLAR AI — DETERMINISTIC KNOWLEDGE BASE & RULE ENGINE TEST SUITE');
  console.log('=============================================================================\n');

  TEST_PROFILES.forEach((testCase) => {
    console.log(`\n=============================================================================`);
    console.log(`[TEST CASE] ${testCase.title}`);
    console.log(`Profile: ${testCase.profile.fullName} | Level: ${testCase.profile.educationLevel} | Income: ₹${testCase.profile.annualIncome.toLocaleString('en-IN')} | State: ${testCase.profile.domicileState} | Category: ${testCase.profile.category}`);
    console.log(`-----------------------------------------------------------------------------`);

    const evaluated = evaluateAllScholarships(testCase.profile, OFFICIAL_SCHOLARSHIP_DATABASE);
    const ranked = rankRecommendations(evaluated, testCase.profile);

    console.log(`\n✅ ELIGIBLE SCHEMES (${evaluated.eligible.length}):`);
    if (evaluated.eligible.length === 0) {
      console.log('  (No schemes fully qualified)');
    } else {
      ranked.rankedEligible.forEach((r, idx) => {
        console.log(`  ${idx + 1}. [${r.matchScore}% Match | Rank Score: ${r.recommendationScore}] ${r.scholarship.name}`);
        console.log(`     Provider: ${r.scholarship.provider}`);
        console.log(`     Amount: ${r.scholarship.amount_display} | Deadline: ${r.scholarship.application_deadline} (${r.deadlineStatus})`);
        console.log(`     Reason: ${r.explanation}`);
      });
    }

    console.log(`\n⚠️ POSSIBLE MATCHES / NEEDS VERIFICATION (${evaluated.possible.length}):`);
    if (evaluated.possible.length === 0) {
      console.log('  (None)');
    } else {
      ranked.rankedPossible.forEach((r, idx) => {
        console.log(`  ${idx + 1}. [${r.matchScore}% Match] ${r.scholarship.name}`);
        console.log(`     Reason: ${r.explanation}`);
      });
    }

    console.log(`\n❌ NOT ELIGIBLE SCHEMES (${evaluated.ineligible.length}):`);
    evaluated.ineligible.slice(0, 4).forEach((r, idx) => {
      console.log(`  ${idx + 1}. ${r.scholarship.name}`);
      console.log(`     Failed Vector(s): ${r.failedCriteria.join(' | ')}`);
    });
    if (evaluated.ineligible.length > 4) {
      console.log(`  ... and ${evaluated.ineligible.length - 4} other non-matching schemes.`);
    }
  });
}
