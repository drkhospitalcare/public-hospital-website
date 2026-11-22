"use client";

import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock3,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Heart,
  Sparkles,
  Smile,
  Scissors,
  Stethoscope,
  Activity,
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
  Twitter,
  Share2,
  ExternalLink,
} from "lucide-react";
import { useCMSSection } from "@/lib/useCMS";
import * as defaults from "@/lib/cms-defaults";
import {
  ContactInfoContent,
  SocialMediaContent,
  FooterSettingsContent,
} from "@/types/cms";
import SafeImage from "@/components/SafeImage";
import { HOSPITAL_INFO } from "@/lib/hospital-info";

function getSocialIcon(platform: string) {
  switch (platform?.toLowerCase()) {
    case "instagram":
      return Instagram;
    case "facebook":
      return Facebook;
    case "youtube":
      return Youtube;
    case "linkedin":
      return Linkedin;
    case "twitter":
    case "x":
      return Twitter;
    default:
      return Share2;
  }
}

function getSpecialtyIcon(iconName?: string) {
  switch (iconName?.toLowerCase()) {
    case "smile":
      return Smile;
    case "sparkles":
      return Sparkles;
    case "scissors":
      return Scissors;
    case "stethoscope":
      return Stethoscope;
    case "heart":
      return Heart;
    case "activity":
      return Activity;
    default:
      return ArrowRight;
  }
}

function getTrustIcon(iconName?: string) {
  switch (iconName?.toLowerCase()) {
    case "shieldcheck":
      return ShieldCheck;
    case "checkcircle2":
      return CheckCircle2;
    case "heart":
      return Heart;
    case "sparkles":
      return Sparkles;
    default:
      return ShieldCheck;
  }
}

