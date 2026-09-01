import { getScholarshipDeadlineDisplay, formatCalendarDate, calculateDeadlineStatus } from '../src/engine/eligibilityEngine.js';
import { normalizeScholarship } from '../src/services/scholarshipService.js';
import { MASTER_SCHOLARSHIP_REGISTRY } from '../src/data/scholarships/index.js';

function runDeadlineLifecycleTestSuite() {
  console.log('=============================================================================');
  console.log('SCHOLAR AI — DEADLINE LIFECYCLE & DISPLAY TEST SUITE');
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

  // ── TEST 1: Date formatting utility ───────────────────────────────────────────
  console.log('\n--- 1. DATE FORMATTING WITHOUT TIMEZONE DAY-SHIFT ---');
  assert(formatCalendarDate('2026-09-30') === '30 Sep 2026', '2026-09-30 formatted as "30 Sep 2026"');
  assert(formatCalendarDate('2026-10-15') === '15 Oct 2026', '2026-10-15 formatted as "15 Oct 2026"');
  assert(formatCalendarDate('2026-01-05') === '5 Jan 2026', '2026-01-05 formatted as "5 Jan 2026"');

  // ── TEST 2: Verified Future Deadline ───────────────────────────────────────────
  console.log('\n--- 2. VERIFIED FUTURE DEADLINE ---');
  const schVerified = {
    id: 'test-sch-verified',
    applicationDeadline: '2026-11-30',
    status: 'OPEN'
  };
  const d1 = getScholarshipDeadlineDisplay(schVerified);
  assert(d1.primaryText === '30 Nov 2026', 'Primary text displays exact formatted date');
  assert(d1.isClosed === false, 'isClosed is false for open verified scheme');

  // ── TEST 3: Null / Unknown Deadline Fallback ──────────────────────────────────
  console.log('\n--- 3. NULL / UNKNOWN DEADLINE ---');
  const schNull = {
    id: 'test-sch-null',
    applicationDeadline: null,
    status: 'OPEN'
  };
  const d2 = getScholarshipDeadlineDisplay(schNull);
  assert(d2.primaryText === 'Check Official Portal', 'Displays "Check Official Portal" rather than "Refer Official Portal"');
  assert(!d2.primaryText.includes('Refer Official Portal'), 'Does not contain deprecated "Refer Official Portal" string');

  // ── TEST 4: Extended Deadline ──────────────────────────────────────────────────
  console.log('\n--- 4. EXTENDED DEADLINE ---');
  const schExtended = {
    id: 'test-sch-extended',
    applicationDeadline: '2026-10-15',
    isDeadlineExtended: true,
    status: 'OPEN'
  };
  const d3 = getScholarshipDeadlineDisplay(schExtended);
  assert(d3.primaryText === '15 Oct 2026', 'Displays latest extended deadline date');
  assert(d3.badge === 'Extended', 'Badge indicates "Extended"');
  assert(d3.badgeType === 'info', 'Extended badge has info styling');

  // ── TEST 5: Closing Soon ───────────────────────────────────────────────────────
  console.log('\n--- 5. CLOSING SOON ---');
  const schClosingSoon = {
    id: 'test-sch-closing-soon',
    applicationDeadline: '2026-09-30',
    status: 'CLOSING_SOON'
  };
  const d4 = getScholarshipDeadlineDisplay(schClosingSoon);
  assert(d4.badge === 'Closing Soon', 'Badge indicates "Closing Soon"');
  assert(d4.badgeType === 'warning', 'Closing Soon has warning styling');

  // ── TEST 6: Closed Scholarships ───────────────────────────────────────────────
  console.log('\n--- 6. CLOSED SCHOLARSHIPS ---');
  const schClosed = {
    id: 'test-sch-closed',
    applicationDeadline: '2026-08-15',
    status: 'CLOSED'
  };
  const d5 = getScholarshipDeadlineDisplay(schClosed);
  assert(d5.primaryText === 'Closed on 15 Aug 2026', 'Displays closed date info');
  assert(d5.isClosed === true, 'isClosed is true for closed scheme');
  assert(d5.badge === 'Closed', 'Badge indicates "Closed"');

  // ── TEST 7: Upcoming Scholarships ─────────────────────────────────────────────
  console.log('\n--- 7. UPCOMING SCHOLARSHIPS ---');
  const schUpcoming = {
    id: 'test-sch-upcoming',
    applicationOpenDate: '2026-10-15',
    status: 'UPCOMING'
  };
  const d6 = getScholarshipDeadlineDisplay(schUpcoming);
  assert(d6.primaryText === 'Opens 15 Oct 2026', 'Displays opening date for upcoming scholarship');

  // ── TEST 8: Year-Round Scholarships ───────────────────────────────────────────
  console.log('\n--- 8. YEAR-ROUND SCHOLARSHIPS ---');
  const schYearRound = {
    id: 'test-sch-year-round',
    status: 'YEAR_ROUND'
  };
  const d7 = getScholarshipDeadlineDisplay(schYearRound);
  assert(d7.primaryText === 'Applications Open Year-Round', 'Displays "Applications Open Year-Round"');
  assert(d7.isYearRound === true, 'isYearRound flag is true');

  // ── TEST 9: DTO & Normalization Compatibility ─────────────────────────────────
  console.log('\n--- 9. SCHOLARSHIP SERVICE NORMALIZATION OF DEADLINE FIELDS ---');
  const backendMock1 = {
    id: 'backend-test-1',
    name: 'Backend Test Scheme',
    applicationDeadline: '2026-12-31',
    applicationOpenDate: '2026-08-01',
    isDeadlineExtended: true,
    status: 'OPEN'
  };
  const norm1 = normalizeScholarship(backendMock1);
  assert(norm1.application_deadline === '2026-12-31', 'Normalized snake_case application_deadline');
  assert(norm1.applicationDeadline === '2026-12-31', 'Preserved camelCase applicationDeadline');
  assert(norm1.is_deadline_extended === true, 'Normalized snake_case is_deadline_extended');
  assert(norm1.isDeadlineExtended === true, 'Preserved camelCase isDeadlineExtended');

  // ── TEST 10: Master Catalog Deadline Audit ─────────────────────────────────────
  console.log('\n--- 10. CURRENT MASTER REGISTRY DEADLINE AUDIT ---');
  let verifiedCount = 0;
  let unknownCount = 0;
  let closedCount = 0;
  let upcomingCount = 0;
  let yearRoundCount = 0;

  MASTER_SCHOLARSHIP_REGISTRY.forEach(s => {
    const info = getScholarshipDeadlineDisplay(s);
    if (info.status === 'CLOSED') closedCount++;
    else if (info.status === 'UPCOMING') upcomingCount++;
    else if (info.status === 'YEAR_ROUND') yearRoundCount++;
    else if (s.application_deadline || s.applicationDeadline) verifiedCount++;
    else unknownCount++;
  });

  console.log(`Catalog Total: ${MASTER_SCHOLARSHIP_REGISTRY.length}`);
  console.log(`With Verified Deadline: ${verifiedCount}`);
  console.log(`With Unknown Deadline: ${unknownCount}`);
  console.log(`Closed: ${closedCount}`);
  console.log(`Upcoming: ${upcomingCount}`);
  console.log(`Year-Round: ${yearRoundCount}`);

  assert(MASTER_SCHOLARSHIP_REGISTRY.length > 0, 'Catalog has scholarships');

  console.log('\n=============================================================================');
  console.log(`DEADLINE LIFECYCLE TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('=============================================================================');

  if (failed > 0) process.exit(1);
}

runDeadlineLifecycleTestSuite();
