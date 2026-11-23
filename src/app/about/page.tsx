import { Metadata } from "next";
import AboutHero from "@/components/AboutHero";
import FounderProfile from "@/components/FounderProfile";
import StorySection from "@/components/StorySection";
import VisionMission from "@/components/VisionMission";
import HealthcarePhilosophy from "@/components/HealthcarePhilosophy";
import CoreValues from "@/components/CoreValues";
import ClinicalStandards from "@/components/ClinicalStandards";
import AboutFacilities from "@/components/AboutFacilities";
import CompanyIdentity from "@/components/CompanyIdentity";
import ContactCTA from "@/components/ContactCTA";

export const metadata: Metadata = {
  title: "About Us | DRK Hospitals Tiruttani – Rooted in Care",
  description:
    "Learn about DRK Hospitals in Tiruttani, Tamil Nadu, and its corporate entity DRK Dental Skin & Hair Hospital Private Limited. Discover our healthcare story, clinical standards, and modern facilities.",
  alternates: {
    canonical: "https://drkhospitals.com/about",
  },
  openGraph: {
    title: "About DRK Hospitals | Tiruttani, Tamil Nadu",
    description:
      "DRK Hospitals in Tiruttani, Tamil Nadu, and registered corporate entity DRK Dental Skin & Hair Hospital Private Limited. Dedicated to clinical excellence across Dental Care, Skin Care, and Hair Care.",
    url: "https://drkhospitals.com/about",
    images: [
      {
        url: "/images/hospital-building.jpg",
        width: 1200,
        height: 630,
        alt: "DRK Hospitals Tiruttani Infrastructure",
      },
    ],
  },
};

const aboutJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": "https://drkhospitals.com/about#webpage",
  url: "https://drkhospitals.com/about",
  name: "About DRK Hospitals Tiruttani",
  description:
    "Learn about DRK Hospitals in Tiruttani, Tamil Nadu, and registered corporate entity DRK Dental Skin & Hair Hospital Private Limited.",
  mainEntity: {
    "@id": "https://drkhospitals.com/#organization",
  },
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />

      {/* SECTION 1 – HERO */}
      <AboutHero />

      {/* SECTION 2 – FOUNDER PROFILE */}
      <FounderProfile />

      {/* SECTION 3 – OUR STORY ("How We Began") */}
      <StorySection />

      {/* SECTION 4 – VISION AND MISSION */}
      <VisionMission />

      {/* SECTION 5 – OUR HEALTHCARE PHILOSOPHY */}
      <HealthcarePhilosophy />

      {/* SECTION 6 – OUR CORE VALUES */}
      <CoreValues />

      {/* SECTION 7 – CLINICAL STANDARDS */}
      <ClinicalStandards />

      {/* SECTION 8 – OUR FACILITIES */}
      <AboutFacilities />

      {/* SECTION 9 – CORPORATE & LEGAL IDENTITY */}
      <CompanyIdentity />

      {/* SECTION 10 – CONTACT CTA */}
      <ContactCTA
        eyebrow="Connect With DRK Hospitals"
        title="Experience Dedicated Healthcare in Tiruttani"
        description="Whether you have questions regarding our dental, dermatological, or trichological facilities, our reception team is ready to guide you."
      />
    </>
  );
}
