"use client";

import React, { useState, useEffect } from 'react';
import { History, Shield, RefreshCw, FileText, Scale, AlertTriangle } from 'lucide-react';

const API_BASE = "http://localhost:8000";

export default function AuditPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('ALL');

  const fetchAuditLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/cases`);
      if (res.ok) {
        const data = await res.json();
        const allCases = data.cases || [];
        
        let extractedLogs: any[] = [];
        for (const c of allCases) {
          if (c.audit_trail && Array.isArray(c.audit_trail)) {
            extractedLogs = [...extractedLogs, ...c.audit_trail.map((log: any) => ({
              ...log,
              case_id: c.case_id,
              customer_name: c.customer_name
            }))];
          }
        }
        
        // Sort newest first
        extractedLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setLogs(extractedLogs);
      }
    } catch (e) {
      console.warn("Failed fetching audit logs:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const filteredLogs = logs.filter(log => {
    if (filter === 'ALL') return true;
    if (filter === 'SYSTEM') return log.actor === 'SYSTEM';
    if (filter === 'OFFICER') return log.actor !== 'SYSTEM';
    return true;
  });

  return (
    <div className="w-full bg-[#F9FAFB] min-h-screen">
      
      {/* Top Controls Toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sticky top-0 z-40">
        <div>
          <h1 className="text-lg md:text-xl font-black uppercase tracking-tight text-gray-900 flex items-center gap-2">
            <Shield size={20} className="text-blue-600 shrink-0" />
            Compliance & Responsible AI Audit Trail
          </h1>
          <p className="text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-widest mt-1">
            Immutable log of Automated ML Evaluations and Authorized Human Interventions
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-sm px-3 py-2 sm:py-1.5 text-xs font-black uppercase tracking-widest text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer w-full sm:w-auto"
          >
            <option value="ALL">All Events</option>
            <option value="SYSTEM">System/AI Actions Only</option>
            <option value="OFFICER">Human Officer Decisions</option>
          </select>
          <button 
            onClick={fetchAuditLogs}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-2 sm:py-1.5 bg-gray-900 text-white border border-gray-900 rounded-sm text-xs font-black uppercase tracking-widest shadow-sm hover:bg-gray-800 transition-all w-full sm:w-auto"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            {loading ? 'Syncing...' : 'Sync Logs'}
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6">
        <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
          {filteredLogs.length === 0 && !loading ? (
            <div className="p-8 text-left bg-gray-50 border-b border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <History size={16} className="text-gray-400" />
                <span className="text-xs font-black uppercase tracking-widest text-gray-600">No Logs Present</span>
              </div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-widest">No audit logs recorded for this case yet.</p>
            </div>
          ) : (
            <div className="relative border-l border-gray-300 ml-6 my-6 mr-6">
              {filteredLogs.map((log, idx) => {
                const isSystem = log.actor === 'SYSTEM';
                const dateObj = new Date(log.timestamp);
                
                return (
                  <div key={idx} className="mb-6 relative pl-6 group">
                    <div className={`absolute -left-[20px] top-1 w-10 h-10 border-4 border-white flex items-center justify-center shadow-sm rounded-sm ${
                      isSystem ? 'bg-blue-600 text-white' : 'bg-gray-900 text-white'
                    }`}>
                      {isSystem ? <AlertTriangle size={14} /> : <Scale size={14} />}
                    </div>

                    <div className="bg-white border border-gray-200 rounded-sm p-4 shadow-sm hover:border-gray-400 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-sm ${
                              isSystem ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-gray-100 text-gray-700 border border-gray-300'
                            }`}>
                              {isSystem ? 'AI Inference & Policy Engine' : 'Human Officer Decision'}
                            </span>
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Case: {log.case_id}</span>
                          </div>
                          <h3 className="font-black text-sm uppercase tracking-tight text-gray-900">{log.action}</h3>
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">For Customer: {log.customer_name}</p>
                        </div>
                        
                        <div className="text-right flex flex-col items-end">
                          <span className="text-xs font-black uppercase tracking-widest text-gray-900 bg-gray-100 px-2 py-1 rounded-sm border border-gray-200 mb-1">{dateObj.toLocaleDateString()}</span>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{dateObj.toLocaleTimeString()}</span>
                        </div>
                      </div>

                      <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-sm">
                        <p className="text-xs font-medium text-gray-700 leading-relaxed mb-3">
                          {log.details}
                        </p>
                        
                        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-200">
                          <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-1.5">
                            <FileText size={12} className="text-gray-400" /> Actor: <strong className="text-gray-900">{log.actor}</strong>
                          </span>
                          {log.metadata && Object.keys(log.metadata).length > 0 && (
                            <>
                              <span className="text-gray-300">•</span>
                              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                                Metadata: <span className="font-mono bg-white px-1.5 py-0.5 border border-gray-200 text-gray-600 rounded-sm lowercase tracking-normal">{JSON.stringify(log.metadata)}</span>
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
