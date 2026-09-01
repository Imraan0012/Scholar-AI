import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';

const ANALYSIS_STEPS = [
  {
    id: 1,
    title: 'Profile information',
    description: 'Reviewing basic details, category, and state of residence'
  },
  {
    id: 2,
    title: 'Academic eligibility',
    description: 'Checking qualification, course, and percentage criteria'
  },
  {
    id: 3,
    title: 'Financial eligibility',
    description: 'Evaluating family annual income against scholarship slabs'
  },
  {
    id: 4,
    title: 'Scholarship requirements',
    description: 'Filtering central, state, and private scheme guidelines'
  },
  {
    id: 5,
    title: 'Preparing your matches',
    description: 'Ranking verified opportunities based on highest fit'
  }
];

export default function EligibilityAnalysisScreen({ onAnalysisComplete }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (currentStepIndex < ANALYSIS_STEPS.length) {
      const stepDuration = 650;
      const timer = setTimeout(() => {
        setCurrentStepIndex((prev) => prev + 1);
      }, stepDuration);
      return () => clearTimeout(timer);
    } else {
      setIsCompleted(true);
      const completionTimer = setTimeout(() => {
        onAnalysisComplete?.();
      }, 900);
      return () => clearTimeout(completionTimer);
    }
  }, [currentStepIndex, onAnalysisComplete]);

  // Calculate progress between 0 and 100%
  const progressPercentage = Math.min(
    Math.round((currentStepIndex / ANALYSIS_STEPS.length) * 100),
    100
  );

  const displayStepNumber = Math.min(currentStepIndex + 1, ANALYSIS_STEPS.length);

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-slate-900 font-sans antialiased flex flex-col justify-center py-10 px-4 sm:px-6">
      <div className="max-w-xl w-full mx-auto">
        
        {/* Top Header Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            S
          </div>
          <span className="text-base font-bold text-slate-900 tracking-tight">
            Scholar AI
          </span>
        </div>

        {/* Central Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white rounded-2xl border border-slate-200/90 p-8 sm:p-10 shadow-sm"
        >
          {/* Header Section */}
          <div className="mb-6">
            <AnimatePresence mode="wait">
              {!isCompleted ? (
                <motion.div
                  key="analyzing-header"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                      Verification in progress
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Finding scholarships for you
                  </h2>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    We're checking your profile against scholarship requirements to find the opportunities you're most likely to qualify for.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="completed-header"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                      Analysis complete
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Your scholarship matches are ready
                  </h2>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    We found scholarships based on your profile and eligibility.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Progress Bar & Status */}
          <div className="mb-8 pt-1">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
              <span>
                {isCompleted ? 'All checks completed' : 'Checking eligibility'}
              </span>
              <span className="tabular-nums text-slate-700 font-bold">
                {isCompleted ? '5 of 5' : `${displayStepNumber} of ${ANALYSIS_STEPS.length}`}
              </span>
            </div>

            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full transition-all duration-500 ease-out ${
                  isCompleted ? 'bg-emerald-500' : 'bg-blue-600'
                }`}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Vertical Connected Steps */}
          <div className="space-y-0 relative">
            {ANALYSIS_STEPS.map((step, index) => {
              const isDone = index < currentStepIndex || isCompleted;
              const isCurrent = index === currentStepIndex && !isCompleted;
              const isLast = index === ANALYSIS_STEPS.length - 1;

              return (
                <div key={step.id} className="relative flex items-start gap-4 group">
                  {/* Vertical connecting line */}
                  {!isLast && (
                    <div
                      className={`absolute left-[13px] top-[28px] bottom-[-6px] w-[2px] transition-colors duration-300 ${
                        isDone ? 'bg-emerald-400' : 'bg-slate-200'
                      }`}
                    />
                  )}

                  {/* Step indicator circle */}
                  <div className="relative z-10 pt-0.5">
                    {isDone ? (
                      <div className="w-[28px] h-[28px] rounded-full bg-emerald-50 border border-emerald-500/40 flex items-center justify-center text-emerald-600 transition-all">
                        <Check className="w-4 h-4 stroke-[2.5]" />
                      </div>
                    ) : isCurrent ? (
                      <div className="w-[28px] h-[28px] rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md ring-4 ring-blue-100 transition-all">
                        <Loader2 className="w-3.5 h-3.5 animate-spin stroke-[2.5]" />
                      </div>
                    ) : (
                      <div className="w-[28px] h-[28px] rounded-full bg-white border-2 border-slate-300 flex items-center justify-center text-slate-400 transition-all">
                        <div className="w-2 h-2 rounded-full bg-slate-300" />
                      </div>
                    )}
                  </div>

                  {/* Step content */}
                  <div className="pb-6 flex-1 min-w-0">
                    <div
                      className={`text-sm font-bold transition-colors ${
                        isCurrent
                          ? 'text-blue-600'
                          : isDone
                          ? 'text-slate-900'
                          : 'text-slate-400'
                      }`}
                    >
                      {step.title}
                    </div>
                    <div
                      className={`text-xs mt-0.5 leading-relaxed transition-colors ${
                        isCurrent
                          ? 'text-slate-600'
                          : isDone
                          ? 'text-slate-500'
                          : 'text-slate-400'
                      }`}
                    >
                      {step.description}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Subtle Footer Note */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Central & State Portals
            </span>
            <span>Scholar AI Matching Engine</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
