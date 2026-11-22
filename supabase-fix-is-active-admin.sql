-- ====================================================================
-- DRK HOSPITAL - FIX IS_ACTIVE_ADMIN PERMISSION FOR RLS EVALUATION
-- ====================================================================
-- Target Database: Supabase PostgreSQL (Project ID: iqjlrprznvkzbnbixgww)
-- Purpose:
-- 1. Updates is_active_admin(UUID) to ensure unauthenticated callers (auth.uid() IS NULL)
--    always return FALSE immediately (anti-enumeration & safe default).
-- 2. Grants EXECUTE on is_active_admin(UUID) to anon, authenticated, service_role
--    so PostgreSQL can evaluate SELECT RLS policies on website_content and gallery_images
--    without throwing "permission denied for function is_active_admin".
-- 3. Does NOT grant anon access to is_super_admin(), verify_current_admin(),
--    authorize_admin_user(), or revoke_admin_user().
-- 4. Safe and non-destructive: Does not alter tables, RLS policies, or user records.
-- ====================================================================

-- STEP 1: Update is_active_admin(UUID) with strict unauthenticated guard
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

-- STEP 2: Revoke from public, then grant strictly to anon, authenticated, service_role
REVOKE EXECUTE ON FUNCTION public.is_active_admin(UUID) FROM public;
GRANT EXECUTE ON FUNCTION public.is_active_admin(UUID) TO anon, authenticated, service_role;

-- STEP 3: Ensure all other privileged functions remain strictly restricted (no anon access)
REVOKE EXECUTE ON FUNCTION public.is_super_admin(UUID) FROM public, anon;
REVOKE EXECUTE ON FUNCTION public.verify_current_admin(UUID) FROM public, anon;
REVOKE EXECUTE ON FUNCTION public.authorize_admin_user(TEXT, TEXT, TEXT) FROM public, anon;
REVOKE EXECUTE ON FUNCTION public.revoke_admin_user(TEXT) FROM public, anon;

GRANT EXECUTE ON FUNCTION public.is_super_admin(UUID) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.verify_current_admin(UUID) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.authorize_admin_user(TEXT, TEXT, TEXT) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.revoke_admin_user(TEXT) TO authenticated, service_role;

-- Verification query: check granted permissions on is_active_admin
SELECT 
    routine_name, 
    grantee, 
    privilege_type
FROM information_schema.routine_privileges
WHERE routine_schema = 'public' 
  AND routine_name IN ('is_active_admin', 'is_super_admin', 'verify_current_admin', 'authorize_admin_user', 'revoke_admin_user')
ORDER BY routine_name, grantee;

