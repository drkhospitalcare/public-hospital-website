/**
 * DRK Hospital CMS Default Approved Content
 * 
 * Provides verified fallback content for every website section.
 * Preserves existing brand identity, typography, imagery, and clinical standards.
 */

import {
  HomepageHeroContent,
  HomepageSpecialtiesContent,
  HomepageAboutContent,
  HomepageWhyDRKContent,
  HomepageFacilitiesContent,
  HomepageJourneyContent,
  HomepageCTAContent,
  AboutHeroContent,
  AboutStoryContent,
  VisionMissionContent,
  AboutPhilosophyContent,
  AboutCoreValuesContent,
  AboutClinicalStandardsContent,
  AboutFacilitiesContent,
  ServicesHeroContent,
  SpecialtyServicesContent,
  ServicesApproachContent,
  ContactInfoContent,
  LocationMapsContent,
  SocialMediaContent,
  SEOMetadataContent,
  FooterSettingsContent,
} from "@/types/cms";
import { HOSPITAL_INFO } from "@/lib/hospital-info";

export const DEFAULT_HOMEPAGE_HERO: HomepageHeroContent = {
  eyebrow: "Rooted in Care • DRK Hospitals Tiruttani",
  heading: "Complete Care for Your Smile, Skin and Hair",
  headingHighlight: "Smile, Skin",
  subtitle: "Clinical Discipline & Patient Well-Being",
  description:
    "Welcome to DRK Hospitals in Tiruttani, where patient well-being meets clinical discipline. We provide comprehensive dental, dermatological, and hair care services in a pristine, patient-first healthcare environment serving Tiruttani, Arakkonam, Pallipattu, Sholinghur, and nearby regions.",
  primaryBtnText: "Explore Services",
  primaryBtnHref: "/services",
  secondaryBtnText: "Contact Us",
  secondaryBtnHref: "/contact",
  clinicImage: "/images/hero-clinic.jpg",
  clinicImageAlt: "DRK Hospitals Clinical Facilities in Tiruttani",
  badgeTitle: "Certified Standards",
  badgeSubtitle: "Sterilized & Safe Clinical Care",
  timingBadge: "Mon – Sat: 8:00 AM – 8:00 PM",
};

export const DEFAULT_HOMEPAGE_SPECIALTIES: HomepageSpecialtiesContent = {
  eyebrow: "Our Core Clinical Specialties",
  heading: "Specialized Care Across Three Key Areas",
  description:
    "Dedicated clinical disciplines delivered with medical precision, hygienic protocols, and individual patient care.",
  items: [
    {
      id: "dental-care",
      title: "Dental Care",
      tagline: "Oral Health & Advanced Dentistry",
      desc: "From preventive hygiene and corrective orthodontics to restorative therapies, smile designing, and root canal care in a gentle, sterile environment.",
      image: "/images/dental-care.jpg",
      imageAlt: "DRK Hospital Dental Care Operatory",
      features: ["Preventive Dentistry", "Orthodontics & Aligners", "Cosmetic Dentistry"],
      buttonText: "Explore Dental Care",
      buttonHref: "/services#dental-care",
    },
    {
      id: "skin-care",
      title: "Skin Care",
      tagline: "Clinical Dermatology & Skin Health",
      desc: "Comprehensive diagnostic and therapeutic solutions for acne, pigmentation, eczema, skin rejuvenation, and medical aesthetic consultations.",
      image: "/images/skin-care.jpg",
      imageAlt: "DRK Hospital Dermatology Consultation",
      features: ["Clinical Consultations", "Acne & Scar Therapies", "Skin Rejuvenation"],
      buttonText: "Explore Skin Care",
      buttonHref: "/services#skin-care",
    },
    {
      id: "hair-care",
      title: "Hair Care",
      tagline: "Trichology & Scalp Management",
      desc: "Specialized trichological evaluations, evidence-based hair thinning treatments, therapeutic scalp treatments, and restoration support.",
      image: "/images/hair-care.jpg",
      imageAlt: "DRK Hospital Trichology & Scalp Diagnostics",
      features: ["Trichology Evaluation", "Scalp Health Protocols", "Hair Thinning Support"],
      buttonText: "Explore Hair Care",
      buttonHref: "/services#hair-care",
    },
  ],
};

export const DEFAULT_HOMEPAGE_ABOUT: HomepageAboutContent = {
  eyebrow: "About DRK Hospitals",
  heading: "Rooted in Care, Focused on People",
  paragraphs: [
    "DRK Hospitals was founded on a simple clinical belief: healthcare should be compassionate, transparent, and grounded in uncompromising medical discipline.",
    "Our hospital brings together specialized dental, dermatological, and trichological care under one roof in Tiruttani. Every consultation room, sterilisation protocol, and patient interaction reflects our core philosophy: Rooted in Care.",
  ],
  image: "/images/hospital-building.jpg",
  imageAlt: "DRK Hospitals Tiruttani Facility Building",
  buttonText: "Learn More About Us",
  buttonHref: "/about",
  highlights: [
    "Hospital-grade sterilization & disinfection cycles",
    "Specialized focus across Dental, Skin, and Hair disciplines",
    "Transparent doctor-patient consultations with unhurried care",
  ],
};

