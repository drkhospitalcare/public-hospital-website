import { Metadata } from "next";
import GalleryClient from "@/components/gallery/GalleryClient";

export const metadata: Metadata = {
  title: "Visual Gallery | DRK Hospital Chennai – Facilities & Care",
  description:
    "Explore DRK Hospital's visual gallery in Chennai. Photos of sterile dental operatories, private dermatology rooms, trichology diagnostic center, and modern hospital facilities.",
  alternates: {
    canonical: "https://drkhospital.com/gallery",
  },
  openGraph: {
    title: "Visual Gallery | DRK Hospital Chennai",
    description:
      "Explore clinical facilities, sterilized operatories, and patient care environments at DRK Hospital in Chennai, Tamil Nadu.",
    url: "https://drkhospital.com/gallery",
    images: [
      {
        url: "/images/hero-clinic.jpg",
        width: 1200,
        height: 630,
        alt: "DRK Hospital Clinical Facilities Gallery",
      },
    ],
  },
};

export default function GalleryPage() {
  return <GalleryClient />;
}
