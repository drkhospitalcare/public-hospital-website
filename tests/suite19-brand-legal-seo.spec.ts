import { test, expect } from "@playwright/test";

const PUBLIC_BASE = "http://localhost:8000";

test.describe("SUITE 19 – Brand Identity, Legal Entity, and Local SEO Optimization", () => {
  test("BLS-001: Homepage Title and Meta Description match exact recommended SEO copy", async ({
    page,
  }) => {
    await page.goto(`${PUBLIC_BASE}/`, { waitUntil: "domcontentloaded" });

    // 1. Title verification
    const title = await page.title();
    expect(title).toBe("DRK Hospitals Tiruttani | Dental, Skin & Hair Care");

    // 2. Meta description verification
    const metaDesc = await page.locator('meta[name="description"]').getAttribute("content");
    expect(metaDesc).toBe(
      "DRK Hospitals in Tiruttani, Tamil Nadu, provides dental, skin and hair healthcare services. Explore our specialties, hospital facilities and contact information."
    );

    // 3. Open Graph verification
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute("content");
    expect(ogTitle).toBe("DRK Hospitals Tiruttani | Dental, Skin & Hair Care");
    const ogSiteName = await page.locator('meta[property="og:site_name"]').getAttribute("content");
    expect(ogSiteName).toBe("DRK Hospitals");

    // 4. Canonical URL
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(canonical).toMatch(/https:\/\/drkhospitals?\.com/);
  });

  test("BLS-002: Structured Data (JSON-LD) contains WebSite (Site Name) and Hospital/Organization schema with Legal Name", async ({
    page,
  }) => {
    await page.goto(`${PUBLIC_BASE}/`, { waitUntil: "domcontentloaded" });

    const jsonLdScript = page.locator('script[type="application/ld+json"]').first();
    await expect(jsonLdScript).toBeAttached();

    const raw = await jsonLdScript.textContent();
    expect(raw).toBeTruthy();
    const data = JSON.parse(raw!);

    // Verify Graph structure
    expect(data["@graph"]).toBeDefined();
    const graph = data["@graph"];

    // 1. WebSite schema (Google Site Name)
    const websiteEntity = graph.find((e: any) => e["@type"] === "WebSite");
    expect(websiteEntity).toBeDefined();
    expect(websiteEntity.name).toBe("DRK Hospitals");
    expect(websiteEntity.alternateName).toContain("DRK Hospital");
    expect(websiteEntity.url).toBe("https://drkhospitals.com/");

    // 2. Hospital / LocalBusiness / Organization entity
    const hospitalEntity = graph.find(
      (e: any) =>
        Array.isArray(e["@type"]) &&
        e["@type"].includes("Hospital") &&
        e["@type"].includes("LocalBusiness")
    );
    expect(hospitalEntity).toBeDefined();
    expect(hospitalEntity.name).toBe("DRK Hospitals");
    expect(hospitalEntity.legalName).toBe("DRK Dental Skin & Hair Hospital Private Limited");
    expect(hospitalEntity.address.streetAddress).toBe("SF.No. 29/2A, Akkaia Naidu Street");
    expect(hospitalEntity.address.addressLocality).toBe("Tiruttani");
    expect(hospitalEntity.address.postalCode).toBe("631209");
    expect(hospitalEntity.telephone).toBe("+91 6380517153");

    // Catchment areas
    const areaNames = hospitalEntity.areaServed.map((a: any) => a.name);
    expect(areaNames).toContain("Tiruttani");
    expect(areaNames).toContain("Arakkonam");
    expect(areaNames).toContain("Pallipattu");
    expect(areaNames).toContain("Sholinghur");
    expect(areaNames).toContain("Nagari");
  });

  test("BLS-003: About page clearly explains Brand vs Legal Entity relationship", async ({ page }) => {
    await page.goto(`${PUBLIC_BASE}/about`, { waitUntil: "domcontentloaded" });

    // Section exists
    const corporateSection = page.locator("#corporate-identity");
    await expect(corporateSection).toBeVisible();

    // Verify Brand Name & Full Registered Company Name
    await expect(corporateSection).toContainText("DRK Hospitals");
    await expect(corporateSection).toContainText("DRK Dental Skin & Hair Hospital Private Limited");
    await expect(corporateSection).toContainText("SF.No. 29/2A, Akkaia Naidu Street, Tiruttani");

    // Verify relationship explanation
    await expect(corporateSection).toContainText(
      "DRK Hospitals is the public healthcare brand associated with DRK Dental Skin & Hair Hospital Private Limited"
    );

    // Verify About page JSON-LD
    const aboutScript = page.locator('script[type="application/ld+json"]').nth(1);
    await expect(aboutScript).toBeAttached();
    const aboutJson = JSON.parse((await aboutScript.textContent()) || "{}");
    expect(aboutJson["@type"]).toBe("AboutPage");
    expect(aboutJson.mainEntity["@id"]).toBe("https://drkhospitals.com/#organization");
  });

  test("BLS-004: Individual Specialty SEO Pages load with unique metadata, H1, and schema", async ({
    page,
  }) => {
    // 1. Dental Care
    await page.goto(`${PUBLIC_BASE}/services/dental-care`, { waitUntil: "domcontentloaded" });
    const dentalTitle = await page.title();
    expect(dentalTitle).toBe("Dental Hospital in Tiruttani | DRK Hospitals – Dental Care");
    const dentalH1 = page.locator("h1");
    await expect(dentalH1).toContainText("Dental Hospital in Tiruttani");
    await expect(page.locator("body")).toContainText("SF.No. 29/2A, Akkaia Naidu Street");
    const dentalScript = page.locator('main script[type="application/ld+json"]').first();
    const dentalJson = JSON.parse((await dentalScript.textContent()) || "{}");
    expect(dentalJson["@type"]).toBe("MedicalWebPage");
    expect(dentalJson.about.medicalSpecialty).toBe("Dentistry");

    // 2. Skin Care
    await page.goto(`${PUBLIC_BASE}/services/skin-care`, { waitUntil: "domcontentloaded" });
    const skinTitle = await page.title();
    expect(skinTitle).toBe("Skin Hospital & Dermatology Clinic in Tiruttani | DRK Hospitals");
    const skinH1 = page.locator("h1");
    await expect(skinH1).toContainText("Skin Hospital & Dermatology Clinic in Tiruttani");
    await expect(page.locator("body")).toContainText("SF.No. 29/2A, Akkaia Naidu Street");
    const skinScript = page.locator('main script[type="application/ld+json"]').first();
    const skinJson = JSON.parse((await skinScript.textContent()) || "{}");
    expect(skinJson["@type"]).toBe("MedicalWebPage");
    expect(skinJson.about.medicalSpecialty).toBe("Dermatology");

    // 3. Hair Care
    await page.goto(`${PUBLIC_BASE}/services/hair-care`, { waitUntil: "domcontentloaded" });
    const hairTitle = await page.title();
    expect(hairTitle).toBe("Hair Treatment & Trichology Clinic in Tiruttani | DRK Hospitals");
    const hairH1 = page.locator("h1");
    await expect(hairH1).toContainText("Hair Treatment & Trichology Clinic in Tiruttani");
    await expect(page.locator("body")).toContainText("SF.No. 29/2A, Akkaia Naidu Street");
    const hairScript = page.locator('main script[type="application/ld+json"]').first();
    const hairJson = JSON.parse((await hairScript.textContent()) || "{}");
    expect(hairJson["@type"]).toBe("MedicalWebPage");
  });

  test("BLS-005: Sitemap includes all main and specialty pages", async ({ request }) => {
    const res = await request.get(`${PUBLIC_BASE}/sitemap.xml`);
    expect(res.status()).toBe(200);
    const xml = await res.text();

    expect(xml).toContain("<urlset");
    expect(xml).toMatch(/https:\/\/drkhospitals?\.com\/services\/dental-care/);
    expect(xml).toMatch(/https:\/\/drkhospitals?\.com\/services\/skin-care/);
    expect(xml).toMatch(/https:\/\/drkhospitals?\.com\/services\/hair-care/);
    expect(xml).toMatch(/https:\/\/drkhospitals?\.com\/about/);
    expect(xml).toMatch(/https:\/\/drkhospitals?\.com\/services/);
    expect(xml).toMatch(/https:\/\/drkhospitals?\.com\/contact/);
  });
});