export const DEFAULT_HOMEPAGE_WHY_DRK: HomepageWhyDRKContent = {
  eyebrow: "Why DRK",
  heading: "Healthcare Grounded in Integrity & Patient Safety",
  description:
    "We believe patient care is an ethical responsibility. Here is how our clinical philosophy guides your treatment journey.",
  advantages: [
    {
      id: "why-1",
      title: "Patient-Focused Care",
      desc: "Every consultation is centered around the patient's individual comfort, transparent communication, and compassionate guidance.",
      icon: "HeartHandshake",
    },
    {
      id: "why-2",
      title: "Hygiene & Safety",
      desc: "Strict clinical disinfection cycles, medical-grade sterilization, and meticulous infection control protocols across all departments.",
      icon: "ShieldCheck",
    },
    {
      id: "why-3",
      title: "Clinical Expertise",
      desc: "Dedicated clinical practitioners bringing thorough diagnostic discipline to dental, dermatological, and trichological care.",
      icon: "Stethoscope",
    },
    {
      id: "why-4",
      title: "Modern Facilities",
      desc: "Contemporary consultation rooms, modern dental chairs, and specialized dermatological treatment suites designed for patient ease.",
      icon: "Building2",
    },
  ],
};

export const DEFAULT_HOMEPAGE_FACILITIES: HomepageFacilitiesContent = {
  eyebrow: "Inside DRK Hospital",
  heading: "Pristine Healthcare Environments Built for Precision & Comfort",
  description:
    "Take a tour of our clinical spaces designed for hygiene, advanced diagnosis, and relaxed patient care in Tiruttani.",
  buttonText: "Explore Full Hospital Gallery",
  buttonHref: "/gallery",
  items: [
    {
      id: "fac-1",
      title: "Sterilization & Infection Control",
      category: "Hospital Infrastructure",
      desc: "Multi-stage autoclave sterilization protocols and clean processing ensuring absolute patient safety.",
      image: "/images/infrastructure-sterilization.jpg",
      imageAlt: "Sterilization Unit at DRK Hospital",
    },
    {
      id: "fac-2",
      title: "Precision Dental Suites",
      category: "Dental Care",
      desc: "Equipped with modern dental treatment chairs, digital intraoral imaging, and ergonomic patient support.",
      image: "/images/hero-clinic.jpg",
      imageAlt: "Modern Dental Operatory at DRK Hospital",
    },
    {
      id: "fac-3",
      title: "Dermatology & Skin Suite",
      category: "Skin Care",
      desc: "Private consultation and procedural rooms maintaining strict aseptic conditions for clinical skin health.",
      image: "/images/skin-care.jpg",
      imageAlt: "Dermatology Consultation Suite",
    },
    {
      id: "fac-4",
      title: "Patient Lounge & Reception",
      category: "Hospital Infrastructure",
      desc: "A calm, comfortable environment welcoming patients with warm assistance and seamless care coordination.",
      image: "/images/hospital-building.jpg",
      imageAlt: "DRK Hospital Patient Reception",
    },
  ],
};

export const DEFAULT_HOMEPAGE_JOURNEY: HomepageJourneyContent = {
  eyebrow: "Patient Care Journey",
  heading: "A Structured, Transparent Care Experience",
  description:
    "From your first consultation to post-treatment recovery, our clinical pathway is built on empathy, precision, and clarity.",
  steps: [
    {
      id: "step-1",
      stepNumber: "01",
      title: "Clinical Consultation",
      desc: "A thorough, unhurried assessment with our specialists to understand your symptoms, lifestyle, and health goals.",
      icon: "FileText",
    },
    {
      id: "step-2",
      stepNumber: "02",
      title: "Diagnostic Evaluation",
      desc: "Targeted digital diagnostics, imaging, or trichological checks to accurately determine the root cause.",
      icon: "Search",
    },
    {
      id: "step-3",
      stepNumber: "03",
      title: "Personalized Treatment Plan",
      desc: "Clear explanation of therapeutic options, procedural expectations, timelines, and transparent guidance.",
      icon: "CheckCircle2",
    },
    {
      id: "step-4",
      stepNumber: "04",
      title: "Care & Follow-Up",
      desc: "Gentle procedural execution followed by proactive recovery checks and continued long-term health advice.",
      icon: "HeartHandshake",
    },
  ],
};

export const DEFAULT_HOMEPAGE_CTA: HomepageCTAContent = {
  eyebrow: "Get in Touch",
  heading: "Visit or Contact DRK Hospital",
  description:
    "Our clinical reception and patient coordination team in Tiruttani are available to assist you with inquiries, department directions, and consultation hours.",
  primaryBtnText: "Call Hospital Helpline",
  primaryBtnHref: `tel:${HOSPITAL_INFO.phone.primaryRaw}`,
  secondaryBtnText: "WhatsApp Us",
  secondaryBtnHref: HOSPITAL_INFO.whatsapp.url,
  backgroundImage: "/images/hero-clinic.jpg",
};

