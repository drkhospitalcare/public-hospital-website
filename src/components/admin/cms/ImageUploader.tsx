"use client";

import { useState, useRef } from "react";
import SafeImage from "@/components/SafeImage";
import {
  Upload,
  Image as ImageIcon,
  Check,
  Loader2,
  RefreshCw,
  Crop,
  Sparkles,
  Maximize2,
} from "lucide-react";
import { uploadWebsiteMedia } from "@/lib/cms";
import { MediaCategory } from "@/types/cms";
import { CropPresetKey } from "@/types/media-crop";
import { resolvePresetForContext } from "@/lib/crop-presets";
import SmartImageCropper from "@/components/admin/media/SmartImageCropper";

interface ImageUploaderProps {
  label: string;
  imageSrc: string;
  imageAlt?: string;
  category?: MediaCategory;
  presetKey?: CropPresetKey;
  onImageChange: (newUrl: string) => void;
  onAltChange?: (newAlt: string) => void;
  onOpenMediaLibrary?: () => void;
  hint?: string;
}

export default function ImageUploader({
  label,
  imageSrc,
  imageAlt = "",
  category = "Other",
  presetKey,
  onImageChange,
  onAltChange,
  onOpenMediaLibrary,
  hint,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState(false);

  // Smart Cropper modal state
  const [showCropper, setShowCropper] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string>(imageSrc);

  // Resolved preset
  const resolvedPreset = resolvePresetForContext(presetKey || label);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setSuccessMsg(false);

    // Read file locally to open cropper immediately
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImageToCrop(reader.result);
        setShowCropper(true);
      }
    };
    reader.readAsDataURL(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleOpenCropper = () => {
    if (!imageSrc) return;
    setImageToCrop(imageSrc);
    setShowCropper(true);
  };

  const handleCroppedSave = (newUrl: string) => {
    onImageChange(newUrl);
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  const isLogo = resolvedPreset.isLogo || label.toLowerCase().includes("logo");

  return (
    <>
      <div className="rounded-2xl border border-[#DCE8F0] bg-[#F8FDFF] p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#071B68]">
              {label}
            </label>
            <span className="text-[10px] font-bold text-[#087FBA] bg-white px-2 py-0.5 rounded-full border border-[#DCE8F0]">
              {resolvedPreset.aspectRatioLabel} • {resolvedPreset.recommendedWidth}×{resolvedPreset.recommendedHeight}px
            </span>
          </div>

          <span className="text-[11px] font-semibold text-[#087FBA] bg-[#EFFBFC] px-2.5 py-0.5 rounded-full border border-[#DCE8F0]">
            {category}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Thumbnail Preview */}
          <div className="relative h-24 w-36 sm:h-28 sm:w-44 shrink-0 overflow-hidden rounded-xl border-2 border-white bg-slate-100 shadow-md group">
            {imageSrc ? (
              <>
                <SafeImage
                  src={imageSrc}
                  alt={imageAlt || label}
                  fill
                  className={isLogo ? "object-contain p-2" : "object-cover"}
                  sizes="180px"
                />
                {/* Hover Crop Trigger */}
                <button
                  type="button"
                  onClick={handleOpenCropper}
                  className="cursor-pointer absolute inset-0 bg-[#071B68]/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1.5 text-white text-xs font-bold"
                >
                  <Crop size={14} className="text-[#10C6C1]" />
                  <span>Crop & Frame</span>
                </button>
              </>
            ) : (
              <div className="flex h-full w-full items-center justify-center text-slate-400">
                <ImageIcon size={28} />
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex-1 w-full space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />

              <button
                type="button"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer inline-flex items-center gap-2 rounded-full bg-[#071B68] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#087FBA] disabled:opacity-60 shadow-xs"
              >
                {uploading ? (
                  <>
                    <Loader2 size={13} className="animate-spin text-[#10C6C1]" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload size={13} className="text-[#10C6C1]" />
                    <span>Upload Image</span>
                  </>
                )}
              </button>

              {imageSrc && (
                <button
                  type="button"
                  onClick={handleOpenCropper}
                  className="cursor-pointer inline-flex items-center gap-1.5 rounded-full bg-[#EFFBFC] border border-[#10C6C1]/50 px-3.5 py-2 text-xs font-bold text-[#071B68] transition hover:bg-[#10C6C1]/20 hover:border-[#10C6C1]"
                  title="Crop image and adjust focal point"
                >
                  <Crop size={13} className="text-[#087FBA]" />
                  <span>Crop & Position</span>
                </button>
              )}

              {onOpenMediaLibrary && (
                <button
                  type="button"
                  onClick={onOpenMediaLibrary}
                  className="cursor-pointer inline-flex items-center gap-1.5 rounded-full border border-[#DCE8F0] bg-white px-3.5 py-2 text-xs font-bold text-[#071B68] transition hover:bg-[#EFFBFC] hover:border-[#087FBA]"
                >
                  <ImageIcon size={13} className="text-[#087FBA]" />
                  <span>Media Library</span>
                </button>
              )}

              {imageSrc && (
                <button
                  type="button"
                  title="Paste direct URL"
                  onClick={() => {
                    const url = prompt("Enter image URL or local path:", imageSrc);
                    if (url && url.trim()) onImageChange(url.trim());
                  }}
                  className="cursor-pointer inline-flex items-center gap-1 text-[11px] font-semibold text-[#5D6B85] hover:text-[#087FBA] px-2 py-1"
                >
                  <RefreshCw size={12} />
                  <span>Change URL</span>
                </button>
              )}
            </div>

            {/* Alt text field if handler provided */}
            {onAltChange && (
              <div>
                <input
                  type="text"
                  placeholder="Image description (alt text for accessibility and SEO)..."
                  value={imageAlt}
                  onChange={(e) => onAltChange(e.target.value)}
                  className="w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-1.5 text-xs text-[#071B68] placeholder:text-[#8896AB] focus:border-[#087FBA] focus:outline-hidden"
                />
              </div>
            )}

            {hint && <p className="text-[11px] text-[#5D6B85]">{hint}</p>}

            {errorMsg && (
              <p className="text-[11px] font-semibold text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">
                {errorMsg}
              </p>
            )}

            {successMsg && (
              <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                <Check size={12} />
                <span>Image updated and optimized successfully!</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* SMART CROPPER MODAL */}
      {showCropper && (
        <SmartImageCropper
          isOpen={showCropper}
          onClose={() => setShowCropper(false)}
          imageSrc={imageToCrop}
          imageAlt={imageAlt || label}
          presetKey={resolvedPreset.key}
          contextTitle={label}
          onSave={handleCroppedSave}
          allowMobileDualCrop={resolvedPreset.key.includes("hero")}
        />
      )}
    </>
  );
}
