"use server";

import { createClient } from "@supabase/supabase-js";
import { normalizeEmail, AdminUserRecord } from "@/lib/admin-auth";

interface AdminSessionResult {
  authorized: boolean;
  email?: string;
  role?: string;
  fullName?: string;
  userId?: string;
  error?: string;
  tableMissing?: boolean;
  notAuthorized?: boolean;
  revoked?: boolean;
}

/**
 * Server Action: Validates an active user session token strictly against
 * the Supabase `admin_users` database table.
 *
 * Security Requirements:
 * 1. Checks Supabase Auth JWT token server-side.
 * 2. Passes the verified JWT to Supabase so that Postgres can enforce `auth.uid()`.
 * 3. Calls the SECURITY DEFINER function `verify_current_admin(lookup_uid)` which
 *    strictly verifies `auth.uid() = lookup_uid` before returning the caller's record.
 * 4. Uses the authenticated Supabase user UUID as the sole authorization identity.
 * 5. Requires `is_active = true`.
 * 6. Never exposes passwords, tokens or secrets in server logs.
 */
export async function verifyServerAdminSession(token: string): Promise<AdminSessionResult> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("[AdminAuth] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in server environment");
    return {
      authorized: false,
      error: "Supabase environment configuration missing on server",
    };
  }

  if (!token || typeof token !== "string" || token.trim() === "") {
    console.warn("[AdminAuth] Verification called without session token");
    return {
      authorized: false,
      error: "Session token is missing. Please sign in again.",
    };
  }

  try {
    // Initialize Supabase client carrying the verified user JWT in Authorization header
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    // 1. Verify token cryptographically with Supabase Auth
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user || !user.id) {
      console.error("[AdminAuth] Supabase getUser failed:", {
        message: authError?.message,
        status: authError?.status,
      });
      return {
        authorized: false,
        error: `Supabase authentication check failed: ${authError?.message || "Invalid or expired session"}`,
      };
    }

    const cleanEmail = normalizeEmail(user.email || "");
    console.log(`[AdminAuth] Supabase JWT verified. Authenticated UUID: ${user.id}, Email: ${cleanEmail}`);

    let adminRecord: {
      id: string;
      email: string;
      full_name: string | null;
      role: string;
      is_active: boolean;
    } | null = null;

    // 2. Primary Secure Verification: Call SECURITY DEFINER RPC `verify_current_admin`
    // Inside PostgreSQL, this function verifies auth.uid() = user.id and returns ONLY the caller's row
    const { data: rpcData, error: rpcError } = await supabase.rpc(
      "verify_current_admin",
      { lookup_uid: user.id }
    );

    if (rpcError) {
      console.warn("[AdminAuth] verify_current_admin RPC notice:", rpcError.message);
    } else if (rpcData) {
      const found = Array.isArray(rpcData) ? rpcData[0] : rpcData;
      if (found && found.id) {
        adminRecord = found;
        console.log(`[AdminAuth] Verified via verify_current_admin RPC: UUID ${adminRecord?.id}, Role: ${adminRecord?.role}`);
      }
    }

    // 3. Fallback: Direct PostgREST query on admin_users by UUID (RLS permits auth.uid() = id)
    if (!adminRecord) {
      const { data: tableRecord, error: tableError } = await supabase
        .from("admin_users")
        .select("id, email, full_name, role, is_active")
        .eq("id", user.id)
        .maybeSingle();

      if (tableError) {
        console.warn("[AdminAuth] Direct admin_users query notice:", tableError.message);
        const isMissingTable =
          tableError.code === "42P01" ||
          tableError.message?.toLowerCase().includes("admin_users") ||
          tableError.message?.toLowerCase().includes("relation");

        if (isMissingTable) {
          return {
            authorized: false,
            tableMissing: true,
            email: cleanEmail,
            error:
              "Database table 'admin_users' is not configured in Supabase. Please execute supabase-admin-schema.sql in the Supabase SQL Editor.",
          };
        }
      } else if (tableRecord) {
        adminRecord = tableRecord;
        console.log(`[AdminAuth] Verified via PostgREST UUID query: UUID ${adminRecord.id}, Role: ${adminRecord.role}`);
      }
    }

    // 4. If user UUID is not found in admin_users
    if (!adminRecord) {
      console.warn(`[AdminAuth] Authorization DENIED: Authenticated UUID ${user.id} (${cleanEmail}) is not present in admin_users.`);
      return {
        authorized: false,
        notAuthorized: true,
        email: cleanEmail,
        error:
          "Account Not Authorized – Contact system administrator to grant admin access in Supabase",
      };
    }

    // 5. If user UUID exists but has been deactivated / revoked
    if (adminRecord.is_active === false) {
      console.warn(`[AdminAuth] Authorization REVOKED: Account ${cleanEmail} (UUID: ${adminRecord.id}) has is_active = false.`);
      return {
        authorized: false,
        revoked: true,
        email: cleanEmail,
        error:
          "Account Access Revoked – This administrator account has been deactivated in Supabase",
      };
    }

    // 6. User is strictly authorized and active
    console.log(`[AdminAuth] Authorization SUCCESS: ${cleanEmail} (UUID: ${adminRecord.id}, Role: ${adminRecord.role})`);
    return {
      authorized: true,
      email: adminRecord.email || cleanEmail,
      role: adminRecord.role || "admin",
      fullName: adminRecord.full_name || undefined,
      userId: adminRecord.id,
    };
  } catch (err: unknown) {
    const msg =
      err instanceof Error ? err.message : "Server administrator verification failed";
    console.error("[AdminAuth] Unexpected error during verification:", msg);
    return { authorized: false, error: msg };
  }
}

