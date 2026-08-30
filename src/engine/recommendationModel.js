// =============================================================================
// SCHOLAR AI — DECISION TREE / MULTI-CRITERIA RECOMMENDATION AI LAYER
// Ranks eligible & possible opportunities based on financial grant, urgency, and alignment.
// Does NOT override mandatory eligibility rules.
// =============================================================================

/**
 * Calculates a multi-vector recommendation priority score (0 to 100).
 */
export function calculateRecommendationPriority(evaluatedResult, profile) {
  const { scholarship, matchScore, isEligible, deadlineStatus } = evaluatedResult;
  let priorityScore = 0;

  // 1. Base Match Score Weight (40%)
  priorityScore += (matchScore * 0.40);

  // 2. Grant Amount Value Weight (25%)
  // Normalized up to ₹2,00,000 max scale
  const maxAmount = scholarship.amount_max || 50000;
  const financialScore = Math.min(100, (maxAmount / 200000) * 100);
  priorityScore += (financialScore * 0.25);

  // 3. Application Urgency Weight (20%)
  if (deadlineStatus === 'CLOSING_SOON') {
    priorityScore += 20; // High urgency bonus
  } else if (deadlineStatus === 'OPEN') {
    priorityScore += 15;
  } else if (deadlineStatus === 'YEAR_ROUND') {
    priorityScore += 10;
  } else {
    priorityScore += 0;
  }

  // 4. Domicile & Category Alignment Bonus (15%)
  const studentDomicile = (profile.domicileState || '').toLowerCase();
  const isStateSpecific = scholarship.government_level === 'STATE' && scholarship.state?.toLowerCase() === studentDomicile;
  if (isStateSpecific) {
    priorityScore += 15; // Home state bonus
  } else if (scholarship.government_level === 'CENTRAL') {
    priorityScore += 10;
  } else {
    priorityScore += 8;
  }

  return Math.round(priorityScore);
}

/**
 * Ranks all eligible and possible scholarships.
 */
export function rankRecommendations(evaluationResults, profile) {
  const { eligible, possible, ineligible } = evaluationResults;

  // Compute recommendation scores and rank
  const rankedEligible = eligible.map((item) => ({
    ...item,
    recommendationScore: calculateRecommendationPriority(item, profile)
  })).sort((a, b) => b.recommendationScore - a.recommendationScore);

  const rankedPossible = possible.map((item) => ({
    ...item,
    recommendationScore: calculateRecommendationPriority(item, profile)
  })).sort((a, b) => b.recommendationScore - a.recommendationScore);

  const allRanked = [
    ...rankedEligible,
    ...rankedPossible,
    ...ineligible.map((item) => ({ ...item, recommendationScore: 0 }))
  ];

  return {
    rankedEligible,
    rankedPossible,
    allRanked
  };
}
