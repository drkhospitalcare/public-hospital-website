"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Menu,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Globe,
  Bell,
} from "lucide-react";

interface AdminTopBarProps {
  adminEmail: string;
  onOpenMobileSidebar: () => void;
  collapsed: boolean;
}

export default function AdminTopBar({
  adminEmail,
  onOpenMobileSidebar,
  collapsed,
}: AdminTopBarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams?.get("tab");

  // Determine section title and breadcrumb
  let pageTitle = "Dashboard Overview";
  let sectionName = "Overview";

  if (pathname.includes("/website-content")) {
    sectionName = "Website Management";
    switch (currentTab) {
      case "homepage":
        pageTitle = "Homepage Content";
        break;
      case "about":
        pageTitle = "About DRK Hospital";
        break;
      case "services":
        pageTitle = "Specialty Services";
        break;
      case "contact":
        pageTitle = "Contact Information";
        break;
      case "location":
        pageTitle = "Google Maps Location";
        break;
      case "social":
        pageTitle = "Social Media Links";
        break;
      case "seo":
        pageTitle = "SEO & Metadata";
        break;
      case "media":
        pageTitle = "Centralized Media Library";
        break;
      default:
        pageTitle = "Website Content Studio";
    }
  } else if (pathname.includes("/gallery")) {
    sectionName = "Media Management";
    pageTitle = "Hospital Gallery Management";
  }

  const initials = adminEmail
    ? adminEmail.slice(0, 2).toUpperCase()
    : "AD";

  const publicWebsiteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:8000";

  return (
    <header
      className={`sticky top-0 z-30 flex h-18 items-center justify-between border-b border-[#DCE8F0] bg-white/95 px-4 sm:px-8 backdrop-blur-xs transition-all duration-300 ${
        collapsed ? "lg:ml-20" : "lg:ml-64"
      }`}
    >
      {/* Left: Mobile Trigger & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="flex lg:hidden h-9 w-9 items-center justify-center rounded-xl border border-[#DCE8F0] bg-white text-[#071B68] hover:bg-slate-50 cursor-pointer"
          title="Open Navigation"
        >
          <Menu size={18} />
        </button>

        <div>
          <nav
            aria-label="Breadcrumb"
            className="hidden sm:flex items-center gap-1.5 text-[11px] font-semibold text-[#8896AB]"
          >
            <span>DRK Admin Portal</span>
            <ChevronRight size={12} />
            <span>{sectionName}</span>
            <ChevronRight size={12} />
            <span className="text-[#087FBA] font-bold">{pageTitle}</span>
          </nav>
          <h1 className="text-base sm:text-lg font-extrabold text-[#071B68]">
            {pageTitle}
          </h1>
        </div>
      </div>

      {/* Right: Actions, Public Site Status & Admin Profile */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Public Site Live Indicator */}
        <div className="hidden md:flex items-center gap-2 rounded-full border border-[#DCE8F0] bg-[#EFFBFC] px-3 py-1.5 text-xs">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="font-bold text-[#071B68]">Public Site Live</span>
        </div>

        {/* View Public Website Button */}
        <a
          href={publicWebsiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-[#DCE8F0] bg-white px-3.5 py-1.5 text-xs font-bold text-[#087FBA] shadow-2xs hover:bg-[#EFFBFC] hover:border-[#087FBA] transition"
          title="Open live public website in new tab"
        >
          <Globe size={14} className="text-[#087FBA]" />
          <span className="hidden sm:inline">View Public Website</span>
          <ExternalLink size={12} className="text-[#8896AB]" />
        </a>

        {/* Administrator Profile Badge */}
        <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-[#DCE8F0]">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#071B68] text-xs font-bold text-white shadow-2xs">
            {initials}
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-xs font-bold text-[#071B68] leading-tight truncate max-w-[140px]">
              {adminEmail}
            </p>
            <p className="text-[10px] font-semibold text-[#10C6C1] uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck size={11} />
              <span>DRK Administrator</span>
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

