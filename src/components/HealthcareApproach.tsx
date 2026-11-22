"use client";

import { CheckCircle2, FileText, Search, ShieldCheck, HeartHandshake } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import SectionHeading from "@/components/SectionHeading";
import { useCMSSection } from "@/lib/useCMS";
import { ServicesApproachContent, HealthcareApproachStep } from "@/types/cms";
import { DEFAULT_SERVICES_APPROACH } from "@/lib/cms-defaults";

const iconCycle = [
  { icon: FileText, color: "#087FBA" },
  { icon: Search, color: "#10C6C1" },
  { icon: CheckCircle2, color: "#071B68" },
  { icon: ShieldCheck, color: "#087FBA" },
  { icon: HeartHandshake, color: "#10C6C1" },
];

export default function HealthcareApproach() {
  const approach = useCMSSection<ServicesApproachContent>("services_approach", DEFAULT_SERVICES_APPROACH);

  return (
    <section className="section bg-[#F8FDFF] border-b border-[#DCE8F0]">
      <div className="container">
        <AnimatedSection>
          <SectionHeading
            centered
            eyebrow={approach.eyebrow || "Our Process"}
            title={approach.heading || "Our Healthcare Approach"}
            copy={approach.description || "A disciplined, transparent care pathway designed to ensure patient comfort, safety, and optimal treatment outcomes at every visit."}
          />
        </AnimatedSection>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {approach.steps.map((item: HealthcareApproachStep, idx: number) => {
            const visual = iconCycle[idx % iconCycle.length];
            const Icon = visual.icon;
            return (
              <AnimatedSection key={item.id || item.stepNumber || idx} delay={0.06 * (idx + 1)}>
                <div className="card p-6 sm:p-7 flex flex-col justify-between h-full border border-[#DCE8F0] bg-white hover:border-[#087FBA] transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className="text-2xl font-black tracking-tight"
                        style={{ color: visual.color }}
                      >
                        {item.stepNumber || `0${idx + 1}`}
                      </span>
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EFFBFC]"
                        style={{ color: visual.color }}
                      >
                        <Icon size={20} />
                      </div>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-[#071B68]">
                      {item.title}
                    </h3>
                    <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-[#5D6B85]">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}

