"use client";

import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Search, 
  Plus, 
  Layers, 
  User, 
  DollarSign, 
  Scale, 
  Send, 
  BookOpen, 
  History, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Lock,
  Eye
} from 'lucide-react';

const API_BASE = "http://localhost:8000";

interface RiskFactor {
  factor: string;
  weight: number;
  description: string;
}

interface MLPrediction {
  prediction_id: string;
  customer_id: string;
  risk_score: number;
  risk_class: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  confidence: number;
  risk_type: string;
  top_factors: RiskFactor[];
  model_version: string;
  evaluation_metrics?: Record<string, number>;
}

interface PolicyCitation {
  source_file: string;
  policy_name: string;
  section: string;
  clause: string;
  snippet: string;
  relevance_score: number;
}

interface ActionRecommendation {
  action_type: string;
  title: string;
  rationale: string;
  eligible_programs: string[];
}

interface CaseExplanation {
  summary: string;
  factor_breakdown: string[];
  policy_alignment: string;
  evidence_citations: PolicyCitation[];
  recommendations: ActionRecommendation[];
}

interface CustomerProfile {
  customer_id: string;
  name: string;
  occupation: string;
  employment_type: string;
  credit_score?: number;
  account_age_months: number;
  financial_metrics: {
    monthly_income: number;
    monthly_expenses: number;
    existing_debt: number;
    credit_utilization: number;
    recent_delinquencies: number;
    savings_balance: number;
    income_volatility_score?: number;
  };
  recent_transaction?: {
    transaction_id?: string;
    amount: number;
    merchant_category?: string;
    channel: string;
    device_trust_score?: number;
    location?: string;
    is_international: boolean;
  };
}

interface CaseItem {
  case_id: string;
  customer_id: string;
  customer_name: string;
  track_type: string;
  status: string;
  risk_score: number;
  risk_class: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  risk_type: string;
  created_at?: string;
  updated_at?: string;
  top_factors?: RiskFactor[];
  citations_count?: number;
}

interface FullCaseDetail extends CaseItem {
  customer_profile: CustomerProfile;
  ml_prediction: MLPrediction;
  explanation: CaseExplanation;
  rag_citations: PolicyCitation[];
}

interface AuditEntry {
  id: string;
  event_type: string;
  actor: string;
  action: string;
  decision?: string;
  override_ml: boolean;
  override_reason?: string;
  notes?: string;
  timestamp: string;
}

