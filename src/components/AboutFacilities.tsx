"use client";

import Link from "next/link";
import { Images } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import SectionHeading from "@/components/SectionHeading";
import SafeImage from "@/components/SafeImage";
import { useCMSSection } from "@/lib/useCMS";
import { AboutFacilitiesContent, AboutFacilityItem } from "@/types/cms";
import { DEFAULT_ABOUT_FACILITIES } from "@/lib/cms-defaults";

export default function AboutFacilities() {
  const facilitiesData = useCMSSection<AboutFacilitiesContent>("about_facilities", DEFAULT_ABOUT_FACILITIES);

  return (
    <section className="section bg-white border-b border-[#DCE8F0]">
      <div className="container">
        <AnimatedSection>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <SectionHeading
              eyebrow={facilitiesData.eyebrow || "Modern Infrastructure"}
              title={facilitiesData.heading || "Our Clinical Facilities"}
              copy={facilitiesData.description || "Purpose-built clinical environments designed with patient comfort, hygiene, and clinical precision as top priorities."}
            />
            <Link
              href="/gallery"
              className="btn-outline shrink-0 w-fit"
            >
              <Images size={16} />
              <span>View Full Gallery</span>
            </Link>
          </div>
        </AnimatedSection>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {facilitiesData.items.map((fac: AboutFacilityItem, idx: number) => (
            <AnimatedSection key={fac.id || fac.title || idx} delay={0.05 * (idx + 1)}>
              <div className="card overflow-hidden flex flex-col h-full border border-[#DCE8F0] bg-white hover:border-[#087FBA] hover:shadow-md transition-all">
                <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
                  <SafeImage
                    src={fac.image}
                    alt={fac.imageAlt || fac.title}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    fallbackSrc="/images/infrastructure-reception.jpg"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[#071B68]">
                      {fac.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-[#5D6B85]">
                      {fac.desc}
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

