export type ServiceCategory =
  | 'All'
  | 'Orthodontics & Braces'
  | 'Implants & Prosthodontics'
  | 'Restorative & Endodontics'
  | 'Preventive & Aesthetic';

export type ReviewTopic =
  | 'All'
  | 'Orthodontics & Braces'
  | 'Painless Care'
  | 'Hygiene & Sterilization'
  | 'Affordability';

export type GalleryRoom =
  | 'All'
  | 'Entrance & Bohri Bazar'
  | 'Waiting Lounge'
  | 'Clinical Operatory'
  | 'Sterilization & 3D Lab';

export interface DentalService {
  id: string;
  number: string;
  category: Exclude<ServiceCategory, 'All'>;
  title: string;
  shortSummary: string;
  duration: string;
  feeRangePkr: string;
  imageUrl: string;
  imageAlt: string;
  clinicalSteps: string[];
  recommendedFor: string[];
  specialistLead: string;
}

export interface PatientReview {
  id: string;
  patientName: string;
  initials: string;
  date: string;
  rating: number;
  verifiedSource: string;
  topic: Exclude<ReviewTopic, 'All'>;
  secondaryTopic: string;
  treatmentReceived: string;
  quote: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: Exclude<GalleryRoom, 'All'>;
  caption: string;
  equipmentSpec: string;
  bayCode: string;
  imageUrl: string;
  imageAlt: string;
}

export interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export interface EducationArticle {
  id: string;
  category: string;
  title: string;
  readTime: string;
  summary: string;
  takeaways: string[];
  imageUrl: string;
}

export interface AppointmentInput {
  patientName: string;
  phone: string;
  preferredDate: string;
  timeWindow: string;
  serviceId: string;
  contactMethod: 'Phone Call' | 'WhatsApp' | 'SMS';
  notes: string;
}

export interface AppointmentRecord extends AppointmentInput {
  referenceCode: string;
  createdAt: string;
  estimatedFee: string;
  clinicAddress: string;
  clinicPhone: string;
}

export const HERO_COLLAGE_PHOTOS = {
  columnLeft: [
    {
      id: 'hc-1',
      src: '/images/hero-operatory-chair.webp',
      alt: 'Modern dental exam room with hydraulic chair, overhead light, and digital equipment at Dental House',
      label: 'Primary Operatory Suite',
    },
    {
      id: 'hc-2',
      src: '/images/hero-dentist-care.webp',
      alt: 'Dental specialist consulting comfortably with a patient in the treatment chair',
      label: 'Gentle Chairside Care',
    },
    {
      id: 'hc-3',
      src: '/images/hero-reception-smile.webp',
      alt: 'Welcoming reception desk and patient coordinator at Dental House Saddar',
      label: 'Warm Patient Welcome',
    },
  ],
  columnRight: [
    {
      id: 'hc-4',
      src: '/images/hero-corridor.webp',
      alt: 'Curved architectural clinic corridor with warm lighting and modern treatment bays',
      label: 'Modern Clinical Suites',
    },
    {
      id: 'hc-5',
      src: '/images/hero-front-desk.webp',
      alt: 'Modern front desk and comfortable air-conditioned reception area at Dental House',
      label: 'Reception & Check-In',
    },
    {
      id: 'hc-6',
      src: '/images/doctor-portrait-1.webp',
      alt: 'Principal dental specialist smiling in the clinical operatory',
      label: 'Specialist Dental Team',
    },
  ],
};

