import React from 'react';
import { motion } from 'framer-motion';
import { UserCheck, CheckCircle2, ExternalLink, ArrowRight } from 'lucide-react';
import TiltCard from '../ui/TiltCard';

export default function HowItWorksSection({ onCheckEligibilityClick }) {
  const steps = [
    {
      number: "01",
      stepTag: "Step 1",
      title: "Create Your Profile",
      desc: "Tell us about your education, income, category and State of Residence.",
      icon: UserCheck,
      color: "from-blue-500 to-indigo-600",
      accent: "text-indigo-400"
    },
    {
      number: "02",
      stepTag: "Step 2",
      title: "See Your Matches",
      desc: "Scholar AI compares your profile with current scholarship requirements.",
      icon: CheckCircle2,
      color: "from-indigo-500 to-cyan-500",
      accent: "text-cyan-400"
    },
    {
      number: "03",
      stepTag: "Step 3",
      title: "Apply Officially",
      desc: "Review why you qualify and continue to the official application portal.",
      icon: ExternalLink,
      color: "from-cyan-400 to-emerald-400",
      accent: "text-emerald-400"
    }
  ];

  return (
    <section id="how-it-works" className="py-14 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative z-10">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          How it works in <br className="hidden sm:inline" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-cyan-300">
            3 simple steps
          </span>
        </h2>
        <p className="text-gray-300 mt-3 text-xs sm:text-sm leading-relaxed">
          No more searching through dozens of disconnected portals. Find what you qualify for in minutes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.12 }}
            >
              <TiltCard
                maxTilt={6}
                className="h-full rounded-3xl p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden group border border-white/10 bg-[#0d0f1a]/85 backdrop-blur-xl shadow-xl hover:border-indigo-500/30 transition-colors"
              >
                {/* Step Number in background */}
                <div className="absolute top-4 right-6 text-4xl font-black text-white/[0.05] select-none group-hover:text-white/[0.08] transition-colors pointer-events-none">
                  {step.number}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${step.color} p-0.5 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                      <div className="w-full h-full bg-[#0d0f17] rounded-[14px] flex items-center justify-center">
                        <Icon className={`w-5 h-5 ${step.accent}`} />
                      </div>
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/5 text-gray-300 border border-white/10">
                      {step.stepTag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">
                    {step.title}
                  </h3>

                  <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
                  <span>Step {step.number}</span>
                  <button
                    onClick={onCheckEligibilityClick}
                    className="flex items-center gap-1 font-semibold text-cyan-300 group-hover:text-cyan-200 cursor-pointer"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </TiltCard>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
