"use client";

import Link from "next/link";
import { ArrowRight, Clock, MapPin, MessageCircle, Phone } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { useCMSSection } from "@/lib/useCMS";
import { ContactInfoContent, PhoneContactItem } from "@/types/cms";
import { DEFAULT_CONTACT_INFO } from "@/lib/cms-defaults";

interface ContactCTAProps {
  title?: string;
  description?: string;
  eyebrow?: string;
}

export default function ContactCTA({
  title = "Have Questions or Need Clinical Guidance?",
  description = "Connect with our front desk team in Chennai. We are here to assist with department enquiries, clinic timings, and general consultation guidance.",
  eyebrow = "Connect With DRK Hospital",
}: ContactCTAProps) {
  const contact = useCMSSection<ContactInfoContent>(
    "contact_info",
    DEFAULT_CONTACT_INFO
  );

  const primaryPhone =
    contact.phoneNumbers.find((p: PhoneContactItem) => p.isPrimary && p.isActive) ||
    contact.phoneNumbers[0] || {
      number: "+91 44 2345 6789",
      raw: "+914423456789",
    };

  const weekdayHours =
    contact.operatingHours.find((o) => o.day === "Monday") || {
      openTime: "08:00 AM",
      closeTime: "08:00 PM",
    };

  const whatsappUrl = `https://wa.me/${contact.whatsapp.raw || "919876543210"}?text=${encodeURIComponent(
    contact.whatsapp.defaultMessage || "Hello DRK Hospital"
  )}`;

  return (
    <section className="bg-gradient-to-b from-[#EFFBFC] to-white py-16 md:py-20 border-t border-[#DCE8F0]">
      <div className="container max-w-4xl text-center">
        <AnimatedSection>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#DCE8F0] bg-white px-4 py-1.5 shadow-2xs mb-4">
            <span className="h-2 w-2 rounded-full bg-[#10C6C1]" />
            <span className="text-xs font-bold tracking-wider text-[#071B68] uppercase">
              {eyebrow}
            </span>
          </div>

          <h2 className="text-3xl font-extrabold text-[#071B68] sm:text-4xl">
            {title}
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[#5D6B85] leading-relaxed max-w-2xl mx-auto">
            {description}
          </p>

          {/* Quick Details Ribbon */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-semibold text-[#071B68]">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-[#087FBA]" />
              <span>{contact.locality || contact.city}, Chennai</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-[#10C6C1]" />
              <span>Mon – Sat: {weekdayHours.openTime} – {weekdayHours.closeTime}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href={`tel:${primaryPhone.raw}`}
              className="btn-primary"
            >
              <Phone size={17} />
              <span>Call Reception ({primaryPhone.number})</span>
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[#10C6C1] bg-white px-6 py-3 text-sm font-bold text-[#071B68] shadow-xs hover:bg-[#EFFBFC] hover:border-[#087FBA] transition-all"
            >
              <MessageCircle size={17} className="text-[#10C6C1]" />
              <span>{contact.whatsapp.buttonText || "WhatsApp Us"}</span>
            </a>

            <Link href="/contact" className="btn-outline">
              <span>Contact Page</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
