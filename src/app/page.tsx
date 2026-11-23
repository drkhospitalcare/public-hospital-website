"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  HeartHandshake,
  Sparkles,
  Smile,
  Scissors,
  CheckCircle2,
  Building2,
  Stethoscope,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Clock3,
  FileText,
  Search,
  Camera,
  Layers,
  Compass,
  Train,
  Car,
  Bus,
} from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import AnimatedSection from "@/components/AnimatedSection";
import SpecialtyCard from "@/components/SpecialtyCard";
import FacilityCard from "@/components/FacilityCard";
import ApproachStep from "@/components/ApproachStep";
import SafeImage from "@/components/SafeImage";
import { useCMSSection } from "@/lib/useCMS";
import { formatOperatingHours } from "@/lib/working-hours";
import * as defaults from "@/lib/cms-defaults";
import {
  HomepageHeroContent,
  HomepageSpecialtiesContent,
  HomepageAboutContent,
  HomepageWhyDRKContent,
  HomepageFacilitiesContent,
  HomepageJourneyContent,
  HomepageCTAContent,
  ContactInfoContent,
  LegalIdentityContent,
} from "@/types/cms";

// Icon resolution helper for dynamic Why DRK & Journey items
function resolveIcon(name?: string) {
  switch (name) {
    case "HeartHandshake":
      return HeartHandshake;
    case "ShieldCheck":
      return ShieldCheck;
    case "Stethoscope":
      return Stethoscope;
    case "Building2":
      return Building2;
    case "FileText":
      return FileText;
    case "Search":
      return Search;
    case "Sparkles":
      return Sparkles;
    case "Smile":
      return Smile;
    case "Scissors":
      return Scissors;
    default:
      return CheckCircle2;
  }
}

