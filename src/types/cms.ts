/**
 * DRK Hospital Website Content Management System (CMS) Types
 */

// ==========================================
// 1. Core CMS Section Entity
// ==========================================
export type CMSCategory =
  | "homepage"
  | "about"
  | "services"
  | "contact"
  | "location"
  | "social"
  | "seo"
  | "legal"
  | "general";

export interface CMSSectionRecord<T = unknown> {
  id: string;
  section_key: string;
  section_name: string;
  category: CMSCategory;
  content: T;
  draft_content?: T | null;
  is_published: boolean;
  has_draft: boolean;
  published_at?: string | null;
  updated_at: string;
  updated_by?: string;
}

// ==========================================
// 2. Module 2: Homepage Content Models
// ==========================================

export interface HomepageHeroContent {
  eyebrow: string;
  heading: string;
  headingHighlight: string;
  subtitle: string;
  description: string;
  primaryBtnText: string;
  primaryBtnHref: string;
  secondaryBtnText: string;
  secondaryBtnHref: string;
  clinicImage: string;
  clinicImageAlt: string;
  badgeTitle: string;
  badgeSubtitle: string;
  timingBadge: string;
}

export interface SpecialtyItem {
  id: string;
  title: string;
  tagline: string;
  desc: string;
  image: string;
  imageAlt: string;
  features: string[];
  buttonText: string;
  buttonHref: string;
}

export interface HomepageSpecialtiesContent {
  eyebrow: string;
  heading: string;
  description: string;
  items: SpecialtyItem[];
}

export interface HomepageAboutContent {
  eyebrow: string;
  heading: string;
  paragraphs: string[];
  image: string;
  imageAlt: string;
  buttonText: string;
  buttonHref: string;
  highlights: string[];
}

export interface WhyDRKAdvantage {
  id: string;
  title: string;
  desc: string;
  icon: string; // lucide icon identifier
}

export interface HomepageWhyDRKContent {
  eyebrow: string;
  heading: string;
  description: string;
  advantages: WhyDRKAdvantage[];
}

export interface FacilityPreviewItem {
  id: string;
  title: string;
  category: string;
  desc: string;
  image: string;
  imageAlt: string;
}

export interface HomepageFacilitiesContent {
  eyebrow: string;
  heading: string;
  description: string;
  buttonText: string;
  buttonHref: string;
  items: FacilityPreviewItem[];
}

export interface CareJourneyStep {
  id: string;
  stepNumber: string;
  title: string;
  desc: string;
  icon: string;
}

export interface HomepageJourneyContent {
  eyebrow: string;
  heading: string;
  description: string;
  steps: CareJourneyStep[];
}

export interface HomepageCTAContent {
  eyebrow: string;
  heading: string;
  description: string;
  primaryBtnText: string;
  primaryBtnHref: string;
  secondaryBtnText: string;
  secondaryBtnHref: string;
  backgroundImage?: string;
}

// ==========================================
// 3. Module 3: About Us Page Models
// ==========================================

export interface AboutHeroContent {
  eyebrow: string;
  heading: string;
  subtitle: string;
  description: string;
  image: string;
  imageAlt: string;
}

export interface AboutStoryContent {
  sectionTitle: string;
  eyebrow: string;
  paragraphs: string[];
  image: string;
  imageAlt: string;
  stats: Array<{ label: string; value: string }>;
}

export interface VisionMissionContent {
  visionHeading: string;
  visionText: string;
  missionHeading: string;
  missionText: string;
}

export interface PhilosophyPoint {
  id: string;
  title: string;
  desc: string;
  icon: string;
}

export interface AboutPhilosophyContent {
  eyebrow: string;
  heading: string;
  description: string;
  points: PhilosophyPoint[];
}

export interface CoreValueItem {
  id: string;
  title: string;
  desc: string;
  icon: string;
}

export interface AboutCoreValuesContent {
  eyebrow: string;
  heading: string;
  description: string;
  values: CoreValueItem[];
}

export interface ClinicalStandardItem {
  id: string;
  title: string;
  desc: string;
}

export interface AboutClinicalStandardsContent {
  eyebrow: string;
  heading: string;
  description: string;
  image: string;
  imageAlt: string;
  standards: ClinicalStandardItem[];
}