export const DEFAULT_ABOUT_HERO: AboutHeroContent = {
  eyebrow: "About DRK Hospitals",
  heading: "Rooted in Care, Guided by Medical Discipline",
  subtitle: "Tiruttani's Dedicated Center for Dental, Skin & Hair Health",
  description:
    "Welcome to DRK Hospitals. We are a specialized healthcare center in Tiruttani established with a singular focus: delivering ethical, clinical excellence with deep human empathy serving Tiruttani, Arakkonam, Pallipattu, and surrounding communities.",
  image: "/images/hospital-building.jpg",
  imageAlt: "DRK Hospitals Tiruttani Facility Building",
};

export const DEFAULT_ABOUT_STORY: AboutStoryContent = {
  sectionTitle: "Our Healthcare Story",
  eyebrow: "How We Began",
  paragraphs: [
    "DRK Hospitals was founded with a clear, enduring conviction: patient care must be genuine, uncompromised, and clinically disciplined.",
    "Recognizing the deep connection between oral health, dermatological wellness, and hair vitality, we created a specialized medical destination in Tiruttani that unites all three under disciplined clinical leadership.",
    "Over the years, DRK Hospitals has earned patient trust across Tiruttani and surrounding regional towns through transparent dialogue, sterile clinical suites, and honest healthcare advice.",
  ],
  image: "/images/hero-clinic.jpg",
  imageAlt: "DRK Hospitals Clinical Facilities",
  stats: [
    { label: "Core Specialties", value: "3" },
    { label: "Sterile Clinical Suites", value: "100%" },
    { label: "Patient-First Approach", value: "Always" },
  ],
};

export const DEFAULT_VISION_MISSION: VisionMissionContent = {
  visionHeading: "Our Vision",
  visionText:
    "To be Tiruttani and the surrounding region's most trusted specialty hospital for dental, dermatological, and hair healthcare, recognized for uncompromising clinical integrity, state-of-the-art hygiene, and compassionate patient relationships.",
  missionHeading: "Our Mission",
  missionText:
    "To deliver meticulous, evidence-based treatments in a pristine clinical setting, ensuring every patient receives individualized diagnostic attention, gentle care, and clear medical guidance.",
};

export const DEFAULT_ABOUT_PHILOSOPHY: AboutPhilosophyContent = {
  eyebrow: "Our Approach",
  heading: "Healthcare Grounded in Three Clinical Pillars",
  description:
    "Our approach to healthcare is not transactional. It is rooted in clinical discipline, thorough investigation, and patient dignity.",
  points: [
    {
      id: "ph-1",
      title: "Diagnostic Discipline",
      desc: "We never rush. Every diagnosis is based on comprehensive evaluation, digital imaging, and patient symptom history.",
      icon: "Search",
    },
    {
      id: "ph-2",
      title: "Uncompromising Hygiene",
      desc: "Medical-grade sterilization, multi-stage autoclave cycles, and strict single-use disposables are standard across every suite.",
      icon: "ShieldCheck",
    },
    {
      id: "ph-3",
      title: "Compassionate Communication",
      desc: "We explain every procedure clearly, listen attentively, and respect our patients' comfort and peace of mind.",
      icon: "HeartHandshake",
    },
  ],
};

export const DEFAULT_ABOUT_VALUES: AboutCoreValuesContent = {
  eyebrow: "Our Principles",
  heading: "Core Values That Define DRK Hospital",
  description:
    "These values guide every physician, nurse, and care coordinator across all departments at DRK Hospital.",
  values: [
    {
      id: "val-1",
      title: "Clinical Integrity",
      desc: "Recommending only medically necessary treatments with complete transparency and honesty.",
      icon: "CheckCircle2",
    },
    {
      id: "val-2",
      title: "Patient Safety First",
      desc: "Stringent infection control, safety checks, and pristine operational cleanliness at all times.",
      icon: "ShieldCheck",
    },
    {
      id: "val-3",
      title: "Empathetic Listening",
      desc: "Understanding patient anxiety and providing unhurried, reassuring support from consultation to recovery.",
      icon: "HeartHandshake",
    },
    {
      id: "val-4",
      title: "Continuous Excellence",
      desc: "Constantly upgrading instrumentation, techniques, and staff training to match modern clinical standards.",
      icon: "Sparkles",
    },
  ],
};

export const DEFAULT_ABOUT_CLINICAL_STANDARDS: AboutClinicalStandardsContent = {
  eyebrow: "Safety & Protocol",
  heading: "Rigorous Clinical & Sterilization Standards",
  description:
    "Infection control is at the heart of everything we do. Our patients can trust our sterile treatment environment.",
  image: "/images/infrastructure-sterilization.jpg",
  imageAlt: "Sterilization Protocols at DRK Hospital",
  standards: [
    {
      id: "std-1",
      title: "Multi-Stage Autoclave Sterilization",
      desc: "All reusable dental and medical instruments undergo rigorous ultrasonic cleaning followed by hospital-grade steam autoclaving.",
    },
    {
      id: "std-2",
      title: "Sealed Pouches & Chemical Indicators",
      desc: "Instruments are sealed in medical pouches with chemical indicator strips verifying complete sterile processing.",
    },
    {
      id: "std-3",
      title: "Surface Disinfection Between Patients",
      desc: "Treatment chairs, operational surfaces, and clinical touchpoints are disinfected with medical virucidal wipes after every patient.",
    },
    {
      id: "std-4",
      title: "Air Filtration & Pure Clinical Water",
      desc: "Clean treatment room airflow systems and closed-circuit distilled water supplies for all dental and procedural units.",
    },
  ],
};

