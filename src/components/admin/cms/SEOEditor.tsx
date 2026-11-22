"use client";

import { SEOMetadataContent } from "@/types/cms";
import ImageUploader from "./ImageUploader";
import { Globe, Search } from "lucide-react";

interface SEOEditorProps {
  seo: SEOMetadataContent;
  setSeo: React.Dispatch<React.SetStateAction<SEOMetadataContent>>;
  onOpenMediaLibrary: (category?: any) => void;
}

export default function SEOEditor({ seo, setSeo, onOpenMediaLibrary }: SEOEditorProps) {
  return (
    <div className="card p-6 border border-[#DCE8F0] bg-white space-y-6">
      <div>
        <h3 className="text-lg font-bold text-[#071B68]">SEO & Website Metadata</h3>
        <p className="text-xs text-[#5D6B85]">
          Manage global site title, search engine meta descriptions, keywords, and Open Graph social sharing images.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs font-bold text-[#071B68]">Default Website Title</label>
          <input
            type="text"
            value={seo.siteTitle}
            onChange={(e) => setSeo({ ...seo, siteTitle: e.target.value })}
            className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs text-[#071B68]"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-[#071B68]">Title Template</label>
          <input
            type="text"
            value={seo.titleTemplate}
            onChange={(e) => setSeo({ ...seo, titleTemplate: e.target.value })}
            className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs text-[#071B68]"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-bold text-[#071B68]">Default Meta Description</label>
        <textarea
          rows={3}
          value={seo.defaultDescription}
          onChange={(e) => setSeo({ ...seo, defaultDescription: e.target.value })}
          className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white p-2.5 text-xs text-[#071B68]"
        />
        <p className="text-[11px] text-[#5D6B85] mt-1">
          Recommended length: 140–160 characters. Current: {seo.defaultDescription.length} characters.
        </p>
      </div>

      <div>
        <label className="text-xs font-bold text-[#071B68]">Keywords (Comma Separated)</label>
        <input
          type="text"
          value={seo.keywords.join(", ")}
          onChange={(e) =>
            setSeo({
              ...seo,
              keywords: e.target.value
                .split(",")
                .map((k) => k.trim())
                .filter(Boolean),
            })
          }
          className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs text-[#071B68]"
        />
      </div>

      <ImageUploader
        label="Social Media Share Image (Open Graph / Twitter Card)"
        imageSrc={seo.ogImageUrl}
        category="Other"
        onImageChange={(url) => setSeo({ ...seo, ogImageUrl: url })}
        onOpenMediaLibrary={() => onOpenMediaLibrary("Other")}
        hint="Recommended: 1200x630px JPG or PNG image shown when sharing the DRK Hospital website on WhatsApp, LinkedIn, or Twitter."
      />

      <div>
        <label className="text-xs font-bold text-[#071B68]">Canonical Base URL</label>
        <input
          type="url"
          value={seo.canonicalBase}
          onChange={(e) => setSeo({ ...seo, canonicalBase: e.target.value })}
          className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs text-[#071B68] font-mono text-[11px]"
        />
      </div>

      {/* Google Search Preview */}
      <div className="rounded-2xl border border-[#DCE8F0] bg-[#F8FDFF] p-4">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#087FBA] mb-2">
          <Search size={14} />
          <span>Google Search Result Snippet Preview</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#DCE8F0]">
          <p className="text-xs text-[#1a0dab] truncate font-mono">{seo.canonicalBase}</p>
          <p className="text-base text-[#1a0dab] font-semibold hover:underline cursor-pointer truncate mt-0.5">
            {seo.siteTitle}
          </p>
          <p className="text-xs text-[#4d5156] mt-1 line-clamp-2 leading-relaxed">
            {seo.defaultDescription}
          </p>
        </div>
      </div>
    </div>
  );
}