/**
 * Server Action: Fetches all authorized administrator accounts from `admin_users`.
 * Restricted to active administrators with valid session token.
 */
export async function getAdminUsersList(token: string): Promise<{
  success: boolean;
  users?: AdminUserRecord[];
  error?: string;
  tableMissing?: boolean;
}> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return { success: false, error: "Database configuration missing" };
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    const { data, error } = await supabase
      .from("admin_users")
      .select("id, email, full_name, role, is_active, created_at, updated_at")
      .order("created_at", { ascending: true });

    if (error) {
      const isMissingTable =
        error.code === "42P01" ||
        error.message?.toLowerCase().includes("admin_users") ||
        error.message?.toLowerCase().includes("relation");

      return {
        success: false,
        error: error.message,
        tableMissing: isMissingTable,
      };
    }

    return {
      success: true,
      users: (data || []) as AdminUserRecord[],
    };
  } catch (err: unknown) {
    const msg =
      err instanceof Error ? err.message : "Failed to load administrator accounts";
    return { success: false, error: msg };
  }
}

/**
 * Server Action: Authorize or update an administrator account via Supabase stored procedure.
 * Enforces super_admin role check inside PostgreSQL.
 */
export async function authorizeAdminUserAction(
  token: string,
  targetEmail: string,
  targetFullName?: string,
  targetRole?: string
): Promise<{ success: boolean; message: string }> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return { success: false, message: "Database configuration missing" };
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    const { data, error } = await supabase.rpc("authorize_admin_user", {
      target_email: normalizeEmail(targetEmail),
      target_full_name: targetFullName || null,
      target_role: targetRole || "admin",
    });

    if (error) {
      return { success: false, message: error.message };
    }

    const res = data as { success?: boolean; message?: string };
    return {
      success: res?.success ?? true,
      message: res?.message ?? "Administrator authorized successfully.",
    };
  } catch (err: unknown) {
    const msg =
      err instanceof Error ? err.message : "Error authorizing administrator account";
    return { success: false, message: msg };
  }
}

/**
 * Server Action: Revoke an administrator account via Supabase stored procedure.
 * Enforces super_admin role check inside PostgreSQL.
 */
export async function revokeAdminUserAction(
  token: string,
  targetEmail: string
): Promise<{ success: boolean; message: string }> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return { success: false, message: "Database configuration missing" };
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    const { data, error } = await supabase.rpc("revoke_admin_user", {
      target_email: normalizeEmail(targetEmail),
    });

    if (error) {
      return { success: false, message: error.message };
    }

    const res = data as { success?: boolean; message?: string };
    return {
      success: res?.success ?? true,
      message: res?.message ?? "Administrator access revoked.",
    };
  } catch (err: unknown) {
    const msg =
      err instanceof Error ? err.message : "Error revoking administrator account";
    return { success: false, message: msg };
  }
}
