import { test, expect } from "@playwright/test";

const PUBLIC_BASE = "http://localhost:8000";
const ADMIN_BASE = "http://localhost:3001";

const viewports = [
  { name: "Desktop", width: 1440, height: 900 },
  { name: "Laptop", width: 1280, height: 800 },
  { name: "Tablet", width: 768, height: 1024 },
  { name: "Mobile", width: 390, height: 844 },
];

test.describe("SUITE 11 – Responsive Design and Accessibility Tests", () => {
  for (const vp of viewports) {
    test(`UI-001 & UI-002 & UI-003: Homepage responsive at ${vp.name} (${vp.width}x${vp.height}) without horizontal overflow`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(`${PUBLIC_BASE}/`);

      // Verify no unwanted horizontal scrollbar
      const isOverflowing = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth + 2;
      });
      expect(isOverflowing).toBe(false);

      // Verify Header and Footer exist
      await expect(page.locator("header")).toBeVisible();
      await expect(page.locator("footer")).toBeVisible();
    });

    test(`UI-004: About page responsive at ${vp.name} (${vp.width}x${vp.height})`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(`${PUBLIC_BASE}/about`);
      const isOverflowing = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth + 2;
      });
      expect(isOverflowing).toBe(false);
    });

    test(`UI-005: Services page responsive at ${vp.name} (${vp.width}x${vp.height})`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(`${PUBLIC_BASE}/services`);
      const isOverflowing = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth + 2;
      });
      expect(isOverflowing).toBe(false);
    });

    test(`UI-006: Contact page responsive at ${vp.name} (${vp.width}x${vp.height})`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(`${PUBLIC_BASE}/contact`);
      const isOverflowing = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth + 2;
      });
      expect(isOverflowing).toBe(false);
    });

    test(`UI-007: Gallery page responsive at ${vp.name} (${vp.width}x${vp.height})`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(`${PUBLIC_BASE}/gallery`);
      const isOverflowing = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth + 2;
      });
      expect(isOverflowing).toBe(false);
    });
  }

  test("UI-008: Admin login is responsive at mobile (390x844)", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${ADMIN_BASE}/admin/login`);
    const isOverflowing = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth + 2;
    });
    expect(isOverflowing).toBe(false);
    await expect(page.locator("#email")).toBeVisible();
    await expect(page.locator("#password")).toBeVisible();
  });

  test("UI-010: Form labels and keyboard accessibility", async ({ page }) => {
    await page.goto(`${ADMIN_BASE}/admin/login`);
    const emailInput = page.locator('#email');
    await expect(emailInput).toBeVisible();
    
    // Check that clicking label focuses input
    const label = page.locator('label[for="email"]');
    await label.click();
    await expect(emailInput).toBeFocused();
  });
});

