"use client";

import { useState } from "react";
import ImageUploader from "./ImageUploader";
import {
  ServicesHeroContent,
  SpecialtyServicesContent,
  ServicesApproachContent,
  SingleServiceCard,
  MediaCategory,
} from "@/types/cms";
import {
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Sparkles,
  Smile,
  Scissors,
  ArrowUp,
  ArrowDown,
  Edit3,
  Search,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Layers,
  FileText,
  Globe,
  Settings,
  X,
} from "lucide-react";

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

type TabType = "overview" | "dental" | "skin" | "hair" | "treatments" | "seo" | "hero_approach";

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
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [editingTreatment, setEditingTreatment] = useState<{
    card: SingleServiceCard;
    category: "dental-care" | "skin-care" | "hair-care";
    index: number;
  } | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Helper to get total services count
  const dentalCount = dental.services?.length || 0;
  const skinCount = skin.services?.length || 0;
  const hairCount = hair.services?.length || 0;
  const totalCount = dentalCount + skinCount + hairCount;

  // Department updater helper
  const getDeptState = (cat: "dental-care" | "skin-care" | "hair-care") => {
    if (cat === "dental-care") return { dept: dental, setDept: setDental, mediaCat: "Dental Care" };
    if (cat === "skin-care") return { dept: skin, setDept: setSkin, mediaCat: "Skin Care" };
    return { dept: hair, setDept: setHair, mediaCat: "Hair Care" };
  };

  // Reorder helper
  const handleMoveService = (
    cat: "dental-care" | "skin-care" | "hair-care",
    index: number,
    direction: "up" | "down"
  ) => {
    const { dept, setDept } = getDeptState(cat);
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= dept.services.length) return;

    const list = [...dept.services];
    const [moved] = list.splice(index, 1);
    list.splice(targetIdx, 0, moved);

    // Update display_order property
    const reordered = list.map((item, idx) => ({
      ...item,
      display_order: idx + 1,
    }));

    setDept({ ...dept, services: reordered });
  };

  // Toggle Publish
  const handleTogglePublish = (
    cat: "dental-care" | "skin-care" | "hair-care",
    idx: number
  ) => {
    const { dept, setDept } = getDeptState(cat);
    const list = [...dept.services];
    list[idx] = {
      ...list[idx],
      is_published: !list[idx].is_published,
    };
    setDept({ ...dept, services: list });
  };

  // Delete Service with confirmation
  const handleDeleteService = (
    cat: "dental-care" | "skin-care" | "hair-care",
    id: string
  ) => {
    const { dept, setDept } = getDeptState(cat);
    setDept({
      ...dept,
      services: dept.services.filter((s) => s.id !== id),
    });
    setDeleteConfirmId(null);
    if (editingTreatment?.card.id === id) {
      setEditingTreatment(null);
    }
  };

  // Add New Service
  const handleAddNewService = (cat: "dental-care" | "skin-care" | "hair-care") => {
    const { dept, setDept } = getDeptState(cat);
    const newId = `${cat.slice(0, 4)}-${Date.now()}`;
    const newCard: SingleServiceCard = {
      id: newId,
      title: "New Clinical Treatment",
      slug: `new-treatment-${Date.now()}`,
      desc: "Short clinical description of the treatment and patient indications.",
      detailedDescription:
        "Comprehensive procedural explanation performed in sterile operatory suites in Tiruttani.",
      specialtyId: cat,
      is_published: true,
      display_order: dept.services.length + 1,
      seoTitle: "New Treatment in Tiruttani | DRK Hospitals",
      metaDescription:
        "Specialized outpatient medical treatment at DRK Hospitals in Tiruttani, Tamil Nadu.",
    };

    setDept({ ...dept, services: [...dept.services, newCard] });
    setEditingTreatment({
      card: newCard,
      category: cat,
      index: dept.services.length,
    });
  };

  // Save Modal/Drawer Edit
  const handleSaveModalEdit = (updatedCard: SingleServiceCard) => {
    if (!editingTreatment) return;
    const { category, index } = editingTreatment;
    const { dept, setDept } = getDeptState(category);

    const list = [...dept.services];
    list[index] = updatedCard;
    setDept({ ...dept, services: list });
    setEditingTreatment(null);
  };

  // Department Editor renderer
  const renderDepartmentTab = (
    cat: "dental-care" | "skin-care" | "hair-care",
    dept: SpecialtyServicesContent,
    setDept: React.Dispatch<React.SetStateAction<SpecialtyServicesContent>>,
    categoryLabel: string,
    accentColor: string
  ) => {
    const mediaCat: MediaCategory =
      cat === "dental-care"
        ? "Dental Care"
        : cat === "skin-care"
        ? "Skin Care"
        : "Hair Care";

    return (
      <div className="space-y-6">
        {/* Category Header Card */}
        <div className="card p-6 border border-[#DCE8F0] bg-white rounded-2xl shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#DCE8F0]">
            <div>
              <div
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider mb-1.5"
                style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
              >
                Specialty Category
              </div>
              <h3 className="text-xl font-black text-[#071B68]">
                {categoryLabel} Management
              </h3>
              <p className="text-xs text-[#5D6B85] mt-0.5">
                Configure department overview, suite imagery, and individual treatments ({dept.services?.length || 0} treatments).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleAddNewService(cat)}
                className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl bg-[#071B68] px-4 py-2 text-xs font-bold text-white hover:bg-[#087FBA] transition shadow-xs"
              >
                <Plus size={15} />
                <span>Add Treatment</span>
              </button>
            </div>
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
              className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white p-2.5 text-xs text-[#071B68]"
            />
          </div>

          <ImageUploader
            label={`${categoryLabel} Department Image`}
            imageSrc={dept.departmentImage}
            imageAlt={dept.departmentImageAlt}
            category={mediaCat}
            presetKey={
              cat === "dental-care"
                ? "dental-card"
                : cat === "skin-care"
                ? "skin-card"
                : "hair-card"
            }
            onImageChange={(url) => setDept({ ...dept, departmentImage: url })}
            onAltChange={(alt) => setDept({ ...dept, departmentImageAlt: alt })}
            onOpenMediaLibrary={() => onOpenMediaLibrary(mediaCat)}
          />
        </div>

        {/* Treatment List Table/Cards */}
        <div className="card p-6 border border-[#DCE8F0] bg-white rounded-2xl shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#DCE8F0]">
            <div>
              <h4 className="text-base font-bold text-[#071B68]">
                Official Treatment Catalogue ({dept.services?.length || 0})
              </h4>
              <p className="text-xs text-[#5D6B85]">
                Order, visibility, descriptions, and SEO for every published treatment.
              </p>
            </div>
            <span className="text-xs font-bold text-[#087FBA]">
              {dept.services.filter((s) => s.is_published !== false).length} Published
            </span>
          </div>

          <div className="grid gap-3">
            {dept.services.map((srv, idx) => (
              <div
                key={srv.id}
                className={`p-4 rounded-xl border transition ${
                  srv.is_published !== false
                    ? "border-[#DCE8F0] bg-[#F8FDFF]"
                    : "border-slate-200 bg-slate-50 opacity-70"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white border border-[#DCE8F0] text-xs font-black text-[#087FBA]">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h5 className="text-sm font-bold text-[#071B68] flex items-center gap-2">
                        <span>{srv.title}</span>
                        {srv.slug && (
                          <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-white border border-[#DCE8F0] text-[#5D6B85]">
                            /{srv.slug}
                          </span>
                        )}
                      </h5>
                      <p className="text-xs text-[#5D6B85] line-clamp-1 mt-0.5">
                        {srv.desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 self-end sm:self-auto">
                    {/* Reorder Buttons */}
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveService(cat, idx, "up")}
                      className="p-1.5 rounded-lg border border-[#DCE8F0] bg-white text-slate-600 hover:text-[#087FBA] disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move Up"
                    >
                      <ArrowUp size={13} />
                    </button>
                    <button
                      type="button"
                      disabled={idx === dept.services.length - 1}
                      onClick={() => handleMoveService(cat, idx, "down")}
                      className="p-1.5 rounded-lg border border-[#DCE8F0] bg-white text-slate-600 hover:text-[#087FBA] disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move Down"
                    >
                      <ArrowDown size={13} />
                    </button>

                    {/* Visibility Toggle */}
                    <button
                      type="button"
                      onClick={() => handleTogglePublish(cat, idx)}
                      className={`cursor-pointer inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg border transition ${
                        srv.is_published !== false
                          ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                          : "text-slate-500 bg-slate-100 border-slate-300"
                      }`}
                    >
                      {srv.is_published !== false ? <Eye size={12} /> : <EyeOff size={12} />}
                      <span>{srv.is_published !== false ? "Live" : "Hidden"}</span>
                    </button>

                    {/* Edit Details */}
                    <button
                      type="button"
                      onClick={() =>
                        setEditingTreatment({
                          card: { ...srv },
                          category: cat,
                          index: idx,
                        })
                      }
                      className="cursor-pointer inline-flex items-center gap-1 text-xs font-bold text-[#087FBA] bg-white border border-[#DCE8F0] px-2.5 py-1 rounded-lg hover:bg-[#EFFBFC]"
                    >
                      <Edit3 size={13} />
                      <span>Edit</span>
                    </button>

                    {/* Delete */}
                    {deleteConfirmId === srv.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleDeleteService(cat, srv.id)}
                          className="text-[11px] font-bold bg-red-600 text-white px-2 py-1 rounded-lg"
                        >
                          Confirm
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(null)}
                          className="text-[11px] text-slate-500 px-1 py-1"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(srv.id)}
                        className="text-slate-400 hover:text-red-600 p-1.5"
                        title="Delete Treatment"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation Bar */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#F8FDFF] border border-[#DCE8F0] rounded-2xl">
        {[
          { id: "overview", label: `Overview (${totalCount})`, icon: Layers },
          { id: "dental", label: `Dental Care (${dentalCount})`, icon: Smile },
          { id: "skin", label: `Skin Care (${skinCount})`, icon: Sparkles },
          { id: "hair", label: `Hair Care (${hairCount})`, icon: Scissors },
          { id: "treatments", label: "Treatment Directory", icon: FileText },
          { id: "seo", label: "Specialty & Local SEO", icon: Globe },
          { id: "hero_approach", label: "Hero Banner & Approach", icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`cursor-pointer inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? "bg-[#071B68] text-white shadow-xs"
                  : "bg-white text-[#5D6B85] hover:bg-[#EFFBFC] hover:text-[#071B68] border border-[#DCE8F0]"
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="card p-5 border border-[#DCE8F0] bg-white rounded-2xl shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#087FBA] uppercase tracking-wider">
                  Dental Sciences
                </span>
                <Smile size={18} className="text-[#087FBA]" />
              </div>
              <p className="mt-2 text-2xl font-black text-[#071B68]">{dentalCount} Treatments</p>
              <p className="text-xs text-[#5D6B85] mt-1">
                Root canal, implant, braces, fixed replacement, disimpaction, etc.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab("dental")}
                className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#087FBA] hover:underline"
              >
                <span>Manage Dental Care</span>
                <ExternalLink size={12} />
              </button>
            </div>

            <div className="card p-5 border border-[#DCE8F0] bg-white rounded-2xl shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#10C6C1] uppercase tracking-wider">
                  Dermatology & Skin
                </span>
                <Sparkles size={18} className="text-[#10C6C1]" />
              </div>
              <p className="mt-2 text-2xl font-black text-[#071B68]">{skinCount} Treatments</p>
              <p className="text-xs text-[#5D6B85] mt-1">
                Carbon laser, acne, whitening, hydrafacial, fillers, allergy, etc.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab("skin")}
                className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#10C6C1] hover:underline"
              >
                <span>Manage Skin Care</span>
                <ExternalLink size={12} />
              </button>
            </div>

            <div className="card p-5 border border-[#DCE8F0] bg-white rounded-2xl shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#071B68] uppercase tracking-wider">
                  Trichology & Hair
                </span>
                <Scissors size={18} className="text-[#071B68]" />
              </div>
              <p className="mt-2 text-2xl font-black text-[#071B68]">{hairCount} Treatments</p>
              <p className="text-xs text-[#5D6B85] mt-1">
                PRP, GFC, tricho analysis, regrowth, dandruff, laser therapy.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab("hair")}
                className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#071B68] hover:underline"
              >
                <span>Manage Hair Care</span>
                <ExternalLink size={12} />
              </button>
            </div>
          </div>

          <div className="card p-6 border border-[#DCE8F0] bg-white rounded-2xl shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#071B68]">
                  Complete Official Services Catalogue
                </h3>
                <p className="text-xs text-[#5D6B85]">
                  Sourced from official hospital signboards: 13 Dental + 16 Skin + 7 Hair = 36 Total Entries.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                Catalogue Synchronized
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#DCE8F0] text-[#5D6B85] uppercase tracking-wider font-bold">
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Service Name</th>
                    <th className="py-2.5 px-3">Specialty</th>
                    <th className="py-2.5 px-3">URL Slug</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DCE8F0]">
                  {[
                    ...dental.services.map((s, idx) => ({ ...s, cat: "dental-care" as const, catName: "Dental Care", idx })),
                    ...skin.services.map((s, idx) => ({ ...s, cat: "skin-care" as const, catName: "Skin Care", idx })),
                    ...hair.services.map((s, idx) => ({ ...s, cat: "hair-care" as const, catName: "Hair Care", idx })),
                  ].map((item, index) => (
                    <tr key={item.id} className="hover:bg-[#F8FDFF]">
                      <td className="py-2.5 px-3 font-mono text-slate-400">{index + 1}</td>
                      <td className="py-2.5 px-3 font-bold text-[#071B68]">{item.title}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            item.cat === "dental-care"
                              ? "bg-blue-50 text-blue-700"
                              : item.cat === "skin-care"
                              ? "bg-teal-50 text-teal-700"
                              : "bg-indigo-50 text-indigo-700"
                          }`}
                        >
                          {item.catName}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[#5D6B85]">
                        /{item.slug || item.id}
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            item.is_published !== false
                              ? "text-emerald-700 bg-emerald-50"
                              : "text-slate-500 bg-slate-100"
                          }`}
                        >
                          {item.is_published !== false ? "Live" : "Hidden"}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            setEditingTreatment({
                              card: { ...item },
                              category: item.cat,
                              index: item.idx,
                            })
                          }
                          className="cursor-pointer text-xs font-bold text-[#087FBA] hover:underline"
                        >
                          Edit Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. DENTAL TAB */}
      {activeTab === "dental" &&
        renderDepartmentTab("dental-care", dental, setDental, "Dental Care", "#087FBA")}

      {/* 3. SKIN TAB */}
      {activeTab === "skin" &&
        renderDepartmentTab("skin-care", skin, setSkin, "Skin Care", "#10C6C1")}

      {/* 4. HAIR TAB */}
      {activeTab === "hair" &&
        renderDepartmentTab("hair-care", hair, setHair, "Hair Care", "#071B68")}

      {/* 5. TREATMENT DIRECTORY TAB */}
      {activeTab === "treatments" && (
        <div className="card p-6 border border-[#DCE8F0] bg-white rounded-2xl shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DCE8F0]">
            <div>
              <h3 className="text-lg font-bold text-[#071B68]">
                Searchable Treatment Directory
              </h3>
              <p className="text-xs text-[#5D6B85]">
                Quickly locate and configure any treatment across all three medical departments.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search treatments..."
                className="w-full rounded-xl border border-[#DCE8F0] pl-9 pr-3 py-1.5 text-xs text-[#071B68] bg-white"
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ...dental.services.map((s, idx) => ({ ...s, cat: "dental-care" as const, catName: "Dental Care", idx })),
              ...skin.services.map((s, idx) => ({ ...s, cat: "skin-care" as const, catName: "Skin Care", idx })),
              ...hair.services.map((s, idx) => ({ ...s, cat: "hair-care" as const, catName: "Hair Care", idx })),
            ]
              .filter(
                (item) =>
                  !searchQuery ||
                  item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  item.desc.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-[#DCE8F0] bg-[#F8FDFF] flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#087FBA]">
                        {item.catName}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.is_published !== false
                            ? "text-emerald-700 bg-emerald-50"
                            : "text-slate-500 bg-slate-100"
                        }`}
                      >
                        {item.is_published !== false ? "Live" : "Hidden"}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-[#071B68] mt-1">{item.title}</h4>
                    <p className="text-xs text-[#5D6B85] mt-1 line-clamp-2">{item.desc}</p>
                  </div>

                  <div className="pt-2 border-t border-[#DCE8F0] flex items-center justify-between text-xs">
                    <span className="font-mono text-[11px] text-[#5D6B85]">
                      /{item.slug || item.id}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setEditingTreatment({
                          card: { ...item },
                          category: item.cat,
                          index: item.idx,
                        })
                      }
                      className="cursor-pointer font-bold text-[#087FBA] hover:underline"
                    >
                      Edit Treatment Details →
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 6. SEO SETTINGS TAB */}
      {activeTab === "seo" && (
        <div className="card p-6 border border-[#DCE8F0] bg-white rounded-2xl shadow-2xs space-y-6">
          <div className="border-b border-[#DCE8F0] pb-4">
            <h3 className="text-lg font-bold text-[#071B68]">
              Specialty & Local Search Optimization (Tiruttani)
            </h3>
            <p className="text-xs text-[#5D6B85] mt-0.5">
              Targeted local keywords and canonical indexing configurations for Dental, Skin, and Hair care in Tiruttani and surrounding service areas.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            <div className="p-4 rounded-xl border border-[#DCE8F0] bg-[#F8FDFF] space-y-3">
              <h4 className="font-bold text-sm text-[#071B68]">Dental Specialty SEO</h4>
              <div className="text-xs text-[#5D6B85] space-y-2">
                <p><strong>Route:</strong> <code>/services/dental-care</code></p>
                <p><strong>Target Queries:</strong> Dental hospital in Tiruttani, Dentist in Tiruttani, Root canal treatment, Dental implant surgery, Braces.</p>
                <p><strong>Canonical:</strong> <code>https://drkhospitals.com/services/dental-care</code></p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-[#DCE8F0] bg-[#F8FDFF] space-y-3">
              <h4 className="font-bold text-sm text-[#071B68]">Skin Specialty SEO</h4>
              <div className="text-xs text-[#5D6B85] space-y-2">
                <p><strong>Route:</strong> <code>/services/skin-care</code></p>
                <p><strong>Target Queries:</strong> Skin hospital in Tiruttani, Dermatology clinic, Pimple & acne care, Carbon peel laser, HydraFacial.</p>
                <p><strong>Canonical:</strong> <code>https://drkhospitals.com/services/skin-care</code></p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-[#DCE8F0] bg-[#F8FDFF] space-y-3">
              <h4 className="font-bold text-sm text-[#071B68]">Hair Specialty SEO</h4>
              <div className="text-xs text-[#5D6B85] space-y-2">
                <p><strong>Route:</strong> <code>/services/hair-care</code></p>
                <p><strong>Target Queries:</strong> Hair treatment in Tiruttani, Trichology clinic, PRP hair treatment, GFC therapy, Dandruff care.</p>
                <p><strong>Canonical:</strong> <code>https://drkhospitals.com/services/hair-care</code></p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. HERO & APPROACH TAB */}
      {activeTab === "hero_approach" && (
        <div className="space-y-6">
          <div className="card p-6 border border-[#DCE8F0] bg-white rounded-2xl shadow-2xs space-y-5">
            <h3 className="text-lg font-bold text-[#071B68]">Services Hero Banner</h3>

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
              presetKey="services-hero"
              onImageChange={(url) => setHero({ ...hero, image: url })}
              onAltChange={(alt) => setHero({ ...hero, imageAlt: alt })}
              onOpenMediaLibrary={() => onOpenMediaLibrary("Homepage Hero")}
            />
          </div>

          <div className="card p-6 border border-[#DCE8F0] bg-white rounded-2xl shadow-2xs space-y-5">
            <h3 className="text-lg font-bold text-[#071B68]">Healthcare Approach Steps</h3>
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
        </div>
      )}

      {/* TREATMENT EDIT MODAL / DRAWER */}
      {editingTreatment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-[#DCE8F0] shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#DCE8F0]">
              <div>
                <span className="text-[11px] font-bold text-[#087FBA] uppercase tracking-wider">
                  Edit Clinical Treatment
                </span>
                <h3 className="text-xl font-black text-[#071B68]">
                  {editingTreatment.card.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingTreatment(null)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#071B68]">Treatment Name</label>
                <input
                  type="text"
                  value={editingTreatment.card.title}
                  onChange={(e) =>
                    setEditingTreatment({
                      ...editingTreatment,
                      card: { ...editingTreatment.card, title: e.target.value },
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-[#DCE8F0] px-3 py-2 text-xs font-bold text-[#071B68] bg-white"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold text-[#071B68]">URL Slug</label>
                  <input
                    type="text"
                    value={editingTreatment.card.slug || ""}
                    onChange={(e) =>
                      setEditingTreatment({
                        ...editingTreatment,
                        card: {
                          ...editingTreatment.card,
                          slug: e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9-]/g, "-")
                            .replace(/-+/g, "-"),
                        },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-[#DCE8F0] px-3 py-2 text-xs font-mono text-[#071B68] bg-white"
                    placeholder="e.g. root-canal-treatment"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#071B68]">Visibility Status</label>
                  <select
                    value={editingTreatment.card.is_published !== false ? "published" : "hidden"}
                    onChange={(e) =>
                      setEditingTreatment({
                        ...editingTreatment,
                        card: {
                          ...editingTreatment.card,
                          is_published: e.target.value === "published",
                        },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-[#DCE8F0] px-3 py-2 text-xs font-bold text-[#071B68] bg-white"
                  >
                    <option value="published">Published (Visible on Website)</option>
                    <option value="hidden">Hidden (Draft / Disabled)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#071B68]">
                  Short Description (Card Summary)
                </label>
                <textarea
                  rows={2}
                  value={editingTreatment.card.desc}
                  onChange={(e) =>
                    setEditingTreatment({
                      ...editingTreatment,
                      card: { ...editingTreatment.card, desc: e.target.value },
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-[#DCE8F0] p-2.5 text-xs text-[#5D6B85] bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#071B68]">
                  Detailed Clinical Description (Detail Page)
                </label>
                <textarea
                  rows={3}
                  value={editingTreatment.card.detailedDescription || ""}
                  onChange={(e) =>
                    setEditingTreatment({
                      ...editingTreatment,
                      card: {
                        ...editingTreatment.card,
                        detailedDescription: e.target.value,
                      },
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-[#DCE8F0] p-2.5 text-xs text-[#5D6B85] bg-white"
                  placeholder="Detailed procedure explanation, sterile protocol adherence, and patient comfort features..."
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#071B68]">SEO Page Title</label>
                <input
                  type="text"
                  value={editingTreatment.card.seoTitle || ""}
                  onChange={(e) =>
                    setEditingTreatment({
                      ...editingTreatment,
                      card: { ...editingTreatment.card, seoTitle: e.target.value },
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-[#DCE8F0] px-3 py-2 text-xs text-[#071B68] bg-white"
                  placeholder="e.g. Root Canal Treatment in Tiruttani | DRK Hospitals"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#071B68]">SEO Meta Description</label>
                <textarea
                  rows={2}
                  value={editingTreatment.card.metaDescription || ""}
                  onChange={(e) =>
                    setEditingTreatment({
                      ...editingTreatment,
                      card: { ...editingTreatment.card, metaDescription: e.target.value },
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-[#DCE8F0] p-2.5 text-xs text-[#5D6B85] bg-white"
                  placeholder="Search engine summary text..."
                />
              </div>

              <ImageUploader
                label="Treatment Photo (Optional)"
                imageSrc={editingTreatment.card.image || ""}
                imageAlt={editingTreatment.card.imageAlt || ""}
                category={
                  editingTreatment.category === "dental-care"
                    ? "Dental Care"
                    : editingTreatment.category === "skin-care"
                    ? "Skin Care"
                    : "Hair Care"
                }
                presetKey={
                  editingTreatment.category === "dental-care"
                    ? "dental-card"
                    : editingTreatment.category === "skin-care"
                    ? "skin-card"
                    : "hair-card"
                }
                onImageChange={(url) =>
                  setEditingTreatment({
                    ...editingTreatment,
                    card: { ...editingTreatment.card, image: url },
                  })
                }
                onAltChange={(alt) =>
                  setEditingTreatment({
                    ...editingTreatment,
                    card: { ...editingTreatment.card, imageAlt: alt },
                  })
                }
                onOpenMediaLibrary={() =>
                  onOpenMediaLibrary(
                    editingTreatment.category === "dental-care"
                      ? "Dental Care"
                      : editingTreatment.category === "skin-care"
                      ? "Skin Care"
                      : "Hair Care"
                  )
                }
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#DCE8F0]">
              <button
                type="button"
                onClick={() => setEditingTreatment(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#5D6B85] hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSaveModalEdit(editingTreatment.card)}
                className="btn-primary text-xs font-bold px-6 py-2"
              >
                Apply Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
