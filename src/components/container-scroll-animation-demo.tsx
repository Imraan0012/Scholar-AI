"use client";
import React from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { Sparkles, ShieldCheck, Award, TrendingUp, CheckCircle, ArrowRight } from "lucide-react";

export default function HeroScrollDemo({ onCheckEligibilityClick }: { onCheckEligibilityClick?: () => void }) {
  return (
    <div className="flex flex-col overflow-hidden relative z-10 -mt-20">
      <ContainerScroll
        titleComponent={
          <>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/70 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-4 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Interactive Platform Engine</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Real-Time AI Matching <br />
              <span className="text-4xl md:text-[5.5rem] font-black mt-2 leading-none bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-cyan-200 to-emerald-300">
                Eligibility Radar
              </span>
            </h2>
          </>
        }
      >
        {/* Sleek Interactive Scholar AI Dashboard Preview */}
        <div className="h-full w-full bg-[#0d0f18] rounded-xl border border-white/10 p-4 md:p-6 flex flex-col justify-between overflow-hidden relative group">
          {/* Top Mock Window Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="text-xs text-gray-400 font-mono ml-2">scholarai.in/engine/radar</span>
            </div>
            <span className="text-xs text-emerald-400 font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              Live Scan: 12,500+ Grants
            </span>
          </div>

          {/* Inner Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-auto py-4">
            <div className="bg-[#131622] rounded-xl p-4 border border-white/5 flex flex-col justify-between">
              <div className="flex items-center gap-2 text-indigo-400 mb-2">
                <Award className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Top Match #1</span>
              </div>
              <h4 className="text-sm font-bold text-white mb-1">National Merit Grant 2026</h4>
              <p className="text-xs text-gray-400">100% Tuition Waiver + ₹1.2L Stipend</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[11px] text-emerald-400 font-semibold">99.2% Fit</span>
                <span className="text-[10px] text-gray-500">Closes in 14d</span>
              </div>
            </div>

            <div className="bg-[#131622] rounded-xl p-4 border border-white/5 flex flex-col justify-between">
              <div className="flex items-center gap-2 text-cyan-400 mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Top Match #2</span>
              </div>
              <h4 className="text-sm font-bold text-white mb-1">State Domicile STEM Aid</h4>
              <p className="text-xs text-gray-400">Up to ₹80,000 / Academic Year</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[11px] text-emerald-400 font-semibold">97.8% Fit</span>
                <span className="text-[10px] text-gray-500">Open Now</span>
              </div>
            </div>

            <div className="bg-[#131622] rounded-xl p-4 border border-white/5 flex flex-col justify-between">
              <div className="flex items-center gap-2 text-purple-400 mb-2">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Top Match #3</span>
              </div>
              <h4 className="text-sm font-bold text-white mb-1">Reliance Foundation Grant</h4>
              <p className="text-xs text-gray-400">Up to ₹2,00,000 Total Funding</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[11px] text-emerald-400 font-semibold">96.4% Fit</span>
                <span className="text-[10px] text-gray-500">Closes in 28d</span>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              Verified Govt & Trust Schemes
            </span>
            <button
              onClick={onCheckEligibilityClick}
              className="text-white hover:text-cyan-300 font-semibold flex items-center gap-1 transition-colors"
            >
              <span>Unlock all 48 eligible scholarships</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </ContainerScroll>
    </div>
  );
}
