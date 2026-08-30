// =============================================================================
// SCHOLAR AI — DETERMINISTIC ELIGIBILITY SERVICE (SPRING BOOT REST INTEGRATION)
// =============================================================================

import { apiClient } from './apiClient';
import { evaluateAllScholarships } from '../engine/eligibilityEngine';
import { normalizeScholarship } from './scholarshipService';

function normalizeResult(r) {
  if (!r) return r;
  const sch = normalizeScholarship(r.scholarship);
  return {
    ...r,
    scholarship: sch,
    scholarshipId: r.scholarshipId || sch?.id,
    scholarshipName: r.scholarshipName || sch?.name,
    isEligible: r.isEligible !== undefined ? r.isEligible : (r.evaluationStatus === 'ELIGIBLE'),
    tier: r.tier || (r.evaluationStatus === 'ELIGIBLE' ? 'STRONG_MATCH' : (r.evaluationStatus === 'POSSIBLE_MATCH' ? 'POSSIBLE_MATCH' : 'INELIGIBLE')),
    matchScore: r.matchScore !== undefined ? r.matchScore : 50,
    matchedCriteria: r.matchedCriteria || [],
    failedCriteria: r.failedCriteria || [],
    missingInformation: r.missingInformation || [],
    requiredDocuments: r.requiredDocuments || sch?.required_documents || []
  };
}

export const eligibilityService = {
  /**
   * Fetches deterministic eligibility evaluations from Spring Boot backend.
   */
  async getEvaluations() {
    try {
      const data = await apiClient.get('/eligibility/results');
      if (data && data.allResults && Array.isArray(data.allResults)) {
        const allResults = data.allResults.map(normalizeResult);
        const eligible = allResults.filter(r => r.evaluationStatus === 'ELIGIBLE');
        const possible = allResults.filter(r => r.evaluationStatus === 'POSSIBLE_MATCH');
        const ineligible = allResults.filter(r => r.evaluationStatus === 'NOT_ELIGIBLE');

        return {
          allResults,
          eligible,
          possible,
          ineligible,
          strongMatches: eligible.filter(r => r.tier === 'STRONG_MATCH'),
          goodMatches: eligible.filter(r => r.tier === 'GOOD_MATCH'),
          possibleMatches: possible,
          summary: data.summary || {
            eligibleCount: eligible.length,
            possibleCount: possible.length,
            ineligibleCount: ineligible.length,
            totalCount: allResults.length
          }
        };
      }
    } catch (err) {
      console.warn('[EligibilityService] Backend evaluation fetch error:', err.message);
    }
    return null;
  },

  /**
   * Local evaluation fallback when offline or during initial state before auth.
   */
  evaluateAll(profile, scholarships) {
    const normScholarships = (scholarships || []).map(normalizeScholarship);
    const res = evaluateAllScholarships(profile, normScholarships);
    return {
      allResults: (res.allResults || []).map(normalizeResult),
      eligible: (res.eligible || []).map(normalizeResult),
      possible: (res.possible || []).map(normalizeResult),
      ineligible: (res.ineligible || []).map(normalizeResult),
      strongMatches: (res.strongMatches || []).map(normalizeResult),
      goodMatches: (res.goodMatches || []).map(normalizeResult),
      possibleMatches: (res.possibleMatches || []).map(normalizeResult),
      summary: res.summary || {
        eligibleCount: (res.eligible || []).length,
        possibleCount: (res.possible || []).length,
        ineligibleCount: (res.ineligible || []).length,
        totalCount: (res.allResults || []).length
      }
    };
  }
};