export const CLINIC_INFO = {
  name: 'Dental House',
  tagline: 'Quality Luxury Dental & Orthodontic Care in Saddar, Karachi',
  address: 'Shop #19, Daud Pota Road, Bohri Bazar, Saddar, Karachi, Pakistan',
  shortAddress: 'Shop #19, Daud Pota Road, Bohri Bazar, Saddar',
  landmark: 'Opposite Bohri Bazar Main Gate, Near Regal Chowk & Preedy Street, Saddar',
  phoneDisplay: '0344 2730018',
  phoneRaw: '03442730018',
  phoneIntl: '+923442730018',
  whatsappDisplay: '+92 344 2730018',
  coordinates: '24.8594° N, 67.0281° E',
  googleMapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Shop+19+Daud+Pota+Road+Bohri+Bazar+Saddar+Karachi',
  rating: '4.9',
  reviewCount: 164,
  timingsSummary: 'Mon–Sat: 11:00 AM – 9:00 PM',
  leadDoctor: {
    name: 'Dr. Daniyal Ahmed Khan',
    credentials: 'BDS (Dow), FCPS (Orthodontics & Dentofacial Orthopedics), C-Implantology',
    role: 'Principal Dental Surgeon & Specialist Orthodontist',
    experienceYears: '14+ Years Clinical Experience in Central Karachi',
    portraitUrl: '/images/doctor-portrait-2.webp',
    teamPhotoUrl: '/images/clinic-team.webp',
    officePhotoUrl: '/images/office-wide.webp',
    bio: 'Where advanced dentistry meets genuine warmth. Led by Dr. Daniyal Ahmed Khan at Shop #19, Daud Pota Road, Bohri Bazar, Saddar, our practice believes you deserve to understand every option before making a decision about your smile—combining digital X-rays, fixed braces, clear aligners, and titanium implants with evening hours until 9:00 PM.',
    highlights: [
      {
        title: 'Meet Our Principal Specialist',
        detail: 'Walks you through your diagnosis and explains every orthodontic, cosmetic, and implant option openly.',
      },
      {
        title: 'Spa-Like Clinical Comfort',
        detail: 'Air-conditioned, tranquil environment in Bohri Bazar with painless anesthesia and digital chairside sensors.',
      },
      {
        title: 'Flexible Installments & Panels',
        detail: 'Transparent written treatment plans, family packages, and easy monthly orthodontic installments.',
      },
      {
        title: 'Evening Hours Until 9:00 PM',
        detail: 'Monday through Saturday appointments until 9:00 PM so quality dental care fits your family schedule.',
      },
    ],
  },
};