export const DEFAULT_ABOUT_FACILITIES: AboutFacilitiesContent = {
  eyebrow: "Infrastructure",
  heading: "Modern Clinical Spaces Built for Healing",
  description:
    "Explore the physical environment of DRK Hospitals in Tiruttani, tailored for clinical excellence, hygienic safety, and patient ease.",
  items: [
    {
      id: "af-1",
      title: "Precision Dental Operatories",
      desc: "Ergonomic treatment chairs with integrated intraoral digital visualization, shadowless clinical illumination, and ultrasonic scalers.",
      image: "/images/hero-clinic.jpg",
      imageAlt: "DRK Hospitals Dental Operatory Tiruttani",
    },
    {
      id: "af-2",
      title: "Clinical Dermatology Suites",
      desc: "Private consultation spaces equipped with specialized skin diagnostic dermoscopy tools and procedural lights.",
      image: "/images/skin-care.jpg",
      imageAlt: "DRK Hospitals Dermatology Suite Tiruttani",
    },
    {
      id: "af-3",
      title: "Trichology Diagnostic Station",
      desc: "High-magnification microscopic equipment for deep scalp and follicular density assessments.",
      image: "/images/hair-care.jpg",
      imageAlt: "Trichology and Scalp Diagnostic Station Tiruttani",
    },
    {
      id: "af-4",
      title: "Hospital Sterilization Hub",
      desc: "Dedicated autoclave processing area separated from treatment rooms, following international infection control guidelines.",
      image: "/images/infrastructure-sterilization.jpg",
      imageAlt: "Hospital Sterilization Hub Tiruttani",
    },
  ],
};

export const DEFAULT_SERVICES_HERO: ServicesHeroContent = {
  eyebrow: "Clinical Disciplines",
  heading: "Specialized Healthcare Services at DRK Hospitals",
  subtitle: "Dental Care • Skin Care • Hair Care",
  description:
    "We provide focused, evidence-based treatments across oral health, dermatology, and trichology with medical precision, hygienic protocols, and individual patient care in Tiruttani.",
  image: "/images/hero-clinic.jpg",
  imageAlt: "DRK Hospitals Healthcare Services Tiruttani",
};

export const DEFAULT_SERVICES_DENTAL: SpecialtyServicesContent = {
  departmentHeading: "Dental Care",
  tagline: "Comprehensive Oral Health & Advanced Dentistry",
  description:
    "From routine preventive cleanings to advanced root canal treatments and smile contouring, our dental team provides gentle, sterile, and precision dental care.",
  departmentImage: "/images/dental-care.jpg",
  departmentImageAlt: "DRK Hospital Dental Care Operatory",
  services: [
    {
      id: "dent-1",
      title: "Preventive & Diagnostic Dentistry",
      desc: "Routine clinical evaluations, low-radiation digital imaging, plaque scaling, teeth polishing, and early cavity detection.",
      is_published: true,
      display_order: 1,
    },
    {
      id: "dent-2",
      title: "Restorative Dentistry & Root Canals",
      desc: "Precision tooth-colored composite restorations, endodontic root canal treatments, ceramic inlays, and durable dental crowns.",
      is_published: true,
      display_order: 2,
    },
    {
      id: "dent-3",
      title: "Orthodontics & Clear Aligners",
      desc: "Orthodontic consultations, fixed bracket systems, and transparent clear aligner treatment plans for gentle teeth straightening.",
      is_published: true,
      display_order: 3,
    },
    {
      id: "dent-4",
      title: "Aesthetic Smile Designing",
      desc: "Professional in-chair teeth whitening, porcelain veneers, tooth contouring, and aesthetic smile enhancements.",
      is_published: true,
      display_order: 4,
    },
    {
      id: "dent-5",
      title: "Periodontal Care & Gum Health",
      desc: "Targeted scaling, deep root planing, and therapeutic interventions to treat gingivitis and maintain firm, healthy gums.",
      is_published: true,
      display_order: 5,
    },
    {
      id: "dent-6",
      title: "Pediatric & Family Dental Care",
      desc: "Gentle dental checkups, cavity prevention sealants, and age-appropriate oral hygiene education for children and families.",
      is_published: true,
      display_order: 6,
    },
  ],
};

