"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { AlertTriangle, RefreshCw, Home, Phone, ArrowRight } from "lucide-react";
import { HOSPITAL_INFO } from "@/lib/hospital-info";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to client console safely
    console.error("DRK Hospital Application Runtime Error:", error);
  }, [error]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="w-full max-w-xl text-center">
        {/* Hospital Branding */}
        <div className="flex justify-center mb-6">
          <Image
            src="/images/drk-logo.png"
            alt="DRK Hospital"
            width={180}
            height={60}
            className="h-12 w-auto object-contain"
            priority
          />
        </div>

        {/* Error Icon Badge */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 shadow-xs">
          <AlertTriangle size={32} />
        </div>

        {/* Heading & Explanation */}
        <span className="inline-block rounded-full bg-[#EFFBFC] px-3.5 py-1 text-xs font-bold text-[#087FBA] uppercase tracking-wider mb-3">
          Clinical Portal Notice
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#071B68] tracking-tight">
          Temporary Experience Interruption
        </h1>
        <p className="mt-3 text-sm sm:text-base text-[#5D6B85] leading-relaxed max-w-md mx-auto">
          We experienced an unexpected issue loading this page. Our team has been notified. You can refresh the view or return to the main hospital portal.
        </p>

        {error?.digest && (
          <p className="mt-2 font-mono text-[11px] text-slate-400">
            Reference Code: {error.digest}
          </p>
        )}

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#071B68] px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#087FBA] transition-all cursor-pointer"
          >
            <RefreshCw size={16} />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-[#DCE8F0] bg-white px-6 py-3 text-sm font-bold text-[#071B68] hover:bg-[#EFFBFC] transition-all shadow-2xs"
          >
            <Home size={16} className="text-[#087FBA]" />
            <span>Return to Homepage</span>
          </Link>
        </div>

        {/* Hospital Helpline Banner */}
        <div className="mt-10 pt-6 border-t border-[#DCE8F0] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#5D6B85] bg-[#F8FDFF] p-4 rounded-2xl">
          <div className="flex items-center gap-2">
            <Phone size={14} className="text-[#10C6C1] shrink-0" />
            <span>Need immediate clinical assistance?</span>
          </div>
          <a
            href={`tel:${HOSPITAL_INFO.phone.primaryRaw}`}
            className="font-bold text-[#071B68] hover:text-[#087FBA] inline-flex items-center gap-1 transition"
          >
            <span>{HOSPITAL_INFO.phone.primary}</span>
            <ArrowRight size={13} />
          </a>
        </div>
      </div>
    </div>
  );
}

