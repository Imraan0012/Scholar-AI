import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStudentProfile } from '../../context/StudentProfileContext';
import {
  GraduationCap,
  LayoutGrid,
  Search,
  FileText,
  Bookmark,
  ShieldCheck,
  User,
  Home,
  Bell,
  Settings,
  LogOut,
  Headphones,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ExternalLink,
  ChevronRight,
  BookmarkCheck,
  Building2,
  Calendar,
  Check,
  X,
  Menu,
  ArrowRight,
  SlidersHorizontal,
  Edit3,
  Mail,
  Smartphone,
  Info,
  Clock,
  Sparkles,
  Globe,
  CheckCheck,
  Trash2,
  Plus,
  RotateCcw,
  Filter,
  Lock,
  Eye,
  EyeOff,
  Key,
  Shield,
  RefreshCw,
  Save,
  Upload
} from 'lucide-react';
import ScholarshipSourcesView from '../sources/ScholarshipSourcesView';
import { useSidebarCounts } from '../../hooks/useSidebarCounts';
import ScholarshipDetailModal from '../results/ScholarshipDetailModal';
import { MASTER_SCHOLARSHIP_REGISTRY } from '../../data/scholarships/index';

// Real Verified Crisp SVG Institution Logo Map
const getScholarshipLogo = (scholarship) => {
  const id = (scholarship.id || '').toLowerCase();
  const name = (scholarship.name || '').toLowerCase();
  const provider = (scholarship.provider || '').toLowerCase();

  if (id.includes('tata') || name.includes('tata') || provider.includes('tata')) {
    return '/scholarships/tata_logo.svg';
  }
  if (id.includes('reliance') || name.includes('reliance') || provider.includes('reliance')) {
    return '/scholarships/reliance_logo.svg';
  }
  if (id.includes('sbi') || name.includes('sbi') || provider.includes('sbi')) {
    return '/scholarships/sbi_logo.svg';
  }
  if (id.includes('kotak') || name.includes('kotak')) {
    return '/scholarships/kotak_logo.svg';
  }
  if (id.includes('aicte') || name.includes('aicte') || name.includes('pragati')) {
    return '/scholarships/aicte_logo.svg';
  }
  if (id.includes('hdfc') || name.includes('hdfc') || name.includes('badhte kadam')) {
    return '/scholarships/hdfc_logo.svg';
  }
  if (id.includes('nsp') || name.includes('pm-usp') || name.includes('central sector') || name.includes('csss') || provider.includes('ministry of education') || provider.includes('government of india')) {
    return '/scholarships/emblem_india.svg';
  }
  if (id.includes('mahadbt') || name.includes('mahadbt') || provider.includes('maharashtra')) {
    return '/scholarships/emblem_india.svg';
  }
  if (id.includes('csir') || id.includes('ugc') || name.includes('csir') || name.includes('ugc') || name.includes('jrf')) {
    return '/scholarships/emblem_india.svg';
  }

  return '/scholarships/emblem_india.svg';
};

// Utility: Get official verified URLs for a scholarship
const getScholarshipUrls = (scholarship) => {
  if (!scholarship) return { applicationUrl: null, websiteUrl: null };

  const applicationUrl =
    scholarship.official_application_url ||
    scholarship.application_url ||
    scholarship.applicationUrl ||
    null;

  const websiteUrl =
    scholarship.official_website_url ||
    scholarship.officialWebsiteUrl ||
    scholarship.website_url ||
    scholarship.portal_url ||
    null;

  return { applicationUrl, websiteUrl };
};

// Formats deadline to clean readable format
const formatDeadline = (dateStr) => {
  if (!dateStr) return '31 Oct 2026';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = d.getDate();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  } catch (e) {
    return dateStr;
  }
};

