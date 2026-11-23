import { test, expect } from "@playwright/test";
import { formatOperatingHours } from "../src/lib/working-hours";

const CONFIRMED_ADDRESS = "DRK Hospitals, SF.No. 29/2A, Akkaia Naidu Street, Tiruttani, Tiruvallur – 631209, Tamil Nadu, India.";
const CONFIRMED_MAPS_URL = "https://www.google.com/maps/search/?api=1&query=SF.No.+29%2F2A%2C+Akkaia+Naidu+Street%2C+Tiruttani%2C+Tiruvallur+631209%2C+Tamil+Nadu+India";

test.describe("SUITE 16 – Hospital Working Hours & Global Info Synchronization", () => {
  // -------------------------------------------------------------
  // Part 1: Live Public Website Working Hours Verification
  // -------------------------------------------------------------
  test("SYNC-001: Header, Footer, Homepage, and Contact reflect approved 9AM-9PM schedule and confirmed Tiruttani address", async ({
    page,
  }) => {
    // 1. Visit Homepage
    const homeRes = await page.goto("http://localhost:8000/", { waitUntil: "domcontentloaded" });
    expect(homeRes?.status()).toBe(200);

    // Header Top Bar
    const header = page.locator("header");
    await expect(header).toContainText("Mon – Sat: 9:00 AM – 9:00 PM");
    await expect(header).not.toContainText("8:00 AM – 8:00 PM");

    // Footer Working Hours
    const footer = page.locator("footer");
    await expect(footer).toContainText("Mon – Sat: 9:00 AM – 9:00 PM");
    await expect(footer).toContainText("Sunday: 9:00 AM – 9:00 PM");
    await expect(footer).not.toContainText("8:00 AM – 8:00 PM");
    await expect(footer).not.toContainText("9:00 AM – 1:00 PM");

    // Footer Address & Maps URL
    await expect(footer).toContainText("SF.No. 29/2A, Akkaia Naidu Street");
    await expect(footer).toContainText("Tiruttani");
    await expect(footer).not.toContainText("Chennai");
    await expect(footer).not.toContainText("Anna Salai");

    // Homepage Operating Hours Card
    await expect(page.locator("body")).toContainText("Monday – Saturday:");
    await expect(page.locator("body")).toContainText("Sunday:");
    await expect(page.locator("body")).not.toContainText("8:00 AM – 8:00 PM");

    // 2. Visit Contact Page
    const contactRes = await page.goto("http://localhost:8000/contact", { waitUntil: "domcontentloaded" });
    expect(contactRes?.status()).toBe(200);
    const main = page.locator("main");

    // Operating Hours card on Contact page
    await expect(main).toContainText("Mon – Sat: 9:00 AM – 9:00 PM");
    await expect(main).toContainText("Sunday: 9:00 AM – 9:00 PM");
    await expect(main).not.toContainText("8:00 AM – 8:00 PM");

    // Confirmed Tiruttani address on Contact page
    await expect(main).toContainText("SF.No. 29/2A, Akkaia Naidu Street");
    await expect(main).toContainText("Tiruttani");
    await expect(main).not.toContainText("Chennai");
    await expect(main).not.toContainText("Anna Salai");

    // Google Maps link points to confirmed Tiruttani coordinates
    const mapLinks = page.locator('a[href*="maps"]');
    const count = await mapLinks.count();
    expect(count).toBeGreaterThan(0);
    const href = await mapLinks.first().getAttribute("href");
    expect(href).toContain("Tiruttani");
  });

  // -------------------------------------------------------------
  // Part 2: All Other Public Pages (About, Services, Gallery)
  // -------------------------------------------------------------
  test("SYNC-002: About, Services, and Gallery footers display synchronized 9AM-9PM hours and Tiruttani address", async ({
    page,
  }) => {
    const pages = ["/about", "/services", "/gallery"];
    for (const route of pages) {
      const res = await page.goto(`http://localhost:8000${route}`, { waitUntil: "domcontentloaded" });
      expect(res?.status()).toBe(200);

      const footer = page.locator("footer");
      await expect(footer).toContainText("Mon – Sat: 9:00 AM – 9:00 PM");
      await expect(footer).toContainText("Sunday: 9:00 AM – 9:00 PM");
      await expect(footer).not.toContainText("8:00 AM – 8:00 PM");
      await expect(footer).not.toContainText("9:00 AM – 1:00 PM");
      await expect(footer).toContainText("SF.No. 29/2A, Akkaia Naidu Street");
      await expect(footer).toContainText("Tiruttani");
      await expect(footer).not.toContainText("Chennai");
      await expect(footer).not.toContainText("Anna Salai");
    }
  });

  // -------------------------------------------------------------
  // Part 3: Working Hours Formatter Dynamic Schedule Scenarios
  // -------------------------------------------------------------
  test("SYNC-003: formatOperatingHours correctly handles prompt acceptance test schedule (Mon-Sat 9AM-9PM, Sun 10AM-2PM)", () => {
    const testSchedule = formatOperatingHours([
      { day: "Monday", isOpen: true, openTime: "09:00 AM", closeTime: "09:00 PM" },
      { day: "Tuesday", isOpen: true, openTime: "09:00 AM", closeTime: "09:00 PM" },
      { day: "Wednesday", isOpen: true, openTime: "09:00 AM", closeTime: "09:00 PM" },
      { day: "Thursday", isOpen: true, openTime: "09:00 AM", closeTime: "09:00 PM" },
      { day: "Friday", isOpen: true, openTime: "09:00 AM", closeTime: "09:00 PM" },
      { day: "Saturday", isOpen: true, openTime: "09:00 AM", closeTime: "09:00 PM" },
      { day: "Sunday", isOpen: true, openTime: "10:00 AM", closeTime: "02:00 PM" },
    ]);

    expect(testSchedule.displayShort).toBe("Mon – Sat: 9:00 AM – 9:00 PM");
    expect(testSchedule.weekdaysText).toBe("Mon – Sat: 9:00 AM – 9:00 PM");
    expect(testSchedule.sundayText).toBe("Sunday: 10:00 AM – 2:00 PM (Consultation)");
    expect(testSchedule.fullWeeklySchedule).toHaveLength(7);
  });

  test("SYNC-004: formatOperatingHours formats Sunday closed, custom weekdays, and strips leading zeros", () => {
    // 1. All days same timings (Hospital Approved)
    const approved = formatOperatingHours([
      { day: "Monday", isOpen: true, openTime: "09:00 AM", closeTime: "09:00 PM" },
      { day: "Tuesday", isOpen: true, openTime: "09:00 AM", closeTime: "09:00 PM" },
      { day: "Wednesday", isOpen: true, openTime: "09:00 AM", closeTime: "09:00 PM" },
      { day: "Thursday", isOpen: true, openTime: "09:00 AM", closeTime: "09:00 PM" },
      { day: "Friday", isOpen: true, openTime: "09:00 AM", closeTime: "09:00 PM" },
      { day: "Saturday", isOpen: true, openTime: "09:00 AM", closeTime: "09:00 PM" },
      { day: "Sunday", isOpen: true, openTime: "09:00 AM", closeTime: "09:00 PM" },
    ]);
    expect(approved.displayShort).toBe("Mon – Sat: 9:00 AM – 9:00 PM");
    expect(approved.weekdaysText).toBe("Mon – Sat: 9:00 AM – 9:00 PM");
    expect(approved.sundayText).toBe("Sunday: 9:00 AM – 9:00 PM (Consultation)");

    // 2. Sunday closed
    const sunClosed = formatOperatingHours([
      { day: "Monday", isOpen: true, openTime: "09:00 AM", closeTime: "09:00 PM" },
      { day: "Tuesday", isOpen: true, openTime: "09:00 AM", closeTime: "09:00 PM" },
      { day: "Wednesday", isOpen: true, openTime: "09:00 AM", closeTime: "09:00 PM" },
      { day: "Thursday", isOpen: true, openTime: "09:00 AM", closeTime: "09:00 PM" },
      { day: "Friday", isOpen: true, openTime: "09:00 AM", closeTime: "09:00 PM" },
      { day: "Saturday", isOpen: true, openTime: "09:00 AM", closeTime: "09:00 PM" },
      { day: "Sunday", isOpen: false, openTime: "09:00 AM", closeTime: "09:00 PM" },
    ]);
    expect(sunClosed.sundayText).toBe("Sunday: Closed");

    // 3. Mon-Fri different from Saturday
    const satDiff = formatOperatingHours([
      { day: "Monday", isOpen: true, openTime: "09:00 AM", closeTime: "05:00 PM" },
      { day: "Tuesday", isOpen: true, openTime: "09:00 AM", closeTime: "05:00 PM" },
      { day: "Wednesday", isOpen: true, openTime: "09:00 AM", closeTime: "05:00 PM" },
      { day: "Thursday", isOpen: true, openTime: "09:00 AM", closeTime: "05:00 PM" },
      { day: "Friday", isOpen: true, openTime: "09:00 AM", closeTime: "05:00 PM" },
      { day: "Saturday", isOpen: true, openTime: "09:00 AM", closeTime: "01:00 PM" },
      { day: "Sunday", isOpen: false, openTime: "09:00 AM", closeTime: "01:00 PM" },
    ]);
    expect(satDiff.weekdaysText).toBe("Mon – Fri: 9:00 AM – 5:00 PM | Sat: 9:00 AM – 1:00 PM");
  });
});
