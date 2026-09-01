import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Target, BellRing, Building2 } from 'lucide-react';
import TiltCard from '../ui/TiltCard';

export default function WhyScholarAI() {
  const points = [
    {
      icon: ShieldCheck,
      title: "Verified Schemes",
      desc: "Every scholarship in our catalog is verified directly against official government and trust portals."
    },
    {
      icon: Target,
      title: "Accurate Eligibility Matching",
      desc: "We check your specific academic, income, category and state criteria so you only see scholarships you qualify for."
    },
    {
      icon: BellRing,
      title: "Verified Deadlines & Timelines",
      desc: "Track active application windows, upcoming cycles, and official closing dates without missing deadlines."
    },
    {
      icon: Building2,
      title: "Pan-India Coverage",
      desc: "Central Government NSP programs, State Department portals, and premier Corporate Trust grants in one place."
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
      <div className="glass-panel rounded-3xl p-6 sm:p-9 lg:p-10 border border-white/10 relative overflow-hidden bg-gradient-to-b from-[#10131f]/90 to-[#0c0d14]/95 shadow-2xl backdrop-blur-2xl">
        <div className="max-w-2xl mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Built to end scholarship confusion
          </h2>
          <p className="text-gray-300 mt-3 text-xs sm:text-sm leading-relaxed">
            Thousands of Indian students miss out on scholarships simply because they don't know they qualify or where to apply. Scholar AI solves this by matching your profile with verified opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {points.map((pt, idx) => {
            const Icon = pt.icon;
            return (
              <motion.div
                key={pt.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
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
                    <h3 className="text-base font-bold text-white mb-1">
                      {pt.title}
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
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
