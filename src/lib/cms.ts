/**
 * DRK Hospital CMS Data Access Layer
 * 
 * Provides client and server functions to query, save, publish,
 * and manage website content and media assets in Supabase.
 */

import { getSupabaseClient, isSupabaseConfigured, validateImageFile } from "@/lib/supabase";
import { CMSCategory, CMSSectionRecord, WebsiteMediaItem, MediaCategory } from "@/types/cms";
import * as defaults from "@/lib/cms-defaults";

/**
 * Maps section_key to default approved content
 */
export function getDefaultContentForSection(sectionKey: string): unknown {
  switch (sectionKey) {
    case "homepage_hero":
      return defaults.DEFAULT_HOMEPAGE_HERO;
    case "homepage_specialties":
      return defaults.DEFAULT_HOMEPAGE_SPECIALTIES;
    case "homepage_about":
      return defaults.DEFAULT_HOMEPAGE_ABOUT;
    case "homepage_why_drk":
      return defaults.DEFAULT_HOMEPAGE_WHY_DRK;
    case "homepage_facilities":
      return defaults.DEFAULT_HOMEPAGE_FACILITIES;
    case "homepage_journey":
      return defaults.DEFAULT_HOMEPAGE_JOURNEY;
    case "homepage_cta":
      return defaults.DEFAULT_HOMEPAGE_CTA;
    case "about_hero":
      return defaults.DEFAULT_ABOUT_HERO;
    case "about_founder":
      return defaults.DEFAULT_ABOUT_FOUNDER;
    case "about_story":
      return defaults.DEFAULT_ABOUT_STORY;
    case "about_vision_mission":
      return defaults.DEFAULT_VISION_MISSION;
    case "about_philosophy":
      return defaults.DEFAULT_ABOUT_PHILOSOPHY;
    case "about_values":
      return defaults.DEFAULT_ABOUT_VALUES;
    case "about_clinical_standards":
      return defaults.DEFAULT_ABOUT_CLINICAL_STANDARDS;
    case "about_facilities":
      return defaults.DEFAULT_ABOUT_FACILITIES;
    case "services_hero":
      return defaults.DEFAULT_SERVICES_HERO;
    case "services_dental":
      return defaults.DEFAULT_SERVICES_DENTAL;
    case "services_skin":
      return defaults.DEFAULT_SERVICES_SKIN;
    case "services_hair":
      return defaults.DEFAULT_SERVICES_HAIR;
    case "services_approach":
      return defaults.DEFAULT_SERVICES_APPROACH;
    case "contact_info":
      return defaults.DEFAULT_CONTACT_INFO;
    case "contact_maps":
      return defaults.DEFAULT_LOCATION_MAPS;
    case "social_media":
      return defaults.DEFAULT_SOCIAL_MEDIA;
    case "seo_metadata":
      return defaults.DEFAULT_SEO_METADATA;
    case "legal_identity":
      return defaults.DEFAULT_LEGAL_IDENTITY;
    case "footer_settings":
      return defaults.DEFAULT_FOOTER_SETTINGS;
    default:
      return null;
  }
}

/**
 * Checks if the website_content table is ready in Supabase
 */
export async function checkCMSTablesReady(): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) return false;
  try {
    const { error } = await supabase.from("website_content").select("id").limit(1);
    return !error;
  } catch {
    return false;
  }
}

/**
 * Sanitizes published CMS content to guarantee hospital factual safety.
 * Strictly enforces confirmed patient-visit address in Tiruttani and eliminates
 * any legacy unconfirmed Chennai placeholders or outdated coordinates.
 */
