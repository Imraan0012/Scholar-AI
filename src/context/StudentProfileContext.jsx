import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { authService } from '../services/authService';
import { profileService } from '../services/profileService';
import { scholarshipService } from '../services/scholarshipService';
import { eligibilityService } from '../services/eligibilityService';
import { bookmarkService, applicationService } from '../services/bookmarkService';
import { notificationService } from '../services/notificationService';
import { MASTER_SCHOLARSHIP_REGISTRY } from '../data/scholarships/index';

const StudentProfileContext = createContext();

// ─── Default clean student profile template ──────────────────────────────────
export function createEmptyProfile(user = null) {
  const meta = user?.user_metadata || {};
  const fullName = meta.full_name || meta.name || user?.name || '';
  const email = user?.email || '';

  return {
    id: null,
    userId: user?.id || null,
    fullName,
    email,
    phone: meta.phone || user?.phone || '',
    mobile: meta.phone || user?.phone || '',
    dateOfBirth: '',
    dob: '',
    nationality: 'INDIAN',
    gender: 'MALE',

    // Academic Background
    educationLevel: 'UNDERGRADUATE',
    course: '',
    branch: '',
    specialization: '',
    currentYear: 1,
    admissionYear: new Date().getFullYear(),
    institutionName: '',
    institutionType: 'Government',
    studyMode: 'FULL_TIME',
    class10Percentage: '',
    class12Percentage: '',
    undergraduateCgpa: '',
    postgraduateCgpa: '',
    currentCgpa: '',
    cgpa: '',

    // Financial Information
    annualFamilyIncome: '',
    annualIncome: '',
    incomeSource: 'SALARY',
    fatherOccupation: '',
    motherOccupation: '',
    familyMemberCount: 4,
    familyMembersCount: 4,
    earningMemberCount: 1,
    earningMembersCount: 1,
    hasIncomeCertificate: false,
    incomeCertificateStatus: 'NO',

    // Category & Domicile
    category: 'GENERAL',
    socialCategory: 'GENERAL',
    isObcNcl: false,
    isEws: false,
    hasCategoryCertificate: false,
    hasCasteCertificate: false,
    domicileState: '',
    state: '',
    hasDomicileCertificate: false,
    pincode: '',
    currentPincode: '',

    // Additional Information
    hasDisability: false,
    isPwd: false,
    disabilityPercentage: 0,
    hasUdidCard: false,
    isFarmerFamily: false,
    farmerFamily: false,
    isFirstGraduate: false,
    isFirstGenLearner: false,
    isWardOfDefenseOrCapf: false,
    isExServicemanWard: false,
    isSingleParent: false,
    isSingleParentHousehold: false,
    isOrphan: false,
    isSingleGirlChild: false,
    isMinority: false,
    minorityCommunity: '',
    existingScholarship: '',
    applicationType: 'FRESH',
    competitiveExamName: '',
    competitiveExamScore: '',
    competitiveExamRank: '',

    // Workflow State
    isOnboarded: false,
    onboardingComplete: false,
    onboardingStep: 1,
    profileCompletionScore: 0,
    profileCompletion: 0,
    documentStatuses: {},
    uploadedFiles: {}
  };
}

// Lightweight hint storage to prevent screen flash on reload
function writeProfileHint(profileExists, onboardingCompleted) {
  try {
    localStorage.setItem('scholar_ai_profile_hint', JSON.stringify({
      profileExists,
      onboardingCompleted,
      cachedAt: Date.now()
    }));
  } catch (e) { }
}

