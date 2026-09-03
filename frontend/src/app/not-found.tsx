import Link from 'next/link';
import { ArrowLeft, Layers, ShieldAlert } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto p-6 mt-16">
      <div className="bg-white border-4 border-[#1A1A1A] p-8 shadow-[8px_8px_0px_#E23D28] text-center">
        <div className="w-16 h-16 bg-[#E23D28] text-white font-black text-2xl flex items-center justify-center border-2 border-[#1A1A1A] mx-auto mb-4 shadow-[3px_3px_0px_#1A1A1A]">
          404
        </div>
        <h1 className="text-2xl font-black uppercase text-[#1A1A1A] mb-2">
          Page Not Found
        </h1>
        <p className="text-xs font-bold text-gray-600 mb-6">
          The requested route does not exist. Navigate to the core financial safety modules below:
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Link
            href="/triage"
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#1A1A1A] text-white border-2 border-[#1A1A1A] font-black text-xs uppercase hover:bg-[#E23D28] transition-all"
          >
            <Layers size={14} /> Go to Triage Queue
          </Link>
          <Link
            href="/grievance"
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-[#1A1A1A] border-2 border-[#1A1A1A] font-black text-xs uppercase hover:bg-gray-100 transition-all"
          >
            <ShieldAlert size={14} /> Grievance Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
