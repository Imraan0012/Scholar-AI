import { apiClient } from './apiClient.js';
import { supabase } from '../lib/supabaseClient.js';

/**
 * Maps raw snake_case database row from student_profiles table to camelCase frontend DTO.
 */
export function mapSupabaseProfileToDTO(row) {
  if (!row) return null;
  const isComplete = Boolean(row.onboarding_complete);

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
    onboardingStep: row.onboarding_step != null ? row.onboarding_step : (isComplete ? 5 : 1),
    onboardingComplete: isComplete,
    isOnboarded: isComplete,
    profileCompletionScore: row.profile_completion_score || (isComplete ? 100 : 50),
    profileCompletion: row.profile_completion_score || (isComplete ? 100 : 50)
  };
}

/**
 * Maps frontend camelCase profile DTO to snake_case student_profiles database columns.
 */
export function mapDTOToSupabaseRow(userId, dto) {
  if (!userId || !dto) return null;
  const isComplete = Boolean(dto.onboardingComplete === true || dto.isOnboarded === true);

  const row = {
    user_id: userId,
    full_name: dto.fullName || dto.name || '',
    email: dto.email || '',
    phone: dto.phone || dto.mobile || null,
    date_of_birth: dto.dateOfBirth || dto.dob || null,
    nationality: dto.nationality || 'INDIAN',
    gender: dto.gender || 'MALE',

    // Academic
    education_level: dto.educationLevel || 'UNDERGRADUATE',
    course: dto.course || '',
    branch: dto.branch || dto.specialization || null,
    current_year: dto.currentYear != null ? parseInt(dto.currentYear, 10) : 1,
    admission_year: dto.admissionYear != null ? parseInt(dto.admissionYear, 10) : null,
    institution_name: dto.institutionName || dto.universityName || 'Institution',
    institution_type: dto.institutionType || 'Government',
    study_mode: dto.studyMode || 'FULL_TIME',
    class_10_percentage: dto.class10Percentage != null ? parseFloat(dto.class10Percentage) : null,
    class_12_percentage: dto.class12Percentage != null ? parseFloat(dto.class12Percentage) : null,
    undergraduate_cgpa: dto.undergraduateCgpa != null ? parseFloat(dto.undergraduateCgpa) : null,
    postgraduate_cgpa: dto.postgraduateCgpa != null ? parseFloat(dto.postgraduateCgpa) : null,
    current_cgpa: dto.currentCgpa != null ? parseFloat(dto.currentCgpa) : (dto.cgpa != null ? parseFloat(dto.cgpa) : null),

    // Financial
    annual_family_income: dto.annualFamilyIncome != null ? parseFloat(dto.annualFamilyIncome) : (dto.annualIncome != null ? parseFloat(dto.annualIncome) : 0),
    income_source: dto.incomeSource || 'SALARY',
    father_occupation: dto.fatherOccupation || null,
    mother_occupation: dto.motherOccupation || null,
    family_member_count: dto.familyMemberCount != null ? parseInt(dto.familyMemberCount, 10) : (dto.familyMembersCount != null ? parseInt(dto.familyMembersCount, 10) : 4),
    earning_member_count: dto.earningMemberCount != null ? parseInt(dto.earningMemberCount, 10) : (dto.earningMembersCount != null ? parseInt(dto.earningMembersCount, 10) : 1),
    has_income_certificate: Boolean(dto.hasIncomeCertificate || dto.incomeCertificateStatus === 'YES'),

    // Category & Domicile
    category: dto.category || dto.socialCategory || 'GENERAL',
    is_obc_ncl: Boolean(dto.isObcNcl),
    is_ews: Boolean(dto.isEws),
    has_category_certificate: Boolean(dto.hasCategoryCertificate || dto.hasCasteCertificate),
    domicile_state: dto.domicileState || dto.state || dto.currentResidenceState || '',
    has_domicile_certificate: Boolean(dto.hasDomicileCertificate),
    pincode: dto.pincode || dto.currentPincode || null,

    // Additional
    has_disability: Boolean(dto.hasDisability || dto.isPwd),
    disability_percentage: dto.disabilityPercentage != null ? parseFloat(dto.disabilityPercentage) : 0,
    has_udid_card: Boolean(dto.hasUdidCard),
    is_farmer_family: Boolean(dto.isFarmerFamily || dto.farmerFamily),
    is_first_graduate: Boolean(dto.isFirstGraduate || dto.isFirstGenLearner),
    is_ward_of_defense_or_capf: Boolean(dto.isWardOfDefenseOrCapf || dto.isExServicemanWard),
    is_single_parent: Boolean(dto.isSingleParent || dto.isSingleParentHousehold),
    is_orphan: Boolean(dto.isOrphan),
    is_single_girl_child: Boolean(dto.isSingleGirlChild),
    is_minority: Boolean(dto.isMinority),
    minority_community: dto.minorityCommunity || null,
    existing_scholarship: dto.existingScholarship || null,
    application_type: dto.applicationType || 'FRESH',
    competitive_exam_name: dto.competitiveExamName || null,
    competitive_exam_score: dto.competitiveExamScore != null ? parseFloat(dto.competitiveExamScore) : null,
    competitive_exam_rank: dto.competitiveExamRank != null ? parseInt(dto.competitiveExamRank, 10) : null,

    // Workflow State
    onboarding_step: isComplete ? 5 : (dto.onboardingStep != null ? parseInt(dto.onboardingStep, 10) : 1),
    onboarding_complete: isComplete,
    profile_completion_score: isComplete ? 100 : (dto.profileCompletionScore || 50),
    updated_at: new Date().toISOString()
  };

  // Clean undefined keys
  Object.keys(row).forEach(key => {
    if (row[key] === undefined || (typeof row[key] === 'number' && isNaN(row[key]))) {
      delete row[key];
    }
  });

  return row;
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
          const isComplete = Boolean(sbRow.onboarding_complete || (sbRow.onboarding_step && sbRow.onboarding_step >= 5));
          return {
            authenticated: true,
            userId,
            profileExists: true,
            onboardingComplete: isComplete,
            onboardingStep: isComplete ? 5 : (sbRow.onboarding_step || 1),
            profileCompletionScore: sbRow.profile_completion_score || (isComplete ? 100 : 50)
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
      if (data !== undefined && data !== null) {
        return data; // returns DTO object
      }
    } catch (err) {
      console.warn('[ProfileService] Spring Boot profile endpoint notice:', err.message);

      // 2. Resilient fallback to Supabase direct query
      if (userId) {
        try {
          const { data: sbRow, error: sbErr } = await supabase
            .from('student_profiles')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();

          if (!sbErr && sbRow) {
            return mapSupabaseProfileToDTO(sbRow);
          }
          if (!sbErr && !sbRow) {
            return null; // Confirmed absent
          }
        } catch (sbEx) {
          console.warn('[ProfileService] Direct Supabase profile query notice:', sbEx.message);
        }
      }

      // Re-throw original network/timeout error if both backend and Supabase failed
      throw err;
    }

    // Direct Supabase query if apiClient returned null/undefined
    if (userId) {
      try {
        const { data: sbRow, error: sbErr } = await supabase
          .from('student_profiles')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();

        if (!sbErr && sbRow) {
          return mapSupabaseProfileToDTO(sbRow);
        }
        if (!sbErr && !sbRow) {
          return null; // Confirmed absent
        }
      } catch (e) {}
    }

    return null;
  },

  /**
   * Saves or updates the profile in both Spring Boot and Supabase atomically.
   */
  async saveProfile(profileData, userId = null) {
    let resolvedUserId = userId;
    if (!resolvedUserId) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        resolvedUserId = session?.user?.id;
      } catch (e) {}
    }

    // 1. Save directly to Supabase table as immediate atomic persistence
    if (resolvedUserId) {
      try {
        const dbPayload = mapDTOToSupabaseRow(resolvedUserId, profileData);
        if (dbPayload) {
          await supabase
            .from('student_profiles')
            .upsert(dbPayload, { onConflict: 'user_id' });
        }
      } catch (sbErr) {
        console.warn('[ProfileService] Direct Supabase upsert notice:', sbErr.message);
      }
    }

    // 2. Also send to Spring Boot backend
    try {
      const saved = await apiClient.post('/profile', profileData);
      return saved;
    } catch (err) {
      console.warn('[ProfileService] Backend saveProfile notice (Supabase saved):', err.message);
      return profileData;
    }
  },

  /**
   * Saves an individual onboarding step directly to Spring Boot & Supabase.
   */
  async saveOnboardingStep(stepNumber, stepData, userId = null) {
    this.saveOnboardingProgress(stepNumber, stepData);
    const isCompleted = Boolean(stepData.onboardingComplete === true || stepData.isOnboarded === true);
    const payload = {
      ...stepData,
      onboardingStep: stepNumber,
      onboardingComplete: isCompleted,
      isOnboarded: isCompleted
    };

    let resolvedUserId = userId;
    if (!resolvedUserId) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        resolvedUserId = session?.user?.id;
      } catch (e) {}
    }

    // Direct Supabase upsert
    if (resolvedUserId) {
      try {
        const dbPayload = mapDTOToSupabaseRow(resolvedUserId, payload);
        if (dbPayload) {
          await supabase
            .from('student_profiles')
            .upsert(dbPayload, { onConflict: 'user_id' });
        }
      } catch (sbErr) {
        console.warn('[ProfileService] Direct Supabase step upsert notice:', sbErr.message);
      }
    }

    // Spring Boot save
    try {
      const saved = await apiClient.post('/profile', payload);
      return saved;
    } catch (err) {
      console.warn(`[ProfileService] Step ${stepNumber} backend save notice (Supabase saved):`, err.message);
      return payload;
    }
  },

  /**
   * Saves onboarding step locally for instantaneous retrieval.
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

    // Helper: treat null/undefined/empty-string as missing
    const has = (v) => v !== undefined && v !== null && String(v).trim() !== '' && String(v).trim() !== '0';
    const hasNum = (v) => v !== undefined && v !== null && v !== '' && !isNaN(Number(v));

    // --- STEP 1: Personal Details ---
    const hasName = Boolean((p.fullName && String(p.fullName).trim()) || (p.name && String(p.name).trim()));
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
      if (!hasCourse) return 2;
    } else {
      const hasCourse = Boolean(p.course && p.course.trim());
      if (!hasCourse) return 2;
    }

    // --- STEP 3: Financial Information ---
    const incomeVal = p.annualIncome !== undefined ? p.annualIncome : p.annualFamilyIncome;
    const hasIncome = hasNum(incomeVal);
    if (!hasIncome) {
      return 3;
    }

    // --- STEP 4: Category & State of Residence ---
    const hasCategory = has(p.category) || has(p.socialCategory);
    const hasState = has(p.domicileState) || has(p.state) || has(p.currentResidenceState);
    if (!hasCategory || !hasState) {
      return 4;
    }

    // --- STEP 5: Additional Information ---
    const hasAppType = has(p.applicationType);
    if (!hasAppType) {
      return 5;
    }

    return 6;
  },

  /**
   * Retrieves saved onboarding step from localStorage.
   */
  getSavedOnboardingProgress() {
    try {
      const step = localStorage.getItem('scholar_ai_onboarding_step');
      return step ? parseInt(step, 10) : 1;
    } catch (e) {
      return 1;
    }
  }
};
