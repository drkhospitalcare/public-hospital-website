"use client";

import { X, ExternalLink, Sparkles, AlertCircle } from "lucide-react";
import SafeImage from "@/components/SafeImage";

interface LivePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectionTitle: string;
  previewData: any;
  onPublishDirectly?: () => void;
}

export default function LivePreviewModal({
  isOpen,
  onClose,
  sectionTitle,
  previewData,
  onPublishDirectly,
}: LivePreviewModalProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#071B68]/60 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col max-h-[92vh] max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#DCE8F0]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#DCE8F0] bg-[#F8FDFF]">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#10C6C1]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#087FBA]">
                Live Layout Preview
              </span>
            </div>
            <h3 className="text-lg font-extrabold text-[#071B68] mt-0.5">{sectionTitle}</h3>
          </div>

          <div className="flex items-center gap-3">
            {onPublishDirectly && (
              <button
                type="button"
                onClick={() => {
                  onPublishDirectly();
                  onClose();
                }}
                className="cursor-pointer inline-flex items-center gap-1.5 rounded-full bg-[#071B68] px-4 py-2 text-xs font-bold text-white hover:bg-[#087FBA] transition shadow-xs"
              >
                <Sparkles size={13} className="text-[#10C6C1]" />
                <span>Publish Now</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-full p-2 text-[#5D6B85] hover:bg-slate-100 hover:text-[#071B68] transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Notice */}
        <div className="bg-amber-50 px-5 py-2.5 border-b border-amber-200 flex items-center gap-2 text-xs text-amber-900">
          <AlertCircle size={14} className="text-amber-700 shrink-0" />
          <span>
            This is an interactive simulation of your edited content. Click <strong>Publish to Live Site</strong> when you are ready to make these changes visible to public visitors.
          </span>
        </div>

        {/* Content Viewer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Card Presentation of Key Preview Fields */}
          <div className="space-y-4">
            {previewData?.heading && (
              <div>
                <span className="text-[10px] font-bold uppercase text-[#087FBA]">Headline</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#071B68] mt-0.5">
                  {previewData.heading}
                </h2>
              </div>
            )}

            {previewData?.eyebrow && (
              <div className="inline-block bg-[#EFFBFC] text-[#071B68] px-3 py-1 rounded-full text-xs font-bold border border-[#DCE8F0]">
                {previewData.eyebrow}
              </div>
            )}

            {previewData?.description && (
              <div>
                <span className="text-[10px] font-bold uppercase text-[#087FBA]">Description</span>
                <p className="text-sm text-[#5D6B85] leading-relaxed mt-0.5">
                  {previewData.description}
                </p>
              </div>
            )}

            {/* If a logo exists (e.g. Footer Settings) */}
            {previewData?.logoUrl && (
              <div>
                <span className="text-[10px] font-bold uppercase text-[#087FBA]">Footer Brand Logo</span>
                <div className="mt-1.5 p-6 rounded-2xl bg-[#071B68] border border-[#087FBA]/30 max-w-sm">
                  <div className="inline-flex items-center justify-center rounded-2xl bg-white p-3.5 shadow-md">
                    <div className="relative h-12 w-44">
                      <SafeImage
                        src={previewData.logoUrl}
                        alt={previewData?.logoAlt || "Footer Logo Preview"}
                        fill
                        className="object-contain"
                        sizes="176px"
                        fallbackSrc="/images/drk-logo.png"
                      />
                    </div>
                  </div>
                  {previewData?.caption && (
                    <p className="text-xs text-white/70 mt-3 font-medium">{previewData.caption}</p>
                  )}
                </div>
              </div>
            )}

            {/* If Founder Profile exists (e.g. About Page Preview) */}
            {previewData?.aboutFounder && (
              <div className="rounded-2xl border border-blue-200 bg-[#F8FDFF] p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#10C6C1]" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#087FBA]">
                    Founder Profile Section ({previewData.aboutFounder.enabled ? "Active" : "Disabled"})
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-[#071B68]">
                    {previewData.aboutFounder.founderName}
                  </h3>
                  <p className="text-xs font-semibold text-[#087FBA]">
                    {previewData.aboutFounder.founderDesignation} • DRK Hospitals & RRK Hospitals
                  </p>
                </div>
                <div className="rounded-xl border border-[#DCE8F0] bg-white p-3.5 text-xs text-[#14234B] italic leading-relaxed">
                  &ldquo;{previewData.aboutFounder.founderStatement}&rdquo;
                </div>
                {previewData.aboutFounder.photoUrl && (
                  <div className="relative aspect-[3/4] w-36 rounded-xl overflow-hidden border border-[#DCE8F0]">
                    <SafeImage
                      src={previewData.aboutFounder.photoUrl}
                      alt={previewData.aboutFounder.photoAlt || "Founder Portrait"}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                {previewData.aboutFounder.qualifications && previewData.aboutFounder.qualifications.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#071B68] block mb-1.5">
                      Educational Qualifications
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {previewData.aboutFounder.qualifications.map((q: string, idx: number) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-[#E8F3FA] text-[#087FBA] text-[11px] font-semibold border border-blue-200">
                          {q}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {previewData.aboutFounder.specialisations && previewData.aboutFounder.specialisations.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#071B68] block mb-1.5">
                      Professional Specialisations
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {previewData.aboutFounder.specialisations.map((s: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-2 p-1.5 rounded-lg bg-white border border-[#DCE8F0] text-xs font-medium text-[#14234B]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#10C6C1]" />
                          <span>{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* If an image exists */}
            {(previewData?.clinicImage || previewData?.image || previewData?.departmentImage) && (
              <div>
                <span className="text-[10px] font-bold uppercase text-[#087FBA]">Section Image</span>
                <div className="relative aspect-[16/9] max-w-lg mt-1 rounded-2xl overflow-hidden border border-[#DCE8F0] shadow-md bg-slate-100">
                  <SafeImage
                    src={
                      previewData?.clinicImage ||
                      previewData?.image ||
                      previewData?.departmentImage
                    }
                    alt="Preview Image"
                    fill
                    className="object-cover"
                    sizes="600px"
                  />
                </div>
              </div>
            )}

            {/* JSON Schema Inspector for Full Fidelity */}
            <div className="mt-6 pt-4 border-t border-[#DCE8F0]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#071B68] block mb-2">
                Structured Content Payload (JSON)
              </span>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-60 leading-relaxed">
                {JSON.stringify(previewData, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

