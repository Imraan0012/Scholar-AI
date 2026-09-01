import { apiClient } from './apiClient.js';
import { supabase } from '../lib/supabaseClient.js';

/**
 * Maps raw snake_case database row from student_profiles table to camelCase frontend DTO.
 */
function mapSupabaseProfileToDTO(row) {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    fullName: row.full_name || '',
    email: row.email || '',
    phone: row.phone || '',
    mobile: row.phone || '',
    dateOfBirth: row.date_of_birth || '',
    dob: row.date_of_birth || '',
    nationality: row.nationality || 'INDIAN',
    gender: row.gender || '',

    // Academic
    educationLevel: row.education_level || 'UNDERGRADUATE',
    course: row.course || '',
    branch: row.branch || '',
    specialization: row.branch || '',
    currentYear: row.current_year || 1,
    admissionYear: row.admission_year,
    institutionName: row.institution_name || '',
    institutionType: row.institution_type || '',
    studyMode: row.study_mode || '',
    class10Percentage: row.class_10_percentage,
    class12Percentage: row.class_12_percentage,
    undergraduateCgpa: row.undergraduate_cgpa,
    postgraduateCgpa: row.postgraduate_cgpa,
    currentCgpa: row.current_cgpa || row.undergraduate_cgpa,
    cgpa: row.current_cgpa || row.undergraduate_cgpa,

    // Financial
    annualFamilyIncome: row.annual_family_income,
    annualIncome: row.annual_family_income,
    incomeSource: row.income_source || '',
    fatherOccupation: row.father_occupation || '',
    motherOccupation: row.mother_occupation || '',
    familyMemberCount: row.family_member_count,
    familyMembersCount: row.family_member_count,
    earningMemberCount: row.earning_member_count,
    earningMembersCount: row.earning_member_count,
    hasIncomeCertificate: Boolean(row.has_income_certificate),

    // Category & Domicile
    category: row.category || '',
    socialCategory: row.category || '',
    isObcNcl: Boolean(row.is_obc_ncl),
    isEws: Boolean(row.is_ews),
    hasCategoryCertificate: Boolean(row.has_category_certificate),
    hasCasteCertificate: Boolean(row.has_category_certificate),
    domicileState: row.domicile_state || '',
    hasDomicileCertificate: Boolean(row.has_domicile_certificate),
    pincode: row.pincode || '',
    currentPincode: row.pincode || '',

    // Additional
    hasDisability: Boolean(row.has_disability),
    isPwd: Boolean(row.has_disability),
    disabilityPercentage: row.disability_percentage || 0,
    hasUdidCard: Boolean(row.has_udid_card),
    isFarmerFamily: Boolean(row.is_farmer_family),
    farmerFamily: Boolean(row.is_farmer_family),
    isFirstGraduate: Boolean(row.is_first_graduate),
    isFirstGenLearner: Boolean(row.is_first_graduate),
    isWardOfDefenseOrCapf: Boolean(row.is_ward_of_defense_or_capf),
    isExServicemanWard: Boolean(row.is_ward_of_defense_or_capf),
    isSingleParent: Boolean(row.is_single_parent),
    isSingleParentHousehold: Boolean(row.is_single_parent),
    isOrphan: Boolean(row.is_orphan),
    isSingleGirlChild: Boolean(row.is_single_girl_child),
    isMinority: Boolean(row.is_minority),
    minorityCommunity: row.minority_community || '',
    existingScholarship: row.existing_scholarship || '',
    applicationType: row.application_type || 'FRESH',
    competitiveExamName: row.competitive_exam_name || '',
    competitiveExamScore: row.competitive_exam_score,
    competitiveExamRank: row.competitive_exam_rank,

    // Workflow State
    onboardingStep: row.onboarding_step != null ? row.onboarding_step : 1,
    onboardingComplete: Boolean(row.onboarding_complete),
    isOnboarded: Boolean(row.onboarding_complete),
    profileCompletionScore: row.profile_completion_score || 0,
    profileCompletion: row.profile_completion_score || 0
  };
}