function getButtonIcon(iconName?: string) {
  switch (iconName?.toLowerCase()) {
    case "phone":
      return Phone;
    case "messagecircle":
      return MessageCircle;
    case "mail":
      return Mail;
    case "mappin":
      return MapPin;
    default:
      return MessageCircle;
  }
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Subscribe to CMS Contact Details, Social Media and Footer Settings
  const contact = useCMSSection<ContactInfoContent>("contact_info", defaults.DEFAULT_CONTACT_INFO);
  const social = useCMSSection<SocialMediaContent>("social_media", defaults.DEFAULT_SOCIAL_MEDIA);
  const footerSettings = useCMSSection<FooterSettingsContent>("footer_settings", defaults.DEFAULT_FOOTER_SETTINGS);

  // Resolved Structured Configurations with Graceful Defaults
  const def = defaults.DEFAULT_FOOTER_SETTINGS;
  const brand = footerSettings.brand || def.brand!;
  const desc = footerSettings.description || def.description!;
  const nav = footerSettings.navigation || def.navigation!;
  const specs = footerSettings.specialties || def.specialties!;
  const contactConfig = footerSettings.contact || def.contact!;
  const hours = footerSettings.businessHours || def.businessHours!;
  const socialConfig = footerSettings.socialLinks || def.socialLinks!;
  const trust = footerSettings.trustStatements || def.trustStatements!;
  const copyright = footerSettings.copyright || def.copyright!;
  const appearance = footerSettings.appearance || def.appearance!;
  const visibility = footerSettings.visibility || def.visibility!;
  const responsive = footerSettings.responsiveLayout || def.responsiveLayout!;

  // Contact fallbacks (using verified hospital info, no unverified placeholder fallbacks)
  const primaryPhone =
    contact.phoneNumbers?.find((p) => p.isPrimary && p.isActive) ||
    contact.phoneNumbers?.[0] || {
      number: HOSPITAL_INFO.phone.primary,
      raw: HOSPITAL_INFO.phone.primaryRaw,
    };

  const primaryEmail =
    contact.emails?.find((e) => e.isPrimary && e.isActive) ||
    contact.emails?.[0] || {
      email: HOSPITAL_INFO.email.enquiry,
    };

  const resolvedPhone = contactConfig.primaryPhone || primaryPhone.number || HOSPITAL_INFO.phone.primary;
  const resolvedPhoneRaw = contactConfig.primaryPhoneRaw || primaryPhone.raw || HOSPITAL_INFO.phone.primaryRaw;
  const resolvedEmail = contactConfig.officialEmail || primaryEmail.email || HOSPITAL_INFO.email.enquiry;

  // Address: Verified Tiruttani hospital address
  const resolvedAddress = contactConfig.useHospitalInfo
    ? HOSPITAL_INFO.address
    : [
        contactConfig.addressLine1,
        contactConfig.addressLine2,
        contactConfig.street,
        contactConfig.landmark,
        contactConfig.city,
        contactConfig.district,
        contactConfig.state,
        contactConfig.pincode,
      ]
        .filter(Boolean)
        .join(", ") || HOSPITAL_INFO.address;

  // Social Links resolution (use footer socialLinks if populated, else fallback to social CMS section)
  const activeSocialLinks =
    socialConfig.links && socialConfig.links.length > 0
      ? socialConfig.links.filter((l) => l.isActive && l.url && l.url.trim() !== "")
      : social.links?.filter((l) => l.isActive && l.url && l.url.trim() !== "") || [];

  // Buttons resolution
  const renderedButtons =
    contactConfig.buttons && contactConfig.buttons.length > 0
      ? contactConfig.buttons.filter((b) => b.visible !== false)
      : contact.whatsapp?.isEnabled
      ? [
          {
            id: "default-wa",
            text: contact.whatsapp.buttonText || "Chat on WhatsApp",
            url: `https://wa.me/${contact.whatsapp.raw || HOSPITAL_INFO.whatsapp.raw}?text=${encodeURIComponent(
              contact.whatsapp.defaultMessage || HOSPITAL_INFO.whatsapp.message
            )}`,
            type: "whatsapp" as const,
            icon: "MessageCircle",
            color: "accent" as const,
            visible: true,
            order: 1,
          },
        ]
      : [];

  const displayedYear =
    copyright.useDynamicYear !== false ? currentYear : copyright.manualYear || currentYear;

  const separatorChar =
    copyright.separator === "pipe"
      ? "|"
      : copyright.separator === "slash"
      ? "/"
      : copyright.separator === "dash"
      ? "–"
      : "•";

  // Gradient background style
  const footerBgStyle = appearance.isGradient
    ? {
        backgroundImage: `linear-gradient(135deg, ${appearance.gradientStart || "#071B68"}, ${
          appearance.gradientEnd || "#05144f"
        })`,
      }
    : {
        backgroundColor: appearance.bgColor || "#071B68",
      };

  const isMobileCenter = responsive.mobileAlignment === "center";
  const mobileStackContactFirst = responsive.mobileStackOrder === "contact-first";

  return (
    <footer style={footerBgStyle} className="text-white">
      {/* Top Divider if enabled */}
      {appearance.showTopDivider && (
        <div
          className="w-full border-t"
          style={{ borderColor: appearance.dividerColor || "rgba(255, 255, 255, 0.15)" }}
        />
      )}

      {/* Top Footer Section */}
      <div className={`${appearance.containerMaxWidth || "container"} ${appearance.topPadding || "py-14 lg:py-16"}`}>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12">
          {/* Column 1: Brand & Description */}
          {visibility.showBrandColumn !== false && (
            <div
              className={`lg:col-span-4 space-y-5 ${
                mobileStackContactFirst ? "order-2 lg:order-1" : "order-1"
              } ${isMobileCenter ? "text-center sm:text-left flex flex-col items-center sm:items-start" : ""}`}
            >
              {/* Clean White Container for the Manageable DRK Footer Logo */}
              {footerSettings.enabled !== false && brand.logoVisible !== false ? (
                <Link
                  href="/"
                  aria-label={brand.caption || footerSettings.caption || "DRK Hospital – Rooted in Care"}
                  className="inline-block rounded-2xl bg-white p-3 sm:p-3.5 shadow-md focus:outline-hidden focus:ring-2 focus:ring-[#10C6C1] transition-opacity hover:opacity-95"
                  style={{ backgroundColor: brand.logoBgColor || "#FFFFFF" }}
                >
                  <div
                    className="relative h-12 sm:h-13 w-48 sm:w-52"
                    style={{
                      width: brand.logoWidth ? `${brand.logoWidth}px` : undefined,
                      height: brand.logoHeight ? `${brand.logoHeight}px` : undefined,
                    }}
                  >
                    <SafeImage
                      src={brand.logoUrl || footerSettings.logoUrl || "/images/drk-logo.png"}
                      alt={brand.logoAlt || footerSettings.logoAlt || "ROOTED IN CARE | DRK Hospital"}
                      fill
                      className="object-contain"
                      sizes="(max-width: 640px) 192px, 208px"
                      fallbackSrc="/images/drk-logo.png"
                    />
                  </div>
                </Link>
              ) : null}

              {/* Tagline */}
              {brand.taglineVisible !== false && (
                <p
                  className={`tracking-wider uppercase ${
                    brand.taglineSize === "xs"
                      ? "text-xs"
                      : brand.taglineSize === "base"
                      ? "text-base"
                      : "text-sm"
                  } ${
                    brand.taglineWeight === "bold"
                      ? "font-bold"
                      : brand.taglineWeight === "extrabold"
                      ? "font-extrabold"
                      : "font-semibold"
                  }`}
                  style={{ color: brand.taglineColor || "#10C6C1" }}
                >
                  {brand.tagline || contact.tagline || HOSPITAL_INFO.tagline}
                </p>
              )}

              {/* Description */}
              {desc.visible !== false && (
                <div className={`space-y-1 ${isMobileCenter ? "text-center sm:text-left" : ""}`}>
                  {desc.headingVisible && desc.heading && (
                    <h4
                      className="text-xs font-bold uppercase tracking-wider"
                      style={{ color: appearance.headingColor || "#FFFFFF" }}
                    >
                      {desc.heading}
                    </h4>
                  )}
                  <p
                    className={`leading-relaxed ${
                      desc.maxWidth === "xs"
                        ? "max-w-xs"
                        : desc.maxWidth === "md"
                        ? "max-w-md"
                        : desc.maxWidth === "lg"
                        ? "max-w-lg"
                        : desc.maxWidth === "full"
                        ? "max-w-full"
                        : "max-w-sm"
                    } ${
                      desc.fontSize === "xs"
                        ? "text-xs"
                        : desc.fontSize === "base"
                        ? "text-base"
                        : "text-sm"
                    }`}
                    style={{ color: desc.textColor || appearance.bodyTextColor || "#EAF8FF" }}
                  >
                    {desc.mainText || HOSPITAL_INFO.description}
                  </p>
                  {desc.supportingText && (
                    <p
                      className="text-xs leading-relaxed max-w-sm opacity-90 mt-1"
                      style={{ color: desc.textColor || appearance.bodyTextColor || "#EAF8FF" }}
                    >
                      {desc.supportingText}
                    </p>
                  )}
                </div>
              )}

              {/* Active Social Media Icons */}
              {visibility.showSocialIcons !== false &&
                socialConfig.visible !== false &&
                activeSocialLinks.length > 0 && (
                  <div className="pt-2">
                    <p
                      className="text-xs font-semibold uppercase tracking-wider mb-2.5"
                      style={{ color: appearance.accentColor || "#10C6C1" }}
                    >
                      {socialConfig.heading || "Follow DRK Hospital"}
                    </p>
                    <div
                      className={`flex flex-wrap items-center gap-2 ${
                        isMobileCenter ? "justify-center sm:justify-start" : ""
                      }`}
                    >
                      {activeSocialLinks.map((s) => {
                        const Icon = getSocialIcon(s.platform);
                        const openInNewTab = "openInNewTab" in s ? s.openInNewTab !== false : true;
                        const iconSizeClass =
                          socialConfig.iconSize === "sm"
                            ? "h-7 w-7"
                            : socialConfig.iconSize === "lg"
                            ? "h-10 w-10"
                            : "h-9 w-9";
                        const iconShapeClass =
                          socialConfig.iconStyle === "rounded"
                            ? "rounded-xl"
                            : socialConfig.iconStyle === "minimal"
                            ? "rounded-md"
                            : "rounded-full";

                        return (
                          <a
                            key={s.id}
                            href={s.url}
                            target={openInNewTab ? "_blank" : undefined}
                            rel={openInNewTab ? "noopener noreferrer" : undefined}
                            aria-label={s.label || s.platform}
                            title={s.label || s.platform}
                            className={`flex ${iconSizeClass} ${iconShapeClass} items-center justify-center bg-white/10 text-white transition hover:bg-[#10C6C1] hover:text-[#071B68]`}
                          >
                            <Icon size={socialConfig.iconSize === "sm" ? 14 : socialConfig.iconSize === "lg" ? 18 : 16} />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}

              {/* Trust Statements */}
              {visibility.showTrustStatement !== false &&
                trust.visible !== false &&
                trust.statements
                  .filter((st) => st.visible !== false)
                  .map((st) => {
                    const Icon = getTrustIcon(st.icon);
                    return (
                      <div
                        key={st.id}
                        className={`flex items-center gap-2 pt-1 text-xs text-blue-200 ${
                          isMobileCenter ? "justify-center sm:justify-start" : ""
                        }`}
                      >
                        <Icon size={16} className="shrink-0" style={{ color: st.iconColor || "#10C6C1" }} />
                        <span style={{ color: st.textColor || appearance.bodyTextColor || "#EAF8FF" }}>
                          {st.text}
                        </span>
                      </div>
                    );
                  })}
            </div>
          )}

          {/* Column 2: Quick Links / Explore Navigation */}
          {visibility.showNavigationColumn !== false && nav.visible !== false && (
            <div className={`lg:col-span-2 space-y-4 ${mobileStackContactFirst ? "order-3 lg:order-2" : "order-2"}`}>
              <h3
                className="text-base font-bold tracking-wide"
                style={{ color: appearance.headingColor || "#FFFFFF" }}
              >
                {nav.heading || "Explore"}
              </h3>
              <ul className="space-y-2.5 text-sm" style={{ color: appearance.bodyTextColor || "#EAF8FF" }}>
                {nav.links
                  .filter((l) => l.isActive !== false)
                  .sort((a, b) => (a.order || 0) - (b.order || 0))
                  .map((link) => (
                    <li key={link.id}>
                      {link.isExternal ? (
                        <a
                          href={link.url}
                          target={link.openInNewTab ? "_blank" : undefined}
                          rel={link.openInNewTab ? "noopener noreferrer" : undefined}
                          className="transition hover:text-[#10C6C1] hover:underline underline-offset-4 inline-flex items-center gap-1"
                        >
                          <span>{link.label}</span>
                          <ExternalLink size={12} className="opacity-70" />
                        </a>
                      ) : (
                        <Link
                          href={link.url}
                          className="transition hover:text-[#10C6C1] hover:underline underline-offset-4"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {/* Column 3: Specialties */}
          {visibility.showSpecialtiesColumn !== false && specs.visible !== false && (
            <div className={`lg:col-span-3 space-y-4 ${mobileStackContactFirst ? "order-4 lg:order-3" : "order-3"}`}>
              <h3
                className="text-base font-bold tracking-wide"
                style={{ color: appearance.headingColor || "#FFFFFF" }}
              >
                {specs.heading || "Our Specialties"}
              </h3>
              <ul className="space-y-3 text-sm" style={{ color: appearance.bodyTextColor || "#EAF8FF" }}>
                {specs.items
                  .filter((item) => item.isActive !== false)
                  .sort((a, b) => (a.order || 0) - (b.order || 0))
                  .map((item) => {
                    return (
                      <li key={item.id}>
                        <Link href={item.url} className="group block transition hover:text-[#10C6C1]">
                          <span className="font-semibold text-white group-hover:text-[#10C6C1] flex items-center gap-1.5">
                            {item.title}
                            <ArrowRight size={13} className="text-[#10C6C1] opacity-0 transition group-hover:opacity-100" />
                          </span>
                          {item.description && (
                            <span
                              className="block text-xs mt-0.5 line-clamp-1"
                              style={{ color: appearance.mutedTextColor || "#99C7FF" }}
                            >
                              {item.description}
                            </span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
              </ul>
            </div>
          )}

          {/* Column 4: Contact Details & Hours */}
          {visibility.showContactColumn !== false && contactConfig.visible !== false && (
            <div className={`lg:col-span-3 space-y-4 ${mobileStackContactFirst ? "order-1 lg:order-4" : "order-4"}`}>
              <h3
                className="text-base font-bold tracking-wide"
                style={{ color: appearance.headingColor || "#FFFFFF" }}
              >
                {contactConfig.heading || "Contact & Hours"}
              </h3>
              <div className="space-y-3 text-sm" style={{ color: appearance.bodyTextColor || "#EAF8FF" }}>
                {/* Hospital Address */}
                {contactConfig.addressVisible !== false && (
                  <div className="flex items-start gap-2.5">
                    <MapPin size={17} className="text-[#10C6C1] shrink-0 mt-0.5" />
                    {contactConfig.googleMapsUrl ? (
                      <a
                        href={contactConfig.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#10C6C1] transition"
                      >
                        {resolvedAddress}
                      </a>
                    ) : (
                      <span>{resolvedAddress}</span>
                    )}
                  </div>
                )}

                {/* Primary Phone */}
                {contactConfig.phoneVisible !== false && (
                  <div className="flex items-center gap-2.5">
                    <Phone size={17} className="text-[#10C6C1] shrink-0" />
                    <a href={`tel:${resolvedPhoneRaw}`} className="hover:text-[#10C6C1] transition font-medium">
                      {resolvedPhone}
                    </a>
                  </div>
                )}

                {/* Email Address */}
                {contactConfig.emailVisible !== false && (
                  <div className="flex items-center gap-2.5">
                    <Mail size={17} className="text-[#10C6C1] shrink-0" />
                    <a href={`mailto:${resolvedEmail}`} className="hover:text-[#10C6C1] transition">
                      {resolvedEmail}
                    </a>
                  </div>
                )}

                {/* Clinical Business Hours */}
                {visibility.showBusinessHours !== false && hours.visible !== false && (
                  <div className="flex items-start gap-2.5">
                    <Clock3 size={17} className="text-[#10C6C1] shrink-0 mt-0.5" />
                    <div className="text-xs space-y-0.5">
                      <p>Mon – Sat: 8:00 AM – 8:00 PM</p>
                      <p>Sunday: 9:00 AM – 1:00 PM (Consultation)</p>
                      {hours.generalAdvisory && (
                        <p className="text-[10px] text-blue-300/80 pt-0.5">{hours.generalAdvisory}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons (WhatsApp / Reception Call) */}
              {visibility.showContactButtons !== false && renderedButtons.length > 0 && (
                <div className="pt-2 flex flex-wrap gap-2">
                  {renderedButtons.map((btn) => {
                    const Icon = getButtonIcon(btn.icon);
                    return (
                      <a
                        key={btn.id}
                        href={btn.url}
                        target={btn.type === "whatsapp" || btn.url.startsWith("http") ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-bold transition ${
                          btn.color === "accent"
                            ? "bg-[#10C6C1] text-[#071B68] hover:bg-[#0da39f] hover:text-white"
                            : btn.color === "primary"
                            ? "bg-[#087FBA] text-white hover:bg-[#071B68]"
                            : "border border-white/20 text-white hover:bg-white/10"
                        }`}
                      >
                        <Icon size={15} />
                        <span>{btn.text}</span>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Copyright & Bottom Bar */}
      {visibility.showCopyrightBar !== false && copyright.visible !== false && (
        <div
          className="border-t border-white/15"
          style={{ backgroundColor: appearance.bottomBarBgColor || "#05144f" }}
        >
          <div className="container flex flex-col items-center justify-between gap-3 py-5 text-center text-xs sm:flex-row sm:text-left text-blue-200">
            <p>
              {copyright.useCustomFullText && copyright.customFullText ? (
                copyright.customFullText
              ) : (
                <>
                  {copyright.prefix || "©"} {displayedYear} {copyright.hospitalName || "DRK Hospital"}.{" "}
                  {copyright.tagline || "ROOTED IN CARE"}. {copyright.suffix || "All rights reserved."}
                </>
              )}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs text-blue-300">
              {copyright.locationVisible !== false && (
                <span>{copyright.locationLabel || HOSPITAL_INFO.addressShort}</span>
              )}
              {copyright.links
                .filter((l) => l.visible !== false)
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((link) => (
                  <span key={link.id} className="inline-flex items-center gap-3 sm:gap-4">
                    <span>{separatorChar}</span>
                    <Link
                      href={link.url}
                      target={link.openInNewTab ? "_blank" : undefined}
                      rel={link.openInNewTab ? "noopener noreferrer" : undefined}
                      className="hover:text-white transition"
                    >
                      {link.label}
                    </Link>
                  </span>
                ))}
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
