import { test, expect } from "@playwright/test";
import * as fs from "fs";

test.describe("SUITE 17 – DRK Hospitals Favicon & Browser Tab Icon Verification", () => {
  test("FAV-001: Desktop viewport loads circular DRK favicon in head metadata", async ({ page }) => {
    await page.goto("http://localhost:8000/", { waitUntil: "networkidle" });

    // Verify title
    await expect(page).toHaveTitle(/DRK Hospitals/);

    // Verify favicon link tags exist
    const iconLinks = page.locator('link[rel="icon"], link[rel="shortcut icon"]');
    const count = await iconLinks.count();
    expect(count).toBeGreaterThan(0);

    // Verify /favicon.ico and /icon.png return 200 OK
    const [icoRes] = await Promise.all([
      page.request.get("http://localhost:8000/favicon.ico"),
    ]);
    expect(icoRes.status()).toBe(200);
    const icoContentType = icoRes.headers()["content-type"];
    expect(icoContentType).toContain("image/");

    const pngRes = await page.request.get("http://localhost:8000/icon.png");
    expect(pngRes.status()).toBe(200);
    expect(pngRes.headers()["content-type"]).toContain("image/png");

    const appleRes = await page.request.get("http://localhost:8000/apple-icon.png");
    expect(appleRes.status()).toBe(200);
    expect(appleRes.headers()["content-type"]).toContain("image/png");

    // Capture desktop screenshot
    await page.screenshot({ path: "test-results/favicon-desktop-view.png", fullPage: false });
  });

  test("FAV-002: Mobile viewport retains circular DRK favicon and apple touch icons", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("http://localhost:8000/", { waitUntil: "networkidle" });

    const appleTouchIcon = page.locator('link[rel="apple-touch-icon"]');
    await expect(appleTouchIcon).toHaveCount(1);
    const appleHref = await appleTouchIcon.getAttribute("href");
    expect(appleHref).toContain("apple");

    // Capture mobile screenshot
    await page.screenshot({ path: "test-results/favicon-mobile-view.png", fullPage: false });
  });

  test("FAV-003: Strictly verify that Header and Footer logos remain intact", async ({ page }) => {
    await page.goto("http://localhost:8000/", { waitUntil: "networkidle" });

    // Header logo exists and is visible
    const headerLogo = page.locator('header a[href="/"] img').first();
    await expect(headerLogo).toBeVisible();

    // Footer logo exists and is visible
    const footerLogo = page.locator('footer a[href="/"] img').first();
    await expect(footerLogo).toBeVisible();
  });
});

