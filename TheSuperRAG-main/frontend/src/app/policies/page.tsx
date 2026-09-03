"use client";

import React, { useState, useEffect } from 'react';
import { BookOpen, RefreshCw, Upload, FileText, CheckCircle2, Shield } from 'lucide-react';

const API_BASE = "http://localhost:8000";

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<string | null>(null);

  const fetchPolicies = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/documents`);
      if (res.ok) {
        const data = await res.json();
        setPolicies(data.documents || []);
      }
    } catch (e) {
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
      <div className="bg-white border-4 border-[#1A1A1A] p-6 shadow-[6px_6px_0px_#1A1A1A] mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#1A1A1A] pb-4 mb-6">
          <div>
            <h1 className="text-xl font-black uppercase text-[#1A1A1A] flex items-center gap-2">
              <BookOpen size={20} className="text-[#E23D28]" /> Institutional Banking Policy Knowledge Base
            </h1>
            <p className="text-xs font-bold text-[#8A8A8A] mt-1">
              Qdrant Hybrid Vector Store · Clause-Level Semantic Chunking · Automated PII Redaction
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchPolicies}
              className="p-2 border-2 border-[#1A1A1A] hover:bg-gray-100 flex items-center gap-1.5 text-xs font-bold"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh Base
            </button>
          </div>
        </div>

        {/* Policies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {policies.map((p, idx) => (
            <div
              key={idx}
              className="p-5 border-2 border-[#1A1A1A] bg-[#F9FAFB] shadow-[3px_3px_0px_#1A1A1A] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase bg-[#0F4C81] text-white px-2 py-0.5">
                    Banking SOP / Regulation
                  </span>
                  <span className="text-xs text-green-600 font-bold flex items-center gap-1">
                    <CheckCircle2 size={13} /> Vector Indexed
                  </span>
                </div>

                <h3 className="font-black text-base text-[#1A1A1A] mb-1">
                  {p.replace(/_/g, ' ').replace('.md', '').toUpperCase()}
                </h3>
                <p className="text-xs text-gray-500 font-mono">
                  Filename: {p}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-300 flex items-center justify-between text-xs font-bold text-[#8A8A8A]">
                <span>Chunk Mode: Semantic Clauses</span>
                <span className="text-[#0F4C81]">Live in RAG</span>
              </div>
            </div>
          ))}
        </div>

        {/* Security & PII Notice */}
        <div className="p-4 bg-yellow-50 border-2 border-[#1A1A1A] flex items-start gap-3">
          <Shield size={18} className="text-[#E23D28] shrink-0 mt-0.5" />
          <div className="text-xs font-medium text-[#1A1A1A]">
            <strong className="block uppercase font-black mb-0.5">Automated PII Masking Guarantee:</strong>
            All banking policy documents and customer records are sanitized via regex pipelines prior to embedding. Account numbers, SSNs, Aadhaar numbers, and phone numbers are scrubbed to preserve complete data privacy.
          </div>
        </div>
      </div>
    </div>
  );
}
