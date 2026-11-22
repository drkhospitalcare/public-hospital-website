"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SafeImage from "@/components/SafeImage";
import {
  ArrowLeft,
  Upload,
  Plus,
  Trash2,
  Edit2,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
  Loader2,
  Search,
  Filter,
  Eye,
  EyeOff,
  LayoutGrid,
  Table as TableIcon,
  RefreshCw,
  Clock,
  Sparkles,
} from "lucide-react";
import { GalleryCategory, GalleryImage } from "@/types/gallery";
import {
  getSupabaseClient,
  isSupabaseConfigured,
  validateImageFile,
  formatBytes,
} from "@/lib/supabase";
import SupabaseSetupBanner from "@/components/admin/SupabaseSetupBanner";

const CATEGORIES: GalleryCategory[] = [
  "Dental Care",
  "Skin Care",
  "Hair Care",
  "Hospital Infrastructure",
  "Hospital Activities",
];

interface UploadItem {
  id: string;
  file: File;
  preview: string;
  title: string;
  caption: string;
  category: GalleryCategory;
  is_published: boolean;
  status: "pending" | "uploading" | "success" | "error";
  errorMessage?: string;
}

export default function AdminGalleryPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [configured, setConfigured] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Notifications
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("All");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("All");

  // Multi-upload Modal State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadItems, setUploadItems] = useState<UploadItem[]>([]);
  const [isSubmittingUpload, setIsSubmittingUpload] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);

  // Edit Modal State
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCaption, setEditCaption] = useState("");
  const [editCategory, setEditCategory] = useState<GalleryCategory>("Dental Care");
  const [editPublished, setEditPublished] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Delete Confirmation Modal State
  const [deletingImage, setDeletingImage] = useState<GalleryImage | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast Helper
  const showToast = (type: "success" | "error" | "info", message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 4500);
  };

  // Load Gallery Images
  const loadImages = async () => {
    setLoading(true);
    const isConfig = isSupabaseConfigured();
    setConfigured(isConfig);

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("gallery_images")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.warn("Supabase load error:", error);
          showToast("error", `Could not query Supabase table: ${error.message}`);
          setImages([]);
        } else if (data && data.length > 0) {
          setImages(data as GalleryImage[]);
        } else {
          setImages([]);
        }
      } catch (err: unknown) {
        console.warn("Error fetching gallery:", err);
        setImages([]);
      }
    } else {
      setImages([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    const isConfig = isSupabaseConfigured();
    const supabase = getSupabaseClient();
    if (supabase && isConfig) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session) {
          router.push("/admin/login");
          return;
        }
        loadImages();
      });
    } else {
      loadImages();
    }
  }, [router]);

  // Handle Multi-file Selection
  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newItems: UploadItem[] = [];

    Array.from(files).forEach((file) => {
      const validation = validateImageFile(file);
      if (!validation.valid) {
        showToast("error", validation.error || `Invalid file ${file.name}`);
        return;
      }

      const defaultTitle = file.name
        .replace(/\.[^/.]+$/, "")
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

      newItems.push({
        id: `upload-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        file,
        preview: URL.createObjectURL(file),
        title: defaultTitle,
        caption: "",
        category: "Dental Care",
        is_published: true,
        status: "pending",
      });
    });

    setUploadItems((prev) => [...prev, ...newItems]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Remove a selected upload item from queue
  const removeUploadItem = (id: string) => {
    setUploadItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Update a single field on an upload item
  const updateUploadItem = (id: string, updates: Partial<UploadItem>) => {
    setUploadItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  // Handle Upload Submission (Single or Multiple)
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (uploadItems.length === 0) {
      showToast("error", "Please select at least one image to upload.");
      return;
    }

    // Verify all items have titles
    const missingTitle = uploadItems.find((item) => !item.title.trim());
    if (missingTitle) {
      showToast("error", `Please provide a title for all images (${missingTitle.file.name}).`);
      return;
    }

    if (!configured) {
      showToast(
        "error",
        "Supabase credentials are not configured in .env.local. Real uploads require an active Supabase project."
      );
      return;
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      showToast("error", "Supabase client is not available.");
      return;
    }

    setIsSubmittingUpload(true);
    setUploadProgress({ current: 0, total: uploadItems.length });

    let successCount = 0;
    const errors: string[] = [];

    for (let i = 0; i < uploadItems.length; i++) {
      const item = uploadItems[i];
      setUploadProgress({ current: i + 1, total: uploadItems.length });
      updateUploadItem(item.id, { status: "uploading" });

      try {
        const fileExt = item.file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const filePath = `gallery/${fileName}`;

        // 1. Upload to Supabase Storage
        const { error: storageError } = await supabase.storage
          .from("gallery-images")
          .upload(filePath, item.file, {
            contentType: item.file.type,
            upsert: false,
          });

        if (storageError) {
          throw new Error(`Storage upload failed: ${storageError.message}`);
        }

        // 2. Get Public URL
        const { data: urlData } = supabase.storage
          .from("gallery-images")
          .getPublicUrl(filePath);

        const publicUrl = urlData.publicUrl;

        // 3. Insert record in gallery_images table
        const { error: dbError } = await supabase.from("gallery_images").insert([
          {
            title: item.title.trim(),
            caption: item.caption.trim() || null,
            category: item.category,
            storage_path: filePath,
            public_url: publicUrl,
            is_published: item.is_published,
          },
        ]);

        if (dbError) {
          throw new Error(`Database record failed: ${dbError.message}`);
        }

        updateUploadItem(item.id, { status: "success" });
        successCount++;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to upload image";
        errors.push(`${item.file.name}: ${msg}`);
        updateUploadItem(item.id, { status: "error", errorMessage: msg });
      }
    }

    setIsSubmittingUpload(false);
    setUploadProgress(null);

    if (successCount === uploadItems.length) {
      showToast("success", `Successfully uploaded and published ${successCount} image(s)!`);
      setUploadItems([]);
      setShowUploadModal(false);
      await loadImages();
    } else {
      showToast(
        "error",
        `Uploaded ${successCount} of ${uploadItems.length} images. ${errors.join("; ")}`
      );
      await loadImages();
    }
  };

  // Quick Toggle Publish / Unpublish directly
  const handleTogglePublish = async (img: GalleryImage) => {
    const newStatus = img.is_published === false ? true : false;

    if (!configured) {
      // Local preview state toggle
      setImages((prev) =>
        prev.map((item) => (item.id === img.id ? { ...item, is_published: newStatus } : item))
      );
      showToast(
        "info",
        `Demo mode: image visibility toggled to ${newStatus ? "Published" : "Draft"}.`
      );
      return;
    }

    const supabase = getSupabaseClient();
    if (!supabase) return;

    try {
      const { error } = await supabase
        .from("gallery_images")
        .update({ is_published: newStatus })
        .eq("id", img.id);

      if (error) {
        throw new Error(error.message);
      }

      setImages((prev) =>
        prev.map((item) => (item.id === img.id ? { ...item, is_published: newStatus } : item))
      );

      showToast(
        "success",
        `"${img.title}" is now ${newStatus ? "Published (Visible on site)" : "Draft (Hidden from public)"}.`
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update publish status";
      showToast("error", msg);
    }
  };

  // Open Edit Modal
  const openEditModal = (img: GalleryImage) => {
    setEditingImage(img);
    setEditTitle(img.title);
    setEditCaption(img.caption || "");
    setEditCategory(img.category);
    setEditPublished(img.is_published !== false);
  };

  // Handle Edit Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingImage) return;

    if (!editTitle.trim()) {
      showToast("error", "Image title is required.");
      return;
    }

    if (!configured) {
      setImages((prev) =>
        prev.map((img) =>
          img.id === editingImage.id
            ? {
                ...img,
                title: editTitle.trim(),
                caption: editCaption.trim() || null,
                category: editCategory,
                is_published: editPublished,
              }
            : img
        )
      );
      showToast("info", "Demo mode: image details updated locally.");
      setEditingImage(null);
      return;
    }

    setIsUpdating(true);
    const supabase = getSupabaseClient();
    if (!supabase) return;

    try {
      const { error } = await supabase
        .from("gallery_images")
        .update({
          title: editTitle.trim(),
          caption: editCaption.trim() || null,
          category: editCategory,
          is_published: editPublished,
        })
        .eq("id", editingImage.id);

      if (error) throw new Error(error.message);

      setImages((prev) =>
        prev.map((img) =>
          img.id === editingImage.id
            ? {
                ...img,
                title: editTitle.trim(),
                caption: editCaption.trim() || null,
                category: editCategory,
                is_published: editPublished,
              }
            : img
        )
      );

      showToast("success", "Image details updated successfully!");
      setEditingImage(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update image details.";
      showToast("error", msg);
    } finally {
      setIsUpdating(false);
    }
  };

  // Open Delete Confirmation Modal
  const openDeleteModal = (img: GalleryImage) => {
    setDeletingImage(img);
  };

  // Handle Delete Confirmation
  const handleDeleteConfirm = async () => {
    if (!deletingImage) return;

    if (!configured) {
      setImages((prev) => prev.filter((img) => img.id !== deletingImage.id));
      showToast("info", "Demo mode: image removed from preview list.");
      setDeletingImage(null);
      return;
    }

    setIsDeleting(true);
    const supabase = getSupabaseClient();
    if (!supabase) return;

    try {
      // 1. Delete file from Supabase storage if storage_path is valid
      if (deletingImage.storage_path && !deletingImage.storage_path.startsWith("local/")) {
        await supabase.storage
          .from("gallery-images")
          .remove([deletingImage.storage_path]);
      }

      // 2. Delete row from gallery_images database table
      const { error } = await supabase
        .from("gallery_images")
        .delete()
        .eq("id", deletingImage.id);

      if (error) throw new Error(error.message);

      setImages((prev) => prev.filter((img) => img.id !== deletingImage.id));
      showToast("success", `"${deletingImage.title}" deleted permanently.`);
      setDeletingImage(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete image.";
      showToast("error", msg);
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered images list
  const filteredImages = images.filter((img) => {
    const matchesSearch =
      img.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (img.caption && img.caption.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategoryFilter === "All" || img.category === selectedCategoryFilter;

    const matchesStatus =
      selectedStatusFilter === "All" ||
      (selectedStatusFilter === "Published" && img.is_published !== false) ||
      (selectedStatusFilter === "Draft" && img.is_published === false);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="min-h-[85vh] bg-[#F8FDFF] py-10">
      <div className="container">
        {/* Toast Notification */}
        {notification && (
          <div
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl px-5 py-3.5 shadow-2xl border text-sm font-semibold transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 ${
              notification.type === "success"
                ? "bg-[#071B68] text-white border-[#10C6C1]"
                : notification.type === "info"
                ? "bg-blue-900 text-white border-blue-400"
                : "bg-red-900 text-white border-red-500"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle2 size={18} className="text-[#10C6C1] shrink-0" />
            ) : notification.type === "info" ? (
              <Sparkles size={18} className="text-blue-300 shrink-0" />
            ) : (
              <AlertCircle size={18} className="text-red-400 shrink-0" />
            )}
            <span>{notification.message}</span>
            <button
              type="button"
              onClick={() => setNotification(null)}
              className="ml-2 rounded-full p-1 hover:bg-white/20 text-white cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Top Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-[#DCE8F0]">
          <div>
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#087FBA] hover:text-[#071B68] transition mb-2"
            >
              <ArrowLeft size={14} />
              <span>Back to Admin Dashboard</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#071B68]">
              Hospital Gallery Management
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-[#5D6B85]">
              Upload, edit, categorize, and control the public visibility of hospital images.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={loadImages}
              title="Refresh Gallery Data"
              className="rounded-full border border-[#DCE8F0] bg-white p-2.5 text-[#071B68] hover:bg-[#EFFBFC] transition cursor-pointer shadow-2xs"
            >
              <RefreshCw size={16} />
            </button>

            <button
              type="button"
              onClick={() => {
                setUploadItems([]);
                setShowUploadModal(true);
              }}
              className="btn-primary cursor-pointer text-xs sm:text-sm !py-2.5 !px-5"
            >
              <Upload size={16} />
              <span>Upload Images</span>
            </button>
          </div>
        </div>

        {/* Supabase Status Banner */}
        <div className="mt-6">
          <SupabaseSetupBanner configured={configured} />
        </div>

        {/* Control Bar: Search, Category Filter, Status Filter, View Toggle */}
        <div className="card p-4 sm:p-5 border border-[#DCE8F0] bg-white shadow-2xs mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5D6B85]"
              />
              <input
                type="text"
                placeholder="Search images by title or caption..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-[#DCE8F0] bg-white py-2 pl-10 pr-4 text-xs sm:text-sm text-[#071B68] placeholder:text-[#8896AB] focus:border-[#087FBA] focus:outline-hidden focus:ring-2 focus:ring-[#087FBA]/20 transition"
              />
            </div>

            {/* Filter Dropdowns and View Switcher */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Category Filter */}
              <div className="flex items-center gap-1.5 text-xs text-[#5D6B85]">
                <Filter size={14} className="text-[#087FBA]" />
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs font-semibold text-[#071B68] focus:border-[#087FBA] focus:outline-hidden"
                >
                  <option value="All">All Categories</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5 text-xs text-[#5D6B85]">
                <select
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value)}
                  className="rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs font-semibold text-[#071B68] focus:border-[#087FBA] focus:outline-hidden"
                >
                  <option value="All">All Statuses</option>
                  <option value="Published">Published Only</option>
                  <option value="Draft">Draft / Hidden Only</option>
                </select>
              </div>

              {/* View Switcher: Table vs Grid */}
              <div className="flex items-center rounded-xl border border-[#DCE8F0] bg-[#EFFBFC]/40 p-1">
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  className={`rounded-lg p-1.5 transition cursor-pointer ${
                    viewMode === "table"
                      ? "bg-white text-[#071B68] shadow-2xs font-bold"
                      : "text-[#5D6B85] hover:text-[#071B68]"
                  }`}
                  title="Table View"
                >
                  <TableIcon size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`rounded-lg p-1.5 transition cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-white text-[#071B68] shadow-2xs font-bold"
                      : "text-[#5D6B85] hover:text-[#071B68]"
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Content Area */}
        {loading ? (
          <div className="card p-12 text-center bg-white border border-[#DCE8F0]">
            <Loader2 size={32} className="animate-spin text-[#087FBA] mx-auto mb-3" />
            <p className="text-sm font-bold text-[#071B68]">Loading gallery records...</p>
          </div>
        ) : images.length === 0 ? (
          <div className="card p-16 text-center bg-white border border-[#DCE8F0] max-w-lg mx-auto">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EFFBFC] text-[#087FBA] mx-auto mb-4 border border-[#DCE8F0]">
              <ImageIcon size={32} />
            </div>
            <h3 className="text-lg font-bold text-[#071B68]">No images uploaded yet</h3>
            <p className="mt-2 text-xs sm:text-sm text-[#5D6B85] leading-relaxed max-w-md mx-auto">
              Your gallery database is currently empty. Upload verified hospital photographs to showcase dental, skin, hair, and facility spaces.
            </p>
            <button
              type="button"
              onClick={() => {
                setUploadItems([]);
                setShowUploadModal(true);
              }}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#071B68] px-6 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-[#087FBA] cursor-pointer mx-auto"
            >
              <Upload size={14} className="text-[#10C6C1]" />
              <span>Upload Your First Image</span>
            </button>
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="card p-16 text-center bg-white border border-[#DCE8F0] max-w-lg mx-auto">
            <ImageIcon size={40} className="text-[#087FBA] mx-auto mb-3" />
            <h3 className="text-lg font-bold text-[#071B68]">No images match your filter</h3>
            <p className="mt-1 text-xs sm:text-sm text-[#5D6B85] leading-relaxed">
              No gallery images match your current search and filter criteria.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategoryFilter("All");
                setSelectedStatusFilter("All");
              }}
              className="mt-4 btn-outline text-xs !py-2 !px-4 mx-auto"
            >
              <span>Reset All Filters</span>
            </button>
          </div>
        ) : viewMode === "table" ? (
          /* TABLE VIEW */
          <div className="card overflow-hidden border border-[#DCE8F0] bg-white shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#EFFBFC]/60 text-[#071B68] font-bold uppercase tracking-wider text-[11px] border-b border-[#DCE8F0]">
                  <tr>
                    <th className="py-3.5 px-4">Thumbnail</th>
                    <th className="py-3.5 px-4">Title & Details</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Visibility</th>
                    <th className="py-3.5 px-4">Upload Date</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DCE8F0]">
                  {filteredImages.map((img) => (
                    <tr key={img.id} className="hover:bg-slate-50/70 transition">
                      {/* Thumbnail */}
                      <td className="py-3.5 px-4">
                        <div className="relative h-14 w-20 overflow-hidden rounded-xl border border-[#DCE8F0] bg-slate-100">
                          <SafeImage
                            src={img.public_url}
                            alt={img.title}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </div>
                      </td>

                      {/* Title & Caption */}
                      <td className="py-3.5 px-4 max-w-xs sm:max-w-md">
                        <p className="font-bold text-[#071B68] text-sm">{img.title}</p>
                        {img.caption && (
                          <p className="text-xs text-[#5D6B85] line-clamp-1 mt-0.5">{img.caption}</p>
                        )}
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-block rounded-full bg-[#EFFBFC] px-3 py-1 text-xs font-bold text-[#087FBA] border border-[#DCE8F0]">
                          {img.category}
                        </span>
                      </td>

                      {/* Visibility Toggle Button */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(img)}
                          title="Click to toggle publish status"
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition cursor-pointer border ${
                            img.is_published !== false
                              ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                              : "bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200"
                          }`}
                        >
                          {img.is_published !== false ? (
                            <>
                              <Eye size={13} className="text-emerald-600" />
                              <span>Published</span>
                            </>
                          ) : (
                            <>
                              <EyeOff size={13} className="text-slate-500" />
                              <span>Draft / Hidden</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-[#5D6B85] whitespace-nowrap">
                        {img.created_at
                          ? new Date(img.created_at).toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "Curated"}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(img)}
                            title="Edit Image Details"
                            className="rounded-lg border border-[#DCE8F0] p-1.5 text-[#071B68] hover:bg-[#EFFBFC] hover:border-[#087FBA] transition cursor-pointer"
                          >
                            <Edit2 size={15} />
                          </button>
                          <a
                            href={img.public_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Open Full Image"
                            className="rounded-lg border border-[#DCE8F0] p-1.5 text-[#087FBA] hover:bg-[#EFFBFC] hover:border-[#087FBA] transition"
                          >
                            <ExternalLink size={15} />
                          </a>
                          <button
                            type="button"
                            onClick={() => openDeleteModal(img)}
                            title="Delete Image"
                            className="rounded-lg border border-red-200 p-1.5 text-red-600 hover:bg-red-50 hover:border-red-400 transition cursor-pointer"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* GRID VIEW */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredImages.map((img) => (
              <div
                key={img.id}
                className="card overflow-hidden border border-[#DCE8F0] bg-white shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
                    <SafeImage
                      src={img.public_url}
                      alt={img.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 400px"
                    />
                    <div className="absolute top-3 left-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold text-[#071B68] shadow-xs backdrop-blur-xs">
                      {img.category}
                    </div>

                    <div className="absolute top-3 right-3">
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(img)}
                        className={`rounded-full px-2.5 py-1 text-[11px] font-bold shadow-xs cursor-pointer border ${
                          img.is_published !== false
                            ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                            : "bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200"
                        }`}
                      >
                        {img.is_published !== false ? "Published" : "Draft"}
                      </button>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-base font-bold text-[#071B68]">{img.title}</h3>
                    {img.caption && (
                      <p className="mt-1 text-xs text-[#5D6B85] line-clamp-2">{img.caption}</p>
                    )}
                  </div>
                </div>

                <div className="p-4 border-t border-[#DCE8F0] bg-[#F8FDFF] flex items-center justify-between">
                  <span className="text-[11px] text-[#5D6B85]">
                    {img.created_at
                      ? new Date(img.created_at).toLocaleDateString()
                      : "Curated"}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEditModal(img)}
                      className="rounded-lg border border-[#DCE8F0] p-1.5 text-[#071B68] hover:bg-white hover:border-[#087FBA] transition cursor-pointer"
                      title="Edit"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => openDeleteModal(img)}
                      className="rounded-lg border border-red-200 p-1.5 text-red-600 hover:bg-red-50 hover:border-red-400 transition cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MULTI-IMAGE UPLOAD MODAL */}
      {showUploadModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto"
        >
          <div className="relative w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-[#DCE8F0] my-8 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-[#DCE8F0] pb-4">
              <div>
                <h3 className="text-xl font-bold text-[#071B68]">
                  Upload Images to Hospital Gallery
                </h3>
                <p className="text-xs text-[#5D6B85] mt-0.5">
                  Select one or multiple images (JPEG, PNG, WebP up to 10MB each).
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!isSubmittingUpload) {
                    setShowUploadModal(false);
                    setUploadItems([]);
                  }
                }}
                disabled={isSubmittingUpload}
                className="rounded-full p-2 text-[#5D6B85] hover:bg-slate-100 hover:text-[#071B68] transition cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="flex-1 overflow-y-auto py-5 space-y-6">
              {/* File Dropzone Input */}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFilesSelected}
                  className="hidden"
                  id="multi-image-input"
                  disabled={isSubmittingUpload}
                />
                <label
                  htmlFor="multi-image-input"
                  className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#087FBA]/40 bg-[#EFFBFC]/40 p-6 text-center hover:bg-[#EFFBFC] hover:border-[#087FBA] transition cursor-pointer"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#087FBA] shadow-2xs mb-2">
                    <Upload size={22} />
                  </div>
                  <p className="text-sm font-bold text-[#071B68]">
                    Click to browse or drop images here
                  </p>
                  <p className="mt-1 text-xs text-[#5D6B85]">
                    Supports multiple files • PNG, JPEG, WebP • Max 10MB per file
                  </p>
                </label>
              </div>

              {/* Upload Items Queue */}
              {uploadItems.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-bold text-[#071B68] pb-1 border-b border-[#DCE8F0]">
                    <span>Selected Images ({uploadItems.length})</span>
                    <button
                      type="button"
                      onClick={() => setUploadItems([])}
                      disabled={isSubmittingUpload}
                      className="text-red-600 hover:underline cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>

                  <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                    {uploadItems.map((item, idx) => (
                      <div
                        key={item.id}
                        className="rounded-2xl border border-[#DCE8F0] p-4 bg-[#F8FDFF] relative flex flex-col sm:flex-row gap-4"
                      >
                        {/* Thumbnail */}
                        <div className="relative h-24 w-28 shrink-0 overflow-hidden rounded-xl border border-[#DCE8F0] bg-slate-100">
                          <SafeImage
                            src={item.preview}
                            alt="Preview"
                            fill
                            className="object-cover"
                          />
                          <div className="absolute bottom-1 right-1 rounded bg-black/70 px-1 text-[9px] text-white">
                            {formatBytes(item.file.size)}
                          </div>
                        </div>

                        {/* Fields */}
                        <div className="flex-1 space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[#071B68]">
                              Image #{idx + 1}
                            </span>
                            {!isSubmittingUpload && (
                              <button
                                type="button"
                                onClick={() => removeUploadItem(item.id)}
                                className="text-red-500 hover:text-red-700 cursor-pointer"
                                title="Remove this file"
                              >
                                <X size={15} />
                              </button>
                            )}
                          </div>

                          <div>
                            <input
                              type="text"
                              required
                              placeholder="Image Title (Required)"
                              value={item.title}
                              disabled={isSubmittingUpload}
                              onChange={(e) =>
                                updateUploadItem(item.id, { title: e.target.value })
                              }
                              className="w-full rounded-lg border border-[#DCE8F0] bg-white px-2.5 py-1.5 text-xs text-[#071B68] font-bold focus:border-[#087FBA] focus:outline-hidden"
                            />
                          </div>

                          <div>
                            <input
                              type="text"
                              placeholder="Caption / Description (Optional)"
                              value={item.caption}
                              disabled={isSubmittingUpload}
                              onChange={(e) =>
                                updateUploadItem(item.id, { caption: e.target.value })
                              }
                              className="w-full rounded-lg border border-[#DCE8F0] bg-white px-2.5 py-1.5 text-xs text-[#5D6B85] focus:border-[#087FBA] focus:outline-hidden"
                            />
                          </div>

                          <div className="flex flex-wrap items-center gap-3 pt-1">
                            <select
                              value={item.category}
                              disabled={isSubmittingUpload}
                              onChange={(e) =>
                                updateUploadItem(item.id, {
                                  category: e.target.value as GalleryCategory,
                                })
                              }
                              className="rounded-lg border border-[#DCE8F0] bg-white px-2 py-1 text-[11px] font-semibold text-[#071B68]"
                            >
                              {CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>
                                  {cat}
                                </option>
                              ))}
                            </select>

                            <label className="flex items-center gap-1.5 text-[11px] font-semibold text-[#071B68] cursor-pointer">
                              <input
                                type="checkbox"
                                checked={item.is_published}
                                disabled={isSubmittingUpload}
                                onChange={(e) =>
                                  updateUploadItem(item.id, {
                                    is_published: e.target.checked,
                                  })
                                }
                                className="rounded text-[#087FBA] focus:ring-[#087FBA]"
                              />
                              <span>Publish Immediately</span>
                            </label>
                          </div>

                          {item.errorMessage && (
                            <p className="text-[11px] text-red-600 font-semibold">
                              {item.errorMessage}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Progress Bar */}
              {isSubmittingUpload && uploadProgress && (
                <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-4">
                  <div className="flex items-center justify-between text-xs font-bold text-[#071B68] mb-2">
                    <span className="flex items-center gap-2">
                      <Loader2 size={14} className="animate-spin text-[#087FBA]" />
                      Uploading & Registering Files in Supabase...
                    </span>
                    <span>
                      {uploadProgress.current} / {uploadProgress.total}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-blue-200 overflow-hidden">
                    <div
                      className="h-full bg-[#087FBA] transition-all duration-300"
                      style={{
                        width: `${(uploadProgress.current / uploadProgress.total) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#DCE8F0]">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  disabled={isSubmittingUpload}
                  className="rounded-xl border border-[#DCE8F0] bg-white px-4 py-2 text-xs font-bold text-[#5D6B85] hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingUpload || uploadItems.length === 0}
                  className="btn-primary text-xs !py-2 !px-5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmittingUpload ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Uploading to Supabase...</span>
                    </>
                  ) : (
                    <>
                      <Upload size={14} />
                      <span>Upload {uploadItems.length} Image(s)</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingImage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6"
        >
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-[#DCE8F0]">
            <div className="flex items-center justify-between border-b border-[#DCE8F0] pb-4">
              <h3 className="text-xl font-bold text-[#071B68]">Edit Image Details</h3>
              <button
                type="button"
                onClick={() => setEditingImage(null)}
                className="rounded-full p-1.5 text-[#5D6B85] hover:bg-slate-100 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="mt-5 space-y-4">
              {/* Preview */}
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-[#DCE8F0] bg-slate-100 mb-4">
                <SafeImage
                  src={editingImage.public_url}
                  alt={editTitle}
                  fill
                  className="object-cover"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#071B68] mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full rounded-xl border border-[#DCE8F0] bg-white px-3.5 py-2 text-sm text-[#071B68] focus:border-[#087FBA] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#071B68] mb-1">
                  Caption / Description
                </label>
                <textarea
                  rows={2}
                  value={editCaption}
                  onChange={(e) => setEditCaption(e.target.value)}
                  className="w-full rounded-xl border border-[#DCE8F0] bg-white px-3.5 py-2 text-sm text-[#071B68] focus:border-[#087FBA] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#071B68] mb-1">
                  Specialty Category
                </label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value as GalleryCategory)}
                  className="w-full rounded-xl border border-[#DCE8F0] bg-white px-3.5 py-2 text-sm text-[#071B68] focus:border-[#087FBA] focus:outline-hidden"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-[#071B68] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editPublished}
                    onChange={(e) => setEditPublished(e.target.checked)}
                    className="rounded text-[#087FBA] focus:ring-[#087FBA]"
                  />
                  <span>Published on Public Gallery</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#DCE8F0]">
                <button
                  type="button"
                  onClick={() => setEditingImage(null)}
                  className="rounded-xl border border-[#DCE8F0] bg-white px-4 py-2 text-xs font-bold text-[#5D6B85] hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="btn-primary text-xs !py-2 !px-5 cursor-pointer disabled:opacity-50"
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingImage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6"
        >
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-red-200">
            <div className="text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600 mx-auto mb-3">
                <Trash2 size={24} />
              </div>

              <h3 className="text-lg font-bold text-[#071B68]">
                Delete Gallery Image?
              </h3>
              <p className="mt-2 text-xs text-[#5D6B85] leading-relaxed">
                Are you sure you want to delete <strong className="text-[#071B68]">&ldquo;{deletingImage.title}&rdquo;</strong>? This action will permanently remove the image from both storage and the database.
              </p>

              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-[#DCE8F0] bg-slate-100 my-4">
                <SafeImage
                  src={deletingImage.public_url}
                  alt={deletingImage.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeletingImage(null)}
                  disabled={isDeleting}
                  className="rounded-xl border border-[#DCE8F0] bg-white px-4 py-2 text-xs font-bold text-[#5D6B85] hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-red-700 transition cursor-pointer disabled:opacity-50"
                >
                  {isDeleting ? "Deleting..." : "Confirm Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
