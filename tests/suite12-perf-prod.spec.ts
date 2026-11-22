import { test, expect } from "@playwright/test";

const PUBLIC_BASE = "http://localhost:8000";

test.describe("SUITE 12 – Performance, Assets and Error Collection Tests", () => {
  const routes = ["/", "/about", "/services", "/contact", "/gallery"];

  for (const route of routes) {
    test(`PERF-005 & PERF-006 & PERF-007: Clean console and network on ${route}`, async ({ page }) => {
      const consoleErrors: string[] = [];
      const failedRequests: string[] = [];
      const notFound404s: string[] = [];

      page.on("console", (msg) => {
        if (msg.type() === "error") {
          consoleErrors.push(msg.text());
        }
      });

      page.on("pageerror", (err) => {
        consoleErrors.push(err.message);
      });

      page.on("response", (res) => {
        if (res.status() >= 400) {
          notFound404s.push(`${res.status()} ${res.url()}`);
        }
      });

      page.on("requestfailed", (request) => {
        failedRequests.push(`${request.url()}: ${request.failure()?.errorText}`);
      });

      const res = await page.goto(`${PUBLIC_BASE}${route}`, { waitUntil: "networkidle" });
      expect(res?.status()).toBe(200);

      if (notFound404s.length > 0) {
        console.log(`404s on ${route}:`, notFound404s);
      }
      if (consoleErrors.length > 0) {
        console.log(`Console errors on ${route}:`, consoleErrors);
      }

      // Verify no critical JavaScript crashes
      expect(consoleErrors).toEqual([]);
      expect(failedRequests).toEqual([]);
    });
  }

  test("PERF-009: Production environment variable validation", () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    expect(supabaseUrl).toBeDefined();
    expect(supabaseUrl).toContain("https://");
    expect(supabaseUrl).not.toContain("your-project");

    expect(supabaseAnonKey).toBeDefined();
    expect(supabaseAnonKey?.length).toBeGreaterThan(20);
    // Ensure no service_role secret is present in client keys
    expect(supabaseAnonKey).not.toContain("service_role");
  });
});