export function sanitizePublishedContent<T>(sectionKey: string, rawContent: T): T {
  if (!rawContent || typeof rawContent !== "object") return rawContent;
  let serialized = JSON.stringify(rawContent);

  if (
    serialized.includes("Anna Salai") ||
    serialized.includes("Central Medical Enclave") ||
    serialized.includes("Chennai")
  ) {
    serialized = serialized
      .replace(
        /DRK Hospital, Anna Salai \/ Central Medical Enclave, Chennai, Tamil Nadu 600002/g,
        "DRK Hospitals, SF.No. 29/2A, Akkaia Naidu Street, Tiruttani, Tiruvallur – 631209, Tamil Nadu, India."
      )
      .replace(/DRK Hospital Chennai/g, "DRK Hospitals Tiruttani")
      .replace(/in Chennai/g, "in Tiruttani")
      .replace(/Chennai Facility Building/g, "Tiruttani Facility Building")
      .replace(/Chennai/g, "Tiruttani");
  }

  const parsed = JSON.parse(serialized);

  if (sectionKey === "contact_info") {
    parsed.address = "DRK Hospitals, SF.No. 29/2A, Akkaia Naidu Street, Tiruttani, Tiruvallur – 631209, Tamil Nadu, India.";
    parsed.locality = "Tiruttani";
    parsed.city = "Tiruttani";
    parsed.state = "Tamil Nadu";
    parsed.pincode = "631209";
    parsed.googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=SF.No.+29%2F2A%2C+Akkaia+Naidu+Street%2C+Tiruttani%2C+Tiruvallur+631209%2C+Tamil+Nadu+India";

    // Enforce removal of patient coordination phone number (+91 98765 43210)
    // Retain only Main Hospital Helpline: +91 63805 17153
    if (Array.isArray(parsed.phoneNumbers)) {
      parsed.phoneNumbers = parsed.phoneNumbers.filter(
        (p: any) =>
          !p.number?.includes("98765") &&
          !p.raw?.includes("98765") &&
          !p.label?.toLowerCase().includes("coordination")
      );
      if (parsed.phoneNumbers.length === 0) {
        parsed.phoneNumbers = [
          {
            id: "phone-1",
            label: "Main Hospital Helpline",
            number: "+91 63805 17153",
            raw: "+916380517153",
            isPrimary: true,
            isActive: true,
          },
        ];
      } else {
        const primary = parsed.phoneNumbers.find((p: any) => p.isPrimary) || parsed.phoneNumbers[0];
        primary.isPrimary = true;
        primary.isActive = true;
        if (!primary.number || primary.number.includes("2345 6789") || primary.number.includes("44 2345")) {
          primary.number = "+91 63805 17153";
          primary.raw = "+916380517153";
          primary.label = "Main Hospital Helpline";
        }
      }
    }

    if (parsed.whatsapp && (parsed.whatsapp.number?.includes("98765") || parsed.whatsapp.raw?.includes("98765"))) {
      parsed.whatsapp.number = "+91 63805 17153";
      parsed.whatsapp.raw = "916380517153";
    }
  }

  if (sectionKey === "footer_settings" && parsed.contact) {
    parsed.contact.street = "SF.No. 29/2A, Akkaia Naidu Street";
    parsed.contact.addressLine1 = "DRK Hospitals";
    parsed.contact.city = "Tiruttani";
    parsed.contact.district = "Tiruvallur District";
    parsed.contact.state = "Tamil Nadu";
    parsed.contact.pincode = "631209";
    parsed.contact.googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=SF.No.+29%2F2A%2C+Akkaia+Naidu+Street%2C+Tiruttani%2C+Tiruvallur+631209%2C+Tamil+Nadu+India";
    parsed.contact.whatsappVisible = false;
    if (parsed.contact.secondaryPhone?.includes("98765") || parsed.contact.secondaryPhoneRaw?.includes("98765")) {
      parsed.contact.secondaryPhone = "";
      parsed.contact.secondaryPhoneRaw = "";
    }
    if (parsed.contact.whatsappNumber?.includes("98765") || parsed.contact.whatsappRaw?.includes("98765")) {
      parsed.contact.whatsappNumber = "+91 63805 17153";
      parsed.contact.whatsappRaw = "916380517153";
    }
    if (Array.isArray(parsed.contact.buttons)) {
      parsed.contact.buttons = parsed.contact.buttons.filter(
        (b: any) => b.type !== "whatsapp" && !b.text?.toLowerCase().includes("whatsapp")
      );
    }
  }

  if (sectionKey === "seo_metadata") {
    parsed.organizationName = parsed.organizationName || "DRK Hospitals";
    parsed.legalName = parsed.legalName || "DRK Dental Skin & Hair Hospital Private Limited";
    parsed.canonicalBase = parsed.canonicalBase || "https://drkhospitals.com";
    if (!parsed.siteTitle || parsed.siteTitle.includes("Chennai")) {
      parsed.siteTitle = "DRK Hospitals Tiruttani | Dental, Skin & Hair Care";
    }
  }

  if (sectionKey === "legal_identity") {
    parsed.publicBrandName = parsed.publicBrandName || "DRK Hospitals";
    parsed.registeredCompanyName =
      parsed.registeredCompanyName || "DRK DENTAL SKIN & HAIR HOSPITAL PRIVATE LIMITED";
    parsed.legalDescription =
      parsed.legalDescription ||
      "DRK Hospitals is the public healthcare brand associated with DRK Dental Skin & Hair Hospital Private Limited.";
    parsed.showInFooter = parsed.showInFooter !== false;
    parsed.showOnAboutPage = parsed.showOnAboutPage !== false;
    parsed.seoLegalName =
      parsed.seoLegalName || "DRK Dental Skin & Hair Hospital Private Limited";
  }

  // Synchronize Official Service Catalogues (13 Dental, 16 Skin, 7 Hair)
  if (sectionKey === "services_dental") {
    if (
      !Array.isArray(parsed.services) ||
      parsed.services.length < 13 ||
      !parsed.services.some((s: any) => s.title === "Root Canal Treatment")
    ) {
      parsed.services = defaults.DEFAULT_SERVICES_DENTAL.services;
      parsed.departmentHeading =
        parsed.departmentHeading || defaults.DEFAULT_SERVICES_DENTAL.departmentHeading;
      parsed.tagline = parsed.tagline || defaults.DEFAULT_SERVICES_DENTAL.tagline;
      parsed.description =
        parsed.description || defaults.DEFAULT_SERVICES_DENTAL.description;
    }
  }

  if (sectionKey === "services_skin") {
    if (
      !Array.isArray(parsed.services) ||
      parsed.services.length < 16 ||
      !parsed.services.some((s: any) => s.title === "Carbon Peel Laser Treatment")
    ) {
      parsed.services = defaults.DEFAULT_SERVICES_SKIN.services;
      parsed.departmentHeading =
        parsed.departmentHeading || defaults.DEFAULT_SERVICES_SKIN.departmentHeading;
      parsed.tagline = parsed.tagline || defaults.DEFAULT_SERVICES_SKIN.tagline;
      parsed.description =
        parsed.description || defaults.DEFAULT_SERVICES_SKIN.description;
    }
  }

  if (sectionKey === "services_hair") {
    if (
      !Array.isArray(parsed.services) ||
      parsed.services.length < 7 ||
      !parsed.services.some((s: any) => s.title === "PRP Treatment")
    ) {
      parsed.services = defaults.DEFAULT_SERVICES_HAIR.services;
      parsed.departmentHeading =
        parsed.departmentHeading || defaults.DEFAULT_SERVICES_HAIR.departmentHeading;
      parsed.tagline = parsed.tagline || defaults.DEFAULT_SERVICES_HAIR.tagline;
      parsed.description =
        parsed.description || defaults.DEFAULT_SERVICES_HAIR.description;
    }
  }

  return parsed;
}

