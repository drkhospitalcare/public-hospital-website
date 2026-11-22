-- ====================================================================
-- DRK HOSPITAL - DEFENSE-IN-DEPTH RLS SECURITY HARDENING
-- ====================================================================
-- Brand: DRK Hospital | Rooted in Care
-- Purpose: Tighten Row Level Security (RLS) policies on website_content,
--          website_media, gallery_images, and storage buckets so that
--          ONLY verified active administrators (in public.admin_users)
--          can view draft content, modify CMS records, or upload files.
--
-- Pre-requisite: supabase-admin-schema.sql must have been executed first
--                so that public.is_active_admin() is available.
--
-- Safe & Non-Destructive: Modifies RLS policies only. Zero data loss.
-- ====================================================================

-- 1. Tighten website_content RLS policies
DROP POLICY IF EXISTS "Public can view published website content" ON public.website_content;
CREATE POLICY "Public can view published website content"
    ON public.website_content
    FOR SELECT
    USING (is_published = true OR public.is_active_admin(auth.uid()));

DROP POLICY IF EXISTS "Authenticated users can insert website content" ON public.website_content;
CREATE POLICY "Active admins can insert website content"
    ON public.website_content
    FOR INSERT
    TO authenticated
    WITH CHECK (public.is_active_admin(auth.uid()));

DROP POLICY IF EXISTS "Authenticated users can update website content" ON public.website_content;
CREATE POLICY "Active admins can update website content"
    ON public.website_content
    FOR UPDATE
    TO authenticated
    USING (public.is_active_admin(auth.uid()))
    WITH CHECK (public.is_active_admin(auth.uid()));

DROP POLICY IF EXISTS "Authenticated users can delete website content" ON public.website_content;
CREATE POLICY "Active admins can delete website content"
    ON public.website_content
    FOR DELETE
    TO authenticated
    USING (public.is_active_admin(auth.uid()));


-- 2. Tighten website_media RLS policies
DROP POLICY IF EXISTS "Authenticated users can insert website media" ON public.website_media;
CREATE POLICY "Active admins can insert website media"
    ON public.website_media
    FOR INSERT
    TO authenticated
    WITH CHECK (public.is_active_admin(auth.uid()));

DROP POLICY IF EXISTS "Authenticated users can update website media" ON public.website_media;
CREATE POLICY "Active admins can update website media"
    ON public.website_media
    FOR UPDATE
    TO authenticated
    USING (public.is_active_admin(auth.uid()))
    WITH CHECK (public.is_active_admin(auth.uid()));

DROP POLICY IF EXISTS "Authenticated users can delete website media" ON public.website_media;
CREATE POLICY "Active admins can delete website media"
    ON public.website_media
    FOR DELETE
    TO authenticated
    USING (public.is_active_admin(auth.uid()));


-- 3. Tighten gallery_images RLS policies
DROP POLICY IF EXISTS "Public can view published gallery images" ON public.gallery_images;
CREATE POLICY "Public can view published gallery images"
    ON public.gallery_images
    FOR SELECT
    USING (is_published = true OR public.is_active_admin(auth.uid()));

DROP POLICY IF EXISTS "Authenticated users can insert gallery images" ON public.gallery_images;
CREATE POLICY "Active admins can insert gallery images"
    ON public.gallery_images
    FOR INSERT
    TO authenticated
    WITH CHECK (public.is_active_admin(auth.uid()));

DROP POLICY IF EXISTS "Authenticated users can update gallery images" ON public.gallery_images;
CREATE POLICY "Active admins can update gallery images"
    ON public.gallery_images
    FOR UPDATE
    TO authenticated
    USING (public.is_active_admin(auth.uid()))
    WITH CHECK (public.is_active_admin(auth.uid()));

DROP POLICY IF EXISTS "Authenticated users can delete gallery images" ON public.gallery_images;
CREATE POLICY "Active admins can delete gallery images"
    ON public.gallery_images
    FOR DELETE
    TO authenticated
    USING (public.is_active_admin(auth.uid()));


-- 4. Tighten Storage Bucket upload/modification policies
DROP POLICY IF EXISTS "Authenticated users can upload website media storage" ON storage.objects;
CREATE POLICY "Active admins can upload website media storage"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'website-media' AND public.is_active_admin(auth.uid()));

DROP POLICY IF EXISTS "Authenticated users can update website media storage" ON storage.objects;
CREATE POLICY "Active admins can update website media storage"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (bucket_id = 'website-media' AND public.is_active_admin(auth.uid()));

DROP POLICY IF EXISTS "Authenticated users can delete website media storage" ON storage.objects;
CREATE POLICY "Active admins can delete website media storage"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (bucket_id = 'website-media' AND public.is_active_admin(auth.uid()));

DROP POLICY IF EXISTS "Authenticated users can upload gallery files" ON storage.objects;
CREATE POLICY "Active admins can upload gallery files"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'gallery-images' AND public.is_active_admin(auth.uid()));

DROP POLICY IF EXISTS "Authenticated users can update gallery files" ON storage.objects;
CREATE POLICY "Active admins can update gallery files"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (bucket_id = 'gallery-images' AND public.is_active_admin(auth.uid()));

DROP POLICY IF EXISTS "Authenticated users can delete gallery files" ON storage.objects;
CREATE POLICY "Active admins can delete gallery files"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (bucket_id = 'gallery-images' AND public.is_active_admin(auth.uid()));

