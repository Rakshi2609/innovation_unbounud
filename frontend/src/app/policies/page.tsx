"use client";

import React, { useState, useEffect } from 'react';
import { BookOpen, RefreshCw, FileText, CheckCircle2, Shield, AlertCircle } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchPolicies = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/v1/documents`);
      if (res.ok) {
        const data = await res.json();
        setPolicies(data.documents || []);
      } else {
        setError(`Failed to fetch policies (HTTP ${res.status}). Is the backend running at ${API_BASE}?`);
      }
    } catch (e) {
      setError(`Cannot reach backend at ${API_BASE}. Ensure start_servers.bat is running.`);
      console.error("Failed fetching policies:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white border-2 border-[var(--border-strong)] p-6 shadow-md mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[var(--border-strong)] pb-4 mb-6">
          <div>
            <h1 className="text-xl font-black uppercase text-[var(--text-primary)] flex items-center gap-2">
              <BookOpen size={20} className="text-[var(--accent)]" /> Institutional Banking Policy Knowledge Base
            </h1>
            <p className="text-xs font-bold text-[#8A8A8A] mt-1">
              Qdrant Hybrid Vector Store · Clause-Level Semantic Chunking · Automated PII Redaction
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchPolicies}
              className="p-2 border-2 border-[var(--border-strong)] hover:bg-gray-100 flex items-center gap-1.5 text-xs font-bold cursor-pointer"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh Base
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-300 flex items-start gap-2">
            <AlertCircle size={16} className="text-red-600 mt-0.5 shrink-0" />
            <p className="text-xs font-bold text-red-700">{error}</p>
          </div>
        )}

        {/* Policies Grid */}
        {!loading && policies.length === 0 && !error ? (
          <div className="p-8 text-center border-2 border-dashed border-gray-300 mb-8 bg-gray-50">
            <FileText size={32} className="mx-auto text-gray-400 mb-3" />
            <h3 className="text-sm font-black uppercase text-gray-700 mb-1">No Policies Found</h3>
            <p className="text-xs text-gray-500 font-medium max-w-md mx-auto">
              The vector index is empty. Ensure your backend has access to the /data/policies directory and Qdrant is initialized.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {policies.map((p, idx) => (
              <div
                key={idx}
                className="p-5 border-2 border-[var(--border-strong)] bg-[#F9FAFB] shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase bg-blue-800 text-white px-2 py-0.5">
                      Banking SOP / Regulation
                    </span>
                    <span className="text-xs text-green-600 font-bold flex items-center gap-1">
                      <CheckCircle2 size={13} /> Vector Indexed
                    </span>
                  </div>

                  <h3 className="font-black text-base text-[var(--text-primary)] mb-1 leading-tight">
                    {p.replace(/_/g, ' ').replace('.md', '').toUpperCase()}
                  </h3>
                  <p className="text-xs text-gray-500 font-mono break-all">
                    Filename: {p}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[var(--border-strong)] flex items-center justify-between text-xs font-bold text-[#8A8A8A]">
                  <span>Chunk Mode: Semantic Clauses</span>
                  <span className="text-blue-800">Live in RAG</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Security & PII Notice */}
        <div className="p-4 bg-yellow-50 border-2 border-[var(--border-strong)] flex items-start gap-3">
          <Shield size={18} className="text-[var(--accent)] shrink-0 mt-0.5" />
          <div className="text-xs font-medium text-[var(--text-primary)]">
            <strong className="block uppercase font-black mb-0.5">Automated PII Masking Guarantee:</strong>
            All banking policy documents and customer records are sanitized via regex pipelines prior to embedding. Account numbers, SSNs, Aadhaar numbers, and phone numbers are scrubbed to preserve complete data privacy.
          </div>
        </div>
      </div>
    </div>
  );
}


