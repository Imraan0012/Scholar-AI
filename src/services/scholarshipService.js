// =============================================================================
// SCHOLAR AI — SCHOLARSHIP SERVICE (SPRING BOOT REST INTEGRATION)
// =============================================================================

import { apiClient } from './apiClient';
import { MASTER_SCHOLARSHIP_REGISTRY } from '../data/scholarships/index.js';

function parseJsonValue(val) {
  if (val === undefined || val === null) return val;
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if ((trimmed.startsWith('[') && trimmed.endsWith(']')) ||
        (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
        (trimmed.startsWith('"') && trimmed.endsWith('"'))) {
      try {
        return JSON.parse(trimmed);
      } catch (e) {
        return val;
      }
    }
  }
  return val;
}

export function normalizeScholarship(sch) {
  if (!sch) return sch;
  return {
    ...sch,
    id: sch.id,
    name: sch.name || '',
    provider: sch.provider || '',
    provider_type: sch.provider_type || sch.providerType || 'GOVERNMENT',
    providerType: sch.providerType || sch.provider_type || 'GOVERNMENT',
    government_level: sch.government_level || sch.governmentLevel || 'CENTRAL',
    governmentLevel: sch.governmentLevel || sch.government_level || 'CENTRAL',
    state: sch.state || 'ALL_INDIA',
    ministry_or_department: sch.ministry_or_department || sch.ministryOrDepartment || '',
    ministryOrDepartment: sch.ministryOrDepartment || sch.ministry_or_department || '',
    academic_year: sch.academic_year || sch.academicYear || '2026-27',
    academicYear: sch.academicYear || sch.academic_year || '2026-27',
    application_type: sch.application_type || sch.applicationType || 'FRESH_AND_RENEWAL',
    applicationType: sch.applicationType || sch.application_type || 'FRESH_AND_RENEWAL',
    description: sch.description || '',
    amount_display: sch.amount_display || sch.amountDisplay || 'Variable Grant',
    amountDisplay: sch.amountDisplay || sch.amount_display || 'Variable Grant',
    amount_min: sch.amount_min !== undefined ? sch.amount_min : (sch.amountMin !== undefined ? sch.amountMin : 0),
    amountMin: sch.amountMin !== undefined ? sch.amountMin : (sch.amount_min !== undefined ? sch.amount_min : 0),
    amount_max: sch.amount_max !== undefined ? sch.amount_max : (sch.amountMax !== undefined ? sch.amountMax : 0),
    amountMax: sch.amountMax !== undefined ? sch.amountMax : (sch.amount_max !== undefined ? sch.amount_max : 0),
    amount_type: sch.amount_type || sch.amountType || 'ANNUAL_GRANT',
    amountType: sch.amountType || sch.amount_type || 'ANNUAL_GRANT',
    official_website_url: sch.official_website_url || sch.officialWebsiteUrl || sch.website_url || '',
    officialWebsiteUrl: sch.officialWebsiteUrl || sch.official_website_url || sch.website_url || '',
    official_application_url: sch.official_application_url || sch.officialApplicationUrl || sch.application_url || '',
    officialApplicationUrl: sch.officialApplicationUrl || sch.official_application_url || sch.application_url || '',
    official_guideline_pdf_url: sch.official_guideline_pdf_url || sch.officialGuidelinePdfUrl || '',
    officialGuidelinePdfUrl: sch.officialGuidelinePdfUrl || sch.official_guideline_pdf_url || '',
    source_reliability: sch.source_reliability || sch.sourceReliability || 'LEVEL_1_OFFICIAL_GOVT',
    sourceReliability: sch.sourceReliability || sch.source_reliability || 'LEVEL_1_OFFICIAL_GOVT',
    verification_status: sch.verification_status || sch.verificationStatus || 'VERIFIED',
    verificationStatus: sch.verificationStatus || sch.verification_status || 'VERIFIED',
    rules: (sch.rules || []).map(r => ({
      field: r.conditionField || r.field,
      conditionField: r.conditionField || r.field,
      operator: r.operator || '==',
      value: parseJsonValue(r.valueJson !== undefined ? r.valueJson : r.value),
      valueJson: r.valueJson !== undefined ? r.valueJson : r.value,
      unit: r.unit || 'NONE',
      mandatory: r.isMandatory !== undefined ? r.isMandatory : (r.mandatory !== undefined ? r.mandatory : true),
      isMandatory: r.isMandatory !== undefined ? r.isMandatory : (r.mandatory !== undefined ? r.mandatory : true),
      description: r.ruleDescription || r.description || '',
      ruleDescription: r.ruleDescription || r.description || '',
      failureMessage: r.failureMessage || r.failure_message || ''
    })),
    required_documents: (sch.documents || sch.required_documents || []).map(d => ({
      code: d.documentCode || d.code || 'DOC',
      documentCode: d.documentCode || d.code || 'DOC',
      name: d.documentName || d.name || 'Official Document',
      documentName: d.documentName || d.name || 'Official Document',
      mandatory: d.isMandatory !== undefined ? d.isMandatory : (d.mandatory !== undefined ? d.mandatory : true),
      isMandatory: d.isMandatory !== undefined ? d.isMandatory : (d.mandatory !== undefined ? d.mandatory : true)
    })),
    documents: (sch.documents || sch.required_documents || []).map(d => ({
      code: d.documentCode || d.code || 'DOC',
      documentCode: d.documentCode || d.code || 'DOC',
      name: d.documentName || d.name || 'Official Document',
      documentName: d.documentName || d.name || 'Official Document',
      mandatory: d.isMandatory !== undefined ? d.isMandatory : (d.mandatory !== undefined ? d.mandatory : true),
      isMandatory: d.isMandatory !== undefined ? d.isMandatory : (d.mandatory !== undefined ? d.mandatory : true)
    }))
  };
}

