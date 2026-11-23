import { Metadata } from "next";
import ContactClient from "@/components/contact/ContactClient";
import { HOSPITAL_INFO } from "@/lib/hospital-info";

export const metadata: Metadata = {
  title: "Contact Us | DRK Hospitals Tiruttani – Rooted in Care",
  description:
    "Contact DRK Hospitals in Tiruttani, Tamil Nadu. Access hospital address, verified helpline phone numbers, WhatsApp consultation link, operating hours, and Google Maps directions.",
  alternates: {
    canonical: "https://drkhospitals.com/contact",
  },
  openGraph: {
    title: "Contact DRK Hospitals | Tiruttani, Tamil Nadu",
    description:
      "Get in touch with DRK Hospitals for dental, skin, and hair care services in Tiruttani. Telephone helplines, WhatsApp chat, location map, and visiting hours.",
    url: "https://drkhospitals.com/contact",
    images: [
      {
        url: "/images/drk-logo.png",
        width: 1200,
        height: 400,
        alt: "DRK Hospitals Tiruttani – Rooted in Care",
      },
    ],
  },
};

const contactJsonLd = {
  "@context": "https://schema.org",
  "@type": "Hospital",
  name: HOSPITAL_INFO.name,
  alternateName: [
    "DRK Hospital",
    "DRK Hospitals Tiruttani",
    "டிஆர்கே மருத்துவமனை திருத்தணி",
  ],
  url: "https://drkhospitals.com/contact",
  email: HOSPITAL_INFO.email.enquiry,
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

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />
      <ContactClient />
    </>
  );
}
