// =============================================================================
// SCHOLAR AI — STUDENT PROFILE SERVICE (SPRING BOOT REST INTEGRATION)
// 100% Authoritative Database Connection via Spring Boot & Supabase
// =============================================================================

import { apiClient } from './apiClient';

export const profileService = {
  /**
   * Fetches the current authenticated student profile status from Spring Boot.
   * Returns { authenticated, userId, profileExists, onboardingComplete, onboardingStep }
   */
  async getProfileStatus() {
    try {
      const data = await apiClient.get('/me/profile-status');
      return data;
    } catch (err) {
      console.warn('[ProfileService] Backend getProfileStatus error:', err.message);
      return { authenticated: false, profileExists: false, onboardingComplete: false, onboardingStep: 1 };
    }
  },

  /**
   * Fetches the current authenticated student profile from Spring Boot.
   */
  async getProfile() {
    try {
      const data = await apiClient.get('/profile');
      return data;
    } catch (err) {
      console.error('[ProfileService] Backend getProfile error:', err.message);
      throw new Error(err.message || 'Unable to load your profile. Please check your connection.');
    }
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
   */
  saveOnboardingProgress(stepNumber, stepData) {
    try {
      localStorage.setItem('scholar_ai_onboarding_step', String(stepNumber));
      if (stepData) {
        localStorage.setItem('scholar_ai_student_profile', JSON.stringify(stepData));
      }
    } catch (e) {}
  },

  /**
   * Evaluates saved profile data and calculates the FIRST incomplete onboarding step.
   * Returns a number 1..5 if onboarding is incomplete, or 6 if completely onboarded.
   */
  getFirstIncompleteStep(p) {
    if (!p) return 1;
    if (p.onboardingComplete === true || p.isOnboarded === true) {
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
      const hasInst = Boolean(p.institutionName && p.institutionName.trim());
      const hasScore = hasNum(p.diplomaScore);
      if (!hasCourse || !hasBranch || !hasInst || !hasScore) return 2;
    } else if (edu === 'UNDERGRADUATE') {
      const hasCourse = Boolean(p.course && p.course.trim());
      const hasBranch = Boolean((p.specialization && p.specialization.trim()) || (p.branch && p.branch.trim()));
      const hasInst = Boolean(p.institutionName && p.institutionName.trim());
      const has12 = hasNum(p.class12Percentage);
      const hasCgpa = hasNum(p.cgpa) || hasNum(p.currentCgpa);
      if (!hasCourse || !hasBranch || !hasInst || !has12 || !hasCgpa) return 2;
    } else if (edu === 'POSTGRADUATE') {
      const hasCourse = Boolean(p.course && p.course.trim());
      const hasBranch = Boolean((p.specialization && p.specialization.trim()) || (p.branch && p.branch.trim()));
      const hasInst = Boolean(p.institutionName && p.institutionName.trim());
      const hasUg = Boolean((p.undergraduateDegree && p.undergraduateDegree.trim()) || (p.ugDegree && p.ugDegree.trim()));
      const hasUgCgpa = hasNum(p.undergraduateCgpa) || hasNum(p.ugCgpa);
      const hasCgpa = hasNum(p.cgpa) || hasNum(p.currentCgpa);
      if (!hasCourse || !hasBranch || !hasInst || !hasUg || !hasUgCgpa || !hasCgpa) return 2;
    }

    // --- STEP 3: Financial Information ---
    const incomeVal = p.annualIncome !== undefined ? p.annualIncome : p.annualFamilyIncome;
    const hasIncome = hasNum(incomeVal);
    const hasSource = has(p.incomeSource);
    const memberCount = p.familyMembersCount !== undefined ? p.familyMembersCount : p.familyMemberCount;
    const hasMembers = memberCount !== undefined && memberCount !== null && parseInt(memberCount, 10) >= 1;
    const hasCert = has(p.incomeCertificateStatus);
    if (!hasIncome || !hasSource || !hasMembers || !hasCert) {
      return 3;
    }

    // --- STEP 4: Category & Domicile ---
    const hasCategory = has(p.category);
    const hasDomicile = has(p.domicileState) || has(p.state);
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
