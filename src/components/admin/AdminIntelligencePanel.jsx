import React, { useState } from 'react';
import { useStudentProfile } from '../../context/StudentProfileContext';
import { ShieldCheck, Plus, CheckCircle2, AlertTriangle, Clock, ExternalLink, Edit3, Trash2, ArrowLeft } from 'lucide-react';

export default function AdminIntelligencePanel({ onClose }) {
  const { scholarships, setScholarships } = useStudentProfile();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newScheme, setNewScheme] = useState({
    name: '',
    provider: '',
    government_level: 'CENTRAL',
    amount_display: '₹50,000 / year',
    max_family_income: 600000,
    application_deadline: '2026-11-30',
    application_url: 'https://scholarships.gov.in',
    status: 'ACTIVE'
  });

  const toggleStatus = (id) => {
    setScholarships(prev =>
      prev.map(s => {
        if (s.id === id) {
          const nextStatus = s.status === 'ACTIVE' ? 'CLOSED' : 'ACTIVE';
          return { ...s, status: nextStatus, last_verified_at: new Date().toISOString() };
        }
        return s;
      })
    );
  };

  const handleAddScheme = (e) => {
    e.preventDefault();
    const created = {
      id: `custom_${Date.now()}`,
      name: newScheme.name,
      provider: newScheme.provider,
      provider_type: newScheme.government_level === 'PRIVATE' ? 'CORPORATE_TRUST' : 'GOVERNMENT',
      government_level: newScheme.government_level,
      state: 'ALL_INDIA',
      academic_year: '2026-27',
      description: 'Newly added scheme verified via Admin Scholarship Intelligence Panel.',
      amount: 50000,
      amount_display: newScheme.amount_display,
      amount_type: 'ANNUAL_GRANT',
      application_start: '2026-08-01',
      application_deadline: newScheme.application_deadline,
      application_url: newScheme.application_url,
      official_source_url: newScheme.application_url,
      status: 'ACTIVE',
      last_verified_at: new Date().toISOString(),
      source_type: 'ADMIN_Ingested',
      rules: {
        min_age: 16,
        max_age: 30,
        gender: 'ANY',
        categories: ['GENERAL', 'OBC', 'SC', 'ST', 'EWS'],
        minority_only: false,
        max_family_income: parseFloat(newScheme.max_family_income || 600000),
        domicile_states: ['ALL'],
        education_levels: ['UNDERGRADUATE', 'POSTGRADUATE'],
        courses: ['ANY'],
        institution_types: ['ANY'],
        min_class_12_percentage: 50.0,
        min_cgpa: 5.0,
        min_percentage: 50.0,
        year_of_study: [1, 2, 3, 4],
        disability_required: false,
        disability_min_percentage: 0,
        special_conditions: [],
        prohibit_other_gov_scholarships: false
      },
      required_documents: [
        { id: 'doc_12_marksheet', name: 'Marksheet', mandatory: true },
        { id: 'doc_income_cert', name: 'Income Certificate', mandatory: true }
      ]
    };

    setScholarships(prev => [created, ...prev]);
    setShowAddForm(false);
    setNewScheme({
      name: '',
      provider: '',
      government_level: 'CENTRAL',
      amount_display: '₹50,000 / year',
      max_family_income: 600000,
      application_deadline: '2026-11-30',
      application_url: 'https://scholarships.gov.in',
      status: 'ACTIVE'
    });
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8 text-white relative z-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <button
            onClick={onClose}
            className="text-xs font-semibold text-gray-400 hover:text-white mb-2 flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-purple-400" />
            <span>Admin Scholarship Intelligence Panel</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Verified Indian scholarship management, rule extraction, deadline updates, and data freshness monitoring.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-purple-600/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Scholarship Scheme</span>
        </button>
      </div>

      {/* Add Scholarship Form Modal/Accordion */}
      {showAddForm && (
        <form onSubmit={handleAddScheme} className="p-6 rounded-3xl bg-[#0e101f] border border-purple-500/30 mb-8 space-y-4 max-w-3xl">
          <h3 className="text-base font-bold text-purple-300">Add New Scholarship Verification Record</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Scholarship Name</label>
              <input
                type="text"
                required
                value={newScheme.name}
                onChange={e => setNewScheme({ ...newScheme, name: e.target.value })}
                placeholder="e.g. State Research Grant 2026"
                className="w-full px-3 py-2 rounded-lg bg-[#141628] border border-white/10 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Provider Department</label>
              <input
                type="text"
                required
                value={newScheme.provider}
                onChange={e => setNewScheme({ ...newScheme, provider: e.target.value })}
                placeholder="e.g. Dept of Higher Education"
                className="w-full px-3 py-2 rounded-lg bg-[#141628] border border-white/10 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Award Amount Display</label>
              <input
                type="text"
                value={newScheme.amount_display}
                onChange={e => setNewScheme({ ...newScheme, amount_display: e.target.value })}
                placeholder="₹50,000 / year"
                className="w-full px-3 py-2 rounded-lg bg-[#141628] border border-white/10 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Max Income Limit (INR ₹)</label>
              <input
                type="number"
                value={newScheme.max_family_income}
                onChange={e => setNewScheme({ ...newScheme, max_family_income: e.target.value })}
                placeholder="600000"
                className="w-full px-3 py-2 rounded-lg bg-[#141628] border border-white/10 text-xs text-white"
              />
            </div>
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold text-xs"
          >
            Save Scholarship & Verify
          </button>
        </form>
      )}

      {/* Scholarship Table */}
      <div className="rounded-3xl bg-[#0c0d18] border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#121424] text-gray-400 font-semibold border-b border-white/10">
                <th className="p-4">Scholarship Name</th>
                <th className="p-4">Level / Portal</th>
                <th className="p-4">Award Amount</th>
                <th className="p-4">Deadline</th>
                <th className="p-4">Last Verified</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {scholarships.map((s) => (
                <tr key={s.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 font-bold text-white max-w-xs truncate">
                    {s.name}
                    <span className="block text-[10px] text-gray-400 font-normal">{s.provider}</span>
                  </td>
                  <td className="p-4 text-cyan-300 font-semibold">{s.government_level}</td>
                  <td className="p-4 text-emerald-400 font-bold">{s.amount_display}</td>
                  <td className="p-4 text-amber-300">{s.application_deadline}</td>
                  <td className="p-4 text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    {new Date(s.last_verified_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${
                      s.status === 'ACTIVE' ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                    }`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => toggleStatus(s.id)}
                      className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-[11px] font-semibold transition-colors"
                    >
                      Toggle Active
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
