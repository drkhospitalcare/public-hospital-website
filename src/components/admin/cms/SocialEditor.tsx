"use client";

import { SocialMediaContent, SocialMediaItem, SocialPlatformType } from "@/types/cms";
import { Plus, Trash2, ExternalLink, Instagram, Facebook, Youtube, Linkedin, Share2 } from "lucide-react";

interface SocialEditorProps {
  social: SocialMediaContent;
  setSocial: React.Dispatch<React.SetStateAction<SocialMediaContent>>;
}

const PLATFORMS: SocialPlatformType[] = [
  "Instagram",
  "Facebook",
  "YouTube",
  "LinkedIn",
  "Twitter / X",
  "Other",
];

export default function SocialEditor({ social, setSocial }: SocialEditorProps) {
  const handleAddPlatform = () => {
    const newItem: SocialMediaItem = {
      id: `soc-${Date.now()}`,
      platform: "Instagram",
      label: "Instagram",
      url: "https://instagram.com/drkhospital",
      icon: "Instagram",
      isActive: true,
      displayOrder: social.links.length + 1,
    };
    setSocial({ ...social, links: [...social.links, newItem] });
  };

  const handleRemove = (id: string) => {
    setSocial({
      ...social,
      links: social.links.filter((l) => l.id !== id),
    });
  };

  return (
    <div className="card p-6 border border-[#DCE8F0] bg-white space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-[#071B68]">Social Media Links</h3>
          <p className="text-xs text-[#5D6B85]">
            Configure social media profiles. Active platforms automatically appear in the website footer.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddPlatform}
          className="cursor-pointer inline-flex items-center gap-1.5 rounded-full bg-[#071B68] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#087FBA]"
        >
          <Plus size={14} />
          <span>Add Platform</span>
        </button>
      </div>

      <div className="grid gap-3">
        {social.links.map((link, idx) => (
          <div
            key={link.id}
            className="p-4 rounded-xl border border-[#DCE8F0] bg-[#F8FDFF] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
          >
            <div className="grid gap-3 sm:grid-cols-3 flex-1 w-full">
              <div>
                <label className="text-[11px] font-bold text-[#071B68]">Platform</label>
                <select
                  value={link.platform}
                  onChange={(e) => {
                    const list = [...social.links];
                    const val = e.target.value as SocialPlatformType;
                    list[idx].platform = val;
                    list[idx].label = val;
                    setSocial({ ...social, links: list });
                  }}
                  className="mt-1 w-full rounded-lg border border-[#DCE8F0] bg-white px-2.5 py-1.5 text-xs font-bold text-[#071B68]"
                >
                  {PLATFORMS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#071B68]">Display Label</label>
                <input
                  type="text"
                  value={link.label}
                  onChange={(e) => {
                    const list = [...social.links];
                    list[idx].label = e.target.value;
                    setSocial({ ...social, links: list });
                  }}
                  className="mt-1 w-full rounded-lg border border-[#DCE8F0] bg-white px-2.5 py-1.5 text-xs text-[#071B68]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#071B68]">Profile URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={link.url}
                  onChange={(e) => {
                    const list = [...social.links];
                    list[idx].url = e.target.value;
                    setSocial({ ...social, links: list });
                  }}
                  className="mt-1 w-full rounded-lg border border-[#DCE8F0] bg-white px-2.5 py-1.5 text-xs text-[#071B68]"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 text-xs text-[#071B68] cursor-pointer">
                <input
                  type="checkbox"
                  checked={link.isActive}
                  onChange={(e) => {
                    const list = [...social.links];
                    list[idx].isActive = e.target.checked;
                    setSocial({ ...social, links: list });
                  }}
                />
                <span className="text-[11px] font-semibold">Active</span>
              </label>

              {link.url && (
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#087FBA] hover:text-[#071B68] p-1"
                  title="Test link"
                >
                  <ExternalLink size={14} />
                </a>
              )}

              <button
                type="button"
                onClick={() => handleRemove(link.id)}
                className="text-red-500 hover:text-red-700 p-1"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

