"use client";

import { useState } from "react";
import ImageUploader from "./ImageUploader";
import {
  AboutHeroContent,
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
import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";

interface AboutEditorProps {
  hero: AboutHeroContent;
  setHero: React.Dispatch<React.SetStateAction<AboutHeroContent>>;
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
    "hero" | "story" | "vision" | "philosophy" | "values" | "standards" | "facilities"
  >("hero");

  return (
    <div className="space-y-6">
      {/* Sub-tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#DCE8F0] pb-3">
        {[
          { id: "hero", label: "A. About Hero" },
          { id: "story", label: "B. Our Story" },
          { id: "vision", label: "C. Vision & Mission" },
          { id: "philosophy", label: "D. Philosophy" },
          { id: "values", label: "E. Core Values" },
          { id: "standards", label: "F. Clinical Standards" },
          { id: "facilities", label: "G. Infrastructure" },
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
            onImageChange={(url) => setHero({ ...hero, image: url })}
            onAltChange={(alt) => setHero({ ...hero, imageAlt: alt })}
            onOpenMediaLibrary={() => onOpenMediaLibrary("About Hospital")}
          />
        </div>
      )}

      {/* B. OUR STORY */}
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