/**
 * Fetches published section content for public pages.
 * Falls back to approved defaults if table or record does not exist.
 */
export async function getPublishedSection<T>(sectionKey: string, fallback?: T): Promise<T> {
  const defaultFallback = (fallback !== undefined ? fallback : getDefaultContentForSection(sectionKey)) as T;

  if (!isSupabaseConfigured()) {
    return sanitizePublishedContent(sectionKey, defaultFallback);
  }

  try {
    const supabase = getSupabaseClient();
    if (!supabase) return sanitizePublishedContent(sectionKey, defaultFallback);

    const { data, error } = await supabase
      .from("website_content")
      .select("content, is_published")
      .eq("section_key", sectionKey)
      .eq("is_published", true)
      .maybeSingle();

    if (error || !data || !data.content) {
      return sanitizePublishedContent(sectionKey, defaultFallback);
    }

    return sanitizePublishedContent(sectionKey, data.content as T);
  } catch (err) {
    console.warn(`[CMS] Error fetching published section '${sectionKey}':`, err);
    return sanitizePublishedContent(sectionKey, defaultFallback);
  }
}

/**
 * Fetches all published sections at once for page-level optimization
 */
export async function getAllPublishedSections(): Promise<Record<string, unknown>> {
  const result: Record<string, unknown> = {};

  if (!isSupabaseConfigured()) {
    return result;
  }

  try {
    const supabase = getSupabaseClient();
    if (!supabase) return result;

    const { data, error } = await supabase
      .from("website_content")
      .select("section_key, content")
      .eq("is_published", true);

    if (!error && data) {
      for (const row of data) {
        if (row.section_key && row.content) {
          result[row.section_key] = sanitizePublishedContent(row.section_key, row.content);
        }
      }
    }
  } catch (err) {
    console.warn("[CMS] Error fetching all published sections:", err);
  }

  return result;
}

