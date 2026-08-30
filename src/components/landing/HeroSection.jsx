import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ChevronRight, Landmark, Building2, GraduationCap } from 'lucide-react';
import { HoverBorderGradient } from '../ui/HoverBorderGradient';
import { FlipWords } from '../ui/flip-words';
import TiltCard from '../ui/TiltCard';
import CounterNumber from '../ui/CounterNumber';
import MagneticButton from '../ui/MagneticButton';

export default function HeroSection({ currentUser, onCheckEligibilityClick, onAuthClick }) {
  const eligibleWords = [
    "You're Actually Eligible For",
    "Across 12,500+ Indian Grants",
    "Matched To Your Income & State",
    "Tailored To Your Social Category"
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 18
      }
    }
  };

  return (
    <section id="hero" className="relative min-h-[85vh] pt-28 pb-14 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 overflow-hidden z-10">

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-4xl flex flex-col items-center"
      >
        {/* Top Tagline Pill with Live Pulse */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#101322]/80 border border-indigo-500/30 text-indigo-200 text-xs sm:text-xs font-semibold mb-6 shadow-lg shadow-indigo-950/40 hover:border-indigo-400/50 transition-colors"
        >
          <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-emerald-400 font-bold">
            <CounterNumber value={12500} suffix="+" duration={1.5} />
          </span>
          <span className="text-gray-300">Active Government & Private Indian Scholarships</span>
        </motion.div>

        {/* Main Headline with FlipWords */}
        <motion.h1
          variants={itemVariants}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-center tracking-tight text-white max-w-4xl leading-[1.15]"
        >
          Find Scholarships <br className="hidden sm:inline" />
          <FlipWords
            text="You're Actually Eligible For"
            words={eligibleWords}
            duration={3000}
            className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 via-cyan-200 to-indigo-300 font-black"
          />
        </motion.h1>

        {/* Clear Domain-Specific Supporting Text */}
        <motion.p
          variants={itemVariants}
          className="mt-4 text-xs sm:text-sm md:text-base text-gray-300 text-center max-w-2xl font-normal leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]"
        >
          Tell Scholar AI about yourself and discover verified Indian scholarships matched directly to your <strong className="text-white font-semibold">academic profile, family income, reservation category, course, and state domicile</strong>.
        </motion.p>

        {/* Dominant Call To Action Bar with Magnetic hover */}
        <motion.div
          variants={itemVariants}
          className="mt-8 flex flex-col sm:flex-row items-center gap-3.5 z-20"
        >
          <MagneticButton strength={0.25} onClick={onCheckEligibilityClick}>
            <HoverBorderGradient
              as="div"
              containerClassName="rounded-full shadow-xl shadow-indigo-500/20"
              className="bg-gradient-to-r from-indigo-950 via-slate-900 to-zinc-950 text-white font-bold text-sm sm:text-base px-7 py-3 flex items-center gap-2.5 group cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
              <span>Check My Eligibility</span>
              <ArrowRight className="w-4 h-4 text-indigo-300 group-hover:translate-x-1.5 transition-transform duration-300" />
            </HoverBorderGradient>
          </MagneticButton>

          {!currentUser && (
            <button
              onClick={() => onAuthClick?.('signup')}
              className="text-xs sm:text-sm font-semibold text-white px-5 py-3 rounded-full bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <span>Create Free Account</span>
              <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
            </button>
          )}

          <a
            href="#how-it-works"
            className="text-xs sm:text-sm font-semibold text-gray-300 hover:text-white px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all hover:scale-105 active:scale-95 flex items-center gap-1"
          >
            <span>Explore How It Works</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          </a>
        </motion.div>

        {/* Trust Metrics Bar with 3D Tilt Cards & Counter Animation */}
        <motion.div
          variants={itemVariants}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl w-full"
        >
          <TiltCard
            maxTilt={8}
            className="bg-[#0e101c]/80 rounded-xl p-3.5 sm:p-4 border border-white/10 text-center flex flex-col items-center shadow-lg hover:border-indigo-500/40 transition-colors"
          >
            <span className="text-lg sm:text-xl font-black text-white">
              <CounterNumber value={12500} suffix="+" duration={2} />
            </span>
            <span className="text-[11px] sm:text-xs text-gray-400 mt-0.5 font-medium">Verified Indian Scholarships</span>
          </TiltCard>

          <TiltCard
            maxTilt={8}
            className="bg-[#0e101c]/80 rounded-xl p-3.5 sm:p-4 border border-white/10 text-center flex flex-col items-center shadow-lg hover:border-emerald-500/40 transition-colors"
          >
            <span className="text-lg sm:text-xl font-black text-emerald-400">
              <CounterNumber prefix="₹" value={1000} suffix=" Cr+" duration={2.2} />
            </span>
            <span className="text-[11px] sm:text-xs text-gray-400 mt-0.5 font-medium">Scholarship Funds Tracked</span>
          </TiltCard>

          <TiltCard
            maxTilt={8}
            className="bg-[#0e101c]/80 rounded-xl p-3.5 sm:p-4 border border-white/10 text-center flex flex-col items-center shadow-lg hover:border-cyan-500/40 transition-colors"
          >
            <span className="text-lg sm:text-xl font-black text-cyan-400">
              <CounterNumber value={28} suffix=" States & UTs" duration={1.8} />
            </span>
            <span className="text-[11px] sm:text-xs text-gray-400 mt-0.5 font-medium">State Domicile Schemes</span>
          </TiltCard>

          <TiltCard
            maxTilt={8}
            className="bg-[#0e101c]/80 rounded-xl p-3.5 sm:p-4 border border-white/10 text-center flex flex-col items-center shadow-lg hover:border-indigo-500/40 transition-colors"
          >
            <span className="text-lg sm:text-xl font-black text-indigo-400">
              100% Free
            </span>
            <span className="text-[11px] sm:text-xs text-gray-400 mt-0.5 font-medium">For Indian Students</span>
          </TiltCard>
        </motion.div>

        {/* Quick Scheme Links Badge */}
        <motion.div
          variants={itemVariants}
          className="mt-6 flex flex-wrap items-center justify-center gap-5 text-xs text-gray-400 font-medium"
        >
          <span className="flex items-center gap-1.5 hover:text-indigo-300 transition-colors">
            <Landmark className="w-3.5 h-3.5 text-indigo-400" /> National Scholarship Portal (NSP)
          </span>
          <span className="flex items-center gap-1.5 hover:text-cyan-300 transition-colors">
            <Building2 className="w-3.5 h-3.5 text-cyan-400" /> State Domicile Portals (MahaDBT, SSP)
          </span>
          <span className="flex items-center gap-1.5 hover:text-emerald-300 transition-colors">
            <GraduationCap className="w-3.5 h-3.5 text-emerald-400" /> Corporate Philanthropy (Tata, Reliance)
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}
