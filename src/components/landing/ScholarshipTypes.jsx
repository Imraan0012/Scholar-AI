import React from 'react';
import { motion } from 'framer-motion';
import CardSwap, { Card } from '../ui/CardSwap';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function ScholarshipTypes({ onCheckEligibilityClick }) {
  const categories = [
    {
      id: 'central',
      icon3d: '/icon_landmark.jpg',
      title: '01. Central Govt Schemes',
      subtitle: 'Ministry of Education & National Portal (NSP)',
      desc: 'PM-USP Central Sector Scheme (CSSS), Pre & Post-Matric, PM-YASASVI, and National Means-cum-Merit (NMMS).',
      funding: 'Up to ₹2,00,000 / year',
      tags: ['NSP Portal', 'DBT Transfer', 'Income < ₹4.5L', 'All India'],
      badgeColor: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
    },
    {
      id: 'state',
      icon3d: '/icon_location.jpg',
      title: '02. State Residence Schemes',
      subtitle: 'State Govt Departments (28 States & UTs)',
      desc: 'MahaDBT (MH), SSP (KA), e-Kalyan (JH/BR), OASIS (WB), Medhabruti (OD), and UP State Scholarship.',
      funding: '100% Tuition Fee Waiver',
      tags: ['State Specific', 'OBC/SC/ST/EWS', 'State Quota', 'College Renewal'],
      badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
    },
    {
      id: 'aicte',
      icon3d: '/icon_microscope.jpg',
      title: '03. AICTE Technical Schemes',
      subtitle: 'Engineering, Pharmacy & Architecture',
      desc: 'AICTE Pragati (Girls in Tech), Saksham (Specially-Abled), Swanath (Orphans), and PG GATE Scholarship.',
      funding: '₹50,000 to ₹1,50,000 / year',
      tags: ['B.Tech/Diploma', 'AICTE Approved', 'Girls in Tech', 'PG GATE'],
      badgeColor: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
    },
    {
      id: 'ugc',
      icon3d: '/icon_book.jpg',
      title: '04. UGC & Research Grants',
      subtitle: 'Higher Education & Doctoral Grants',
      desc: 'CSIR-UGC NET JRF, INSPIRE Fellowship (DST), Savitribai Jyotirao Phule Fellowship, and ICMR Doctoral Awards.',
      funding: '₹37,000 / month + HRA',
      tags: ['PhD / Research', 'Sciences & Arts', 'Contingency Grant', 'Merit'],
      badgeColor: 'bg-purple-500/15 text-purple-300 border-purple-500/30'
    },
    {
      id: 'corporate',
      icon3d: '/icon_corporate.jpg',
      title: '05. Corporate & Trust Grants',
      subtitle: 'Private CSR & Philanthropic Foundations',
      desc: 'Tata Trusts, Reliance Foundation, Infosys Foundation, HDFC Badhte Kadam, ONGC, and Kotak Kanya.',
      funding: 'Up to ₹2,00,000 total',
      tags: ['CSR Funds', 'Merit-cum-Means', 'Professional Degrees', 'Pan-India'],
      badgeColor: 'bg-amber-500/15 text-amber-300 border-amber-500/30'
    },
    {
      id: 'need',
      icon3d: '/icon_heart.jpg',
      title: '06. Need-Based & Special Quotas',
      subtitle: 'Empowerment & Inclusion Programs',
      desc: 'Single girl child waivers, armed forces wards (PMSS KSB), disabled student aids, and first-generation college graduate grants.',
      funding: 'Full Tuition + Living Stipends',
      tags: ['Social Impact', 'Ex-Servicemen', 'First-Gen', 'Fee Waivers'],
      badgeColor: 'bg-rose-500/15 text-rose-300 border-rose-500/30'
    }
  ];

  return (
    <motion.section
      id="scholarships"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="py-14 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative z-10"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Heading & Information */}
        <div className="lg:col-span-6 space-y-4 text-left">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Discovery Scope</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Scholarships <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-indigo-300 to-emerald-300">
              Across India
            </span>
          </h2>

          <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
            From Central Ministry portals to premier private corporate trusts, discover funding opportunities mapped directly to your criteria in our 3D category deck.
          </p>

          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <div className="p-3 rounded-xl bg-[#0f1220]/80 border border-white/10 hover:border-indigo-400/40 hover:bg-[#121528] transition-all">
              <span className="text-xs font-bold text-indigo-300 block">Central & State DBT</span>
              <span className="text-[10.5px] text-gray-400">Direct Account Transfer</span>
            </div>
            <div className="p-3 rounded-xl bg-[#0f1220]/80 border border-white/10 hover:border-cyan-400/40 hover:bg-[#121528] transition-all">
              <span className="text-xs font-bold text-cyan-300 block">AICTE & Tech Grants</span>
              <span className="text-[10.5px] text-gray-400">Degree & Diploma Aid</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#0f1220]/80 border border-white/10 hover:border-purple-400/40 hover:bg-[#121528] transition-all">
              <span className="text-xs font-bold text-purple-300 block">UGC & Doctoral</span>
              <span className="text-[11px] text-gray-400">Monthly Research Stipend</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#0f1220]/80 border border-white/10 hover:border-amber-400/40 hover:bg-[#121528] transition-all">
              <span className="text-xs font-bold text-amber-300 block">Corporate CSR Grants</span>
              <span className="text-[11px] text-gray-400">Tata, Reliance & Infosys</span>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={onCheckEligibilityClick}
              className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Find My Category Match</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: CardSwap 3D Stack */}
        <div className="lg:col-span-6 flex justify-center items-center pt-20 pb-6 min-h-[500px]">
          <div style={{ height: '420px', width: '100%', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CardSwap
              width={450}
              height={360}
              cardDistance={26}
              verticalDistance={24}
              delay={2200}
              pauseOnHover={true}
              skewAmount={3}
              easing="elastic"
            >
              {categories.map((cat) => (
                <Card
                  key={cat.id}
                  className="p-6 sm:p-7 flex flex-col justify-between rounded-3xl bg-[#0d101d] border border-white/15 text-white shadow-2xl backdrop-blur-2xl"
                >
                  <div>
                    {/* Top Row: 3D Icon + Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-lg">
                        <img
                          src={cat.icon3d}
                          alt={cat.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border ${cat.badgeColor}`}>
                        {cat.funding}
                      </span>
                    </div>

                    <h4 className="text-xl font-bold text-white tracking-tight mb-1">
                      {cat.title}
                    </h4>
                    <p className="text-xs text-cyan-300 font-semibold mb-3">
                      {cat.subtitle}
                    </p>

                    <p className="text-xs text-gray-300 leading-relaxed mb-4">
                      {cat.desc}
                    </p>

                    {/* Tag Chips */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {cat.tags.map((t) => (
                        <span
                          key={t}
                          className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-white/[0.05] text-gray-300 border border-white/10"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
                    <span>Verified Indian Portfolio</span>
                    <span className="text-indigo-300 font-semibold flex items-center gap-1">
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