export const DENTAL_SERVICES: DentalService[] = [
  {
    id: 'ortho-braces',
    number: '01',
    category: 'Orthodontics & Braces',
    title: 'Clear Aligners & Fixed Orthodontic Braces',
    shortSummary:
      'Achieve the straight, confident smile you have always wanted with invisible clear aligners and American-standard metallic or ceramic fixed braces.',
    duration: '45 mins consultation · 12–18 mos plan',
    feeRangePkr: 'PKR 3,000 Consultation · Easy Monthly Installments',
    imageUrl: '/images/service-aligners.webp',
    imageAlt: 'Clear orthodontic aligners and straight smile transformation at Dental House',
    clinicalSteps: [
      'Digital cephalometric & panoramic bite analysis',
      'Ultrasonic pre-braces scaling and enamel conditioning',
      'Precision bracket bonding or custom clear aligner tray delivery',
      'Monthly progress adjustments and post-treatment Essix retainers',
    ],
    recommendedFor: ['Crowded or overlapping teeth', 'Overbite / underbite correction', 'Gap closure (diastema)'],
    specialistLead: 'Dr. Daniyal Ahmed Khan (FCPS Orthodontics)',
  },
  {
    id: 'dental-implants',
    number: '02',
    category: 'Implants & Prosthodontics',
    title: 'Dental Implants & Zirconia Restorations',
    shortSummary:
      'Permanent replacement for missing teeth using biocompatible Grade-5 titanium root fixtures, All-on-4/6 bridges, and custom monolithic zirconia crowns.',
    duration: '60 mins placement · 2–3 visits',
    feeRangePkr: 'PKR 65,000 – 95,000 per Implant Unit',
    imageUrl: '/images/service-implant-model.webp',
    imageAlt: '3D anatomical dental implant and zirconia crown restoration model',
    clinicalSteps: [
      '3D bone density assessment and digital surgical guide planning',
      'Atraumatic local anesthesia and titanium fixture placement',
      'Osseointegration check and custom milled titanium abutment fit',
      'Natural shade-matched monolithic zirconia crown torque lock',
    ],
    recommendedFor: ['Single missing molar or incisor', 'Implant-supported fixed bridges', 'Loose denture stabilization'],
    specialistLead: 'Dr. Daniyal Ahmed Khan (C-Implantology)',
  },
  {
    id: 'esthetic-fillings',
    number: '03',
    category: 'Preventive & Aesthetic',
    title: 'Cosmetic Dentistry, Veneers & Whitening',
    shortSummary:
      'Porcelain E-Max veneers, cold-LED laser teeth whitening, nano-ceramic bonding, and complete smile makeovers tailored to your facial harmony.',
    duration: '45 mins session',
    feeRangePkr: 'PKR 12,000 – 28,000',
    imageUrl: '/images/service-cosmetic.webp',
    imageAlt: 'Cosmetic porcelain veneers and radiant white smile makeover',
    clinicalSteps: [
      'Digital shade matching and aesthetic smile design preview',
      'Minimally invasive enamel preparation and bonding',
      'Cold-LED hydrogen peroxide whitening or custom veneer placement',
      'High-gloss diamond silicone occlusal polishing',
    ],
    recommendedFor: ['Stained or discolored enamel', 'Chipped front incisor edges', 'Bridal & event smile makeovers'],
    specialistLead: 'Cosmetic & Aesthetic Restorative Team',
  },
  {
    id: 'root-canal',
    number: '04',
    category: 'Restorative & Endodontics',
    title: 'Single-Visit Rotary Root Canal & Crowns',
    shortSummary:
      'Electronic apex-located rotary endodontic therapy to eliminate acute toothache and deep pulp infection rapidly while saving your natural tooth.',
    duration: '45–60 mins single sitting',
    feeRangePkr: 'PKR 12,000 – 18,000 (Root Canal Therapy)',
    imageUrl: '/images/service-implants.webp',
    imageAlt: 'Restorative dental crown and precision root canal treatment',
    clinicalSteps: [
      'Digital periapical sensor X-ray and profound local anesthesia',
      'Rubber dam isolation and NiTi rotary canal shaping',
      'Ultrasonic root canal disinfection',
      'Bioceramic 3D obturation and composite core build-up',
    ],
    recommendedFor: ['Severe night toothache', 'Hot/cold lingering sensitivity', 'Deep carious decay or fracture'],
    specialistLead: 'Senior Endodontic Associate',
  },
  {
    id: 'scaling-whitening',
    number: '05',
    category: 'Preventive & Aesthetic',
    title: 'General & Preventive Family Dentistry',
    shortSummary:
      'Ultrasonic scaling, Prophy-Jet air polishing, digital X-rays, fluoride sealants, and comprehensive family check-ups to catch concerns early.',
    duration: '35–45 mins session',
    feeRangePkr: 'PKR 4,500 – 8,500',
    imageUrl: '/images/service-preventive.webp',
    imageAlt: 'Preventive dental checkup and ultrasonic teeth cleaning',
    clinicalSteps: [
      'Periodontal gum charting and digital diagnostic bitewings',
      'Piezoelectric ultrasonic calculus and plaque removal',
      'Air-flow stain polishing and fluoride enamel protection',
      'Personalized home hygiene and dietary guidance',
    ],
    recommendedFor: ['Bleeding or swollen gums', 'Routine 6-month family checkups', 'Tea & coffee stain removal'],
    specialistLead: 'Preventive Hygiene & Family Care Team',
  },
  {
    id: 'oral-surgery',
    number: '06',
    category: 'Restorative & Endodontics',
    title: 'Emergency Dental Care & Wisdom Tooth Surgery',
    shortSummary:
      'Same-day relief for severe toothaches, broken crowns, orthodontic wire pokes, and painless surgical extraction of impacted wisdom molars.',
    duration: '30–50 mins priority visit',
    feeRangePkr: 'PKR 5,000 – 22,000',
    imageUrl: '/images/service-emergency.webp',
    imageAlt: 'Urgent dental care and painless oral surgery consultation',
    clinicalSteps: [
      'Immediate chairside digital X-ray and pain-relief block',
      'Atraumatic wisdom tooth luxation or emergency pulp dressing',
      'Resorbable suture placement and sterile dressing',
      'Post-operative recovery kit and 48-hour follow-up call',
    ],
    recommendedFor: ['Urgent toothache or swelling', 'Impacted wisdom molar pain', 'Broken tooth or loose crown'],
    specialistLead: 'Oral & Maxillofacial Surgery Unit',
  },
];

