-- ====================================================================
-- DRK HOSPITAL - FINAL SUPABASE RLS SECURITY MIGRATION
-- ====================================================================
-- Brand: DRK Hospital | Rooted in Care
-- Target Database: Supabase PostgreSQL (Project ID: iqjlrprznvkzbnbixgww)
-- Super Admin UUID: 80573c3e-1842-435f-833c-fe2ba023b0fb (rrdeendhayal2002@gmail.com)
--
-- PURPOSE:
-- 1. Complete eradication of legacy, permissive, or conflicting RLS policies.
-- 2. Strict enforcement of Administrator-Only permissions for CMS, Media, Gallery, and Storage.
-- 3. Public and normal authenticated users are restricted to published content only.
-- 4. Inactive administrators lose administrative privileges immediately.
-- 5. Anti-enumeration protections added to SECURITY DEFINER functions.
--
-- EXECUTION NOTICE:
-- Safe and non-destructive. Modifies RLS policies and functions only.
-- Preserves all existing CMS records, drafts, gallery images, media, and user accounts.
-- Run in Supabase SQL Editor after the 3 schema migrations have been applied.
-- ====================================================================

-- --------------------------------------------------------------------
-- STEP 1: CLEANLY DROP ALL PREVIOUS & CONFLICTING RLS POLICIES
-- --------------------------------------------------------------------

-- Explicit drops for public.admin_users
DROP POLICY IF EXISTS "Allow read admin_users for verification" ON public.admin_users;
DROP POLICY IF EXISTS "Public read admin_users for verification" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can view own and team admin records" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can view own or team admin records" ON public.admin_users;
DROP POLICY IF EXISTS "Active admins can insert admin records" ON public.admin_users;
DROP POLICY IF EXISTS "Super admins can insert admin records" ON public.admin_users;
DROP POLICY IF EXISTS "Active admins can update admin status" ON public.admin_users;
DROP POLICY IF EXISTS "Super admins can update admin records" ON public.admin_users;
DROP POLICY IF EXISTS "Active admins can delete admin records" ON public.admin_users;
DROP POLICY IF EXISTS "Super admins can delete admin records" ON public.admin_users;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.admin_users;

-- Explicit drops for public.website_content
DROP POLICY IF EXISTS "Public can view published website content" ON public.website_content;
DROP POLICY IF EXISTS "Public can view website content" ON public.website_content;
DROP POLICY IF EXISTS "Authenticated users can insert website content" ON public.website_content;
DROP POLICY IF EXISTS "Authenticated users can update website content" ON public.website_content;
DROP POLICY IF EXISTS "Authenticated users can delete website content" ON public.website_content;
DROP POLICY IF EXISTS "Active admins can insert website content" ON public.website_content;
DROP POLICY IF EXISTS "Active admins can update website content" ON public.website_content;
DROP POLICY IF EXISTS "Active admins can delete website content" ON public.website_content;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.website_content;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.website_content;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.website_content;

-- Explicit drops for public.website_media
DROP POLICY IF EXISTS "Public can view website media" ON public.website_media;
DROP POLICY IF EXISTS "Anyone can view website media" ON public.website_media;
DROP POLICY IF EXISTS "Authenticated users can insert website media" ON public.website_media;
DROP POLICY IF EXISTS "Authenticated users can update website media" ON public.website_media;
DROP POLICY IF EXISTS "Authenticated users can delete website media" ON public.website_media;
DROP POLICY IF EXISTS "Active admins can insert website media" ON public.website_media;
DROP POLICY IF EXISTS "Active admins can update website media" ON public.website_media;
DROP POLICY IF EXISTS "Active admins can delete website media" ON public.website_media;

-- Explicit drops for public.gallery_images
DROP POLICY IF EXISTS "Public can view published gallery images" ON public.gallery_images;
DROP POLICY IF EXISTS "Public can view gallery images" ON public.gallery_images;
DROP POLICY IF EXISTS "Anyone can view published gallery images" ON public.gallery_images;
DROP POLICY IF EXISTS "Authenticated users can insert gallery images" ON public.gallery_images;
DROP POLICY IF EXISTS "Authenticated users can update gallery images" ON public.gallery_images;
DROP POLICY IF EXISTS "Authenticated users can delete gallery images" ON public.gallery_images;
DROP POLICY IF EXISTS "Active admins can insert gallery images" ON public.gallery_images;
DROP POLICY IF EXISTS "Active admins can update gallery images" ON public.gallery_images;
DROP POLICY IF EXISTS "Active admins can delete gallery images" ON public.gallery_images;

