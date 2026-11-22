"use client";

import { CheckCircle2, HeartHandshake } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import SectionHeading from "@/components/SectionHeading";
import SafeImage from "@/components/SafeImage";
import { useCMSSection } from "@/lib/useCMS";
import { AboutStoryContent } from "@/types/cms";
import { DEFAULT_ABOUT_STORY } from "@/lib/cms-defaults";

export default function StorySection() {
  const story = useCMSSection<AboutStoryContent>("about_story", DEFAULT_ABOUT_STORY);

  return (
    <section className="section bg-white">
      <div className="container">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          {/* Left Column: Story Copy */}
          <div className="lg:col-span-7">
            <AnimatedSection>
              <SectionHeading
                eyebrow={story.eyebrow}
                title={story.sectionTitle}
                copy={story.paragraphs[0] || ""}
              />

              <div className="space-y-4 text-[#5D6B85] leading-relaxed">
                {story.paragraphs.slice(1).map((para: string, idx: number) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>

              {/* Verified Checklist / Stats */}
              {story.stats && story.stats.length > 0 && (
                <div className="mt-8 grid gap-3.5 sm:grid-cols-3 text-sm font-semibold text-[#14234B]">
                  {story.stats.map((item: { label: string; value: string }, idx: number) => (
                    <div key={idx} className="rounded-xl border border-[#DCE8F0] bg-[#F8FDFF] p-3 text-center sm:text-left">
                      <span className="block text-xl font-extrabold text-[#087FBA]">{item.value}</span>
                      <span className="text-xs text-[#5D6B85] font-medium">{item.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </AnimatedSection>
          </div>

          {/* Right Column: Split Screen Healthcare Photo */}
          <div className="lg:col-span-5">
            <AnimatedSection delay={0.15}>
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border-4 border-white shadow-xl bg-slate-100">
                <SafeImage
                  src={story.image}
                  alt={story.imageAlt || "DRK Hospital Patient Consultation and Doctor Care"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 500px"
                  fallbackSrc="/images/doctor-consultation.jpg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071B68]/40 via-transparent to-transparent pointer-events-none" />

                {/* Patient-First Badge */}
                <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-white/95 p-4 shadow-lg backdrop-blur-xs border border-[#DCE8F0]/80">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EFFBFC] text-[#087FBA]">
                      <HeartHandshake size={22} />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-[#087FBA]">
                        Patient-First Philosophy
                      </p>
                      <p className="text-xs text-[#5D6B85] mt-0.5">
                        Focused on patient comfort, safety, and transparent medical counsel.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
}