export const PATIENT_REVIEWS: PatientReview[] = [
  {
    id: 'rev-1',
    patientName: 'Huzaifa Siddiqui',
    initials: 'HS',
    date: 'October 2026',
    rating: 5.0,
    verifiedSource: 'Google Maps · Saddar',
    topic: 'Orthodontics & Braces',
    secondaryTopic: 'Affordability',
    treatmentReceived: 'Fixed Metallic Braces & Retainers',
    quote:
      'Visited Dental House at Shop #19 Daud Pota Road near Bohri Bazar for my orthodontic braces. Dr. Daniyal explained the entire 14-month alignment plan clearly and offered a very reasonable monthly installment plan. The whole staff made me feel like family.',
  },
  {
    id: 'rev-2',
    patientName: 'Ayesha Fatima Memon',
    initials: 'AM',
    date: 'September 2026',
    rating: 5.0,
    verifiedSource: 'Google Maps · Karachi',
    topic: 'Painless Care',
    secondaryTopic: 'Hygiene & Sterilization',
    treatmentReceived: 'Single-Visit Rotary Root Canal & Zirconia Crown',
    quote:
      'I came in with severe molar pain while shopping in Saddar. They accommodated me promptly, took a digital X-ray right in the chair, and completed a painless root canal in one sitting. Every instrument was opened from sealed autoclave pouches in front of me.',
  },
  {
    id: 'rev-3',
    patientName: 'Kamran Qureshi',
    initials: 'KQ',
    date: 'August 2026',
    rating: 5.0,
    verifiedSource: 'Google Maps · Saddar',
    topic: 'Hygiene & Sterilization',
    secondaryTopic: 'Painless Care',
    treatmentReceived: 'Titanium Dental Implant & Bridge',
    quote:
      'Had two lower molar implants placed at Dental House. The level of honesty is unmatched—Dr. Daniyal will not recommend anything you do not need. Spotless air-conditioned operatory right in the heart of Bohri Bazar, Daud Pota Road.',
  },
  {
    id: 'rev-4',
    patientName: 'Zainab Tariq',
    initials: 'ZT',
    date: 'July 2026',
    rating: 5.0,
    verifiedSource: 'Google Maps · Karachi',
    topic: 'Affordability',
    secondaryTopic: 'Hygiene & Sterilization',
    treatmentReceived: 'Ultrasonic Scaling, Polishing & Composite Fillings',
    quote:
      'Very polite receptionist and transparent rates compared to overpriced Defence clinics. Scaling and two nano-ceramic fillings were done gently in 45 minutes. Calling 0344 2730018 ahead saved me any waiting time.',
  },
  {
    id: 'rev-5',
    patientName: 'Muhammad Farhan Vohra',
    initials: 'FV',
    date: 'June 2026',
    rating: 4.8,
    verifiedSource: 'Google Maps · Bohri Bazar',
    topic: 'Orthodontics & Braces',
    secondaryTopic: 'Painless Care',
    treatmentReceived: 'Clear Aligner Assessment & Scaling',
    quote:
      'Great practice on Daud Pota Road with evening hours until 9 PM. Evening slots between 6 PM and 8 PM are popular, so definitely book an appointment online or call 0344 2730018 before arriving. Clinical work is top-notch.',
  },
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Shop #19 Reception & Patient Welcome Desk',
    category: 'Entrance & Bohri Bazar',
    caption: 'Warm, modern front desk at Shop #19, Daud Pota Road, Bohri Bazar, Saddar with digital appointment scheduling and transparent fee consultations.',
    equipmentSpec: 'Accessible Ground Access · Bohri Bazar Precinct',
    bayCode: 'ZONE-01',
    imageUrl: '/images/hero-front-desk.webp',
    imageAlt: 'Modern curved reception desk and signage inside Dental House clinic',
  },
  {
    id: 'gal-2',
    title: 'Primary Ergonomic Dental Operatory Suite',
    category: 'Clinical Operatory',
    caption: 'Equipped with hydraulic patient chair, shadowless LED sensor lamp, rotary endodontic motor, and chairside digital X-ray display.',
    equipmentSpec: 'Shadowless 45,000 Lux LED · Chairside RVG Sensor',
    bayCode: 'BAY-A1',
    imageUrl: '/images/hero-operatory-chair.webp',
    imageAlt: 'Primary dental operatory chair and digital delivery unit',
  },
  {
    id: 'gal-3',
    title: 'Multi-Bay Clinical Wing & Sterilization Suite',
    category: 'Sterilization & 3D Lab',
    caption: 'Expansive clinical treatment bays paired with 134°C Class-B vacuum autoclave sterilization, ultrasonic instrument baths, and digital imaging.',
    equipmentSpec: '134°C Prion-Cycle Autoclave · Digital Imaging',
    bayCode: 'LAB-S1',
    imageUrl: '/images/office-wide.webp',
    imageAlt: 'Wide view of modern dental operatories and sterilization wing',
  },
  {
    id: 'gal-4',
    title: 'Air-Conditioned Patient Waiting & Consultation Lounge',
    category: 'Waiting Lounge',
    caption: 'Calm, climate-controlled corridor and waiting lounge designed to make every family visit in Saddar relaxed and stress-free.',
    equipmentSpec: 'Climate Controlled · Spa-Like Comfort',
    bayCode: 'REC-01',
    imageUrl: '/images/hero-corridor.webp',
    imageAlt: 'Curved architectural clinic corridor with warm lighting',
  },
  {
    id: 'gal-5',
    title: 'Chairside Patient Consultation & Smile Design',
    category: 'Clinical Operatory',
    caption: 'One-on-one treatment planning where every digital X-ray, orthodontic option, and fee breakdown is explained clearly in the chair.',
    equipmentSpec: 'Chairside HD Diagnostic Monitors',
    bayCode: 'BAY-B2',
    imageUrl: '/images/hero-patient-consult.webp',
    imageAlt: 'Doctor consulting warmly with a patient in the dental operatory',
  },
  {
    id: 'gal-6',
    title: 'Our Dedicated Clinical & Hygiene Team',
    category: 'Sterilization & 3D Lab',
    caption: 'Our specialist dentists, orthodontic coordinators, and infection-control assistants working together at Shop #19 Daud Pota Road.',
    equipmentSpec: 'PMDC Certified Clinical Staff',
    bayCode: 'TEAM-01',
    imageUrl: '/images/clinic-team.webp',
    imageAlt: 'Full dental clinic team smiling together in the operatory',
  },
];

