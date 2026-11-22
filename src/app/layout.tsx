import type { Metadata, Viewport } from "next";
import "./globals.css";
import WebsiteShell from "@/components/layout/WebsiteShell";
import { HOSPITAL_INFO } from "@/lib/hospital-info";

export const viewport: Viewport = {
  themeColor: "#071B68",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://drkhospital.com"),
  alternates: {
    canonical: "/",
  },
  title: {
    default: "DRK Hospital | Rooted in Care – Dental, Skin & Hair Care in Chennai",
    template: "%s | DRK Hospital",
  },
  description:
    "DRK Hospital in Chennai is committed to clinical excellence across Dental Care, Skin Care, and Hair Care. Rooted in care with compassionate, clinical expertise.",
  keywords: [
    "DRK Hospital",
    "Rooted in Care",
    "Dental Care Chennai",
    "Skin Care Chennai",
    "Hair Care Chennai",
    "Dermatology Clinic Chennai",
    "Trichology Chennai",
    "Hospital in Chennai",
  ],
  authors: [{ name: "DRK Hospital" }],
  creator: "DRK Hospital",
  publisher: "DRK Hospital",
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
    url: "https://drkhospital.com",
    siteName: "DRK Hospital",
    title: "DRK Hospital | Rooted in Care – Dental, Skin & Hair Care",
    description:
      "DRK Hospital delivers compassionate, clinical care across Dental, Skin, and Hair disciplines in Chennai, Tamil Nadu.",
    images: [
      {
        url: "/images/drk-logo.png",
        width: 1200,
        height: 400,
        alt: "DRK Hospital – Rooted in Care",
      },
    ],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Hospital",
  name: HOSPITAL_INFO.name,
  alternateName: "DRK Hospital Chennai",
  url: "https://drkhospital.com",
  logo: "https://drkhospital.com/images/drk-logo.png",
  image: "https://drkhospital.com/images/hero-clinic.jpg",
  slogan: HOSPITAL_INFO.tagline,
  description: HOSPITAL_INFO.description,
  address: {
    "@type": "PostalAddress",
    streetAddress: HOSPITAL_INFO.address,
    addressLocality: HOSPITAL_INFO.city,
    addressRegion: HOSPITAL_INFO.state,
    addressCountry: "IN",
  },
  telephone: HOSPITAL_INFO.phone.primary,
  priceRange: "$$",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: HOSPITAL_INFO.phone.primary,
    contactType: "customer service",
    areaServed: "IN",
    availableLanguage: ["English", "Tamil"],
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      opens: "08:00",
      closes: "20:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Sunday",
      opens: "09:00",
      closes: "13:00",
    },
  ],
  medicalSpecialty: [
    "Dentistry",
    "Dermatology",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
        <WebsiteShell>{children}</WebsiteShell>
      </body>
    </html>
  );
}
