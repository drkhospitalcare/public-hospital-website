-- ====================================================================
-- DRK HOSPITAL - SUPABASE GALLERY SCHEMA & ROW LEVEL SECURITY (RLS)
-- ====================================================================
-- Brand: DRK Hospital | Rooted in Care
-- Specialties: Dental Care, Skin Care, Hair Care, Hospital Infrastructure, Hospital Activities
--
-- Instructions:
-- 1. Create a Supabase project at https://supabase.com
-- 2. Open the SQL Editor in your Supabase dashboard
-- 3. Paste and run this script
-- 4. Copy your Project URL & Anon Key into .env.local:
--    NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
--    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
-- ====================================================================

-- 1. Create gallery_images table
CREATE TABLE IF NOT EXISTS public.gallery_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    caption TEXT,
    category TEXT NOT NULL CHECK (
        category IN (
            'Dental Care',
            'Skin Care',
            'Hair Care',
            'Hospital Infrastructure',
            'Hospital Activities'
        )
    ),
    storage_path TEXT NOT NULL,
    public_url TEXT NOT NULL,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast public queries filtered by publish status and category
CREATE INDEX IF NOT EXISTS idx_gallery_images_published_category
    ON public.gallery_images (is_published, category, created_at DESC);

-- 2. Automatic updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_gallery_images_updated_at ON public.gallery_images;
CREATE TRIGGER trigger_gallery_images_updated_at
    BEFORE UPDATE ON public.gallery_images
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 3. Enable Row Level Security (RLS) on gallery_images
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- 4. Policy: Public can only view published images; Authenticated admins can view all
DROP POLICY IF EXISTS "Public can view published gallery images" ON public.gallery_images;
DROP POLICY IF EXISTS "Public can view gallery images" ON public.gallery_images;

CREATE POLICY "Public can view published gallery images"
    ON public.gallery_images
    FOR SELECT
    USING (is_published = true OR auth.role() = 'authenticated');

-- 5. Policy: Only authenticated administrators can insert images
DROP POLICY IF EXISTS "Authenticated users can insert gallery images" ON public.gallery_images;
CREATE POLICY "Authenticated users can insert gallery images"
    ON public.gallery_images
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- 6. Policy: Only authenticated administrators can update images
DROP POLICY IF EXISTS "Authenticated users can update gallery images" ON public.gallery_images;
CREATE POLICY "Authenticated users can update gallery images"
    ON public.gallery_images
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 7. Policy: Only authenticated administrators can delete images
DROP POLICY IF EXISTS "Authenticated users can delete gallery images" ON public.gallery_images;
CREATE POLICY "Authenticated users can delete gallery images"
    ON public.gallery_images
    FOR DELETE
    TO authenticated
    USING (true);

-- 8. Create Storage Bucket for Gallery Images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'gallery-images',
    'gallery-images',
    true,
    10485760, -- 10 MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 10485760,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[];

-- 9. Storage RLS Policies for gallery-images bucket
-- Anyone can view images in the public gallery-images bucket
DROP POLICY IF EXISTS "Public can view gallery files" ON storage.objects;
CREATE POLICY "Public can view gallery files"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'gallery-images');

-- Only authenticated users can upload files to gallery-images bucket
DROP POLICY IF EXISTS "Authenticated users can upload gallery files" ON storage.objects;
CREATE POLICY "Authenticated users can upload gallery files"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'gallery-images'
    );

-- Only authenticated users can update files in gallery-images bucket
DROP POLICY IF EXISTS "Authenticated users can update gallery files" ON storage.objects;
CREATE POLICY "Authenticated users can update gallery files"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (bucket_id = 'gallery-images');

-- Only authenticated users can delete files in gallery-images bucket
DROP POLICY IF EXISTS "Authenticated users can delete gallery files" ON storage.objects;
CREATE POLICY "Authenticated users can delete gallery files"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (bucket_id = 'gallery-images');
