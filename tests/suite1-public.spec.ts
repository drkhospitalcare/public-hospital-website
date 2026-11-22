import { test, expect } from "@playwright/test";

const PUBLIC_BASE = "http://localhost:8000";

test.describe("SUITE 1 – Public Website Tests", () => {
  test("PUB-001: Homepage returns HTTP 200", async ({ page }) => {
    const res = await page.goto(`${PUBLIC_BASE}/`);
    expect(res?.status()).toBe(200);
  });

  test("PUB-002: About page returns HTTP 200", async ({ page }) => {
    const res = await page.goto(`${PUBLIC_BASE}/about`);
    expect(res?.status()).toBe(200);
  });

  test("PUB-003: Services page returns HTTP 200", async ({ page }) => {
    const res = await page.goto(`${PUBLIC_BASE}/services`);
    expect(res?.status()).toBe(200);
  });

  test("PUB-004: Contact page returns HTTP 200", async ({ page }) => {
    const res = await page.goto(`${PUBLIC_BASE}/contact`);
    expect(res?.status()).toBe(200);
  });

  test("PUB-005: Gallery page returns HTTP 200", async ({ page }) => {
    const res = await page.goto(`${PUBLIC_BASE}/gallery`);
    expect(res?.status()).toBe(200);
  });

  test("PUB-006: Official DRK logo loads", async ({ page }) => {
    await page.goto(`${PUBLIC_BASE}/`);
    const logoImg = page.locator('header img[alt*="DRK Hospital"], header img[alt*="ROOTED IN CARE"]').first();
    await expect(logoImg).toBeVisible();
    const naturalWidth = await logoImg.evaluate((img: HTMLImageElement) => img.naturalWidth);
    expect(naturalWidth).toBeGreaterThan(0);
  });

  test("PUB-007: Header navigation works", async ({ page }) => {
    await page.goto(`${PUBLIC_BASE}/`);
    const aboutLink = page.locator('header nav a[href="/about"]').first();
    await expect(aboutLink).toBeVisible();
    await aboutLink.click();
    await expect(page).toHaveURL(`${PUBLIC_BASE}/about`);
  });

  test("PUB-008: Footer navigation works", async ({ page }) => {
    await page.goto(`${PUBLIC_BASE}/`);
    const footerServicesLink = page.locator('footer a[href="/services"]').first();
    await expect(footerServicesLink).toBeVisible();
    await footerServicesLink.click();
    await expect(page).toHaveURL(`${PUBLIC_BASE}/services`);
  });

  test("PUB-009: Mobile navigation opens and closes", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${PUBLIC_BASE}/`);
    const hamburger = page.locator('header button[aria-label="Open menu"]').first();
    await expect(hamburger).toBeVisible();
    await hamburger.click();

    const mobileMenu = page.locator('#mobile-navigation-menu');
    await expect(mobileMenu).toBeVisible();

    const closeBtn = page.locator('header button[aria-label="Close menu"]').first();
    await closeBtn.click();
    await expect(mobileMenu).not.toBeVisible();
  });

  test("PUB-010: Dental specialty content displays", async ({ page }) => {
    await page.goto(`${PUBLIC_BASE}/services`);
    const dentalHeading = page.locator('text=Dental').first();
    await expect(dentalHeading).toBeVisible();
  });

  test("PUB-011: Skin specialty content displays", async ({ page }) => {
    await page.goto(`${PUBLIC_BASE}/services`);
    const skinHeading = page.locator('text=Skin').first();
    await expect(skinHeading).toBeVisible();
  });

  test("PUB-012: Hair specialty content displays", async ({ page }) => {
    await page.goto(`${PUBLIC_BASE}/services`);
    const hairHeading = page.locator('text=Hair').first();
    await expect(hairHeading).toBeVisible();
  });

  test("PUB-013: Homepage CTA links work", async ({ page }) => {
    await page.goto(`${PUBLIC_BASE}/`);
    const telLink = page.locator('a[href^="tel:"]').first();
    await expect(telLink).toBeVisible();
  });

  test("PUB-014: Contact page links work", async ({ page }) => {
    await page.goto(`${PUBLIC_BASE}/contact`);
    const phoneLink = page.locator('a[href^="tel:"]').first();
    const whatsappLink = page.locator('a[href*="wa.me"]').first();
    await expect(phoneLink).toBeVisible();
    await expect(whatsappLink).toBeVisible();
  });

  test("PUB-015: No admin dashboard links appear on public pages", async ({ page }) => {
    for (const path of ["/", "/about", "/services", "/contact", "/gallery"]) {
      await page.goto(`${PUBLIC_BASE}${path}`);
      const adminLinks = page.locator('a[href*="/admin/dashboard"], a[href*="/admin/login"]');
      const count = await adminLinks.count();
      expect(count).toBe(0);
    }
  });
});