/**
 * Admin: Fetches complete section record including draft_content and publication status
 */
export async function getAdminSection<T>(
  sectionKey: string,
  sectionName: string,
  category: CMSCategory,
  fallbackDefault?: T
): Promise<CMSSectionRecord<T>> {
  const def = (fallbackDefault !== undefined ? fallbackDefault : getDefaultContentForSection(sectionKey)) as T;

  const initialRecord: CMSSectionRecord<T> = {
    id: `local-${sectionKey}`,
    section_key: sectionKey,
    section_name: sectionName,
    category,
    content: def,
    draft_content: null,
    is_published: true,
    has_draft: false,
    updated_at: new Date().toISOString(),
    published_at: new Date().toISOString(),
    updated_by: "system",
  };

  if (!isSupabaseConfigured()) {
    return initialRecord;
  }

  try {
    const supabase = getSupabaseClient();
    if (!supabase) return initialRecord;

    const { data, error } = await supabase
      .from("website_content")
      .select("*")
      .eq("section_key", sectionKey)
      .maybeSingle();

    if (error || !data) {
      return initialRecord;
    }

    return {
      id: data.id,
      section_key: data.section_key,
      section_name: data.section_name || sectionName,
      category: data.category || category,
      content: sanitizePublishedContent(sectionKey, data.content || def),
      draft_content: data.draft_content
        ? sanitizePublishedContent(sectionKey, data.draft_content)
        : null,
      is_published: data.is_published !== false,
      has_draft: Boolean(data.has_draft && data.draft_content),
      published_at: data.published_at,
      updated_at: data.updated_at,
      updated_by: data.updated_by || "admin@drkhospitals.com",
    };
  } catch (err) {
    console.warn(`[CMS] Error in getAdminSection('${sectionKey}'):`, err);
    return initialRecord;
  }
}

/**
 * Admin: Saves draft content without affecting the live public website
 */
export async function saveSectionDraft<T>(
  sectionKey: string,
  sectionName: string,
  category: CMSCategory,
  draftContent: T,
  existingContent?: T,
  updatedBy: string = "admin@drkhospitals.com"
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: false, error: "Supabase client is not configured in .env.local" };
  }

  try {
    const currentLiveContent = existingContent || getDefaultContentForSection(sectionKey);

    const payload = {
      section_key: sectionKey,
      section_name: sectionName,
      category,
      content: currentLiveContent,
      draft_content: draftContent,
      has_draft: true,
      updated_at: new Date().toISOString(),
      updated_by: updatedBy,
    };

    const { error } = await supabase
      .from("website_content")
      .upsert(payload, { onConflict: "section_key" });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unexpected error saving draft";
    return { success: false, error: msg };
  }
}

/**
 * Admin: Publishes content to the live public website
 */
export async function publishSection<T>(
  sectionKey: string,
  sectionName: string,
  category: CMSCategory,
  contentToPublish: T,
  updatedBy: string = "admin@drkhospitals.com"
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: false, error: "Supabase client is not configured in .env.local" };
  }

  try {
    const payload = {
      section_key: sectionKey,
      section_name: sectionName,
      category,
      content: contentToPublish,
      draft_content: null,
      has_draft: false,
      is_published: true,
      published_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      updated_by: updatedBy,
    };

    const { error } = await supabase
      .from("website_content")
      .upsert(payload, { onConflict: "section_key" });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unexpected error publishing section";
    return { success: false, error: msg };
  }
}

