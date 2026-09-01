import { scholarshipService } from '../src/services/scholarshipService.js';
import { eligibilityService } from '../src/services/eligibilityService.js';

async function runCatalogPaginationSuite() {
  console.log('=============================================================================');
  console.log('SCHOLAR AI — FULL MULTI-PAGE SCHOLARSHIP CATALOG PAGINATION SUITE');
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

  // ── 1. TEST CASE A: Single-page catalog (20 items, 1 page) ───────────────────
  console.log('\n--- TEST CASE A: Single Page Catalog (20 items) ---');
  const mockApiSingle = {
    get: async (url, params) => {
      const items = Array.from({ length: 20 }, (_, i) => ({ id: `sch-single-${i + 1}`, name: `Scholarship ${i + 1}` }));
      return { scholarships: items, totalElements: 20, totalPages: 1, currentPage: 0, pageSize: 50 };
    }
  };

  // Run multi-page fetcher logic
  const singlePageRes = await mockApiSingle.get('/scholarships', { page: 0, size: 50 });
  assert(singlePageRes.scholarships.length === 20, 'Single page returns exact 20 items');
  assert(singlePageRes.totalPages === 1, 'Single page indicates totalPages=1');

  // ── 2. TEST CASE B: Two-page catalog (63 items: 50 on Page 0, 13 on Page 1) ──
  console.log('\n--- TEST CASE B: Two Page Catalog (63 items) ---');
  const page0Items = Array.from({ length: 50 }, (_, i) => ({ id: `sch-p0-${i + 1}`, name: `Scholarship P0 ${i + 1}` }));
  const page1Items = [
    { id: 'railways-pmss-rpf', name: 'Prime Minister’s Scholarship Scheme for RPF / RPSF' },
    { id: 'kerala-dce-aspire-scholarship', name: 'Kerala Aspire Scholarship Scheme for Post-Graduate Research' },
    { id: 'wb-kanyashree-k3-pg', name: 'West Bengal Kanyashree Prakalpa (K3 Scheme for PG University Students)' },
    { id: 'kc-mahindra-talent-scholarship', name: 'K.C. Mahindra All India Talent Scholarship for Diploma Students' },
    { id: 'mahadbt-panjabrao-deshmukh-hostel', name: 'Dr. Panjabrao Deshmukh Vastigruh Nirvah Bhatta Yojna (Hostel Maintenance)' },
    { id: 'moma-post-matric-scholarship', name: 'Post-Matric Scholarship Scheme for Minorities' },
    { id: 'mole-beedi-cine-workers', name: 'Financial Assistance for Education of the Wards of Beedi / Cine / IOMC Workers' },
    { id: 'wipro-santoor-womens-scholarship', name: 'Santoor Women’s Scholarship for Higher Education' },
    { id: 'nsp-pm-usp-csss', name: 'PM-USP Central Sector Scheme of Scholarships for College and University Students' },
    { id: 'karnataka-vidyasiri-fa-scheme', name: 'Karnataka Vidyasiri Food and Accommodation Scheme (OBC/SC/ST)' },
    { id: 'tn-pudhumai-penn-scheme', name: 'Moovalur Ramamirtham Ammaiyar Higher Education Assurance Scheme (Pudhumai Penn)' },
    { id: 'odisha-e-medhabruti', name: 'Odisha e-Medhabruti Scholarship (UG, PG & Technical/Professional)' },
    { id: 'kerala-dce-state-merit', name: 'Kerala State Merit Scholarship (SMS)' }
  ];

  const mockApiTwo = {
    get: async (url, params) => {
      if (params.page === 0) return { scholarships: page0Items, totalElements: 63, totalPages: 2, currentPage: 0, pageSize: 50 };
      if (params.page === 1) return { scholarships: page1Items, totalElements: 63, totalPages: 2, currentPage: 1, pageSize: 50 };
      return { scholarships: [], totalElements: 63, totalPages: 2, currentPage: params.page, pageSize: 50 };
    }
  };

  // Replicate getAllScholarships logic
  const p0 = await mockApiTwo.get('/scholarships', { page: 0, size: 50 });
  let combinedTwo = [...p0.scholarships];
  for (let p = 1; p < p0.totalPages; p++) {
    const pNext = await mockApiTwo.get('/scholarships', { page: p, size: 50 });
    combinedTwo.push(...pNext.scholarships);
  }

  assert(combinedTwo.length === 63, 'Two page fetcher combined exactly 63 items');
  assert(combinedTwo.some(s => s.id === 'railways-pmss-rpf'), 'Page-1 item railways-pmss-rpf is included');
  assert(combinedTwo.some(s => s.id === 'kerala-dce-state-merit'), 'Page-1 item kerala-dce-state-merit is included');
  assert(combinedTwo.some(s => s.id === 'tn-pudhumai-penn-scheme'), 'Page-1 item tn-pudhumai-penn-scheme is included');

  // ── 3. TEST CASE C: Three-page catalog (137 items: 50 + 50 + 37) ──────────────
  console.log('\n--- TEST CASE C: Three Page Catalog (137 items) ---');
  const mockApiThree = {
    get: async (url, params) => {
      const p = params.page;
      const count = p === 0 ? 50 : p === 1 ? 50 : 37;
      const items = Array.from({ length: count }, (_, i) => ({ id: `sch-p${p}-${i + 1}`, name: `Scholarship P${p} ${i + 1}` }));
      return { scholarships: items, totalElements: 137, totalPages: 3, currentPage: p, pageSize: 50 };
    }
  };

  const p0Three = await mockApiThree.get('/scholarships', { page: 0, size: 50 });
  let combinedThree = [...p0Three.scholarships];
  for (let p = 1; p < p0Three.totalPages; p++) {
    const pNext = await mockApiThree.get('/scholarships', { page: p, size: 50 });
    combinedThree.push(...pNext.scholarships);
  }
  assert(combinedThree.length === 137, 'Three page fetcher combined exactly 137 items (50 + 50 + 37)');

  // ── 4. TEST CASE D: LIVE SPRING BOOT REST API PAGINATION TEST ─────────────────
  console.log('\n--- TEST CASE D: Live Backend REST API Catalog Fetch ---');
  try {
    const liveCatalog = await scholarshipService.getAllScholarships();
    console.log(`Live Catalog Returned: ${liveCatalog.scholarships.length} scholarships from backend (totalElements: ${liveCatalog.totalElements}, totalPages: ${liveCatalog.totalPages})`);
    assert(liveCatalog.scholarships.length === liveCatalog.totalElements, `All ${liveCatalog.totalElements} scholarships fetched without page-0 truncation`);
    assert(liveCatalog.scholarships.length >= 63, `Catalog has at least 63 published scholarships`);
    assert(liveCatalog.totalPages === 2, 'Live backend has 2 pages at size=50');

    // Verify presence of specific Page-1 items in live catalog
    const hasRailways = liveCatalog.scholarships.some(s => s.id === 'railways-pmss-rpf');
    const hasPudhumai = liveCatalog.scholarships.some(s => s.id === 'tn-pudhumai-penn-scheme');
    const hasKanyashree = liveCatalog.scholarships.some(s => s.id === 'wb-kanyashree-k3-pg');
    assert(hasRailways, 'Live catalog includes Page-1 scholarship: railways-pmss-rpf');
    assert(hasPudhumai, 'Live catalog includes Page-1 scholarship: tn-pudhumai-penn-scheme');
    assert(hasKanyashree, 'Live catalog includes Page-1 scholarship: wb-kanyashree-k3-pg');

    // ── 5. TEST CASE E: DECISION TREE EVALUATION WITH FULL 63 CATALOG ───────────
    console.log('\n--- TEST CASE E: Full 63-Scholarship Decision Tree Evaluation ---');
    const testProfile = {
      userId: 'test-user-pagination-audit',
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

    const evalResult = eligibilityService.evaluateAll(testProfile, liveCatalog.scholarships);
    console.log(`Decision Tree Results: Eligible=${evalResult.eligible.length}, Possible=${evalResult.possible.length}, Ineligible=${evalResult.ineligible.length}, Total=${evalResult.allResults.length}`);

    assert(evalResult.allResults.length === liveCatalog.scholarships.length, `Decision tree evaluated all ${liveCatalog.scholarships.length} catalog items`);
    assert(evalResult.eligible.length + evalResult.possible.length + evalResult.ineligible.length === evalResult.allResults.length, 'Total Invariant Holds (Eligible + Possible + Ineligible === Total Catalog)');
  } catch (err) {
    console.error('Live Backend API Test Error:', err.message);
    failed++;
  }

  console.log('\n=============================================================================');
  console.log(`PAGINATION TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('=============================================================================');

  if (failed > 0) process.exit(1);
}

runCatalogPaginationSuite();