function clearProfileHint() {
  try {
    localStorage.removeItem('scholar_ai_profile_hint');
  } catch (e) { }
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export const StudentProfileProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile] = useState(() => createEmptyProfile(null));
  const [scholarships, setScholarships] = useState(MASTER_SCHOLARSHIP_REGISTRY);
  const [bookmarks, setBookmarks] = useState([]);
  const [savedApplications, setSavedApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // ── Granular loading & status states ─────────────────────────────────────────
  // authLoading: true only while Supabase resolves the session (~200 ms).
  const [authLoading, setAuthLoading] = useState(true);
  // profileLoading: true while Spring Boot /api/profile or Supabase is in-flight.
  const [profileLoading, setProfileLoading] = useState(false);
  // profileRefreshing: true during background silent syncs.
  const [profileRefreshing, setProfileRefreshing] = useState(false);
  // profileStatus: 'unauthenticated' | 'loading' | 'loaded' | 'not_found' | 'error'
  const [profileStatus, setProfileStatus] = useState('unauthenticated');
  // profileError: message string when backend failed/timed out; null otherwise.
  const [profileError, setProfileError] = useState(null);

  // ── Initialization guard ─────────────────────────────────────────────────────
  const initStarted = useRef(false);

  // ── Ref to track latest profile synchronously for race-free background syncs ──
  const profileRef = useRef(profile);
  useEffect(() => {
    profileRef.current = profile;
  }, [profile]);

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
  const loadUserData = useCallback(async (user, { isRetry = false, isBackground = false } = {}) => {
    if (!user?.id) {
      setProfile(createEmptyProfile(null));
      setProfileStatus('unauthenticated');
      setProfileLoading(false);
      setProfileRefreshing(false);
      setBookmarks([]);
      setSavedApplications([]);
      setNotifications([]);
      return;
    }

    if (isBackground) {
      setProfileRefreshing(true);
    } else {
      setProfileLoading(true);
      setProfileStatus('loading');
      if (!isRetry) setProfileError(null);
    }

    try {
      const [userProfile, userBookmarks, userApps, userNotifs] = await Promise.all([
        profileService.getProfile(user.id).catch((err) => {
          throw err;
        }),
        bookmarkService.getBookmarks(user.id).catch(() => []),
        applicationService.getApplications(user.id).catch(() => []),
        notificationService.getNotifications(user.id).catch(() => [])
      ]);

      const empty = createEmptyProfile(user);

      if (userProfile && (userProfile.id || userProfile.fullName || userProfile.educationLevel || userProfile.course || userProfile.onboardingComplete || userProfile.annualFamilyIncome != null)) {
        const firstIncomplete = profileService.getFirstIncompleteStep(userProfile);
        // Completion is determined SOLELY by explicit persisted completion flag
        const isCompleted = Boolean(userProfile.onboardingComplete === true || userProfile.isOnboarded === true || userProfile.onboarding_complete === true);
        const persistedStep = userProfile.onboardingStep || userProfile.onboarding_step;
        const step = isCompleted ? 5 : (persistedStep ? Math.min(5, Math.max(1, Number(persistedStep))) : Math.min(5, Math.max(1, firstIncomplete)));

        console.log(`[PROFILE] profileExists=true onboardingCompleted=${isCompleted} onboardingStep=${step}`);

        const cleanProfile = {
          ...empty,
          ...userProfile,
          isOnboarded: isCompleted,
          onboardingComplete: isCompleted,
          onboardingStep: step
        };

        setProfile(cleanProfile);
        setProfileStatus('loaded');
        setProfileError(null);

        writeProfileHint(true, isCompleted);
        try {
          profileService.saveOnboardingProgress(step, cleanProfile, user.id);
        } catch (e) { }
      } else {
        console.log('[PROFILE] profileExists=false onboardingCompleted=false onboardingStep=1');
        // If we already have a loaded, completed profile in memory, do NOT downgrade to not_found on empty background sync
        if (profileRef.current?.id && (profileRef.current?.onboardingComplete || profileRef.current?.isOnboarded)) {
          console.log('[StudentProfileContext] Retaining existing in-memory completed profile despite empty background response');
          setProfileStatus('loaded');
        } else {
          setProfile(empty);
          setProfileStatus('not_found');
          setProfileError(null);
          writeProfileHint(false, false);
        }
      }

      setBookmarks(Array.isArray(userBookmarks) ? userBookmarks : []);
      setSavedApplications(Array.isArray(userApps) ? userApps : []);
      setNotifications(Array.isArray(userNotifs) ? userNotifs : []);
    } catch (err) {
      console.warn('[StudentProfileContext] loadUserData notice:', err.message);

      // If we already have a loaded profile in memory, NEVER change profileStatus to error or not_found!
      if (profileRef.current?.id || profileRef.current?.onboardingComplete || profileRef.current?.course) {
        setProfileStatus('loaded');
      } else {
        setProfileStatus('error');
      }

      const isTimeout = err?.isTimeout === true || err?.status === 408;
      const msg = isTimeout
        ? 'Server is waking up — click Retry in a moment.'
        : 'Could not connect to profile service. Click Retry.';
      setProfileError(msg);
    } finally {
      setProfileLoading(false);
      setProfileRefreshing(false);
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
    if (initStarted.current) return;
    initStarted.current = true;

    let mounted = true;

    async function initSession() {
      let user = null;
      try {
        user = await authService.getCurrentUser();
      } catch (err) {
        console.warn('[StudentProfileContext] Supabase session error:', err.message);
      }

      if (!mounted) return;

      if (user) {
        setCurrentUser(user);
        setProfileStatus('loading');
      } else {
        setCurrentUser(null);
        setProfile(createEmptyProfile(null));
        setProfileStatus('unauthenticated');
        setBookmarks([]);
        setSavedApplications([]);
        setNotifications([]);
      }

      setAuthLoading(false);

      if (user) {
        loadUserData(user);
        loadScholarshipsAsync();
      }
    }

    initSession();

    // ── Auth state change listener ──────────────────────────────────────────────
    const unsubscribeAuth = authService.onAuthStateChange(async (event, user) => {
      if (!mounted) return;

      if (event === 'INITIAL_SESSION') return;

      // TOKEN_REFRESHED: maintain existing profile intact, do NOT reset status or trigger destructive redirects
      if (event === 'TOKEN_REFRESHED') {
        if (user) setCurrentUser(user);
        return;
      }

      if (event === 'SIGNED_IN' || (event === 'USER_UPDATED' && user)) {
        if (user) {
          setCurrentUser(user);
          // If we already have this user's profile loaded and marked complete in memory, perform silent background sync
          const currentProfile = profileRef.current;
          if (currentProfile?.userId === user.id && (currentProfile?.onboardingComplete || currentProfile?.isOnboarded)) {
            loadUserData(user, { isBackground: true });
          } else {
            setProfileStatus('loading');
            loadUserData(user);
          }
        }
      } else if (event === 'SIGNED_OUT' || !user) {
        setCurrentUser(null);
        setProfile(createEmptyProfile(null));
        setProfileStatus('unauthenticated');
        setBookmarks([]);
        setSavedApplications([]);
        setNotifications([]);
        setProfileLoading(false);
        setProfileRefreshing(false);
        setProfileError(null);
        clearProfileHint();
      }
    });

    return () => {
      mounted = false;
      unsubscribeAuth();
    };
  }, [loadUserData, loadScholarshipsAsync]);

  // ── Real-time scholarship & sources subscription ───────────────────────────
  useEffect(() => {
    const unsubscribeScholarships = scholarshipService.subscribeToScholarshipChanges?.((payload) => {
      console.log('[StudentProfileContext] Realtime scholarship update received:', payload?.eventType);
      loadScholarshipsAsync();
    });

    return () => {
      if (typeof unsubscribeScholarships === 'function') {
        unsubscribeScholarships();
      }
    };
  }, [loadScholarshipsAsync]);

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
      : () => { };

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
    setProfileStatus('loaded');
    setProfile(prev => {
      const merged = { ...prev, ...updates };
      if (updates.onboardingComplete === true || updates.isOnboarded === true) {
        merged.onboardingComplete = true;
        merged.isOnboarded = true;
        merged.onboardingStep = 5;
      }
      return merged;
    });

    // Atomic sync to both Supabase and Spring Boot backend
    if (currentUser?.id) {
      profileService.saveProfile(updates, currentUser.id).catch(err => {
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

  // ── Auth helpers ──────────────────────────────────────────────────────────────
  const signIn = async (email, password) => {
    const res = await authService.signIn({ email, password });
    if (res.success && res.user) {
      setCurrentUser(res.user);
      setProfileStatus('loading');
      setProfileLoading(true);
      loadUserData(res.user);
    }
    return res;
  };

  const signUp = async (email, password, fullName) => {
    const res = await authService.signUp({ email, password, fullName });
    if (res.success && res.user && res.session) {
      setCurrentUser(res.user);
      setProfileStatus('not_found');
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
      writeProfileHint(false, false);
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
      setProfileStatus('unauthenticated');
      setBookmarks([]);
      setSavedApplications([]);
      setNotifications([]);
      setProfileLoading(false);
      setProfileRefreshing(false);
      setProfileError(null);
      clearProfileHint();
      try {
        localStorage.removeItem('scholar_ai_user_bookmarks');
        localStorage.removeItem('scholar_ai_saved_applications');
        localStorage.removeItem('scholar_ai_student_profile');
        localStorage.removeItem('scholar_ai_user_notifications');
        localStorage.removeItem('scholar_ai_onboarding_step');
      } catch (e) { }
    }
  };

  const resetPasswordForEmail = async (email) => {
    return await authService.resetPasswordForEmail(email);
  };

  const updatePassword = async (newPassword) => {
    return await authService.updatePassword(newPassword);
  };

  const profileCompletionScore = profileService.calculateCompletion ? profileService.calculateCompletion(profile) : (profile.onboardingComplete ? 100 : 50);
  const loading = authLoading;

  return (
    <StudentProfileContext.Provider
      value={{
        currentUser,
        profile,
        onboardingCompleted: Boolean(profile?.onboardingComplete === true || profile?.isOnboarded === true),
        onboardingStep: profile?.onboardingStep || 1,
        scholarships,
        bookmarks,
        savedApplications,
        notifications,
        authLoading,
        profileLoading,
        profileRefreshing,
        profileStatus,
        profileError,
        retryProfile,
        recalculateBackendEligibility,
        updateProfile,
        toggleBookmark,
        isBookmarked,
        saveApplication,
        updateApplicationStatus,
        removeApplication,
        clearApplications,
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
        setScholarships,
        loading,
        profileCompletionScore
      }}
    >
      {children}
    </StudentProfileContext.Provider>
  );
};

export const useStudentProfile = () => useContext(StudentProfileContext);
