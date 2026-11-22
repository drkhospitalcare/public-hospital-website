"use client";

import { Eye, EyeOff, Save, CheckCircle2, RotateCcw, Sparkles, Loader2 } from "lucide-react";

interface CMSHeaderBarProps {
  title: string;
  category: string;
  isPublished: boolean;
  hasDraft: boolean;
  updatedAt?: string;
  savingDraft: boolean;
  publishing: boolean;
  onSaveDraft: () => void;
  onPublish: () => void;
  onDiscardDraft?: () => void;
  onTogglePublish?: () => void;
  onOpenPreview: () => void;
}

export default function CMSHeaderBar({
  title,
  category,
  isPublished,
  hasDraft,
  updatedAt,
  savingDraft,
  publishing,
  onSaveDraft,
  onPublish,
  onDiscardDraft,
  onTogglePublish,
  onOpenPreview,
}: CMSHeaderBarProps) {
  return (
    <div className="card p-5 sm:p-6 border border-[#DCE8F0] bg-white shadow-2xs mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Title & Status */}
        <div>
          <div className="flex flex-wrap items-center gap-2.5 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#087FBA] bg-[#EFFBFC] px-2.5 py-0.5 rounded-full border border-[#DCE8F0]">
              {category}
            </span>

            {isPublished ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live on Website
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                <EyeOff size={11} />
                Hidden / Unpublished
              </span>
            )}

            {hasDraft && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                Draft Changes Pending
              </span>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-[#071B68]">{title}</h2>
          {updatedAt && (
            <p className="text-[11px] text-[#5D6B85] mt-1">
              Last saved: {new Date(updatedAt).toLocaleString()}
            </p>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenPreview}
            className="cursor-pointer inline-flex items-center gap-1.5 rounded-full border border-[#DCE8F0] bg-white px-4 py-2 text-xs font-bold text-[#071B68] hover:bg-[#EFFBFC] hover:border-[#087FBA] transition"
          >
            <Eye size={14} className="text-[#087FBA]" />
            <span>Live Preview</span>
          </button>

          {hasDraft && onDiscardDraft && (
            <button
              type="button"
              onClick={onDiscardDraft}
              title="Discard draft changes and revert to live version"
              className="cursor-pointer inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-[#5D6B85] hover:bg-slate-50 transition"
            >
              <RotateCcw size={13} />
              <span>Revert Draft</span>
            </button>
          )}

          <button
            type="button"
            disabled={savingDraft || publishing}
            onClick={onSaveDraft}
            className="cursor-pointer inline-flex items-center gap-1.5 rounded-full border border-[#087FBA] bg-white px-4 py-2 text-xs font-bold text-[#087FBA] hover:bg-[#EFFBFC] transition disabled:opacity-50"
          >
            {savingDraft ? (
              <Loader2 size={13} className="animate-spin text-[#087FBA]" />
            ) : (
              <Save size={13} />
            )}
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            disabled={publishing || savingDraft}
            onClick={onPublish}
            className="cursor-pointer inline-flex items-center gap-2 rounded-full bg-[#071B68] px-5 py-2 text-xs font-bold text-white hover:bg-[#087FBA] transition disabled:opacity-50 shadow-xs"
          >
            {publishing ? (
              <>
                <Loader2 size={13} className="animate-spin text-[#10C6C1]" />
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <Sparkles size={13} className="text-[#10C6C1]" />
                <span>Publish to Live Site</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

