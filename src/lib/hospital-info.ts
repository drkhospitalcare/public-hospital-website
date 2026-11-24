/**
 * DRK Hospital Information & Configuration
 * 
 * Centralized configuration for all hospital contact details, hours,
 * and service metadata. Update these values when official verification is provided.
 */

export const HOSPITAL_INFO = {
  name: "DRK Hospitals",
  legalName: "DRK Dental Skin & Hair Hospital Private Limited",
  companyName: "DRK Dental Skin & Hair Hospital Private Limited",
  alternateNames: [
    "DRK Hospital",
    "DRK Hospitals Tiruttani",
    "டிஆர்கே மருத்துவமனை திருத்தணி",
  ],
  tagline: "ROOTED IN CARE",
  description:
    "DRK Hospitals in Tiruttani, Tamil Nadu, provides dental, skin and hair healthcare services. Explore our specialties, hospital facilities and contact information.",
  
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
    latitude: 13.1756454,
    longitude: 79.6116292,
  },
  geo: {
    latitude: 13.1756454,
    longitude: 79.6116292,
  },
  // Confirmed Google Maps Place link
  maps: {
    shareUrl: "https://www.google.com/maps/place/DRK+Dental+Skin+%26+Hair+Hospital+Private+Limited/@13.1756454,79.6090543,17z/data=!4m15!1m8!3m7!1s0x3a52a5e4f77fe909:0x7676cee213d6cd5d!2sDRK+Dental+Skin+%26+Hair+Hospital+Private+Limited!8m2!3d13.1756454!4d79.6116292!10e1!16s%2Fg%2F11p31pytyq!3m5!1s0x3a52a5e4f77fe909:0x7676cee213d6cd5d!8m2!3d13.1756454!4d79.6116292!16s%2Fg%2F11p31pytyq",
    embedUrl: "https://www.google.com/maps?q=13.1756454%2C79.6116292&z=17&output=embed",
  },
  
  // Working Hours (Authoritative hospital operating schedule)
  workingHours: {
    weekdays: "Mon – Sat: 9:00 AM – 9:00 PM",
    sunday: "Sunday: 9:00 AM – 9:00 PM (Consultation)",
    displayShort: "Mon – Sat: 9:00 AM – 9:00 PM",
    full: "Monday to Saturday: 9:00 AM – 9:00 PM | Sunday: 9:00 AM – 9:00 PM",
  },
  
  // Contact Phone Numbers (Verified hospital helpline)
  phone: {
    primary: "+91 6380517153",
    primaryRaw: "+916380517153",
    secondary: "+91 6380517153",
    secondaryRaw: "+916380517153",
    label: "Hospital Helpline",
  },
  
  // WhatsApp Contact (Verified hospital contact number)
  whatsapp: {
    number: "+91 6380517153",
    raw: "916380517153",
    message: "Hello DRK Hospitals, I would like to enquire about consultation in Tiruttani.",
    url: "https://wa.me/916380517153?text=Hello%20DRK%20Hospitals%2C%20I%20would%20like%20to%20enquire%20about%20consultation%20in%20Tiruttani.",
  },
  
  // Email
  email: {
    enquiry: "drkhospitalcare@gmail.com",
    contact: "drkhospitalcare@gmail.com",
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