export interface AboutFacilityItem {
  id: string;
  title: string;
  desc: string;
  image: string;
  imageAlt: string;
}

export interface AboutFacilitiesContent {
  eyebrow: string;
  heading: string;
  description: string;
  items: AboutFacilityItem[];
}

export interface AboutFounderContent {
  enabled: boolean;
  sectionEyebrow: string;
  sectionHeading: string;
  sectionSubheading?: string;
  founderName: string;
  founderDesignation: string;
  founderStatement: string;
  additionalBio?: string;
  photoUrl: string;
  photoAlt: string;
  photoAlignment: "left" | "right";
  hidePhotoIfEmpty: boolean;
  displayOrder?: number;
}

// ==========================================
// 4. Module 4: Services Page Models
// ==========================================

export interface ServicesHeroContent {
  eyebrow: string;
  heading: string;
  subtitle: string;
  description: string;
  image: string;
  imageAlt: string;
}

export interface SingleServiceCard {
  id: string;
  title: string;
  slug?: string;
  desc: string;
  detailedDescription?: string;
  specialtyId?: "dental-care" | "skin-care" | "hair-care";
  image?: string;
  imageAlt?: string;
  is_published: boolean;
  display_order: number;
  seoTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
}

export interface SpecialtyServicesContent {
  departmentHeading: string;
  tagline: string;
  description: string;
  departmentImage: string;
  departmentImageAlt: string;
  services: SingleServiceCard[];
}

export interface HealthcareApproachStep {
  id: string;
  stepNumber: string;
  title: string;
  desc: string;
  icon: string;
}

export interface ServicesApproachContent {
  eyebrow: string;
  heading: string;
  description: string;
  steps: HealthcareApproachStep[];
}

// ==========================================
// 5. Module 5: Contact Information Models
// ==========================================

export interface PhoneContactItem {
  id: string;
  label: string;
  number: string;
  raw: string;
  isPrimary: boolean;
  isActive: boolean;
}

export interface EmailContactItem {
  id: string;
  label: string;
  email: string;
  isPrimary: boolean;
  isActive: boolean;
}

export interface OperatingDayItem {
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  note?: string;
}

export interface ContactInfoContent {
  hospitalName: string;
  tagline: string;
  address: string;
  locality: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  googleMapsUrl?: string;
  phoneNumbers: PhoneContactItem[];
  whatsapp: {
    number: string;
    raw: string;
    defaultMessage: string;
    buttonText: string;
    isEnabled: boolean;
  };
  emails: EmailContactItem[];
  operatingHours: OperatingDayItem[];
  visitingInfo: {
    walkInInfo: string;
    visitingInstructions: string;
    accessibilityInfo: string;
    parkingInfo?: string;
  };
}

// ==========================================
// 6. Module 6: Google Maps & Location Models
// ==========================================

export interface LocationMapsContent {
  shareUrl: string;
  embedUrl: string;
  latitude: string;
  longitude: string;
  mapTitle: string;
  mapDescription: string;
  directionsButtonText: string;
  isMapEnabled: boolean;
}

// ==========================================
// 7. Module 7: Social Media Models
// ==========================================

export type SocialPlatformType = "Instagram" | "Facebook" | "YouTube" | "LinkedIn" | "Twitter / X" | "Other";

export interface SocialMediaItem {
  id: string;
  platform: SocialPlatformType;
  label: string;
  url: string;
  icon: string;
  isActive: boolean;
  displayOrder: number;
}

export interface SocialMediaContent {
  links: SocialMediaItem[];
}

// ==========================================
// 8. Module 8: Media Library Models
// ==========================================

export type MediaCategory =
  | "Homepage Hero"
  | "Doctors and Clinical Team"
  | "Dental Care"
  | "Skin Care"
  | "Hair Care"
  | "About Hospital"
  | "Clinical Standards"
  | "Infrastructure"
  | "Reception"
  | "Medical Equipment"
  | "Hospital Activities"
  | "Other";

export interface WebsiteMediaItem {
  id: string;
  title: string;
  alt_text: string;
  description?: string | null;
  category: MediaCategory;
  storage_path: string;
  public_url: string;
  file_name: string;
  file_size?: number | null;
  mime_type?: string | null;
  dimensions?: string | null;
  created_at: string;
  updated_at: string;
}