-- Explicit drops for storage.objects
DROP POLICY IF EXISTS "Public can view website media storage" ON storage.objects;
DROP POLICY IF EXISTS "Public can view website media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload website media storage" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update website media storage" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete website media storage" ON storage.objects;
DROP POLICY IF EXISTS "Active admins can upload website media storage" ON storage.objects;
DROP POLICY IF EXISTS "Active admins can update website media storage" ON storage.objects;
DROP POLICY IF EXISTS "Active admins can delete website media storage" ON storage.objects;
DROP POLICY IF EXISTS "Public can view gallery files" ON storage.objects;
DROP POLICY IF EXISTS "Public can view gallery images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload gallery files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update gallery files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete gallery files" ON storage.objects;
DROP POLICY IF EXISTS "Active admins can upload gallery files" ON storage.objects;
DROP POLICY IF EXISTS "Active admins can update gallery files" ON storage.objects;
DROP POLICY IF EXISTS "Active admins can delete gallery files" ON storage.objects;

-- Dynamic cleanup: Purge any remaining custom or legacy policies on target tables
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT policyname, tablename
        FROM pg_policies
        WHERE schemaname = 'public'
          AND tablename IN ('admin_users', 'website_content', 'website_media', 'gallery_images')
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.policyname, r.tablename);
    END LOOP;

    FOR r IN (
        SELECT policyname
        FROM pg_policies
        WHERE schemaname = 'storage'
          AND tablename = 'objects'
          AND (
            policyname ILIKE '%website media%'
            OR policyname ILIKE '%website-media%'
            OR policyname ILIKE '%gallery%'
          )
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', r.policyname);
    END LOOP;
END $$;


-- --------------------------------------------------------------------
-- STEP 2: HARDEN SECURITY DEFINER HELPER FUNCTIONS
-- --------------------------------------------------------------------

-- Function 1: Check if caller or target user UUID is an active administrator
-- Anti-enumeration protection: Normal users can only check their own UUID.
CREATE OR REPLACE FUNCTION public.is_active_admin(lookup_uid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
BEGIN
    IF lookup_uid IS NULL THEN
        RETURN false;
    END IF;

    -- Unauthenticated callers always receive false (no enumeration possible)
    IF auth.uid() IS NULL THEN
        RETURN false;
    END IF;

    -- Anti-enumeration: If authenticated user probes a different UUID,
    -- require that the caller themselves is an active administrator.
    IF auth.uid() <> lookup_uid THEN
        IF NOT EXISTS (
            SELECT 1 FROM public.admin_users
            WHERE id = auth.uid() AND is_active = true
        ) THEN
            RETURN false;
        END IF;
    END IF;

    RETURN EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE id = lookup_uid AND is_active = true
    );
END;
$$;

-- Function 2: Check if caller or target user UUID is an active Super Admin
CREATE OR REPLACE FUNCTION public.is_super_admin(lookup_uid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
BEGIN
    IF lookup_uid IS NULL THEN
        RETURN false;
    END IF;

    IF auth.uid() IS NOT NULL AND auth.uid() <> lookup_uid THEN
        IF NOT EXISTS (
            SELECT 1 FROM public.admin_users
            WHERE id = auth.uid() AND role = 'super_admin' AND is_active = true
        ) THEN
            RETURN false;
        END IF;
    END IF;

    RETURN EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE id = lookup_uid AND role = 'super_admin' AND is_active = true
    );
END;
$$;

-- Function 3: Verify caller's own administrator record
CREATE OR REPLACE FUNCTION public.verify_current_admin(lookup_uid UUID)
RETURNS TABLE (
    id UUID,
    email TEXT,
    full_name TEXT,
    role TEXT,
    is_active BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
BEGIN
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'Authentication required. No authenticated session found.';
    END IF;

    IF auth.uid() <> lookup_uid THEN
        RAISE EXCEPTION 'Forbidden: You are not authorized to verify another user account.';
    END IF;

    RETURN QUERY
    SELECT a.id, a.email, a.full_name, a.role, a.is_active
    FROM public.admin_users a
    WHERE a.id = lookup_uid;
END;
$$;

-- Function 4: Authorize an administrator account
CREATE OR REPLACE FUNCTION public.authorize_admin_user(
    target_email TEXT,
    target_full_name TEXT DEFAULT NULL,
    target_role TEXT DEFAULT 'admin'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
    found_user RECORD;
    result_record RECORD;
    clean_email TEXT;
    assigned_role TEXT;
BEGIN
    clean_email := lower(trim(target_email));
    assigned_role := lower(trim(COALESCE(target_role, 'admin')));

    IF assigned_role NOT IN ('super_admin', 'admin', 'hospital_admin', 'doctor', 'staff') THEN
        assigned_role := 'admin';
    END IF;

    -- Enforce: Authenticated callers must be an active super_admin
    IF auth.uid() IS NOT NULL THEN
        IF NOT public.is_super_admin(auth.uid()) THEN
            RAISE EXCEPTION 'Access denied. Only super_admin accounts can authorize administrators.';
        END IF;
    END IF;

    -- Lookup user in Supabase Authentication
    SELECT id, email, raw_user_meta_data INTO found_user
    FROM auth.users
    WHERE lower(email) = clean_email;

    IF found_user.id IS NULL THEN
        RETURN jsonb_build_object(
            'success', false,
            'message', format('User "%s" not found in Supabase Authentication. Please create this user first under Authentication -> Users -> Add User.', clean_email)
        );
    END IF;

    -- Upsert administrator record linked to auth.users UUID
    INSERT INTO public.admin_users (id, email, full_name, role, is_active, updated_at)
    VALUES (
        found_user.id,
        clean_email,
        COALESCE(target_full_name, (found_user.raw_user_meta_data->>'full_name'), split_part(clean_email, '@', 1)),
        assigned_role,
        true,
        timezone('utc'::text, now())
    )
    ON CONFLICT (id) DO UPDATE SET
        email = clean_email,
        full_name = COALESCE(EXCLUDED.full_name, public.admin_users.full_name),
        role = EXCLUDED.role,
        is_active = true,
        updated_at = timezone('utc'::text, now())
    RETURNING * INTO result_record;

    RETURN jsonb_build_object(
        'success', true,
        'message', format('Administrator "%s" successfully authorized with UUID "%s" and role "%s".', clean_email, result_record.id, result_record.role),
        'user_id', result_record.id,
        'email', result_record.email,
        'role', result_record.role,
        'is_active', result_record.is_active
    );
END;
$$;

-- Function 5: Revoke administrator access
CREATE OR REPLACE FUNCTION public.revoke_admin_user(target_email TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
    clean_email TEXT;
    target_record RECORD;
    updated_count INT;
BEGIN
    clean_email := lower(trim(target_email));

    IF auth.uid() IS NOT NULL THEN
        IF NOT public.is_super_admin(auth.uid()) THEN
            RAISE EXCEPTION 'Access denied. Only super_admin accounts can revoke administrators.';
        END IF;
    END IF;

    -- Prevent self-revocation
    IF auth.uid() IS NOT NULL THEN
        SELECT id INTO target_record FROM public.admin_users WHERE lower(email) = clean_email;
        IF target_record.id = auth.uid() THEN
            RAISE EXCEPTION 'Operation denied: You cannot revoke your own administrator account.';
        END IF;
    END IF;

    UPDATE public.admin_users
    SET is_active = false, updated_at = timezone('utc'::text, now())
    WHERE lower(email) = clean_email;

    GET DIAGNOSTICS updated_count = ROW_COUNT;

    IF updated_count = 0 THEN
        RETURN jsonb_build_object(
            'success', false,
            'message', format('No administrator found with email "%s".', clean_email)
        );
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'message', format('Administrator access for "%s" has been revoked (is_active = false).', clean_email)
    );
END;
$$;

-- Revoke all function permissions from public & anon
REVOKE EXECUTE ON FUNCTION public.is_active_admin(UUID) FROM public;
REVOKE EXECUTE ON FUNCTION public.is_super_admin(UUID) FROM public, anon;
REVOKE EXECUTE ON FUNCTION public.verify_current_admin(UUID) FROM public, anon;
REVOKE EXECUTE ON FUNCTION public.authorize_admin_user(TEXT, TEXT, TEXT) FROM public, anon;
REVOKE EXECUTE ON FUNCTION public.revoke_admin_user(TEXT) FROM public, anon;

-- Grant execution: is_active_admin needed by anon for table SELECT RLS policy evaluation
GRANT EXECUTE ON FUNCTION public.is_active_admin(UUID) TO anon, authenticated, service_role;

-- Grant privileged functions strictly to authenticated and service_role (never anon)
GRANT EXECUTE ON FUNCTION public.is_super_admin(UUID) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.verify_current_admin(UUID) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.authorize_admin_user(TEXT, TEXT, TEXT) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.revoke_admin_user(TEXT) TO authenticated, service_role;


-- --------------------------------------------------------------------
-- STEP 3: CONFIGURE AIRTIGHT RLS POLICIES ON PUBLIC.ADMIN_USERS
-- --------------------------------------------------------------------
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 1. SELECT: Authenticated user can view own record; active admins can view roster
CREATE POLICY "Admins can view own or team admin records"
    ON public.admin_users
    FOR SELECT
    TO authenticated
    USING (
        auth.uid() = id
        OR public.is_active_admin(auth.uid())
    );

-- 2. INSERT: Strictly super_admin
CREATE POLICY "Super admins can insert admin records"
    ON public.admin_users
    FOR INSERT
    TO authenticated
    WITH CHECK (
        public.is_super_admin(auth.uid())
    );

-- 3. UPDATE: Strictly super_admin
CREATE POLICY "Super admins can update admin records"
    ON public.admin_users
    FOR UPDATE
    TO authenticated
    USING (
        public.is_super_admin(auth.uid())
    )
    WITH CHECK (
        public.is_super_admin(auth.uid())
    );

-- 4. DELETE: Strictly super_admin
CREATE POLICY "Super admins can delete admin records"
    ON public.admin_users
    FOR DELETE
    TO authenticated
    USING (
        public.is_super_admin(auth.uid())
    );


-- --------------------------------------------------------------------
-- STEP 4: CONFIGURE AIRTIGHT RLS POLICIES ON PUBLIC.WEBSITE_CONTENT
-- --------------------------------------------------------------------
ALTER TABLE public.website_content ENABLE ROW LEVEL SECURITY;

-- 1. SELECT: Public and normal users read published only; active admins read all (including drafts)
CREATE POLICY "Public and normal users view published content; active admins view all"
    ON public.website_content
    FOR SELECT
    USING (
        is_published = true
        OR (auth.uid() IS NOT NULL AND public.is_active_admin(auth.uid()))
    );

-- 2. INSERT: Strictly active administrators
CREATE POLICY "Only active admins can insert website content"
    ON public.website_content
    FOR INSERT
    TO authenticated
    WITH CHECK (
        public.is_active_admin(auth.uid())
    );

-- 3. UPDATE: Strictly active administrators
CREATE POLICY "Only active admins can update website content"
    ON public.website_content
    FOR UPDATE
    TO authenticated
    USING (
        public.is_active_admin(auth.uid())
    )
    WITH CHECK (
        public.is_active_admin(auth.uid())
    );

-- 4. DELETE: Strictly active administrators
CREATE POLICY "Only active admins can delete website content"
    ON public.website_content
    FOR DELETE
    TO authenticated
    USING (
        public.is_active_admin(auth.uid())
    );


-- --------------------------------------------------------------------
-- STEP 5: CONFIGURE AIRTIGHT RLS POLICIES ON PUBLIC.WEBSITE_MEDIA
-- --------------------------------------------------------------------
ALTER TABLE public.website_media ENABLE ROW LEVEL SECURITY;

-- 1. SELECT: Publicly viewable
CREATE POLICY "Anyone can view website media metadata"
    ON public.website_media
    FOR SELECT
    USING (true);

-- 2. INSERT: Strictly active administrators
CREATE POLICY "Only active admins can insert website media"
    ON public.website_media
    FOR INSERT
    TO authenticated
    WITH CHECK (
        public.is_active_admin(auth.uid())
    );

-- 3. UPDATE: Strictly active administrators
CREATE POLICY "Only active admins can update website media"
    ON public.website_media
    FOR UPDATE
    TO authenticated
    USING (
        public.is_active_admin(auth.uid())
    )
    WITH CHECK (
        public.is_active_admin(auth.uid())
    );

-- 4. DELETE: Strictly active administrators
CREATE POLICY "Only active admins can delete website media"
    ON public.website_media
    FOR DELETE
    TO authenticated
    USING (
        public.is_active_admin(auth.uid())
    );


-- --------------------------------------------------------------------
-- STEP 6: CONFIGURE AIRTIGHT RLS POLICIES ON PUBLIC.GALLERY_IMAGES
-- --------------------------------------------------------------------
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- 1. SELECT: Public and normal users view published only; active admins view all
CREATE POLICY "Public and normal users view published gallery; active admins view all"
    ON public.gallery_images
    FOR SELECT
    USING (
        is_published = true
        OR (auth.uid() IS NOT NULL AND public.is_active_admin(auth.uid()))
    );

-- 2. INSERT: Strictly active administrators
CREATE POLICY "Only active admins can insert gallery images"
    ON public.gallery_images
    FOR INSERT
    TO authenticated
    WITH CHECK (
        public.is_active_admin(auth.uid())
    );

-- 3. UPDATE: Strictly active administrators
CREATE POLICY "Only active admins can update gallery images"
    ON public.gallery_images
    FOR UPDATE
    TO authenticated
    USING (
        public.is_active_admin(auth.uid())
    )
    WITH CHECK (
        public.is_active_admin(auth.uid())
    );

-- 4. DELETE: Strictly active administrators
CREATE POLICY "Only active admins can delete gallery images"
    ON public.gallery_images
    FOR DELETE
    TO authenticated
    USING (
        public.is_active_admin(auth.uid())
    );


-- --------------------------------------------------------------------
-- STEP 7: CONFIGURE AIRTIGHT STORAGE POLICIES ON STORAGE.OBJECTS
-- --------------------------------------------------------------------

-- 1. SELECT: Anyone can view files in the two public buckets
CREATE POLICY "Public can view website media files"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'website-media');

CREATE POLICY "Public can view gallery files"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'gallery-images');

-- 2. INSERT: Strictly active administrators uploading to approved buckets
CREATE POLICY "Only active admins can upload website media files"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'website-media'
        AND public.is_active_admin(auth.uid())
    );

