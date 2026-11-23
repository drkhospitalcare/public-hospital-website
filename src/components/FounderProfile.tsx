"use client";

import {
  Quote,
  ShieldCheck,
  HeartHandshake,
  Award,
  Sparkles,
  UserCheck,
  GraduationCap,
  Stethoscope,
  CheckCircle2,
} from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import SafeImage from "@/components/SafeImage";
import { useCMSSection } from "@/lib/useCMS";
import * as defaults from "@/lib/cms-defaults";
import { AboutFounderContent } from "@/types/cms";

export default function FounderProfile() {
  const founder = useCMSSection<AboutFounderContent>(
    "about_founder",
    defaults.DEFAULT_ABOUT_FOUNDER
  );

  // If the administrator disabled the founder section, hide it completely
  if (founder.enabled === false) {
    return null;
  }

  const hasPhoto = Boolean(founder.photoUrl && founder.photoUrl.trim() !== "");
  const showPhotoColumn = hasPhoto || !founder.hidePhotoIfEmpty;
  const isPhotoRight = founder.photoAlignment === "right";

  const qualifications =
    founder.qualifications && founder.qualifications.length > 0
      ? founder.qualifications
      : defaults.DEFAULT_ABOUT_FOUNDER.qualifications || [];

  const specialisations =
    founder.specialisations && founder.specialisations.length > 0
      ? founder.specialisations
      : defaults.DEFAULT_ABOUT_FOUNDER.specialisations || [];

  return (
    <section
      id="founder-profile"
      aria-labelledby="founder-heading"
      className="relative overflow-hidden py-16 md:py-24 border-b border-[#DCE8F0]"
      style={{
        background:
          "radial-gradient(ellipse at 10% 20%, rgba(135, 220, 255, 0.20) 0%, transparent 40%), radial-gradient(ellipse at 90% 80%, rgba(16, 198, 193, 0.12) 0%, transparent 45%), linear-gradient(180deg, #FFFFFF 0%, #F9FDFF 50%, #FFFFFF 100%)",
      }}
    >
      <div className="container relative">
        {/* Section Eyebrow & Headings */}
        <AnimatedSection>
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#DCE8F0] bg-white px-4 py-1.5 shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-[#10C6C1]" />
              <span className="text-xs font-bold tracking-wider text-[#087FBA] uppercase">
                {founder.sectionEyebrow || "Meet Our Founder"}
              </span>
            </div>

            <h2
              id="founder-heading"
              className="mt-4 text-3xl font-extrabold tracking-tight text-[#071B68] sm:text-4xl lg:text-[2.65rem] leading-[1.18]"
            >
              {founder.sectionHeading || "Meet Our Founder"}
            </h2>

            {founder.sectionSubheading && (
              <p className="mt-3 text-base sm:text-lg text-[#5D6B85] font-medium leading-relaxed">
                {founder.sectionSubheading}
              </p>
            )}
          </div>
        </AnimatedSection>

        {/* Main Founder Card Grid */}
        <div
          className={`grid items-start gap-10 lg:gap-14 ${
            showPhotoColumn ? "lg:grid-cols-12" : "max-w-3xl mx-auto"
          }`}
        >
          {/* Photograph Column */}
          {showPhotoColumn && (
            <div
              className={`lg:col-span-5 ${
                isPhotoRight ? "lg:order-2" : "lg:order-1"
              }`}
            >
              <AnimatedSection delay={0.1}>
                <div className="relative mx-auto max-w-sm sm:max-w-md lg:max-w-none space-y-4">
                  {/* Decorative Backdrop Glow */}
                  <div className="absolute -inset-2.5 rounded-3xl bg-gradient-to-tr from-[#087FBA]/15 via-[#10C6C1]/20 to-transparent blur-lg opacity-70" />

                  {/* Photograph Container */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl border-4 border-white bg-gradient-to-b from-[#F0F8FF] to-[#E3F2FD] shadow-xl">
                    {hasPhoto ? (
                      <>
                        <SafeImage
                          src={founder.photoUrl}
                          alt={
                            founder.photoAlt ||
                            `${founder.founderName} – ${founder.founderDesignation}`
                          }
                          fill
                          className="object-cover object-top"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 460px"
                          fallbackSrc="/images/hero-clinic.jpg"
                          priority
                        />
                        {/* Subtle bottom gradient to highlight caption */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#071B68]/85 via-transparent to-transparent pointer-events-none" />
                        <div className="absolute bottom-4 left-4 right-4 text-white pointer-events-none space-y-0.5">
                          <p className="text-base font-extrabold tracking-wide drop-shadow-sm">
                            {founder.founderName}
                          </p>
                          <p className="text-xs text-[#10C6C1] font-semibold leading-snug drop-shadow-sm">
                            {founder.founderDesignation}
                          </p>
                        </div>
                      </>
                    ) : (
                      /* Clean, Professional Placeholder if no photo has been uploaded yet */
                      <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-[#EFFBFC] via-[#F4FBFF] to-[#EAF8FF]">
                        <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-white border border-[#DCE8F0] shadow-md mb-5">
                          <UserCheck size={44} className="text-[#087FBA]" />
                          <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#071B68] text-[10px] font-extrabold text-[#10C6C1] shadow-xs">
                            DRK
                          </span>
                        </div>
                        <span className="rounded-full bg-[#071B68]/10 px-3.5 py-1 text-xs font-bold text-[#071B68] uppercase tracking-wider mb-2">
                          {founder.founderDesignation || "Founder & Chairman"}
                        </span>
                        <h4 className="text-xl font-extrabold text-[#071B68]">
                          {founder.founderName}
                        </h4>
                        <p className="text-xs text-[#5D6B85] mt-1 max-w-[220px]">
                          Official founder portrait will be displayed here upon upload.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Trust Highlights Under Photograph */}
                  <div className="rounded-2xl border border-[#DCE8F0] bg-white p-4 shadow-2xs space-y-2.5">
                    <div className="flex items-center gap-2.5 text-xs font-bold text-[#071B68]">
                      <ShieldCheck size={16} className="text-[#10C6C1] shrink-0" />
                      <span>Dedicated Healthcare Leadership</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs font-semibold text-[#5D6B85]">
                      <HeartHandshake size={16} className="text-[#087FBA] shrink-0" />
                      <span>Patient-Centred Ethical Practice</span>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          )}

          {/* Text Information Column */}
          <div
            className={`${
              showPhotoColumn
                ? `lg:col-span-7 ${isPhotoRight ? "lg:order-1" : "lg:order-2"}`
                : "w-full"
            }`}
          >
            <AnimatedSection delay={0.2}>
              <div className="space-y-6">
                {/* Designation Badge */}
                <div className="inline-flex items-center gap-2 rounded-full bg-[#071B68] px-4 py-1.5 text-xs font-bold text-white shadow-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#10C6C1]" />
                  <span className="tracking-wider uppercase">
                    {founder.founderDesignation || "Chairman – RRK  & DRK Dental Skin & Hair Hospital Pvt. Ltd."}
                  </span>
                </div>

                {/* Founder Name & Subtitle */}
                <div>
                  <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#071B68] leading-tight">
                    {founder.founderName}
                  </h3>
                  <p className="text-sm sm:text-base font-semibold text-[#087FBA] mt-1.5 leading-snug">
                    {founder.founderDesignation}
                  </p>
                </div>

                {/* Founder Statement Card */}
                <div className="relative rounded-2xl border border-[#DCE8F0] bg-white p-6 sm:p-7 shadow-xs space-y-3">
                  <div className="flex items-start gap-3">
                    <Quote
                      size={26}
                      className="text-[#10C6C1] shrink-0 mt-0.5 opacity-90"
                    />
                    <blockquote className="text-base sm:text-lg leading-relaxed text-[#14234B] font-medium">
                      &ldquo;{founder.founderStatement}&rdquo;
                    </blockquote>
                  </div>

                  {founder.additionalBio && (
                    <p className="text-sm leading-relaxed text-[#5D6B85] pt-3 border-t border-[#DCE8F0]/80">
                      {founder.additionalBio}
                    </p>
                  )}
                </div>

                {/* Educational Qualifications Badges */}
                {qualifications.length > 0 && (
                  <div className="rounded-2xl border border-[#DCE8F0] bg-[#F8FDFF] p-5 sm:p-6 shadow-2xs space-y-3.5">
                    <div className="flex items-center gap-2">
                      <GraduationCap size={18} className="text-[#087FBA]" />
                      <h4 className="text-sm font-bold text-[#071B68] uppercase tracking-wider">
                        Educational Qualifications
                      </h4>
                    </div>

                    <div className="flex flex-wrap gap-2 sm:gap-2.5">
                      {qualifications.map((qual) => (
                        <span
                          key={qual}
                          className="inline-flex items-center rounded-xl border border-[#DCE8F0] bg-white px-3.5 py-1.5 text-xs font-extrabold text-[#071B68] shadow-2xs hover:border-[#087FBA] hover:text-[#087FBA] transition-colors"
                        >
                          {qual}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Professional Specialisations Grid */}
                {specialisations.length > 0 && (
                  <div className="space-y-3.5 pt-1">
                    <div className="flex items-center gap-2">
                      <Stethoscope size={18} className="text-[#10C6C1]" />
                      <h4 className="text-sm font-bold text-[#071B68] uppercase tracking-wider">
                        Professional Specialisations
                      </h4>
                    </div>

                    <div className="grid gap-2.5 sm:grid-cols-2">
                      {specialisations.map((spec) => (
                        <div
                          key={spec}
                          className="flex items-center gap-2.5 rounded-xl border border-[#DCE8F0] bg-white p-3 hover:border-[#087FBA] hover:shadow-xs transition-all"
                        >
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#EFFBFC] text-[#087FBA]">
                            <CheckCircle2 size={15} className="text-[#10C6C1]" />
                          </div>
                          <span className="text-xs font-bold text-[#071B68] leading-tight">
                            {spec}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hospital Brand & Regional Foothold */}
                <div className="flex items-center gap-2 pt-2 text-xs text-[#5D6B85]">
                  <span className="font-bold text-[#087FBA] tracking-wider uppercase">
                    DRK Hospitals
                  </span>
                  <span>•</span>
                  <span>Rooted in Care</span>
                  <span>•</span>
                  <span>Tiruttani, Tamil Nadu</span>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
}
