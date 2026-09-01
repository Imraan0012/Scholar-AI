import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, ExternalLink, Calendar, ShieldCheck, FileText, Building, Clock, Check } from 'lucide-react';
import { generateEligibilityExplanation } from '../../engine/aiExplanations';
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
  if (!dateStr) return '31 Oct 2026';
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
  React.useEffect(() => {
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

  // Normalize result or evaluation prop
  const activeResult = result || evaluation || {
    scholarship: scholarship,
    isEligible: true,
    matchScore: 100,
    tier: 'STRONG_MATCH',
    evaluations: scholarship?.rules?.map(r => ({ vector: r.field, passed: true, details: r.description })) || []
  };

  const activeScholarship = scholarship || activeResult.scholarship;

  if (!isOpen || !activeScholarship) return null;

  const { isEligible = true, matchScore = 100, tier = 'STRONG_MATCH', evaluations = [] } = activeResult;
  const explanation = generateEligibilityExplanation(activeResult, profile);
  const { applicationUrl, websiteUrl } = getScholarshipUrls(activeScholarship);
  const targetUrl = applicationUrl || websiteUrl;
  const govLevel = activeScholarship.government_level || activeScholarship.governmentLevel || 'OFFICIAL';
  const amountDisplay = activeScholarship.amount_display || activeScholarship.amountDisplay || activeScholarship.amount || 'As per norms';
  const deadline = activeScholarship.application_deadline || activeScholarship.applicationDeadline || activeScholarship.deadline;
  const openDate = activeScholarship.application_open_date || activeScholarship.applicationOpenDate || activeScholarship.application_start;
  const rawStatus = activeScholarship.status;
  const reqDocs = activeScholarship.required_documents || activeScholarship.requiredDocuments || [];

  const lifecycleStatus = calculateDeadlineStatus(deadline, openDate, rawStatus);

  let buttonText = 'Apply Now';
  const isLinkDisabled = !targetUrl;

  if (lifecycleStatus === 'CLOSED') {
    buttonText = 'Applications Closed';
  } else if (lifecycleStatus === 'UPCOMING' || lifecycleStatus === 'NOT_YET_OPEN') {
    buttonText = 'Upcoming Cycle';
  } else if (lifecycleStatus === 'AVAILABILITY_UNVERIFIED' || lifecycleStatus === 'UNKNOWN') {
    buttonText = 'Check Official Website';
  } else if (lifecycleStatus === 'YEAR_ROUND') {
    buttonText = 'Apply (Year-Round)';
  } else {
    buttonText = applicationUrl ? 'Apply Now' : (websiteUrl ? 'Check Official Website' : 'Application Link Unavailable');
  }

  const formatDeadlineDisplay = (dStr) => {
    if (dStr) return formatDeadline(dStr);
    if (lifecycleStatus === 'YEAR_ROUND') return 'Year-Round / Rolling';
    if (lifecycleStatus === 'AVAILABILITY_UNVERIFIED' || lifecycleStatus === 'UNKNOWN') return 'Availability Unverified (Check Portal)';
    if (lifecycleStatus === 'UPCOMING') return 'Upcoming Cycle';
    if (lifecycleStatus === 'CLOSED') return 'Applications Closed';
    return 'Check Official Portal';
  };

  const handleApplyClick = () => {
    if (targetUrl) {
      onSaveApplication?.(activeScholarship, 'APPLIED');
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative z-10 w-full max-w-2xl my-auto bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-8 text-slate-900 overflow-hidden space-y-6 max-h-[90vh] overflow-y-auto"
        >
          {/* Header & Close Button */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-xs font-black px-3 py-1 rounded-full border ${
                  isEligible
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}>
                  {matchScore}% Match ({tier?.replace('_', ' ')})
                </span>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] border border-blue-200 uppercase">
                  {govLevel} SCHEME
                </span>
                {(activeScholarship.last_verified_at || activeScholarship.lastVerifiedAt) && (
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-600 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    Verified Official
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
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Official Provider & Website Link */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] text-slate-500 block uppercase tracking-wider font-bold">Official Provider</span>
              <span className="text-sm font-bold text-slate-900 mt-0.5 block flex items-center gap-1.5">
                <Building className="w-4 h-4 text-slate-400" />
                {activeScholarship.provider || 'Official Organization'}
              </span>
            </div>
            {websiteUrl && (
              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2563EB] hover:underline whitespace-nowrap"
              >
                <span>Visit Official Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          {/* Amount & Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90">
              <span className="text-xs text-slate-500 uppercase tracking-wider font-bold block">Award Amount</span>
              <span className="text-lg font-extrabold text-emerald-600 block mt-0.5">
                {amountDisplay}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90">
              <span className="text-xs text-slate-500 uppercase tracking-wider font-bold block">Application Deadline</span>
              <span className="text-sm font-bold text-slate-900 block mt-0.5 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                {formatDeadlineDisplay(deadline)}
              </span>
            </div>
          </div>

          {/* Explainable AI Evaluation */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
              <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider">
                Eligibility Breakdown & Evaluation
              </h3>
            </div>

            <div className="space-y-2">
              {evaluations.map((ev, i) => (
                <div
                  key={i}
                  className={`p-3.5 rounded-xl border text-xs sm:text-sm flex items-start gap-3 ${
                    ev.passed
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950 font-medium'
                      : 'bg-rose-50/70 border-rose-200 text-rose-950 font-medium'
                  }`}
                >
                  <div className="mt-0.5 flex-shrink-0">
                    {ev.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-600" />
                    )}
                  </div>
                  <div>
                    <span className="font-bold block text-slate-900">{ev.vector}</span>
                    <span className="text-xs text-slate-600 leading-relaxed block mt-0.5">
                      {ev.details || ev.description}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Required Documents Checklist */}
          {activeScholarship.required_documents && activeScholarship.required_documents.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-purple-600" />
                <span>Required Documents ({activeScholarship.required_documents.length})</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeScholarship.required_documents.map((doc, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <span className="text-slate-700 truncate pr-2 font-medium">{doc.name || doc.code}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 whitespace-nowrap">
                      Required
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Modal Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold transition-colors cursor-pointer text-center"
            >
              Close
            </button>
            <button
              onClick={handleApplyClick}
              disabled={isLinkDisabled}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-white text-sm font-bold inline-flex items-center justify-center gap-2 transition-all shadow-md ${
                isLinkDisabled
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-[#2563EB] hover:bg-blue-700 cursor-pointer active:scale-95'
              }`}
              title={targetUrl ? `Opens official portal in new tab: ${targetUrl}` : 'No verified application URL available'}
            >
              <span>{buttonText}</span>
              {!isLinkDisabled && <ExternalLink className="w-4 h-4" />}
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
