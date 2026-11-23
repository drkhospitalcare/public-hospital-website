import type { Metadata, Viewport } from "next";
import "./globals.css";
import WebsiteShell from "@/components/layout/WebsiteShell";
import { HOSPITAL_INFO } from "@/lib/hospital-info";
import { getAllPublishedSections } from "@/lib/cms";
import { CMSProvider } from "@/components/cms/CMSProvider";

export const revalidate = 60;

export const viewport: Viewport = {
  themeColor: "#071B68",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://drkhospitals.com"),
  alternates: {
    canonical: "/",
  },
  title: {
    default: "DRK Hospitals | Rooted in Care – Dental, Skin & Hair Care in Tiruttani",
    template: "%s | DRK Hospitals",
  },
  description:
    "DRK Hospitals in Tiruttani, Tamil Nadu is committed to clinical excellence across Dental Care, Skin Care, and Hair Care. Serving Tiruttani and surrounding regional communities including Arakkonam, Pallipattu, Sholinghur, and Nagari.",
  keywords: [
    "DRK Hospitals",
    "DRK Hospital Tiruttani",
    "Rooted in Care",
    "Dental Care Tiruttani",
    "Skin Care Tiruttani",
    "Hair Care Tiruttani",
    "Dermatology Clinic Tiruttani",
    "Trichology Tiruttani",
    "Hospital in Tiruttani",
    "Best hospital in Tiruttani",
    "Multispeciality hospital in Tiruttani",
    "Dental hospital in Tiruttani",
    "Skin doctor in Tiruttani",
    "Hospital near Arakkonam",
    "Hospital near Pallipattu",
    "Hospital near Sholinghur",
    "Hospital near Nagari",
    "டிஆர்கே மருத்துவமனை",
    "டிஆர்கே மருத்துவமனை திருத்தணி",
    "திருத்தணி பல் மருத்துவமனை",
    "திருத்தணி தோல் சிகிச்சை",
    "திருத்தணி முடி உதிர்தல் சிகிச்சை",
  ],
  authors: [{ name: "DRK Hospitals" }],
  creator: "DRK Hospitals",
  publisher: "DRK Hospitals",
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/images/drk-logo.png",
  },
  other: {
    "color-scheme": "light",
    "supported-color-schemes": "light",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://drkhospitals.com",
    siteName: "DRK Hospitals",
    title: "DRK Hospitals | Rooted in Care – Dental, Skin & Hair Care in Tiruttani",
    description:
      "DRK Hospitals delivers compassionate, clinical care across Dental, Skin, and Hair disciplines in Tiruttani, Tamil Nadu, serving patients from Arakkonam, Pallipattu, Sholinghur, Nagari, and surrounding areas.",
    images: [
      {
        url: "/images/drk-logo.png",
        width: 1200,
        height: 400,
        alt: "DRK Hospitals – Rooted in Care",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DRK Hospitals | Rooted in Care – Tiruttani",
    description:
      "Clinical excellence across Dental Care, Skin Care, and Hair Care in Tiruttani, Tamil Nadu.",
    images: ["/images/drk-logo.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Hospital",
  name: HOSPITAL_INFO.name,
  alternateName: [
    "DRK Hospital",
    "DRK Hospitals Tiruttani",
    "டிஆர்கே மருத்துவமனை திருத்தணி",
  ],
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://drkhospitals.com",
  logo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://drkhospitals.com"}/images/drk-logo.png`,
  image: `${process.env.NEXT_PUBLIC_SITE_URL || "https://drkhospitals.com"}/images/hero-clinic.jpg`,
  slogan: HOSPITAL_INFO.tagline,
  description: HOSPITAL_INFO.description,
  address: {
    "@type": "PostalAddress",
    addressLocality: HOSPITAL_INFO.city,
    addressRegion: HOSPITAL_INFO.state,
    postalCode: HOSPITAL_INFO.pincode,
    addressCountry: "IN",
  },
  areaServed: [
    { "@type": "City", name: "Tiruttani" },
    { "@type": "AdministrativeArea", name: "Tiruvallur District" },
  ],
  medicalSpecialty: [
    "Dentistry",
    "Dermatology",
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialSections = await getAllPublishedSections();

  return (
    <html lang="en" className="light" style={{ colorScheme: "light" }}>
      <head>
        <meta name="color-scheme" content="light" />
        <meta name="supported-color-schemes" content="light" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className="min-h-screen flex flex-col bg-white text-[#14234b] font-sans antialiased selection:bg-[#10c6c1]/20 selection:text-[#071b68]"
        style={{ backgroundColor: "#ffffff", color: "#14234b" }}
      >
        <CMSProvider initialSections={initialSections}>
          <WebsiteShell>{children}</WebsiteShell>
        </CMSProvider>
      </body>
    </html>
  );
}
