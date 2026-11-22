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
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Layers,
  Palette,
  Settings,
  ShieldCheck,
  Clock,
  Clock3,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Smile,
  Scissors,
  Stethoscope,
  Globe,
  Sliders,
  Monitor,
  Smartphone,
  Tablet,
  Maximize2,
  ArrowRight,
  Heart,
  Activity,
  Share2,
} from "lucide-react";
import { uploadWebsiteMedia } from "@/lib/cms";
import {
  FooterSettingsContent,
  FooterNavigationLink,
  FooterSpecialtyItem,
  FooterSocialItem,
  FooterTrustStatement,
  FooterContactButton,
  FooterBottomLink,
  DayBusinessHours,
} from "@/types/cms";
import { validateImageFile } from "@/lib/supabase";
import { DEFAULT_FOOTER_SETTINGS } from "@/lib/cms-defaults";
import { HOSPITAL_INFO } from "@/lib/hospital-info";

interface FooterEditorProps {
  footer: FooterSettingsContent;
  setFooter: React.Dispatch<React.SetStateAction<FooterSettingsContent>>;
  onOpenMediaLibrary?: () => void;
}

type FooterStudioTab =
  | "brand"
  | "description"
  | "navigation"
  | "specialties"
  | "contact"
  | "hours"
  | "social"
  | "trust"
  | "copyright"
  | "appearance"
  | "advanced"
  | "preview";

const TAB_CONFIG: Array<{ id: FooterStudioTab; label: string; icon: any }> = [
  { id: "brand", label: "A. Brand Identity", icon: Sparkles },
  { id: "description", label: "B. Description", icon: Info },
  { id: "navigation", label: "C. Explore Nav", icon: Globe },
  { id: "specialties", label: "D. Specialties", icon: Smile },
  { id: "contact", label: "E. Contact Info", icon: Phone },
  { id: "hours", label: "F. Business Hours", icon: Clock },
  { id: "social", label: "G. Social Media", icon: Share2 },
  { id: "trust", label: "H. Trust Statement", icon: ShieldCheck },
  { id: "copyright", label: "I. Copyright Bar", icon: Layers },
  { id: "appearance", label: "J. Appearance", icon: Palette },
  { id: "advanced", label: "K. Advanced", icon: Sliders },
  { id: "preview", label: "L. Live Preview", icon: Monitor },
];

