import { test, expect } from "@playwright/test";

const PUBLIC_BASE = "http://localhost:8000";

const EXPECTED_DENTAL_SERVICES = [
  "Root Canal Treatment",
  "Fixed Teeth Replacement",
  "Implant Surgery",
  "Orthodontic Braces",
  "Disimpaction Surgery",
  "Laser Dental Treatment",
  "Gum Surgery",
  "Tooth Colour Filling",
  "Surgical Tooth Removal",
  "Cosmetic Dental Surgery",
  "Oral & Maxillofacial Surgery",
  "Oral Cancer Diagnosis",
  "Other Latest Dental Treatments",
];

const EXPECTED_SKIN_SERVICES = [
  "Carbon Peel Laser Treatment",
  "Pimple & Acne Treatment",
  "Skin Whitening",
  "Microneedling",
  "Tattoo Removal",
  "Laser Permanent Hair Removal",
  "IV Glutathione",
  "Melasma Treatment",
  "Skin Tag Removal",
  "HydraFacial",
  "Botox",
  "Dermal Fillers",
  "Chemical Peel",
  "Itching & Allergy Care",
  "Scabies Care",
  "Psoriasis Care",
];

const EXPECTED_HAIR_SERVICES = [
  "PRP Treatment",
  "GFC Treatment",
  "Tricho Analysis",
  "Hair Regrowth Treatment",
  "Dandruff Treatment",
  "Hair & Scalp Treatments",
  "Laser Hair Treatments",
];

test.describe("SUITE 21 – Complete 36-Service Catalogue & Specialty Pages", () => {
  test("SVC-001: Public /services page renders all 36 services across 3 departments", async ({
    page,
  }) => {
    await page.goto(`${PUBLIC_BASE}/services`, { waitUntil: "domcontentloaded" });

    // Verify Dental Care Section & all 13 treatments
    const dentalSection = page.locator("#dental-care");
    await expect(dentalSection).toBeVisible();
    for (const title of EXPECTED_DENTAL_SERVICES) {
      await expect(dentalSection).toContainText(title);
    }

    // Verify Skin Care Section & all 16 treatments
    const skinSection = page.locator("#skin-care");
    await expect(skinSection).toBeVisible();
    for (const title of EXPECTED_SKIN_SERVICES) {
      await expect(skinSection).toContainText(title);
    }

    // Verify Hair Care Section & all 7 treatments
    const hairSection = page.locator("#hair-care");
    await expect(hairSection).toBeVisible();
    for (const title of EXPECTED_HAIR_SERVICES) {
      await expect(hairSection).toContainText(title);
    }
  });

  test("SVC-002: Specialty Landing Page /services/dental-care renders 13 Dental treatments", async ({
    page,
  }) => {
    await page.goto(`${PUBLIC_BASE}/services/dental-care`, { waitUntil: "domcontentloaded" });

    const title = await page.title();
    expect(title).toBe("Dental Hospital in Tiruttani | DRK Hospitals – Dental Care");

    // All 13 Dental services present
    for (const name of EXPECTED_DENTAL_SERVICES) {
      await expect(page.locator("body")).toContainText(name);
    }

    // Structured data contains 13 offer elements
    const script = page.locator('main script[type="application/ld+json"]').first();
    await expect(script).toBeAttached();
    const json = JSON.parse((await script.textContent()) || "{}");
    expect(json["@type"]).toBe("MedicalWebPage");
    expect(json.about.hasOfferCatalog.itemListElement.length).toBe(13);
  });

  test("SVC-003: Specialty Landing Page /services/skin-care renders 16 Skin treatments", async ({
    page,
  }) => {
    await page.goto(`${PUBLIC_BASE}/services/skin-care`, { waitUntil: "domcontentloaded" });

    const title = await page.title();
    expect(title).toBe("Skin Hospital & Dermatology Clinic in Tiruttani | DRK Hospitals");

    // All 16 Skin services present
    for (const name of EXPECTED_SKIN_SERVICES) {
      await expect(page.locator("body")).toContainText(name);
    }

    // Structured data contains 16 offer elements
    const script = page.locator('main script[type="application/ld+json"]').first();
    await expect(script).toBeAttached();
    const json = JSON.parse((await script.textContent()) || "{}");
    expect(json["@type"]).toBe("MedicalWebPage");
    expect(json.about.hasOfferCatalog.itemListElement.length).toBe(16);
  });

  test("SVC-004: Specialty Landing Page /services/hair-care renders 7 Hair treatments", async ({
    page,
  }) => {
    await page.goto(`${PUBLIC_BASE}/services/hair-care`, { waitUntil: "domcontentloaded" });

    const title = await page.title();
    expect(title).toBe("Hair Treatment & Trichology Clinic in Tiruttani | DRK Hospitals");

    // All 7 Hair services present
    for (const name of EXPECTED_HAIR_SERVICES) {
      await expect(page.locator("body")).toContainText(name);
    }

    // Structured data contains 7 offer elements
    const script = page.locator('main script[type="application/ld+json"]').first();
    await expect(script).toBeAttached();
    const json = JSON.parse((await script.textContent()) || "{}");
    expect(json["@type"]).toBe("MedicalWebPage");
    expect(json.about.hasOfferCatalog.itemListElement.length).toBe(7);
  });

  test("SVC-005: Individual Treatment Detail Pages load with unique title, canonical, and schema", async ({
    page,
  }) => {
    // 1. Dental sample: Root Canal Treatment
    await page.goto(`${PUBLIC_BASE}/services/dental-care/root-canal-treatment`, {
      waitUntil: "domcontentloaded",
    });
    const dentalTitle = await page.title();
    expect(dentalTitle).toContain("Root Canal Treatment in Tiruttani");
    const dentalH1 = page.locator("h1");
    await expect(dentalH1).toContainText("Root Canal Treatment in Tiruttani");
    await expect(page.locator("body")).toContainText("SF.No. 29/2A, Akkaia Naidu Street");
    await expect(page.locator("body")).toContainText("Clinical Information Status: Pending Clinical Review");
    await expect(page.locator("body")).not.toContainText("Book Appointment");
    await expect(page.locator("body")).not.toContainText("Book Consultation");

    const dentalCanonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(dentalCanonical).toBe(
      "https://drkhospitals.com/services/dental-care/root-canal-treatment"
    );

    // 2. Skin sample: Carbon Peel Laser Treatment
    await page.goto(`${PUBLIC_BASE}/services/skin-care/carbon-peel-laser-treatment`, {
      waitUntil: "domcontentloaded",
    });
    const skinTitle = await page.title();
    expect(skinTitle).toContain("Carbon Peel Laser Treatment in Tiruttani");
    const skinCanonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(skinCanonical).toBe(
      "https://drkhospitals.com/services/skin-care/carbon-peel-laser-treatment"
    );

    // 3. Hair sample: PRP Treatment
    await page.goto(`${PUBLIC_BASE}/services/hair-care/prp-treatment`, {
      waitUntil: "domcontentloaded",
    });
    const hairTitle = await page.title();
    expect(hairTitle).toContain("PRP Hair Treatment in Tiruttani");
    const hairCanonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(hairCanonical).toBe("https://drkhospitals.com/services/hair-care/prp-treatment");
  });
});
