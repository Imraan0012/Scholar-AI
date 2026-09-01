// Human-Friendly AI Explanation & Synthesis Layer
// Synthesizes deterministic rule engine evaluation into natural, encouraging explanations.

export function generateEligibilityExplanation(result = {}, studentProfile = {}) {
  const {
    isEligible = false,
    scholarship = {},
    evaluations = [],
    conflictDetected = false,
    conflictReason = '',
    missingDocuments = []
  } = result || {};

  const safeEvals = Array.isArray(evaluations) ? evaluations : [];
  const safeMissingDocs = Array.isArray(missingDocuments) ? missingDocuments : [];
  const schName = scholarship?.name || 'this scholarship';
  const annualIncome = studentProfile?.annualFamilyIncome || studentProfile?.annualIncome || 0;
  const category = studentProfile?.category || 'General';
  const domicile = studentProfile?.domicileState || 'All India';

  if (conflictDetected) {
    return {
      statusTitle: 'Potential Scholarship Conflict Detected',
      summary: conflictReason || 'Multiple simultaneous scheme conflict detected.',
      passedPoints: safeEvals.filter(e => e?.passed).map(e => e?.details || e?.description || 'Requirement met'),
      actionableAdvice: 'Check if your existing award allows corporate top-up grants, or wait until the current tenure finishes before renewing.'
    };
  }

  if (isEligible) {
    const passedDetails = safeEvals.map(e => e?.details || e?.description || 'Requirement met');
    const docAdvice = safeMissingDocs.length > 0
      ? `You qualify factually! Ensure you have your ${safeMissingDocs.map(d => d.name || d.code || 'document').join(', ')} ready when applying on the official portal.`
      : 'All required document criteria are verified. Your profile is 100% application ready!';

    return {
      statusTitle: '100% Factually Qualified',
      summary: `Your profile meets all critical eligibility criteria for ${schName}. Your annual family income (₹${Number(annualIncome).toLocaleString('en-IN')}), academic score, social category (${category}), and state of residence (${domicile}) align perfectly with scheme guidelines.`,
      passedPoints: passedDetails,
      actionableAdvice: docAdvice
    };
  }

  // If Ineligible or Possible Match
  const failedRules = safeEvals.filter(e => !e?.passed);
  const passedRules = safeEvals.filter(e => e?.passed);

  return {
    statusTitle: 'Currently Ineligible',
    summary: `You do not meet ${failedRules.length} requirement${failedRules.length > 1 ? 's' : ''} for ${schName}.`,
    failedPoints: failedRules.map(e => e?.details || e?.description || 'Check criteria'),
    passedPoints: passedRules.map(e => e?.details || e?.description || 'Requirement met'),
    actionableAdvice: 'Explore alternative state/corporate schemes under your matched tier or update your profile if any academic or income fields were entered incorrectly.'
  };
}

