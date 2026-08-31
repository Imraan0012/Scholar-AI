import React, { useState } from "react";
import { motion } from "framer-motion";
import { ContainerScroll } from "../ui/container-scroll-animation";
import {
  GraduationCap,
  Sparkles,
  Search,
  CheckCircle2,
  Calendar,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  Landmark,
  Award,
} from "lucide-react";

const SCHOLARSHIPS_CATALOG = [
  {
    id: "nsp-pm-usp",
    name: "PM-USP Central Sector Scheme",
    provider: "Ministry of Education, Govt. of India",
    category: "Central Govt",
    image: "/scholarships/nsp_central.jpg",
    amount: "₹20,000 / yr",
    match: 98,
    deadline: "31 Oct 2026",
    tag: "Merit-cum-Means",
    badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  },
  {
    id: "tata-trusts",
    name: "Tata Trusts Higher Education Grant",
    provider: "Tata Philanthropic Foundations",
    category: "Corporate Philanthropy",
    image: "/scholarships/tata_trusts.jpg",
    amount: "₹1,00,000 Max",
    match: 96,
    deadline: "15 Nov 2026",
    tag: "Tuition Waiver",
    badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  },
  {
    id: "reliance-ug",
    name: "Reliance Foundation Undergraduate",
    provider: "Reliance Foundation",
    category: "Corporate CSR",
    image: "/scholarships/reliance_foundation.jpg",
    amount: "₹2,00,000 Total",
    match: 95,
    deadline: "30 Nov 2026",
    tag: "Merit Grant",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  },
  {
    id: "aicte-pragati",
    name: "AICTE Pragati Scheme for Girls",
    provider: "AICTE, Ministry of Education",
    category: "STEM Girls",
    image: "/scholarships/aicte_pragati.jpg",
    amount: "₹50,000 / yr",
    match: 94,
    deadline: "15 Dec 2026",
    tag: "Technical Degree",
    badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  },
  {
    id: "dst-inspire",
    name: "DST INSPIRE SHE Fellowship",
    provider: "Dept of Science & Technology, India",
    category: "Pure Science",
    image: "/scholarships/dst_inspire.jpg",
    amount: "₹80,000 / yr",
    match: 92,
    deadline: "20 Dec 2026",
    tag: "Research Grant",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  },
  {
    id: "mahadbt-post-matric",
    name: "MahaDBT Post-Matric OBC Scheme",
    provider: "Govt. of Maharashtra",
    category: "State Domicile",
    image: "/scholarships/mahadbt_state.jpg",
    amount: "100% Fee Waiver",
    match: 91,
    deadline: "30 Dec 2026",
    tag: "State DBT",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  },
  {
    id: "csir-ugc-jrf",
    name: "CSIR-UGC Junior Research Fellowship",
    provider: "University Grants Commission & CSIR",
    category: "Higher Education",
    image: "/scholarships/csir_ugc.jpg",
    amount: "₹37,000 / mo",
    match: 89,
    deadline: "10 Jan 2027",
    tag: "Monthly Stipend",
    badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  },
  {
    id: "pm-yasasvi",
    name: "PM-YASASVI Post-Matric Scheme",
    provider: "Ministry of Social Justice & Empowerment",
    category: "Social Justice",
    image: "/scholarships/pm_yasasvi.jpg",
    amount: "₹1,25,000 / yr",
    match: 88,
    deadline: "25 Jan 2027",
    tag: "Central DBT",
    badgeColor: "bg-teal-500/20 text-teal-300 border-teal-500/30",
  },
  {
    id: "ongc-merit",
    name: "ONGC Engineering & Science Scholarship",
    provider: "ONGC Foundation",
    category: "Corporate CSR",
    image: "/scholarships/ongc_scholarship.jpg",
    amount: "₹48,000 / yr",
    match: 87,
    deadline: "10 Feb 2027",
    tag: "Direct Grant",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  },
  {
    id: "pmrf-research",
    name: "PMRF Prime Minister Research Fellowship",
    provider: "Ministry of Education & IITs",
    category: "Higher Education",
    image: "/scholarships/pmrf_research.jpg",
    amount: "₹80,000 / mo",
    match: 86,
    deadline: "18 Feb 2027",
    tag: "Doctoral Fellowship",
    badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  },
  {
    id: "hdfc-badhte-kadam",
    name: "HDFC Badhte Kadam Higher Education",
    provider: "HDFC Bank Parivartan",
    category: "Corporate Philanthropy",
    image: "/scholarships/hdfc_scholarship.jpg",
    amount: "₹1,00,000 Total",
    match: 85,
    deadline: "28 Feb 2027",
    tag: "Special Quota",
    badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  },
  {
    id: "kotak-kanya",
    name: "Kotak Kanya Scholarship for Girls",
    provider: "Kotak Education Foundation",
    category: "STEM Girls",
    image: "/scholarships/kotak_kanya.jpg",
    amount: "₹1,50,000 / yr",
    match: 84,
    deadline: "15 Mar 2027",
    tag: "Professional Course",
    badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  },
];

