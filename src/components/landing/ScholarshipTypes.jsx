import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink, ShieldCheck, Calendar, Building, Landmark, Check } from 'lucide-react';
import { useStudentProfile } from '../../context/StudentProfileContext';
import { getScholarshipDeadlineDisplay } from '../../engine/eligibilityEngine';
import StatusBadge from '../ui/StatusBadge';
import ScholarshipDetailModal from '../results/ScholarshipDetailModal';

export default function ScholarshipTypes({ onCheckEligibilityClick }) {
  const { scholarships = [] } = useStudentProfile();
  const [selectedScholarship, setSelectedScholarship] = useState(null);

  // Pick 3 representative real scholarships from catalog
  const previewList = (scholarships && scholarships.length > 0)
    ? scholarships.slice(0, 3)
    : [];

  const getTargetUrl = (s) => {
    return s.official_application_url || s.application_url || s.official_website_url || s.website_url || null;
  };

  return (
    <motion.section
      id="scholarships"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="py-14 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative z-10"
    >
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Scholarships available <br className="hidden sm:inline" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-indigo-300 to-emerald-300">
            right now
          </span>
        </h2>
        <p className="text-gray-300 mt-3 text-xs sm:text-sm leading-relaxed">
          Explore live verified scholarships from our catalog across Central, State, and Corporate programs.
        </p>
      </div>

      {/* 3 Live Scholarship Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
        {previewList.map((item) => {
          const targetUrl = getTargetUrl(item);
          const deadlineInfo = getScholarshipDeadlineDisplay(item);
          const isClosed = deadlineInfo.isClosed;

          return (
            <div
              key={item.id}
              className="p-5 sm:p-6 rounded-3xl bg-[#0d0f19]/90 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between space-y-4 shadow-xl backdrop-blur-xl group"
            >
              <div className="space-y-3">
                {/* Status + Official Source Indicator */}
                <div className="flex items-center justify-between gap-2">
                  <StatusBadge status={item.status || 'OPEN'} />
                  <span className="text-[10.5px] font-semibold text-emerald-400 inline-flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Official source ✓</span>
                  </span>
                </div>

                {/* Title & Provider */}
                <div>
                  <h3 className="text-base font-bold text-white leading-snug group-hover:text-cyan-200 transition-colors line-clamp-2">
                    {item.name}
                  </h3>
                  <span className="text-xs text-gray-400 block mt-1 truncate">
                    {item.provider || 'Official Organization'}
                  </span>
                </div>

                {/* Amount & Deadline */}
                <div className="pt-3 border-t border-white/5 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Amount</span>
                    <span className="font-extrabold text-emerald-400 text-xs sm:text-sm mt-0.5 block truncate">
                      {item.amount_display || 'As per norms'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Deadline</span>
                    <span className="font-semibold text-gray-200 text-xs mt-0.5 block truncate">
                      {deadlineInfo.primaryText}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-white/5 flex items-center gap-2">
                <button
                  onClick={() => setSelectedScholarship(item)}
                  className="flex-1 py-2 px-3 rounded-xl border border-white/10 hover:bg-white/5 text-gray-200 text-xs font-bold transition-colors cursor-pointer text-center"
                >
                  View Details
                </button>

                {targetUrl && !isClosed ? (
                  <a
                    href={targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 text-white text-xs font-bold transition-all text-center inline-flex items-center justify-center gap-1 shadow-md cursor-pointer"
                  >
                    <span>{isUnverified ? 'Official Site' : 'Apply'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <button
                    disabled
                    className="flex-1 py-2 px-3 rounded-xl bg-white/5 text-gray-400 text-xs font-semibold cursor-not-allowed text-center"
                  >
                    {isClosed ? 'Closed' : 'Unavailable'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Explore All CTA */}
      <div className="mt-8 text-center">
        <button
          onClick={onCheckEligibilityClick}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-cyan-300 hover:text-cyan-200 bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-3 rounded-full transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <span>Explore All Scholarships</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Details Modal */}
      {selectedScholarship && (
        <ScholarshipDetailModal
          scholarship={selectedScholarship}
          isOpen={Boolean(selectedScholarship)}
          onClose={() => setSelectedScholarship(null)}
        />
      )}
    </motion.section>
  );
}
