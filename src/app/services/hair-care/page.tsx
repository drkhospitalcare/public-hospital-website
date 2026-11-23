import { Metadata } from "next";
import Link from "next/link";
import { Scissors, ShieldCheck, ArrowRight, Phone, MapPin, Clock3, CheckCircle2 } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import SafeImage from "@/components/SafeImage";
import { HOSPITAL_INFO } from "@/lib/hospital-info";
import { getPublishedSection } from "@/lib/cms";
import * as defaults from "@/lib/cms-defaults";
import { SpecialtyServicesContent, SingleServiceCard } from "@/types/cms";

export const metadata: Metadata = {
  title: {
    absolute: "Hair Treatment & Trichology Clinic in Tiruttani | DRK Hospitals",
  },
  description:
    "Targeted hair treatment and scalp diagnostics in Tiruttani at DRK Hospitals. Advanced trichology evaluations, PRP hair treatment, GFC therapy, dandruff care, and hair regrowth in Tiruttani.",
  alternates: {
    canonical: "https://drkhospitals.com/services/hair-care",
  },
  openGraph: {
    title: "Hair Treatment & Trichology Clinic in Tiruttani | DRK Hospitals",
    description:
      "Comprehensive scalp diagnostics, hair loss management, PRP/GFC therapeutic care, and trichology focused on follicular health at DRK Hospitals in Tiruttani.",
    url: "https://drkhospitals.com/services/hair-care",
    images: [
      {
        url: "/images/hair-care.jpg",
        width: 1200,
        height: 630,
        alt: "Trichology and Hair Care Operatory at DRK Hospitals Tiruttani",
      },
    ],
  },
};

