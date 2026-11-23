import { SingleServiceCard } from "@/types/cms";

export interface SpecialtyCategoryMeta {
  id: "dental-care" | "skin-care" | "hair-care";
  name: string;
  departmentHeading: string;
  tagline: string;
  description: string;
  heroEyebrow: string;
  heroHeading: string;
  heroDescription: string;
  departmentImage: string;
  departmentImageAlt: string;
  accentColor: string;
  badges: string[];
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
}

export const SPECIALTY_CATEGORIES: Record<
  "dental-care" | "skin-care" | "hair-care",
  SpecialtyCategoryMeta
> = {
  "dental-care": {
    id: "dental-care",
    name: "Dental Care",
    departmentHeading: "Department of Dental Sciences",
    tagline: "Comprehensive Oral Health & Advanced Clinical Dentistry",
    description:
      "From routine preventive cleanings to advanced root canal treatments, implant surgery, and aesthetic smile contouring, our dental team provides gentle, sterile, and precision dental care in Tiruttani.",
    heroEyebrow: "Department of Dental Sciences",
    heroHeading: "Dental Hospital in Tiruttani | Comprehensive Dental Care",
    heroDescription:
      "Welcome to the Department of Dental Sciences at DRK Hospitals in Tiruttani. We provide evidence-based, compassionate oral healthcare across preventive dentistry, gentle root canal therapies, clear aligners, and tooth restoration in a sterile, patient-centred clinical setting.",
    departmentImage: "/images/dental-care.jpg",
    departmentImageAlt: "DRK Hospital Dental Care Operatory in Tiruttani",
    accentColor: "#087FBA",
    badges: [
      "Hospital-Grade Autoclave Sterilization",
      "Digital Intraoral Radiography",
      "Gentle Pain-Management Focus",
    ],
    seoTitle: "Dental Hospital in Tiruttani | DRK Hospitals – Dental Care",
    seoDescription:
      "Looking for a dental hospital in Tiruttani? DRK Hospitals provides comprehensive dental care, root canal treatment, clear aligners, and tooth restoration in Tiruttani.",
    canonicalUrl: "https://drkhospitals.com/services/dental-care",
  },
  "skin-care": {
    id: "skin-care",
    name: "Skin Care",
    departmentHeading: "Department of Dermatology & Skin Health",
    tagline: "Clinical Dermatology & Aesthetic Skin Health",
    description:
      "Evidence-based dermatological care, pimple and acne management, laser procedures, and clinical therapies administered in a sterile, patient-centered hospital setting in Tiruttani.",
    heroEyebrow: "Department of Dermatology & Skin Health",
    heroHeading: "Skin Hospital & Dermatology Clinic in Tiruttani | DRK Hospitals",
    heroDescription:
      "Consult experienced dermatologists at DRK Hospitals in Tiruttani. We deliver clinical dermatology, acne therapies, pigmentary care, hydrafacials, and medical laser treatments adhering to strict hospital clinical standards.",
    departmentImage: "/images/skin-care.jpg",
    departmentImageAlt: "DRK Hospital Dermatology Clinic in Tiruttani",
    accentColor: "#10C6C1",
    badges: [
      "Hypoallergenic Clinical Standards",
      "Targeted Dermatological Diagnostics",
      "Evidence-Backed Formulations",
    ],
    seoTitle: "Skin Hospital & Dermatology Clinic in Tiruttani | DRK Hospitals",
    seoDescription:
      "Consult experienced dermatologists at DRK Hospitals in Tiruttani. Evidence-based skin care, acne therapy, pigmentation care, and clinical dermatology in Tiruttani.",
    canonicalUrl: "https://drkhospitals.com/services/skin-care",
  },
  "hair-care": {
    id: "hair-care",
    name: "Hair Care",
    departmentHeading: "Department of Trichology & Scalp Sciences",
    tagline: "Trichology, Scalp Health & Hair Restoration",
    description:
      "Comprehensive scalp diagnostics, hair loss management, therapeutic PRP/GFC treatments, and trichology focused on follicular health and scalp nourishment in Tiruttani.",
    heroEyebrow: "Department of Trichology & Scalp Sciences",
    heroHeading: "Hair Treatment & Trichology Clinic in Tiruttani | DRK Hospitals",
    heroDescription:
      "Targeted hair treatment and scalp diagnostics in Tiruttani at DRK Hospitals. Advanced trichology evaluations, hair loss therapies, PRP/GFC treatments, and scalp wellness care in Tiruttani.",
    departmentImage: "/images/hair-care.jpg",
    departmentImageAlt: "DRK Hospital Trichology & Scalp Diagnostics in Tiruttani",
    accentColor: "#071B68",
    badges: [
      "Microscopic Trichoscopic Diagnostics",
      "Evidence-Based Growth Regimens",
      "Scalp Detoxification Protocols",
    ],
    seoTitle: "Hair Treatment & Trichology Clinic in Tiruttani | DRK Hospitals",
    seoDescription:
      "Targeted hair treatment and scalp diagnostics in Tiruttani at DRK Hospitals. Advanced trichology evaluations, hair loss therapies, and scalp wellness care in Tiruttani.",
    canonicalUrl: "https://drkhospitals.com/services/hair-care",
  },
};

