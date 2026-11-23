import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Smile,
  Sparkles,
  Scissors,
  ShieldCheck,
  CheckCircle2,
  Phone,
  MapPin,
  Clock3,
  ArrowRight,
  ArrowLeft,
  CalendarCheck,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import SafeImage from "@/components/SafeImage";
import { HOSPITAL_INFO } from "@/lib/hospital-info";
import {
  SPECIALTY_CATEGORIES,
  ALL_OFFICIAL_SERVICES,
  getTreatmentBySlug,
} from "@/lib/services-catalog";

interface PageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return ALL_OFFICIAL_SERVICES.map((s) => ({
    category: s.specialtyId || "dental-care",
    slug: s.slug || s.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const treatment = getTreatmentBySlug(category, slug);

  if (!treatment) {
    return {
      title: "Treatment Not Found | DRK Hospitals",
    };
  }

  const categoryMeta = SPECIALTY_CATEGORIES[category as keyof typeof SPECIALTY_CATEGORIES];
  const title = treatment.seoTitle || `${treatment.title} in Tiruttani | DRK Hospitals`;
  const description =
    treatment.metaDescription ||
    `${treatment.title} in Tiruttani at DRK Hospitals. ${treatment.desc}`;
  const canonicalUrl = `https://drkhospitals.com/services/${category}/${slug}`;

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      images: [
        {
          url: treatment.image || categoryMeta?.departmentImage || "/images/hero-clinic.jpg",
          width: 1200,
          height: 630,
          alt: treatment.imageAlt || `${treatment.title} at DRK Hospitals Tiruttani`,
        },
      ],
    },
  };
}

