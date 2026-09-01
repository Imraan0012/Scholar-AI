import { MASTER_SCHOLARSHIP_REGISTRY } from '../src/data/scholarships/index.js';
import { evaluateAllScholarships } from '../src/engine/eligibilityEngine.js';
import { normalizeScholarship } from '../src/services/scholarshipService.js';

console.log('MASTER_SCHOLARSHIP_REGISTRY length:', MASTER_SCHOLARSHIP_REGISTRY.length);

const testProfile = {
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
  isOnboarded: true
};

const norm = MASTER_SCHOLARSHIP_REGISTRY.map(normalizeScholarship);
const results = evaluateAllScholarships(testProfile, norm);

console.log('Evaluated results count:', results.allResults.length);
console.log('Eligible count:', (results.eligible || []).length);
console.log('Possible count:', (results.possible || []).length);
console.log('Ineligible count:', (results.ineligible || []).length);
console.log('Strong matches count:', (results.strongMatches || []).length);
console.log('Good matches count:', (results.goodMatches || []).length);
