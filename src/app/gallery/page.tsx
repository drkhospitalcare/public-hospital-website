import { Metadata } from "next";
import GalleryClient from "@/components/gallery/GalleryClient";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import { GalleryImage } from "@/types/gallery";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Visual Gallery | DRK Hospitals Tiruttani – Facilities & Care",
  description:
    "Explore DRK Hospitals' visual gallery in Tiruttani, Tamil Nadu. Photos of sterile dental operatories, private dermatology rooms, trichology diagnostic center, and modern hospital facilities.",
  alternates: {
    canonical: "https://drkhospitals.com/gallery",
  },
  openGraph: {
    title: "Visual Gallery | DRK Hospitals Tiruttani",
    description:
      "Explore clinical facilities, sterilized operatories, and patient care environments at DRK Hospitals in Tiruttani, Tamil Nadu.",
    url: "https://drkhospitals.com/gallery",
    images: [
      {
        url: "/images/hero-clinic.jpg",
        width: 1200,
        height: 630,
        alt: "DRK Hospitals Clinical Facilities Gallery",
      },
    ],
  },
};

export default async function GalleryPage() {
  let initialImages: GalleryImage[] = [];

  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseClient();
      if (supabase) {
        const { data, error } = await supabase
          .from("gallery_images")
          .select("*")
          .eq("is_published", true)
          .order("created_at", { ascending: false });

        if (!error && data) {
          initialImages = data as GalleryImage[];
        }
      }
    } catch (err) {
      console.warn("[Gallery] Error pre-fetching images:", err);
    }
  }

  return <GalleryClient initialImages={initialImages} />;
}
