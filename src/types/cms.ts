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
  desc: string;
  image?: string;
  imageAlt?: string;
  is_published: boolean;
  display_order: number;
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

export interface SEOMetadataContent {
  siteTitle: string;
  titleTemplate: string;
  defaultDescription: string;
  keywords: string[];
  ogImageUrl: string;
  canonicalBase: string;
}

// ==========================================
// 10. Module 10: Footer Settings & Logo
// ==========================================

export interface FooterSettingsContent {
  enabled: boolean;
  logoUrl: string;
  logoAlt: string;
  caption: string;
}



