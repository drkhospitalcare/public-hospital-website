"use client";

import ServiceHero from "@/components/ServiceHero";
import ServiceDetailSection from "@/components/ServiceDetailSection";
import HealthcareApproach from "@/components/HealthcareApproach";
import ContactCTA from "@/components/ContactCTA";
import { useCMSSection } from "@/lib/useCMS";
import { SpecialtyServicesContent, SingleServiceCard } from "@/types/cms";
import {
  DEFAULT_SERVICES_DENTAL,
  DEFAULT_SERVICES_SKIN,
  DEFAULT_SERVICES_HAIR,
} from "@/lib/cms-defaults";

export default function ServicesClient() {
  const dental = useCMSSection<SpecialtyServicesContent>(
    "services_dental",
    DEFAULT_SERVICES_DENTAL
  );
  const skin = useCMSSection<SpecialtyServicesContent>(
    "services_skin",
    DEFAULT_SERVICES_SKIN
  );
  const hair = useCMSSection<SpecialtyServicesContent>(
    "services_hair",
    DEFAULT_SERVICES_HAIR
  );

  const activeDentalServices = (dental.services || [])
    .filter((p: SingleServiceCard) => p.is_published !== false)
    .map((p: SingleServiceCard) => ({ title: p.title, desc: p.desc }));

  const activeSkinServices = (skin.services || [])
    .filter((p: SingleServiceCard) => p.is_published !== false)
    .map((p: SingleServiceCard) => ({ title: p.title, desc: p.desc }));

  const activeHairServices = (hair.services || [])
    .filter((p: SingleServiceCard) => p.is_published !== false)
    .map((p: SingleServiceCard) => ({ title: p.title, desc: p.desc }));

  return (
    <>
      {/* SECTION 1 – SERVICES HERO & JUMP NAVIGATION */}
      <ServiceHero />

      {/* SECTION 2 – DENTAL CARE */}
      <ServiceDetailSection
        id="dental-care"
        eyebrow="Department of Dental Sciences"
        title={dental.departmentHeading}
        description={dental.description}
        image={dental.departmentImage}
        imageAlt={dental.departmentImageAlt || "DRK Hospital Dental Care"}
        imageOnRight={true}
        accentColor="#087FBA"
        badges={[
          "Hospital-Grade Autoclave Sterilization",
          "Digital Intraoral Radiography",
          "Gentle Pain-Management Focus",
        ]}
        services={activeDentalServices}
        consultationTitle="Dental Consultation & Examination Process"
        consultationText="Initial consultations include thorough dental examination, digital intraoral imaging when needed, and a clear explanation of treatment choices with transparent pricing."
        enquiryText="Enquire about Dental Care"
        bgWhite={true}
      />

      {/* SECTION 3 – SKIN CARE */}
      <ServiceDetailSection
        id="skin-care"
        eyebrow="Department of Dermatology & Skin Health"
        title={skin.departmentHeading}
        description={skin.description}
        image={skin.departmentImage}
        imageAlt={skin.departmentImageAlt || "DRK Hospital Dermatology Clinic"}
        imageOnRight={false}
        accentColor="#10C6C1"
        badges={[
          "Hypoallergenic Clinical Standards",
          "Targeted Dermatological Diagnostics",
          "Evidence-Backed Formulations",
        ]}
        services={activeSkinServices}
        consultationTitle="Dermatology Assessment & Skin Mapping"
        consultationText="Each skin consultation includes an evaluation of your skin barrier, active symptoms, medical history, and environmental lifestyle factors to recommend personalized therapeutic regimens."
        enquiryText="Enquire about Skin Care"
        bgWhite={false}
      />

      {/* SECTION 4 – HAIR CARE */}
      <ServiceDetailSection
        id="hair-care"
        eyebrow="Department of Trichology & Scalp Sciences"
        title={hair.departmentHeading}
        description={hair.description}
        image={hair.departmentImage}
        imageAlt={hair.departmentImageAlt || "DRK Hospital Trichology & Hair Consultation"}
        imageOnRight={true}
        accentColor="#071B68"
        badges={[
          "Microscopic Trichoscopic Diagnostics",
          "Evidence-Based Growth Regimens",
          "Scalp Detoxification Protocols",
        ]}
        services={activeHairServices}
        consultationTitle="Trichoscopic Scalp & Root Assessment"
        consultationText="During your trichology consultation, high-magnification trichoscopy assesses hair density, caliber, and scalp condition to formulate a targeted treatment roadmap."
        enquiryText="Enquire about Hair Care"
        bgWhite={true}
      />

      {/* SECTION 5 – HEALTHCARE APPROACH */}
      <HealthcareApproach />

      {/* SECTION 6 – CONTACT CTA */}
      <ContactCTA
        eyebrow="Schedule Your Visit"
        title="Consult With Our Specialists in Tiruttani"
        description="Have questions regarding a dental, skin, or hair treatment? Contact DRK Hospitals today for friendly assistance and consultation guidance."
      />
    </>
  );
}
