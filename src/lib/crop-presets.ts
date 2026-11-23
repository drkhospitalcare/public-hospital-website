import { CropPreset, CropPresetKey, FocalPointPreset, FocalPoint } from "@/types/media-crop";

/**
 * Standard Presets according to DRK Hospitals Design Specifications
 */
export const CROP_PRESETS: Record<CropPresetKey, CropPreset> = {
  "homepage-hero-desktop": {
    key: "homepage-hero-desktop",
    label: "Homepage Hero (Desktop)",
    description: "Wide widescreen format optimized for full-width high-resolution desktop viewports.",
    aspectRatio: 16 / 9,
    aspectRatioLabel: "16:9",
    recommendedWidth: 1920,
    recommendedHeight: 1080,
    section: "Homepage",
  },
  "homepage-hero-mobile": {
    key: "homepage-hero-mobile",
    label: "Homepage Hero (Mobile)",
    description: "Tall portrait crop ensuring clinic and patient hero image fills vertical smartphone screens.",
    aspectRatio: 4 / 5,
    aspectRatioLabel: "4:5",
    recommendedWidth: 1080,
    recommendedHeight: 1350,
    section: "Homepage",
  },
  "about-hero": {
    key: "about-hero",
    label: "About Page Hero",
    description: "Clean landscape banner showing DRK Hospitals clinical environment and medical staff.",
    aspectRatio: 16 / 9,
    aspectRatioLabel: "16:9",
    recommendedWidth: 1600,
    recommendedHeight: 900,
    section: "About Us",
  },
  "services-hero": {
    key: "services-hero",
    label: "Services Hero Banner",
    description: "High-clarity hero banner for Dental, Dermatology, and Hair care services.",
    aspectRatio: 16 / 9,
    aspectRatioLabel: "16:9",
    recommendedWidth: 1600,
    recommendedHeight: 900,
    section: "Services",
  },
  "dental-card": {
    key: "dental-card",
    label: "Dental Service Card",
    description: "Standard card ratio focused on dental operatories, instruments, and patient care.",
    aspectRatio: 4 / 3,
    aspectRatioLabel: "4:3",
    recommendedWidth: 1200,
    recommendedHeight: 900,
    section: "Specialty Services",
  },
  "skin-card": {
    key: "skin-card",
    label: "Skin Service Card",
    description: "Standard card ratio for clinical dermatology consultations and skin care suites.",
    aspectRatio: 4 / 3,
    aspectRatioLabel: "4:3",
    recommendedWidth: 1200,
    recommendedHeight: 900,
    section: "Specialty Services",
  },
  "hair-card": {
    key: "hair-card",
    label: "Hair Service Card",
    description: "Standard card ratio for trichology diagnostics and scalp therapy procedures.",
    aspectRatio: 4 / 3,
    aspectRatioLabel: "4:3",
    recommendedWidth: 1200,
    recommendedHeight: 900,
    section: "Specialty Services",
  },
  "specialty-banner": {
    key: "specialty-banner",
    label: "Specialty Service Banner",
    description: "Full-width section divider banner highlighting hospital disciplines.",
    aspectRatio: 16 / 9,
    aspectRatioLabel: "16:9",
    recommendedWidth: 1600,
    recommendedHeight: 900,
    section: "Specialty Services",
  },
  "gallery-landscape": {
    key: "gallery-landscape",
    label: "Gallery Landscape",
    description: "Landscape format for operating rooms, reception, and clinic architecture.",
    aspectRatio: 4 / 3,
    aspectRatioLabel: "4:3",
    recommendedWidth: 1200,
    recommendedHeight: 900,
    section: "Hospital Gallery",
  },
  "gallery-portrait": {
    key: "gallery-portrait",
    label: "Gallery Portrait",
    description: "Vertical orientation for clinical equipment units and tall architectural views.",
    aspectRatio: 3 / 4,
    aspectRatioLabel: "3:4",
    recommendedWidth: 900,
    recommendedHeight: 1200,
    section: "Hospital Gallery",
  },
  "gallery-square": {
    key: "gallery-square",
    label: "Gallery Square",
    description: "Balanced 1:1 square ratio for equipment close-ups and compact gallery grids.",
    aspectRatio: 1 / 1,
    aspectRatioLabel: "1:1",
    recommendedWidth: 1000,
    recommendedHeight: 1000,
    section: "Hospital Gallery",
  },
  "doctor-profile": {
    key: "doctor-profile",
    label: "Doctor / Staff Profile",
    description: "Square headshot framing for healthcare specialists and medical staff.",
    aspectRatio: 1 / 1,
    aspectRatioLabel: "1:1",
    recommendedWidth: 800,
    recommendedHeight: 800,
    section: "Medical Staff",
  },
  "founder-portrait": {
    key: "founder-portrait",
    label: "Founder Portrait (3:4)",
    description: "Executive medical portrait framing for hospital founder presentation.",
    aspectRatio: 3 / 4,
    aspectRatioLabel: "3:4",
    recommendedWidth: 900,
    recommendedHeight: 1200,
    section: "About Us",
  },
  "facility-image": {
    key: "facility-image",
    label: "Facility / Infrastructure",
    description: "Standard 4:3 view for sterilization rooms, consultation rooms, and reception.",
    aspectRatio: 4 / 3,
    aspectRatioLabel: "4:3",
    recommendedWidth: 1200,
    recommendedHeight: 900,
    section: "Facilities",
  },
  "cta-banner": {
    key: "cta-banner",
    label: "Call-To-Action Banner",
    description: "Background banner for contact and consultation scheduling sections.",
    aspectRatio: 16 / 9,
    aspectRatioLabel: "16:9",
    recommendedWidth: 1600,
    recommendedHeight: 900,
    section: "CTA Sections",
  },
  "og-image": {
    key: "og-image",
    label: "Open Graph Social Share",
    description: "Optimal metadata image ratio for WhatsApp, Twitter/X, and social media links.",
    aspectRatio: 1200 / 630,
    aspectRatioLabel: "1.91:1",
    recommendedWidth: 1200,
    recommendedHeight: 630,
    section: "SEO Metadata",
  },
  "logo": {
    key: "logo",
    label: "Hospital Logo / Brand Mark",
    description: "Preserves exact brand proportions and transparency. Uses object-fit: contain.",
    aspectRatio: null,
    aspectRatioLabel: "contain",
    recommendedWidth: 1200,
    recommendedHeight: 400,
    section: "Branding",
    isLogo: true,
  },
  "free": {
    key: "free",
    label: "Custom / Free Crop",
    description: "Unconstrained aspect ratio. Manually define width and height.",
    aspectRatio: null,
    aspectRatioLabel: "free",
    recommendedWidth: 1200,
    recommendedHeight: 800,
    section: "Custom",
  },
};

