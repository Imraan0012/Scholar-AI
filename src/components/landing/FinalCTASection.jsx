import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, ShieldCheck, Landmark } from 'lucide-react';
import { useStudentProfile } from '../../context/StudentProfileContext';
import { profileService } from '../../services/profileService';

export default function FinalCTASection({ onCheckEligibilityClick }) {
  const { currentUser, profile } = useStudentProfile();
  const firstIncomplete = profileService.getFirstIncompleteStep(profile);
  const isProfileComplete = Boolean(profile?.onboardingComplete || profile?.isOnboarded) || firstIncomplete === 6;

  const titleText = !currentUser
    ? 'Find scholarships that match you.'
    : isProfileComplete
    ? "See what's available for you now."
    : 'Complete your profile to unlock matches.';

  const buttonText = !currentUser
    ? 'Check My Eligibility'
    : isProfileComplete
    ? 'View My Matches'
    : 'Complete My Profile';

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="py-14 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto relative z-10 text-center"
    >
      <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden border border-white/15 bg-gradient-to-b from-[#111424] to-[#0a0b12] shadow-2xl backdrop-blur-xl">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight max-w-2xl mx-auto leading-tight">
          {titleText}
        </h2>

        <p className="text-gray-300 mt-3 text-xs sm:text-sm max-w-lg mx-auto font-normal leading-relaxed">
          Discover verified Indian scholarships matched to your education, income, category and State of Residence.
        </p>

        <div className="mt-6 flex justify-center">
          <button
            onClick={onCheckEligibilityClick}
            className="px-7 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-xl shadow-indigo-500/20 inline-flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>{buttonText}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-300 font-medium pt-4 border-t border-white/5">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Accurate criteria matching
          </span>
          <span className="flex items-center gap-1.5">
            <Landmark className="w-3.5 h-3.5 text-cyan-400" /> Direct official portal links
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> 100% free for students
          </span>
        </div>
      </div>
    </motion.section>
  );
}