// ============================================================================
// OFFICIAL SERVICE CATALOGUE (36 SERVICES)
// Sourced directly from official hospital signboard photographs
// ============================================================================

export const OFFICIAL_DENTAL_SERVICES: SingleServiceCard[] = [
  {
    id: "dent-01",
    title: "Root Canal Treatment",
    slug: "root-canal-treatment",
    specialtyId: "dental-care",
    desc: "Precision endodontic therapy to remove infected pulp tissue, relieve toothache, disinfect internal root canals, and preserve your natural tooth structure.",
    detailedDescription:
      "At DRK Hospitals in Tiruttani, root canal treatment is performed under strict sterile protocols using digital apex locators and rotary instrumentation to ensure complete canal disinfection and comfortable, pain-free preservation of natural teeth.",
    is_published: true,
    display_order: 1,
    seoTitle: "Root Canal Treatment in Tiruttani | DRK Hospitals Dental Care",
    metaDescription:
      "Relieve tooth pain and save your natural tooth with gentle root canal treatment at DRK Hospitals in Tiruttani. Modern endodontic care under sterile clinical protocols.",
    canonicalUrl: "https://drkhospitals.com/services/dental-care/root-canal-treatment",
  },
  {
    id: "dent-02",
    title: "Fixed Teeth Replacement",
    slug: "fixed-teeth-replacement",
    specialtyId: "dental-care",
    desc: "Crown and bridge restorations engineered from high-strength ceramic and zirconia to replace missing or damaged teeth with permanent stability and natural chewing function.",
    detailedDescription:
      "Fixed teeth replacement at DRK Hospitals restores normal masticatory function and oral aesthetics using durable ceramic bridges and crowns custom-milled for seamless bite alignment and long-term durability.",
    is_published: true,
    display_order: 2,
    seoTitle: "Fixed Teeth Replacement in Tiruttani | Dental Crown & Bridge | DRK Hospitals",
    metaDescription:
      "Restore missing teeth permanently with zirconia crowns and bridges at DRK Hospitals in Tiruttani. Experienced dental prosthetics and natural aesthetics.",
    canonicalUrl: "https://drkhospitals.com/services/dental-care/fixed-teeth-replacement",
  },
  {
    id: "dent-03",
    title: "Implant Surgery",
    slug: "implant-surgery",
    specialtyId: "dental-care",
    desc: "Biocompatible titanium dental implants placed into the jawbone to serve as stable artificial roots for lifelong tooth replacement without affecting adjacent teeth.",
    detailedDescription:
      "Modern dental implantology performed in hospital-grade operatory suites at Tiruttani, offering single tooth, multiple teeth, or full-arch replacement with high osseointegration success rates and natural bite stability.",
    is_published: true,
    display_order: 3,
    seoTitle: "Dental Implant Surgery in Tiruttani | Permanent Tooth Replacement | DRK Hospitals",
    metaDescription:
      "Replace lost teeth permanently with titanium dental implant surgery at DRK Hospitals in Tiruttani. Sterile operatory suites and precision implantology.",
    canonicalUrl: "https://drkhospitals.com/services/dental-care/implant-surgery",
  },
  {
    id: "dent-04",
    title: "Orthodontic Braces",
    slug: "orthodontic-braces",
    specialtyId: "dental-care",
    desc: "Metal, ceramic, and self-ligating orthodontic bracket systems to correct teeth crowding, spacing, forward placement, and bite malocclusion for children and adults.",
    detailedDescription:
      "Comprehensive orthodontic alignment correcting crossbites, overbites, and aesthetic irregularities to establish balanced facial symmetry, comfortable chewing mechanics, and lifelong dental health.",
    is_published: true,
    display_order: 4,
    seoTitle: "Orthodontic Braces in Tiruttani | Teeth Alignment & Clip Treatment | DRK Hospitals",
    metaDescription:
      "Correct crooked teeth and bite irregularities with modern orthodontic braces at DRK Hospitals in Tiruttani. Metal, ceramic, and clear aligner consultations available.",
    canonicalUrl: "https://drkhospitals.com/services/dental-care/orthodontic-braces",
  },
  {
    id: "dent-05",
    title: "Disimpaction Surgery",
    slug: "disimpaction-surgery",
    specialtyId: "dental-care",
    desc: "Minor oral surgical procedure for the safe removal of impacted third molars (wisdom teeth) causing pain, pressure, cyst formation, or recurrent gum infections.",
    detailedDescription:
      "Careful surgical extraction of deep or angular impacted wisdom teeth under local anesthesia, with minimal tissue trauma, sterile instrumentation, and rapid post-operative recovery protocols.",
    is_published: true,
    display_order: 5,
    seoTitle: "Disimpaction Surgery in Tiruttani | Wisdom Tooth Removal | DRK Hospitals",
    metaDescription:
      "Safe, pain-managed wisdom tooth disimpaction surgery at DRK Hospitals in Tiruttani. Expert oral surgical extractions with hospital sterile protocols.",
    canonicalUrl: "https://drkhospitals.com/services/dental-care/disimpaction-surgery",
  },
  {
    id: "dent-06",
    title: "Laser Dental Treatment",
    slug: "laser-dental-treatment",
    specialtyId: "dental-care",
    desc: "Minimally invasive soft-tissue dental laser procedures for pain-free gum reshaping, frenectomy, deep bacterial decontamination, and accelerated tissue healing.",
    detailedDescription:
      "Advanced diode laser technology enabling bloodless surgical incisions, reduced swelling, accelerated wound healing, and minimal patient discomfort in both periodontal and aesthetic dental procedures.",
    is_published: true,
    display_order: 6,
    seoTitle: "Laser Dental Treatment in Tiruttani | Minimally Invasive Dentistry | DRK Hospitals",
    metaDescription:
      "Experience pain-free soft tissue dental laser procedures at DRK Hospitals in Tiruttani. Gentle gum contouring, frenectomy, and deep microbial decontamination.",
    canonicalUrl: "https://drkhospitals.com/services/dental-care/laser-dental-treatment",
  },
  {
    id: "dent-07",
    title: "Gum Surgery",
    slug: "gum-surgery",
    specialtyId: "dental-care",
    desc: "Periodontal flap surgery, pocket reduction, and regenerative gum therapies to treat advanced periodontitis, stop bleeding, and restore healthy tooth support.",
    detailedDescription:
      "Targeted surgical periodontal interventions to arrest alveolar bone loss, eliminate deep microbial deposits beneath the gum line, and regenerate firm, healthy gum architecture.",
    is_published: true,
    display_order: 7,
    seoTitle: "Gum Surgery & Periodontal Care in Tiruttani | Pyorrhea Treatment | DRK Hospitals",
    metaDescription:
      "Treat bleeding gums, loose teeth, and advanced periodontitis with specialist gum surgery at DRK Hospitals in Tiruttani. Restore healthy periodontal foundations.",
    canonicalUrl: "https://drkhospitals.com/services/dental-care/gum-surgery",
  },
  {
    id: "dent-08",
    title: "Tooth Colour Filling",
    slug: "tooth-colour-filling",
    specialtyId: "dental-care",
    desc: "Direct tooth-shaded composite resin fillings that invisibly restore dental cavities, minor chipping, and surface enamel wear with natural aesthetics.",
    detailedDescription:
      "Aesthetic biomimetic restorations bonded with high-grade dental composites that mimic natural enamel translucency, provide strong adhesion, and resist future recurrent decay.",
    is_published: true,
    display_order: 8,
    seoTitle: "Tooth Colour Filling in Tiruttani | Composite Laser Fillings | DRK Hospitals",
    metaDescription:
      "Restore dental decay and chipped teeth with natural tooth-coloured composite fillings at DRK Hospitals in Tiruttani. Durable, invisible oral restorations.",
    canonicalUrl: "https://drkhospitals.com/services/dental-care/tooth-colour-filling",
  },
  {
    id: "dent-09",
    title: "Surgical Tooth Removal",
    slug: "surgical-tooth-removal",
    specialtyId: "dental-care",
    desc: "Atraumatic extraction of severely broken-down, decayed, or non-restorable teeth with socket bone preservation for future prosthetic rehabilitation.",
    detailedDescription:
      "Planned atraumatic dental extractions preserving socket walls and alveolar ridge dimensions for optimal healing and comfortable subsequent prosthetic or implant replacement.",
    is_published: true,
    display_order: 9,
    seoTitle: "Surgical Tooth Removal in Tiruttani | Atraumatic Extractions | DRK Hospitals",
    metaDescription:
      "Safe, pain-free surgical tooth extractions performed with socket preservation at DRK Hospitals in Tiruttani. Experienced dental surgical team.",
    canonicalUrl: "https://drkhospitals.com/services/dental-care/surgical-tooth-removal",
  },
  {
    id: "dent-10",
    title: "Cosmetic Dental Surgery",
    slug: "cosmetic-dental-surgery",
    specialtyId: "dental-care",
    desc: "Aesthetic smile makeovers including porcelain laminates, composite veneers, gap closures, and gingival contouring to craft confident smiles.",
    detailedDescription:
      "Comprehensive cosmetic dental design combining micro-abrasion, aesthetic veneers, diastema correction, and contouring to enhance overall facial aesthetics and patient confidence.",
    is_published: true,
    display_order: 10,
    seoTitle: "Cosmetic Dental Surgery in Tiruttani | Smile Designing & Veneers | DRK Hospitals",
    metaDescription:
      "Transform your smile with cosmetic dental surgery and aesthetic veneers at DRK Hospitals in Tiruttani. Personalized smile makeovers with clinical excellence.",
    canonicalUrl: "https://drkhospitals.com/services/dental-care/cosmetic-dental-surgery",
  },
  {
    id: "dent-11",
    title: "Oral & Maxillofacial Surgery",
    slug: "oral-and-maxillofacial-surgery",
    specialtyId: "dental-care",
    desc: "Specialized surgical management of facial trauma, jaw bone cysts, severe odontogenic infections, and benign oral lesions in hospital-grade facilities.",
    detailedDescription:
      "Hospital-grade oral and maxillofacial clinical interventions addressing complex jaw pathology, soft-tissue oral lesions, facial trauma stabilization, and corrective jaw procedures in Tiruttani.",
    is_published: true,
    display_order: 11,
    seoTitle: "Oral & Maxillofacial Surgery in Tiruttani | Jaw & Facial Surgery | DRK Hospitals",
    metaDescription:
      "Comprehensive oral and maxillofacial surgical consultations and care at DRK Hospitals in Tiruttani. Management of jaw cysts, facial trauma, and oral surgical conditions.",
    canonicalUrl: "https://drkhospitals.com/services/dental-care/oral-and-maxillofacial-surgery",
  },
  {
    id: "dent-12",
    title: "Oral Cancer Diagnosis",
    slug: "oral-cancer-diagnosis",
    specialtyId: "dental-care",
    desc: "Early detection screening, clinical tissue examination, and biopsy diagnostics for non-healing oral ulcers, white/red patches, and premalignant mucosal conditions.",
    detailedDescription:
      "Vital early diagnostic evaluations for erythroplakia, leukoplakia, oral submucous fibrosis (OSMF), and persistent non-healing ulcers to enable timely clinical intervention and specialist referrals.",
    is_published: true,
    display_order: 12,
    seoTitle: "Oral Cancer Diagnosis & Screening in Tiruttani | Biopsy & Early Detection | DRK Hospitals",
    metaDescription:
      "Expert oral cancer screening and biopsy diagnostics in Tiruttani at DRK Hospitals. Early evaluation of non-healing mouth ulcers and precancerous lesions.",
    canonicalUrl: "https://drkhospitals.com/services/dental-care/oral-cancer-diagnosis",
  },
  {
    id: "dent-13",
    title: "Other Latest Dental Treatments",
    slug: "other-latest-dental-treatments",
    specialtyId: "dental-care",
    desc: "Contemporary preventive, restorative, and pediatric dental solutions incorporating modern clinical advancements for comprehensive family oral health.",
    detailedDescription:
      "Continuous adoption of modern dental modalities, pediatric pit-and-fissure sealants, fluoridation, sports mouthguards, bruxism nightguards, and customized full-mouth oral care plans in Tiruttani.",
    is_published: true,
    display_order: 13,
    seoTitle: "Advanced Dental Care in Tiruttani | Latest Modern Dental Procedures | DRK Hospitals",
    metaDescription:
      "Explore modern dental procedures and preventive family oral healthcare at DRK Hospitals in Tiruttani. Gentle, patient-focused dental treatments.",
    canonicalUrl: "https://drkhospitals.com/services/dental-care/other-latest-dental-treatments",
  },
];

