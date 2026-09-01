import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, GraduationCap, IndianRupee, ShieldCheck, MapPin } from 'lucide-react';
import { useStudentProfile } from '../../context/StudentProfileContext';
import { profileService } from '../../services/profileService';

export default function BuiltForIndiaSection({ onCheckEligibilityClick }) {
  const { currentUser, profile } = useStudentProfile();
  const firstIncomplete = profileService.getFirstIncompleteStep(profile);
  const isProfileComplete = Boolean(profile?.onboardingComplete || profile?.isOnboarded) || firstIncomplete === 6;

  const criteria = [
    {
      id: 'academic',
      title: 'Academic Details',
      desc: 'Course, year and academic performance',
      icon: GraduationCap,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10 border-indigo-500/20'
    },
    {
      id: 'income',
      title: 'Family Income',
      desc: 'Checks financial eligibility and income limits',
      icon: IndianRupee,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20'
    },
    {
      id: 'category',
      title: 'Category & Special Eligibility',
      desc: 'Category and applicable special requirements',
      icon: ShieldCheck,
      color: 'text-violet-400',
      bg: 'bg-violet-500/10 border-violet-500/20'
    },
    {
      id: 'location',
      title: 'State of Residence',
      desc: 'Central and state-specific scholarship eligibility',
      icon: MapPin,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/20'
    }
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="py-14 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative z-10"
    >
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Scholarships matched to <br className="hidden sm:inline" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 via-cyan-200 to-indigo-300">
            your profile
          </span>
        </h2>
        <p className="text-gray-300 mt-3 text-xs sm:text-sm leading-relaxed">
          Scholar AI compares your saved profile with scholarship requirements to identify schemes that fit your education, income, category and State of Residence.
        </p>
      </div>

      {/* Two-Column Clean Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: 4 Criteria Cards */}
        <div className="lg:col-span-7 space-y-3">
          {criteria.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="p-4 sm:p-4.5 rounded-2xl bg-[#0e101c]/80 border border-white/10 hover:border-white/20 transition-all flex items-start gap-4 shadow-md backdrop-blur-xl"
              >
                <div className={`w-10 h-10 rounded-xl ${item.bg} border flex items-center justify-center flex-shrink-0 ${item.color} mt-0.5`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Clean Premium Eligibility Preview Card */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-full max-w-md p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-[#111424] to-[#0d0f19] border border-white/15 shadow-2xl backdrop-blur-2xl text-white space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 block">
                  Eligibility Evaluation
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  Your eligibility profile
                </h3>
              </div>
              <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Live Check
              </span>
            </div>

            {/* Checklist Items */}
            <div className="space-y-3">
              {[
                { label: 'Academic details', value: currentUser && profile.course ? profile.course : 'Course & score verified' },
                { label: 'Family income', value: currentUser && profile.annualIncome ? `₹${Number(profile.annualIncome).toLocaleString('en-IN')}/yr` : 'Income limit evaluated' },
                { label: 'Category & special criteria', value: currentUser && profile.category ? `${profile.category} category` : 'Quotas & reservations' },
                { label: 'State of Residence', value: currentUser && profile.domicileState ? profile.domicileState : 'Central & state quotas' }
              ].map((row, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span className="font-semibold text-gray-200">{row.label}</span>
                  </div>
                  <span className="text-[11px] text-gray-400 font-medium truncate max-w-[130px]">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-400 leading-relaxed pt-1">
              Scholar AI compares these details with current scholarship requirements to find exact matches.
            </p>

            <button
              onClick={onCheckEligibilityClick}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <span>{currentUser && isProfileComplete ? 'View My Matches' : 'Check My Eligibility'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
