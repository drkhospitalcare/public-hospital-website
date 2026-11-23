import { test, expect } from "@playwright/test";
import * as defaults from "../src/lib/cms-defaults";
import { getDefaultContentForSection } from "../src/lib/cms";
import { AboutFounderContent } from "../src/types/cms";

const PUBLIC_BASE = "http://localhost:8000";

test.describe("SUITE 14 – About Page Founder Profile Tests", () => {
  // -------------------------------------------------------------
  // Part 1: Public Website Founder Profile Section
  // -------------------------------------------------------------
  test("FOUNDER-001: Public About page displays Founder Profile section", async ({ page }) => {
    await page.goto(`${PUBLIC_BASE}/about`);

    // Locate the founder section
    const founderSection = page.locator("#founder-profile");
    await expect(founderSection).toBeVisible();

    // Verify Founder Name is prominently displayed
    const founderName = founderSection.locator('text=Dr. R. Ranjith Kumar').first();
    await expect(founderName).toBeVisible();

    // Verify Designation
    const designation = founderSection.locator('text=Founder').first();
    await expect(designation).toBeVisible();

    // Verify Founder Statement
    const statement = founderSection.locator(
      'text=Dr. R. Ranjith Kumar is the Founder of DRK Hospitals and RRK Hospitals'
    ).first();
    await expect(statement).toBeVisible();
  });

  test("FOUNDER-002: Founder section is positioned between Hero and How We Began", async ({ page }) => {
    await page.goto(`${PUBLIC_BASE}/about`);

    const hero = page.locator("h1").first();
    const founder = page.locator("#founder-profile");
    const story = page.locator('text="How We Began"').first();

    await expect(hero).toBeVisible();
    await expect(founder).toBeVisible();
    await expect(story).toBeVisible();

    const heroBox = await hero.boundingBox();
    const founderBox = await founder.boundingBox();
    const storyBox = await story.boundingBox();

    expect(heroBox).not.toBeNull();
    expect(founderBox).not.toBeNull();
    expect(storyBox).not.toBeNull();

    expect(founderBox!.y).toBeGreaterThan(heroBox!.y);
    expect(storyBox!.y).toBeGreaterThan(founderBox!.y);
  });

  test("FOUNDER-003: Founder section is responsive on mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${PUBLIC_BASE}/about`);

    const founderSection = page.locator("#founder-profile");
    await expect(founderSection).toBeVisible();

    const founderName = founderSection.locator('text=Dr. R. Ranjith Kumar').first();
    await expect(founderName).toBeVisible();

    // Check no horizontal overflow on mobile
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasHorizontalOverflow).toBe(false);
  });

  test("FOUNDER-004: CMS defaults contain valid DEFAULT_ABOUT_FOUNDER", () => {
    const founder = getDefaultContentForSection("about_founder") as AboutFounderContent;
    expect(founder).toBeDefined();
    expect(founder.enabled).toBe(true);
    expect(founder.founderName).toBe("Dr. R. Ranjith Kumar");
    expect(founder.founderDesignation).toBe("Founder");
    expect(founder.founderStatement).toContain("DRK Hospitals and RRK Hospitals");
    expect(founder.founderStatement).toContain("patient-centred and ethical healthcare");
  });

  test("FOUNDER-005: CMS defaults module exports DEFAULT_ABOUT_FOUNDER", () => {
    expect(defaults.DEFAULT_ABOUT_FOUNDER).toBeDefined();
    expect(defaults.DEFAULT_ABOUT_FOUNDER.founderName).toBe("Dr. R. Ranjith Kumar");
    expect(defaults.DEFAULT_ABOUT_FOUNDER.enabled).toBe(true);
  });
});
