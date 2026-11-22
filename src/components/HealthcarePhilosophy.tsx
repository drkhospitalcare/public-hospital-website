"use client";

import {
  FileCheck2,
  Heart,
  MessageSquare,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import SectionHeading from "@/components/SectionHeading";
import { useCMSSection } from "@/lib/useCMS";
import { AboutPhilosophyContent, PhilosophyPoint } from "@/types/cms";
import { DEFAULT_ABOUT_PHILOSOPHY } from "@/lib/cms-defaults";

const iconCycle = [
  { icon: Heart, color: "#087FBA" },
  { icon: ShieldCheck, color: "#10C6C1" },
  { icon: MessageSquare, color: "#071B68" },
  { icon: Sparkles, color: "#087FBA" },
  { icon: FileCheck2, color: "#10C6C1" },
];

export default function HealthcarePhilosophy() {
  const philosophy = useCMSSection<AboutPhilosophyContent>("about_philosophy", DEFAULT_ABOUT_PHILOSOPHY);

  return (
    <section className="section bg-white border-b border-[#DCE8F0]">
      <div className="container">
        <AnimatedSection>
          <SectionHeading
            centered
            eyebrow={philosophy.eyebrow || "Clinical Philosophy"}
            title={philosophy.heading || "Our Healthcare Philosophy"}
            copy={philosophy.description || "Guiding principles of clinical discipline and compassionate care that govern every patient consultation and treatment."}
          />
        </AnimatedSection>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {philosophy.points.map((pillar: PhilosophyPoint, idx: number) => {
            const visual = iconCycle[idx % iconCycle.length];
            const Icon = visual.icon;
            return (
              <AnimatedSection key={pillar.id || pillar.title || idx} delay={0.05 * (idx + 1)}>
                <div className="card p-6 sm:p-7 flex flex-col h-full border border-[#DCE8F0] bg-white hover:border-[#087FBA] transition-all">
                  <div
                    className="inline-flex rounded-xl bg-[#EFFBFC] p-3.5 w-fit mb-5"
                    style={{ color: visual.color }}
                  >
                    <Icon size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-[#071B68]">{pillar.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#5D6B85] flex-1">
                    {pillar.desc}
                  </p>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
