"use client";

import { useState } from "react";
import ImageUploader from "./ImageUploader";
import {
  ServicesHeroContent,
  SpecialtyServicesContent,
  ServicesApproachContent,
  SingleServiceCard,
} from "@/types/cms";
import { Plus, Trash2, Eye, EyeOff, Sparkles, Smile, Scissors } from "lucide-react";

interface ServicesEditorProps {
  hero: ServicesHeroContent;
  setHero: React.Dispatch<React.SetStateAction<ServicesHeroContent>>;
  dental: SpecialtyServicesContent;
  setDental: React.Dispatch<React.SetStateAction<SpecialtyServicesContent>>;
  skin: SpecialtyServicesContent;
  setSkin: React.Dispatch<React.SetStateAction<SpecialtyServicesContent>>;
  hair: SpecialtyServicesContent;
  setHair: React.Dispatch<React.SetStateAction<SpecialtyServicesContent>>;
  approach: ServicesApproachContent;
  setApproach: React.Dispatch<React.SetStateAction<ServicesApproachContent>>;
  onOpenMediaLibrary: (category?: any) => void;
}

export default function ServicesEditor({
  hero,
  setHero,
  dental,
  setDental,
  skin,
  setSkin,
  hair,
  setHair,
  approach,
  setApproach,
  onOpenMediaLibrary,
}: ServicesEditorProps) {
  const [activeTab, setActiveTab] = useState<"hero" | "dental" | "skin" | "hair" | "approach">(
    "hero"
  );

  const renderDepartmentEditor = (
    dept: SpecialtyServicesContent,
    setDept: React.Dispatch<React.SetStateAction<SpecialtyServicesContent>>,
    categoryLabel: string,
    mediaCat: any
  ) => {
    const handleAddService = () => {
      const newCard: SingleServiceCard = {
        id: `srv-${Date.now()}`,
        title: "New Clinical Procedure",
        desc: "Description of the clinical procedure, patient indications, and gentle approach.",
        is_published: true,
        display_order: dept.services.length + 1,
      };
      setDept({ ...dept, services: [...dept.services, newCard] });
    };

    const handleRemoveService = (id: string) => {
      setDept({
        ...dept,
        services: dept.services.filter((s) => s.id !== id),
      });
    };

    const handleTogglePublish = (idx: number) => {
      const list = [...dept.services];
      list[idx].is_published = !list[idx].is_published;
      setDept({ ...dept, services: list });
    };

    return (
      <div className="card p-6 border border-[#DCE8F0] bg-white space-y-5">
        <div>
          <h3 className="text-lg font-bold text-[#071B68]">{categoryLabel} Department</h3>
          <p className="text-xs text-[#5D6B85]">
            Manage department heading, overview description, clinical suite photo, and individual procedure cards.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-bold text-[#071B68]">Department Heading</label>
            <input
              type="text"
              value={dept.departmentHeading}
              onChange={(e) => setDept({ ...dept, departmentHeading: e.target.value })}
              className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs font-bold text-[#071B68]"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-[#071B68]">Department Tagline</label>
            <input
              type="text"
              value={dept.tagline}
              onChange={(e) => setDept({ ...dept, tagline: e.target.value })}
              className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs text-[#071B68]"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-[#071B68]">Department Overview</label>
          <textarea
            rows={2}
            value={dept.description}
            onChange={(e) => setDept({ ...dept, description: e.target.value })}
            className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white p-2 text-xs text-[#071B68]"
          />
        </div>

        <ImageUploader
          label={`${categoryLabel} Department Image`}
          imageSrc={dept.departmentImage}
          imageAlt={dept.departmentImageAlt}
          category={mediaCat}
          onImageChange={(url) => setDept({ ...dept, departmentImage: url })}
          onAltChange={(alt) => setDept({ ...dept, departmentImageAlt: alt })}
          onOpenMediaLibrary={() => onOpenMediaLibrary(mediaCat)}
        />

        {/* Individual Services Cards */}
        <div className="pt-4 border-t border-[#DCE8F0] space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#071B68]">
              Individual Service Cards ({dept.services.length})
            </h4>
            <button
              type="button"
              onClick={handleAddService}
              className="cursor-pointer inline-flex items-center gap-1.5 rounded-full bg-[#071B68] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#087FBA]"
            >
              <Plus size={14} />
              <span>Add Service Card</span>
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {dept.services.map((srv, idx) => (
              <div
                key={srv.id}
                className={`p-4 rounded-2xl border transition ${
                  srv.is_published
                    ? "border-[#DCE8F0] bg-[#F8FDFF]"
                    : "border-slate-200 bg-slate-50 opacity-75"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-extrabold text-[#087FBA]">#{idx + 1}</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleTogglePublish(idx)}
                      title={srv.is_published ? "Click to Hide" : "Click to Publish"}
                      className={`cursor-pointer inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                        srv.is_published
                          ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                          : "text-slate-500 bg-slate-200 border-slate-300"
                      }`}
                    >
                      {srv.is_published ? <Eye size={12} /> : <EyeOff size={12} />}
                      <span>{srv.is_published ? "Published" : "Hidden"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveService(srv.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <input
                  type="text"
                  value={srv.title}
                  onChange={(e) => {
                    const list = [...dept.services];
                    list[idx].title = e.target.value;
                    setDept({ ...dept, services: list });
                  }}
                  className="w-full text-xs font-bold rounded-lg border border-[#DCE8F0] px-2.5 py-1.5 bg-white text-[#071B68]"
                  placeholder="Service Name"
                />

                <textarea
                  rows={2}
                  value={srv.desc}
                  onChange={(e) => {
                    const list = [...dept.services];
                    list[idx].desc = e.target.value;
                    setDept({ ...dept, services: list });
                  }}
                  className="mt-2 w-full text-xs rounded-lg border border-[#DCE8F0] p-2 bg-white text-[#5D6B85]"
                  placeholder="Clinical description..."
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Sub-tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#DCE8F0] pb-3">
        {[
          { id: "hero", label: "A. Services Hero" },
          { id: "dental", label: "B. Dental Care" },
          { id: "skin", label: "C. Skin Care" },
          { id: "hair", label: "D. Hair Care" },
          { id: "approach", label: "E. Healthcare Approach" },
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

      {activeTab === "hero" && (
        <div className="card p-6 border border-[#DCE8F0] bg-white space-y-5">
          <h3 className="text-lg font-bold text-[#071B68]">Services Page Hero Banner</h3>

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
            <label className="text-xs font-bold text-[#071B68]">Heading</label>
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
            label="Services Hero Image"
            imageSrc={hero.image}
            imageAlt={hero.imageAlt}
            category="Homepage Hero"
            onImageChange={(url) => setHero({ ...hero, image: url })}
            onAltChange={(alt) => setHero({ ...hero, imageAlt: alt })}
            onOpenMediaLibrary={() => onOpenMediaLibrary("Homepage Hero")}
          />
        </div>
      )}

      {activeTab === "dental" &&
        renderDepartmentEditor(dental, setDental, "Dental Care", "Dental Care")}

      {activeTab === "skin" &&
        renderDepartmentEditor(skin, setSkin, "Skin Care", "Skin Care")}

      {activeTab === "hair" &&
        renderDepartmentEditor(hair, setHair, "Hair Care", "Hair Care")}

      {activeTab === "approach" && (
        <div className="card p-6 border border-[#DCE8F0] bg-white space-y-5">
          <h3 className="text-lg font-bold text-[#071B68]">Healthcare Approach Steps</h3>
          <p className="text-xs text-[#5D6B85]">
            Configure the 5 clinical stages explaining the hospital's diagnosis, execution, and aftercare.
          </p>

          <div className="grid gap-3">
            {approach.steps.map((st, idx) => (
              <div key={st.id} className="p-4 rounded-xl border border-[#DCE8F0] bg-[#F8FDFF] space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-[#087FBA] bg-white px-2 py-1 rounded border border-[#DCE8F0]">
                    {st.stepNumber}
                  </span>
                  <input
                    type="text"
                    value={st.title}
                    onChange={(e) => {
                      const list = [...approach.steps];
                      list[idx].title = e.target.value;
                      setApproach({ ...approach, steps: list });
                    }}
                    className="font-bold text-xs text-[#071B68] rounded border border-[#DCE8F0] px-2 py-1 w-full max-w-sm bg-white"
                  />
                </div>
                <textarea
                  rows={2}
                  value={st.desc}
                  onChange={(e) => {
                    const list = [...approach.steps];
                    list[idx].desc = e.target.value;
                    setApproach({ ...approach, steps: list });
                  }}
                  className="w-full text-xs text-[#5D6B85] rounded border border-[#DCE8F0] p-2 bg-white"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

