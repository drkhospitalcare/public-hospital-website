"use client";

import { useState } from "react";
import ImageUploader from "./ImageUploader";
import {
  AboutHeroContent,
  AboutFounderContent,
  AboutStoryContent,
  VisionMissionContent,
  AboutPhilosophyContent,
  AboutCoreValuesContent,
  AboutClinicalStandardsContent,
  AboutFacilitiesContent,
  PhilosophyPoint,
  CoreValueItem,
  ClinicalStandardItem,
  AboutFacilityItem,
} from "@/types/cms";
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  UserCheck,
  Quote,
  Monitor,
  Smartphone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import SafeImage from "@/components/SafeImage";

interface AboutEditorProps {
  hero: AboutHeroContent;
  setHero: React.Dispatch<React.SetStateAction<AboutHeroContent>>;
  founder: AboutFounderContent;
  setFounder: React.Dispatch<React.SetStateAction<AboutFounderContent>>;
  story: AboutStoryContent;
  setStory: React.Dispatch<React.SetStateAction<AboutStoryContent>>;
  visionMission: VisionMissionContent;
  setVisionMission: React.Dispatch<React.SetStateAction<VisionMissionContent>>;
  philosophy: AboutPhilosophyContent;
  setPhilosophy: React.Dispatch<React.SetStateAction<AboutPhilosophyContent>>;
  coreValues: AboutCoreValuesContent;
  setCoreValues: React.Dispatch<React.SetStateAction<AboutCoreValuesContent>>;
  standards: AboutClinicalStandardsContent;
  setStandards: React.Dispatch<React.SetStateAction<AboutClinicalStandardsContent>>;
  facilities: AboutFacilitiesContent;
  setFacilities: React.Dispatch<React.SetStateAction<AboutFacilitiesContent>>;
  onOpenMediaLibrary: (category?: any) => void;
}