// ── Square Box Scholarship Dashboard Grid ──────────────────────────────────
function ScholarshipDashboardGrid() {
  const [activeFilter, setActiveFilter] = useState("ALL");

  const categories = [
    { id: "ALL", label: "All Verified Grants" },
    { id: "Central Govt", label: "Central Schemes (NSP)" },
    { id: "Corporate CSR", label: "Corporate & Trusts" },
    { id: "STEM Girls", label: "Girls in STEM" },
  ];

  const filtered =
    activeFilter === "ALL"
      ? SCHOLARSHIPS_CATALOG
      : SCHOLARSHIPS_CATALOG.filter(
          (s) =>
            s.category === activeFilter ||
            (activeFilter === "Corporate CSR" && s.category.includes("Corporate"))
        );

  return (
    <div className="w-full h-full flex flex-col bg-[#070913] text-white overflow-y-auto custom-scrollbar p-3.5 sm:p-5 font-sans">
      {/* Top Header Bar of Dashboard */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10 mb-3.5 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 flex-shrink-0">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-extrabold text-white tracking-wide">
                Live Scholarship Intelligence Catalog
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Verified Active
              </span>
            </div>
            <p className="text-[11px] text-gray-400">
              Deterministic Multi-Vector Evaluation • Central, State & CSR Portals
            </p>
          </div>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id)}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeFilter === cat.id
                  ? "bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-md shadow-indigo-500/20 scale-102"
                  : "bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Compact Square-Box Scholarship Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 flex-1">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="group rounded-xl bg-[#0d1020]/95 hover:bg-[#131730] border border-white/10 hover:border-cyan-400/60 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-cyan-500/15 hover:-translate-y-0.5 relative"
          >
            {/* Real Image Header with Gradient Overlay */}
            <div className="relative h-20 sm:h-22 w-full overflow-hidden bg-gray-900 flex-shrink-0">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d1020] via-[#0d1020]/30 to-transparent" />

              {/* Match Score Badge */}
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-500/95 text-white shadow-md backdrop-blur-md flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                <span>{item.match}% Match</span>
              </div>

              {/* Amount Pill */}
              <div className="absolute bottom-2 right-2 px-2.5 py-0.5 rounded-md text-[10px] font-black bg-black/85 border border-white/20 text-cyan-300 shadow-md backdrop-blur-md">
                {item.amount}
              </div>
            </div>

            {/* Content Body */}
            <div className="p-2.5 sm:p-3 flex flex-col justify-between flex-1 space-y-2">
              <div className="space-y-1">
                <span
                  className={`inline-block text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded border ${item.badgeColor}`}
                >
                  {item.category}
                </span>

                <h4 className="text-[11px] sm:text-xs font-extrabold text-white leading-tight line-clamp-2 group-hover:text-cyan-300 transition-colors">
                  {item.name}
                </h4>

                <p className="text-[10px] text-gray-400 truncate flex items-center gap-1">
                  <Landmark className="w-2.5 h-2.5 text-gray-400 flex-shrink-0" />
                  <span className="truncate">{item.provider}</span>
                </p>
              </div>

              {/* Footer Meta */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-gray-400">
                <span className="flex items-center gap-1 font-medium">
                  <Calendar className="w-2.5 h-2.5 text-amber-400" />
                  <span>{item.deadline}</span>
                </span>
                <span className="text-cyan-400 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                  Verify <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main exported section ────────────────────────────────────────────────────
export default function HeroScrollDemo() {
  const titleComponent = (
    <div className="text-center mb-4">
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-3"
      >
        Your Scholarship Command Centre
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.08 }}
        className="text-3xl md:text-5xl font-bold text-white leading-tight"
      >
        One dashboard,{" "}
        <span
          className="text-transparent bg-clip-text"
          style={{
            backgroundImage: "linear-gradient(135deg, #818cf8, #a78bfa, #c084fc)",
          }}
        >
          every scholarship
        </span>
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.16 }}
        className="mt-4 text-base text-white/50 max-w-2xl mx-auto"
      >
        Scholar AI surfaces the right scholarships for your exact profile — income
        slab, state, caste category, stream, and merit — ranked by match score.
      </motion.p>
    </div>
  );

  return (
    <section className="relative bg-transparent z-10">
      <ContainerScroll titleComponent={titleComponent}>
        <ScholarshipDashboardGrid />
      </ContainerScroll>
    </section>
  );
}



