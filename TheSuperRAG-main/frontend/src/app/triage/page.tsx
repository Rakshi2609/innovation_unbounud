"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Layers, 
  RefreshCw, 
  Search, 
  Plus, 
  Scale, 
  TrendingDown, 
  BookOpen, 
  ExternalLink,
  ShieldAlert,
  AlertTriangle
} from 'lucide-react';

const API_BASE = "http://localhost:8000";

const formatINR = (val: number | undefined | null): string => {
  if (val === undefined || val === null) return "₹0";
  return "₹" + Number(val).toLocaleString("en-IN");
};

export default function TriagePage() {
  const [cases, setCases] = useState<any[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [selectedCaseDetail, setSelectedCaseDetail] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [trackFilter, setTrackFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Decision Modal
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);
  const [selectedCitation, setSelectedCitation] = useState<any | null>(null);
  const [decisionType, setDecisionType] = useState<string>('RESTRUCTURE');
  const [officerName, setOfficerName] = useState('Officer Priya Nair');
  const [officerId, setOfficerId] = useState('OFFICER-402');
  const [actionTaken, setActionTaken] = useState('Approved 36-Month Term Debt Restructuring Plan');
  const [decisionNotes, setDecisionNotes] = useState('Customer proactively engaged before 60-day default window.');
  const [overrideML, setOverrideML] = useState(false);
  const [overrideReason, setOverrideReason] = useState('');

  const fetchCases = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/cases`);
      if (res.ok) {
        const data = await res.json();
        setCases(data.cases || []);
        if (data.cases && data.cases.length > 0 && !selectedCaseId) {
          setSelectedCaseId(data.cases[0].case_id);
        }
      }
    } catch (e) {
      console.error("Failed fetching cases:", e);
    }
  };

  const fetchCaseDetail = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/cases/${id}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedCaseDetail(data);
      }
    } catch (e) {
      console.error("Failed fetching case detail:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  useEffect(() => {
    if (selectedCaseId) {
      fetchCaseDetail(selectedCaseId);
    }
  }, [selectedCaseId]);

  const handleSubmitDecision = async () => {
    if (!selectedCaseId) return;
    try {
      const payload = {
        officer_id: officerId,
        officer_name: officerName,
        decision: decisionType,
        action_taken: actionTaken,
        notes: decisionNotes,
        override_ml: overrideML,
        override_reason: overrideML ? overrideReason : null
      };

      const res = await fetch(`${API_BASE}/api/v1/cases/${selectedCaseId}/decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsDecisionModalOpen(false);
        fetchCaseDetail(selectedCaseId);
        fetchCases();
      }
    } catch (e) {
      console.error("Failed submitting decision:", e);
    }
  };

  const filteredCases = cases.filter(c => {
    const matchesTrack = trackFilter === 'all' || c.track_type === trackFilter;
    const matchesSearch = c.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.case_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.customer_id?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTrack && matchesSearch;
  });

  const getRiskBadgeColor = (riskClass: string) => {
    switch (riskClass) {
      case 'CRITICAL': return 'bg-[#E23D28] text-white border-[#1A1A1A]';
      case 'HIGH': return 'bg-[#F5D04C] text-[#1A1A1A] border-[#1A1A1A]';
      case 'MEDIUM': return 'bg-[#0F4C81] text-white border-[#1A1A1A]';
      default: return 'bg-[#28A745] text-white border-[#1A1A1A]';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-[#28A745] text-white';
      case 'RESTRUCTURED': return 'bg-[#0F4C81] text-white';
      case 'FLAGGED': return 'bg-[#E23D28] text-white';
      case 'DECLINED': return 'bg-gray-800 text-white';
      default: return 'bg-[#F5D04C] text-[#1A1A1A]';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Track Filter Bar */}
      <div className="bg-white border-4 border-[#1A1A1A] p-4 mb-6 shadow-[4px_4px_0px_#1A1A1A] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase text-[#8A8A8A]">Filter Banking Track:</span>
          <select
            value={trackFilter}
            onChange={e => setTrackFilter(e.target.value)}
            className="border-2 border-[#1A1A1A] px-3 py-1.5 bg-white font-bold text-xs uppercase cursor-pointer"
          >
            <option value="all">All 5 Banking Tracks</option>
            <option value="distress">1. Preventing Financial Distress</option>
            <option value="fraud">2. Vulnerable Customer Fraud Defense</option>
            <option value="gig_resilience">3. Gig Worker Financial Resilience</option>
            <option value="safe_payments">4. Safe & Inclusive Digital Payments</option>
          </select>
        </div>

        <Link
          href="/evaluate"
          className="flex items-center gap-1.5 bg-[#E23D28] text-white px-4 py-2 border-2 border-[#1A1A1A] font-black text-xs uppercase tracking-wider hover:bg-[#1A1A1A] transition-all"
        >
          <Plus size={14} /> Evaluate New Customer
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Triage Feed */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-white border-4 border-[#1A1A1A] p-4 shadow-[4px_4px_0px_#1A1A1A]">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-black text-sm uppercase tracking-wider flex items-center gap-2">
                <Layers size={16} className="text-[#E23D28]" /> Triage Queue ({filteredCases.length})
              </h2>
              <button onClick={fetchCases} className="p-1 hover:bg-gray-100 border border-[#1A1A1A]">
                <RefreshCw size={13} />
              </button>
            </div>

            <div className="relative mb-3">
              <Search size={14} className="absolute left-3 top-2.5 text-gray-500" />
              <input
                type="text"
                placeholder="Search by customer, case ID..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 border-2 border-[#1A1A1A] text-xs font-bold"
              />
            </div>

            <div className="flex flex-col gap-2.5 max-h-[70vh] overflow-y-auto pr-1">
              {filteredCases.map(c => {
                const isSelected = selectedCaseId === c.case_id;
                return (
                  <div
                    key={c.case_id}
                    onClick={() => setSelectedCaseId(c.case_id)}
                    className={`p-3.5 border-2 border-[#1A1A1A] cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-[#1A1A1A] text-white shadow-[4px_4px_0px_#E23D28]' 
                        : 'bg-white hover:bg-[#F9FAFB] shadow-[2px_2px_0px_#1A1A1A]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 border ${getRiskBadgeColor(c.risk_class)}`}>
                        {c.risk_class} RISK ({Math.round(c.risk_score * 100)}%)
                      </span>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 ${getStatusBadge(c.status)}`}>
                        {c.status}
                      </span>
                    </div>

                    <h3 className={`font-black text-sm leading-tight ${isSelected ? 'text-white' : 'text-[#1A1A1A]'}`}>
                      {c.customer_name}
                    </h3>

                    <div className={`flex items-center justify-between text-xs mt-2 font-bold ${isSelected ? 'text-gray-300' : 'text-[#8A8A8A]'}`}>
                      <span>{c.case_id}</span>
                      <span className="capitalize">{c.risk_type?.replace('_', ' ')}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Full Case Details & Decision Controls */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {selectedCaseDetail ? (
            <>
              {/* Header Overview Card */}
              <div className="bg-white border-4 border-[#1A1A1A] p-6 shadow-[6px_6px_0px_#1A1A1A]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#1A1A1A] pb-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-black px-2 py-0.5 bg-[#1A1A1A] text-white uppercase">
                        {selectedCaseDetail.case_id}
                      </span>
                      <span className={`text-xs font-black px-2.5 py-0.5 border-2 ${getRiskBadgeColor(selectedCaseDetail.risk_class)}`}>
                        {selectedCaseDetail.risk_class} RISK ({Math.round(selectedCaseDetail.risk_score * 100)}%)
                      </span>
                      <span className={`text-xs font-black px-2.5 py-0.5 uppercase ${getStatusBadge(selectedCaseDetail.status)}`}>
                        {selectedCaseDetail.status}
                      </span>
                    </div>
                    <h2 className="text-2xl font-black uppercase text-[#1A1A1A]">
                      {selectedCaseDetail.customer_name}
                    </h2>
                    <p className="text-xs font-bold text-[#8A8A8A]">
                      ID: {selectedCaseDetail.customer_id} · {selectedCaseDetail.customer_profile?.occupation} ({selectedCaseDetail.customer_profile?.employment_type})
                    </p>
                  </div>

                  <button
                    onClick={() => setIsDecisionModalOpen(true)}
                    className="bg-[#E23D28] text-white border-2 border-[#1A1A1A] px-5 py-3 font-black text-xs uppercase tracking-wider hover:bg-[#1A1A1A] hover:shadow-[4px_4px_0px_#1A1A1A] transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Scale size={16} /> Make Officer Decision
                  </button>
                </div>

                {/* Financial Metrics in Indian Rupees (₹) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-[#F4F4F4] border-2 border-[#1A1A1A]">
                    <p className="text-[10px] font-black uppercase text-[#8A8A8A]">Monthly Income</p>
                    <p className="text-base font-black text-[#1A1A1A]">
                      {formatINR(selectedCaseDetail.customer_profile?.financial_metrics?.monthly_income)}
                    </p>
                  </div>
                  <div className="p-3 bg-[#F4F4F4] border-2 border-[#1A1A1A]">
                    <p className="text-[10px] font-black uppercase text-[#8A8A8A]">Monthly Expenses</p>
                    <p className="text-base font-black text-[#1A1A1A]">
                      {formatINR(selectedCaseDetail.customer_profile?.financial_metrics?.monthly_expenses)}
                    </p>
                  </div>
                  <div className="p-3 bg-[#F4F4F4] border-2 border-[#1A1A1A]">
                    <p className="text-[10px] font-black uppercase text-[#8A8A8A]">Credit Utilization</p>
                    <p className="text-base font-black text-[#E23D28]">
                      {Math.round((selectedCaseDetail.customer_profile?.financial_metrics?.credit_utilization || 0) * 100)}%
                    </p>
                  </div>
                  <div className="p-3 bg-[#F4F4F4] border-2 border-[#1A1A1A]">
                    <p className="text-[10px] font-black uppercase text-[#8A8A8A]">Total Debt Balance</p>
                    <p className="text-base font-black text-[#1A1A1A]">
                      {formatINR(selectedCaseDetail.customer_profile?.financial_metrics?.existing_debt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Statistical ML Breakdown Card */}
              <div className="bg-white border-4 border-[#1A1A1A] p-6 shadow-[6px_6px_0px_#1A1A1A]">
                <div className="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-3 mb-4">
                  <h3 className="font-black text-sm uppercase tracking-wider flex items-center gap-2">
                    <TrendingDown size={18} className="text-[#E23D28]" /> Statistical ML Prediction Breakdown
                  </h3>
                  <span className="text-[10px] font-bold bg-gray-100 border border-[#1A1A1A] px-2 py-0.5">
                    Model: {selectedCaseDetail.ml_prediction?.model_version} (Certainty: {Math.round(selectedCaseDetail.ml_prediction?.confidence * 100)}%)
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedCaseDetail.ml_prediction?.top_factors?.map((factor: any, idx: number) => (
                    <div key={idx} className="p-3.5 border-2 border-[#1A1A1A] bg-[#FFF8E7]">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-black uppercase text-[#1A1A1A]">
                          {factor.factor.replace(/_/g, ' ')}
                        </span>
                        <span className="text-xs font-bold text-[#E23D28]">
                          Weight: {factor.weight}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-[#4A4A4A]">
                        {factor.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Grounded Policy Reasoning & Citations Card */}
              <div className="bg-white border-4 border-[#1A1A1A] p-6 shadow-[6px_6px_0px_#1A1A1A]">
                <div className="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-3 mb-4">
                  <h3 className="font-black text-sm uppercase tracking-wider flex items-center gap-2">
                    <BookOpen size={18} className="text-[#0F4C81]" /> Grounded Policy Reasoning & Citations
                  </h3>
                  <span className="text-[10px] font-bold bg-blue-50 border border-[#0F4C81] text-[#0F4C81] px-2 py-0.5">
                    {selectedCaseDetail.rag_citations?.length || 0} Policy Clauses Retrieved
                  </span>
                </div>

                <div className="p-4 bg-[#F4F4F4] border-l-8 border-[#0F4C81] border-2 border-[#1A1A1A] mb-4">
                  <p className="text-xs font-bold leading-relaxed text-[#1A1A1A] mb-2">
                    {selectedCaseDetail.explanation?.summary}
                  </p>
                  <p className="text-xs font-semibold text-[#0F4C81]">
                    {selectedCaseDetail.explanation?.policy_alignment}
                  </p>
                </div>

                <h4 className="text-xs font-black uppercase text-[#8A8A8A] mb-2">Retrieved Policy Clauses:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {selectedCaseDetail.rag_citations?.map((citation: any, i: number) => (
                    <div
                      key={i}
                      onClick={() => setSelectedCitation(citation)}
                      className="p-3 border-2 border-[#1A1A1A] bg-white hover:bg-yellow-50 cursor-pointer transition-all shadow-[2px_2px_0px_#1A1A1A]"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-black uppercase bg-[#1A1A1A] text-white px-1.5 py-0.5">
                          [{i+1}] {citation.clause}
                        </span>
                        <span className="text-[10px] font-bold text-[#0F4C81]">
                          Score: {citation.relevance_score}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-[#1A1A1A] truncate">{citation.policy_name}</p>
                      <p className="text-[11px] text-[#4A4A4A] line-clamp-2 mt-1 italic">
                        "{citation.snippet}"
                      </p>
                    </div>
                  ))}
                </div>

                <h4 className="text-xs font-black uppercase text-[#8A8A8A] mb-2">Suggested Responsible Interventions:</h4>
                <div className="flex flex-col gap-2">
                  {selectedCaseDetail.explanation?.recommendations?.map((rec: any, idx: number) => (
                    <div key={idx} className="p-3 border-2 border-[#28A745] bg-[#28A745]/5 flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black px-2 py-0.5 bg-[#28A745] text-white uppercase">
                            {rec.action_type}
                          </span>
                          <strong className="text-xs text-[#1A1A1A]">{rec.title}</strong>
                        </div>
                        <p className="text-xs text-[#4A4A4A] mt-1">{rec.rationale}</p>
                        {rec.eligible_programs?.length > 0 && (
                          <div className="flex gap-1.5 mt-2">
                            {rec.eligible_programs.map((prog: string, pIdx: number) => (
                              <span key={pIdx} className="text-[10px] font-bold px-2 py-0.5 border border-[#28A745] text-[#28A745]">
                                {prog}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center bg-white border-4 border-[#1A1A1A]">
              <p className="font-bold text-gray-500">Select a case from the triage queue on the left to inspect.</p>
            </div>
          )}
        </div>
      </div>

      {/* Decision Modal */}
      {isDecisionModalOpen && selectedCaseDetail && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-[#1A1A1A] max-w-xl w-full p-6 shadow-[8px_8px_0px_#E23D28] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-3 mb-4">
              <h3 className="font-black text-base uppercase text-[#1A1A1A]">
                Human Decision Gateway: {selectedCaseDetail.customer_name}
              </h3>
              <button onClick={() => setIsDecisionModalOpen(false)} className="font-black text-lg">✕</button>
            </div>

            <div className="flex flex-col gap-4 text-xs font-bold">
              <div>
                <label className="block uppercase text-gray-600 mb-1">Decision Action:</label>
                <select
                  value={decisionType}
                  onChange={e => setDecisionType(e.target.value)}
                  className="w-full p-2 border-2 border-[#1A1A1A] bg-white font-bold text-xs"
                >
                  <option value="RESTRUCTURE">Approve Debt Restructuring / Moratorium</option>
                  <option value="APPROVE">Approve Standard Credit Facility</option>
                  <option value="REQUEST_INFO">Require Additional Documentation Disclosures</option>
                  <option value="FLAG_FRAUD">Flag Fraud Anomaly & Hold Transaction</option>
                  <option value="DECLINE">Decline Credit Request</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase text-gray-600 mb-1">Officer Name:</label>
                  <input
                    type="text"
                    value={officerName}
                    onChange={e => setOfficerName(e.target.value)}
                    className="w-full p-2 border-2 border-[#1A1A1A]"
                  />
                </div>
                <div>
                  <label className="block uppercase text-gray-600 mb-1">Officer ID:</label>
                  <input
                    type="text"
                    value={officerId}
                    onChange={e => setOfficerId(e.target.value)}
                    className="w-full p-2 border-2 border-[#1A1A1A]"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase text-gray-600 mb-1">Action Summary:</label>
                <input
                  type="text"
                  value={actionTaken}
                  onChange={e => setActionTaken(e.target.value)}
                  className="w-full p-2 border-2 border-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="block uppercase text-gray-600 mb-1">Officer Compliance Notes:</label>
                <textarea
                  rows={3}
                  value={decisionNotes}
                  onChange={e => setDecisionNotes(e.target.value)}
                  className="w-full p-2 border-2 border-[#1A1A1A]"
                />
              </div>

              <div className="p-3 bg-yellow-50 border-2 border-[#1A1A1A]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={overrideML}
                    onChange={e => setOverrideML(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="uppercase text-xs font-black">Override AI / ML Model Risk Finding</span>
                </label>
                {overrideML && (
                  <input
                    type="text"
                    placeholder="Mandatory rationale for overriding ML model..."
                    value={overrideReason}
                    onChange={e => setOverrideReason(e.target.value)}
                    className="w-full p-2 border-2 border-[#1A1A1A] mt-2 bg-white"
                  />
                )}
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t-2 border-[#1A1A1A]">
                <button
                  onClick={() => setIsDecisionModalOpen(false)}
                  className="px-4 py-2 border-2 border-[#1A1A1A] uppercase font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitDecision}
                  className="px-5 py-2 bg-[#E23D28] text-white border-2 border-[#1A1A1A] font-black uppercase hover:bg-[#1A1A1A]"
                >
                  Confirm & Commit to Audit Trail
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Citation Detail Modal */}
      {selectedCitation && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-[#1A1A1A] max-w-lg w-full p-6 shadow-[8px_8px_0px_#F5D04C]">
            <div className="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-3 mb-4">
              <span className="text-xs font-black px-2 py-0.5 bg-[#1A1A1A] text-white uppercase">
                {selectedCitation.clause}
              </span>
              <button onClick={() => setSelectedCitation(null)} className="font-black text-lg">✕</button>
            </div>

            <h3 className="font-black text-sm uppercase text-[#1A1A1A] mb-1">
              {selectedCitation.policy_name}
            </h3>
            <p className="text-xs text-gray-500 font-bold mb-3">
              Section: {selectedCitation.section} · Source File: {selectedCitation.source_file}
            </p>

            <div className="p-3 bg-[#F4F4F4] border-2 border-[#1A1A1A] text-xs font-mono leading-relaxed text-[#1A1A1A] mb-4">
              {selectedCitation.snippet}
            </div>

            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-[#0F4C81]">Relevance Score: {selectedCitation.relevance_score}</span>
              <button
                onClick={() => setSelectedCitation(null)}
                className="px-4 py-1.5 bg-[#1A1A1A] text-white font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
