"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, ChevronDown, ChevronUp, Copy, Database, ExternalLink, KeyRound, ShieldAlert } from "lucide-react";

interface SupabaseSetupBannerProps {
  configured: boolean;
}

export default function SupabaseSetupBanner({ configured }: SupabaseSetupBannerProps) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const envSnippet = `NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co\nNEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here`;

  const copyEnvSnippet = () => {
    navigator.clipboard.writeText(envSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (configured) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 mb-6 shadow-2xs">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs sm:text-sm font-bold text-emerald-800">
              Supabase Database & Storage Connected
            </span>
          </div>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
            Live Mode Active
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-amber-300 bg-amber-50/90 p-5 mb-8 shadow-xs">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
            <ShieldAlert size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-amber-900">
                Supabase Credentials Required for Live Gallery Management
              </h3>
              <span className="rounded-full bg-amber-200/80 px-2 py-0.5 text-[10px] font-bold text-amber-900 uppercase tracking-wider">
                Setup Needed
              </span>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-amber-800 leading-relaxed">
              Real image uploads, storage bucket storage, edit actions, and live database persistence require your Supabase project credentials. Currently running in demo archive mode.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="shrink-0 flex items-center gap-1.5 rounded-xl border border-amber-300 bg-white px-3 py-1.5 text-xs font-bold text-amber-900 hover:bg-amber-100 transition-all cursor-pointer"
        >
          <span>{expanded ? "Hide Guide" : "Setup Guide"}</span>
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {expanded && (
        <div className="mt-5 border-t border-amber-200/80 pt-4 text-xs text-amber-900 space-y-3">
          <p className="font-bold text-amber-950">Follow these 4 quick steps to connect your Supabase backend:</p>
          
          <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm leading-relaxed pl-1 text-amber-900">
            <li>
              <strong>Create a Supabase Project:</strong> Go to{" "}
              <a
                href="https://supabase.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-bold text-[#087FBA] inline-flex items-center gap-1"
              >
                supabase.com <ExternalLink size={12} />
              </a>{" "}
              and create a free project.
            </li>
            <li>
              <strong>Execute SQL Schema:</strong> Open the <strong>SQL Editor</strong> in your Supabase dashboard and run the script from{" "}
              <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono font-bold text-amber-950">
                supabase-schema.sql
              </code>{" "}
              (located in the project root). This creates the <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">gallery_images</code> table, RLS policies, and the <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">gallery-images</code> storage bucket.
            </li>
            <li>
              <strong>Configure .env.local:</strong> Create a <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono font-bold text-amber-950">.env.local</code> file in your project root with your credentials:
            </li>
          </ol>

          {/* Code snippet block */}
          <div className="relative mt-2 rounded-xl bg-slate-900 p-4 font-mono text-xs text-slate-100 overflow-x-auto shadow-inner">
            <button
              type="button"
              onClick={copyEnvSnippet}
              className="absolute top-2.5 right-2.5 flex items-center gap-1.5 rounded-lg bg-slate-800 px-2.5 py-1 text-[11px] font-sans font-semibold text-slate-200 hover:bg-slate-700 transition"
            >
              {copied ? <CheckCircle2 size={13} className="text-emerald-400" /> : <Copy size={13} />}
              <span>{copied ? "Copied" : "Copy Template"}</span>
            </button>
            <pre className="text-blue-300">{envSnippet}</pre>
          </div>

          <p className="text-xs text-amber-800 pt-1">
            4. <strong>Create Admin User:</strong> In your Supabase dashboard under <em>Authentication &gt; Users &gt; Add User</em>, create an administrator user with email and password to log in.
          </p>
        </div>
      )}
    </div>
  );
}

