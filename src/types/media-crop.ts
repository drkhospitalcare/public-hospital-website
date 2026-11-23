/**
 * DRK Hospitals — Smart Image Cropping & Media Positioning System Types
 */

export type CropPresetKey =
  | "homepage-hero-desktop"
  | "homepage-hero-mobile"
  | "about-hero"
  | "services-hero"
  | "dental-card"
  | "skin-card"
  | "hair-card"
  | "specialty-banner"
  | "gallery-landscape"
  | "gallery-portrait"
  | "gallery-square"
  | "doctor-profile"
  | "founder-portrait"
  | "facility-image"
  | "cta-banner"
  | "og-image"
  | "logo"
  | "free";

export type AspectRatioType = "16:9" | "4:5" | "4:3" | "3:4" | "1:1" | "1.91:1" | "free" | "contain";

export interface CropPreset {
  key: CropPresetKey;
  label: string;
  description: string;
  aspectRatio: number | null; // width / height, null for free/contain
  aspectRatioLabel: AspectRatioType;
  recommendedWidth: number;
  recommendedHeight: number;
  section: string;
  isLogo?: boolean;
}

export type FocalPointPreset =
  | "center"
  | "top"
  | "top-center"
  | "bottom"
  | "left"
  | "right"
  | "custom";

export interface FocalPoint {
  x: number; // 0 to 100 percentage
  y: number; // 0 to 100 percentage
  preset: FocalPointPreset;
}

export interface CropCoordinates {
  x: number; // percentage of natural image (0-100)
  y: number;
  width: number;
  height: number;
}

export interface ImageCropSettings {
  presetKey: CropPresetKey;
  aspectRatio: number | null;
  zoom: number; // 1.0 to 3.0
  rotation: number; // 0, 90, 180, 270
  focalPoint: FocalPoint;
  cropRect?: CropCoordinates;
  mode: "desktop" | "mobile";
  isDualCrop?: boolean;
  mobileUrl?: string;
}

export interface CropExportOptions {
  format?: "auto" | "webp" | "jpeg" | "png";
  quality?: number; // 0.1 to 1.0
  maxWidth?: number;
  maxHeight?: number;
  preserveTransparency?: boolean;
}

export interface CroppedImageResult {
  blob: Blob;
  dataUrl: string;
  fileName: string;
  mimeType: string;
  width: number;
  height: number;
  originalUrl: string;
  cropSettings: ImageCropSettings;
}

