import { test, expect } from "@playwright/test";

const PUBLIC_BASE = "http://localhost:8000";

test.describe("SUITE 7 – Contact and Location Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${PUBLIC_BASE}/contact`);
  });

  test("CONTACT-001: Contact details load", async ({ page }) => {
    const address = page.locator('text=Tiruttani, Tamil Nadu').first();
    await expect(address).toBeVisible();
  });

  test("CONTACT-002: Phone number links work", async ({ page }) => {
    const phoneLinks = page.locator('a[href^="tel:"]');
    const count = await phoneLinks.count();
    expect(count).toBeGreaterThan(0);
    const href = await phoneLinks.first().getAttribute("href");
    expect(href).toMatch(/^tel:\+?[0-9]+/);
  });

  test("CONTACT-003: WhatsApp links work", async ({ page }) => {
    const waLink = page.locator('a[href*="wa.me"]').first();
    await expect(waLink).toBeVisible();
    const href = await waLink.getAttribute("href");
    expect(href).toContain("wa.me");
  });

  test("CONTACT-004: Email links work", async ({ page }) => {
    const emailLinks = page.locator('a[href^="mailto:"]');
    const count = await emailLinks.count();
    expect(count).toBeGreaterThan(0);
    const href = await emailLinks.first().getAttribute("href");
    expect(href).toContain("@");
  });

  test("CONTACT-005: Opening hours display", async ({ page }) => {
    const weekdayHours = page.locator('text=8:00 AM').first();
    await expect(weekdayHours).toBeVisible();
  });

  test("CONTACT-006 & CONTACT-008: Enquiry form is cleanly removed from contact page", async ({ page }) => {
    // Verify no "Send Us a Message" heading exists
    const formHeading = page.locator('h2:has-text("Send Us a Message")');
    await expect(formHeading).toHaveCount(0);

    // Verify no enquiry form or submit button exists
    const submitBtn = page.locator('button[type="submit"]', { hasText: /Send Hospital Enquiry/i });
    await expect(submitBtn).toHaveCount(0);

    const nameInput = page.locator('#fullName');
    await expect(nameInput).toHaveCount(0);
  });

  test("CONTACT-007: Patient visiting advisories are displayed", async ({ page }) => {
    const advisoryHeading = page.locator('h3:has-text("Patient Visiting Advisories")').first();
    await expect(advisoryHeading).toBeVisible();

    const walkInInfo = page.locator('text=Walk-in Consultations').first();
    await expect(walkInInfo).toBeVisible();
  });

  test("CONTACT-009: Google Maps link works", async ({ page }) => {
    const mapIframe = page.locator('iframe[title*="Google Maps"]').first();
    await expect(mapIframe).toBeVisible();
    const directionsLink = page.locator('a:has-text("Directions"), a[href*="maps.google.com"]').first();
    await expect(directionsLink).toBeVisible();
  });

  test("CONTACT-010: Location settings persist correctly", async ({ page }) => {
    const addressCard = page.getByText("Tamil Nadu").first();
    await expect(addressCard).toBeVisible();
  });
});

