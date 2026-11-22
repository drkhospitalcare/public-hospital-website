"use client";

import Link from "next/link";
import { ArrowRight, ChevronRight, MapPin, ShieldCheck } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import SafeImage from "@/components/SafeImage";
import { useCMSSection } from "@/lib/useCMS";
import * as defaults from "@/lib/cms-defaults";
import { AboutHeroContent } from "@/types/cms";

export default function AboutHero() {
  const hero = useCMSSection<AboutHeroContent>("about_hero", defaults.DEFAULT_ABOUT_HERO);

  return (
    <section
      className="relative overflow-hidden pt-8 pb-16 md:pt-12 md:pb-20 border-b border-[#DCE8F0]"
      style={{
        background:
          "radial-gradient(ellipse at 95% 50%, rgba(135, 220, 255, 0.30) 0%, transparent 48%), radial-gradient(ellipse at 85% 100%, rgba(16, 198, 193, 0.10) 0%, transparent 35%), linear-gradient(110deg, #FFFFFF 0%, #FFFFFF 48%, #F4FBFF 75%, #EAF8FF 100%)",
      }}
    >
      <div className="container relative">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-1.5 text-xs font-semibold text-[#5D6B85]">
            <li>
              <Link href="/" className="hover:text-[#087FBA] transition">
                Home
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight size={14} className="text-[#8896AB]" />
            </li>
            <li className="text-[#071B68]" aria-current="page">
              About Us
            </li>
          </ol>
        </nav>

        <div className="grid items-center gap-12 lg:grid-cols-12">
          {/* Left Column: Heading and Introduction */}
          <div className="lg:col-span-7">
            <AnimatedSection delay={0.05}>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#DCE8F0] bg-white px-4 py-1.5 shadow-2xs">
                <span className="h-2 w-2 rounded-full bg-[#10C6C1]" />
                <span className="text-xs font-bold tracking-wider text-[#071B68] uppercase">
                  {hero.eyebrow}
                </span>
              </div>

              <h1 className="mt-5 text-4xl font-extrabold leading-[1.14] tracking-tight text-[#071B68] sm:text-5xl lg:text-[3.25rem]">
                {hero.heading}
              </h1>

              <p className="mt-5 max-w-xl text-base sm:text-lg leading-relaxed text-[#5D6B85]">
                {hero.description}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <Link href="/services" className="btn-primary">
                  <span>Explore Our Services</span>
                  <ArrowRight size={17} />
                </Link>
                <Link href="/contact" className="btn-outline">
                  <span>Contact DRK</span>
                </Link>
              </div>

              {/* Highlights Ribbon */}
              <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-[#DCE8F0]/70 pt-6 text-xs font-semibold text-[#071B68]">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#EFFBFC] text-[#087FBA]">
                    <ShieldCheck size={16} />
                  </div>
                  <span>Strict Sterilization Protocols</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#EFFBFC] text-[#10C6C1]">
                    <MapPin size={16} />
                  </div>
                  <span>Chennai, Tamil Nadu</span>
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Right Column: Hospital Image */}
          <div className="lg:col-span-5">
            <AnimatedSection delay={0.15}>
              <div className="relative aspect-[4/3] sm:aspect-[5/4] w-full overflow-hidden rounded-3xl border-4 border-white shadow-xl bg-slate-100">
                <SafeImage
                  src={hero.image}
                  alt={hero.imageAlt || "DRK Hospital Facility and Clinical Environment in Chennai"}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 520px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071B68]/30 via-transparent to-transparent pointer-events-none" />

                {/* Floating Info Badge */}
                <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/95 p-4 shadow-lg backdrop-blur-xs border border-[#DCE8F0]/80">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#087FBA]">
                    Clinical Focus
                  </p>
                  <p className="mt-0.5 text-sm font-bold text-[#071B68]">
                    Dental Care • Skin Care • Hair Care
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
}