export const EDUCATION_ARTICLES: EducationArticle[] = [
  {
    id: 'edu-1',
    category: 'Dental Health Tips',
    title: 'What to Expect at Your First Orthodontic or Dental Visit in Saddar',
    readTime: '3 min read',
    summary:
      'From digital low-radiation X-rays to an unhurried walkthrough of your treatment options and installment plan, here is how we make your first visit effortless.',
    takeaways: [
      'Complete oral exam and digital bitewing X-ray screening',
      'Transparent written fee breakdown before any procedure begins',
      'Same-day ultrasonic cleaning or pain relief when needed',
    ],
    imageUrl: '/images/hero-reception-smile.webp',
  },
  {
    id: 'edu-2',
    category: 'Treatment Guides',
    title: 'Clear Aligners vs. Fixed Braces & Titanium Implants: Plain-Language Guide',
    readTime: '4 min read',
    summary:
      'Comparing treatment timelines, hygiene care, and monthly installment options for straightening crowded teeth or permanently replacing a missing molar.',
    takeaways: [
      'Clear aligners are removable for meals and special occasions',
      'Fixed self-ligating braces deliver rapid 3D root torque control',
      'Grade-5 titanium implants preserve jawbone and last decades',
    ],
    imageUrl: '/images/service-implant-model.webp',
  },
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'Location & Directions',
    question: 'Where exactly is Dental House located in Saddar, Karachi?',
    answer:
      'Dental House is located at Shop #19, Daud Pota Road, Bohri Bazar, Saddar, Karachi. We are situated right along Daud Pota Road adjacent to Bohri Bazar and easily reachable from Regal Chowk, Preedy Street, and Empress Market.',
  },
  {
    id: 'faq-2',
    category: 'Appointments & Timings',
    question: 'What are the clinic timings and do you offer evening hours?',
    answer:
      'Yes! We are open Monday through Saturday from 11:00 AM to 9:00 PM (with a brief Friday prayer break from 1:00 PM to 2:30 PM). Evening hours until 9:00 PM make it easy for working professionals and students to visit without missing work or school.',
  },
  {
    id: 'faq-3',
    category: 'Orthodontics & Braces',
    question: 'Do you offer monthly installment plans for fixed braces and clear aligners?',
    answer:
      'Yes. Following your initial orthodontic assessment, we provide a written treatment plan with a flexible down payment and affordable monthly installment payments spread across your active braces or aligner visits.',
  },
  {
    id: 'faq-4',
    category: 'Hygiene & Safety',
    question: 'How does Dental House sterilize dental instruments between patients?',
    answer:
      'Every handpiece, surgical elevator, orthodontic plier, and diagnostic mirror undergoes ultrasonic enzymatic cleaning, individual medical-grade pouch sealing, and a 134°C Class-B vacuum autoclave cycle. Pouches are unsealed chairside in front of you.',
  },
  {
    id: 'faq-5',
    category: 'Emergency Care',
    question: 'Can I visit for urgent toothache or broken tooth emergencies on the same day?',
    answer:
      'Yes. We reserve daily priority slots for acute toothache, swelling, and crown/bracket emergencies. Call 0344 2730018 before leaving so our clinical team can prepare the operatory for your arrival.',
  },
];