export default async function TreatmentDetailPage({ params }: PageProps) {
  const { category, slug } = await params;
  const treatment = getTreatmentBySlug(category, slug);

  if (!treatment || !treatment.specialtyId) {
    notFound();
  }

  const categoryMeta = SPECIALTY_CATEGORIES[treatment.specialtyId];
  if (!categoryMeta) {
    notFound();
  }

  // Related treatments from the same specialty (excluding current)
  const relatedTreatments = ALL_OFFICIAL_SERVICES.filter(
    (s) => s.specialtyId === treatment.specialtyId && s.slug !== treatment.slug
  ).slice(0, 4);

  const CategoryIcon =
    treatment.specialtyId === "dental-care"
      ? Smile
      : treatment.specialtyId === "skin-care"
      ? Sparkles
      : Scissors;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "@id": `https://drkhospitals.com/services/${treatment.specialtyId}/${treatment.slug}#webpage`,
    url: `https://drkhospitals.com/services/${treatment.specialtyId}/${treatment.slug}`,
    name: `${treatment.title} in Tiruttani | DRK Hospitals`,
    description: treatment.desc,
    isPartOf: {
      "@id": "https://drkhospitals.com/#website",
    },
    about: {
      "@type": "MedicalProcedure",
      name: treatment.title,
      description: treatment.desc,
    },
    parentOrganization: {
      "@id": "https://drkhospitals.com/#organization",
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://drkhospitals.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Services",
          item: "https://drkhospitals.com/services",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: categoryMeta.name,
          item: `https://drkhospitals.com/services/${treatment.specialtyId}`,
        },
        {
          "@type": "ListItem",
          position: 4,
          name: treatment.title,
          item: `https://drkhospitals.com/services/${treatment.specialtyId}/${treatment.slug}`,
        },
      ],
    },
  };

  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero / Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#EFFBFC]/60 via-white to-white py-12 lg:py-16 border-b border-[#DCE8F0]">
        <div className="container">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-2 text-xs text-[#5D6B85]">
              <li>
                <Link href="/" className="hover:text-[#087FBA] transition-colors">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/services" className="hover:text-[#087FBA] transition-colors">
                  Services
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link
                  href={`/services/${treatment.specialtyId}`}
                  className="hover:text-[#087FBA] transition-colors"
                >
                  {categoryMeta.name}
                </Link>
              </li>
              <li>/</li>
              <li className="font-semibold text-[#071B68]">{treatment.title}</li>
            </ol>
          </nav>

          <div className="grid items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <AnimatedSection>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#DCE8F0] bg-white px-4 py-1.5 shadow-2xs">
                  <CategoryIcon size={15} style={{ color: categoryMeta.accentColor }} />
                  <span
                    className="text-xs font-bold tracking-wider uppercase"
                    style={{ color: categoryMeta.accentColor }}
                  >
                    {categoryMeta.name} • DRK Hospitals Tiruttani
                  </span>
                </div>

                <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#071B68] sm:text-4xl lg:text-5xl leading-[1.16]">
                  {treatment.title} in Tiruttani
                </h1>

                <p className="mt-4 text-base sm:text-lg text-[#5D6B85] leading-relaxed max-w-3xl">
                  {treatment.desc}
                </p>

                {/* Key Clinical Badges */}
                <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold text-[#071B68]">
                  <span className="flex items-center gap-1.5 rounded-full bg-[#EFFBFC] px-4 py-2 border border-[#DCE8F0]">
                    <ShieldCheck size={15} className="text-[#087FBA]" />
                    <span>Hospital-Grade Sterilization Protocols</span>
                  </span>
                  <span className="flex items-center gap-1.5 rounded-full bg-[#EFFBFC] px-4 py-2 border border-[#DCE8F0]">
                    <CheckCircle2 size={15} className="text-[#10C6C1]" />
                    <span>Specialist Consultation & Assessment</span>
                  </span>
                  <span className="flex items-center gap-1.5 rounded-full bg-[#EFFBFC] px-4 py-2 border border-[#DCE8F0]">
                    <MapPin size={15} className="text-[#071B68]" />
                    <span>Tiruttani Clinical Facility</span>
                  </span>
                </div>

                {/* Direct Action Buttons */}
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <a
                    href={`tel:${HOSPITAL_INFO.phone.primaryRaw}`}
                    className="btn-primary inline-flex items-center gap-2 text-sm font-bold"
                  >
                    <Phone size={16} />
                    <span>Call Helpline: {HOSPITAL_INFO.phone.primary}</span>
                  </a>
                  <Link
                    href="/contact"
                    className="btn-outline inline-flex items-center gap-2 text-sm font-bold"
                  >
                    <span>Hospital Location & Timings</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </AnimatedSection>
            </div>

            {/* Visual Column */}
            <div className="lg:col-span-4">
              <AnimatedSection delay={0.1}>
                <div className="relative aspect-[4/3] sm:aspect-[1/1] w-full overflow-hidden rounded-3xl border-4 border-white shadow-xl bg-slate-100">
                  <SafeImage
                    src={treatment.image || categoryMeta.departmentImage}
                    alt={treatment.imageAlt || `${treatment.title} at DRK Hospitals Tiruttani`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 400px"
                    fallbackSrc={categoryMeta.departmentImage}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071B68]/30 via-transparent to-transparent pointer-events-none" />
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* Clinical Overview & Methodology Section */}
      <section className="section bg-white border-b border-[#DCE8F0]">
        <div className="container max-w-5xl">
          <div className="grid gap-10 lg:grid-cols-12">
            {/* Left Content Column */}
            <div className="lg:col-span-8 space-y-8">
              {/* Clinical Information Review Notice */}
              <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-xs text-amber-900 flex items-start gap-3">
                <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold uppercase tracking-wider text-[11px] text-amber-800 block">
                    Clinical Information Status: Pending Clinical Review
                  </span>
                  <p className="mt-1 leading-relaxed text-amber-800/90">
                    This informational overview is provided for general patient educational awareness. Specific clinical eligibility, procedure steps, diagnostics, and recovery timelines are established strictly during an in-person clinical examination by registered healthcare practitioners at DRK Hospitals, Tiruttani.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-extrabold text-[#071B68]">
                  Clinical Overview & Procedure Details
                </h2>
                <div className="mt-4 prose prose-slate text-base text-[#5D6B85] leading-relaxed">
                  <p>{treatment.detailedDescription || treatment.desc}</p>
                </div>
              </div>

              {/* Patient Suitability Notice (Compliance Guard) */}
              <div className="rounded-2xl border border-[#DCE8F0] bg-[#F8FDFF] p-6 shadow-2xs">
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-[#087FBA]/10 p-2.5 text-[#087FBA] shrink-0">
                    <HelpCircle size={22} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#071B68]">
                      Consultation & Suitability Guidance
                    </h3>
                    <p className="mt-2 text-sm text-[#5D6B85] leading-relaxed">
                      Every patient journey at DRK Hospitals begins with a comprehensive, private consultation with our qualified medical team in Tiruttani. Because clinical indications vary across individuals, treatment suitability, procedural steps, and expected outcomes are discussed transparently after careful examination. We do not provide one-size-fits-all treatments or unverified guarantees.
                    </p>
                  </div>
                </div>
              </div>

              {/* What to Expect During Your Visit */}
              <div>
                <h3 className="text-xl font-bold text-[#071B68]">
                  What to Expect at DRK Hospitals
                </h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="p-4 rounded-xl border border-[#DCE8F0] bg-white">
                    <div className="font-bold text-[#071B68] text-sm flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#EFFBFC] text-xs text-[#087FBA] font-extrabold">
                        1
                      </span>
                      Diagnostic Evaluation
                    </div>
                    <p className="mt-2 text-xs text-[#5D6B85] leading-relaxed">
                      Detailed diagnostic assessment using intraoral radiography, dermatoscopy, or trichoscopy.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-[#DCE8F0] bg-white">
                    <div className="font-bold text-[#071B68] text-sm flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#EFFBFC] text-xs text-[#087FBA] font-extrabold">
                        2
                      </span>
                      Transparent Discussion
                    </div>
                    <p className="mt-2 text-xs text-[#5D6B85] leading-relaxed">
                      Clear explanation of findings, treatment choices, anticipated duration, and transparent care plans.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-[#DCE8F0] bg-white">
                    <div className="font-bold text-[#071B68] text-sm flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#EFFBFC] text-xs text-[#087FBA] font-extrabold">
                        3
                      </span>
                      Sterile Execution
                    </div>
                    <p className="mt-2 text-xs text-[#5D6B85] leading-relaxed">
                      Procedures executed in sanitized operatory suites following medical-grade infection control standards.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-[#DCE8F0] bg-white">
                    <div className="font-bold text-[#071B68] text-sm flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#EFFBFC] text-xs text-[#087FBA] font-extrabold">
                        4
                      </span>
                      Post-Care Guidance
                    </div>
                    <p className="mt-2 text-xs text-[#5D6B85] leading-relaxed">
                      Dedicated post-procedure instructions and follow-up support to ensure continuous comfort and healing.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Information & Enquiry Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              {/* Hospital Facility & Desk Card */}
              <div className="card p-6 border-2 border-[#071B68]/15 bg-[#F8FDFF] rounded-2xl shadow-xs space-y-4">
                <div className="border-b border-[#DCE8F0] pb-3">
                  <span className="text-[11px] font-bold text-[#087FBA] uppercase tracking-wider block">
                    Hospital Consultation Desk
                  </span>
                  <h4 className="text-lg font-extrabold text-[#071B68] mt-1">
                    DRK Hospitals
                  </h4>
                  <p className="text-xs text-[#5D6B85] mt-0.5">
                    {HOSPITAL_INFO.legalName}
                  </p>
                </div>

                <div className="space-y-3 text-xs text-[#5D6B85]">
                  <div className="flex items-start gap-2.5">
                    <MapPin size={16} className="text-[#087FBA] shrink-0 mt-0.5" />
                    <span>{HOSPITAL_INFO.address}</span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Clock3 size={16} className="text-[#087FBA] shrink-0" />
                    <span>{HOSPITAL_INFO.workingHours.weekdays}</span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Phone size={16} className="text-[#087FBA] shrink-0" />
                    <span className="font-bold text-[#071B68]">{HOSPITAL_INFO.phone.primary}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href={`tel:${HOSPITAL_INFO.phone.primaryRaw}`}
                    className="btn-primary w-full text-center text-xs font-bold py-2.5 block"
                  >
                    Call Front Desk
                  </a>
                </div>
              </div>

              {/* Back to Specialty Hub */}
              <div className="p-4 rounded-xl border border-[#DCE8F0] bg-white">
                <Link
                  href={`/services/${treatment.specialtyId}`}
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#087FBA] hover:text-[#071B68] transition-colors"
                >
                  <ArrowLeft size={14} />
                  <span>View All {categoryMeta.name} Treatments</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Treatments Carousel/Grid */}
      {relatedTreatments.length > 0 && (
        <section className="section bg-[#F8FDFF] border-b border-[#DCE8F0]">
          <div className="container max-w-5xl">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#DCE8F0]">
              <div>
                <h3 className="text-xl font-bold text-[#071B68]">
                  More Treatments in {categoryMeta.name}
                </h3>
                <p className="text-xs text-[#5D6B85] mt-1">
                  Explore other specialized outpatient services at DRK Hospitals in Tiruttani.
                </p>
              </div>
              <Link
                href={`/services/${treatment.specialtyId}`}
                className="text-xs font-bold text-[#087FBA] hover:underline hidden sm:inline-flex items-center gap-1"
              >
                <span>Full List</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {relatedTreatments.map((item) => (
                <div
                  key={item.id}
                  className="card p-5 border border-[#DCE8F0] bg-white flex flex-col justify-between hover:border-[#087FBA] transition-all hover:shadow-sm"
                >
                  <div>
                    <h4 className="text-sm font-bold text-[#071B68]">
                      {item.title}
                    </h4>
                    <p className="mt-2 text-xs text-[#5D6B85] line-clamp-3 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#DCE8F0]/70">
                    <Link
                      href={`/services/${treatment.specialtyId}/${item.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#087FBA] hover:text-[#071B68] transition"
                    >
                      <span>Read Treatment Details</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="py-14 bg-white">
        <div className="container max-w-4xl text-center">
          <h3 className="text-2xl font-extrabold text-[#071B68]">
            Need Advice Regarding {treatment.title}?
          </h3>
          <p className="mt-3 text-sm text-[#5D6B85] max-w-xl mx-auto leading-relaxed">
            Our hospital desk in Tiruttani is available Monday through Sunday to provide clinical consultation details, doctor availability, and visitor information.
          </p>
          <div className="mt-6 flex flex-wrap justify-center items-center gap-4">
            <a
              href={`tel:${HOSPITAL_INFO.phone.primaryRaw}`}
              className="btn-primary inline-flex items-center gap-2 text-sm font-bold"
            >
              <Phone size={15} />
              <span>Call Helpline: {HOSPITAL_INFO.phone.primary}</span>
            </a>
            <Link href="/services" className="btn-outline text-sm font-bold">
              <span>Explore All Specialties</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
