"use client";

import React, { useState, useEffect } from 'react';
import { Sparkles, Send, BookOpen, Layers, Bot } from 'lucide-react';

const API_BASE = "http://localhost:8000";

interface Citation {
  policy_name: string;
  clause: string;
  snippet: string;
}

interface Message {
  role: 'user' | 'assistant';
  text: string;
  citations?: Citation[];
}

export default function CopilotPage() {
  const [cases, setCases] = useState<any[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([
    {
     role: 'assistant',
     text: "Namaste! I am your AI Financial Safety & Lending Copilot. I can query our institutional policy guidelines, explain credit distress risk factors, and recommend responsible debt workouts. Ask me anything!",
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/api/v1/cases`)
     .then(res => res.json())
     .then(data => {
       if (data.cases && data.cases.length > 0) {
         setCases(data.cases);
         setSelectedCaseId(data.cases[0].case_id);
       }
     })
     .catch(console.error);
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userQ = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userQ }]);
    setLoading(true);

    try {
      let answer = '';
      let citations: Citation[] = [];
      let usedLLM = false;

      if (selectedCaseId) {
        // Real backend call — grounded in case context + retrieved policies
        const history = messages
          .filter(m => m.role === 'user' || m.role === 'assistant')
          .map(m => ({ role: m.role as 'user' | 'assistant', content: m.text }));
        const res = await fetch(`${API_BASE}/api/v1/cases/${selectedCaseId}/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: userQ, history }),
        });
        if (res.ok) {
          const data = await res.json();
          answer = data.answer || '';
          citations = (data.citations || []).map((c: any) => ({
            policy_name: c.policy_name,
            clause: c.clause,
            snippet: c.snippet,
          }));
          usedLLM = !!data.used_llm;
        } else {
          answer = `⚠️ Could not reach backend (${res.status}). Make sure the API is running on ${API_BASE}.`;
        }
      } else {
        answer = 'Please select a case from the dropdown above before asking a question.';
      }

      setMessages(prev => [...prev, { role: 'assistant', text: answer, citations }]);
      setLoading(false);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: `⚠️ Network error: ${err instanceof Error ? err.message : String(err)}`,
       }]);
       setLoading(false);
     }
    };

  return (
    <div className="max-w-5xl mx-auto p-6">
     <div className="bg-white border-4 border-[#1A1A1A] shadow-[6px_6px_0px_#1A1A1A] flex flex-col h-[78vh]">
       {/* Header Bar */}
       <div className="p-4 border-b-4 border-[#1A1A1A] bg-[#F4F4F4] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
         <div className="flex items-center gap-2">
           <Sparkles size={18} className="text-[#E23D28]" />
           <h1 className="font-black text-sm uppercase text-[#1A1A1A]">
             RAG Copilot: Case & Policy Assistant
           </h1>
         </div>

         <div className="flex items-center gap-2 text-xs font-bold">
           <span className="text-gray-500">Case Context:</span>
           <select
             value={selectedCaseId}
             onChange={e => setSelectedCaseId(e.target.value)}
             className="border-2 border-[#1A1A1A] px-3 py-1 bg-white font-bold text-xs uppercase cursor-pointer"
           >
             {cases.map(c => (
               <option key={c.case_id} value={c.case_id}>
                 {c.customer_name} ({c.risk_class} Risk)
               </option>
             ))}
           </select>
         </div>
       </div>

       {/* Message Log */}
       <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4 bg-[#FAFAFA]">
         {messages.map((msg, idx) => (
           <div
             key={idx}
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
                   <p className="text-[10px] font-black uppercase text-[#0F4C81] mb-1">
                     Exact Policy Citations:
                   </p>
                   {msg.citations.map((c, ci) => (
                     <div key={ci} className="text-[10px] text-gray-700 bg-blue-50/50 p-2 mb-1.5 border border-blue-200">
                       <strong className="block text-[#0F4C81]">[{ci+1}] {c.policy_name} ({c.clause})</strong>
                       <span className="italic text-gray-600">"{c.snippet}"</span>
                     </div>
                   ))}
                 </div>
               )}
             </div>
           </div>
         ))}

         {loading && (
           <div className="self-start p-3 bg-white border-2 border-[#1A1A1A] text-xs font-bold animate-pulse">
             Consulting vector index & policy guidelines...
           </div>
         )}
       </div>

       {/* Quick Question Prompts */}
       <div className="px-6 py-2 bg-white border-t-2 border-[#1A1A1A] flex gap-2 overflow-x-auto text-xs">
         <button
           onClick={() => setInput("Why was this customer flagged for credit distress?")}
           className="px-2.5 py-1 bg-gray-100 border border-[#1A1A1A] font-bold text-[11px] hover:bg-yellow-100 whitespace-nowrap cursor-pointer"
         >
           Why was customer flagged?
         </button>
         <button
           onClick={() => setInput("What debt restructuring terms apply under Clause 3.2?")}
           className="px-2.5 py-1 bg-gray-100 border border-[#1A1A1A] font-bold text-[11px] hover:bg-yellow-100 whitespace-nowrap cursor-pointer"
         >
           What restructuring terms apply?
         </button>
         <button
           onClick={() => setInput("What fraud precautions are mandated for senior citizens under Clause 2.1?")}
           className="px-2.5 py-1 bg-gray-100 border border-[#1A1A1A] font-bold text-[11px] hover:bg-yellow-100 whitespace-nowrap cursor-pointer"
         >
           Senior citizen fraud protections?
         </button>
       </div>

       {/* Input Bar */}
       <div className="p-4 border-t-4 border-[#1A1A1A] bg-white flex items-center gap-3">
         <input
           type="text"
           value={input}
           onChange={e => setInput(e.target.value)}
           onKeyDown={e => e.key === 'Enter' && handleSend()}
           placeholder="Ask about banking policies, DTI limits, restructuring rules..."
           className="flex-1 px-4 py-2.5 border-2 border-[#1A1A1A] text-xs font-bold"
         />
         <button
           onClick={handleSend}
           disabled={loading}
           className="bg-[#1A1A1A] text-white px-5 py-2.5 border-2 border-[#1A1A1A] font-black text-xs uppercase hover:bg-[#E23D28] transition-all cursor-pointer flex items-center gap-2"
         >
           <Send size={14} /> Send
         </button>
       </div>
     </div>
    </div>
  );
}
