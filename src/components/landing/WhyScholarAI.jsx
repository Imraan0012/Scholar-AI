import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Target, BellRing, Sparkles, CheckCircle2, Clock } from 'lucide-react';
import TiltCard from '../ui/TiltCard';

export default function WhyScholarAI() {
  const points = [
    {
      icon: Target,
      title: "No False Promises",
      desc: "We test your exact profile against every clause and eligibility criteria so you never spend hours on disqualified applications."
    },
    {
      icon: ShieldCheck,
      title: "100% Verified Authentic Schemes",
      desc: "Every scholarship is cross-referenced with government gazettes, institutional registries, and verified trust databases."
    },
    {
      icon: BellRing,
      title: "Real-Time Deadline Alerts",
      desc: "Never miss crucial portal openings, verification rounds, or submission windows with personalized timeline alerts."
    },
    {
      icon: Sparkles,
      title: "Tailored for Indian Education",
      desc: "Full support for all State Boards, CBSE, ICSE, State Quotas, Caste/Income categories, and central university schemes."
    }
  ];

  return (
    <motion.section
      id="why-us"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="py-14 sm:py-16 px-4 max-w-5xl mx-auto relative z-10"
    >
      <div className="glass-panel rounded-2xl p-6 sm:p-9 lg:p-10 border border-white/10 relative overflow-hidden bg-gradient-to-b from-[#10131f]/90 to-[#0c0d14]/95 shadow-2xl backdrop-blur-2xl">
        <div className="max-w-2xl mb-8">
          <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Why Scholar AI
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight mt-3">
            Designed to End Scholarship Confusion
          </h2>
          <p className="text-gray-300 mt-3 text-xs sm:text-sm leading-relaxed">
            Over ₹1,000 Crores in Indian scholarships go unclaimed each year simply because students don't know they qualify. Scholar AI bridges this exact gap.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {points.map((pt, idx) => {
            const Icon = pt.icon;
            return (
              <motion.div
                key={pt.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.12 }}
              >
                <TiltCard
                  maxTilt={6}
                  glare={false}
                  className="h-full flex items-start gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-indigo-400/30 hover:bg-white/[0.06] transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center flex-shrink-0 text-indigo-400 mt-0.5 shadow-md">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white mb-1">
                      {pt.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {pt.desc}
                    </p>
                  </div>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
