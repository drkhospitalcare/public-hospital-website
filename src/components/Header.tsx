"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Clock3, MapPin, Phone, Menu, X, ArrowUpRight } from "lucide-react";
import { HOSPITAL_INFO } from "@/lib/hospital-info";
import { useCMSSection } from "@/lib/useCMS";
import * as defaults from "@/lib/cms-defaults";
import { ContactInfoContent } from "@/types/cms";
import { formatOperatingHours } from "@/lib/working-hours";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Gallery", href: "/gallery" },
  { name: "Contact", href: "/contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Subscribe to CMS Contact Info
  const contact = useCMSSection<ContactInfoContent>(
    "contact_info",
    defaults.DEFAULT_CONTACT_INFO
  );
  const primaryPhone =
    contact.phoneNumbers.find((p) => p.isPrimary && p.isActive) ||
    contact.phoneNumbers[0] || {
      number: HOSPITAL_INFO.phone.primary,
      raw: HOSPITAL_INFO.phone.primaryRaw,
    };
  const addressDisplay = `${contact.city}, ${contact.state}`;
  const hoursSummary = formatOperatingHours(contact.operatingHours);

  // Close mobile menu upon navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Handle sticky shadow on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent background scrolling when mobile menu is open and listen for Escape key
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") setMobileMenuOpen(false);
      };
      window.addEventListener("keydown", handleEscape);
      return () => window.removeEventListener("keydown", handleEscape);
    } else {
      document.body.style.overflow = "unset";
    }
  }, [mobileMenuOpen]);

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-white transition-shadow duration-300 ${
        scrolled ? "shadow-sm border-b border-[#DCE8F0]" : "border-b border-[#DCE8F0]"
      }`}
    >
      {/* Top Information Bar - Pure Light Aqua as per reference */}
      <div className="bg-[#E6F8F9] border-b border-[#D4F0F2] text-[#071B68] text-xs">
        <div className="container flex flex-wrap items-center justify-between gap-y-2 gap-x-6 py-2">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
            <span className="flex items-center gap-1.5 font-medium text-[#071B68]">
              <MapPin size={13} className="text-[#087FBA] shrink-0" />
              <span>{addressDisplay}</span>
            </span>
            <span className="hidden sm:flex items-center gap-1.5 font-medium text-[#071B68]">
              <Clock3 size={13} className="text-[#087FBA] shrink-0" />
              <span>{hoursSummary.displayShort}</span>
            </span>
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <a
              href={`tel:${primaryPhone.raw}`}
              className="flex items-center gap-1.5 font-bold text-[#071B68] transition-colors hover:text-[#087FBA]"
              title="Call DRK Hospital helpline"
            >
              <Phone size={13} className="text-[#087FBA] shrink-0" />
              <span>{primaryPhone.number}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar - Pure White */}
      <div className="container flex min-h-[82px] items-center justify-between gap-4 py-3 bg-white">
        {/* Official DRK Logo Container */}
        <Link
          href="/"
          aria-label="DRK Hospital – Rooted in Care"
          className="group block relative shrink-0 focus:outline-none focus:ring-2 focus:ring-[#087FBA] focus:ring-offset-2 rounded-lg py-1"
        >
          <div className="relative h-13 sm:h-14 md:h-16 w-44 sm:w-52 md:w-60 flex items-center">
            <Image
              src="/images/drk-logo.png"
              alt="ROOTED IN CARE | DRK Hospital"
              fill
              priority
              className="object-contain object-left transition-opacity group-hover:opacity-95"
              sizes="(max-width: 640px) 176px, (max-width: 768px) 208px, 240px"
            />
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-1.5 lg:gap-3 text-sm lg:text-[15px] font-semibold text-[#14234B] lg:flex">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname === link.href || pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 lg:px-4 py-2 rounded-full transition-all duration-200 ${
                  isActive
                    ? "bg-[#D7F5F6] text-[#071B68] font-bold shadow-2xs"
                    : "text-[#14234B] hover:text-[#087FBA] hover:bg-slate-50"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA - Call Now button */}
        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={`tel:${primaryPhone.raw}`}
            style={{ color: "#ffffff" }}
            className="inline-flex items-center gap-2 rounded-full bg-[#071B68] px-4 lg:px-5 py-2.5 text-xs lg:text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-[#087FBA] hover:shadow-md active:translate-y-0.5"
          >
            <Phone size={15} className="text-[#10C6C1]" />
            <span style={{ color: "#ffffff" }} className="text-white font-bold">Call Now</span>
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation-menu"
          className="inline-flex items-center justify-center rounded-xl border border-[#DCE8F0] p-2.5 text-[#071B68] transition-colors hover:bg-slate-50 lg:hidden cursor-pointer"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Drawer / Overlay */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
          className="fixed inset-0 top-[125px] z-40 bg-black/40 backdrop-blur-xs lg:hidden animate-in fade-in duration-200"
        >
          <div className="bg-white px-6 py-6 border-b border-[#DCE8F0] shadow-xl max-h-[calc(100vh-125px)] overflow-y-auto">
            <nav className="flex flex-col gap-1.5">
              {navLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname === link.href || pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 text-base font-semibold transition-colors ${
                      isActive
                        ? "bg-[#D7F5F6] text-[#071B68] font-bold border-l-4 border-[#10C6C1]"
                        : "text-[#14234B] hover:bg-slate-50"
                    }`}
                  >
                    <span>{link.name}</span>
                    <ArrowUpRight
                      size={16}
                      className={isActive ? "text-[#087FBA]" : "text-slate-400"}
                    />
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Contact Quick Actions */}
            <div className="mt-6 pt-6 border-t border-[#DCE8F0] space-y-3">
              <div className="text-xs text-[#5D6B85] space-y-1 mb-3">
                <p className="flex items-center gap-2">
                  <MapPin size={13} className="text-[#087FBA]" /> {HOSPITAL_INFO.addressShort}
                </p>
                <p className="flex items-center gap-2">
                  <Clock3 size={13} className="text-[#087FBA]" /> {HOSPITAL_INFO.workingHours.displayShort}
                </p>
              </div>
              <a
                href={`tel:${HOSPITAL_INFO.phone.primaryRaw}`}
                style={{ color: "#ffffff" }}
                className="flex items-center justify-center gap-2 w-full rounded-full bg-[#071B68] py-3 text-sm font-bold text-white shadow hover:bg-[#087FBA]"
              >
                <Phone size={16} className="text-[#10C6C1]" />
                <span style={{ color: "#ffffff" }} className="text-white font-bold">Call Hospital ({HOSPITAL_INFO.phone.primary})</span>
              </a>
              <a
                href={HOSPITAL_INFO.whatsapp.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full rounded-full border border-[#10C6C1] bg-[#EFFBFC] py-3 text-sm font-bold text-[#071B68] hover:bg-teal-50"
              >
                <span>WhatsApp Enquiry</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
