"use client";

import { Building2, ShieldCheck, MapPin, Scale, HeartHandshake } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { useCMSSection } from "@/lib/useCMS";
import { DEFAULT_LEGAL_IDENTITY } from "@/lib/cms-defaults";
import { LegalIdentityContent } from "@/types/cms";
import { HOSPITAL_INFO } from "@/lib/hospital-info";

export default function CompanyIdentity() {
  const legal = useCMSSection<LegalIdentityContent>(
    "legal_identity",
    DEFAULT_LEGAL_IDENTITY
  );

  if (legal.showOnAboutPage === false) {
    return null;
  }

  const brandName = legal.publicBrandName || "DRK Hospitals";
  const registeredName =
    legal.registeredCompanyName || "DRK DENTAL SKIN & HAIR HOSPITAL PRIVATE LIMITED";

  return (
    <section
      id="corporate-identity"
      aria-labelledby="corporate-identity-heading"
      className="section bg-[#F8FDFF] border-b border-[#DCE8F0]"
    >
      <div className="container">
        <AnimatedSection>
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#DCE8F0] bg-white px-4 py-1.5 shadow-2xs">
              <Building2 size={14} className="text-[#087FBA]" />
              <span className="text-xs font-bold tracking-wider text-[#087FBA] uppercase">
                Corporate Governance & Registration
              </span>
            </div>

            <h2
              id="corporate-identity-heading"
              className="mt-4 text-3xl font-extrabold tracking-tight text-[#071B68] sm:text-4xl leading-[1.18]"
            >
              Our Legal Identity
            </h2>

            <p className="mt-4 text-base text-[#5D6B85] leading-relaxed">
              Transparent corporate and institutional details regarding our registered legal company, public healthcare brand, and physical healthcare operations in Tiruttani.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid gap-6 lg:grid-cols-12 items-stretch">
          {/* Left Column: Brand vs Legal Entity Cards */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-6">
            {/* 1. Full Registered Company Name Display */}
            <AnimatedSection delay={0.05}>
              <div className="rounded-2xl border-2 border-[#071B68]/15 bg-white p-6 sm:p-8 shadow-xs">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#071B68]/5 text-[#071B68]">
                    <Scale size={22} />
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-[#087FBA]">
                      Full Registered Company Name
                    </span>
                    <h3 className="text-lg sm:text-xl font-extrabold text-[#071B68] tracking-tight">
                      {registeredName}
                    </h3>
                  </div>
                </div>
                <p className="text-sm text-[#5D6B85] leading-relaxed">
                  <strong>{registeredName}</strong> is the official corporate legal entity registered under Indian company regulations. All hospital administrative governance, clinical compliance, and statutory registrations are conducted under this legal corporate structure.
                </p>
              </div>
            </AnimatedSection>

            {/* 2. Public-Facing Hospital Brand Explanation */}
            <AnimatedSection delay={0.1}>
              <div className="rounded-2xl border border-[#DCE8F0] bg-white p-6 sm:p-8 shadow-xs">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EFFBFC] text-[#087FBA]">
                    <HeartHandshake size={20} />
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-[#087FBA]">
                      Public Healthcare Brand
                    </span>
                    <h4 className="text-xl font-extrabold text-[#071B68]">
                      {brandName}
                    </h4>
                  </div>
                </div>
                <p className="text-sm text-[#5D6B85] leading-relaxed">
                  <strong>{brandName}</strong> serves as our public-facing hospital brand and clinical identity, known for the motto <em>&ldquo;ROOTED IN CARE&rdquo;</em>. It represents our patient-care facility providing specialized disciplines across Dental Care, Clinical Dermatology (Skin Care), and Trichology (Hair Care) in Tiruttani.
                </p>
              </div>
            </AnimatedSection>
          </div>

          {/* Right Column: Confirmed Physical Facility & Relationship Summary */}
          <div className="lg:col-span-5">
            <AnimatedSection delay={0.15}>
              <div className="h-full rounded-2xl border border-[#DCE8F0] bg-gradient-to-b from-white to-[#EFFBFC]/40 p-6 sm:p-8 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#10C6C1]/15 text-[#087FBA]">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-[#087FBA]">
                        Confirmed Physical Hospital Facility
                      </span>
                      <h4 className="text-base font-bold text-[#071B68]">
                        Tiruttani Clinical Center
                      </h4>
                    </div>
                  </div>

                  <div className="space-y-4 text-xs sm:text-sm text-[#5D6B85]">
                    <div className="p-3.5 rounded-xl bg-white border border-[#DCE8F0]/80">
                      <span className="block text-[11px] font-bold text-[#071B68] uppercase tracking-wider mb-1">
                        Patient-Visit Address
                      </span>
                      <p className="text-[#14234B] font-medium leading-relaxed">
                        {HOSPITAL_INFO.fullAddress}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white border border-[#DCE8F0]/80">
                      <span className="block text-[11px] font-bold text-[#071B68] uppercase tracking-wider mb-1">
                        Legal Relationship Statement
                      </span>
                      <p className="text-[#14234B] font-medium leading-relaxed">
                        {legal.legalDescription ||
                          `${brandName} is the public healthcare brand associated with ${registeredName}.`}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white border border-[#DCE8F0]/80">
                      <span className="block text-[11px] font-bold text-[#071B68] uppercase tracking-wider mb-1">
                        Verified Hospital Helpline
                      </span>
                      <p className="text-[#14234B] font-medium">
                        {HOSPITAL_INFO.phone.primary} • {HOSPITAL_INFO.email.contact}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#DCE8F0] flex items-center gap-2 text-xs text-[#087FBA] font-semibold">
                  <ShieldCheck size={16} />
                  <span>Ethical Healthcare • Registered in Tamil Nadu, India</span>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
}
