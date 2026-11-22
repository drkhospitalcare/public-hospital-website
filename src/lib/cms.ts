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
 * Fetches published section content for public pages.
 * Falls back to approved defaults if table or record does not exist.
 */
export async function getPublishedSection<T>(sectionKey: string, fallback?: T): Promise<T> {
  const defaultFallback = (fallback !== undefined ? fallback : getDefaultContentForSection(sectionKey)) as T;

  if (!isSupabaseConfigured()) {
    return defaultFallback;
  }

  try {
    const supabase = getSupabaseClient();
    if (!supabase) return defaultFallback;

    const { data, error } = await supabase
      .from("website_content")
      .select("content, is_published")
      .eq("section_key", sectionKey)
      .eq("is_published", true)
      .maybeSingle();

    if (error || !data || !data.content) {
      return defaultFallback;
    }

    return data.content as T;
  } catch (err) {
    console.warn(`[CMS] Error fetching published section '${sectionKey}':`, err);
    return defaultFallback;
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
          result[row.section_key] = row.content;
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
      content: data.content || def,
      draft_content: data.draft_content || null,
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

