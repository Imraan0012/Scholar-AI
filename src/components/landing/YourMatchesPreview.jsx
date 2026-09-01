import React from 'react';
import { motion } from 'framer-motion';
import { Award, CheckCircle2, AlertCircle, Sparkles, Clock, ArrowRight, ShieldCheck, IndianRupee } from 'lucide-react';

export default function YourMatchesPreview({ onCheckEligibilityClick }) {
  const resultCards = [
    {
      matchPercent: "96%",
      matchColor: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10",
      progressBg: "bg-emerald-500",
      title: "AICTE Pragati Scholarship for Girls",
      authority: "All India Council for Technical Education (AICTE)",
      benefit: "₹50,000 / year",
      type: "Government • Technical Degree/Diploma",
      reasons: [
        "Enrolled in 1st year AICTE-approved B.Tech / Diploma",
        "Family income documented below ₹8,00,000 / year",
        "State of residence verification supported"
      ],
      deadline: "Open for 2026-27 Portal"
    },
    {
      matchPercent: "92%",
      matchColor: "text-cyan-400 border-cyan-500/40 bg-cyan-500/10",
      progressBg: "bg-cyan-400",
      title: "PM-USP Central Sector Scholarship",
      authority: "Department of Higher Education (MoE, Govt of India)",
      benefit: "₹20,000 / year (₹1,00,000 total)",
      type: "Merit-cum-Means • Degree Courses",
      reasons: [
        "Scored above 80th percentile in Class 12th Board",
        "Gross family annual income under ₹4.5 Lakhs",
        "Not availing any other central scholarship"
      ],
      deadline: "Closes in 22 Days"
    },
    {
      matchPercent: "88%",
      matchColor: "text-indigo-400 border-indigo-500/40 bg-indigo-500/10",
      progressBg: "bg-indigo-500",
      title: "Reliance Foundation Undergraduate Grant",
      authority: "Reliance Foundation Philanthropy",
      benefit: "Up to ₹2,00,000 total",
      type: "Corporate Foundation • All Streams",
      reasons: [
        "First-year full-time undergraduate student in India",
        "Household income under ₹15 Lakhs (Preference < ₹2.5L)",
        "Aptitude & academic excellence criteria cleared"
      ],
      deadline: "Applications Active"
    }
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative z-10">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 px-3.5 py-1.5 rounded-full border border-cyan-500/20">
          The Core Experience
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mt-4">
          What Your Matches <br className="hidden sm:inline" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-indigo-300 to-emerald-300">
            Actually Look Like
          </span>
        </h2>
        <p className="text-gray-300 mt-4 text-base sm:text-lg">
          No vague lists. Every recommendation provides transparent match percentages, clear reason breakdowns, and exact benefit calculations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {resultCards.map((res, i) => (
          <motion.div
            key={res.title}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.15 }}
            className="glass-panel glass-panel-hover rounded-3xl p-6 sm:p-7 border border-white/10 bg-[#0e101c]/90 flex flex-col justify-between group shadow-xl relative overflow-hidden"
          >
            <div>
              {/* Top Header & Match Score Dial */}
              <div className="flex items-center justify-between gap-3 mb-4">
                <span className="text-[11px] font-semibold text-gray-400 truncate max-w-[170px]">
                  {res.authority}
                </span>
                <div className={`px-3 py-1 rounded-full border text-xs font-black flex items-center gap-1.5 ${res.matchColor}`}>
                  <Sparkles className="w-3 h-3" />
                  <span>{res.matchPercent} Match</span>
                </div>
              </div>

              <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                {res.title}
              </h3>

              <div className="my-4 p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase font-medium">Eligible Grant</span>
                  <span className="text-base font-black text-emerald-400">{res.benefit}</span>
                </div>
                <span className="text-[11px] text-gray-300 font-medium px-2 py-0.5 rounded bg-white/5">
                  {res.type}
                </span>
              </div>

              {/* Why it matches checklist */}
              <div className="space-y-2 mt-4">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                  Why You're Eligible:
                </span>
                {res.reasons.map((r) => (
                  <div key={r} className="flex items-start gap-2 text-xs text-gray-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="leading-snug">{r}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Card Action */}
            <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-[11px] text-gray-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-cyan-400" /> {res.deadline}
              </span>
              <button
                onClick={onCheckEligibilityClick}
                className="text-xs font-bold text-indigo-400 group-hover:text-indigo-300 flex items-center gap-1"
              >
                <span>Check Fit</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA Box beneath match demo */}
      <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-[#101426] to-cyan-950/60 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <h4 className="text-base font-bold text-white">Want to see your personal scholarship matches?</h4>
          <p className="text-xs text-gray-300 mt-0.5">Enter your basic criteria to run the instant multi-portal cross-validation engine.</p>
        </div>
        <button
          onClick={onCheckEligibilityClick}
          className="px-6 py-3 rounded-xl bg-white text-black font-bold text-xs shadow-lg hover:bg-gray-100 transition-all duration-200 flex-shrink-0"
        >
          Check My Eligibility Score →
        </button>
      </div>
    </section>
  );
}
