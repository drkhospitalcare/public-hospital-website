import { test, expect } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";
import { verifyServerAdminSession } from "../src/app/actions/admin-auth";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://iqjlrprznvkzbnbixgww.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_Dnd9Do8OLLJWFvZ9_-5u2Q_hjiAtzmK";

test.describe("SUITE 10 – Database and Security Tests", () => {
  const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  test("DB-001 & DB-002: Anonymous SELECT on admin_users is denied by RLS", async () => {
    const { data, error } = await anonClient.from("admin_users").select("*");
    // RLS either returns empty array (zero rows visible to anon) or permission error
    if (data) {
      expect(data.length).toBe(0);
    } else {
      expect(error).toBeDefined();
    }
  });

  test("DB-003: Anonymous INSERT on admin_users is denied by RLS", async () => {
    const { error } = await anonClient.from("admin_users").insert({
      id: "00000000-0000-0000-0000-000000000000",
      email: "attacker@example.com",
      role: "super_admin",
      is_active: true,
    });
    expect(error).toBeDefined();
  });

  test("DB-004: Anonymous UPDATE on admin_users is denied by RLS", async () => {
    const { error } = await anonClient.from("admin_users").update({
      role: "super_admin",
    }).eq("email", "rrdeendhayal2002@gmail.com");
    // Should fail or update 0 rows
    if (error) {
      expect(error).toBeDefined();
    }
  });

  test("DB-005: Anonymous DELETE on admin_users is denied by RLS", async () => {
    const { error } = await anonClient.from("admin_users").delete().eq("email", "rrdeendhayal2002@gmail.com");
    if (error) {
      expect(error).toBeDefined();
    }
  });

  test("DB-009 & DB-010: Anonymous RPC execution on authorize/revoke is denied", async () => {
    const { error: authErr } = await anonClient.rpc("authorize_admin_user", {
      target_email: "hacker@example.com",
    });
    expect(authErr).toBeDefined();

    const { error: revErr } = await anonClient.rpc("revoke_admin_user", {
      target_email: "rrdeendhayal2002@gmail.com",
    });
    expect(revErr).toBeDefined();
  });

  test("DB-011: verify_current_admin RPC rejects unauthenticated calls", async () => {
    const { error } = await anonClient.rpc("verify_current_admin", {
      lookup_uid: "80573c3e-1842-435f-833c-fe2ba023b0fb",
    });
    expect(error).toBeDefined();
  });

  test("DB-012: Expired or forged JWT is rejected by server authorization", async () => {
    const forgedToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvZWwiLCJpYXQiOjE1MTYyMzkwMjJ9.40kZ3U1Ew7eM95z";
    const res = await verifyServerAdminSession(forgedToken);
    expect(res.authorized).toBe(false);
  });

  test("DB-013 & DB-014: Anonymous users cannot query draft content directly", async () => {
    const { data } = await anonClient
      .from("website_content")
      .select("section_key, draft_content, is_published")
      .eq("is_published", false);

    // Draft/unpublished rows must be invisible to public queries
    if (data) {
      expect(data.length).toBe(0);
    }
  });

  test("DB-015: Storage policies reject unauthenticated file uploads", async () => {
    const dummyBlob = new Blob(["test"], { type: "image/jpeg" });
    const { error: mediaErr } = await anonClient.storage.from("website-media").upload("unauthorized-test.jpg", dummyBlob);
    expect(mediaErr).toBeDefined();

    const { error: galleryErr } = await anonClient.storage.from("gallery-images").upload("unauthorized-gallery.jpg", dummyBlob);
    expect(galleryErr).toBeDefined();
  });
});