export const DEFAULT_SERVICES_SKIN: SpecialtyServicesContent = {
  departmentHeading: "Skin Care",
  tagline: "Clinical Dermatology & Aesthetic Skin Health",
  description:
    "Evidence-based dermatological care, acne management, skin revitalization, and clinical procedures administered in a sterile, patient-centered setting.",
  departmentImage: "/images/skin-care.jpg",
  departmentImageAlt: "DRK Hospital Dermatology Consultation",
  services: [
    {
      id: "skin-1",
      title: "Clinical Dermatology Consultations",
      desc: "Specialized evaluations for chronic and acute skin conditions, including acne, eczema, psoriasis, dermatitis, and allergic rashes.",
      is_published: true,
      display_order: 1,
    },
    {
      id: "skin-2",
      title: "Targeted Acne & Acne Scar Care",
      desc: "Individualized therapeutic protocols to control breakouts, reduce inflammation, and improve skin texture and post-acne scarring.",
      is_published: true,
      display_order: 2,
    },
    {
      id: "skin-3",
      title: "Pigmentation & Uneven Skin Tone",
      desc: "Evidence-backed management plans for melasma, sun spots, post-inflammatory hyperpigmentation, and dull complexion.",
      is_published: true,
      display_order: 3,
    },
    {
      id: "skin-4",
      title: "Medical-Grade Skin Hydration & Peels",
      desc: "Gentle exfoliating chemical formulations and intense hydration treatments performed under clinical supervision.",
      is_published: true,
      display_order: 4,
    },
    {
      id: "skin-5",
      title: "Skin Barrier Repair & Maintenance",
      desc: "Tailored regimens restoring damaged cutaneous barriers, soothing reactive sensitivity, and reinforcing natural skin resilience.",
      is_published: true,
      display_order: 5,
    },
    {
      id: "skin-6",
      title: "Preventive Dermatological Screenings",
      desc: "Thorough skin examinations, mole evaluations, and diagnostic checks promoting proactive lifelong skin wellness.",
      is_published: true,
      display_order: 6,
    },
  ],
};

export const DEFAULT_SERVICES_HAIR: SpecialtyServicesContent = {
  departmentHeading: "Hair Care",
  tagline: "Trichology, Scalp Health & Hair Restoration",
  description:
    "Comprehensive scalp diagnostics, hair loss management, therapeutic treatments, and trichology focused on follicular health and scalp nourishment.",
  departmentImage: "/images/hair-care.jpg",
  departmentImageAlt: "DRK Hospital Trichology & Scalp Diagnostics",
  services: [
    {
      id: "hair-1",
      title: "Comprehensive Trichology Evaluations",
      desc: "Microscopic follicular analysis and scalp assessments to identify the underlying triggers of thinning, shedding, or irritation.",
      is_published: true,
      display_order: 1,
    },
    {
      id: "hair-2",
      title: "Targeted Hair Loss & Thinning Management",
      desc: "Customized medical therapy plans designed to strengthen weakened roots, decrease excessive shedding, and stimulate natural density.",
      is_published: true,
      display_order: 2,
    },
    {
      id: "hair-3",
      title: "Scalp Health & Dandruff Therapies",
      desc: "Clinical management for seborrheic dermatitis, stubborn flaking, persistent itching, and imbalanced scalp microbiomes.",
      is_published: true,
      display_order: 3,
    },
    {
      id: "hair-4",
      title: "Follicular Revitalization Protocols",
      desc: "Therapeutic nutrient infusions, scalp circulation stimulation, and non-invasive restorative techniques to support active follicle growth.",
      is_published: true,
      display_order: 4,
    },
    {
      id: "hair-5",
      title: "Post-Damage Hair Rehabilitation",
      desc: "Specialized protein replenishment regimens repairing structurally compromised hair shafts from environmental stress or chemical processing.",
      is_published: true,
      display_order: 5,
    },
    {
      id: "hair-6",
      title: "Preventive Hair Maintenance Strategies",
      desc: "Holistic lifestyle, nutritional, and topical guidance providing long-term scalp support and sustainable hair wellness.",
      is_published: true,
      display_order: 6,
    },
  ],
};

export const DEFAULT_SERVICES_APPROACH: ServicesApproachContent = {
  eyebrow: "Our Methodology",
  heading: "How We Deliver Care Across All Disciplines",
  description:
    "A transparent, step-by-step clinical methodology ensuring safety, diagnostic clarity, and dependable patient outcomes.",
  steps: [
    {
      id: "sa-1",
      stepNumber: "01",
      title: "Detailed Clinical Assessment",
      desc: "Every patient journey begins with an unhurried, attentive consultation to understand symptoms, lifestyle, and medical background.",
      icon: "FileText",
    },
    {
      id: "sa-2",
      stepNumber: "02",
      title: "Accurate Diagnostic Investigation",
      desc: "We use digital diagnostic imaging, dermatoscopy, or trichoscopy to pinpoint the root cause before prescribing treatment.",
      icon: "Search",
    },
    {
      id: "sa-3",
      stepNumber: "03",
      title: "Transparent Treatment Plan",
      desc: "We explain treatment alternatives, anticipated timelines, expected outcomes, and procedural details with total transparency.",
      icon: "CheckCircle2",
    },
    {
      id: "sa-4",
      stepNumber: "04",
      title: "Hygienic Procedural Execution",
      desc: "All clinical procedures are executed in hospital-grade sterile environments utilizing strict autoclave protocols.",
      icon: "ShieldCheck",
    },
    {
      id: "sa-5",
      stepNumber: "05",
      title: "Dedicated Aftercare & Support",
      desc: "We monitor your recovery journey, answer questions, and provide guidance to maintain long-term clinical results.",
      icon: "HeartHandshake",
    },
  ],
};

