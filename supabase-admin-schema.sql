-- ====================================================================
-- DRK HOSPITAL - SECURE ADMINISTRATOR ACCESS CONTROL SCHEMA & RLS
-- ====================================================================
-- Brand: DRK Hospital | Rooted in Care
-- Purpose: Hardened database-driven administrator authorization linked to Supabase Auth.
--
-- SECURITY PRINCIPLES:
-- 1. ZERO PUBLIC ACCESS: Unauthenticated (anon) users have NO access to admin_users.
-- 2. USER ISOLATION: A user can only inspect their own admin authorization status.
-- 3. STRICT SUPER_ADMIN CONTROL: Only active super_admin accounts can insert,
--    update, or delete administrator records.
-- 4. SECURITY DEFINER VERIFICATION: verify_current_admin(lookup_uid) strictly
--    enforces auth.uid() = lookup_uid before returning the caller's record.
-- 5. AUDITED EXECUTION: Security-sensitive functions cannot be executed by anon.
--
-- INSTRUCTIONS TO RUN:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard
-- 2. Select your DRK Hospital project (iqjlrprznvkzbnbixgww)
-- 3. Click "SQL Editor" in the left sidebar
-- 4. Click "New Query", paste this entire script and click "Run"
-- ====================================================================

-- 1. Create public.admin_users table linked to auth.users by UUID
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'hospital_admin', 'doctor', 'staff')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes for instant lookups
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users (lower(email));
CREATE INDEX IF NOT EXISTS idx_admin_users_is_active ON public.admin_users (is_active);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON public.admin_users (role);

-- 2. Automatic updated_at timestamp trigger
CREATE OR REPLACE FUNCTION public.handle_admin_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_admin_users_updated_at ON public.admin_users;
CREATE TRIGGER trigger_admin_users_updated_at
    BEFORE UPDATE ON public.admin_users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_admin_users_updated_at();

-- 3. Helper function: Check if a user UUID is an active administrator
CREATE OR REPLACE FUNCTION public.is_active_admin(lookup_uid UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = lookup_uid AND is_active = true
  );
$$;

-- 4. Helper function: Check if a user UUID is an active SUPER_ADMIN
CREATE OR REPLACE FUNCTION public.is_super_admin(lookup_uid UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = lookup_uid AND role = 'super_admin' AND is_active = true
  );
$$;

-- 5. Secure Verification Function (Requirement 4)
-- SECURITY DEFINER function that:
-- - Accepts the authenticated user's UUID
-- - Checks that auth.uid() strictly matches lookup_uid
-- - Returns ONLY the caller's administrator record
-- - Does NOT expose records belonging to other users
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
    -- Security Check 1: Must be authenticated
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'Authentication required. No authenticated session found.';
    END IF;

    -- Security Check 2: Caller can ONLY verify their own UUID!
    IF auth.uid() <> lookup_uid THEN
        RAISE EXCEPTION 'Forbidden: You are not authorized to verify another user account.';
    END IF;

    -- Return strictly the caller's administrator row
    RETURN QUERY
    SELECT a.id, a.email, a.full_name, a.role, a.is_active
    FROM public.admin_users a
    WHERE a.id = lookup_uid;
END;
$$;

-- 6. Enable Row Level Security (RLS) on admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Clean up any previous open or insecure policies
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

-- Policy 1: SELECT (Requirement 1, 2, 3)
-- Authenticated users can ONLY view their own record (auth.uid() = id),
-- OR active administrators can view the administrator roster.
-- (Anonymous users have ZERO select access).
CREATE POLICY "Admins can view own or team admin records"
    ON public.admin_users
    FOR SELECT
    TO authenticated
    USING (
        auth.uid() = id
        OR public.is_active_admin(auth.uid())
    );

-- Policy 2: INSERT (Requirement 9)
-- Strictly restricted to authorized super_admin accounts.
CREATE POLICY "Super admins can insert admin records"
    ON public.admin_users
    FOR INSERT
    TO authenticated
    WITH CHECK (
        public.is_super_admin(auth.uid())
    );

-- Policy 3: UPDATE (Requirement 9)
-- Strictly restricted to authorized super_admin accounts.
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

-- Policy 4: DELETE (Requirement 9)
-- Strictly restricted to authorized super_admin accounts.
CREATE POLICY "Super admins can delete admin records"
    ON public.admin_users
    FOR DELETE
    TO authenticated
    USING (
        public.is_super_admin(auth.uid())
    );

-- 7. Stored Procedure: Authorize an administrator by email
-- When called from Supabase SQL Editor (auth.uid() IS NULL), runs with superuser privileges.
-- When called via RPC by an authenticated user, strictly enforces that caller is an active super_admin.
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

    -- If called by authenticated user, verify caller is a super_admin
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

    -- Insert or update in public.admin_users linking user UUID
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

-- 8. Stored Procedure: Revoke administrator access by email
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

    -- If called by authenticated user, verify caller is a super_admin
    IF auth.uid() IS NOT NULL THEN
        IF NOT public.is_super_admin(auth.uid()) THEN
            RAISE EXCEPTION 'Access denied. Only super_admin accounts can revoke administrators.';
        END IF;
    END IF;

    -- Prevent revoking own active super_admin account
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

-- 9. Restrict EXECUTE permissions on security-sensitive functions (Requirement 8)
-- Revoke all permissions from anonymous / public
REVOKE EXECUTE ON FUNCTION public.is_active_admin(UUID) FROM public, anon;
REVOKE EXECUTE ON FUNCTION public.is_super_admin(UUID) FROM public, anon;
REVOKE EXECUTE ON FUNCTION public.verify_current_admin(UUID) FROM public, anon;
REVOKE EXECUTE ON FUNCTION public.authorize_admin_user(TEXT, TEXT, TEXT) FROM public, anon;
REVOKE EXECUTE ON FUNCTION public.revoke_admin_user(TEXT) FROM public, anon;

-- Grant execution strictly to authenticated users and service_role
GRANT EXECUTE ON FUNCTION public.is_active_admin(UUID) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_super_admin(UUID) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.verify_current_admin(UUID) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.authorize_admin_user(TEXT, TEXT, TEXT) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.revoke_admin_user(TEXT) TO authenticated, service_role;

-- 10. Bootstrap/Guarantee Super Admin for Designated Account
INSERT INTO public.admin_users (id, email, full_name, role, is_active)
SELECT 
    u.id,
    lower(u.email),
    COALESCE(u.raw_user_meta_data->>'full_name', 'Super Administrator'),
    'super_admin',
    true
FROM auth.users u
WHERE u.id = '80573c3e-1842-435f-833c-fe2ba023b0fb'::uuid
   OR lower(u.email) = 'rrdeendhayal2002@gmail.com'
ON CONFLICT (id) DO UPDATE SET 
    is_active = true, 
    role = 'super_admin',
    email = EXCLUDED.email;

-- 11. Verification Query: Confirm authorized administrators
SELECT id, email, full_name, role, is_active, created_at, updated_at
FROM public.admin_users;
