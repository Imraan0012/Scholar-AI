// =============================================================================
// SCHOLAR AI — DETERMINISTIC ELIGIBILITY SERVICE (SPRING BOOT REST INTEGRATION)
// =============================================================================

import { apiClient } from './apiClient.js';
import { evaluateAllScholarships } from '../engine/eligibilityEngine.js';
import { normalizeScholarship } from './scholarshipService.js';

function normalizeResult(r) {
  if (!r) return r;
  const sch = normalizeScholarship(r.scholarship);
  const isElig = r.isEligible !== undefined ? r.isEligible : (r.eligible !== undefined ? r.eligible : (r.evaluationStatus === 'ELIGIBLE'));
  const tier = r.tier || (isElig ? 'STRONG_MATCH' : (r.evaluationStatus === 'POSSIBLE_MATCH' ? 'POSSIBLE_MATCH' : 'INELIGIBLE'));
  return {
    ...r,
    scholarship: sch,
    scholarshipId: r.scholarshipId || sch?.id,
    scholarshipName: r.scholarshipName || sch?.name,
    isEligible: isElig,
    eligible: isElig,
    evaluationStatus: r.evaluationStatus || (isElig ? 'ELIGIBLE' : (tier === 'POSSIBLE_MATCH' ? 'POSSIBLE_MATCH' : 'NOT_ELIGIBLE')),
    tier,
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
    const data = await apiClient.get('/eligibility/results');

    // Support all standard Spring Boot / ApiResponse wrapper result structures
    const rawList = Array.isArray(data)
      ? data
      : (Array.isArray(data?.allResults)
        ? data.allResults
        : (Array.isArray(data?.results)
          ? data.results
          : (Array.isArray(data?.evaluations)
            ? data.evaluations
            : null)));

    if (!rawList) {
      console.warn('[EligibilityService] Unexpected backend evaluation response shape:', data);
      throw new Error('Eligibility response did not contain expected results array');
    }

    const allResults = rawList.map(normalizeResult);
    const eligible = allResults.filter(r => r.isEligible || r.evaluationStatus === 'ELIGIBLE');
    const possible = allResults.filter(r => !r.isEligible && (r.evaluationStatus === 'POSSIBLE_MATCH' || r.tier === 'POSSIBLE_MATCH'));
    const ineligible = allResults.filter(r => !r.isEligible && r.evaluationStatus !== 'POSSIBLE_MATCH' && r.tier !== 'POSSIBLE_MATCH');

    return {
      allResults,
      eligible,
      possible,
      ineligible,
      strongMatches: eligible.filter(r => r.tier === 'STRONG_MATCH' || (!r.tier && (r.matchScore || 0) >= 80)),
      goodMatches: eligible.filter(r => r.tier === 'GOOD_MATCH' || (!r.tier && (r.matchScore || 0) < 80)),
      possibleMatches: possible,
      summary: data?.summary || {
        eligibleCount: eligible.length,
        possibleCount: possible.length,
        ineligibleCount: ineligible.length,
        totalCount: allResults.length
      }
    };
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
