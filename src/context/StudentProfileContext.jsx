import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { authService } from '../services/authService';
import { profileService } from '../services/profileService';
import { scholarshipService } from '../services/scholarshipService';
import { eligibilityService } from '../services/eligibilityService';
import { bookmarkService, applicationService } from '../services/bookmarkService';
import { notificationService } from '../services/notificationService';
import { MASTER_SCHOLARSHIP_REGISTRY } from '../data/scholarships/index';

const StudentProfileContext = createContext();

export const createEmptyProfile = (user = null) => {
  const meta = user?.user_metadata || {};
  const fullName = meta.full_name || meta.name || user?.name || '';
  const email = user?.email || '';

  return {
    fullName,
    dob: '',
    gender: '',
    nationality: 'INDIAN',
    mobile: '',
    email,
    isAadhaarVerified: false,
    educationLevel: 'UNDERGRADUATE',
    course: '',
    specialization: '',
    studyMode: '',
    courseType: 'FULL_TIME',
    currentYear: '',
    currentSemester: 1,
    admissionYear: '',
    intendedAdmissionYear: '',
    expectedGraduationYear: '',
    institutionName: '',
    universityName: '',
    institutionType: '',
    institutionState: '',
    institutionDistrict: '',
    isHosteller: false,
    class10Board: 'CBSE',
    class10PassingYear: 2020,
    class10Percentage: '',
    class10School: '',
    class12Board: 'State Board',
    class12Stream: 'Science',
    class12PassingYear: 2022,
    class12Percentage: '',
    class12School: '',
    diplomaCourse: '',
    diplomaScore: '',
    undergraduateDegree: '',
    undergraduateCgpa: '',
    pgCourse: '',
    pgCgpa: '',
    hasDiploma: false,
    cgpa: '',
    hasBacklogs: false,
    familyMembersCount: '',
    earningMembersCount: '',
    dependentSiblingsCount: '',
    fatherOccupation: '',
    motherOccupation: '',
    annualIncome: '',
    annualFamilyIncome: '',
    incomeSource: '',
    hasIncomeCertificate: false,
    incomeCertificateStatus: '',
    incomeCertIssuedBy: '',
    incomeCertIssueDate: '',
    category: '',
    obcNclStatus: '',
    obcCertStatus: '',
    ewsCertStatus: '',
    categoryCertStatus: '',
    casteCertStatus: '',
    isMinority: false,
    minorityCommunity: '',
    minorityDocStatus: 'NOT_APPLICABLE',
    hasCasteCertificate: false,
    hasEwsCertificate: false,
    currentResidenceState: '',
    currentResidenceDistrict: '',
    currentPincode: '',
    domicileState: '',
    domicileDistrict: '',
    domicileCertStatus: '',
    hasDomicileCertificate: false,
    hasDisability: false,
    disabilityPercentage: '',
    disabilityCertStatus: '',
    isOrphan: false,
    orphanDocStatus: '',
    isSingleParentHousehold: false,
    isExServicemanWard: false,
    exServicemanServiceStatus: '',
    exServicemanDocStatus: '',
    isSingleGirlChild: false,
    singleGirlChildProofStatus: '',
    isFarmerFamily: false,
    isFirstGenLearner: false,
    isCurrentlyReceivingScholarship: false,
    currentScholarshipName: '',
    currentScholarshipProvider: '',
    previouslyReceivedScholarship: false,
    applicationType: '',
    uploadedDocumentIds: [],
    isOnboarded: false,
    onboardingComplete: false,
    onboardingStep: 1,
    preferences: {
      types: ['TUITION_FEE', 'MONTHLY_STIPEND', 'HOSTEL'],
      minAmount: 10000
    }
  };
};

