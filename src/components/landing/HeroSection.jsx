import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ChevronRight, Landmark, Building2, GraduationCap } from 'lucide-react';
import { HoverBorderGradient } from '../ui/HoverBorderGradient';
import TiltCard from '../ui/TiltCard';
import CounterNumber from '../ui/CounterNumber';
import MagneticButton from '../ui/MagneticButton';

import { useStudentProfile } from '../../context/StudentProfileContext';
import { profileService } from '../../services/profileService';
import { scholarshipService } from '../../services/scholarshipService';
import MetricCard from '../ui/MetricCard';

export default function HeroSection({ currentUser, onCheckEligibilityClick, onAuthClick }) {
  const { profile, scholarships, profileStatus, profileLoading, authLoading } = useStudentProfile();
  const [liveCount, setLiveCount] = useState(null);

  // Authoritative dynamic count from API
  useEffect(() => {
    let isMounted = true;
    scholarshipService.getCount()
      .then((count) => {
        if (isMounted && typeof count === 'number' && count > 0) {
          setLiveCount(count);
        }
      })
      .catch(() => {
        if (isMounted && Array.isArray(scholarships) && scholarships.length > 0) {
          setLiveCount(scholarships.length);
        }
      });
    return () => { isMounted = false; };
  }, [scholarships]);

  const displayCount = liveCount !== null
    ? liveCount
    : (Array.isArray(scholarships) && scholarships.length > 0 ? scholarships.length : null);

  // Centralized profile completion evaluation
  const firstIncomplete = profileService.getFirstIncompleteStep(profile);
  const isProfileComplete = Boolean(profile?.onboardingComplete || profile?.isOnboarded || profile?.onboardingStep >= 5) || firstIncomplete === 6;

  // Exact profile CTA state machine
  let ctaText = 'Check My Eligibility';
  if (currentUser) {
    if (authLoading || profileLoading || profileStatus === 'loading') {
      // Neutral state during loading — NEVER flash "Complete My Profile" on existing users
      ctaText = isProfileComplete ? 'View My Matches' : 'View My Matches';
    } else if (profileStatus === 'loaded') {
      ctaText = isProfileComplete ? 'View My Matches' : 'Complete My Profile';
    } else if (profileStatus === 'not_found') {
      ctaText = 'Complete My Profile';
    } else {
      // On error / fallback, preserve known profile state
      ctaText = isProfileComplete ? 'View My Matches' : 'Check My Eligibility';
    }
  }

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
    <section id="hero" className="relative min-h-[75vh] pt-24 pb-12 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 overflow-hidden z-10">

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-3xl flex flex-col items-center"
      >
        {/* Subtle Eyebrow Badge */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#101322]/90 border border-indigo-500/30 text-indigo-200 text-xs font-semibold mb-4 shadow-lg shadow-indigo-950/40 select-none"
        >
          <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-gray-300 font-medium">Official sources • Central & state scholarships</span>
        </motion.div>

        {/* Main Headline (Dominant visual anchor) */}
        <motion.h1
          variants={itemVariants}
          style={{
            fontSize: 'clamp(2.4rem, 4.8vw, 4.25rem)',
            lineHeight: 1.02,
            letterSpacing: '-0.03em'
          }}
          className="font-extrabold text-center text-white max-w-3xl leading-[1.02]"
        >
          Find scholarships you're <br className="hidden sm:inline" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 via-cyan-200 to-indigo-300">
            actually eligible for.
          </span>
        </motion.h1>

        {/* Clear Supporting Text */}
        <motion.p
          variants={itemVariants}
          className="mt-3.5 text-xs sm:text-sm text-gray-300 text-center max-w-xl font-normal leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]"
        >
          Tell us about your education, family income, category and State of Residence. Scholar AI checks scholarship requirements and shows the schemes that match your profile.
        </motion.p>

        {/* Dominant Call To Action Bar */}
        <motion.div
          variants={itemVariants}
          className="mt-6 flex flex-col sm:flex-row items-center gap-3 z-20"
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

        {/* 4 Stat Cards Grid (EXACT 3-LEVEL STRUCTURE) */}
        <motion.div
          variants={itemVariants}
          className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4 max-w-4xl w-full"
        >
          {/* Card 1: Scholarships Tracked in Catalog */}
          <TiltCard maxTilt={6} className="h-full">
            <MetricCard
              theme="dark"
              size="default"
              className="h-full"
              value={
                displayCount !== null ? (
                  <span className="whitespace-nowrap inline-flex items-baseline">
                    <CounterNumber value={displayCount} duration={1.8} />
                    <span>+</span>
                  </span>
                ) : (
                  <span>—</span>
                )
              }
              label="Scholarships"
              subtitle="Tracked in catalog"
              accentColor="text-white"
            />
          </TiltCard>

          {/* Card 2: 12h Auto Refresh */}
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

          {/* Card 3: Pan-India Coverage */}
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

          {/* Card 4: Official Sources */}
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

        {/* Centered Official Source / Trust Row */}
        <motion.div
          variants={itemVariants}
          className="mt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs sm:text-[13px] text-gray-300 font-medium"
        >
          <div className="flex items-center gap-2">
            <Landmark className="w-4 h-4 text-indigo-400 flex-shrink-0" />
            <span>National Scholarship Portal (NSP)</span>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span>State Scholarship Portals</span>
          </div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Foundation & CSR Scholarships</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
