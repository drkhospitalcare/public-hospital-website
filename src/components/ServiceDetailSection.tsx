"use client";

import Link from "next/link";
import { ArrowRight, CalendarClock, Phone, ShieldCheck } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import ServiceCard from "@/components/ServiceCard";
import SafeImage from "@/components/SafeImage";
import { HOSPITAL_INFO } from "@/lib/hospital-info";

interface ServiceItem {
  title: string;
  desc: string;
}

interface ServiceDetailSectionProps {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  imageOnRight?: boolean;
  accentColor: string;
  badges: string[];
  services: ServiceItem[];
  consultationTitle: string;
  consultationText: string;
  enquiryText: string;
  bgWhite?: boolean;
}

export default function ServiceDetailSection({
  id,
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  imageOnRight = true,
  accentColor = "#087FBA",
  badges,
  services,
  consultationTitle,
  consultationText,
  enquiryText,
  bgWhite = true,
}: ServiceDetailSectionProps) {
  return (
    <section
      id={id}
      className={`section scroll-mt-24 border-b border-[#DCE8F0] ${
        bgWhite ? "bg-white" : "bg-[#EFFBFC]/35"
      }`}
    >
      <div className="container">
        {/* Department Overview Grid */}
        <div className="grid items-center gap-12 lg:grid-cols-12">
          {/* Content Column */}
          <div
            className={`lg:col-span-7 ${
              !imageOnRight ? "order-1 lg:order-2" : ""
            }`}
          >
            <AnimatedSection>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider" style={{ color: accentColor }}>
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: accentColor }} />
                <span>{eyebrow}</span>
              </div>

              <h2 className="section-title mt-2 text-3xl sm:text-4xl">
                {title}
              </h2>

              <p className="section-copy mt-4 text-[#5D6B85] leading-relaxed">
                {description}
              </p>

              {/* Department Highlights / Badges */}
              <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold text-[#071B68]">
                {badges.map((badge) => (
                  <span
                    key={badge}
                    className="flex items-center gap-2 rounded-full bg-[#EFFBFC] px-4 py-2 border border-[#DCE8F0]"
                  >
                    <ShieldCheck size={15} style={{ color: accentColor }} />
                    <span>{badge}</span>
                  </span>
                ))}
              </div>
            </AnimatedSection>
          </div>

          {/* Image Column */}
          <div
            className={`lg:col-span-5 ${
              !imageOnRight ? "order-2 lg:order-1" : ""
            }`}
          >
            <AnimatedSection delay={0.15}>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border-4 border-white shadow-xl bg-slate-100">
                <SafeImage
                  src={image}
                  alt={imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 500px"
                  fallbackSrc="/images/hero-clinic.jpg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071B68]/30 via-transparent to-transparent pointer-events-none" />
              </div>
            </AnimatedSection>
          </div>
        </div>

        {/* Treatment & Services Cards Grid */}
        <div className="mt-14">
          <div className="mb-6 flex items-center justify-between border-b border-[#DCE8F0] pb-4">
            <h3 className="text-xl font-bold text-[#071B68]">
              Confirmed Clinical Treatments & Procedures
            </h3>
            <span className="text-xs font-semibold text-[#5D6B85]">
              {services.length} Specialized Offerings
            </span>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((item, idx) => (
              <AnimatedSection key={item.title} delay={0.04 * (idx + 1)}>
                <ServiceCard
                  title={item.title}
                  desc={item.desc}
                  accentColor={accentColor}
                />
              </AnimatedSection>
            ))}
          </div>
        </div>

        {/* Consultation Info Box & Contact CTA */}
        <AnimatedSection delay={0.2}>
          <div className="mt-10 rounded-2xl border border-[#DCE8F0] bg-white p-6 sm:p-8 shadow-xs">
            <div className="grid items-center gap-6 lg:grid-cols-12">
              <div className="lg:col-span-8 flex items-start gap-4">
                <div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EFFBFC]" style={{ color: accentColor }}>
                  <CalendarClock size={24} />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-[#071B68]">
                    {consultationTitle}
                  </h4>
                  <p className="mt-1 text-xs sm:text-sm text-[#5D6B85] leading-relaxed">
                    {consultationText}
                  </p>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-wrap lg:justify-end gap-3">
                <Link
                  href="/contact"
                  className="btn-primary text-xs sm:text-sm !py-2.5 !px-5"
                >
                  <span>{enquiryText}</span>
                  <ArrowRight size={16} />
                </Link>
                <a
                  href={`tel:${HOSPITAL_INFO.phone.primaryRaw}`}
                  className="btn-outline text-xs sm:text-sm !py-2.5 !px-4"
                  title="Call Reception"
                >
                  <Phone size={15} />
                  <span>Call Now</span>
                </a>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

