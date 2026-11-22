"use client";

import { useState, useEffect, useRef } from "react";
import SafeImage from "@/components/SafeImage";
import {
  X,
  Upload,
  Search,
  Filter,
  Check,
  Trash2,
  ExternalLink,
  Loader2,
  Copy,
  Image as ImageIcon,
} from "lucide-react";
import { getWebsiteMediaList, uploadWebsiteMedia, deleteWebsiteMedia } from "@/lib/cms";
import { WebsiteMediaItem, MediaCategory } from "@/types/cms";
import { formatBytes } from "@/lib/supabase";

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage?: (url: string, altText: string) => void;
  initialCategory?: MediaCategory | "All";
}

const CATEGORIES: Array<"All" | MediaCategory> = [
  "All",
  "Homepage Hero",
  "Doctors and Clinical Team",
  "Dental Care",
  "Skin Care",
  "Hair Care",
  "About Hospital",
  "Clinical Standards",
  "Infrastructure",
  "Reception",
  "Medical Equipment",
  "Hospital Activities",
  "Other",
];

export default function MediaLibraryModal({
  isOpen,
  onClose,
  onSelectImage,
  initialCategory = "All",
}: MediaLibraryModalProps) {
  const [mediaList, setMediaList] = useState<WebsiteMediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<"All" | MediaCategory>(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      loadMedia();
    }
  }, [isOpen, selectedCategory]);

  const loadMedia = async () => {
    setLoading(true);
    const list = await getWebsiteMediaList(selectedCategory, searchQuery);
    setMediaList(list);
    setLoading(false);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadError(null);

    const categoryToUse = selectedCategory === "All" ? "Other" : selectedCategory;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const title = file.name.replace(/\.[^/.]+$/, "");
      const res = await uploadWebsiteMedia(file, categoryToUse, title, title);
      if (!res.success) {
        setUploadError(res.error || "Upload failed");
      }
    }

    setUploading(false);
    loadMedia();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDelete = async (item: WebsiteMediaItem) => {
    if (!confirm(`Are you sure you want to delete "${item.title}"?`)) return;
    await deleteWebsiteMedia(item.id, item.storage_path);
    loadMedia();
  };

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#071B68]/60 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col max-h-[92vh] max-w-5xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#DCE8F0]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-[#DCE8F0] bg-[#F8FDFF]">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#10C6C1]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#087FBA]">
                DRK Hospital Media Asset Repository
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-[#071B68] mt-0.5">
              Website Media Library
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={handleUpload}
              className="hidden"
            />
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer inline-flex items-center gap-2 rounded-full bg-[#071B68] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#087FBA] disabled:opacity-50 shadow-xs"
            >
              {uploading ? (
                <>
                  <Loader2 size={14} className="animate-spin text-[#10C6C1]" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload size={14} className="text-[#10C6C1]" />
                  <span>Upload Images</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-full p-2 text-[#5D6B85] hover:bg-slate-100 hover:text-[#071B68] transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="p-4 sm:p-5 border-b border-[#DCE8F0] bg-white flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5D6B85]" />
            <input
              type="text"
              placeholder="Search images by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && loadMedia()}
              className="w-full rounded-xl border border-[#DCE8F0] bg-white py-2 pl-9 pr-4 text-xs text-[#071B68] placeholder:text-[#8896AB] focus:border-[#087FBA] focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter size={14} className="text-[#087FBA] shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="w-full sm:w-auto rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs font-semibold text-[#071B68] focus:border-[#087FBA] focus:outline-hidden"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {uploadError && (
          <div className="p-3 bg-red-50 text-red-700 text-xs font-semibold border-b border-red-200">
            {uploadError}
          </div>
        )}

        {/* Media Grid */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          {loading ? (
            <div className="p-16 text-center">
              <Loader2 size={32} className="animate-spin text-[#087FBA] mx-auto mb-3" />
              <p className="text-xs font-bold text-[#071B68]">Loading Media Library assets...</p>
            </div>
          ) : mediaList.length === 0 ? (
            <div className="p-16 text-center border-2 border-dashed border-[#DCE8F0] rounded-2xl">
              <ImageIcon size={36} className="text-[#087FBA] mx-auto mb-3" />
              <h4 className="text-base font-bold text-[#071B68]">No images in this category</h4>
              <p className="text-xs text-[#5D6B85] mt-1 max-w-sm mx-auto">
                Upload image assets here to use them across homepage hero, services, about, and facility sections.
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-4 cursor-pointer inline-flex items-center gap-2 rounded-full bg-[#071B68] px-5 py-2 text-xs font-bold text-white hover:bg-[#087FBA] transition"
              >
                <Upload size={14} className="text-[#10C6C1]" />
                <span>Upload First Image</span>
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {mediaList.map((item) => (
                <div
                  key={item.id}
                  className="group relative flex flex-col rounded-2xl border border-[#DCE8F0] bg-white overflow-hidden shadow-2xs hover:border-[#087FBA] transition"
                >
                  <div className="relative aspect-[4/3] w-full bg-slate-100">
                    <SafeImage
                      src={item.public_url}
                      alt={item.alt_text || item.title}
                      fill
                      className="object-cover"
                      sizes="220px"
                    />
                    <span className="absolute top-2 left-2 rounded-full bg-white/95 px-2.5 py-0.5 text-[10px] font-bold text-[#071B68] shadow-2xs">
                      {item.category}
                    </span>
                  </div>

                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="font-bold text-[#071B68] text-xs truncate" title={item.title}>
                        {item.title}
                      </p>
                      <p className="text-[10px] text-[#5D6B85] mt-0.5">
                        {item.file_size ? formatBytes(item.file_size) : "Standard"} •{" "}
                        {new Date(item.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-1 pt-2 border-t border-[#DCE8F0]">
                      {onSelectImage ? (
                        <button
                          type="button"
                          onClick={() => {
                            onSelectImage(item.public_url, item.alt_text || item.title);
                            onClose();
                          }}
                          className="cursor-pointer flex-1 inline-flex items-center justify-center gap-1 rounded-lg bg-[#071B68] py-1.5 px-2 text-[11px] font-bold text-white hover:bg-[#087FBA] transition"
                        >
                          <Check size={12} />
                          <span>Use Image</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleCopy(item.public_url, item.id)}
                          className="cursor-pointer inline-flex items-center gap-1 text-[11px] font-semibold text-[#087FBA] hover:underline"
                        >
                          <Copy size={12} />
                          <span>{copiedId === item.id ? "Copied!" : "Copy URL"}</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleDelete(item)}
                        title="Delete asset"
                        className="cursor-pointer rounded-lg p-1 text-red-500 hover:bg-red-50 transition"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

