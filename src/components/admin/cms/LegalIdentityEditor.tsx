"use client";

import { LegalIdentityContent } from "@/types/cms";
import { Scale, Building2, Eye, EyeOff, CheckCircle2, ShieldCheck, HeartHandshake } from "lucide-react";

interface LegalIdentityEditorProps {
  legal: LegalIdentityContent;
  setLegal: React.Dispatch<React.SetStateAction<LegalIdentityContent>>;
}

export default function LegalIdentityEditor({ legal, setLegal }: LegalIdentityEditorProps) {
  return (
    <div className="card p-6 border border-[#DCE8F0] bg-white space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-[#DCE8F0]">
        <h3 className="text-lg font-bold text-[#071B68] flex items-center gap-2">
          <Scale size={20} className="text-[#087FBA]" />
          <span>Legal Company Information & Brand Governance</span>
        </h3>
        <p className="text-xs text-[#5D6B85] mt-1 leading-relaxed">
          Manage your registered legal company name, public healthcare brand identity, explanatory legal descriptions, and website visibility toggles.
        </p>
      </div>

      {/* Brand & Corporate Names */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="text-xs font-bold text-[#071B68]">Public Brand Name</label>
          <input
            type="text"
            value={legal.publicBrandName}
            onChange={(e) => setLegal({ ...legal, publicBrandName: e.target.value })}
            className="mt-1.5 w-full rounded-xl border border-[#DCE8F0] bg-white px-3.5 py-2.5 text-xs text-[#071B68] font-medium"
            placeholder="DRK Hospitals"
          />
          <p className="text-[11px] text-[#5D6B85] mt-1">
            Displayed across header, logo captions, hero headings, and navigation.
          </p>
        </div>

        <div>
          <label className="text-xs font-bold text-[#071B68]">Full Registered Company Name</label>
          <input
            type="text"
            value={legal.registeredCompanyName}
            onChange={(e) => setLegal({ ...legal, registeredCompanyName: e.target.value })}
            className="mt-1.5 w-full rounded-xl border border-[#DCE8F0] bg-white px-3.5 py-2.5 text-xs text-[#071B68] font-bold"
            placeholder="DRK DENTAL SKIN & HAIR HOSPITAL PRIVATE LIMITED"
          />
          <p className="text-[11px] text-[#5D6B85] mt-1">
            Official legal entity name registered under the Companies Act in India.
          </p>
        </div>
      </div>

      {/* Legal Description */}
      <div>
        <label className="text-xs font-bold text-[#071B68]">Legal Identity Relationship Description</label>
        <textarea
          rows={3}
          value={legal.legalDescription}
          onChange={(e) => setLegal({ ...legal, legalDescription: e.target.value })}
          className="mt-1.5 w-full rounded-xl border border-[#DCE8F0] bg-white p-3 text-xs text-[#071B68] leading-relaxed"
          placeholder="DRK Hospitals is the public healthcare brand associated with DRK Dental Skin & Hair Hospital Private Limited."
        />
        <p className="text-[11px] text-[#5D6B85] mt-1">
          Factual explanation of the relationship between the brand and the corporate company displayed on Homepage, About, and Contact.
        </p>
      </div>

      {/* SEO Legal Name */}
      <div>
        <label className="text-xs font-bold text-[#071B68]">SEO Legal Name (Structured Data & Knowledge Graph)</label>
        <input
          type="text"
          value={legal.seoLegalName}
          onChange={(e) => setLegal({ ...legal, seoLegalName: e.target.value })}
          className="mt-1.5 w-full rounded-xl border border-[#DCE8F0] bg-white px-3.5 py-2.5 text-xs text-[#071B68] font-mono text-[11px]"
          placeholder="DRK Dental Skin & Hair Hospital Private Limited"
        />
        <p className="text-[11px] text-[#5D6B85] mt-1">
          Injected into Schema.org Organization structured data as <code className="bg-slate-100 px-1 py-0.5 rounded">legalName</code>.
        </p>
      </div>

      {/* Visibility Toggles */}
      <div className="grid gap-4 sm:grid-cols-2 pt-2">
        {/* Toggle 1: Footer */}
        <div className="p-4 rounded-xl border border-[#DCE8F0] bg-[#F8FDFF] flex items-center justify-between gap-4">
          <div>
            <span className="block text-xs font-bold text-[#071B68]">
              Display Legal Line in Footer
            </span>
            <span className="text-[11px] text-[#5D6B85] block mt-0.5">
              Shows &ldquo;DRK Hospitals is the public brand of DRK Dental Skin & Hair Hospital Private Limited.&rdquo;
            </span>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={legal.showInFooter}
            onClick={() => setLegal({ ...legal, showInFooter: !legal.showInFooter })}
            className={`cursor-pointer relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
              legal.showInFooter ? "bg-[#10C6C1]" : "bg-slate-300"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                legal.showInFooter ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Toggle 2: About Page */}
        <div className="p-4 rounded-xl border border-[#DCE8F0] bg-[#F8FDFF] flex items-center justify-between gap-4">
          <div>
            <span className="block text-xs font-bold text-[#071B68]">
              Display Section on About Page
            </span>
            <span className="text-[11px] text-[#5D6B85] block mt-0.5">
              Displays dedicated &ldquo;Our Legal Identity&rdquo; section on the About Us page.
            </span>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={legal.showOnAboutPage}
            onClick={() => setLegal({ ...legal, showOnAboutPage: !legal.showOnAboutPage })}
            className={`cursor-pointer relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
              legal.showOnAboutPage ? "bg-[#10C6C1]" : "bg-slate-300"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                legal.showOnAboutPage ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Live Previews Container */}
      <div className="pt-4 border-t border-[#DCE8F0] space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#087FBA] flex items-center gap-1.5">
          <Eye size={15} />
          <span>Live Display Previews</span>
        </h4>

        {/* Preview A: Footer Line Preview */}
        <div className="rounded-xl border border-white/20 bg-[#05144f] p-4 text-white">
          <span className="block text-[10px] font-bold text-[#10C6C1] uppercase tracking-wider mb-1">
            Footer Bottom Bar Preview
          </span>
          {legal.showInFooter ? (
            <p className="text-xs text-blue-200">
              {legal.publicBrandName || "DRK Hospitals"} is the public brand of{" "}
              <span className="font-semibold text-white">
                {legal.registeredCompanyName || "DRK DENTAL SKIN & HAIR HOSPITAL PRIVATE LIMITED"}
              </span>.
            </p>
          ) : (
            <p className="text-xs text-blue-300/60 italic">
              (Legal identity line hidden from Footer)
            </p>
          )}
        </div>

        {/* Preview B: Homepage About Note Preview */}
        <div className="rounded-xl border border-[#DCE8F0] bg-[#EFFBFC]/40 p-4">
          <span className="block text-[10px] font-bold text-[#087FBA] uppercase tracking-wider mb-1">
            Homepage About Preview
          </span>
          <p className="text-xs text-[#5D6B85]">
            {legal.legalDescription ||
              `${legal.publicBrandName || "DRK Hospitals"} is the public healthcare brand associated with ${legal.registeredCompanyName || "DRK Dental Skin & Hair Hospital Private Limited"}.`}
          </p>
        </div>
      </div>
    </div>
  );
}
