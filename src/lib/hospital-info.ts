/**
 * DRK Hospital Information & Configuration
 * 
 * Centralized configuration for all hospital contact details, hours,
 * and service metadata. Update these values when official verification is provided.
 */

export const HOSPITAL_INFO = {
  name: "DRK Hospitals",
  tagline: "ROOTED IN CARE",
  description:
    "A dedicated healthcare center in Tiruttani providing clinical care across Dental Care, Skin Care, and Hair Care.",
  
  // Confirmed Official Patient-Visit Address (Tiruttani, Tamil Nadu)
  street: "SF.No. 29/2A, Akkaia Naidu Street",
  locality: "Akkaia Naidu Street",
  city: "Tiruttani",
  district: "Tiruvallur District",
  state: "Tamil Nadu",
  country: "India",
  pincode: "631209",
  address: "SF.No. 29/2A, Akkaia Naidu Street, Tiruttani, Tiruvallur – 631209, Tamil Nadu, India",
  fullAddress: "DRK Hospitals, SF.No. 29/2A, Akkaia Naidu Street, Tiruttani, Tiruvallur – 631209, Tamil Nadu, India",
  addressShort: "Tiruttani, Tamil Nadu",
  // Building GPS coordinates
  coordinates: {
    latitude: 13.1784,
    longitude: 79.6105,
  },
  geo: {
    latitude: 13.1784,
    longitude: 79.6105,
  },
  // Confirmed Google Maps Place link
  maps: {
    shareUrl: "https://www.google.com/maps/search/?api=1&query=SF.No.+29%2F2A%2C+Akkaia+Naidu+Street%2C+Tiruttani%2C+Tiruvallur+631209%2C+Tamil+Nadu+India",
    embedUrl: "https://maps.google.com/maps?q=SF.No.+29%2F2A%2C+Akkaia+Naidu+Street%2C+Tiruttani%2C+Tiruvallur+631209%2C+Tamil+Nadu+India&t=&z=16&ie=UTF8&iwloc=&output=embed",
  },
  
  // Working Hours (Authoritative hospital operating schedule)
  workingHours: {
    weekdays: "Mon – Sat: 9:00 AM – 9:00 PM",
    sunday: "Sunday: 9:00 AM – 9:00 PM (Consultation)",
    displayShort: "Mon – Sat: 9:00 AM – 9:00 PM",
    full: "Monday to Saturday: 9:00 AM – 9:00 PM | Sunday: 9:00 AM – 9:00 PM",
  },
  
  // Contact Phone Numbers (PENDING HOSPITAL CONFIRMATION: Official hospital phone numbers; currently configured placeholders)
  phone: {
    primary: "+91 44 2345 6789",
    primaryRaw: "+914423456789",
    secondary: "+91 98765 43210",
    secondaryRaw: "+919876543210",
    label: "Hospital Helpline",
  },
  
  // WhatsApp Contact (PENDING HOSPITAL CONFIRMATION: Official WhatsApp number; currently configured placeholder)
  whatsapp: {
    number: "+91 98765 43210",
    raw: "919876543210",
    message: "Hello DRK Hospitals, I would like to enquire about consultation in Tiruttani.",
    url: "https://wa.me/919876543210?text=Hello%20DRK%20Hospitals%2C%20I%20would%20like%20to%20enquire%20about%20consultation%20in%20Tiruttani.",
  },
  
  // Email
  email: {
    enquiry: "enquiries@drkhospitals.com",
    contact: "contact@drkhospitals.com",
  },

  // Regional Service Area Coverage (Nearby regional towns)
  regionalCoverage: {
    primary: "Tiruttani",
    highPriority: ["Arakkonam", "Pallipattu", "Sholinghur", "Nagari"],
    secondary: ["Tiruvallur", "Kanchipuram", "Arcot"],
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

