-- ====================================================================
-- DRK HOSPITAL - PHASE 7: COMPLETE WEBSITE CONTENT MANAGEMENT SYSTEM (CMS)
-- DATABASE SCHEMA & ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
-- Brand: DRK Hospital | Rooted in Care
-- Safe & Non-Destructive: Does not drop or modify existing tables/data.
--
-- Instructions:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard
-- 2. Select your DRK Hospital project (iqjlrprznvkzbnbixgww)
-- 3. Click "SQL Editor" in the left sidebar
-- 4. Click "New Query", paste this entire script and click "Run"
-- ====================================================================

-- 1. Create website_content table
CREATE TABLE IF NOT EXISTS public.website_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_key TEXT UNIQUE NOT NULL,
    section_name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (
        category IN ('homepage', 'about', 'services', 'contact', 'location', 'social', 'seo', 'general')
    ),
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    draft_content JSONB,
    is_published BOOLEAN NOT NULL DEFAULT true,
    has_draft BOOLEAN NOT NULL DEFAULT false,
    published_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by TEXT DEFAULT 'admin@drkhospital.com'
);

-- Index for high-performance queries
CREATE INDEX IF NOT EXISTS idx_website_content_key ON public.website_content (section_key);
CREATE INDEX IF NOT EXISTS idx_website_content_published ON public.website_content (is_published, category);

-- Automatic updated_at trigger for website_content
CREATE OR REPLACE FUNCTION public.handle_website_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_website_content_updated_at ON public.website_content;
CREATE TRIGGER trigger_website_content_updated_at
    BEFORE UPDATE ON public.website_content
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_website_content_updated_at();

-- Enable RLS on website_content
ALTER TABLE public.website_content ENABLE ROW LEVEL SECURITY;

-- Policy: Public visitors can ONLY view published content (cannot view drafts)
DROP POLICY IF EXISTS "Public can view published website content" ON public.website_content;
CREATE POLICY "Public can view published website content"
    ON public.website_content
    FOR SELECT
    USING (is_published = true OR auth.role() = 'authenticated');

-- Policy: Authenticated administrators can insert website content
DROP POLICY IF EXISTS "Authenticated users can insert website content" ON public.website_content;
CREATE POLICY "Authenticated users can insert website content"
    ON public.website_content
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Policy: Authenticated administrators can update website content (save draft & publish)
DROP POLICY IF EXISTS "Authenticated users can update website content" ON public.website_content;
CREATE POLICY "Authenticated users can update website content"
    ON public.website_content
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Policy: Authenticated administrators can delete website content
DROP POLICY IF EXISTS "Authenticated users can delete website content" ON public.website_content;
CREATE POLICY "Authenticated users can delete website content"
    ON public.website_content
    FOR DELETE
    TO authenticated
    USING (true);


-- 2. Create website_media table (Media Library separate from public gallery)
CREATE TABLE IF NOT EXISTS public.website_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    alt_text TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (
        category IN (
            'Homepage Hero',
            'Doctors and Clinical Team',
            'Dental Care',
            'Skin Care',
            'Hair Care',
            'About Hospital',
            'Clinical Standards',
            'Infrastructure',
            'Reception',
            'Medical Equipment',
            'Hospital Activities',
            'Other'
        )
    ),
    storage_path TEXT NOT NULL,
    public_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size BIGINT,
    mime_type TEXT,
    dimensions TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for media search and category filtering
CREATE INDEX IF NOT EXISTS idx_website_media_category ON public.website_media (category, created_at DESC);

-- Enable RLS on website_media
ALTER TABLE public.website_media ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view website media assets
DROP POLICY IF EXISTS "Public can view website media" ON public.website_media;
CREATE POLICY "Public can view website media"
    ON public.website_media
    FOR SELECT
    USING (true);

-- Policy: Only authenticated administrators can upload media records
DROP POLICY IF EXISTS "Authenticated users can insert website media" ON public.website_media;
CREATE POLICY "Authenticated users can insert website media"
    ON public.website_media
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Policy: Only authenticated administrators can update media records
DROP POLICY IF EXISTS "Authenticated users can update website media" ON public.website_media;
CREATE POLICY "Authenticated users can update website media"
    ON public.website_media
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Policy: Only authenticated administrators can delete media records
DROP POLICY IF EXISTS "Authenticated users can delete website media" ON public.website_media;
CREATE POLICY "Authenticated users can delete website media"
    ON public.website_media
    FOR DELETE
    TO authenticated
    USING (true);


-- 3. Storage Bucket for Website CMS Media
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'website-media',
    'website-media',
    true,
    10485760, -- 10 MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']::text[]
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 10485760,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']::text[];

-- Storage Policies for website-media bucket
DROP POLICY IF EXISTS "Public can view website media storage" ON storage.objects;
CREATE POLICY "Public can view website media storage"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'website-media');

DROP POLICY IF EXISTS "Authenticated users can upload website media storage" ON storage.objects;
CREATE POLICY "Authenticated users can upload website media storage"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'website-media');

DROP POLICY IF EXISTS "Authenticated users can update website media storage" ON storage.objects;
CREATE POLICY "Authenticated users can update website media storage"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (bucket_id = 'website-media');

DROP POLICY IF EXISTS "Authenticated users can delete website media storage" ON storage.objects;
CREATE POLICY "Authenticated users can delete website media storage"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (bucket_id = 'website-media');

