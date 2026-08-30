// =============================================================================
// SCHOLAR AI — MASTER VERIFIED SCHOLARSHIP KNOWLEDGE REGISTRY
// Aggregates verified official schemes across Central Ministries, UGC/AICTE/DST,
// State Governments (South, West, Central, North, East, North-East), and Premier Trusts.
// Academic Year: 2026-27 | Official Verified Records
// =============================================================================

import { CENTRAL_GOVT_SCHOLARSHIPS } from './centralMinistries.js';
import { UGC_AICTE_DST_SCHOLARSHIPS } from './ugcAicteDst.js';
import { SOUTH_INDIA_STATE_SCHOLARSHIPS } from './stateScholarshipsSouth.js';
import { WEST_CENTRAL_STATE_SCHOLARSHIPS } from './stateScholarshipsWestCentral.js';
import { NORTH_INDIA_STATE_SCHOLARSHIPS } from './stateScholarshipsNorth.js';
import { EAST_NORTHEAST_STATE_SCHOLARSHIPS } from './stateScholarshipsEastNorthEast.js';
import { CORPORATE_TRUST_SCHOLARSHIPS } from './corporateTrusts.js';
import { INSTITUTIONAL_SCHOLARSHIPS } from './institutionalScholarships.js';
import { deduplicateScholarships } from '../../services/deduplicationService.js';

// Master raw array of official verified scholarships
export const RAW_SCHOLARSHIP_REGISTRY = [
  ...CENTRAL_GOVT_SCHOLARSHIPS,
  ...UGC_AICTE_DST_SCHOLARSHIPS,
  ...SOUTH_INDIA_STATE_SCHOLARSHIPS,
  ...WEST_CENTRAL_STATE_SCHOLARSHIPS,
  ...NORTH_INDIA_STATE_SCHOLARSHIPS,
  ...EAST_NORTHEAST_STATE_SCHOLARSHIPS,
  ...CORPORATE_TRUST_SCHOLARSHIPS,
  ...INSTITUTIONAL_SCHOLARSHIPS
];

// Master unified and deduplicated array of official verified scholarships
export const MASTER_SCHOLARSHIP_REGISTRY = deduplicateScholarships(RAW_SCHOLARSHIP_REGISTRY);


// Utility: Filter active scholarships for current academic year
export const getActiveScholarshipsForYear = (academicYear = '2026-27') => {
  return MASTER_SCHOLARSHIP_REGISTRY.filter(
    (s) => s.verification_status === 'VERIFIED' && s.academic_year === academicYear
  );
};

// Utility: Get scholarships by education level
export const getScholarshipsByEducationLevel = (level) => {
  return MASTER_SCHOLARSHIP_REGISTRY.filter((s) =>
    s.rules.some((r) => r.field === 'education_level' && (r.value.includes(level) || r.value.includes('ANY')))
  );
};

// Utility: Get official verified URLs for a scholarship
export const getScholarshipUrls = (scholarship) => {
  if (!scholarship) return { applicationUrl: null, websiteUrl: null };

  const applicationUrl =
    scholarship.official_application_url ||
    scholarship.application_url ||
    scholarship.applicationUrl ||
    null;

  const websiteUrl =
    scholarship.official_website_url ||
    scholarship.officialWebsiteUrl ||
    scholarship.website_url ||
    scholarship.portal_url ||
    null;

  return { applicationUrl, websiteUrl };
};

