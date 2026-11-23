"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import SafeImage from "@/components/SafeImage";
import {
  X,
  Crop,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RefreshCw,
  Check,
  Eye,
  Smartphone,
  Monitor,
  Tablet,
  Sparkles,
  Layers,
  Upload,
  Info,
  Loader2,
  Move,
  Maximize2,
  Compass,
  FileImage,
  AlertCircle,
  Image as ImageIcon,
} from "lucide-react";
import {
  CropPresetKey,
  CropPreset,
  FocalPointPreset,
  FocalPoint,
  CropCoordinates,
  ImageCropSettings,
  CroppedImageResult,
} from "@/types/media-crop";
import { CROP_PRESETS, FOCAL_POINT_COORDINATES, resolvePresetForContext } from "@/lib/crop-presets";
import { cropAndOptimizeImage, createFileFromBlob, isPngAsset } from "@/lib/image-cropper-utils";
import { uploadWebsiteMedia } from "@/lib/cms";
import { formatBytes } from "@/lib/supabase";

interface SmartImageCropperProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  imageAlt?: string;
  presetKey?: CropPresetKey;
  contextTitle?: string;
  onSave: (croppedUrl: string, result?: CroppedImageResult) => void;
  allowMobileDualCrop?: boolean;
}

export default function SmartImageCropper({
  isOpen,
  onClose,
  imageSrc,
  imageAlt = "Medical Image",
  presetKey = "services-hero",
  contextTitle = "Section Asset",
  onSave,
  allowMobileDualCrop = true,
}: SmartImageCropperProps) {
  // Preset state
  const [currentPresetKey, setCurrentPresetKey] = useState<CropPresetKey>(presetKey);
  const activePreset: CropPreset = CROP_PRESETS[currentPresetKey] || CROP_PRESETS["services-hero"];

  // Image natural metrics
  const [naturalWidth, setNaturalWidth] = useState<number>(0);
  const [naturalHeight, setNaturalHeight] = useState<number>(0);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  // Transformations
  const [zoom, setZoom] = useState<number>(1.0); // 1.0 to 3.0
  const [rotation, setRotation] = useState<number>(0); // 0, 90, 180, 270
  const [focalPreset, setFocalPreset] = useState<FocalPointPreset>("center");
  const [focalPoint, setFocalPoint] = useState<{ x: number; y: number }>({ x: 50, y: 50 });

  // Panning offset inside workspace (in percent)
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const isDraggingRef = useRef<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Viewport mode: desktop vs mobile
  const [cropMode, setCropMode] = useState<"desktop" | "mobile">("desktop");
  const [previewTab, setPreviewTab] = useState<"crop" | "desktop" | "mobile" | "section">("crop");

  // Output generation
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const [generatingPreview, setGeneratingPreview] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync initial preset
  useEffect(() => {
    if (presetKey) {
      setCurrentPresetKey(presetKey);
    }
  }, [presetKey]);

  // Load image dimensions
  useEffect(() => {
    if (!imageSrc || !isOpen) return;

    setImageLoaded(false);
    setErrorMessage(null);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setNaturalWidth(img.naturalWidth || img.width);
      setNaturalHeight(img.naturalHeight || img.height);
      setImageLoaded(true);
    };
    img.onerror = () => {
      setErrorMessage("Could not load image file for editing. Ensure the URL is valid.");
    };
    img.src = imageSrc;
  }, [imageSrc, isOpen]);

  // Reset transforms
  const handleReset = () => {
    setZoom(1.0);
    setRotation(0);
    setPanOffset({ x: 0, y: 0 });
    setFocalPreset("center");
    setFocalPoint({ x: 50, y: 50 });
  };

  // Switch focal point preset
  const handleFocalSelect = (preset: FocalPointPreset) => {
    setFocalPreset(preset);
    const coords = FOCAL_POINT_COORDINATES[preset];
    setFocalPoint(coords);
    // Align pan offset smoothly toward selected focal anchor
    setPanOffset({
      x: (coords.x - 50) * 0.5,
      y: (coords.y - 50) * 0.5,
    });
  };

  // Rotate 90 degrees
  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // Calculate current crop coordinates relative to natural image
  const calculateCropCoordinates = useCallback((): CropCoordinates => {
    if (!naturalWidth || !naturalHeight) {
      return { x: 0, y: 0, width: 100, height: 100 };
    }

    const targetRatio = activePreset.aspectRatio || (naturalWidth / naturalHeight);
    const naturalRatio = naturalWidth / naturalHeight;

    let cropWidthPercent = 100;
    let cropHeightPercent = 100;

    if (naturalRatio > targetRatio) {
      // Natural image is wider than target ratio
      cropWidthPercent = (targetRatio / naturalRatio) * 100;
      cropHeightPercent = 100;
    } else {
      // Natural image is taller than target ratio
      cropWidthPercent = 100;
      cropHeightPercent = (naturalRatio / targetRatio) * 100;
    }

    // Apply zoom: zoom reduces the window size
    const effectiveWidth = Math.max(10, cropWidthPercent / zoom);
    const effectiveHeight = Math.max(10, cropHeightPercent / zoom);

    // Apply focal point and pan offset
    const centerX = focalPoint.x + panOffset.x;
    const centerY = focalPoint.y + panOffset.y;

    let x = centerX - effectiveWidth / 2;
    let y = centerY - effectiveHeight / 2;

    // Constrain within 0-100%
    x = Math.max(0, Math.min(100 - effectiveWidth, x));
    y = Math.max(0, Math.min(100 - effectiveHeight, y));

    return {
      x,
      y,
      width: effectiveWidth,
      height: effectiveHeight,
    };
  }, [naturalWidth, naturalHeight, activePreset.aspectRatio, zoom, focalPoint, panOffset]);

  // Generate live preview on transform change
  const refreshPreview = useCallback(async () => {
    if (!imageSrc || !imageLoaded) return;
    try {
      setGeneratingPreview(true);
      const cropRect = calculateCropCoordinates();
      const settings: ImageCropSettings = {
        presetKey: currentPresetKey,
        aspectRatio: activePreset.aspectRatio,
        zoom,
        rotation,
        focalPoint: { ...focalPoint, preset: focalPreset },
        cropRect,
        mode: cropMode,
      };

      const result = await cropAndOptimizeImage(imageSrc, cropRect, settings, {
        maxWidth: activePreset.recommendedWidth || 1600,
        preserveTransparency: activePreset.isLogo || isPngAsset(imageSrc),
        quality: 0.9,
      });

      setPreviewDataUrl(result.dataUrl);
    } catch (err: unknown) {
      console.warn("[SmartCropper] Preview generation skipped:", err);
    } finally {
      setGeneratingPreview(false);
    }
  }, [imageSrc, imageLoaded, calculateCropCoordinates, currentPresetKey, activePreset, zoom, rotation, focalPoint, focalPreset, cropMode]);

  // Debounce preview update when controls change
  useEffect(() => {
    if (imageLoaded) {
      const timer = setTimeout(() => {
        refreshPreview();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [imageLoaded, zoom, rotation, focalPoint, panOffset, currentPresetKey, cropMode, refreshPreview]);

  // Drag-to-pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = (e.clientX - dragStartRef.current.x) * 0.15;
    const deltaY = (e.clientY - dragStartRef.current.y) * 0.15;
    dragStartRef.current = { x: e.clientX, y: e.clientY };

    setPanOffset((prev) => ({
      x: Math.max(-40, Math.min(40, prev.x - deltaX)),
      y: Math.max(-40, Math.min(40, prev.y - deltaY)),
    }));
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Click on image to position focal point directly
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    setFocalPoint({
      x: Math.round(Math.max(5, Math.min(95, clickX))),
      y: Math.round(Math.max(5, Math.min(95, clickY))),
    });
    setFocalPreset("custom");
  };

  // Save and upload cropped derivative
  const handleSave = async () => {
    if (!imageSrc) return;

    try {
      setSaving(true);
      setErrorMessage(null);

      const cropRect = calculateCropCoordinates();
      const settings: ImageCropSettings = {
        presetKey: currentPresetKey,
        aspectRatio: activePreset.aspectRatio,
        zoom,
        rotation,
        focalPoint: { ...focalPoint, preset: focalPreset },
        cropRect,
        mode: cropMode,
      };

      // 1. Render high-res optimized output
      const result = await cropAndOptimizeImage(imageSrc, cropRect, settings, {
        maxWidth: activePreset.recommendedWidth || 1920,
        preserveTransparency: activePreset.isLogo || isPngAsset(imageSrc),
        quality: 0.92,
      });

      // 2. Upload derivative to Supabase Storage
      const rawName = imageSrc.split("/").pop() || "asset";
      const file = createFileFromBlob(result.blob, rawName, `-crop-${activePreset.aspectRatioLabel.replace(":", "x")}`);
      const categoryToUse = (activePreset.section as any) || "Other";

      const uploadRes = await uploadWebsiteMedia(
        file,
        categoryToUse,
        `${contextTitle} (${activePreset.label})`,
        imageAlt || contextTitle
      );

      let finalUrl = result.dataUrl; // Fallback to local DataURL if offline
      if (uploadRes.success && uploadRes.data) {
        finalUrl = uploadRes.data.public_url;
      }

      onSave(finalUrl, {
        blob: result.blob,
        dataUrl: result.dataUrl,
        fileName: file.name,
        mimeType: result.mimeType,
        width: result.width,
        height: result.height,
        originalUrl: imageSrc,
        cropSettings: settings,
      });

      onClose();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to crop and save image.");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const cropCoordinates = calculateCropCoordinates();

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#071B68]/70 p-3 sm:p-5 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col max-h-[94vh] max-w-6xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#DCE8F0]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-6 border-b border-[#DCE8F0] bg-[#F8FDFF]">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#10C6C1]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#087FBA]">
                DRK Hospitals Media Studio
              </span>
              <span className="text-[11px] font-semibold text-[#071B68] bg-[#EFFBFC] px-2.5 py-0.5 rounded-full border border-[#DCE8F0]">
                {activePreset.label}
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-extrabold text-[#071B68] mt-1">
              Smart Image Cropper & Focal Positioning
            </h2>
            <p className="text-xs text-[#5D6B85] mt-0.5">
              Editing: <strong className="text-[#071B68]">{contextTitle}</strong> • Recommended:{" "}
              <span className="font-semibold text-[#087FBA]">
                {activePreset.aspectRatioLabel} ({activePreset.recommendedWidth} × {activePreset.recommendedHeight}px)
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Desktop / Mobile Dual-Crop Toggle */}
            {allowMobileDualCrop && (
              <div className="inline-flex rounded-full bg-white p-1 border border-[#DCE8F0] shadow-2xs">
                <button
                  type="button"
                  onClick={() => {
                    setCropMode("desktop");
                    setCurrentPresetKey(presetKey);
                  }}
                  className={`cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition ${
                    cropMode === "desktop"
                      ? "bg-[#071B68] text-white shadow-2xs"
                      : "text-[#5D6B85] hover:text-[#071B68]"
                  }`}
                >
                  <Monitor size={13} />
                  <span>Desktop</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCropMode("mobile");
                    setCurrentPresetKey("homepage-hero-mobile");
                  }}
                  className={`cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition ${
                    cropMode === "mobile"
                      ? "bg-[#071B68] text-white shadow-2xs"
                      : "text-[#5D6B85] hover:text-[#071B68]"
                  }`}
                >
                  <Smartphone size={13} />
                  <span>Mobile Crop</span>
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-full p-2 text-[#5D6B85] hover:bg-slate-100 hover:text-[#071B68] transition"
              title="Close editor"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* ERROR BANNER IF ANY */}
        {errorMessage && (
          <div className="p-3 bg-red-50 text-red-700 text-xs font-semibold border-b border-red-200 flex items-center gap-2">
            <AlertCircle size={15} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* WORKSPACE: TWO COLUMNS (EDITOR ON LEFT, CONTROLS & PREVIEW ON RIGHT) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-y-auto">
          {/* LEFT: MAIN IMAGE CANVAS WORKSPACE (7 COLS) */}
          <div className="lg:col-span-7 p-4 sm:p-6 bg-[#0B1530] flex flex-col justify-between select-none">
            {/* Canvas Container */}
            <div className="relative w-full h-[320px] sm:h-[420px] lg:h-[480px] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center">
              {!imageLoaded ? (
                <div className="flex flex-col items-center justify-center text-slate-400">
                  <Loader2 size={32} className="animate-spin text-[#10C6C1] mb-2" />
                  <p className="text-xs">Loading image matrix...</p>
                </div>
              ) : (
                <div
                  className="relative w-full h-full overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onClick={handleCanvasClick}
                >
                  {/* The Image under transform */}
                  <div
                    className="relative transition-transform duration-75 pointer-events-none"
                    style={{
                      transform: `scale(${zoom}) rotate(${rotation}deg) translate(${panOffset.x}%, ${panOffset.y}%)`,
                      transformOrigin: `${focalPoint.x}% ${focalPoint.y}%`,
                    }}
                  >
                    {/* Raw Image */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageSrc}
                      alt={imageAlt}
                      className="max-h-[380px] sm:max-h-[440px] max-w-full object-contain select-none"
                      draggable={false}
                    />
                  </div>

                  {/* CROP OVERLAY (Rule of Thirds Grid & Mask) */}
                  <div className="absolute inset-0 pointer-events-none border-4 border-dashed border-[#10C6C1]/80 rounded-xl m-4 sm:m-6 shadow-2xl">
                    {/* 3x3 Grid Lines */}
                    <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                      <div className="border-r border-b border-white/25" />
                      <div className="border-r border-b border-white/25" />
                      <div className="border-b border-white/25" />
                      <div className="border-r border-b border-white/25" />
                      <div className="border-r border-b border-white/25" />
                      <div className="border-b border-white/25" />
                      <div className="border-r border-white/25" />
                      <div className="border-r border-white/25" />
                      <div />
                    </div>

                    {/* Interactive Focal Point Reticle */}
                    <div
                      className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-150 pointer-events-none"
                      style={{ left: `${focalPoint.x}%`, top: `${focalPoint.y}%` }}
                    >
                      <div className="relative flex items-center justify-center">
                        <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-[#10C6C1] opacity-75" />
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#10C6C1] text-[#071B68] shadow-lg border-2 border-white">
                          <Compass size={14} className="stroke-[2.5]" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Corner dimension label */}
                  <div className="absolute bottom-3 left-3 bg-[#071B68]/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-md backdrop-blur-xs border border-white/10 flex items-center gap-1.5 pointer-events-none">
                    <Maximize2 size={11} className="text-[#10C6C1]" />
                    <span>
                      {naturalWidth} × {naturalHeight} px ({activePreset.aspectRatioLabel})
                    </span>
                  </div>

                  {/* Drag to pan helper hint */}
                  <div className="absolute top-3 left-3 bg-black/60 text-white/90 text-[10px] font-semibold px-2.5 py-1 rounded-md backdrop-blur-xs flex items-center gap-1 pointer-events-none">
                    <Move size={11} className="text-[#10C6C1]" />
                    <span>Drag image to position • Click to place focal point</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Action Ribbon Under Canvas */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-white">
              {/* Zoom Controls */}
              <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setZoom((prev) => Math.max(1.0, +(prev - 0.1).toFixed(1)))}
                  className="cursor-pointer p-1 text-slate-400 hover:text-white"
                  title="Zoom Out"
                >
                  <ZoomOut size={16} />
                </button>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-24 sm:w-32 accent-[#10C6C1] cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => setZoom((prev) => Math.min(3.0, +(prev + 0.1).toFixed(1)))}
                  className="cursor-pointer p-1 text-slate-400 hover:text-white"
                  title="Zoom In"
                >
                  <ZoomIn size={16} />
                </button>
                <span className="text-xs font-bold text-[#10C6C1] ml-1 w-10 text-right">
                  {Math.round(zoom * 100)}%
                </span>
              </div>

              {/* Transformation Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRotate}
                  className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl bg-slate-900/80 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-800 border border-slate-800 transition"
                  title="Rotate 90 degrees clockwise"
                >
                  <RotateCw size={14} className="text-[#10C6C1]" />
                  <span>Rotate {rotation}°</span>
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl bg-slate-900/80 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-800 border border-slate-800 transition"
                  title="Reset all transformations"
                >
                  <RefreshCw size={14} className="text-slate-400" />
                  <span>Reset</span>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: CONTROLS & LIVE MULTI-VIEWPORT PREVIEW (5 COLS) */}
          <div className="lg:col-span-5 p-4 sm:p-6 bg-white border-l border-[#DCE8F0] flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              {/* 1. Section Preset Selector */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#071B68] block mb-2">
                  Website Section Crop Preset
                </label>
                <select
                  value={currentPresetKey}
                  onChange={(e) => setCurrentPresetKey(e.target.value as CropPresetKey)}
                  className="w-full rounded-xl border border-[#DCE8F0] bg-[#F8FDFF] px-3.5 py-2.5 text-xs font-bold text-[#071B68] focus:border-[#087FBA] focus:outline-hidden"
                >
                  <optgroup label="Hero & Banners">
                    <option value="homepage-hero-desktop">Homepage Hero Desktop (16:9 • 1920×1080)</option>
                    <option value="homepage-hero-mobile">Homepage Hero Mobile (4:5 • 1080×1350)</option>
                    <option value="services-hero">Services Hero Banner (16:9 • 1600×900)</option>
                    <option value="about-hero">About Us Hero Banner (16:9 • 1600×900)</option>
                    <option value="cta-banner">CTA Section Banner (16:9 • 1600×900)</option>
                  </optgroup>
                  <optgroup label="Clinical Specialty Cards">
                    <option value="dental-card">Dental Service Card (4:3 • 1200×900)</option>
                    <option value="skin-card">Skin Service Card (4:3 • 1200×900)</option>
                    <option value="hair-card">Hair Service Card (4:3 • 1200×900)</option>
                    <option value="facility-image">Facility & Infrastructure (4:3 • 1200×900)</option>
                  </optgroup>
                  <optgroup label="Gallery & Profiles">
                    <option value="gallery-landscape">Gallery Landscape (4:3 • 1200×900)</option>
                    <option value="gallery-portrait">Gallery Portrait (3:4 • 900×1200)</option>
                    <option value="gallery-square">Gallery Square (1:1 • 1000×1000)</option>
                    <option value="doctor-profile">Doctor / Specialist Profile (1:1 • 800×800)</option>
                  </optgroup>
                  <optgroup label="Branding & Social">
                    <option value="og-image">Open Graph Social Image (1.91:1 • 1200×630)</option>
                    <option value="logo">Hospital Logo (Contain Transparency)</option>
                    <option value="free">Custom / Free Crop</option>
                  </optgroup>
                </select>
                <p className="mt-1 text-[11px] text-[#5D6B85] leading-relaxed">
                  {activePreset.description}
                </p>
              </div>

              {/* 2. Focal Point Position Controls */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#071B68] block mb-2">
                  Image Focal Point & Subject Alignment
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                  {(["center", "top", "top-center", "bottom", "left", "right"] as FocalPointPreset[]).map(
                    (pos) => (
                      <button
                        key={pos}
                        type="button"
                        onClick={() => handleFocalSelect(pos)}
                        className={`cursor-pointer rounded-lg py-1.5 text-[11px] font-bold capitalize transition border ${
                          focalPreset === pos
                            ? "bg-[#071B68] text-white border-[#071B68] shadow-2xs"
                            : "bg-[#F8FDFF] text-[#5D6B85] border-[#DCE8F0] hover:text-[#071B68] hover:border-[#087FBA]"
                        }`}
                      >
                        {pos.replace("-", " ")}
                      </button>
                    )
                  )}
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] text-[#5D6B85]">
                  <span>Focal X: {focalPoint.x}%</span>
                  <span>Focal Y: {focalPoint.y}%</span>
                </div>
              </div>

              {/* 3. Live Preview Tabs */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#071B68]">
                    Live Output Preview
                  </label>
                  {generatingPreview && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-[#087FBA]">
                      <Loader2 size={11} className="animate-spin" />
                      <span>Updating...</span>
                    </span>
                  )}
                </div>

                {/* Preview Viewport Switcher */}
                <div className="flex items-center gap-1 mb-3 border-b border-[#DCE8F0] pb-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setPreviewTab("crop")}
                    className={`cursor-pointer px-2.5 py-1 rounded-lg font-bold transition ${
                      previewTab === "crop"
                        ? "bg-[#EFFBFC] text-[#087FBA]"
                        : "text-[#5D6B85] hover:text-[#071B68]"
                    }`}
                  >
                    Output Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewTab("desktop")}
                    className={`cursor-pointer inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition ${
                      previewTab === "desktop"
                        ? "bg-[#EFFBFC] text-[#087FBA]"
                        : "text-[#5D6B85] hover:text-[#071B68]"
                    }`}
                  >
                    <Monitor size={12} />
                    <span>Desktop</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewTab("mobile")}
                    className={`cursor-pointer inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition ${
                      previewTab === "mobile"
                        ? "bg-[#EFFBFC] text-[#087FBA]"
                        : "text-[#5D6B85] hover:text-[#071B68]"
                    }`}
                  >
                    <Smartphone size={12} />
                    <span>Mobile</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewTab("section")}
                    className={`cursor-pointer inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition ${
                      previewTab === "section"
                        ? "bg-[#EFFBFC] text-[#087FBA]"
                        : "text-[#5D6B85] hover:text-[#071B68]"
                    }`}
                  >
                    <Sparkles size={12} />
                    <span>Section Simulation</span>
                  </button>
                </div>

                {/* Preview Container Rendering */}
                <div className="relative rounded-2xl border border-[#DCE8F0] bg-slate-100 p-2 overflow-hidden flex items-center justify-center min-h-[170px]">
                  {previewDataUrl ? (
                    <>
                      {/* 1. Default Output Card Preview */}
                      {previewTab === "crop" && (
                        <div
                          className="relative overflow-hidden rounded-xl border border-white shadow-md bg-white"
                          style={{
                            aspectRatio: activePreset.aspectRatio ? `${activePreset.aspectRatio}` : "16/9",
                            width: "100%",
                            maxHeight: "190px",
                          }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={previewDataUrl}
                            alt="Cropped Output"
                            className={`h-full w-full ${activePreset.isLogo ? "object-contain p-2" : "object-cover"}`}
                          />
                        </div>
                      )}

                      {/* 2. Desktop Browser Simulation */}
                      {previewTab === "desktop" && (
                        <div className="w-full max-w-[280px] bg-slate-900 rounded-lg overflow-hidden shadow-lg border border-slate-700">
                          <div className="h-4 bg-slate-800 flex items-center gap-1 px-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                            <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            <span className="text-[7px] text-slate-400 ml-2 font-mono">drkhospitals.com</span>
                          </div>
                          <div className="aspect-[16/9] w-full bg-slate-800">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={previewDataUrl} alt="Desktop Preview" className="h-full w-full object-cover" />
                          </div>
                        </div>
                      )}

                      {/* 3. Mobile Device Simulation */}
                      {previewTab === "mobile" && (
                        <div className="w-[120px] bg-slate-900 rounded-2xl p-1 shadow-lg border border-slate-700">
                          <div className="h-2 w-8 bg-slate-800 rounded-full mx-auto mb-1" />
                          <div className="aspect-[9/16] w-full bg-slate-800 rounded-xl overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={previewDataUrl} alt="Mobile Preview" className="h-full w-full object-cover" />
                          </div>
                        </div>
                      )}

                      {/* 4. Section Context Live Simulation (e.g. Services Hero) */}
                      {previewTab === "section" && (
                        <div className="relative w-full rounded-xl overflow-hidden aspect-[16/9] bg-[#071B68]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={previewDataUrl}
                            alt="Section Simulation"
                            className="absolute inset-0 h-full w-full object-cover opacity-60"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#071B68] via-[#071B68]/40 to-transparent p-3 flex flex-col justify-end text-white">
                            <span className="text-[8px] font-bold text-[#10C6C1] uppercase tracking-wider">
                              Specialized Disciplines
                            </span>
                            <p className="text-xs font-extrabold leading-tight">
                              Services & Clinical Diagnostics
                            </p>
                            <p className="text-[8px] text-blue-100 line-clamp-1">
                              Subject & equipment remain framed cleanly.
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center text-[#5D6B85] text-xs">
                      <ImageIcon size={24} className="mx-auto mb-1 text-slate-400" />
                      <span>Adjust controls to render live preview</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* MODAL FOOTER ACTIONS */}
            <div className="pt-4 border-t border-[#DCE8F0] flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer rounded-full border border-[#DCE8F0] bg-white px-4 py-2 text-xs font-bold text-[#5D6B85] hover:bg-slate-100 transition"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={saving || !imageLoaded}
                onClick={handleSave}
                className="cursor-pointer inline-flex items-center gap-2 rounded-full bg-[#071B68] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#087FBA] transition shadow-md disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2 size={14} className="animate-spin text-[#10C6C1]" />
                    <span>Processing & Uploading...</span>
                  </>
                ) : (
                  <>
                    <Check size={14} className="text-[#10C6C1]" />
                    <span>Save & Apply Cropped Asset</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
