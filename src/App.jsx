import React, { useState, useEffect } from 'react';
import { StudentProfileProvider, useStudentProfile } from './context/StudentProfileContext';
import { profileService } from './services/profileService';
import AnimatedBackground from './components/ui/AnimatedBackground';
import ScrollProgress from './components/ui/ScrollProgress';
import PillNav from './components/ui/PillNav';
import HeroSection from './components/landing/HeroSection';
import BuiltForIndiaSection from './components/landing/BuiltForIndiaSection';
import HowItWorksSection from './components/landing/HowItWorksSection';
import ScholarshipTypes from './components/landing/ScholarshipTypes';
import WhyScholarAI from './components/landing/WhyScholarAI';
import FinalCTASection from './components/landing/FinalCTASection';
import Footer from './components/layout/Footer';
import AuthModal from './components/auth/AuthModal';

import OnboardingWizard from './components/onboarding/OnboardingWizard';
import EligibilityAnalysisScreen from './components/analysis/EligibilityAnalysisScreen';
import ScholarshipResultsView from './components/results/ScholarshipResultsView';
import StudentDashboard from './components/dashboard/StudentDashboard';
import AdminIntelligencePanel from './components/admin/AdminIntelligencePanel';

import { CheckCircle2, RefreshCw, ServerCrash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Profile-loading status banner ───────────────────────────────────────────
// Shown non-blocking inside the dashboard when the backend is slow/asleep.
function ProfileErrorBanner({ profileError, onRetry, profileLoading }) {
  if (!profileError && !profileLoading) return null;

  if (profileLoading) {
    return (
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-lg text-xs text-slate-500">
        <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        Connecting to server...
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 px-4 py-2.5 rounded-full bg-white border border-amber-200 shadow-lg text-xs text-amber-700">
        <ServerCrash className="w-4 h-4 flex-shrink-0" />
        <span>{profileError}</span>
        <button
          onClick={onRetry}
          className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          Retry
        </button>
      </div>
    );
  }

  return null;
}

function MainAppContent() {
  const {
    currentUser,
    profile,
    signOut,
    // authLoading: true ONLY while Supabase resolves the session (~200 ms max)
    authLoading,
    // profileLoading: true while Spring Boot /api/profile is in-flight
    profileLoading,
    // profileStatus: 'loading' | 'loaded' | 'not_found' | 'error'
    profileStatus,
    // profileError: set when backend times out or fails
    profileError,
    retryProfile,
    recalculateBackendEligibility,
    // backwards-compat alias (= authLoading)
    loading
  } = useStudentProfile();

  // Read initial route from URL (defaulting strictly to 'landing' for '/')
  const getInitialView = () => {
    if (typeof window === 'undefined') return 'landing';
    const path = window.location.pathname.toLowerCase().replace(/\/$/, '');
    if (path === '/dashboard') return 'dashboard';
    if (path === '/onboarding') return 'onboarding';
    if (path === '/analysis') return 'analysis';
    if (path === '/results') return 'results';
    if (path === '/admin') return 'admin';
    return 'landing';
  };

  const getInitialAuthMode = () => {
    if (typeof window === 'undefined') return 'signin';
    const path = window.location.pathname.toLowerCase().replace(/\/$/, '');
    if (path === '/signup' || path === '/register') return 'signup';
    return 'signin';
  };

  const getInitialAuthModalOpen = () => {
    if (typeof window === 'undefined') return false;
    const path = window.location.pathname.toLowerCase().replace(/\/$/, '');
    return path === '/login' || path === '/signin' || path === '/signup' || path === '/register';
  };

  const [view, setView] = useState(getInitialView);
  const [authModalOpen, setAuthModalOpen] = useState(getInitialAuthModalOpen);
  const [authMode, setAuthMode] = useState(getInitialAuthMode);
  const [userNotification, setUserNotification] = useState(null);

  // Sync state navigation with browser URL
  const navigateToView = (newView) => {
    setView(newView);
    const targetPath = newView === 'landing' ? '/' : `/${newView}`;
    if (typeof window !== 'undefined' && window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }
  };

  // Handle browser Back / Forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase().replace(/\/$/, '');
      if (path === '/dashboard') setView('dashboard');
      else if (path === '/onboarding') setView('onboarding');
      else if (path === '/analysis') setView('analysis');
      else if (path === '/results') setView('results');
      else if (path === '/admin') setView('admin');
      else if (path === '/login' || path === '/signin') {
        setView('landing');
        setAuthMode('signin');
        setAuthModalOpen(true);
      } else if (path === '/signup' || path === '/register') {
        setView('landing');
        setAuthMode('signup');
        setAuthModalOpen(true);
      } else {
        setView('landing');
        setAuthModalOpen(false);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Route protection & Centralized Onboarding Guard.
  // Strictly redirect to onboarding ONLY when profileStatus === 'not_found' or onboarding is incomplete.
  // Do NOT redirect during loading, error, Render cold-start, token refresh, or realtime disconnection.
  useEffect(() => {
    // Wait until auth resolves before making routing decisions
    if (authLoading) return;

    const isProtected = ['dashboard', 'onboarding', 'analysis', 'results', 'admin'].includes(view);

    // 1. Unauthenticated users cannot access protected views
    if (isProtected && !currentUser) {
      setView('landing');
      if (window.location.pathname !== '/login') {
        window.history.replaceState(null, '', '/login');
      }
      setAuthMode('signin');
      setAuthModalOpen(true);
      return;
    }

    // 2. Authenticated routing checks
    if (currentUser) {
      // While profile is loading or in connection error state, do NOT redirect
      if (profileStatus === 'loading' || profileStatus === 'error' || profileStatus === 'unauthenticated') {
        return;
      }

      // If profile is confirmed absent from database (brand new account)
      if (profileStatus === 'not_found') {
        const requiresCompletedOnboarding = ['dashboard', 'results', 'analysis'].includes(view);
        if (requiresCompletedOnboarding) {
          console.log('[OnboardingGuard] Profile not found in database for', view, '-> Redirecting to /onboarding');
          setView('onboarding');
          if (window.location.pathname !== '/onboarding') {
            window.history.replaceState(null, '', '/onboarding');
          }
        }
        return;
      }

      // If profile is loaded from database
      if (profileStatus === 'loaded') {
        const firstIncomplete = profileService.getFirstIncompleteStep(profile);
        const isCompleted = Boolean(profile?.onboardingComplete || profile?.isOnboarded) || firstIncomplete === 6;

        if (isCompleted) {
          // If already completed and user lands on /onboarding (e.g. via direct URL or back button), redirect to /dashboard
          if (view === 'onboarding') {
            console.log('[OnboardingGuard] User already completed onboarding -> Redirecting to /dashboard');
            setView('dashboard');
            if (window.location.pathname !== '/dashboard') {
              window.history.replaceState(null, '', '/dashboard');
            }
          }
        } else {
          // If incomplete, require completion before accessing dashboard / analysis / results
          const requiresCompletedOnboarding = ['dashboard', 'results', 'analysis'].includes(view);
          if (requiresCompletedOnboarding) {
            console.log('[OnboardingGuard] Incomplete profile for', view, '-> Redirecting to /onboarding');
            setView('onboarding');
            if (window.location.pathname !== '/onboarding') {
              window.history.replaceState(null, '', '/onboarding');
            }
          }
        }
      }
    }
  }, [view, currentUser, authLoading, profileStatus, profile?.onboardingComplete, profile?.isOnboarded, profile]);

  const handleOpenAuth = (mode = 'signin') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
    const targetPath = mode === 'signup' ? '/signup' : '/login';
    if (typeof window !== 'undefined' && window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }
  };

  const handleCloseAuth = () => {
    setAuthModalOpen(false);
    if (typeof window !== 'undefined' && ['/login', '/signin', '/signup', '/register'].includes(window.location.pathname.toLowerCase())) {
      window.history.replaceState(null, '', '/');
    }
  };

  const handleAuthSuccess = (authData) => {
    setAuthModalOpen(false);
    setUserNotification('Welcome to Scholar AI! Authentication successful.');
    setTimeout(() => {
      setUserNotification(null);
    }, 3000);

    // SIGN UP FLOW: A newly registered user goes to onboarding step 1
    if (authMode === 'signup') {
      navigateToView('onboarding');
      return;
    }

    // SIGN IN FLOW: Navigate immediately to dashboard.
    // The onboarding guard will only redirect if database confirms profile is not_found or incomplete.
    navigateToView('dashboard');
  };

  const handleLogout = async () => {
    await signOut();
    navigateToView('landing');
  };

  const handleStartCheckEligibility = async () => {
    // 1. Unauthenticated users -> Prompt Login / Signup modal
    if (authLoading) return;
    if (!currentUser) {
      handleOpenAuth('signup');
      return;
    }

    // 2. While profile is loading from database/backend, inform user and await resolution
    if (profileStatus === 'loading' || profileLoading) {
      setUserNotification('Checking your saved profile...');
      let attempts = 0;
      while ((profileStatus === 'loading' || profileLoading) && attempts < 30) {
        await new Promise((r) => setTimeout(r, 100));
        attempts++;
      }
    }

    // 3. Profile API Error -> Show error/retry, DO NOT navigate to onboarding
    if (profileStatus === 'error') {
      setUserNotification('Could not connect to profile service. Please click Retry.');
      return;
    }

    // 4. If profile is loaded from database
    if (profileStatus === 'loaded') {
      const firstIncomplete = profileService.getFirstIncompleteStep(profile);
      const isCompleted = Boolean(profile?.onboardingComplete || profile?.isOnboarded) || firstIncomplete === 6;

      if (isCompleted) {
        // Run/re-run eligibility matching against the latest scholarship catalog
        try {
          if (typeof recalculateBackendEligibility === 'function') {
            await recalculateBackendEligibility();
          }
        } catch (e) {
          console.warn('[EligibilityEntry] Recalculation notice:', e.message);
        }
        // Seamlessly route to analysis screen to display live matching animation and land on dashboard
        navigateToView('analysis');
        return;
      } else {
        // Incomplete profile - resume onboarding from incomplete step
        navigateToView('onboarding');
        return;
      }
    }

    // 5. Brand new user with confirmed no profile in database
    if (profileStatus === 'not_found') {
      navigateToView('onboarding');
      return;
    }

    // Fallback
    navigateToView('onboarding');
  };

  const handleNavClick = (href) => {
    if (view !== 'landing') {
      navigateToView('landing');
      setTimeout(() => {
        const targetElement = document.querySelector(href);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const targetElement = document.querySelector(href);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // ── Full-screen loader: ONLY blocks on Supabase session restore ───────────────
  // Maximum display time: ~200 ms (localStorage read) to ~2 s (Supabase network).
  // Never waits for the Spring Boot backend.
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-md flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
        </div>
        <div className="text-center">
          <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">Scholar AI</h3>
          <p className="text-xs text-slate-500 mt-0.5">Checking your session...</p>
        </div>
      </div>
    );
  }

  // Auth is resolved — render the application.
  const isProtected = ['dashboard', 'onboarding', 'analysis', 'results', 'admin'].includes(view);
  const requiresOnboarding = ['dashboard', 'results'].includes(view);

  // Strictly sanitize view rendering so unauthenticated users never see unpermitted views.
  // Only redirect to onboarding when confirmed not_found in DB.
  const activeView = (!currentUser && isProtected)
    ? 'landing'
    : (currentUser && requiresOnboarding && profileStatus === 'not_found')
      ? 'onboarding'
      : view;

  const isLandingPage = activeView === 'landing';
  const isLightPage = activeView === 'onboarding' || activeView === 'analysis' || activeView === 'results' || activeView === 'dashboard';

  return (
    <div className={`relative min-h-screen ${isLightPage ? 'bg-[#F8F9FB] text-slate-900' : 'bg-[#030d17] text-white'} flex flex-col selection:bg-blue-600 selection:text-white transition-colors duration-300`}>
      {/* Scroll Progress Bar - Landing Only */}
      {isLandingPage && <ScrollProgress />}

      {/* Animated Background - Landing Only */}
      {isLandingPage && <AnimatedBackground />}

      {/* Top Navigation Bar - Landing Only */}
      {isLandingPage && (
        <PillNav
          logo="/logo.svg"
          logoAlt="Scholar AI Logo"
          brandText="Scholar AI"
          items={[
            { label: 'Home', href: '#hero' },
            { label: 'How It Works', href: '#how-it-works' },
            { label: 'Scholarships', href: '#scholarships' },
            { label: 'Why Us', href: '#why-us' }
          ]}
          activeHref="#hero"
          ease="power2.easeOut"
          baseColor="#000000"
          pillColor="#ffffff"
          hoveredPillTextColor="#ffffff"
          pillTextColor="#000000"
          currentUser={currentUser}
          onAuthClick={(mode) => handleOpenAuth(mode || 'signin')}
          onCheckEligibilityClick={handleStartCheckEligibility}
          onNavClick={handleNavClick}
          onGoToDashboard={() => {
            navigateToView(profileStatus === 'not_found' ? 'onboarding' : 'dashboard');
          }}
          onLogout={handleLogout}
        />
      )}

      {/* Main View Router */}
      <main className={`flex-grow z-10 ${isLandingPage ? 'pt-4' : 'pt-0'}`}>
        <AnimatePresence mode="wait">
          {/* VIEW 1: LANDING PAGE */}
          {activeView === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <HeroSection
                currentUser={currentUser}
                onCheckEligibilityClick={handleStartCheckEligibility}
                onAuthClick={(mode) => handleOpenAuth(mode)}
              />
              <ScholarshipTypes onCheckEligibilityClick={handleStartCheckEligibility} />
              <HowItWorksSection onCheckEligibilityClick={handleStartCheckEligibility} />
              <BuiltForIndiaSection onCheckEligibilityClick={handleStartCheckEligibility} />
              <WhyScholarAI />
              <FinalCTASection onCheckEligibilityClick={handleStartCheckEligibility} />
              <Footer onAuthClick={(mode) => handleOpenAuth(mode)} />
            </motion.div>
          )}

          {/* VIEW 2: LIGHT-THEMED STRUCTURED ONBOARDING WIZARD */}
          {activeView === 'onboarding' && (
            <motion.div
              key="onboarding"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full"
            >
              <OnboardingWizard
                onComplete={() => navigateToView('analysis')}
                onCancel={() => navigateToView('landing')}
              />
            </motion.div>
          )}

          {/* VIEW 3: LIGHT-THEMED ELIGIBILITY ANALYSIS */}
          {activeView === 'analysis' && (
            <motion.div
              key="analysis"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <EligibilityAnalysisScreen
                onAnalysisComplete={() => navigateToView('dashboard')}
              />
            </motion.div>
          )}

          {/* VIEW 4: SCHOLARSHIP MATCH RESULTS & EXPLAINABILITY */}
          {activeView === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="pt-10 pb-16"
            >
              <ScholarshipResultsView
                onGoToDashboard={() => navigateToView('dashboard')}
              />
            </motion.div>
          )}

          {/* VIEW 5: STUDENT DASHBOARD (CLEAN LIGHT SAAS APPLICATION VIEW) */}
          {activeView === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full min-h-screen bg-[#F8F9FB]"
            >
              <StudentDashboard
                onOpenOnboarding={() => navigateToView('onboarding')}
                onOpenAdmin={() => navigateToView('admin')}
                onGoToHome={() => navigateToView('landing')}
                onLogout={handleLogout}
              />
            </motion.div>
          )}

          {/* VIEW 6: ADMIN SCHOLARSHIP INTELLIGENCE PANEL */}
          {activeView === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pt-10 pb-16 px-4 max-w-7xl mx-auto"
            >
              <AdminIntelligencePanel
                onBackToDashboard={() => navigateToView('dashboard')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Global Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={handleCloseAuth}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Non-blocking profile loading / error banner (bottom-center pill) */}
      {currentUser && (
        <ProfileErrorBanner
          profileError={profileError}
          profileLoading={profileLoading}
          onRetry={retryProfile}
        />
      )}

      {/* Notification Toast */}
      <AnimatePresence>
        {userNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-800 shadow-2xl backdrop-blur-xl"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span className="text-xs sm:text-sm font-semibold">{userNotification}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper used inside handleAuthSuccess without importing profileService directly
function profileService_getFirstIncompleteStep(p) {
  if (!p) return 1;
  if (p.onboardingComplete === true || p.isOnboarded === true) return 6;
  return 1;
}

export default function App() {
  return (
    <StudentProfileProvider>
      <MainAppContent />
    </StudentProfileProvider>
  );
}
