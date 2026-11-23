import { test, expect } from "@playwright/test";

const PUBLIC_BASE = "http://localhost:8000";

test.describe("SUITE 18 – Footer WhatsApp Removal Verification", () => {
  const pages = ["/", "/about", "/services", "/gallery", "/contact"];

  for (const path of pages) {
    test(`NOWA-001: Footer on ${path} has NO WhatsApp button, but preserves all other contact details`, async ({
      page,
    }) => {
      await page.goto(`${PUBLIC_BASE}${path}`, { waitUntil: "domcontentloaded" });

      const footer = page.locator("footer");
      await expect(footer).toBeVisible();

      // 1. Confirm "Chat on WhatsApp" button is completely absent from Footer
      await expect(footer).not.toContainText("Chat on WhatsApp");
      const footerWaLink = footer.locator('a[href*="wa.me"]');
      await expect(footerWaLink).toHaveCount(0);

      // 2. Confirm address is preserved
      await expect(footer).toContainText("SF.No. 29/2A, Akkaia Naidu Street");
      await expect(footer).toContainText("Tiruttani");

      // 3. Confirm phone & email are preserved
      const footerText = await footer.innerText();
      expect(footerText.includes("6380517153") || footerText.includes("+91")).toBe(true);
      await expect(footer).toContainText("drkhospitalcare@gmail.com");

      // 4. Confirm working hours are preserved
      await expect(footer).toContainText("Mon – Sat: 9:00 AM – 9:00 PM");
      await expect(footer).toContainText("Sunday: 9:00 AM – 9:00 PM");
    });
  }

  test("NOWA-002: Header and Contact page retain WhatsApp functionality", async ({ page }) => {
    // Visit Contact Page
    await page.goto(`${PUBLIC_BASE}/contact`, { waitUntil: "domcontentloaded" });
    const main = page.locator("main");

    // Contact page has active WhatsApp button
    const contactWa = main.locator('a[href*="wa.me"]').first();
    await expect(contactWa).toBeVisible();
    const href = await contactWa.getAttribute("href");
    expect(href).toContain("wa.me");

    // Visit Homepage
    await page.goto(`${PUBLIC_BASE}/`, { waitUntil: "domcontentloaded" });

    // Homepage WhatsApp direct enquiry card
    const homeWa = page.locator('a[href*="wa.me"]').first();
    await expect(homeWa).toBeVisible();

    // Capture clean desktop and mobile Footer screenshots
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`${PUBLIC_BASE}/`, { waitUntil: "networkidle" });
    const footerDesktop = page.locator("footer");
    await footerDesktop.scrollIntoViewIfNeeded();
    await footerDesktop.screenshot({ path: "test-results/footer-no-whatsapp-desktop.png" });

    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${PUBLIC_BASE}/`, { waitUntil: "networkidle" });
    const footerMobile = page.locator("footer");
    await footerMobile.scrollIntoViewIfNeeded();
    await footerMobile.screenshot({ path: "test-results/footer-no-whatsapp-mobile.png" });
  });
});

