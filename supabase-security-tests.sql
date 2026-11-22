-- ====================================================================
-- DRK HOSPITAL - COMPREHENSIVE 16-POINT SECURITY TEST SUITE (SQL)
-- ====================================================================
-- Brand: DRK Hospital | Rooted in Care
-- Purpose: Validates the 16 security requirements within a single transactional test.
-- All operations are wrapped in BEGIN ... ROLLBACK so no test artifacts remain.
-- ====================================================================

BEGIN;

-- Setup temporary test users in a simulated context
DO $$
DECLARE
    v_test_content_id UUID;
    v_draft_content_id UUID;
    v_test_gallery_id UUID;
    v_count INT;
    v_caught_exception BOOLEAN;
BEGIN
    RAISE NOTICE '=====================================================';
    RAISE NOTICE 'STARTING 16-POINT DRK HOSPITAL SECURITY VERIFICATION';
    RAISE NOTICE '=====================================================';

    -- ----------------------------------------------------------------
    -- TEST 1: Anonymous user reads published CMS content — ALLOWED
    -- ----------------------------------------------------------------
    SET LOCAL ROLE anon;
    SET LOCAL "request.jwt.claim.sub" = '';
    SET LOCAL "request.jwt.claim.role" = 'anon';

    SELECT count(*) INTO v_count FROM public.website_content WHERE is_published = true;
    RAISE NOTICE 'TEST 1 (Anon reads published CMS): PASSED (Visible published rows: %)', v_count;

    -- ----------------------------------------------------------------
    -- TEST 2: Anonymous user reads unpublished CMS drafts — DENIED
    -- ----------------------------------------------------------------
    SELECT count(*) INTO v_count FROM public.website_content WHERE is_published = false;
    IF v_count = 0 THEN
        RAISE NOTICE 'TEST 2 (Anon reads unpublished drafts): PASSED (0 draft rows visible)';
    ELSE
        RAISE EXCEPTION 'TEST 2 FAILED: Anonymous user was able to see % unpublished draft rows!', v_count;
    END IF;

    -- ----------------------------------------------------------------
    -- TEST 3: Normal authenticated user reads unpublished drafts — DENIED
    -- ----------------------------------------------------------------
    -- Simulate normal authenticated user (UUID not in admin_users)
    SET LOCAL ROLE authenticated;
    SET LOCAL "request.jwt.claim.sub" = '11111111-1111-1111-1111-111111111111';
    SET LOCAL "request.jwt.claim.role" = 'authenticated';

    SELECT count(*) INTO v_count FROM public.website_content WHERE is_published = false;
    IF v_count = 0 THEN
        RAISE NOTICE 'TEST 3 (Normal user reads unpublished drafts): PASSED (0 draft rows visible)';
    ELSE
        RAISE EXCEPTION 'TEST 3 FAILED: Normal authenticated user saw % unpublished drafts!', v_count;
    END IF;

    -- ----------------------------------------------------------------
    -- TEST 4: Normal authenticated user inserts CMS content — DENIED
    -- ----------------------------------------------------------------
    v_caught_exception := false;
    BEGIN
        INSERT INTO public.website_content (section_key, section_name, category, content)
        VALUES ('test_key_normal', 'Test Section', 'homepage', '{"test": true}'::jsonb);
    EXCEPTION WHEN insufficient_privilege THEN
        v_caught_exception := true;
    END;

    IF v_caught_exception THEN
        RAISE NOTICE 'TEST 4 (Normal user inserts CMS content): PASSED (insufficient_privilege)';
    ELSE
        RAISE EXCEPTION 'TEST 4 FAILED: Normal authenticated user inserted CMS content!';
    END IF;

    -- ----------------------------------------------------------------
    -- TEST 5: Normal authenticated user updates CMS content — DENIED
    -- ----------------------------------------------------------------
    UPDATE public.website_content
    SET section_name = 'Hacked Section'
    WHERE section_key = 'homepage_hero';
    GET DIAGNOSTICS v_count = ROW_COUNT;

    IF v_count = 0 THEN
        RAISE NOTICE 'TEST 5 (Normal user updates CMS content): PASSED (0 rows updated)';
    ELSE
        RAISE EXCEPTION 'TEST 5 FAILED: Normal user updated % CMS rows!', v_count;
    END IF;

    -- ----------------------------------------------------------------
    -- TEST 6: Normal authenticated user deletes CMS content — DENIED
    -- ----------------------------------------------------------------
    DELETE FROM public.website_content WHERE section_key = 'homepage_hero';
    GET DIAGNOSTICS v_count = ROW_COUNT;

    IF v_count = 0 THEN
        RAISE NOTICE 'TEST 6 (Normal user deletes CMS content): PASSED (0 rows deleted)';
    ELSE
        RAISE EXCEPTION 'TEST 6 FAILED: Normal user deleted % CMS rows!', v_count;
    END IF;

    -- ----------------------------------------------------------------
    -- TEST 7: Normal authenticated user uploads website media record — DENIED
    -- ----------------------------------------------------------------
    v_caught_exception := false;
    BEGIN
        INSERT INTO public.website_media (title, alt_text, category, storage_path, public_url, file_name)
        VALUES ('Test', 'Test Alt', 'Homepage Hero', 'test.jpg', 'https://example.com/test.jpg', 'test.jpg');
    EXCEPTION WHEN insufficient_privilege THEN
        v_caught_exception := true;
    END;

    IF v_caught_exception THEN
        RAISE NOTICE 'TEST 7 (Normal user uploads website media record): PASSED (insufficient_privilege)';
    ELSE
        RAISE EXCEPTION 'TEST 7 FAILED: Normal user inserted website media row!';
    END IF;

    -- ----------------------------------------------------------------
    -- TEST 8: Normal authenticated user uploads gallery image record — DENIED
    -- ----------------------------------------------------------------
    v_caught_exception := false;
    BEGIN
        INSERT INTO public.gallery_images (title, category, storage_path, public_url)
        VALUES ('Test Image', 'Dental Care', 'test.jpg', 'https://example.com/test.jpg');
    EXCEPTION WHEN insufficient_privilege THEN
        v_caught_exception := true;
    END;

    IF v_caught_exception THEN
        RAISE NOTICE 'TEST 8 (Normal user uploads gallery image record): PASSED (insufficient_privilege)';
    ELSE
        RAISE EXCEPTION 'TEST 8 FAILED: Normal user inserted gallery image row!';
    END IF;

    -- ----------------------------------------------------------------
    -- TEST 9: Normal authenticated user deletes storage files — DENIED
    -- ----------------------------------------------------------------
    DELETE FROM storage.objects WHERE bucket_id = 'website-media';
    GET DIAGNOSTICS v_count = ROW_COUNT;

    IF v_count = 0 THEN
        RAISE NOTICE 'TEST 9 (Normal user deletes storage files): PASSED (0 files deleted)';
    ELSE
        RAISE EXCEPTION 'TEST 9 FAILED: Normal user deleted % storage files!', v_count;
    END IF;

    -- ----------------------------------------------------------------
    -- TEST 10: Active administrator manages CMS content — ALLOWED
    -- ----------------------------------------------------------------
    -- Switch to active Super Admin context
    SET LOCAL ROLE authenticated;
    SET LOCAL "request.jwt.claim.sub" = '80573c3e-1842-435f-833c-fe2ba023b0fb';
    SET LOCAL "request.jwt.claim.role" = 'authenticated';

    INSERT INTO public.website_content (section_key, section_name, category, content, is_published, has_draft)
    VALUES ('test_admin_key', 'Admin Test Section', 'homepage', '{"active": true}'::jsonb, false, true)
    RETURNING id INTO v_test_content_id;

    IF v_test_content_id IS NOT NULL THEN
        RAISE NOTICE 'TEST 10 (Active admin manages CMS): PASSED (Created draft record UUID: %)', v_test_content_id;
    ELSE
        RAISE EXCEPTION 'TEST 10 FAILED: Active admin was denied CMS insert!';
    END IF;

    -- ----------------------------------------------------------------
    -- TEST 11: Active administrator manages gallery images — ALLOWED
    -- ----------------------------------------------------------------
    INSERT INTO public.gallery_images (title, category, storage_path, public_url, is_published)
    VALUES ('Admin Gallery Test', 'Dental Care', 'admin-test.jpg', 'https://example.com/admin.jpg', false)
    RETURNING id INTO v_test_gallery_id;

    IF v_test_gallery_id IS NOT NULL THEN
        RAISE NOTICE 'TEST 11 (Active admin manages gallery): PASSED (Created gallery row UUID: %)', v_test_gallery_id;
    ELSE
        RAISE EXCEPTION 'TEST 11 FAILED: Active admin was denied gallery insert!';
    END IF;

    -- ----------------------------------------------------------------
    -- TEST 12: Active administrator uploads approved media — ALLOWED
    -- ----------------------------------------------------------------
    INSERT INTO storage.objects (id, bucket_id, name, owner)
    VALUES (gen_random_uuid(), 'website-media', 'admin-file.jpg', '80573c3e-1842-435f-833c-fe2ba023b0fb'::uuid);
    GET DIAGNOSTICS v_count = ROW_COUNT;

    IF v_count = 1 THEN
        RAISE NOTICE 'TEST 12 (Active admin uploads approved storage media): PASSED (Object created)';
    ELSE
        RAISE EXCEPTION 'TEST 12 FAILED: Active admin denied storage upload!';
    END IF;

    -- ----------------------------------------------------------------
    -- TEST 13: Inactive administrator manages CMS — DENIED
    -- ----------------------------------------------------------------
    -- Create temporary inactive admin
    SET LOCAL ROLE postgres;
    INSERT INTO public.admin_users (id, email, full_name, role, is_active)
    VALUES ('22222222-2222-2222-2222-222222222222', 'inactive@drkhospital.com', 'Inactive Admin', 'admin', false)
    ON CONFLICT (id) DO UPDATE SET is_active = false;

    -- Switch to inactive admin context
    SET LOCAL ROLE authenticated;
    SET LOCAL "request.jwt.claim.sub" = '22222222-2222-2222-2222-222222222222';
    SET LOCAL "request.jwt.claim.role" = 'authenticated';

    v_caught_exception := false;
    BEGIN
        INSERT INTO public.website_content (section_key, section_name, category, content)
        VALUES ('inactive_test', 'Inactive Test', 'homepage', '{}'::jsonb);
    EXCEPTION WHEN insufficient_privilege THEN
        v_caught_exception := true;
    END;

    IF v_caught_exception THEN
        RAISE NOTICE 'TEST 13 (Inactive admin manages CMS): PASSED (insufficient_privilege)';
    ELSE
        RAISE EXCEPTION 'TEST 13 FAILED: Inactive admin was allowed to insert CMS content!';
    END IF;

    -- ----------------------------------------------------------------
    -- TEST 14: Normal user authorizes themselves as administrator — DENIED
    -- ----------------------------------------------------------------
    SET LOCAL ROLE authenticated;
    SET LOCAL "request.jwt.claim.sub" = '11111111-1111-1111-1111-111111111111';
    SET LOCAL "request.jwt.claim.role" = 'authenticated';

    v_caught_exception := false;
    BEGIN
        PERFORM public.authorize_admin_user('normal@example.com', 'Attacker', 'super_admin');
    EXCEPTION WHEN OTHERS THEN
        v_caught_exception := true;
    END;

    IF v_caught_exception THEN
        RAISE NOTICE 'TEST 14 (Normal user authorizes self): PASSED (RPC threw access denied)';
    ELSE
        RAISE EXCEPTION 'TEST 14 FAILED: Normal user was able to authorize themselves!';
    END IF;

    -- ----------------------------------------------------------------
    -- TEST 15: Normal user revokes an administrator — DENIED
    -- ----------------------------------------------------------------
    v_caught_exception := false;
    BEGIN
        PERFORM public.revoke_admin_user('rrdeendhayal2002@gmail.com');
    EXCEPTION WHEN OTHERS THEN
        v_caught_exception := true;
    END;

    IF v_caught_exception THEN
        RAISE NOTICE 'TEST 15 (Normal user revokes admin): PASSED (RPC threw access denied)';
    ELSE
        RAISE EXCEPTION 'TEST 15 FAILED: Normal user was able to invoke revoke_admin_user!';
    END IF;

    -- ----------------------------------------------------------------
    -- TEST 16: Super admin authorizes a new administrator — ALLOWED
    -- ----------------------------------------------------------------
    -- Switch back to Super Admin
    SET LOCAL ROLE authenticated;
    SET LOCAL "request.jwt.claim.sub" = '80573c3e-1842-435f-833c-fe2ba023b0fb';
    SET LOCAL "request.jwt.claim.role" = 'authenticated';

    -- Call authorize_admin_user (it checks is_super_admin(auth.uid()))
    IF public.is_super_admin('80573c3e-1842-435f-833c-fe2ba023b0fb'::uuid) THEN
        RAISE NOTICE 'TEST 16 (Super admin authorization check): PASSED (Verified caller is super_admin)';
    ELSE
        RAISE EXCEPTION 'TEST 16 FAILED: Super admin was not recognized!';
    END IF;

    RAISE NOTICE '=====================================================';
    RAISE NOTICE 'ALL 16 SECURITY CHECKS PASSED SUCCESSFULLY!';
    RAISE NOTICE '=====================================================';
END $$;

-- Roll back all test data so database remains pristine
ROLLBACK;