export const DEFAULT_CONTACT_INFO: ContactInfoContent = {
  hospitalName: "DRK Hospitals",
  tagline: "ROOTED IN CARE",
  address: "DRK Hospitals, Tiruttani, Tiruvallur District, Tamil Nadu 631209",
  locality: "Tiruttani",
  city: "Tiruttani",
  state: "Tamil Nadu",
  country: "India",
  pincode: "631209",
  phoneNumbers: [
    {
      id: "phone-1",
      label: "Main Hospital Helpline",
      number: "+91 44 2345 6789",
      raw: "+914423456789",
      isPrimary: true,
      isActive: true,
    },
    {
      id: "phone-2",
      label: "Patient Coordination Desk",
      number: "+91 98765 43210",
      raw: "+919876543210",
      isPrimary: false,
      isActive: true,
    },
  ],
  whatsapp: {
    number: "+91 98765 43210",
    raw: "919876543210",
    defaultMessage: "Hello DRK Hospital, I would like to enquire about your services.",
    buttonText: "Chat on WhatsApp",
    isEnabled: true,
  },
  emails: [
    {
      id: "email-1",
      label: "General Enquiries",
      email: "enquiries@drkhospitals.com",
      isPrimary: true,
      isActive: true,
    },
    {
      id: "email-2",
      label: "Patient Care Desk",
      email: "contact@drkhospitals.com",
      isPrimary: false,
      isActive: true,
    },
  ],
  operatingHours: [
    { day: "Monday", isOpen: true, openTime: "08:00 AM", closeTime: "08:00 PM", note: "Full clinical services" },
    { day: "Tuesday", isOpen: true, openTime: "08:00 AM", closeTime: "08:00 PM", note: "Full clinical services" },
    { day: "Wednesday", isOpen: true, openTime: "08:00 AM", closeTime: "08:00 PM", note: "Full clinical services" },
    { day: "Thursday", isOpen: true, openTime: "08:00 AM", closeTime: "08:00 PM", note: "Full clinical services" },
    { day: "Friday", isOpen: true, openTime: "08:00 AM", closeTime: "08:00 PM", note: "Full clinical services" },
    { day: "Saturday", isOpen: true, openTime: "08:00 AM", closeTime: "08:00 PM", note: "Full clinical services" },
    { day: "Sunday", isOpen: true, openTime: "09:00 AM", closeTime: "01:00 PM", note: "Specialist consultations only" },
  ],
  visitingInfo: {
    walkInInfo: "Patients and visitors are welcome during working hours. Prior consultation enquiry is recommended to minimize wait times.",
    visitingInstructions: "Please carry any previous medical records or prescriptions for accurate clinical review. Face masks and hygiene protocols apply in procedure rooms.",
    accessibilityInfo: "Ground-floor reception assistance is available. For specific mobility or wheelchair assistance requirements, please contact our reception team ahead of your visit.",
  },
};

export const DEFAULT_LOCATION_MAPS: LocationMapsContent = {
  shareUrl: "https://maps.google.com/?q=Tiruttani+Tamil+Nadu+India",
  embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31102.57682281729!2d79.5931215!3d13.1784661!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a52bb6c8a702b8d%3A0x7d87bc7d25e8a5b2!2sTiruttani%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
  latitude: "13.1784",
  longitude: "79.6105",
  mapTitle: "DRK Hospitals Location in Tiruttani",
  mapDescription: "Centrally located in Tiruttani, Tiruvallur District with convenient road and rail access, serving patients from Tiruttani, Arakkonam, Pallipattu, Sholinghur, and Nagari.",
  directionsButtonText: "Open in Google Maps",
  isMapEnabled: true,
};

export const DEFAULT_SOCIAL_MEDIA: SocialMediaContent = {
  links: [
    {
      id: "soc-1",
      platform: "Instagram",
      label: "Instagram",
      url: "https://instagram.com/drkhospital",
      icon: "Instagram",
      isActive: true,
      displayOrder: 1,
    },
    {
      id: "soc-2",
      platform: "Facebook",
      label: "Facebook",
      url: "https://facebook.com/drkhospital",
      icon: "Facebook",
      isActive: true,
      displayOrder: 2,
    },
    {
      id: "soc-3",
      platform: "YouTube",
      label: "YouTube",
      url: "https://youtube.com/@drkhospital",
      icon: "Youtube",
      isActive: true,
      displayOrder: 3,
    },
    {
      id: "soc-4",
      platform: "LinkedIn",
      label: "LinkedIn",
      url: "https://linkedin.com/company/drkhospital",
      icon: "Linkedin",
      isActive: true,
      displayOrder: 4,
    },
  ],
};

