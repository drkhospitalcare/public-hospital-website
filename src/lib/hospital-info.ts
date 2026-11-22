/**
 * DRK Hospital Information & Configuration
 * 
 * Centralized configuration for all hospital contact details, hours,
 * and service metadata. Update these values when official verification is provided.
 */

export const HOSPITAL_INFO = {
  name: "DRK Hospital",
  tagline: "ROOTED IN CARE",
  description:
    "A premier healthcare center dedicated to clinical excellence across Dental Care, Skin Care, and Hair Care.",
  
  // Location & Address (Chennai, Tamil Nadu)
  city: "Chennai",
  state: "Tamil Nadu",
  country: "India",
  address: "DRK Hospital, Anna Salai / Central Medical Enclave, Chennai, Tamil Nadu 600002",
  addressShort: "Chennai, Tamil Nadu",
  
  // Working Hours (Configurable)
  workingHours: {
    weekdays: "Mon – Sat: 8:00 AM – 8:00 PM",
    sunday: "Sunday: 9:00 AM – 1:00 PM (Consultation)",
    displayShort: "Mon – Sat: 8:00 AM – 8:00 PM",
    full: "Monday to Saturday: 8:00 AM – 8:00 PM | Sunday: 9:00 AM – 1:00 PM",
  },
  
  // Contact Phone Numbers (Configurable placeholders)
  phone: {
    primary: "+91 44 2345 6789",
    primaryRaw: "+914423456789",
    secondary: "+91 98765 43210",
    secondaryRaw: "+919876543210",
    label: "Hospital Helpline",
  },
  
  // WhatsApp Contact (Configurable)
  whatsapp: {
    number: "+91 98765 43210",
    raw: "919876543210",
    message: "Hello DRK Hospital, I would like to enquire about your services.",
    url: "https://wa.me/919876543210?text=Hello%20DRK%20Hospital%2C%20I%20would%20like%20to%20enquire%20about%20your%20services.",
  },
  
  // Email
  email: {
    enquiry: "enquiries@drkhospitals.com",
    contact: "contact@drkhospitals.com",
  },
  
  // Specialties
  specialties: [
    {
      id: "dental-care",
      name: "Dental Care",
      tagline: "Comprehensive Oral Health & Advanced Dentistry",
      shortDesc:
        "Advanced preventive, restorative, cosmetic dentistry, orthodontics, and smile rejuvenation.",
      href: "/services#dental-care",
      image: "/images/dental-care.jpg",
    },
    {
      id: "skin-care",
      name: "Skin Care",
      tagline: "Clinical Dermatology & Aesthetic Skin Health",
      shortDesc:
        "Evidence-based dermatological care, acne management, skin revitalization, and clinical procedures.",
      href: "/services#skin-care",
      image: "/images/skin-care.jpg",
    },
    {
      id: "hair-care",
      name: "Hair Care",
      tagline: "Trichology, Scalp Health & Hair Restoration",
      shortDesc:
        "Comprehensive scalp diagnostics, hair loss management, therapeutic treatments, and trichology.",
      href: "/services#hair-care",
      image: "/images/hair-care.jpg",
    },
  ],
};

