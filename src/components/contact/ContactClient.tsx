"use client";

import { useState } from "react";
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
  Train,
  Bus,
  Compass,
  Building2,
  Scale,
} from "lucide-react";
import { useCMSSection } from "@/lib/useCMS";
import {
  ContactInfoContent,
  LocationMapsContent,
  PhoneContactItem,
  EmailContactItem,
  LegalIdentityContent,
} from "@/types/cms";
import {
  DEFAULT_CONTACT_INFO,
  DEFAULT_LOCATION_MAPS,
  DEFAULT_LEGAL_IDENTITY,
} from "@/lib/cms-defaults";
import { HOSPITAL_INFO } from "@/lib/hospital-info";
import { formatOperatingHours } from "@/lib/working-hours";

export default function ContactClient() {
  const [mapLoadError, setMapLoadError] = useState(false);

  const contact = useCMSSection<ContactInfoContent>(
    "contact_info",
    DEFAULT_CONTACT_INFO
  );
  const maps = useCMSSection<LocationMapsContent>(
    "contact_maps",
    DEFAULT_LOCATION_MAPS
  );
  const legal = useCMSSection<LegalIdentityContent>(
    "legal_identity",
    DEFAULT_LEGAL_IDENTITY
  );

  // Valid Google Maps embed URL check - prevents broken iframe when shortened maps.app.goo.gl link is saved
  const sanitizedEmbedUrl =
    maps.embedUrl &&
    !maps.embedUrl.includes("maps.app.goo.gl") &&
    !maps.embedUrl.includes("goo.gl") &&
    (maps.embedUrl.includes("output=embed") || maps.embedUrl.includes("/embed"))
      ? maps.embedUrl
      : "https://www.google.com/maps?q=13.1756454%2C79.6116292&z=17&output=embed";

  const directionsUrl =
    maps.shareUrl || contact.googleMapsUrl || HOSPITAL_INFO.maps.shareUrl;

  const cleanPhones = (contact.phoneNumbers || []).filter(
    (p: PhoneContactItem) =>
      !p.number?.includes("98765") &&
      !p.raw?.includes("98765") &&
      !p.label?.toLowerCase().includes("coordination")
  );

  const primaryPhone =
    cleanPhones.find((p: PhoneContactItem) => p.isPrimary && p.isActive) ||
    cleanPhones.find((p: PhoneContactItem) => p.isActive) || {
      id: "p1",
      label: "Main Hospital Helpline",
      number: "+91 63805 17153",
      raw: "+916380517153",
      isPrimary: true,
      isActive: true,
    };

  const hoursSummary = formatOperatingHours(contact.operatingHours);

  const whatsappUrl = `https://wa.me/${
    contact.whatsapp.raw && !contact.whatsapp.raw.includes("98765")
      ? contact.whatsapp.raw
      : "916380517153"
  }?text=${encodeURIComponent(
    contact.whatsapp.defaultMessage || "Hello DRK Hospitals"
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
                Contact DRK Hospitals • Tiruttani
              </span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-[#071B68] sm:text-5xl md:text-6xl leading-[1.12]">
              We Are Here to <span className="text-[#087FBA]">Help</span>
            </h1>
            <p className="mt-5 text-base sm:text-lg leading-relaxed text-[#5D6B85] max-w-2xl">
              Have questions regarding our dental, dermatological, or trichological services?
              Connect directly with our Tiruttani hospital desk, message us on WhatsApp, or visit our central facility in person.
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
                  {contact.address && !contact.address.includes("Chennai") && !contact.address.includes("Anna Salai")
                    ? contact.address
                    : HOSPITAL_INFO.address}
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
                    {hoursSummary.weekdaysText}
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span>
                    {hoursSummary.sundayText}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-[#8896AB] sm:text-right shrink-0">
              <span>* Consultation hours and holiday schedules may vary.</span>
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
                    Tiruttani Central
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#5D6B85] leading-relaxed mb-4">
                  {maps.mapDescription || "Easily accessible by road, railway, and public transit in Tiruttani, Tamil Nadu."}
                </p>

                {/* Google Maps Embed Frame */}
                {maps.isMapEnabled && (
                  <div className="relative h-[280px] sm:h-[360px] lg:h-[420px] w-full max-w-full overflow-hidden rounded-2xl border border-[#DCE8F0] bg-slate-100 shadow-2xs">
                    {!mapLoadError ? (
                      <iframe
                        title="DRK Hospitals Google Maps Location in Tiruttani, Tamil Nadu"
                        src={sanitizedEmbedUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen={false}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="absolute inset-0 h-full w-full"
                        onError={() => setMapLoadError(true)}
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#F8FDFF]">
                        <MapPin size={32} className="text-[#087FBA] mb-2" />
                        <p className="text-sm font-bold text-[#071B68] mb-1">
                          DRK Hospitals Location Pin
                        </p>
                        <p className="text-xs text-[#5D6B85] max-w-sm mb-3">
                          SF.No. 29/2A, Akkaia Naidu Street, Tiruttani, Tiruvallur – 631209, Tamil Nadu, India
                        </p>
                        <a
                          href={directionsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-full bg-[#071B68] px-4 py-2 text-xs font-bold text-white hover:bg-[#087FBA] transition"
                        >
                          <Navigation size={12} className="text-[#10C6C1]" />
                          <span>View on Google Maps</span>
                          <ExternalLink size={11} />
                        </a>
                      </div>
                    )}
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
                        {contact.address.includes(contact.city)
                          ? contact.address
                          : `${contact.address}, ${contact.city}, ${contact.state} ${contact.pincode}`}
                      </p>
                    </div>
                  </div>

                  <a
                    href={directionsUrl}
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

              {/* Card 3: Registered Corporate Entity Information */}
              <div className="card p-6 sm:p-7 bg-white border border-[#DCE8F0] shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EFFBFC] text-[#087FBA]">
                    <Building2 size={18} />
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#071B68]">
                    Corporate & Legal Entity
                  </h3>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F8FDFF] border border-[#DCE8F0]/70 text-xs text-[#5D6B85] space-y-1.5 leading-relaxed">
                  <p>
                    <span className="font-semibold text-[#071B68]">Public Hospital Brand:</span>{" "}
                    {legal.publicBrandName || HOSPITAL_INFO.name}
                  </p>
                  <p>
                    <span className="font-semibold text-[#071B68]">Registered Company:</span>{" "}
                    <span className="font-medium text-[#14234B]">
                      {legal.registeredCompanyName || HOSPITAL_INFO.legalName}
                    </span>
                  </p>
                  <p className="text-[11px] pt-1 border-t border-[#DCE8F0]/60 text-[#5D6B85]">
                    {legal.legalDescription ||
                      `${legal.publicBrandName || "DRK Hospitals"} is the public healthcare brand associated with ${legal.registeredCompanyName || "DRK Dental Skin & Hair Hospital Private Limited"}.`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Regional Patient Travel & Accessibility */}
      <section className="bg-[#F8FDFF] py-16 border-t border-[#DCE8F0]">
        <div className="container">
          <div className="max-w-3xl mb-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#DCE8F0] bg-white px-3.5 py-1 text-xs font-bold text-[#087FBA] uppercase tracking-wider mb-3">
              <Compass size={14} className="text-[#10C6C1]" />
              <span>Regional Healthcare Accessibility</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#071B68]">
              Traveling to DRK Hospitals from Surrounding Regional Towns
            </h2>
            <p className="mt-3 text-sm text-[#5D6B85] leading-relaxed">
              DRK Hospitals operates a single central outpatient facility in Tiruttani. Nearby towns represent our regional outpatient service area and patient travel connectivity, not branch clinic locations.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Arakkonam */}
            <div className="card p-6 bg-white border border-[#DCE8F0] hover:border-[#087FBA] transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#087FBA] bg-[#EFFBFC] px-2.5 py-1 rounded-full">
                  SH-58 & Rail Line
                </span>
                <Train size={18} className="text-[#10C6C1]" />
              </div>
              <h3 className="text-lg font-bold text-[#071B68]">From Arakkonam</h3>
              <p className="mt-2 text-xs text-[#5D6B85] leading-relaxed">
                Direct road route via State Highway 58 (SH-58) and frequent suburban EMU trains directly connecting Arakkonam Junction to Tiruttani Station.
              </p>
              <div className="mt-4 pt-3 border-t border-[#DCE8F0] text-[11px] font-semibold text-[#071B68]">
                <span>Road: SH-58 • Rail: Direct EMU Trains</span>
              </div>
            </div>

            {/* Pallipattu */}
            <div className="card p-6 bg-white border border-[#DCE8F0] hover:border-[#087FBA] transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#087FBA] bg-[#EFFBFC] px-2.5 py-1 rounded-full">
                  SH-61 Road Route
                </span>
                <Bus size={18} className="text-[#10C6C1]" />
              </div>
              <h3 className="text-lg font-bold text-[#071B68]">From Pallipattu</h3>
              <p className="mt-2 text-xs text-[#5D6B85] leading-relaxed">
                Direct regional transit via State Highway 61 (SH-61) with regular government and private bus connections to Tiruttani Bus Stand.
              </p>
              <div className="mt-4 pt-3 border-t border-[#DCE8F0] text-[11px] font-semibold text-[#071B68]">
                <span>Road: SH-61 • Bus: Direct TNSTC Route</span>
              </div>
            </div>

            {/* Sholinghur */}
            <div className="card p-6 bg-white border border-[#DCE8F0] hover:border-[#087FBA] transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#087FBA] bg-[#EFFBFC] px-2.5 py-1 rounded-full">
                  SH-61 Regional Road
                </span>
                <Car size={18} className="text-[#10C6C1]" />
              </div>
              <h3 className="text-lg font-bold text-[#071B68]">From Sholinghur</h3>
              <p className="mt-2 text-xs text-[#5D6B85] leading-relaxed">
                Seamless travel via Tiruttani–Sholinghur Road / SH-61 connecting Ranipet district communities with our dedicated outpatient services.
              </p>
              <div className="mt-4 pt-3 border-t border-[#DCE8F0] text-[11px] font-semibold text-[#071B68]">
                <span>Road: SH-61 • Inter-district Transit</span>
              </div>
            </div>

            {/* Nagari & Tiruvallur */}
            <div className="card p-6 bg-white border border-[#DCE8F0] hover:border-[#087FBA] transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#087FBA] bg-[#EFFBFC] px-2.5 py-1 rounded-full">
                  NH-716 Corridor
                </span>
                <Navigation size={18} className="text-[#10C6C1]" />
              </div>
              <h3 className="text-lg font-bold text-[#071B68]">From Nagari & Tiruvallur</h3>
              <p className="mt-2 text-xs text-[#5D6B85] leading-relaxed">
                Direct highway access via National Highway 716 (NH-716) for patients coming from Nagari (AP border region) and Tiruvallur headquarters.
              </p>
              <div className="mt-4 pt-3 border-t border-[#DCE8F0] text-[11px] font-semibold text-[#071B68]">
                <span>National Highway: NH-716 • Suburban Rail</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}


