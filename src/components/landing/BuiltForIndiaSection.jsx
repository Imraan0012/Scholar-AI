import React from 'react';
import { motion } from 'framer-motion';
import CardSwap, { Card } from '../ui/CardSwap';
import { CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';

export default function BuiltForIndiaSection({ onCheckEligibilityClick }) {
  const dimensions = [
    {
      id: 'academic',
      title: '01. Academic Profile',
      subtitle: 'Courses, Years & Score Mapping',
      icon3d: '/icon_graduation.jpg',
      badgeColor: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
      points: [
        'B.Tech, MBBS, B.Sc, B.Com, Diploma, 10th/12th, M.Tech, PhD',
        'Fresh Admissions (1st Year) & Subsequent Year Renewals',
        'Board Percentages, College CGPA, JEE, NEET, CUET & GATE percentiles',
        'IITs, NITs, AIIMS, Central/State Universities & Private Colleges'
      ],
      tag: 'Academic Dimension'
    },
    {
      id: 'financial',
      title: '02. Financial Background',
      subtitle: 'Family Income & EWS Criteria',
      icon3d: '/icon_rupee.jpg',
      badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      points: [
        'Income Brackets: Below ₹1.5L, ₹2.5L, ₹6.0L, ₹8.0L & EWS',
        '100% Tuition Fee Reimbursements & Monthly Hostel Stipends',
        'Special Support: Single Earning Parent, Farmer & Daily Wage Families',
        'Tehsildar / Revenue Department valid verification guidelines'
      ],
      tag: 'Financial Dimension'
    },
    {
      id: 'identity',
      title: '03. Identity & Category',
      subtitle: 'Social Quotas & Inclusion Programs',
      icon3d: '/icon_shield.jpg',
      badgeColor: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
      points: [
        'General, OBC-NCL, SC, ST, EWS & SEBC Schemes',
        "Minority Communities: Muslim, Christian, Sikh, Buddhist, Jain, Parsi",
        "Women in STEM: AICTE Pragati, L'Oréal India, Santoor, Google Generation",
        'Specially Abled (Divyangjan / PwD) assistive allowances'
      ],
      tag: 'Category Dimension'
    },
    {
      id: 'location',
      title: '04. State Domicile',
      subtitle: '28 States & 8 Union Territories',
      icon3d: '/icon_location.jpg',
      badgeColor: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      points: [
        'MahaDBT (MH), SSP (KA), e-Kalyan (JH/BR), OASIS (WB), Medhabruti (OD)',
        'State-exclusive domicile quota scholarship matching',
        'National Scholarship Portal (NSP) direct scheme matching',
        'North-East (NER Ishan Uday) & J&K PMSSS special grant support'
      ],
      tag: 'Domicile Dimension'
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
        <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          Tailored for Indian Education
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight mt-3">
          Built Specifically for <br className="hidden sm:inline" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 via-cyan-200 to-indigo-300">
            Indian Student Eligibility
          </span>
        </h2>
        <p className="text-gray-300 mt-3 text-xs sm:text-sm leading-relaxed">
          Scholarships in India depend on multi-criteria rules. Scholar AI evaluates all 4 critical dimensions simultaneously with our interactive 3D eligibility stack.
        </p>
      </div>

      {/* CardSwap 3D Interactive Stack Container */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-10 pt-4 pb-8">
        {/* Left Side: Descriptive Column */}
        <div className="w-full lg:w-1/2 space-y-4 text-left">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Interactive 3D Dimension Stack</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-snug">
            4 Core Eligibility Vectors Evaluated in Seconds
          </h3>

          <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
            Instead of searching through endless government PDFs and missing application deadlines, Scholar AI takes your profile criteria and checks every eligibility condition across all 4 vectors in real time.
          </p>

          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <div className="p-3 rounded-xl bg-[#0f1220]/80 border border-white/10 hover:border-indigo-400/40 hover:bg-[#121528] transition-all">
              <span className="text-xs font-bold text-white block">✓ Academic Fit</span>
              <span className="text-[10.5px] text-gray-400">Course, Year, CGPA & Boards</span>
            </div>
            <div className="p-3 rounded-xl bg-[#0f1220]/80 border border-white/10 hover:border-emerald-400/40 hover:bg-[#121528] transition-all">
              <span className="text-xs font-bold text-emerald-400 block">✓ Income Verification</span>
              <span className="text-[10.5px] text-gray-400">EWS & Slab Based Waivers</span>
            </div>
            <div className="p-3 rounded-xl bg-[#0f1220]/80 border border-white/10 hover:border-violet-400/40 hover:bg-[#121528] transition-all">
              <span className="text-xs font-bold text-violet-400 block">✓ Social Category</span>
              <span className="text-[10.5px] text-gray-400">Reserved, Minority & STEM Girls</span>
            </div>
            <div className="p-3 rounded-xl bg-[#0f1220]/80 border border-white/10 hover:border-amber-400/40 hover:bg-[#121528] transition-all">
              <span className="text-xs font-bold text-amber-400 block">✓ 28 States Domicile</span>
              <span className="text-[10.5px] text-gray-400">MahaDBT, SSP & State Portals</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={onCheckEligibilityClick}
              className="px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white font-bold text-xs sm:text-sm shadow-xl shadow-indigo-500/25 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Check My Multi-Vector Fit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Side: CardSwap Component */}
        <div className="w-full lg:w-1/2 flex justify-center items-center pt-14 pb-6 min-h-[480px]">
          <div style={{ height: '420px', width: '100%', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CardSwap
              width={460}
              height={360}
              cardDistance={32}
              verticalDistance={30}
              delay={2200}
              pauseOnHover={true}
              skewAmount={3}
              easing="elastic"
            >
              {dimensions.map((card) => (
                <Card
                  key={card.id}
                  className="p-6 sm:p-7 flex flex-col justify-between rounded-3xl bg-[#0d101d] border border-white/15 text-white shadow-2xl backdrop-blur-2xl"
                >
                  <div>
                    {/* Top Row: 3D icon + badge */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-lg">
                        <img
                          src={card.icon3d}
                          alt={card.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border ${card.badgeColor}`}>
                        {card.tag}
                      </span>
                    </div>

                    <h4 className="text-xl font-bold text-white tracking-tight mb-1">
                      {card.title}
                    </h4>
                    <p className="text-xs text-indigo-300 font-semibold mb-4">
                      {card.subtitle}
                    </p>

                    {/* Checklist */}
                    <div className="space-y-2">
                      {card.points.map((pt) => (
                        <div key={pt} className="flex items-start gap-2 text-xs text-gray-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span className="leading-snug">{pt}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
                    <span>Live Dimension Mapping</span>
                    <span className="text-cyan-300 font-semibold flex items-center gap-1">
                      Click Card to Swap <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Card>
              ))}
            </CardSwap>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
