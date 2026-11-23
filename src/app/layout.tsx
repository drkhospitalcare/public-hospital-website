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
    canonical: "https://drkhospitals.com/",
  },
  title: {
    default: "DRK Hospitals Tiruttani | Dental, Skin & Hair Care",
    template: "%s | DRK Hospitals",
  },
  description:
    "DRK Hospitals in Tiruttani, Tamil Nadu, provides dental, skin and hair healthcare services. Explore our specialties, hospital facilities and contact information.",
  keywords: [
    "DRK Hospitals",
    "DRK Hospital",
    "DRK Hospitals Tiruttani",
    "DRK Dental Skin & Hair Hospital Private Limited",
    "Rooted in Care",
    "Dental hospital in Tiruttani",
    "Dental Care Tiruttani",
    "Skin Care Tiruttani",
    "Hair Care Tiruttani",
    "Skin hospital in Tiruttani",
    "Hair treatment in Tiruttani",
    "Dermatology Clinic Tiruttani",
    "Trichology Tiruttani",
    "Hospital in Tiruttani",
    "Best hospital in Tiruttani",
    "Multispeciality hospital in Tiruttani",
    "Skin doctor in Tiruttani",
    "Dentist in Tiruttani",
    "Root canal treatment Tiruttani",
    "Dental implants Tiruttani",
    "Hospital near Arakkonam",
    "Hospital near Pallipattu",
    "Hospital near Sholinghur",
    "Hospital near Nagari",
    "Hospital in Tiruvallur district",
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
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
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
    title: "DRK Hospitals Tiruttani | Dental, Skin & Hair Care",
    description:
      "DRK Hospitals in Tiruttani, Tamil Nadu, provides dental, skin and hair healthcare services. Explore our specialties, hospital facilities and contact information.",
    images: [
      {
        url: "/images/drk-hospitals-official-logo.png",
        width: 1200,
        height: 630,
        alt: "DRK Hospitals Tiruttani – Rooted in Care",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DRK Hospitals Tiruttani | Dental, Skin & Hair Care",
    description:
      "DRK Hospitals in Tiruttani, Tamil Nadu, provides dental, skin and hair healthcare services. Explore our specialties, hospital facilities and contact information.",
    images: ["/images/drk-hospitals-official-logo.png"],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://drkhospitals.com/#website",
      url: "https://drkhospitals.com/",
      name: "DRK Hospitals",
      alternateName: ["DRK Hospital", "DRK Hospitals Tiruttani"],
      publisher: {
        "@id": "https://drkhospitals.com/#organization",
      },
      inLanguage: "en-IN",
    },
    {
      "@type": ["Hospital", "MedicalBusiness", "LocalBusiness", "Organization"],
      "@id": "https://drkhospitals.com/#organization",
      name: HOSPITAL_INFO.name,
      alternateName: HOSPITAL_INFO.alternateNames,
      legalName: HOSPITAL_INFO.legalName,
      url: process.env.NEXT_PUBLIC_SITE_URL || "https://drkhospitals.com",
      logo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://drkhospitals.com"}/images/drk-hospitals-official-logo.png`,
      image: `${process.env.NEXT_PUBLIC_SITE_URL || "https://drkhospitals.com"}/images/hero-clinic.jpg`,
      telephone: HOSPITAL_INFO.phone.primary,
      email: HOSPITAL_INFO.email.contact,
      slogan: HOSPITAL_INFO.tagline,
      description: HOSPITAL_INFO.description,
      address: {
        "@type": "PostalAddress",
        streetAddress: HOSPITAL_INFO.street,
        addressLocality: HOSPITAL_INFO.city,
        addressRegion: HOSPITAL_INFO.state,
        postalCode: HOSPITAL_INFO.pincode,
        addressCountry: "IN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: HOSPITAL_INFO.geo.latitude,
        longitude: HOSPITAL_INFO.geo.longitude,
      },
      hasMap: HOSPITAL_INFO.maps.shareUrl,
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
          opens: "09:00",
          closes: "21:00",
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: "Sunday",
          opens: "09:00",
          closes: "21:00",
        },
      ],
      areaServed: [
        { "@type": "City", name: "Tiruttani" },
        { "@type": "AdministrativeArea", name: "Tiruvallur District" },
        { "@type": "City", name: "Arakkonam" },
        { "@type": "City", name: "Pallipattu" },
        { "@type": "City", name: "Sholinghur" },
        { "@type": "City", name: "Nagari" },
      ],
      medicalSpecialty: [
        "Dentistry",
        "Dermatology",
      ],
      department: [
        {
          "@type": "MedicalOrganization",
          name: "Department of Dental Sciences",
          description: "Preventive dentistry, root canal treatments, clear aligners, and tooth restoration in Tiruttani.",
        },
        {
          "@type": "MedicalOrganization",
          name: "Department of Dermatology & Skin Health",
          description: "Clinical dermatology, targeted acne therapies, pigmentation care, and skin barrier repair in Tiruttani.",
        },
        {
          "@type": "MedicalOrganization",
          name: "Department of Trichology & Hair Care",
          description: "Trichology evaluations, follicular assessments, hair thinning therapies, and scalp wellness care in Tiruttani.",
        },
      ],
    },
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
