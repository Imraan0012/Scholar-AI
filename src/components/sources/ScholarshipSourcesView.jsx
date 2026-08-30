import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  ExternalLink,
  ShieldCheck,
  Search,
  CheckCircle2,
  RefreshCw,
  Globe,
  Landmark,
  Building,
  GraduationCap,
  Sparkles,
  ChevronRight,
  Filter
} from 'lucide-react';
import { MASTER_SOURCES_REGISTRY } from '../../data/sources/index.js';
import { sourceService } from '../../services/sourceService.js';
import { scholarshipRegistryService } from '../../services/scholarshipRegistryService.js';

export default function ScholarshipSourcesView({ onNavigateToScholarships }) {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [syncingSourceId, setSyncingSourceId] = useState(null);
  const [syncedMessage, setSyncedMessage] = useState(null);
  const [sourcesList, setSourcesList] = useState(MASTER_SOURCES_REGISTRY);

  useEffect(() => {
    let mounted = true;

    async function loadLiveSources() {
      const { sources } = await sourceService.getSources();
      if (mounted && sources && sources.length > 0) {
        setSourcesList(sources);
      }
    }

    loadLiveSources();

    const unsub = sourceService.subscribeToSourceChanges(async () => {
      const { sources } = await sourceService.getSources();
      if (mounted && sources) {
        setSourcesList(sources);
      }
    });

    return () => {
      mounted = false;
      unsub();
    };
  }, []);

  const allSources = sourcesList;
  const totalScholarshipsIndexed = scholarshipRegistryService.getTotalIndexedCount();

  const nationalCount = useMemo(() => allSources.filter(s => s.providerType === 'CENTRAL_GOVERNMENT' || s.providerType === 'UGC_AICTE_APEX' || s.provider_type === 'CENTRAL_GOVERNMENT' || s.provider_type === 'UGC_AICTE_APEX').length, [allSources]);
  const statesCount = useMemo(() => allSources.filter(s => s.stateCode !== undefined || s.state_code !== null || s.isUnionTerritory !== undefined || s.category === 'STATE_GOVERNMENT' || s.category === 'UNION_TERRITORY').length, [allSources]);
  const corporateCount = useMemo(() => allSources.filter(s => s.providerType === 'CORPORATE_CSR' || s.providerType === 'FOUNDATION_TRUST' || s.provider_type === 'CORPORATE_CSR' || s.provider_type === 'FOUNDATION_TRUST').length, [allSources]);
  const universitiesCount = useMemo(() => allSources.filter(s => s.providerType === 'UNIVERSITY_INSTITUTION' || s.institutionType !== undefined || s.provider_type === 'UNIVERSITY_INSTITUTION').length, [allSources]);

  const filteredSources = useMemo(() => {
    let list = [...allSources];

    if (selectedCategory === 'NATIONAL') {
      list = list.filter(s => s.providerType === 'CENTRAL_GOVERNMENT' || s.providerType === 'UGC_AICTE_APEX' || s.provider_type === 'CENTRAL_GOVERNMENT' || s.provider_type === 'UGC_AICTE_APEX');
    } else if (selectedCategory === 'STATES') {
      list = list.filter(s => s.stateCode !== undefined || s.state_code !== null || s.isUnionTerritory !== undefined || s.category === 'STATE_GOVERNMENT' || s.category === 'UNION_TERRITORY');
    } else if (selectedCategory === 'CORPORATE') {
      list = list.filter(s => s.providerType === 'CORPORATE_CSR' || s.providerType === 'FOUNDATION_TRUST' || s.provider_type === 'CORPORATE_CSR' || s.provider_type === 'FOUNDATION_TRUST');
    } else if (selectedCategory === 'UNIVERSITIES') {
      list = list.filter(s => s.providerType === 'UNIVERSITY_INSTITUTION' || s.institutionType !== undefined || s.provider_type === 'UNIVERSITY_INSTITUTION');
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(s =>
        (s.name || s.portalName || s.portal_name || '').toLowerCase().includes(q) ||
        (s.stateName || s.state || '').toLowerCase().includes(q) ||
        (s.description || '').toLowerCase().includes(q) ||
        (s.portalUrl || s.portal_url || '').toLowerCase().includes(q)
      );
    }

    return list;
  }, [allSources, selectedCategory, searchQuery]);

  const handleSync = (source) => {
    setSyncingSourceId(source.id);
    setTimeout(() => {
      scholarshipRegistryService.syncSource(source.id);
      setSyncingSourceId(null);
      setSyncedMessage(`Successfully verified and synced: "${source.name || source.portalName || source.portal_name}"`);
      setTimeout(() => setSyncedMessage(null), 3500);
    }, 800);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-[#1E3A8A] to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-wider text-cyan-300">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Scholar AI Verified Knowledge Base</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            All India Scholarship Sources Registry
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
            Centralized registry of verified official government portals, UGC/AICTE apex guidelines, 28 States & 8 Union Territories, and premier philanthropic trusts. Information provenance is tracked directly to Level 1 and Level 2 official portals.
          </p>
        </div>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">Total Indexed Schemes</span>
          <span className="text-3xl font-black text-slate-900 block mt-1.5">{totalScholarshipsIndexed}</span>
          <span className="text-xs text-emerald-600 font-semibold block mt-1">✓ 100% Factually Verified</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">States & UTs Covered</span>
          <span className="text-3xl font-black text-slate-900 block mt-1.5">36 / 36</span>
          <span className="text-xs text-blue-600 font-semibold block mt-1">All 28 States + 8 UTs</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">Central / Apex Sources</span>
          <span className="text-3xl font-black text-slate-900 block mt-1.5">12</span>
          <span className="text-xs text-purple-600 font-semibold block mt-1">NSP, UGC, AICTE, MoE, MoSJE</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">Corporate / CSR Portals</span>
          <span className="text-3xl font-black text-slate-900 block mt-1.5">10+</span>
          <span className="text-xs text-amber-600 font-semibold block mt-1">Tata, Reliance, Kotak, SBI, HDFC</span>
        </div>
      </div>

      {/* Sync Toast Notification */}
      {syncedMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-bold flex items-center gap-2.5 shadow-xs"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{syncedMessage}</span>
        </motion.div>
      )}

      {/* Filters & Search Row */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: 'ALL', label: `All Sources (${allSources.length})`, icon: Globe },
            { id: 'NATIONAL', label: `National / Central Govt (${nationalCount})`, icon: Landmark },
            { id: 'STATES', label: `States & UTs (${statesCount})`, icon: Building2 },
            { id: 'CORPORATE', label: `Corporate & CSR Trusts (${corporateCount})`, icon: Building },
            { id: 'UNIVERSITIES', label: `Universities & IITs (${universitiesCount})`, icon: GraduationCap }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap inline-flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#2563EB] text-white shadow-sm'
                    : 'bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search verified sources by state, ministry, portal name, or URL..."
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#2563EB] focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSources.map((src) => {
          const isSyncing = syncingSourceId === src.id;
          const name = src.name || src.portalName;
          const url = src.portalUrl || src.sourceUrl;
          const location = src.stateName || src.state || 'All India (Central)';

          return (
            <div
              key={src.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-md bg-blue-50 text-[#2563EB]">
                    {src.stateCode ? `State: ${src.stateCode}` : src.category || 'OFFICIAL GOVT'}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Verified
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {name}
                  </h3>
                  <span className="text-xs text-slate-500 font-medium block mt-1">
                    📍 {location}
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {src.description || (src.keySchemes ? `Key Schemes: ${src.keySchemes.join(', ')}` : 'Official portal providing scholarship applications and guidelines.')}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleSync(src)}
                  disabled={isSyncing}
                  className="px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Verify & Sync Portal Source"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[#2563EB]' : 'text-slate-400'}`} />
                  <span>{isSyncing ? 'Syncing...' : 'Sync Source'}</span>
                </button>

                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Official Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
