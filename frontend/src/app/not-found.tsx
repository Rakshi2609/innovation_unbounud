import Link from 'next/link';
import { ArrowLeft, Layers, ShieldAlert } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto p-6 mt-16">
      <div className="bg-white border-2 border-[var(--border-strong)] p-8 shadow-md text-center">
        <div className="w-16 h-16 bg-[var(--accent)] text-white font-black text-2xl flex items-center justify-center border-2 border-[var(--border-strong)] mx-auto mb-4 shadow-md">
          404
        </div>
        <h1 className="text-2xl font-black uppercase text-[var(--text-primary)] mb-2">
          Page Not Found
        </h1>
        <p className="text-xs font-bold text-gray-600 mb-6">
          The requested route does not exist. Navigate to the core financial safety modules below:
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Link
            href="/triage"
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-800 text-white border-2 border-[var(--border-strong)] font-black text-xs uppercase hover:bg-[var(--accent)] transition-all"
          >
            <Layers size={14} /> Go to Triage Queue
          </Link>
          <Link
            href="/grievance"
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-[var(--text-primary)] border-2 border-[var(--border-strong)] font-black text-xs uppercase hover:bg-gray-100 transition-all"
          >
            <ShieldAlert size={14} /> Grievance Portal
          </Link>
        </div>
      </div>
    </div>
  );
}


