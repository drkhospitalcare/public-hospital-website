"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  RefreshCw,
  Copy,
  Terminal,
} from "lucide-react";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import {
  getAdminSection,
  saveSectionDraft,
  publishSection,
  discardSectionDraft,
  checkCMSTablesReady,
  getDefaultContentForSection,
} from "@/lib/cms";
import * as defaults from "@/lib/cms-defaults";
import {
  HomepageHeroContent,
  HomepageSpecialtiesContent,
  HomepageAboutContent,
  HomepageWhyDRKContent,
  HomepageFacilitiesContent,
  HomepageJourneyContent,
  HomepageCTAContent,
  AboutHeroContent,
  AboutFounderContent,
  AboutStoryContent,
  VisionMissionContent,
  AboutPhilosophyContent,
  AboutCoreValuesContent,
  AboutClinicalStandardsContent,
  AboutFacilitiesContent,
  ServicesHeroContent,
  SpecialtyServicesContent,
  ServicesApproachContent,
  ContactInfoContent,
  LocationMapsContent,
  SocialMediaContent,
  SEOMetadataContent,
  FooterSettingsContent,
  MediaCategory,
} from "@/types/cms";

// CMS Subcomponents
import CMSHeaderBar from "@/components/admin/cms/CMSHeaderBar";
import HomepageEditor from "@/components/admin/cms/HomepageEditor";
import AboutEditor from "@/components/admin/cms/AboutEditor";
import ServicesEditor from "@/components/admin/cms/ServicesEditor";
import ContactEditor from "@/components/admin/cms/ContactEditor";
import MapsEditor from "@/components/admin/cms/MapsEditor";
import SocialEditor from "@/components/admin/cms/SocialEditor";
import SEOEditor from "@/components/admin/cms/SEOEditor";
import FooterEditor from "@/components/admin/cms/FooterEditor";
import MediaLibraryModal from "@/components/admin/cms/MediaLibraryModal";
import LivePreviewModal from "@/components/admin/cms/LivePreviewModal";

type ActiveSectionId =
  | "overview"
  | "homepage"
  | "about"
  | "services"
  | "contact"
  | "maps"
  | "social"
  | "seo"
  | "footer"
  | "media";

