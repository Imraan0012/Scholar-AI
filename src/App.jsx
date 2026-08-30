import React, { useState, useEffect } from 'react';
import { StudentProfileProvider, useStudentProfile } from './context/StudentProfileContext';
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

import { CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function MainAppContent() {
  const { currentUser, profile, signOut, loading } = useStudentProfile();
  
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

  // Route protection & Centralized Onboarding Guard
  useEffect(() => {
    if (loading) return;

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

    // 2. Incomplete onboarding profiles cannot access dashboard or results
    if (currentUser) {
      const isCompleted = Boolean(profile?.onboardingComplete || profile?.isOnboarded);
      const requiresCompletedOnboarding = ['dashboard', 'results', 'analysis'].includes(view);
      if (requiresCompletedOnboarding && !isCompleted) {
        console.log('[OnboardingGuard] Incomplete profile blocked from', view, '-> Redirecting to /onboarding');
        setView('onboarding');
        if (window.location.pathname !== '/onboarding') {
          window.history.replaceState(null, '', '/onboarding');
        }
      }
    }
  }, [view, currentUser, loading, profile?.onboardingComplete, profile?.isOnboarded]);

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

    // SIGN UP FLOW: A newly registered user MUST ALWAYS go to onboarding step 1
    if (authMode === 'signup') {
      navigateToView('onboarding');
      return;
    }

    // SIGN IN FLOW: Check persisted Supabase profile status dynamically
    const userProfile = authData?.profile || profile;
    const firstIncomplete = profileService.getFirstIncompleteStep(userProfile);
    const isComplete = firstIncomplete === 6 || Boolean(
      authData?.onboardingComplete ||
      authData?.profile?.onboardingComplete ||
      authData?.profile?.isOnboarded ||
      profile?.onboardingComplete ||
      profile?.isOnboarded
    );

    if (isComplete) {
      navigateToView('dashboard');
    } else {
      navigateToView('onboarding');
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigateToView('landing');
  };

  const handleStartCheckEligibility = async () => {
    if (!currentUser) {
      handleOpenAuth('signup');
      return;
    }
    const isCompleted = Boolean(profile?.onboardingComplete || profile?.isOnboarded);
    if (isCompleted) {
      navigateToView('dashboard');
    } else {
      navigateToView('onboarding');
    }
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

  // Prevent redirect race conditions during initial auth and profile fetch
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-md flex items-center justify-center animate-spin">
          <div className="w-6 h-6 border-3 border-[#2563EB] border-t-transparent rounded-full" />
        </div>
        <div className="text-center">
          <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">Scholar AI</h3>
          <p className="text-xs text-slate-500 mt-0.5">Verifying authentication & profile intelligence...</p>
        </div>
      </div>
    );
  }

  const isProtected = ['dashboard', 'onboarding', 'analysis', 'results', 'admin'].includes(view);
  const requiresOnboarding = ['dashboard', 'results'].includes(view);
  const isOnboarded = Boolean(profile?.onboardingComplete || profile?.isOnboarded);

  // Strictly sanitize view rendering so unauthenticated/incomplete users never see unpermitted views
  const activeView = (!currentUser && isProtected)
    ? 'landing'
    : (currentUser && requiresOnboarding && !isOnboarded)
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
            const isCompleted = Boolean(profile?.onboardingComplete || profile?.isOnboarded);
            navigateToView(isCompleted ? 'dashboard' : 'onboarding');
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
              <BuiltForIndiaSection onCheckEligibilityClick={handleStartCheckEligibility} />
              <HowItWorksSection onCheckEligibilityClick={handleStartCheckEligibility} />
              <ScholarshipTypes onCheckEligibilityClick={handleStartCheckEligibility} />
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

export default function App() {
  return (
    <StudentProfileProvider>
      <MainAppContent />
    </StudentProfileProvider>
  );
}
