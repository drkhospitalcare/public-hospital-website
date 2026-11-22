"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  Loader2,
  ExternalLink,
  MailCheck,
  WifiOff,
  UserX,
  KeyRound,
} from "lucide-react";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import { signOutAdmin } from "@/lib/admin-auth";
import { verifyServerAdminSession } from "@/app/actions/admin-auth";
import SupabaseSetupBanner from "@/components/admin/SupabaseSetupBanner";

type ErrorCategory =
  | "credentials"
  | "unconfirmed"
  | "unauthorized"
  | "network"
  | "rate_limit"
  | "general";

interface FormError {
  category: ErrorCategory;
  title: string;
  message: string;
  suggestion?: string;
}

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorDetails, setErrorDetails] = useState<FormError | null>(null);
  const [configured, setConfigured] = useState(true);

  useEffect(() => {
    const isConfig = isSupabaseConfigured();
    setConfigured(isConfig);

    // If redirected with unauthorized error
    if (searchParams.get("error") === "unauthorized") {
      const customReason = searchParams.get("reason");
      setErrorDetails({
        category: "unauthorized",
        title: "Account Not Authorized",
        message:
          customReason ||
          "Account Not Authorized – Contact system administrator to grant admin access in Supabase",
        suggestion:
          "Ensure this user account is registered in Supabase Authentication and authorized in the admin_users table (run: SELECT public.authorize_admin_user('your-email@example.com'); in Supabase SQL Editor).",
      });
    }

    // If already logged in and authorized, redirect directly to dashboard
    const supabase = getSupabaseClient();
    if (supabase) {
      supabase.auth.getSession().then(async ({ data: { session } }) => {
        if (session?.user && session?.access_token) {
          const authCheck = await verifyServerAdminSession(session.access_token);
          if (authCheck.authorized) {
            router.push("/admin/dashboard");
          }
        }
      });
    }
  }, [router, searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorDetails(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setErrorDetails({
        category: "general",
        title: "Required Fields Missing",
        message: "Please enter both your administrator email and password.",
      });
      return;
    }

    if (!configured) {
      setErrorDetails({
        category: "network",
        title: "Supabase Unconfigured",
        message:
          "Supabase credentials are not found in .env.local. Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable authentication.",
      });
      return;
    }

    setLoading(true);

    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        throw new Error("Supabase client is not initialized.");
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPassword,
      });

      if (error) {
        const rawMsg = (error.message || "").toLowerCase();
        const status = error.status;

        // 1. Account not confirmed
        if (
          rawMsg.includes("email not confirmed") ||
          rawMsg.includes("confirm your email") ||
          rawMsg.includes("confirmation")
        ) {
          setErrorDetails({
            category: "unconfirmed",
            title: "Account Email Not Confirmed",
            message:
              "This administrator account has been created, but its email address has not yet been verified.",
            suggestion:
              "Check your email inbox for the Supabase confirmation link, or in the Supabase Dashboard (Authentication > Users) click the user and select 'Confirm Email'.",
          });
          return;
        }

        // 2. Incorrect credentials
        if (
          rawMsg.includes("invalid login credentials") ||
          rawMsg.includes("invalid credential") ||
          rawMsg.includes("invalid password") ||
          rawMsg.includes("user not found")
        ) {
          setErrorDetails({
            category: "credentials",
            title: "Incorrect Email or Password",
            message:
              "The credentials entered do not match any registered account in Supabase.",
            suggestion:
              "Please check your spelling. If you haven't created this administrator user yet, open the Supabase Dashboard > Authentication > Users > Add User, enter this email/password and select 'Auto Confirm User'.",
          });
          return;
        }

        // 3. Connection / Network failure
        if (
          rawMsg.includes("failed to fetch") ||
          rawMsg.includes("network") ||
          rawMsg.includes("connection") ||
          error.name === "AuthRetryableFetchError" ||
          status === 0
        ) {
          setErrorDetails({
            category: "network",
            title: "Database Connection Failure",
            message:
              "Unable to establish a secure connection to the Supabase authentication server.",
            suggestion:
              "Verify your internet connection and confirm NEXT_PUBLIC_SUPABASE_URL in .env.local points to a live Supabase project.",
          });
          return;
        }

        // 4. Rate limit
        if (rawMsg.includes("rate limit") || rawMsg.includes("too many requests")) {
          setErrorDetails({
            category: "rate_limit",
            title: "Too Many Login Attempts",
            message:
              "Supabase has temporarily rate-limited login attempts from this address for security.",
            suggestion: "Please wait a few minutes before trying again.",
          });
          return;
        }

        // Fallback generic auth error
        setErrorDetails({
          category: "general",
          title: "Authentication Failed",
          message: error.message || "Unable to sign in with the provided credentials.",
          suggestion: "Please verify your administrator account settings in Supabase.",
        });
        return;
      }

      // Check user authorization against Supabase admin_users database table
      if (data.user && data.session) {
        const serverCheck = await verifyServerAdminSession(data.session.access_token);

        if (!serverCheck.authorized) {
          // Account authenticated in Supabase, but NOT authorized in admin_users table
          await signOutAdmin();

          if (serverCheck.tableMissing) {
            setErrorDetails({
              category: "network",
              title: "Database Setup Required",
              message:
                "The 'admin_users' authorization table has not been initialized in Supabase yet.",
              suggestion:
                "Open your Supabase Dashboard -> SQL Editor and execute the provided 'supabase-admin-schema.sql' script to enable administrator access control.",
            });
            return;
          }

          if (serverCheck.revoked) {
            setErrorDetails({
              category: "unauthorized",
              title: "Account Access Revoked",
              message:
                "Account Access Revoked – This administrator account has been deactivated in Supabase",
              suggestion:
                "Please contact the hospital system administrator to re-activate your administrator privileges.",
            });
            return;
          }

          setErrorDetails({
            category: "unauthorized",
            title: "Account Not Authorized",
            message:
              serverCheck.error ||
              "Account Not Authorized – Contact system administrator to grant admin access in Supabase",
            suggestion: `To grant admin access to "${cleanEmail}", open Supabase SQL Editor and execute: SELECT public.authorize_admin_user('${cleanEmail}');`,
          });
          return;
        }

        // Set session cookie for Next.js middleware detection
        if (typeof document !== "undefined") {
          document.cookie =
            "drk_admin_token=active; path=/; max-age=86400; SameSite=Lax";
        }

        router.push("/admin/dashboard");
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "An unexpected error occurred during login.";
      setErrorDetails({
        category: "general",
        title: "Unexpected Error",
        message: msg,
      });
    } finally {
      setLoading(false);
    }
  };

  const getErrorIcon = (category: ErrorCategory) => {
    switch (category) {
      case "unconfirmed":
        return <MailCheck size={18} className="text-amber-600 shrink-0 mt-0.5" />;
      case "unauthorized":
        return <UserX size={18} className="text-red-600 shrink-0 mt-0.5" />;
      case "network":
        return <WifiOff size={18} className="text-rose-600 shrink-0 mt-0.5" />;
      case "credentials":
        return <KeyRound size={18} className="text-red-600 shrink-0 mt-0.5" />;
      default:
        return <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />;
    }
  };

  const getErrorStyle = (category: ErrorCategory) => {
    switch (category) {
      case "unconfirmed":
        return "border-amber-200 bg-amber-50 text-amber-900";
      case "unauthorized":
        return "border-red-200 bg-red-50 text-red-900";
      case "network":
        return "border-rose-200 bg-rose-50 text-rose-900";
      default:
        return "border-red-200 bg-red-50 text-red-900";
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F8FDFF] px-4 py-8">
      {/* Top Header */}
      <header className="container max-w-5xl flex items-center justify-between py-3">
        <div className="relative h-12 w-44">
          <Image
            src="/images/drk-logo.png"
            alt="DRK Hospital"
            fill
            priority
            className="object-contain"
          />
        </div>
        <a
          href={process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:8000"}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#087FBA] hover:text-[#071B68] transition"
        >
          <span>View Public Site</span>
          <ExternalLink size={13} />
        </a>
      </header>

      {/* Main Login Card */}
      <main className="w-full max-w-md mx-auto my-auto py-8">
        {!configured && <SupabaseSetupBanner configured={false} />}

        <div className="card p-8 sm:p-10 bg-white shadow-xl border border-[#DCE8F0] rounded-2xl">
          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#EFFBFC] px-3.5 py-1 text-xs font-bold text-[#087FBA] border border-[#DCE8F0]">
              <ShieldCheck size={14} className="text-[#10C6C1]" />
              <span>DRK Hospital Administration</span>
            </div>

            <h1 className="mt-4 text-2xl font-extrabold text-[#071B68]">
              Administrator Sign In
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-[#5D6B85]">
              Private portal for hospital website content & clinical media management.
            </p>
          </div>

          {/* Granular Error Alert */}
          {errorDetails && (
            <div
              className={`mt-6 rounded-xl border p-4 text-xs transition-all duration-200 ${getErrorStyle(
                errorDetails.category
              )}`}
            >
              <div className="flex items-start gap-2.5">
                {getErrorIcon(errorDetails.category)}
                <div className="flex-1 space-y-1">
                  <h2 className="font-bold text-[13px]">{errorDetails.title}</h2>
                  <p className="leading-relaxed opacity-90">{errorDetails.message}</p>
                  {errorDetails.suggestion && (
                    <div className="mt-2 pt-2 border-t border-black/10 text-[11px] font-medium leading-relaxed opacity-95">
                      <strong className="font-bold">Next Step: </strong>
                      {errorDetails.suggestion}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-bold uppercase tracking-wider text-[#071B68] mb-1.5"
              >
                Admin Email
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#5D6B85]">
                  <Mail size={16} />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="admin@drkhospitals.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-[#DCE8F0] bg-white py-2.5 pl-10 pr-4 text-sm text-[#071B68] placeholder:text-[#8896AB] focus:border-[#087FBA] focus:outline-hidden focus:ring-2 focus:ring-[#087FBA]/20 transition"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-bold uppercase tracking-wider text-[#071B68] mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#5D6B85]">
                  <Lock size={16} />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-[#DCE8F0] bg-white py-2.5 pl-10 pr-11 text-sm text-[#071B68] placeholder:text-[#8896AB] focus:border-[#087FBA] focus:outline-hidden focus:ring-2 focus:ring-[#087FBA]/20 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#5D6B85] hover:text-[#071B68] transition cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full btn-primary justify-center cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed !py-2.5"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Admin Portal</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 pt-5 border-t border-[#DCE8F0] text-center text-[11px] text-[#8896AB]">
            <p>Protected Healthcare Admin Portal. Authorized personnel only.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container max-w-5xl py-4 text-center text-xs text-[#5D6B85]">
        <p>© {new Date().getFullYear()} DRK Hospital. ROOTED IN CARE. Private Admin System.</p>
      </footer>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F8FDFF]">
          <Loader2 size={32} className="animate-spin text-[#087FBA]" />
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