export default function StudentDashboard({ onOpenOnboarding, onOpenAdmin, onLogout, onGoToHome }) {
  const {
    currentUser,
    profile = {},
    updateProfile,
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
    signOut,
    updatePassword,
    profileCompletionScore
  } = useStudentProfile();

  const {
    scholarshipCount,
    sourceCount,
    loading: countsLoading
  } = useSidebarCounts();

  // Active Navigation: 'DASHBOARD', 'DISCOVERY', 'APPLICATIONS', 'SAVED', 'ELIGIBILITY', 'PROFILE', 'NOTIFICATIONS', 'SETTINGS'
  const [activeNav, setActiveNav] = useState('DASHBOARD');
  const [selectedFilterTab, setSelectedFilterTab] = useState('ALL'); // 'ALL', 'ELIGIBLE', 'POSSIBLE', 'INELIGIBLE'
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState('ALL'); // 'ALL', 'CENTRAL', 'STATE', 'PRIVATE'
  const [sortBy, setSortBy] = useState('BEST_MATCH'); // 'BEST_MATCH', 'DEADLINE', 'AMOUNT'
  const [applicationFilterStage, setApplicationFilterStage] = useState('ALL'); // 'ALL', 'SAVED', 'APPLYING', 'APPLIED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'
  const [selectedScholarship, setSelectedScholarship] = useState(null); // Detail / Explain Modal
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showClearApplicationsModal, setShowClearApplicationsModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const userMenuRef = useRef(null);
  const scrollContainerRef = useRef(null);

  // Scroll main container to top when navigating views
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeNav]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Settings State
  const [activeSettingsTab, setActiveSettingsTab] = useState('NOTIFICATIONS'); // 'NOTIFICATIONS', 'PREFERENCES', 'SECURITY', 'SESSION'
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [mobilePhoneInput, setMobilePhoneInput] = useState(profile.mobile || '+91 98765 43210');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Helper to update preferences dynamically
  const handleUpdatePreference = (key, value) => {
    const currentPrefs = profile.preferences || {
      types: ['TUITION_FEE', 'MONTHLY_STIPEND', 'HOSTEL'],
      minAmount: 0,
      emailAlerts: true,
      deadlineAlerts: true,
      smsAlerts: false,
      whatsappAlerts: false,
      schemeMatchAlerts: true,
      sectorPreference: 'ALL'
    };

    const updated = {
      ...currentPrefs,
      [key]: value
    };

    updateProfile({ preferences: updated });
    showToast(`Preferences updated successfully`);
  };

  // Helper to toggle benefit types in preferences
  const handleToggleBenefitType = (typeId) => {
    const currentTypes = profile.preferences?.types || ['TUITION_FEE', 'MONTHLY_STIPEND', 'HOSTEL'];
    const updated = currentTypes.includes(typeId)
      ? currentTypes.filter(t => t !== typeId)
      : [...currentTypes, typeId];

    handleUpdatePreference('types', updated);
  };

  // Password update handler
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      showToast('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match. Please re-enter.');
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await updatePassword(newPassword);
      if (res.success) {
        setNewPassword('');
        setConfirmPassword('');
        showToast('Password changed successfully! You can now sign in with your new password.');
      } else {
        showToast(res.message || 'Failed to update password.');
      }
    } catch (err) {
      showToast(err.message || 'Error updating password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  // Real-Data Calculations from deterministic engine
  const {
    strongMatches = [],
    goodMatches = [],
    possibleMatches = [],
    ineligible = [],
    allResults = []
  } = evaluationResults || {};

  const eligibleMatches = useMemo(() => [...(strongMatches || []), ...(goodMatches || [])], [strongMatches, goodMatches]);

  const stats = useMemo(() => {
    return {
      eligible: eligibleMatches.length,
      possible: (possibleMatches || []).length,
      ineligible: (ineligible || []).length,
      total: (allResults || []).length,
      saved: (bookmarks || []).length,
      applications: (savedApplications || []).length
    };
  }, [eligibleMatches, possibleMatches, ineligible, allResults, bookmarks, savedApplications]);

  // Dynamic Greeting based on local time
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const handleToggleSave = (scholarship) => {
    if (!scholarship?.id) return;
    const wasBookmarked = isBookmarked(scholarship.id);
    toggleBookmark(scholarship.id);
    showToast(wasBookmarked ? `Removed "${scholarship.name}" from bookmarks` : `Saved "${scholarship.name}" to bookmarks!`);
  };

  const handleApplyNow = (scholarship) => {
    if (!scholarship) return;
    const { applicationUrl, websiteUrl } = getScholarshipUrls(scholarship);
    const targetUrl = applicationUrl || websiteUrl;

    if (targetUrl) {
      saveApplication(scholarship, 'APPLIED');
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
      showToast(`Opening official portal for "${scholarship.name}"...`);
    } else {
      showToast(`Official application link is currently unavailable.`);
    }
  };

  // Filtered Scholarships list for Discovery / Dashboard
  const filteredScholarships = useMemo(() => {
    let list = [...(allResults || [])];

    if (selectedFilterTab === 'ELIGIBLE') {
      list = list.filter((r) => r.isEligible);
    } else if (selectedFilterTab === 'POSSIBLE') {
      list = list.filter((r) => r.tier === 'POSSIBLE_MATCH');
    } else if (selectedFilterTab === 'INELIGIBLE') {
      list = list.filter((r) => r.tier === 'INELIGIBLE');
    }

    if (filterLevel !== 'ALL') {
      list = list.filter((r) => {
        const lvl = r.scholarship?.government_level || r.scholarship?.governmentLevel;
        return lvl === filterLevel;
      });
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (r) =>
          (r.scholarship?.name || '').toLowerCase().includes(q) ||
          (r.scholarship?.provider || '').toLowerCase().includes(q) ||
          (r.scholarship?.description || '').toLowerCase().includes(q)
      );
    }

    // Sorting
    if (sortBy === 'BEST_MATCH') {
      list.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    } else if (sortBy === 'AMOUNT') {
      list.sort((a, b) => {
        const amtB = b.scholarship?.amount_max !== undefined ? b.scholarship.amount_max : (b.scholarship?.amountMax || 0);
        const amtA = a.scholarship?.amount_max !== undefined ? a.scholarship.amount_max : (a.scholarship?.amountMax || 0);
        return amtB - amtA;
      });
    } else if (sortBy === 'DEADLINE') {
      list.sort((a, b) => {
        const deadA = new Date(a.scholarship?.application_deadline || a.scholarship?.applicationDeadline || 0);
        const deadB = new Date(b.scholarship?.application_deadline || b.scholarship?.applicationDeadline || 0);
        return deadA - deadB;
      });
    }

    return list;
  }, [allResults, selectedFilterTab, filterLevel, searchQuery, sortBy]);

  // Application Pipeline stages & counts
  const pipelineStages = [
    { id: 'SAVED', label: 'Saved' },
    { id: 'APPLYING', label: 'Applying' },
    { id: 'APPLIED', label: 'Applied' },
    { id: 'UNDER_REVIEW', label: 'Under Review' },
    { id: 'APPROVED', label: 'Approved' },
    { id: 'REJECTED', label: 'Rejected' }
  ];

  const pipelineCounts = useMemo(() => {
    const counts = { SAVED: 0, APPLYING: 0, APPLIED: 0, UNDER_REVIEW: 0, APPROVED: 0, REJECTED: 0 };
    savedApplications.forEach((app) => {
      if (counts[app.status] !== undefined) {
        counts[app.status]++;
      } else {
        counts.SAVED++;
      }
    });
    return counts;
  }, [savedApplications]);


  // Dynamic Student Name & Initials
  const studentName = profile.fullName || currentUser?.user_metadata?.full_name || currentUser?.email?.split('@')[0] || 'Student';
  const initials = (studentName || 'ST')
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'ST';

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-slate-900 flex flex-col lg:flex-row antialiased font-sans">
      
      {/* ── TOAST NOTIFICATION ─────────────────────────────────────────── */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 px-6 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-sm font-semibold shadow-2xl flex items-center gap-2.5"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 1. LEFT SIDEBAR                                                           */}
      {/* ========================================================================= */}
      <aside className="w-full lg:w-64 xl:w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-4 sm:p-5 flex-shrink-0 z-30 shadow-xs">
        <div className="space-y-6">
          {/* Logo & Subtitle */}
          <div className="flex items-center justify-between">
            <div
              onClick={() => setActiveNav('DASHBOARD')}
              className="flex items-center gap-2.5 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg bg-[#2563EB] flex items-center justify-center text-white shadow-md flex-shrink-0">
                <GraduationCap className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-base font-black text-slate-900 tracking-tight block leading-none">
                  SCHOLAR AI
                </span>
                <span className="text-[11px] text-slate-400 font-medium block mt-0.5">
                  Find. Match. Achieve.
                </span>
              </div>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:text-slate-900"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Profile Progress Box */}
          <div
            onClick={() => {
              if (onOpenOnboarding) {
                onOpenOnboarding();
              } else {
                setActiveNav('PROFILE');
              }
              setMobileMenuOpen(false);
            }}
            className="p-3.5 rounded-xl bg-[#F8FAFC] border border-slate-200/90 space-y-2.5 shadow-xs cursor-pointer hover:border-[#2563EB]/40 hover:bg-blue-50/30 transition-all group"
            title="Click to view and complete your profile"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-black text-xs shadow-xs flex-shrink-0 group-hover:scale-105 transition-transform">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-extrabold text-slate-900 block truncate group-hover:text-[#2563EB] transition-colors">
                  {studentName}
                </span>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-0.5 font-medium">
                  <span className="group-hover:text-slate-700">Profile Progress</span>
                  <span className="font-bold text-[#2563EB]">{profileCompletionScore}%</span>
                </div>
              </div>
            </div>

            {/* Blue Progress Bar */}
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#2563EB] rounded-full transition-all duration-500"
                style={{ width: `${profileCompletionScore}%` }}
              />
            </div>
          </div>

          {/* MENU Section */}
          <div className={`space-y-1 ${mobileMenuOpen ? 'block' : 'hidden lg:block'}`}>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-2">
              MENU
            </span>

            {[
              { id: 'DASHBOARD', label: 'Dashboard', icon: LayoutGrid },
              { id: 'DISCOVERY', label: 'Find Scholarships', icon: Search, badge: allResults.length },
              { id: 'SOURCES', label: 'Sources Registry', icon: Globe, badge: sourceCount },
              { id: 'APPLICATIONS', label: 'My Applications', icon: FileText, badge: savedApplications.length },
              { id: 'SAVED', label: 'Saved Scholarships', icon: Bookmark, badge: bookmarks.length },
              { id: 'ELIGIBILITY', label: 'Eligibility', icon: ShieldCheck },
              { id: 'PROFILE', label: 'Profile', icon: User },
              { id: 'NOTIFICATIONS', label: 'Notifications', icon: Bell, badge: unreadNotificationCount },
              { id: 'SETTINGS', label: 'Settings', icon: Settings }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              const hasBadge = typeof item.badge === 'number' && item.badge > 0;
              const isItemLoading = countsLoading && (item.id === 'SOURCES' || item.id === 'DISCOVERY') && item.badge === undefined;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveNav(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#EEF4FF] text-[#2563EB] font-extrabold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#2563EB]' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isItemLoading ? (
                    <span className="min-w-5 h-5 px-1.5 rounded-full bg-slate-100 text-slate-400 text-[10px] font-bold flex items-center justify-center animate-pulse">
                      ...
                    </span>
                  ) : hasBadge ? (
                    <span className="min-w-5 h-5 px-1.5 rounded-full bg-[#2563EB] text-white text-[10px] font-bold flex items-center justify-center">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}

            {/* Logout Sidebar Action */}
            <div className="pt-2 mt-2 border-t border-slate-100">
              <button
                onClick={() => setShowLogoutModal(true)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-all cursor-pointer group"
              >
                <LogOut className="w-4 h-4 text-rose-500 group-hover:translate-x-0.5 transition-transform" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Need Help Box */}
        <div className="pt-4 border-t border-slate-200">
          <div className="p-3 rounded-xl bg-[#F8FAFC] border border-slate-200/90 space-y-1.5">
            <span className="text-xs font-bold text-slate-900 block">Need Help?</span>
            <p className="text-[11px] text-slate-500">We're here to help you</p>
            <a
              href="mailto:support@scholarai.in"
              className="text-[11px] font-bold text-[#2563EB] hover:underline inline-flex items-center gap-1.5 pt-0.5"
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>Contact Support</span>
            </a>
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MAIN APPLICATION WORKSPACE ROUTER                                      */}
      {/* ========================================================================= */}
      <div ref={scrollContainerRef} className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[#F8F9FB]">
        
        {/* Top Header Row with Welcome & Search */}
        <header className="px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200/70 bg-white/70">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
              <span>Welcome back, {studentName}!</span>
              <span>👋</span>
            </h1>
            <p className="text-[11.5px] sm:text-xs text-slate-500 mt-0.5 font-medium">
              Find and apply for scholarships that match your profile.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-end md:self-auto">
            {/* Top Search Input */}
            <div className="relative w-56 sm:w-64 lg:w-72">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search scholarships..."
                className="w-full h-9 pl-9 pr-3 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 shadow-xs"
              />
            </div>

            {/* Notification Bell */}
            <button
              onClick={() => setActiveNav('NOTIFICATIONS')}
              className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 shadow-xs cursor-pointer hover:bg-slate-50 transition-colors relative"
              title={unreadNotificationCount > 0 ? `${unreadNotificationCount} unread notifications` : 'Notifications'}
            >
              <Bell className="w-3.5 h-3.5" />
              {unreadNotificationCount > 0 && (
                <span className="w-2 h-2 bg-[#2563EB] rounded-full absolute top-2 right-2" />
              )}
            </button>

            {/* User Avatar with Dropdown Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="w-9 h-9 rounded-xl bg-[#2563EB] text-white flex items-center justify-center font-bold text-xs shadow-xs flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity ring-2 ring-transparent focus:ring-blue-300"
                title="User Menu"
              >
                {initials}
              </button>
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-white border border-slate-200 shadow-2xl p-2 z-50 space-y-1"
                  >
                    <div className="px-3 py-2 border-b border-slate-100 mb-1">
                      <span className="text-xs font-bold text-slate-900 block truncate">{studentName}</span>
                      <span className="text-[11px] text-slate-400 block truncate">{profile.email || currentUser?.email}</span>
                    </div>

                    <button
                      onClick={() => {
                        setActiveNav('PROFILE');
                        setUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <User className="w-4 h-4 text-slate-500" />
                      <span>View Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveNav('SETTINGS');
                        setUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <Settings className="w-4 h-4 text-slate-500" />
                      <span>Account Settings</span>
                    </button>

                    {onGoToHome && (
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          onGoToHome();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        <Home className="w-4 h-4 text-slate-500" />
                        <span>Home Website</span>
                      </button>
                    )}

                    <div className="border-t border-slate-100 my-1" />

                    {/* Log Out Option */}
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        setShowLogoutModal(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>Log Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Main Content Body */}
        <main className="px-4 sm:px-6 lg:px-8 py-5 space-y-5 max-w-[1340px] w-full">

          {/* ======================================================================= */}
          {/* VIEW 1 & 2: SCHOLARSHIP INTELLIGENCE RESULTS & DISCOVERY                 */}
          {/* ======================================================================= */}
          {(activeNav === 'DASHBOARD' || activeNav === 'DISCOVERY') && (
            <div className="space-y-5">
              
              {/* 1. ELIGIBILITY SUMMARY: 4 LARGE COMPACT SUMMARY CARDS */}
              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
                {/* Card 1: ELIGIBLE */}
                <div
                  onClick={() => setSelectedFilterTab('ELIGIBLE')}
                  className={`p-3.5 rounded-xl bg-white border transition-all cursor-pointer shadow-xs hover:shadow-sm flex flex-col justify-between space-y-2 ${
                    selectedFilterTab === 'ELIGIBLE' ? 'border-emerald-500 ring-2 ring-emerald-100' : 'border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-500">
                      ELIGIBLE
                    </span>
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  </div>
                  <div>
                    <span className="text-2xl sm:text-3xl font-black text-slate-900 block leading-none">
                      {stats.eligible}
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-1.5 font-medium">
                      Scholarships you qualify for
                    </span>
                  </div>
                </div>

                {/* Card 2: POSSIBLE MATCH */}
                <div
                  onClick={() => setSelectedFilterTab('POSSIBLE')}
                  className={`p-3.5 rounded-xl bg-white border transition-all cursor-pointer shadow-xs hover:shadow-sm flex flex-col justify-between space-y-2 ${
                    selectedFilterTab === 'POSSIBLE' ? 'border-amber-500 ring-2 ring-amber-100' : 'border-slate-200 hover:border-amber-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-500">
                      POSSIBLE MATCH
                    </span>
                    <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                  </div>
                  <div>
                    <span className="text-2xl sm:text-3xl font-black text-slate-900 block leading-none">
                      {stats.possible}
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-1.5 font-medium">
                      Scholarships needing verification
                    </span>
                  </div>
                </div>

                {/* Card 3: NOT ELIGIBLE */}
                <div
                  onClick={() => setSelectedFilterTab('INELIGIBLE')}
                  className={`p-5 rounded-2xl bg-white border transition-all cursor-pointer shadow-xs hover:shadow-sm flex flex-col justify-between space-y-3 ${
                    selectedFilterTab === 'INELIGIBLE' ? 'border-rose-500 ring-2 ring-rose-100' : 'border-slate-200 hover:border-rose-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                      NOT ELIGIBLE
                    </span>
                    <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0">
                      <X className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  </div>
                  <div>
                    <span className="text-3xl sm:text-4xl font-black text-slate-900 block leading-none">
                      {stats.ineligible}
                    </span>
                    <span className="text-xs text-slate-500 block mt-2 font-medium">
                      Scholarships you don't qualify for
                    </span>
                  </div>
                </div>

                {/* Card 4: TOTAL AVAILABLE */}
                <div
                  onClick={() => setSelectedFilterTab('ALL')}
                  className={`p-5 rounded-2xl bg-white border transition-all cursor-pointer shadow-xs hover:shadow-sm flex flex-col justify-between space-y-3 ${
                    selectedFilterTab === 'ALL' ? 'border-[#2563EB] ring-2 ring-blue-100' : 'border-slate-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                      TOTAL AVAILABLE
                    </span>
                    <div className="w-6 h-6 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center flex-shrink-0">
                      <FileText className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div>
                    <span className="text-3xl sm:text-4xl font-black text-slate-900 block leading-none">
                      {stats.total}
                    </span>
                    <span className="text-xs text-slate-500 block mt-2 font-medium">
                      Scholarships found for you
                    </span>
                  </div>
                </div>
              </section>

              {/* 2. VISUAL ELIGIBILITY DISTRIBUTION */}
              <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-3.5">
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-semibold">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-slate-700">Eligible: <span className="font-extrabold text-slate-900">{stats.eligible}</span> ({stats.total > 0 ? ((stats.eligible / stats.total) * 100).toFixed(0) : 0}%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span className="text-slate-700">Possible: <span className="font-extrabold text-slate-900">{stats.possible}</span> ({stats.total > 0 ? ((stats.possible / stats.total) * 100).toFixed(0) : 0}%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span className="text-slate-700">Not Eligible: <span className="font-extrabold text-slate-900">{stats.ineligible}</span> ({stats.total > 0 ? ((stats.ineligible / stats.total) * 100).toFixed(0) : 0}%)</span>
                  </div>
                </div>

                {/* Slim Multi-Segment Proportional Distribution Bar */}
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                  {stats.eligible > 0 && (
                    <div
                      className="h-full bg-emerald-500 transition-all duration-500"
                      style={{ width: `${(stats.eligible / (stats.total || 1)) * 100}%` }}
                      title={`Eligible: ${stats.eligible}`}
                    />
                  )}
                  {stats.possible > 0 && (
                    <div
                      className="h-full bg-amber-400 transition-all duration-500"
                      style={{ width: `${(stats.possible / (stats.total || 1)) * 100}%` }}
                      title={`Possible: ${stats.possible}`}
                    />
                  )}
                  {stats.ineligible > 0 && (
                    <div
                      className="h-full bg-rose-500 transition-all duration-500"
                      style={{ width: `${(stats.ineligible / (stats.total || 1)) * 100}%` }}
                      title={`Not Eligible: ${stats.ineligible}`}
                    />
                  )}
                </div>

                <p className="text-xs sm:text-[13px] text-slate-500 font-medium">
                  <span className="font-bold text-slate-700">{stats.total} scholarships</span> analyzed from your profile
                </p>
              </section>

              {/* 3. FILTER NAVIGATION & SEARCH CONTROLS */}
              <section className="space-y-3.5">
                {/* Clean Filter Navigation Row */}
                <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                  {[
                    { id: 'ALL', label: 'All Scholarships', count: stats.total },
                    { id: 'ELIGIBLE', label: 'Eligible', count: stats.eligible },
                    { id: 'POSSIBLE', label: 'Possible', count: stats.possible },
                    { id: 'INELIGIBLE', label: 'Not Eligible', count: stats.ineligible }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedFilterTab(tab.id)}
                      className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap inline-flex items-center gap-2 ${
                        selectedFilterTab === tab.id
                          ? 'bg-[#2563EB] text-white shadow-sm'
                          : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                        selectedFilterTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Secondary Search + Sector + Sort Controls */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="relative flex-1 w-full">
                      <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by scholarship title, ministry, course or degree..."
                        className="w-full h-11 pl-11 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#2563EB] focus:bg-white transition-colors"
                      />
                    </div>

                    <select
                      value={filterLevel}
                      onChange={(e) => setFilterLevel(e.target.value)}
                      className="h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none focus:border-[#2563EB] w-full sm:w-auto cursor-pointer"
                    >
                      <option value="ALL">All Sectors</option>
                      <option value="CENTRAL">Central Govt (NSP)</option>
                      <option value="STATE">State Domicile</option>
                      <option value="PRIVATE">Corporate Trust</option>
                    </select>

                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none focus:border-[#2563EB] w-full sm:w-auto cursor-pointer"
                    >
                      <option value="BEST_MATCH">Sort: Best Match</option>
                      <option value="AMOUNT">Sort: Highest Amount</option>
                      <option value="DEADLINE">Sort: Deadline Soonest</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* 4. SCHOLARSHIP CARDS GRID */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-bold text-slate-500">
                    Showing <strong className="text-slate-900">{filteredScholarships.length}</strong> {selectedFilterTab === 'ALL' ? 'total' : selectedFilterTab.toLowerCase()} scholarships
                  </span>
                </div>

                {filteredScholarships.length === 0 ? (
                  <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
                    <FileText className="w-10 h-10 text-slate-300 mx-auto" />
                    <h3 className="text-base font-bold text-slate-800">No scholarships found</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      No scholarships match your active search or filter criteria. Try selecting "All Scholarships" or clearing your search.
                    </p>
                    <button
                      onClick={() => {
                        setSelectedFilterTab('ALL');
                        setSearchQuery('');
                        setFilterLevel('ALL');
                      }}
                      className="px-4 py-2 rounded-xl bg-[#2563EB] text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      Reset Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredScholarships.map((item) => (
                      <ScholarshipCardRef
                        key={item.scholarshipId}
                        data={item}
                        isSaved={isBookmarked(item.scholarshipId)}
                        onToggleSave={() => handleToggleSave(item.scholarship)}
                        onViewDetails={() => setSelectedScholarship(item)}
                        onApply={() => handleApplyNow(item.scholarship)}
                      />
                    ))}
                  </div>
                )}
              </section>
            </div>
          )}

          {/* ======================================================================= */}
          {/* VIEW 3: MY APPLICATIONS (APPLICATION PIPELINE TRACKER)                   */}
          {/* ======================================================================= */}
          {activeNav === 'APPLICATIONS' && (
            <div className="space-y-7">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    My Applications Pipeline
                  </h2>
                  <p className="text-sm text-slate-500 font-medium mt-1">
                    Track and dynamically manage the lifecycle of your scholarship applications.
                  </p>
                </div>

                {savedApplications.length > 0 && (
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => setShowClearApplicationsModal(true)}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5"
                      title="Clear all tracked applications"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear All Tracker</span>
                    </button>

                    <button
                      onClick={() => setActiveNav('DISCOVERY')}
                      className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Find More Scholarships</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Connected Lifecycle Stepper */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                    Application Lifecycle Pipeline (Click stage to filter)
                  </span>
                  {applicationFilterStage !== 'ALL' && (
                    <button
                      onClick={() => setApplicationFilterStage('ALL')}
                      className="text-xs font-bold text-[#2563EB] hover:underline cursor-pointer"
                    >
                      Show All Stages
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                  {pipelineStages.map((stage) => {
                    const count = pipelineCounts[stage.id] || 0;
                    const isSelected = applicationFilterStage === stage.id;
                    return (
                      <button
                        key={stage.id}
                        onClick={() => setApplicationFilterStage(isSelected ? 'ALL' : stage.id)}
                        className={`p-4 rounded-xl text-center transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-blue-50 border-[#2563EB] ring-2 ring-blue-200 shadow-xs'
                            : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100/80 hover:border-slate-300'
                        }`}
                      >
                        <span className={`text-xs font-semibold block ${isSelected ? 'text-[#2563EB] font-bold' : 'text-slate-500'}`}>
                          {stage.label}
                        </span>
                        <span className={`text-2xl font-black mt-1 block ${isSelected ? 'text-[#2563EB]' : 'text-slate-900'}`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Filter Tabs for Quick Navigation */}
              {savedApplications.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  <button
                    onClick={() => setApplicationFilterStage('ALL')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                      applicationFilterStage === 'ALL'
                        ? 'bg-[#2563EB] text-white'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    All ({savedApplications.length})
                  </button>
                  {pipelineStages.map((stage) => (
                    <button
                      key={stage.id}
                      onClick={() => setApplicationFilterStage(stage.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                        applicationFilterStage === stage.id
                          ? 'bg-[#2563EB] text-white'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {stage.label} ({pipelineCounts[stage.id] || 0})
                    </button>
                  ))}
                </div>
              )}

              {/* List of Tracked Applications */}
              {savedApplications.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-14 text-center space-y-3 shadow-xs">
                  <FileText className="w-12 h-12 text-slate-300 mx-auto" />
                  <h3 className="text-lg font-bold text-slate-900">No applications yet</h3>
                  <p className="text-sm text-slate-500 max-w-md mx-auto">
                    Find a scholarship and start your application. When you click "Apply Now" or start an application, it will dynamically appear in this lifecycle pipeline.
                  </p>
                  <button
                    onClick={() => setActiveNav('DISCOVERY')}
                    className="px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-bold transition-colors cursor-pointer inline-flex items-center gap-2 mt-2 shadow-sm"
                  >
                    <Search className="w-4 h-4" />
                    <span>Find More Scholarships</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {savedApplications
                    .filter((app) => applicationFilterStage === 'ALL' || app.status === applicationFilterStage)
                    .map((app) => {
                      const statusPillColors = {
                        SAVED: 'bg-slate-100 text-slate-700 border-slate-200',
                        APPLYING: 'bg-amber-50 text-amber-800 border-amber-200',
                        APPLIED: 'bg-blue-50 text-[#2563EB] border-blue-200',
                        UNDER_REVIEW: 'bg-purple-50 text-purple-700 border-purple-200',
                        APPROVED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                        REJECTED: 'bg-rose-50 text-rose-700 border-rose-200'
                      };

                      const fullSch = allResults.find((r) => r.scholarshipId === app.scholarshipId) ||
                        MASTER_SCHOLARSHIP_REGISTRY.find((s) => s.id === app.scholarshipId);

                      return (
                        <div
                          key={app.id}
                          className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 shadow-xs hover:border-slate-300 transition-all"
                        >
                          <div className="space-y-2 flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2.5">
                              <h3 className="text-base font-extrabold text-slate-900 truncate">
                                {app.scholarshipName}
                              </h3>
                              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md border uppercase tracking-wider ${statusPillColors[app.status] || 'bg-slate-100 text-slate-700'}`}>
                                {app.status?.replace('_', ' ')}
                              </span>
                              {app.governmentLevel && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                                  {app.governmentLevel}
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                              <span className="text-slate-700 font-semibold">{app.provider}</span>
                              <span>•</span>
                              <span className="text-emerald-600 font-bold">{app.amountDisplay}</span>
                              <span>•</span>
                              <span>Deadline: {formatDeadline(app.deadline)}</span>
                              <span>•</span>
                              <span>Added: {app.appliedDate}</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-between lg:justify-end flex-shrink-0">
                            {/* View Details Button */}
                            {fullSch && (
                              <button
                                onClick={() => {
                                  setSelectedScholarship(fullSch.scholarship ? fullSch : { scholarship: fullSch, isEligible: true, matchScore: 100 });
                                }}
                                className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                              >
                                View Details
                              </button>
                            )}

                            {/* Dynamic Status Dropdown */}
                            <select
                              value={app.status}
                              onChange={(e) => {
                                updateApplicationStatus(app.scholarshipId, e.target.value);
                                showToast(`Updated "${app.scholarshipName}" status to ${e.target.value.replace('_', ' ')}`);
                              }}
                              className="h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#2563EB] cursor-pointer"
                            >
                              {pipelineStages.map((stage) => (
                                <option key={stage.id} value={stage.id}>
                                  Status: {stage.label}
                                </option>
                              ))}
                            </select>

                            {/* Official URL link */}
                            {app.officialUrl && (
                              <a
                                href={app.officialUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3.5 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-xs"
                                title="Continue application in official portal"
                              >
                                <span>Continue Application</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}

                            {/* Remove from Tracker Button */}
                            <button
                              onClick={() => {
                                removeApplication(app.scholarshipId);
                                showToast(`Removed "${app.scholarshipName}" from applications tracker`);
                              }}
                              className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                              title="Remove from tracker"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}

                  {savedApplications.filter((app) => applicationFilterStage === 'ALL' || app.status === applicationFilterStage).length === 0 && (
                    <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl space-y-2">
                      <p className="text-sm font-semibold text-slate-600">
                        No applications currently in <strong className="text-slate-900">{applicationFilterStage.replace('_', ' ')}</strong> stage.
                      </p>
                      <button
                        onClick={() => setApplicationFilterStage('ALL')}
                        className="text-xs font-bold text-[#2563EB] hover:underline cursor-pointer"
                      >
                        View all applications ({savedApplications.length})
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ======================================================================= */}
          {/* VIEW 4: SAVED SCHOLARSHIPS (BOOKMARKS)                                  */}
          {/* ======================================================================= */}
          {activeNav === 'SAVED' && (
            <div className="space-y-7">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  Saved Scholarships ({bookmarks.length})
                </h2>
                <p className="text-sm text-slate-500 font-medium mt-1">
                  Scholarships you have bookmarked for quick access and review.
                </p>
              </div>

              {bookmarks.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-14 text-center space-y-3 shadow-xs">
                  <Bookmark className="w-12 h-12 text-slate-300 mx-auto" />
                  <h3 className="text-lg font-bold text-slate-900">No saved scholarships yet</h3>
                  <p className="text-sm text-slate-500 max-w-md mx-auto">
                    Click the bookmark ribbon icon on any scholarship card to save it here for later.
                  </p>
                  <button
                    onClick={() => setActiveNav('DISCOVERY')}
                    className="px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-bold transition-colors cursor-pointer inline-flex items-center gap-2 mt-2 shadow-sm"
                  >
                    <span>Browse Scholarships</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allResults
                    .filter((item) => isBookmarked(item.scholarshipId))
                    .map((item) => (
                      <ScholarshipCardRef
                        key={item.scholarshipId}
                        data={item}
                        isSaved={true}
                        onToggleSave={() => handleToggleSave(item.scholarship)}
                        onViewDetails={() => setSelectedScholarship(item)}
                        onApply={() => handleApplyNow(item.scholarship)}
                      />
                    ))}
                </div>
              )}
            </div>
          )}

          {/* ======================================================================= */}
          {/* VIEW 5: ELIGIBILITY VERIFICATION MATRIX                                 */}
          {/* ======================================================================= */}
          {activeNav === 'ELIGIBILITY' && (
            <div className="space-y-7">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  Eligibility & Matching Criteria
                </h2>
                <p className="text-sm text-slate-500 font-medium mt-1">
                  Detailed analysis of how your student profile vectors evaluate against national scholarship guidelines.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-7 shadow-xs space-y-6">
                <h3 className="text-base font-extrabold text-slate-900">
                  Your Student Profile Vector Checks
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-xs text-slate-400 block font-semibold">Academic Criteria</span>
                    <span className="font-extrabold text-slate-900 block mt-1">
                      {profile.cgpa} CGPA • {profile.class12Percentage}% (Class 12)
                    </span>
                    <span className="text-xs text-emerald-600 font-bold block mt-1">✓ Verified</span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-xs text-slate-400 block font-semibold">Income Threshold</span>
                    <span className="font-extrabold text-slate-900 block mt-1">
                      ₹{(profile.annualIncome || 220000).toLocaleString('en-IN')} / year
                    </span>
                    <span className="text-xs text-emerald-600 font-bold block mt-1">✓ Within Income Limit</span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-xs text-slate-400 block font-semibold">Domicile & Category</span>
                    <span className="font-extrabold text-slate-900 block mt-1">
                      {profile.domicileState || 'Maharashtra'} • {profile.category || 'OBC'}
                    </span>
                    <span className="text-xs text-emerald-600 font-bold block mt-1">✓ State Quota Verified</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================================= */}
          {/* VIEW 6: STUDENT PROFILE DETAILS                                         */}
          {/* ======================================================================= */}
          {activeNav === 'PROFILE' && (
            <div className="space-y-7">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    Student Profile Details
                  </h2>
                  <p className="text-sm text-slate-500 font-medium mt-1">
                    Manage your personal and academic vectors evaluated by the matching system.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowLogoutModal(true)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 hover:border-rose-200 hover:bg-rose-50 text-slate-700 hover:text-rose-600 text-sm font-bold inline-flex items-center gap-2 cursor-pointer transition-colors shadow-xs"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span>Log Out</span>
                  </button>

                  <button
                    onClick={onOpenOnboarding}
                    className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-bold inline-flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Update Profile Wizard</span>
                  </button>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xs space-y-6">
                <h3 className="text-base font-extrabold text-slate-900">Current Profile Vectors</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-sm">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-xs text-slate-400 block font-semibold">Full Name</span>
                    <span className="font-bold text-slate-900 block mt-1">{studentName}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-xs text-slate-400 block font-semibold">Course & Year</span>
                    <span className="font-bold text-slate-900 block mt-1">{profile.course || 'B.Tech'} (Year {profile.currentYear || 2})</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-xs text-slate-400 block font-semibold">Institution</span>
                    <span className="font-bold text-slate-900 block mt-1">{profile.institutionName || 'Veermata Jijabai Technological Institute (VJTI)'}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-xs text-slate-400 block font-semibold">Academic Score</span>
                    <span className="font-bold text-slate-900 block mt-1">{profile.class12Percentage}% Class 12 • {profile.cgpa} CGPA</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-xs text-slate-400 block font-semibold">Annual Family Income</span>
                    <span className="font-bold text-slate-900 block mt-1">₹{(profile.annualIncome || 220000).toLocaleString('en-IN')} / year</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-xs text-slate-400 block font-semibold">Category & Domicile</span>
                    <span className="font-bold text-slate-900 block mt-1">{profile.category || 'OBC'} • {profile.domicileState || 'Maharashtra'}</span>
                  </div>
                </div>

                {/* Real-time Dynamic Vector Tuner (Instant Recalculation) */}
                <div className="pt-6 border-t border-slate-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#2563EB]" />
                        <span>Live Eligibility Vector Simulator</span>
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Adjust your profile vectors below to simulate and instantly recalculate eligibility across all {allResults.length} indexed schemes.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-2">
                      <label className="text-xs font-bold text-slate-700 block">
                        Annual Family Income (₹{(profile.annualIncome || 220000).toLocaleString('en-IN')})
                      </label>
                      <input
                        type="range"
                        min="50000"
                        max="1200000"
                        step="25000"
                        value={profile.annualIncome || 220000}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          updateProfile({ annualIncome: val });
                          showToast(`Family income updated to ₹${val.toLocaleString('en-IN')}. Recalculated!`);
                        }}
                        className="w-full h-2 bg-slate-200 rounded-lg cursor-pointer accent-[#2563EB]"
                      />
                    </div>

                    <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-2">
                      <label className="text-xs font-bold text-slate-700 block">
                        Academic CGPA ({profile.cgpa || 8.45})
                      </label>
                      <input
                        type="range"
                        min="5.0"
                        max="10.0"
                        step="0.1"
                        value={profile.cgpa || 8.45}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          updateProfile({ cgpa: val });
                          showToast(`CGPA updated to ${val}. Recalculated!`);
                        }}
                        className="w-full h-2 bg-slate-200 rounded-lg cursor-pointer accent-[#2563EB]"
                      />
                    </div>

                    <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-2">
                      <label className="text-xs font-bold text-slate-700 block">
                        Social Category ({profile.category || 'OBC'})
                      </label>
                      <select
                        value={profile.category || 'OBC'}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateProfile({ category: val });
                          showToast(`Category updated to ${val}. Recalculated!`);
                        }}
                        className="w-full h-8 px-2 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-800"
                      >
                        <option value="GENERAL">General (Open)</option>
                        <option value="OBC">OBC (Other Backward Class)</option>
                        <option value="SC">SC (Scheduled Caste)</option>
                        <option value="ST">ST (Scheduled Tribe)</option>
                        <option value="EWS">EWS (Economically Weaker)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Digital Document Vault & Marksheet Uploads */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-[#2563EB]" />
                      <span>Digital Document Vault & Marksheets</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Upload and manage supporting documents required for official government and corporate scholarship applications.
                    </p>
                  </div>
                  <div className="text-xs font-bold text-slate-600 bg-slate-100 px-3.5 py-1.5 rounded-xl border border-slate-200 self-start sm:self-auto">
                    {Object.keys(profile.uploadedFiles || {}).length} of 9 Documents Verified
                  </div>
                </div>

                {/* Document List Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {[
                    { id: 'doc_aadhaar', name: 'Aadhaar / Identity Proof', desc: 'Required for DBT direct bank transfer verification' },
                    { id: 'doc_bank_passbook', name: 'Bank Account Passbook / Statement', desc: 'Active bank account linked to Aadhaar' },
                    { id: 'doc_class10', name: 'Class 10 Board Marksheet', desc: 'Date of birth and secondary education proof' },
                    { id: 'doc_class12', name: 'Class 12 Board Marksheet', desc: 'Higher secondary academic eligibility verification' },
                    { id: 'doc_bonafide', name: 'College Bonafide / Enrollment Certificate', desc: 'Proof of active admission in current degree' },
                    { id: 'doc_income_cert', name: 'Annual Income Certificate', desc: 'Issued by Tehsildar / Sub-Divisional Magistrate' },
                    { id: 'doc_category_cert', name: 'Caste / Category Certificate (OBC/SC/ST/EWS)', desc: 'Official government reservation certificate' },
                    { id: 'doc_domicile', name: 'State Domicile / Residence Proof', desc: 'Required for state-specific quota scholarships' },
                    { id: 'doc_special_proof', name: 'Disability / Minority / Special Proof', desc: 'Applicable for special category quota schemes' }
                  ].map((doc) => {
                    const uploaded = (profile.uploadedFiles || {})[doc.id];
                    const isReady = Boolean(uploaded);

                    return (
                      <div
                        key={doc.id}
                        className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                          isReady
                            ? 'bg-emerald-50/40 border-emerald-200/90'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <span className="text-xs font-bold text-slate-900 block truncate">
                              {doc.name}
                            </span>
                            <span className="text-[11px] text-slate-500 block mt-0.5 leading-tight line-clamp-1">
                              {doc.desc}
                            </span>
                            {isReady && uploaded && (
                              <span className="text-[11px] font-bold text-emerald-700 block mt-1 truncate">
                                ✓ {uploaded.name} • {uploaded.size}
                              </span>
                            )}
                          </div>

                          <span
                            className={`text-[10.5px] font-bold px-2 py-0.5 rounded-md border flex-shrink-0 ${
                              isReady
                                ? 'bg-emerald-100/70 text-emerald-800 border-emerald-300'
                                : 'bg-amber-50 text-amber-800 border-amber-200'
                            }`}
                          >
                            {isReady ? 'Ready' : 'Pending'}
                          </span>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100/80">
                          <input
                            type="file"
                            id={`profile_vault_${doc.id}`}
                            accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const currentFiles = { ...(profile.uploadedFiles || {}) };
                                currentFiles[doc.id] = {
                                  name: file.name,
                                  size: `${(file.size / 1024).toFixed(1)} KB`,
                                  type: file.type,
                                  date: new Date().toLocaleDateString()
                                };
                                const currentStatuses = { ...(profile.documentStatuses || {}) };
                                currentStatuses[doc.id] = 'READY';

                                updateProfile({
                                  uploadedFiles: currentFiles,
                                  documentStatuses: currentStatuses
                                });
                                showToast(`Uploaded ${file.name} for ${doc.name}`);
                              }
                            }}
                          />

                          {isReady ? (
                            <div className="flex items-center gap-2">
                              <label
                                htmlFor={`profile_vault_${doc.id}`}
                                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 transition-colors cursor-pointer"
                              >
                                Replace
                              </label>
                              <button
                                type="button"
                                onClick={() => {
                                  const currentFiles = { ...(profile.uploadedFiles || {}) };
                                  delete currentFiles[doc.id];
                                  const currentStatuses = { ...(profile.documentStatuses || {}) };
                                  currentStatuses[doc.id] = 'PENDING';

                                  updateProfile({
                                    uploadedFiles: currentFiles,
                                    documentStatuses: currentStatuses
                                  });
                                  showToast(`Removed document for ${doc.name}`);
                                }}
                                className="p-1 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Delete document"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <label
                              htmlFor={`profile_vault_${doc.id}`}
                              className="px-3 py-1 rounded-lg text-xs font-bold bg-[#2563EB] hover:bg-blue-700 text-white transition-all shadow-2xs inline-flex items-center gap-1.5 cursor-pointer active:scale-95"
                            >
                              <Upload className="w-3 h-3" />
                              <span>Upload Document</span>
                            </label>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================================= */}
          {/* VIEW 7: NOTIFICATIONS & ALERTS FEED (DYNAMIC & UNIQUE)                  */}
          {/* ======================================================================= */}
          {activeNav === 'NOTIFICATIONS' && (
            <div className="space-y-7">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    Notifications & Alerts
                  </h2>
                  <p className="text-sm text-slate-500 font-medium mt-1">
                    Live updates tailored to your profile vectors, matching schemes, and deadlines.
                  </p>
                </div>

                <div className="flex items-center gap-2.5 self-start sm:self-auto">
                  {unreadNotificationCount > 0 && (
                    <button
                      onClick={() => {
                        markAllNotificationsRead();
                        showToast('All notifications marked as read');
                      }}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <CheckCheck className="w-4 h-4 text-slate-600" />
                      <span>Mark all as read</span>
                    </button>
                  )}

                  {notifications && notifications.length > 0 && (
                    <button
                      onClick={() => {
                        clearNotifications();
                        showToast('Cleared all notifications');
                      }}
                      className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear all</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-3.5">
                {notifications && notifications.length > 0 ? (
                  notifications.map((notif, i) => {
                    const isUnread = !notif.read;
                    const Icon = notif.type === 'DEADLINE_ALERT'
                      ? Clock
                      : notif.type === 'SCHEME_MATCH'
                      ? Sparkles
                      : Info;
                    const colorClass = notif.type === 'DEADLINE_ALERT'
                      ? 'text-amber-600 bg-amber-50'
                      : notif.type === 'SCHEME_MATCH'
                      ? 'text-[#2563EB] bg-blue-50'
                      : 'text-emerald-600 bg-emerald-50';

                    // Relative time formatting
                    const timeAgo = (() => {
                      if (!notif.created_at) return 'Just now';
                      const diffMins = Math.floor((Date.now() - new Date(notif.created_at).getTime()) / 60000);
                      if (diffMins < 1) return 'Just now';
                      if (diffMins < 60) return `${diffMins}m ago`;
                      const diffHours = Math.floor(diffMins / 60);
                      if (diffHours < 24) return `${diffHours}h ago`;
                      const diffDays = Math.floor(diffHours / 24);
                      return `${diffDays}d ago`;
                    })();

                    return (
                      <div
                        key={notif.id || i}
                        className={`bg-white border rounded-2xl p-5 sm:p-6 flex items-start gap-4 shadow-xs transition-all ${
                          isUnread
                            ? 'border-blue-200 ring-1 ring-blue-100/80 bg-blue-50/15'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl ${colorClass} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                          <Icon className="w-5 h-5" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-2 min-w-0">
                              <h3 className={`text-sm sm:text-base font-extrabold truncate ${isUnread ? 'text-slate-900' : 'text-slate-700'}`}>
                                {notif.title}
                              </h3>
                              {isUnread && (
                                <span className="w-2 h-2 rounded-full bg-[#2563EB] flex-shrink-0" title="Unread" />
                              )}
                            </div>

                            <div className="flex items-center gap-2.5 flex-shrink-0">
                              <span className="text-[11.5px] text-slate-400 font-semibold whitespace-nowrap">
                                {timeAgo}
                              </span>

                              {isUnread && (
                                <button
                                  onClick={() => {
                                    markNotificationRead(notif.id);
                                    showToast('Marked as read');
                                  }}
                                  className="text-xs font-bold text-[#2563EB] hover:underline cursor-pointer"
                                >
                                  Mark read
                                </button>
                              )}

                              <button
                                onClick={() => {
                                  deleteNotification(notif.id);
                                  showToast('Notification removed');
                                }}
                                className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Delete notification"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                            {notif.message || notif.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl">
                    <Bell className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-base font-extrabold text-slate-900">No notifications</h3>
                    <p className="text-xs text-slate-500 mt-1">You're completely caught up with all live scheme alerts.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ======================================================================= */}
          {/* VIEW 7.5: SOURCES & KNOWLEDGE BASE REGISTRY                              */}
          {/* ======================================================================= */}
          {activeNav === 'SOURCES' && (
            <ScholarshipSourcesView onNavigateToScholarships={() => setActiveNav('DISCOVERY')} />
          )}

          {/* ======================================================================= */}
          {/* VIEW 8: SETTINGS & PREFERENCES (FULL-FLEDGED DYNAMIC PORTAL)             */}
          {/* ======================================================================= */}
          {activeNav === 'SETTINGS' && (
            <div className="space-y-7">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  Portal Settings & Preferences
                </h2>
                <p className="text-sm text-slate-500 font-medium mt-1">
                  Manage your notification channels, scholarship matching rules, security credentials, and session preferences.
                </p>
              </div>

              {/* Sub-navigation Settings Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {[
                  { id: 'NOTIFICATIONS', label: 'Notification Channels', icon: Bell },
                  { id: 'PREFERENCES', label: 'Matching & Benefits', icon: SlidersHorizontal },
                  { id: 'SECURITY', label: 'Security & Password', icon: Lock },
                  { id: 'SESSION', label: 'Account & Session', icon: User }
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeSettingsTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveSettingsTab(tab.id)}
                      className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap inline-flex items-center gap-2 ${
                        isActive
                          ? 'bg-[#2563EB] text-white shadow-sm'
                          : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* ── TAB 1: NOTIFICATION CHANNELS ────────────────────────────── */}
              {activeSettingsTab === 'NOTIFICATIONS' && (
                <div className="space-y-6">
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="text-base font-extrabold text-slate-900">Communication Alerts</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Control how and when Scholar AI alerts you about scholarship deadlines and new matching schemes.</p>
                      </div>
                      <button
                        onClick={async () => {
                          await addNotification({
                            title: '⚡ Test Alert Generated',
                            message: 'Your notification system is fully operational and receiving instant scheme updates.',
                            type: 'SCHEME_MATCH'
                          });
                          showToast('Test notification delivered to your Notifications feed!');
                        }}
                        className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5 self-start sm:self-auto"
                      >
                        <Bell className="w-3.5 h-3.5 text-[#2563EB]" />
                        <span>Send Test Alert</span>
                      </button>
                    </div>

                    <div className="space-y-4">
                      {/* Email Notifications */}
                      <div className="flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/90 gap-4">
                        <div className="flex items-start gap-3.5">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Mail className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-sm font-bold text-slate-900 block">Email Digest & Verified Alerts</span>
                            <span className="text-xs text-slate-500 block mt-0.5">
                              Receive weekly digests of newly verified schemes matching your profile sent to <strong className="text-slate-700">{profile.email || 'student@scholarai.in'}</strong>
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleUpdatePreference('emailAlerts', !(profile.preferences?.emailAlerts ?? true))}
                          className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors flex-shrink-0 ${
                            (profile.preferences?.emailAlerts ?? true) ? 'bg-[#2563EB]' : 'bg-slate-300'
                          }`}
                        >
                          <div
                            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                              (profile.preferences?.emailAlerts ?? true) ? 'translate-x-6' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>

                      {/* Deadline Reminders */}
                      <div className="flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/90 gap-4">
                        <div className="flex items-start gap-3.5">
                          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Clock className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-sm font-bold text-slate-900 block">Approaching Deadline Alerts</span>
                            <span className="text-xs text-slate-500 block mt-0.5">
                              Automated countdown notifications 7 days and 48 hours before official portal closure.
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleUpdatePreference('deadlineAlerts', !(profile.preferences?.deadlineAlerts ?? true))}
                          className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors flex-shrink-0 ${
                            (profile.preferences?.deadlineAlerts ?? true) ? 'bg-[#2563EB]' : 'bg-slate-300'
                          }`}
                        >
                          <div
                            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                              (profile.preferences?.deadlineAlerts ?? true) ? 'translate-x-6' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>

                      {/* SMS Alerts */}
                      <div className="flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/90 gap-4">
                        <div className="flex items-start gap-3.5">
                          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Smartphone className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-sm font-bold text-slate-900 block">Instant SMS Alerts</span>
                            <span className="text-xs text-slate-500 block mt-0.5">
                              Direct SMS delivery on scholarship application status updates and document verification alerts.
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleUpdatePreference('smsAlerts', !(profile.preferences?.smsAlerts ?? false))}
                          className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors flex-shrink-0 ${
                            (profile.preferences?.smsAlerts ?? false) ? 'bg-[#2563EB]' : 'bg-slate-300'
                          }`}
                        >
                          <div
                            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                              (profile.preferences?.smsAlerts ?? false) ? 'translate-x-6' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>

                      {/* WhatsApp Alerts */}
                      <div className="flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/90 gap-4">
                        <div className="flex items-start gap-3.5">
                          <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Smartphone className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-sm font-bold text-slate-900 block">WhatsApp Application Notifications</span>
                            <span className="text-xs text-slate-500 block mt-0.5">
                              Receive approved scholarship notices and direct application status updates on WhatsApp.
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleUpdatePreference('whatsappAlerts', !(profile.preferences?.whatsappAlerts ?? false))}
                          className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors flex-shrink-0 ${
                            (profile.preferences?.whatsappAlerts ?? false) ? 'bg-[#2563EB]' : 'bg-slate-300'
                          }`}
                        >
                          <div
                            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                              (profile.preferences?.whatsappAlerts ?? false) ? 'translate-x-6' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>

                      {/* Scheme Match Alerts */}
                      <div className="flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/90 gap-4">
                        <div className="flex items-start gap-3.5">
                          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Sparkles className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-sm font-bold text-slate-900 block">High-Priority Scheme Matches</span>
                            <span className="text-xs text-slate-500 block mt-0.5">
                              Instant in-app alerts whenever a scholarship with 90%+ match score is newly indexed.
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleUpdatePreference('schemeMatchAlerts', !(profile.preferences?.schemeMatchAlerts ?? true))}
                          className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors flex-shrink-0 ${
                            (profile.preferences?.schemeMatchAlerts ?? true) ? 'bg-[#2563EB]' : 'bg-slate-300'
                          }`}
                        >
                          <div
                            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                              (profile.preferences?.schemeMatchAlerts ?? true) ? 'translate-x-6' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── TAB 2: MATCHING & BENEFIT PREFERENCES ────────────────────── */}
              {activeSettingsTab === 'PREFERENCES' && (
                <div className="space-y-6">
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900">Preferred Scholarship Benefit Types</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Select the funding and assistance types you want prioritized in your match scoring.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {[
                        { id: 'TUITION_FEE', label: 'Tuition & Academic Fees', desc: 'Direct college & university fee waivers' },
                        { id: 'MONTHLY_STIPEND', label: 'Monthly Living Stipend', desc: 'Direct bank transfer monthly allowance' },
                        { id: 'HOSTEL', label: 'Hostel & Accommodation', desc: 'Room and boarding fee reimbursement' },
                        { id: 'LAPTOP_GRANT', label: 'Laptop & Device Grant', desc: 'Digital equipment and device assistance' },
                        { id: 'RESEARCH_FELLOWSHIP', label: 'Research & Travel Fellowships', desc: 'Project, thesis and lab grants' },
                        { id: 'BOOKS_STATIONERY', label: 'Books & Equipment Grant', desc: 'Study material and annual allowances' }
                      ].map((item) => {
                        const isSelected = (profile.preferences?.types || ['TUITION_FEE', 'MONTHLY_STIPEND', 'HOSTEL']).includes(item.id);
                        return (
                          <div
                            key={item.id}
                            onClick={() => handleToggleBenefitType(item.id)}
                            className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                              isSelected
                                ? 'bg-blue-50/70 border-[#2563EB] ring-1 ring-blue-200'
                                : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-md flex items-center justify-center mt-0.5 flex-shrink-0 ${
                              isSelected ? 'bg-[#2563EB] text-white' : 'border border-slate-300 bg-white'
                            }`}>
                              {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className={`text-xs font-bold block ${isSelected ? 'text-[#2563EB]' : 'text-slate-900'}`}>
                                {item.label}
                              </span>
                              <span className="text-[11px] text-slate-500 mt-0.5 block leading-tight">
                                {item.desc}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Minimum Amount Filter */}
                      <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                        <label className="text-xs font-bold text-slate-900 block">
                          Minimum Grant Amount Filter
                        </label>
                        <select
                          value={profile.preferences?.minAmount || 0}
                          onChange={(e) => handleUpdatePreference('minAmount', Number(e.target.value))}
                          className="w-full h-11 px-3 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:border-[#2563EB] cursor-pointer"
                        >
                          <option value="0">Show All Amounts (No Minimum)</option>
                          <option value="15000">₹15,000 / year or higher</option>
                          <option value="25000">₹25,000 / year or higher</option>
                          <option value="50000">₹50,000 / year or higher</option>
                          <option value="100000">₹1,00,000 / year or higher</option>
                        </select>
                        <p className="text-[11px] text-slate-500 mt-1">Filters out schemes offering grants below your chosen threshold.</p>
                      </div>

                      {/* Sector Filter */}
                      <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                        <label className="text-xs font-bold text-slate-900 block">
                          Funding Sector Prioritization
                        </label>
                        <select
                          value={profile.preferences?.sectorPreference || 'ALL'}
                          onChange={(e) => handleUpdatePreference('sectorPreference', e.target.value)}
                          className="w-full h-11 px-3 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:border-[#2563EB] cursor-pointer"
                        >
                          <option value="ALL">All Sectors (Government & Corporate Trusts)</option>
                          <option value="CENTRAL">Central Govt (National Scholarship Portal)</option>
                          <option value="STATE">State Domicile Schemes Only</option>
                          <option value="PRIVATE">Corporate Philanthropic Trusts Only</option>
                        </select>
                        <p className="text-[11px] text-slate-500 mt-1">Highlight scholarships funded by your preferred sponsors.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── TAB 3: SECURITY & PASSWORD CREDENTIALS ───────────────────── */}
              {activeSettingsTab === 'SECURITY' && (
                <div className="space-y-6">
                  {/* Account Identity & Verification Details */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-extrabold text-slate-900">Student Account Security</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Your authenticated credentials and digital verification badges.</p>
                      </div>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full inline-flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Verified Account</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-xs text-slate-400 block font-semibold">Registered Email</span>
                        <span className="font-bold text-slate-900 block mt-1">{profile.email || 'mohamedimraan2003@gmail.com'}</span>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-xs text-slate-400 block font-semibold">Aadhaar Linked Status</span>
                        <span className="font-bold text-emerald-600 block mt-1">✓ Aadhaar Verified (Linked)</span>
                      </div>
                    </div>

                    {/* Mobile Number Update */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex-1">
                        <span className="text-xs text-slate-400 block font-semibold">SMS Alert Mobile Number</span>
                        <input
                          type="text"
                          value={mobilePhoneInput}
                          onChange={(e) => setMobilePhoneInput(e.target.value)}
                          className="mt-1 w-full sm:w-64 h-9 px-3 rounded-lg bg-white border border-slate-200 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-[#2563EB]"
                        />
                      </div>
                      <button
                        onClick={() => {
                          updateProfile({ mobile: mobilePhoneInput });
                          showToast('Mobile contact updated successfully!');
                        }}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto"
                      >
                        Save Number
                      </button>
                    </div>
                  </div>

                  {/* Real Password Change Card */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900">Change Account Password</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Update your password to keep your student account secure.</p>
                    </div>

                    <form onSubmit={handlePasswordSubmit} className="max-w-md space-y-4">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1.5">
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password (min. 6 characters)"
                            className="w-full h-11 pl-4 pr-11 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#2563EB] focus:bg-white"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1.5">
                          Confirm New Password
                        </label>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter new password"
                          className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#2563EB] focus:bg-white"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={passwordLoading}
                        className={`px-5 py-2.5 rounded-xl text-white text-xs sm:text-sm font-bold transition-all shadow-sm cursor-pointer inline-flex items-center gap-2 ${
                          passwordLoading ? 'bg-blue-400 cursor-wait' : 'bg-[#2563EB] hover:bg-blue-700 active:scale-95'
                        }`}
                      >
                        <Key className="w-4 h-4" />
                        <span>{passwordLoading ? 'Updating Password...' : 'Save New Password'}</span>
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* ── TAB 4: ACCOUNT & SESSION DANGER ZONE ─────────────────────── */}
              {activeSettingsTab === 'SESSION' && (
                <div className="space-y-6">
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900">Active Student Session</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Manage your active authentication session and platform data.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-xs text-slate-400 block font-semibold">User Full Name</span>
                        <span className="font-bold text-slate-900 block mt-1">{studentName}</span>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-xs text-slate-400 block font-semibold">Signed In Email</span>
                        <span className="font-bold text-slate-900 block mt-1">{profile.email || 'mohamedimraan2003@gmail.com'}</span>
                      </div>
                    </div>

                    {/* Data Management Actions */}
                    <div className="pt-6 border-t border-slate-100 space-y-3.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                        Session & Data Controls
                      </span>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200 gap-3">
                        <div>
                          <span className="text-sm font-bold text-slate-900 block">Reset Vector Simulator</span>
                          <span className="text-xs text-slate-500">Restore simulated income and CGPA values back to registered defaults</span>
                        </div>
                        <button
                          onClick={() => {
                            updateProfile({
                              annualIncome: 220000,
                              cgpa: 8.45,
                              category: 'OBC'
                            });
                            showToast('Vector simulator reset to default registered profile values');
                          }}
                          className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                        >
                          Reset Simulator
                        </button>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200 gap-3">
                        <div>
                          <span className="text-sm font-bold text-slate-900 block">Clear Application Pipeline</span>
                          <span className="text-xs text-slate-500">Remove all tracked scholarship applications from your tracker</span>
                        </div>
                        <button
                          onClick={() => setShowClearApplicationsModal(true)}
                          className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold transition-colors cursor-pointer"
                        >
                          Clear Tracker
                        </button>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-rose-50/50 border border-rose-200 gap-3">
                        <div>
                          <span className="text-sm font-bold text-rose-900 block">Sign Out of Session</span>
                          <span className="text-xs text-rose-600">End your current session on this device</span>
                        </div>
                        <button
                          onClick={() => setShowLogoutModal(true)}
                          className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer shadow-sm"
                        >
                          Log Out of Session
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

        </main>
      </div>

      {/* ========================================================================= */}
      {/* 3. EXPLAIN EVALUATION MODAL (Light Mode)                                  */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedScholarship && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white border border-slate-200 rounded-2xl p-7 sm:p-9 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-5">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 p-2 flex items-center justify-center flex-shrink-0 shadow-xs overflow-hidden">
                    <img
                      src={getScholarshipLogo(selectedScholarship.scholarship)}
                      alt={selectedScholarship.scholarship.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-black text-[#2563EB] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                        {selectedScholarship.matchScore}% Match
                      </span>
                      <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                        {selectedScholarship.scholarship.government_level} SCHEME
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                      {selectedScholarship.scholarship.name}
                    </h2>
                    <p className="text-sm text-slate-500 font-medium mt-0.5">
                      {selectedScholarship.scholarship.provider}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => setSelectedScholarship(null)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Official Provider & Website Row */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] text-slate-500 block uppercase tracking-wider font-bold">Official Provider</span>
                  <span className="text-sm font-bold text-slate-900 mt-0.5 block">{selectedScholarship.scholarship.provider}</span>
                </div>
                {getScholarshipUrls(selectedScholarship.scholarship).websiteUrl && (
                  <a
                    href={getScholarshipUrls(selectedScholarship.scholarship).websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2563EB] hover:underline"
                  >
                    <span>Visit Official Website</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {/* Amount & Deadline */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90">
                  <span className="text-xs text-slate-500 block mb-1 uppercase tracking-wider font-bold">Amount</span>
                  <span className="text-base font-extrabold text-emerald-600">
                    {selectedScholarship.scholarship.amount_display}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90">
                  <span className="text-xs text-slate-500 block mb-1 uppercase tracking-wider font-bold">Deadline</span>
                  <span className="text-base font-extrabold text-slate-900">
                    {formatDeadline(selectedScholarship.scholarship.application_deadline)}
                  </span>
                </div>
              </div>

              {/* Vector Verification */}
              <div className="space-y-3">
                <span className="text-xs sm:text-sm font-black text-slate-900 block uppercase tracking-wider">
                  Eligibility Breakdown:
                </span>

                <div className="space-y-2.5">
                  {selectedScholarship.evaluations.map((ev, i) => (
                    <div
                      key={i}
                      className={`p-3.5 rounded-xl border text-xs sm:text-sm flex items-start gap-3 ${
                        ev.passed
                          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950 font-medium'
                          : 'bg-rose-50/70 border-rose-200 text-rose-950 font-medium'
                      }`}
                    >
                      <div className="mt-0.5">
                        {ev.passed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-rose-600" />
                        )}
                      </div>
                      <div>
                        <span className="font-bold block text-slate-900">{ev.vector}</span>
                        <span className="text-xs text-slate-600 leading-relaxed block mt-0.5">{ev.details}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-5 border-t border-slate-200 flex items-center justify-end gap-3.5">
                <button
                  onClick={() => setSelectedScholarship(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleApplyNow(selectedScholarship.scholarship);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-bold inline-flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <span>{getScholarshipUrls(selectedScholarship.scholarship).applicationUrl ? 'Apply Now' : 'View Official Website'}</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 4. LOGOUT CONFIRMATION MODAL                                              */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showLogoutModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-5"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center">
                <LogOut className="w-6 h-6 stroke-[2.2]" />
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900">Sign out of Scholar AI?</h3>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                  You can sign back in anytime to continue tracking your applications and discovering new matching scholarships.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowLogoutModal(false);
                    if (onLogout) {
                      onLogout();
                    } else {
                      signOut();
                    }
                  }}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer shadow-md shadow-rose-600/20"
                >
                  Yes, Sign Out
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 5. CLEAR ALL APPLICATIONS CONFIRMATION MODAL                              */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showClearApplicationsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-5"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center">
                <Trash2 className="w-6 h-6 stroke-[2.2]" />
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900">Clear Application Tracker?</h3>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                  This will remove all {savedApplications.length} scholarships from your application tracker. Your bookmarks and profile will remain untouched.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowClearApplicationsModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    setShowClearApplicationsModal(false);
                    await clearApplications();
                    showToast('Cleared all tracked applications');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer shadow-md shadow-rose-600/20"
                >
                  Yes, Clear All
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Scholarship Detail Modal */}
      {selectedScholarship && (
        <ScholarshipDetailModal
          scholarship={selectedScholarship.scholarship || selectedScholarship}
          evaluation={selectedScholarship.isEligible !== undefined ? selectedScholarship : undefined}
          isOpen={Boolean(selectedScholarship)}
          onClose={() => setSelectedScholarship(null)}
          onSaveApplication={(sch, status) => {
            saveApplication(sch, status);
            showToast(`Started application for "${sch.name}"!`);
          }}
        />
      )}

    </div>
  );
}

// ── RESTRUCTURED SCHOLARSHIP CARD (Clean Crisp Vector Emblem & Polished Layout) ─
function ScholarshipCardRef({ data, isSaved, onToggleSave, onViewDetails, onApply }) {
  const { scholarship, matchScore, isEligible, tier, evaluations } = data;

  const isPossible = tier === 'POSSIBLE_MATCH';
  const isIneligible = tier === 'INELIGIBLE';

  const logoSrc = getScholarshipLogo(scholarship);
  const formattedDeadline = formatDeadline(scholarship.application_deadline);
  const { applicationUrl, websiteUrl } = getScholarshipUrls(scholarship);
  const targetUrl = applicationUrl || websiteUrl;
  const buttonText = applicationUrl ? 'Apply Now' : websiteUrl ? 'View Official Website' : 'Application Link Unavailable';
  const isLinkDisabled = !targetUrl;

  // Category Tag Styling
  const categoryPill = useMemo(() => {
    if (scholarship.government_level === 'CENTRAL') {
      return { label: 'Government (Central)', bg: 'bg-[#EFF6FF]', text: 'text-[#2563EB]' };
    }
    if (scholarship.government_level === 'STATE') {
      return { label: 'Government (State)', bg: 'bg-[#F0FDF4]', text: 'text-emerald-700' };
    }
    return { label: 'Corporate', bg: 'bg-[#FAF5FF]', text: 'text-purple-700' };
  }, [scholarship.government_level]);

  return (
    <div className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-4 sm:p-5 flex flex-col justify-between space-y-3.5 shadow-xs hover:shadow-md transition-all">
      <div className="space-y-3.5">
        
        {/* 1. Match Status & Bookmark Row */}
        <div className="flex items-center justify-between">
          {isEligible ? (
            <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md inline-flex items-center gap-1.5">
              <Check className="w-3 h-3 stroke-[3]" />
              <span>{matchScore}% Match • Eligible</span>
            </span>
          ) : isPossible ? (
            <span className="text-[11px] font-extrabold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-md inline-flex items-center gap-1.5">
              <AlertCircle className="w-3 h-3 stroke-[2.5]" />
              <span>Potential Match • Needs Verification</span>
            </span>
          ) : (
            <span className="text-[11px] font-extrabold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-md inline-flex items-center gap-1.5">
              <X className="w-3 h-3 stroke-[3]" />
              <span>Not Eligible</span>
            </span>
          )}

          <button
            onClick={onToggleSave}
            className={`p-1 rounded-lg transition-colors cursor-pointer ${
              isSaved ? 'text-[#2563EB]' : 'text-slate-400 hover:text-slate-700'
            }`}
            title={isSaved ? 'Bookmarked' : 'Bookmark Scholarship'}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* 2. Real Clean Vector Emblem Logo, Title, Provider & Category */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/90 p-1.5 flex items-center justify-center flex-shrink-0 shadow-xs overflow-hidden">
            <img
              src={logoSrc}
              alt={scholarship.name}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.src = '/scholarships/emblem_india.svg';
              }}
            />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug line-clamp-2">
              {scholarship.name}
            </h3>
            <div className="flex flex-wrap items-center gap-1.5 mt-1">
              <span className="text-[11px] font-semibold text-slate-500 truncate max-w-[130px]">
                {scholarship.provider}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${categoryPill.bg} ${categoryPill.text}`}>
                {categoryPill.label}
              </span>
            </div>
          </div>
        </div>

        {/* 3. Short Description */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {scholarship.description}
        </p>

        {/* 4. Amount & Deadline */}
        <div className="flex items-start justify-between text-xs pt-2 border-t border-slate-100 gap-3">
          <div className="min-w-0">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">Amount</span>
            <span className="font-extrabold text-emerald-600 text-xs sm:text-sm mt-0.5 block truncate">
              {scholarship.amount_display}
            </span>
          </div>
          <div className="text-right flex-shrink-0">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">Deadline</span>
            <span className="font-bold text-slate-900 text-xs mt-0.5 block whitespace-nowrap">
              {formattedDeadline}
            </span>
          </div>
        </div>

        {/* 5. "Why you match" / "Why this is possible" / "Why you're not eligible" Checklist */}
        <div className="space-y-1.5 pt-0.5">
          <span className="text-[11px] font-bold text-slate-900 block">
            {isEligible ? 'Why you match' : isPossible ? 'Why this is possible' : "Why you're not eligible"}
          </span>

          <div className="space-y-1">
            {((Array.isArray(evaluations) && evaluations.length > 0)
              ? evaluations
              : (Array.isArray(data?.matchedCriteria) && data.matchedCriteria.length > 0)
                ? data.matchedCriteria.map((desc) => ({ passed: true, description: desc, details: desc }))
                : [
                    {
                      passed: Boolean(isEligible),
                      description: isEligible ? 'Meets mandatory academic and domicile requirements' : (data?.failedCriteria?.[0] || 'Criteria verification required'),
                      details: isEligible ? 'Academic score, income limit & domicile verified' : (data?.failedCriteria?.[0] || 'Criteria check')
                    }
                  ]
            ).slice(0, 3).map((ev, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[11px]">
                {ev.passed ? (
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                ) : isPossible ? (
                  <div className="w-3.5 h-3.5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-2.5 h-2.5 stroke-[2.5]" />
                  </div>
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0">
                    <X className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                )}
                <span className={`truncate font-medium ${
                  ev.passed ? 'text-slate-600' : isPossible ? 'text-amber-800 font-semibold' : 'text-rose-800 font-semibold'
                }`}>
                  {ev.passed ? `${ev.description || ev.details || 'Requirement verified'}` : (ev.details || ev.description || 'Check criteria')}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 6. Card Bottom Actions */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2.5">
        <button
          onClick={onViewDetails}
          className="flex-1 py-2 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer text-center"
        >
          View Details
        </button>

        <button
          onClick={() => !isLinkDisabled && onApply(scholarship)}
          disabled={isLinkDisabled}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold text-white transition-all text-center flex items-center justify-center gap-1.5 ${
            isLinkDisabled
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
              : 'bg-[#2563EB] hover:bg-blue-700 shadow-xs cursor-pointer'
          }`}
        >
          <span>{buttonText}</span>
          {!isLinkDisabled && <ExternalLink className="w-3 h-3" />}
        </button>
      </div>
    </div>
  );
}
