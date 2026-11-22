"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import SafeImage from "@/components/SafeImage";
import {
  Layout,
  Home,
  Info,
  Stethoscope,
  Phone,
  Images,
  FileImage,
  Share2,
  Globe,
  ArrowRight,
  Database,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Layers,
  Upload,
  UserCheck,
  RefreshCw,
  UserPlus,
  UserMinus,
  Users,
  Copy,
  Check,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import SupabaseSetupBanner from "@/components/admin/SupabaseSetupBanner";
import { GalleryImage } from "@/types/gallery";
import { AdminUserRecord } from "@/lib/admin-auth";
import {
  getAdminUsersList,
  authorizeAdminUserAction,
  revokeAdminUserAction,
} from "@/app/actions/admin-auth";

interface CMSStats {
  publishedSections: number;
  draftSections: number;
  totalMedia: number;
  totalGallery: number;
  lastPublished: string | null;
  lastUpdated: string | null;
}

interface RecentActivity {
  id: string;
  section_name: string;
  updated_at: string;
  is_published: boolean;
  has_draft: boolean;
}

export default function AdminDashboardPage() {
  const searchParams = useSearchParams();
  const showAccountTab = searchParams?.get("tab") === "account";

  const [adminEmail, setAdminEmail] = useState<string>("admin@drkhospitals.com");
  const [loading, setLoading] = useState(true);
  const [configured, setConfigured] = useState(false);
  const [recentImages, setRecentImages] = useState<GalleryImage[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [stats, setStats] = useState<CMSStats>({
    publishedSections: 11,
    draftSections: 0,
    totalMedia: 0,
    totalGallery: 0,
    lastPublished: null,
    lastUpdated: null,
  });

  // Admin Management State
  const [adminUsers, setAdminUsers] = useState<AdminUserRecord[]>([]);
  const [adminUsersLoading, setAdminUsersLoading] = useState(false);
  const [tableMissing, setTableMissing] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminName, setNewAdminName] = useState("");
  const [newAdminRole, setNewAdminRole] = useState("admin");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [copiedSQL, setCopiedSQL] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const isConfig = isSupabaseConfigured();
    setConfigured(isConfig);

    const supabase = getSupabaseClient();
    if (!supabase || !isConfig) {
      setLoading(false);
      return;
    }

    try {
      // 1. Get Session Email
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user?.email) {
        setAdminEmail(session.user.email);
      }

      // 2. Fetch CMS Sections stats
      const { data: cmsData } = await supabase
        .from("website_content")
        .select("id, section_name, is_published, has_draft, published_at, updated_at")
        .order("updated_at", { ascending: false });

      let publishedCount = 11; // default verified fallback sections
      let draftsCount = 0;
      let lastPubDate: string | null = null;
      let lastUpdDate: string | null = null;
      const activities: RecentActivity[] = [];

      if (cmsData && cmsData.length > 0) {
        publishedCount = cmsData.filter((c) => c.is_published).length;
        draftsCount = cmsData.filter((c) => c.has_draft).length;
        const sortedByPub = [...cmsData]
          .filter((c) => c.published_at)
          .sort(
            (a, b) =>
              new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
          );
        if (sortedByPub[0]?.published_at) {
          lastPubDate = sortedByPub[0].published_at;
        }
        if (cmsData[0]?.updated_at) {
          lastUpdDate = cmsData[0].updated_at;
        }
        cmsData.slice(0, 5).forEach((item) => {
          activities.push({
            id: item.id,
            section_name: item.section_name,
            updated_at: item.updated_at,
            is_published: item.is_published,
            has_draft: item.has_draft,
          });
        });
      }

      // 3. Fetch Media Library count
      const { count: mediaCount } = await supabase
        .from("website_media")
        .select("*", { count: "exact", head: true });

      // 4. Fetch Gallery count & recent uploads
      const { data: galleryData, count: galleryCount } = await supabase
        .from("gallery_images")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .limit(4);

      if (galleryData) {
        setRecentImages(galleryData as GalleryImage[]);
      }

      setRecentActivities(activities);
      setStats({
        publishedSections: publishedCount,
        draftSections: draftsCount,
        totalMedia: mediaCount || 0,
        totalGallery: galleryCount || 0,
        lastPublished: lastPubDate,
        lastUpdated: lastUpdDate,
      });
    } catch {
      // Graceful fallback to default values
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminUsers = async () => {
    const supabase = getSupabaseClient();
    if (!supabase) return;
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.access_token) return;

      setAdminUsersLoading(true);
      const res = await getAdminUsersList(session.access_token);
      if (res.success && res.users) {
        setAdminUsers(res.users);
        setTableMissing(false);
      } else if (res.tableMissing) {
        setTableMissing(true);
      }
    } catch {
      // Graceful error handling
    } finally {
      setAdminUsersLoading(false);
    }
  };

  const handleAuthorizeAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail.trim()) return;

    setActionLoading(true);
    setActionMessage(null);

    try {
      const supabase = getSupabaseClient();
      if (!supabase) throw new Error("Database client not available");

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.access_token) {
        setActionMessage({
          type: "error",
          text: "Session expired. Please sign in again.",
        });
        return;
      }

      const res = await authorizeAdminUserAction(
        session.access_token,
        newAdminEmail.trim(),
        newAdminName.trim() || undefined,
        newAdminRole
      );

      if (res.success) {
        setActionMessage({ type: "success", text: res.message });
        setNewAdminEmail("");
        setNewAdminName("");
        setNewAdminRole("admin");
        await fetchAdminUsers();
      } else {
        setActionMessage({ type: "error", text: res.message });
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Error authorizing administrator account";
      setActionMessage({ type: "error", text: msg });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRevokeAdmin = async (targetEmail: string) => {
    if (
      !confirm(
        `Are you sure you want to revoke administrative access for ${targetEmail}? This user will no longer be able to access the admin portal.`
      )
    ) {
      return;
    }

    setActionLoading(true);
    setActionMessage(null);

    try {
      const supabase = getSupabaseClient();
      if (!supabase) throw new Error("Database client not available");

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.access_token) {
        setActionMessage({
          type: "error",
          text: "Session expired. Please sign in again.",
        });
        return;
      }

      const res = await revokeAdminUserAction(session.access_token, targetEmail);
      if (res.success) {
        setActionMessage({ type: "success", text: res.message });
        await fetchAdminUsers();
      } else {
        setActionMessage({ type: "error", text: res.message });
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Error revoking administrator account";
      setActionMessage({ type: "error", text: msg });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReactivateAdmin = async (targetEmail: string, targetName?: string | null) => {
    setActionLoading(true);
    setActionMessage(null);

    try {
      const supabase = getSupabaseClient();
      if (!supabase) throw new Error("Database client not available");

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.access_token) {
        setActionMessage({
          type: "error",
          text: "Session expired. Please sign in again.",
        });
        return;
      }

      const res = await authorizeAdminUserAction(
        session.access_token,
        targetEmail,
        targetName || undefined
      );

      if (res.success) {
        setActionMessage({ type: "success", text: res.message });
        await fetchAdminUsers();
      } else {
        setActionMessage({ type: "error", text: res.message });
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Error activating administrator account";
      setActionMessage({ type: "error", text: msg });
    } finally {
      setActionLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedSQL(true);
      setTimeout(() => setCopiedSQL(false), 2000);
    }
  };

  useEffect(() => {
    fetchData();
    if (showAccountTab) {
      fetchAdminUsers();
    }
  }, [showAccountTab]);

  const formatDate = (isoString: string | null) => {
    if (!isoString) return "Never";
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  const currentDateFormatted = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-8">
      {/* 1. WELCOME BANNER */}
      <div className="rounded-2xl border border-[#DCE8F0] bg-gradient-to-r from-white via-[#EFFBFC]/40 to-[#EAF8FF]/60 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1 text-xs font-bold text-[#087FBA] border border-[#DCE8F0] shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>DRK Hospital Administration</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#071B68]">
              Welcome Back, Administrator
            </h1>
            <p className="text-xs sm:text-sm text-[#5D6B85]">
              Signed in as <strong className="text-[#071B68]">{adminEmail}</strong> • Today is {currentDateFormatted}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/dashboard/website-content"
              className="btn-primary text-xs sm:text-sm !py-2.5 !px-5"
            >
              <Layout size={15} />
              <span>Open CMS Studio</span>
            </Link>
            <button
              type="button"
              onClick={fetchData}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-full border border-[#DCE8F0] bg-white px-4 py-2.5 text-xs font-bold text-[#071B68] shadow-2xs hover:bg-[#EFFBFC] transition cursor-pointer"
              title="Refresh Dashboard Statistics"
            >
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
              <span>Sync</span>
            </button>
          </div>
        </div>
      </div>

      {/* Supabase Setup Banner if Unconfigured */}
      {!configured && <SupabaseSetupBanner configured={false} />}

      {/* 2. SIX METRICS SUMMARY CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {/* Card 1: Published Content */}
        <div className="card p-5 bg-white border border-[#DCE8F0] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#087FBA]">
              Live Sections
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-[#071B68]">
              {stats.publishedSections}
            </span>
            <p className="mt-0.5 text-[11px] text-[#5D6B85]">Published website modules</p>
          </div>
        </div>

        {/* Card 2: Draft Changes */}
        <div className="card p-5 bg-white border border-[#DCE8F0] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">
              Staged Drafts
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Layers size={16} />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-[#071B68]">
              {stats.draftSections}
            </span>
            <p className="mt-0.5 text-[11px] text-[#5D6B85]">Awaiting live publish</p>
          </div>
        </div>

        {/* Card 3: Media Assets */}
        <div className="card p-5 bg-white border border-[#DCE8F0] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#087FBA]">
              Media Library
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EFFBFC] text-[#087FBA]">
              <FileImage size={16} />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-[#071B68]">
              {stats.totalMedia}
            </span>
            <p className="mt-0.5 text-[11px] text-[#5D6B85]">Uploaded image assets</p>
          </div>
        </div>

        {/* Card 4: Gallery Photos */}
        <div className="card p-5 bg-white border border-[#DCE8F0] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#10C6C1]">
              Gallery Images
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EFFBFC] text-[#10C6C1]">
              <Images size={16} />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-[#071B68]">
              {stats.totalGallery}
            </span>
            <p className="mt-0.5 text-[11px] text-[#5D6B85]">Hospital tour photos</p>
          </div>
        </div>

        {/* Card 5: Core Specialties */}
        <div className="card p-5 bg-white border border-[#DCE8F0] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#071B68]">
              Specialties
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EFFBFC] text-[#071B68]">
              <Stethoscope size={16} />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-[#071B68]">3</span>
            <p className="mt-0.5 text-[11px] text-[#5D6B85]">Dental • Skin • Hair</p>
          </div>
        </div>

        {/* Card 6: Last Published */}
        <div className="card p-5 bg-white border border-[#DCE8F0] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#087FBA]">
              Last Published
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EFFBFC] text-[#087FBA]">
              <Clock size={16} />
            </div>
          </div>
          <div>
            <span className="text-xs font-bold text-[#071B68] block truncate">
              {stats.lastPublished ? formatDate(stats.lastPublished) : "Phase 7 Default"}
            </span>
            <p className="mt-0.5 text-[11px] text-[#5D6B85]">Sync status: Live</p>
          </div>
        </div>
      </div>

      {/* 3. SIX QUICK ACTION CARDS */}
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-[#071B68]">
            Quick Administrative Actions
          </h2>
          <p className="text-xs text-[#5D6B85]">
            Frequent hospital website management tasks and direct shortcuts.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Action 1: Edit Homepage */}
          <Link
            href="/admin/dashboard/website-content?tab=homepage"
            className="card p-5 bg-white border border-[#DCE8F0] shadow-xs hover:border-[#087FBA] hover:shadow-md transition group"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EFFBFC] text-[#087FBA] group-hover:bg-[#071B68] group-hover:text-white transition">
                <Home size={20} />
              </div>
              <ArrowRight size={16} className="text-[#8896AB] group-hover:text-[#087FBA] group-hover:translate-x-1 transition" />
            </div>
            <h3 className="mt-4 text-sm font-bold text-[#071B68]">
              Edit Homepage Content
            </h3>
            <p className="mt-1 text-xs text-[#5D6B85] leading-relaxed">
              Update hero banner copy, specialty cards, facilities preview, and call-to-action buttons.
            </p>
          </Link>

          {/* Action 2: Update Hospital Information */}
          <Link
            href="/admin/dashboard/website-content?tab=contact"
            className="card p-5 bg-white border border-[#DCE8F0] shadow-xs hover:border-[#087FBA] hover:shadow-md transition group"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EFFBFC] text-[#087FBA] group-hover:bg-[#071B68] group-hover:text-white transition">
                <Phone size={20} />
              </div>
              <ArrowRight size={16} className="text-[#8896AB] group-hover:text-[#087FBA] group-hover:translate-x-1 transition" />
            </div>
            <h3 className="mt-4 text-sm font-bold text-[#071B68]">
              Update Hospital Information
            </h3>
            <p className="mt-1 text-xs text-[#5D6B85] leading-relaxed">
              Modify hospital address, direct telephone helplines, WhatsApp number, and clinic timings.
            </p>
          </Link>

          {/* Action 3: Manage Services */}
          <Link
            href="/admin/dashboard/website-content?tab=services"
            className="card p-5 bg-white border border-[#DCE8F0] shadow-xs hover:border-[#087FBA] hover:shadow-md transition group"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EFFBFC] text-[#10C6C1] group-hover:bg-[#071B68] group-hover:text-white transition">
                <Stethoscope size={20} />
              </div>
              <ArrowRight size={16} className="text-[#8896AB] group-hover:text-[#087FBA] group-hover:translate-x-1 transition" />
            </div>
            <h3 className="mt-4 text-sm font-bold text-[#071B68]">
              Manage Medical Services
            </h3>
            <p className="mt-1 text-xs text-[#5D6B85] leading-relaxed">
              Add, update or hide clinical procedures for Dental Care, Skin Care, and Trichology.
            </p>
          </Link>

          {/* Action 4: Upload Website Images */}
          <Link
            href="/admin/dashboard/website-content?tab=media"
            className="card p-5 bg-white border border-[#DCE8F0] shadow-xs hover:border-[#087FBA] hover:shadow-md transition group"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EFFBFC] text-[#087FBA] group-hover:bg-[#071B68] group-hover:text-white transition">
                <FileImage size={20} />
              </div>
              <ArrowRight size={16} className="text-[#8896AB] group-hover:text-[#087FBA] group-hover:translate-x-1 transition" />
            </div>
            <h3 className="mt-4 text-sm font-bold text-[#071B68]">
              Upload Website Images
            </h3>
            <p className="mt-1 text-xs text-[#5D6B85] leading-relaxed">
              Add photographs to the Centralized Media Library for hero sections, doctors, and rooms.
            </p>
          </Link>

          {/* Action 5: Manage Gallery */}
          <Link
            href="/admin/dashboard/gallery"
            className="card p-5 bg-white border border-[#DCE8F0] shadow-xs hover:border-[#087FBA] hover:shadow-md transition group"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EFFBFC] text-[#10C6C1] group-hover:bg-[#071B68] group-hover:text-white transition">
                <Images size={20} />
              </div>
              <ArrowRight size={16} className="text-[#8896AB] group-hover:text-[#087FBA] group-hover:translate-x-1 transition" />
            </div>
            <h3 className="mt-4 text-sm font-bold text-[#071B68]">
              Manage Hospital Gallery
            </h3>
            <p className="mt-1 text-xs text-[#5D6B85] leading-relaxed">
              Upload, publish, unpublish, or delete photos displayed on the public /gallery page.
            </p>
          </Link>

          {/* Action 6: Update Social Media */}
          <Link
            href="/admin/dashboard/website-content?tab=social"
            className="card p-5 bg-white border border-[#DCE8F0] shadow-xs hover:border-[#087FBA] hover:shadow-md transition group"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EFFBFC] text-[#087FBA] group-hover:bg-[#071B68] group-hover:text-white transition">
                <Share2 size={20} />
              </div>
              <ArrowRight size={16} className="text-[#8896AB] group-hover:text-[#087FBA] group-hover:translate-x-1 transition" />
            </div>
            <h3 className="mt-4 text-sm font-bold text-[#071B68]">
              Update Social Media Links
            </h3>
            <p className="mt-1 text-xs text-[#5D6B85] leading-relaxed">
              Manage hospital links for Instagram, Facebook, YouTube, and LinkedIn in the footer.
            </p>
          </Link>
        </div>
      </div>

      {/* 4. RECENT ACTIVITY & GALLERY PREVIEWS GRID */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column: Recent Content Updates */}
        <div className="lg:col-span-7 card p-6 bg-white border border-[#DCE8F0] shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-[#DCE8F0]">
            <div>
              <h3 className="text-base font-bold text-[#071B68]">
                Recent Content Updates
              </h3>
              <p className="text-xs text-[#5D6B85]">
                History of recently staged drafts and published sections.
              </p>
            </div>
            <Link
              href="/admin/dashboard/website-content"
              className="text-xs font-bold text-[#087FBA] hover:underline"
            >
              Open Studio →
            </Link>
          </div>

          <div className="mt-4 divide-y divide-[#DCE8F0]">
            {recentActivities.length > 0 ? (
              recentActivities.map((act) => (
                <div key={act.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-[#071B68]">{act.section_name}</p>
                    <p className="text-[11px] text-[#8896AB] flex items-center gap-1.5 mt-0.5">
                      <Clock size={11} />
                      <span>{formatDate(act.updated_at)}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {act.has_draft && (
                      <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">
                        Draft Staged
                      </span>
                    )}
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                        act.is_published
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-slate-50 text-slate-600 border-slate-200"
                      }`}
                    >
                      {act.is_published ? "Published" : "Unpublished"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-[#5D6B85]">
                <CheckCircle2 size={24} className="mx-auto text-[#10C6C1] mb-2" />
                <p className="font-semibold text-[#071B68]">Default Website Content Active</p>
                <p className="mt-1 text-[#8896AB]">
                  All sections are currently serving verified approved defaults. Open the CMS Studio to stage edits.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Hospital Gallery Preview */}
        <div className="lg:col-span-5 card p-6 bg-white border border-[#DCE8F0] shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-[#DCE8F0]">
            <div>
              <h3 className="text-base font-bold text-[#071B68]">
                Hospital Gallery Photos
              </h3>
              <p className="text-xs text-[#5D6B85]">
                {stats.totalGallery} photos in public tour gallery.
              </p>
            </div>
            <Link
              href="/admin/dashboard/gallery"
              className="text-xs font-bold text-[#087FBA] hover:underline"
            >
              Manage →
            </Link>
          </div>

          <div className="mt-4">
            {recentImages.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {recentImages.map((img) => (
                  <div
                    key={img.id}
                    className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-[#DCE8F0] bg-slate-100"
                  >
                    <SafeImage
                      src={img.public_url}
                      alt={img.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      fallbackSrc="/images/hero-clinic.jpg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#071B68]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex items-end">
                      <p className="text-[10px] font-bold text-white truncate">
                        {img.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-[#5D6B85]">
                <Images size={24} className="mx-auto text-[#8896AB] mb-2" />
                <p className="font-semibold text-[#071B68]">No Gallery Images Uploaded</p>
                <p className="mt-1 text-[#8896AB]">
                  Upload clinical suites and infrastructure photographs.
                </p>
                <Link
                  href="/admin/dashboard/gallery"
                  className="mt-3 inline-flex items-center gap-1.5 btn-outline text-xs !py-1.5 !px-3"
                >
                  <Upload size={13} />
                  <span>Upload Image</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5. ACCOUNT & ADMINISTRATOR MANAGEMENT (visible when tab=account) */}
      {showAccountTab && (
        <div className="space-y-6">
          {/* Current Administrator Card */}
          <div className="card p-6 sm:p-8 bg-white border border-[#DCE8F0] shadow-sm">
            <div className="flex items-center gap-3 pb-4 border-b border-[#DCE8F0]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EFFBFC] text-[#087FBA]">
                <UserCheck size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#071B68]">
                  Current Administrator Session
                </h3>
                <p className="text-xs text-[#5D6B85]">
                  Active session details, role privileges, and database authorization.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-xs">
              <div className="rounded-xl border border-[#DCE8F0] p-4 bg-[#F8FDFF]">
                <span className="text-[#8896AB] font-medium block">Logged-In Administrator</span>
                <span className="font-bold text-[#071B68] text-sm mt-1 block truncate">
                  {adminEmail}
                </span>
              </div>
              <div className="rounded-xl border border-[#DCE8F0] p-4 bg-[#F8FDFF]">
                <span className="text-[#8896AB] font-medium block">Access Control Authority</span>
                <span className="font-bold text-emerald-700 text-sm mt-1 block flex items-center gap-1.5">
                  <ShieldCheck size={16} />
                  <span>Database-Driven (admin_users)</span>
                </span>
              </div>
              <div className="rounded-xl border border-[#DCE8F0] p-4 bg-[#F8FDFF]">
                <span className="text-[#8896AB] font-medium block">Environment Status</span>
                <span className="font-bold text-[#087FBA] text-sm mt-1 block">
                  {configured ? "Supabase Cloud Connected" : "Local Verified Fallback"}
                </span>
              </div>
            </div>
          </div>

          {/* Database Setup Notice if table not created yet */}
          {tableMissing && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-900 shadow-sm">
              <div className="flex items-start gap-3">
                <AlertTriangle size={24} className="text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1 space-y-2 text-xs">
                  <h4 className="text-sm font-bold text-amber-900">
                    Database Setup Required: Initialize &quot;admin_users&quot; Table
                  </h4>
                  <p className="leading-relaxed">
                    The <code className="bg-amber-100 font-mono px-1 py-0.5 rounded text-amber-800">public.admin_users</code> table has not been initialized in your Supabase project yet.
                  </p>
                  <p className="leading-relaxed">
                    Please open your <strong>Supabase Dashboard → SQL Editor</strong> and run the file <code className="bg-amber-100 font-mono px-1 py-0.5 rounded text-amber-800">supabase-admin-schema.sql</code> located in the project root directory.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Message Alert */}
          {actionMessage && (
            <div
              className={`rounded-xl border p-4 text-xs ${
                actionMessage.type === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                  : "border-red-200 bg-red-50 text-red-900"
              }`}
            >
              <div className="flex items-center gap-2">
                {actionMessage.type === "success" ? (
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle size={16} className="text-red-600 shrink-0" />
                )}
                <span className="font-medium">{actionMessage.text}</span>
              </div>
            </div>
          )}

          {/* Authorized Administrators Table */}
          <div className="card p-6 sm:p-8 bg-white border border-[#DCE8F0] shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DCE8F0]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EFFBFC] text-[#087FBA]">
                  <Users size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#071B68]">
                    Authorized Hospital Administrators
                  </h3>
                  <p className="text-xs text-[#5D6B85]">
                    Only accounts active in this list are authorized to sign in to the Admin Portal.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={fetchAdminUsers}
                disabled={adminUsersLoading}
                className="inline-flex items-center gap-1.5 btn-outline text-xs !py-1.5 !px-3 self-start sm:self-auto cursor-pointer"
              >
                <RefreshCw
                  size={13}
                  className={adminUsersLoading ? "animate-spin text-[#087FBA]" : ""}
                />
                <span>Refresh List</span>
              </button>
            </div>

            {/* List */}
            <div className="mt-6 overflow-x-auto">
              {adminUsersLoading ? (
                <div className="py-8 text-center text-xs text-[#5D6B85]">
                  <Loader2 size={24} className="animate-spin mx-auto text-[#087FBA] mb-2" />
                  <p>Loading administrator accounts from Supabase...</p>
                </div>
              ) : adminUsers.length > 0 ? (
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#DCE8F0] text-[#8896AB] uppercase text-[10px] tracking-wider">
                      <th className="pb-3 font-semibold">Administrator</th>
                      <th className="pb-3 font-semibold">Role</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold">Authorized Date</th>
                      <th className="pb-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DCE8F0]/60">
                    {adminUsers.map((u) => {
                      const isCurrentUser =
                        u.email.toLowerCase() === adminEmail.toLowerCase();
                      const currentAdminUser = adminUsers.find(
                        (curr) => curr.email.toLowerCase() === adminEmail.toLowerCase()
                      );
                      const isCurrentUserSuperAdmin =
                        currentAdminUser?.role === "super_admin";

                      return (
                        <tr key={u.id} className="hover:bg-[#F8FDFF]/60 transition">
                          <td className="py-3.5 pr-4">
                            <div className="flex items-center gap-2.5">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#071B68] text-white font-bold text-xs uppercase">
                                {u.email.charAt(0)}
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-[#071B68] truncate">
                                  {u.full_name || u.email.split("@")[0]}
                                </p>
                                <p className="text-[#5D6B85] text-[11px] truncate">
                                  {u.email}
                                  {isCurrentUser && (
                                    <span className="ml-1.5 rounded-full bg-[#EFFBFC] px-1.5 py-0.2 text-[10px] font-bold text-[#087FBA] border border-[#DCE8F0]">
                                      Current Session
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 pr-4">
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase border ${
                                u.role === "super_admin"
                                  ? "bg-purple-50 text-purple-700 border-purple-200"
                                  : "bg-slate-100 text-[#071B68] border-slate-200"
                              }`}
                            >
                              {u.role}
                            </span>
                          </td>
                          <td className="py-3.5 pr-4">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                                u.is_active
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : "bg-red-50 text-red-700 border-red-200"
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  u.is_active ? "bg-emerald-500" : "bg-red-500"
                                }`}
                              />
                              <span>{u.is_active ? "Active Admin" : "Revoked"}</span>
                            </span>
                          </td>
                          <td className="py-3.5 pr-4 text-[#5D6B85]">
                            {formatDate(u.created_at || null)}
                          </td>
                          <td className="py-3.5 text-right">
                            {u.is_active ? (
                              <button
                                type="button"
                                onClick={() => handleRevokeAdmin(u.email)}
                                disabled={
                                  actionLoading ||
                                  isCurrentUser ||
                                  !isCurrentUserSuperAdmin
                                }
                                title={
                                  !isCurrentUserSuperAdmin
                                    ? "Only super_admin accounts can revoke administrator access"
                                    : isCurrentUser
                                    ? "Cannot revoke your own active administrator account"
                                    : "Revoke administrator privileges"
                                }
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 hover:text-rose-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                              >
                                <UserMinus size={13} />
                                <span>Revoke</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleReactivateAdmin(u.email, u.full_name)}
                                disabled={actionLoading || !isCurrentUserSuperAdmin}
                                title={
                                  !isCurrentUserSuperAdmin
                                    ? "Only super_admin accounts can activate administrators"
                                    : "Re-activate administrator privileges"
                                }
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 hover:text-emerald-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                              >
                                <UserCheck size={13} />
                                <span>Re-activate</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="py-8 text-center text-xs text-[#5D6B85]">
                  <Users size={24} className="mx-auto text-[#8896AB] mb-2" />
                  <p className="font-semibold text-[#071B68]">
                    No Administrators in Database
                  </p>
                  <p className="mt-1 text-[#8896AB]">
                    Execute <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">supabase-admin-schema.sql</code> in the Supabase SQL Editor to bootstrap administrator records.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Authorize Form & SQL Guide Grid */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Form: Authorize Administrator */}
            <div className="card p-6 bg-white border border-[#DCE8F0] shadow-sm">
              <div className="flex items-center gap-2.5 pb-3 border-b border-[#DCE8F0]">
                <UserPlus size={18} className="text-[#087FBA]" />
                <h4 className="text-sm font-bold text-[#071B68]">
                  Authorize Administrator Account
                </h4>
              </div>
              <p className="mt-2 text-xs text-[#5D6B85] leading-relaxed">
                Add an existing Supabase user as an authorized DRK Hospital administrator. The user must already be created in Supabase Authentication.
              </p>

              <form onSubmit={handleAuthorizeAdmin} className="mt-4 space-y-3">
                <div>
                  <label
                    htmlFor="new-admin-email"
                    className="block text-[11px] font-bold text-[#071B68] mb-1 uppercase tracking-wider"
                  >
                    Supabase User Email
                  </label>
                  <input
                    id="new-admin-email"
                    type="email"
                    required
                    placeholder="doctor@drkhospitals.com"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    className="w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs text-[#071B68] placeholder:text-[#8896AB] focus:border-[#087FBA] focus:outline-hidden focus:ring-1 focus:ring-[#087FBA]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="new-admin-name"
                    className="block text-[11px] font-bold text-[#071B68] mb-1 uppercase tracking-wider"
                  >
                    Administrator Full Name (Optional)
                  </label>
                  <input
                    id="new-admin-name"
                    type="text"
                    placeholder="Dr. Ramesh Kumar"
                    value={newAdminName}
                    onChange={(e) => setNewAdminName(e.target.value)}
                    className="w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs text-[#071B68] placeholder:text-[#8896AB] focus:border-[#087FBA] focus:outline-hidden focus:ring-1 focus:ring-[#087FBA]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="new-admin-role"
                    className="block text-[11px] font-bold text-[#071B68] mb-1 uppercase tracking-wider"
                  >
                    Administrator Role
                  </label>
                  <select
                    id="new-admin-role"
                    value={newAdminRole}
                    onChange={(e) => setNewAdminRole(e.target.value)}
                    className="w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs text-[#071B68] focus:border-[#087FBA] focus:outline-hidden focus:ring-1 focus:ring-[#087FBA]"
                  >
                    <option value="admin">admin – Administrator (CMS & Content)</option>
                    <option value="super_admin">super_admin – Super Administrator (Full Control)</option>
                    <option value="doctor">doctor – Medical Specialist</option>
                    <option value="staff">staff – Clinical Staff</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={
                    actionLoading ||
                    !newAdminEmail.trim() ||
                    adminUsers.find(
                      (curr) => curr.email.toLowerCase() === adminEmail.toLowerCase()
                    )?.role !== "super_admin"
                  }
                  className="w-full btn-primary justify-center text-xs !py-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {actionLoading ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus size={13} />
                      <span>Grant Admin Access</span>
                    </>
                  )}
                </button>
                {adminUsers.find(
                  (curr) => curr.email.toLowerCase() === adminEmail.toLowerCase()
                )?.role !== "super_admin" && (
                  <p className="text-[10px] text-amber-700 bg-amber-50 rounded-lg p-2 border border-amber-200 leading-tight">
                    Strict Security: Only verified <strong>super_admin</strong> accounts can grant administrator privileges.
                  </p>
                )}
              </form>
            </div>

            {/* SQL Guide: Direct Supabase Instructions */}
            <div className="card p-6 bg-[#F8FDFF] border border-[#DCE8F0] shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 pb-3 border-b border-[#DCE8F0]">
                  <Database size={18} className="text-[#087FBA]" />
                  <h4 className="text-sm font-bold text-[#071B68]">
                    Manage via Supabase Dashboard
                  </h4>
                </div>

                <div className="mt-3 space-y-2.5 text-xs text-[#5D6B85] leading-relaxed">
                  <div className="flex items-start gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#087FBA] text-white font-bold text-[10px]">
                      1
                    </span>
                    <p>
                      <strong>Create User:</strong> Open <strong>Authentication → Users</strong> in Supabase, click <strong>Add User</strong>, enter email & password, and ensure user is confirmed.
                    </p>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#087FBA] text-white font-bold text-[10px]">
                      2
                    </span>
                    <p>
                      <strong>Grant Authorization:</strong> In <strong>SQL Editor</strong>, run:
                    </p>
                  </div>
                </div>

                {/* Copyable SQL Box */}
                <div className="mt-3 relative rounded-xl bg-[#071B68] p-3 text-white font-mono text-[10px] leading-relaxed">
                  <code>
                    INSERT INTO public.admin_users (id, email, full_name, role, is_active)<br />
                    SELECT id, email, &apos;Super Admin&apos;, &apos;super_admin&apos;, true<br />
                    FROM auth.users WHERE lower(email) = &apos;user@drkhospital.com&apos;<br />
                    ON CONFLICT (id) DO UPDATE SET is_active = true, role = &apos;super_admin&apos;;
                  </code>
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(
                        "INSERT INTO public.admin_users (id, email, full_name, role, is_active)\nSELECT id, email, 'Super Admin', 'super_admin', true\nFROM auth.users WHERE lower(email) = 'user@drkhospital.com'\nON CONFLICT (id) DO UPDATE SET is_active = true, role = 'super_admin';"
                      )
                    }
                    className="absolute top-2.5 right-2.5 rounded-md bg-white/10 hover:bg-white/20 p-1.5 text-white transition cursor-pointer"
                    title="Copy SQL Command"
                  >
                    {copiedSQL ? (
                      <Check size={13} className="text-emerald-400" />
                    ) : (
                      <Copy size={13} />
                    )}
                  </button>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#DCE8F0] flex items-center justify-between text-[11px] text-[#8896AB]">
                <span>No .env.local edits or server restarts required.</span>
                <a
                  href="https://supabase.com/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-[#087FBA] hover:underline"
                >
                  <span>Supabase</span>
                  <ExternalLink size={11} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
