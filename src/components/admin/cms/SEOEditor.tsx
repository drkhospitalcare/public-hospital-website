"use client";

import { useState } from "react";
import { SEOMetadataContent } from "@/types/cms";
import ImageUploader from "./ImageUploader";
import { Globe, Search, Building2, FileText, Share2, Layers, CheckCircle2 } from "lucide-react";

interface SEOEditorProps {
  seo: SEOMetadataContent;
  setSeo: React.Dispatch<React.SetStateAction<SEOMetadataContent>>;
  onOpenMediaLibrary: (category?: any) => void;
}

export default function SEOEditor({ seo, setSeo, onOpenMediaLibrary }: SEOEditorProps) {
  const [activeTab, setActiveTab] = useState<"global" | "brand" | "pages" | "preview">("global");

  const orgName = seo.organizationName || "DRK Hospitals";
  const legalName = seo.legalName || "DRK Dental Skin & Hair Hospital Private Limited";
  const alternateNamesStr = (seo.alternateNames || ["DRK Hospital", "DRK Hospitals Tiruttani"]).join(", ");

  return (
    <div className="card p-6 border border-[#DCE8F0] bg-white space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#DCE8F0]">
        <div>
          <h3 className="text-lg font-bold text-[#071B68] flex items-center gap-2">
            <Globe size={18} className="text-[#087FBA]" />
            <span>Search Engine Optimization (SEO) & Brand Metadata Studio</span>
          </h3>
          <p className="text-xs text-[#5D6B85] mt-0.5">
            Manage global search meta tags, registered corporate legal entity data, page-specific titles, and Search Console indexing settings.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-[#F8FDFF] border border-[#DCE8F0] rounded-xl self-start">
          <button
            type="button"
            onClick={() => setActiveTab("global")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "global"
                ? "bg-white text-[#087FBA] shadow-2xs border border-[#DCE8F0]"
                : "text-[#5D6B85] hover:text-[#071B68]"
            }`}
          >
            Global Meta
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("brand")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "brand"
                ? "bg-white text-[#087FBA] shadow-2xs border border-[#DCE8F0]"
                : "text-[#5D6B85] hover:text-[#071B68]"
            }`}
          >
            Brand & Legal Entity
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("pages")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "pages"
                ? "bg-white text-[#087FBA] shadow-2xs border border-[#DCE8F0]"
                : "text-[#5D6B85] hover:text-[#071B68]"
            }`}
          >
            Page-Specific SEO
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "preview"
                ? "bg-white text-[#087FBA] shadow-2xs border border-[#DCE8F0]"
                : "text-[#5D6B85] hover:text-[#071B68]"
            }`}
          >
            Search Preview
          </button>
        </div>
      </div>

      {/* TAB 1: GLOBAL META & KEYWORDS */}
      {activeTab === "global" && (
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-bold text-[#071B68]">Homepage Title</label>
              <input
                type="text"
                value={seo.siteTitle}
                onChange={(e) => setSeo({ ...seo, siteTitle: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs text-[#071B68]"
                placeholder="DRK Hospitals Tiruttani | Dental, Skin & Hair Care"
              />
              <p className="text-[11px] text-[#5D6B85] mt-1">
                Length: {seo.siteTitle.length} chars (Recommended: 50–60 chars)
              </p>
            </div>
            <div>
              <label className="text-xs font-bold text-[#071B68]">Title Template</label>
              <input
                type="text"
                value={seo.titleTemplate}
                onChange={(e) => setSeo({ ...seo, titleTemplate: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs text-[#071B68]"
                placeholder="%s | DRK Hospitals"
              />
              <p className="text-[11px] text-[#5D6B85] mt-1">
                Used dynamically across subpages: e.g. "Services | DRK Hospitals"
              </p>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#071B68]">Default Meta Description</label>
            <textarea
              rows={3}
              value={seo.defaultDescription}
              onChange={(e) => setSeo({ ...seo, defaultDescription: e.target.value })}
              className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white p-2.5 text-xs text-[#071B68] leading-relaxed"
            />
            <p className="text-[11px] text-[#5D6B85] mt-1">
              Length: {seo.defaultDescription.length} characters (Recommended: 140–160 chars)
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

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-bold text-[#071B68]">Canonical Base URL</label>
              <input
                type="url"
                value={seo.canonicalBase}
                onChange={(e) => setSeo({ ...seo, canonicalBase: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs text-[#071B68] font-mono text-[11px]"
                placeholder="https://drkhospitals.com"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#071B68]">Google Search Console Verification Token</label>
              <input
                type="text"
                value={seo.googleSiteVerification || ""}
                onChange={(e) => setSeo({ ...seo, googleSiteVerification: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs text-[#071B68] font-mono text-[11px]"
                placeholder="e.g. google-site-verification=abc123xyz"
              />
            </div>
          </div>

          <ImageUploader
            label="Social Media Share Image (Open Graph / Twitter Card)"
            imageSrc={seo.ogImageUrl}
            category="Other"
            presetKey="og-image"
            onImageChange={(url) => setSeo({ ...seo, ogImageUrl: url })}
            onOpenMediaLibrary={() => onOpenMediaLibrary("Other")}
            hint="Recommended: 1200x630px JPG or PNG image shown when sharing the DRK Hospital website on WhatsApp, LinkedIn, or Twitter."
          />
        </div>
      )}

      {/* TAB 2: BRAND & CORPORATE LEGAL ENTITY */}
      {activeTab === "brand" && (
        <div className="space-y-5">
          <div className="rounded-xl bg-[#EFFBFC]/50 border border-[#DCE8F0] p-4 text-xs text-[#071B68]">
            <p className="font-bold flex items-center gap-1.5">
              <Building2 size={16} className="text-[#087FBA]" />
              <span>Search Engine Entity & Knowledge Graph Configuration</span>
            </p>
            <p className="text-[#5D6B85] mt-1 leading-relaxed">
              Google uses Organization & LocalBusiness schema to distinguish between your public brand identity and your registered corporate company name.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-bold text-[#071B68]">Public Healthcare Brand Name</label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setSeo({ ...seo, organizationName: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs text-[#071B68]"
                placeholder="DRK Hospitals"
              />
              <p className="text-[11px] text-[#5D6B85] mt-1">
                Used in Google Search Site Name and public navigation.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-[#071B68]">Registered Legal Company Name</label>
              <input
                type="text"
                value={legalName}
                onChange={(e) => setSeo({ ...seo, legalName: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs text-[#071B68]"
                placeholder="DRK Dental Skin & Hair Hospital Private Limited"
              />
              <p className="text-[11px] text-[#5D6B85] mt-1">
                Full legal name incorporated under the Companies Act in India.
              </p>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#071B68]">Alternative Brand Names (Comma Separated)</label>
            <input
              type="text"
              value={alternateNamesStr}
              onChange={(e) =>
                setSeo({
                  ...seo,
                  alternateNames: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
              className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs text-[#071B68]"
              placeholder="DRK Hospital, DRK Hospitals Tiruttani, டிஆர்கே மருத்துவமனை திருத்தணி"
            />
            <p className="text-[11px] text-[#5D6B85] mt-1">
              Common query variants that should resolve to DRK Hospitals in search.
            </p>
          </div>
        </div>
      )}

      {/* TAB 3: PAGE-SPECIFIC SEO OVERRIDES */}
      {activeTab === "pages" && (
        <div className="space-y-5">
          <div className="rounded-xl border border-[#DCE8F0] p-4 bg-white space-y-3">
            <h4 className="text-xs font-bold text-[#071B68] flex items-center gap-1.5">
              <FileText size={15} className="text-[#087FBA]" />
              <span>About Us Page (/about)</span>
            </h4>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-[11px] font-semibold text-[#5D6B85]">Page Title</label>
                <input
                  type="text"
                  value={seo.aboutTitle || ""}
                  onChange={(e) => setSeo({ ...seo, aboutTitle: e.target.value })}
                  placeholder="About Us | DRK Hospitals Tiruttani – Rooted in Care"
                  className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs text-[#071B68]"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[#5D6B85]">Meta Description</label>
                <input
                  type="text"
                  value={seo.aboutDescription || ""}
                  onChange={(e) => setSeo({ ...seo, aboutDescription: e.target.value })}
                  placeholder="Learn about DRK Hospitals in Tiruttani and corporate entity DRK Dental Skin & Hair Hospital Private Limited."
                  className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs text-[#071B68]"
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[#DCE8F0] p-4 bg-white space-y-3">
            <h4 className="text-xs font-bold text-[#071B68] flex items-center gap-1.5">
              <FileText size={15} className="text-[#087FBA]" />
              <span>Services Page (/services)</span>
            </h4>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-[11px] font-semibold text-[#5D6B85]">Page Title</label>
                <input
                  type="text"
                  value={seo.servicesTitle || ""}
                  onChange={(e) => setSeo({ ...seo, servicesTitle: e.target.value })}
                  placeholder="Services | DRK Hospitals Tiruttani – Dental, Skin & Hair Care"
                  className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs text-[#071B68]"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[#5D6B85]">Meta Description</label>
                <input
                  type="text"
                  value={seo.servicesDescription || ""}
                  onChange={(e) => setSeo({ ...seo, servicesDescription: e.target.value })}
                  placeholder="Explore DRK Hospitals' dedicated healthcare specialties in Tiruttani: Dental Care, Skin Care, and Hair Care."
                  className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs text-[#071B68]"
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[#DCE8F0] p-4 bg-white space-y-3">
            <h4 className="text-xs font-bold text-[#071B68] flex items-center gap-1.5">
              <FileText size={15} className="text-[#087FBA]" />
              <span>Contact Page (/contact)</span>
            </h4>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-[11px] font-semibold text-[#5D6B85]">Page Title</label>
                <input
                  type="text"
                  value={seo.contactTitle || ""}
                  onChange={(e) => setSeo({ ...seo, contactTitle: e.target.value })}
                  placeholder="Contact Us | DRK Hospitals Tiruttani – Rooted in Care"
                  className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs text-[#071B68]"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[#5D6B85]">Meta Description</label>
                <input
                  type="text"
                  value={seo.contactDescription || ""}
                  onChange={(e) => setSeo({ ...seo, contactDescription: e.target.value })}
                  placeholder="Contact DRK Hospitals in Tiruttani. Access hospital address, phone, and visiting hours."
                  className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs text-[#071B68]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: GOOGLE SEARCH SNIPPET PREVIEW */}
      {activeTab === "preview" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-[#DCE8F0] bg-[#F8FDFF] p-5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#087FBA] mb-3">
              <Search size={14} />
              <span>Live Google Search Result Preview</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#DCE8F0] shadow-2xs max-w-xl">
              {/* Google Search Result Header */}
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-6 h-6 rounded-full bg-[#071B68] text-white flex items-center justify-center font-bold text-[10px]">
                  DRK
                </div>
                <div className="text-xs">
                  <span className="font-semibold text-[#202124]">{orgName}</span>
                  <span className="text-[#5f6368] text-[11px] ml-1.5 font-mono">{seo.canonicalBase}</span>
                </div>
              </div>

              {/* Title */}
              <h4 className="text-base sm:text-lg text-[#1a0dab] font-medium hover:underline cursor-pointer leading-snug">
                {seo.siteTitle}
              </h4>

              {/* Description Snippet */}
              <p className="text-xs sm:text-sm text-[#4d5156] mt-1.5 leading-relaxed line-clamp-2">
                {seo.defaultDescription}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#DCE8F0] text-xs text-[#5D6B85] space-y-1">
            <p className="font-semibold text-[#071B68] flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-[#10C6C1]" />
              <span>Site Name Structured Data Connected:</span>
            </p>
            <p>
              Preferred Name: <strong>{orgName}</strong> • URL: <code className="font-mono text-[11px]">{seo.canonicalBase}</code> • Legal Name: <strong>{legalName}</strong>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
