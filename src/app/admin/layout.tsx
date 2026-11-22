"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import { signOutAdmin } from "@/lib/admin-auth";
import { verifyServerAdminSession } from "@/app/actions/admin-auth";
import AdminSidebar from "@/components/admin/layout/AdminSidebar";
import AdminTopBar from "@/components/admin/layout/AdminTopBar";
import { Loader2 } from "lucide-react";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [adminEmail, setAdminEmail] = useState("admin@drkhospital.com");
  const [checkingAuth, setCheckingAuth] = useState(true);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    // Skip auth guard on the login page itself
    if (isLoginPage) {
      setCheckingAuth(false);
      return;
    }

    const isConfig = isSupabaseConfigured();
    const supabase = getSupabaseClient();

    if (!supabase || !isConfig) {
      // In unconfigured state, let admin access dashboard to review setup guides
      setCheckingAuth(false);
      return;
    }

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        router.push("/admin/login");
        return;
      }

      if (session.user && session.access_token) {
        const authCheck = await verifyServerAdminSession(session.access_token);
        if (!authCheck.authorized) {
          console.warn("[AdminLayout] Session failed authorization check:", authCheck.error);
          await signOutAdmin();
          const reasonParam = authCheck.error ? `&reason=${encodeURIComponent(authCheck.error)}` : "";
          router.push(`/admin/login?error=unauthorized${reasonParam}`);
          return;
        }
        if (session.user.email) {
          setAdminEmail(authCheck.email || session.user.email);
        }
      }
      setCheckingAuth(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!session && !isLoginPage) {
        router.push("/admin/login");
      } else if (session?.user?.email && session?.access_token && event !== "INITIAL_SESSION") {
        const authCheck = await verifyServerAdminSession(session.access_token);
        if (!authCheck.authorized && !isLoginPage) {
          console.warn("[AdminLayout] onAuthStateChange failed authorization:", authCheck.error);
          await signOutAdmin();
          const reasonParam = authCheck.error ? `&reason=${encodeURIComponent(authCheck.error)}` : "";
          router.push(`/admin/login?error=unauthorized${reasonParam}`);
          return;
        }
        setAdminEmail(authCheck.email || session.user.email);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [pathname, isLoginPage, router]);

  // Login page layout
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Loading state while verifying administrator session
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FDFF]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin text-[#087FBA]" />
          <p className="text-xs font-bold text-[#071B68]">
            Verifying DRK Hospital Administrator Session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FDFF] flex flex-col">
      {/* Fixed Collapsible Sidebar */}
      <AdminSidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* Top Bar Header */}
      <AdminTopBar
        adminEmail={adminEmail}
        onOpenMobileSidebar={() => setMobileOpen(true)}
        collapsed={collapsed}
      />

      {/* Main Workspace Content Area */}
      <main
        className={`flex-1 transition-all duration-300 p-4 sm:p-6 lg:p-8 ${
          collapsed ? "lg:ml-20" : "lg:ml-64"
        }`}
      >
        <div className="max-w-7xl mx-auto space-y-6">{children}</div>
      </main>
    </div>
  );
}