// ==========================================
// 9. SEO & Metadata
// ==========================================

export interface LegalIdentityContent {
  publicBrandName: string;
  registeredCompanyName: string;
  legalDescription: string;
  showInFooter: boolean;
  showOnAboutPage: boolean;
  seoLegalName: string;
}

export interface SEOMetadataContent {
  // Brand & Corporate Legal Entity
  organizationName?: string;
  legalName?: string;
  alternateNames?: string[];

  // Homepage & Global Meta
  siteTitle: string;
  titleTemplate: string;
  defaultDescription: string;
  keywords: string[];
  ogImageUrl: string;
  canonicalBase: string;
  googleSiteVerification?: string;

  // Page-Specific SEO Metadata Overrides
  aboutTitle?: string;
  aboutDescription?: string;
  servicesTitle?: string;
  servicesDescription?: string;
  contactTitle?: string;
  contactDescription?: string;
}

// ==========================================
// 10. Module 10: Complete Footer Management Studio
// ==========================================

export interface FooterBrandSettings {
  logoVisible: boolean;
  logoUrl: string;
  logoAlt: string;
  logoWidth: number; // e.g. 208
  logoHeight: number; // e.g. 52
  logoAlignment: "left" | "center" | "right";
  logoBgColor: string; // default "#FFFFFF"
  caption: string;
  tagline: string; // default "ROOTED IN CARE"
  taglineVisible: boolean;
  taglineColor: string; // default "#10C6C1"
  taglineSize: "xs" | "sm" | "base";
  taglineWeight: "medium" | "semibold" | "bold" | "extrabold";
}

export interface FooterDescriptionSettings {
  heading: string;
  headingVisible: boolean;
  mainText: string;
  supportingText: string;
  textAlign: "left" | "center" | "right";
  maxWidth: "xs" | "sm" | "md" | "lg" | "full";
  fontSize: "xs" | "sm" | "base";
  textColor: string; // default "#EAF8FF"
  visible: boolean;
}

export interface FooterNavigationLink {
  id: string;
  label: string;
  url: string;
  isExternal: boolean;
  openInNewTab: boolean;
  isActive: boolean;
  order: number;
}

export interface FooterNavigationSettings {
  heading: string;
  visible: boolean;
  links: FooterNavigationLink[];
}

export interface FooterSpecialtyItem {
  id: string;
  title: string;
  description: string;
  icon: string; // "Smile" | "Sparkles" | "Scissors" | "Stethoscope" | "Shield" | "Activity" | "Heart"
  image?: string;
  url: string;
  order: number;
  isActive: boolean;
}

export interface FooterSpecialtiesSettings {
  heading: string;
  visible: boolean;
  items: FooterSpecialtyItem[];
}

export interface FooterContactButton {
  id: string;
  text: string;
  url: string;
  type: "tel" | "whatsapp" | "link";
  icon: string; // "Phone" | "MessageCircle" | "ArrowRight" | "Mail" | "MapPin"
  color: "primary" | "secondary" | "accent" | "outline";
  visible: boolean;
  order: number;
}

export interface FooterContactSettings {
  heading: string;
  visible: boolean;
  useHospitalInfo: boolean;
  // Address
  addressVisible: boolean;
  addressLine1: string;
  addressLine2: string;
  street: string;
  landmark: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  country: string;
  googleMapsUrl: string;
  addressFormat: "single" | "multi";
  // Phone
  phoneVisible: boolean;
  primaryPhone: string;
  primaryPhoneRaw: string;
  secondaryPhone: string;
  secondaryPhoneRaw: string;
  phoneLabel: string;
  clickToCall: boolean;
  // Email
  emailVisible: boolean;
  officialEmail: string;
  emailLabel: string;
  mailtoToggle: boolean;
  // WhatsApp
  whatsappVisible: boolean;
  whatsappNumber: string;
  whatsappRaw: string;
  whatsappButtonText: string;
  whatsappMessage: string;
  // Action Buttons
  buttons: FooterContactButton[];
}

export interface DayBusinessHours {
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  breakTime?: string;
  departmentNotes?: string;
}

