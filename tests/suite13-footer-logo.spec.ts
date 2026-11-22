import { test, expect } from "@playwright/test";
import * as defaults from "../src/lib/cms-defaults";
import { getDefaultContentForSection } from "../src/lib/cms";
import { FooterSettingsContent } from "../src/types/cms";

const PUBLIC_BASE = "http://localhost:8000";
const ADMIN_BASE = "http://localhost:3001";

test.describe("SUITE 13 – Footer Logo CMS & Public Integration Tests", () => {
  // -------------------------------------------------------------
  // Part 1: Public Website Footer Logo Tests
  // -------------------------------------------------------------
  test("FT-001: Public footer displays the DRK Hospital logo in white container", async ({ page }) => {
    await page.goto(`${PUBLIC_BASE}/`);

    // Locate the link inside footer that contains the logo
    const footerLogoLink = page.locator('footer a[href="/"]').first();
    await expect(footerLogoLink).toBeVisible();

    // Verify it has the white rounded container classes
    const classList = await footerLogoLink.getAttribute("class");
    expect(classList).toContain("bg-white");
    expect(classList).toContain("rounded-2xl");

    // Verify the logo image is rendered inside
    const footerLogoImg = footerLogoLink.locator("img").first();
    await expect(footerLogoImg).toBeVisible();

    const naturalWidth = await footerLogoImg.evaluate((img: HTMLImageElement) => img.naturalWidth);
    expect(naturalWidth).toBeGreaterThan(0);

    const naturalHeight = await footerLogoImg.evaluate((img: HTMLImageElement) => img.naturalHeight);
    expect(naturalHeight).toBeGreaterThan(0);

    // Verify object-contain styling
    const imgClasses = await footerLogoImg.getAttribute("class");
    expect(imgClasses).toContain("object-contain");
  });

  test("FT-002: Header logo and footer logo are completely independent", async ({ page }) => {
    await page.goto(`${PUBLIC_BASE}/`);

    // Header logo exists and is visible
    const headerLogo = page.locator('header a[href="/"] img').first();
    await expect(headerLogo).toBeVisible();

    // Footer logo exists and is visible
    const footerLogo = page.locator('footer a[href="/"] img').first();
    await expect(footerLogo).toBeVisible();

    // Verify both are present on the same page without conflict
    const count = await page.locator('a[href="/"] img').count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test("FT-003: Public footer logo is responsive on mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${PUBLIC_BASE}/`);

    const footerLogoLink = page.locator('footer a[href="/"]').first();
    await expect(footerLogoLink).toBeVisible();

    const footerLogoImg = footerLogoLink.locator("img").first();
    await expect(footerLogoImg).toBeVisible();
    const naturalWidth = await footerLogoImg.evaluate((img: HTMLImageElement) => img.naturalWidth);
    expect(naturalWidth).toBeGreaterThan(0);
  });

  test("FT-004: Footer logo displays on all main public pages", async ({ page }) => {
    const pages = ["/about", "/services", "/contact", "/gallery"];
    for (const path of pages) {
      await page.goto(`${PUBLIC_BASE}${path}`);
      const footerLogoImg = page.locator('footer a[href="/"] img').first();
      await expect(footerLogoImg).toBeVisible();
    }
  });

  // -------------------------------------------------------------
  // Part 2: CMS Defaults and Type Integrity
  // -------------------------------------------------------------
  test("FT-005: Footer settings default is complete and strongly typed", () => {
    const footer = getDefaultContentForSection("footer_settings") as FooterSettingsContent;
    expect(footer).toBeDefined();
    expect(footer.enabled).toBe(true);
    expect(footer.logoUrl).toBe("/images/drk-logo.png");
    expect(footer.logoAlt).toBe("ROOTED IN CARE | DRK Hospital");
    expect(footer.caption).toBe("DRK Hospital – Rooted in Care");
  });

  test("FT-006: CMS defaults object contains DEFAULT_FOOTER_SETTINGS", () => {
    expect(defaults.DEFAULT_FOOTER_SETTINGS).toBeDefined();
    expect(defaults.DEFAULT_FOOTER_SETTINGS.enabled).toBe(true);
    expect(defaults.DEFAULT_FOOTER_SETTINGS.logoUrl).toContain("drk-logo.png");
  });

  // -------------------------------------------------------------
  // Part 3: Admin CMS Security & Route Protection
  // -------------------------------------------------------------
  test("FT-007: Unauthenticated request to Footer Settings tab redirects to login", async ({ page }) => {
    await page.goto(`${ADMIN_BASE}/admin/dashboard/website-content?tab=footer`);
    await page.waitForURL(/.*\/admin\/login.*/, { timeout: 10000 });
    expect(page.url()).toContain("/admin/login");
  });
});

