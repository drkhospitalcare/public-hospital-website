"use client";

import { Droplets, ShieldCheck, Sparkles, Syringe } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import SectionHeading from "@/components/SectionHeading";
import SafeImage from "@/components/SafeImage";
import { useCMSSection } from "@/lib/useCMS";
import { AboutClinicalStandardsContent, ClinicalStandardItem } from "@/types/cms";
import { DEFAULT_ABOUT_CLINICAL_STANDARDS } from "@/lib/cms-defaults";

const iconCycle = [Sparkles, Droplets, ShieldCheck, Syringe];

export default function ClinicalStandards() {
  const clinical = useCMSSection<AboutClinicalStandardsContent>("about_clinical_standards", DEFAULT_ABOUT_CLINICAL_STANDARDS);

  return (
    <section className="section bg-[#F8FDFF] border-b border-[#DCE8F0]">
      <div className="container">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          {/* Left Column: Image */}
          <div className="lg:col-span-5">
            <AnimatedSection>
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border-4 border-white shadow-xl bg-slate-100">
                <SafeImage
                  src={clinical.image}
                  alt={clinical.imageAlt || clinical.heading || "DRK Hospital Sterilization Protocol and Infection Control"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 500px"
                  fallbackSrc="/images/infrastructure-sterilization.jpg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071B68]/30 via-transparent to-transparent pointer-events-none" />

                <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/95 p-4 shadow-lg backdrop-blur-xs border border-[#DCE8F0]/80">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#087FBA]">
                    Infection Control Standard
                  </p>
                  <p className="mt-0.5 text-sm font-bold text-[#071B68]">
                    Hospital-Grade Autoclave Sterilization
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Right Column: Standards List */}
          <div className="lg:col-span-7">
            <AnimatedSection delay={0.15}>
              <SectionHeading
                eyebrow={clinical.eyebrow || "Clinical Standards"}
                title={clinical.heading || "Rigorous Hygiene, Sterilization & Patient Safety"}
                copy={clinical.description || "Our infection control protocols and clinical procedures are maintained with uncompromising discipline to guarantee your safety at every visit."}
              />

              <div className="mt-8 space-y-4">
                {clinical.standards.map((item: ClinicalStandardItem, idx: number) => {
                  const Icon = iconCycle[idx % iconCycle.length];
                  return (
                    <div
                      key={item.id || item.title || idx}
                      className="rounded-2xl border border-[#DCE8F0] bg-white p-5 shadow-2xs hover:border-[#087FBA] transition-all"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EFFBFC] text-[#087FBA]">
                          <Icon size={20} />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-[#071B68]">
                            {item.title}
                          </h3>
                          <p className="mt-1 text-xs sm:text-sm text-[#5D6B85] leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
}

