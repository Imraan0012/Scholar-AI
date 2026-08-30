// =============================================================================
// SCHOLAR AI — CORE SCHOLARSHIP DATA SCHEMA & ENTITY DEFINITIONS
// Represents the machine-readable data contract for all scholarships,
// sources, institutions, verification audit trails, and deterministic rules.
// =============================================================================

export const VERIFICATION_STATUSES = {
  DRAFT: 'DRAFT',
  DISCOVERED: 'DISCOVERED',
  PENDING_REVIEW: 'PENDING_REVIEW',
  VERIFIED: 'VERIFIED',
  PUBLISHED: 'PUBLISHED',
  EXPIRED: 'EXPIRED',
  REJECTED: 'REJECTED',
  ARCHIVED: 'ARCHIVED'
};

export const SOURCE_RELIABILITY_TIERS = {
  LEVEL_1_OFFICIAL_GOVT: {
    tier: 1,
    label: 'Official Government / Apex Body',
    badge: '✓ Level 1 Official Govt',
    color: 'emerald',
    trustScore: 1.0
  },
  LEVEL_2_OFFICIAL_PORTAL: {
    tier: 2,
    label: 'Official State / University Portal',
    badge: '✓ Level 2 Official Portal',
    color: 'blue',
    trustScore: 0.95
  },
  LEVEL_3_TRUSTED_AGGREGATOR: {
    tier: 3,
    label: 'Verified CSR / Trusted Aggregator',
    badge: 'Level 3 Trusted CSR',
    color: 'indigo',
    trustScore: 0.8
  },
  LEVEL_4_SECONDARY: {
    tier: 4,
    label: 'Secondary Discovery Source',
    badge: 'Level 4 Secondary',
    color: 'amber',
    trustScore: 0.6
  }
};

export const PROVIDER_TYPES = {
  CENTRAL_GOVERNMENT: 'CENTRAL_GOVERNMENT',
  STATE_GOVERNMENT: 'STATE_GOVERNMENT',
  UNION_TERRITORY: 'UNION_TERRITORY',
  UGC_AICTE_APEX: 'UGC_AICTE_APEX',
  UNIVERSITY_INSTITUTION: 'UNIVERSITY_INSTITUTION',
  CORPORATE_CSR: 'CORPORATE_CSR',
  FOUNDATION_TRUST: 'FOUNDATION_TRUST',
  NGO_PHILANTHROPY: 'NGO_PHILANTHROPY'
};

export const ELIGIBILITY_RESULT_STATUSES = {
  ELIGIBLE: 'ELIGIBLE',
  POSSIBLE: 'POSSIBLE',
  NOT_ELIGIBLE: 'NOT_ELIGIBLE',
  DOCUMENTS_MISSING: 'DOCUMENTS_MISSING',
  MISSING_INFORMATION: 'MISSING_INFORMATION',
  EXPIRED: 'EXPIRED',
  INACTIVE: 'INACTIVE'
};

/**
 * Validates a scholarship record against the core schema.
 * Ensures no fabricated records or broken mandatory metadata.
 */
export function validateScholarshipRecord(record) {
  const errors = [];

  if (!record.id || typeof record.id !== 'string') {
    errors.push('Missing unique alphanumeric scholarship id');
  }
  if (!record.name && !record.scholarshipName) {
    errors.push('Missing scholarship name / title');
  }
  if (!record.provider && !record.providerName) {
    errors.push('Missing provider name');
  }
  if (!record.official_website_url && !record.officialWebsiteUrl && !record.sourceUrl) {
    errors.push('Missing verifiable official website or source URL');
  }
  if (!record.rules || (!Array.isArray(record.rules) && typeof record.rules !== 'object')) {
    errors.push('Missing structured eligibility rules array/object');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
