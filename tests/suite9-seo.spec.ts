import { test, expect } from "@playwright/test";

const PUBLIC_BASE = "http://localhost:8000";

test.describe("SUITE 9 – SEO and Metadata Tests", () => {
  test("SEO-001: Homepage title is correct", async ({ page }) => {
    await page.goto(`${PUBLIC_BASE}/`);
    const title = await page.title();
    expect(title).toContain("DRK Hospital");
    expect(title).toContain("Rooted in Care");
  });

  test("SEO-002: Homepage description meta tag exists", async ({ page }) => {
    await page.goto(`${PUBLIC_BASE}/`);
    const desc = await page.locator('meta[name="description"]').getAttribute("content");
    expect(desc).toBeDefined();
    expect(desc?.length).toBeGreaterThan(20);
    expect(desc).toContain("DRK Hospital");
  });

  test("SEO-003: About page metadata is configured", async ({ page }) => {
    await page.goto(`${PUBLIC_BASE}/about`);
    const title = await page.title();
    expect(title).toContain("About Us");
    const desc = await page.locator('meta[name="description"]').getAttribute("content");
    expect(desc).toContain("DRK Hospital");
  });

  test("SEO-004: Services page metadata is configured", async ({ page }) => {
    await page.goto(`${PUBLIC_BASE}/services`);
    const title = await page.title();
    expect(title).toContain("Services");
    const desc = await page.locator('meta[name="description"]').getAttribute("content");
    expect(desc).toContain("DRK Hospital");
  });

  test("SEO-005: Contact page metadata is configured", async ({ page }) => {
    await page.goto(`${PUBLIC_BASE}/contact`);
    const title = await page.title();
    expect(title).toContain("Contact Us");
    const desc = await page.locator('meta[name="description"]').getAttribute("content");
    expect(desc).toContain("DRK Hospital");
  });

  test("SEO-006: Canonical URL configuration is valid", async ({ page }) => {
    await page.goto(`${PUBLIC_BASE}/`);
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(canonical).toBe("https://drkhospital.com");

    await page.goto(`${PUBLIC_BASE}/about`);
    const aboutCanonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(aboutCanonical).toBe("https://drkhospital.com/about");
  });

  test("SEO-007: sitemap.xml endpoint returns valid sitemap XML", async ({ request }) => {
    const res = await request.get(`${PUBLIC_BASE}/sitemap.xml`);
    expect(res.status()).toBe(200);
    const text = await res.text();
    expect(text).toContain("<urlset");
    expect(text).toContain("https://drkhospital.com/about");
    expect(text).toContain("https://drkhospital.com/services");
    expect(text).toContain("https://drkhospital.com/contact");
    expect(text).toContain("https://drkhospital.com/gallery");
  });

  test("SEO-008: robots.txt and structured data (JSON-LD) are present", async ({ page, request }) => {
    // 1. robots.txt
    const res = await request.get(`${PUBLIC_BASE}/robots.txt`);
    expect(res.status()).toBe(200);
    const robotsTxt = await res.text();
    expect(robotsTxt).toMatch(/User-agent: \*/i);
    expect(robotsTxt).toContain("Disallow: /admin/");
    expect(robotsTxt).toContain("Sitemap: https://drkhospital.com/sitemap.xml");

    // 2. Structured data on homepage
    await page.goto(`${PUBLIC_BASE}/`);
    const jsonLdScript = page.locator('script[type="application/ld+json"]').first();
    await expect(jsonLdScript).toBeAttached();
    const jsonLdContent = await jsonLdScript.textContent();
    expect(jsonLdContent).toContain('"@type":"Hospital"');
    expect(jsonLdContent).toContain("DRK Hospital");
  });
});
