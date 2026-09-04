"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, TrendingDown, BookOpen, CheckCircle, Scale, AlertCircle, PhoneCall, PhoneOutgoing, Globe, Activity } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const formatINR = (val: number | undefined | null): string => {
  if (val === undefined || val === null) return "₹0";
  return "₹" + Number(val).toLocaleString("en-IN");
};

export default function EvaluateCasePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<any | null>(null);
  const [apiError, setApiError] = useState('');

  // Voice Call State
  const [callPhone, setCallPhone] = useState<string>('+919461284678');
  const [callLang, setCallLang] = useState<string>('hi');
  const [isCalling, setIsCalling] = useState<boolean>(false);
  const [callResult, setCallResult] = useState<any | null>(null);

  const [form, setForm] = useState({
    name: "Sunita Verma",
    customer_id: "CUST-IN-" + Math.floor(1000 + Math.random() * 9000),
    occupation: "Senior Analyst",
    employment_type: "Full-Time Salaried",
    credit_score: 685,
    track_type: "distress",
    monthly_income: 85000,
    monthly_expenses: 74000,
    existing_debt: 380000,
    credit_utilization: 0.88,
    recent_delinquencies: 1,
    savings_balance: 20000,
    income_volatility: 0.18,
    tx_amount: 35000,
    device_trust: 0.95
  });

  const handleEvaluate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setApiError('');
    try {
      const payload = {
        track_type: form.track_type,
        customer: {
          customer_id: form.customer_id,
          name: form.name,
          occupation: form.occupation,
          employment_type: form.employment_type,
          credit_score: Number(form.credit_score),
          financial_metrics: {
            monthly_income: Number(form.monthly_income),
            monthly_expenses: Number(form.monthly_expenses),
            existing_debt: Number(form.existing_debt),
            credit_utilization: Number(form.credit_utilization),
            recent_delinquencies: Number(form.recent_delinquencies),
            savings_balance: Number(form.savings_balance),
            income_volatility_score: Number(form.income_volatility)
          },
          recent_transaction: {
            amount: Number(form.tx_amount),
            device_trust_score: Number(form.device_trust),
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
        setAssessmentResult(result);
      } else {
        const errData = await res.json().catch(() => ({}));
        setApiError(errData?.detail || `Server returned HTTP ${res.status}. Ensure the backend is running at ${API_BASE}.`);
      }
    } catch (e) {
      setApiError(`Cannot reach backend at ${API_BASE}. Please ensure start_servers.bat is running.`);
      console.error("Evaluation failed:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white border-2 border-[var(--border-strong)] p-6 shadow-md mb-8">
        <div className="flex items-center justify-between border-b-2 border-[var(--border-strong)] pb-4 mb-6">
          <div>
            <h1 className="text-xl font-black uppercase text-[var(--text-primary)] flex items-center gap-2">
              <Plus size={20} className="text-[var(--accent)]" /> Run New Customer Risk & Policy Assessment
            </h1>
            <p className="text-xs font-bold text-[#8A8A8A] mt-1">
              Statistical ML Inference (LightGBM) → Grounded Policy RAG → Numbered Citations
            </p>
          </div>
        </div>

        <form onSubmit={handleEvaluate} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-bold">
          <div>
            <label className="block text-[var(--text-primary)] uppercase mb-1">Customer Name:</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full p-2.5 border-2 border-[var(--border-strong)]"
            />
          </div>

          <div>
            <label className="block text-[var(--text-primary)] uppercase mb-1">Customer ID:</label>
            <input
              type="text"
              required
              value={form.customer_id}
              onChange={e => setForm({ ...form, customer_id: e.target.value })}
              className="w-full p-2.5 border-2 border-[var(--border-strong)]"
            />
          </div>

          <div>
            <label className="block text-[var(--text-primary)] uppercase mb-1">Banking Problem Track:</label>
            <select
              value={form.track_type}
              onChange={e => setForm({ ...form, track_type: e.target.value })}
              className="w-full p-2.5 border-2 border-[var(--border-strong)] bg-white font-bold cursor-pointer"
            >
              <option value="distress">Preventing Financial Distress</option>
              <option value="fraud">Protecting from Fraud & Account Takeover</option>
              <option value="gig_resilience">Gig & Informal Worker Resilience</option>
              <option value="safe_payments">Safe Digital Payments</option>
            </select>
          </div>

          <div>
            <label className="block text-[var(--text-primary)] uppercase mb-1">Occupation:</label>
            <input
              type="text"
              value={form.occupation}
              onChange={e => setForm({ ...form, occupation: e.target.value })}
              className="w-full p-2.5 border-2 border-[var(--border-strong)]"
            />
          </div>

          <div>
            <label className="block text-[var(--text-primary)] uppercase mb-1">Employment Type:</label>
            <select
              value={form.employment_type}
              onChange={e => setForm({ ...form, employment_type: e.target.value })}
              className="w-full p-2.5 border-2 border-[var(--border-strong)] bg-white font-bold cursor-pointer"
            >
              <option value="Full-Time Salaried">Full-Time Salaried</option>
              <option value="Self-Employed">Self-Employed</option>
              <option value="Gig / Informal">Gig / Informal</option>
              <option value="Freelance">Freelance</option>
              <option value="Retired">Retired</option>
              <option value="Student">Student</option>
            </select>
          </div>

          <div>
            <label className="block text-[var(--text-primary)] uppercase mb-1">Monthly Income (₹):</label>
            <input
              type="number"
              required
              value={form.monthly_income}
              onChange={e => setForm({ ...form, monthly_income: Number(e.target.value) })}
              className="w-full p-2.5 border-2 border-[var(--border-strong)]"
            />
          </div>

          <div>
            <label className="block text-[var(--text-primary)] uppercase mb-1">Monthly Expenses (₹):</label>
            <input
              type="number"
              required
              value={form.monthly_expenses}
              onChange={e => setForm({ ...form, monthly_expenses: Number(e.target.value) })}
              className="w-full p-2.5 border-2 border-[var(--border-strong)]"
            />
          </div>

          <div>
            <label className="block text-[var(--text-primary)] uppercase mb-1">Total Existing Debt (₹):</label>
            <input
              type="number"
              required
              value={form.existing_debt}
              onChange={e => setForm({ ...form, existing_debt: Number(e.target.value) })}
              className="w-full p-2.5 border-2 border-[var(--border-strong)]"
            />
          </div>

          <div>
            <label className="block text-[var(--text-primary)] uppercase mb-1">Credit Utilization (0.00 - 1.00):</label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="1"
              required
              value={form.credit_utilization}
              onChange={e => setForm({ ...form, credit_utilization: Number(e.target.value) })}
              className="w-full p-2.5 border-2 border-[var(--border-strong)]"
            />
          </div>

          <div>
            <label className="block text-[var(--text-primary)] uppercase mb-1">Recent Missed Payments:</label>
            <input
              type="number"
              min="0"
              required
              value={form.recent_delinquencies}
              onChange={e => setForm({ ...form, recent_delinquencies: Number(e.target.value) })}
              className="w-full p-2.5 border-2 border-[var(--border-strong)]"
            />
          </div>

          <div>
            <label className="block text-[var(--text-primary)] uppercase mb-1">Liquid Savings Reserve (₹):</label>
            <input
              type="number"
              required
              value={form.savings_balance}
              onChange={e => setForm({ ...form, savings_balance: Number(e.target.value) })}
              className="w-full p-2.5 border-2 border-[var(--border-strong)]"
            />
          </div>

          <div>
            <label className="block text-[var(--text-primary)] uppercase mb-1">Income Volatility Score (0.00 - 1.00):</label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="1"
              value={form.income_volatility}
              onChange={e => setForm({ ...form, income_volatility: Number(e.target.value) })}
              className="w-full p-2.5 border-2 border-[var(--border-strong)]"
            />
          </div>

          <div>
            <label className="block text-[var(--text-primary)] uppercase mb-1">Transaction Amount (₹):</label>
            <input
              type="number"
              value={form.tx_amount}
              onChange={e => setForm({ ...form, tx_amount: Number(e.target.value) })}
              className="w-full p-2.5 border-2 border-[var(--border-strong)]"
            />
          </div>

          <div>
            <label className="block text-[var(--text-primary)] uppercase mb-1">Device Trust Score (0.00 - 1.00):</label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="1"
              value={form.device_trust}
              onChange={e => setForm({ ...form, device_trust: Number(e.target.value) })}
              className="w-full p-2.5 border-2 border-[var(--border-strong)]"
            />
          </div>

          {apiError && (
            <div className="col-span-full flex items-start gap-2.5 p-3 bg-red-50 border border-red-300">
              <AlertCircle size={14} className="text-red-600 shrink-0 mt-0.5" />
              <p className="text-xs font-bold text-red-700">{apiError}</p>
            </div>
          )}

          <div className="col-span-full flex justify-end gap-3 pt-4 border-t-2 border-[var(--border-strong)]">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white border-2 border-blue-700 font-black text-xs uppercase tracking-wider hover:bg-blue-700 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Evaluating with ML & RAG...' : 'Run Evaluation and Generate Citations'}
            </button>
          </div>
        </form>
      </div>

      {/* Live Assessment Result Card */}
      {assessmentResult && (
        <div className="bg-white border-2 border-[var(--border-strong)] p-6 shadow-md animate-fade-in">
          <div className="flex items-center justify-between border-b-2 border-[var(--border-strong)] pb-4 mb-4">
            <div>
              <span className="text-xs font-black uppercase px-2 py-0.5 bg-gray-800 text-white">
                {assessmentResult.case_id}
              </span>
              <h2 className="text-2xl font-black uppercase text-[var(--text-primary)] mt-1">
                Evaluation Result: {assessmentResult.customer?.name}
              </h2>
            </div>
            <button
              onClick={() => router.push('/triage')}
              className="px-4 py-2 bg-gray-800 text-white font-black text-xs uppercase"
            >
              View in Triage Feed →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-[#FFF8E7] border-2 border-[var(--border-strong)]">
              <p className="text-[10px] font-black uppercase text-[#8A8A8A]">ML Risk Classification</p>
              <p className="text-2xl font-black text-[var(--accent)]">
                {assessmentResult.ml_prediction?.risk_class} RISK ({Math.round(assessmentResult.ml_prediction?.risk_score * 100)}%)
              </p>
              <p className="text-xs font-bold text-gray-600 mt-1">Model: {assessmentResult.ml_prediction?.model_version}</p>
            </div>

            <div className="p-4 bg-[var(--bg-secondary)] border-2 border-[var(--border-strong)]">
              <p className="text-[10px] font-black uppercase text-[#8A8A8A]">Verified Monthly Income</p>
              <p className="text-2xl font-black text-[var(--text-primary)]">
                {formatINR(assessmentResult.customer?.financial_metrics?.monthly_income)}
              </p>
              <p className="text-xs font-bold text-gray-600 mt-1">
                Expenses: {formatINR(assessmentResult.customer?.financial_metrics?.monthly_expenses)}
              </p>
            </div>

            <div className="p-4 bg-[var(--bg-secondary)] border-2 border-[var(--border-strong)]">
              <p className="text-[10px] font-black uppercase text-[#8A8A8A]">Confidence & Evidence</p>
              <p className="text-2xl font-black text-blue-800">
                {Math.round(assessmentResult.confidence_score * 100)}% Certainty
              </p>
              <p className="text-xs font-bold text-gray-600 mt-1">
                {assessmentResult.rag_citations?.length} Policy Clauses Cited
              </p>
            </div>
          </div>

          {/* Reasoning Summary */}
          <div className="p-4 bg-[var(--bg-secondary)] border-l-8 border-[#0F4C81] border-2 border-[var(--border-strong)] mb-4">
            <h4 className="text-xs font-black uppercase text-blue-800 mb-1">Grounded Reasoning Summary:</h4>
            <p className="text-xs font-bold text-[var(--text-primary)] mb-2">{assessmentResult.explanation?.summary}</p>
            <p className="text-xs font-medium text-[#4A4A4A]">{assessmentResult.explanation?.policy_alignment}</p>
          </div>

          {/* Citations */}
          <h4 className="text-xs font-black uppercase text-[#8A8A8A] mb-2">Retrieved Policy Evidence:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {assessmentResult.rag_citations?.map((c: any, i: number) => (
              <div key={i} className="p-3 border-2 border-[var(--border-strong)] bg-white">
                <span className="text-[10px] font-black px-1.5 py-0.5 bg-gray-800 text-white uppercase">
                  [{i+1}] {c.clause}
                </span>
                <p className="text-xs font-bold text-[var(--text-primary)] mt-1">{c.policy_name}</p>
                <p className="text-[11px] text-gray-600 italic mt-1">"{c.snippet}"</p>
              </div>
            ))}
          </div>

          {/* AI Voice Call Section */}
          <div className="p-4 bg-gray-50 border-2 border-gray-900 rounded">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 border-b border-gray-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-gray-900 text-white flex items-center justify-center">
                  <PhoneCall size={14} />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase text-gray-900 flex items-center gap-2">
                    Notify Customer via AI Voice Call
                    <span className="text-[9px] font-black uppercase tracking-widest bg-green-100 text-green-800 px-1.5 py-0.5 rounded">
                      Twilio Live
                    </span>
                  </h4>
                  <p className="text-[11px] text-gray-500 font-medium">
                    Call the customer instantly with a friendly spoken summary in their native language.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Globe size={14} className="text-gray-400" />
                <select
                  value={callLang}
                  onChange={e => setCallLang(e.target.value)}
                  className="text-xs font-bold uppercase bg-white border border-gray-300 rounded px-2 py-1 text-gray-800"
                >
                  <option value="en">English (Indian Voice)</option>
                  <option value="hi">हिन्दी (Hindi)</option>
                  <option value="kn">ಕನ್ನಡ (Kannada)</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                value={callPhone}
                onChange={e => setCallPhone(e.target.value)}
                placeholder="+919461284678"
                className="w-full sm:w-2/3 text-xs font-mono font-bold p-2 border border-gray-300 rounded bg-white text-gray-900"
              />
              <button
                onClick={async () => {
                  if (!assessmentResult) return;
                  setIsCalling(true);
                  setCallResult(null);
                  try {
                    const res = await fetch(`${API_BASE}/api/v1/cases/${assessmentResult.case_id}/call`, {
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
                    setCallResult({ success: false, error: e.message || 'Call failed' });
                  } finally {
                    setIsCalling(false);
                  }
                }}
                disabled={isCalling}
                className="w-full sm:w-1/3 px-4 py-2 bg-gray-900 hover:bg-black text-white font-black text-xs uppercase flex items-center justify-center gap-2 rounded disabled:opacity-50 cursor-pointer"
              >
                {isCalling ? (
                  <>
                    <Activity size={14} className="animate-spin text-blue-400" /> Connecting...
                  </>
                ) : (
                  <>
                    <PhoneOutgoing size={14} /> Call Customer Now
                  </>
                )}
              </button>
            </div>

            {callResult && (
              <div className={`p-3 rounded border text-xs font-medium mt-3 ${
                callResult.success ? 'bg-green-50 border-green-200 text-green-900' : 'bg-red-50 border-red-200 text-red-900'
              }`}>
                <div className="flex items-center justify-between mb-1">
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
        </div>
      )}
    </div>
  );
}


