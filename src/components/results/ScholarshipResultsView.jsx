import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStudentProfile } from '../../context/StudentProfileContext';
import { calculateDeadlineStatus } from '../../engine/eligibilityEngine';
import ScholarshipDetailModal from './ScholarshipDetailModal';
import {
  Check,
  AlertCircle,
  X,
  FileText,
  Search,
  Bookmark,
  ExternalLink,
  ChevronRight,
  Bell,
  CheckCircle2
} from 'lucide-react';

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
  return '/scholarships/emblem_india.svg';
};

const formatDeadline = (dateStr, status) => {
  if (!dateStr) {
    if (status === 'YEAR_ROUND') return 'Year-Round / Rolling';
    if (status === 'AVAILABILITY_UNVERIFIED' || status === 'UNKNOWN') return 'Availability Unverified';
    if (status === 'UPCOMING') return 'Upcoming Cycle';
    if (status === 'CLOSED') return 'Applications Closed';
    return 'Refer Official Portal';
  }
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = d.getDate();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${day} ${months[d.getMonth()]} ${d.getFullYear()}`;
  } catch (e) {
    return dateStr;
  }
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

export default function ScholarshipResultsView({ onGoToDashboard }) {
  const { profile, currentUser, evaluationResults, saveApplication, bookmarks, toggleBookmark, isBookmarked } = useStudentProfile();
  const [selectedFilterTab, setSelectedFilterTab] = useState('ALL'); // 'ALL', 'ELIGIBLE', 'POSSIBLE', 'INELIGIBLE'
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState('ALL');
  const [sortBy, setSortBy] = useState('BEST_MATCH');
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

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
      total: (allResults || []).length
    };
  }, [eligibleMatches, possibleMatches, ineligible, allResults]);

  const studentName = profile.fullName || currentUser?.user_metadata?.full_name || currentUser?.email?.split('@')[0] || 'Student';
  const initials = (studentName || 'ST')
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'ST';

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleToggleSave = (scholarship) => {
    if (!scholarship?.id) return;
    const wasBookmarked = isBookmarked(scholarship.id);
    toggleBookmark(scholarship.id);
    showToast(wasBookmarked ? `Removed "${scholarship.name}" from bookmarks` : `Saved "${scholarship.name}" to your bookmarks!`);
  };

  const handleApplyNow = (scholarship) => {
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

  // Filtered scholarships
  const filteredScholarships = useMemo(() => {
    let list = [...allResults];

    if (selectedFilterTab === 'ELIGIBLE') {
      list = list.filter((r) => r.isEligible);
    } else if (selectedFilterTab === 'POSSIBLE') {
      list = list.filter((r) => r.tier === 'POSSIBLE_MATCH');
    } else if (selectedFilterTab === 'INELIGIBLE') {
      list = list.filter((r) => r.tier === 'INELIGIBLE');
    }

    if (filterLevel !== 'ALL') {
      list = list.filter((r) => r.scholarship.government_level === filterLevel);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (r) =>
          r.scholarship.name.toLowerCase().includes(q) ||
          r.scholarship.provider.toLowerCase().includes(q) ||
          r.scholarship.description.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'BEST_MATCH') {
      list.sort((a, b) => b.matchScore - a.matchScore);
    } else if (sortBy === 'AMOUNT') {
      list.sort((a, b) => (b.scholarship.amount_max || 0) - (a.scholarship.amount_max || 0));
    } else if (sortBy === 'DEADLINE') {
      list.sort((a, b) => new Date(a.scholarship.application_deadline) - new Date(b.scholarship.application_deadline));
    }

    return list;
  }, [allResults, selectedFilterTab, filterLevel, searchQuery, sortBy]);

  const eligiblePct = stats.total > 0 ? (stats.eligible / stats.total) * 100 : 0;
  const possiblePct = stats.total > 0 ? (stats.possible / stats.total) * 100 : 0;
  const ineligiblePct = stats.total > 0 ? (stats.ineligible / stats.total) * 100 : 0;

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-slate-900 font-sans antialiased">
      {/* Toast Notification */}
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

      <div className="max-w-[1240px] mx-auto px-4 sm:px-8 lg:px-10 py-8 space-y-8">
        
        {/* 1. WELCOME HEADER */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-5 pb-6 border-b border-slate-200/80">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <span>Welcome back, {studentName}!</span>
              <span>👋</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-500 mt-1 font-medium">
              Find and apply for scholarships that match your profile.
            </p>
          </div>

          <div className="flex items-center gap-3.5 self-end md:self-auto">
            <div className="relative w-64 sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search scholarships..."
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 shadow-xs"
              />
            </div>

            <button
              type="button"
              className="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 shadow-xs cursor-pointer hover:bg-slate-50 relative"
            >
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 bg-[#2563EB] rounded-full absolute top-3 right-3" />
            </button>

            <button
              type="button"
              onClick={onGoToDashboard}
              className="w-11 h-11 rounded-xl bg-[#2563EB] text-white flex items-center justify-center font-black text-xs shadow-sm flex-shrink-0 cursor-pointer hover:opacity-90"
            >
              {initials}
            </button>
          </div>
        </header>

        {/* 2. ELIGIBILITY SUMMARY: 4 LARGE COMPACT SUMMARY CARDS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Card 1: ELIGIBLE */}
          <div
            onClick={() => setSelectedFilterTab('ELIGIBLE')}
            className={`p-5 rounded-2xl bg-white border transition-all cursor-pointer shadow-xs hover:shadow-sm flex flex-col justify-between space-y-3 ${
              selectedFilterTab === 'ELIGIBLE' ? 'border-emerald-500 ring-2 ring-emerald-100' : 'border-slate-200 hover:border-emerald-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                ELIGIBLE
              </span>
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            </div>
            <div>
              <span className="text-3xl sm:text-4xl font-black text-slate-900 block leading-none">
                {stats.eligible}
              </span>
              <span className="text-xs text-slate-500 block mt-2 font-medium">
                Scholarships you qualify for
              </span>
            </div>
          </div>

          {/* Card 2: POSSIBLE MATCH */}
          <div
            onClick={() => setSelectedFilterTab('POSSIBLE')}
            className={`p-5 rounded-2xl bg-white border transition-all cursor-pointer shadow-xs hover:shadow-sm flex flex-col justify-between space-y-3 ${
              selectedFilterTab === 'POSSIBLE' ? 'border-amber-500 ring-2 ring-amber-100' : 'border-slate-200 hover:border-amber-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                POSSIBLE MATCH
              </span>
              <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
            </div>
            <div>
              <span className="text-3xl sm:text-4xl font-black text-slate-900 block leading-none">
                {stats.possible}
              </span>
              <span className="text-xs text-slate-500 block mt-2 font-medium">
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

        {/* 3. VISUAL ELIGIBILITY DISTRIBUTION */}
        <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-3.5">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-semibold">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-slate-700">Eligible: <span className="font-extrabold text-slate-900">{stats.eligible}</span> ({eligiblePct.toFixed(0)}%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span className="text-slate-700">Possible: <span className="font-extrabold text-slate-900">{stats.possible}</span> ({possiblePct.toFixed(0)}%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="text-slate-700">Not Eligible: <span className="font-extrabold text-slate-900">{stats.ineligible}</span> ({ineligiblePct.toFixed(0)}%)</span>
            </div>
          </div>

          {/* Slim Multi-Segment Proportional Distribution Bar */}
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
            {stats.eligible > 0 && (
              <div
                className="h-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${eligiblePct}%` }}
                title={`Eligible: ${stats.eligible}`}
              />
            )}
            {stats.possible > 0 && (
              <div
                className="h-full bg-amber-400 transition-all duration-500"
                style={{ width: `${possiblePct}%` }}
                title={`Possible: ${stats.possible}`}
              />
            )}
            {stats.ineligible > 0 && (
              <div
                className="h-full bg-rose-500 transition-all duration-500"
                style={{ width: `${ineligiblePct}%` }}
                title={`Not Eligible: ${stats.ineligible}`}
              />
            )}
          </div>

          <p className="text-xs sm:text-[13px] text-slate-500 font-medium">
            <span className="font-bold text-slate-700">{stats.total} scholarships</span> analyzed from your profile
          </p>
        </section>

        {/* 4. FILTER NAVIGATION & SEARCH CONTROLS */}
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
                <option value="STATE">State Schemes</option>
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

        {/* 5. SCHOLARSHIP CARDS GRID (3-COLUMN RESPONSIVE) */}
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
              {filteredScholarships.map((item) => {
                const { scholarship, matchScore, isEligible, tier, evaluations } = item;
                const isPossible = tier === 'POSSIBLE_MATCH';
                const rawStatus = scholarship.status;
                const deadline = scholarship.application_deadline || scholarship.applicationDeadline;
                const openDate = scholarship.application_open_date || scholarship.applicationOpenDate || scholarship.application_start;
                const lifecycleStatus = calculateDeadlineStatus(deadline, openDate, rawStatus);
                const formattedDeadline = formatDeadline(deadline, lifecycleStatus);

                const categoryPill = scholarship.government_level === 'CENTRAL'
                  ? { label: 'Government (Central)', bg: 'bg-[#EFF6FF]', text: 'text-[#2563EB]' }
                  : scholarship.government_level === 'STATE'
                  ? { label: 'Government (State)', bg: 'bg-[#F0FDF4]', text: 'text-emerald-700' }
                  : { label: 'Corporate', bg: 'bg-[#FAF5FF]', text: 'text-purple-700' };

                return (
                  <div
                    key={item.scholarshipId}
                    className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-xs hover:shadow-md transition-all"
                  >
                    <div className="space-y-4">
                      {/* Match Status & Bookmark Row */}
                      <div className="flex items-center justify-between">
                        {isEligible ? (
                          <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-md inline-flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>{matchScore}% Match • Eligible</span>
                          </span>
                        ) : isPossible ? (
                          <span className="text-xs font-extrabold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-md inline-flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>Potential Match • Needs Verification</span>
                          </span>
                        ) : (
                          <span className="text-xs font-extrabold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1 rounded-md inline-flex items-center gap-1.5">
                            <X className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Not Eligible</span>
                          </span>
                        )}

                        <button
                          onClick={() => handleToggleSave(scholarship)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            isSaved ? 'text-[#2563EB]' : 'text-slate-400 hover:text-slate-700'
                          }`}
                          title={isSaved ? 'Bookmarked' : 'Bookmark Scholarship'}
                        >
                          <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                        </button>
                      </div>

                      {/* Emblem Logo, Title & Provider */}
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200/90 p-2 flex items-center justify-center flex-shrink-0 shadow-xs overflow-hidden">
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
                          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug line-clamp-2">
                            {scholarship.name}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 mt-1.5">
                            <span className="text-xs font-semibold text-slate-500 truncate max-w-[150px]">
                              {scholarship.provider}
                            </span>
                            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md ${categoryPill.bg} ${categoryPill.text}`}>
                              {categoryPill.label}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                        {scholarship.description}
                      </p>

                      {/* Amount & Deadline */}
                      <div className="flex items-start justify-between text-xs sm:text-sm pt-2 border-t border-slate-100 gap-3">
                        <div className="min-w-0">
                          <span className="text-[11px] text-slate-400 block font-semibold uppercase tracking-wider">Amount</span>
                          <span className="font-extrabold text-emerald-600 text-sm sm:text-base mt-0.5 block truncate">
                            {scholarship.amount_display}
                          </span>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="text-[11px] text-slate-400 block font-semibold uppercase tracking-wider">Deadline</span>
                          <span className="font-bold text-slate-900 text-xs sm:text-sm mt-0.5 block whitespace-nowrap">
                            {formattedDeadline}
                          </span>
                        </div>
                      </div>

                      {/* Why You Match / Possible / Ineligible */}
                      <div className="space-y-2 pt-1">
                        <span className="text-xs font-bold text-slate-900 block">
                          {isEligible ? 'Why you match' : isPossible ? 'Why this is possible' : "Why you're not eligible"}
                        </span>

                        <div className="space-y-1.5">
                          {evaluations.slice(0, 3).map((ev, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs">
                              {ev.passed ? (
                                <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                                  <Check className="w-3 h-3 stroke-[3]" />
                                </div>
                              ) : isPossible ? (
                                <div className="w-4 h-4 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
                                  <AlertCircle className="w-3 h-3 stroke-[2.5]" />
                                </div>
                              ) : (
                                <div className="w-4 h-4 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0">
                                  <X className="w-3 h-3 stroke-[3]" />
                                </div>
                              )}
                              <span className={`truncate font-medium ${
                                ev.passed ? 'text-slate-600' : isPossible ? 'text-amber-800 font-semibold' : 'text-rose-800 font-semibold'
                              }`}>
                                {ev.passed ? `${ev.description || ev.details || `${ev.vector.toLowerCase()} requirement satisfied`}` : ev.details}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* Card Actions */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                      <button
                        onClick={() => setSelectedScholarship(item)}
                        className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold transition-colors cursor-pointer text-center"
                      >
                        View Details
                      </button>

                      {(() => {
                        const { applicationUrl, websiteUrl } = getScholarshipUrls(scholarship);
                        const targetUrl = applicationUrl || websiteUrl;
                        let buttonText = 'Apply Now';
                        const isLinkDisabled = !targetUrl;

                        if (lifecycleStatus === 'CLOSED') {
                          buttonText = 'Closed';
                        } else if (lifecycleStatus === 'UPCOMING' || lifecycleStatus === 'NOT_YET_OPEN') {
                          buttonText = 'Upcoming';
                        } else if (lifecycleStatus === 'AVAILABILITY_UNVERIFIED' || lifecycleStatus === 'UNKNOWN') {
                          buttonText = 'Check Official Website';
                        } else if (lifecycleStatus === 'YEAR_ROUND') {
                          buttonText = 'Apply (Year-Round)';
                        } else {
                          buttonText = applicationUrl ? 'Apply Now' : (websiteUrl ? 'Check Official Website' : 'Link Unavailable');
                        }

                        return (
                          <button
                            onClick={() => !isLinkDisabled && handleApplyNow(scholarship)}
                            disabled={isLinkDisabled}
                            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs inline-flex items-center justify-center gap-2 ${
                              isLinkDisabled
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                : 'bg-[#2563EB] hover:bg-blue-700 text-white cursor-pointer active:scale-95'
                            }`}
                            title={targetUrl ? `Opens official portal: ${targetUrl}` : 'No verified application URL available'}
                          >
                            <span>{buttonText}</span>
                            {!isLinkDisabled && <ExternalLink className="w-3.5 h-3.5" />}
                          </button>
                        );
                      })()}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

      </div>

      {/* Scholarship Detail Modal */}
      {selectedScholarship && (
        <ScholarshipDetailModal
          scholarship={selectedScholarship.scholarship}
          evaluation={selectedScholarship}
          isOpen={Boolean(selectedScholarship)}
          onClose={() => setSelectedScholarship(null)}
          onSaveApplication={(sch, status) => {
            saveApplication(sch, status);
            showToast(`Saved "${sch.name}" to your tracker!`);
          }}
        />
      )}
    </div>
  );
}
