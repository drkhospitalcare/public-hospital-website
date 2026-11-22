import { getSupabaseClient } from "@/lib/supabase";

export interface AdminUserRecord {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

/**
 * Normalizes an email address for consistent case-insensitive comparison.
 * Trims whitespace, strips outer quotes, and converts to lowercase.
 */
export function normalizeEmail(email: string): string {
  return email
    .trim()
    .replace(/^["']|["']$/g, "")
    .toLowerCase();
}

/**
 * Safe Admin Sign Out helper that cleans up session and cookie tokens.
 */
export async function signOutAdmin(): Promise<void> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignore network errors during sign-out cleanup
    }
  }

  // Clear session cookie used by Next.js middleware
  if (typeof document !== "undefined") {
    document.cookie =
      "drk_admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
  }
}