export default function FinancialCopilotDashboard() {
  const [activeTab, setActiveTab] = useState<'triage' | 'policies' | 'copilot' | 'audit'>('triage');
  const [trackFilter, setTrackFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Data states
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [selectedCaseDetail, setSelectedCaseDetail] = useState<FullCaseDetail | null>(null);
  const [policies, setPolicies] = useState<string[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [systemStatus, setSystemStatus] = useState<any>(null);

  // Modals
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);
  const [isNewCaseModalOpen, setIsNewCaseModalOpen] = useState(false);
  const [selectedCitation, setSelectedCitation] = useState<PolicyCitation | null>(null);

  // Decision Form State
  const [decisionType, setDecisionType] = useState<string>('RESTRUCTURE');
  const [officerName, setOfficerName] = useState('Officer Priya Nair');
  const [officerId, setOfficerId] = useState('OFFICER-402');
  const [actionTaken, setActionTaken] = useState('Approved 36-Month Term Debt Restructuring Plan');
  const [decisionNotes, setDecisionNotes] = useState('Customer proactively engaged before 60-day default window.');
  const [overrideML, setOverrideML] = useState(false);
  const [overrideReason, setOverrideReason] = useState('');

  // New Case Evaluation Form
  const [newCaseForm, setNewCaseForm] = useState({
    name: "Meera Sen",
    customer_id: "CUST-LIVE-" + Math.floor(1000 + Math.random() * 9000),
    occupation: "Independent Freelance Designer",
    employment_type: "Gig / Informal",
    credit_score: 660,
    track_type: "distress",
    monthly_income: 50000,
    monthly_expenses: 46000,
    existing_debt: 210000,
    credit_utilization: 0.88,
    recent_delinquencies: 1,
    savings_balance: 6000,
    income_volatility: 0.35,
    tx_amount: 15000,
    device_trust: 0.95
  });

  // Copilot Chat state
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; citations?: PolicyCitation[] }>>([
    {
      role: 'assistant',
      text: "Hello! I am your AI Financial Safety & Lending Copilot. I can explain ML risk factors, cite exact banking policy clauses, and recommend responsible interventions. How can I assist you with case triage today?",
    }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Fetch initial data
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
      // Also fetch audit trail
      const auditRes = await fetch(`${API_BASE}/api/v1/cases/${id}/audit`);
      if (auditRes.ok) {
        const auditData = await auditRes.json();
        setAuditLogs(auditData.audit_trail || []);
      }
    } catch (e) {
      console.error("Failed fetching case detail:", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchPolicies = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/documents`);
      if (res.ok) {
        const data = await res.json();
        setPolicies(data.documents || []);
      }
    } catch (e) {
      console.error("Failed fetching policies:", e);
    }
  };

  const fetchStatus = async () => {
    try {
      const res = await fetch(`${API_BASE}/health/status`);
      if (res.ok) {
        setSystemStatus(await res.json());
      }
    } catch (e) {
      console.error("Failed fetching status:", e);
    }
  };

  useEffect(() => {
    fetchCases();
    fetchPolicies();
    fetchStatus();
    const interval = setInterval(() => {
      fetchCases();
      fetchStatus();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedCaseId) {
      fetchCaseDetail(selectedCaseId);
    }
  }, [selectedCaseId]);

  // Handle Decision Submission
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

  // Handle New Case Evaluation
  const handleEvaluateNewCase = async () => {
    setLoading(true);
    try {
      const payload = {
        track_type: newCaseForm.track_type,
        customer: {
          customer_id: newCaseForm.customer_id,
          name: newCaseForm.name,
          occupation: newCaseForm.occupation,
          employment_type: newCaseForm.employment_type,
          credit_score: Number(newCaseForm.credit_score),
          financial_metrics: {
            monthly_income: Number(newCaseForm.monthly_income),
            monthly_expenses: Number(newCaseForm.monthly_expenses),
            existing_debt: Number(newCaseForm.existing_debt),
            credit_utilization: Number(newCaseForm.credit_utilization),
            recent_delinquencies: Number(newCaseForm.recent_delinquencies),
            savings_balance: Number(newCaseForm.savings_balance),
            income_volatility_score: Number(newCaseForm.income_volatility)
          },
          recent_transaction: {
            amount: Number(newCaseForm.tx_amount),
            device_trust_score: Number(newCaseForm.device_trust),
            channel: "mobile_app",
            is_international: false
          }
        }
      };

      const res = await fetch(`${API_BASE}/api/v1/cases/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const result = await res.json();
        setIsNewCaseModalOpen(false);
        await fetchCases();
        setSelectedCaseId(result.case_id);
      }
    } catch (e) {
      console.error("Failed evaluating case:", e);
    } finally {
      setLoading(false);
    }
  };

  // Chat Submission handler
  const handleSendChat = async () => {
    if (!chatInput.trim()) return;
    const userQ = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: userQ }]);

    // Formulate response based on selected case & policy context
    setTimeout(() => {
      if (selectedCaseDetail) {
        const c = selectedCaseDetail;
        const respText = `Regarding **${c.customer_name}** (${c.case_id}): The ML model assessed a **${c.ml_prediction.risk_score * 100}% risk (${c.risk_class})** due to: \n${c.ml_prediction.top_factors.map(f => `• ${f.description}`).join('\n')}\n\n**Policy Basis:** In accordance with ${c.rag_citations.map(rc => `*${rc.policy_name} (${rc.clause})*`).join(', ')}, the recommended action is **${c.explanation.recommendations[0]?.title || 'Restructuring'}**.`;
        setChatMessages(prev => [...prev, { role: 'assistant', text: respText, citations: c.rag_citations }]);
      } else {
        setChatMessages(prev => [...prev, { role: 'assistant', text: `I have access to ${policies.length} banking policy guidelines (including Lending Underwriting, Fraud SOPs, and Hardship Restructuring). Select a case from the triage queue to see tailored policy citations.` }]);
      }
    }, 600);
  };

  // Filtered cases
  const filteredCases = cases.filter(c => {
    const matchesTrack = trackFilter === 'all' || c.track_type === trackFilter;
    const matchesSearch = c.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.case_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.customer_id.toLowerCase().includes(searchQuery.toLowerCase());
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
    <div className="min-h-screen bg-[#F4F4F4] text-[#1A1A1A] font-sans selection:bg-[#F5D04C]">
      
      {/* 
        =======================================================================
        TOP HEADER BAR (Bauhaus Design)
        =======================================================================
      */}
      <header className="border-b-4 border-[#1A1A1A] bg-white sticky top-0 z-40 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 grid grid-cols-2 border-2 border-[#1A1A1A] overflow-hidden shadow-[2px_2px_0px_#1A1A1A]">
              <div className="bg-[#E23D28] rounded-br-full"></div>
              <div className="bg-[#0F4C81]"></div>
              <div className="bg-[#F5D04C]"></div>
              <div className="bg-[#1A1A1A] rounded-tl-full"></div>
            </div>
            <div>
              <h1 className="text-xl font-black uppercase tracking-wider text-[#1A1A1A]">
                AI Financial Safety & Lending Copilot
              </h1>
              <p className="text-xs font-bold text-[#8A8A8A] uppercase tracking-widest">
                Grounded RAG · Statistical ML · Human Governance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#28A745]/10 text-[#28A745] border-2 border-[#28A745] text-xs font-black uppercase">
              <span className="w-2 h-2 rounded-full bg-[#28A745] animate-pulse"></span>
              Live Backend (Port 8000)
            </span>
          </div>
        </div>

        {/* Action Controls & Navigation */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <button
            onClick={() => setIsNewCaseModalOpen(true)}
            className="flex items-center gap-2 bg-[#E23D28] text-white px-4 py-2 border-2 border-[#1A1A1A] font-black text-xs uppercase tracking-wider hover:bg-[#1A1A1A] hover:shadow-[3px_3px_0px_#1A1A1A] transition-all cursor-pointer"
          >
            <Plus size={16} /> Evaluate New Case
          </button>
        </div>
      </header>

      {/* 
        =======================================================================
        NAVIGATION SUB-HEADER (Tabs & Problem Statement Tracks)
        =======================================================================
      */}
      <div className="bg-white border-b-4 border-[#1A1A1A] px-6 py-2.5 flex flex-wrap items-center justify-between gap-4">
        {/* Main Tabs */}
        <div className="flex items-center gap-2">
          {[
            { id: 'triage', label: 'Triage Queue & Review', icon: Layers },
            { id: 'policies', label: 'Policy Knowledge Base', icon: BookOpen },
            { id: 'copilot', label: 'RAG Copilot Assistant', icon: Sparkles },
            { id: 'audit', label: 'Compliance Audit Trail', icon: History }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 border-2 border-[#1A1A1A] text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-[#1A1A1A] text-white shadow-[3px_3px_0px_#E23D28]' 
                    : 'bg-[#F4F4F4] text-[#1A1A1A] hover:bg-[#E9ECEF]'
                }`}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Problem Statement Track Filter */}
        {activeTab === 'triage' && (
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="text-[#8A8A8A] uppercase">Hackathon Track:</span>
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
        )}
      </div>

      {/* 
        =======================================================================
        MAIN CONTENT AREA
        =======================================================================
      */}
      <main className="max-w-7xl mx-auto p-6">

        {/* ---------------- TAB 1: TRIAGE QUEUE & CASE REVIEW ---------------- */}
        {activeTab === 'triage' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Cases Queue List */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="bg-white border-4 border-[#1A1A1A] p-4 shadow-[4px_4px_0px_#1A1A1A]">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-black text-sm uppercase tracking-wider flex items-center gap-2">
                    <Layers size={16} className="text-[#E23D28]" /> Case Triage Feed ({filteredCases.length})
                  </h2>
                  <button onClick={fetchCases} className="p-1 hover:bg-gray-100 border border-[#1A1A1A]">
                    <RefreshCw size={13} />
                  </button>
                </div>

                <div className="relative mb-3">
                  <Search size={14} className="absolute left-3 top-2.5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search by name, case or ID..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 border-2 border-[#1A1A1A] text-xs font-bold"
                  />
                </div>

                <div className="flex flex-col gap-2.5 max-h-[68vh] overflow-y-auto pr-1">
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
                          <span className="capitalize">{c.risk_type.replace('_', ' ')}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Case Details, ML Factors & Grounded Policy Reasoning */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {selectedCaseDetail ? (
                <>
                  {/* Case Header Card */}
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

                      {/* Decision CTA Button */}
                      <button
                        onClick={() => setIsDecisionModalOpen(true)}
                        className="bg-[#E23D28] text-white border-2 border-[#1A1A1A] px-5 py-3 font-black text-xs uppercase tracking-wider hover:bg-[#1A1A1A] hover:shadow-[4px_4px_0px_#1A1A1A] transition-all cursor-pointer flex items-center gap-2"
                      >
                        <Scale size={16} /> Make Officer Decision
                      </button>
                    </div>

                    {/* Financial Snapshot Metrics */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3 bg-[#F4F4F4] border-2 border-[#1A1A1A]">
                        <p className="text-[10px] font-black uppercase text-[#8A8A8A]">Monthly Income</p>
                        <p className="text-base font-black text-[#1A1A1A]">
                          ${selectedCaseDetail.customer_profile?.financial_metrics?.monthly_income?.toLocaleString() || 0}
                        </p>
                      </div>
                      <div className="p-3 bg-[#F4F4F4] border-2 border-[#1A1A1A]">
                        <p className="text-[10px] font-black uppercase text-[#8A8A8A]">Monthly Expenses</p>
                        <p className="text-base font-black text-[#1A1A1A]">
                          ${selectedCaseDetail.customer_profile?.financial_metrics?.monthly_expenses?.toLocaleString() || 0}
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
                          ${selectedCaseDetail.customer_profile?.financial_metrics?.existing_debt?.toLocaleString() || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ML Model Risk Factors Card */}
                  <div className="bg-white border-4 border-[#1A1A1A] p-6 shadow-[6px_6px_0px_#1A1A1A]">
                    <div className="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-3 mb-4">
                      <h3 className="font-black text-sm uppercase tracking-wider flex items-center gap-2">
                        <TrendingDown size={18} className="text-[#E23D28]" /> Statistical ML Prediction Breakdown
                      </h3>
                      <span className="text-[10px] font-bold bg-gray-100 border border-[#1A1A1A] px-2 py-0.5">
                        Model: {selectedCaseDetail.ml_prediction?.model_version} (Certainty: {Math.round(selectedCaseDetail.ml_prediction?.confidence * 100)}%)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                      {selectedCaseDetail.ml_prediction?.top_factors?.map((factor, idx) => (
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

                    {/* Copilot Summary */}
                    <div className="p-4 bg-[#F4F4F4] border-l-8 border-[#0F4C81] border-2 border-[#1A1A1A] mb-4">
                      <p className="text-xs font-bold leading-relaxed text-[#1A1A1A] mb-2">
                        {selectedCaseDetail.explanation?.summary}
                      </p>
                      <p className="text-xs font-semibold text-[#0F4C81]">
                        {selectedCaseDetail.explanation?.policy_alignment}
                      </p>
                    </div>

                    {/* Policy Citations List */}
                    <h4 className="text-xs font-black uppercase text-[#8A8A8A] mb-2">Retrieved Policy Clauses:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      {selectedCaseDetail.rag_citations?.map((citation, i) => (
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

                    {/* Action Recommendations */}
                    <h4 className="text-xs font-black uppercase text-[#8A8A8A] mb-2">Suggested Responsible Interventions:</h4>
                    <div className="flex flex-col gap-2">
                      {selectedCaseDetail.explanation?.recommendations?.map((rec, idx) => (
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
                                {rec.eligible_programs.map((prog, pIdx) => (
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
        )}

        {/* ---------------- TAB 2: POLICY KNOWLEDGE BASE ---------------- */}
        {activeTab === 'policies' && (
          <div className="bg-white border-4 border-[#1A1A1A] p-6 shadow-[6px_6px_0px_#1A1A1A]">
            <div className="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-4 mb-6">
              <div>
                <h2 className="text-xl font-black uppercase text-[#1A1A1A] flex items-center gap-2">
                  <BookOpen size={20} className="text-[#E23D28]" /> Institutional Banking Policy Knowledge Base
                </h2>
                <p className="text-xs font-bold text-[#8A8A8A] mt-1">
                  Qdrant Hybrid Vector Index (FastEmbed + BM25) · Automated PII Sanitization
                </p>
              </div>
              <span className="text-xs font-black px-3 py-1 bg-[#1A1A1A] text-white">
                {policies.length} Policies Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {policies.map((p, idx) => (
                <div key={idx} className="p-4 border-2 border-[#1A1A1A] bg-[#F9FAFB] shadow-[3px_3px_0px_#1A1A1A]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black uppercase bg-[#0F4C81] text-white px-2 py-0.5">
                      Policy Document
                    </span>
                    <span className="text-xs text-green-600 font-bold">● Indexed in Vector Store</span>
                  </div>
                  <h3 className="font-black text-sm text-[#1A1A1A] mb-1">
                    {p.replace(/_/g, ' ').replace('.md', '').toUpperCase()}
                  </h3>
                  <p className="text-xs text-gray-600">
                    File: <code className="bg-gray-200 px-1">{p}</code>
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------- TAB 3: COPILOT RAG CHATBOT ---------------- */}
        {activeTab === 'copilot' && (
          <div className="bg-white border-4 border-[#1A1A1A] shadow-[6px_6px_0px_#1A1A1A] flex flex-col h-[75vh]">
            <div className="p-4 border-b-4 border-[#1A1A1A] bg-[#F4F4F4] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-[#E23D28]" />
                <h2 className="font-black text-sm uppercase">Interactive Policy & Case Assistant</h2>
              </div>
              <span className="text-xs font-bold text-gray-600">
                Active Context: {selectedCaseDetail?.customer_name || 'General Bank Policies'}
              </span>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col max-w-2xl ${
                    msg.role === 'user' ? 'self-end items-end' : 'self-start items-start'
                  }`}
                >
                  <div
                    className={`p-4 border-2 border-[#1A1A1A] text-xs font-medium leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[#1A1A1A] text-white shadow-[3px_3px_0px_#E23D28]'
                        : 'bg-white text-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A]'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-[10px] font-black uppercase text-[#0F4C81] mb-1">Citations:</p>
                        {msg.citations.map((c, ci) => (
                          <div key={ci} className="text-[10px] text-gray-600 bg-gray-50 p-1.5 mb-1 border border-gray-200">
                            <strong>[{ci+1}] {c.policy_name} ({c.clause})</strong>: {c.snippet}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Query Prompts */}
            <div className="px-6 py-2 bg-gray-50 border-t-2 border-[#1A1A1A] flex gap-2 overflow-x-auto text-xs">
              <button
                onClick={() => setChatInput("Why was the selected customer flagged for distress?")}
                className="px-2.5 py-1 bg-white border border-[#1A1A1A] font-bold text-[11px] whitespace-nowrap hover:bg-yellow-50"
              >
                Why was customer flagged?
              </button>
              <button
                onClick={() => setChatInput("What are the debt restructuring guidelines under Clause 3.2?")}
                className="px-2.5 py-1 bg-white border border-[#1A1A1A] font-bold text-[11px] whitespace-nowrap hover:bg-yellow-50"
              >
                What restructuring rules apply?
              </button>
              <button
                onClick={() => setChatInput("What fraud verification steps are required for senior accounts?")}
                className="px-2.5 py-1 bg-white border border-[#1A1A1A] font-bold text-[11px] whitespace-nowrap hover:bg-yellow-50"
              >
                Senior account fraud SOPs?
              </button>
            </div>

            {/* Input Bar */}
            <div className="p-4 border-t-4 border-[#1A1A1A] bg-white flex items-center gap-3">
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendChat()}
                placeholder="Ask about case risk factors, credit rules, or banking policy citations..."
                className="flex-1 px-4 py-2.5 border-2 border-[#1A1A1A] text-xs font-bold"
              />
              <button
                onClick={handleSendChat}
                className="bg-[#1A1A1A] text-white px-5 py-2.5 border-2 border-[#1A1A1A] font-black text-xs uppercase hover:bg-[#E23D28] transition-all cursor-pointer flex items-center gap-2"
              >
                <Send size={14} /> Ask Copilot
              </button>
            </div>
          </div>
        )}

        {/* ---------------- TAB 4: COMPLIANCE AUDIT TRAIL ---------------- */}
        {activeTab === 'audit' && (
          <div className="bg-white border-4 border-[#1A1A1A] p-6 shadow-[6px_6px_0px_#1A1A1A]">
            <div className="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-4 mb-6">
              <div>
                <h2 className="text-xl font-black uppercase text-[#1A1A1A] flex items-center gap-2">
                  <History size={20} className="text-[#0F4C81]" /> Compliance & Responsible AI Audit Log
                </h2>
                <p className="text-xs font-bold text-[#8A8A8A] mt-1">
                  Immutable event trail of ML Risk Evaluations and Authorized Human Officer Interventions
                </p>
              </div>
              <button onClick={() => selectedCaseId && fetchCaseDetail(selectedCaseId)} className="p-1.5 border border-[#1A1A1A]">
                <RefreshCw size={14} />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {auditLogs.length > 0 ? (
                auditLogs.map((log) => (
                  <div key={log.id} className="p-4 border-2 border-[#1A1A1A] bg-[#F9FAFB] flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase bg-[#1A1A1A] text-white px-2 py-0.5">
                        {log.event_type}
                      </span>
                      <span className="text-xs font-bold text-[#8A8A8A]">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-[#1A1A1A]">
                      Actor: <span className="text-[#0F4C81]">{log.actor}</span> · Action: <span>{log.action}</span>
                    </div>
                    {log.notes && (
                      <p className="text-xs text-[#4A4A4A] bg-white p-2 border border-gray-300">
                        {log.notes}
                      </p>
                    )}
                    {log.override_ml && (
                      <span className="text-[10px] font-black text-red-600 bg-red-50 p-1 border border-red-300">
                        ⚠️ Officer Overrode ML Prediction: {log.override_reason}
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-500 text-center py-6">Select a case to inspect its audit history.</p>
              )}
            </div>
          </div>
        )}

      </main>

      {/* 
        =======================================================================
        DECISION MODAL (Human-in-the-Loop Governance)
        =======================================================================
      */}
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

      {/* 
        =======================================================================
        NEW CASE EVALUATION MODAL
        =======================================================================
      */}
      {isNewCaseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-[#1A1A1A] max-w-xl w-full p-6 shadow-[8px_8px_0px_#0F4C81] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-3 mb-4">
              <h3 className="font-black text-base uppercase text-[#1A1A1A]">
                Evaluate New Customer Profile
              </h3>
              <button onClick={() => setIsNewCaseModalOpen(false)} className="font-black text-lg">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-bold">
              <div className="col-span-2">
                <label className="block text-gray-600 mb-1">Customer Full Name:</label>
                <input
                  type="text"
                  value={newCaseForm.name}
                  onChange={e => setNewCaseForm({ ...newCaseForm, name: e.target.value })}
                  className="w-full p-2 border-2 border-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-1">Monthly Income ($):</label>
                <input
                  type="number"
                  value={newCaseForm.monthly_income}
                  onChange={e => setNewCaseForm({ ...newCaseForm, monthly_income: Number(e.target.value) })}
                  className="w-full p-2 border-2 border-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-1">Monthly Expenses ($):</label>
                <input
                  type="number"
                  value={newCaseForm.monthly_expenses}
                  onChange={e => setNewCaseForm({ ...newCaseForm, monthly_expenses: Number(e.target.value) })}
                  className="w-full p-2 border-2 border-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-1">Existing Total Debt ($):</label>
                <input
                  type="number"
                  value={newCaseForm.existing_debt}
                  onChange={e => setNewCaseForm({ ...newCaseForm, existing_debt: Number(e.target.value) })}
                  className="w-full p-2 border-2 border-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-1">Credit Utilization (0.0 - 1.0):</label>
                <input
                  type="number"
                  step="0.01"
                  value={newCaseForm.credit_utilization}
                  onChange={e => setNewCaseForm({ ...newCaseForm, credit_utilization: Number(e.target.value) })}
                  className="w-full p-2 border-2 border-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-1">Recent Delinquencies (Count):</label>
                <input
                  type="number"
                  value={newCaseForm.recent_delinquencies}
                  onChange={e => setNewCaseForm({ ...newCaseForm, recent_delinquencies: Number(e.target.value) })}
                  className="w-full p-2 border-2 border-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-1">Savings Balance ($):</label>
                <input
                  type="number"
                  value={newCaseForm.savings_balance}
                  onChange={e => setNewCaseForm({ ...newCaseForm, savings_balance: Number(e.target.value) })}
                  className="w-full p-2 border-2 border-[#1A1A1A]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 mt-4 border-t-2 border-[#1A1A1A]">
              <button
                onClick={() => setIsNewCaseModalOpen(false)}
                className="px-4 py-2 border-2 border-[#1A1A1A] font-bold text-xs uppercase"
              >
                Cancel
              </button>
              <button
                onClick={handleEvaluateNewCase}
                disabled={loading}
                className="px-5 py-2 bg-[#0F4C81] text-white border-2 border-[#1A1A1A] font-black text-xs uppercase hover:bg-[#1A1A1A] cursor-pointer"
              >
                {loading ? 'Evaluating...' : 'Run ML & Grounded RAG Assessment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 
        =======================================================================
        POLICY CITATION DETAIL MODAL
        =======================================================================
      */}
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
              <span className="text-[#0F4C81]">Cross-Encoder Relevance Score: {selectedCitation.relevance_score}</span>
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
