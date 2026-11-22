"use client";

import Link from "next/link";
import {
  MapPin,
  Phone,
  Clock3,
  Mail,
  MessageCircle,
  ExternalLink,
  ChevronRight,
  Navigation,
  ShieldCheck,
  Car,
  Accessibility,
  CheckCircle2,
} from "lucide-react";
import { useCMSSection } from "@/lib/useCMS";
import {
  ContactInfoContent,
  LocationMapsContent,
  PhoneContactItem,
  EmailContactItem,
} from "@/types/cms";
import {
  DEFAULT_CONTACT_INFO,
  DEFAULT_LOCATION_MAPS,
} from "@/lib/cms-defaults";

export default function ContactClient() {
  const contact = useCMSSection<ContactInfoContent>(
    "contact_info",
    DEFAULT_CONTACT_INFO
  );
  const maps = useCMSSection<LocationMapsContent>(
    "contact_maps",
    DEFAULT_LOCATION_MAPS
  );

  const primaryPhone =
    contact.phoneNumbers.find((p: PhoneContactItem) => p.isPrimary && p.isActive) ||
    contact.phoneNumbers[0] || {
      id: "p1",
      label: "Primary Desk",
      number: "+91 44 2345 6789",
      raw: "+914423456789",
      isPrimary: true,
      isActive: true,
    };
  const secondaryPhone = contact.phoneNumbers.find(
    (p: PhoneContactItem) => !p.isPrimary && p.isActive
  ) || contact.phoneNumbers[1];

  const weekdayHours =
    contact.operatingHours.find((o) => o.day === "Monday") || {
      openTime: "08:00 AM",
      closeTime: "08:00 PM",
    };
  const sundayHours =
    contact.operatingHours.find((o) => o.day === "Sunday") || {
      isOpen: true,
      openTime: "09:00 AM",
      closeTime: "01:00 PM",
    };

  const whatsappUrl = `https://wa.me/${contact.whatsapp.raw || "919876543210"}?text=${encodeURIComponent(
    contact.whatsapp.defaultMessage || "Hello DRK Hospital"
  )}`;

  return (
    <>
      {/* Hero Banner with Approved Light-Blue Gradient */}
      <section
        className="relative overflow-hidden pt-10 pb-16 md:pt-14 md:pb-20 border-b border-[#DCE8F0]"
        style={{
          background:
            "radial-gradient(ellipse at 95% 50%, rgba(135, 220, 255, 0.30) 0%, transparent 48%), radial-gradient(ellipse at 85% 100%, rgba(16, 198, 193, 0.10) 0%, transparent 35%), linear-gradient(110deg, #FFFFFF 0%, #FFFFFF 48%, #F4FBFF 75%, #EAF8FF 100%)",
        }}
      >
        <div className="container relative">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-1.5 text-xs font-semibold text-[#5D6B85]">
              <li>
                <Link href="/" className="hover:text-[#087FBA] transition">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight size={14} className="text-[#8896AB]" />
              </li>
              <li className="text-[#071B68]" aria-current="page">
                Contact
              </li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#DCE8F0] bg-white px-4 py-1.5 shadow-2xs mb-4">
              <Phone size={14} className="text-[#087FBA]" />
              <span className="text-xs font-bold tracking-wider text-[#071B68] uppercase">
                Contact DRK Hospital • Chennai
              </span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-[#071B68] sm:text-5xl md:text-6xl leading-[1.12]">
              We Are Here to <span className="text-[#087FBA]">Help</span>
            </h1>
            <p className="mt-5 text-base sm:text-lg leading-relaxed text-[#5D6B85] max-w-2xl">
              Have questions regarding our dental, dermatological, or trichological services?
              Connect directly with our Chennai hospital desk, message us on WhatsApp, or visit our central facility in person.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information Cards (4-Card Grid) */}
      <section className="section bg-white border-b border-[#DCE8F0]">
        <div className="container">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* 1. Address Card */}
            <div className="card p-6 flex flex-col justify-between border border-[#DCE8F0] bg-white hover:border-[#087FBA] transition-all">
              <div>
                <div className="inline-flex rounded-2xl bg-[#EFFBFC] p-3 text-[#087FBA] mb-4">
                  <MapPin size={24} />
                </div>
                <h3 className="text-base font-bold text-[#071B68]">Hospital Location</h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#5D6B85]">
                  {contact.address}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#DCE8F0]/80">
                <span className="text-[11px] font-bold text-[#087FBA] block">
                  {contact.city}, {contact.state} {contact.pincode}
                </span>
              </div>
            </div>

            {/* 2. Phone Calls Card */}
            <div className="card p-6 flex flex-col justify-between border border-[#DCE8F0] bg-white hover:border-[#087FBA] transition-all">
              <div>
                <div className="inline-flex rounded-2xl bg-[#EFFBFC] p-3 text-[#087FBA] mb-4">
                  <Phone size={24} />
                </div>
                <h3 className="text-base font-bold text-[#071B68]">Helpline & Calls</h3>
                <div className="mt-2 space-y-1 text-xs sm:text-sm text-[#5D6B85]">
                  <p>
                    <a
                      href={`tel:${primaryPhone.raw}`}
                      className="font-bold text-[#071B68] hover:text-[#087FBA] transition"
                    >
                      {primaryPhone.number}
                    </a>
                    <span className="block text-[11px] text-[#8896AB]">{primaryPhone.label}</span>
                  </p>
                  {secondaryPhone && (
                    <p className="pt-1">
                      <a
                        href={`tel:${secondaryPhone.raw}`}
                        className="font-semibold text-[#071B68] hover:text-[#087FBA] transition"
                      >
                        {secondaryPhone.number}
                      </a>
                      <span className="block text-[11px] text-[#8896AB]">{secondaryPhone.label}</span>
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-[#DCE8F0]/80">
                <a
                  href={`tel:${primaryPhone.raw}`}
                  className="text-xs font-bold text-[#087FBA] hover:underline"
                >
                  Tap to Call Now →
                </a>
              </div>
            </div>

            {/* 3. WhatsApp Messaging Card */}
            <div className="card p-6 flex flex-col justify-between border border-[#DCE8F0] bg-white hover:border-[#10C6C1] transition-all">
              <div>
                <div className="inline-flex rounded-2xl bg-[#EFFBFC] p-3 text-[#10C6C1] mb-4">
                  <MessageCircle size={24} />
                </div>
                <h3 className="text-base font-bold text-[#071B68]">WhatsApp Chat</h3>
                <p className="mt-2 text-xs sm:text-sm text-[#5D6B85] leading-relaxed">
                  Fastest way to get clinical guidance, department information, and timing updates.
                </p>
                <p className="mt-1 font-bold text-xs text-[#071B68]">
                  {contact.whatsapp.number}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#DCE8F0]/80">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-[#10C6C1] hover:underline"
                >
                  {contact.whatsapp.buttonText || "Start WhatsApp Chat"} →
                </a>
              </div>
            </div>

            {/* 4. Email Card */}
            <div className="card p-6 flex flex-col justify-between border border-[#DCE8F0] bg-white hover:border-[#071B68] transition-all">
              <div>
                <div className="inline-flex rounded-2xl bg-[#EFFBFC] p-3 text-[#071B68] mb-4">
                  <Mail size={24} />
                </div>
                <h3 className="text-base font-bold text-[#071B68]">Email Inquiries</h3>
                <div className="mt-2 space-y-1 text-xs sm:text-sm text-[#5D6B85]">
                  {contact.emails.map((item: EmailContactItem, idx: number) => (
                    <p key={item.id || idx} className={idx > 0 ? "pt-1" : ""}>
                      <a
                        href={`mailto:${item.email}`}
                        className="font-semibold text-[#071B68] hover:text-[#087FBA] transition block truncate"
                      >
                        {item.email}
                      </a>
                      <span className="block text-[11px] text-[#8896AB]">{item.label}</span>
                    </p>
                  ))}
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-[#DCE8F0]/80">
                {contact.emails[0] && (
                  <a
                    href={`mailto:${contact.emails[0].email}`}
                    className="text-xs font-bold text-[#071B68] hover:underline"
                  >
                    Send an Email →
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Operating Hours Banner */}
          <div className="mt-8 rounded-2xl border border-[#DCE8F0] bg-[#F8FDFF] p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white border border-[#DCE8F0] text-[#087FBA] shadow-2xs">
                <Clock3 size={22} />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-[#071B68]">
                  Hospital Working Hours
                </h4>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-0.5 text-xs text-[#5D6B85] mt-0.5">
                  <span className="font-semibold text-[#071B68]">
                    Mon – Sat: {weekdayHours.openTime} – {weekdayHours.closeTime}
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span>
                    Sun: {sundayHours.isOpen ? `${sundayHours.openTime} – ${sundayHours.closeTime}` : "Closed"}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-[#8896AB] sm:text-right shrink-0">
              <span>* Emergency services and holiday schedules may vary.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Section: Hospital Location Map & Patient Advisory Center */}
      <section className="section bg-[#F8FDFF]">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-12 items-start">
            {/* Left Column: Interactive Google Map & Access Information (7 Columns) */}
            <div className={maps.isMapEnabled ? "min-w-0 lg:col-span-7" : "min-w-0 lg:col-span-12"}>
              <div className="card p-5 sm:p-8 bg-white border border-[#DCE8F0] shadow-sm flex flex-col min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#087FBA] mb-1">
                      <MapPin size={14} className="text-[#087FBA]" />
                      <span>Hospital Location & Access</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#071B68]">
                      {maps.mapTitle || "Hospital Location Map"}
                    </h2>
                  </div>
                  <span className="inline-flex items-center self-start sm:self-auto text-xs font-bold text-[#087FBA] bg-[#EFFBFC] px-3 py-1 rounded-full border border-[#DCE8F0]">
                    Chennai Central
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#5D6B85] leading-relaxed mb-4">
                  {maps.mapDescription || "Easily accessible by road, metro, and public transit in Chennai, Tamil Nadu."}
                </p>

                {/* Google Maps Embed Frame */}
                {maps.isMapEnabled && (
                  <div className="relative h-[280px] sm:h-[360px] lg:h-[420px] w-full max-w-full overflow-hidden rounded-2xl border border-[#DCE8F0] bg-slate-100 shadow-2xs">
                    <iframe
                      title="DRK Hospital Google Maps Location in Chennai, Tamil Nadu"
                      src={maps.embedUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen={false}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="absolute inset-0 h-full w-full"
                    />
                  </div>
                )}

                {/* Map Directions & Official Address Bar */}
                <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[#DCE8F0]">
                  <div className="flex items-start gap-2.5">
                    <MapPin size={18} className="text-[#087FBA] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-[#071B68]">
                        Official Hospital Address
                      </p>
                      <p className="text-xs text-[#5D6B85]">
                        {contact.address}, {contact.city}, {contact.state} {contact.pincode}
                      </p>
                    </div>
                  </div>

                  <a
                    href={maps.shareUrl || "https://maps.google.com/?q=Chennai+Tamil+Nadu"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer inline-flex items-center justify-center gap-1.5 rounded-full bg-[#071B68] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#087FBA] transition shadow-xs shrink-0"
                  >
                    <Navigation size={13} className="text-[#10C6C1]" />
                    <span>{maps.directionsButtonText || "Get Driving Directions"}</span>
                    <ExternalLink size={12} />
                  </a>
                </div>

                {/* Facility Accessibility Highlights */}
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-[#DCE8F0]/80">
                  <div className="flex items-center gap-2 text-xs text-[#5D6B85] bg-[#F8FDFF] p-2.5 rounded-xl border border-[#DCE8F0]/60">
                    <Car size={16} className="text-[#087FBA] shrink-0" />
                    <span>On-Site Patient Parking</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#5D6B85] bg-[#F8FDFF] p-2.5 rounded-xl border border-[#DCE8F0]/60">
                    <Accessibility size={16} className="text-[#10C6C1] shrink-0" />
                    <span>Wheelchair Accessible</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#5D6B85] bg-[#F8FDFF] p-2.5 rounded-xl border border-[#DCE8F0]/60">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <span>Walk-Ins Welcome</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Direct Contact Helplines & Patient Visiting Advisories (5 Columns) */}
            <div className={maps.isMapEnabled ? "min-w-0 lg:col-span-5 flex flex-col gap-6" : "min-w-0 lg:col-span-12 grid gap-6 md:grid-cols-2"}>
              {/* Card 1: Immediate Assistance & Direct Connect Options */}
              <div className="card p-5 sm:p-7 bg-white border border-[#DCE8F0] shadow-sm min-w-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="inline-flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[#071B68]">
                      Direct Contact Helplines
                    </h3>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    Reception Active
                  </span>
                </div>

                <p className="text-xs text-[#5D6B85] leading-relaxed mb-4">
                  For immediate clinical enquiries, appointments guidance, or directions assistance, contact our hospital desk directly:
                </p>

                <div className="space-y-3">
                  {/* Call Helpline Action */}
                  <div className="p-3.5 rounded-xl border border-[#DCE8F0] bg-[#F8FDFF] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-[#DCE8F0] text-[#087FBA] shadow-2xs">
                        <Phone size={18} />
                      </div>
                      <div>
                        <span className="block text-[11px] font-semibold text-[#8896AB] uppercase">
                          {primaryPhone.label}
                        </span>
                        <a
                          href={`tel:${primaryPhone.raw}`}
                          className="text-sm font-black text-[#071B68] hover:text-[#087FBA] transition"
                        >
                          {primaryPhone.number}
                        </a>
                      </div>
                    </div>
                    <a
                      href={`tel:${primaryPhone.raw}`}
                      className="cursor-pointer inline-flex items-center gap-1 rounded-full bg-[#071B68] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#087FBA] transition shadow-2xs shrink-0"
                    >
                      <span>Call Now</span>
                    </a>
                  </div>

                  {/* Secondary Phone if Available */}
                  {secondaryPhone && (
                    <div className="p-3.5 rounded-xl border border-[#DCE8F0] bg-[#F8FDFF] flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-[#DCE8F0] text-[#087FBA] shadow-2xs">
                          <Phone size={18} />
                        </div>
                        <div>
                          <span className="block text-[11px] font-semibold text-[#8896AB] uppercase">
                            {secondaryPhone.label}
                          </span>
                          <a
                            href={`tel:${secondaryPhone.raw}`}
                            className="text-sm font-bold text-[#071B68] hover:text-[#087FBA] transition"
                          >
                            {secondaryPhone.number}
                          </a>
                        </div>
                      </div>
                      <a
                        href={`tel:${secondaryPhone.raw}`}
                        className="cursor-pointer inline-flex items-center gap-1 rounded-full border border-[#DCE8F0] bg-white px-3.5 py-1.5 text-xs font-bold text-[#071B68] hover:bg-[#EFFBFC] transition shadow-2xs shrink-0"
                      >
                        <span>Call</span>
                      </a>
                    </div>
                  )}

                  {/* WhatsApp Direct Action */}
                  <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-emerald-200 text-[#10C6C1] shadow-2xs">
                        <MessageCircle size={18} className="text-emerald-600" />
                      </div>
                      <div>
                        <span className="block text-[11px] font-semibold text-emerald-800 uppercase">
                          WhatsApp Helpdesk
                        </span>
                        <span className="text-xs font-bold text-[#071B68]">
                          {contact.whatsapp.number}
                        </span>
                      </div>
                    </div>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cursor-pointer inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition shadow-2xs shrink-0"
                    >
                      <MessageCircle size={12} />
                      <span>{contact.whatsapp.buttonText || "WhatsApp"}</span>
                    </a>
                  </div>
                </div>

                <p className="mt-3 text-[11px] text-[#8896AB]">
                  * Direct telephone and WhatsApp helplines are attended during regular operating hours.
                </p>
              </div>

              {/* Card 2: Patient Visiting Advisories */}
              <div className="card p-6 sm:p-7 bg-white border border-[#DCE8F0] shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EFFBFC] text-[#087FBA]">
                    <ShieldCheck size={18} />
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#071B68]">
                    Patient Visiting Advisories
                  </h3>
                </div>

                <div className="space-y-3.5 text-xs text-[#5D6B85] leading-relaxed">
                  <div className="p-3 rounded-xl bg-[#F8FDFF] border border-[#DCE8F0]/70">
                    <strong className="block text-[#071B68] font-bold mb-0.5">
                      Walk-in Consultations
                    </strong>
                    <span>{contact.visitingInfo.walkInInfo}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F8FDFF] border border-[#DCE8F0]/70">
                    <strong className="block text-[#071B68] font-bold mb-0.5">
                      Wheelchair & Accessibility Support
                    </strong>
                    <span>{contact.visitingInfo.accessibilityInfo}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F8FDFF] border border-[#DCE8F0]/70">
                    <strong className="block text-[#071B68] font-bold mb-0.5">
                      Visiting & Registration Instructions
                    </strong>
                    <span>{contact.visitingInfo.visitingInstructions}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}


