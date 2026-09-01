import React from 'react';
import { motion } from 'framer-motion';
import { UserCheck, Cpu, Award, ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import TiltCard from '../ui/TiltCard';

export default function HowItWorksSection({ onCheckEligibilityClick }) {
  const steps = [
    {
      number: "01",
      stepTag: "Input Profile",
      title: "Tell Us About You",
      subtitle: "Personal, Academic & Financial Background",
      desc: "Provide basic parameters: Course, CGPA/Marks, Family Annual Income, Category (General, OBC, SC, ST, EWS), and State of Residence.",
      icon: UserCheck,
      color: "from-blue-500 to-indigo-600",
      accent: "text-indigo-400",
      pill: "2 Minutes Quick Input"
    },
    {
      number: "02",
      stepTag: "AI Engine",
      title: "Scholar AI Analyzes",
      subtitle: "Cross-Checking Official Scheme Rules & Criteria",
      desc: "Our matching algorithm evaluates every clause across Central NSP, State DBT portals, AICTE/UGC, and Corporate Trusts.",
      icon: Cpu,
      color: "from-indigo-500 to-cyan-500",
      accent: "text-cyan-400",
      pill: "Zero Rejection Cross-Check"
    },
    {
      number: "03",
      stepTag: "Verified Fit",
      title: "Discover Your Matches",
      subtitle: "Ranked by Eligibility & Maximum Grant",
      desc: "Get an instant tailored list of 100% eligible scholarships with exact grant values, deadline timers, and official portal application links.",
      icon: Award,
      color: "from-cyan-400 to-emerald-400",
      accent: "text-emerald-400",
      pill: "Direct Benefit Access"
    }
  ];

  return (
    <section id="how-it-works" className="py-14 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative z-10">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <motion.span
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-[11px] font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20"
        >
          How Scholar AI Works
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight mt-3"
        >
          From Search to Scholarship in <br className="hidden sm:inline" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-cyan-300">
            3 Simple Steps
          </span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-gray-300 mt-3 text-xs sm:text-sm leading-relaxed"
        >
          No more getting lost in 50 different government portals or filling tedious forms for scholarships you aren't eligible to receive.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              <TiltCard
                maxTilt={8}
                className="h-full rounded-3xl p-7 flex flex-col justify-between relative overflow-hidden group border border-white/10 bg-[#0d0f1a]/85 backdrop-blur-xl shadow-xl hover:border-indigo-500/30 transition-colors"
              >
                {/* Subtle Step Number in background */}
                <div className="absolute top-4 right-6 text-5xl font-black text-white/[0.04] select-none group-hover:text-white/[0.08] transition-colors pointer-events-none">
                  {step.number}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${step.color} p-0.5 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <div className="w-full h-full bg-[#0d0f17] rounded-[14px] flex items-center justify-center">
                        <Icon className={`w-6 h-6 ${step.accent}`} />
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/5 text-gray-300 border border-white/10">
                      {step.pill}
                    </span>
                  </div>

                  <span className={`text-xs font-bold tracking-wider uppercase ${step.accent} block mb-1`}>
                    {step.stepTag}
                  </span>

                  <h3 className="text-xl font-bold text-white mb-2">
                    {step.title}
                  </h3>

                  <p className="text-xs text-indigo-200/80 font-semibold mb-3">
                    {step.subtitle}
                  </p>

                  <p className="text-gray-400 text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-400 group-hover:text-white transition-colors">
                  <span>Step {step.number}</span>
                  <button
                    onClick={onCheckEligibilityClick}
                    className="flex items-center gap-1 font-semibold text-cyan-300 group-hover:text-cyan-200 cursor-pointer"
                  >
                    Start Step {step.number} <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
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
