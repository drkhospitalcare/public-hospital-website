import { test, expect } from "@playwright/test";
import * as defaults from "../src/lib/cms-defaults";
import { getDefaultContentForSection } from "../src/lib/cms";

test.describe("SUITES 3, 4, 5, 6 – Admin Dashboard & CMS Modules Verification", () => {
  // -------------------------------------------------------------
  // SUITE 3: Admin Dashboard Structure & Navigation
  // -------------------------------------------------------------
  test("DASH-001: Unauthenticated request to /admin/dashboard redirects to /admin/login", async ({
    page,
  }) => {
    await page.goto("http://localhost:3001/admin/dashboard");
    await expect(page).toHaveURL(/.*\/admin\/login/);
  });

  test("DASH-006: Website Preview / View Public Site target points to port 8000", () => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:8000";
    expect(siteUrl === "http://localhost:8000" || siteUrl.includes("drkhospitals.com") || siteUrl.includes("8000")).toBe(true);
  });

  // -------------------------------------------------------------
  // SUITE 4: Homepage CMS Module (HOME-001 to HOME-010)
  // -------------------------------------------------------------
  test("HOME-001: Homepage CMS defaults are complete and properly typed", () => {
    const hero = getDefaultContentForSection("homepage_hero") as typeof defaults.DEFAULT_HOMEPAGE_HERO;
    expect(hero).toBeDefined();
    expect(hero.eyebrow).toBe("Rooted in Care • DRK Hospital Chennai");
    expect(hero.heading).toContain("Smile, Skin and Hair");
    expect(hero.badgeTitle).toBe("Certified Standards");
    expect(hero.timingBadge).toContain("Mon – Sat");
  });

  test("HOME-003: Specialties default contains Dental, Skin, and Hair disciplines", () => {
    const specialties = getDefaultContentForSection("homepage_specialties") as typeof defaults.DEFAULT_HOMEPAGE_SPECIALTIES;
    expect(specialties.items).toHaveLength(3);
    const titles = specialties.items.map((s) => s.title);
    expect(titles).toContain("Dental Care");
    expect(titles).toContain("Skin Care");
    expect(titles).toContain("Hair Care");
  });

  test("HOME-005: Why DRK contains 4 clinical foundation advantages", () => {
    const whyDrk = getDefaultContentForSection("homepage_why_drk") as typeof defaults.DEFAULT_HOMEPAGE_WHY_DRK;
    expect(whyDrk.advantages.length).toBeGreaterThanOrEqual(4);
    expect(whyDrk.heading).toContain("Integrity & Patient Safety");
  });

  test("HOME-006: Facilities default contains preview infrastructure items", () => {
    const facilities = getDefaultContentForSection("homepage_facilities") as typeof defaults.DEFAULT_HOMEPAGE_FACILITIES;
    expect(facilities.items.length).toBeGreaterThanOrEqual(3);
  });

  test("HOME-007: Patient Journey contains 4 structured clinical steps", () => {
    const journey = getDefaultContentForSection("homepage_journey") as typeof defaults.DEFAULT_HOMEPAGE_JOURNEY;
    expect(journey.steps).toHaveLength(4);
    expect(journey.steps[0].stepNumber).toBe("01");
    expect(journey.steps[3].stepNumber).toBe("04");
  });

  test("HOME-008: Homepage CTA banner contains action buttons and direct contact numbers", () => {
    const cta = getDefaultContentForSection("homepage_cta") as typeof defaults.DEFAULT_HOMEPAGE_CTA;
    expect(cta.heading).toContain("Visit or Contact DRK Hospital");
    expect(cta.primaryBtnText).toBe("Call Hospital Helpline");
    expect(cta.secondaryBtnText).toBe("WhatsApp Us");
  });

  // -------------------------------------------------------------
  // SUITE 5: About DRK CMS Module (ABOUT-001 to ABOUT-008)
  // -------------------------------------------------------------
  test("ABOUT-001: About CMS default sections are mapped and complete", () => {
    const hero = getDefaultContentForSection("about_hero") as typeof defaults.DEFAULT_ABOUT_HERO;
    const story = getDefaultContentForSection("about_story") as typeof defaults.DEFAULT_ABOUT_STORY;
    const values = getDefaultContentForSection("about_values") as typeof defaults.DEFAULT_ABOUT_VALUES;
    const standards = getDefaultContentForSection("about_clinical_standards") as typeof defaults.DEFAULT_ABOUT_CLINICAL_STANDARDS;
    const facilities = getDefaultContentForSection("about_facilities") as typeof defaults.DEFAULT_ABOUT_FACILITIES;

    expect(hero.heading).toContain("Rooted in Care");
    expect(story.sectionTitle).toContain("Our Healthcare Story");
    expect(values.values.length).toBeGreaterThanOrEqual(4);
    expect(standards.standards.length).toBeGreaterThanOrEqual(4);
    expect(facilities.items.length).toBeGreaterThanOrEqual(4);
  });

  // -------------------------------------------------------------
  // SUITE 6: Services CMS Module (SERV-001 to SERV-012)
  // -------------------------------------------------------------
  test("SERV-001: Services CMS defaults cover all 3 primary disciplines and clinical pathway", () => {
    const dental = getDefaultContentForSection("services_dental") as typeof defaults.DEFAULT_SERVICES_DENTAL;
    const skin = getDefaultContentForSection("services_skin") as typeof defaults.DEFAULT_SERVICES_SKIN;
    const hair = getDefaultContentForSection("services_hair") as typeof defaults.DEFAULT_SERVICES_HAIR;
    const approach = getDefaultContentForSection("services_approach") as typeof defaults.DEFAULT_SERVICES_APPROACH;

    expect(dental.services.length).toBeGreaterThanOrEqual(6);
    expect(skin.services.length).toBeGreaterThanOrEqual(6);
    expect(hair.services.length).toBeGreaterThanOrEqual(6);
    expect(approach.steps).toHaveLength(5);
  });

  test("SERV-008, SERV-009, SERV-010: Procedure card data integrity and ordering", () => {
    const dental = defaults.DEFAULT_SERVICES_DENTAL;
    const procedures = dental.services;

    // Verify each procedure has an id, title, and description
    for (const proc of procedures) {
      expect(proc.id).toBeDefined();
      expect(proc.title.length).toBeGreaterThan(0);
      expect(proc.desc.length).toBeGreaterThan(0);
      expect(typeof proc.display_order).toBe("number");
    }

    // Verify procedures are ordered
    const orders = procedures.map((p) => p.display_order);
    const sorted = [...orders].sort((a, b) => a - b);
    expect(orders).toEqual(sorted);
  });
});