export interface FooterBusinessHoursSettings {
  heading: string;
  visible: boolean;
  timeFormat: "12h" | "24h";
  timezone: string;
  generalAdvisory: string;
  holidayAdvisory: string;
  days: DayBusinessHours[];
}

export interface FooterSocialItem {
  id: string;
  platform: "Instagram" | "Facebook" | "YouTube" | "LinkedIn" | "Twitter" | "WhatsApp" | "Custom";
  label: string;
  url: string;
  icon: string;
  openInNewTab: boolean;
  isActive: boolean;
  order: number;
}

export interface FooterSocialSettings {
  heading: string;
  supportingLabel: string;
  visible: boolean;
  iconStyle: "circle" | "rounded" | "minimal";
  iconSize: "sm" | "md" | "lg";
  alignment: "left" | "center" | "right";
  links: FooterSocialItem[];
}

export interface FooterTrustStatement {
  id: string;
  text: string;
  icon: string; // "ShieldCheck" | "CheckCircle2" | "Heart" | "Sparkles"
  textColor: string;
  iconColor: string;
  fontSize: "xs" | "sm";
  visible: boolean;
}

export interface FooterTrustSettings {
  visible: boolean;
  alignment: "left" | "center" | "right";
  statements: FooterTrustStatement[];
}

export interface FooterBottomLink {
  id: string;
  label: string;
  url: string;
  openInNewTab: boolean;
  visible: boolean;
  order: number;
}

export interface FooterCopyrightSettings {
  visible: boolean;
  prefix: string; // "©"
  hospitalName: string; // "DRK Hospital"
  useDynamicYear: boolean;
  manualYear: string;
  tagline: string; // "ROOTED IN CARE"
  suffix: string; // "All rights reserved."
  customFullText?: string;
  useCustomFullText: boolean;
  locationLabel: string; // "Tiruttani, Tamil Nadu"
  locationVisible: boolean;
  separator: "bullet" | "pipe" | "slash" | "dash";
  links: FooterBottomLink[];
}

export interface FooterAppearanceSettings {
  bgColor: string; // default "#071B68"
  bottomBarBgColor: string; // default "#05144f"
  isGradient: boolean;
  gradientStart: string;
  gradientEnd: string;
  headingColor: string; // default "#FFFFFF"
  bodyTextColor: string; // default "#EAF8FF"
  mutedTextColor: string; // default "#99C7FF"
  accentColor: string; // default "#10C6C1"
  linkHoverColor: string; // default "#10C6C1"
  topPadding: "py-10" | "py-12" | "py-14" | "py-16" | "py-20";
  containerMaxWidth: "container" | "max-w-7xl" | "max-w-6xl" | "max-w-full";
  showTopDivider: boolean;
  dividerColor: string;
}

export interface FooterVisibilitySettings {
  showBrandColumn: boolean;
  showNavigationColumn: boolean;
  showSpecialtiesColumn: boolean;
  showContactColumn: boolean;
  showSocialIcons: boolean;
  showTrustStatement: boolean;
  showBusinessHours: boolean;
  showContactButtons: boolean;
  showCopyrightBar: boolean;
}

export interface FooterResponsiveSettings {
  desktopColumns: "4-2-3-3" | "3-3-3-3" | "4-3-3-2";
  mobileAlignment: "left" | "center";
  mobileStackOrder: "brand-first" | "contact-first";
  mobileSpacing: "compact" | "normal" | "spacious";
}

export interface FooterSettingsContent {
  // Legacy backward-compatible fields (for existing tests & code)
  enabled: boolean;
  logoUrl: string;
  logoAlt: string;
  caption: string;

  // Comprehensive Studio Settings
  brand?: FooterBrandSettings;
  description?: FooterDescriptionSettings;
  navigation?: FooterNavigationSettings;
  specialties?: FooterSpecialtiesSettings;
  contact?: FooterContactSettings;
  businessHours?: FooterBusinessHoursSettings;
  socialLinks?: FooterSocialSettings;
  trustStatements?: FooterTrustSettings;
  copyright?: FooterCopyrightSettings;
  appearance?: FooterAppearanceSettings;
  visibility?: FooterVisibilitySettings;
  responsiveLayout?: FooterResponsiveSettings;
}



