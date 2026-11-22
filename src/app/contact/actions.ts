"use server";

export interface ContactFormState {
  success: boolean;
  message: string;
  errors?: {
    fullName?: string;
    phone?: string;
    email?: string;
    department?: string;
    message?: string;
  };
}

/**
 * Server Action for secure contact and enquiry submission.
 * Validates inputs server-side, sanitizes data, checks anti-spam honeypot,
 * and handles submissions safely.
 */
export async function submitEnquiryAction(
  prevState: ContactFormState | null,
  formData: FormData
): Promise<ContactFormState> {
  // 1. Anti-spam honeypot check (hidden input field)
  const honeypot = formData.get("website_url")?.toString();
  if (honeypot && honeypot.trim() !== "") {
    // Silently reject bot submissions
    return {
      success: true,
      message: "Thank you for reaching out. We have received your submission.",
    };
  }

  // 2. Extract and sanitize inputs
  const fullName = (formData.get("fullName")?.toString() || "").trim();
  const phone = (formData.get("phone")?.toString() || "").trim();
  const email = (formData.get("email")?.toString() || "").trim();
  const department = (formData.get("department")?.toString() || "").trim();
  const message = (formData.get("message")?.toString() || "").trim();

  const errors: ContactFormState["errors"] = {};

  // 3. Server-side validation
  if (!fullName || fullName.length < 2) {
    errors.fullName = "Please enter your full name (minimum 2 characters).";
  } else if (fullName.length > 100) {
    errors.fullName = "Name cannot exceed 100 characters.";
  }

  // Phone regex: accepts optional country code, standard 10-digit Indian and international formats
  const cleanPhone = phone.replace(/[\s\-().]/g, "");
  const phoneRegex = /^\+?[0-9]{10,14}$/;
  if (!phone || !phoneRegex.test(cleanPhone)) {
    errors.phone = "Please enter a valid contact phone number (10 to 14 digits).";
  }

  // Email validation (optional field, but if entered must be valid)
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email) || email.length > 120) {
      errors.email = "Please enter a valid email address.";
    }
  }

  // Department validation
  const allowedDepartments = [
    "General Enquiry",
    "Dental Care",
    "Skin Care",
    "Hair Care",
  ];
  if (!department || !allowedDepartments.includes(department)) {
    errors.department = "Please select a valid healthcare department.";
  }

  // Message validation
  if (!message || message.length < 10) {
    errors.message = "Please provide enquiry details (minimum 10 characters).";
  } else if (message.length > 2000) {
    errors.message = "Enquiry message cannot exceed 2000 characters.";
  }

  // Return validation errors if any
  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: "Please correct the highlighted form errors.",
      errors,
    };
  }

  // In production, dispatch notification to hospital administration email / CRM
  // Note: DRK Hospital does not use appointment booking; this is strictly an informational enquiry.
  console.log(`[DRK Hospital] New Enquiry Received:`, {
    fullName,
    phone: cleanPhone,
    email: email || "Not provided",
    department,
    receivedAt: new Date().toISOString(),
  });

  return {
    success: true,
    message:
      "Thank you for contacting DRK Hospital. Your enquiry has been received. Our Chennai reception desk will contact you during operational clinic hours.",
  };
}