export const OFFICIAL_SKIN_SERVICES: SingleServiceCard[] = [
  {
    id: "skin-01",
    title: "Carbon Peel Laser Treatment",
    slug: "carbon-peel-laser-treatment",
    specialtyId: "skin-care",
    desc: "Q-switched laser procedure using liquid carbon to gently exfoliate dead epidermis, refine enlarged pores, and reduce cutaneous oiliness.",
    detailedDescription:
      "Medical carbon peel laser treatment delivers gentle acoustic photo-exfoliation to cleanse congested sebum, refine epidermal texture, and restore skin radiance with no downtime.",
    is_published: true,
    display_order: 1,
    seoTitle: "Carbon Peel Laser Treatment in Tiruttani | Hollywood Laser Peel | DRK Hospitals",
    metaDescription:
      "Cleanse pores and revitalize skin texture with medical carbon peel laser treatment at DRK Hospitals in Tiruttani. Safe, gentle dermatological care.",
    canonicalUrl: "https://drkhospitals.com/services/skin-care/carbon-peel-laser-treatment",
  },
  {
    id: "skin-02",
    title: "Pimple & Acne Treatment",
    slug: "pimple-and-acne-treatment",
    specialtyId: "skin-care",
    desc: "Clinical dermatology protocols targeting active comedones, inflammatory papules, cystic lesions, and post-acne redness with customized medical regimens.",
    detailedDescription:
      "Comprehensive dermatological acne management combining medical topicals, oral therapeutics, and comedone extraction tailored to individual skin barrier types to prevent scarring and clear breakouts.",
    is_published: true,
    display_order: 2,
    seoTitle: "Pimple & Acne Treatment in Tiruttani | Dermatologist Acne Care | DRK Hospitals",
    metaDescription:
      "Consult dermatologists for effective pimple and acne treatment at DRK Hospitals in Tiruttani. Clinical therapies tailored to clear breakouts and prevent scars.",
    canonicalUrl: "https://drkhospitals.com/services/skin-care/pimple-and-acne-treatment",
  },
  {
    id: "skin-03",
    title: "Skin Whitening",
    slug: "skin-whitening",
    specialtyId: "skin-care",
    desc: "Evidence-based dermatological de-pigmentation therapies to address uneven complexion, sun tanning, and localized hypermelanosis safely.",
    detailedDescription:
      "Clinically monitored skin tone evening regimens utilizing medical de-pigmenting agents, exfoliation protocols, and strict photoprotection guidance designed for safe, dermatologically sound results.",
    is_published: true,
    display_order: 3,
    seoTitle: "Skin Brightening & Tone Evening in Tiruttani | Clinical De-Pigmentation | DRK Hospitals",
    metaDescription:
      "Safe, evidence-based skin brightening and de-pigmentation therapies at DRK Hospitals in Tiruttani. Medically supervised treatments for sun tanning and uneven tone.",
    canonicalUrl: "https://drkhospitals.com/services/skin-care/skin-whitening",
  },
  {
    id: "skin-04",
    title: "Microneedling",
    slug: "microneedling",
    specialtyId: "skin-care",
    desc: "Precision micro-puncture therapy stimulating natural collagen and elastin synthesis to soften acne scars and improve overall skin texture.",
    detailedDescription:
      "Automated dermatological microneedling creating controlled micro-channels to remodel fibrous scar tissue, tighten pores, and enhance transdermal serum absorption under sterile clinical standards.",
    is_published: true,
    display_order: 4,
    seoTitle: "Microneedling Treatment in Tiruttani | Collagen Induction Therapy | DRK Hospitals",
    metaDescription:
      "Improve acne scars and skin texture with clinical microneedling at DRK Hospitals in Tiruttani. Sterile dermatological procedure for natural collagen induction.",
    canonicalUrl: "https://drkhospitals.com/services/skin-care/microneedling",
  },
  {
    id: "skin-05",
    title: "Tattoo Removal",
    slug: "tattoo-removal",
    specialtyId: "skin-care",
    desc: "Q-switched laser treatment to safely fragment decorative tattoo ink particles for natural lymphatic elimination without damaging surrounding skin.",
    detailedDescription:
      "Targeted laser tattoo lightening delivering high-peak nanosecond pulses that break down pigment particles across progressive clinical sessions while protecting epidermal integrity.",
    is_published: true,
    display_order: 5,
    seoTitle: "Laser Tattoo Removal in Tiruttani | Safe Q-Switched Laser | DRK Hospitals",
    metaDescription:
      "Fade and remove unwanted tattoos safely with medical Q-switched laser treatment at DRK Hospitals in Tiruttani. Physician-guided tattoo removal sessions.",
    canonicalUrl: "https://drkhospitals.com/services/skin-care/tattoo-removal",
  },
  {
    id: "skin-06",
    title: "Laser Permanent Hair Removal",
    slug: "laser-permanent-hair-removal",
    specialtyId: "skin-care",
    desc: "Medical-grade diode laser hair reduction targeting follicular melanin to achieve long-term reduction of unwanted facial and body hair comfortably.",
    detailedDescription:
      "Safe, cooling-assisted laser epilation delivering targeted photothermal energy into active hair follicles for progressive, lasting hair reduction across diverse Indian skin types.",
    is_published: true,
    display_order: 6,
    seoTitle: "Laser Hair Removal in Tiruttani | Permanent Hair Reduction | DRK Hospitals",
    metaDescription:
      "Achieve smooth, hair-free skin with advanced diode laser hair removal at DRK Hospitals in Tiruttani. Safe, cooling-assisted treatments for face and body.",
    canonicalUrl: "https://drkhospitals.com/services/skin-care/laser-permanent-hair-removal",
  },
  {
    id: "skin-07",
    title: "IV Glutathione",
    slug: "iv-glutathione",
    specialtyId: "skin-care",
    desc: "Intravenous antioxidant wellness therapy administered under clinical supervision to support cellular detoxification, metabolic health, and skin radiance.",
    detailedDescription:
      "Doctor-administered antioxidant infusion providing high-bioavailability glutathione to neutralize systemic oxidative stress, support hepatic detoxification, and enhance overall skin luminosity after medical suitability screening.",
    is_published: true,
    display_order: 7,
    seoTitle: "IV Glutathione Therapy in Tiruttani | Clinical Antioxidant Infusion | DRK Hospitals",
    metaDescription:
      "Consult dermatologists for medically monitored IV glutathione antioxidant therapy at DRK Hospitals in Tiruttani. Professional clinical administration.",
    canonicalUrl: "https://drkhospitals.com/services/skin-care/iv-glutathione",
  },
  {
    id: "skin-08",
    title: "Melasma Treatment",
    slug: "melasma-treatment",
    specialtyId: "skin-care",
    desc: "Targeted clinical management for stubborn facial hyperpigmentation, hormonal melasma patches, and ultraviolet-induced dark spots.",
    detailedDescription:
      "Multimodal dermatological care for dermal and epidermal melasma combining gentle clinical peels, topical tyrosinase inhibitors, oral antioxidants, and strict broad-spectrum photoprotection.",
    is_published: true,
    display_order: 8,
    seoTitle: "Melasma Treatment in Tiruttani | Dark Spot & Pigmentation Care | DRK Hospitals",
    metaDescription:
      "Clear stubborn facial pigmentation and hormonal melasma with dermatologist care at DRK Hospitals in Tiruttani. Targeted, evidence-based treatment plans.",
    canonicalUrl: "https://drkhospitals.com/services/skin-care/melasma-treatment",
  },
  {
    id: "skin-09",
    title: "Skin Tag Removal",
    slug: "skin-tag-removal",
    specialtyId: "skin-care",
    desc: "Safe, quick outpatient removal of skin tags, benign acrochordons, and cherry angiomas using precision radiofrequency or electrocautery.",
    detailedDescription:
      "Precise minor dermatological removal of benign skin tags and cutaneous lesions under topical anesthesia with minimal downtime, minimal discomfort, and scarless healing.",
    is_published: true,
    display_order: 9,
    seoTitle: "Skin Tag Removal in Tiruttani | Radiofrequency Excision | DRK Hospitals",
    metaDescription:
      "Quick, painless removal of skin tags, warts, and benign lesions by experienced dermatologists at DRK Hospitals in Tiruttani. Safe minor outpatient procedures.",
    canonicalUrl: "https://drkhospitals.com/services/skin-care/skin-tag-removal",
  },
  {
    id: "skin-10",
    title: "HydraFacial",
    slug: "hydrafacial",
    specialtyId: "skin-care",
    desc: "Multi-step medical vortex cleansing, painless salicylic extraction, and intense peptide hydration for refreshed, glowing skin vitality.",
    detailedDescription:
      "Non-invasive hydra-dermabrasion combining gentle vortex extraction, chemical exfoliation, and antioxidant serum infusion for immediate skin clarity, hydration, and pore refinement.",
    is_published: true,
    display_order: 10,
    seoTitle: "HydraFacial Treatment in Tiruttani | Medical Deep Cleansing Facial | DRK Hospitals",
    metaDescription:
      "Experience medical-grade HydraFacial vortex cleansing and deep hydration at DRK Hospitals in Tiruttani. Instant glow and pore refinement with zero downtime.",
    canonicalUrl: "https://drkhospitals.com/services/skin-care/hydrafacial",
  },
  {
    id: "skin-11",
    title: "Botox",
    slug: "botox",
    specialtyId: "skin-care",
    desc: "Purified botulinum neurotoxin injections to soften dynamic facial wrinkles, forehead lines, and crow's feet, and to manage hyperhidrosis.",
    detailedDescription:
      "Physician-administered aesthetic injections targeting hyperactive facial mimetic muscles to soften expression lines while preserving natural facial mobility and balance.",
    is_published: true,
    display_order: 11,
    seoTitle: "Botox Injections in Tiruttani | Anti-Wrinkle Treatment | DRK Hospitals",
    metaDescription:
      "Consult certified medical professionals for botulinum toxin treatments at DRK Hospitals in Tiruttani. Soften dynamic lines with natural-looking clinical results.",
    canonicalUrl: "https://drkhospitals.com/services/skin-care/botox",
  },
  {
    id: "skin-12",
    title: "Dermal Fillers",
    slug: "dermal-fillers",
    specialtyId: "skin-care",
    desc: "Hyaluronic acid dermal filler injections to restore youthful facial volume, soften nasolabial folds, and enhance subtle lip contours.",
    detailedDescription:
      "Precise biocompatible hyaluronic acid gel placement restoring mid-face structural volume, contouring cheekbones, and smoothing deep facial folds with immediate natural results.",
    is_published: true,
    display_order: 12,
    seoTitle: "Dermal Fillers in Tiruttani | Hyaluronic Acid Facial Contouring | DRK Hospitals",
    metaDescription:
      "Restore youthful facial volume and soften deep lines with dermal filler procedures at DRK Hospitals in Tiruttani. Expert physician-led aesthetic care.",
    canonicalUrl: "https://drkhospitals.com/services/skin-care/dermal-fillers",
  },
  {
    id: "skin-13",
    title: "Chemical Peel",
    slug: "chemical-peel",
    specialtyId: "skin-care",
    desc: "Controlled superficial and medium-depth acid peels (glycolic, salicylic, lactic, TCA) to accelerate epidermal renewal and clarify skin texture.",
    detailedDescription:
      "Dermatological acid formulations applied in clinical concentrations to loosen dull epidermal strata, diminish fine lines, regulate sebum production, and fade acne blemishes.",
    is_published: true,
    display_order: 13,
    seoTitle: "Chemical Peel Treatment in Tiruttani | Glycolic & Salicylic Peels | DRK Hospitals",
    metaDescription:
      "Rejuvenate your skin with medical chemical peels at DRK Hospitals in Tiruttani. Customized clinical peels for acne, pigmentation, and fine lines.",
    canonicalUrl: "https://drkhospitals.com/services/skin-care/chemical-peel",
  },
  {
    id: "skin-14",
    title: "Itching & Allergy Care",
    slug: "itching-and-allergy-care",
    specialtyId: "skin-care",
    desc: "Diagnostic evaluation and therapeutic relief for acute and chronic skin pruritus, urticaria, contact dermatitis, and allergic skin flare-ups.",
    detailedDescription:
      "Systematic allergen identification, barrier soothing formulations, and systemic antihistaminic care for chronic eczema, hives, and hypersensitive reactive skin conditions in Tiruttani.",
    is_published: true,
    display_order: 14,
    seoTitle: "Itching & Allergy Care in Tiruttani | Dermatology Allergy Treatment | DRK Hospitals",
    metaDescription:
      "Get prompt clinical relief from skin itching, hives, and allergies at DRK Hospitals in Tiruttani. Compassionate dermatological diagnostic care.",
    canonicalUrl: "https://drkhospitals.com/services/skin-care/itching-and-allergy-care",
  },
  {
    id: "skin-15",
    title: "Scabies Care",
    slug: "scabies-care",
    specialtyId: "skin-care",
    desc: "Clinical diagnosis and targeted antiparasitic permethrin protocols to eradicate Sarcoptes scabiei mites and relieve severe nocturnal itching.",
    detailedDescription:
      "Rapid clinical confirmation and family-contact treatment regimens delivering decisive mite eradication, secondary bacterial infection control, and skin soothing for scabies infestations.",
    is_published: true,
    display_order: 15,
    seoTitle: "Scabies Treatment in Tiruttani | Parasitic Skin Infection Care | DRK Hospitals",
    metaDescription:
      "Confidential and decisive scabies treatment at DRK Hospitals in Tiruttani. Complete mite eradication protocols and soothing skin relief for families.",
    canonicalUrl: "https://drkhospitals.com/services/skin-care/scabies-care",
  },
  {
    id: "skin-16",
    title: "Psoriasis Care",
    slug: "psoriasis-care",
    specialtyId: "skin-care",
    desc: "Long-term clinical management of plaque psoriasis, scalp scaling, and inflammatory skin plaques using evidence-backed medical regimens.",
    detailedDescription:
      "Comprehensive dermatological monitoring utilizing topical corticosteroids, vitamin D analogues, keratolytic agents, and systemic therapies to achieve lasting symptom control for chronic psoriasis.",
    is_published: true,
    display_order: 16,
    seoTitle: "Psoriasis Treatment in Tiruttani | Chronic Skin Plaque Management | DRK Hospitals",
    metaDescription:
      "Manage chronic psoriasis plaques and scalp scaling with evidence-based dermatological care at DRK Hospitals in Tiruttani. Patient-centred treatment regimens.",
    canonicalUrl: "https://drkhospitals.com/services/skin-care/psoriasis-care",
  },
];

