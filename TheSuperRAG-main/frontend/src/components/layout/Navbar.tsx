"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Layers, BookOpen, Sparkles, History, Plus } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [isHealthy, setIsHealthy] = useState(true);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch("http://localhost:8000/health/live");
        setIsHealthy(res.ok);
      } catch {
        setIsHealthy(false);
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { href: '/triage', label: 'Triage Queue', icon: Layers },
    { href: '/evaluate', label: 'Evaluate Case', icon: Plus },
    { href: '/policies', label: 'Policy Base', icon: BookOpen },
    { href: '/copilot', label: 'RAG Copilot', icon: Sparkles },
    { href: '/audit', label: 'Audit Log', icon: History }
  ];

  return (
    <header className="border-b-4 border-[#1A1A1A] bg-white sticky top-0 z-50">
      {/* Brand Header */}
      <div className="px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-4 border-b-2 border-[#1A1A1A]">
        <div className="flex items-center gap-3 w-full md:w-auto justify-between">
          <Link href="/triage" className="flex items-center gap-3 group">
            <div className="w-8 h-8 grid grid-cols-2 border-2 border-[#1A1A1A] overflow-hidden shadow-[2px_2px_0px_#1A1A1A] group-hover:rotate-6 transition-transform">
              <div className="bg-[#E23D28] rounded-br-full"></div>
              <div className="bg-[#0F4C81]"></div>
              <div className="bg-[#F5D04C]"></div>
              <div className="bg-[#1A1A1A] rounded-tl-full"></div>
            </div>
            <div>
              <h1 className="text-lg font-black uppercase tracking-wider text-[#1A1A1A]">
                AI Financial Safety & Lending Copilot
              </h1>
              <p className="text-[10px] font-bold text-[#8A8A8A] uppercase tracking-widest">
                Statistical ML · Grounded RAG · Human Governance
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 border-2 text-[10px] font-black uppercase ${
              isHealthy ? 'bg-[#28A745]/10 text-[#28A745] border-[#28A745]' : 'bg-[#E23D28]/10 text-[#E23D28] border-[#E23D28]'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isHealthy ? 'bg-[#28A745] animate-pulse' : 'bg-[#E23D28]'}`}></span>
              {isHealthy ? 'Backend Live (Port 8000)' : 'Backend Offline'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <Link
            href="/evaluate"
            className="flex items-center gap-1.5 bg-[#E23D28] text-white px-3.5 py-1.5 border-2 border-[#1A1A1A] font-black text-xs uppercase tracking-wider hover:bg-[#1A1A1A] hover:shadow-[3px_3px_0px_#1A1A1A] transition-all cursor-pointer"
          >
            <Plus size={14} /> New Case Evaluation
          </Link>
        </div>
      </div>

      {/* Route Navigation Tabs */}
      <div className="bg-[#F4F4F4] px-6 py-2 flex items-center gap-2 overflow-x-auto">
        {navLinks.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href || (pathname === '/' && tab.href === '/triage');
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex items-center gap-2 px-3.5 py-1.5 border-2 border-[#1A1A1A] text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[#1A1A1A] text-white shadow-[3px_3px_0px_#E23D28]'
                  : 'bg-white text-[#1A1A1A] hover:bg-[#E9ECEF]'
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