CREATE POLICY "Only active admins can upload gallery files"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'gallery-images'
        AND public.is_active_admin(auth.uid())
    );

-- 3. UPDATE: Strictly active administrators; enforces bucket_id constraint on both sides
CREATE POLICY "Only active admins can update website media files"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (
        bucket_id = 'website-media'
        AND public.is_active_admin(auth.uid())
    )
    WITH CHECK (
        bucket_id = 'website-media'
        AND public.is_active_admin(auth.uid())
    );

CREATE POLICY "Only active admins can update gallery files"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (
        bucket_id = 'gallery-images'
        AND public.is_active_admin(auth.uid())
    )
    WITH CHECK (
        bucket_id = 'gallery-images'
        AND public.is_active_admin(auth.uid())
    );

-- 4. DELETE: Strictly active administrators
CREATE POLICY "Only active admins can delete website media files"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'website-media'
        AND public.is_active_admin(auth.uid())
    );

CREATE POLICY "Only active admins can delete gallery files"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'gallery-images'
        AND public.is_active_admin(auth.uid())
    );


-- --------------------------------------------------------------------
-- STEP 8: NON-DESTRUCTIVE SUPER ADMIN BOOTSTRAP GUARANTEE
-- --------------------------------------------------------------------
-- Ensures the designated Super Admin account is active and retains super_admin role.
-- Strictly scoped to UUID 80573c3e-1842-435f-833c-fe2ba023b0fb.
-- Never affects, modifies, or overwrites any other administrator record.
INSERT INTO public.admin_users (id, email, full_name, role, is_active)
SELECT 
    u.id,
    lower(u.email),
    COALESCE(u.raw_user_meta_data->>'full_name', 'Super Administrator'),
    'super_admin',
    true
FROM auth.users u
WHERE u.id = '80573c3e-1842-435f-833c-fe2ba023b0fb'::uuid
ON CONFLICT (id) DO UPDATE SET 
    is_active = true, 
    role = 'super_admin',
    email = EXCLUDED.email
WHERE public.admin_users.id = '80573c3e-1842-435f-833c-fe2ba023b0fb'::uuid;


-- --------------------------------------------------------------------
-- STEP 9: AUDIT & VERIFICATION QUERY
-- --------------------------------------------------------------------
-- Returns the exact set of active policies to verify zero open policies remain
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE (schemaname = 'public' AND tablename IN ('admin_users', 'website_content', 'website_media', 'gallery_images'))
   OR (schemaname = 'storage' AND tablename = 'objects')
ORDER BY tablename, cmd;