export function filterServices(
  services: DentalService[],
  category: ServiceCategory,
  searchQuery = ''
): DentalService[] {
  const q = searchQuery.trim().toLowerCase();
  return services.filter((svc) => {
    const matchesCategory = category === 'All' || svc.category === category;
    if (!matchesCategory) return false;
    if (!q) return true;
    return (
      svc.title.toLowerCase().includes(q) ||
      svc.shortSummary.toLowerCase().includes(q) ||
      svc.category.toLowerCase().includes(q) ||
      svc.recommendedFor.some((r) => r.toLowerCase().includes(q))
    );
  });
}

export function filterReviews(
  reviews: PatientReview[],
  topic: ReviewTopic,
  minRating = 0
): PatientReview[] {
  return reviews.filter((rev) => {
    const matchesTopic =
      topic === 'All' || rev.topic === topic || rev.secondaryTopic === topic;
    const matchesRating = rev.rating >= minRating;
    return matchesTopic && matchesRating;
  });
}

export function filterGallery(
  items: GalleryItem[],
  room: GalleryRoom
): GalleryItem[] {
  if (room === 'All') return items;
  return items.filter((item) => item.category === room);
}

export function validatePakistaniPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-()]/g, '');
  return /^(\+92|0092|0)?3\d{9}$/.test(cleaned) || /^(\+92|0)?21\d{7,8}$/.test(cleaned);
}

export function validateAppointmentInput(
  input: AppointmentInput
): { valid: boolean; errors: Partial<Record<keyof AppointmentInput, string>> } {
  const errors: Partial<Record<keyof AppointmentInput, string>> = {};

  if (!input.patientName || input.patientName.trim().length < 2) {
    errors.patientName = 'Please enter the patient full name (at least 2 characters).';
  }

  if (!input.phone || !validatePakistaniPhone(input.phone)) {
    errors.phone = 'Please enter a valid Pakistani mobile number (e.g. 0344 2730018 or +92 300 1234567).';
  }

  if (!input.preferredDate || input.preferredDate.trim().length === 0) {
    errors.preferredDate = 'Please select your preferred visit date.';
  }

  if (!input.serviceId || input.serviceId.trim().length === 0) {
    errors.serviceId = 'Please select a primary dental service.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function createAppointmentRecord(
  input: AppointmentInput,
  services: DentalService[] = DENTAL_SERVICES
): AppointmentRecord {
  const matchedService = services.find((s) => s.id === input.serviceId) || services[0];
  const hash = Math.abs(
    input.patientName
      .trim()
      .split('')
      .reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) % 9000, 1000)
  );
  const referenceCode = `DH-${String(1000 + (hash % 8999)).padStart(4, '0')}`;

  return {
    ...input,
    patientName: input.patientName.trim(),
    phone: input.phone.trim(),
    referenceCode,
    createdAt: new Date().toISOString(),
    estimatedFee: matchedService.feeRangePkr,
    clinicAddress: CLINIC_INFO.address,
    clinicPhone: CLINIC_INFO.phoneDisplay,
  };
}

export interface ClinicStatusResult {
  isOpen: boolean;
  statusLabel: string;
  detailText: string;
}

export function getClinicOpenStatus(now: Date = new Date()): ClinicStatusResult {
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
  const pktDate = new Date(utcMs + 5 * 3600000);
  const day = pktDate.getDay();
  const hour = pktDate.getHours() + pktDate.getMinutes() / 60;

  if (day === 0) {
    return {
      isOpen: false,
      statusLabel: 'Sunday By Prior Emergency Call',
      detailText: 'Regular Hours Mon–Sat 11:00 AM – 9:00 PM PKT',
    };
  }

  if (day === 5 && hour >= 13 && hour < 14.5) {
    return {
      isOpen: false,
      statusLabel: 'Friday Prayer Break (Reopens 2:30 PM)',
      detailText: 'Afternoon & Evening Session: 2:30 PM – 9:00 PM PKT',
    };
  }

  if (hour >= 11 && hour < 21) {
    return {
      isOpen: true,
      statusLabel: 'Open Today Until 9:00 PM',
      detailText: 'Active Session: 11:00 AM – 9:00 PM PKT',
    };
  }

  return {
    isOpen: false,
    statusLabel: 'Evening Hours Mon–Sat Until 9:00 PM',
    detailText: 'Opens Mon–Sat 11:00 AM – 9:00 PM · Online Booking Active',
  };
}
