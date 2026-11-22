import { Metadata } from "next";
import ContactClient from "@/components/contact/ContactClient";
import { HOSPITAL_INFO } from "@/lib/hospital-info";

export const metadata: Metadata = {
  title: "Contact Us | DRK Hospital Chennai – Rooted in Care",
  description:
    "Contact DRK Hospital in Chennai, Tamil Nadu. Access hospital address, verified helpline phone numbers, WhatsApp consultation link, operating hours, and Google Maps location.",
  alternates: {
    canonical: "https://drkhospital.com/contact",
  },
  openGraph: {
    title: "Contact DRK Hospital | Chennai, Tamil Nadu",
    description:
      "Get in touch with DRK Hospital for dental, skin, and hair care services. Telephone helplines, WhatsApp chat, location map, and visiting hours in Chennai.",
    url: "https://drkhospital.com/contact",
    images: [
      {
        url: "/images/drk-logo.png",
        width: 1200,
        height: 400,
        alt: "DRK Hospital Chennai – Rooted in Care",
      },
    ],
  },
};

const contactJsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  name: HOSPITAL_INFO.name,
  url: "https://drkhospital.com/contact",
  telephone: HOSPITAL_INFO.phone.primary,
  email: HOSPITAL_INFO.email.enquiry,
  address: {
    "@type": "PostalAddress",
    streetAddress: HOSPITAL_INFO.address,
    addressLocality: HOSPITAL_INFO.city,
    addressRegion: HOSPITAL_INFO.state,
    addressCountry: "IN",
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
