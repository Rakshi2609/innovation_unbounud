"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { 
  Layers, RefreshCw, Search, Plus, Scale, TrendingDown, BookOpen, 
  ShieldCheck, AlertTriangle, UserCheck, CheckCircle2, Lock, Sparkles, 
  Activity, FileText, PhoneCall, PhoneOutgoing, Volume2, Globe, ArrowRight, ArrowLeft, Play, Info
} from 'lucide-react';

const API_BASE = "http://localhost:8000";

const formatINR = (val: number | undefined | null): string => {
  if (val === undefined || val === null || isNaN(Number(val))) return "₹0";
  return "₹" + Number(val).toLocaleString("en-IN");
};

interface TourStep {
  step: number;
  title: string;
  badge: string;
  badgeColor: string;
  description: string;
  whatNext: string;
  actionButtonText: string;
  narrativeSpeech: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    step: 1,
    title: "1. Telemetry & ML Risk Scoring",
    badge: "ML Inference",
    badgeColor: "bg-red-100 text-red-700 border-red-200",
    description: "Ingests continuous banking telemetry (DTI 46%, rolling cashflows, credit utilization 68%). LightGBM model flags 85% distress probability for Ramesh Kumar (CASE-2026-001).",
    whatNext: "Inspect the top SHAP risk factors, then proceed to Step 2 to query regulatory and restructuring policies.",
    actionButtonText: "Load CASE-2026-001",
    narrativeSpeech: "Step 1: Continuous telemetry ingestion and machine learning risk evaluation. The model detects early distress signals for borrower Ramesh Kumar with an eighty-five percent risk score."
  },
  {
    step: 2,
    title: "2. TheSuperRAG Policy Retrieval",
    badge: "RBI Grounded",
    badgeColor: "bg-blue-100 text-blue-700 border-blue-200",
    description: "Hybrid vector search in Qdrant retrieves exact regulatory clauses. Fetches 'Clause 4.2: Hardship Relief Framework' with 92% semantic similarity score.",
    whatNext: "Review the exact clause snippet below, then proceed to Step 3 to authorize a personalized workout plan.",
    actionButtonText: "View Clause 4.2 Snippet",
    narrativeSpeech: "Step 2: Grounded policy retrieval. The Super RAG retrieves Reserve Bank of India Hardship Relief Clause 4.2 to offer early proactive restructuring before default."
  },
  {
    step: 3,
    title: "3. Human Officer Decision & Override",
    badge: "Human-in-the-Loop",
    badgeColor: "bg-purple-100 text-purple-700 border-purple-200",
    description: "Officer Priya Nair (OFFICER-402) reviews LangGraph recommendations, selects a 36-month debt restructuring plan with 2.5% rate discount, and signs the authorization.",
    whatNext: "Review or submit the authorization modal, then proceed to Step 4 to initiate native-language voice outreach.",
    actionButtonText: "Open Decision Authorization",
    narrativeSpeech: "Step 3: Human in the loop governance. Bank Officer Priya Nair reviews the synthesized restructuring option and authorizes the intervention."
  },
  {
    step: 4,
    title: "4. Outbound Multilingual Twilio Call",
    badge: "Voice Copilot",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
    description: "Automated voice agent places an empathetic phone call via Twilio in the borrower's preferred native language (Hindi / Kannada / Tamil / English) to explain terms without intimidation.",
    whatNext: "Select preferred language, trigger the call to test the live Twilio gateway, then proceed to Step 5.",
    actionButtonText: "Focus Voice Dispatcher",
    narrativeSpeech: "Step 4: AI Voice Copilot dispatch. The system places an outbound voice call in the customer's native language to explain the approved restructuring terms."
  },
  {
    step: 5,
    title: "5. Immutable Audit Trail & Verification",
    badge: "Compliance Sealed",
    badgeColor: "bg-gray-900 text-white border-gray-700",
    description: "Every telemetry input, ML risk score, RAG citation, officer signature, and voice transcript is sealed with SHA-256 and committed to the immutable compliance audit ledger.",
    whatNext: "The case is fully resolved with zero PII exposure and complete regulatory transparency. You can view the full audit log in the Audit Dashboard.",
    actionButtonText: "View Cryptographic Ledger",
    narrativeSpeech: "Step 5: Cryptographic audit sealing. Every action is signed and permanently logged in accordance with banking compliance requirements."
  }
];

