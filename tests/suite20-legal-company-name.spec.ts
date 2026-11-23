import { test, expect } from "@playwright/test";

const PUBLIC_BASE = "http://localhost:8000";

test.describe("SUITE 20 – Full Registered Company Name Throughout Website", () => {
  test("LCN-001: Homepage About section displays subtle company identity line", async ({ page }) => {
    await page.goto(`${PUBLIC_BASE}/`, { waitUntil: "domcontentloaded" });

    // Homepage has brand name DRK Hospitals in logo / heading
    const logoImg = page.locator("header img[alt*='DRK']").first();
    await expect(logoImg).toBeVisible();

    // Homepage About section contains subtle legal line
    const aboutSection = page.locator("#about");
    await expect(aboutSection).toBeVisible();
    await expect(aboutSection).toContainText(
      "DRK Hospitals is the public healthcare brand associated with"
    );
    await expect(aboutSection).toContainText(
      "DRK Dental Skin & Hair Hospital Private Limited"
    );
  });

  test("LCN-002: About Us page has dedicated 'Our Legal Identity' section and preserves existing sections", async ({ page }) => {
    await page.goto(`${PUBLIC_BASE}/about`, { waitUntil: "domcontentloaded" });

    // 1. Founder Profile section intact at top
    const founderHeading = page.locator("h2, h3").filter({ hasText: /Dr\. R\. Ranjith Kumar/i }).first();
    await expect(founderHeading).toBeVisible();

    // 2. How We Began / Story section intact
    const storySection = page.locator("#about-story, section").filter({ hasText: /How We Began/i }).first();
    await expect(storySection).toBeVisible();

    // 3. Dedicated 'Our Legal Identity' section
    const legalSection = page.locator("#corporate-identity");
    await expect(legalSection).toBeVisible();

    const legalTitle = legalSection.locator("h2");
    await expect(legalTitle).toHaveText("Our Legal Identity");

    // Displays full registered company name prominently
    await expect(legalSection).toContainText("DRK DENTAL SKIN & HAIR HOSPITAL PRIVATE LIMITED");

    // Explains DRK Hospitals is public brand
    await expect(legalSection).toContainText("DRK Hospitals");
    await expect(legalSection).toContainText("registered");
  });

  test("LCN-003: Footer displays professional legal identity line near copyright", async ({ page }) => {
    await page.goto(`${PUBLIC_BASE}/`, { waitUntil: "domcontentloaded" });

    const footer = page.locator("footer");
    await expect(footer).toBeVisible();

    // Legal line near copyright
    await expect(footer).toContainText("DRK Hospitals is the public brand of");
    await expect(footer).toContainText("DRK DENTAL SKIN & HAIR HOSPITAL PRIVATE LIMITED");

    // Verified address and contact details preserved
    await expect(footer).toContainText("SF.No. 29/2A, Akkaia Naidu Street");
    await expect(footer).toContainText("Tiruttani");
  });

  test("LCN-004: Contact page displays registered company name in business information", async ({ page }) => {
    await page.goto(`${PUBLIC_BASE}/contact`, { waitUntil: "domcontentloaded" });

    // Business info card with legal entity
    const legalCard = page.locator(".card").filter({ hasText: "Corporate & Legal Entity" }).first();
    await expect(legalCard).toBeVisible();
    await expect(legalCard).toContainText("DRK DENTAL SKIN & HAIR HOSPITAL PRIVATE LIMITED");
    await expect(legalCard).toContainText("DRK Hospitals");

    // Hospital address preserved
    await expect(page.locator("body")).toContainText("SF.No. 29/2A, Akkaia Naidu Street");
  });

  test("LCN-005: Root Layout Organization Schema includes name and legalName", async ({ page }) => {
    await page.goto(`${PUBLIC_BASE}/`, { waitUntil: "domcontentloaded" });

    const jsonLd = page.locator('script[type="application/ld+json"]').first();
    await expect(jsonLd).toBeAttached();

    const data = JSON.parse((await jsonLd.textContent()) || "{}");
    const graph = data["@graph"] || [data];
    const hospital = graph.find(
      (e: any) =>
        (Array.isArray(e["@type"]) && e["@type"].includes("Hospital")) ||
        e["@type"] === "Hospital" ||
        e["@type"] === "Organization"
    );

    expect(hospital).toBeDefined();
    expect(hospital.name).toBe("DRK Hospitals");
    expect(hospital.legalName).toBe("DRK Dental Skin & Hair Hospital Private Limited");
  });
});