export default async function HairCarePage() {
  const hair = await getPublishedSection<SpecialtyServicesContent>(
    "services_hair",
    defaults.DEFAULT_SERVICES_HAIR
  );

  const activeTreatments = (hair.services || []).filter(
    (s: SingleServiceCard) => s.is_published !== false
  );

  const hairJsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "@id": "https://drkhospitals.com/services/hair-care#webpage",
    url: "https://drkhospitals.com/services/hair-care",
    name: "Hair Treatment & Trichology Clinic in Tiruttani | DRK Hospitals",
    description:
      "Clinical trichology evaluations, scalp health diagnostics, PRP and GFC therapies, and hair loss treatments in Tiruttani.",
    isPartOf: {
      "@id": "https://drkhospitals.com/#website",
    },
    about: {
      "@type": "MedicalBusiness",
      name: "DRK Hospitals – Department of Trichology & Hair Care",
      legalName: HOSPITAL_INFO.legalName,
      parentOrganization: {
        "@id": "https://drkhospitals.com/#organization",
      },
      telephone: HOSPITAL_INFO.phone.primary,
      address: {
        "@type": "PostalAddress",
        streetAddress: HOSPITAL_INFO.street,
        addressLocality: HOSPITAL_INFO.city,
        addressRegion: HOSPITAL_INFO.state,
        postalCode: HOSPITAL_INFO.pincode,
        addressCountry: "IN",
      },
      medicalSpecialty: "Dermatology",
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          opens: "09:00",
          closes: "21:00",
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: "Sunday",
          opens: "09:00",
          closes: "21:00",
        },
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Hair and Trichology Treatments",
        itemListElement: activeTreatments.map((proc, index) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "MedicalProcedure",
            name: proc.title,
            description: proc.desc,
            url: `https://drkhospitals.com/services/hair-care/${proc.slug || proc.id}`,
          },
          position: index + 1,
        })),
      },
    },
  };

  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(hairJsonLd) }}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#EFFBFC]/60 via-white to-white py-14 lg:py-20 border-b border-[#DCE8F0]">
        <div className="container">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-xs text-[#5D6B85]">
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
              <li className="font-semibold text-[#071B68]">Hair Care</li>
            </ol>
          </nav>

          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <AnimatedSection>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#DCE8F0] bg-white px-4 py-1.5 shadow-2xs">
                  <Scissors size={16} className="text-[#071B68]" />
                  <span className="text-xs font-bold tracking-wider text-[#071B68] uppercase">
                    Department of Trichology & Scalp Sciences
                  </span>
                </div>

                <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#071B68] sm:text-4xl lg:text-[2.75rem] leading-[1.16]">
                  Hair Treatment & Trichology Clinic in Tiruttani
                </h1>

                <p className="mt-4 text-base sm:text-lg text-[#5D6B85] leading-relaxed">
                  Welcome to the Department of Trichology & Scalp Sciences at DRK Hospitals in Tiruttani. We provide specialized clinical hair care, digital tricho analysis, autologous PRP and GFC treatments, dandruff solutions, and evidence-based hair regrowth plans.
                </p>

                <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold text-[#071B68]">
                  <span className="flex items-center gap-1.5 rounded-full bg-[#EFFBFC] px-4 py-2 border border-[#DCE8F0]">
                    <ShieldCheck size={15} className="text-[#087FBA]" />
                    <span>Microscopic Trichoscopy Diagnostics</span>
                  </span>
                  <span className="flex items-center gap-1.5 rounded-full bg-[#EFFBFC] px-4 py-2 border border-[#DCE8F0]">
                    <CheckCircle2 size={15} className="text-[#087FBA]" />
                    <span>Advanced Autologous PRP & GFC</span>
                  </span>
                  <span className="flex items-center gap-1.5 rounded-full bg-[#EFFBFC] px-4 py-2 border border-[#DCE8F0]">
                    <Clock3 size={15} className="text-[#087FBA]" />
                    <span>Mon – Sun: 9:00 AM – 9:00 PM</span>
                  </span>
                </div>

                <div className="mt-8 flex flex-wrap gap-4">
                  <Link href="/contact" className="btn-primary">
                    <span>Enquire About Hair Care</span>
                    <ArrowRight size={16} />
                  </Link>
                  <a href={`tel:${HOSPITAL_INFO.phone.primaryRaw}`} className="btn-outline">
                    <Phone size={15} />
                    <span>Call Reception: {HOSPITAL_INFO.phone.primary}</span>
                  </a>
                </div>
              </AnimatedSection>
            </div>

            <div className="lg:col-span-5">
              <AnimatedSection delay={0.15}>
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border-4 border-white shadow-xl bg-slate-100">
                  <SafeImage
                    src={hair.departmentImage || "/images/hair-care.jpg"}
                    alt={hair.departmentImageAlt || "Trichology Clinic & Scalp Care at DRK Hospitals Tiruttani"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 500px"
                    fallbackSrc="/images/hero-clinic.jpg"
                  />
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* Treatments Grid */}
      <section className="section bg-white border-b border-[#DCE8F0]">
        <div className="container">
          <AnimatedSection>
            <div className="max-w-2xl mx-auto text-center mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-[#071B68]">
                Clinical Treatments ({activeTreatments.length})
              </span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#071B68]">
                Hair Treatments Available in Tiruttani
              </h2>
              <p className="mt-3 text-sm text-[#5D6B85]">
                Our trichology department delivers targeted solutions for hair thinning, scalp flaking, and follicular rejuvenation.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {activeTreatments.map((proc, idx) => (
              <AnimatedSection key={proc.id || idx} delay={idx * 0.04}>
                <div className="h-full rounded-2xl border border-[#DCE8F0] bg-[#F8FDFF] p-6 hover:border-[#071B68] hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white border border-[#DCE8F0] text-[#071B68] shadow-2xs font-bold text-xs">
                        {String(idx + 1).padStart(2, "0")}
                      </div>
                      <span className="text-[11px] font-bold text-[#071B68] uppercase tracking-wider">
                        Hair Care
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-[#071B68]">{proc.title}</h3>
                    <p className="mt-2 text-xs sm:text-sm text-[#5D6B85] leading-relaxed">
                      {proc.desc}
                    </p>
                  </div>

                  <div className="mt-5 pt-3.5 border-t border-[#DCE8F0]/80 flex items-center justify-between text-xs">
                    {proc.slug ? (
                      <Link
                        href={`/services/hair-care/${proc.slug}`}
                        className="font-bold text-[#087FBA] hover:text-[#071B68] inline-flex items-center gap-1 transition"
                      >
                        <span>Learn More</span>
                        <ArrowRight size={13} />
                      </Link>
                    ) : (
                      <span className="text-slate-400 font-medium">In-Clinic Care</span>
                    )}
                    <Link
                      href="/contact"
                      className="text-[#5D6B85] hover:text-[#071B68] font-semibold transition"
                    >
                      Enquire
                    </Link>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Local Catchment & Hospital Details */}
      <section className="section bg-[#F8FDFF]">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-12 items-center">
            <div className="lg:col-span-7">
              <span className="text-xs font-bold uppercase tracking-wider text-[#071B68]">
                Local Healthcare Access
              </span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#071B68]">
                Serving Tiruttani, Arakkonam, Pallipattu, Sholinghur & Nagari
              </h2>
              <p className="mt-4 text-sm sm:text-base text-[#5D6B85] leading-relaxed">
                Patients seeking expert trichology assessments, PRP hair therapies, and chronic dandruff management from Tiruttani and neighboring regional communities trust DRK Hospitals for honest evaluations and modern care.
              </p>

              <div className="mt-6 space-y-3 text-xs sm:text-sm text-[#5D6B85]">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-[#087FBA] shrink-0" />
                  <span><strong>Location:</strong> {HOSPITAL_INFO.fullAddress}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock3 size={16} className="text-[#087FBA] shrink-0" />
                  <span><strong>Operating Hours:</strong> {HOSPITAL_INFO.workingHours.full}</span>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/services" className="btn-outline text-xs">
                  ← Back to All Services
                </Link>
                <Link href="/about" className="btn-outline text-xs">
                  About DRK Hospitals
                </Link>
                <Link href="/contact" className="btn-primary text-xs">
                  Contact Clinic & Map Directions
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 rounded-2xl border border-[#DCE8F0] bg-white p-6 shadow-xs">
              <h3 className="text-base font-bold text-[#071B68] mb-3">
                Trichology Consultation Process
              </h3>
              <p className="text-xs sm:text-sm text-[#5D6B85] leading-relaxed">
                During your trichology consultation, high-magnification trichoscopy assesses follicular unit density, scalp health, and hair shaft caliber to formulate a tailored treatment roadmap.
              </p>
              <div className="mt-5 pt-4 border-t border-[#DCE8F0]">
                <p className="text-xs text-[#5D6B85]">
                  Need guidance on hair fall or scalp health? Call our reception desk at{" "}
                  <a href={`tel:${HOSPITAL_INFO.phone.primaryRaw}`} className="font-bold text-[#087FBA]">
                    {HOSPITAL_INFO.phone.primary}
                  </a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
