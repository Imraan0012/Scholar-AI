import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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

export const StudentProfileProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile] = useState(() => createEmptyProfile(null));

  const [scholarships, setScholarships] = useState(MASTER_SCHOLARSHIP_REGISTRY);
  const [bookmarks, setBookmarks] = useState([]);
  const [savedApplications, setSavedApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUserData = useCallback(async (user) => {
    if (!user?.id) {
      setProfile(createEmptyProfile(null));
      setBookmarks([]);
      setSavedApplications([]);
      setNotifications([]);
      return;
    }

    const [userProfile, userBookmarks, userApps, userNotifs] = await Promise.all([
      profileService.getProfile(user.id).catch(() => null),
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
    try {
      localStorage.setItem('scholar_ai_student_profile', JSON.stringify(cleanProfile));
      localStorage.setItem('scholar_ai_onboarding_step', String(step));
    } catch (e) {}

    setBookmarks(Array.isArray(userBookmarks) ? userBookmarks : []);
    setSavedApplications(Array.isArray(userApps) ? userApps : []);
    setNotifications(Array.isArray(userNotifs) ? userNotifs : []);
  }, []);

  useEffect(() => {
    let mounted = true;

    async function initSession() {
      try {
        const user = await authService.getCurrentUser();
        if (mounted) {
          if (user) {
            setCurrentUser(user);
            await loadUserData(user);
          } else {
            setCurrentUser(null);
            setProfile(createEmptyProfile(null));
            setBookmarks([]);
            setSavedApplications([]);
            setNotifications([]);
          }
        }
      } catch (err) {
        if (mounted) {
          setCurrentUser(null);
          setProfile(createEmptyProfile(null));
        }
      }

      try {
        const { scholarships: fetchedList } = await scholarshipService.getScholarships();
        if (mounted && fetchedList && fetchedList.length > 0) {
          setScholarships(fetchedList);
        }
      } catch (err) {
        // Fallback to registry
      }

      if (mounted) setLoading(false);
    }

    initSession();

    const unsubscribeAuth = authService.onAuthStateChange(async (event, user) => {
      if (!mounted) return;
      if (event === 'INITIAL_SESSION') {
        // Handled by initSession
        return;
      }
      if (user) {
        setCurrentUser(user);
        await loadUserData(user);
      } else {
        setCurrentUser(null);
        setProfile(createEmptyProfile(null));
        setBookmarks([]);
        setSavedApplications([]);
        setNotifications([]);
      }
    });

    return () => {
      mounted = false;
      unsubscribeAuth();
    };
  }, [loadUserData]);

  // Real-time notifications subscription for authenticated user
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

  const [evaluationResults, setEvaluationResults] = useState(() => {
    return eligibilityService.evaluateAll(profile, scholarships);
  });

  // Calculate deterministic evaluation instantly whenever profile or scholarships change
  useEffect(() => {
    const evaluated = eligibilityService.evaluateAll(profile, scholarships);
    setEvaluationResults(evaluated);
  }, [profile, scholarships]);

  // Recalculate from backend on demand (e.g. for analysis view)
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

  const updateProfile = useCallback((updates) => {
    setProfile(prev => {
      const merged = { ...prev, ...updates };
      try {
        localStorage.setItem('scholar_ai_student_profile', JSON.stringify(merged));
      } catch (e) {}
      return merged;
    });

    // Non-blocking asynchronous sync to backend
    if (currentUser?.id) {
      profileService.saveProfile(updates).catch(err => {
        console.warn('[StudentProfileContext] Background profile sync notice:', err.message);
      });
    }
  }, [currentUser?.id]);

  const toggleBookmark = useCallback(async (scholarshipId) => {
    const { bookmarks: updated } = await bookmarkService.toggleBookmark(currentUser?.id, scholarshipId);
    setBookmarks(updated);
  }, [currentUser]);

  const isBookmarked = useCallback((scholarshipId) => {
    return bookmarks.includes(scholarshipId);
  }, [bookmarks]);

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

  const signIn = async (email, password) => {
    const res = await authService.signIn({ email, password });
    if (res.success && res.user) {
      setCurrentUser(res.user);
      const empty = createEmptyProfile(res.user);
      const firstIncomplete = profileService.getFirstIncompleteStep(res.profile);
      const isCompleted = firstIncomplete === 6 || Boolean(res.profile?.onboardingComplete || res.profile?.isOnboarded || res.onboardingComplete);
      const step = isCompleted ? 6 : firstIncomplete;
      const cleanProfile = {
        ...empty,
        ...(res.profile || {}),
        isOnboarded: isCompleted,
        onboardingComplete: isCompleted,
        onboardingStep: step
      };
      setProfile(cleanProfile);
      try {
        localStorage.setItem('scholar_ai_student_profile', JSON.stringify(cleanProfile));
        localStorage.setItem('scholar_ai_onboarding_step', String(step));
      } catch (e) {}
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
      try {
        localStorage.setItem('scholar_ai_student_profile', JSON.stringify(cleanProfile));
        localStorage.setItem('scholar_ai_onboarding_step', '1');
      } catch (e) {}
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
      localStorage.removeItem('scholar_ai_user_bookmarks');
      localStorage.removeItem('scholar_ai_saved_applications');
      localStorage.removeItem('scholar_ai_student_profile');
      localStorage.removeItem('scholar_ai_user_notifications');
      localStorage.removeItem('scholar_ai_onboarding_step');
    }
  };

  const resetPasswordForEmail = async (email) => {
    return await authService.resetPasswordForEmail(email);
  };

  const updatePassword = async (newPassword) => {
    return await authService.updatePassword(newPassword);
  };

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
        loading,
        profileCompletionScore
      }}
    >
      {children}
    </StudentProfileContext.Provider>
  );
};

export const useStudentProfile = () => useContext(StudentProfileContext);

