"use client";

import { Compass, Target } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import SectionHeading from "@/components/SectionHeading";
import { useCMSSection } from "@/lib/useCMS";
import { VisionMissionContent } from "@/types/cms";
import { DEFAULT_VISION_MISSION } from "@/lib/cms-defaults";

export default function VisionMission() {
  const vm = useCMSSection<VisionMissionContent>("about_vision_mission", DEFAULT_VISION_MISSION);

  return (
    <section className="bg-[#EFFBFC]/60 py-20 border-y border-[#DCE8F0]">
      <div className="container">
        <AnimatedSection>
          <SectionHeading
            centered
            eyebrow="Our Foundation"
            title="Vision & Mission"
            copy="Guiding principles that steer our clinical staff, treatment methodologies, and everyday patient interactions in Tiruttani."
          />
        </AnimatedSection>

        <div className="mt-12 grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          {/* Vision Card */}
          <AnimatedSection delay={0.1}>
            <article className="card p-8 sm:p-10 flex flex-col justify-between h-full border border-[#DCE8F0] bg-white hover:border-[#087FBA] transition-all">
              <div>
                <div className="inline-flex rounded-2xl bg-[#EFFBFC] p-4 text-[#087FBA] mb-6">
                  <Compass size={32} />
                </div>
                <p className="eyebrow">Our Vision</p>
                <h3 className="mt-2 text-2xl font-bold text-[#071B68]">
                  {vm.visionHeading}
                </h3>
                <p className="mt-4 leading-relaxed text-[#5D6B85] text-sm sm:text-base">
                  {vm.visionText}
                </p>
              </div>
            </article>
          </AnimatedSection>

          {/* Mission Card */}
          <AnimatedSection delay={0.2}>
            <article className="card p-8 sm:p-10 flex flex-col justify-between h-full border border-[#DCE8F0] bg-white hover:border-[#10C6C1] transition-all">
              <div>
                <div className="inline-flex rounded-2xl bg-[#EFFBFC] p-4 text-[#10C6C1] mb-6">
                  <Target size={32} />
                </div>
                <p className="eyebrow !text-[#10C6C1]">Our Mission</p>
                <h3 className="mt-2 text-2xl font-bold text-[#071B68]">
                  {vm.missionHeading}
                </h3>
                <p className="mt-4 leading-relaxed text-[#5D6B85] text-sm sm:text-base">
                  {vm.missionText}
                </p>
              </div>
            </article>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