export const DEFAULT_SEO_METADATA: SEOMetadataContent = {
  siteTitle: "DRK Hospitals Tiruttani – Dental, Skin & Hair Care | Rooted in Care",
  titleTemplate: "%s | DRK Hospitals Tiruttani",
  defaultDescription:
    "Looking for quality hospital care in Tiruttani? Discover DRK Hospitals for dental, skin and hair care services. Serving patients from Tiruttani, Arakkonam, Pallipattu, Sholinghur and nearby areas.",
  keywords: [
    "DRK Hospitals",
    "Hospital in Tiruttani",
    "Best hospital in Tiruttani",
    "Dental Hospital in Tiruttani",
    "Skin Clinic in Tiruttani",
    "Hair Clinic in Tiruttani",
    "Multispeciality hospital in Tiruttani",
    "Dentist in Tiruttani",
    "Dermatology Clinic Tiruttani",
    "Root canal treatment Tiruttani",
    "Dental implants Tiruttani",
    "Hospital near Arakkonam",
    "Hospital near Pallipattu",
    "Hospital near Sholinghur",
    "Hospital near Nagari",
    "Hospital in Tiruvallur district",
    "டிஆர்கே மருத்துவமனை திருத்தணி",
  ],
  ogImageUrl: "/images/hero-clinic.jpg",
  canonicalBase: "https://drkhospitals.com",
};

