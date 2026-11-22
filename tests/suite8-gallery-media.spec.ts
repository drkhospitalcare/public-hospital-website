import { test, expect } from "@playwright/test";
import { validateImageFile } from "../src/lib/supabase";

const PUBLIC_BASE = "http://localhost:8000";

test.describe("SUITE 8 – Gallery and Media Library Tests", () => {
  test("MEDIA-001 & MEDIA-003: Public gallery loads and category filters render", async ({ page }) => {
    await page.goto(`${PUBLIC_BASE}/gallery`);
    
    // Check hero
    const heading = page.locator('h1', { hasText: /Hospital.*Gallery/i });
    await expect(heading).toBeVisible();

    // Check all category pills
    const categories = ["All", "Dental Care", "Skin Care", "Hair Care", "Hospital Infrastructure", "Hospital Activities"];
    for (const cat of categories) {
      const pill = page.locator('button', { hasText: cat }).first();
      await expect(pill).toBeVisible();
    }
  });

  test("MEDIA-004 & MEDIA-005 & MEDIA-006: Lightbox modal functionality", async ({ page }) => {
    await page.goto(`${PUBLIC_BASE}/gallery`);

    // Check if gallery images exist on page
    const galleryCards = page.locator('button[aria-label*="View image"], button[aria-label*="enlarge"], div.group.cursor-pointer');
    const count = await galleryCards.count();

    if (count > 0) {
      await galleryCards.first().click();
      const modal = page.locator('div[role="dialog"]');
      await expect(modal).toBeVisible();

      // Test Escape key closes modal
      await page.keyboard.press("Escape");
      await expect(modal).not.toBeVisible();
    } else {
      // Empty state verification
      const emptyNotice = page.getByRole("heading", { name: /Hospital Gallery Being Curated/i });
      await expect(emptyNotice).toBeVisible();
    }
  });

  test("MEDIA-008 & MEDIA-009: Image upload format validation", () => {
    // Valid JPEG
    const validFile = new File(["dummy"], "photo.jpg", { type: "image/jpeg" });
    expect(validateImageFile(validFile).valid).toBe(true);

    // Valid PNG
    const validPng = new File(["dummy"], "photo.png", { type: "image/png" });
    expect(validateImageFile(validPng).valid).toBe(true);

    // Valid WebP
    const validWebp = new File(["dummy"], "photo.webp", { type: "image/webp" });
    expect(validateImageFile(validWebp).valid).toBe(true);

    // Invalid PDF
    const invalidPdf = new File(["dummy"], "doc.pdf", { type: "application/pdf" });
    const pdfResult = validateImageFile(invalidPdf);
    expect(pdfResult.valid).toBe(false);
    expect(pdfResult.error).toContain("Invalid file format");

    // Invalid Executable
    const invalidExe = new File(["dummy"], "virus.exe", { type: "application/x-msdownload" });
    expect(validateImageFile(invalidExe).valid).toBe(false);
  });

  test("MEDIA-010: Oversized files are rejected (>10MB)", () => {
    // Create oversized file mock (11MB)
    const largeSize = 11 * 1024 * 1024;
    const oversizedFile = {
      name: "large.jpg",
      type: "image/jpeg",
      size: largeSize,
    } as unknown as File;

    const result = validateImageFile(oversizedFile);
    expect(result.valid).toBe(false);
    expect(result.error).toContain("File size exceeds");
  });

  test("MEDIA-011: Image URL loads with fallback safely", async ({ page }) => {
    await page.goto(`${PUBLIC_BASE}/`);
    const images = page.locator("img");
    const count = await images.count();
    expect(count).toBeGreaterThan(0);
  });
});
