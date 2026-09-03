"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldAlert, AlertCircle, CheckCircle2, ArrowLeft, Send, User, FileText } from 'lucide-react';

export default function GrievancePage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    customer_id: "CUST-88120",
    name: "Aarav Patel",
    email: "aarav.patel@example.in",
    dispute_category: "credit_utilization_dispute",
    case_id: "CASE-2026-001",
    description: "I am writing to clarify that my recent medical expenses caused a temporary spike in credit utilization. I would like to request proactive debt restructuring under Clause 3.2 without negative credit score reporting."
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white border-4 border-[#1A1A1A] p-6 shadow-[6px_6px_0px_#1A1A1A]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-[#0F4C81] text-white">
                Customer Protection & Ombudsperson
              </span>
            </div>
            <h1 className="text-xl font-black uppercase text-[#1A1A1A] flex items-center gap-2">
              <ShieldAlert size={20} className="text-[#E23D28]" /> Customer Grievance & Dispute Redressal Portal
            </h1>
            <p className="text-xs font-bold text-[#8A8A8A] mt-1">
              Submit formal reviews for automated AI risk flags, request human ombudsperson escalation, or dispute transactions.
            </p>
          </div>

          <Link
            href="/triage"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F4F4F4] border-2 border-[#1A1A1A] text-xs font-black uppercase hover:bg-gray-200"
          >
            <ArrowLeft size={14} /> Back to Triage
          </Link>
        </div>

        {submitted ? (
          <div className="p-8 bg-green-50 border-4 border-[#28A745] text-center shadow-[4px_4px_0px_#28A745]">
            <CheckCircle2 size={40} className="text-[#28A745] mx-auto mb-3" />
            <h2 className="text-xl font-black uppercase text-[#1A1A1A] mb-1">
              Grievance Registered Successfully
            </h2>
            <p className="text-xs font-bold text-gray-700 mb-2">
              Reference Ticket: <strong className="text-[#0F4C81]">GRV-2026-9812</strong>
            </p>
            <p className="text-xs text-gray-600 max-w-md mx-auto mb-6">
              In accordance with banking customer charter regulations, an independent human officer will review your request within 24 hours. Automated actions have been placed on operational hold.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setSubmitted(false)}
                className="px-4 py-2 border-2 border-[#1A1A1A] text-xs font-black uppercase bg-white hover:bg-gray-100 cursor-pointer"
              >
                Submit Another Request
              </button>
              <Link
                href="/triage"
                className="px-4 py-2 bg-[#1A1A1A] text-white border-2 border-[#1A1A1A] text-xs font-black uppercase cursor-pointer"
              >
                Return to Triage Queue
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs font-bold">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#1A1A1A] uppercase mb-1">Customer Full Name:</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full p-2.5 border-2 border-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="block text-[#1A1A1A] uppercase mb-1">Customer ID / Account Number:</label>
                <input
                  type="text"
                  required
                  value={form.customer_id}
                  onChange={e => setForm({ ...form, customer_id: e.target.value })}
                  className="w-full p-2.5 border-2 border-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="block text-[#1A1A1A] uppercase mb-1">Related Case ID (if known):</label>
                <input
                  type="text"
                  value={form.case_id}
                  onChange={e => setForm({ ...form, case_id: e.target.value })}
                  className="w-full p-2.5 border-2 border-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="block text-[#1A1A1A] uppercase mb-1">Grievance Category:</label>
                <select
                  value={form.dispute_category}
                  onChange={e => setForm({ ...form, dispute_category: e.target.value })}
                  className="w-full p-2.5 border-2 border-[#1A1A1A] bg-white font-bold cursor-pointer"
                >
                  <option value="credit_utilization_dispute">Dispute Credit Distress Assessment</option>
                  <option value="fraud_false_positive">Report False Positive Fraud Block</option>
                  <option value="restructuring_request">Request Hardship Debt Restructuring</option>
                  <option value="senior_assistance">Senior Citizen Dedicated Support</option>
                  <option value="other">General Service Inquiry</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[#1A1A1A] uppercase mb-1">Detailed Explanation & Dispute Context:</label>
              <textarea
                rows={4}
                required
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full p-2.5 border-2 border-[#1A1A1A]"
              />
            </div>

            <div className="p-3 bg-blue-50 border-2 border-[#0F4C81] flex items-start gap-2.5">
              <AlertCircle size={16} className="text-[#0F4C81] shrink-0 mt-0.5" />
              <p className="text-[11px] font-medium text-[#0F4C81]">
                <strong>Right to Human Review Guarantee:</strong> Any automated assessment or recommended action can be appealed without penalty. All grievances are routed to senior compliance officers.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t-2 border-[#1A1A1A]">
              <Link
                href="/triage"
                className="px-4 py-2 border-2 border-[#1A1A1A] font-bold uppercase hover:bg-gray-100"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="px-6 py-2 bg-[#E23D28] text-white border-2 border-[#1A1A1A] font-black uppercase hover:bg-[#1A1A1A] cursor-pointer flex items-center gap-2"
              >
                <Send size={14} /> Submit Grievance Appeal
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
