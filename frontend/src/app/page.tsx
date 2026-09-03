'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Activity, Brain, Server, ArrowRight, Lock, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col font-sans text-[var(--text-primary)]">
      
      {/* Navbar (Clean & Minimal) */}
      <header className="w-full py-4 px-8 flex justify-between items-center bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[var(--text-primary)] flex items-center justify-center text-white font-bold shadow-sm">
            FS
          </div>
          <span className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)]">Financial Safety</span>
        </div>
        <div className="flex gap-4">
          <Link href="/audit">
            <button className="text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-gray-900 transition-colors px-3 py-2">Audit Dashboard</button>
          </Link>
          <Link href="/triage">
            <button className="bg-[var(--text-primary)] text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded shadow-sm hover:bg-gray-800 transition-colors flex items-center gap-2">
              Case Triage Queue <ArrowRight size={14} />
            </button>
          </Link>
        </div>
      </header>

      {/* Hero Section (Senior SaaS Style) */}
      <main className="w-full relative overflow-hidden bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 pt-12 pb-24 lg:pt-16 lg:pb-32 grid grid-cols-1 xl:grid-cols-2 gap-16 items-center">
          
          {/* Left: Copy & CTAs */}
          <div className="space-y-8">
            <h1 className="text-5xl md:text-6xl font-black tracking-tight text-[var(--text-primary)] leading-[1.1] uppercase">
              Intelligent Safety <br/>
              <span className="text-gray-400">For Indian Banking.</span>
            </h1>
            
            <p className="text-lg font-medium text-gray-600 max-w-xl leading-relaxed">
              An evidence-grounded AI layer that prevents financial distress and fraud. We combine Statistical ML risk detection with LangGraph-orchestrated policy retrieval to empower human officers with unassailable context.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link href="/triage">
                <button className="px-8 py-3.5 bg-[var(--accent)] text-white font-bold text-sm uppercase tracking-wider rounded shadow-sm hover:bg-blue-700 transition-colors flex items-center gap-2">
                  Live Case Queue
                </button>
              </Link>
              <Link href="/copilot">
                <button className="px-8 py-3.5 bg-white text-[var(--text-primary)] font-bold text-sm uppercase tracking-wider rounded border border-gray-300 shadow-sm hover:bg-gray-50 transition-colors">
                  Try Copilot
                </button>
              </Link>
            </div>
            
            <div className="flex items-center gap-6 pt-6 border-t border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
              <div className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-green-500" /> Human-in-the-Loop</div>
              <div className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-green-500" /> RBI Policy Grounded</div>
              <div className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-green-500" /> NPA Context Trained</div>
            </div>
          </div>

          {/* Right: Abstract Staggered UI Composition */}
          <div className="relative w-full h-[500px] hidden xl:block">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-50"></div>

            {/* Connecting Lines */}
            <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none" style={{ strokeDasharray: '4 4' }}>
              {/* Line from Card 1 to Card 2 */}
              <path d="M 280 140 L 150 140 L 150 220" fill="none" stroke="#D1D5DB" strokeWidth="2" />
              {/* Line from Card 2 to Card 3 */}
              <path d="M 150 320 L 150 400 L 200 400" fill="none" stroke="#D1D5DB" strokeWidth="2" />
            </svg>

            {/* Card 1: ML Risk Engine */}
            <div className="absolute top-4 right-8 w-72 bg-white border-2 border-gray-200 rounded shadow-sm z-10 hover:border-gray-300 hover:shadow-md transition-all">
              <div className="p-4 border-b-2 border-gray-100 flex justify-between items-center bg-[#FAFAFA]">
                <span className="text-xs font-black uppercase tracking-wider text-gray-800 flex items-center gap-2">
                  <Activity size={14} className="text-red-500" /> Risk Engine
                </span>
                <span className="text-[10px] font-black tracking-widest bg-red-100 text-red-700 px-2 py-0.5 rounded uppercase">Elevated</span>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Predicted Distress</div>
                  <div className="text-4xl font-black text-gray-900 tracking-tighter">85<span className="text-lg text-gray-400 font-bold">%</span></div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase text-gray-500">
                    <span>DTI Ratio</span>
                    <span className="text-red-600">46%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="w-[46%] h-full bg-red-500"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: TheSuperRAG Retrieval */}
            <div className="absolute top-44 left-0 w-[300px] bg-white border-2 border-blue-200 rounded shadow-md z-20 hover:shadow-lg transition-all">
              <div className="p-4 border-b-2 border-blue-100 bg-blue-50/50 flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-blue-900 flex items-center gap-2">
                  <Server size={14} className="text-blue-600" /> Policy Retrieval
                </span>
                <span className="text-[10px] font-bold text-blue-600">Score: 0.92</span>
              </div>
              <div className="p-5">
                <div className="text-[11px] font-black text-gray-900 uppercase tracking-wider mb-2">Clause 4.2: Hardship Relief</div>
                <div className="text-xs font-medium text-gray-600 leading-relaxed border-l-2 border-blue-400 pl-3 italic">
                  "For borrowers exhibiting early distress signals (DTI &gt; 45%), initiate proactive restructuring options prior to default..."
                </div>
              </div>
            </div>

            {/* Card 3: AI Recommendation */}
            <div className="absolute bottom-6 right-16 w-80 bg-gray-900 text-white border-2 border-gray-800 rounded shadow-xl z-30 hover:-translate-y-1 transition-all">
              <div className="p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded bg-white/10 flex items-center justify-center shrink-0">
                  <ShieldCheck size={18} className="text-green-400" />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-green-400 mb-1.5">AI Recommendation</div>
                  <div className="text-sm font-medium leading-relaxed mb-4 text-gray-100">
                    Offer 3-month moratorium. Do not initiate standard collections.
                  </div>
                  <button className="text-[10px] font-black uppercase tracking-widest bg-white text-gray-900 px-4 py-2 rounded hover:bg-gray-200 transition-colors w-full text-center">
                    Authorize Intervention
                  </button>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </main>

      {/* End-to-End Workflow Section */}
      <section className="w-full py-24 px-8 bg-[#F9FAFB] border-b border-gray-200">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-black uppercase tracking-tight text-[var(--text-primary)]">The Golden Path</h2>
            <p className="text-base font-medium text-gray-500 max-w-2xl mx-auto">
              A fully observable, deterministic pipeline from raw telemetry to human intervention.
            </p>
          </div>
          
          <div className="relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
              
              {/* Step 1 */}
              <div className="bg-white p-6 border-2 border-gray-200 rounded-lg shadow-sm hover:border-blue-300 transition-colors">
                 <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-black flex items-center justify-center text-sm mb-4 border-4 border-white shadow-sm mx-auto md:mx-0">
                   1
                 </div>
                 <h3 className="text-sm font-black uppercase text-gray-900 mb-2 text-center md:text-left">Continuous Ingestion</h3>
                 <p className="text-xs font-medium text-gray-500 leading-relaxed text-center md:text-left">
                   Ingests real-time banking telemetry, tracking DTI ratios, rolling cashflows, and unusual transaction spikes.
                 </p>
              </div>

              {/* Step 2 */}
              <div className="bg-white p-6 border-2 border-gray-200 rounded-lg shadow-sm hover:border-red-300 transition-colors">
                 <div className="w-10 h-10 rounded-full bg-red-100 text-red-700 font-black flex items-center justify-center text-sm mb-4 border-4 border-white shadow-sm mx-auto md:mx-0">
                   2
                 </div>
                 <h3 className="text-sm font-black uppercase text-gray-900 mb-2 text-center md:text-left">ML Risk Inference</h3>
                 <p className="text-xs font-medium text-gray-500 leading-relaxed text-center md:text-left">
                   Local LightGBM models trained on Indian NPA data evaluate the profile to predict distress probability and fraud risk.
                 </p>
              </div>

              {/* Step 3 */}
              <div className="bg-white p-6 border-2 border-gray-200 rounded-lg shadow-sm hover:border-purple-300 transition-colors">
                 <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 font-black flex items-center justify-center text-sm mb-4 border-4 border-white shadow-sm mx-auto md:mx-0">
                   3
                 </div>
                 <h3 className="text-sm font-black uppercase text-gray-900 mb-2 text-center md:text-left">TheSuperRAG Engine</h3>
                 <p className="text-xs font-medium text-gray-500 leading-relaxed text-center md:text-left">
                   Retrieves exact regulatory clauses and internal policies (e.g., Hardship Relief) based on the flagged ML anomalies.
                 </p>
              </div>

              {/* Step 4 */}
              <div className="bg-white p-6 border-2 border-gray-200 rounded-lg shadow-sm hover:border-green-300 transition-colors">
                 <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 font-black flex items-center justify-center text-sm mb-4 border-4 border-white shadow-sm mx-auto md:mx-0">
                   4
                 </div>
                 <h3 className="text-sm font-black uppercase text-gray-900 mb-2 text-center md:text-left">Human Decision</h3>
                 <p className="text-xs font-medium text-gray-500 leading-relaxed text-center md:text-left">
                   LangGraph grounds the LLM synthesis, presenting a deterministic recommendation to the Bank Officer for final approval.
                 </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Architecture Deep Dive */}
      <section className="w-full py-24 px-8 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-black uppercase tracking-tight text-[var(--text-primary)]">Architecture & Pipeline</h2>
            <p className="text-base font-medium text-gray-500 max-w-2xl mx-auto">
              How we orchestrate Statistical Machine Learning, Qdrant Vector Stores, and LangGraph into a single unified engine without sacrificing safety.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 border border-gray-200 rounded bg-white hover:border-gray-300 transition-colors">
               <div className="w-12 h-12 rounded bg-red-50 text-red-600 flex items-center justify-center mb-6">
                 <Activity size={24} />
               </div>
               <h3 className="text-sm font-black uppercase mb-3 text-gray-900">1. Statistical ML Layer</h3>
               <p className="text-sm text-gray-500 leading-relaxed font-medium">
                 Robust models trained on Indian Financial NPA Datasets analyze structured metrics (DTI, utilization, delinquency history) to output calibrated risk probabilities.
               </p>
            </div>
            
            <div className="p-8 border border-gray-200 rounded bg-white hover:border-gray-300 transition-colors">
               <div className="w-12 h-12 rounded bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                 <Server size={24} />
               </div>
               <h3 className="text-sm font-black uppercase mb-3 text-gray-900">2. TheSuperRAG Policy Engine</h3>
               <p className="text-sm text-gray-500 leading-relaxed font-medium">
                 Maps the ML prediction to specific institutional policies using a Qdrant hybrid vector store. Cross-encodes and reranks markdown procedures to fetch exact clauses.
               </p>
            </div>

            <div className="p-8 border border-gray-200 rounded bg-white hover:border-gray-300 transition-colors">
               <div className="w-12 h-12 rounded bg-purple-50 text-purple-600 flex items-center justify-center mb-6">
                 <Brain size={24} />
               </div>
               <h3 className="text-sm font-black uppercase mb-3 text-gray-900">3. LangGraph Orchestration</h3>
               <p className="text-sm text-gray-500 leading-relaxed font-medium">
                 A 10-node agentic workflow routes the data. It forces the LLM to ground its reasoning exclusively on retrieved evidence, passing the final assessment through a rigid safety guardrail.
               </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="w-full py-24 px-8 bg-[#FAFAFA]">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-black uppercase tracking-tight text-[var(--text-primary)]">Unified Capabilities</h2>
            <p className="text-base font-medium text-gray-500 max-w-2xl mx-auto">
              Solving distinct banking challenges through one intelligent pipeline.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: <Lock size={20}/>, color: 'text-red-600', bg: 'bg-red-50', title: 'Digital Fraud Protection', text: 'Combines transaction anomalies with contextual device trust scores. When flagged, RAG retrieves specific step-up authentication procedures or senior-citizen scam protections rather than issuing generic errors.' },
              { icon: <Activity size={20}/>, color: 'text-blue-600', bg: 'bg-blue-50', title: 'Distress Prevention', text: 'Continuously analyzes utilization and DTI ratios. Identifies early pressure patterns and retrieves hardship relief and debt restructuring policies before the customer defaults.' },
              { icon: <ShieldCheck size={20}/>, color: 'text-yellow-600', bg: 'bg-yellow-50', title: 'Gig Worker Resilience', text: 'Traditional underwriting penalizes irregular income. Our context engine evaluates rolling averages and platform activity to recommend micro-liquidity lines tailored to informal cashflows.' },
              { icon: <CheckCircle2 size={20}/>, color: 'text-green-600', bg: 'bg-green-50', title: 'Accessibility Layer', text: 'Transforms complex ML logic and dense institutional policies into clear, step-by-step guidance. Designed for elderly, disabled, and first-time digital banking users to ensure informed consent.' }
            ].map((feature, idx) => (
              <div key={idx} className="p-8 bg-white border border-gray-200 rounded shadow-sm hover:shadow-md transition-shadow flex items-start gap-5">
                <div className={`w-10 h-10 rounded shrink-0 flex items-center justify-center ${feature.bg} ${feature.color}`}>
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="font-medium text-gray-500 leading-relaxed text-sm">
                    {feature.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Trust Section */}
      <section className="w-full py-24 px-8 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-gray-800 text-gray-300 font-bold text-[10px] uppercase tracking-widest border border-gray-700">
              Enterprise Grade
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tight text-white">
              Data Security & Governance
            </h2>
            <p className="text-gray-400 font-medium leading-relaxed">
              We understand that financial telemetry is highly sensitive. The AI Financial Safety platform is built from the ground up to ensure strict compliance with Indian banking standards and data localization policies.
            </p>
            <ul className="space-y-4 pt-4">
              {[
                'Zero-Retention LLM Prompts (No PII Training)',
                'Local Fallback ML Models (Operates air-gapped)',
                'Cryptographically Signed Audit Trails for every decision',
                'RBI Compliant RAG Indexing'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-bold text-gray-300">
                  <CheckCircle2 size={16} className="text-green-400" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
             <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 blur-3xl opacity-20 rounded-full"></div>
             <div className="bg-gray-800 border border-gray-700 p-8 rounded-lg relative z-10 shadow-2xl">
               <h3 className="text-sm font-black uppercase text-gray-100 mb-4 border-b border-gray-700 pb-2">Immutable Audit Log</h3>
               <div className="space-y-3 font-mono text-[10px] text-gray-400">
                 <div className="flex gap-4"><span className="text-gray-500">Hash:</span> <span className="text-blue-300">0x8f2a...9c1b</span></div>
                 <div className="flex gap-4"><span className="text-gray-500">Action:</span> <span className="text-green-300">OFFICER_APPROVED</span></div>
                 <div className="flex gap-4"><span className="text-gray-500">User:</span> <span>OFFICER-402 (Priya Nair)</span></div>
                 <div className="flex gap-4"><span className="text-gray-500">Policy:</span> <span>Clause 4.2 Restructuring</span></div>
                 <div className="flex gap-4"><span className="text-gray-500">Timestamp:</span> <span>2026-09-04T08:42:01Z</span></div>
                 <div className="mt-4 pt-4 border-t border-gray-700 text-green-400 flex items-center gap-2">
                   <ShieldCheck size={14} /> Cryptographic Signature Verified
                 </div>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* Fat Footer */}
      <footer className="w-full bg-white border-t border-gray-200 pt-16 pb-8">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            
            <div className="space-y-4 md:col-span-1">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-[var(--text-primary)] flex items-center justify-center text-white font-bold text-[10px]">
                  FS
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-[var(--text-primary)]">Financial Safety</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed font-medium">
                Pioneering evidence-grounded AI solutions for financial inclusion, fraud defense, and borrower resilience.
              </p>
            </div>
            
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-gray-900 mb-4">Platform</h4>
              <ul className="space-y-3 text-xs font-medium text-gray-500">
                <li><Link href="/triage" className="hover:text-blue-600 transition-colors">Case Triage Queue</Link></li>
                <li><Link href="/copilot" className="hover:text-blue-600 transition-colors">TheSuperRAG Copilot</Link></li>
                <li><Link href="/evaluate" className="hover:text-blue-600 transition-colors">ML Risk Engine</Link></li>
                <li><Link href="/audit" className="hover:text-blue-600 transition-colors">Audit & Compliance</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-gray-900 mb-4">Architecture</h4>
              <ul className="space-y-3 text-xs font-medium text-gray-500">
                <li><span className="hover:text-blue-600 transition-colors cursor-pointer">LangGraph Workflows</span></li>
                <li><span className="hover:text-blue-600 transition-colors cursor-pointer">Qdrant Vector Store</span></li>
                <li><span className="hover:text-blue-600 transition-colors cursor-pointer">Local ML Pipelines</span></li>
                <li><span className="hover:text-blue-600 transition-colors cursor-pointer">NPA Datasets</span></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-gray-900 mb-4">Legal & Support</h4>
              <ul className="space-y-3 text-xs font-medium text-gray-500">
                <li><span className="hover:text-blue-600 transition-colors cursor-pointer">API Documentation</span></li>
                <li><span className="hover:text-blue-600 transition-colors cursor-pointer">Data Privacy Policy</span></li>
                <li><span className="hover:text-blue-600 transition-colors cursor-pointer">System Status</span></li>
                <li><span className="hover:text-blue-600 transition-colors cursor-pointer">Contact Security</span></li>
              </ul>
            </div>

          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-100 text-[11px] text-gray-400 font-medium">
            <span>&copy; 2026 AI Financial Safety Platform. All rights reserved.</span>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <span>Orchestrated by <strong className="text-gray-600">LangGraph</strong> &amp; <strong className="text-gray-600">TheSuperRAG</strong></span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

