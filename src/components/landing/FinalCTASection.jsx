import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, CheckCircle2, ShieldCheck, Landmark } from 'lucide-react';
import { HoverBorderGradient } from '../ui/HoverBorderGradient';
import MagneticButton from '../ui/MagneticButton';

export default function FinalCTASection({ onCheckEligibilityClick }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative z-10 text-center"
    >
      <div className="relative rounded-3xl p-10 sm:p-16 overflow-hidden border border-white/15 bg-gradient-to-b from-[#111424] to-[#0a0b12] shadow-2xl backdrop-blur-xl">
        {/* Animated Glow orb inside CTA card */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.2, 0.35, 0.2]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-indigo-600/20 blur-[110px] pointer-events-none"
        />

        <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/20 inline-block mb-4">
          100% Free For All Indian Students
        </span>

        <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight max-w-3xl mx-auto leading-tight">
          Stop Searching. <br className="hidden sm:inline" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-cyan-200 to-emerald-300">
            Start Matching.
          </span>
        </h2>

        <p className="text-gray-200 mt-5 text-base sm:text-xl max-w-xl mx-auto font-medium leading-relaxed drop-shadow-md">
          Let Scholar AI find the scholarships you're actually eligible for across Central, State, and Corporate funds.
        </p>

        <div className="mt-10 flex justify-center">
          <MagneticButton strength={0.25} onClick={onCheckEligibilityClick}>
            <HoverBorderGradient
              containerClassName="rounded-full shadow-2xl shadow-indigo-500/30"
              className="bg-[#0b0d16] text-white font-bold text-lg px-10 py-4 flex items-center gap-3 group cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
              <span>Check My Eligibility</span>
              <ArrowRight className="w-5 h-5 text-indigo-300 group-hover:translate-x-1.5 transition-transform duration-300" />
            </HoverBorderGradient>
          </MagneticButton>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-300 font-medium">
          <span className="flex items-center gap-1.5 hover:text-white transition-colors">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Instant profile verification
          </span>
          <span className="flex items-center gap-1.5 hover:text-white transition-colors">
            <Landmark className="w-4 h-4 text-cyan-400" /> Direct official portal links
          </span>
          <span className="flex items-center gap-1.5 hover:text-white transition-colors">
            <ShieldCheck className="w-4 h-4 text-indigo-400" /> Zero fake or expired listings
          </span>
        </div>
      </div>
    </motion.section>
  );
}
