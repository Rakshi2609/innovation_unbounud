"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/triage');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="p-6 bg-white border-4 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] text-center">
        <p className="font-black text-sm uppercase tracking-wider animate-pulse">
          Loading Financial Copilot Triage Queue...
        </p>
      </div>
    </div>
  );
}
