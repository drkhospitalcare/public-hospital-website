"use client";

import { useState, useRef } from "react";
import SafeImage from "@/components/SafeImage";
import {
  Upload,
  Image as ImageIcon,
  Check,
  RotateCcw,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Loader2,
  FileImage,
  Info,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { uploadWebsiteMedia } from "@/lib/cms";
import { FooterSettingsContent } from "@/types/cms";
import { validateImageFile } from "@/lib/supabase";

interface FooterEditorProps {
  footer: FooterSettingsContent;
  setFooter: React.Dispatch<React.SetStateAction<FooterSettingsContent>>;
  onOpenMediaLibrary?: () => void;
}

const DEFAULT_LOGO_URL = "/images/drk-logo.png";
const DEFAULT_LOGO_ALT = "ROOTED IN CARE | DRK Hospital";
const DEFAULT_CAPTION = "DRK Hospital – Rooted in Care";

export default function FooterEditor({
  footer,
  setFooter,
  onOpenMediaLibrary,
}: FooterEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const showError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(null), 6000);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate using central validation helper (formats + 10MB limit)
    const validation = validateImageFile(file);
    if (!validation.valid) {
      showError(validation.error || "Invalid file selected.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setUploading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const title = file.name.replace(/\.[^/.]+$/, "");
    const res = await uploadWebsiteMedia(
      file,
      "Other",
      title,
      footer.logoAlt || title
    );

    setUploading(false);

    if (res.success && res.data) {
      setFooter({
        ...footer,
        logoUrl: res.data.public_url,
      });
      showSuccess(`Logo uploaded successfully: ${file.name}`);
    } else {
      showError(res.error || "Failed to upload logo image to Supabase Storage.");
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleResetToDefault = () => {
    if (confirm("Reset the footer logo back to the official default DRK Hospital logo?")) {
      setFooter({
        ...footer,
        logoUrl: DEFAULT_LOGO_URL,
        logoAlt: DEFAULT_LOGO_ALT,
        caption: DEFAULT_CAPTION,
      });
      showSuccess("Restored default DRK Hospital logo.");
    }
  };

  const handleToggleEnabled = () => {
    const nextState = !footer.enabled;
    setFooter({
      ...footer,
      enabled: nextState,
    });
    showSuccess(
      nextState
        ? "Footer logo enabled. It will be displayed in the public footer."
        : "Footer logo disabled. It will be hidden from the public footer."
    );
  };

  const isDefaultLogo =
    !footer.logoUrl ||
    footer.logoUrl === DEFAULT_LOGO_URL ||
    footer.logoUrl.endsWith("/drk-logo.png");

  return (
    <div className="space-y-6">
      {/* Notifications */}
      {successMsg && (
        <div className="flex items-center gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-800 shadow-2xs">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-2.5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-800 shadow-2xs">
          <AlertCircle size={16} className="text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 1. Visibility & Master Toggle Card */}
      <div className="card p-6 border border-[#DCE8F0] bg-white rounded-2xl shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#087FBA] bg-[#EFFBFC] px-2.5 py-0.5 rounded-full border border-[#DCE8F0]">
                Footer Visibility
              </span>
              {footer.enabled ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Logo Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                  <EyeOff size={11} />
                  Logo Hidden
                </span>
              )}
            </div>
            <h3 className="text-base font-bold text-[#071B68]">
              Footer Logo Display Status
            </h3>
            <p className="text-xs text-[#5D6B85] mt-0.5">
              Control whether the DRK Hospital logo appears in the left section of the public website footer.
            </p>
          </div>

          <button
            type="button"
            onClick={handleToggleEnabled}
            className={`cursor-pointer inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition shadow-xs ${
              footer.enabled
                ? "bg-[#071B68] text-white hover:bg-[#087FBA]"
                : "bg-slate-200 text-slate-700 hover:bg-slate-300"
            }`}
          >
            {footer.enabled ? (
              <>
                <Eye size={14} className="text-[#10C6C1]" />
                <span>Enabled (Click to Hide)</span>
              </>
            ) : (
              <>
                <EyeOff size={14} />
                <span>Hidden (Click to Enable)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Logo Upload & Management Card */}
      <div className="card p-6 border border-[#DCE8F0] bg-white rounded-2xl shadow-2xs space-y-6">
        <div>
          <h3 className="text-base font-bold text-[#071B68]">
            Manage Footer Logo Image
          </h3>
          <p className="text-xs text-[#5D6B85] mt-0.5">
            Upload, replace, or reset the brand logo displayed on the footer. The logo is displayed with <code>object-fit: contain</code> on a white rounded card over the navy background.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-12 items-start">
          {/* Left: Interactive Preview on Navy Footer Background */}
          <div className="lg:col-span-5 space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#071B68] block">
              Logo Preview (Simulated Navy Background)
            </label>
            <div className="rounded-2xl bg-[#071B68] p-6 text-center flex flex-col items-center justify-center min-h-[170px] border border-blue-950 relative overflow-hidden shadow-inner">
              {footer.enabled ? (
                <div className="rounded-2xl bg-white p-3 sm:p-3.5 shadow-md inline-block max-w-[240px]">
                  <div className="relative h-12 w-48 sm:w-52">
                    <SafeImage
                      src={footer.logoUrl || DEFAULT_LOGO_URL}
                      alt={footer.logoAlt || DEFAULT_LOGO_ALT}
                      fill
                      className="object-contain"
                      sizes="208px"
                      fallbackSrc={DEFAULT_LOGO_URL}
                    />
                  </div>
                </div>
              ) : (
                <div className="py-6 px-4 text-center">
                  <EyeOff size={24} className="text-blue-300 mx-auto mb-2 opacity-60" />
                  <p className="text-xs font-semibold text-blue-200">
                    Logo is currently hidden
                  </p>
                  <p className="text-[10px] text-blue-300/70 mt-0.5">
                    Toggle visibility to display in footer
                  </p>
                </div>
              )}

              <p className="text-[11px] font-semibold text-[#10C6C1] uppercase tracking-wider mt-3">
                {footer.caption || DEFAULT_CAPTION}
              </p>
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#5D6B85] px-1">
              <span>Aspect ratio: <strong>Contain</strong></span>
              <span>Source: <strong>{isDefaultLogo ? "Default Asset" : "Custom Upload"}</strong></span>
            </div>
          </div>

          {/* Right: Upload & Actions */}
          <div className="lg:col-span-7 space-y-4">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#071B68] block mb-2">
                Upload or Replace Logo
              </label>
              <div className="flex flex-wrap items-center gap-2.5">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/svg+xml"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-[#071B68] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#087FBA] transition shadow-xs disabled:opacity-50"
                >
                  {uploading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Uploading to Supabase...</span>
                    </>
                  ) : (
                    <>
                      <Upload size={14} className="text-[#10C6C1]" />
                      <span>{isDefaultLogo ? "Upload Custom Logo" : "Replace Logo"}</span>
                    </>
                  )}
                </button>

                {onOpenMediaLibrary && (
                  <button
                    type="button"
                    onClick={onOpenMediaLibrary}
                    className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl border border-[#DCE8F0] bg-white px-3.5 py-2.5 text-xs font-bold text-[#071B68] hover:bg-[#EFFBFC] hover:border-[#087FBA] transition"
                  >
                    <FileImage size={14} className="text-[#087FBA]" />
                    <span>Media Library</span>
                  </button>
                )}

                {!isDefaultLogo && (
                  <button
                    type="button"
                    onClick={handleResetToDefault}
                    className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                  >
                    <RotateCcw size={13} />
                    <span>Reset to Default</span>
                  </button>
                )}
              </div>
            </div>

            {/* Technical specifications guidance */}
            <div className="rounded-xl border border-[#DCE8F0] bg-[#F8FDFF] p-3.5 text-xs text-[#5D6B85] space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[#071B68]">
                <Info size={14} className="text-[#087FBA]" />
                <span>Recommended Logo Specifications</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-[#5D6B85] pl-1">
                <li><strong>Formats:</strong> Transparent PNG, WebP, SVG, or high-res JPEG.</li>
                <li><strong>Resolution:</strong> 400×120px to 800×240px (wide aspect ratio).</li>
                <li><strong>File Size:</strong> Maximum 10 MB (enforced by upload validator).</li>
                <li><strong>Background:</strong> Transparent recommended (sits on white card).</li>
              </ul>
            </div>

            {/* Current URL indicator */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#071B68] block mb-1">
                Active Logo Source URL
              </label>
              <input
                type="text"
                readOnly
                value={footer.logoUrl || DEFAULT_LOGO_URL}
                className="w-full rounded-xl border border-[#DCE8F0] bg-slate-50 px-3 py-2 text-xs font-mono text-slate-600 truncate"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Accessibility & Metadata Card */}
      <div className="card p-6 border border-[#DCE8F0] bg-white rounded-2xl shadow-2xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-[#071B68]">
            Logo Metadata & Accessibility
          </h3>
          <p className="text-xs text-[#5D6B85] mt-0.5">
            Configure accessibility alt text and brand caption for screen readers and search engines.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-bold text-[#071B68] flex items-center justify-between mb-1">
              <span>Logo Alt Text</span>
              <span className="text-[10px] text-red-500 font-semibold">* Required for a11y</span>
            </label>
            <input
              type="text"
              value={footer.logoAlt}
              onChange={(e) => setFooter({ ...footer, logoAlt: e.target.value })}
              placeholder="e.g., ROOTED IN CARE | DRK Hospital"
              className="w-full rounded-xl border border-[#DCE8F0] bg-white px-3.5 py-2.5 text-xs text-[#071B68] focus:border-[#087FBA] focus:outline-none"
            />
            <p className="text-[11px] text-[#5D6B85] mt-1">
              Descriptive text read by screen readers and indexed by search engines.
            </p>
          </div>

          <div>
            <label className="text-xs font-bold text-[#071B68] block mb-1">
              Brand Caption / Tagline
            </label>
            <input
              type="text"
              value={footer.caption}
              onChange={(e) => setFooter({ ...footer, caption: e.target.value })}
              placeholder="e.g., DRK Hospital – Rooted in Care"
              className="w-full rounded-xl border border-[#DCE8F0] bg-white px-3.5 py-2.5 text-xs text-[#071B68] focus:border-[#087FBA] focus:outline-none"
            />
            <p className="text-[11px] text-[#5D6B85] mt-1">
              Accessible link label and brand identifier in footer container.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Complete Footer Context Simulation */}
      <div className="card p-6 border border-[#DCE8F0] bg-white rounded-2xl shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#071B68]">
              Full Footer Context Simulation
            </h3>
            <p className="text-xs text-[#5D6B85] mt-0.5">
              Live simulation of the public website footer showing your logo placement alongside hospital navigation.
            </p>
          </div>
          <span className="text-[11px] font-bold text-[#087FBA] bg-[#EFFBFC] px-2.5 py-1 rounded-full border border-[#DCE8F0] hidden sm:inline-block">
            Real-Time Render
          </span>
        </div>

        <div className="rounded-2xl bg-[#071B68] p-6 sm:p-8 text-white border border-blue-950 overflow-hidden shadow-inner">
          <div className="grid gap-6 md:grid-cols-12 items-start opacity-90">
            {/* Left Brand Column */}
            <div className="md:col-span-5 space-y-3">
              {footer.enabled ? (
                <div className="rounded-2xl bg-white p-3 shadow-md inline-block">
                  <div className="relative h-11 w-44">
                    <SafeImage
                      src={footer.logoUrl || DEFAULT_LOGO_URL}
                      alt={footer.logoAlt || DEFAULT_LOGO_ALT}
                      fill
                      className="object-contain"
                      sizes="176px"
                      fallbackSrc={DEFAULT_LOGO_URL}
                    />
                  </div>
                </div>
              ) : (
                <div className="border border-dashed border-blue-300/40 rounded-xl p-3 text-xs text-blue-200">
                  <em>[Footer logo hidden by administrator]</em>
                </div>
              )}
              <p className="text-xs font-semibold tracking-wider text-[#10C6C1] uppercase">
                {footer.caption || "Rooted in Care"}
              </p>
              <p className="text-xs leading-relaxed text-blue-100 max-w-xs">
                DRK Hospital is committed to delivering modern, compassionate, and ethical clinical care across Dental, Skin, and Hair health in Chennai.
              </p>
            </div>

            {/* Simulated Columns */}
            <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-blue-200">
              <div>
                <p className="font-bold text-white mb-2 text-[11px] uppercase tracking-wider text-[#10C6C1]">
                  Quick Links
                </p>
                <ul className="space-y-1 text-[11px]">
                  <li>Home</li>
                  <li>About DRK</li>
                  <li>Our Services</li>
                  <li>Hospital Gallery</li>
                </ul>
              </div>
              <div>
                <p className="font-bold text-white mb-2 text-[11px] uppercase tracking-wider text-[#10C6C1]">
                  Specialties
                </p>
                <ul className="space-y-1 text-[11px]">
                  <li>Dental Care</li>
                  <li>Skin Care</li>
                  <li>Hair Care</li>
                </ul>
              </div>
              <div>
                <p className="font-bold text-white mb-2 text-[11px] uppercase tracking-wider text-[#10C6C1]">
                  Chennai Clinic
                </p>
                <ul className="space-y-1 text-[11px]">
                  <li>Perambur, Chennai</li>
                  <li>Mon – Sat: 8 AM - 8 PM</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

