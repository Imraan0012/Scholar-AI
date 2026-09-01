import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ExternalLink,
  Calendar,
  ShieldCheck,
  FileText,
  Building,
  Clock,
  Check,
  HelpCircle,
  Sparkles,
  Award,
  ChevronRight,
  Info
} from 'lucide-react';
import { calculateDeadlineStatus } from '../../engine/eligibilityEngine';
import { useStudentProfile } from '../../context/StudentProfileContext';

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

const formatDeadline = (dateStr) => {
  if (!dateStr) return 'Refer Official Portal';
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

export default function ScholarshipDetailModal({ scholarship, evaluation, result, isOpen, onClose, onSaveApplication }) {
  const { profile } = useStudentProfile();

  // Close with Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Normalize result or evaluation prop
  const activeResult = result || evaluation || {
    scholarship: scholarship,
    isEligible: true,
    matchScore: 100,
    tier: 'STRONG_MATCH',
    evaluations: scholarship?.rules?.map(r => ({ vector: r.field || r.conditionField, passed: true, details: r.description || r.ruleDescription })) || [],
    matchedCriteria: scholarship?.rules?.map(r => r.description || r.ruleDescription || `${r.field} verified`) || [],
    failedCriteria: [],
    missingInformation: []
  };

  const activeScholarship = scholarship || activeResult.scholarship;
  if (!activeScholarship) return null;

  const isEligible = activeResult.isEligible !== undefined ? activeResult.isEligible : (activeResult.eligible !== undefined ? activeResult.eligible : true);
  const tier = activeResult.tier || (isEligible ? 'STRONG_MATCH' : 'INELIGIBLE');
  const matchScore = activeResult.matchScore !== undefined ? activeResult.matchScore : 100;
  const isPossible = tier === 'POSSIBLE_MATCH';
  const isIneligible = !isEligible || tier === 'INELIGIBLE';

  const evaluations = Array.isArray(activeResult.evaluations) ? activeResult.evaluations : [];
  const matchedCriteria = Array.isArray(activeResult.matchedCriteria) ? activeResult.matchedCriteria : [];
  const failedCriteria = Array.isArray(activeResult.failedCriteria) ? activeResult.failedCriteria : [];
  const missingInformation = Array.isArray(activeResult.missingInformation) ? activeResult.missingInformation : [];

  const { applicationUrl, websiteUrl } = getScholarshipUrls(activeScholarship);
  const targetUrl = applicationUrl || websiteUrl;
  const govLevel = activeScholarship.government_level || activeScholarship.governmentLevel || 'GOVERNMENT';
  const amountDisplay = activeScholarship.amount_display || activeScholarship.amountDisplay || activeScholarship.amount || 'Benefit details available on official portal';
  const deadline = activeScholarship.application_deadline || activeScholarship.applicationDeadline || activeScholarship.deadline;
  const openDate = activeScholarship.application_open_date || activeScholarship.applicationOpenDate || activeScholarship.application_start;
  const rawStatus = activeScholarship.status;
  const reqDocs = activeScholarship.required_documents || activeScholarship.requiredDocuments || activeScholarship.documents || [];
  const rules = activeScholarship.rules || [];

  const lifecycleStatus = calculateDeadlineStatus(deadline, openDate, rawStatus);

  let buttonText = 'Apply on Official Portal';
  const isLinkDisabled = !targetUrl;

  if (lifecycleStatus === 'CLOSED') {
    buttonText = 'Applications Closed';
  } else if (lifecycleStatus === 'UPCOMING' || lifecycleStatus === 'NOT_YET_OPEN') {
    buttonText = 'Upcoming Cycle (Check Website)';
  } else if (lifecycleStatus === 'AVAILABILITY_UNVERIFIED' || lifecycleStatus === 'UNKNOWN') {
    buttonText = 'Check Official Website';
  } else if (lifecycleStatus === 'YEAR_ROUND') {
    buttonText = 'Apply on Official Portal (Year-Round)';
  } else {
    buttonText = applicationUrl ? 'Apply on Official Portal' : (websiteUrl ? 'Check Official Website' : 'Portal Link Unavailable');
  }

  const formatDeadlineDisplay = (dStr) => {
    if (dStr) return formatDeadline(dStr);
    if (lifecycleStatus === 'YEAR_ROUND') return 'Year-Round / Rolling Submissions';
    if (lifecycleStatus === 'AVAILABILITY_UNVERIFIED' || lifecycleStatus === 'UNKNOWN') return 'Refer to Official Portal';
    if (lifecycleStatus === 'UPCOMING') return 'Upcoming Cycle';
    if (lifecycleStatus === 'CLOSED') return 'Applications Closed';
    return 'Refer to Official Portal';
  };

  const handleApplyClick = () => {
    if (targetUrl) {
      onSaveApplication?.(activeScholarship, 'APPLIED');
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/65 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative z-10 w-full max-w-2xl my-auto bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-8 text-slate-900 space-y-6 max-h-[92vh] overflow-y-auto selection:bg-blue-600 selection:text-white"
        >
          {/* Top Row: Eligibility Badge & Close Button */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center gap-2">
                {/* Personalized Status Pill */}
                {isPossible ? (
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    Possible Match • Verification Needed
                  </span>
                ) : isIneligible ? (
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 flex items-center gap-1.5">
                    <XCircle className="w-3.5 h-3.5 text-rose-600" />
                    Not Eligible ({matchScore}% match)
                  </span>
                ) : (
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    {matchScore}% Match • Eligible
                  </span>
                )}

                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wide">
                  {govLevel.replace('_', ' ')}
                </span>

                {(activeScholarship.verification_status === 'VERIFIED' || activeScholarship.source_reliability === 'LEVEL_1_OFFICIAL_GOVT') && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Verified Scheme
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                {activeScholarship.name}
              </h2>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer flex-shrink-0"
              aria-label="Close details dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Provider & Official Portal Link */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10.5px] text-slate-400 block uppercase tracking-wider font-extrabold">Official Provider / Ministry</span>
              <span className="text-sm font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                <Building className="w-4 h-4 text-slate-400" />
                {activeScholarship.provider || activeScholarship.ministry_or_department || 'Official Government / Trust Body'}
              </span>
            </div>
            {websiteUrl && (
              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#2563EB] hover:underline whitespace-nowrap"
              >
                <span>Visit Official Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          {/* Award Amount & Deadline Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10.5px] text-slate-400 uppercase tracking-wider font-extrabold block">Scholarship Benefit</span>
              <span className="text-lg font-black text-emerald-700 block mt-0.5">
                {amountDisplay}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10.5px] text-slate-400 uppercase tracking-wider font-extrabold block">Application Timeline</span>
              <span className="text-sm font-bold text-slate-900 block mt-1 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
                {formatDeadlineDisplay(deadline)}
              </span>
            </div>
          </div>

          {/* Description Section if Available */}
          {activeScholarship.description && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Scheme Overview</span>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {activeScholarship.description}
              </p>
            </div>
          )}

          {/* ── 1. PERSONALIZED DECISION TREE EXPLANATION (WHY YOU MATCH / WHY NOT) ── */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#2563EB]" />
              <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider">
                Personalized Eligibility Analysis
              </h3>
            </div>

            {/* A. Why You Match (Passed Criteria) */}
            {(matchedCriteria.length > 0 || evaluations.some(e => e.passed)) && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Why you match:
                </span>
                <div className="space-y-1.5 pl-1">
                  {matchedCriteria.length > 0 ? (
                    matchedCriteria.map((reason, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                        <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{reason}</span>
                      </div>
                    ))
                  ) : (
                    evaluations.filter(e => e.passed).map((ev, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                        <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{ev.details || ev.description || `${ev.vector || 'Criteria'} requirement satisfied`}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* B. Needs Confirmation (Possible Match Items) */}
            {(isPossible || missingInformation.length > 0) && (
              <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 space-y-2">
                <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  Needs confirmation on official portal:
                </span>
                <div className="space-y-1 pl-1 text-xs text-amber-950 font-medium">
                  {missingInformation.length > 0 ? (
                    missingInformation.map((info, idx) => (
                      <div key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>{info}</span>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>Supplementary verification or bonafide institution status required on official application portal.</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* C. Why Not Eligible (Failed Criteria) */}
            {isIneligible && (failedCriteria.length > 0 || evaluations.some(e => !e.passed)) && (
              <div className="p-3.5 rounded-xl bg-rose-50/80 border border-rose-200 space-y-2">
                <span className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                  <XCircle className="w-3.5 h-3.5 text-rose-600" />
                  Why you're not eligible:
                </span>
                <div className="space-y-1 pl-1 text-xs text-rose-950 font-medium">
                  {failedCriteria.length > 0 ? (
                    failedCriteria.map((fail, idx) => (
                      <div key={idx} className="flex items-start gap-1.5">
                        <span className="text-rose-600 font-bold">✕</span>
                        <span>{fail}</span>
                      </div>
                    ))
                  ) : (
                    evaluations.filter(e => !e.passed).map((ev, idx) => (
                      <div key={idx} className="flex items-start gap-1.5">
                        <span className="text-rose-600 font-bold">✕</span>
                        <span>{ev.details || ev.description || `${ev.vector || 'Criteria'} does not meet requirement`}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── 2. SCHOLARSHIP ELIGIBILITY REQUIREMENTS (CRITERIA RULES) ── */}
          {rules.length > 0 && (
            <div className="space-y-2.5 pt-1">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
                Official Scheme Requirements
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {rules.map((rule, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
                    <span className="text-slate-600 font-medium capitalize truncate">
                      {(rule.conditionField || rule.field || 'Criteria').replace('_', ' ')}
                    </span>
                    <span className="font-bold text-slate-900 truncate text-right">
                      {rule.ruleDescription || rule.description || String(rule.value || rule.valueJson || 'Mandatory')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── 3. DOCUMENTS TO PREPARE ── */}
          <div className="space-y-2.5 pt-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
              Documents to Prepare
            </span>

            {reqDocs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {reqDocs.map((doc, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <span className="text-slate-700 truncate pr-2 font-medium">
                      {doc.name || doc.documentName || doc.code || 'Official Certificate'}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                      Prepare
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500">
                Check the official scholarship portal for exact document submission requirements.
              </div>
            )}
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold transition-colors cursor-pointer text-center"
            >
              Close
            </button>

            <button
              onClick={handleApplyClick}
              disabled={isLinkDisabled}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-white text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 transition-all shadow-md ${
                isLinkDisabled
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-[#2563EB] hover:bg-blue-700 cursor-pointer active:scale-95 shadow-blue-500/20'
              }`}
              title={targetUrl ? `Opens official portal: ${targetUrl}` : 'No verified application URL available'}
            >
              <span>{buttonText}</span>
              {!isLinkDisabled && <ExternalLink className="w-3.5 h-3.5" />}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