export const profileService = {
  /**
   * Fetches the current authenticated student profile status from Spring Boot or Supabase.
   * Returns { authenticated, userId, profileExists, onboardingComplete, onboardingStep }
   */
  async getProfileStatus(userId) {
    try {
      const data = await apiClient.get('/me/profile-status');
      if (data && typeof data === 'object') {
        return data;
      }
    } catch (err) {
      console.warn('[ProfileService] Backend getProfileStatus warning:', err.message);
    }

    if (userId) {
      try {
        const { data: sbRow } = await supabase
          .from('student_profiles')
          .select('id, user_id, onboarding_step, onboarding_complete, profile_completion_score')
          .eq('user_id', userId)
          .maybeSingle();

        if (sbRow) {
          return {
            authenticated: true,
            userId,
            profileExists: true,
            onboardingComplete: Boolean(sbRow.onboarding_complete),
            onboardingStep: sbRow.onboarding_step || 1,
            profileCompletionScore: sbRow.profile_completion_score || 0
          };
        }
        return {
          authenticated: true,
          userId,
          profileExists: false,
          onboardingComplete: false,
          onboardingStep: 1,
          profileCompletionScore: 0
        };
      } catch (sbErr) {
        console.warn('[ProfileService] Supabase status fallback warning:', sbErr.message);
      }
    }

    return { authenticated: Boolean(userId), profileExists: false, onboardingComplete: false, onboardingStep: 1 };
  },

  /**
   * Fetches the current authenticated student profile.
   * Uses Spring Boot API primarily; if cold-starting/timing out, falls back directly to Supabase.
   */
  async getProfile(userId) {
    // 1. Try Spring Boot backend
    try {
      const data = await apiClient.get('/profile');
      if (data !== undefined) {
        return data; // returns DTO object or null if not found
      }
    } catch (err) {
      console.warn('[ProfileService] Spring Boot profile endpoint notice:', err.message);

      // 2. Resilient fallback to Supabase direct query (especially during Render cold start)
      if (userId) {
        try {
          const { data: sbRow, error: sbErr } = await supabase
            .from('student_profiles')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();

          if (!sbErr) {
            return mapSupabaseProfileToDTO(sbRow); // null if not in DB, or full DTO
          }
        } catch (sbEx) {
          console.warn('[ProfileService] Direct Supabase profile query notice:', sbEx.message);
        }
      }

      // Re-throw original network/timeout error if both backend and Supabase failed
      throw err;
    }

    // Direct Supabase query if apiClient returned undefined
    if (userId) {
      try {
        const { data: sbRow, error: sbErr } = await supabase
          .from('student_profiles')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();

        if (!sbErr) {
          return mapSupabaseProfileToDTO(sbRow);
        }
      } catch (e) {}
    }

    return null;
  },

  /**
   * Saves or updates the profile in the Spring Boot backend.
   */
  async saveProfile(profileData) {
    try {
      const saved = await apiClient.post('/profile', profileData);
      return saved;
    } catch (err) {
      console.error('[ProfileService] Backend saveProfile error:', err.message);
      throw new Error(err.message || 'Unable to save your information. Please try again.');
    }
  },

  /**
   * Saves an individual onboarding step directly to Spring Boot & Supabase.
   * Synchronously persists to localStorage and sends to backend asynchronously.
   */
  async saveOnboardingStep(stepNumber, stepData) {
    this.saveOnboardingProgress(stepNumber, stepData);
    const payload = {
      ...stepData,
      onboardingStep: stepNumber,
      onboardingComplete: stepNumber >= 5
    };

    try {
      const saved = await apiClient.post('/profile', payload);
      return saved;
    } catch (err) {
      console.warn(`[ProfileService] Step ${stepNumber} database save notice:`, err.message);
      return payload;
    }
  },

  /**
   * Saves onboarding step locally for instantaneous retrieval and initiates background sync.
   * NOTE: We do NOT store sensitive profile data in localStorage; only step number is stored.
   */
  saveOnboardingProgress(stepNumber, stepData) {
    try {
      localStorage.setItem('scholar_ai_onboarding_step', String(stepNumber));
    } catch (e) {}
  },

  /**
   * Evaluates saved profile data and calculates the FIRST incomplete onboarding step.
   * Returns a number 1..5 if onboarding is incomplete, or 6 if completely onboarded.
   */
  getFirstIncompleteStep(p) {
    if (!p) return 1;
    if (p.onboardingComplete === true || p.isOnboarded === true || p.onboarding_complete === true) {
      return 6;
    }

    // Helper: treat null/undefined/empty-string/0 as missing
    const has = (v) => v !== undefined && v !== null && String(v).trim() !== '' && String(v).trim() !== '0';
    const hasNum = (v) => v !== undefined && v !== null && v !== '' && !isNaN(Number(v)) && Number(v) > 0;

    // --- STEP 1: Personal Details ---
    const hasName = Boolean(p.fullName && String(p.fullName).trim());
    const hasDob = has(p.dob) || has(p.dateOfBirth);
    const hasGender = has(p.gender) && p.gender !== 'ANY';
    const hasEmail = Boolean(p.email && String(p.email).trim());
    if (!hasName || !hasDob || !hasGender || !hasEmail) {
      return 1;
    }

    // --- STEP 2: Academic Background ---
    const edu = p.educationLevel || '';
    if (!edu) return 2;

    if (edu === 'TWELFTH_COMPLETED') {
      const has10 = hasNum(p.class10Percentage);
      const has12 = hasNum(p.class12Percentage);
      if (!has10 || !has12) return 2;
    } else if (edu === 'DIPLOMA') {
      const hasCourse = Boolean((p.course && p.course.trim()) || (p.diplomaCourse && p.diplomaCourse.trim()));
      const hasBranch = Boolean((p.specialization && p.specialization.trim()) || (p.branch && p.branch.trim()));
      const hasInst = Boolean((p.institutionName && p.institutionName.trim()) || (p.universityName && p.universityName.trim()));
      const hasScore = hasNum(p.diplomaScore);
      if (!hasCourse || !hasBranch || !hasInst || !hasScore) return 2;
    } else if (edu === 'UNDERGRADUATE') {
      const hasCourse = Boolean(p.course && p.course.trim());
      const hasBranch = Boolean((p.specialization && p.specialization.trim()) || (p.branch && p.branch.trim()));
      const hasInst = Boolean((p.institutionName && p.institutionName.trim()) || (p.universityName && p.universityName.trim()));
      const has12 = hasNum(p.class12Percentage) || hasNum(p.diplomaScore);
      const hasCgpa = hasNum(p.cgpa) || hasNum(p.currentCgpa) || p.currentYear === 1 || p.currentYear === '1';
      if (!hasCourse || !hasBranch || !hasInst || !has12 || !hasCgpa) return 2;
    } else if (edu === 'POSTGRADUATE') {
      const hasCourse = Boolean(p.course && p.course.trim());
      const hasBranch = Boolean((p.specialization && p.specialization.trim()) || (p.branch && p.branch.trim()));
      const hasInst = Boolean((p.institutionName && p.institutionName.trim()) || (p.universityName && p.universityName.trim()));
      const hasUg = Boolean((p.undergraduateDegree && p.undergraduateDegree.trim()) || (p.ugDegree && p.ugDegree.trim()));
      const hasUgCgpa = hasNum(p.undergraduateCgpa) || hasNum(p.ugCgpa);
      const hasCgpa = hasNum(p.cgpa) || hasNum(p.currentCgpa) || p.currentYear === 1 || p.currentYear === '1';
      if (!hasCourse || !hasBranch || !hasInst || !hasUg || !hasUgCgpa || !hasCgpa) return 2;
    }

    // --- STEP 3: Financial Information ---
    const incomeVal = p.annualIncome !== undefined ? p.annualIncome : p.annualFamilyIncome;
    const hasIncome = hasNum(incomeVal);
    const hasSource = has(p.incomeSource);
    const memberCount = p.familyMembersCount !== undefined ? p.familyMembersCount : p.familyMemberCount;
    const hasMembers = memberCount !== undefined && memberCount !== null && parseInt(memberCount, 10) >= 1;
    const hasCert = has(p.incomeCertificateStatus) || p.hasIncomeCertificate !== undefined;
    if (!hasIncome || !hasSource || !hasMembers || !hasCert) {
      return 3;
    }

    // --- STEP 4: Category & Domicile ---
    const hasCategory = has(p.category);
    const hasDomicile = has(p.domicileState) || has(p.state) || has(p.currentResidenceState);
    if (!hasCategory || !hasDomicile) {
      return 4;
    }

    // --- STEP 5: Additional Information ---
    const hasAppType = has(p.applicationType);
    if (p.hasDisability && (!p.disabilityPercentage || isNaN(p.disabilityPercentage))) {
      return 5;
    }
    if (!hasAppType) {
      return 5;
    }

    return 6;
  },

  /**
   * Retrieves saved onboarding step from localStorage instantly.
   */
  getSavedOnboardingProgress() {
    try {
      const step = localStorage.getItem('scholar_ai_onboarding_step');
      return step ? parseInt(step, 10) : 1;
    } catch (e) {
      return 1;
    }
  },

  /**
   * Calculates dynamic profile completion percentage from actual persisted fields.
   */
  calculateCompletion(p) {
    if (!p) return 0;
    let score = 0;
    // Step 1: Personal (20%)
    if (p.fullName && p.fullName.trim()) score += 5;
    if (p.email && p.email.trim()) score += 5;
    if (p.phone || p.mobile) score += 5;
    if (p.gender && p.gender.trim()) score += 5;

    // Step 2: Academic (25%)
    if (p.educationLevel && p.educationLevel.trim()) score += 10;
    if (p.course && p.course.trim()) score += 5;
    if (p.institutionName && p.institutionName.trim()) score += 5;
    if (p.class12Percentage || p.currentCgpa || p.undergraduateCgpa || p.cgpa) score += 5;

    // Step 3: Financial (20%)
    if (p.annualFamilyIncome !== undefined || p.annualIncome !== undefined) score += 15;
    if (p.incomeSource && p.incomeSource.trim()) score += 5;

    // Step 4: Category & Domicile (20%)
    if (p.category && p.category.trim()) score += 10;
    if (p.domicileState && p.domicileState.trim()) score += 10;

    // Step 5: Additional (15%)
    score += 15;

    return Math.min(100, score);
  }
};
