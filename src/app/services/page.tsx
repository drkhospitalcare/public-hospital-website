import { Metadata } from "next";
import ServicesClient from "@/components/services/ServicesClient";

export const metadata: Metadata = {
  title: "Services | DRK Hospitals Tiruttani – Dental, Skin & Hair Care",
  description:
    "Explore DRK Hospitals' dedicated healthcare specialties: Dental Care, Skin Care, and Hair Care in Tiruttani, Tamil Nadu. Clinical precision, advanced hygiene, and patient-first care.",
  alternates: {
    canonical: "https://drkhospitals.com/services",
  },
  openGraph: {
    title: "Healthcare Services | DRK Hospitals Tiruttani",
    description:
      "Comprehensive dental sciences, clinical dermatology, and specialized trichology treatments delivered with medical excellence in Tiruttani, Tamil Nadu.",
    url: "https://drkhospitals.com/services",
    images: [
      {
        url: "/images/hero-clinic.jpg",
        width: 1200,
        height: 630,
        alt: "DRK Hospitals Healthcare Services",
      },
    ],
  },
};

const servicesJsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalWebPage",
  "@id": "https://drkhospitals.com/services#webpage",
  url: "https://drkhospitals.com/services",
  name: "Healthcare Services | DRK Hospitals Tiruttani",
  description:
    "Comprehensive dental sciences, clinical dermatology, and specialized trichology treatments delivered with medical excellence in Tiruttani, Tamil Nadu.",
  about: {
    "@id": "https://drkhospitals.com/#organization",
  },
};

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd) }}
      />
      <ServicesClient />
    </>
  );
}
