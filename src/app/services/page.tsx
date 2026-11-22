import { Metadata } from "next";
import ServicesClient from "@/components/services/ServicesClient";

export const metadata: Metadata = {
  title: "Services | DRK Hospital Chennai – Dental, Skin & Hair Care",
  description:
    "Explore DRK Hospital's dedicated healthcare specialties: Dental Care, Skin Care, and Hair Care in Chennai. Clinical precision, advanced hygiene, and patient-first care.",
  alternates: {
    canonical: "https://drkhospital.com/services",
  },
  openGraph: {
    title: "Healthcare Services | DRK Hospital Chennai",
    description:
      "Comprehensive dental sciences, clinical dermatology, and specialized trichology treatments delivered with medical excellence in Chennai, Tamil Nadu.",
    url: "https://drkhospital.com/services",
    images: [
      {
        url: "/images/hero-clinic.jpg",
        width: 1200,
        height: 630,
        alt: "DRK Hospital Healthcare Services",
      },
    ],
  },
};

export default function ServicesPage() {
  return <ServicesClient />;
}
