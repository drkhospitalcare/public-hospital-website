"use client";

import { useState } from "react";
import ImageUploader from "./ImageUploader";
import {
  HomepageHeroContent,
  HomepageSpecialtiesContent,
  HomepageAboutContent,
  HomepageWhyDRKContent,
  HomepageFacilitiesContent,
  HomepageJourneyContent,
  HomepageCTAContent,
  WhyDRKAdvantage,
  FacilityPreviewItem,
  CareJourneyStep,
} from "@/types/cms";
import { Plus, Trash2, ArrowUp, ArrowDown, Sparkles, Smile, Scissors } from "lucide-react";

interface HomepageEditorProps {
  hero: HomepageHeroContent;
  setHero: React.Dispatch<React.SetStateAction<HomepageHeroContent>>;
  specialties: HomepageSpecialtiesContent;
  setSpecialties: React.Dispatch<React.SetStateAction<HomepageSpecialtiesContent>>;
  about: HomepageAboutContent;
  setAbout: React.Dispatch<React.SetStateAction<HomepageAboutContent>>;
  whyDrk: HomepageWhyDRKContent;
  setWhyDrk: React.Dispatch<React.SetStateAction<HomepageWhyDRKContent>>;
  facilities: HomepageFacilitiesContent;
  setFacilities: React.Dispatch<React.SetStateAction<HomepageFacilitiesContent>>;
  journey: HomepageJourneyContent;
  setJourney: React.Dispatch<React.SetStateAction<HomepageJourneyContent>>;
  cta: HomepageCTAContent;
  setCta: React.Dispatch<React.SetStateAction<HomepageCTAContent>>;
  onOpenMediaLibrary: (category?: any) => void;
}