/**
 * Admin: Unpublishes a section so it is hidden on public pages
 */
export async function unpublishSection(
  sectionKey: string,
  updatedBy: string = "admin@drkhospitals.com"
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseClient();
  if (!supabase) return { success: false, error: "Supabase not configured" };

  try {
    const { error } = await supabase
      .from("website_content")
      .update({
        is_published: false,
        updated_at: new Date().toISOString(),
        updated_by: updatedBy,
      })
      .eq("section_key", sectionKey);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Error unpublishing" };
  }
}

/**
 * Admin: Discards draft and restores current published version
 */
export async function discardSectionDraft(
  sectionKey: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseClient();
  if (!supabase) return { success: false, error: "Supabase not configured" };

  try {
    const { error } = await supabase
      .from("website_content")
      .update({
        draft_content: null,
        has_draft: false,
        updated_at: new Date().toISOString(),
      })
      .eq("section_key", sectionKey);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Error discarding draft" };
  }
}

// ==========================================================
// Media Library Data Functions (Separate from public gallery)
// ==========================================================

export async function uploadWebsiteMedia(
  file: File,
  category: MediaCategory,
  title: string,
  altText: string,
  description?: string
): Promise<{ success: boolean; data?: WebsiteMediaItem; error?: string }> {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: false, error: "Supabase not configured in .env.local" };
  }

  try {
    const timestamp = Date.now();
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const storagePath = `cms/${category.toLowerCase().replace(/\s+/g, "-")}/${timestamp}-${cleanFileName}`;

    // Upload to website-media bucket (or gallery-images with cms/ prefix fallback)
    let uploadBucket = "website-media";
    let uploadRes = await supabase.storage.from(uploadBucket).upload(storagePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (uploadRes.error && uploadRes.error.message.includes("Bucket not found")) {
      // Fallback to gallery-images bucket if website-media has not yet been created in Supabase SQL editor
      uploadBucket = "gallery-images";
      uploadRes = await supabase.storage.from(uploadBucket).upload(`cms-media/${storagePath}`, file, {
        cacheControl: "3600",
        upsert: false,
      });
    }

    if (uploadRes.error) {
      return { success: false, error: `Storage upload failed: ${uploadRes.error.message}` };
    }

    const { data: publicUrlData } = supabase.storage
      .from(uploadBucket)
      .getPublicUrl(uploadRes.data.path);

    const mediaRecord = {
      title,
      alt_text: altText,
      description: description || null,
      category,
      storage_path: uploadRes.data.path,
      public_url: publicUrlData.publicUrl,
      file_name: file.name,
      file_size: file.size,
      mime_type: file.type,
      dimensions: null,
    };

    // Insert into website_media table if it exists
    const { data: dbData, error: dbError } = await supabase
      .from("website_media")
      .insert(mediaRecord)
      .select()
      .maybeSingle();

    if (dbError) {
      console.warn("[CMS Media] Note: website_media table record insert skipped (table may be pending creation):", dbError.message);
    }

    const finalItem: WebsiteMediaItem = dbData || {
      id: `local-media-${timestamp}`,
      ...mediaRecord,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return { success: true, data: finalItem };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Error uploading media" };
  }
}

export async function getWebsiteMediaList(
  category?: string,
  search?: string
): Promise<WebsiteMediaItem[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  try {
    let query = supabase.from("website_media").select("*").order("created_at", { ascending: false });

    if (category && category !== "All") {
      query = query.eq("category", category);
    }
    if (search && search.trim() !== "") {
      query = query.ilike("title", `%${search.trim()}%`);
    }

    const { data, error } = await query;
    if (error || !data) return [];
    return data as WebsiteMediaItem[];
  } catch {
    return [];
  }
}

export async function deleteWebsiteMedia(
  id: string,
  storagePath: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseClient();
  if (!supabase) return { success: false, error: "Supabase not configured" };

  try {
    // Determine bucket
    const bucket = storagePath.startsWith("cms-media/") ? "gallery-images" : "website-media";
    await supabase.storage.from(bucket).remove([storagePath]);

    const { error } = await supabase.from("website_media").delete().eq("id", id);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Error deleting media" };
  }
}

