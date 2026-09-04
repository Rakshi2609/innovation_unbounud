"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, RefreshCw, FileText, CheckCircle2, Shield, AlertCircle, 
  PlusCircle, Upload, Phone, Eye, Trash2, X, Sparkles, Volume2, 
  FileCheck, Layers, ArrowRight, Check
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface PolicyDetail {
  filename: string;
  title: string;
  size_kb: number;
  chunks_count: number;
  preview: string;
  is_custom: boolean;
}

const TEMPLATES = [
  {
    name: "🌾 Kisan Agricultural Relief & Moratorium 2026",
    title: "Kisan Agricultural Relief & Climate Moratorium Guidelines",
    category: "Hardship & Restructuring",
    content: `### Clause 1.1 — Seasonal Crop Distress Moratorium
Agricultural and allied borrowers facing documented weather anomalies, delayed monsoon, or crop loss are granted an immediate 6-month principal and interest moratorium with zero compounding penalty.

### Clause 1.2 — Concessional Restructuring Terms
Upon completion of the moratorium, outstanding dues shall be re-amortized over an extended 48-month horizon at a concessional interest rate not exceeding 6.5% per annum.

### Clause 1.3 — Collateral Protection
No recovery proceedings or adverse CIBIL reporting shall be initiated during the restructuring evaluation window.`
  },
  {
    name: "🛡️ MSME Emergency Liquidity & Credit Line SOP",
    title: "MSME Emergency Working Capital & Distress SOP",
    category: "Lending Underwriting",
    content: `### Clause 2.1 — Standby Liquidity Support
Micro and Small enterprises maintaining a minimum 12-month clean GST turnover history are eligible for a 20% emergency top-up credit facility without additional collateral.

### Clause 2.2 — Fast-Track Underwriting
Applications with FOIR under 60% and zero willful defaults shall receive digital sanction within 4 hours via automated cashflow assessment.

### Clause 2.3 — Restructuring Workout Framework
Distressed enterprises experiencing supply chain disruption may restructure existing term loans for up to 36 additional months.`
  },
  {
    name: "🔒 Instant Digital Fraud & Account Protection Protocol",
    title: "Real-Time Digital Banking Fraud Defense SOP",
    category: "Fraud Prevention",
    content: `### Clause 3.1 — Automated Account Shield
When transaction velocity or geographic geolocation shifts trigger an anomaly score above 0.70, immediate stepping-up of authentication and temporary withdrawal holds shall be enacted.

### Clause 3.2 — Customer Reassurance & Resolution
The customer shall be contacted via AI Voice Copilot within 180 seconds to verify transactions and offer instant card reissuance or credential recovery.`
  }
];

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<PolicyDetail[]>([]);
  const [totalChunks, setTotalChunks] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);

  // View Doc
  const [activeDoc, setActiveDoc] = useState<{ filename: string; title: string; content: string } | null>(null);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Hardship & Restructuring');
  const [newContent, setNewContent] = useState('');
  const [creating, setCreating] = useState(false);

  // File Upload State
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Voice Call State
  const [callPhone, setCallPhone] = useState('+919461284678');
  const [callLang, setCallLang] = useState('hi');
  const [selectedPolicyForCall, setSelectedPolicyForCall] = useState<PolicyDetail | null>(null);
  const [calling, setCalling] = useState(false);
  const [callStatus, setCallStatus] = useState('');

  const fetchPolicies = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/v1/documents`);
      if (res.ok) {
        const data = await res.json();
        if (data.details) {
          setPolicies(data.details);
        } else if (data.documents) {
          setPolicies(data.documents.map((doc: string) => ({
            filename: doc,
            title: doc.replace(/_/g, ' ').replace('.md', '').toUpperCase(),
            size_kb: 4.2,
            chunks_count: 45,
            preview: '',
            is_custom: !doc.startsWith('hardship_') && !doc.startsWith('lending_')
          })));
        }
        setTotalChunks(data.total_chunks || 201);
      } else {
        setError(`Failed to fetch policies (HTTP ${res.status}).`);
      }
    } catch (e) {
      setError(`Cannot reach backend at ${API_BASE}. Ensure server is running on port 8000.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  const handleCreatePolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      setError('Please provide a valid policy title and content.');
      return;
    }

    setCreating(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/v1/documents/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle.trim(),
          category: newCategory,
          content: newContent.trim()
        })
      });

      if (res.ok) {
        const data = await res.json();
        setSuccessMsg(`✓ ${data.message || 'Policy created and indexed successfully!'}`);
        setShowCreateModal(false);
        setNewTitle('');
        setNewContent('');
        await fetchPolicies();
      } else {
        const errData = await res.json();
        setError(errData.detail || 'Failed to create policy.');
      }
    } catch (e) {
      setError('Error communicating with backend server.');
    } finally {
      setCreating(false);
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      setError('Please select a file to upload.');
      return;
    }

    setUploading(true);
    setError('');
    const formData = new FormData();
    formData.append('file', uploadFile);

    try {
      const res = await fetch(`${API_BASE}/api/v1/documents/upload`, {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        setSuccessMsg(`✓ Successfully uploaded and indexed '${data.filename}' (${data.chunks_indexed} chunks)!`);
        setShowUploadModal(false);
        setUploadFile(null);
        await fetchPolicies();
      } else {
        const err = await res.json();
        setError(err.detail || 'Upload failed.');
      }
    } catch (e) {
      setError('Error uploading file to server.');
    } finally {
      setUploading(false);
    }
  };

  const handleViewPolicy = async (filename: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/documents/${filename}`);
      if (res.ok) {
        const data = await res.json();
        setActiveDoc(data);
        setShowViewModal(true);
      }
    } catch (e) {
      setError('Failed reading document content.');
    }
  };

  const handleDeletePolicy = async (filename: string) => {
    if (!confirm(`Are you sure you want to delete '${filename}'?`)) return;
    try {
      const res = await fetch(`${API_BASE}/api/v1/documents/${filename}`, { method: 'DELETE' });
      if (res.ok) {
        setSuccessMsg(`✓ Deleted '${filename}' and re-indexed knowledge base.`);
        await fetchPolicies();
      }
    } catch (e) {
      setError('Failed deleting policy.');
    }
  };

  const handleVoiceCall = async () => {
    setCalling(true);
    setCallStatus('');
    try {
      const policyName = selectedPolicyForCall ? selectedPolicyForCall.title : "Institutional Banking Policy";
      
      let customScript = "";
      if (callLang === "hi") {
        customScript = `नमस्ते! मैं आपके बैंक से AI फाइनेंशियल सेफ्टी कोपायलट बोल रहा हूँ। हमारी नई बैंक पॉलिसी '${policyName}' अब सक्रिय है। क्या आपके पास इस पॉलिसी, इसकी ब्याज छूट या पात्रता के बारे में कोई सवाल है? कृपया बोलकर बताएं, मैं सुन रहा हूँ।`;
      } else if (callLang === "kn") {
        customScript = `ನಮಸ್ಕಾರ! ನಿಮ್ಮ ಬ್ಯಾಂಕ್‌ನ AI ಫೈನಾನ್ಷಿಯಲ್ ಕೋಪೈಲಟ್ ಮಾತನಾಡುತ್ತಿದ್ದೇನೆ. ನಮ್ಮ ಹೊಸ ಪಾಲಿಸಿ '${policyName}' ಕುರಿತು ನಿಮಗೆ ಯಾವುದೇ ಪ್ರಶ್ನೆಗಳಿವೆಯೇ? ದಯವಿಟ್ಟು ಮಾತನಾಡಿ ತಿಳಿಸಿ.`;
      } else {
        customScript = `Hello! This is your AI Financial Safety Copilot. Our institutional policy '${policyName}' is currently in effect. Do you have any questions regarding this policy's terms or relief options? Please speak after the tone, I am listening.`;
      }

      const res = await fetch(`${API_BASE}/api/v1/cases/voice/direct-call`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone_number: callPhone,
          language: callLang,
          custom_message: customScript
        })
      });

      const data = await res.json();
      if (data.success) {
        setCallStatus(`✓ Phone call successfully dialed to ${callPhone}! (Call SID: ${data.call_sid})`);
      } else {
        setCallStatus(`✕ Call failed: ${data.error}`);
      }
    } catch (e) {
      setCallStatus('✕ Connection error dialing phone call.');
    } finally {
      setCalling(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Top Banner */}
      <div className="bg-white border-2 border-[var(--border-strong)] p-6 shadow-md mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b-2 border-[var(--border-strong)] pb-5 mb-6">
          <div>
            <h1 className="text-xl font-black uppercase text-[var(--text-primary)] flex items-center gap-2">
              <BookOpen size={22} className="text-[var(--accent)]" /> Institutional Policy Knowledge Base & Voice RAG
            </h1>
            <p className="text-xs font-bold text-[#8A8A8A] mt-1">
              Live Vector Store · Clause-Level Semantic Chunking · Real-Time Multilingual Twilio Voice Explanations
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-3 py-2 bg-[var(--accent)] text-white font-black text-xs uppercase flex items-center gap-1.5 shadow-sm hover:opacity-90 cursor-pointer"
            >
              <PlusCircle size={15} /> Create Policy
            </button>

            <button
              onClick={() => setShowUploadModal(true)}
              className="px-3 py-2 bg-blue-900 text-white font-black text-xs uppercase flex items-center gap-1.5 shadow-sm hover:opacity-90 cursor-pointer"
            >
              <Upload size={15} /> Upload Doc
            </button>

            <button
              onClick={() => {
                setSelectedPolicyForCall(null);
                setShowCallModal(true);
              }}
              className="px-3 py-2 bg-emerald-700 text-white font-black text-xs uppercase flex items-center gap-1.5 shadow-sm hover:opacity-90 cursor-pointer"
            >
              <Phone size={15} /> Voice Copilot Call
            </button>

            <button
              onClick={fetchPolicies}
              className="p-2 border-2 border-[var(--border-strong)] hover:bg-gray-100 flex items-center gap-1.5 text-xs font-bold cursor-pointer"
              title="Refresh Policy Store"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="p-3 bg-gray-50 border-2 border-[var(--border-strong)]">
            <span className="text-[10px] font-black uppercase text-gray-500 block">Total Policies</span>
            <span className="text-xl font-black text-[var(--text-primary)]">{policies.length}</span>
          </div>
          <div className="p-3 bg-gray-50 border-2 border-[var(--border-strong)]">
            <span className="text-[10px] font-black uppercase text-gray-500 block">Semantic Chunks</span>
            <span className="text-xl font-black text-blue-800">{totalChunks || policies.reduce((acc, p) => acc + (p.chunks_count || 1), 0)}</span>
          </div>
          <div className="p-3 bg-gray-50 border-2 border-[var(--border-strong)]">
            <span className="text-[10px] font-black uppercase text-gray-500 block">RAG Retrieval Mode</span>
            <span className="text-xs font-black text-emerald-700 mt-1 block">Hybrid Vector + Lexical</span>
          </div>
          <div className="p-3 bg-gray-50 border-2 border-[var(--border-strong)]">
            <span className="text-[10px] font-black uppercase text-gray-500 block">Twilio Voice Sync</span>
            <span className="text-xs font-black text-purple-800 mt-1 block">Live Multilingual Speech</span>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-300 flex items-start justify-between gap-2">
            <div className="flex items-start gap-2">
              <AlertCircle size={16} className="text-red-600 mt-0.5 shrink-0" />
              <p className="text-xs font-bold text-red-700">{error}</p>
            </div>
            <button onClick={() => setError('')} className="text-red-600 font-bold text-xs">✕</button>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-3 bg-emerald-50 border border-emerald-300 flex items-start justify-between gap-2">
            <div className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-emerald-700 mt-0.5 shrink-0" />
              <p className="text-xs font-bold text-emerald-800">{successMsg}</p>
            </div>
            <button onClick={() => setSuccessMsg('')} className="text-emerald-700 font-bold text-xs">✕</button>
          </div>
        )}

        {/* Policies Grid */}
        {!loading && policies.length === 0 && !error ? (
          <div className="p-10 text-center border-2 border-dashed border-gray-300 mb-8 bg-gray-50">
            <FileText size={36} className="mx-auto text-gray-400 mb-3" />
            <h3 className="text-sm font-black uppercase text-gray-700 mb-1">No Policies Found</h3>
            <p className="text-xs text-gray-500 font-medium max-w-md mx-auto mb-4">
              Click &quot;Create Policy&quot; or &quot;Upload Doc&quot; above to add banking underwriting or restructuring guidelines.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-[var(--accent)] text-white text-xs font-black uppercase inline-flex items-center gap-1.5"
            >
              <PlusCircle size={14} /> Add First Policy
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {policies.map((p, idx) => (
              <div
                key={idx}
                className="p-5 border-2 border-[var(--border-strong)] bg-[#F9FAFB] shadow-sm flex flex-col justify-between hover:border-[var(--accent)] transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 ${p.is_custom ? 'bg-purple-800 text-white' : 'bg-blue-900 text-white'}`}>
                      {p.is_custom ? 'Custom Policy' : 'Institutional SOP'}
                    </span>
                    <span className="text-xs text-green-700 font-bold flex items-center gap-1">
                      <CheckCircle2 size={13} /> {p.chunks_count || 40} Chunks
                    </span>
                  </div>

                  <h3 className="font-black text-sm text-[var(--text-primary)] mb-1 leading-tight">
                    {p.title}
                  </h3>
                  <p className="text-[11px] text-gray-500 font-mono mb-2">
                    {p.filename} · {p.size_kb} KB
                  </p>

                  {p.preview && (
                    <div className="p-2.5 bg-white border border-gray-200 text-xs text-gray-600 font-medium mb-3 line-clamp-2 italic">
                      &quot;{p.preview.slice(0, 140)}...&quot;
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-[var(--border-strong)] flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleViewPolicy(p.filename)}
                    className="px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 border border-[var(--border-strong)] text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Eye size={12} /> View Full
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setSelectedPolicyForCall(p);
                        setShowCallModal(true);
                      }}
                      className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                      title="Explain this policy on Twilio voice call"
                    >
                      <Volume2 size={12} /> Voice Call
                    </button>

                    {p.is_custom && (
                      <button
                        onClick={() => handleDeletePolicy(p.filename)}
                        className="p-1.5 text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 cursor-pointer"
                        title="Delete policy"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Security & RAG Notice */}
        <div className="p-4 bg-yellow-50 border-2 border-[var(--border-strong)] flex items-start gap-3">
          <Shield size={18} className="text-[var(--accent)] shrink-0 mt-0.5" />
          <div className="text-xs font-medium text-[var(--text-primary)]">
            <strong className="block uppercase font-black mb-0.5">Automated Policy Grounding & Voice RAG:</strong>
            Whenever you add or upload a new policy, it is instantly vectorized and chunked. Both the AI Copilot and Twilio Voice Assistant will immediately cite and explain the new clauses during customer phone calls and decision workflows.
          </div>
        </div>
      </div>

      {/* CREATE POLICY MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border-4 border-[var(--border-strong)] w-full max-w-2xl shadow-2xl p-6 my-8">
            <div className="flex items-center justify-between border-b-2 border-[var(--border-strong)] pb-3 mb-4">
              <h2 className="text-base font-black uppercase text-[var(--text-primary)] flex items-center gap-2">
                <PlusCircle size={18} className="text-[var(--accent)]" /> Add New Institutional Policy
              </h2>
              <button onClick={() => setShowCreateModal(false)} className="p-1 hover:bg-gray-100 font-bold">
                <X size={18} />
              </button>
            </div>

            {/* Quick Templates */}
            <div className="mb-4">
              <span className="text-[10px] font-black uppercase text-gray-500 block mb-1.5 flex items-center gap-1">
                <Sparkles size={12} className="text-[var(--accent)]" /> Or Select a Quick Policy Template:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {TEMPLATES.map((tmpl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setNewTitle(tmpl.title);
                      setNewCategory(tmpl.category);
                      setNewContent(tmpl.content);
                    }}
                    className="p-2 text-left bg-gray-50 hover:bg-blue-50 border border-gray-300 text-xs font-bold text-gray-800 transition-colors"
                  >
                    {tmpl.name}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleCreatePolicy} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-gray-700 mb-1">
                  Policy Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Festival Season Low-Interest Lending SOP 2026"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 border-2 border-[var(--border-strong)] text-xs font-bold focus:outline-hidden focus:border-[var(--accent)]"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full p-2.5 border-2 border-[var(--border-strong)] text-xs font-bold focus:outline-hidden"
                >
                  <option value="Hardship & Restructuring">Hardship & Debt Restructuring</option>
                  <option value="Lending Underwriting">Lending & Credit Risk Underwriting</option>
                  <option value="Fraud Prevention">Fraud Prevention & Security Protocol</option>
                  <option value="Agricultural Credit">Agricultural & Rural Lending</option>
                  <option value="MSME Financing">MSME & Digital Working Capital</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-700 mb-1">
                  Policy Clauses & Markdown Content *
                </label>
                <textarea
                  required
                  rows={8}
                  placeholder={`### Clause 1.1 — Eligibility\nEligible borrowers with credit utilization below 75% receive 1.5% interest rebate...\n\n### Clause 1.2 — Restructuring Workout\nRestructuring period extended to 36 months...`}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full p-2.5 border-2 border-[var(--border-strong)] text-xs font-mono focus:outline-hidden focus:border-[var(--accent)]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border-2 border-[var(--border-strong)] text-xs font-black uppercase hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 bg-[var(--accent)] text-white text-xs font-black uppercase flex items-center gap-1.5 shadow-sm hover:opacity-90 disabled:opacity-50 cursor-pointer"
                >
                  {creating ? <RefreshCw size={14} className="animate-spin" /> : <Check size={14} />}
                  {creating ? 'Indexing into RAG...' : 'Save & Vectorize Policy'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UPLOAD DOCUMENT MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-[var(--border-strong)] w-full max-w-md shadow-2xl p-6">
            <div className="flex items-center justify-between border-b-2 border-[var(--border-strong)] pb-3 mb-4">
              <h2 className="text-base font-black uppercase text-[var(--text-primary)] flex items-center gap-2">
                <Upload size={18} className="text-[var(--accent)]" /> Upload Policy Document
              </h2>
              <button onClick={() => setShowUploadModal(false)} className="p-1 hover:bg-gray-100 font-bold">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFileUpload} className="space-y-4">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="p-6 border-2 border-dashed border-gray-400 text-center bg-gray-50 hover:bg-blue-50 cursor-pointer transition-colors"
              >
                <FileCheck size={32} className="mx-auto text-[var(--accent)] mb-2" />
                <p className="text-xs font-black uppercase text-gray-800 mb-1">
                  {uploadFile ? uploadFile.name : 'Click to Browse File'}
                </p>
                <p className="text-[10px] text-gray-500 font-bold">
                  Supported formats: .MD, .PDF, .TXT, .CSV, .DOCX
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".md,.pdf,.txt,.csv,.docx"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 border-2 border-[var(--border-strong)] text-xs font-black uppercase hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading || !uploadFile}
                  className="px-5 py-2 bg-blue-900 text-white text-xs font-black uppercase flex items-center gap-1.5 shadow-sm hover:opacity-90 disabled:opacity-50 cursor-pointer"
                >
                  {uploading ? <RefreshCw size={14} className="animate-spin" /> : <Upload size={14} />}
                  {uploading ? 'Vectorizing...' : 'Upload & Index'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW DOCUMENT MODAL */}
      {showViewModal && activeDoc && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border-4 border-[var(--border-strong)] w-full max-w-3xl shadow-2xl p-6 my-8 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b-2 border-[var(--border-strong)] pb-3 mb-4 shrink-0">
              <div>
                <h2 className="text-base font-black uppercase text-[var(--text-primary)]">
                  {activeDoc.title}
                </h2>
                <span className="text-xs font-mono text-gray-500">{activeDoc.filename}</span>
              </div>
              <button onClick={() => setShowViewModal(false)} className="p-1 hover:bg-gray-100 font-bold">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 border-2 border-gray-200 text-xs font-mono whitespace-pre-wrap leading-relaxed text-gray-800">
              {activeDoc.content}
            </div>

            <div className="pt-4 mt-4 border-t border-gray-200 flex items-center justify-between shrink-0">
              <span className="text-xs font-bold text-green-700 flex items-center gap-1">
                <CheckCircle2 size={14} /> Active in Semantic Vector Search & Voice Copilot
              </span>
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 font-black text-xs uppercase"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VOICE TEST CALL MODAL */}
      {showCallModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-[var(--border-strong)] w-full max-w-md shadow-2xl p-6">
            <div className="flex items-center justify-between border-b-2 border-[var(--border-strong)] pb-3 mb-4">
              <h2 className="text-base font-black uppercase text-[var(--text-primary)] flex items-center gap-2">
                <Phone size={18} className="text-emerald-700" /> AI Voice Policy Call
              </h2>
              <button onClick={() => setShowCallModal(false)} className="p-1 hover:bg-gray-100 font-bold">
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-gray-600 mb-4 font-medium">
              Twilio AI Voice Copilot will dial your phone, explain{' '}
              <strong>{selectedPolicyForCall ? selectedPolicyForCall.title : 'the active policies'}</strong>, 
              and listen to your voice questions in real time.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-gray-700 mb-1">
                  Recipient Phone Number
                </label>
                <input
                  type="text"
                  value={callPhone}
                  onChange={(e) => setCallPhone(e.target.value)}
                  className="w-full p-2.5 border-2 border-[var(--border-strong)] text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-700 mb-1">
                  Language Support
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { code: 'hi', label: 'Hindi (हिंदी)' },
                    { code: 'en', label: 'English' },
                    { code: 'kn', label: 'Kannada (ಕನ್ನಡ)' }
                  ].map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => setCallLang(l.code)}
                      className={`p-2 text-xs font-bold border-2 transition-all cursor-pointer ${
                        callLang === l.code
                          ? 'border-[var(--accent)] bg-amber-50 text-[var(--accent)]'
                          : 'border-gray-300 bg-gray-50 text-gray-700'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              {callStatus && (
                <div className={`p-2.5 text-xs font-bold border ${callStatus.startsWith('✓') ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-red-50 border-red-300 text-red-700'}`}>
                  {callStatus}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCallModal(false)}
                  className="px-4 py-2 border-2 border-[var(--border-strong)] text-xs font-black uppercase hover:bg-gray-100 cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleVoiceCall}
                  disabled={calling}
                  className="px-5 py-2 bg-emerald-700 text-white text-xs font-black uppercase flex items-center gap-1.5 shadow-sm hover:opacity-90 disabled:opacity-50 cursor-pointer"
                >
                  {calling ? <RefreshCw size={14} className="animate-spin" /> : <Phone size={14} />}
                  {calling ? 'Calling...' : 'Dial AI Call'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