export const scholarshipService = {
  /**
   * Fetches scholarships from Spring Boot REST API with search, filters, pagination.
   */
  async getScholarships({ search = '', sector = 'ALL', state = 'ALL', page = 0, size = 50, sort = 'BEST_MATCH' } = {}) {
    try {
      const data = await apiClient.get('/scholarships', {
        search,
        governmentLevel: sector,
        state,
        page,
        size,
        sort
      });

      if (data && data.scholarships && data.scholarships.length > 0) {
        const formatted = data.scholarships.map(normalizeScholarship);

        return {
          scholarships: formatted,
          totalCount: data.totalElements || formatted.length,
          fromBackend: true
        };
      }
    } catch (err) {
      console.warn('[ScholarshipService] Backend fetch failed, fallback to local registry:', err.message);
    }

    // Fallback
    let list = MASTER_SCHOLARSHIP_REGISTRY.map(normalizeScholarship);
    if (sector !== 'ALL') {
      list = list.filter(s => s.government_level === sector);
    }
    if (state !== 'ALL' && state !== 'ALL_INDIA') {
      list = list.filter(s => s.state === 'ALL_INDIA' || s.state?.toLowerCase() === state.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(s =>
        (s.name || '').toLowerCase().includes(q) ||
        (s.provider || '').toLowerCase().includes(q) ||
        (s.description || '').toLowerCase().includes(q)
      );
    }

    return {
      scholarships: list,
      totalCount: list.length,
      fromBackend: false
    };
  },

  async getScholarshipById(id) {
    try {
      const data = await apiClient.get(`/scholarships/${id}`);
      return normalizeScholarship(data);
    } catch (err) {
      const found = MASTER_SCHOLARSHIP_REGISTRY.find(s => s.id === id);
      return normalizeScholarship(found) || null;
    }
  },

  async getCount() {
    try {
      const data = await apiClient.get('/scholarships/count');
      return data?.count || MASTER_SCHOLARSHIP_REGISTRY.length;
    } catch (err) {
      return MASTER_SCHOLARSHIP_REGISTRY.length;
    }
  }
};
