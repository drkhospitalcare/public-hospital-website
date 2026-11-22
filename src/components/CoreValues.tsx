"use client";

import {
  Heart,
  ShieldCheck,
  Lock,
  Eye,
  Users2,
  Sparkles,
} from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import SectionHeading from "@/components/SectionHeading";
import { useCMSSection } from "@/lib/useCMS";
import { AboutCoreValuesContent, CoreValueItem } from "@/types/cms";
import { DEFAULT_ABOUT_VALUES } from "@/lib/cms-defaults";

const iconCycle = [
  { icon: Heart, color: "#087FBA" },
  { icon: ShieldCheck, color: "#10C6C1" },
  { icon: Lock, color: "#071B68" },
  { icon: Eye, color: "#087FBA" },
  { icon: Users2, color: "#10C6C1" },
  { icon: Sparkles, color: "#071B68" },
];

export default function CoreValues() {
  const valuesData = useCMSSection<AboutCoreValuesContent>("about_values", DEFAULT_ABOUT_VALUES);

  return (
    <section className="section bg-white">
      <div className="container">
        <AnimatedSection>
          <SectionHeading
            centered
            eyebrow={valuesData.eyebrow || "Our Ethics"}
            title={valuesData.heading || "Our Core Values"}
            copy={valuesData.description || "The principles that define who we are and govern our patient relationships every single day."}
          />
        </AnimatedSection>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {valuesData.values.map((val: CoreValueItem, idx: number) => {
            const visual = iconCycle[idx % iconCycle.length];
            const Icon = visual.icon;
            return (
              <AnimatedSection key={val.id || val.title || idx} delay={0.05 * (idx + 1)}>
                <div className="card p-6 sm:p-7 flex flex-col h-full border border-[#DCE8F0] bg-white hover:border-[#087FBA] transition-all">
                  <div
                    className="inline-flex rounded-xl bg-[#EFFBFC] p-3.5 w-fit mb-5"
                    style={{ color: visual.color }}
                  >
                    <Icon size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-[#071B68]">{val.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#5D6B85] flex-1">
                    {val.desc}
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