export const DEFAULT_FOOTER_SETTINGS: FooterSettingsContent = {
  enabled: true,
  logoUrl: "/images/drk-logo.png",
  logoAlt: "ROOTED IN CARE | DRK Hospital",
  caption: "DRK Hospital – Rooted in Care",

  brand: {
    logoVisible: true,
    logoUrl: "/images/drk-logo.png",
    logoAlt: "ROOTED IN CARE | DRK Hospital",
    logoWidth: 208,
    logoHeight: 52,
    logoAlignment: "left",
    logoBgColor: "#FFFFFF",
    caption: "DRK Hospital – Rooted in Care",
    tagline: "ROOTED IN CARE",
    taglineVisible: true,
    taglineColor: "#10C6C1",
    taglineSize: "sm",
    taglineWeight: "semibold",
  },

  description: {
    heading: "",
    headingVisible: false,
    mainText:
      "DRK Hospital is committed to delivering modern, compassionate, and ethical clinical care across Dental, Skin, and Hair health in Tiruttani, Tamil Nadu.",
    supportingText:
      "Serving Tiruttani, Arakkonam, Pallipattu, Sholinghur, and surrounding regional communities.",
    textAlign: "left",
    maxWidth: "sm",
    fontSize: "sm",
    textColor: "#EAF8FF",
    visible: true,
  },

  navigation: {
    heading: "Explore",
    visible: true,
    links: [
      { id: "nav-1", label: "Home", url: "/", isExternal: false, openInNewTab: false, isActive: true, order: 1 },
      { id: "nav-2", label: "About Us", url: "/about", isExternal: false, openInNewTab: false, isActive: true, order: 2 },
      { id: "nav-3", label: "Services", url: "/services", isExternal: false, openInNewTab: false, isActive: true, order: 3 },
      { id: "nav-4", label: "Hospital Gallery", url: "/gallery", isExternal: false, openInNewTab: false, isActive: true, order: 4 },
      { id: "nav-5", label: "Contact Us", url: "/contact", isExternal: false, openInNewTab: false, isActive: true, order: 5 },
    ],
  },

  specialties: {
    heading: "Our Specialties",
    visible: true,
    items: [
      {
        id: "spec-1",
        title: "Dental Care",
        description: "Advanced preventive, restorative, and smile dentistry",
        icon: "Smile",
        url: "/services#dental-care",
        order: 1,
        isActive: true,
      },
      {
        id: "spec-2",
        title: "Skin Care",
        description: "Clinical dermatology and evidence-based skin therapies",
        icon: "Sparkles",
        url: "/services#skin-care",
        order: 2,
        isActive: true,
      },
      {
        id: "spec-3",
        title: "Hair Care",
        description: "Trichology, scalp health diagnostics, and hair revitalization",
        icon: "Scissors",
        url: "/services#hair-care",
        order: 3,
        isActive: true,
      },
    ],
  },

  contact: {
    heading: "Contact & Hours",
    visible: true,
    useHospitalInfo: true,
    addressVisible: true,
    addressLine1: "DRK Hospitals",
    addressLine2: "",
    street: "",
    landmark: "",
    city: "Tiruttani",
    district: "Tiruvallur District",
    state: "Tamil Nadu",
    pincode: "631209",
    country: "India",
    googleMapsUrl: "https://maps.google.com/?q=Tiruttani+Tamil+Nadu",
    addressFormat: "single",
    phoneVisible: true,
    primaryPhone: "+91 44 2345 6789",
    primaryPhoneRaw: "+914423456789",
    secondaryPhone: "+91 98765 43210",
    secondaryPhoneRaw: "+919876543210",
    phoneLabel: "Hospital Helpline",
    clickToCall: true,
    emailVisible: true,
    officialEmail: "enquiries@drkhospitals.com",
    emailLabel: "Email Enquiries",
    mailtoToggle: true,
    whatsappVisible: true,
    whatsappNumber: "+91 98765 43210",
    whatsappRaw: "919876543210",
    whatsappButtonText: "Chat on WhatsApp",
    whatsappMessage: "Hello DRK Hospitals, I would like to enquire about consultation in Tiruttani.",
    buttons: [
      {
        id: "btn-wa",
        text: "Chat on WhatsApp",
        url: "https://wa.me/919876543210?text=Hello%20DRK%20Hospitals%2C%20I%20would%20like%20to%20enquire%20about%20consultation%20in%20Tiruttani.",
        type: "whatsapp",
        icon: "MessageCircle",
        color: "accent",
        visible: true,
        order: 1,
      },
    ],
  },

  businessHours: {
    heading: "Business Hours",
    visible: true,
    timeFormat: "12h",
    timezone: "IST (Indian Standard Time)",
    generalAdvisory: "Doctor consultation schedules are subject to availability. Contact the front desk to confirm timings.",
    holidayAdvisory: "Sunday consultations available during scheduled hours.",
    days: [
      { day: "Monday", isOpen: true, openTime: "8:00 AM", closeTime: "8:00 PM" },
      { day: "Tuesday", isOpen: true, openTime: "8:00 AM", closeTime: "8:00 PM" },
      { day: "Wednesday", isOpen: true, openTime: "8:00 AM", closeTime: "8:00 PM" },
      { day: "Thursday", isOpen: true, openTime: "8:00 AM", closeTime: "8:00 PM" },
      { day: "Friday", isOpen: true, openTime: "8:00 AM", closeTime: "8:00 PM" },
      { day: "Saturday", isOpen: true, openTime: "8:00 AM", closeTime: "8:00 PM" },
      {
        day: "Sunday",
        isOpen: true,
        openTime: "9:00 AM",
        closeTime: "1:00 PM",
        departmentNotes: "Consultation & Scheduled Follow-ups",
      },
    ],
  },

  socialLinks: {
    heading: "Follow DRK Hospital",
    supportingLabel: "Stay connected for health advisories and clinical updates.",
    visible: true,
    iconStyle: "circle",
    iconSize: "md",
    alignment: "left",
    links: [
      {
        id: "soc-1",
        platform: "Instagram",
        label: "Instagram",
        url: "https://instagram.com/drkhospitals",
        icon: "Instagram",
        openInNewTab: true,
        isActive: true,
        order: 1,
      },
      {
        id: "soc-2",
        platform: "Facebook",
        label: "Facebook",
        url: "https://facebook.com/drkhospitals",
        icon: "Facebook",
        openInNewTab: true,
        isActive: true,
        order: 2,
      },
      {
        id: "soc-3",
        platform: "YouTube",
        label: "YouTube",
        url: "https://youtube.com/@drkhospitals",
        icon: "YouTube",
        openInNewTab: true,
        isActive: true,
        order: 3,
      },
      {
        id: "soc-4",
        platform: "LinkedIn",
        label: "LinkedIn",
        url: "https://linkedin.com/company/drkhospitals",
        icon: "LinkedIn",
        openInNewTab: true,
        isActive: true,
        order: 4,
      },
    ],
  },

  trustStatements: {
    visible: true,
    alignment: "left",
    statements: [
      {
        id: "trust-1",
        text: "Patient-Centric & Ethical Healthcare",
        icon: "ShieldCheck",
        textColor: "#EAF8FF",
        iconColor: "#10C6C1",
        fontSize: "xs",
        visible: true,
      },
    ],
  },

  copyright: {
    visible: true,
    prefix: "©",
    hospitalName: "DRK Hospital",
    useDynamicYear: true,
    manualYear: "2026",
    tagline: "ROOTED IN CARE",
    suffix: "All rights reserved.",
    useCustomFullText: false,
    locationLabel: "Tiruttani, Tamil Nadu",
    locationVisible: true,
    separator: "bullet",
    links: [
      { id: "c-1", label: "About DRK", url: "/about", openInNewTab: false, visible: true, order: 1 },
      { id: "c-2", label: "Contact", url: "/contact", openInNewTab: false, visible: true, order: 2 },
    ],
  },

  appearance: {
    bgColor: "#071B68",
    bottomBarBgColor: "#05144f",
    isGradient: false,
    gradientStart: "#071B68",
    gradientEnd: "#05144f",
    headingColor: "#FFFFFF",
    bodyTextColor: "#EAF8FF",
    mutedTextColor: "#99C7FF",
    accentColor: "#10C6C1",
    linkHoverColor: "#10C6C1",
    topPadding: "py-14",
    containerMaxWidth: "container",
    showTopDivider: true,
    dividerColor: "rgba(255, 255, 255, 0.15)",
  },

  visibility: {
    showBrandColumn: true,
    showNavigationColumn: true,
    showSpecialtiesColumn: true,
    showContactColumn: true,
    showSocialIcons: true,
    showTrustStatement: true,
    showBusinessHours: true,
    showContactButtons: true,
    showCopyrightBar: true,
  },

  responsiveLayout: {
    desktopColumns: "4-2-3-3",
    mobileAlignment: "left",
    mobileStackOrder: "brand-first",
    mobileSpacing: "normal",
  },
};

