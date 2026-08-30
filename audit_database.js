// =============================================================================
// SCHOLAR AI — DATABASE AUDIT SCRIPT
// Audits current records and inspects distribution across ministries, levels & states.
// =============================================================================

import { OFFICIAL_SCHOLARSHIP_DATABASE } from './src/data/scholarshipDatabase.js';

export function auditCurrentDatabase() {
  const total = OFFICIAL_SCHOLARSHIP_DATABASE.length;
  const central = OFFICIAL_SCHOLARSHIP_DATABASE.filter(s => s.government_level === 'CENTRAL').length;
  const state = OFFICIAL_SCHOLARSHIP_DATABASE.filter(s => s.government_level === 'STATE').length;
  const ut = OFFICIAL_SCHOLARSHIP_DATABASE.filter(s => s.government_level === 'UNION_TERRITORY').length;
  const privateTrusts = OFFICIAL_SCHOLARSHIP_DATABASE.filter(s => s.government_level === 'PRIVATE').length;

  const academicYears = [...new Set(OFFICIAL_SCHOLARSHIP_DATABASE.map(s => s.academic_year))];

  const byState = {};
  OFFICIAL_SCHOLARSHIP_DATABASE.forEach(s => {
    byState[s.state] = (byState[s.state] || 0) + 1;
  });

  const bySource = {};
  OFFICIAL_SCHOLARSHIP_DATABASE.forEach(s => {
    bySource[s.source_reliability || 'UNSPECIFIED'] = (bySource[s.source_reliability || 'UNSPECIFIED'] || 0) + 1;
  });

  const byMinistry = {};
  OFFICIAL_SCHOLARSHIP_DATABASE.forEach(s => {
    const min = s.ministry_or_department || s.provider;
    byMinistry[min] = (byMinistry[min] || 0) + 1;
  });

  console.log('=============================================================================');
  console.log('SCHOLAR AI — DATABASE AUDIT REPORT');
  console.log('=============================================================================');
  console.log(`Total Verified Scholarship Records: ${total}`);
  console.log(`Academic Years Covered: ${academicYears.join(', ')}`);
  console.log(`Central Government Schemes: ${central}`);
  console.log(`State Government Schemes: ${state}`);
  console.log(`Union Territory Schemes: ${ut}`);
  console.log(`Premier Corporate / CSR Trusts: ${privateTrusts}`);
  console.log('\n--- Distribution by State/Region ---');
  console.log(JSON.stringify(byState, null, 2));
  console.log('\n--- Sources & Ministries ---');
  console.log(JSON.stringify(byMinistry, null, 2));
  console.log('=============================================================================');
}

auditCurrentDatabase();
