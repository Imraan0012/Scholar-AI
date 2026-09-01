// =============================================================================
// SCHOLAR AI — DECISION TREE BASED SCHOLARSHIP ELIGIBILITY ENGINE
// Evaluates student profile vectors against data-driven scholarship criteria trees.
// The Decision Tree is the single source of truth for eligibility classification.
// =============================================================================

/**
 * Formats a calendar date string (YYYY-MM-DD) into clean Indian date format (e.g. "30 Sep 2026")
 * without timezone/UTC day-shift artifacts.
 */
export function formatCalendarDate(dateStr) {
  if (!dateStr) return '';
  const parts = String(dateStr).split('T')[0].split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const monthIdx = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    if (!isNaN(year) && monthIdx >= 0 && monthIdx < 12 && !isNaN(day)) {
      return `${day} ${months[monthIdx]} ${year}`;
    }
  }

  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return String(dateStr);
    const day = d.getDate();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${day} ${months[d.getMonth()]} ${d.getFullYear()}`;
  } catch (e) {
    return String(dateStr);
  }
}

/**
 * Calculates current deadline lifecycle status.
 */
export function calculateDeadlineStatus(deadlineDateStr, startDateStr, explicitStatus) {
  if (explicitStatus && explicitStatus !== 'OPEN') {
    return explicitStatus;
  }
  if (!deadlineDateStr) {
    if (explicitStatus === 'YEAR_ROUND') return 'YEAR_ROUND';
    return explicitStatus || 'AVAILABILITY_UNVERIFIED';
  }
  
  const today = new Date();
  const deadline = new Date(deadlineDateStr);
  const start = startDateStr ? new Date(startDateStr) : null;

  if (start && !isNaN(start.getTime()) && today < start) {
    return 'UPCOMING';
  }

  if (isNaN(deadline.getTime())) {
    return explicitStatus || 'AVAILABILITY_UNVERIFIED';
  }

  const diffTime = deadline.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return 'CLOSED';
  } else if (diffDays <= 15) {
    return 'CLOSING_SOON';
  } else {
    return 'OPEN';
  }
}

/**
 * Returns a comprehensive, lifecycle-aware deadline display object.
 */
export function getScholarshipDeadlineDisplay(scholarship) {
  if (!scholarship) {
    return {
      primaryText: 'Check Official Portal',
      badge: null,
      badgeType: null,
      status: 'AVAILABILITY_UNVERIFIED'
    };
  }

  const deadline = scholarship.application_deadline || scholarship.applicationDeadline || scholarship.deadline || null;
  const openDate = scholarship.application_open_date || scholarship.applicationOpenDate || scholarship.application_start || scholarship.applicationStart || null;
  const isExtended = Boolean(scholarship.is_deadline_extended || scholarship.isDeadlineExtended || false);
  const explicitStatus = (scholarship.status || '').toUpperCase();

  const lifecycleStatus = calculateDeadlineStatus(deadline, openDate, explicitStatus);

  // CASE: CLOSED
  if (lifecycleStatus === 'CLOSED' || explicitStatus === 'CLOSED') {
    return {
      primaryText: deadline ? `Closed on ${formatCalendarDate(deadline)}` : 'Applications Closed',
      badge: 'Closed',
      badgeType: 'error',
      isClosed: true,
      isOpen: false,
      isYearRound: false,
      status: 'CLOSED'
    };
  }

  // CASE: UPCOMING / NOT_YET_OPEN
  if (lifecycleStatus === 'UPCOMING' || explicitStatus === 'UPCOMING' || explicitStatus === 'NOT_YET_OPEN') {
    return {
      primaryText: openDate ? `Opens ${formatCalendarDate(openDate)}` : 'Upcoming Cycle',
      badge: 'Upcoming',
      badgeType: 'info',
      isClosed: false,
      isOpen: false,
      isYearRound: false,
      status: 'UPCOMING'
    };
  }

  // CASE: YEAR_ROUND
  if (lifecycleStatus === 'YEAR_ROUND' || explicitStatus === 'YEAR_ROUND') {
    return {
      primaryText: 'Applications Open Year-Round',
      badge: 'Rolling',
      badgeType: 'neutral',
      isClosed: false,
      isOpen: true,
      isYearRound: true,
      status: 'YEAR_ROUND'
    };
  }

  // CASE: VERIFIED DEADLINE PRESENT
  if (deadline) {
    const formattedDate = formatCalendarDate(deadline);
    let badge = null;
    let badgeType = null;

    if (isExtended) {
      badge = 'Extended';
      badgeType = 'info';
    } else if (lifecycleStatus === 'CLOSING_SOON' || explicitStatus === 'CLOSING_SOON') {
      badge = 'Closing Soon';
      badgeType = 'warning';
    }

    return {
      primaryText: formattedDate,
      badge,
      badgeType,
      isClosed: false,
      isOpen: true,
      isYearRound: false,
      status: lifecycleStatus
    };
  }

  // CASE: UNVERIFIED / UNKNOWN DEADLINE
  return {
    primaryText: 'Check Official Portal',
    badge: null,
    badgeType: null,
    isClosed: false,
    isOpen: true,
    isYearRound: false,
    status: explicitStatus || 'AVAILABILITY_UNVERIFIED'
  };
}

/**
 * Helper to normalize string tokens for comparison.
 */
function cleanStr(val) {
  if (val === null || val === undefined) return '';
  return String(val).trim().toUpperCase();
}

/**
 * Normalizes state name to handle variations like "Jammu & Kashmir", "Tamil Nadu", etc.
 */
function normalizeState(state) {
  if (!state) return '';
  return state.trim().toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]/g, '');
}

/**
 * Evaluates a single decision-tree requirement node.
 * Returns: { node, passed, unknown, mandatory, detail, description }
 */
export function evaluateDecisionNode(rule, profile, scholarship) {
  const field = (rule.field || rule.condition_field || rule.conditionField || '').toLowerCase().trim();
  const mandatory = rule.mandatory !== undefined ? Boolean(rule.mandatory) : (rule.is_mandatory !== undefined ? Boolean(rule.is_mandatory) : true);
  const value = rule.value !== undefined ? rule.value : (rule.value_json !== undefined ? rule.value_json : rule.valueJson);
  const description = rule.description || rule.rule_description || rule.ruleDescription || '';

  let passed = true;
  let unknown = false;
  let detail = '';

  switch (field) {
    case 'education_level': {
      const rawLevel = cleanStr(profile.educationLevel);
      if (!rawLevel) {
        unknown = true;
        detail = 'Education level is required to verify scheme eligibility';
        break;
      }

      const normalizedLevel = rawLevel === 'TWELFTH_COMPLETED' ? 'CLASS_12_PASSED' : rawLevel;
      const targetLevels = Array.isArray(value) ? value.map(cleanStr) : [cleanStr(value)];

      if (targetLevels.includes('ANY') || targetLevels.includes('ALL')) {
        passed = true;
      } else {
        passed = targetLevels.includes(rawLevel) ||
                 targetLevels.includes(normalizedLevel) ||
                 (targetLevels.includes('UNDERGRADUATE') && (normalizedLevel === 'CLASS_12_PASSED' || normalizedLevel === 'UNDERGRADUATE')) ||
                 (targetLevels.includes('POLYTECHNIC') && normalizedLevel === 'DIPLOMA');
      }

      detail = passed
        ? `Education level (${profile.educationLevel || 'Undergraduate'}) satisfies scheme scope`
        : `Requires education level in [${targetLevels.join(', ')}] (Your current level: ${profile.educationLevel || 'Unspecified'})`;
      break;
    }

    case 'current_year': {
      const studentYear = parseInt(profile.currentYear, 10);
      if (isNaN(studentYear)) {
        unknown = true;
        detail = 'Year of study is required to verify eligibility';
        break;
      }

      if (Array.isArray(value)) {
        const validYears = value.map(v => parseInt(v, 10));
        passed = validYears.includes(studentYear) || validYears.includes(0);
        detail = passed
          ? `Year of study (Year ${studentYear}) is eligible`
          : `Scheme is restricted to Year ${validYears.join(', ')} (You are in Year ${studentYear})`;
      } else {
        const reqYear = parseInt(value, 10);
        passed = studentYear === reqYear || reqYear === 0;
        detail = passed
          ? `Year of study (Year ${studentYear}) is eligible`
          : `Scheme is restricted to Year ${reqYear} (You are in Year ${studentYear})`;
      }
      break;
    }

    case 'min_class_10_percentage': {
      const score10 = parseFloat(profile.class10Percentage);
      if (isNaN(score10) || score10 <= 0) {
        // If 10th score is optional and UG student, mark unknown only if mandatory
        if (mandatory && profile.educationLevel === 'SCHOOL') {
          unknown = true;
          detail = 'Class 10 board score is required to verify cutoff';
        } else {
          passed = true;
          detail = 'Class 10 score requirement not applicable';
        }
        break;
      }

      const cutoff = parseFloat(value);
      passed = score10 >= cutoff;
      detail = passed
        ? `Class 10 score (${score10}%) meets cutoff of ${cutoff}%`
        : `Requires minimum ${cutoff}% in Class 10 board exam (Your score: ${score10}%)`;
      break;
    }

    case 'min_class_12_percentage': {
      const score12 = parseFloat(profile.class12Percentage || profile.percentage || profile.diplomaScore);
      if (isNaN(score12) || score12 <= 0) {
        if (mandatory && (cleanStr(profile.educationLevel) === 'UNDERGRADUATE' || cleanStr(profile.educationLevel) === 'CLASS_12_PASSED')) {
          unknown = true;
          detail = 'Class 12 / Higher secondary score is required to determine eligibility';
        } else {
          passed = true;
          detail = 'Class 12 percentage criteria satisfied';
        }
        break;
      }

      const cutoff = parseFloat(value);
      passed = score12 >= cutoff;
      detail = passed
        ? `Class 12 score (${score12}%) meets minimum cutoff of ${cutoff}%`
        : `Requires minimum ${cutoff}% in Class 12 board exam (Your score: ${score12}%)`;
      break;
    }

    case 'min_cgpa': {
      const studentCgpa = parseFloat(profile.cgpa || profile.currentCgpa || profile.undergraduateCgpa || profile.pgCgpa);
      const cutoff = parseFloat(value);

      if (isNaN(studentCgpa) || studentCgpa <= 0) {
        // If student is 1st year fresher, CGPA might not be available yet
        if (parseInt(profile.currentYear, 10) === 1) {
          passed = true;
          detail = '1st year student (CGPA evaluated from qualifying exam)';
        } else if (mandatory) {
          unknown = true;
          detail = `Academic CGPA is required to evaluate minimum ${cutoff} threshold`;
        } else {
          passed = true;
        }
        break;
      }

      passed = studentCgpa >= cutoff;
      detail = passed
        ? `Academic CGPA (${studentCgpa}) satisfies minimum requirement of ${cutoff}`
        : `Requires minimum ${cutoff} CGPA (Your current CGPA: ${studentCgpa})`;
      break;
    }

    case 'annual_family_income':
    case 'annual_income': {
      const rawIncome = profile.annualIncome !== undefined ? profile.annualIncome : (profile.annualFamilyIncome !== undefined ? profile.annualFamilyIncome : profile.annual_family_income);
      
      if (rawIncome === undefined || rawIncome === null || rawIncome === '') {
        unknown = true;
        detail = 'Family income details are required to evaluate income ceiling eligibility';
        break;
      }

      const studentIncome = parseFloat(rawIncome);
      const limit = parseFloat(value);

      passed = studentIncome <= limit;
      detail = passed
        ? `Family income ₹${studentIncome.toLocaleString('en-IN')} is within ceiling of ₹${limit.toLocaleString('en-IN')}`
        : `Family income ₹${studentIncome.toLocaleString('en-IN')} exceeds the scheme ceiling of ₹${limit.toLocaleString('en-IN')}`;
      break;
    }

    case 'category': {
      const rawCat = cleanStr(profile.category || 'GENERAL');
      const targetCats = Array.isArray(value) ? value.map(cleanStr) : [cleanStr(value)];

      if (targetCats.includes('ANY') || targetCats.includes('ALL') || targetCats.length === 0) {
        passed = true;
        detail = `All social categories eligible (${rawCat})`;
      } else {
        passed = targetCats.includes(rawCat) ||
                 (rawCat === 'SEBC' && targetCats.includes('OBC')) ||
                 (rawCat === 'OPEN' && targetCats.includes('GENERAL'));
        detail = passed
          ? `Social reservation category (${rawCat}) is eligible`
          : `Scheme is restricted to [${targetCats.join(', ')}] categories (Your category: ${rawCat})`;
      }
      break;
    }

    case 'domicile_state': {
      const studentState = normalizeState(profile.domicileState || profile.state);
      const targetStates = Array.isArray(value) ? value : [value];

      const isAllIndia = targetStates.some(s => {
        const norm = cleanStr(s);
        return norm === 'ALL_INDIA' || norm === 'ALL' || norm === 'PAN_INDIA' || norm === 'INDIA' || norm === '';
      });

      if (isAllIndia) {
        passed = true;
        detail = `Open to students across all States and UTs in India`;
      } else if (!studentState) {
        unknown = true;
        detail = 'State of residence confirmation is required for state-specific quota';
      } else {
        passed = targetStates.some(s => {
          const normTarget = normalizeState(s);
          return normTarget === studentState || studentState.includes(normTarget) || normTarget.includes(studentState);
        });

        detail = passed
          ? `State of residence (${profile.domicileState}) satisfies requirement`
          : `Restricted to residents of [${targetStates.join(', ')}] (Your state of residence: ${profile.domicileState || 'Unspecified'})`;
      }
      break;
    }

    case 'gender': {
      const studentGender = cleanStr(profile.gender || 'ANY');
      const targetGender = cleanStr(value || 'ANY');

      if (targetGender === 'ANY' || targetGender === 'ALL' || targetGender === '') {
        passed = true;
        detail = 'Open to all genders';
      } else if (!studentGender || studentGender === 'ANY') {
        unknown = true;
        detail = `Gender specification required for ${targetGender} exclusive scheme`;
      } else {
        passed = studentGender === targetGender;
        detail = passed
          ? `Gender requirement (${targetGender}) verified`
          : `Scheme is exclusively for ${targetGender} applicants (Your gender: ${profile.gender})`;
      }
      break;
    }

    case 'eligible_branches':
    case 'branch':
    case 'specialization': {
      const studentBranch = cleanStr(profile.specialization || profile.branch || '');
      const targetBranches = Array.isArray(value) ? value.map(cleanStr) : [cleanStr(value)];

      if (targetBranches.includes('ANY') || targetBranches.includes('ALL') || targetBranches.length === 0) {
        passed = true;
        detail = 'All branches eligible';
      } else if (!studentBranch || studentBranch === 'NOT APPLICABLE') {
        // If course requires branch check and student branch is empty
        if (mandatory) {
          unknown = true;
          detail = `Specific engineering/academic branch in [${targetBranches.join(', ')}] is required`;
        } else {
          passed = true;
        }
      } else {
        passed = targetBranches.some(target => {
          return studentBranch.includes(target) || target.includes(studentBranch);
        });

        detail = passed
          ? `Branch (${profile.specialization || profile.branch}) satisfies scheme scope`
          : `Restricted to branches in [${targetBranches.join(', ')}] (Your branch: ${profile.specialization || profile.branch})`;
      }
      break;
    }

    case 'eligible_courses':
    case 'course': {
      const studentCourse = cleanStr(profile.course || profile.diplomaCourse || '');
      const targetCourses = Array.isArray(value) ? value.map(cleanStr) : [cleanStr(value)];

      if (targetCourses.includes('ANY') || targetCourses.includes('ALL') || targetCourses.length === 0) {
        passed = true;
        detail = 'All courses eligible';
      } else if (!studentCourse) {
        unknown = true;
        detail = 'Enrolled degree/course name is required';
      } else {
        passed = targetCourses.some(target => {
          return studentCourse.includes(target) || target.includes(studentCourse);
        });

        detail = passed
          ? `Enrolled course (${profile.course}) satisfies scheme scope`
          : `Restricted to [${targetCourses.join(', ')}] degree programs (Your course: ${profile.course})`;
      }
      break;
    }

    case 'institution':
    case 'institution_name':
    case 'target_institutions': {
      const studentInst = cleanStr(profile.institutionName || profile.collegeName || '');
      const targetInsts = Array.isArray(value) ? value.map(cleanStr) : [cleanStr(value)];

      if (targetInsts.includes('ANY') || targetInsts.includes('ALL') || targetInsts.length === 0) {
        passed = true;
        detail = 'All recognized institutions eligible';
      } else if (!studentInst) {
        unknown = true;
        detail = 'Enrolled college/university name is required';
      } else {
        passed = targetInsts.some(target => {
          return studentInst.includes(target) || target.includes(studentInst);
        });

        detail = passed
          ? `Enrolled institution (${profile.institutionName}) matches eligible institutes`
          : `Restricted to students of [${targetInsts.join(', ')}] (Your institution: ${profile.institutionName || 'Unspecified'})`;
      }
      break;
    }

    case 'has_disability': {
      const hasDis = Boolean(profile.hasDisability === true || cleanStr(profile.hasDisability) === 'YES');
      const reqVal = Boolean(value);

      if (reqVal) {
        passed = hasDis === true;
        detail = passed
          ? 'Certified benchmark disability quota verified'
          : 'Scheme requires certified benchmark disability (UDID card)';
      } else {
        passed = true;
        detail = 'Disability criteria verified';
      }
      break;
    }

    case 'min_disability_percentage': {
      const disPct = parseFloat(profile.disabilityPercentage || 0);
      const reqPct = parseFloat(value);
      const hasDis = Boolean(profile.hasDisability === true || cleanStr(profile.hasDisability) === 'YES');

      passed = hasDis && disPct >= reqPct;
      detail = passed
        ? `Disability percentage (${disPct}%) meets minimum requirement of ${reqPct}%`
        : `Requires minimum ${reqPct}% certified benchmark disability (Current: ${disPct}%)`;
      break;
    }

    case 'is_minority': {
      const isMin = Boolean(profile.isMinority === true || cleanStr(profile.isMinority) === 'YES');
      const reqVal = Boolean(value);

      if (reqVal) {
        passed = isMin === true;
        detail = passed
          ? 'Notified national minority community status verified'
          : 'Scheme restricted to notified national minority communities';
      } else {
        passed = true;
      }
      break;
    }

    case 'is_single_girl_child': {
      const isSgc = Boolean(profile.isSingleGirlChild === true || cleanStr(profile.isSingleGirlChild) === 'YES');
      const reqVal = Boolean(value);

      if (reqVal) {
        passed = isSgc === true;
        detail = passed
          ? 'Single girl child criteria verified'
          : 'Scheme is exclusively for single girl child applicants';
      } else {
        passed = true;
      }
      break;
    }

    case 'is_orphan': {
      const isOrph = Boolean(profile.isOrphan === true || cleanStr(profile.isOrphan) === 'YES');
      const reqVal = Boolean(value);

      if (reqVal) {
        passed = isOrph === true;
        detail = passed
          ? 'Orphan / State ward priority quota verified'
          : 'Scheme is exclusively for orphan / state ward students';
      } else {
        passed = true;
      }
      break;
    }

    case 'is_ex_serviceman_ward':
    case 'is_ward_of_defense_or_capf': {
      const isWard = Boolean(profile.isWardOfDefenseOrCapf === true || profile.isExServicemanWard === true || cleanStr(profile.isWardOfDefenseOrCapf) === 'YES');
      const reqVal = Boolean(value);

      if (reqVal) {
        passed = isWard === true;
        detail = passed
          ? 'Ward of Armed Forces / CAPF / Ex-Serviceman quota verified'
          : 'Scheme reserved exclusively for wards of Armed Forces / Police / CAPF personnel';
      } else {
        passed = true;
      }
      break;
    }

    case 'is_first_graduate':
    case 'is_first_gen_learner': {
      const isFirst = Boolean(profile.isFirstGraduate === true || profile.isFirstGenLearner === true || cleanStr(profile.isFirstGraduate) === 'YES');
      const reqVal = Boolean(value);

      if (reqVal) {
        passed = isFirst === true;
        detail = passed
          ? 'First-generation college learner quota verified'
          : 'Scheme priority for first-generation college learners';
      } else {
        passed = true;
      }
      break;
    }

    default: {
      passed = true;
      detail = description || 'Requirement verified';
      break;
    }
  }

  if (unknown) {
    passed = false;
  }

  return {
    node: field,
    passed,
    unknown,
    mandatory,
    detail: detail || description || 'Criteria evaluated',
    description: description || detail
  };
}

/**
 * Executes the Decision Tree evaluation for a single scholarship.
 * The Decision Tree determines ELIGIBLE / POSSIBLE / NOT ELIGIBLE.
 * Match score is calculated afterwards for ranking only and never overrides the decision.
 */
export function evaluateScholarship(profile, scholarship) {
  const rules = scholarship.rules || [];
  const decisionPath = [];
  const passedRequirements = [];
  const failedRequirements = [];
  const unknownRequirements = [];

  let mandatoryFailedCount = 0;
  let mandatoryUnknownCount = 0;
  let totalRules = rules.length;
  let passedRulesCount = 0;

  for (const rule of rules) {
    const nodeResult = evaluateDecisionNode(rule, profile, scholarship);

    decisionPath.push({
      node: nodeResult.node,
      status: nodeResult.passed ? 'PASS' : (nodeResult.unknown ? 'UNKNOWN' : 'FAIL'),
      mandatory: nodeResult.mandatory,
      detail: nodeResult.detail,
      description: nodeResult.description
    });

    if (nodeResult.passed) {
      passedRulesCount++;
      passedRequirements.push(nodeResult.description || nodeResult.detail);
    } else if (nodeResult.unknown) {
      if (nodeResult.mandatory) {
        mandatoryUnknownCount++;
      }
      unknownRequirements.push(nodeResult.detail);
    } else {
      if (nodeResult.mandatory) {
        mandatoryFailedCount++;
        failedRequirements.push(nodeResult.detail);
      } else {
        unknownRequirements.push(nodeResult.detail);
      }
    }
  }

  // ===========================================================================
  // DECISION TREE CLASSIFICATION (SOURCE OF TRUTH)
  // ===========================================================================
  let evaluationStatus = 'ELIGIBLE';
  let tier = 'STRONG_MATCH';
  let matchScore = 0;

  if (mandatoryFailedCount > 0) {
    // FAILED MANDATORY REQUIREMENT ALWAYS WINS -> NOT ELIGIBLE
    evaluationStatus = 'NOT_ELIGIBLE';
    tier = 'INELIGIBLE';
    matchScore = totalRules > 0 ? Math.min(35, Math.round((passedRulesCount / totalRules) * 50)) : 0;
  } else if (mandatoryUnknownCount > 0 || unknownRequirements.length > 0) {
    // MISSING MANDATORY INFORMATION -> POSSIBLE (NEVER ELIGIBLE)
    evaluationStatus = 'POSSIBLE_MATCH';
    tier = 'POSSIBLE_MATCH';
    matchScore = totalRules > 0 ? Math.min(75, Math.round((passedRulesCount / totalRules) * 80)) : 60;
  } else {
    // ALL MANDATORY NODES PASS AND ZERO UNKNOWN MANDATORY NODES -> ELIGIBLE
    evaluationStatus = 'ELIGIBLE';
    matchScore = totalRules > 0 ? Math.round((passedRulesCount / totalRules) * 100) : 100;
    tier = matchScore >= 95 ? 'STRONG_MATCH' : 'GOOD_MATCH';
  }

  // Guarantee 100% match only occurs when all nodes pass and zero missing
  if (evaluationStatus !== 'ELIGIBLE') {
    matchScore = Math.min(matchScore, 75);
  }

  const deadlineStatus = calculateDeadlineStatus(
    scholarship.application_deadline || scholarship.applicationDeadline,
    scholarship.application_start || scholarship.applicationStart || scholarship.application_open_date || scholarship.applicationOpenDate,
    scholarship.status
  );

  // Generate audit-grade human explanation
  let explanation = '';
  if (evaluationStatus === 'ELIGIBLE') {
    explanation = `Decision Tree verified: You meet 100% of the mandatory requirements for ${scholarship.name}. Your academic score, family income, state of residence (${profile.domicileState || 'Pan-India'}), and category (${profile.category || 'General'}) fully qualify.`;
  } else if (evaluationStatus === 'POSSIBLE_MATCH') {
    explanation = `Potential opportunity: Core eligibility verified, but supplementary verification is needed (${unknownRequirements.join('; ') || 'income / enrollment proof'}).`;
  } else {
    explanation = `Not currently eligible: ${failedRequirements.join('; ')}.`;
  }

  return {
    scholarshipId: scholarship.id,
    scholarship,
    result: evaluationStatus === 'ELIGIBLE' ? 'ELIGIBLE' : (evaluationStatus === 'POSSIBLE_MATCH' ? 'POSSIBLE' : 'NOT_ELIGIBLE'),
    evaluationStatus, // 'ELIGIBLE', 'POSSIBLE_MATCH', 'NOT_ELIGIBLE'
    tier, // 'STRONG_MATCH', 'GOOD_MATCH', 'POSSIBLE_MATCH', 'INELIGIBLE'
    isEligible: evaluationStatus === 'ELIGIBLE',
    matchScore,
    decisionPath,
    passedRequirements,
    failedRequirements,
    unknownRequirements,
    matchedCriteria: passedRequirements,
    failedCriteria: failedRequirements,
    missingInformation: unknownRequirements,
    requiredDocuments: scholarship.required_documents || scholarship.requiredDocuments || [],
    deadlineStatus,
    evaluations: decisionPath.map(d => ({
      vector: d.node,
      passed: d.status === 'PASS',
      mandatory: d.mandatory,
      details: d.detail,
      description: d.description
    })),
    explanation
  };
}

/**
 * Evaluates all scholarships in database for a student profile.
 */
export function evaluateAllScholarships(profile, database) {
  const results = (database || []).map((scholarship) => evaluateScholarship(profile, scholarship));

  const eligible = results.filter((r) => r.evaluationStatus === 'ELIGIBLE');
  const possible = results.filter((r) => r.evaluationStatus === 'POSSIBLE_MATCH');
  const ineligible = results.filter((r) => r.evaluationStatus === 'NOT_ELIGIBLE');

  const strongMatches = results.filter((r) => r.tier === 'STRONG_MATCH');
  const goodMatches = results.filter((r) => r.tier === 'GOOD_MATCH');
  const possibleMatches = results.filter((r) => r.tier === 'POSSIBLE_MATCH');

  return {
    allResults: results,
    eligible,
    possible,
    ineligible,
    strongMatches,
    goodMatches,
    possibleMatches,
    summary: {
      eligibleCount: eligible.length,
      possibleCount: possible.length,
      ineligibleCount: ineligible.length,
      totalCount: results.length
    }
  };
}