export default function AboutEditor({
  hero,
  setHero,
  founder,
  setFounder,
  story,
  setStory,
  visionMission,
  setVisionMission,
  philosophy,
  setPhilosophy,
  coreValues,
  setCoreValues,
  standards,
  setStandards,
  facilities,
  setFacilities,
  onOpenMediaLibrary,
}: AboutEditorProps) {
  const [activeTab, setActiveTab] = useState<
    "hero" | "founder" | "story" | "vision" | "philosophy" | "values" | "standards" | "facilities"
  >("hero");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");

  return (
    <div className="space-y-6">
      {/* Sub-tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#DCE8F0] pb-3">
        {[
          { id: "hero", label: "A. About Hero" },
          { id: "founder", label: "B. Founder Profile Management" },
          { id: "story", label: "C. Our Story" },
          { id: "vision", label: "D. Vision & Mission" },
          { id: "philosophy", label: "E. Philosophy" },
          { id: "values", label: "F. Core Values" },
          { id: "standards", label: "G. Clinical Standards" },
          { id: "facilities", label: "H. Infrastructure" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`cursor-pointer rounded-full px-4 py-2 text-xs font-bold transition ${
              activeTab === tab.id
                ? "bg-[#071B68] text-white shadow-xs"
                : "bg-white text-[#5D6B85] hover:bg-[#EFFBFC] hover:text-[#071B68] border border-[#DCE8F0]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* A. ABOUT HERO */}
      {activeTab === "hero" && (
        <div className="card p-6 border border-[#DCE8F0] bg-white space-y-5">
          <h3 className="text-lg font-bold text-[#071B68]">About Page Hero Banner</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-bold text-[#071B68]">Eyebrow</label>
              <input
                type="text"
                value={hero.eyebrow}
                onChange={(e) => setHero({ ...hero, eyebrow: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs text-[#071B68]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#071B68]">Subtitle</label>
              <input
                type="text"
                value={hero.subtitle}
                onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs text-[#071B68]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#071B68]">Main Heading</label>
            <input
              type="text"
              value={hero.heading}
              onChange={(e) => setHero({ ...hero, heading: e.target.value })}
              className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-sm font-bold text-[#071B68]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#071B68]">Description</label>
            <textarea
              rows={3}
              value={hero.description}
              onChange={(e) => setHero({ ...hero, description: e.target.value })}
              className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white p-3 text-xs text-[#071B68]"
            />
          </div>

          <ImageUploader
            label="Hero Image"
            imageSrc={hero.image}
            imageAlt={hero.imageAlt}
            category="About Hospital"
            presetKey="about-hero"
            onImageChange={(url) => setHero({ ...hero, image: url })}
            onAltChange={(alt) => setHero({ ...hero, imageAlt: alt })}
            onOpenMediaLibrary={() => onOpenMediaLibrary("About Hospital")}
          />
        </div>
      )}

      {/* B. FOUNDER PROFILE MANAGEMENT */}
      {activeTab === "founder" && (
        <div className="space-y-6">
          <div className="card p-6 border border-[#DCE8F0] bg-white space-y-6">
            {/* Module Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DCE8F0]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#10C6C1]" />
                  <h3 className="text-lg font-bold text-[#071B68]">Founder Profile Management</h3>
                </div>
                <p className="text-xs text-[#5D6B85] mt-1">
                  Manage the prominent hospital founder section displayed on the About page.
                </p>
              </div>

              {/* Enable / Disable Section Switch */}
              <button
                type="button"
                onClick={() => setFounder({ ...founder, enabled: !founder.enabled })}
                className={`cursor-pointer inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold border transition ${
                  founder.enabled
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                    : "border-slate-200 bg-slate-100 text-slate-600"
                }`}
              >
                {founder.enabled ? <Eye size={13} /> : <EyeOff size={13} />}
                <span>{founder.enabled ? "Section Enabled" : "Section Disabled"}</span>
              </button>
            </div>

            {/* Display Order / Placement Notice */}
            <div className="rounded-2xl border border-blue-200 bg-[#EFFBFC] p-4 text-xs text-[#071B68] flex items-start gap-3">
              <span className="font-extrabold text-[#087FBA] shrink-0 mt-0.5">Placement:</span>
              <div className="space-y-1">
                <p className="font-semibold">
                  Displayed at the very top of the public About page, immediately below the Hero Banner and above &ldquo;How We Began&rdquo;.
                </p>
                <p className="text-[#5D6B85] text-[11px]">
                  When enabled, public visitors immediately see Dr. R. Ranjith Kumar&apos;s leadership introduction upon landing on the About page.
                </p>
              </div>
            </div>

            {/* Section Headings */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="text-xs font-bold text-[#071B68]">Section Eyebrow</label>
                <input
                  type="text"
                  value={founder.sectionEyebrow}
                  onChange={(e) => setFounder({ ...founder, sectionEyebrow: e.target.value })}
                  placeholder="Leadership & Vision"
                  className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs text-[#071B68]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#071B68]">Section Heading</label>
                <input
                  type="text"
                  value={founder.sectionHeading}
                  onChange={(e) => setFounder({ ...founder, sectionHeading: e.target.value })}
                  placeholder="Our Founder"
                  className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs font-bold text-[#071B68]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#071B68]">
                  Optional Subheading
                </label>
                <input
                  type="text"
                  value={founder.sectionSubheading || ""}
                  onChange={(e) => setFounder({ ...founder, sectionSubheading: e.target.value })}
                  placeholder="Rooted in Care"
                  className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs text-[#071B68]"
                />
              </div>
            </div>

            {/* Founder Personal & Professional Information */}
            <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-[#DCE8F0]">
              <div>
                <label className="text-xs font-bold text-[#071B68]">Founder Name *</label>
                <input
                  type="text"
                  value={founder.founderName}
                  onChange={(e) => setFounder({ ...founder, founderName: e.target.value })}
                  placeholder="Dr. R. Ranjith Kumar"
                  className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs font-bold text-[#071B68]"
                />
                <span className="text-[10px] text-[#5D6B85] mt-0.5 block">
                  Official name displayed prominently on the About page.
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-[#071B68]">Founder Designation *</label>
                <input
                  type="text"
                  value={founder.founderDesignation}
                  onChange={(e) => setFounder({ ...founder, founderDesignation: e.target.value })}
                  placeholder="Founder"
                  className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs font-bold text-[#071B68]"
                />
                <span className="text-[10px] text-[#5D6B85] mt-0.5 block">
                  Designation badge (e.g. Founder • DRK Hospitals & RRK Hospitals).
                </span>
              </div>
            </div>

            {/* Founder Statement */}
            <div className="space-y-1 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#071B68]">
                  Founder Statement / Quote *
                </label>
                <span className="text-[10px] text-[#087FBA] font-semibold">
                  Primary vision quote
                </span>
              </div>
              <textarea
                rows={3}
                value={founder.founderStatement}
                onChange={(e) => setFounder({ ...founder, founderStatement: e.target.value })}
                placeholder="Dr. R. Ranjith Kumar is the Founder of DRK Hospitals and RRK Hospitals, driven by a commitment to patient-centred and ethical healthcare."
                className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white p-3 text-xs text-[#071B68] leading-relaxed"
              />
              <span className="text-[10px] text-[#5D6B85] block">
                Highlighted as a dedicated quotation statement block on the public About page.
              </span>
            </div>

            {/* Additional Bio (Optional) */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#071B68]">
                Additional Bio / Leadership Message (Optional)
              </label>
              <textarea
                rows={2}
                value={founder.additionalBio || ""}
                onChange={(e) => setFounder({ ...founder, additionalBio: e.target.value })}
                placeholder="Optional secondary paragraph detailing background, clinical ethics, or regional healthcare focus."
                className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white p-3 text-xs text-[#071B68]"
              />
            </div>

            {/* Photograph Upload, Replace, Remove & Smart Cropping */}
            <div className="pt-2 border-t border-[#DCE8F0]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#071B68] mb-3">
                Founder Photograph & Positioning
              </h4>

              <ImageUploader
                label="Founder Portrait Photograph"
                imageSrc={founder.photoUrl}
                imageAlt={founder.photoAlt}
                category="About Hospital"
                presetKey="founder-portrait"
                onImageChange={(url) => setFounder({ ...founder, photoUrl: url })}
                onAltChange={(alt) => setFounder({ ...founder, photoAlt: alt })}
                onOpenMediaLibrary={() => onOpenMediaLibrary("About Hospital")}
                hint="Upload an executive portrait of Dr. R. Ranjith Kumar. Use the Crop & Position button to frame the image in 3:4 portrait ratio."
              />
            </div>

            {/* Layout & Visibility Configuration */}
            <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-[#DCE8F0]">
              <div className="rounded-2xl border border-[#DCE8F0] p-4 bg-[#F8FDFF] space-y-2">
                <label className="text-xs font-bold text-[#071B68] block">
                  Photo Column Alignment
                </label>
                <select
                  value={founder.photoAlignment || "left"}
                  onChange={(e) =>
                    setFounder({
                      ...founder,
                      photoAlignment: e.target.value as "left" | "right",
                    })
                  }
                  className="w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs font-bold text-[#071B68]"
                >
                  <option value="left">Left (Photo Left, Text Right — Default)</option>
                  <option value="right">Right (Text Left, Photo Right)</option>
                </select>
                <p className="text-[11px] text-[#5D6B85]">
                  Controls whether the portrait appears on the left or right side on desktop screens.
                </p>
              </div>

              <div className="rounded-2xl border border-[#DCE8F0] p-4 bg-[#F8FDFF] flex items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-[#071B68] block">
                    Placeholder Behavior (If No Photo Uploaded)
                  </span>
                  <p className="text-[11px] text-[#5D6B85] mt-0.5">
                    {founder.hidePhotoIfEmpty
                      ? "Hide the photo column completely if no portrait is uploaded."
                      : "Show a clean, professional executive placeholder if no portrait is uploaded."}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={founder.hidePhotoIfEmpty}
                  onChange={(e) =>
                    setFounder({ ...founder, hidePhotoIfEmpty: e.target.checked })
                  }
                  className="h-5 w-5 accent-[#087FBA] cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Live Preview Studio Card */}
          <div className="card p-6 border border-[#DCE8F0] bg-white space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#DCE8F0]">
              <div>
                <h4 className="text-sm font-bold text-[#071B68]">
                  Live Preview: Founder Profile Section
                </h4>
                <p className="text-xs text-[#5D6B85]">
                  Real-time preview of public rendering reflecting unsaved draft values.
                </p>
              </div>

              {/* Viewport switch */}
              <div className="inline-flex items-center gap-1 rounded-full border border-[#DCE8F0] bg-[#F8FDFF] p-1">
                <button
                  type="button"
                  onClick={() => setPreviewDevice("desktop")}
                  className={`cursor-pointer inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold transition ${
                    previewDevice === "desktop"
                      ? "bg-[#071B68] text-white"
                      : "text-[#5D6B85] hover:text-[#071B68]"
                  }`}
                >
                  <Monitor size={12} />
                  <span>Desktop</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice("mobile")}
                  className={`cursor-pointer inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold transition ${
                    previewDevice === "mobile"
                      ? "bg-[#071B68] text-white"
                      : "text-[#5D6B85] hover:text-[#071B68]"
                  }`}
                >
                  <Smartphone size={12} />
                  <span>Mobile</span>
                </button>
              </div>
            </div>

            {/* Simulated Public Container */}
            <div className="overflow-hidden rounded-2xl border border-[#DCE8F0] bg-slate-50 p-4 sm:p-6 flex justify-center">
              <div
                className={`w-full transition-all duration-300 ${
                  previewDevice === "mobile" ? "max-w-sm" : "max-w-4xl"
                } bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-[#DCE8F0]`}
              >
                {!founder.enabled ? (
                  <div className="p-8 text-center text-slate-400 italic text-xs">
                    (Founder Profile section is currently disabled and will be hidden from public view.)
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Eyebrow and Heading */}
                    <div className="text-center">
                      <div className="inline-block bg-[#EFFBFC] text-[#087FBA] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2 border border-[#DCE8F0]">
                        {founder.sectionEyebrow || "Leadership & Vision"}
                      </div>
                      <h3 className="text-xl sm:text-2xl font-extrabold text-[#071B68]">
                        {founder.sectionHeading || "Hospital Leadership"}
                      </h3>
                      {founder.sectionSubheading && (
                        <p className="text-xs text-[#5D6B85] mt-0.5">
                          {founder.sectionSubheading}
                        </p>
                      )}
                    </div>

                    {/* Preview Content Grid */}
                    <div
                      className={`grid gap-6 items-center ${
                        previewDevice === "desktop" &&
                        (founder.photoUrl || !founder.hidePhotoIfEmpty)
                          ? "grid-cols-12"
                          : "grid-cols-1"
                      }`}
                    >
                      {/* Photo preview */}
                      {(founder.photoUrl || !founder.hidePhotoIfEmpty) && (
                        <div
                          className={`${
                            previewDevice === "desktop"
                              ? `col-span-5 ${
                                  founder.photoAlignment === "right"
                                    ? "order-2"
                                    : "order-1"
                                }`
                              : "order-1"
                          }`}
                        >
                          <div className="aspect-[3/4] w-full rounded-2xl overflow-hidden relative border-2 border-slate-100 shadow-md bg-slate-100">
                            {founder.photoUrl ? (
                              <SafeImage
                                src={founder.photoUrl}
                                alt={founder.photoAlt || founder.founderName}
                                fill
                                className="object-cover"
                                fallbackSrc="/images/hero-clinic.jpg"
                              />
                            ) : (
                              <div className="flex h-full w-full flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-[#EFFBFC] to-[#EAF8FF]">
                                <UserCheck size={32} className="text-[#087FBA]" />
                                <span className="text-xs font-bold text-[#071B68] mt-2">
                                  {founder.founderName}
                                </span>
                                <span className="text-[10px] text-[#5D6B85]">
                                  {founder.founderDesignation}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Text preview */}
                      <div
                        className={`${
                          previewDevice === "desktop" &&
                          (founder.photoUrl || !founder.hidePhotoIfEmpty)
                            ? `col-span-7 ${
                                founder.photoAlignment === "right"
                                  ? "order-1"
                                  : "order-2"
                              }`
                            : "order-2"
                        } space-y-3`}
                      >
                        <div className="inline-block rounded-full bg-[#071B68] text-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                          {founder.founderDesignation || "Founder"}
                        </div>
                        <h4 className="text-xl font-extrabold text-[#071B68]">
                          {founder.founderName}
                        </h4>
                        <div className="rounded-xl border border-[#DCE8F0] bg-[#F8FDFF] p-3 text-xs italic text-[#14234B] leading-relaxed">
                          &ldquo;{founder.founderStatement}&rdquo;
                        </div>
                        {founder.additionalBio && (
                          <p className="text-xs text-[#5D6B85] leading-relaxed">
                            {founder.additionalBio}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* C. OUR STORY */}
      {activeTab === "story" && (
        <div className="card p-6 border border-[#DCE8F0] bg-white space-y-5">
          <h3 className="text-lg font-bold text-[#071B68]">Our Healthcare Story</h3>

          <div>
            <label className="text-xs font-bold text-[#071B68]">Section Title</label>
            <input
              type="text"
              value={story.sectionTitle}
              onChange={(e) => setStory({ ...story, sectionTitle: e.target.value })}
              className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs font-bold text-[#071B68]"
            />
          </div>

          {story.paragraphs.map((p, idx) => (
            <div key={idx}>
              <label className="text-xs font-bold text-[#071B68]">Paragraph {idx + 1}</label>
              <textarea
                rows={2}
                value={p}
                onChange={(e) => {
                  const arr = [...story.paragraphs];
                  arr[idx] = e.target.value;
                  setStory({ ...story, paragraphs: arr });
                }}
                className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white p-2 text-xs text-[#071B68]"
              />
            </div>
          ))}

          <ImageUploader
            label="Story Hospital Image"
            imageSrc={story.image}
            imageAlt={story.imageAlt}
            category="About Hospital"
            presetKey="facility-image"
            onImageChange={(url) => setStory({ ...story, image: url })}
            onAltChange={(alt) => setStory({ ...story, imageAlt: alt })}
            onOpenMediaLibrary={() => onOpenMediaLibrary("About Hospital")}
          />
        </div>
      )}

      {/* C. VISION & MISSION */}
      {activeTab === "vision" && (
        <div className="card p-6 border border-[#DCE8F0] bg-white space-y-5">
          <h3 className="text-lg font-bold text-[#071B68]">Vision and Mission</h3>

          <div className="rounded-2xl border border-[#DCE8F0] bg-[#F8FDFF] p-4 space-y-3">
            <label className="text-xs font-bold text-[#071B68]">Vision Heading</label>
            <input
              type="text"
              value={visionMission.visionHeading}
              onChange={(e) => setVisionMission({ ...visionMission, visionHeading: e.target.value })}
              className="w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs font-bold text-[#071B68]"
            />
            <label className="text-xs font-bold text-[#071B68]">Vision Statement</label>
            <textarea
              rows={3}
              value={visionMission.visionText}
              onChange={(e) => setVisionMission({ ...visionMission, visionText: e.target.value })}
              className="w-full rounded-xl border border-[#DCE8F0] bg-white p-2 text-xs text-[#071B68]"
            />
          </div>

          <div className="rounded-2xl border border-[#DCE8F0] bg-[#F8FDFF] p-4 space-y-3">
            <label className="text-xs font-bold text-[#071B68]">Mission Heading</label>
            <input
              type="text"
              value={visionMission.missionHeading}
              onChange={(e) => setVisionMission({ ...visionMission, missionHeading: e.target.value })}
              className="w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs font-bold text-[#071B68]"
            />
            <label className="text-xs font-bold text-[#071B68]">Mission Statement</label>
            <textarea
              rows={3}
              value={visionMission.missionText}
              onChange={(e) => setVisionMission({ ...visionMission, missionText: e.target.value })}
              className="w-full rounded-xl border border-[#DCE8F0] bg-white p-2 text-xs text-[#071B68]"
            />
          </div>
        </div>
      )}

      {/* D. PHILOSOPHY */}
      {activeTab === "philosophy" && (
        <div className="card p-6 border border-[#DCE8F0] bg-white space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#071B68]">Healthcare Philosophy</h3>
            <button
              type="button"
              onClick={() => {
                const newPoint: PhilosophyPoint = {
                  id: `ph-${Date.now()}`,
                  title: "New Philosophy Point",
                  desc: "Clinical philosophy description.",
                  icon: "Search",
                };
                setPhilosophy({ ...philosophy, points: [...philosophy.points, newPoint] });
              }}
              className="cursor-pointer inline-flex items-center gap-1.5 rounded-full bg-[#071B68] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#087FBA]"
            >
              <Plus size={14} />
              <span>Add Point</span>
            </button>
          </div>

          <div className="grid gap-3">
            {philosophy.points.map((pt, idx) => (
              <div key={pt.id} className="p-4 rounded-xl border border-[#DCE8F0] bg-[#F8FDFF] space-y-2">
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={pt.title}
                    onChange={(e) => {
                      const list = [...philosophy.points];
                      list[idx].title = e.target.value;
                      setPhilosophy({ ...philosophy, points: list });
                    }}
                    className="font-bold text-xs text-[#071B68] rounded border border-[#DCE8F0] px-2 py-1 w-full max-w-sm bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPhilosophy({
                        ...philosophy,
                        points: philosophy.points.filter((p) => p.id !== pt.id),
                      });
                    }}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={pt.desc}
                  onChange={(e) => {
                    const list = [...philosophy.points];
                    list[idx].desc = e.target.value;
                    setPhilosophy({ ...philosophy, points: list });
                  }}
                  className="w-full text-xs text-[#5D6B85] rounded border border-[#DCE8F0] p-2 bg-white"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* E. CORE VALUES */}
      {activeTab === "values" && (
        <div className="card p-6 border border-[#DCE8F0] bg-white space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#071B68]">Core Values</h3>
            <button
              type="button"
              onClick={() => {
                const newVal: CoreValueItem = {
                  id: `val-${Date.now()}`,
                  title: "New Core Value",
                  desc: "Value description.",
                  icon: "CheckCircle2",
                };
                setCoreValues({ ...coreValues, values: [...coreValues.values, newVal] });
              }}
              className="cursor-pointer inline-flex items-center gap-1.5 rounded-full bg-[#071B68] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#087FBA]"
            >
              <Plus size={14} />
              <span>Add Value</span>
            </button>
          </div>

          <div className="grid gap-3">
            {coreValues.values.map((v, idx) => (
              <div key={v.id} className="p-4 rounded-xl border border-[#DCE8F0] bg-[#F8FDFF] space-y-2">
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={v.title}
                    onChange={(e) => {
                      const list = [...coreValues.values];
                      list[idx].title = e.target.value;
                      setCoreValues({ ...coreValues, values: list });
                    }}
                    className="font-bold text-xs text-[#071B68] rounded border border-[#DCE8F0] px-2 py-1 w-full max-w-sm bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setCoreValues({
                        ...coreValues,
                        values: coreValues.values.filter((item) => item.id !== v.id),
                      });
                    }}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={v.desc}
                  onChange={(e) => {
                    const list = [...coreValues.values];
                    list[idx].desc = e.target.value;
                    setCoreValues({ ...coreValues, values: list });
                  }}
                  className="w-full text-xs text-[#5D6B85] rounded border border-[#DCE8F0] p-2 bg-white"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* F. CLINICAL STANDARDS */}
      {activeTab === "standards" && (
        <div className="card p-6 border border-[#DCE8F0] bg-white space-y-5">
          <h3 className="text-lg font-bold text-[#071B68]">Clinical & Sterilization Standards</h3>

          <div>
            <label className="text-xs font-bold text-[#071B68]">Heading</label>
            <input
              type="text"
              value={standards.heading}
              onChange={(e) => setStandards({ ...standards, heading: e.target.value })}
              className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs font-bold text-[#071B68]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#071B68]">Description</label>
            <textarea
              rows={2}
              value={standards.description}
              onChange={(e) => setStandards({ ...standards, description: e.target.value })}
              className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white p-2 text-xs text-[#071B68]"
            />
          </div>

          <ImageUploader
            label="Clinical Standards Image"
            imageSrc={standards.image}
            imageAlt={standards.imageAlt}
            category="Clinical Standards"
            presetKey="facility-image"
            onImageChange={(url) => setStandards({ ...standards, image: url })}
            onAltChange={(alt) => setStandards({ ...standards, imageAlt: alt })}
            onOpenMediaLibrary={() => onOpenMediaLibrary("Clinical Standards")}
          />

          <div className="space-y-3 pt-2">
            <label className="text-xs font-bold text-[#071B68]">Standards List</label>
            {standards.standards.map((std, idx) => (
              <div key={std.id} className="p-3 rounded-xl border border-[#DCE8F0] bg-[#F8FDFF] space-y-1">
                <input
                  type="text"
                  value={std.title}
                  onChange={(e) => {
                    const list = [...standards.standards];
                    list[idx].title = e.target.value;
                    setStandards({ ...standards, standards: list });
                  }}
                  className="font-bold text-xs text-[#071B68] rounded border border-[#DCE8F0] px-2 py-1 w-full bg-white"
                />
                <textarea
                  rows={2}
                  value={std.desc}
                  onChange={(e) => {
                    const list = [...standards.standards];
                    list[idx].desc = e.target.value;
                    setStandards({ ...standards, standards: list });
                  }}
                  className="w-full text-xs text-[#5D6B85] rounded border border-[#DCE8F0] p-1.5 bg-white"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* G. INFRASTRUCTURE */}
      {activeTab === "facilities" && (
        <div className="card p-6 border border-[#DCE8F0] bg-white space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#071B68]">About Modern Infrastructure</h3>
            <button
              type="button"
              onClick={() => {
                const newItem: AboutFacilityItem = {
                  id: `af-${Date.now()}`,
                  title: "New Facility Space",
                  desc: "Clinical suite description.",
                  image: "/images/hero-clinic.jpg",
                  imageAlt: "DRK Hospital clinical suite",
                };
                setFacilities({ ...facilities, items: [...facilities.items, newItem] });
              }}
              className="cursor-pointer inline-flex items-center gap-1.5 rounded-full bg-[#071B68] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#087FBA]"
            >
              <Plus size={14} />
              <span>Add Facility Space</span>
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {facilities.items.map((item, idx) => (
              <div key={item.id} className="p-4 rounded-2xl border border-[#DCE8F0] bg-[#F8FDFF] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#071B68]">Space #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setFacilities({
                        ...facilities,
                        items: facilities.items.filter((f) => f.id !== item.id),
                      });
                    }}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => {
                    const list = [...facilities.items];
                    list[idx].title = e.target.value;
                    setFacilities({ ...facilities, items: list });
                  }}
                  className="w-full text-xs font-bold rounded-lg border border-[#DCE8F0] p-2 bg-white"
                />

                <textarea
                  rows={2}
                  value={item.desc}
                  onChange={(e) => {
                    const list = [...facilities.items];
                    list[idx].desc = e.target.value;
                    setFacilities({ ...facilities, items: list });
                  }}
                  className="w-full text-xs rounded-lg border border-[#DCE8F0] p-2 bg-white text-[#5D6B85]"
                />

                <ImageUploader
                  label="Space Photo"
                  imageSrc={item.image}
                  imageAlt={item.imageAlt}
                  category="Infrastructure"
                  presetKey="facility-image"
                  onImageChange={(url) => {
                    const list = [...facilities.items];
                    list[idx].image = url;
                    setFacilities({ ...facilities, items: list });
                  }}
                  onAltChange={(alt) => {
                    const list = [...facilities.items];
                    list[idx].imageAlt = alt;
                    setFacilities({ ...facilities, items: list });
                  }}
                  onOpenMediaLibrary={() => onOpenMediaLibrary("Infrastructure")}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