export default function HomePage() {
  // Subscribe to CMS published content with instant approved defaults
  const hero = useCMSSection<HomepageHeroContent>("homepage_hero", defaults.DEFAULT_HOMEPAGE_HERO);
  const specialties = useCMSSection<HomepageSpecialtiesContent>(
    "homepage_specialties",
    defaults.DEFAULT_HOMEPAGE_SPECIALTIES
  );
  const about = useCMSSection<HomepageAboutContent>(
    "homepage_about",
    defaults.DEFAULT_HOMEPAGE_ABOUT
  );
  const whyDrk = useCMSSection<HomepageWhyDRKContent>(
    "homepage_why_drk",
    defaults.DEFAULT_HOMEPAGE_WHY_DRK
  );
  const facilities = useCMSSection<HomepageFacilitiesContent>(
    "homepage_facilities",
    defaults.DEFAULT_HOMEPAGE_FACILITIES
  );
  const journey = useCMSSection<HomepageJourneyContent>(
    "homepage_journey",
    defaults.DEFAULT_HOMEPAGE_JOURNEY
  );
  const cta = useCMSSection<HomepageCTAContent>("homepage_cta", defaults.DEFAULT_HOMEPAGE_CTA);
  const contact = useCMSSection<ContactInfoContent>("contact_info", defaults.DEFAULT_CONTACT_INFO);
  const legal = useCMSSection<LegalIdentityContent>("legal_identity", defaults.DEFAULT_LEGAL_IDENTITY);
  const hoursSummary = formatOperatingHours(contact.operatingHours);

  const primaryPhone =
    contact.phoneNumbers.find((p) => p.isPrimary && p.isActive) ||
    contact.phoneNumbers[0] || {
      id: "fallback-primary",
      label: "Hospital Reception",
      number: "+91 44 2345 6789",
      raw: "+914423456789",
      isPrimary: true,
      isActive: true,
    };

  const secondaryPhone =
    contact.phoneNumbers.find((p) => !p.isPrimary && p.isActive) || {
      id: "fallback-secondary",
      label: "Patient Coordination",
      number: "+91 98765 43210",
      raw: "+919876543210",
      isPrimary: false,
      isActive: true,
    };

  return (
    <>
      {/* 1. HERO SECTION - With existing approved white & light-blue gradient */}
      <section
        className="relative overflow-hidden pt-8 pb-16 md:pt-12 md:pb-20"
        style={{
          background:
            "radial-gradient(ellipse at 95% 50%, rgba(135, 220, 255, 0.30) 0%, transparent 48%), radial-gradient(ellipse at 85% 100%, rgba(16, 198, 193, 0.10) 0%, transparent 35%), linear-gradient(110deg, #FFFFFF 0%, #FFFFFF 48%, #F4FBFF 75%, #EAF8FF 100%)",
        }}
      >
        <div className="container relative">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            {/* Left Column: Headline and Actions - Pure White Background */}
            <div className="lg:col-span-7">
              <AnimatedSection delay={0.05}>
                {/* Tagline Badge */}
                <div className="inline-flex items-center gap-2 rounded-full border border-[#DCE8F0] bg-white px-4 py-1.5 shadow-2xs">
                  <span className="h-2 w-2 rounded-full bg-[#10C6C1]" />
                  <span className="text-xs font-bold tracking-wider text-[#071B68] uppercase">
                    {hero.eyebrow}
                  </span>
                </div>

                {/* Main Headline */}
                <h1 className="mt-5 text-4xl font-extrabold leading-[1.14] tracking-tight text-[#071B68] sm:text-5xl lg:text-[3.4rem]">
                  {hero.headingHighlight ? (
                    <>
                      {hero.heading.split(hero.headingHighlight)[0]}
                      <span className="text-[#087FBA]">{hero.headingHighlight}</span>
                      {hero.heading.split(hero.headingHighlight)[1] || ""}
                    </>
                  ) : (
                    hero.heading
                  )}
                </h1>

                {/* Supporting Introduction */}
                <p className="mt-5 max-w-xl text-base sm:text-lg leading-relaxed text-[#5D6B85]">
                  {hero.description}
                </p>

                {/* Primary Action Buttons */}
                <div className="mt-8 flex flex-wrap items-center gap-3.5">
                  <Link href={hero.primaryBtnHref} className="btn-primary">
                    <span>{hero.primaryBtnText}</span>
                    <ArrowRight size={17} />
                  </Link>
                  <Link href={hero.secondaryBtnHref} className="btn-outline">
                    <span>{hero.secondaryBtnText}</span>
                  </Link>
                </div>

                {/* Specialty Highlights Ribbon */}
                <div className="mt-10 pt-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#5D6B85] mb-3">
                    Our Three Core Disciplines:
                  </p>
                  <div className="flex flex-wrap gap-2.5 sm:gap-4 text-sm font-semibold">
                    <Link
                      href="/services#dental-care"
                      className="inline-flex items-center gap-2 rounded-full bg-[#EAF8FA] px-4 py-2 text-[#071B68] hover:bg-[#D7F5F6] transition"
                    >
                      <Smile size={18} className="text-[#087FBA]" />
                      <span>Dental Care</span>
                    </Link>
                    <Link
                      href="/services#skin-care"
                      className="inline-flex items-center gap-2 rounded-full bg-[#EAF8FA] px-4 py-2 text-[#071B68] hover:bg-[#D7F5F6] transition"
                    >
                      <Sparkles size={18} className="text-[#10C6C1]" />
                      <span>Skin Care</span>
                    </Link>
                    <Link
                      href="/services#hair-care"
                      className="inline-flex items-center gap-2 rounded-full bg-[#EAF8FA] px-4 py-2 text-[#071B68] hover:bg-[#D7F5F6] transition"
                    >
                      <Scissors size={18} className="text-[#071B68]" />
                      <span>Hair Care</span>
                    </Link>
                  </div>
                </div>
              </AnimatedSection>
            </div>

            {/* Right Column: Hero Healthcare Image with Clean Floating Cards */}
            <div className="lg:col-span-5">
              <AnimatedSection delay={0.15}>
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  {/* Main Clinic Image Container with White Border */}
                  <div className="relative aspect-[4/3] sm:aspect-[5/4] w-full overflow-hidden rounded-[32px] border-[6px] border-white shadow-xl">
                    <SafeImage
                      src={hero.clinicImage}
                      alt={hero.clinicImageAlt || "DRK Hospital Clinical Facilities"}
                      fill
                      priority
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 500px"
                    />
                  </div>

                  {/* Floating Experience Badge (Bottom Left) - Pure White */}
                  <div className="absolute -bottom-5 -left-4 sm:-left-6 rounded-2xl bg-white p-4 shadow-xl border border-slate-100/90 max-w-[240px]">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-[#E6F8F9] p-2.5 text-[#10C6C1]">
                        <ShieldCheck size={26} />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-[#071B68]">
                          {hero.badgeTitle}
                        </p>
                        <p className="text-xs text-[#5D6B85] mt-0.5 font-medium">
                          {hero.badgeSubtitle}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Floating Working Hours Badge (Top Right) - Pure White */}
                  <div className="hidden sm:flex absolute -top-4 -right-4 rounded-full bg-white px-4 py-2 shadow-lg border border-slate-100/90 items-center gap-2">
                    <Clock size={15} className="text-[#087FBA]" />
                    <span className="text-xs font-semibold text-[#071B68]">
                      {hero.timingBadge}
                    </span>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THREE SPECIALTY CARDS: Dental Care, Skin Care, Hair Care */}
      <section className="section bg-white border-t border-[#DCE8F0]">
        <div className="container">
          <SectionHeading
            eyebrow={specialties.eyebrow}
            title={specialties.heading}
            copy={specialties.description}
          />

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {specialties.items.map((specialty, index) => {
              const icon =
                specialty.id === "dental-care"
                  ? Smile
                  : specialty.id === "skin-care"
                  ? Sparkles
                  : Scissors;
              return (
                <SpecialtyCard
                  key={specialty.id}
                  id={specialty.id}
                  title={specialty.title}
                  tagline={specialty.tagline}
                  desc={specialty.desc}
                  icon={icon}
                  image={specialty.image}
                  features={specialty.features}
                  href={specialty.buttonHref || `/services#${specialty.id}`}
                  delay={index * 0.1}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. ABOUT DRK HOSPITAL INTRODUCTION */}
      <section id="about" className="bg-[#EFFBFC]/50 py-20 border-y border-[#DCE8F0]">
        <div className="container">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            {/* Image Column */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <AnimatedSection delay={0.1}>
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  <div className="relative aspect-[4/3] sm:aspect-[1/1] w-full overflow-hidden rounded-3xl border-4 border-white shadow-xl">
                    <SafeImage
                      src={about.image}
                      alt={about.imageAlt || "DRK Hospital Healthcare"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 450px"
                    />
                  </div>
                  <div className="absolute -bottom-4 -right-4 rounded-2xl bg-white p-4 shadow-xl border border-[#DCE8F0] max-w-[220px]">
                    <p className="text-xs font-semibold text-[#087FBA] uppercase tracking-wider">
                      Our Philosophy
                    </p>
                    <p className="mt-1 text-xs font-bold leading-relaxed text-[#071B68]">
                      Rooted in care. Focused on ethical clinical outcomes.
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            </div>

            {/* Narrative Column */}
            <div className="lg:col-span-7 order-1 lg:order-2">
              <AnimatedSection delay={0.15}>
                <SectionHeading
                  eyebrow={about.eyebrow}
                  title={about.heading}
                  copy={about.paragraphs[0] || ""}
                />

                <div className="space-y-4 text-[#5D6B85] leading-relaxed text-sm sm:text-base">
                  {about.paragraphs.slice(1).map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>

                {/* Verified Checklist */}
                <div className="mt-7 grid gap-3 sm:grid-cols-2 text-xs sm:text-sm font-semibold text-[#14234B]">
                  {about.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <CheckCircle2 size={17} className="text-[#10C6C1] shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link href={about.buttonHref || "/about"} className="btn-primary">
                    <span>{about.buttonText || "Discover DRK"}</span>
                    <ArrowRight size={17} />
                  </Link>
                  <Link href="/gallery" className="btn-outline">
                    <span>View Our Facilities</span>
                  </Link>
                </div>

                {/* Subtle Corporate Identity Note */}
                <div className="mt-6 pt-5 border-t border-[#DCE8F0]/80">
                  <p className="text-xs text-[#5D6B85] leading-relaxed">
                    {legal.legalDescription ||
                      `${legal.publicBrandName || "DRK Hospitals"} is the public healthcare brand associated with ${legal.registeredCompanyName || "DRK Dental Skin & Hair Hospital Private Limited"}.`}
                  </p>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE DRK SECTION */}
      <section className="section bg-white">
        <div className="container">
          <SectionHeading
            centered
            eyebrow={whyDrk.eyebrow}
            title={whyDrk.heading}
            copy={whyDrk.description}
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyDrk.advantages.map((pillar, index) => {
              const Icon = resolveIcon(pillar.icon);
              return (
                <AnimatedSection key={pillar.id || pillar.title} delay={index * 0.08}>
                  <div className="card p-7 text-left flex flex-col justify-between bg-white border border-[#DCE8F0] h-full hover:border-[#087FBA] transition-all">
                    <div>
                      <div className="inline-flex rounded-2xl bg-[#EAF8FA] p-3.5 text-[#087FBA] mb-5">
                        <Icon size={26} />
                      </div>
                      <h3 className="text-lg font-bold text-[#071B68]">
                        {pillar.title}
                      </h3>
                      <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-[#5D6B85]">
                        {pillar.desc}
                      </p>
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. HOSPITAL FACILITIES & INFRASTRUCTURE GALLERY PREVIEW */}
      <section className="bg-[#F8FDFF] py-20 border-t border-[#DCE8F0]">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 mb-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#10C6C1]" />
                <p className="eyebrow">{facilities.eyebrow}</p>
              </div>
              <h2 className="section-title mb-2">
                {facilities.heading}
              </h2>
              <p className="section-copy">
                {facilities.description}
              </p>
            </div>

            <Link
              href={facilities.buttonHref || "/gallery"}
              className="btn-outline shrink-0 inline-flex items-center gap-2 self-start md:self-auto"
            >
              <Camera size={16} />
              <span>{facilities.buttonText || "Explore Full Gallery"}</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          {/* Responsive Facilities Preview Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {facilities.items.map((facility, index) => (
              <FacilityCard
                key={facility.id || facility.title}
                title={facility.title}
                category={facility.category}
                desc={facility.desc}
                image={facility.image}
                delay={index * 0.08}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 6. HEALTHCARE APPROACH & PATIENT CARE SECTION */}
      <section className="section bg-white border-t border-[#DCE8F0]">
        <div className="container">
          <SectionHeading
            centered
            eyebrow={journey.eyebrow}
            title={journey.heading}
            copy={journey.description}
          />

          {/* Journey Steps Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {journey.steps.map((step, index) => {
              const Icon = resolveIcon(step.icon);
              return (
                <ApproachStep
                  key={step.id || step.stepNumber}
                  step={step.stepNumber}
                  title={step.title}
                  desc={step.desc}
                  icon={Icon}
                  delay={index * 0.08}
                />
              );
            })}
          </div>

          {/* Trust Commitments Ribbon */}
          <AnimatedSection delay={0.3} className="mt-12">
            <div className="rounded-2xl border border-[#DCE8F0] bg-[#EFFBFC]/40 p-6 sm:p-8">
              <div className="grid gap-6 sm:grid-cols-3 text-center sm:text-left">
                <div className="flex items-center gap-3 justify-center sm:justify-start">
                  <div className="rounded-xl bg-white p-2.5 text-[#087FBA] shadow-2xs border border-[#DCE8F0]">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#071B68]">
                      Evidence-Informed
                    </h4>
                    <p className="text-xs text-[#5D6B85] mt-0.5">
                      Standardized Clinical Protocols
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 justify-center sm:justify-start">
                  <div className="rounded-xl bg-white p-2.5 text-[#10C6C1] shadow-2xs border border-[#DCE8F0]">
                    <HeartHandshake size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#071B68]">
                      Patient-First
                    </h4>
                    <p className="text-xs text-[#5D6B85] mt-0.5">
                      Gentle, Transparent Consultation
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 justify-center sm:justify-start">
                  <div className="rounded-xl bg-white p-2.5 text-[#071B68] shadow-2xs border border-[#DCE8F0]">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#071B68]">
                      Sterilized Environment
                    </h4>
                    <p className="text-xs text-[#5D6B85] mt-0.5">
                      Hospital-Grade Disinfection
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* REGIONAL HEALTHCARE DESTINATION (~50 KM) */}
      <section className="bg-white py-20 border-t border-[#DCE8F0]">
        <div className="container">
          <AnimatedSection>
            <SectionHeading
              centered
              eyebrow="Regional Healthcare Reach"
              title="Serving Tiruttani & Surrounding Regional Communities"
              copy="DRK Hospitals operates a single central facility in Tiruttani. Surrounding towns represent our regional outpatient service area and patient travel connectivity, not branch clinic locations."
            />
          </AnimatedSection>

          {/* Regional Network Grid */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Tiruttani & Nearby */}
            <AnimatedSection delay={0.05}>
              <div className="card p-6 bg-[#F8FDFF] border border-[#DCE8F0] hover:border-[#087FBA] transition-all h-full flex flex-col justify-between">
                <div>
                  <div className="inline-flex rounded-xl bg-[#EFFBFC] p-3 text-[#087FBA] mb-4">
                    <MapPin size={22} />
                  </div>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-[#10C6C1] mb-1">
                    Central Facility
                  </span>
                  <h3 className="text-lg font-bold text-[#071B68]">Tiruttani (திருத்தணி)</h3>
                  <p className="mt-2 text-xs text-[#5D6B85] leading-relaxed">
                    Full-service outpatient dental operatory, clinical dermatology consultation rooms, and trichology treatment center located in Tiruttani town center.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#DCE8F0] text-[11px] text-[#087FBA] font-semibold">
                  Tiruvallur District • 631209
                </div>
              </div>
            </AnimatedSection>

            {/* Arakkonam */}
            <AnimatedSection delay={0.1}>
              <div className="card p-6 bg-white border border-[#DCE8F0] hover:border-[#087FBA] transition-all h-full flex flex-col justify-between">
                <div>
                  <div className="inline-flex rounded-xl bg-[#EFFBFC] p-3 text-[#087FBA] mb-4">
                    <Train size={22} />
                  </div>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-[#087FBA] mb-1">
                    SH-58 & Rail Corridor
                  </span>
                  <h3 className="text-lg font-bold text-[#071B68]">Arakkonam (அரக்கோணம்)</h3>
                  <p className="mt-2 text-xs text-[#5D6B85] leading-relaxed">
                    Convenient travel for Arakkonam residents via State Highway 58 or direct suburban EMU trains arriving frequently at Tiruttani station.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#DCE8F0] text-[11px] text-[#5D6B85]">
                  SH-58 Direct • Frequent EMU Trains
                </div>
              </div>
            </AnimatedSection>

            {/* Pallipattu */}
            <AnimatedSection delay={0.15}>
              <div className="card p-6 bg-white border border-[#DCE8F0] hover:border-[#087FBA] transition-all h-full flex flex-col justify-between">
                <div>
                  <div className="inline-flex rounded-xl bg-[#EFFBFC] p-3 text-[#087FBA] mb-4">
                    <Bus size={22} />
                  </div>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-[#087FBA] mb-1">
                    SH-61 Road Route
                  </span>
                  <h3 className="text-lg font-bold text-[#071B68]">Pallipattu (பள்ளிப்பட்டு)</h3>
                  <p className="mt-2 text-xs text-[#5D6B85] leading-relaxed">
                    Regular direct road connectivity via SH-61 connecting Pallipattu families with trusted oral health, skin diagnostics, and hair therapy.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#DCE8F0] text-[11px] text-[#5D6B85]">
                  SH-61 Direct Route • Regular Buses
                </div>
              </div>
            </AnimatedSection>

            {/* Sholinghur & Border Region */}
            <AnimatedSection delay={0.2}>
              <div className="card p-6 bg-white border border-[#DCE8F0] hover:border-[#087FBA] transition-all h-full flex flex-col justify-between">
                <div>
                  <div className="inline-flex rounded-xl bg-[#EFFBFC] p-3 text-[#087FBA] mb-4">
                    <Compass size={22} />
                  </div>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-[#087FBA] mb-1">
                    NH-716 & SH-61 Access
                  </span>
                  <h3 className="text-lg font-bold text-[#071B68]">Sholinghur & Nagari</h3>
                  <p className="mt-2 text-xs text-[#5D6B85] leading-relaxed">
                    Accessible healthcare via Tiruttani–Sholinghur Rd and NH-716 serving cross-border and neighboring communities seeking disciplined care.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#DCE8F0] text-[11px] text-[#5D6B85]">
                  NH-716 & SH-61 Regional Access
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Regional Specialties Summary Bar */}
          <AnimatedSection delay={0.25}>
            <div className="mt-8 rounded-2xl bg-[#EFFBFC]/70 border border-[#DCE8F0] p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#087FBA] shadow-2xs border border-[#DCE8F0]">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#071B68]">
                    Specialized Outpatient Disciplines at DRK Hospitals Tiruttani
                  </p>
                  <p className="text-xs text-[#5D6B85]">
                    Comprehensive Dental Sciences • Clinical Dermatology • Diagnostic Trichology
                  </p>
                </div>
              </div>

              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#071B68] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#087FBA] transition shadow-xs shrink-0"
              >
                <span>Plan Your Visit</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* 7. CONTACT INFORMATION & WHATSAPP CTA */}
      <section className="bg-[#EFFBFC]/60 py-20 border-t border-[#DCE8F0]">
        <div className="container">
          <SectionHeading
            centered
            eyebrow={cta.eyebrow}
            title={cta.heading}
            copy={cta.description}
          />

          <div className="grid gap-6 md:grid-cols-3 mb-10">
            {/* Address Card */}
            <AnimatedSection delay={0.05}>
              <div className="card p-7 bg-white border border-[#DCE8F0] h-full flex flex-col justify-between">
                <div>
                  <div className="inline-flex rounded-2xl bg-[#EAF8FA] p-3.5 text-[#087FBA] mb-4">
                    <MapPin size={24} />
                  </div>
                  <h3 className="text-base font-bold text-[#071B68]">Hospital Location</h3>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#5D6B85]">
                    {contact.address && !contact.address.includes("Chennai") && !contact.address.includes("Anna Salai")
                      ? contact.address
                      : defaults.DEFAULT_CONTACT_INFO.address}
                  </p>
                </div>
                <p className="mt-4 text-xs font-semibold text-[#087FBA]">
                  {contact.city}, {contact.state}, {contact.country}
                </p>
              </div>
            </AnimatedSection>

            {/* Direct Phone Helplines */}
            <AnimatedSection delay={0.1}>
              <div className="card p-7 bg-white border border-[#DCE8F0] h-full flex flex-col justify-between">
                <div>
                  <div className="inline-flex rounded-2xl bg-[#EAF8FA] p-3.5 text-[#10C6C1] mb-4">
                    <Phone size={24} />
                  </div>
                  <h3 className="text-base font-bold text-[#071B68]">Phone & Direct Call</h3>
                  <div className="mt-2 space-y-1 text-xs sm:text-sm text-[#5D6B85]">
                    <p>
                      <a
                        href={`tel:${primaryPhone.raw}`}
                        className="font-bold text-[#071B68] hover:text-[#087FBA] transition"
                      >
                        {primaryPhone.number}
                      </a>{" "}
                      ({primaryPhone.label})
                    </p>
                    {secondaryPhone && (
                      <p>
                        <a
                          href={`tel:${secondaryPhone.raw}`}
                          className="font-bold text-[#071B68] hover:text-[#087FBA] transition"
                        >
                          {secondaryPhone.number}
                        </a>{" "}
                        ({secondaryPhone.label})
                      </p>
                    )}
                  </div>
                </div>
                <a
                  href={`tel:${primaryPhone.raw}`}
                  className="mt-4 text-xs font-bold text-[#087FBA] hover:underline"
                >
                  Tap to Call Reception →
                </a>
              </div>
            </AnimatedSection>

            {/* Operating Hours */}
            <AnimatedSection delay={0.15}>
              <div className="card p-7 bg-white border border-[#DCE8F0] h-full flex flex-col justify-between">
                <div>
                  <div className="inline-flex rounded-2xl bg-[#EAF8FA] p-3.5 text-[#071B68] mb-4">
                    <Clock3 size={24} />
                  </div>
                  <h3 className="text-base font-bold text-[#071B68]">Operating Hours</h3>
                  <div className="mt-2 space-y-1 text-xs sm:text-sm text-[#5D6B85]">
                    <p>
                      <strong className="text-[#071B68]">Monday – Saturday:</strong>{" "}
                      {hoursSummary.weekdaysText.replace(/^Mon – Sat:\s*/, "")}
                    </p>
                    <p>
                      <strong className="text-[#071B68]">Sunday:</strong>{" "}
                      {hoursSummary.sundayText.replace(/^Sunday:\s*/, "")}
                    </p>
                    <p className="text-[11px] text-[#087FBA] font-semibold pt-1">
                      {hoursSummary.displayShort}
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-xs text-[#5D6B85]">
                  Walk-in enquiries welcomed during active hours.
                </p>
              </div>
            </AnimatedSection>
          </div>

          {/* WhatsApp Direct Action & Enquiry Card */}
          <AnimatedSection delay={0.2}>
            <div className="card bg-white border border-[#10C6C1]/40 p-8 sm:p-10 shadow-sm rounded-3xl">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-start sm:items-center gap-4">
                  <div className="rounded-2xl bg-[#EAF8FA] p-4 text-[#10C6C1] shrink-0 border border-[#10C6C1]/20">
                    <MessageCircle size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#071B68]">
                      Have a Question or Need Service Details?
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm text-[#5D6B85] max-w-xl leading-relaxed">
                      Send a message on WhatsApp to connect directly with our reception desk for
                      enquiries regarding Dental, Skin, and Hair care services, timings, or directions.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  {contact.whatsapp.isEnabled && (
                    <a
                      href={`https://wa.me/${contact.whatsapp.raw}?text=${encodeURIComponent(
                        contact.whatsapp.defaultMessage
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-[#10C6C1] px-6 py-3.5 text-sm font-bold text-[#071B68] shadow-sm transition hover:bg-[#0da39f] hover:text-white"
                    >
                      <MessageCircle size={17} />
                      <span>{contact.whatsapp.buttonText}</span>
                    </a>
                  )}
                  <Link href="/contact" className="btn-outline text-sm">
                    <span>View Map & Form</span>
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
