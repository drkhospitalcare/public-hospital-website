import { Metadata } from "next";
import AboutHero from "@/components/AboutHero";
import FounderProfile from "@/components/FounderProfile";
import StorySection from "@/components/StorySection";
import VisionMission from "@/components/VisionMission";
import HealthcarePhilosophy from "@/components/HealthcarePhilosophy";
import CoreValues from "@/components/CoreValues";
import ClinicalStandards from "@/components/ClinicalStandards";
import AboutFacilities from "@/components/AboutFacilities";
import ContactCTA from "@/components/ContactCTA";

export const metadata: Metadata = {
  title: "About Us | DRK Hospitals Tiruttani – Rooted in Care",
  description:
    "Learn about DRK Hospitals in Tiruttani, Tamil Nadu. Discover our healthcare story, vision, mission, healthcare philosophy, core values, clinical standards, and modern facilities for Dental, Skin, and Hair health.",
  alternates: {
    canonical: "https://drkhospitals.com/about",
  },
  openGraph: {
    title: "About DRK Hospitals | Tiruttani, Tamil Nadu",
    description:
      "A dedicated healthcare center in Tiruttani committed to clinical excellence across Dental Care, Skin Care, and Hair Care. Rooted in care with compassionate, disciplined expertise.",
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

export default function AboutPage() {
  return (
    <>
      {/* SECTION 1 – HERO */}
      <AboutHero />

      {/* SECTION 2 – FOUNDER PROFILE */}
      <FounderProfile />

      {/* SECTION 3 – OUR STORY ("How We Began") */}
      <StorySection />

      {/* SECTION 3 – VISION AND MISSION */}
      <VisionMission />

      {/* SECTION 4 – OUR HEALTHCARE PHILOSOPHY */}
      <HealthcarePhilosophy />

      {/* SECTION 5 – OUR CORE VALUES */}
      <CoreValues />

      {/* SECTION 6 – CLINICAL STANDARDS */}
      <ClinicalStandards />

      {/* SECTION 7 – OUR FACILITIES */}
      <AboutFacilities />

      {/* SECTION 8 – CONTACT CTA */}
      <ContactCTA
        eyebrow="Connect With DRK Hospitals"
        title="Experience Dedicated Healthcare in Tiruttani"
        description="Whether you have questions regarding our dental, dermatological, or trichological facilities, our reception team is ready to guide you."
      />
    </>
  );
}
