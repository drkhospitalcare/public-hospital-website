"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import SafeImage from "@/components/SafeImage";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Filter,
  Camera,
  Layers,
  RefreshCw,
  AlertCircle,
  Calendar,
} from "lucide-react";
import { GalleryCategory, GalleryImage } from "@/types/gallery";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";

const categories: Array<"All" | GalleryCategory> = [
  "All",
  "Dental Care",
  "Skin Care",
  "Hair Care",
  "Hospital Infrastructure",
  "Hospital Activities",
];

export default function GalleryClient() {
  const [selectedCategory, setSelectedCategory] = useState<"All" | GalleryCategory>("All");
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Fetch images from Supabase or fallback
  const fetchGallery = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!isSupabaseConfigured()) {
      setImages([]);
      setLoading(false);
      return;
    }

    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        setImages([]);
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from("gallery_images")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (fetchError) {
        console.warn("Supabase query error:", fetchError);
        setImages([]);
      } else if (data && data.length > 0) {
        setImages(data as GalleryImage[]);
      } else {
        setImages([]);
      }
    } catch (err: unknown) {
      console.warn("Unexpected error fetching gallery:", err);
      setImages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  // Filtered items based on active category
  const filteredImages = selectedCategory === "All"
    ? images
    : images.filter((img) => img.category === selectedCategory);

  // Category counts
  const getCategoryCount = (cat: "All" | GalleryCategory) => {
    if (cat === "All") return images.length;
    return images.filter((img) => img.category === cat).length;
  };

  // Lightbox handlers
  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    if (typeof document !== "undefined") {
      document.body.style.overflow = "hidden";
    }
  };

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
    if (typeof document !== "undefined") {
      document.body.style.overflow = "unset";
    }
  }, []);

  const showNext = useCallback(() => {
    if (lightboxIndex !== null && filteredImages.length > 0) {
      setLightboxIndex((prev) => ((prev! + 1) % filteredImages.length));
    }
  }, [lightboxIndex, filteredImages.length]);

  const showPrev = useCallback(() => {
    if (lightboxIndex !== null && filteredImages.length > 0) {
      setLightboxIndex((prev) =>
        prev! === 0 ? filteredImages.length - 1 : prev! - 1
      );
    }
  }, [lightboxIndex, filteredImages.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, closeLightbox, showNext, showPrev]);

  const activeImage = lightboxIndex !== null && filteredImages[lightboxIndex] ? filteredImages[lightboxIndex] : null;

  return (
    <>
      {/* Hero Banner with Approved Light-Blue Gradient */}
      <section
        className="relative overflow-hidden pt-12 pb-16 md:pt-16 md:pb-20 border-b border-[#DCE8F0]"
        style={{
          background:
            "radial-gradient(ellipse at 95% 50%, rgba(135, 220, 255, 0.30) 0%, transparent 48%), radial-gradient(ellipse at 85% 100%, rgba(16, 198, 193, 0.10) 0%, transparent 35%), linear-gradient(110deg, #FFFFFF 0%, #FFFFFF 48%, #F4FBFF 75%, #EAF8FF 100%)",
        }}
      >
        <div className="container relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#DCE8F0] bg-white px-4 py-1.5 shadow-2xs mb-4">
              <Camera size={14} className="text-[#10C6C1]" />
              <span className="text-xs font-bold tracking-wider text-[#071B68] uppercase">
                Visual Tour • DRK Hospital Chennai
              </span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-[#071B68] sm:text-5xl md:text-6xl leading-[1.12]">
              Hospital <span className="text-[#087FBA]">Gallery</span>
            </h1>
            <p className="mt-5 text-base sm:text-lg leading-relaxed text-[#5D6B85] max-w-2xl">
              Take a visual journey through DRK Hospital. Explore our sterile dental suites,
              dermatology consultation rooms, trichology diagnostic center, and daily patient care in Chennai.
            </p>
          </div>
        </div>
      </section>

      {/* Main Gallery Section */}
      <section className="section bg-white">
        <div className="container">
          {/* Error Notice with Retry */}
          {error && (
            <div className="mb-8 flex items-center justify-between gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs sm:text-sm text-amber-900">
              <div className="flex items-center gap-3">
                <AlertCircle size={18} className="text-amber-600 shrink-0" />
                <span>{error}</span>
              </div>
              <button
                type="button"
                onClick={fetchGallery}
                className="flex items-center gap-1.5 rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-bold text-amber-900 hover:bg-amber-100 transition cursor-pointer"
              >
                <RefreshCw size={13} />
                <span>Retry</span>
              </button>
            </div>
          )}

          {/* Category Filter Tabs */}
          <div className="mb-10 flex flex-wrap items-center gap-2.5 pb-3 border-b border-[#DCE8F0]">
            <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-[#5D6B85] mr-2">
              <Filter size={14} className="text-[#087FBA]" />
              <span>Filter Category:</span>
            </div>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              const count = getCategoryCount(cat);
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  style={
                    isSelected
                      ? { backgroundColor: "#071B68", color: "#FFFFFF" }
                      : { backgroundColor: "#EFFBFC", color: "#071B68" }
                  }
                  className={`cursor-pointer rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2 border ${
                    isSelected
                      ? "border-[#071B68] shadow-sm"
                      : "border-[#DCE8F0] hover:bg-[#D7F5F6]"
                  }`}
                >
                  <span style={{ color: isSelected ? "#FFFFFF" : "#071B68" }}>
                    {cat}
                  </span>
                  <span
                    style={{
                      backgroundColor: isSelected ? "rgba(255, 255, 255, 0.25)" : "#DCE8F0",
                      color: isSelected ? "#FFFFFF" : "#071B68",
                    }}
                    className="rounded-full px-2 py-0.5 text-[11px] font-bold"
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Image Grid / Loading Skeleton / Empty State */}
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[4/3] rounded-2xl bg-slate-100 animate-pulse border border-[#DCE8F0] p-4 flex flex-col justify-end"
                >
                  <div className="h-4 w-1/3 bg-slate-200 rounded mb-2" />
                  <div className="h-3 w-2/3 bg-slate-200 rounded" />
                </div>
              ))}
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center py-20 card p-8 sm:p-12 max-w-lg mx-auto border border-[#DCE8F0] bg-white shadow-2xs">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EFFBFC] text-[#087FBA] mx-auto mb-4 border border-[#DCE8F0]">
                {images.length === 0 ? (
                  <Camera size={30} className="text-[#087FBA]" />
                ) : (
                  <Layers size={28} className="text-[#087FBA]" />
                )}
              </div>
              <h3 className="text-xl font-bold text-[#071B68]">
                {images.length === 0
                  ? "Hospital Gallery Being Curated"
                  : `No images in “${selectedCategory}” yet`}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#5D6B85] leading-relaxed max-w-sm mx-auto">
                {images.length === 0
                  ? "Photographs of our sterile treatment suites, clinical consultations, and hospital infrastructure are currently being prepared for display."
                  : "Photographs for this specialty are currently being updated. Please select another category or check back soon."}
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                {selectedCategory !== "All" && images.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedCategory("All")}
                    className="btn-primary !py-2.5 !px-5 text-xs"
                  >
                    <span>View All Gallery Images</span>
                  </button>
                )}
                <a
                  href="/services"
                  className="inline-flex items-center gap-2 rounded-full border border-[#DCE8F0] bg-white px-5 py-2.5 text-xs font-bold text-[#071B68] hover:bg-slate-50 transition"
                >
                  <span>Explore Specialties</span>
                </a>
                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-[#071B68] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#087FBA] transition"
                >
                  <span>Contact DRK Hospital</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredImages.map((image, index) => (
                <div
                  key={image.id || index}
                  onClick={() => openLightbox(index)}
                  className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-2xl border border-[#DCE8F0] bg-slate-100 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#087FBA]"
                >
                  {/* Image */}
                  <SafeImage
                    src={image.public_url}
                    alt={image.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />

                  {/* Category Pill Tag */}
                  <div className="absolute top-3 left-3 z-10 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold text-[#071B68] shadow-xs backdrop-blur-xs">
                    {image.category}
                  </div>

                  {/* Hover Overlay with Caption & Zoom Icon */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071B68]/95 via-[#071B68]/45 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-end p-5 text-white">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-base font-bold text-white drop-shadow-xs">
                          {image.title}
                        </h3>
                        {image.caption && (
                          <p className="mt-1 text-xs text-blue-100 line-clamp-2 drop-shadow-xs">
                            {image.caption}
                          </p>
                        )}
                      </div>
                      <div className="rounded-full bg-white/20 p-2 text-white shrink-0 backdrop-blur-xs">
                        <Maximize2 size={16} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {activeImage && lightboxIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={closeLightbox}
            aria-label="Close lightbox"
            className="cursor-pointer absolute top-5 right-5 z-20 rounded-full bg-white/20 p-2.5 text-white backdrop-blur-xs transition hover:bg-white hover:text-[#071B68]"
          >
            <X size={24} />
          </button>

          {/* Previous Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              showPrev();
            }}
            aria-label="Previous image"
            className="cursor-pointer absolute left-4 sm:left-6 z-20 rounded-full bg-white/20 p-3 text-white backdrop-blur-xs transition hover:bg-white hover:text-[#071B68]"
          >
            <ChevronLeft size={28} />
          </button>

          {/* Next Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              showNext();
            }}
            aria-label="Next image"
            className="cursor-pointer absolute right-4 sm:right-6 z-20 rounded-full bg-white/20 p-3 text-white backdrop-blur-xs transition hover:bg-white hover:text-[#071B68]"
          >
            <ChevronRight size={28} />
          </button>

          {/* Lightbox Card Container */}
          <div
            className="relative flex flex-col max-h-[90vh] max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image Box */}
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-slate-900">
              <SafeImage
                src={activeImage.public_url}
                alt={activeImage.title}
                fill
                priority
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 1000px"
              />
            </div>

            {/* Information Bar */}
            <div className="bg-white p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-[#DCE8F0]">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="rounded-full bg-[#EFFBFC] px-3 py-1 text-xs font-bold text-[#087FBA]">
                    {activeImage.category}
                  </span>
                  {activeImage.created_at && (
                    <span className="flex items-center gap-1 text-[11px] text-[#5D6B85]">
                      <Calendar size={12} />
                      {new Date(activeImage.created_at).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  )}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#071B68]">
                  {activeImage.title}
                </h3>
                {activeImage.caption && (
                  <p className="mt-1 text-xs sm:text-sm text-[#5D6B85] max-w-2xl leading-relaxed">
                    {activeImage.caption}
                  </p>
                )}
              </div>

              {/* Counter */}
              <div className="text-xs font-bold text-[#071B68] px-3 py-1.5 rounded-full bg-[#EFFBFC] border border-[#DCE8F0] shrink-0">
                {lightboxIndex + 1} of {filteredImages.length}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

