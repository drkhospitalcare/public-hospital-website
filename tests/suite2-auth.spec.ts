import { test, expect } from "@playwright/test";
import { verifyServerAdminSession } from "../src/app/actions/admin-auth";

const ADMIN_BASE = "http://localhost:3001";

test.describe("SUITE 2 – Admin Authentication Tests", () => {
  test("AUTH-002: Invalid password is rejected", async ({ page }) => {
    await page.goto(`${ADMIN_BASE}/admin/login`);
    await page.fill('#email', "rrdeendhayal2002@gmail.com");
    await page.fill('#password', "DefinitiveWrongPassword999!");
    await page.click('button[type="submit"]');

    // Expect error alert or message
    const errorHeading = page.locator('h2', { hasText: /Incorrect Email or Password|Authentication Failed/i }).first();
    await expect(errorHeading).toBeVisible({ timeout: 10000 });
  });

  test("AUTH-003: Invalid email is rejected", async ({ page }) => {
    await page.goto(`${ADMIN_BASE}/admin/login`);
    await page.fill('#email', "nonexistent-user-12345@drkhospital.com");
    await page.fill('#password', "AnyPassword123!");
    await page.click('button[type="submit"]');

    const errorHeading = page.locator('h2', { hasText: /Incorrect Email or Password|Authentication Failed/i }).first();
    await expect(errorHeading).toBeVisible({ timeout: 10000 });
  });

  test("AUTH-007: Direct URL access without login is denied", async ({ page }) => {
    // In a fresh browser context without cookies
    await page.goto(`${ADMIN_BASE}/admin/dashboard`);
    await page.waitForURL(/.*\/admin\/login.*/, { timeout: 10000 });
    expect(page.url()).toContain("/admin/login");
  });

  test("AUTH-010: Protected API and Server Actions reject unauthorized / empty tokens", async () => {
    const emptyCheck = await verifyServerAdminSession("");
    expect(emptyCheck.authorized).toBe(false);
    expect(emptyCheck.error).toContain("missing");

    const invalidCheck = await verifyServerAdminSession("invalid.jwt.token.string");
    expect(invalidCheck.authorized).toBe(false);
    expect(invalidCheck.error).toBeDefined();
  });

  test("AUTH-011: Expired or malformed session is handled safely", async () => {
    const malformedCheck = await verifyServerAdminSession("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.t-IDcSemACt8x4iTMCda8Yhe3iZaWbvV5XKSTbuAn0M");
    expect(malformedCheck.authorized).toBe(false);
    expect(malformedCheck.error).toBeDefined();
  });

  test("AUTH-012: Admin root URL redirects correctly", async ({ page }) => {
    await page.goto(`${ADMIN_BASE}/`);
    await page.waitForURL(/.*\/admin\/(dashboard|login).*/, { timeout: 10000 });
    expect(page.url()).toMatch(/\/admin\/(dashboard|login)/);
  });
});