export const FOCAL_POINT_COORDINATES: Record<FocalPointPreset, { x: number; y: number }> = {
  center: { x: 50, y: 50 },
  top: { x: 50, y: 15 },
  "top-center": { x: 50, y: 25 },
  bottom: { x: 50, y: 85 },
  left: { x: 20, y: 50 },
  right: { x: 80, y: 50 },
  custom: { x: 50, y: 50 },
};

/**
 * Resolves the default preset based on category or section name
 */
export function resolvePresetForContext(contextKey?: string): CropPreset {
  if (!contextKey) return CROP_PRESETS["services-hero"];
  const lower = contextKey.toLowerCase();

  if (lower.includes("logo")) return CROP_PRESETS["logo"];
  if (lower.includes("seo") || lower.includes("og")) return CROP_PRESETS["og-image"];
  if (lower.includes("dental")) return CROP_PRESETS["dental-card"];
  if (lower.includes("skin")) return CROP_PRESETS["skin-card"];
  if (lower.includes("hair")) return CROP_PRESETS["hair-card"];
  if (lower.includes("doctor") || lower.includes("staff")) return CROP_PRESETS["doctor-profile"];
  if (lower.includes("about") && lower.includes("hero")) return CROP_PRESETS["about-hero"];
  if (lower.includes("hero") && lower.includes("mobile")) return CROP_PRESETS["homepage-hero-mobile"];
  if (lower.includes("homepage") || lower.includes("hero")) return CROP_PRESETS["homepage-hero-desktop"];
  if (lower.includes("facility") || lower.includes("infrastructure") || lower.includes("standard")) {
    return CROP_PRESETS["facility-image"];
  }
  if (lower.includes("cta") || lower.includes("banner")) return CROP_PRESETS["cta-banner"];
  if (lower.includes("portrait")) return CROP_PRESETS["gallery-portrait"];
  if (lower.includes("square")) return CROP_PRESETS["gallery-square"];
  if (lower.includes("gallery")) return CROP_PRESETS["gallery-landscape"];

  return CROP_PRESETS["services-hero"];
}

