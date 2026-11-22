"use client";

import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock3,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
  Share2,
} from "lucide-react";
import { useCMSSection } from "@/lib/useCMS";
import * as defaults from "@/lib/cms-defaults";
import { ContactInfoContent, SocialMediaContent, FooterSettingsContent } from "@/types/cms";
import SafeImage from "@/components/SafeImage";

function getSocialIcon(platform: string) {
  switch (platform) {
    case "Instagram":
      return Instagram;
    case "Facebook":
      return Facebook;
    case "YouTube":
      return Youtube;
    case "LinkedIn":
      return Linkedin;
    default:
      return Share2;
  }
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Subscribe to CMS Contact Details, Social Media and Footer Settings
  const contact = useCMSSection<ContactInfoContent>("contact_info", defaults.DEFAULT_CONTACT_INFO);
  const social = useCMSSection<SocialMediaContent>("social_media", defaults.DEFAULT_SOCIAL_MEDIA);
  const footerSettings = useCMSSection<FooterSettingsContent>("footer_settings", defaults.DEFAULT_FOOTER_SETTINGS);

  const primaryPhone =
    contact.phoneNumbers.find((p) => p.isPrimary && p.isActive) ||
    contact.phoneNumbers[0] || {
      number: "+91 44 2345 6789",
      raw: "+914423456789",
    };

  const primaryEmail =
    contact.emails.find((e) => e.isPrimary && e.isActive) ||
    contact.emails[0] || {
      email: "enquiries@drkhospital.com",
    };

  const activeSocialLinks = social.links.filter(
    (l) => l.isActive && l.url && l.url.trim() !== ""
  );

  return (
    <footer className="bg-[#071B68] text-white">
      {/* Top Footer Section */}
      <div className="container py-14 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-5">
            {/* Clean White Container for the Manageable DRK Footer Logo */}
            {footerSettings.enabled ? (
              <Link
                href="/"
                aria-label={footerSettings.caption || "DRK Hospital – Rooted in Care"}
                className="inline-block rounded-2xl bg-white p-3 sm:p-3.5 shadow-md focus:outline-hidden focus:ring-2 focus:ring-[#10C6C1] transition-opacity hover:opacity-95"
              >
                <div className="relative h-12 sm:h-13 w-48 sm:w-52">
                  <SafeImage
                    src={footerSettings.logoUrl || "/images/drk-logo.png"}
                    alt={footerSettings.logoAlt || "ROOTED IN CARE | DRK Hospital"}
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 192px, 208px"
                    fallbackSrc="/images/drk-logo.png"
                  />
                </div>
              </Link>
            ) : null}

            <p className="text-sm font-semibold tracking-wider text-[#10C6C1] uppercase">
              {contact.tagline}
            </p>

            <p className="text-sm leading-relaxed text-blue-100 max-w-sm">
              DRK Hospital is committed to delivering modern, compassionate, and ethical clinical
              care across Dental, Skin, and Hair health in Chennai, Tamil Nadu.
            </p>

            {/* Active Social Media Icons */}
            {activeSocialLinks.length > 0 && (
              <div className="pt-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#10C6C1] mb-2.5">
                  Follow DRK Hospital
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {activeSocialLinks.map((s) => {
                    const Icon = getSocialIcon(s.platform);
                    return (
                      <a
                        key={s.id}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.label || s.platform}
                        title={s.label || s.platform}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-[#10C6C1] hover:text-[#071B68]"
                      >
                        <Icon size={16} />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 pt-1 text-xs text-blue-200">
              <ShieldCheck size={16} className="text-[#10C6C1] shrink-0" />
              <span>Patient-Centric & Ethical Healthcare</span>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-base font-bold text-white tracking-wide">Explore</h3>
            <ul className="space-y-2.5 text-sm text-blue-100">
              <li>
                <Link href="/" className="transition hover:text-[#10C6C1] hover:underline underline-offset-4">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="transition hover:text-[#10C6C1] hover:underline underline-offset-4">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="transition hover:text-[#10C6C1] hover:underline underline-offset-4">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="transition hover:text-[#10C6C1] hover:underline underline-offset-4">
                  Hospital Gallery
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition hover:text-[#10C6C1] hover:underline underline-offset-4">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Specialties Column */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-base font-bold text-white tracking-wide">Our Specialties</h3>
            <ul className="space-y-3 text-sm text-blue-100">
              <li>
                <Link href="/services#dental-care" className="group block transition hover:text-[#10C6C1]">
                  <span className="font-semibold text-white group-hover:text-[#10C6C1] flex items-center gap-1.5">
                    Dental Care
                    <ArrowRight size={13} className="text-[#10C6C1] opacity-0 transition group-hover:opacity-100" />
                  </span>
                  <span className="block text-xs text-blue-200 mt-0.5 line-clamp-1">
                    Advanced preventive, restorative, and smile dentistry
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/services#skin-care" className="group block transition hover:text-[#10C6C1]">
                  <span className="font-semibold text-white group-hover:text-[#10C6C1] flex items-center gap-1.5">
                    Skin Care
                    <ArrowRight size={13} className="text-[#10C6C1] opacity-0 transition group-hover:opacity-100" />
                  </span>
                  <span className="block text-xs text-blue-200 mt-0.5 line-clamp-1">
                    Clinical dermatology and evidence-based skin therapies
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/services#hair-care" className="group block transition hover:text-[#10C6C1]">
                  <span className="font-semibold text-white group-hover:text-[#10C6C1] flex items-center gap-1.5">
                    Hair Care
                    <ArrowRight size={13} className="text-[#10C6C1] opacity-0 transition group-hover:opacity-100" />
                  </span>
                  <span className="block text-xs text-blue-200 mt-0.5 line-clamp-1">
                    Trichology, scalp health diagnostics, and hair revitalization
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details Column */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-base font-bold text-white tracking-wide">Contact & Hours</h3>
            <div className="space-y-3 text-sm text-blue-100">
              <div className="flex items-start gap-2.5">
                <MapPin size={17} className="text-[#10C6C1] shrink-0 mt-0.5" />
                <span>{contact.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={17} className="text-[#10C6C1] shrink-0" />
                <a href={`tel:${primaryPhone.raw}`} className="hover:text-[#10C6C1] transition">
                  {primaryPhone.number}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={17} className="text-[#10C6C1] shrink-0" />
                <a href={`mailto:${primaryEmail.email}`} className="hover:text-[#10C6C1] transition">
                  {primaryEmail.email}
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock3 size={17} className="text-[#10C6C1] shrink-0 mt-0.5" />
                <div className="text-xs space-y-0.5">
                  <p>Mon – Sat: 8:00 AM – 8:00 PM</p>
                  <p>Sunday: 9:00 AM – 1:00 PM (Consultation)</p>
                </div>
              </div>
            </div>

            {/* WhatsApp Direct Action */}
            {contact.whatsapp.isEnabled && (
              <div className="pt-2">
                <a
                  href={`https://wa.me/${contact.whatsapp.raw}?text=${encodeURIComponent(
                    contact.whatsapp.defaultMessage
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#10C6C1] px-4 py-2.5 text-xs font-bold text-[#071B68] transition hover:bg-[#0da39f] hover:text-white"
                >
                  <MessageCircle size={15} />
                  <span>{contact.whatsapp.buttonText}</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Copyright & Accreditation Line */}
      <div className="border-t border-white/15 bg-[#05144f]">
        <div className="container flex flex-col items-center justify-between gap-3 py-5 text-center text-xs text-blue-200 sm:flex-row sm:text-left">
          <p>© {currentYear} DRK Hospital. ROOTED IN CARE. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs text-blue-300">
            <span>
              {contact.city}, {contact.state}
            </span>
            <span>•</span>
            <Link href="/about" className="hover:text-white transition">
              About DRK
            </Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-white transition">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