// ─── Safe localStorage helpers ────────────────────────────────────────────────
function readProfileHint() {
  try {
    const raw = localStorage.getItem('scholar_ai_profile_hint');
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
}

function writeProfileHint(profileExists, onboardingCompleted) {
  try {
    localStorage.setItem('scholar_ai_profile_hint', JSON.stringify({
      profileExists,
      onboardingCompleted,
      cachedAt: Date.now()
    }));
  } catch (e) {}
}

function clearProfileHint() {
  try {
    localStorage.removeItem('scholar_ai_profile_hint');
  } catch (e) {}
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export const StudentProfileProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile] = useState(() => createEmptyProfile(null));
  const [scholarships, setScholarships] = useState(MASTER_SCHOLARSHIP_REGISTRY);
  const [bookmarks, setBookmarks] = useState([]);
  const [savedApplications, setSavedApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // ── Granular loading states ─────────────────────────────────────────────────
  // authLoading: true only while Supabase resolves the session (~200 ms).
  //   The full-screen loader in App.jsx is gated on this.
  const [authLoading, setAuthLoading] = useState(true);
  // profileLoading: true while Spring Boot /api/profile is in-flight.
  //   Never blocks the whole app — only shows skeletons inside profile sections.
  const [profileLoading, setProfileLoading] = useState(false);
  // profileError: message string when backend failed/timed out; null otherwise.
  const [profileError, setProfileError] = useState(null);

  // ── Initialization guard ─────────────────────────────────────────────────────
  // Prevents React StrictMode double-invocation from running initSession twice.
  const initStarted = useRef(false);

  // ── Scholarship loader (non-blocking) ────────────────────────────────────────
  const loadScholarshipsAsync = useCallback(() => {
    scholarshipService.getScholarships().then(({ scholarships: fetchedList }) => {
      if (fetchedList && fetchedList.length > 0) {
        setScholarships(fetchedList);
      }
    }).catch(() => {
      // Silently fall back to the local registry already in state
    });
  }, []);

  // ── Profile + auxiliary data loader ─────────────────────────────────────────
  const loadUserData = useCallback(async (user, { isRetry = false } = {}) => {
    if (!user?.id) {
      setProfile(createEmptyProfile(null));
      setBookmarks([]);
      setSavedApplications([]);
      setNotifications([]);
      return;
    }

    setProfileLoading(true);
    if (!isRetry) setProfileError(null);

    try {
      // Profile fetch — can time-out (AbortController in apiClient).
      // Bookmarks / apps / notifs are lightweight Supabase calls, run in parallel.
      const [userProfile, userBookmarks, userApps, userNotifs] = await Promise.all([
        profileService.getProfile(user.id).catch((err) => {
          // Re-throw so we can set profileError below
          throw err;
        }),
        bookmarkService.getBookmarks(user.id).catch(() => []),
        applicationService.getApplications(user.id).catch(() => []),
        notificationService.getNotifications(user.id).catch(() => [])
      ]);

      const empty = createEmptyProfile(user);
      const firstIncomplete = profileService.getFirstIncompleteStep(userProfile);
      const isCompleted = firstIncomplete === 6 || Boolean(userProfile?.onboardingComplete || userProfile?.isOnboarded);
      const step = isCompleted ? 6 : firstIncomplete;

      const cleanProfile = {
        ...empty,
        ...(userProfile || {}),
        isOnboarded: isCompleted,
        onboardingComplete: isCompleted,
        onboardingStep: step
      };

      setProfile(cleanProfile);
      setProfileError(null);

      // Cache only harmless hint — never the full profile data
      writeProfileHint(true, isCompleted);
      try {
        localStorage.setItem('scholar_ai_onboarding_step', String(step));
      } catch (e) {}

      setBookmarks(Array.isArray(userBookmarks) ? userBookmarks : []);
      setSavedApplications(Array.isArray(userApps) ? userApps : []);
      setNotifications(Array.isArray(userNotifs) ? userNotifs : []);
    } catch (err) {
      const isTimeout = err?.isTimeout === true;
      const msg = isTimeout
        ? 'Server is waking up — this may take a moment.'
        : 'Could not load your profile. Check your connection.';

      console.warn('[StudentProfileContext] loadUserData error:', err.message);
      setProfileError(msg);
      // Do NOT sign the user out or clear their session on profile failure.
      // Do NOT redirect to onboarding on failure.
    } finally {
      setProfileLoading(false);
    }
  }, []);

  // ── Retry handler (callable from UI) ────────────────────────────────────────
  const retryProfile = useCallback(() => {
    if (currentUser) {
      loadUserData(currentUser, { isRetry: true });
    }
  }, [currentUser, loadUserData]);

  // ── Main initialization effect ───────────────────────────────────────────────
  useEffect(() => {
    // Guard against React StrictMode double-invoke
    if (initStarted.current) return;
    initStarted.current = true;

    let mounted = true;

    async function initSession() {
      // ── Phase 1: Resolve Supabase session ───────────────────────────────────
      // This is the ONLY thing that holds the full-screen loader.
      // Supabase reads from localStorage — should resolve in < 200 ms.
      let user = null;
      try {
        user = await authService.getCurrentUser();
      } catch (err) {
        console.warn('[StudentProfileContext] Supabase session error:', err.message);
      }

      if (!mounted) return;

      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
        setProfile(createEmptyProfile(null));
        setBookmarks([]);
        setSavedApplications([]);
        setNotifications([]);
      }

      // ── Phase 2: App is now unblocked — clear authLoading ───────────────────
      setAuthLoading(false);

      // ── Phase 3: Non-blocking background fetches ─────────────────────────────
      // IMPORTANT: Only fetch backend data when the user is authenticated.
      // Public routes (/, /signup, /login) must never contact the Render backend.
      if (user) {
        // loadUserData manages its own profileLoading / profileError state
        loadUserData(user);
        // Scholarships: load async for authenticated users only
        loadScholarshipsAsync();
      }
    }

    initSession();

    // ── Auth state change listener ──────────────────────────────────────────────
    const unsubscribeAuth = authService.onAuthStateChange(async (event, user) => {
      if (!mounted) return;

      // INITIAL_SESSION is handled by initSession — ignore to prevent duplicate fetch
      if (event === 'INITIAL_SESSION') return;

      if (user) {
        setCurrentUser(user);
        loadUserData(user);
      } else {
        setCurrentUser(null);
        setProfile(createEmptyProfile(null));
        setBookmarks([]);
        setSavedApplications([]);
        setNotifications([]);
        setProfileLoading(false);
        setProfileError(null);
        clearProfileHint();
      }
    });

    return () => {
      mounted = false;
      unsubscribeAuth();
    };
  }, [loadUserData, loadScholarshipsAsync]);

  // ── Real-time notifications subscription ────────────────────────────────────
  useEffect(() => {
    if (!currentUser?.id) return;

    const unsubscribeNotifs = typeof notificationService?.subscribeToUserNotifications === 'function'
      ? notificationService.subscribeToUserNotifications(
          currentUser.id,
          async () => {
            const refreshed = await notificationService.getNotifications(currentUser.id);
            setNotifications(refreshed);
          }
        )
      : () => {};

    return () => {
      if (typeof unsubscribeNotifs === 'function') unsubscribeNotifs();
    };
  }, [currentUser?.id]);

  // ── Eligibility evaluation ────────────────────────────────────────────────────
  const [evaluationResults, setEvaluationResults] = useState(() => {
    return eligibilityService.evaluateAll(profile, scholarships);
  });

  useEffect(() => {
    const evaluated = eligibilityService.evaluateAll(profile, scholarships);
    setEvaluationResults(evaluated);
  }, [profile, scholarships]);

  const recalculateBackendEligibility = useCallback(async () => {
    if (currentUser?.id) {
      try {
        const backendEval = await eligibilityService.getEvaluations();
        if (backendEval) {
          setEvaluationResults(backendEval);
          return backendEval;
        }
      } catch (err) {
        console.warn('[StudentProfileContext] Backend evaluation fetch notice:', err.message);
      }
    }
    const localEval = eligibilityService.evaluateAll(profile, scholarships);
    setEvaluationResults(localEval);
    return localEval;
  }, [currentUser?.id, profile, scholarships]);

  // ── Profile mutation ──────────────────────────────────────────────────────────
  const updateProfile = useCallback((updates) => {
    setProfile(prev => {
      const merged = { ...prev, ...updates };
      return merged;
    });

    // Non-blocking async sync to backend
    if (currentUser?.id) {
      profileService.saveProfile(updates).catch(err => {
        console.warn('[StudentProfileContext] Background profile sync notice:', err.message);
      });
    }
  }, [currentUser?.id]);

  // ── Bookmarks ─────────────────────────────────────────────────────────────────
  const toggleBookmark = useCallback(async (scholarshipId) => {
    const { bookmarks: updated } = await bookmarkService.toggleBookmark(currentUser?.id, scholarshipId);
    setBookmarks(updated);
  }, [currentUser]);

  const isBookmarked = useCallback((scholarshipId) => {
    return bookmarks.includes(scholarshipId);
  }, [bookmarks]);

  // ── Applications ──────────────────────────────────────────────────────────────
  const saveApplication = useCallback(async (scholarship, customStatus = 'APPLIED') => {
    const updated = await applicationService.recordAction(currentUser?.id, scholarship, customStatus);
    setSavedApplications(updated);
  }, [currentUser]);

  const updateApplicationStatus = useCallback(async (scholarshipId, newStatus) => {
    const updated = await applicationService.updateStatus(currentUser?.id, scholarshipId, newStatus);
    setSavedApplications(updated);
  }, [currentUser]);

  const removeApplication = useCallback(async (scholarshipId) => {
    const updated = await applicationService.removeApplication(currentUser?.id, scholarshipId);
    setSavedApplications(updated);
  }, [currentUser]);

  const clearApplications = useCallback(async () => {
    const updated = await applicationService.clearAllApplications(currentUser?.id);
    setSavedApplications(updated);
  }, [currentUser]);

  // ── Auth helpers ──────────────────────────────────────────────────────────────
  const signIn = async (email, password) => {
    const res = await authService.signIn({ email, password });
    if (res.success && res.user) {
      setCurrentUser(res.user);
      // Profile will be loaded by the onAuthStateChange listener or can be
      // triggered explicitly here for immediate feedback.
      loadUserData(res.user);
    }
    return res;
  };

  const signUp = async (email, password, fullName) => {
    const res = await authService.signUp({ email, password, fullName });
    if (res.success && res.user && res.session) {
      setCurrentUser(res.user);
      const empty = createEmptyProfile(res.user);
      const cleanProfile = {
        ...empty,
        ...(res.profile || {}),
        fullName: fullName || res.profile?.fullName || '',
        email: email || res.profile?.email || '',
        isOnboarded: false,
        onboardingComplete: false,
        onboardingStep: 1
      };
      setProfile(cleanProfile);
      writeProfileHint(true, false);
    }
    return res;
  };

  const signOut = async () => {
    try {
      await authService.signOut();
    } catch (e) {
      console.warn('[StudentProfileContext] signOut notice:', e.message);
    } finally {
      setCurrentUser(null);
      setProfile(createEmptyProfile(null));
      setBookmarks([]);
      setSavedApplications([]);
      setNotifications([]);
      setProfileLoading(false);
      setProfileError(null);
      clearProfileHint();
      try {
        localStorage.removeItem('scholar_ai_user_bookmarks');
        localStorage.removeItem('scholar_ai_saved_applications');
        localStorage.removeItem('scholar_ai_student_profile');
        localStorage.removeItem('scholar_ai_user_notifications');
        localStorage.removeItem('scholar_ai_onboarding_step');
      } catch (e) {}
    }
  };

  const resetPasswordForEmail = async (email) => {
    return await authService.resetPasswordForEmail(email);
  };

  const updatePassword = async (newPassword) => {
    return await authService.updatePassword(newPassword);
  };

  // ── Notifications ─────────────────────────────────────────────────────────────
  const markNotificationRead = useCallback(async (notificationId) => {
    if (!notificationId) return;
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true } : n));
    await notificationService.markAsRead(notificationId, currentUser?.id);
  }, [currentUser?.id]);

  const markAllNotificationsRead = useCallback(async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    await notificationService.markAllAsRead(currentUser?.id);
  }, [currentUser?.id]);

  const deleteNotification = useCallback(async (notificationId) => {
    if (!notificationId) return;
    const updated = await notificationService.deleteNotification(notificationId, currentUser?.id);
    setNotifications(updated);
  }, [currentUser?.id]);

  const clearNotifications = useCallback(async () => {
    const updated = await notificationService.clearAllNotifications(currentUser?.id);
    setNotifications(updated);
  }, [currentUser?.id]);

  const addNotification = useCallback(async (notifData) => {
    const created = await notificationService.createNotification(currentUser?.id, notifData);
    if (created) {
      setNotifications(prev => [created, ...prev]);
    }
    return created;
  }, [currentUser?.id]);

  const unreadNotificationCount = notifications.filter(n => !n.read).length;
  const profileCompletionScore = profileService.calculateCompletion(profile);

  // ── Backwards-compatible `loading` alias ─────────────────────────────────────
  // Some child components may still read `loading`. Expose it as authLoading so
  // they continue to work during the transition without requiring mass refactor.
  const loading = authLoading;

  return (
    <StudentProfileContext.Provider
      value={{
        currentUser,
        profile,
        updateProfile,
        scholarships,
        setScholarships,
        evaluationResults,
        savedApplications,
        saveApplication,
        updateApplicationStatus,
        removeApplication,
        clearApplications,
        bookmarks,
        toggleBookmark,
        isBookmarked,
        notifications,
        unreadNotificationCount,
        markNotificationRead,
        markAllNotificationsRead,
        deleteNotification,
        clearNotifications,
        addNotification,
        signIn,
        signUp,
        signOut,
        resetPasswordForEmail,
        updatePassword,
        recalculateBackendEligibility,
        retryProfile,
        // Granular loading states
        authLoading,
        profileLoading,
        profileError,
        // Backwards-compat alias (authLoading only — never profile)
        loading,
        profileCompletionScore
      }}
    >
      {children}
    </StudentProfileContext.Provider>
  );
};

export const useStudentProfile = () => useContext(StudentProfileContext);
