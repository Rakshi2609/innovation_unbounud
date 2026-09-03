"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Layers, BookOpen, Sparkles, History, Plus, ShieldAlert } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [isHealthy, setIsHealthy] = useState(true);

  useEffect(() => {
    let active = true;
    const checkHealth = async () => {
      try {
        const res = await fetch("http://localhost:8000/health/live");
        if (active) setIsHealthy(res.ok);
      } catch {
        if (active) setIsHealthy(false);
      }
    };
    checkHealth();
    return () => { active = false; };
  }, [pathname]);

  const navLinks = [
    { href: '/triage', label: 'Triage Queue', icon: Layers },
    { href: '/evaluate', label: 'Evaluate Case', icon: Plus },
    { href: '/policies', label: 'Policy Base', icon: BookOpen },
    { href: '/copilot', label: 'RAG Copilot', icon: Sparkles },
    { href: '/grievance', label: 'Grievance Portal', icon: ShieldAlert },
    { href: '/audit', label: 'Audit Log', icon: History }
  ];

  if (pathname === '/') return null;

  return (
    <header className="bg-white sticky top-0 z-50 border-b-2 border-gray-200">
      <div className="px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-6 w-full md:w-auto">
          <Link href="/triage" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-900 text-white flex items-center justify-center font-black text-lg">
              FS
            </div>
            <div>
              <h1 className="text-xl font-black uppercase tracking-tight text-gray-900 flex items-center gap-2">
                Financial Safety <span className="text-blue-600">Copilot</span>
              </h1>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">
                Statistical ML · Grounded RAG
              </p>
            </div>
          </Link>

          <div className="hidden md:flex items-center">
            <span className={`inline-flex items-center gap-2 px-3 py-1 text-[10px] font-black uppercase tracking-widest border-2 ${
              isHealthy ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
            }`}>
              <span className={`relative flex h-2 w-2`}>
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isHealthy ? 'bg-green-400' : 'bg-red-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isHealthy ? 'bg-green-500' : 'bg-red-500'}`}></span>
              </span>
              {isHealthy ? 'System Active' : 'System Offline'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Link
            href="/evaluate"
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-colors w-full md:w-auto"
          >
            <Plus size={14} /> New Case Evaluation
          </Link>
        </div>
      </div>

      <div className="px-6 flex items-center gap-1 overflow-x-auto border-t-2 border-gray-100 bg-white custom-scrollbar">
        {navLinks.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href || (pathname === '/' && tab.href === '/triage');
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`shrink-0 flex items-center gap-2 px-4 py-3 text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap border-b-4 ${
                isActive
                  ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                  : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon size={14} />
              {tab.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}


