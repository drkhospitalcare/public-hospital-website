"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Home,
  Info,
  Stethoscope,
  Phone,
  MapPin,
  Share2,
  Globe,
  PanelBottom,
  FileImage,
  Images,
  ExternalLink,
  UserCheck,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  X,
} from "lucide-react";
import { signOutAdmin } from "@/lib/admin-auth";

interface AdminSidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export default function AdminSidebar({
  mobileOpen,
  setMobileOpen,
  collapsed,
  setCollapsed,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentTab = searchParams?.get("tab") || "homepage";

  const handleSignOut = async () => {
    if (confirm("Are you sure you want to sign out of the DRK Hospital Admin Portal?")) {
      await signOutAdmin();
      router.push("/admin/login");
    }
  };

  const isNavActive = (path: string, tab?: string) => {
    if (tab) {
      return pathname.startsWith("/admin/dashboard/website-content") && currentTab === tab;
    }
    if (path === "/admin/dashboard") {
      return pathname === "/admin/dashboard" && !searchParams?.get("tab");
    }
    return pathname.startsWith(path);
  };

  const navSections = [
    {
      title: "OVERVIEW",
      items: [
        {
          label: "Dashboard",
          href: "/admin/dashboard",
          icon: LayoutDashboard,
          active: pathname === "/admin/dashboard" && !searchParams?.get("tab"),
        },
      ],
    },
    {
      title: "WEBSITE MANAGEMENT",
      items: [
        {
          label: "Homepage",
          href: "/admin/dashboard/website-content?tab=homepage",
          icon: Home,
          active: isNavActive("/admin/dashboard/website-content", "homepage"),
        },
        {
          label: "About DRK",
          href: "/admin/dashboard/website-content?tab=about",
          icon: Info,
          active: isNavActive("/admin/dashboard/website-content", "about"),
        },
        {
          label: "Services",
          href: "/admin/dashboard/website-content?tab=services",
          icon: Stethoscope,
          active: isNavActive("/admin/dashboard/website-content", "services"),
        },
        {
          label: "Contact Information",
          href: "/admin/dashboard/website-content?tab=contact",
          icon: Phone,
          active: isNavActive("/admin/dashboard/website-content", "contact"),
        },
        {
          label: "Google Maps",
          href: "/admin/dashboard/website-content?tab=location",
          icon: MapPin,
          active: isNavActive("/admin/dashboard/website-content", "location"),
        },
        {
          label: "Social Media",
          href: "/admin/dashboard/website-content?tab=social",
          icon: Share2,
          active: isNavActive("/admin/dashboard/website-content", "social"),
        },
        {
          label: "SEO Settings",
          href: "/admin/dashboard/website-content?tab=seo",
          icon: Globe,
          active: isNavActive("/admin/dashboard/website-content", "seo"),
        },
        {
          label: "Footer Settings",
          href: "/admin/dashboard/website-content?tab=footer",
          icon: PanelBottom,
          active: isNavActive("/admin/dashboard/website-content", "footer"),
        },
      ],
    },
    {
      title: "MEDIA MANAGEMENT",
      items: [
        {
          label: "Media Library",
          href: "/admin/dashboard/website-content?tab=media",
          icon: FileImage,
          active: isNavActive("/admin/dashboard/website-content", "media"),
        },
        {
          label: "Hospital Gallery",
          href: "/admin/dashboard/gallery",
          icon: Images,
          active: pathname.startsWith("/admin/dashboard/gallery"),
        },
      ],
    },
    {
      title: "SYSTEM",
      items: [
        {
          label: "Website Preview",
          href: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:8000",
          icon: ExternalLink,
          external: true,
        },
        {
          label: "Account Details",
          href: "/admin/dashboard?tab=account",
          icon: UserCheck,
          active: pathname === "/admin/dashboard" && searchParams?.get("tab") === "account",
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col border-r border-[#DCE8F0] bg-white transition-all duration-300 shadow-sm ${
          collapsed ? "w-20" : "w-64"
        } ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex h-18 items-center justify-between border-b border-[#DCE8F0] px-4">
          {!collapsed ? (
            <Link href="/admin/dashboard" className="flex items-center gap-3">
              <div className="relative h-10 w-36">
                <Image
                  src="/images/drk-logo.png"
                  alt="DRK Hospital"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
          ) : (
            <Link href="/admin/dashboard" className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-[#071B68] text-white">
              <span className="font-extrabold text-xs">DRK</span>
            </Link>
          )}

          {/* Desktop Collapse Button */}
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex h-7 w-7 items-center justify-center rounded-lg border border-[#DCE8F0] bg-white text-[#5D6B85] hover:bg-[#EFFBFC] hover:text-[#071B68] transition cursor-pointer"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="flex lg:hidden h-8 w-8 items-center justify-center rounded-lg text-[#5D6B85] hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* Workspace Badge */}
        {!collapsed && (
          <div className="px-4 pt-3 pb-1">
            <div className="flex items-center justify-between rounded-xl bg-[#EFFBFC] px-3 py-1.5 border border-[#DCE8F0]/70 text-[11px] font-bold text-[#087FBA]">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-[#10C6C1]" />
                <span>Admin Studio</span>
              </span>
              <span className="rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[10px] text-emerald-700">
                Live CMS
              </span>
            </div>
          </div>
        )}

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-5">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1">
              {!collapsed && (
                <p className="px-3 text-[10px] font-bold tracking-wider text-[#8896AB] uppercase">
                  {section.title}
                </p>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.active;

                  if (item.external) {
                    return (
                      <a
                        key={item.label}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold text-[#5D6B85] hover:bg-[#EFFBFC] hover:text-[#087FBA] transition ${
                          collapsed ? "justify-center" : ""
                        }`}
                        title={collapsed ? item.label : undefined}
                      >
                        <Icon size={17} className="shrink-0 text-[#8896AB]" />
                        {!collapsed && <span>{item.label}</span>}
                      </a>
                    );
                  }

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                        isActive
                          ? "bg-[#071B68] text-white shadow-xs"
                          : "text-[#5D6B85] hover:bg-[#EFFBFC] hover:text-[#071B68]"
                      } ${collapsed ? "justify-center" : ""}`}
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon
                        size={17}
                        className={`shrink-0 ${
                          isActive ? "text-[#10C6C1]" : "text-[#8896AB]"
                        }`}
                      />
                      {!collapsed && <span>{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sign Out Action at Bottom */}
        <div className="p-3 border-t border-[#DCE8F0]">
          <button
            type="button"
            onClick={handleSignOut}
            className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 transition cursor-pointer ${
              collapsed ? "justify-center" : ""
            }`}
            title="Sign Out"
          >
            <LogOut size={16} className="shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