export default function FooterEditor({
  footer,
  setFooter,
  onOpenMediaLibrary,
}: FooterEditorProps) {
  const [activeTab, setActiveTab] = useState<FooterStudioTab>("brand");
  const [previewViewport, setPreviewViewport] = useState<
    "desktop" | "tablet" | "mobile" | "mobile-sm" | "full"
  >("desktop");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Fallback safe references
  const def = DEFAULT_FOOTER_SETTINGS;
  const brand = footer.brand || def.brand!;
  const desc = footer.description || def.description!;
  const nav = footer.navigation || def.navigation!;
  const specs = footer.specialties || def.specialties!;
  const contact = footer.contact || def.contact!;
  const hours = footer.businessHours || def.businessHours!;
  const social = footer.socialLinks || def.socialLinks!;
  const trust = footer.trustStatements || def.trustStatements!;
  const copyright = footer.copyright || def.copyright!;
  const appearance = footer.appearance || def.appearance!;
  const visibility = footer.visibility || def.visibility!;
  const responsive = footer.responsiveLayout || def.responsiveLayout!;

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const showError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(null), 6000);
  };

  // Helper to update specific sub-configurations while keeping legacy fields in sync
  const updateBrand = (updated: Partial<typeof brand>) => {
    const nextBrand = { ...brand, ...updated };
    setFooter((prev) => ({
      ...prev,
      enabled: nextBrand.logoVisible,
      logoUrl: nextBrand.logoUrl,
      logoAlt: nextBrand.logoAlt,
      caption: nextBrand.caption,
      brand: nextBrand,
    }));
  };

  const updateDesc = (updated: Partial<typeof desc>) => {
    setFooter((prev) => ({
      ...prev,
      description: { ...desc, ...updated },
    }));
  };

  const updateNav = (updated: Partial<typeof nav>) => {
    setFooter((prev) => ({
      ...prev,
      navigation: { ...nav, ...updated },
    }));
  };

  const updateSpecs = (updated: Partial<typeof specs>) => {
    setFooter((prev) => ({
      ...prev,
      specialties: { ...specs, ...updated },
    }));
  };

  const updateContact = (updated: Partial<typeof contact>) => {
    setFooter((prev) => ({
      ...prev,
      contact: { ...contact, ...updated },
    }));
  };

  const updateHours = (updated: Partial<typeof hours>) => {
    setFooter((prev) => ({
      ...prev,
      businessHours: { ...hours, ...updated },
    }));
  };

  const updateSocial = (updated: Partial<typeof social>) => {
    setFooter((prev) => ({
      ...prev,
      socialLinks: { ...social, ...updated },
    }));
  };

  const updateTrust = (updated: Partial<typeof trust>) => {
    setFooter((prev) => ({
      ...prev,
      trustStatements: { ...trust, ...updated },
    }));
  };

  const updateCopyright = (updated: Partial<typeof copyright>) => {
    setFooter((prev) => ({
      ...prev,
      copyright: { ...copyright, ...updated },
    }));
  };

  const updateAppearance = (updated: Partial<typeof appearance>) => {
    setFooter((prev) => ({
      ...prev,
      appearance: { ...appearance, ...updated },
    }));
  };

  const updateVisibility = (updated: Partial<typeof visibility>) => {
    setFooter((prev) => ({
      ...prev,
      visibility: { ...visibility, ...updated },
    }));
  };

  const updateResponsive = (updated: Partial<typeof responsive>) => {
    setFooter((prev) => ({
      ...prev,
      responsiveLayout: { ...responsive, ...updated },
    }));
  };

  // Logo file upload handler
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
      brand.logoAlt || title
    );

    setUploading(false);

    if (res.success && res.data) {
      updateBrand({ logoUrl: res.data.public_url });
      showSuccess(`Logo uploaded successfully: ${file.name}`);
    } else {
      showError(res.error || "Failed to upload logo image to Supabase Storage.");
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleResetToDefaultLogo = () => {
    if (confirm("Reset the footer logo back to the official default DRK Hospital logo?")) {
      updateBrand({
        logoUrl: def.brand!.logoUrl,
        logoAlt: def.brand!.logoAlt,
        caption: def.brand!.caption,
        logoWidth: 208,
        logoHeight: 52,
        logoBgColor: "#FFFFFF",
        logoVisible: true,
      });
      showSuccess("Restored default DRK Hospital logo.");
    }
  };

  const handleResetAllToDefaults = () => {
    if (
      confirm(
        "Are you sure you want to reset ALL Footer CMS settings back to factory hospital defaults? Any unsaved edits will be lost."
      )
    ) {
      setFooter(DEFAULT_FOOTER_SETTINGS);
      showSuccess("All footer settings reset to verified hospital defaults.");
    }
  };

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

      {/* Studio Header & Tab Navigation */}
      <div className="card p-4 sm:p-5 border border-[#DCE8F0] bg-white rounded-3xl shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#DCE8F0]">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#10C6C1]" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#087FBA]">
                DRK Hospitals • Public Footer CMS Studio
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#071B68] mt-0.5">
              Footer Content & Layout Management
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetAllToDefaults}
              className="cursor-pointer inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              title="Reset all footer fields to default"
            >
              <RotateCcw size={13} />
              <span>Reset Defaults</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("preview")}
              className={`cursor-pointer inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition shadow-xs ${
                activeTab === "preview"
                  ? "bg-[#10C6C1] text-[#071B68]"
                  : "bg-[#071B68] text-white hover:bg-[#087FBA]"
              }`}
            >
              <Monitor size={13} />
              <span>Preview Studio</span>
            </button>
          </div>
        </div>

        {/* 12 Tabs Pill Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {TAB_CONFIG.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`cursor-pointer whitespace-nowrap inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold transition shrink-0 ${
                  isActive
                    ? "bg-[#071B68] text-white shadow-xs"
                    : "bg-white text-[#5D6B85] border border-[#DCE8F0] hover:bg-[#EFFBFC] hover:text-[#071B68]"
                }`}
              >
                <Icon size={13} className={isActive ? "text-[#10C6C1]" : "text-[#087FBA]"} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          TAB A: BRAND IDENTITY
      ========================================================================= */}
      {activeTab === "brand" && (
        <div className="space-y-6">
          {/* Logo Card */}
          <div className="card p-6 border border-[#DCE8F0] bg-white rounded-3xl shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DCE8F0]">
              <div>
                <h3 className="text-base font-bold text-[#071B68]">Footer Brand Logo</h3>
                <p className="text-xs text-[#5D6B85] mt-0.5">
                  Manage the official hospital brand logo displayed on the white card in the public footer.
                </p>
              </div>

              <button
                type="button"
                onClick={() => updateBrand({ logoVisible: !brand.logoVisible })}
                className={`cursor-pointer inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition shadow-xs ${
                  brand.logoVisible
                    ? "bg-[#071B68] text-white hover:bg-[#087FBA]"
                    : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                }`}
              >
                {brand.logoVisible ? (
                  <>
                    <Eye size={13} className="text-[#10C6C1]" />
                    <span>Logo Visible</span>
                  </>
                ) : (
                  <>
                    <EyeOff size={13} />
                    <span>Logo Hidden</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid gap-6 lg:grid-cols-12 items-start">
              {/* Left: Interactive Preview */}
              <div className="lg:col-span-5 space-y-3">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#071B68] block">
                  Simulated Logo Container
                </label>
                <div className="rounded-2xl bg-[#071B68] p-6 text-center flex flex-col items-center justify-center min-h-[160px] border border-blue-950 shadow-inner">
                  {brand.logoVisible ? (
                    <div
                      className="rounded-2xl p-3 sm:p-3.5 shadow-md inline-block transition-all"
                      style={{
                        backgroundColor: brand.logoBgColor || "#FFFFFF",
                      }}
                    >
                      <div
                        className="relative"
                        style={{
                          width: `${brand.logoWidth || 208}px`,
                          height: `${brand.logoHeight || 52}px`,
                        }}
                      >
                        <SafeImage
                          src={brand.logoUrl || "/images/drk-logo.png"}
                          alt={brand.logoAlt || "ROOTED IN CARE | DRK Hospital"}
                          fill
                          className="object-contain"
                          sizes="208px"
                          fallbackSrc="/images/drk-logo.png"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-blue-200 py-6">
                      <EyeOff size={24} className="mx-auto mb-1 opacity-60" />
                      <span>Footer logo is hidden</span>
                    </div>
                  )}

                  <p
                    className="text-xs font-semibold tracking-wider uppercase mt-3"
                    style={{ color: brand.taglineColor || "#10C6C1" }}
                  >
                    {brand.tagline || "ROOTED IN CARE"}
                  </p>
                </div>
              </div>

              {/* Right: Upload Controls & Sizing */}
              <div className="lg:col-span-7 space-y-4">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#071B68] block mb-2">
                    Upload or Replace Logo
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/svg+xml"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      disabled={uploading}
                      onClick={() => fileInputRef.current?.click()}
                      className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-[#071B68] px-4 py-2 text-xs font-bold text-white hover:bg-[#087FBA] transition shadow-xs disabled:opacity-50"
                    >
                      {uploading ? (
                        <>
                          <Loader2 size={13} className="animate-spin text-[#10C6C1]" />
                          <span>Uploading to Storage...</span>
                        </>
                      ) : (
                        <>
                          <Upload size={13} className="text-[#10C6C1]" />
                          <span>Upload Logo File</span>
                        </>
                      )}
                    </button>

                    {onOpenMediaLibrary && (
                      <button
                        type="button"
                        onClick={onOpenMediaLibrary}
                        className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl border border-[#DCE8F0] bg-white px-3.5 py-2 text-xs font-bold text-[#071B68] hover:bg-[#EFFBFC] transition"
                      >
                        <FileImage size={13} className="text-[#087FBA]" />
                        <span>Media Library</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handleResetToDefaultLogo}
                      className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                    >
                      <RotateCcw size={12} />
                      <span>Reset Default</span>
                    </button>
                  </div>
                </div>

                {/* Sizing & Background Options */}
                <div className="grid gap-4 sm:grid-cols-3 pt-2">
                  <div>
                    <label className="text-xs font-bold text-[#071B68]">
                      Width ({brand.logoWidth || 208}px)
                    </label>
                    <input
                      type="range"
                      min={160}
                      max={280}
                      step={4}
                      value={brand.logoWidth || 208}
                      onChange={(e) => updateBrand({ logoWidth: Number(e.target.value) })}
                      className="mt-2 w-full accent-[#087FBA]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#071B68]">
                      Height ({brand.logoHeight || 52}px)
                    </label>
                    <input
                      type="range"
                      min={40}
                      max={70}
                      step={2}
                      value={brand.logoHeight || 52}
                      onChange={(e) => updateBrand({ logoHeight: Number(e.target.value) })}
                      className="mt-2 w-full accent-[#087FBA]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#071B68]">Container BG</label>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="color"
                        value={brand.logoBgColor || "#FFFFFF"}
                        onChange={(e) => updateBrand({ logoBgColor: e.target.value })}
                        className="h-8 w-10 cursor-pointer rounded border border-[#DCE8F0]"
                      />
                      <input
                        type="text"
                        value={brand.logoBgColor || "#FFFFFF"}
                        onChange={(e) => updateBrand({ logoBgColor: e.target.value })}
                        className="w-full text-xs font-mono rounded-lg border border-[#DCE8F0] px-2 py-1.5"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 pt-2">
                  <div>
                    <label className="text-xs font-bold text-[#071B68]">Logo Alt Text (a11y)</label>
                    <input
                      type="text"
                      value={brand.logoAlt}
                      onChange={(e) => updateBrand({ logoAlt: e.target.value })}
                      placeholder="ROOTED IN CARE | DRK Hospital"
                      className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs text-[#071B68]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#071B68]">Logo Caption / Title</label>
                    <input
                      type="text"
                      value={brand.caption}
                      onChange={(e) => updateBrand({ caption: e.target.value })}
                      placeholder="DRK Hospital – Rooted in Care"
                      className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs text-[#071B68]"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3 pt-2">
                  <div>
                    <label className="text-xs font-bold text-[#071B68]">Logo Alignment</label>
                    <select
                      value={brand.logoAlignment || "left"}
                      onChange={(e) => updateBrand({ logoAlignment: e.target.value as any })}
                      className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs font-bold text-[#071B68]"
                    >
                      <option value="left">Left Aligned</option>
                      <option value="center">Center Aligned</option>
                      <option value="right">Right Aligned</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tagline Card */}
          <div className="card p-6 border border-[#DCE8F0] bg-white rounded-3xl shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#071B68]">Brand Tagline</h3>
                <p className="text-xs text-[#5D6B85] mt-0.5">
                  Official hospital motto displayed beneath the logo (Default: ROOTED IN CARE).
                </p>
              </div>
              <button
                type="button"
                onClick={() => updateBrand({ taglineVisible: !brand.taglineVisible })}
                className={`cursor-pointer inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold border transition ${
                  brand.taglineVisible
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                    : "border-slate-200 bg-slate-100 text-slate-600"
                }`}
              >
                {brand.taglineVisible ? <Eye size={12} /> : <EyeOff size={12} />}
                <span>{brand.taglineVisible ? "Tagline Shown" : "Tagline Hidden"}</span>
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-[#071B68]">Tagline Text</label>
                <input
                  type="text"
                  value={brand.tagline}
                  onChange={(e) => updateBrand({ tagline: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs font-bold text-[#071B68] uppercase"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#071B68]">Tagline Size</label>
                <select
                  value={brand.taglineSize || "sm"}
                  onChange={(e) => updateBrand({ taglineSize: e.target.value as any })}
                  className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs font-bold text-[#071B68]"
                >
                  <option value="xs">Small (xs)</option>
                  <option value="sm">Medium (sm - Default)</option>
                  <option value="base">Standard (base)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-[#071B68]">Text Color</label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="color"
                    value={brand.taglineColor || "#10C6C1"}
                    onChange={(e) => updateBrand({ taglineColor: e.target.value })}
                    className="h-8 w-10 cursor-pointer rounded border border-[#DCE8F0]"
                  />
                  <input
                    type="text"
                    value={brand.taglineColor || "#10C6C1"}
                    onChange={(e) => updateBrand({ taglineColor: e.target.value })}
                    className="w-full text-xs font-mono rounded-lg border border-[#DCE8F0] px-2 py-1.5"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB B: FOOTER DESCRIPTION
      ========================================================================= */}
      {activeTab === "description" && (
        <div className="card p-6 border border-[#DCE8F0] bg-white rounded-3xl shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#DCE8F0]">
            <div>
              <h3 className="text-base font-bold text-[#071B68]">Hospital Footer Description</h3>
              <p className="text-xs text-[#5D6B85] mt-0.5">
                Summary of DRK Hospitals healthcare mission displayed below the brand logo.
              </p>
            </div>
            <button
              type="button"
              onClick={() => updateDesc({ visible: !desc.visible })}
              className={`cursor-pointer inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold border transition ${
                desc.visible
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-slate-200 bg-slate-100 text-slate-600"
              }`}
            >
              {desc.visible ? <Eye size={12} /> : <EyeOff size={12} />}
              <span>{desc.visible ? "Description Visible" : "Description Hidden"}</span>
            </button>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900 space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <ShieldCheck size={14} className="text-amber-700" />
              <span>Factual Content Guidance</span>
            </div>
            <p className="text-[11px] text-amber-800">
              Only describe verified healthcare disciplines (Dental, Skin, Hair) and hospital facilities in Tiruttani, Tamil Nadu. Do not include unverified branch locations.
            </p>
          </div>

          <div>
            <label className="text-xs font-bold text-[#071B68]">Main Hospital Description</label>
            <textarea
              rows={3}
              value={desc.mainText}
              onChange={(e) => updateDesc({ mainText: e.target.value })}
              className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white p-3 text-xs text-[#071B68]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#071B68]">
              Supporting Statement / Regional Service Area
            </label>
            <input
              type="text"
              value={desc.supportingText}
              onChange={(e) => updateDesc({ supportingText: e.target.value })}
              className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs text-[#071B68]"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-4 pt-2">
            <div>
              <label className="text-xs font-bold text-[#071B68]">Text Alignment</label>
              <select
                value={desc.textAlign}
                onChange={(e) => updateDesc({ textAlign: e.target.value as any })}
                className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs font-bold text-[#071B68]"
              >
                <option value="left">Left Aligned</option>
                <option value="center">Centered</option>
                <option value="right">Right Aligned</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-[#071B68]">Maximum Width</label>
              <select
                value={desc.maxWidth}
                onChange={(e) => updateDesc({ maxWidth: e.target.value as any })}
                className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs font-bold text-[#071B68]"
              >
                <option value="xs">Narrow (max-w-xs)</option>
                <option value="sm">Standard (max-w-sm)</option>
                <option value="md">Wide (max-w-md)</option>
                <option value="full">Full Width</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-[#071B68]">Font Size</label>
              <select
                value={desc.fontSize || "sm"}
                onChange={(e) => updateDesc({ fontSize: e.target.value as any })}
                className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs font-bold text-[#071B68]"
              >
                <option value="xs">Small (xs)</option>
                <option value="sm">Standard (sm)</option>
                <option value="base">Normal (base)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-[#071B68]">Text Color</label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="color"
                  value={desc.textColor || "#EAF8FF"}
                  onChange={(e) => updateDesc({ textColor: e.target.value })}
                  className="h-8 w-10 cursor-pointer rounded border border-[#DCE8F0]"
                />
                <input
                  type="text"
                  value={desc.textColor || "#EAF8FF"}
                  onChange={(e) => updateDesc({ textColor: e.target.value })}
                  className="w-full text-xs font-mono rounded-lg border border-[#DCE8F0] px-2 py-1.5"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB C: EXPLORE NAVIGATION MANAGEMENT
      ========================================================================= */}
      {activeTab === "navigation" && (
        <div className="card p-6 border border-[#DCE8F0] bg-white rounded-3xl shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#DCE8F0]">
            <div>
              <h3 className="text-base font-bold text-[#071B68]">Explore Navigation Column</h3>
              <p className="text-xs text-[#5D6B85] mt-0.5">
                Manage column heading and public website exploration links.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => updateNav({ visible: !nav.visible })}
                className={`cursor-pointer inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold border transition ${
                  nav.visible
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                    : "border-slate-200 bg-slate-100 text-slate-600"
                }`}
              >
                {nav.visible ? <Eye size={12} /> : <EyeOff size={12} />}
                <span>{nav.visible ? "Column Visible" : "Column Hidden"}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const newLink: FooterNavigationLink = {
                    id: `nav-${Date.now()}`,
                    label: "New Page Link",
                    url: "/services",
                    isExternal: false,
                    openInNewTab: false,
                    isActive: true,
                    order: nav.links.length + 1,
                  };
                  updateNav({ links: [...nav.links, newLink] });
                }}
                className="cursor-pointer inline-flex items-center gap-1.5 rounded-full bg-[#071B68] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#087FBA] transition"
              >
                <Plus size={13} />
                <span>Add Link</span>
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#071B68]">Column Heading</label>
            <input
              type="text"
              value={nav.heading}
              onChange={(e) => updateNav({ heading: e.target.value })}
              className="mt-1 w-full max-w-xs rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs font-bold text-[#071B68]"
            />
          </div>

          {/* Links List */}
          <div className="space-y-3 pt-2">
            {nav.links.map((link, idx) => (
              <div
                key={link.id}
                className="rounded-2xl border border-[#DCE8F0] bg-[#F8FDFF] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="grid gap-3 sm:grid-cols-2 flex-1 w-full">
                  <div>
                    <label className="text-[10px] font-bold text-[#5D6B85] uppercase">
                      Link Label
                    </label>
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) => {
                        const updated = [...nav.links];
                        updated[idx].label = e.target.value;
                        updateNav({ links: updated });
                      }}
                      className="mt-1 w-full rounded-lg border border-[#DCE8F0] bg-white px-2.5 py-1.5 text-xs font-bold text-[#071B68]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#5D6B85] uppercase">
                      Target URL
                    </label>
                    <input
                      type="text"
                      value={link.url}
                      onChange={(e) => {
                        const updated = [...nav.links];
                        updated[idx].url = e.target.value;
                        updateNav({ links: updated });
                      }}
                      className="mt-1 w-full rounded-lg border border-[#DCE8F0] bg-white px-2.5 py-1.5 text-xs font-mono text-[#071B68]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1 sm:pt-0 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...nav.links];
                      updated[idx].openInNewTab = !updated[idx].openInNewTab;
                      updateNav({ links: updated });
                    }}
                    className={`cursor-pointer rounded-lg px-2 py-1 text-[11px] font-semibold border ${
                      link.openInNewTab
                        ? "border-[#087FBA] bg-[#EFFBFC] text-[#071B68]"
                        : "border-slate-200 bg-white text-slate-500"
                    }`}
                    title="Open link in a new browser tab"
                  >
                    New Tab
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...nav.links];
                      updated[idx].isActive = !updated[idx].isActive;
                      updateNav({ links: updated });
                    }}
                    className={`cursor-pointer p-1.5 rounded-lg border ${
                      link.isActive
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 bg-slate-100 text-slate-400"
                    }`}
                    title={link.isActive ? "Visible in footer" : "Hidden"}
                  >
                    {link.isActive ? <Eye size={13} /> : <EyeOff size={13} />}
                  </button>

                  {/* Reorder */}
                  <div className="flex items-center gap-0.5">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => {
                        const updated = [...nav.links];
                        const temp = updated[idx];
                        updated[idx] = updated[idx - 1];
                        updated[idx - 1] = temp;
                        updateNav({ links: updated });
                      }}
                      className="cursor-pointer p-1 rounded hover:bg-slate-200 text-slate-600 disabled:opacity-30"
                      title="Move Up"
                    >
                      <ArrowUp size={13} />
                    </button>
                    <button
                      type="button"
                      disabled={idx === nav.links.length - 1}
                      onClick={() => {
                        const updated = [...nav.links];
                        const temp = updated[idx];
                        updated[idx] = updated[idx + 1];
                        updated[idx + 1] = temp;
                        updateNav({ links: updated });
                      }}
                      className="cursor-pointer p-1 rounded hover:bg-slate-200 text-slate-600 disabled:opacity-30"
                      title="Move Down"
                    >
                      <ArrowDown size={13} />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Remove link "${link.label}"?`)) {
                        updateNav({ links: nav.links.filter((l) => l.id !== link.id) });
                      }
                    }}
                    className="cursor-pointer p-1.5 rounded-lg text-red-500 hover:bg-red-50"
                    title="Delete link"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB D: OUR SPECIALTIES
      ========================================================================= */}
      {activeTab === "specialties" && (
        <div className="card p-6 border border-[#DCE8F0] bg-white rounded-3xl shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#DCE8F0]">
            <div>
              <h3 className="text-base font-bold text-[#071B68]">Our Specialties Column</h3>
              <p className="text-xs text-[#5D6B85] mt-0.5">
                Clinical specialties linked directly into verified department sections.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => updateSpecs({ visible: !specs.visible })}
                className={`cursor-pointer inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold border transition ${
                  specs.visible
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                    : "border-slate-200 bg-slate-100 text-slate-600"
                }`}
              >
                {specs.visible ? <Eye size={12} /> : <EyeOff size={12} />}
                <span>{specs.visible ? "Column Visible" : "Column Hidden"}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const newSpec: FooterSpecialtyItem = {
                    id: `spec-${Date.now()}`,
                    title: "Specialty (Pending Confirmation)",
                    description: "Requires hospital clinical confirmation before publishing.",
                    icon: "Sparkles",
                    url: "/services",
                    order: specs.items.length + 1,
                    isActive: false, // Inactive by default: do not automatically publish unconfirmed specialties
                  };
                  updateSpecs({ items: [...specs.items, newSpec] });
                }}
                className="cursor-pointer inline-flex items-center gap-1.5 rounded-full bg-[#071B68] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#087FBA] transition"
              >
                <Plus size={13} />
                <span>Add Specialty</span>
              </button>
            </div>
          </div>

          {/* Factual Safety Advisory */}
          <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-3.5 text-xs text-blue-900 flex items-start gap-2.5">
            <span className="font-bold text-[#071B68] shrink-0 mt-0.5">Note:</span>
            <span>
              Confirmed clinical specialties for DRK Hospitals are <strong>Dental Care</strong>, <strong>Skin Care</strong>, and <strong>Hair Care</strong>. Do not publish General Medicine or additional departments without explicit hospital administration confirmation.
            </span>
          </div>

          <div>
            <label className="text-xs font-bold text-[#071B68]">Column Heading</label>
            <input
              type="text"
              value={specs.heading}
              onChange={(e) => updateSpecs({ heading: e.target.value })}
              className="mt-1 w-full max-w-xs rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs font-bold text-[#071B68]"
            />
          </div>

          <div className="space-y-4 pt-2">
            {specs.items.map((item, idx) => (
              <div
                key={item.id}
                className="rounded-2xl border border-[#DCE8F0] bg-[#F8FDFF] p-4 space-y-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="h-6 w-6 rounded-full bg-[#071B68] text-white flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const updated = [...specs.items];
                        updated[idx].title = e.target.value;
                        updateSpecs({ items: updated });
                      }}
                      className="rounded-lg border border-[#DCE8F0] bg-white px-2.5 py-1 text-xs font-bold text-[#071B68] w-48"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Reorder */}
                    <div className="flex items-center gap-0.5">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => {
                          const updated = [...specs.items];
                          const temp = updated[idx];
                          updated[idx] = updated[idx - 1];
                          updated[idx - 1] = temp;
                          updateSpecs({ items: updated });
                        }}
                        className="cursor-pointer p-1 rounded hover:bg-slate-200 text-slate-600 disabled:opacity-30"
                        title="Move Up"
                      >
                        <ArrowUp size={13} />
                      </button>
                      <button
                        type="button"
                        disabled={idx === specs.items.length - 1}
                        onClick={() => {
                          const updated = [...specs.items];
                          const temp = updated[idx];
                          updated[idx] = updated[idx + 1];
                          updated[idx + 1] = temp;
                          updateSpecs({ items: updated });
                        }}
                        className="cursor-pointer p-1 rounded hover:bg-slate-200 text-slate-600 disabled:opacity-30"
                        title="Move Down"
                      >
                        <ArrowDown size={13} />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...specs.items];
                        updated[idx].isActive = !updated[idx].isActive;
                        updateSpecs({ items: updated });
                      }}
                      className={`cursor-pointer p-1.5 rounded-lg border ${
                        item.isActive
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-slate-200 bg-slate-100 text-slate-400"
                      }`}
                    >
                      {item.isActive ? <Eye size={13} /> : <EyeOff size={13} />}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Remove specialty "${item.title}"?`)) {
                          updateSpecs({ items: specs.items.filter((s) => s.id !== item.id) });
                        }
                      }}
                      className="cursor-pointer p-1.5 rounded-lg text-red-500 hover:bg-red-50"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-4">
                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-bold text-[#5D6B85] uppercase">
                      Clinical Description / Subtitle
                    </label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => {
                        const updated = [...specs.items];
                        updated[idx].description = e.target.value;
                        updateSpecs({ items: updated });
                      }}
                      className="mt-1 w-full rounded-lg border border-[#DCE8F0] bg-white px-2.5 py-1.5 text-xs text-[#5D6B85]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#5D6B85] uppercase">
                      Specialty Icon
                    </label>
                    <select
                      value={item.icon || "Sparkles"}
                      onChange={(e) => {
                        const updated = [...specs.items];
                        updated[idx].icon = e.target.value;
                        updateSpecs({ items: updated });
                      }}
                      className="mt-1 w-full rounded-lg border border-[#DCE8F0] bg-white px-2 py-1.5 text-xs text-[#071B68]"
                    >
                      <option value="Smile">Smile (Dental)</option>
                      <option value="Sparkles">Sparkles (Skin)</option>
                      <option value="Scissors">Scissors (Hair)</option>
                      <option value="Stethoscope">Stethoscope</option>
                      <option value="Heart">Heart</option>
                      <option value="Activity">Activity</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#5D6B85] uppercase">
                      Destination Link
                    </label>
                    <input
                      type="text"
                      value={item.url}
                      onChange={(e) => {
                        const updated = [...specs.items];
                        updated[idx].url = e.target.value;
                        updateSpecs({ items: updated });
                      }}
                      className="mt-1 w-full rounded-lg border border-[#DCE8F0] bg-white px-2.5 py-1.5 text-xs font-mono text-[#071B68]"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB E: CONTACT INFORMATION MANAGEMENT
      ========================================================================= */}
      {activeTab === "contact" && (
        <div className="space-y-6">
          <div className="card p-6 border border-[#DCE8F0] bg-white rounded-3xl shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#DCE8F0]">
              <div>
                <h3 className="text-base font-bold text-[#071B68]">Contact & Hours Column</h3>
                <p className="text-xs text-[#5D6B85] mt-0.5">
                  Configure hospital physical location, phone desk, email, and WhatsApp coordinates.
                </p>
              </div>
              <button
                type="button"
                onClick={() => updateContact({ visible: !contact.visible })}
                className={`cursor-pointer inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold border transition ${
                  contact.visible
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                    : "border-slate-200 bg-slate-100 text-slate-600"
                }`}
              >
                {contact.visible ? <Eye size={12} /> : <EyeOff size={12} />}
                <span>{contact.visible ? "Column Visible" : "Column Hidden"}</span>
              </button>
            </div>

            {/* Factual Safety Advisory Banner */}
            <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
              <span className="font-bold text-amber-800 shrink-0 mt-0.5">Review Requirement:</span>
              <span>
                Do not publish unverified telephone or WhatsApp numbers. Do not treat registered office addresses as the clinical patient-visit address without hospital confirmation. All unconfirmed fields are flagged for administrator review before publication.
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-[#071B68]">Column Heading</label>
              <input
                type="text"
                value={contact.heading}
                onChange={(e) => updateContact({ heading: e.target.value })}
                className="mt-1 w-full max-w-xs rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs font-bold text-[#071B68]"
              />
            </div>

            {/* Master Hospital Info Source Toggle */}
            <div className="rounded-2xl border border-[#DCE8F0] bg-[#F8FDFF] p-4 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-[#071B68] block">
                  Use Centralized Hospital Configuration
                </span>
                <p className="text-[11px] text-[#5D6B85] mt-0.5">
                  Pulls verified Tiruttani regional address and hospital credentials from <code>HOSPITAL_INFO</code>.
                </p>
              </div>
              <input
                type="checkbox"
                checked={contact.useHospitalInfo}
                onChange={(e) => updateContact({ useHospitalInfo: e.target.checked })}
                className="h-5 w-5 accent-[#087FBA] cursor-pointer"
              />
            </div>

            {/* Telephone & Email Controls */}
            <div className="grid gap-4 sm:grid-cols-2 pt-2">
              <div className="rounded-2xl border border-[#DCE8F0] p-4 bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#071B68] flex items-center gap-1.5">
                    <Phone size={14} className="text-[#087FBA]" />
                    <span>Hospital Telephone</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={contact.phoneVisible}
                    onChange={(e) => updateContact({ phoneVisible: e.target.checked })}
                    className="h-4 w-4 accent-[#087FBA]"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-[#5D6B85] uppercase">
                      Primary Phone (Display)
                    </label>
                    <span className="text-[9px] font-medium text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                      Verify Before Publish
                    </span>
                  </div>
                  <input
                    type="text"
                    value={contact.primaryPhone}
                    onChange={(e) => updateContact({ primaryPhone: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-[#DCE8F0] bg-white px-2.5 py-1.5 text-xs text-[#071B68]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#5D6B85] uppercase">
                    Tel URL (Raw Digits)
                  </label>
                  <input
                    type="text"
                    value={contact.primaryPhoneRaw}
                    onChange={(e) => updateContact({ primaryPhoneRaw: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-[#DCE8F0] bg-white px-2.5 py-1.5 text-xs font-mono text-[#071B68]"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-[#DCE8F0] p-4 bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#071B68] flex items-center gap-1.5">
                    <Mail size={14} className="text-[#087FBA]" />
                    <span>Official Email</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={contact.emailVisible}
                    onChange={(e) => updateContact({ emailVisible: e.target.checked })}
                    className="h-4 w-4 accent-[#087FBA]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#5D6B85] uppercase">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={contact.officialEmail}
                    onChange={(e) => updateContact({ officialEmail: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-[#DCE8F0] bg-white px-2.5 py-1.5 text-xs text-[#071B68]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#5D6B85] uppercase">
                    Email Label
                  </label>
                  <input
                    type="text"
                    value={contact.emailLabel}
                    onChange={(e) => updateContact({ emailLabel: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-[#DCE8F0] bg-white px-2.5 py-1.5 text-xs text-[#071B68]"
                  />
                </div>
              </div>
            </div>

            {/* Address Details */}
            <div className="rounded-2xl border border-[#DCE8F0] p-4 bg-white space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#071B68] flex items-center gap-1.5">
                  <MapPin size={14} className="text-[#087FBA]" />
                  <span>Physical Address & Google Maps</span>
                </span>
                <input
                  type="checkbox"
                  checked={contact.addressVisible}
                  onChange={(e) => updateContact({ addressVisible: e.target.checked })}
                  className="h-4 w-4 accent-[#087FBA]"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-[#5D6B85] uppercase">Street / Building</label>
                    <span className="text-[9px] font-medium text-amber-700 bg-amber-50 px-1 py-0.2 rounded">
                      Unconfirmed
                    </span>
                  </div>
                  <input
                    type="text"
                    value={contact.street}
                    onChange={(e) => updateContact({ street: e.target.value })}
                    placeholder="Specific building or street address"
                    className="mt-1 w-full rounded-lg border border-[#DCE8F0] px-2.5 py-1.5 text-xs text-[#071B68]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#5D6B85] uppercase">Town / City</label>
                  <input
                    type="text"
                    value={contact.city}
                    onChange={(e) => updateContact({ city: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-[#DCE8F0] px-2.5 py-1.5 text-xs text-[#071B68]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#5D6B85] uppercase">State & PIN</label>
                  <input
                    type="text"
                    value={`${contact.state} ${contact.pincode}`}
                    onChange={(e) => updateContact({ state: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-[#DCE8F0] px-2.5 py-1.5 text-xs text-[#071B68]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-[#5D6B85] uppercase">
                    Google Maps Place Link
                  </label>
                  <span className="text-[9px] font-medium text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                    Verify Coordinates
                  </span>
                </div>
                <input
                  type="text"
                  value={contact.googleMapsUrl}
                  onChange={(e) => updateContact({ googleMapsUrl: e.target.value })}
                  placeholder="https://maps.google.com/?q=..."
                  className="mt-1 w-full rounded-lg border border-[#DCE8F0] px-2.5 py-1.5 text-xs font-mono text-[#071B68]"
                />
              </div>
            </div>

            {/* WhatsApp Direct Action (General Enquiry Only - No Appointment Booking) */}
            <div className="rounded-2xl border border-[#DCE8F0] p-4 bg-[#F8FDFF] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#071B68] flex items-center gap-1.5">
                  <MessageCircle size={14} className="text-[#10C6C1]" />
                  <span>Direct WhatsApp Enquiry Action</span>
                </span>
                <input
                  type="checkbox"
                  checked={contact.whatsappVisible}
                  onChange={(e) => updateContact({ whatsappVisible: e.target.checked })}
                  className="h-4 w-4 accent-[#087FBA]"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="text-[10px] font-bold text-[#5D6B85] uppercase">
                    Button Label
                  </label>
                  <input
                    type="text"
                    value={contact.whatsappButtonText}
                    onChange={(e) => updateContact({ whatsappButtonText: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-[#DCE8F0] px-2.5 py-1.5 text-xs text-[#071B68]"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-[#5D6B85] uppercase">
                      WhatsApp Digits
                    </label>
                    <span className="text-[9px] font-medium text-amber-700 bg-amber-50 px-1 py-0.2 rounded">
                      Verify
                    </span>
                  </div>
                  <input
                    type="text"
                    value={contact.whatsappNumber}
                    onChange={(e) => updateContact({ whatsappNumber: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-[#DCE8F0] px-2.5 py-1.5 text-xs font-mono text-[#071B68]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#5D6B85] uppercase">
                    Enquiry Welcome Message
                  </label>
                  <input
                    type="text"
                    value={contact.whatsappMessage || ""}
                    onChange={(e) => updateContact({ whatsappMessage: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-[#DCE8F0] px-2.5 py-1.5 text-xs text-[#071B68]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB F: BUSINESS HOURS MANAGEMENT
      ========================================================================= */}
      {activeTab === "hours" && (
        <div className="card p-6 border border-[#DCE8F0] bg-white rounded-3xl shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#DCE8F0]">
            <div>
              <h3 className="text-base font-bold text-[#071B68]">Clinical Business Hours</h3>
              <p className="text-xs text-[#5D6B85] mt-0.5">
                Configure OPD opening hours, Sunday consultation schedules, and patient advisories.
              </p>
            </div>
            <button
              type="button"
              onClick={() => updateHours({ visible: !hours.visible })}
              className={`cursor-pointer inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold border transition ${
                hours.visible
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-slate-200 bg-slate-100 text-slate-600"
              }`}
            >
              {hours.visible ? <Eye size={12} /> : <EyeOff size={12} />}
              <span>{hours.visible ? "Hours Visible" : "Hours Hidden"}</span>
            </button>
          </div>

          {/* Factual Safety Advisory */}
          <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-3.5 text-xs text-blue-900 flex items-start gap-2.5">
            <span className="font-bold text-[#071B68] shrink-0 mt-0.5">Notice:</span>
            <span>
              Business and consultation hours must reflect actual hospital doctor availability. Do not publish emergency-care or 24/7 emergency-service claims without explicit hospital confirmation.
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="text-xs font-bold text-[#071B68]">Time Format</label>
              <select
                value={hours.timeFormat || "12h"}
                onChange={(e) => updateHours({ timeFormat: e.target.value as any })}
                className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs font-bold text-[#071B68]"
              >
                <option value="12h">12-Hour (e.g. 8:00 AM – 8:00 PM)</option>
                <option value="24h">24-Hour (e.g. 08:00 – 20:00)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-[#071B68]">Timezone</label>
              <input
                type="text"
                value={hours.timezone}
                onChange={(e) => updateHours({ timezone: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs text-[#071B68]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#071B68]">General Consultation Advisory</label>
              <input
                type="text"
                value={hours.generalAdvisory}
                onChange={(e) => updateHours({ generalAdvisory: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs text-[#071B68]"
              />
            </div>
          </div>

          {/* Daily Schedule List */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#071B68]">
              Weekly Day-by-Day Schedule
            </h4>
            <div className="grid gap-2 sm:grid-cols-2">
              {hours.days.map((d, idx) => (
                <div
                  key={d.day}
                  className="rounded-xl border border-[#DCE8F0] bg-[#F8FDFF] p-3 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#071B68]">{d.day}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...hours.days];
                        updated[idx].isOpen = !updated[idx].isOpen;
                        updateHours({ days: updated });
                      }}
                      className={`cursor-pointer px-2 py-0.5 rounded text-[10px] font-bold border ${
                        d.isOpen
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : "bg-slate-100 text-slate-600 border-slate-300"
                      }`}
                    >
                      {d.isOpen ? "Open" : "Closed"}
                    </button>
                  </div>

                  {d.isOpen ? (
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-[10px] text-[#5D6B85]">Open:</span>
                        <input
                          type="text"
                          value={d.openTime}
                          onChange={(e) => {
                            const updated = [...hours.days];
                            updated[idx].openTime = e.target.value;
                            updateHours({ days: updated });
                          }}
                          className="mt-0.5 w-full rounded border border-[#DCE8F0] bg-white px-2 py-1 text-xs"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-[#5D6B85]">Close:</span>
                        <input
                          type="text"
                          value={d.closeTime}
                          onChange={(e) => {
                            const updated = [...hours.days];
                            updated[idx].closeTime = e.target.value;
                            updateHours({ days: updated });
                          }}
                          className="mt-0.5 w-full rounded border border-[#DCE8F0] bg-white px-2 py-1 text-xs"
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-400 italic">Closed for routine consultation</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB G: SOCIAL MEDIA MANAGEMENT
      ========================================================================= */}
      {activeTab === "social" && (
        <div className="card p-6 border border-[#DCE8F0] bg-white rounded-3xl shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#DCE8F0]">
            <div>
              <h3 className="text-base font-bold text-[#071B68]">Social Media Accounts</h3>
              <p className="text-xs text-[#5D6B85] mt-0.5">
                Manage social profile channels displayed in the brand column.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => updateSocial({ visible: !social.visible })}
                className={`cursor-pointer inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold border transition ${
                  social.visible
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                    : "border-slate-200 bg-slate-100 text-slate-600"
                }`}
              >
                {social.visible ? <Eye size={12} /> : <EyeOff size={12} />}
                <span>{social.visible ? "Social Shown" : "Social Hidden"}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const newSoc: FooterSocialItem = {
                    id: `soc-${Date.now()}`,
                    platform: "Instagram",
                    label: "Instagram",
                    url: "https://instagram.com/drkhospitals",
                    icon: "Instagram",
                    openInNewTab: true,
                    isActive: true,
                    order: social.links.length + 1,
                  };
                  updateSocial({ links: [...social.links, newSoc] });
                }}
                className="cursor-pointer inline-flex items-center gap-1.5 rounded-full bg-[#071B68] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#087FBA] transition"
              >
                <Plus size={13} />
                <span>Add Social Profile</span>
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="text-xs font-bold text-[#071B68]">Section Title</label>
              <input
                type="text"
                value={social.heading}
                onChange={(e) => updateSocial({ heading: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs font-bold text-[#071B68]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#071B68]">Icon Style</label>
              <select
                value={social.iconStyle || "circle"}
                onChange={(e) => updateSocial({ iconStyle: e.target.value as any })}
                className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs font-bold text-[#071B68]"
              >
                <option value="circle">Circular Buttons</option>
                <option value="rounded">Rounded Square</option>
                <option value="minimal">Minimal Flat</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-[#071B68]">Icon Size</label>
              <select
                value={social.iconSize || "md"}
                onChange={(e) => updateSocial({ iconSize: e.target.value as any })}
                className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs font-bold text-[#071B68]"
              >
                <option value="sm">Small (28px)</option>
                <option value="md">Standard (36px)</option>
                <option value="lg">Large (40px)</option>
              </select>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {social.links.map((s, idx) => (
              <div
                key={s.id}
                className="rounded-2xl border border-[#DCE8F0] bg-[#F8FDFF] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="grid gap-3 sm:grid-cols-3 flex-1 w-full">
                  <div>
                    <label className="text-[10px] font-bold text-[#5D6B85] uppercase">Platform</label>
                    <select
                      value={s.platform}
                      onChange={(e) => {
                        const updated = [...social.links];
                        updated[idx].platform = e.target.value as any;
                        updated[idx].label = e.target.value;
                        updateSocial({ links: updated });
                      }}
                      className="mt-1 w-full rounded-lg border border-[#DCE8F0] bg-white px-2 py-1.5 text-xs font-bold text-[#071B68]"
                    >
                      <option value="Instagram">Instagram</option>
                      <option value="Facebook">Facebook</option>
                      <option value="YouTube">YouTube</option>
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="Twitter">Twitter / X</option>
                      <option value="Custom">Custom Channel</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-bold text-[#5D6B85] uppercase">
                      Profile URL
                    </label>
                    <input
                      type="url"
                      value={s.url}
                      onChange={(e) => {
                        const updated = [...social.links];
                        updated[idx].url = e.target.value;
                        updateSocial({ links: updated });
                      }}
                      className="mt-1 w-full rounded-lg border border-[#DCE8F0] bg-white px-2 py-1.5 text-xs font-mono text-[#071B68]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {/* Reorder */}
                  <div className="flex items-center gap-0.5">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => {
                        const updated = [...social.links];
                        const temp = updated[idx];
                        updated[idx] = updated[idx - 1];
                        updated[idx - 1] = temp;
                        updateSocial({ links: updated });
                      }}
                      className="cursor-pointer p-1 rounded hover:bg-slate-200 text-slate-600 disabled:opacity-30"
                      title="Move Up"
                    >
                      <ArrowUp size={13} />
                    </button>
                    <button
                      type="button"
                      disabled={idx === social.links.length - 1}
                      onClick={() => {
                        const updated = [...social.links];
                        const temp = updated[idx];
                        updated[idx] = updated[idx + 1];
                        updated[idx + 1] = temp;
                        updateSocial({ links: updated });
                      }}
                      className="cursor-pointer p-1 rounded hover:bg-slate-200 text-slate-600 disabled:opacity-30"
                      title="Move Down"
                    >
                      <ArrowDown size={13} />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...social.links];
                      updated[idx].isActive = !updated[idx].isActive;
                      updateSocial({ links: updated });
                    }}
                    className={`cursor-pointer p-1.5 rounded-lg border ${
                      s.isActive
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 bg-slate-100 text-slate-400"
                    }`}
                  >
                    {s.isActive ? <Eye size={13} /> : <EyeOff size={13} />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      updateSocial({ links: social.links.filter((l) => l.id !== s.id) });
                    }}
                    className="cursor-pointer p-1.5 rounded-lg text-red-500 hover:bg-red-50"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB H: TRUST & HEALTHCARE STATEMENT
      ========================================================================= */}
      {activeTab === "trust" && (
        <div className="card p-6 border border-[#DCE8F0] bg-white rounded-3xl shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#DCE8F0]">
            <div>
              <h3 className="text-base font-bold text-[#071B68]">Trust & Ethical Healthcare</h3>
              <p className="text-xs text-[#5D6B85] mt-0.5">
                Statements highlighting patient safety, ethics, and clinical care integrity.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => updateTrust({ visible: !trust.visible })}
                className={`cursor-pointer inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold border transition ${
                  trust.visible
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                    : "border-slate-200 bg-slate-100 text-slate-600"
                }`}
              >
                {trust.visible ? <Eye size={12} /> : <EyeOff size={12} />}
                <span>{trust.visible ? "Trust Visible" : "Trust Hidden"}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const newStmt: FooterTrustStatement = {
                    id: `trust-${Date.now()}`,
                    text: "Patient-Centric Clinical Care",
                    icon: "ShieldCheck",
                    textColor: "#EAF8FF",
                    iconColor: "#10C6C1",
                    fontSize: "xs",
                    visible: true,
                  };
                  updateTrust({ statements: [...trust.statements, newStmt] });
                }}
                className="cursor-pointer inline-flex items-center gap-1 rounded-full bg-[#071B68] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#087FBA]"
              >
                <Plus size={12} />
                <span>Add Statement</span>
              </button>
            </div>
          </div>

          {/* Factual Safety Advisory */}
          <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-3.5 text-xs text-blue-900 flex items-start gap-2.5">
            <span className="font-bold text-[#071B68] shrink-0 mt-0.5">Notice:</span>
            <span>
              Medical claims safety: Do not add unsupported accreditations (e.g. NABH/JCI), awards, or unverified clinical efficacy statements without formal documentation.
            </span>
          </div>

          <div className="space-y-3">
            {trust.statements.map((st, idx) => (
              <div
                key={st.id}
                className="rounded-2xl border border-[#DCE8F0] bg-[#F8FDFF] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="grid gap-3 sm:grid-cols-4 flex-1 w-full">
                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-bold text-[#5D6B85] uppercase">
                      Statement Text
                    </label>
                    <input
                      type="text"
                      value={st.text}
                      onChange={(e) => {
                        const updated = [...trust.statements];
                        updated[idx].text = e.target.value;
                        updateTrust({ statements: updated });
                      }}
                      className="mt-1 w-full rounded-lg border border-[#DCE8F0] bg-white px-2.5 py-1.5 text-xs font-bold text-[#071B68]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#5D6B85] uppercase">Icon</label>
                    <select
                      value={st.icon}
                      onChange={(e) => {
                        const updated = [...trust.statements];
                        updated[idx].icon = e.target.value;
                        updateTrust({ statements: updated });
                      }}
                      className="mt-1 w-full rounded-lg border border-[#DCE8F0] bg-white px-2 py-1.5 text-xs text-[#071B68]"
                    >
                      <option value="ShieldCheck">Shield Check (Safety)</option>
                      <option value="CheckCircle2">Check Circle (Verified)</option>
                      <option value="Heart">Heart (Compassion)</option>
                      <option value="Sparkles">Sparkles (Care)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#5D6B85] uppercase">Icon Color</label>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="color"
                        value={st.iconColor || "#10C6C1"}
                        onChange={(e) => {
                          const updated = [...trust.statements];
                          updated[idx].iconColor = e.target.value;
                          updateTrust({ statements: updated });
                        }}
                        className="h-8 w-10 cursor-pointer rounded border border-[#DCE8F0]"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...trust.statements];
                      updated[idx].visible = !updated[idx].visible;
                      updateTrust({ statements: updated });
                    }}
                    className={`cursor-pointer p-1.5 rounded-lg border ${
                      st.visible
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 bg-slate-100 text-slate-400"
                    }`}
                  >
                    {st.visible ? <Eye size={13} /> : <EyeOff size={13} />}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      updateTrust({
                        statements: trust.statements.filter((item) => item.id !== st.id),
                      });
                    }}
                    className="cursor-pointer p-1.5 rounded-lg text-red-500 hover:bg-red-50"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB I: COPYRIGHT & BOTTOM BAR
      ========================================================================= */}
      {activeTab === "copyright" && (
        <div className="card p-6 border border-[#DCE8F0] bg-white rounded-3xl shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#DCE8F0]">
            <div>
              <h3 className="text-base font-bold text-[#071B68]">Copyright & Bottom Bar</h3>
              <p className="text-xs text-[#5D6B85] mt-0.5">
                Configure the bottom legal line, dynamic year, and accreditation links.
              </p>
            </div>
            <button
              type="button"
              onClick={() => updateCopyright({ visible: !copyright.visible })}
              className={`cursor-pointer inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold border transition ${
                copyright.visible
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-slate-200 bg-slate-100 text-slate-600"
              }`}
            >
              {copyright.visible ? <Eye size={12} /> : <EyeOff size={12} />}
              <span>{copyright.visible ? "Bar Shown" : "Bar Hidden"}</span>
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-4">
            <div>
              <label className="text-xs font-bold text-[#071B68]">Prefix</label>
              <input
                type="text"
                value={copyright.prefix}
                onChange={(e) => updateCopyright({ prefix: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs font-bold text-[#071B68]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#071B68]">Hospital Name</label>
              <input
                type="text"
                value={copyright.hospitalName}
                onChange={(e) => updateCopyright({ hospitalName: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs font-bold text-[#071B68]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#071B68]">Brand Tagline</label>
              <input
                type="text"
                value={copyright.tagline}
                onChange={(e) => updateCopyright({ tagline: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs font-bold text-[#071B68]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#071B68]">Suffix</label>
              <input
                type="text"
                value={copyright.suffix}
                onChange={(e) => updateCopyright({ suffix: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs text-[#071B68]"
              />
            </div>
          </div>

          {/* Dynamic Year Setting */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#DCE8F0] bg-[#F8FDFF] p-4 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-[#071B68] block">
                  Automatic Dynamic Current Year
                </span>
                <p className="text-[11px] text-[#5D6B85] mt-0.5">
                  Automatically renders current calendar year ({new Date().getFullYear()}) in the copyright string.
                </p>
              </div>
              <input
                type="checkbox"
                checked={copyright.useDynamicYear}
                onChange={(e) => updateCopyright({ useDynamicYear: e.target.checked })}
                className="h-5 w-5 accent-[#087FBA] cursor-pointer"
              />
            </div>

            {!copyright.useDynamicYear && (
              <div>
                <label className="text-xs font-bold text-[#071B68]">Manual Year Override</label>
                <input
                  type="text"
                  value={copyright.manualYear}
                  onChange={(e) => updateCopyright({ manualYear: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs font-mono text-[#071B68]"
                />
              </div>
            )}
          </div>

          {/* Location & Separator */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-bold text-[#071B68]">Location Tag</label>
              <input
                type="text"
                value={copyright.locationLabel}
                onChange={(e) => updateCopyright({ locationLabel: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs text-[#071B68]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#071B68]">Link Separator Style</label>
              <select
                value={copyright.separator || "bullet"}
                onChange={(e) => updateCopyright({ separator: e.target.value as any })}
                className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs font-bold text-[#071B68]"
              >
                <option value="bullet">Bullet (•)</option>
                <option value="pipe">Pipe (|)</option>
                <option value="slash">Slash (/)</option>
                <option value="dash">Dash (–)</option>
              </select>
            </div>
          </div>

          {/* Bottom Links List */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-[#071B68]">
                Bottom Legal & Auxiliary Links
              </label>
              <button
                type="button"
                onClick={() => {
                  const newLink: FooterBottomLink = {
                    id: `c-${Date.now()}`,
                    label: "New Link",
                    url: "/about",
                    openInNewTab: false,
                    visible: true,
                    order: copyright.links.length + 1,
                  };
                  updateCopyright({ links: [...copyright.links, newLink] });
                }}
                className="cursor-pointer inline-flex items-center gap-1 text-xs font-bold text-[#087FBA] hover:underline"
              >
                <Plus size={12} />
                <span>Add Bottom Link</span>
              </button>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              {copyright.links.map((link, idx) => (
                <div
                  key={link.id}
                  className="rounded-xl border border-[#DCE8F0] bg-white p-3 flex items-center justify-between gap-2"
                >
                  <div className="grid grid-cols-2 gap-2 flex-1">
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) => {
                        const updated = [...copyright.links];
                        updated[idx].label = e.target.value;
                        updateCopyright({ links: updated });
                      }}
                      className="rounded border border-[#DCE8F0] px-2 py-1 text-xs font-bold text-[#071B68]"
                    />
                    <input
                      type="text"
                      value={link.url}
                      onChange={(e) => {
                        const updated = [...copyright.links];
                        updated[idx].url = e.target.value;
                        updateCopyright({ links: updated });
                      }}
                      className="rounded border border-[#DCE8F0] px-2 py-1 text-xs font-mono text-[#071B68]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      updateCopyright({
                        links: copyright.links.filter((l) => l.id !== link.id),
                      });
                    }}
                    className="cursor-pointer text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB J: FOOTER APPEARANCE & DESIGN CONTROLS
      ========================================================================= */}
      {activeTab === "appearance" && (
        <div className="card p-6 border border-[#DCE8F0] bg-white rounded-3xl shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#DCE8F0]">
            <div>
              <h3 className="text-base font-bold text-[#071B68]">Footer Appearance & Colors</h3>
              <p className="text-xs text-[#5D6B85] mt-0.5">
                Brand colors, gradients, padding, and typography options.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                updateAppearance({
                  bgColor: "#071B68",
                  bottomBarBgColor: "#05144f",
                  isGradient: false,
                  accentColor: "#10C6C1",
                  bodyTextColor: "#EAF8FF",
                  headingColor: "#FFFFFF",
                });
                showSuccess("Reset appearance to official DRK brand palette.");
              }}
              className="cursor-pointer inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              <RotateCcw size={12} />
              <span>Reset Brand Palette</span>
            </button>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            <div>
              <label className="text-xs font-bold text-[#071B68]">Footer Background Color</label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="color"
                  value={appearance.bgColor || "#071B68"}
                  onChange={(e) => updateAppearance({ bgColor: e.target.value })}
                  className="h-8 w-10 cursor-pointer rounded border border-[#DCE8F0]"
                />
                <input
                  type="text"
                  value={appearance.bgColor || "#071B68"}
                  onChange={(e) => updateAppearance({ bgColor: e.target.value })}
                  className="w-full text-xs font-mono rounded-lg border border-[#DCE8F0] px-2 py-1.5"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#071B68]">Bottom Bar Background</label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="color"
                  value={appearance.bottomBarBgColor || "#05144f"}
                  onChange={(e) => updateAppearance({ bottomBarBgColor: e.target.value })}
                  className="h-8 w-10 cursor-pointer rounded border border-[#DCE8F0]"
                />
                <input
                  type="text"
                  value={appearance.bottomBarBgColor || "#05144f"}
                  onChange={(e) => updateAppearance({ bottomBarBgColor: e.target.value })}
                  className="w-full text-xs font-mono rounded-lg border border-[#DCE8F0] px-2 py-1.5"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#071B68]">Turquoise Accent Color</label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="color"
                  value={appearance.accentColor || "#10C6C1"}
                  onChange={(e) => updateAppearance({ accentColor: e.target.value })}
                  className="h-8 w-10 cursor-pointer rounded border border-[#DCE8F0]"
                />
                <input
                  type="text"
                  value={appearance.accentColor || "#10C6C1"}
                  onChange={(e) => updateAppearance({ accentColor: e.target.value })}
                  className="w-full text-xs font-mono rounded-lg border border-[#DCE8F0] px-2 py-1.5"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#DCE8F0] bg-[#F8FDFF] p-4 flex items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-[#071B68] block">Gradient Background Mode</span>
              <p className="text-[11px] text-[#5D6B85] mt-0.5">
                Enable subtle luxury diagonal gradient across the top footer section.
              </p>
            </div>
            <input
              type="checkbox"
              checked={appearance.isGradient}
              onChange={(e) => updateAppearance({ isGradient: e.target.checked })}
              className="h-5 w-5 accent-[#087FBA] cursor-pointer"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-bold text-[#071B68]">Top Padding</label>
              <select
                value={appearance.topPadding}
                onChange={(e) => updateAppearance({ topPadding: e.target.value as any })}
                className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs font-bold text-[#071B68]"
              >
                <option value="py-10">Compact (py-10)</option>
                <option value="py-14">Standard (py-14)</option>
                <option value="py-16">Comfortable (py-16)</option>
                <option value="py-20">Spacious (py-20)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[#071B68]">Container Max Width</label>
              <select
                value={appearance.containerMaxWidth}
                onChange={(e) => updateAppearance({ containerMaxWidth: e.target.value as any })}
                className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs font-bold text-[#071B68]"
              >
                <option value="container">Theme Container (Default)</option>
                <option value="max-w-7xl">Max 7XL (1280px)</option>
                <option value="max-w-6xl">Max 6XL (1152px)</option>
                <option value="max-w-full">Full Width</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB K: ADVANCED VISIBILITY SETTINGS
      ========================================================================= */}
      {activeTab === "advanced" && (
        <div className="card p-6 border border-[#DCE8F0] bg-white rounded-3xl shadow-xs space-y-5">
          <div className="pb-3 border-b border-[#DCE8F0]">
            <h3 className="text-base font-bold text-[#071B68]">Master Column & Component Visibility</h3>
            <p className="text-xs text-[#5D6B85] mt-0.5">
              Control the rendering of entire columns and structural elements with zero empty placeholders.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { id: "showBrandColumn", label: "Column 1: Brand & Description" },
              { id: "showNavigationColumn", label: "Column 2: Explore Navigation" },
              { id: "showSpecialtiesColumn", label: "Column 3: Clinical Specialties" },
              { id: "showContactColumn", label: "Column 4: Contact Details & Hours" },
              { id: "showSocialIcons", label: "Component: Social Media Icons" },
              { id: "showTrustStatement", label: "Component: Ethical Healthcare Statement" },
              { id: "showBusinessHours", label: "Component: Business & OPD Hours" },
              { id: "showContactButtons", label: "Component: Contact Action Buttons" },
              { id: "showCopyrightBar", label: "Section: Copyright Bottom Bar" },
            ].map((item) => {
              const key = item.id as keyof typeof visibility;
              const isChecked = visibility[key] !== false;
              return (
                <label
                  key={item.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl border border-[#DCE8F0] bg-[#F8FDFF] cursor-pointer hover:bg-[#EFFBFC] transition"
                >
                  <span className="text-xs font-bold text-[#071B68]">{item.label}</span>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => updateVisibility({ [key]: e.target.checked })}
                    className="h-4 w-4 accent-[#087FBA]"
                  />
                </label>
              );
            })}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 pt-3 border-t border-[#DCE8F0]">
            <div>
              <label className="text-xs font-bold text-[#071B68]">Mobile Column Stacking Order</label>
              <select
                value={responsive.mobileStackOrder || "brand-first"}
                onChange={(e) => updateResponsive({ mobileStackOrder: e.target.value as any })}
                className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs font-bold text-[#071B68]"
              >
                <option value="brand-first">Brand First (Standard)</option>
                <option value="contact-first">Contact & Hours First (Mobile Priority)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-[#071B68]">Mobile Text Alignment</label>
              <select
                value={responsive.mobileAlignment || "left"}
                onChange={(e) => updateResponsive({ mobileAlignment: e.target.value as any })}
                className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs font-bold text-[#071B68]"
              >
                <option value="left">Left Aligned (Cleanest on phone)</option>
                <option value="center">Centered Alignment</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB L: LIVE PREVIEW STUDIO
      ========================================================================= */}
      {activeTab === "preview" && (
        <div className="space-y-4">
          {/* Viewport Control Bar */}
          <div className="card p-4 border border-[#DCE8F0] bg-white rounded-3xl shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#10C6C1] animate-ping" />
              <span className="text-xs font-bold text-[#071B68]">
                Real-Time Footer Preview (Draft State)
              </span>
            </div>

            <div className="flex items-center gap-1 rounded-full bg-slate-100 p-1 border border-slate-200">
              <button
                type="button"
                onClick={() => setPreviewViewport("desktop")}
                className={`cursor-pointer inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold transition ${
                  previewViewport === "desktop"
                    ? "bg-white text-[#071B68] shadow-2xs"
                    : "text-slate-600 hover:text-[#071B68]"
                }`}
              >
                <Monitor size={12} />
                <span>1200px</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewViewport("tablet")}
                className={`cursor-pointer inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold transition ${
                  previewViewport === "tablet"
                    ? "bg-white text-[#071B68] shadow-2xs"
                    : "text-slate-600 hover:text-[#071B68]"
                }`}
              >
                <Tablet size={12} />
                <span>768px</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewViewport("mobile")}
                className={`cursor-pointer inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold transition ${
                  previewViewport === "mobile"
                    ? "bg-white text-[#071B68] shadow-2xs"
                    : "text-slate-600 hover:text-[#071B68]"
                }`}
              >
                <Smartphone size={12} />
                <span>375px</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewViewport("mobile-sm")}
                className={`cursor-pointer inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold transition ${
                  previewViewport === "mobile-sm"
                    ? "bg-white text-[#071B68] shadow-2xs"
                    : "text-slate-600 hover:text-[#071B68]"
                }`}
              >
                <Smartphone size={12} />
                <span>320px</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewViewport("full")}
                className={`cursor-pointer inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold transition ${
                  previewViewport === "full"
                    ? "bg-white text-[#071B68] shadow-2xs"
                    : "text-slate-600 hover:text-[#071B68]"
                }`}
              >
                <Maximize2 size={12} />
                <span>Full</span>
              </button>
            </div>
          </div>

          {/* Embedded Live Simulation Frame */}
          <div className="flex justify-center bg-slate-100 p-4 sm:p-6 rounded-3xl border border-[#DCE8F0] overflow-x-auto">
            <div
              className={`transition-all duration-300 rounded-3xl overflow-hidden shadow-2xl border border-slate-300 ${
                previewViewport === "desktop"
                  ? "w-[1200px]"
                  : previewViewport === "tablet"
                  ? "w-[768px]"
                  : previewViewport === "mobile"
                  ? "w-[375px]"
                  : previewViewport === "mobile-sm"
                  ? "w-[320px]"
                  : "w-full"
              }`}
            >
              {/* Device Window Chrome Header */}
              <div className="bg-slate-800 text-slate-300 px-4 py-2 flex items-center justify-between text-[11px] font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                  <span className="ml-2 font-semibold">DRK Hospitals • Public Footer</span>
                </div>
                <span>
                  {previewViewport === "desktop"
                    ? "1200 × 720"
                    : previewViewport === "tablet"
                    ? "768 × 1024"
                    : previewViewport === "mobile"
                    ? "375 × 812"
                    : previewViewport === "mobile-sm"
                    ? "320 × 568"
                    : "Full Width"}
                </span>
              </div>

              {/* Simulated Public Footer */}
              <div
                style={
                  appearance.isGradient
                    ? {
                        backgroundImage: `linear-gradient(135deg, ${
                          appearance.gradientStart || "#071B68"
                        }, ${appearance.gradientEnd || "#05144f"})`,
                      }
                    : { backgroundColor: appearance.bgColor || "#071B68" }
                }
                className="text-white select-none"
              >
                <div className={`p-6 sm:p-10 ${appearance.topPadding || "py-14"}`}>
                  <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-12">
                    {/* Brand Column */}
                    {visibility.showBrandColumn !== false && (
                      <div className="lg:col-span-4 space-y-4">
                        {brand.logoVisible !== false && (
                          <div
                            className="inline-block rounded-2xl p-3 shadow-md"
                            style={{ backgroundColor: brand.logoBgColor || "#FFFFFF" }}
                          >
                            <div
                              className="relative"
                              style={{
                                width: `${brand.logoWidth || 208}px`,
                                height: `${brand.logoHeight || 52}px`,
                              }}
                            >
                              <SafeImage
                                src={brand.logoUrl || "/images/drk-logo.png"}
                                alt={brand.logoAlt || "DRK Hospital Logo"}
                                fill
                                className="object-contain"
                                sizes="208px"
                                fallbackSrc="/images/drk-logo.png"
                              />
                            </div>
                          </div>
                        )}

                        {brand.taglineVisible !== false && (
                          <p
                            className="text-xs font-semibold tracking-wider uppercase"
                            style={{ color: brand.taglineColor || "#10C6C1" }}
                          >
                            {brand.tagline || "ROOTED IN CARE"}
                          </p>
                        )}

                        {desc.visible !== false && (
                          <p
                            className="text-xs leading-relaxed max-w-sm"
                            style={{ color: desc.textColor || appearance.bodyTextColor || "#EAF8FF" }}
                          >
                            {desc.mainText ||
                              "DRK Hospital is committed to delivering modern, compassionate, and ethical clinical care in Tiruttani."}
                          </p>
                        )}

                        {visibility.showSocialIcons !== false &&
                          social.visible !== false &&
                          social.links.filter((l) => l.isActive).length > 0 && (
                            <div className="pt-1">
                              <p
                                className="text-[11px] font-semibold uppercase tracking-wider mb-2"
                                style={{ color: appearance.accentColor || "#10C6C1" }}
                              >
                                {social.heading || "Follow DRK Hospital"}
                              </p>
                              <div className="flex flex-wrap items-center gap-2">
                                {social.links
                                  .filter((l) => l.isActive)
                                  .map((s) => (
                                    <span
                                      key={s.id}
                                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white text-xs font-bold"
                                    >
                                      {s.platform[0]}
                                    </span>
                                  ))}
                              </div>
                            </div>
                          )}

                        {visibility.showTrustStatement !== false &&
                          trust.visible !== false &&
                          trust.statements.filter((st) => st.visible).map((st) => (
                            <div
                              key={st.id}
                              className="flex items-center gap-2 text-[11px] text-blue-200 pt-1"
                            >
                              <ShieldCheck
                                size={14}
                                style={{ color: st.iconColor || "#10C6C1" }}
                              />
                              <span style={{ color: st.textColor || "#EAF8FF" }}>{st.text}</span>
                            </div>
                          ))}
                      </div>
                    )}

                    {/* Explore Navigation */}
                    {visibility.showNavigationColumn !== false && nav.visible !== false && (
                      <div className="lg:col-span-2 space-y-3">
                        <h4 className="text-sm font-bold text-white tracking-wide">
                          {nav.heading || "Explore"}
                        </h4>
                        <ul className="space-y-2 text-xs text-blue-100">
                          {nav.links
                            .filter((l) => l.isActive)
                            .map((l) => (
                              <li key={l.id} className="hover:text-[#10C6C1]">
                                {l.label}
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}

                    {/* Specialties */}
                    {visibility.showSpecialtiesColumn !== false && specs.visible !== false && (
                      <div className="lg:col-span-3 space-y-3">
                        <h4 className="text-sm font-bold text-white tracking-wide">
                          {specs.heading || "Our Specialties"}
                        </h4>
                        <ul className="space-y-2 text-xs text-blue-100">
                          {specs.items
                            .filter((s) => s.isActive)
                            .map((s) => (
                              <li key={s.id} className="hover:text-[#10C6C1]">
                                <span className="font-semibold block">{s.title}</span>
                                <span className="text-[10px] text-blue-200 line-clamp-1">
                                  {s.description}
                                </span>
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}

                    {/* Contact & Hours */}
                    {visibility.showContactColumn !== false && contact.visible !== false && (
                      <div className="lg:col-span-3 space-y-3">
                        <h4 className="text-sm font-bold text-white tracking-wide">
                          {contact.heading || "Contact & Hours"}
                        </h4>
                        <div className="space-y-2 text-xs text-blue-100">
                          <div className="flex items-start gap-2">
                            <MapPin size={14} className="text-[#10C6C1] shrink-0 mt-0.5" />
                            <span>
                              {contact.useHospitalInfo
                                ? HOSPITAL_INFO.address
                                : [contact.street, contact.city, contact.state].filter(Boolean).join(", ") || HOSPITAL_INFO.address}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone size={14} className="text-[#10C6C1] shrink-0" />
                            <span>{contact.primaryPhone || HOSPITAL_INFO.phone.primary}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail size={14} className="text-[#10C6C1] shrink-0" />
                            <span>{contact.officialEmail || HOSPITAL_INFO.email.enquiry}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <Clock3 size={14} className="text-[#10C6C1] shrink-0 mt-0.5" />
                            <div className="text-[11px] space-y-0.5">
                              <p>Mon – Sat: 8:00 AM – 8:00 PM</p>
                              <p>Sunday: 9:00 AM – 1:00 PM</p>
                            </div>
                          </div>
                        </div>

                        {contact.whatsappVisible && (
                          <div className="pt-1">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#10C6C1] px-3.5 py-1.5 text-xs font-bold text-[#071B68]">
                              <MessageCircle size={13} />
                              <span>{contact.whatsappButtonText || "Chat on WhatsApp"}</span>
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Bar */}
                {visibility.showCopyrightBar !== false && copyright.visible !== false && (
                  <div
                    className="border-t border-white/15 px-6 py-4 text-xs text-blue-200 flex flex-col sm:flex-row items-center justify-between gap-2"
                    style={{ backgroundColor: appearance.bottomBarBgColor || "#05144f" }}
                  >
                    <p>
                      © {new Date().getFullYear()} {copyright.hospitalName || "DRK Hospital"}.{" "}
                      {copyright.tagline || "ROOTED IN CARE"}. All rights reserved.
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-blue-300">
                      <span>{copyright.locationLabel || "Tiruttani, Tamil Nadu"}</span>
                      {copyright.links
                        .filter((l) => l.visible)
                        .map((l) => (
                          <span key={l.id}>• {l.label}</span>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
