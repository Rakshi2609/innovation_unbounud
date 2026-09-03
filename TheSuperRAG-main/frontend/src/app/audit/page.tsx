"use client";

import React, { useState, useEffect } from 'react';
import { History, RefreshCw, ShieldCheck, UserCheck, AlertTriangle } from 'lucide-react';

const API_BASE = "http://localhost:8000";

export default function AuditPage() {
  const [cases, setCases] = useState<any[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('');
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

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
      console.error(e);
    }
  };

  const fetchAuditLogs = async (caseId: string) => {
    if (!caseId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/cases/${caseId}/audit`);
      if (res.ok) {
        const data = await res.json();
        setAuditLogs(data.audit_trail || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  useEffect(() => {
    if (selectedCaseId) {
      fetchAuditLogs(selectedCaseId);
    }
  }, [selectedCaseId]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white border-4 border-[#1A1A1A] p-6 shadow-[6px_6px_0px_#1A1A1A]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#1A1A1A] pb-4 mb-6">
          <div>
            <h1 className="text-xl font-black uppercase text-[#1A1A1A] flex items-center gap-2">
              <History size={20} className="text-[#0F4C81]" /> Compliance & Responsible AI Audit Trail
            </h1>
            <p className="text-xs font-bold text-[#8A8A8A] mt-1">
              Immutable log of Automated ML Evaluations and Authorized Human Officer Interventions
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedCaseId}
              onChange={e => setSelectedCaseId(e.target.value)}
              className="border-2 border-[#1A1A1A] px-3 py-1.5 bg-white font-bold text-xs uppercase cursor-pointer"
            >
              {cases.map(c => (
                <option key={c.case_id} value={c.case_id}>
                  {c.customer_name} ({c.case_id})
                </option>
              ))}
            </select>
            <button
              onClick={() => fetchAuditLogs(selectedCaseId)}
              className="p-2 border border-[#1A1A1A] hover:bg-gray-100"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Audit Log Entries */}
        <div className="flex flex-col gap-4">
          {auditLogs.length > 0 ? (
            auditLogs.map((log: any) => (
              <div
                key={log.id}
                className="p-4 border-2 border-[#1A1A1A] bg-[#F9FAFB] shadow-[3px_3px_0px_#1A1A1A] flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-black uppercase px-2 py-0.5 border ${
                    log.event_type.includes('DECISION') 
                      ? 'bg-[#28A745] text-white border-[#1A1A1A]' 
                      : 'bg-[#1A1A1A] text-white'
                  }`}>
                    {log.event_type}
                  </span>
                  <span className="text-xs font-bold text-[#8A8A8A]">
                    {new Date(log.timestamp).toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-[#1A1A1A]">
                  <UserCheck size={15} className="text-[#0F4C81]" />
                  Actor: <span className="text-[#0F4C81]">{log.actor}</span>
                  <span className="text-gray-400">|</span>
                  Action: <span>{log.action}</span>
                </div>

                {log.notes && (
                  <div className="text-xs text-[#4A4A4A] bg-white p-2.5 border border-gray-300 font-medium">
                    {log.notes}
                  </div>
                )}

                {log.override_ml && (
                  <div className="text-[11px] font-bold text-red-600 bg-red-50 p-2 border border-red-300 flex items-center gap-1.5">
                    <AlertTriangle size={14} />
                    Officer Overrode AI Model Prediction: {log.override_reason}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-8 text-center bg-gray-50 border-2 border-dashed border-gray-300 text-xs font-bold text-gray-500">
              No audit logs recorded for this case yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