export default function HomepageEditor({
  hero,
  setHero,
  specialties,
  setSpecialties,
  about,
  setAbout,
  whyDrk,
  setWhyDrk,
  facilities,
  setFacilities,
  journey,
  setJourney,
  cta,
  setCta,
  onOpenMediaLibrary,
}: HomepageEditorProps) {
  const [activeTab, setActiveTab] = useState<
    "hero" | "specialties" | "about" | "why" | "facilities" | "journey" | "cta"
  >("hero");

  // Handlers for Why DRK Advantages
  const handleAddAdvantage = () => {
    const newItem: WhyDRKAdvantage = {
      id: `why-${Date.now()}`,
      title: "New Hospital Advantage",
      desc: "Describe the clinical or patient care advantage here.",
      icon: "ShieldCheck",
    };
    setWhyDrk((prev) => ({
      ...prev,
      advantages: [...prev.advantages, newItem],
    }));
  };

  const handleRemoveAdvantage = (id: string) => {
    setWhyDrk((prev) => ({
      ...prev,
      advantages: prev.advantages.filter((a) => a.id !== id),
    }));
  };

  const handleMoveAdvantage = (index: number, direction: "up" | "down") => {
    const list = [...whyDrk.advantages];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;
    setWhyDrk((prev) => ({ ...prev, advantages: list }));
  };

  // Handlers for Facility Preview Cards
  const handleAddFacility = () => {
    const newItem: FacilityPreviewItem = {
      id: `fac-${Date.now()}`,
      title: "New Clinical Suite",
      category: "Hospital Infrastructure",
      desc: "Description of modern clinical suite and equipment.",
      image: "/images/hero-clinic.jpg",
      imageAlt: "Clinical space at DRK Hospital",
    };
    setFacilities((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  };

  const handleRemoveFacility = (id: string) => {
    setFacilities((prev) => ({
      ...prev,
      items: prev.items.filter((f) => f.id !== id),
    }));
  };

  // Handlers for Care Journey Steps
  const handleAddStep = () => {
    const nextNum = (journey.steps.length + 1).toString().padStart(2, "0");
    const newItem: CareJourneyStep = {
      id: `step-${Date.now()}`,
      stepNumber: nextNum,
      title: "New Care Milestone",
      desc: "Step description explaining the clinical consultation or treatment phase.",
      icon: "CheckCircle2",
    };
    setJourney((prev) => ({
      ...prev,
      steps: [...prev.steps, newItem],
    }));
  };

  const handleRemoveStep = (id: string) => {
    setJourney((prev) => ({
      ...prev,
      steps: prev.steps.filter((s) => s.id !== id),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Sub-navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#DCE8F0] pb-3">
        {[
          { id: "hero", label: "1. Main Hero" },
          { id: "specialties", label: "2. Three Specialties" },
          { id: "about", label: "3. About DRK Preview" },
          { id: "why", label: "4. Why DRK" },
          { id: "facilities", label: "5. Inside DRK" },
          { id: "journey", label: "6. Patient Journey" },
          { id: "cta", label: "7. Homepage CTA" },
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

      {/* SECTION 1: MAIN HERO */}
      {activeTab === "hero" && (
        <div className="card p-6 border border-[#DCE8F0] bg-white space-y-5">
          <div>
            <h3 className="text-lg font-bold text-[#071B68]">Homepage Main Hero Section</h3>
            <p className="text-xs text-[#5D6B85]">
              Configure the top headline, introduction, action buttons, badges, and primary clinic image.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-bold text-[#071B68]">Top Eyebrow Badge</label>
              <input
                type="text"
                value={hero.eyebrow}
                onChange={(e) => setHero({ ...hero, eyebrow: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs text-[#071B68] focus:border-[#087FBA] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#071B68]">Timing Badge (Top Right)</label>
              <input
                type="text"
                value={hero.timingBadge}
                onChange={(e) => setHero({ ...hero, timingBadge: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs text-[#071B68] focus:border-[#087FBA] focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#071B68]">Main Headline</label>
            <input
              type="text"
              value={hero.heading}
              onChange={(e) => setHero({ ...hero, heading: e.target.value })}
              className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-sm font-semibold text-[#071B68] focus:border-[#087FBA] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#071B68]">Headline Highlight Words (Blue Accent)</label>
            <input
              type="text"
              value={hero.headingHighlight}
              onChange={(e) => setHero({ ...hero, headingHighlight: e.target.value })}
              className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs text-[#087FBA] focus:border-[#087FBA] focus:outline-hidden"
              placeholder="e.g. Smile, Skin"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#071B68]">Supporting Description</label>
            <textarea
              rows={3}
              value={hero.description}
              onChange={(e) => setHero({ ...hero, description: e.target.value })}
              className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white p-3 text-xs text-[#071B68] focus:border-[#087FBA] focus:outline-hidden"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-bold text-[#071B68]">Primary Button Text</label>
              <input
                type="text"
                value={hero.primaryBtnText}
                onChange={(e) => setHero({ ...hero, primaryBtnText: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs text-[#071B68]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#071B68]">Primary Button Destination</label>
              <input
                type="text"
                value={hero.primaryBtnHref}
                onChange={(e) => setHero({ ...hero, primaryBtnHref: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs text-[#071B68]"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-bold text-[#071B68]">Secondary Button Text</label>
              <input
                type="text"
                value={hero.secondaryBtnText}
                onChange={(e) => setHero({ ...hero, secondaryBtnText: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs text-[#071B68]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#071B68]">Secondary Button Destination</label>
              <input
                type="text"
                value={hero.secondaryBtnHref}
                onChange={(e) => setHero({ ...hero, secondaryBtnHref: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs text-[#071B68]"
              />
            </div>
          </div>

          {/* Hero Image Control */}
          <div className="pt-2">
            <ImageUploader
              label="Hero Clinic Photograph"
              imageSrc={hero.clinicImage}
              imageAlt={hero.clinicImageAlt}
              category="Homepage Hero"
              presetKey="homepage-hero-desktop"
              onImageChange={(url) => setHero({ ...hero, clinicImage: url })}
              onAltChange={(alt) => setHero({ ...hero, clinicImageAlt: alt })}
              onOpenMediaLibrary={() => onOpenMediaLibrary("Homepage Hero")}
              hint="Recommended: 1200x900px, under 2MB. Replaces the main clinic photograph in the hero frame."
            />
          </div>

          {/* Floating Badges */}
          <div className="grid gap-4 sm:grid-cols-2 pt-2">
            <div>
              <label className="text-xs font-bold text-[#071B68]">Floating Badge Title</label>
              <input
                type="text"
                value={hero.badgeTitle}
                onChange={(e) => setHero({ ...hero, badgeTitle: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs text-[#071B68]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#071B68]">Floating Badge Subtitle</label>
              <input
                type="text"
                value={hero.badgeSubtitle}
                onChange={(e) => setHero({ ...hero, badgeSubtitle: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs text-[#071B68]"
              />
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: SPECIALTIES */}
      {activeTab === "specialties" && (
        <div className="card p-6 border border-[#DCE8F0] bg-white space-y-6">
          <div>
            <h3 className="text-lg font-bold text-[#071B68]">Specialized Care Across Three Key Areas</h3>
            <p className="text-xs text-[#5D6B85]">
              Manage the 3 core hospital discipline cards (Dental Care, Skin Care, Hair Care) and replace their clinical images.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-bold text-[#071B68]">Section Eyebrow</label>
              <input
                type="text"
                value={specialties.eyebrow}
                onChange={(e) => setSpecialties({ ...specialties, eyebrow: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs text-[#071B68]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#071B68]">Section Heading</label>
              <input
                type="text"
                value={specialties.heading}
                onChange={(e) => setSpecialties({ ...specialties, heading: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs text-[#071B68]"
              />
            </div>
          </div>

          {specialties.items.map((item, idx) => (
            <div key={item.id} className="rounded-2xl border border-[#DCE8F0] bg-[#F8FDFF] p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-[#DCE8F0] pb-2">
                <span className="font-extrabold text-sm text-[#071B68]">
                  Specialty {idx + 1}: {item.title}
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold text-[#071B68]">Title</label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => {
                      const updated = [...specialties.items];
                      updated[idx].title = e.target.value;
                      setSpecialties({ ...specialties, items: updated });
                    }}
                    className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs text-[#071B68]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#071B68]">Tagline</label>
                  <input
                    type="text"
                    value={item.tagline}
                    onChange={(e) => {
                      const updated = [...specialties.items];
                      updated[idx].tagline = e.target.value;
                      setSpecialties({ ...specialties, items: updated });
                    }}
                    className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs text-[#071B68]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#071B68]">Description</label>
                <textarea
                  rows={2}
                  value={item.desc}
                  onChange={(e) => {
                    const updated = [...specialties.items];
                    updated[idx].desc = e.target.value;
                    setSpecialties({ ...specialties, items: updated });
                  }}
                  className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white p-2 text-xs text-[#071B68]"
                />
              </div>

              <ImageUploader
                label={`${item.title} Image`}
                imageSrc={item.image}
                imageAlt={item.imageAlt}
                category={
                  item.title.includes("Dental")
                    ? "Dental Care"
                    : item.title.includes("Skin")
                    ? "Skin Care"
                    : "Hair Care"
                }
                presetKey={
                  item.title.includes("Dental")
                    ? "dental-card"
                    : item.title.includes("Skin")
                    ? "skin-card"
                    : "hair-card"
                }
                onImageChange={(url) => {
                  const updated = [...specialties.items];
                  updated[idx].image = url;
                  setSpecialties({ ...specialties, items: updated });
                }}
                onAltChange={(alt) => {
                  const updated = [...specialties.items];
                  updated[idx].imageAlt = alt;
                  setSpecialties({ ...specialties, items: updated });
                }}
                onOpenMediaLibrary={() => onOpenMediaLibrary()}
              />
            </div>
          ))}
        </div>
      )}

      {/* SECTION 3: ABOUT PREVIEW */}
      {activeTab === "about" && (
        <div className="card p-6 border border-[#DCE8F0] bg-white space-y-5">
          <div>
            <h3 className="text-lg font-bold text-[#071B68]">About DRK Hospital – Homepage Preview</h3>
            <p className="text-xs text-[#5D6B85]">
              Update the hospital introduction section, story paragraphs, and featured building/clinic image.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-bold text-[#071B68]">Eyebrow Label</label>
              <input
                type="text"
                value={about.eyebrow}
                onChange={(e) => setAbout({ ...about, eyebrow: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs text-[#071B68]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#071B68]">Section Title</label>
              <input
                type="text"
                value={about.heading}
                onChange={(e) => setAbout({ ...about, heading: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs text-[#071B68]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#071B68]">Story Paragraph 1</label>
            <textarea
              rows={2}
              value={about.paragraphs[0] || ""}
              onChange={(e) => {
                const p = [...about.paragraphs];
                p[0] = e.target.value;
                setAbout({ ...about, paragraphs: p });
              }}
              className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white p-2 text-xs text-[#071B68]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#071B68]">Story Paragraph 2</label>
            <textarea
              rows={2}
              value={about.paragraphs[1] || ""}
              onChange={(e) => {
                const p = [...about.paragraphs];
                p[1] = e.target.value;
                setAbout({ ...about, paragraphs: p });
              }}
              className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white p-2 text-xs text-[#071B68]"
            />
          </div>

          <ImageUploader
            label="About Hospital Image"
            imageSrc={about.image}
            imageAlt={about.imageAlt}
            category="About Hospital"
            presetKey="facility-image"
            onImageChange={(url) => setAbout({ ...about, image: url })}
            onAltChange={(alt) => setAbout({ ...about, imageAlt: alt })}
            onOpenMediaLibrary={() => onOpenMediaLibrary("About Hospital")}
          />
        </div>
      )}

      {/* SECTION 4: WHY DRK */}
      {activeTab === "why" && (
        <div className="card p-6 border border-[#DCE8F0] bg-white space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#071B68]">Why DRK Advantages</h3>
              <p className="text-xs text-[#5D6B85]">
                Manage the clinical integrity pillars. Add, edit, remove, and reorder advantage cards.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddAdvantage}
              className="cursor-pointer inline-flex items-center gap-1.5 rounded-full bg-[#071B68] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#087FBA] transition"
            >
              <Plus size={14} />
              <span>Add Advantage</span>
            </button>
          </div>

          <div className="grid gap-3">
            {whyDrk.advantages.map((item, index) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl border border-[#DCE8F0] bg-[#F8FDFF]"
              >
                <div className="flex-1 space-y-2 w-full">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-[#087FBA]">#{index + 1}</span>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const list = [...whyDrk.advantages];
                        list[index].title = e.target.value;
                        setWhyDrk({ ...whyDrk, advantages: list });
                      }}
                      className="font-bold text-xs text-[#071B68] rounded border border-[#DCE8F0] px-2 py-1 w-full max-w-sm bg-white"
                    />
                  </div>
                  <textarea
                    rows={2}
                    value={item.desc}
                    onChange={(e) => {
                      const list = [...whyDrk.advantages];
                      list[index].desc = e.target.value;
                      setWhyDrk({ ...whyDrk, advantages: list });
                    }}
                    className="w-full text-xs text-[#5D6B85] rounded border border-[#DCE8F0] p-2 bg-white"
                  />
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => handleMoveAdvantage(index, "up")}
                    className="p-1 rounded text-slate-500 hover:bg-slate-200 disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    type="button"
                    disabled={index === whyDrk.advantages.length - 1}
                    onClick={() => handleMoveAdvantage(index, "down")}
                    className="p-1 rounded text-slate-500 hover:bg-slate-200 disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowDown size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveAdvantage(item.id)}
                    className="p-1 rounded text-red-600 hover:bg-red-50 cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 5: INSIDE DRK (FACILITIES) */}
      {activeTab === "facilities" && (
        <div className="card p-6 border border-[#DCE8F0] bg-white space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#071B68]">Inside DRK Hospital – Facilities Preview</h3>
              <p className="text-xs text-[#5D6B85]">
                Manage facility highlight cards with clinical photography, titles, and descriptions.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddFacility}
              className="cursor-pointer inline-flex items-center gap-1.5 rounded-full bg-[#071B68] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#087FBA] transition"
            >
              <Plus size={14} />
              <span>Add Facility</span>
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {facilities.items.map((item, idx) => (
              <div key={item.id} className="p-4 rounded-2xl border border-[#DCE8F0] bg-[#F8FDFF] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#071B68]">Facility #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFacility(item.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <input
                  type="text"
                  placeholder="Facility Title"
                  value={item.title}
                  onChange={(e) => {
                    const list = [...facilities.items];
                    list[idx].title = e.target.value;
                    setFacilities({ ...facilities, items: list });
                  }}
                  className="w-full text-xs font-bold rounded-lg border border-[#DCE8F0] p-2 bg-white"
                />

                <input
                  type="text"
                  placeholder="Category (e.g. Dental Care, Infrastructure)"
                  value={item.category}
                  onChange={(e) => {
                    const list = [...facilities.items];
                    list[idx].category = e.target.value;
                    setFacilities({ ...facilities, items: list });
                  }}
                  className="w-full text-xs rounded-lg border border-[#DCE8F0] p-2 bg-white text-[#087FBA]"
                />

                <textarea
                  rows={2}
                  placeholder="Short description..."
                  value={item.desc}
                  onChange={(e) => {
                    const list = [...facilities.items];
                    list[idx].desc = e.target.value;
                    setFacilities({ ...facilities, items: list });
                  }}
                  className="w-full text-xs rounded-lg border border-[#DCE8F0] p-2 bg-white text-[#5D6B85]"
                />

                <ImageUploader
                  label="Facility Photo"
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

      {/* SECTION 6: PATIENT JOURNEY */}
      {activeTab === "journey" && (
        <div className="card p-6 border border-[#DCE8F0] bg-white space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#071B68]">Patient Care Journey</h3>
              <p className="text-xs text-[#5D6B85]">
                Manage the clinical pathway steps from consultation to recovery.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddStep}
              className="cursor-pointer inline-flex items-center gap-1.5 rounded-full bg-[#071B68] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#087FBA] transition"
            >
              <Plus size={14} />
              <span>Add Step</span>
            </button>
          </div>

          <div className="grid gap-3">
            {journey.steps.map((step, idx) => (
              <div
                key={step.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl border border-[#DCE8F0] bg-[#F8FDFF]"
              >
                <div className="flex-1 space-y-2 w-full">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-[#087FBA] bg-white px-2 py-1 rounded border border-[#DCE8F0]">
                      {step.stepNumber}
                    </span>
                    <input
                      type="text"
                      value={step.title}
                      onChange={(e) => {
                        const list = [...journey.steps];
                        list[idx].title = e.target.value;
                        setJourney({ ...journey, steps: list });
                      }}
                      className="font-bold text-xs text-[#071B68] rounded border border-[#DCE8F0] px-2 py-1 w-full max-w-sm bg-white"
                    />
                  </div>
                  <textarea
                    rows={2}
                    value={step.desc}
                    onChange={(e) => {
                      const list = [...journey.steps];
                      list[idx].desc = e.target.value;
                      setJourney({ ...journey, steps: list });
                    }}
                    className="w-full text-xs text-[#5D6B85] rounded border border-[#DCE8F0] p-2 bg-white"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveStep(step.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 7: CTA */}
      {activeTab === "cta" && (
        <div className="card p-6 border border-[#DCE8F0] bg-white space-y-5">
          <div>
            <h3 className="text-lg font-bold text-[#071B68]">Get in Touch – Homepage CTA</h3>
            <p className="text-xs text-[#5D6B85]">
              Update the footer-level call-to-action banner on the homepage.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-bold text-[#071B68]">Eyebrow</label>
              <input
                type="text"
                value={cta.eyebrow}
                onChange={(e) => setCta({ ...cta, eyebrow: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs text-[#071B68]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#071B68]">Heading</label>
              <input
                type="text"
                value={cta.heading}
                onChange={(e) => setCta({ ...cta, heading: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs text-[#071B68]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#071B68]">Description</label>
            <textarea
              rows={2}
              value={cta.description}
              onChange={(e) => setCta({ ...cta, description: e.target.value })}
              className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white p-2 text-xs text-[#071B68]"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-bold text-[#071B68]">Primary Button Text</label>
              <input
                type="text"
                value={cta.primaryBtnText}
                onChange={(e) => setCta({ ...cta, primaryBtnText: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs text-[#071B68]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#071B68]">Secondary Button Text</label>
              <input
                type="text"
                value={cta.secondaryBtnText}
                onChange={(e) => setCta({ ...cta, secondaryBtnText: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs text-[#071B68]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

