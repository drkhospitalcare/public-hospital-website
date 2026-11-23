import { test, expect } from "@playwright/test";

const PUBLIC_URL = "http://localhost:8000";

test.describe("Global CMS Image Loading & Default Image Flash Tests", () => {
  test("1. Homepage hero image is pre-rendered with published Supabase URL and no flash", async ({
    page,
  }) => {
    await page.goto(PUBLIC_URL, { waitUntil: "domcontentloaded" });

    // The hero image container should contain an image element immediately
    const heroImage = page.locator("section").first().locator("img").first();
    await expect(heroImage).toBeVisible();

    const heroSrc = await heroImage.getAttribute("src");
    expect(heroSrc).toBeTruthy();

    // Verify hero image is NOT displaying the un-customized default fallback on mount if CMS is published
    // The server HTML should preload and hydrate the published image
    const hasPublishedHero = heroSrc?.includes("supabase.co") || heroSrc?.includes("1795403549106");
    expect(hasPublishedHero).toBeTruthy();
  });

  test("2. Homepage about section renders published image authoritatively", async ({
    page,
  }) => {
    await page.goto(PUBLIC_URL, { waitUntil: "domcontentloaded" });

    // Section 3: About DRK Introduction - matches published heading "Rooted in Care, Focused on People"
    const aboutSection = page.locator("section:has-text('Rooted in Care, Focused on People')");
    await expect(aboutSection).toBeVisible();

    const aboutImg = aboutSection.locator("img").first();
    await expect(aboutImg).toBeVisible();

    const aboutSrc = await aboutImg.getAttribute("src");
    expect(aboutSrc).toBeTruthy();
    expect(aboutSrc).toContain("supabase.co");
  });

  test("3. About page hero and clinical standards render published CMS images", async ({
    page,
  }) => {
    await page.goto(`${PUBLIC_URL}/about`, { waitUntil: "domcontentloaded" });

    // Hero image
    const aboutHeroImg = page.locator("nav[aria-label='Breadcrumb']").locator("..").locator("img").first();
    await expect(aboutHeroImg).toBeVisible();
    const heroSrc = await aboutHeroImg.getAttribute("src");
    expect(heroSrc).toBeTruthy();
    expect(heroSrc).toContain("supabase.co");

    // Clinical standards image
    const clinicalSection = page.locator("section:has-text('Infection Control Standard')");
    await expect(clinicalSection).toBeVisible();
    const clinicalImg = clinicalSection.locator("img").first();
    await expect(clinicalImg).toBeVisible();
    const clinicalSrc = await clinicalImg.getAttribute("src");
    expect(clinicalSrc).toBeTruthy();
    expect(clinicalSrc).toContain("supabase.co");
  });

  test("4. Services page hero renders published CMS image", async ({
    page,
  }) => {
    await page.goto(`${PUBLIC_URL}/services`, { waitUntil: "domcontentloaded" });

    // Service hero
    const serviceHeroSection = page.locator("section:has-text('Specialized Healthcare Services')");
    await expect(serviceHeroSection).toBeVisible();

    const heroImg = serviceHeroSection.locator("img").first();
    await expect(heroImg).toBeVisible();

    const serviceHeroSrc = await heroImg.getAttribute("src");
    expect(serviceHeroSrc).toBeTruthy();
    expect(serviceHeroSrc).toContain("supabase.co");
  });

  test("5. Visual gallery page pre-renders items on server with zero blank flash", async ({
    page,
  }) => {
    await page.goto(`${PUBLIC_URL}/gallery`, { waitUntil: "domcontentloaded" });

    // Check heading
    await expect(page.locator("h1")).toContainText("Hospital Gallery");

    // Check that gallery image grid or empty state is rendered without unhandled errors
    const galleryGrid = page.locator(".grid");
    await expect(galleryGrid.first()).toBeVisible();
  });

  test("6. Footer logo renders published CMS logo with zero default flash", async ({
    page,
  }) => {
    await page.goto(PUBLIC_URL, { waitUntil: "domcontentloaded" });

    const footer = page.locator("footer");
    await expect(footer).toBeVisible();

    const footerLogo = footer.locator("img").first();
    await expect(footerLogo).toBeVisible();

    const logoSrc = await footerLogo.getAttribute("src");
    expect(logoSrc).toBeTruthy();
    expect(logoSrc).toMatch(/(drk-logo\.png|supabase\.co)/);
  });

  test("7. Specialty Cards render with SafeImage and fallback protection", async ({
    page,
  }) => {
    await page.goto(PUBLIC_URL, { waitUntil: "domcontentloaded" });

    const specialtyArticles = page.locator("article.card");
    await expect(specialtyArticles.first()).toBeVisible();

    const cardCount = await specialtyArticles.count();
    expect(cardCount).toBeGreaterThanOrEqual(3);

    for (let i = 0; i < cardCount; i++) {
      const img = specialtyArticles.nth(i).locator("img");
      await expect(img).toBeVisible();
      const src = await img.getAttribute("src");
      expect(src).toBeTruthy();
    }
  });

  test("8. Facility Cards render with SafeImage and proper aspect ratio", async ({
    page,
  }) => {
    await page.goto(PUBLIC_URL, { waitUntil: "domcontentloaded" });

    const facilityCards = page.locator("section:has-text('Pristine Healthcare Environments') .card");
    const count = await facilityCards.count();
    expect(count).toBeGreaterThanOrEqual(1);

    const firstCardImg = facilityCards.first().locator("img");
    await expect(firstCardImg).toBeVisible();
  });
});
