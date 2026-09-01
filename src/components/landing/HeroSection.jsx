import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ChevronRight, Landmark, Building2, GraduationCap } from 'lucide-react';
import { HoverBorderGradient } from '../ui/HoverBorderGradient';
import TiltCard from '../ui/TiltCard';
import CounterNumber from '../ui/CounterNumber';
import MagneticButton from '../ui/MagneticButton';

import { useStudentProfile } from '../../context/StudentProfileContext';
import { profileService } from '../../services/profileService';
import MetricCard from '../ui/MetricCard';

// Navbar is approximately 68px tall on desktop.
// Hero section fills the remaining viewport so the content group can be
// vertically centred using flex justify-center.
const NAVBAR_H = 68; // px — matches PillNav height

export default function HeroSection({ currentUser, onCheckEligibilityClick, onAuthClick }) {
  const { profile, scholarships, profileStatus, profileLoading, authLoading } = useStudentProfile();
  const liveCatalogCount = (scholarships && scholarships.length > 0) ? scholarships.length : 63;

  // Centralized profile completion check
  const firstIncomplete = profileService.getFirstIncompleteStep(profile);
  const isProfileComplete = Boolean(profile?.onboardingComplete || profile?.isOnboarded) || firstIncomplete === 6;

  // Profile-aware CTA state
  let ctaText = 'Check My Eligibility';
  if (currentUser) {
    if (authLoading || profileLoading || profileStatus === 'loading') {
      ctaText = isProfileComplete ? 'View My Matches' : 'View My Matches';
    } else if (profileStatus === 'loaded') {
      ctaText = isProfileComplete ? 'View My Matches' : 'Complete My Profile';
    } else if (profileStatus === 'not_found') {
      ctaText = 'Complete My Profile';
    } else {
      ctaText = isProfileComplete ? 'View My Matches' : 'Check My Eligibility';
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.04 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 110, damping: 18 }
    }
  };

  return (
    /*
     * HERO SECTION
     * ─────────────────────────────────────────────────────────────────────────
     * Height = full safe viewport minus navbar so the content group can be
     * vertically centred with justify-center.
     *
     * py-8 gives a minimum breathing room on very short viewports (e.g. 720px)
     * so content never clips the navbar or bleeds into the next section.
     *
     * The -mt-[28px] optical correction nudges the group very slightly upward
     * on large desktops only (via lg:) because the source row adds visual
     * weight below the headline. It is intentionally small.
     */
    <section
      id="hero"
      className="relative w-full flex flex-col items-center justify-center overflow-hidden z-10 px-4 sm:px-6 lg:px-8 py-10 sm:py-12"
      style={{ minHeight: `calc(100svh - ${NAVBAR_H}px)` }}
    >
      {/* ── ONE HERO CONTENT GROUP ─────────────────────────────────────────── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-[1000px] mx-auto flex flex-col items-center lg:-mt-7"
      >

        {/* 1. BADGE */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#101322]/90 border border-indigo-500/30 text-indigo-200 text-xs font-semibold shadow-lg shadow-indigo-950/40 select-none"
        >
          <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-gray-300 font-medium">Official sources • Central & state scholarships</span>
        </motion.div>

        {/* 2. HEADLINE — gap from badge: 20px (mt-5) */}
        <motion.h1
          variants={itemVariants}
          className="mt-5 text-[32px] sm:text-[40px] md:text-[48px] lg:text-[54px] font-extrabold text-center tracking-tight text-white max-w-[820px] leading-[1.04] px-2"
        >
          <span className="inline-block whitespace-nowrap">Find scholarships you're</span>{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 via-cyan-200 to-indigo-300 inline-block whitespace-nowrap">
            actually eligible for.
          </span>
        </motion.h1>

        {/* 3. SUPPORTING PARAGRAPH — gap from headline: ~18px (mt-[18px]) */}
        <motion.p
          variants={itemVariants}
          className="mt-[18px] text-xs sm:text-sm text-gray-300 text-center max-w-xl font-normal leading-[1.9] drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]"
        >
          Tell us about your education, family income, category and State of Residence. Scholar AI
          checks scholarship requirements and shows the schemes that match your profile.
        </motion.p>

        {/* 4. CTA BUTTONS — gap from paragraph: 26px (mt-[26px]) */}
        <motion.div
          variants={itemVariants}
          className="mt-[26px] flex flex-col sm:flex-row items-center gap-3 z-20"
        >
          <MagneticButton strength={0.25} onClick={onCheckEligibilityClick}>
            <HoverBorderGradient
              as="div"
              containerClassName="rounded-full shadow-xl shadow-indigo-500/20"
              className="bg-gradient-to-r from-indigo-950 via-slate-900 to-zinc-950 text-white font-bold text-xs sm:text-sm px-6 py-2.5 flex items-center gap-2 group cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
              <span>{ctaText}</span>
              <ArrowRight className="w-3.5 h-3.5 text-indigo-300 group-hover:translate-x-1.5 transition-transform duration-300" />
            </HoverBorderGradient>
          </MagneticButton>

          {!currentUser && (
            <button
              onClick={() => onAuthClick?.('signup')}
              className="text-xs font-semibold text-white px-4 py-2.5 rounded-full bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <span>Create Free Account</span>
              <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
            </button>
          )}

          <a
            href="#how-it-works"
            className="text-xs sm:text-sm font-semibold text-gray-300 hover:text-white px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all hover:scale-105 active:scale-95 flex items-center gap-1"
          >
            <span>How It Works</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          </a>
        </motion.div>

        {/* 5. FOUR METRIC CARDS — gap from CTAs: 34px (mt-[34px]) */}
        <motion.div
          variants={itemVariants}
          className="mt-[34px] grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 max-w-2xl w-full mx-auto"
        >
          <TiltCard maxTilt={6} className="h-full">
            <MetricCard
              theme="dark"
              size="default"
              className="h-full"
              value={
                <span className="whitespace-nowrap inline-flex items-baseline">
                  <CounterNumber value={liveCatalogCount} duration={1.8} />
                  <span>+</span>
                </span>
              }
              label="Scholarships"
              subtitle="Tracked in catalog"
              accentColor="text-white"
            />
          </TiltCard>

          <TiltCard maxTilt={6} className="h-full">
            <MetricCard
              theme="dark"
              size="default"
              className="h-full"
              value="12h"
              label="Auto Refresh"
              subtitle="Every 12 hours"
              accentColor="text-emerald-400"
            />
          </TiltCard>

          <TiltCard maxTilt={6} className="h-full">
            <MetricCard
              theme="dark"
              size="default"
              className="h-full"
              value="Pan-India"
              label="Coverage"
              subtitle="Central & state schemes"
              accentColor="text-cyan-400"
            />
          </TiltCard>

          <TiltCard maxTilt={6} className="h-full">
            <MetricCard
              theme="dark"
              size="default"
              className="h-full"
              value="Official"
              label="Sources"
              subtitle="Direct application portals"
              accentColor="text-indigo-300"
            />
          </TiltCard>
        </motion.div>

        {/* 6. SOURCE / TRUST ROW — gap from cards: 30px (mt-[30px]) */}
        <motion.div
          variants={itemVariants}
          className="mt-[30px] flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-[13px] text-gray-400 font-medium w-full mx-auto"
        >
          <div className="flex items-center gap-2">
            <Landmark className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
            <span>National Scholarship Portal (NSP)</span>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
            <span>State Scholarship Portals</span>
          </div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span>Foundation & CSR Scholarships</span>
          </div>
        </motion.div>

      </motion.div>
    </section>
  );
}