export default function TriagePage() {
  const [cases, setCases] = useState<any[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('CASE-2026-001');
  const [caseDetailsCache, setCaseDetailsCache] = useState<Record<string, any>>({});
  const [isFetchingList, setIsFetchingList] = useState(false);
  const [trackFilter, setTrackFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [userRole, setUserRole] = useState<'OFFICER' | 'CUSTOMER'>('OFFICER');

  // Tour State
  const [currentTourStep, setCurrentTourStep] = useState<number>(1);
  const [isTourActive, setIsTourActive] = useState<boolean>(true);
  const [isSpeakingTour, setIsSpeakingTour] = useState<boolean>(false);

  // Voice Call State
  const [callPhone, setCallPhone] = useState<string>('+919461284678');
  const [callLang, setCallLang] = useState<string>('hi');
  const [isCalling, setIsCalling] = useState<boolean>(false);
  const [callResult, setCallResult] = useState<any | null>(null);

  // Decision Modal State
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);
  const [selectedCitation, setSelectedCitation] = useState<any | null>(null);
  const [decisionType, setDecisionType] = useState<string>('RESTRUCTURE');
  const [officerName, setOfficerName] = useState('Officer Priya Nair');
  const [officerId, setOfficerId] = useState('OFFICER-402');
  const [actionTaken, setActionTaken] = useState('Approved 36-Month Term Debt Restructuring Plan with 2.5% rate discount');
  const [decisionNotes, setDecisionNotes] = useState('Customer proactively accepted workout terms prior to 60-day default window.');
  const [overrideML, setOverrideML] = useState(false);
  const [overrideReason, setOverrideReason] = useState('');

  const speakTourNarrative = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.onstart = () => setIsSpeakingTour(true);
      utterance.onend = () => setIsSpeakingTour(false);
      utterance.onerror = () => setIsSpeakingTour(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleTourStepChange = (stepNum: number) => {
    setCurrentTourStep(stepNum);
    const stepObj = TOUR_STEPS.find(s => s.step === stepNum);
    if (stepObj) {
      speakTourNarrative(stepObj.narrativeSpeech);
    }
    // Auto perform contextual step highlight
    executeStepAction(stepNum);
  };

  const executeStepAction = (stepNum: number) => {
    if (stepNum === 1) {
      handleSelectCase('CASE-2026-001');
      window.scrollTo({ top: 200, behavior: 'smooth' });
    } else if (stepNum === 2) {
      const cit = currentDetail?.rag_citations?.[0] || {
        clause: "Clause 4.2",
        policy_name: "Proactive Hardship & Debt Restructuring Standard",
        section: "Section 4 - Early Warning Workouts",
        source_file: "RBI_Distress_Intervention_Framework_2026.md",
        snippet: "For borrowers exhibiting early distress signals (DTI > 45% or rolling 30-day deficit), financial institutions must offer structured workout terms prior to non-performing asset classification.",
        relevance_score: 0.92
      };
      setSelectedCitation(cit);
    } else if (stepNum === 3) {
      setIsDecisionModalOpen(true);
    } else if (stepNum === 4) {
      setIsDecisionModalOpen(false);
      setSelectedCitation(null);
      const callCard = document.getElementById('voice-copilot-card');
      if (callCard) {
        callCard.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (stepNum === 5) {
      setIsDecisionModalOpen(false);
      setSelectedCitation(null);
      const ledgerCard = document.getElementById('audit-ledger-section');
      if (ledgerCard) {
        ledgerCard.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const fetchCaseDetail = useCallback(async (id: string) => {
    if (!id) return;
    try {
      const res = await fetch(`${API_BASE}/api/v1/cases/${id}`);
      if (res.ok) {
        const data = await res.json();
        setCaseDetailsCache(prev => ({ ...prev, [id]: data }));
      }
    } catch (e) {
      console.warn(`Failed fetching case detail for ${id}:`, e);
    }
  }, []);

  const fetchCases = useCallback(async () => {
    setIsFetchingList(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/cases`);
      if (res.ok) {
        const data = await res.json();
        const list = data.cases || [];
        setCases(list);
        if (list.length > 0) {
          const targetId = list[0].case_id;
          setSelectedCaseId(targetId);
          fetchCaseDetail(targetId);
        }
      }
    } catch (e) {
      console.warn("Failed fetching cases list:", e);
    } finally {
      setIsFetchingList(false);
    }
  }, [fetchCaseDetail]);

  useEffect(() => {
    fetchCases();
  }, []);

  const handleSelectCase = async (id: string) => {
    setSelectedCaseId(id);
    if (!caseDetailsCache[id]) {
      fetchCaseDetail(id);
    }
  };

  const currentDetail = useMemo(() => {
    if (!selectedCaseId) return null;
    return caseDetailsCache[selectedCaseId] || null;
  }, [caseDetailsCache, selectedCaseId]);

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
        await fetchCaseDetail(selectedCaseId);
        await fetchCases();
      }
    } catch (e) {
      console.error("Failed submitting officer decision:", e);
    }
  };

  const filteredCases = useMemo(() => {
    return cases.filter(c => {
      const matchesTrack = trackFilter === 'all' || c.track_type === trackFilter;
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q || 
                            (c.customer_name && c.customer_name.toLowerCase().includes(q)) || 
                            (c.case_id && c.case_id.toLowerCase().includes(q)) ||
                            (c.customer_id && c.customer_id.toLowerCase().includes(q));
      return matchesTrack && matchesSearch;
    });
  }, [cases, trackFilter, searchQuery]);

  const metrics = currentDetail?.customer_profile?.financial_metrics || currentDetail?.customer?.financial_metrics;
  const profile = currentDetail?.customer_profile || currentDetail?.customer;
  const activeStep = TOUR_STEPS.find(s => s.step === currentTourStep) || TOUR_STEPS[0];

  return (
    <div className="w-full bg-[#F9FAFB] min-h-screen">
      
      {/* Top Controls Toolbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sticky top-0 z-40">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
            <h1 className="text-xl font-black uppercase tracking-tight text-gray-900">Case Triage Queue & Copilot</h1>
          </div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-widest mt-0.5">Evidence-Grounded AI Copilot for Bank Officers</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setIsTourActive(!isTourActive)}
            className={`px-3 py-1.5 rounded text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 border ${
              isTourActive ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-100 text-gray-600 border-gray-200'
            }`}
          >
            <Sparkles size={13} /> {isTourActive ? 'Hide Guided Tour' : 'Show Guided Tour'}
          </button>

          <div className="flex items-center bg-gray-100 p-1 border border-gray-200 rounded">
            <button
              onClick={() => setUserRole('OFFICER')}
              className={`px-3 py-1 text-xs font-black uppercase tracking-wider rounded-sm transition-all ${
                userRole === 'OFFICER' ? 'bg-white text-gray-900 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Officer View
            </button>
            <button
              onClick={() => setUserRole('CUSTOMER')}
              className={`px-3 py-1 text-xs font-black uppercase tracking-wider rounded-sm transition-all ${
                userRole === 'CUSTOMER' ? 'bg-white text-gray-900 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Customer View
            </button>
          </div>
        </div>
      </div>

      {/* 🚀 INTERACTIVE 5-STEP GUIDED DEMO TOUR HUD */}
      {isTourActive && (
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white border-b-2 border-blue-600 px-6 py-5 shadow-lg">
          <div className="max-w-[1600px] mx-auto">
            {/* Header & Step Pills */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 rounded bg-blue-500 text-white font-black text-[10px] uppercase tracking-widest">
                  Live Walkthrough
                </span>
                <span className="text-xs font-black tracking-widest uppercase text-slate-300">
                  The Golden Path: Step {activeStep.step} of 5
                </span>
              </div>

              {/* Step Navigation Pills */}
              <div className="flex flex-wrap items-center gap-2">
                {TOUR_STEPS.map(s => {
                  const isCurrent = s.step === currentTourStep;
                  const isPassed = s.step < currentTourStep;
                  return (
                    <button
                      key={s.step}
                      onClick={() => handleTourStepChange(s.step)}
                      className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                        isCurrent 
                          ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-400' 
                          : isPassed 
                            ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700' 
                            : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'
                      }`}
                    >
                      <span>{s.step}.</span>
                      <span className="hidden sm:inline">{s.title.split('. ')[1]}</span>
                      {isPassed && <CheckCircle2 size={12} className="text-emerald-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step Body & Next Action Callout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4 items-center">
              {/* Left Details */}
              <div className="lg:col-span-8 space-y-2">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-black text-white tracking-tight">
                    {activeStep.title}
                  </h2>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${activeStep.badgeColor}`}>
                    {activeStep.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-medium leading-relaxed">
                  {activeStep.description}
                </p>
                <div className="flex items-start gap-2 bg-slate-800/80 border border-slate-700 p-2.5 rounded text-xs">
                  <Info size={14} className="text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-blue-300 uppercase text-[10px] tracking-wider block">What to do next:</span>
                    <span className="text-slate-200">{activeStep.whatNext}</span>
                  </div>
                </div>
              </div>

              {/* Right Action Buttons */}
              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-2.5 justify-end">
                <button
                  onClick={() => executeStepAction(activeStep.step)}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-widest px-4 py-2.5 rounded shadow flex items-center justify-center gap-2 transition-all"
                >
                  <Play size={14} /> {activeStep.actionButtonText}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    disabled={currentTourStep <= 1}
                    onClick={() => handleTourStepChange(currentTourStep - 1)}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 font-bold text-xs uppercase tracking-wider py-2 rounded border border-slate-700 flex items-center justify-center gap-1.5 transition-all"
                  >
                    <ArrowLeft size={13} /> Prev
                  </button>

                  <button
                    onClick={() => speakTourNarrative(activeStep.narrativeSpeech)}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 text-xs font-bold flex items-center gap-1"
                    title="Read Step Aloud"
                  >
                    <Volume2 size={13} className={isSpeakingTour ? "text-blue-400 animate-pulse" : ""} />
                  </button>

                  <button
                    disabled={currentTourStep >= 5}
                    onClick={() => handleTourStepChange(currentTourStep + 1)}
                    className="flex-1 bg-white hover:bg-slate-100 disabled:opacity-40 text-slate-900 font-black text-xs uppercase tracking-wider py-2 rounded shadow flex items-center justify-center gap-1.5 transition-all"
                  >
                    Next <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-[1600px] mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Triage Feed */}
        <div className="lg:col-span-3 flex flex-col gap-4 bg-white border border-gray-200 rounded h-[40vh] lg:h-[calc(100vh-120px)] min-h-[300px] overflow-hidden shadow-sm">
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-black text-xs uppercase tracking-widest text-gray-900 flex items-center gap-2">
                <Layers size={14} className="text-gray-400" /> Queue ({filteredCases.length})
              </h2>
              <button 
                onClick={fetchCases} 
                disabled={isFetchingList}
                className="text-gray-400 hover:text-gray-900 transition-colors"
              >
                <RefreshCw size={14} className={isFetchingList ? "animate-spin" : ""} />
              </button>
            </div>
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search case or customer..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded text-xs font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredCases.map(c => {
              const isSelected = selectedCaseId === c.case_id;
              
              return (
                <div
                  key={c.case_id}
                  onClick={() => handleSelectCase(c.case_id)}
                  className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                    isSelected ? 'bg-blue-50/50 border-l-4 border-l-blue-600' : 'bg-white hover:bg-gray-50 border-l-4 border-l-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                      {c.case_id}
                    </span>
                    <span className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-sm ${
                      c.risk_class === 'CRITICAL' ? 'bg-red-100 text-red-700' : 
                      c.risk_class === 'HIGH' ? 'bg-orange-100 text-orange-700' : 
                      'bg-green-100 text-green-700'
                    }`}>
                      {c.risk_class}
                    </span>
                  </div>
                  <h3 className={`font-black text-sm uppercase tracking-tight ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                    {c.customer_name}
                  </h3>
                  <div className="text-[10px] font-medium text-gray-500 uppercase tracking-widest mt-1">
                    {c.status}
                  </div>
                </div>
              );
            })}
            {filteredCases.length === 0 && (
              <div className="p-6 text-left text-xs font-medium text-gray-400 uppercase tracking-widest">
                No cases found.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: High-Density Details */}
        <div className="lg:col-span-9 flex flex-col gap-6">
          {currentDetail ? (
            <div className="space-y-6">
              
              {/* Profile Bar */}
              <div className="bg-white border border-gray-200 rounded shadow-sm p-6 flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-sm">
                      {currentDetail.case_id}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                      {currentDetail.status}
                    </span>
                  </div>
                  <h2 className="text-3xl font-black uppercase tracking-tight text-gray-900 mb-2">
                    {currentDetail.customer_name}
                  </h2>
                  <div className="flex items-center gap-4 text-xs font-medium text-gray-500 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><Lock size={12}/> {currentDetail.customer_id}</span>
                    <span>|</span>
                    <span>{profile?.occupation || 'Salaried'}</span>
                    <span>|</span>
                    <span>{profile?.employment_type || 'Full-Time'}</span>
                  </div>
                </div>

                {userRole === 'OFFICER' ? (
                  <button
                    onClick={() => setIsDecisionModalOpen(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm whitespace-nowrap"
                  >
                    <Scale size={14} /> Authorize Action
                  </button>
                ) : (
                  <Link
                    href="/grievance"
                    className="bg-white border border-gray-300 text-gray-900 px-6 py-3 rounded font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-colors whitespace-nowrap"
                  >
                    Request Review
                  </Link>
                )}
              </div>

              {/* Financial Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Monthly Income", val: formatINR(metrics?.monthly_income) },
                  { label: "Monthly Expenses", val: formatINR(metrics?.monthly_expenses) },
                  { label: "Credit Utilization", val: `${Math.round((metrics?.credit_utilization || 0) * 100)}%`, color: "text-red-600" },
                  { label: "Total Debt", val: formatINR(metrics?.existing_debt) }
                ].map((m, i) => (
                  <div key={i} className="bg-white border border-gray-200 p-4 rounded shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{m.label}</p>
                    <p className={`text-xl font-black uppercase tracking-tight ${m.color || 'text-gray-900'}`}>{m.val}</p>
                  </div>
                ))}
              </div>

              {/* AI Analysis Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* ML Risk */}
                <div className="bg-white border border-gray-200 rounded shadow-sm p-6 flex flex-col h-[400px]">
                  <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-4">
                    <h3 className="font-black text-sm uppercase tracking-tight text-gray-900 flex items-center gap-2">
                      <Activity size={16} className="text-gray-400" /> Statistical ML Risk (Step 1)
                    </h3>
                    <span className="text-[10px] font-black uppercase tracking-widest bg-gray-100 text-gray-600 px-2 py-1 rounded-sm">
                      {currentDetail.ml_prediction?.is_fallback ? 'Fallback Engine' : 'Online Engine'}
                    </span>
                  </div>
                  <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                    {currentDetail.ml_prediction?.top_factors?.map((factor: any, idx: number) => (
                      <div key={idx} className="border border-gray-100 bg-gray-50 rounded p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-black uppercase tracking-tight text-gray-900">
                            {factor.factor?.replace(/_/g, ' ')}
                          </span>
                          <span className="text-[10px] font-black text-gray-500 bg-white border border-gray-200 px-1.5 py-0.5 rounded-sm">
                            Wt: {factor.weight}
                          </span>
                        </div>
                        <p className="text-xs font-medium text-gray-600 leading-relaxed">
                          {factor.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* RAG Evidence */}
                <div className="bg-white border border-gray-200 rounded shadow-sm p-6 flex flex-col h-[400px]">
                  <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-4">
                    <h3 className="font-black text-sm uppercase tracking-tight text-gray-900 flex items-center gap-2">
                      <BookOpen size={16} className="text-gray-400" /> TheSuperRAG Evidence (Step 2)
                    </h3>
                    <span className="text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-700 px-2 py-1 rounded-sm border border-blue-200">
                      {currentDetail.rag_citations?.length || 0} Citations
                    </span>
                  </div>
                  <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                    {currentDetail.rag_citations?.map((citation: any, i: number) => (
                      <div
                        key={i}
                        onClick={() => setSelectedCitation(citation)}
                        className="border border-gray-200 bg-white rounded p-3 cursor-pointer hover:border-blue-400 hover:bg-blue-50/20 transition-all shadow-sm"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-black uppercase tracking-widest text-blue-800 bg-blue-100 px-1.5 py-0.5 rounded-sm">
                            {citation.clause}
                          </span>
                          <span className="text-[10px] font-bold text-gray-500">Relevance: {citation.relevance_score}</span>
                        </div>
                        <p className="text-xs font-black uppercase tracking-tight text-gray-900 mb-1 truncate">{citation.policy_name}</p>
                        <p className="text-xs text-gray-600 font-medium italic line-clamp-2 border-l-2 border-blue-400 pl-2">
                          "{citation.snippet}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* LangGraph Reasoning */}
              <div className="bg-white border border-gray-200 rounded shadow-sm p-6">
                <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-4">
                  <h3 className="font-black text-sm uppercase tracking-tight text-gray-900 flex items-center gap-2">
                    <Sparkles size={16} className="text-gray-400" /> Synthesized Recommendation (Step 3)
                  </h3>
                  <span className="text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-700 border border-blue-100 px-2 py-1 rounded-sm">
                    Confidence: {Math.round((currentDetail.confidence_score || currentDetail.ml_prediction?.confidence || 0.89) * 100)}%
                  </span>
                </div>
                
                <div className="bg-gray-50 border border-gray-200 rounded p-4 mb-6">
                  <p className="text-sm font-medium leading-relaxed text-gray-900 mb-2">
                    {currentDetail.explanation?.summary}
                  </p>
                  <p className="text-xs font-black uppercase tracking-widest text-blue-700">
                    {currentDetail.explanation?.policy_alignment}
                  </p>
                </div>

                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Proposed Interventions</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentDetail.explanation?.recommendations?.map((rec: any, idx: number) => (
                    <div key={idx} className="border border-gray-200 bg-white rounded p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 size={16} className="text-gray-900" />
                        <strong className="text-xs font-black uppercase tracking-tight text-gray-900">{rec.title}</strong>
                      </div>
                      <p className="text-xs text-gray-600 font-medium mb-3">{rec.rationale}</p>
                      
                      {rec.eligible_programs?.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {rec.eligible_programs.map((prog: string, pIdx: number) => (
                            <span key={pIdx} className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-sm bg-gray-100 text-gray-600">
                              {prog}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Multilingual Voice Copilot Dispatch Card (Step 4) */}
              <div id="voice-copilot-card" className="bg-white border-2 border-gray-900 rounded shadow-md p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-gray-200 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded bg-gray-900 text-white flex items-center justify-center">
                      <PhoneCall size={16} />
                    </div>
                    <div>
                      <h3 className="font-black text-sm uppercase tracking-tight text-gray-900 flex items-center gap-2">
                        AI Multilingual Voice Copilot (Step 4)
                        <span className="text-[9px] font-black uppercase tracking-widest bg-green-100 text-green-800 px-1.5 py-0.5 rounded">
                          Twilio Live
                        </span>
                      </h3>
                      <p className="text-xs text-gray-500 font-medium">
                        Direct empathetic outbound phone call in customer's preferred language.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Globe size={14} className="text-gray-400" />
                    <select
                      value={callLang}
                      onChange={e => setCallLang(e.target.value)}
                      className="text-xs font-bold uppercase bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="en">English (Indian Voice)</option>
                      <option value="hi">हिन्दी (Hindi)</option>
                      <option value="kn">ಕನ್ನಡ (Kannada)</option>
                      <option value="mr">मराठी (Marathi)</option>
                      <option value="ta">தமிழ் (Tamil)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">
                      Customer Contact Number:
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={callPhone}
                        onChange={e => setCallPhone(e.target.value)}
                        placeholder="+919461284678"
                        className="w-full text-xs font-mono font-bold p-2.5 border border-gray-300 rounded bg-gray-50 text-gray-900"
                      />
                    </div>
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={async () => {
                        if (!currentDetail) return;
                        setIsCalling(true);
                        setCallResult(null);
                        try {
                          const res = await fetch(`${API_BASE}/api/v1/cases/${currentDetail.case_id}/call`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              phone_number: callPhone,
                              language: callLang
                            })
                          });
                          const data = await res.json();
                          setCallResult(data);
                        } catch (e: any) {
                          setCallResult({ success: false, error: e.message || 'Call dispatch failed' });
                        } finally {
                          setIsCalling(false);
                        }
                      }}
                      disabled={isCalling}
                      className="w-full bg-gray-900 hover:bg-black text-white px-4 py-2.5 rounded font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow transition-all disabled:opacity-50"
                    >
                      {isCalling ? (
                        <>
                          <Activity size={14} className="animate-spin text-blue-400" /> Connecting Twilio...
                        </>
                      ) : (
                        <>
                          <PhoneOutgoing size={14} /> Call Customer Now
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Call Dispatch Status / Feedback */}
                {callResult && (
                  <div className={`p-3.5 rounded border text-xs font-medium mt-3 ${
                    callResult.success ? 'bg-green-50 border-green-200 text-green-900' : 'bg-red-50 border-red-200 text-red-900'
                  }`}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-black uppercase tracking-widest text-[10px]">
                        {callResult.success ? '✅ Call Dispatched via Twilio' : '❌ Dispatch Error'}
                      </span>
                      {callResult.call_sid && (
                        <span className="font-mono text-[10px] text-gray-500">
                          SID: {callResult.call_sid}
                        </span>
                      )}
                    </div>
                    {callResult.script_spoken && (
                      <p className="italic text-gray-700 bg-white/80 p-2 rounded border border-green-100 mt-1">
                        "{callResult.script_spoken}"
                      </p>
                    )}
                    {callResult.error && (
                      <p className="font-bold text-red-700">{callResult.error}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Step 5: Cryptographic Audit Ledger Card */}
              <div id="audit-ledger-section" className="bg-slate-900 text-white rounded border border-slate-800 p-6 shadow-md">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={18} className="text-emerald-400" />
                    <div>
                      <h3 className="font-black text-sm uppercase tracking-tight text-white">
                        Cryptographic Audit Trail (Step 5)
                      </h3>
                      <p className="text-[11px] text-slate-400">Zero-Retention PII Governance & Immutable Signing</p>
                    </div>
                  </div>
                  <Link href="/audit">
                    <button className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded border border-slate-700 flex items-center gap-1.5">
                      Open Audit Dashboard <ArrowRight size={13} />
                    </button>
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                  <div className="bg-slate-950 p-3 rounded border border-slate-800">
                    <span className="text-slate-500 text-[10px] uppercase tracking-wider block mb-1">Ledger Entry Hash</span>
                    <span className="text-blue-400 break-all text-[11px]">sha256:7f3a9e2d...0418c8b</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded border border-slate-800">
                    <span className="text-slate-500 text-[10px] uppercase tracking-wider block mb-1">Authorized Officer</span>
                    <span className="text-emerald-400 text-[11px]">OFFICER-402 (Priya Nair)</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded border border-slate-800">
                    <span className="text-slate-500 text-[10px] uppercase tracking-wider block mb-1">Compliance Status</span>
                    <span className="text-emerald-400 font-bold text-[11px]">✅ RBI Hardship Clause 4.2 Verified</span>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-12 bg-transparent text-gray-400 border-2 border-dashed border-gray-200 rounded">
              {cases.length === 0 && !isFetchingList ? (
                <>
                  <ShieldCheck size={32} className="mb-4 text-gray-300" />
                  <p className="font-black text-xs uppercase tracking-widest text-gray-500">Queue is empty</p>
                  <p className="font-medium text-xs text-gray-400 mt-2">No active cases require intervention.</p>
                </>
              ) : (
                <p className="font-black text-xs uppercase tracking-widest flex items-center gap-2">
                  <Activity size={14} className="animate-spin text-blue-500" /> Fetching Intelligence...
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Decision Modal */}
      {isDecisionModalOpen && currentDetail && (
        <div className="fixed inset-0 z-50 bg-gray-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded border border-gray-200 shadow-xl max-w-lg w-full">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <h3 className="font-black text-xs uppercase tracking-widest text-gray-900">
                Authorize Action: {currentDetail.customer_name}
              </h3>
              <button onClick={() => setIsDecisionModalOpen(false)} className="text-gray-400 hover:text-gray-900">✕</button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5">Decision Action</label>
                <select
                  value={decisionType}
                  onChange={e => setDecisionType(e.target.value)}
                  className="w-full p-2.5 bg-white border border-gray-200 rounded text-xs font-bold text-gray-900 focus:outline-none focus:border-blue-500"
                >
                  <option value="RESTRUCTURE">Approve Debt Restructuring (36-mo workout)</option>
                  <option value="APPROVE">Approve Standard Facility</option>
                  <option value="REQUEST_INFO">Require Additional Info</option>
                  <option value="FLAG_FRAUD">Flag Fraud Anomaly</option>
                  <option value="DECLINE">Decline Request</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5">Officer Name</label>
                  <input
                    type="text"
                    value={officerName}
                    onChange={e => setOfficerName(e.target.value)}
                    className="w-full p-2.5 bg-white border border-gray-200 rounded text-xs font-medium text-gray-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5">Officer ID</label>
                  <input
                    type="text"
                    value={officerId}
                    onChange={e => setOfficerId(e.target.value)}
                    className="w-full p-2.5 bg-white border border-gray-200 rounded text-xs font-medium text-gray-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5">Action Notes</label>
                <textarea
                  rows={2}
                  value={decisionNotes}
                  onChange={e => setDecisionNotes(e.target.value)}
                  className="w-full p-2.5 bg-white border border-gray-200 rounded text-xs font-medium text-gray-900 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="p-4 bg-gray-50 border border-gray-200 rounded">
                <label className="flex items-center gap-2 cursor-pointer mb-1">
                  <input
                    type="checkbox"
                    checked={overrideML}
                    onChange={e => setOverrideML(e.target.checked)}
                    className="w-3 h-3 text-blue-600 rounded-sm border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">Override ML Finding</span>
                </label>
                {overrideML && (
                  <input
                    type="text"
                    placeholder="Rationale for override..."
                    value={overrideReason}
                    onChange={e => setOverrideReason(e.target.value)}
                    className="w-full p-2 mt-2 bg-white border border-gray-200 rounded text-xs focus:outline-none focus:border-blue-500"
                  />
                )}
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setIsDecisionModalOpen(false)}
                className="px-4 py-2 bg-white border border-gray-200 rounded text-xs font-black uppercase tracking-widest text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitDecision}
                className="px-6 py-2 bg-blue-600 text-white rounded text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-colors shadow-sm"
              >
                Sign & Authorize
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Citation Detail Modal */}
      {selectedCitation && (
        <div className="fixed inset-0 z-50 bg-gray-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded border border-gray-200 shadow-xl max-w-lg w-full">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <span className="text-[10px] font-black uppercase tracking-widest bg-blue-100 text-blue-900 px-2 py-1 rounded-sm border border-blue-200">
                {selectedCitation.clause}
              </span>
              <button onClick={() => setSelectedCitation(null)} className="text-gray-400 hover:text-gray-900">✕</button>
            </div>

            <div className="p-6">
              <h3 className="font-black text-sm uppercase tracking-tight text-gray-900 mb-2">
                {selectedCitation.policy_name}
              </h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">
                Section: {selectedCitation.section} | File: {selectedCitation.source_file}
              </p>

              <div className="p-4 bg-blue-50/50 border border-blue-200 rounded text-xs leading-relaxed text-gray-900 italic mb-6">
                "{selectedCitation.snippet}"
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-700">Relevance Match: {selectedCitation.relevance_score}</span>
                <button
                  onClick={() => setSelectedCitation(null)}
                  className="px-6 py-2 bg-gray-900 text-white font-black text-xs uppercase tracking-widest rounded hover:bg-gray-800 transition-colors"
                >
                  Close Citation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
