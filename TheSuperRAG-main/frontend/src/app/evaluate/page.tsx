"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, TrendingDown, BookOpen, CheckCircle, Scale } from 'lucide-react';

const API_BASE = "http://localhost:8000";

const formatINR = (val: number | undefined | null): string => {
  if (val === undefined || val === null) return "₹0";
  return "₹" + Number(val).toLocaleString("en-IN");
};

export default function EvaluateCasePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<any | null>(null);

  const [form, setForm] = useState({
    name: "Sunita Verma",
    customer_id: "CUST-IN-" + Math.floor(1000 + Math.random() * 9000),
    occupation: "Senior Analyst / Independent Consultant",
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
      }
    } catch (e) {
      console.error("Evaluation failed:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white border-4 border-[#1A1A1A] p-6 shadow-[6px_6px_0px_#1A1A1A] mb-8">
        <div className="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-4 mb-6">
          <div>
            <h1 className="text-xl font-black uppercase text-[#1A1A1A] flex items-center gap-2">
              <Plus size={20} className="text-[#E23D28]" /> Run New Customer Risk & Policy Assessment
            </h1>
            <p className="text-xs font-bold text-[#8A8A8A] mt-1">
              Statistical ML Inference (XGBoost) $\rightarrow$ Grounded Policy RAG $\rightarrow$ Numbered Citations
            </p>
          </div>
        </div>

        <form onSubmit={handleEvaluate} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-bold">
          <div>
            <label className="block text-[#1A1A1A] uppercase mb-1">Customer Name:</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full p-2.5 border-2 border-[#1A1A1A]"
            />
          </div>

          <div>
            <label className="block text-[#1A1A1A] uppercase mb-1">Customer ID:</label>
            <input
              type="text"
              required
              value={form.customer_id}
              onChange={e => setForm({ ...form, customer_id: e.target.value })}
              className="w-full p-2.5 border-2 border-[#1A1A1A]"
            />
          </div>

          <div>
            <label className="block text-[#1A1A1A] uppercase mb-1">Banking Problem Track:</label>
            <select
              value={form.track_type}
              onChange={e => setForm({ ...form, track_type: e.target.value })}
              className="w-full p-2.5 border-2 border-[#1A1A1A] bg-white font-bold cursor-pointer"
            >
              <option value="distress">Preventing Financial Distress</option>
              <option value="fraud">Protecting from Fraud & Account Takeover</option>
              <option value="gig_resilience">Gig & Informal Worker Resilience</option>
              <option value="safe_payments">Safe Digital Payments</option>
            </select>
          </div>

          <div>
            <label className="block text-[#1A1A1A] uppercase mb-1">Monthly Income (₹):</label>
            <input
              type="number"
              required
              value={form.monthly_income}
              onChange={e => setForm({ ...form, monthly_income: Number(e.target.value) })}
              className="w-full p-2.5 border-2 border-[#1A1A1A]"
            />
          </div>

          <div>
            <label className="block text-[#1A1A1A] uppercase mb-1">Monthly Expenses (₹):</label>
            <input
              type="number"
              required
              value={form.monthly_expenses}
              onChange={e => setForm({ ...form, monthly_expenses: Number(e.target.value) })}
              className="w-full p-2.5 border-2 border-[#1A1A1A]"
            />
          </div>

          <div>
            <label className="block text-[#1A1A1A] uppercase mb-1">Total Existing Debt (₹):</label>
            <input
              type="number"
              required
              value={form.existing_debt}
              onChange={e => setForm({ ...form, existing_debt: Number(e.target.value) })}
              className="w-full p-2.5 border-2 border-[#1A1A1A]"
            />
          </div>

          <div>
            <label className="block text-[#1A1A1A] uppercase mb-1">Revolving Credit Utilization (0.00 - 1.00):</label>
            <input
              type="number"
              step="0.01"
              required
              value={form.credit_utilization}
              onChange={e => setForm({ ...form, credit_utilization: Number(e.target.value) })}
              className="w-full p-2.5 border-2 border-[#1A1A1A]"
            />
          </div>

          <div>
            <label className="block text-[#1A1A1A] uppercase mb-1">Recent Missed Payments (Count):</label>
            <input
              type="number"
              required
              value={form.recent_delinquencies}
              onChange={e => setForm({ ...form, recent_delinquencies: Number(e.target.value) })}
              className="w-full p-2.5 border-2 border-[#1A1A1A]"
            />
          </div>

          <div>
            <label className="block text-[#1A1A1A] uppercase mb-1">Liquid Savings Reserve (₹):</label>
            <input
              type="number"
              required
              value={form.savings_balance}
              onChange={e => setForm({ ...form, savings_balance: Number(e.target.value) })}
              className="w-full p-2.5 border-2 border-[#1A1A1A]"
            />
          </div>

          <div className="col-span-full flex justify-end gap-3 pt-4 border-t-2 border-[#1A1A1A]">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-[#0F4C81] text-white border-2 border-[#1A1A1A] font-black text-xs uppercase tracking-wider hover:bg-[#1A1A1A] hover:shadow-[4px_4px_0px_#1A1A1A] transition-all cursor-pointer"
            >
              {loading ? 'Evaluating with ML & RAG...' : '⚡ Run Evaluation & Generate Citations'}
            </button>
          </div>
        </form>
      </div>

      {/* Live Assessment Result Card */}
      {assessmentResult && (
        <div className="bg-white border-4 border-[#1A1A1A] p-6 shadow-[8px_8px_0px_#28A745] animate-fade-in">
          <div className="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-4 mb-4">
            <div>
              <span className="text-xs font-black uppercase px-2 py-0.5 bg-[#1A1A1A] text-white">
                {assessmentResult.case_id}
              </span>
              <h2 className="text-2xl font-black uppercase text-[#1A1A1A] mt-1">
                Evaluation Result: {assessmentResult.customer?.name}
              </h2>
            </div>
            <button
              onClick={() => router.push('/triage')}
              className="px-4 py-2 bg-[#1A1A1A] text-white font-black text-xs uppercase"
            >
              View in Triage Feed →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-[#FFF8E7] border-2 border-[#1A1A1A]">
              <p className="text-[10px] font-black uppercase text-[#8A8A8A]">ML Risk Classification</p>
              <p className="text-2xl font-black text-[#E23D28]">
                {assessmentResult.ml_prediction?.risk_class} RISK ({Math.round(assessmentResult.ml_prediction?.risk_score * 100)}%)
              </p>
              <p className="text-xs font-bold text-gray-600 mt-1">Model: {assessmentResult.ml_prediction?.model_version}</p>
            </div>

            <div className="p-4 bg-[#F4F4F4] border-2 border-[#1A1A1A]">
              <p className="text-[10px] font-black uppercase text-[#8A8A8A]">Verified Monthly Income</p>
              <p className="text-2xl font-black text-[#1A1A1A]">
                {formatINR(assessmentResult.customer?.financial_metrics?.monthly_income)}
              </p>
              <p className="text-xs font-bold text-gray-600 mt-1">
                Expenses: {formatINR(assessmentResult.customer?.financial_metrics?.monthly_expenses)}
              </p>
            </div>

            <div className="p-4 bg-[#F4F4F4] border-2 border-[#1A1A1A]">
              <p className="text-[10px] font-black uppercase text-[#8A8A8A]">Confidence & Evidence</p>
              <p className="text-2xl font-black text-[#0F4C81]">
                {Math.round(assessmentResult.confidence_score * 100)}% Certainty
              </p>
              <p className="text-xs font-bold text-gray-600 mt-1">
                {assessmentResult.rag_citations?.length} Policy Clauses Cited
              </p>
            </div>
          </div>

          {/* Reasoning Summary */}
          <div className="p-4 bg-[#F4F4F4] border-l-8 border-[#0F4C81] border-2 border-[#1A1A1A] mb-4">
            <h4 className="text-xs font-black uppercase text-[#0F4C81] mb-1">Grounded Reasoning Summary:</h4>
            <p className="text-xs font-bold text-[#1A1A1A] mb-2">{assessmentResult.explanation?.summary}</p>
            <p className="text-xs font-medium text-[#4A4A4A]">{assessmentResult.explanation?.policy_alignment}</p>
          </div>

          {/* Citations */}
          <h4 className="text-xs font-black uppercase text-[#8A8A8A] mb-2">Retrieved Policy Evidence:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {assessmentResult.rag_citations?.map((c: any, i: number) => (
              <div key={i} className="p-3 border-2 border-[#1A1A1A] bg-white">
                <span className="text-[10px] font-black px-1.5 py-0.5 bg-[#1A1A1A] text-white uppercase">
                  [{i+1}] {c.clause}
                </span>
                <p className="text-xs font-bold text-[#1A1A1A] mt-1">{c.policy_name}</p>
                <p className="text-[11px] text-gray-600 italic mt-1">"{c.snippet}"</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