function WebsiteContentStudio() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeSection, setActiveSection] = useState<ActiveSectionId>("homepage");

  // Sync active section with URL query param ?tab=...
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (!tab) {
      setActiveSection("homepage");
      return;
    }
    if (tab === "location" || tab === "maps") {
      setActiveSection("maps");
    } else if (tab === "media") {
      setActiveSection("media");
      setShowMediaModal(true);
    } else if (
      ["homepage", "about", "services", "contact", "social", "seo", "footer"].includes(tab)
    ) {
      setActiveSection(tab as ActiveSectionId);
    }
  }, [searchParams]);
  const [loading, setLoading] = useState(true);
  const [tablesReady, setTablesReady] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Modals state
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [mediaModalCategory, setMediaModalCategory] = useState<MediaCategory | "All">("All");
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // ============================================
  // Section States
  // ============================================

  // Homepage
  const [hero, setHero] = useState<HomepageHeroContent>(defaults.DEFAULT_HOMEPAGE_HERO);
  const [specialties, setSpecialties] = useState<HomepageSpecialtiesContent>(
    defaults.DEFAULT_HOMEPAGE_SPECIALTIES
  );
  const [aboutPreview, setAboutPreview] = useState<HomepageAboutContent>(
    defaults.DEFAULT_HOMEPAGE_ABOUT
  );
  const [whyDrk, setWhyDrk] = useState<HomepageWhyDRKContent>(defaults.DEFAULT_HOMEPAGE_WHY_DRK);
  const [facilities, setFacilities] = useState<HomepageFacilitiesContent>(
    defaults.DEFAULT_HOMEPAGE_FACILITIES
  );
  const [journey, setJourney] = useState<HomepageJourneyContent>(
    defaults.DEFAULT_HOMEPAGE_JOURNEY
  );
  const [cta, setCta] = useState<HomepageCTAContent>(defaults.DEFAULT_HOMEPAGE_CTA);

  // About Page
  const [aboutHero, setAboutHero] = useState<AboutHeroContent>(defaults.DEFAULT_ABOUT_HERO);
  const [aboutFounder, setAboutFounder] = useState<AboutFounderContent>(
    defaults.DEFAULT_ABOUT_FOUNDER
  );
  const [aboutStory, setAboutStory] = useState<AboutStoryContent>(defaults.DEFAULT_ABOUT_STORY);
  const [visionMission, setVisionMission] = useState<VisionMissionContent>(
    defaults.DEFAULT_VISION_MISSION
  );
  const [philosophy, setPhilosophy] = useState<AboutPhilosophyContent>(
    defaults.DEFAULT_ABOUT_PHILOSOPHY
  );
  const [coreValues, setCoreValues] = useState<AboutCoreValuesContent>(
    defaults.DEFAULT_ABOUT_VALUES
  );
  const [standards, setStandards] = useState<AboutClinicalStandardsContent>(
    defaults.DEFAULT_ABOUT_CLINICAL_STANDARDS
  );
  const [aboutFacilities, setAboutFacilities] = useState<AboutFacilitiesContent>(
    defaults.DEFAULT_ABOUT_FACILITIES
  );

  // Services Page
  const [servicesHero, setServicesHero] = useState<ServicesHeroContent>(
    defaults.DEFAULT_SERVICES_HERO
  );
  const [dental, setDental] = useState<SpecialtyServicesContent>(defaults.DEFAULT_SERVICES_DENTAL);
  const [skin, setSkin] = useState<SpecialtyServicesContent>(defaults.DEFAULT_SERVICES_SKIN);
  const [hair, setHair] = useState<SpecialtyServicesContent>(defaults.DEFAULT_SERVICES_HAIR);
  const [approach, setApproach] = useState<ServicesApproachContent>(
    defaults.DEFAULT_SERVICES_APPROACH
  );

  // Contact Info
  const [contact, setContact] = useState<ContactInfoContent>(defaults.DEFAULT_CONTACT_INFO);

  // Maps & Location
  const [maps, setMaps] = useState<LocationMapsContent>(defaults.DEFAULT_LOCATION_MAPS);

  // Social Links
  const [social, setSocial] = useState<SocialMediaContent>(defaults.DEFAULT_SOCIAL_MEDIA);

  // SEO
  const [seo, setSeo] = useState<SEOMetadataContent>(defaults.DEFAULT_SEO_METADATA);

  // Footer Settings & Logo
  const [footerSettings, setFooterSettings] = useState<FooterSettingsContent>(
    defaults.DEFAULT_FOOTER_SETTINGS
  );

  // Publication Status tracking for active section
  const [statusMap, setStatusMap] = useState<
    Record<string, { isPublished: boolean; hasDraft: boolean; updatedAt?: string }>
  >({});

  const showToast = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 4500);
  };

  // Check auth and initial load
  useEffect(() => {
    const isConfig = isSupabaseConfigured();
    const supabase = getSupabaseClient();

    if (supabase && isConfig) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session) {
          router.push("/admin/login");
          return;
        }
        loadAllData();
      });
    } else {
      loadAllData();
    }
  }, [router]);

  const loadAllData = async () => {
    setLoading(true);
    const ready = await checkCMSTablesReady();
    setTablesReady(ready);

    // Load each section from Supabase or defaults
    const [
      heroRec,
      specsRec,
      abtPrevRec,
      whyRec,
      facRec,
      jrnyRec,
      ctaRec,
      abtHeroRec,
      abtFounderRec,
      abtStoryRec,
      vmRec,
      phRec,
      valRec,
      stdRec,
      abtFacRec,
      srvHeroRec,
      dentRec,
      sknRec,
      hrRec,
      appRec,
      contRec,
      mapsRec,
      socRec,
      seoRec,
      footerRec,
    ] = await Promise.all([
      getAdminSection<HomepageHeroContent>("homepage_hero", "Homepage Hero", "homepage"),
      getAdminSection<HomepageSpecialtiesContent>(
        "homepage_specialties",
        "Three Specialties",
        "homepage"
      ),
      getAdminSection<HomepageAboutContent>("homepage_about", "About DRK Preview", "homepage"),
      getAdminSection<HomepageWhyDRKContent>("homepage_why_drk", "Why DRK", "homepage"),
      getAdminSection<HomepageFacilitiesContent>(
        "homepage_facilities",
        "Inside DRK",
        "homepage"
      ),
      getAdminSection<HomepageJourneyContent>(
        "homepage_journey",
        "Patient Journey",
        "homepage"
      ),
      getAdminSection<HomepageCTAContent>("homepage_cta", "Homepage CTA", "homepage"),
      getAdminSection<AboutHeroContent>("about_hero", "About Hero", "about"),
      getAdminSection<AboutFounderContent>("about_founder", "Founder Profile", "about"),
      getAdminSection<AboutStoryContent>("about_story", "Our Story", "about"),
      getAdminSection<VisionMissionContent>(
        "about_vision_mission",
        "Vision & Mission",
        "about"
      ),
      getAdminSection<AboutPhilosophyContent>(
        "about_philosophy",
        "Healthcare Philosophy",
        "about"
      ),
      getAdminSection<AboutCoreValuesContent>("about_values", "Core Values", "about"),
      getAdminSection<AboutClinicalStandardsContent>(
        "about_clinical_standards",
        "Clinical Standards",
        "about"
      ),
      getAdminSection<AboutFacilitiesContent>("about_facilities", "Facilities", "about"),
      getAdminSection<ServicesHeroContent>("services_hero", "Services Hero", "services"),
      getAdminSection<SpecialtyServicesContent>("services_dental", "Dental Care", "services"),
      getAdminSection<SpecialtyServicesContent>("services_skin", "Skin Care", "services"),
      getAdminSection<SpecialtyServicesContent>("services_hair", "Hair Care", "services"),
      getAdminSection<ServicesApproachContent>(
        "services_approach",
        "Healthcare Approach",
        "services"
      ),
      getAdminSection<ContactInfoContent>("contact_info", "Contact Details", "contact"),
      getAdminSection<LocationMapsContent>("contact_maps", "Google Maps", "location"),
      getAdminSection<SocialMediaContent>("social_media", "Social Media", "social"),
      getAdminSection<SEOMetadataContent>("seo_metadata", "SEO & Metadata", "seo"),
      getAdminSection<FooterSettingsContent>("footer_settings", "Footer Settings", "general"),
    ]);

    // Populate states using draft if available, otherwise published content
    setHero((heroRec.draft_content || heroRec.content) as HomepageHeroContent);
    setSpecialties((specsRec.draft_content || specsRec.content) as HomepageSpecialtiesContent);
    setAboutPreview((abtPrevRec.draft_content || abtPrevRec.content) as HomepageAboutContent);
    setWhyDrk((whyRec.draft_content || whyRec.content) as HomepageWhyDRKContent);
    setFacilities((facRec.draft_content || facRec.content) as HomepageFacilitiesContent);
    setJourney((jrnyRec.draft_content || jrnyRec.content) as HomepageJourneyContent);
    setCta((ctaRec.draft_content || ctaRec.content) as HomepageCTAContent);

    setAboutHero((abtHeroRec.draft_content || abtHeroRec.content) as AboutHeroContent);
    setAboutFounder((abtFounderRec.draft_content || abtFounderRec.content) as AboutFounderContent);
    setAboutStory((abtStoryRec.draft_content || abtStoryRec.content) as AboutStoryContent);
    setVisionMission((vmRec.draft_content || vmRec.content) as VisionMissionContent);
    setPhilosophy((phRec.draft_content || phRec.content) as AboutPhilosophyContent);
    setCoreValues((valRec.draft_content || valRec.content) as AboutCoreValuesContent);
    setStandards((stdRec.draft_content || stdRec.content) as AboutClinicalStandardsContent);
    setAboutFacilities((abtFacRec.draft_content || abtFacRec.content) as AboutFacilitiesContent);

    setServicesHero((srvHeroRec.draft_content || srvHeroRec.content) as ServicesHeroContent);
    setDental((dentRec.draft_content || dentRec.content) as SpecialtyServicesContent);
    setSkin((sknRec.draft_content || sknRec.content) as SpecialtyServicesContent);
    setHair((hrRec.draft_content || hrRec.content) as SpecialtyServicesContent);
    setApproach((appRec.draft_content || appRec.content) as ServicesApproachContent);

    setContact((contRec.draft_content || contRec.content) as ContactInfoContent);
    setMaps((mapsRec.draft_content || mapsRec.content) as LocationMapsContent);
    setSocial((socRec.draft_content || socRec.content) as SocialMediaContent);
    setSeo((seoRec.draft_content || seoRec.content) as SEOMetadataContent);
    setFooterSettings((footerRec.draft_content || footerRec.content) as FooterSettingsContent);

    // Save status map
    const sm: Record<string, { isPublished: boolean; hasDraft: boolean; updatedAt?: string }> = {
      homepage: {
        isPublished: heroRec.is_published,
        hasDraft: heroRec.has_draft || specsRec.has_draft,
        updatedAt: heroRec.updated_at,
      },
      about: {
        isPublished: abtHeroRec.is_published,
        hasDraft: abtHeroRec.has_draft || abtStoryRec.has_draft,
        updatedAt: abtHeroRec.updated_at,
      },
      services: {
        isPublished: srvHeroRec.is_published,
        hasDraft: srvHeroRec.has_draft || dentRec.has_draft,
        updatedAt: srvHeroRec.updated_at,
      },
      contact: {
        isPublished: contRec.is_published,
        hasDraft: contRec.has_draft,
        updatedAt: contRec.updated_at,
      },
      maps: {
        isPublished: mapsRec.is_published,
        hasDraft: mapsRec.has_draft,
        updatedAt: mapsRec.updated_at,
      },
      social: {
        isPublished: socRec.is_published,
        hasDraft: socRec.has_draft,
        updatedAt: socRec.updated_at,
      },
      seo: {
        isPublished: seoRec.is_published,
        hasDraft: seoRec.has_draft,
        updatedAt: seoRec.updated_at,
      },
      footer: {
        isPublished: footerRec.is_published,
        hasDraft: footerRec.has_draft,
        updatedAt: footerRec.updated_at,
      },
    };
    setStatusMap(sm);

    setLoading(false);
  };

  // Save Draft Handler for the active section
  const handleSaveActiveDraft = async () => {
    setSavingDraft(true);
    let success = true;
    let err: string | undefined;

    if (activeSection === "homepage") {
      const r1 = await saveSectionDraft("homepage_hero", "Homepage Hero", "homepage", hero);
      const r2 = await saveSectionDraft(
        "homepage_specialties",
        "Three Specialties",
        "homepage",
        specialties
      );
      const r3 = await saveSectionDraft("homepage_about", "About Preview", "homepage", aboutPreview);
      const r4 = await saveSectionDraft("homepage_why_drk", "Why DRK", "homepage", whyDrk);
      const r5 = await saveSectionDraft(
        "homepage_facilities",
        "Inside DRK",
        "homepage",
        facilities
      );
      const r6 = await saveSectionDraft("homepage_journey", "Patient Journey", "homepage", journey);
      const r7 = await saveSectionDraft("homepage_cta", "Homepage CTA", "homepage", cta);
      success = r1.success && r2.success && r3.success && r4.success && r5.success && r6.success && r7.success;
      err = r1.error || r2.error;
    } else if (activeSection === "about") {
      const r0 = await saveSectionDraft("about_founder", "Founder Profile", "about", aboutFounder);
      const r1 = await saveSectionDraft("about_hero", "About Hero", "about", aboutHero);
      const r2 = await saveSectionDraft("about_story", "Our Story", "about", aboutStory);
      const r3 = await saveSectionDraft("about_vision_mission", "Vision & Mission", "about", visionMission);
      const r4 = await saveSectionDraft("about_philosophy", "Philosophy", "about", philosophy);
      const r5 = await saveSectionDraft("about_values", "Core Values", "about", coreValues);
      const r6 = await saveSectionDraft("about_clinical_standards", "Standards", "about", standards);
      const r7 = await saveSectionDraft("about_facilities", "Facilities", "about", aboutFacilities);
      success = r0.success && r1.success && r2.success && r3.success && r4.success && r5.success && r6.success && r7.success;
      err = r0.error || r1.error;
    } else if (activeSection === "services") {
      const r1 = await saveSectionDraft("services_hero", "Services Hero", "services", servicesHero);
      const r2 = await saveSectionDraft("services_dental", "Dental Care", "services", dental);
      const r3 = await saveSectionDraft("services_skin", "Skin Care", "services", skin);
      const r4 = await saveSectionDraft("services_hair", "Hair Care", "services", hair);
      const r5 = await saveSectionDraft("services_approach", "Healthcare Approach", "services", approach);
      success = r1.success && r2.success;
      err = r1.error;
    } else if (activeSection === "contact") {
      const r = await saveSectionDraft("contact_info", "Contact Details", "contact", contact);
      success = r.success;
      err = r.error;
    } else if (activeSection === "maps") {
      const r = await saveSectionDraft("contact_maps", "Google Maps", "location", maps);
      success = r.success;
      err = r.error;
    } else if (activeSection === "social") {
      const r = await saveSectionDraft("social_media", "Social Media", "social", social);
      success = r.success;
      err = r.error;
    } else if (activeSection === "seo") {
      const r = await saveSectionDraft("seo_metadata", "SEO & Metadata", "seo", seo);
      success = r.success;
      err = r.error;
    } else if (activeSection === "footer") {
      const r = await saveSectionDraft("footer_settings", "Footer Settings", "general", footerSettings);
      success = r.success;
      err = r.error;
    }

    setSavingDraft(false);

    if (success) {
      showToast("success", "Draft saved successfully. (Live website remains unchanged until published).");
      loadAllData();
    } else {
      showToast("error", err || "Failed to save draft in Supabase. Check database permissions.");
    }
  };

  // Publish Handler for the active section
  const handlePublishActiveSection = async () => {
    setPublishing(true);
    let success = true;
    let err: string | undefined;

    if (activeSection === "homepage") {
      const r1 = await publishSection("homepage_hero", "Homepage Hero", "homepage", hero);
      const r2 = await publishSection(
        "homepage_specialties",
        "Three Specialties",
        "homepage",
        specialties
      );
      const r3 = await publishSection("homepage_about", "About Preview", "homepage", aboutPreview);
      const r4 = await publishSection("homepage_why_drk", "Why DRK", "homepage", whyDrk);
      const r5 = await publishSection("homepage_facilities", "Inside DRK", "homepage", facilities);
      const r6 = await publishSection("homepage_journey", "Patient Journey", "homepage", journey);
      const r7 = await publishSection("homepage_cta", "Homepage CTA", "homepage", cta);
      success = r1.success && r2.success && r3.success && r4.success && r5.success && r6.success && r7.success;
      err = r1.error || r2.error;
    } else if (activeSection === "about") {
      const r0 = await publishSection("about_founder", "Founder Profile", "about", aboutFounder);
      const r1 = await publishSection("about_hero", "About Hero", "about", aboutHero);
      const r2 = await publishSection("about_story", "Our Story", "about", aboutStory);
      const r3 = await publishSection("about_vision_mission", "Vision & Mission", "about", visionMission);
      const r4 = await publishSection("about_philosophy", "Philosophy", "about", philosophy);
      const r5 = await publishSection("about_values", "Core Values", "about", coreValues);
      const r6 = await publishSection("about_clinical_standards", "Standards", "about", standards);
      const r7 = await publishSection("about_facilities", "Facilities", "about", aboutFacilities);
      success = r0.success && r1.success && r2.success && r3.success && r4.success && r5.success && r6.success && r7.success;
      err = r0.error || r1.error;
    } else if (activeSection === "services") {
      const r1 = await publishSection("services_hero", "Services Hero", "services", servicesHero);
      const r2 = await publishSection("services_dental", "Dental Care", "services", dental);
      const r3 = await publishSection("services_skin", "Skin Care", "services", skin);
      const r4 = await publishSection("services_hair", "Hair Care", "services", hair);
      const r5 = await publishSection("services_approach", "Healthcare Approach", "services", approach);
      success = r1.success && r2.success;
      err = r1.error;
    } else if (activeSection === "contact") {
      const r = await publishSection("contact_info", "Contact Details", "contact", contact);
      success = r.success;
      err = r.error;
    } else if (activeSection === "maps") {
      const r = await publishSection("contact_maps", "Google Maps", "location", maps);
      success = r.success;
      err = r.error;
    } else if (activeSection === "social") {
      const r = await publishSection("social_media", "Social Media", "social", social);
      success = r.success;
      err = r.error;
    } else if (activeSection === "seo") {
      const r = await publishSection("seo_metadata", "SEO & Metadata", "seo", seo);
      success = r.success;
      err = r.error;
    } else if (activeSection === "footer") {
      const r = await publishSection("footer_settings", "Footer Settings", "general", footerSettings);
      success = r.success;
      err = r.error;
    }

    setPublishing(false);

    if (success) {
      showToast("success", "Published to live website! Visitors will now see the updated content.");
      loadAllData();
    } else {
      showToast("error", err || "Publishing failed. Please check Supabase configuration.");
    }
  };

  // Discard draft
  const handleDiscardDraft = async () => {
    if (!confirm("Are you sure you want to discard your draft changes?")) return;
    if (activeSection === "homepage") {
      await discardSectionDraft("homepage_hero");
    } else if (activeSection === "about") {
      await discardSectionDraft("about_hero");
      await discardSectionDraft("about_founder");
    } else if (activeSection === "services") {
      await discardSectionDraft("services_hero");
    } else if (activeSection === "contact") {
      await discardSectionDraft("contact_info");
    } else if (activeSection === "maps") {
      await discardSectionDraft("contact_maps");
    } else if (activeSection === "social") {
      await discardSectionDraft("social_media");
    } else if (activeSection === "seo") {
      await discardSectionDraft("seo_metadata");
    } else if (activeSection === "footer") {
      await discardSectionDraft("footer_settings");
    }
    loadAllData();
    showToast("success", "Draft discarded. Restored live published version.");
  };

  const getPreviewPayload = () => {
    switch (activeSection) {
      case "homepage":
        return { hero, specialties, aboutPreview, whyDrk, facilities, journey, cta };
      case "about":
        return { aboutHero, aboutFounder, aboutStory, visionMission, philosophy, coreValues, standards, aboutFacilities };
      case "services":
        return { servicesHero, dental, skin, hair, approach };
      case "contact":
        return contact;
      case "maps":
        return maps;
      case "social":
        return social;
      case "seo":
        return seo;
      case "footer":
        return footerSettings;
      default:
        return {};
    }
  };

  return (
    <div className="space-y-6 w-full">
      {/* Navigation Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#DCE8F0]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#5D6B85] hover:text-[#087FBA] transition"
            >
              <ArrowLeft size={13} />
              <span>Admin Dashboard</span>
            </Link>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-bold text-[#087FBA] uppercase tracking-wider">
              CMS Content Studio
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#071B68]">
            Website Content Manager
          </h1>
          <p className="text-xs sm:text-sm text-[#5D6B85] mt-0.5">
            Edit homepage sections, clinical specialties, hospital information, and images with live preview and publishing controls.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              setMediaModalCategory("All");
              setShowMediaModal(true);
            }}
            className="cursor-pointer inline-flex items-center gap-1.5 rounded-full border border-[#DCE8F0] bg-white px-4 py-2 text-xs font-bold text-[#071B68] hover:bg-[#EFFBFC] hover:border-[#087FBA] transition shadow-2xs"
          >
            <ImageIcon size={14} className="text-[#087FBA]" />
            <span>Media Library</span>
          </button>

          <a
            href={process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:8000"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#071B68] px-4 py-2 text-xs font-bold text-white hover:bg-[#087FBA] transition shadow-xs"
          >
            <span>View Live Website</span>
            <ExternalLink size={13} className="text-[#10C6C1]" />
          </a>
        </div>
      </div>

      {/* Toast Notification */}
      {notification && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 text-xs sm:text-sm font-semibold transition-all ${
            notification.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle size={18} className="text-red-600 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Supabase CMS Schema Readiness Banner */}
      {!tablesReady && !loading && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/90 p-5 shadow-xs">
          <div className="flex items-start gap-3">
            <Terminal size={20} className="text-amber-800 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-bold text-amber-900">
                Supabase CMS Schema Notice
              </h3>
              <p className="mt-1 text-xs text-amber-800 leading-relaxed">
                The <code className="font-mono bg-amber-100 px-1 py-0.5 rounded">website_content</code> and{" "}
                <code className="font-mono bg-amber-100 px-1 py-0.5 rounded">website_media</code> tables have not yet been created in your Supabase project. The website is currently displaying verified local hospital defaults.
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <a
                  href="https://supabase.com/dashboard/project/iqjlrprznvkzbnbixgww/sql"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-amber-800 px-4 py-1.5 text-xs font-bold text-white hover:bg-amber-900 transition"
                >
                  <span>Open Supabase SQL Editor</span>
                  <ExternalLink size={12} />
                </a>
                <button
                  type="button"
                  onClick={() => {
                    alert(
                      "Please open Supabase SQL Editor and execute the script in supabase-cms-schema.sql located in your project root."
                    );
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-white px-3.5 py-1.5 text-xs font-bold text-amber-900 hover:bg-amber-100 transition"
                >
                  <Copy size={12} />
                  <span>View SQL Instructions</span>
                </button>
                <button
                  type="button"
                  onClick={loadAllData}
                  className="inline-flex items-center gap-1 text-xs font-bold text-amber-900 hover:underline cursor-pointer"
                >
                  <RefreshCw size={12} />
                  <span>Re-check Schema</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Layout: Active Section Editor (Full Width) */}
      <div className="w-full">
        {loading ? (
          <div className="card p-16 text-center bg-white border border-[#DCE8F0] rounded-2xl shadow-2xs">
            <Loader2 size={36} className="animate-spin text-[#087FBA] mx-auto mb-3" />
            <p className="text-sm font-bold text-[#071B68]">Loading CMS configuration...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* CMS Header Bar for Content Section */}
            {activeSection !== "media" && (
              <CMSHeaderBar
                title={
                  activeSection === "homepage"
                    ? "Homepage Content Management"
                    : activeSection === "about"
                    ? "About DRK Hospital Content"
                    : activeSection === "services"
                    ? "Clinical Services Page Content"
                    : activeSection === "contact"
                    ? "Hospital Contact Information"
                    : activeSection === "maps"
                    ? "Google Maps & Location"
                    : activeSection === "social"
                    ? "Social Media Profiles"
                    : activeSection === "seo"
                    ? "SEO & Website Metadata"
                    : "Footer Settings & Brand Logo"
                }
                category={
                  activeSection === "maps"
                    ? "LOCATION"
                    : activeSection === "footer"
                    ? "FOOTER"
                    : activeSection.toUpperCase()
                }
                isPublished={statusMap[activeSection]?.isPublished !== false}
                hasDraft={Boolean(statusMap[activeSection]?.hasDraft)}
                updatedAt={statusMap[activeSection]?.updatedAt}
                savingDraft={savingDraft}
                publishing={publishing}
                onSaveDraft={handleSaveActiveDraft}
                onPublish={handlePublishActiveSection}
                onDiscardDraft={handleDiscardDraft}
                onOpenPreview={() => setShowPreviewModal(true)}
              />
            )}

            {/* Section Specific Forms */}
            {activeSection === "homepage" && (
              <HomepageEditor
                hero={hero}
                setHero={setHero}
                specialties={specialties}
                setSpecialties={setSpecialties}
                about={aboutPreview}
                setAbout={setAboutPreview}
                whyDrk={whyDrk}
                setWhyDrk={setWhyDrk}
                facilities={facilities}
                setFacilities={setFacilities}
                journey={journey}
                setJourney={setJourney}
                cta={cta}
                setCta={setCta}
                onOpenMediaLibrary={(cat) => {
                  setMediaModalCategory(cat || "All");
                  setShowMediaModal(true);
                }}
              />
            )}

            {activeSection === "about" && (
              <AboutEditor
                hero={aboutHero}
                setHero={setAboutHero}
                founder={aboutFounder}
                setFounder={setAboutFounder}
                story={aboutStory}
                setStory={setAboutStory}
                visionMission={visionMission}
                setVisionMission={setVisionMission}
                philosophy={philosophy}
                setPhilosophy={setPhilosophy}
                coreValues={coreValues}
                setCoreValues={setCoreValues}
                standards={standards}
                setStandards={setStandards}
                facilities={aboutFacilities}
                setFacilities={setAboutFacilities}
                onOpenMediaLibrary={(cat) => {
                  setMediaModalCategory(cat || "All");
                  setShowMediaModal(true);
                }}
              />
            )}

            {activeSection === "services" && (
              <ServicesEditor
                hero={servicesHero}
                setHero={setServicesHero}
                dental={dental}
                setDental={setDental}
                skin={skin}
                setSkin={setSkin}
                hair={hair}
                setHair={setHair}
                approach={approach}
                setApproach={setApproach}
                onOpenMediaLibrary={(cat) => {
                  setMediaModalCategory(cat || "All");
                  setShowMediaModal(true);
                }}
              />
            )}

            {activeSection === "contact" && (
              <ContactEditor contact={contact} setContact={setContact} />
            )}

            {activeSection === "maps" && (
              <MapsEditor maps={maps} setMaps={setMaps} />
            )}

            {activeSection === "social" && (
              <SocialEditor social={social} setSocial={setSocial} />
            )}

            {activeSection === "seo" && (
              <SEOEditor
                seo={seo}
                setSeo={setSeo}
                onOpenMediaLibrary={(cat) => {
                  setMediaModalCategory(cat || "All");
                  setShowMediaModal(true);
                }}
              />
            )}

            {activeSection === "footer" && (
              <FooterEditor
                footer={footerSettings}
                setFooter={setFooterSettings}
                onOpenMediaLibrary={() => {
                  setMediaModalCategory("All");
                  setShowMediaModal(true);
                }}
              />
            )}

            {activeSection === "media" && (
              <div className="card p-8 border border-[#DCE8F0] bg-white rounded-2xl shadow-2xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#DCE8F0]">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider text-[#087FBA] bg-[#EFFBFC] border border-[#DCE8F0] mb-2">
                      MEDIA ASSET LIBRARY
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-[#071B68]">
                      Hospital Media & Photography Assets
                    </h3>
                    <p className="text-xs sm:text-sm text-[#5D6B85] mt-1">
                      Browse, upload, and organize clinical photos, doctor portraits, infrastructure photos, and logos stored securely in Supabase Storage.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setMediaModalCategory("All");
                      setShowMediaModal(true);
                    }}
                    className="cursor-pointer inline-flex items-center gap-2 rounded-full bg-[#071B68] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#087FBA] transition shadow-xs shrink-0"
                  >
                    <ImageIcon size={15} className="text-[#10C6C1]" />
                    <span>Open Media Library</span>
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="p-4 rounded-xl border border-[#DCE8F0] bg-[#EFFBFC]/40">
                    <p className="text-xs font-bold text-[#087FBA]">Supported Formats</p>
                    <p className="text-xs text-[#5D6B85] mt-1">JPG, PNG, WebP, SVG up to 5MB</p>
                  </div>
                  <div className="p-4 rounded-xl border border-[#DCE8F0] bg-[#EFFBFC]/40">
                    <p className="text-xs font-bold text-[#087FBA]">Storage Engine</p>
                    <p className="text-xs text-[#5D6B85] mt-1">Supabase Storage Bucket: website-media</p>
                  </div>
                  <div className="p-4 rounded-xl border border-[#DCE8F0] bg-[#EFFBFC]/40">
                    <p className="text-xs font-bold text-[#087FBA]">CDN Delivery</p>
                    <p className="text-xs text-[#5D6B85] mt-1">Fast global delivery with Next.js image optimization</p>
                  </div>
                  <div className="p-4 rounded-xl border border-[#DCE8F0] bg-[#EFFBFC]/40">
                    <p className="text-xs font-bold text-[#087FBA]">Alt Text Compliance</p>
                    <p className="text-xs text-[#5D6B85] mt-1">Hospital accessibility standards supported</p>
                  </div>
                </div>

                <div className="text-center py-10 border-2 border-dashed border-[#DCE8F0] rounded-2xl bg-[#F8FDFF]">
                  <ImageIcon size={44} className="text-[#087FBA] mx-auto mb-3" />
                  <h4 className="text-base font-bold text-[#071B68]">Manage All Assets in One Modal</h4>
                  <p className="text-xs text-[#5D6B85] max-w-md mx-auto mt-1 mb-5">
                    Filter assets by clinical departments (Dental, Skin, Hair, About Hospital, Infrastructure), upload new photography, or copy direct image URLs.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setMediaModalCategory("All");
                      setShowMediaModal(true);
                    }}
                    className="cursor-pointer inline-flex items-center gap-2 rounded-full border border-[#087FBA] bg-white px-5 py-2.5 text-xs font-bold text-[#087FBA] hover:bg-[#EFFBFC] transition shadow-2xs"
                  >
                    <ImageIcon size={14} />
                    <span>Launch Media Asset Manager</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Global Modals */}
      <MediaLibraryModal
        isOpen={showMediaModal}
        onClose={() => setShowMediaModal(false)}
        initialCategory={mediaModalCategory}
      />

      <LivePreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        sectionTitle={`${activeSection.toUpperCase()} Preview`}
        previewData={getPreviewPayload()}
        onPublishDirectly={handlePublishActiveSection}
      />
    </div>
  );
}

export default function WebsiteContentManagerPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] bg-[#F8FDFF] p-12 flex flex-col items-center justify-center gap-3">
          <Loader2 size={32} className="animate-spin text-[#087FBA]" />
          <p className="text-xs font-bold text-[#071B68]">Loading DRK Website Content Studio...</p>
        </div>
      }
    >
      <WebsiteContentStudio />
    </Suspense>
  );
}

