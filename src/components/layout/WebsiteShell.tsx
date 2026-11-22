"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function WebsiteShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    // For admin portal routes, do not render public website header or footer
    return <div className="min-h-screen bg-[#F8FDFF] flex flex-col">{children}</div>;
  }

  // Public website layout
  return (
    <>
      <Header />
      <main className="flex-1 bg-white">{children}</main>
      <Footer />
    </>
  );
}