export const OFFICIAL_HAIR_SERVICES: SingleServiceCard[] = [
  {
    id: "hair-01",
    title: "PRP Treatment",
    slug: "prp-treatment",
    specialtyId: "hair-care",
    desc: "Autologous Platelet-Rich Plasma therapy utilizing concentrated patient growth factors to revitalize weakened hair roots and stimulate density.",
    detailedDescription:
      "Clinical PRP procedure extracting and concentrating autologous platelets rich in VEGF and PDGF, micro-injected into the scalp to stimulate follicular vitality, reduce shedding, and promote thicker hair shafts.",
    is_published: true,
    display_order: 1,
    seoTitle: "PRP Hair Treatment in Tiruttani | Platelet-Rich Plasma Therapy | DRK Hospitals",
    metaDescription:
      "Revitalize thinning hair with autologous PRP hair treatment at DRK Hospitals in Tiruttani. Physician-guided platelet-rich plasma therapy for natural hair restoration.",
    canonicalUrl: "https://drkhospitals.com/services/hair-care/prp-treatment",
  },
  {
    id: "hair-02",
    title: "GFC Treatment",
    slug: "gfc-treatment",
    specialtyId: "hair-care",
    desc: "Advanced Growth Factor Concentrate therapy delivering high-purity, cell-free activated growth factors for targeted hair follicle revitalization.",
    detailedDescription:
      "Next-generation autologous therapy where activated growth factors are harvested from blood platelets in an acellular concentrate, ensuring minimal discomfort and maximum regenerative signaling for follicular regrowth.",
    is_published: true,
    display_order: 2,
    seoTitle: "GFC Hair Treatment in Tiruttani | Growth Factor Concentrate | DRK Hospitals",
    metaDescription:
      "Experience advanced GFC (Growth Factor Concentrate) hair therapy at DRK Hospitals in Tiruttani. High-purity regenerative treatment for stubborn hair loss.",
    canonicalUrl: "https://drkhospitals.com/services/hair-care/gfc-treatment",
  },
  {
    id: "hair-03",
    title: "Tricho Analysis",
    slug: "tricho-analysis",
    specialtyId: "hair-care",
    desc: "High-magnification digital trichoscopy assessing scalp health, hair shaft diameter diversity, follicular unit density, and sebum balance.",
    detailedDescription:
      "Diagnostic micro-camera analysis providing detailed imaging of scalp microvasculature, follicular ostia, and hair density to accurately diagnose the root cause of thinning before formulating treatment roadmaps.",
    is_published: true,
    display_order: 3,
    seoTitle: "Tricho Analysis in Tiruttani | Digital Scalp Diagnostics | DRK Hospitals",
    metaDescription:
      "Accurately diagnose the root cause of hair fall with digital Tricho Analysis at DRK Hospitals in Tiruttani. High-magnification scalp and follicular assessments.",
    canonicalUrl: "https://drkhospitals.com/services/hair-care/tricho-analysis",
  },
  {
    id: "hair-04",
    title: "Hair Regrowth Treatment",
    slug: "hair-regrowth-treatment",
    specialtyId: "hair-care",
    desc: "Medical management combining topical and oral pharmacological agents to arrest androgenetic miniaturization and support natural hair density.",
    detailedDescription:
      "Evidence-based medical trichology protocols formulated with approved therapeutic agents, peptide solutions, and scalp nourishment therapies under physician guidance to restore natural density.",
    is_published: true,
    display_order: 4,
    seoTitle: "Hair Regrowth Treatment in Tiruttani | Medical Hair Fall Control | DRK Hospitals",
    metaDescription:
      "Control excessive hair fall and stimulate regrowth with medical trichology treatments at DRK Hospitals in Tiruttani. Individualized clinical hair therapy plans.",
    canonicalUrl: "https://drkhospitals.com/services/hair-care/hair-regrowth-treatment",
  },
  {
    id: "hair-05",
    title: "Dandruff Treatment",
    slug: "dandruff-treatment",
    specialtyId: "hair-care",
    desc: "Clinical antifungal and anti-inflammatory therapies targeting Malassezia yeast overgrowth, scalp scaling, and persistent itching.",
    detailedDescription:
      "Therapeutic dermatological solutions for seborrheic dermatitis, flaky scalp, and erythema using clinical-strength ketoconazole, salicylic washes, and soothing anti-inflammatory serums.",
    is_published: true,
    display_order: 5,
    seoTitle: "Dandruff Treatment in Tiruttani | Scalp Flaking & Seborrhea Care | DRK Hospitals",
    metaDescription:
      "Eliminate stubborn dandruff, scalp flaking, and itching with dermatologist-guided therapies at DRK Hospitals in Tiruttani. Long-term scalp health solutions.",
    canonicalUrl: "https://drkhospitals.com/services/hair-care/dandruff-treatment",
  },
  {
    id: "hair-06",
    title: "Hair & Scalp Treatments",
    slug: "hair-and-scalp-treatments",
    specialtyId: "hair-care",
    desc: "Therapeutic deep scalp detoxification, barrier conditioning, and micro-nutrient infusions for fragile, brittle, and dry hair strands.",
    detailedDescription:
      "In-clinic scalp cleansing, circulation massage, and customized nutrient treatments that restore the scalp microbiome and protect hair shafts from environmental and heat damage.",
    is_published: true,
    display_order: 6,
    seoTitle: "Hair & Scalp Treatments in Tiruttani | Deep Scalp Therapy | DRK Hospitals",
    metaDescription:
      "Restore fragile hair and irritated scalps with deep therapeutic treatments at DRK Hospitals in Tiruttani. Nourishing clinical therapies for healthy roots.",
    canonicalUrl: "https://drkhospitals.com/services/hair-care/hair-and-scalp-treatments",
  },
  {
    id: "hair-07",
    title: "Laser Hair Treatments",
    slug: "laser-hair-treatments",
    specialtyId: "hair-care",
    desc: "Low-Level Light Therapy (LLLT) emitting therapeutic red wavelengths to enhance cellular ATP production and follicular microcirculation.",
    detailedDescription:
      "Photobiomodulation utilizing medical diode laser bands to energize cellular metabolism in hair roots, extending the anagen (growth) phase and reducing shedding comfortably.",
    is_published: true,
    display_order: 7,
    seoTitle: "Laser Hair Therapy (LLLT) in Tiruttani | Low-Level Light Therapy | DRK Hospitals",
    metaDescription:
      "Stimulate hair roots and cellular circulation with low-level laser hair therapy at DRK Hospitals in Tiruttani. Pain-free photobiomodulation treatment.",
    canonicalUrl: "https://drkhospitals.com/services/hair-care/laser-hair-treatments",
  },
];

// Combine all 36 services into a single authoritative catalogue
export const ALL_OFFICIAL_SERVICES: SingleServiceCard[] = [
  ...OFFICIAL_DENTAL_SERVICES,
  ...OFFICIAL_SKIN_SERVICES,
  ...OFFICIAL_HAIR_SERVICES,
];

// Helper to look up a treatment by slug
export function getTreatmentBySlug(category: string, slug: string): SingleServiceCard | undefined {
  return ALL_OFFICIAL_SERVICES.find(
    (s) => s.specialtyId === category && s.slug === slug
  );
}
