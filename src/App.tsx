import React, { useState, useEffect } from 'react';
import {
  Phone,
  MapPin,
  Clock,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  Star,
  Navigation,
  BookOpen,
  X,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import {
  CLINIC_INFO,
  HERO_COLLAGE_PHOTOS,
  DENTAL_SERVICES,
  PATIENT_REVIEWS,
  GALLERY_ITEMS,
  EDUCATION_ARTICLES,
  FAQ_ITEMS,
  ServiceCategory,
  ReviewTopic,
  GalleryRoom,
  DentalService,
  GalleryItem,
  EducationArticle,
  AppointmentInput,
  AppointmentRecord,
  filterServices,
  filterReviews,
  filterGallery,
  validateAppointmentInput,
  createAppointmentRecord,
  getClinicOpenStatus,
} from './utils/clinicLogic';

const SERVICE_CATEGORIES: ServiceCategory[] = [
  'All',
  'Orthodontics & Braces',
  'Implants & Prosthodontics',
  'Restorative & Endodontics',
  'Preventive & Aesthetic',
];

const REVIEW_TOPICS: ReviewTopic[] = [
  'All',
  'Orthodontics & Braces',
  'Painless Care',
  'Hygiene & Sterilization',
  'Affordability',
];

const GALLERY_ROOMS: GalleryRoom[] = [
  'All',
  'Entrance & Bohri Bazar',
  'Waiting Lounge',
  'Clinical Operatory',
  'Sterilization & 3D Lab',
];

export default function App() {
  // Services Filter & Modal State
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('All');
  const [serviceSearch, setServiceSearch] = useState<string>('');
  const [inspectedService, setInspectedService] = useState<DentalService | null>(null);

  // Reviews Filter & Active Carousel Slide State
  const [selectedReviewTopic, setSelectedReviewTopic] = useState<ReviewTopic>('All');
  const [minRatingFilter, setMinRatingFilter] = useState<number>(0);
  const [activeReviewIndex, setActiveReviewIndex] = useState<number>(0);

  // Gallery Filter & Lightbox State
  const [selectedGalleryRoom, setSelectedGalleryRoom] = useState<GalleryRoom>('All');
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  // Patient Education Guide Modal State
  const [inspectedArticle, setInspectedArticle] = useState<EducationArticle | null>(null);

  // FAQ Accordion State
  const [openFaqId, setOpenFaqId] = useState<string>('faq-1');

  // Appointment Form & Saved Bookings State
  const [formInput, setFormInput] = useState<AppointmentInput>({
    patientName: '',
    phone: '',
    preferredDate: '2026-10-29',
    timeWindow: '5:00 PM – 7:00 PM (Evening Session)',
    serviceId: 'ortho-braces',
    contactMethod: 'WhatsApp',
    notes: '',
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof AppointmentInput, string>>>({});
  const [submittedAppointments, setSubmittedAppointments] = useState<AppointmentRecord[]>(() => {
    try {
      const saved = localStorage.getItem('dental_house_appointments_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [latestConfirmation, setLatestConfirmation] = useState<AppointmentRecord | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('dental_house_appointments_v1', JSON.stringify(submittedAppointments));
    } catch {
      // ignore storage errors
    }
  }, [submittedAppointments]);

  const clinicStatus = getClinicOpenStatus();
  const visibleServices = filterServices(DENTAL_SERVICES, selectedCategory, serviceSearch);
  const visibleReviews = filterReviews(PATIENT_REVIEWS, selectedReviewTopic, minRatingFilter);
  const visibleGallery = filterGallery(GALLERY_ITEMS, selectedGalleryRoom);

  const safeReviewIndex =
    visibleReviews.length > 0 ? activeReviewIndex % visibleReviews.length : 0;
  const featuredReview = visibleReviews[safeReviewIndex] || PATIENT_REVIEWS[0];

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleBookService = (serviceId: string) => {
    setFormInput((prev) => ({ ...prev, serviceId }));
    setInspectedService(null);
    scrollToSection('contact');
  };

  const handleAppointmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateAppointmentInput(formInput);
    if (!validation.valid) {
      setFormErrors(validation.errors);
      return;
    }

    setFormErrors({});
    const record = createAppointmentRecord(formInput);
    setSubmittedAppointments((prev) => [record, ...prev]);
    setLatestConfirmation(record);
  };

  const handleResetFormForAnotherBooking = () => {
    setLatestConfirmation(null);
    setFormInput((prev) => ({
      ...prev,
      patientName: '',
      phone: '',
      notes: '',
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900">
      {/* Top Clinical Info Strip */}
      <div className="bg-[#081C38] text-slate-200 text-xs border-b border-sky-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-white">{CLINIC_INFO.address}</span>
            <span aria-hidden="true" className="text-sky-400">
              ·
            </span>
            <span className="text-[#6EE7B7] font-medium">{clinicStatus.statusLabel}</span>
          </div>
          <div className="flex items-center gap-3 font-mono-tabular">
            <span className="hidden sm:inline text-sky-200">{CLINIC_INFO.timingsSummary}</span>
            <span aria-hidden="true" className="hidden sm:inline text-sky-700">
              ·
            </span>
            <a
              href={`tel:${CLINIC_INFO.phoneRaw}`}
              className="text-[#86EFAC] hover:text-white font-semibold transition-colors whitespace-nowrap shrink-0"
            >
              Call {CLINIC_INFO.phoneDisplay}
            </a>
          </div>
        </div>
      </div>

      {/* Strict 3-Zone Top Bar Contract (Inspired by Premier Arts Dental Frosted Header) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#top"
            className="text-xl font-bold tracking-tight text-[#0A2540] font-display whitespace-nowrap shrink-0"
          >
            Dental House
          </a>

          {/* Zone 2: 5 concise single-line navigation links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-700"
          >
            <a
              href="#about"
              className="hover:text-[#0284C7] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              About Us
            </a>
            <a
              href="#services"
              className="hover:text-[#0284C7] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Services
            </a>
            <a
              href="#reviews"
              className="hover:text-[#0284C7] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Reviews
            </a>
            <a
              href="#gallery"
              className="hover:text-[#0284C7] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Gallery
            </a>
            <a
              href="#contact"
              className="hover:text-[#0284C7] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Contact
            </a>
          </nav>

          {/* Zone 3: 1 Primary Action Button (Premier Arts Emerald Green Accent) */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => scrollToSection('contact')}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#4CAF50] hover:bg-[#43A047] rounded-full transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
            >
              Book Appointment
            </button>
          </div>
        </div>

        {/* Compact Mobile Quick-Nav Row */}
        <nav
          aria-label="Mobile Section Navigation"
          className="md:hidden flex items-center justify-between px-4 py-2 border-t border-slate-200/80 text-xs font-medium text-slate-700 bg-white"
        >
          <a href="#about" className="hover:text-[#0284C7] whitespace-nowrap shrink-0">
            About Us
          </a>
          <a href="#services" className="hover:text-[#0284C7] whitespace-nowrap shrink-0">
            Services
          </a>
          <a href="#reviews" className="hover:text-[#0284C7] whitespace-nowrap shrink-0">
            Reviews
          </a>
          <a href="#gallery" className="hover:text-[#0284C7] whitespace-nowrap shrink-0">
            Gallery
          </a>
          <a href="#faq" className="hover:text-[#0284C7] whitespace-nowrap shrink-0">
            FAQ
          </a>
          <a href="#contact" className="hover:text-[#0284C7] whitespace-nowrap shrink-0">
            Contact
          </a>
        </nav>
      </header>

      <main id="top" className="flex-1">
        {/* SECTION 1: PREMIER ARTS DENTAL STYLE LUXURY OCEAN-BLUE HERO WITH REAL PHOTOGRAPHY COLLAGE */}
        <section className="py-5 sm:py-8 px-3 sm:px-6 lg:px-8">
          <div
            className="max-w-[1380px] mx-auto rounded-3xl overflow-hidden relative bg-gradient-to-br from-[#0284C7] via-[#075985] to-[#081E3E] text-white shadow-xl border border-sky-900/40"
            style={{
              backgroundImage: `linear-gradient(115deg, rgba(3, 105, 161, 0.90) 0%, rgba(7, 89, 133, 0.92) 42%, rgba(8, 28, 58, 0.97) 100%), url('/images/abstract-waves.webp')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="p-6 sm:p-10 lg:p-14 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              {/* Left 6 Columns: Editorial Serif Headline, CTAs & Frosted Patient Cards */}
              <div className="lg:col-span-6 space-y-6">
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-sky-200">
                  <span>Quality Luxury Dental Care</span>
                  <span aria-hidden="true">·</span>
                  <span>Shop #19, Daud Pota Road, Bohri Bazar, Saddar</span>
                </div>

                <h1
                  className="text-4xl sm:text-5xl lg:text-[56px] font-bold tracking-tight text-white leading-[1.08] font-display"
                  style={{ textWrap: 'balance' }}
                >
                  Advanced dentistry <em className="italic font-normal text-sky-200">meets</em>{' '}
                  genuine warmth.
                </h1>

                <p className="text-base sm:text-lg text-sky-100/95 leading-relaxed max-w-xl">
                  Where advanced dentistry meets genuine warmth at{' '}
                  <strong className="font-semibold text-white">Dental House</strong> (Shop #19, Daud
                  Pota Road, Bohri Bazar, Saddar, Karachi). Led by{' '}
                  <strong className="font-semibold text-white">
                    {CLINIC_INFO.leadDoctor.name}
                  </strong>
                  —accepting new patients, affordable monthly braces installments, and evening hours
                  Monday through Saturday until 9:00 PM.
                </p>

                {/* Primary & Secondary Pill CTA Buttons */}
                <div className="pt-1 flex flex-wrap items-center gap-3.5">
                  <button
                    type="button"
                    onClick={() => scrollToSection('contact')}
                    className="px-6 py-3.5 rounded-full bg-[#4CAF50] hover:bg-[#43A047] text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-2 shadow-md"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Book Appointment</span>
                  </button>

                  <a
                    href={`tel:${CLINIC_INFO.phoneRaw}`}
                    className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
                  >
                    <span>Call Us — {CLINIC_INFO.phoneDisplay}</span>
                  </a>
                </div>

                {/* Divider & Two Frosted Glass Sub-Cards (Exactly matching Premier Arts Dental Hero) */}
                <div className="pt-6 border-t border-white/15 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Card 1: Patient Education */}
                  <div className="rounded-2xl bg-white/10 border border-white/15 p-5 flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                      <BookOpen className="w-5 h-5 text-sky-200" />
                    </div>
                    <div className="space-y-1.5">
                      <h2 className="text-base font-bold text-white font-display">
                        Patient Education
                      </h2>
                      <p className="text-xs text-sky-100/85 leading-relaxed">
                        Tips on oral health, braces & implant treatment guides & answers.
                      </p>
                      <button
                        type="button"
                        onClick={() => scrollToSection('education')}
                        className="pt-1 text-xs font-semibold text-white hover:text-[#86EFAC] flex items-center gap-1 cursor-pointer"
                      >
                        <span>Read Guides</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Card 2: Patient Reviews */}
                  <div className="rounded-2xl bg-white/10 border border-white/15 p-5 flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                      <Star className="w-5 h-5 text-amber-300" />
                    </div>
                    <div className="space-y-1.5">
                      <h2 className="text-base font-bold text-white font-display">
                        Patient Reviews
                      </h2>
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <span className="text-xs font-mono-tabular font-bold text-white">
                          {CLINIC_INFO.rating}
                        </span>
                      </div>
                      <p className="text-xs text-sky-100/85">
                        Trusted by {CLINIC_INFO.reviewCount}+ Saddar & Karachi families
                      </p>
                      <button
                        type="button"
                        onClick={() => scrollToSection('reviews')}
                        className="pt-0.5 text-xs font-semibold text-white hover:text-[#86EFAC] flex items-center gap-1 cursor-pointer"
                      >
                        <span>See Reviews</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right 6 Columns: Dual-Column Real Dental Clinic Photography Collage (No 3D Canvas!) */}
              <div
                className="lg:col-span-6 grid grid-cols-2 gap-3.5 sm:gap-4"
                data-testid="hero-real-photo-collage"
              >
                {/* Left Photo Column */}
                <div className="space-y-3.5 sm:space-y-4">
                  {HERO_COLLAGE_PHOTOS.columnLeft.map((photo, index) => (
                    <div
                      key={photo.id}
                      onClick={() =>
                        setLightboxItem({
                          id: photo.id,
                          title: photo.label,
                          category: 'Clinical Operatory',
                          caption: photo.alt,
                          equipmentSpec: 'Dental House · Shop #19 Daud Pota Road, Saddar',
                          bayCode: `PHOTO-0${index + 1}`,
                          imageUrl: photo.src,
                          imageAlt: photo.alt,
                        })
                      }
                      className="group relative rounded-2xl overflow-hidden border border-white/20 shadow-lg cursor-pointer bg-slate-900"
                    >
                      <img
                        src={photo.src}
                        alt={photo.alt}
                        referrerPolicy="no-referrer"
                        className={`w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                          index === 1 ? 'h-48 sm:h-56' : 'h-36 sm:h-44'
                        }`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent opacity-90" />
                      <span className="absolute bottom-2.5 left-3 text-[11px] font-medium text-white">
                        {photo.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Right Photo Column (Staggered vertical offset for dynamic masonry feel) */}
                <div className="space-y-3.5 sm:space-y-4 pt-4 sm:pt-6">
                  {HERO_COLLAGE_PHOTOS.columnRight.map((photo, index) => (
                    <div
                      key={photo.id}
                      onClick={() =>
                        setLightboxItem({
                          id: photo.id,
                          title: photo.label,
                          category: 'Waiting Lounge',
                          caption: photo.alt,
                          equipmentSpec: 'Dental House · Shop #19 Daud Pota Road, Saddar',
                          bayCode: `PHOTO-0${index + 4}`,
                          imageUrl: photo.src,
                          imageAlt: photo.alt,
                        })
                      }
                      className="group relative rounded-2xl overflow-hidden border border-white/20 shadow-lg cursor-pointer bg-slate-900"
                    >
                      <img
                        src={photo.src}
                        alt={photo.alt}
                        referrerPolicy="no-referrer"
                        className={`w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                          index === 1 ? 'h-48 sm:h-56' : 'h-36 sm:h-44'
                        }`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent opacity-90" />
                      <span className="absolute bottom-2.5 left-3 text-[11px] font-medium text-white">
                        {photo.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: WELCOME TO DENTAL HOUSE — YOUR TRUSTED DENTIST IN SADDAR, KARACHI */}
        <section id="about" className="scroll-mt-20 py-14 sm:py-20 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              {/* Left 7 Columns: Editorial Welcome & 4 Feature Blocks */}
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-3">
                  <div className="text-xs font-semibold text-[#0284C7] tracking-wide">
                    Welcome to Dental House · Bohri Bazar, Saddar
                  </div>
                  <h2
                    className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#0A2540] leading-tight font-display"
                    style={{ textWrap: 'balance' }}
                  >
                    Your trusted dentist on Daud Pota Road, Saddar, Karachi.
                  </h2>
                  <p className="text-base text-slate-600 leading-relaxed">
                    {CLINIC_INFO.leadDoctor.bio}
                  </p>
                </div>

                {/* 4 Pillar Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {CLINIC_INFO.leadDoctor.highlights.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-1.5"
                    >
                      <h3 className="text-base font-bold text-[#0A2540] font-display">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {item.detail}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => scrollToSection('contact')}
                    className="px-6 py-3 rounded-full bg-[#4CAF50] hover:bg-[#43A047] text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Schedule Your Visit
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToSection('gallery')}
                    className="px-5 py-3 rounded-full bg-white border border-slate-300 hover:border-[#0284C7] text-slate-800 text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Tour Our Saddar Clinic
                  </button>
                </div>
              </div>

              {/* Right 5 Columns: Real Doctor & Clinic Team Photography Showcase */}
              <div className="lg:col-span-5 space-y-4">
                <div className="rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-sm">
                  <div className="relative h-80 sm:h-96 overflow-hidden bg-slate-900">
                    <img
                      src={CLINIC_INFO.leadDoctor.portraitUrl}
                      alt={`${CLINIC_INFO.leadDoctor.name} — Principal Dental Surgeon at Dental House`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#081C38]/90 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-5 right-5 text-white">
                      <span className="text-[11px] font-mono-tabular text-[#86EFAC]">
                        {CLINIC_INFO.leadDoctor.experienceYears}
                      </span>
                      <h3 className="text-xl font-bold font-display mt-0.5">
                        {CLINIC_INFO.leadDoctor.name}
                      </h3>
                      <p className="text-xs text-sky-100 mt-0.5">
                        {CLINIC_INFO.leadDoctor.credentials}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 bg-white flex items-center justify-between gap-4 text-xs">
                    <div>
                      <span className="text-slate-500">Clinic Location:</span>
                      <p className="font-semibold text-slate-900 mt-0.5">
                        Shop #19, Daud Pota Road, Bohri Bazar
                      </p>
                    </div>
                    <a
                      href={`tel:${CLINIC_INFO.phoneRaw}`}
                      className="px-3.5 py-2 rounded-full bg-sky-50 text-[#0284C7] font-mono-tabular font-bold hover:bg-sky-100 transition-colors whitespace-nowrap shrink-0"
                    >
                      {CLINIC_INFO.phoneDisplay}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: OUR SERVICES — MEET CLINICAL EXPERTISE (WITH REAL SERVICE PHOTOS) */}
        <section
          id="services"
          className="scroll-mt-20 py-14 sm:py-20 bg-white border-b border-slate-200/80"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
              <div>
                <div className="text-xs font-semibold text-[#0284C7] mb-2">
                  Our Services · Transparent Fee Guide
                </div>
                <h2
                  className="text-3xl sm:text-4xl font-bold text-[#0A2540] tracking-tight font-display"
                  style={{ textWrap: 'balance' }}
                >
                  Meet clinical expertise.
                </h2>
              </div>

              {/* Search Input for Services */}
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="search"
                  aria-label="Search dental treatments"
                  placeholder="Search aligners, veneers, implants..."
                  value={serviceSearch}
                  onChange={(e) => setServiceSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-[#F8FAFC] border border-slate-300 rounded-full text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0284C7]"
                />
              </div>
            </div>

            {/* Interactive Category Segmented Filter Bar */}
            <div
              className="flex items-center gap-1.5 p-1.5 bg-slate-100 rounded-2xl overflow-x-auto mb-8"
              role="group"
              aria-label="Filter dental services by specialty"
            >
              {SERVICE_CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    selectedCategory === category
                      ? 'bg-[#0A2540] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Photographic Service Cards Grid */}
            {visibleServices.length === 0 ? (
              <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-10 text-center space-y-3">
                <p className="text-base font-semibold text-slate-800">
                  No dental treatments matched "{serviceSearch}" in {selectedCategory}.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('All');
                    setServiceSearch('');
                  }}
                  className="px-5 py-2.5 rounded-full bg-[#0284C7] text-white text-xs font-semibold hover:bg-sky-700 transition-colors cursor-pointer"
                >
                  Reset Service Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                {visibleServices.map((service) => (
                  <article
                    key={service.id}
                    className="bg-[#F8FAFC] border border-slate-200/90 rounded-3xl overflow-hidden flex flex-col justify-between hover:border-[#0284C7]/60 transition-colors group"
                  >
                    <div>
                      {/* Real Clinical Treatment Photograph */}
                      <div className="relative h-52 overflow-hidden bg-slate-900">
                        <img
                          src={service.imageUrl}
                          alt={service.imageAlt}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-white font-mono-tabular">
                          <span>
                            {service.number} · {service.category}
                          </span>
                          <span>{service.duration}</span>
                        </div>
                      </div>

                      <div className="p-6 space-y-3">
                        <h3 className="text-xl font-bold text-[#0A2540] leading-snug font-display">
                          {service.title}
                        </h3>

                        <p className="text-sm text-slate-600 leading-relaxed">
                          {service.shortSummary}
                        </p>

                        <div className="pt-2 border-t border-slate-200/70">
                          <p className="text-xs font-medium text-slate-500">Estimated Fee Range:</p>
                          <p className="text-sm font-mono-tabular font-semibold text-[#0A2540] mt-0.5">
                            {service.feeRangePkr}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="px-6 pb-6 pt-3 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setInspectedService(service)}
                        className="px-3.5 py-2 rounded-full bg-white border border-slate-300 hover:border-slate-400 text-slate-800 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        Treatment Details
                      </button>

                      <button
                        type="button"
                        onClick={() => handleBookService(service.id)}
                        className="px-4 py-2 rounded-full bg-[#4CAF50] hover:bg-[#43A047] text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1"
                      >
                        <span>Schedule Consult</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* SECTION 4: WHAT SETS US APART — EXPERIENCE THE DIFFERENCE (01 & 02 NUMBERED FEATURE CARDS) */}
        <section className="py-14 sm:py-20 bg-[#F0F7FF] border-b border-sky-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="text-xs font-semibold text-[#0284C7] mb-1">What Sets Us Apart</div>
                <h2 className="text-3xl sm:text-4xl font-bold text-[#0A2540] font-display">
                  Experience the difference.
                </h2>
              </div>
              <button
                type="button"
                onClick={() => scrollToSection('contact')}
                className="px-5 py-2.5 rounded-full bg-[#0A2540] hover:bg-slate-800 text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0 self-start sm:self-auto cursor-pointer"
              >
                Book Your Consultation →
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* 01: Spa-Like Setting & Digital Technology */}
              <div className="bg-white rounded-3xl p-7 sm:p-9 border border-sky-100 shadow-xs flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <span className="text-3xl font-bold font-mono-tabular text-[#0284C7]">01</span>
                  <h3 className="text-2xl font-bold text-[#0A2540] font-display">
                    Spa-Like Clinical Setting & Digital Diagnostics
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    A tranquil, air-conditioned atmosphere and meticulous attention to sterilization
                    create an environment that feels calm and welcoming in the heart of Bohri Bazar,
                    Saddar. Behind that comfort, we use low-radiation digital X-rays, 3D implant
                    planning, and Class-B vacuum autoclaves.
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3 text-xs font-semibold text-[#0284C7]">
                  <span>3D Implant Planning</span>
                  <span aria-hidden="true">·</span>
                  <span>Digital Periapical X-Rays</span>
                  <span aria-hidden="true">·</span>
                  <span>134°C Class-B Autoclave</span>
                </div>
              </div>

              {/* 02: Transparent Treatment Planning */}
              <div className="bg-white rounded-3xl p-7 sm:p-9 border border-sky-100 shadow-xs flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <span className="text-3xl font-bold font-mono-tabular text-[#0284C7]">02</span>
                  <h3 className="text-2xl font-bold text-[#0A2540] font-display">
                    Transparent Treatment Planning & Evening Hours
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    {CLINIC_INFO.leadDoctor.name} believes you deserve to understand every option
                    before making a decision. We walk you through your digital X-ray diagnosis,
                    explain each treatment path, and provide written costs and monthly braces
                    installment options openly—with evening slots open until 9:00 PM.
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">
                    Shop #19, Daud Pota Road, Bohri Bazar, Saddar
                  </span>
                  <button
                    type="button"
                    onClick={() => scrollToSection('about')}
                    className="text-xs font-bold text-[#0284C7] hover:underline cursor-pointer"
                  >
                    Meet {CLINIC_INFO.leadDoctor.name} →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: WHAT PATIENTS SAY — REAL REVIEWS FROM OUR SADDAR COMMUNITY */}
        <section id="reviews" className="scroll-mt-20 py-14 sm:py-20 bg-white border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#0284C7] mb-2">
                  <span>What Patients Say</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono-tabular font-bold">
                    {CLINIC_INFO.rating} / 5.0 ({CLINIC_INFO.reviewCount} Verified Reviews)
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-[#0A2540] tracking-tight font-display">
                  Real reviews from our Saddar, Karachi community.
                </h2>
              </div>

              <a
                href={CLINIC_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-full bg-[#F8FAFC] border border-slate-300 hover:border-[#0284C7] text-xs font-semibold text-slate-800 transition-colors whitespace-nowrap shrink-0 self-start md:self-auto"
              >
                Verify on Google Maps ↗
              </a>
            </div>

            {/* Featured Carousel Spotlight (Matching Premier Arts Dental Review Carousel) */}
            <div className="mb-10 rounded-3xl bg-gradient-to-br from-[#081C38] via-[#0A2540] to-[#075985] text-white p-6 sm:p-10 relative overflow-hidden">
              <div className="max-w-3xl space-y-5">
                <div className="flex items-center gap-1.5 text-amber-400">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="ml-2 text-xs font-mono-tabular text-sky-200">
                    {featuredReview.verifiedSource} · {featuredReview.date}
                  </span>
                </div>

                <blockquote className="text-lg sm:text-xl lg:text-2xl font-display leading-relaxed text-white">
                  “{featuredReview.quote}”
                </blockquote>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  <div>
                    <div className="text-base font-bold text-white">
                      {featuredReview.patientName}
                    </div>
                    <div className="text-xs text-sky-200">
                      {featuredReview.treatmentReceived} · {featuredReview.topic}
                    </div>
                  </div>

                  {/* Carousel Prev / Next Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label="Previous patient review"
                      onClick={() =>
                        setActiveReviewIndex((prev) =>
                          prev === 0 ? visibleReviews.length - 1 : prev - 1
                        )
                      }
                      className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-mono-tabular px-2 text-sky-200">
                      {safeReviewIndex + 1} / {visibleReviews.length}
                    </span>
                    <button
                      type="button"
                      aria-label="Next patient review"
                      onClick={() =>
                        setActiveReviewIndex((prev) => (prev + 1) % visibleReviews.length)
                      }
                      className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Topic & Rating Filter Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div
                className="flex items-center gap-1.5 p-1.5 bg-slate-100 rounded-2xl overflow-x-auto"
                role="group"
                aria-label="Filter reviews by topic"
              >
                {REVIEW_TOPICS.map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => {
                      setSelectedReviewTopic(topic);
                      setActiveReviewIndex(0);
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      selectedReviewTopic === topic
                        ? 'bg-[#0A2540] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>

              <div
                className="flex items-center gap-1.5 p-1.5 bg-slate-100 rounded-2xl self-start"
                role="group"
                aria-label="Filter reviews by rating"
              >
                <button
                  type="button"
                  onClick={() => {
                    setMinRatingFilter(0);
                    setActiveReviewIndex(0);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    minRatingFilter === 0
                      ? 'bg-[#0A2540] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All Ratings ({PATIENT_REVIEWS.length})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMinRatingFilter(5.0);
                    setActiveReviewIndex(0);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    minRatingFilter === 5.0
                      ? 'bg-[#0A2540] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  5.0 Star Only (4)
                </button>
              </div>
            </div>

            {/* All Filtered Reviews Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleReviews.map((review) => (
                <article
                  key={review.id}
                  className="bg-[#F8FAFC] border border-slate-200/90 rounded-2xl p-6 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#0A2540] text-sky-200 flex items-center justify-center text-xs font-bold font-mono-tabular shrink-0">
                          {review.initials}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">{review.patientName}</h3>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <span>{review.date}</span>
                            <span aria-hidden="true">·</span>
                            <span>{review.verifiedSource}</span>
                          </div>
                        </div>
                      </div>

                      <div
                        className="flex items-center gap-1 text-xs font-mono-tabular font-bold text-amber-600"
                        aria-label={`Rated ${review.rating} out of 5 stars`}
                      >
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>{review.rating.toFixed(1)}</span>
                      </div>
                    </div>

                    <blockquote className="text-sm text-slate-700 leading-relaxed">
                      “{review.quote}”
                    </blockquote>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                    <div>
                      <span className="font-semibold text-[#0284C7]">{review.topic}</span>
                      <span aria-hidden="true"> · </span>
                      <span>{review.secondaryTopic}</span>
                    </div>
                    <span className="text-slate-400">{review.treatmentReceived}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 6: REAL CLINIC PHOTOGRAPHY GALLERY WITH ROOM FILTER & LIGHTBOX */}
        <section
          id="gallery"
          className="scroll-mt-20 py-14 sm:py-20 bg-[#F8FAFC] border-b border-slate-200/80"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
              <div>
                <div className="text-xs font-semibold text-[#0284C7] mb-2">
                  Real Clinic & Team Photography
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-[#0A2540] tracking-tight font-display">
                  Inside Dental House Saddar
                </h2>
              </div>

              <div
                className="flex items-center gap-1.5 p-1.5 bg-slate-200/70 rounded-2xl overflow-x-auto"
                role="group"
                aria-label="Filter clinic gallery by room"
              >
                {GALLERY_ROOMS.map((room) => (
                  <button
                    key={room}
                    type="button"
                    onClick={() => setSelectedGalleryRoom(room)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      selectedGalleryRoom === room
                        ? 'bg-[#0A2540] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {room}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleGallery.map((item) => (
                <article
                  key={item.id}
                  className="rounded-3xl overflow-hidden border border-slate-200/90 bg-white flex flex-col justify-between group shadow-2xs"
                >
                  <div className="relative h-56 overflow-hidden bg-slate-900">
                    <img
                      src={item.imageUrl}
                      alt={item.imageAlt}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <button
                      type="button"
                      onClick={() => setLightboxItem(item)}
                      aria-label={`Inspect photograph: ${item.title}`}
                      className="absolute bottom-3 right-3 px-3.5 py-1.5 rounded-full bg-white/95 hover:bg-[#4CAF50] text-slate-900 hover:text-white text-xs font-semibold transition-colors cursor-pointer shadow-sm"
                    >
                      Inspect Photo
                    </button>
                  </div>

                  <div className="p-6 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="font-semibold text-[#0284C7]">{item.category}</span>
                      <span className="font-mono-tabular">{item.bayCode}</span>
                    </div>
                    <h3 className="text-lg font-bold text-[#0A2540] font-display">{item.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {item.caption}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 7: PATIENT EDUCATION — AN INFORMED PATIENT IS A CONFIDENT PATIENT */}
        <section
          id="education"
          className="scroll-mt-20 py-14 sm:py-20 bg-white border-b border-slate-200/80"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-10 space-y-2">
              <div className="text-xs font-semibold text-[#0284C7]">Patient Education</div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#0A2540] font-display">
                An informed patient is a confident patient.
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Understanding your dental health helps you make better decisions for yourself and
                your family. Explore our plain-language guides on first visits, clear aligners,
                braces, and dental implants at Shop #19 Daud Pota Road.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {EDUCATION_ARTICLES.map((article) => (
                <article
                  key={article.id}
                  className="rounded-3xl overflow-hidden border border-slate-200 bg-[#F8FAFC] grid grid-cols-1 sm:grid-cols-12"
                >
                  <div className="sm:col-span-5 h-52 sm:h-full bg-slate-900">
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="sm:col-span-7 p-6 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-[#0284C7] font-semibold">
                        <span>{article.category}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-slate-500 font-normal">{article.readTime}</span>
                      </div>
                      <h3 className="text-lg font-bold text-[#0A2540] font-display leading-snug">
                        {article.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {article.summary}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setInspectedArticle(article)}
                      className="self-start px-4 py-2 rounded-full bg-white border border-slate-300 hover:border-[#0284C7] text-xs font-semibold text-[#0A2540] cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Read Complete Guide</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 8: LOCATION, DIRECTIONS & INTERACTIVE APPOINTMENT BOOKING FORM */}
        <section
          id="contact"
          className="scroll-mt-20 py-14 sm:py-20 bg-[#F8FAFC] border-b border-slate-200/80"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Left 5 Columns: Bohri Bazar, Saddar Location & Timings Card */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
                  <div>
                    <div className="text-xs font-semibold text-[#0284C7] mb-1">
                      Welcoming New Patients in Saddar, Karachi
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-[#0A2540] font-display">
                      Visit Us on Daud Pota Road
                    </h2>
                  </div>

                  <div className="space-y-4 text-sm">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-[#0284C7] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-slate-500">Clinic Address</p>
                        <p className="font-semibold text-slate-900 mt-0.5">
                          {CLINIC_INFO.address}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">{CLINIC_INFO.landmark}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 pt-3 border-t border-slate-100">
                      <Phone className="w-5 h-5 text-[#0284C7] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-slate-500">
                          Direct Telephone & WhatsApp Desk
                        </p>
                        <a
                          href={`tel:${CLINIC_INFO.phoneRaw}`}
                          className="text-lg font-bold text-[#0284C7] hover:underline font-mono-tabular mt-0.5 inline-block"
                        >
                          {CLINIC_INFO.phoneDisplay}
                        </a>
                        <p className="text-xs text-slate-500">
                          International Dial: {CLINIC_INFO.whatsappDisplay}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 pt-3 border-t border-slate-100">
                      <Clock className="w-5 h-5 text-[#0284C7] shrink-0 mt-0.5" />
                      <div className="w-full">
                        <p className="text-xs font-semibold text-slate-500 mb-2">
                          Verified Clinic & Evening Hours (PKT)
                        </p>
                        <div className="space-y-1.5 text-xs font-mono-tabular">
                          <div className="flex justify-between py-1 border-b border-slate-100">
                            <span className="text-slate-600">Monday – Thursday</span>
                            <span className="font-semibold text-slate-900">11:00 AM – 9:00 PM</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-slate-100">
                            <span className="text-slate-600">Friday</span>
                            <span className="font-semibold text-slate-900">
                              11:00 AM – 1:00 PM · 2:30 – 9:00 PM
                            </span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-slate-100">
                            <span className="text-slate-600">Saturday</span>
                            <span className="font-semibold text-slate-900">11:00 AM – 9:00 PM</span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-slate-600">Sunday</span>
                            <span className="text-amber-700 font-semibold">
                              Prior Emergency Call ({CLINIC_INFO.phoneDisplay})
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Direct Navigation & Call Actions */}
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <a
                      href={CLINIC_INFO.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-4 py-2.5 rounded-full bg-[#0A2540] hover:bg-slate-800 text-white text-xs font-semibold text-center transition-colors whitespace-nowrap shrink-0 flex items-center justify-center gap-2"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Get Directions on Google Maps</span>
                    </a>
                    <a
                      href={`tel:${CLINIC_INFO.phoneRaw}`}
                      className="px-4 py-2.5 rounded-full border border-slate-300 hover:border-[#0284C7] text-slate-800 text-xs font-mono-tabular font-semibold transition-colors whitespace-nowrap shrink-0"
                    >
                      Call {CLINIC_INFO.phoneDisplay}
                    </a>
                  </div>
                </div>

                {/* Bohri Bazar Landmark Card */}
                <div className="bg-[#081C38] text-white rounded-3xl p-6 border border-sky-900/50 space-y-2.5">
                  <div className="text-[11px] font-mono-tabular text-[#86EFAC]">
                    VERIFIED SADDAR COORDINATES · {CLINIC_INFO.coordinates}
                  </div>
                  <h3 className="text-lg font-bold font-display">
                    Dental House — Shop #19, Daud Pota Road
                  </h3>
                  <p className="text-xs text-sky-100/85 leading-relaxed">
                    Located on Daud Pota Road at Bohri Bazar, Saddar, Karachi. Reachable within 3
                    minutes from Empress Market, Preedy Street, and Abdullah Haroon Road.
                  </p>
                </div>
              </div>

              {/* Right 7 Columns: Interactive Appointment Booking Form */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xs">
                  <div className="space-y-2 mb-6">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#0284C7]">
                      <span>Online Appointment Desk</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono-tabular">Direct Line: {CLINIC_INFO.phoneDisplay}</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-[#0A2540] font-display">
                      Request an Appointment or Consultation
                    </h3>
                    <p className="text-sm text-slate-600">
                      Complete this form to reserve your preferred afternoon or evening visit window
                      at Shop #19 Daud Pota Road, or call{' '}
                      <a
                        href={`tel:${CLINIC_INFO.phoneRaw}`}
                        className="font-semibold text-[#0284C7] underline"
                      >
                        {CLINIC_INFO.phoneDisplay}
                      </a>{' '}
                      directly.
                    </p>
                  </div>

                  {latestConfirmation ? (
                    <div
                      className="p-6 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-4"
                      data-testid="appointment-confirmation-card"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-2.5">
                          <CheckCircle2 className="w-6 h-6 text-[#4CAF50] shrink-0" />
                          <div>
                            <span className="text-xs font-mono-tabular font-bold text-emerald-800">
                              BOOKING REFERENCE: {latestConfirmation.referenceCode}
                            </span>
                            <h4 className="text-lg font-bold text-slate-900 font-display">
                              Appointment Request Logged for {latestConfirmation.patientName}
                            </h4>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white p-4 rounded-xl border border-emerald-100">
                        <div>
                          <span className="text-slate-500">Patient Phone:</span>
                          <p className="font-mono-tabular font-semibold text-slate-900 mt-0.5">
                            {latestConfirmation.phone} ({latestConfirmation.contactMethod})
                          </p>
                        </div>
                        <div>
                          <span className="text-slate-500">Preferred Date & Window:</span>
                          <p className="font-mono-tabular font-semibold text-slate-900 mt-0.5">
                            {latestConfirmation.preferredDate} · {latestConfirmation.timeWindow}
                          </p>
                        </div>
                        <div>
                          <span className="text-slate-500">Selected Treatment:</span>
                          <p className="font-semibold text-slate-900 mt-0.5">
                            {DENTAL_SERVICES.find((s) => s.id === latestConfirmation.serviceId)
                              ?.title || latestConfirmation.serviceId}
                          </p>
                        </div>
                        <div>
                          <span className="text-slate-500">Estimated Fee Guide:</span>
                          <p className="font-mono-tabular font-semibold text-[#0284C7] mt-0.5">
                            {latestConfirmation.estimatedFee}
                          </p>
                        </div>
                        <div className="sm:col-span-2 pt-2 border-t border-slate-100">
                          <span className="text-slate-500">Clinic Location:</span>
                          <p className="font-semibold text-slate-900 mt-0.5">
                            {latestConfirmation.clinicAddress}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                        <button
                          type="button"
                          onClick={handleResetFormForAnotherBooking}
                          className="px-5 py-2.5 rounded-full bg-[#4CAF50] hover:bg-[#43A047] text-white text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Book Another Appointment</span>
                        </button>

                        <a
                          href={`tel:${CLINIC_INFO.phoneRaw}`}
                          className="px-4 py-2.5 rounded-full border border-emerald-700 text-emerald-900 text-xs font-mono-tabular font-semibold hover:bg-emerald-100 transition-colors"
                        >
                          Call Desk: {CLINIC_INFO.phoneDisplay}
                        </a>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleAppointmentSubmit} noValidate className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="patient-name-input"
                            className="block text-xs font-semibold text-slate-700 mb-1.5"
                          >
                            Patient or Contact Full Name *
                          </label>
                          <input
                            id="patient-name-input"
                            type="text"
                            required
                            placeholder="e.g. Muhammad Anas"
                            value={formInput.patientName}
                            onChange={(e) => {
                              setFormInput({ ...formInput, patientName: e.target.value });
                              if (formErrors.patientName) {
                                setFormErrors({ ...formErrors, patientName: undefined });
                              }
                            }}
                            className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none ${
                              formErrors.patientName
                                ? 'border-red-600 bg-red-50/30'
                                : 'border-slate-300 focus:border-[#0284C7] bg-white'
                            }`}
                          />
                          {formErrors.patientName && (
                            <p className="mt-1 text-xs text-red-600 font-medium" role="alert">
                              {formErrors.patientName}
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="patient-phone-input"
                            className="block text-xs font-semibold text-slate-700 mb-1.5"
                          >
                            Pakistani Mobile or Telephone Number *
                          </label>
                          <input
                            id="patient-phone-input"
                            type="tel"
                            required
                            placeholder="e.g. 0344 2730018 or +92 300 1234567"
                            value={formInput.phone}
                            onChange={(e) => {
                              setFormInput({ ...formInput, phone: e.target.value });
                              if (formErrors.phone) {
                                setFormErrors({ ...formErrors, phone: undefined });
                              }
                            }}
                            className={`w-full px-4 py-2.5 rounded-xl border text-sm font-mono-tabular text-slate-900 placeholder:text-slate-400 focus:outline-none ${
                              formErrors.phone
                                ? 'border-red-600 bg-red-50/30'
                                : 'border-slate-300 focus:border-[#0284C7] bg-white'
                            }`}
                          />
                          {formErrors.phone && (
                            <p className="mt-1 text-xs text-red-600 font-medium" role="alert">
                              {formErrors.phone}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label
                            htmlFor="visit-date-input"
                            className="block text-xs font-semibold text-slate-700 mb-1.5"
                          >
                            Preferred Visit Date (Mon–Sat) *
                          </label>
                          <input
                            id="visit-date-input"
                            type="date"
                            required
                            value={formInput.preferredDate}
                            onChange={(e) => {
                              setFormInput({ ...formInput, preferredDate: e.target.value });
                              if (formErrors.preferredDate) {
                                setFormErrors({ ...formErrors, preferredDate: undefined });
                              }
                            }}
                            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-mono-tabular text-slate-900 focus:outline-none ${
                              formErrors.preferredDate
                                ? 'border-red-600 bg-red-50/30'
                                : 'border-slate-300 focus:border-[#0284C7] bg-white'
                            }`}
                          />
                          {formErrors.preferredDate && (
                            <p className="mt-1 text-xs text-red-600 font-medium" role="alert">
                              {formErrors.preferredDate}
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="visit-window-select"
                            className="block text-xs font-semibold text-slate-700 mb-1.5"
                          >
                            Preferred Time Window
                          </label>
                          <select
                            id="visit-window-select"
                            value={formInput.timeWindow}
                            onChange={(e) =>
                              setFormInput({ ...formInput, timeWindow: e.target.value })
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:border-[#0284C7]"
                          >
                            <option value="11:00 AM – 1:00 PM (Morning Slot)">
                              11:00 AM – 1:00 PM (Morning Slot)
                            </option>
                            <option value="2:30 PM – 5:00 PM (Afternoon Session)">
                              2:30 PM – 5:00 PM (Afternoon Session)
                            </option>
                            <option value="5:00 PM – 7:00 PM (Evening Session)">
                              5:00 PM – 7:00 PM (Evening Session)
                            </option>
                            <option value="7:00 PM – 9:00 PM (Late Evening Slot)">
                              7:00 PM – 9:00 PM (Late Evening Slot)
                            </option>
                          </select>
                        </div>

                        <div>
                          <label
                            htmlFor="primary-service-select"
                            className="block text-xs font-semibold text-slate-700 mb-1.5"
                          >
                            Primary Dental Service *
                          </label>
                          <select
                            id="primary-service-select"
                            value={formInput.serviceId}
                            onChange={(e) =>
                              setFormInput({ ...formInput, serviceId: e.target.value })
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:border-[#0284C7]"
                          >
                            {DENTAL_SERVICES.map((svc) => (
                              <option key={svc.id} value={svc.id}>
                                {svc.title}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
                        <div className="sm:col-span-5">
                          <span className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Preferred Confirmation Channel
                          </span>
                          <div
                            className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200"
                            role="group"
                            aria-label="Preferred confirmation channel"
                          >
                            {(['WhatsApp', 'Phone Call', 'SMS'] as const).map((method) => (
                              <button
                                key={method}
                                type="button"
                                onClick={() =>
                                  setFormInput({ ...formInput, contactMethod: method })
                                }
                                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                                  formInput.contactMethod === method
                                    ? 'bg-[#0A2540] text-white'
                                    : 'text-slate-600 hover:text-slate-900'
                                }`}
                              >
                                {method}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="sm:col-span-7">
                          <label
                            htmlFor="dental-notes-input"
                            className="block text-xs font-semibold text-slate-700 mb-1.5"
                          >
                            Brief Note on Dental Concern (Optional)
                          </label>
                          <input
                            id="dental-notes-input"
                            type="text"
                            placeholder="e.g. Enquiring about clear aligners, fixed braces, or root canal"
                            value={formInput.notes}
                            onChange={(e) =>
                              setFormInput({ ...formInput, notes: e.target.value })
                            }
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0284C7]"
                          />
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <p className="text-xs text-slate-500">
                          <strong className="text-slate-700">Priority Desk:</strong> Submitting
                          reserves your slot in our daily Saddar log; you may also call{' '}
                          <span className="font-mono-tabular font-semibold">
                            {CLINIC_INFO.phoneDisplay}
                          </span>
                          .
                        </p>

                        <button
                          type="submit"
                          className="px-7 py-3.5 rounded-full bg-[#4CAF50] hover:bg-[#43A047] text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm"
                        >
                          Submit Appointment Enquiry
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                {/* Persistent Session Log of Submitted Appointments */}
                {submittedAppointments.length > 0 && (
                  <div
                    className="bg-white border border-slate-200/90 rounded-3xl p-6 space-y-3"
                    data-testid="submitted-appointments-list"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900">
                        Your Logged Appointment Requests ({submittedAppointments.length})
                      </h4>
                      <span className="text-xs text-[#0284C7] font-mono-tabular">
                        Shop #19 Daud Pota Rd
                      </span>
                    </div>
                    <div className="divide-y divide-slate-100">
                      {submittedAppointments.map((item) => (
                        <div
                          key={item.referenceCode + item.createdAt}
                          className="py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs"
                        >
                          <div>
                            <span className="font-mono-tabular font-bold text-[#0284C7]">
                              {item.referenceCode}
                            </span>
                            <span aria-hidden="true"> · </span>
                            <span className="font-semibold text-slate-900">{item.patientName}</span>
                            <span aria-hidden="true"> · </span>
                            <span className="text-slate-600">
                              {DENTAL_SERVICES.find((s) => s.id === item.serviceId)?.title ||
                                item.serviceId}
                            </span>
                          </div>
                          <div className="font-mono-tabular text-slate-500">
                            {item.preferredDate} · {item.timeWindow}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 9: FREQUENTLY ASKED QUESTIONS */}
        <section id="faq" className="scroll-mt-20 py-14 sm:py-20 bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <div className="text-xs font-semibold text-[#0284C7] mb-1">
                Common Patient Questions
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#0A2540] font-display">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-3">
              {FAQ_ITEMS.map((faq) => {
                const isExpanded = openFaqId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="rounded-2xl border border-slate-200 bg-[#F8FAFC] overflow-hidden"
                  >
                    <h3 className="m-0">
                      <button
                        type="button"
                        aria-expanded={isExpanded}
                        onClick={() => setOpenFaqId(isExpanded ? '' : faq.id)}
                        className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-slate-100/80 transition-colors cursor-pointer"
                      >
                        <div>
                          <span className="block text-[11px] font-semibold text-[#0284C7] mb-0.5">
                            {faq.category}
                          </span>
                          <span className="text-sm sm:text-base font-bold text-[#0A2540]">
                            {faq.question}
                          </span>
                        </div>
                        <ChevronDown
                          className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-150 ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                    </h3>
                    {isExpanded && (
                      <div className="px-5 pb-4 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-200/60">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECTION 10: FINAL CALL TO ACTION BANNER */}
        <section className="py-12 sm:py-16 bg-gradient-to-r from-[#081C38] via-[#0A2540] to-[#0284C7] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="text-xs font-mono-tabular text-[#86EFAC]">
                DENTAL HOUSE · SHOP #19 DAUD POTA ROAD, BOHRI BAZAR, SADDAR
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-display">
                Ready to experience warm, modern dental care in Saddar?
              </h2>
              <p className="text-sm text-sky-100">
                Call our reception desk directly at {CLINIC_INFO.phoneDisplay} or book your
                appointment online—evening hours available Monday through Saturday until 9:00 PM.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => scrollToSection('contact')}
                className="px-6 py-3.5 rounded-full bg-[#4CAF50] hover:bg-[#43A047] text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-md"
              >
                Book Appointment
              </button>
              <a
                href={`tel:${CLINIC_INFO.phoneRaw}`}
                className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 text-white text-sm font-mono-tabular font-semibold transition-colors whitespace-nowrap shrink-0"
              >
                Call {CLINIC_INFO.phoneDisplay}
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* QUIET FOOTER */}
      <footer className="bg-[#051124] text-slate-400 py-12 border-t border-slate-900 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-800/80">
            <div className="space-y-3">
              <div className="text-lg font-bold text-white font-display">Dental House</div>
              <p className="text-slate-400 leading-relaxed">
                Quality luxury orthodontic, cosmetic, dental implant, and family dentistry clinic at
                Shop #19, Daud Pota Road, Bohri Bazar, Saddar, Karachi, Pakistan.
              </p>
              <div className="font-mono-tabular text-[#86EFAC] font-semibold">
                {CLINIC_INFO.rating} / 5.0 ({CLINIC_INFO.reviewCount} Verified Reviews)
              </div>
            </div>

            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-white">Practice Navigation</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#about" className="hover:text-white transition-colors">
                    About Us & Dr. Daniyal Ahmed Khan
                  </a>
                </li>
                <li>
                  <a href="#services" className="hover:text-white transition-colors">
                    Clinical Services & Fee Guide
                  </a>
                </li>
                <li>
                  <a href="#reviews" className="hover:text-white transition-colors">
                    Verified Patient Reviews
                  </a>
                </li>
                <li>
                  <a href="#gallery" className="hover:text-white transition-colors">
                    Real Clinic Photography Tour
                  </a>
                </li>
                <li>
                  <a href="#education" className="hover:text-white transition-colors">
                    Patient Education Guides
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-white">Core Dental Services</h3>
              <ul className="space-y-2">
                {DENTAL_SERVICES.map((s) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => handleBookService(s.id)}
                      className="hover:text-white transition-colors text-left cursor-pointer"
                    >
                      {s.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-white">Location & Evening Hours</h3>
              <p className="leading-relaxed text-slate-300">{CLINIC_INFO.address}</p>
              <p className="font-mono-tabular text-[#86EFAC] font-semibold">
                <a href={`tel:${CLINIC_INFO.phoneRaw}`}>Tel: {CLINIC_INFO.phoneDisplay}</a>
              </p>
              <p className="font-mono-tabular text-slate-400">{CLINIC_INFO.timingsSummary}</p>
              <div className="pt-1">
                <a
                  href={CLINIC_INFO.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-400 hover:underline"
                >
                  Directions on Google Maps ↗
                </a>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-wrap items-center justify-between gap-4 text-slate-500">
            <p>© 2026 Dental House (Saddar, Karachi). All rights reserved.</p>
            <p>Shop #19, Daud Pota Road, Bohri Bazar, Saddar, Karachi · 0344 2730018</p>
          </div>
        </div>
      </footer>

      {/* MODAL 1: SERVICE CLINICAL PROTOCOL & PHOTOGRAPH DIALOG */}
      {inspectedService && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/75 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-service-title"
        >
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl">
            <div className="relative h-48 bg-slate-900">
              <img
                src={inspectedService.imageUrl}
                alt={inspectedService.imageAlt}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                aria-label="Close service details modal"
                onClick={() => setInspectedService(null)}
                className="absolute top-3 right-3 p-2 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <span className="text-xs font-mono-tabular font-semibold text-[#0284C7]">
                  {inspectedService.number} · {inspectedService.category}
                </span>
                <h3
                  id="modal-service-title"
                  className="text-xl font-bold text-[#0A2540] font-display mt-1"
                >
                  {inspectedService.title}
                </h3>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                {inspectedService.shortSummary}
              </p>

              <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-[#0A2540]">
                  4-Step Clinical Protocol at Dental House:
                </div>
                <ol className="space-y-1.5 text-xs text-slate-700 list-decimal list-inside">
                  {inspectedService.clinicalSteps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-100">
                  <span className="text-slate-500">Duration:</span>
                  <p className="font-mono-tabular font-semibold text-slate-900 mt-0.5">
                    {inspectedService.duration}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-100">
                  <span className="text-slate-500">Fee Guide:</span>
                  <p className="font-mono-tabular font-semibold text-[#0284C7] mt-0.5">
                    {inspectedService.feeRangePkr}
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setInspectedService(null)}
                  className="px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => handleBookService(inspectedService.id)}
                  className="px-5 py-2.5 rounded-full bg-[#4CAF50] hover:bg-[#43A047] text-white text-xs font-semibold cursor-pointer"
                >
                  Book This Service →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: GALLERY REAL PHOTOGRAPH LIGHTBOX */}
      {lightboxItem && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lightbox-bay-title"
        >
          <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl">
            <div className="relative h-72 sm:h-80 bg-slate-900">
              <img
                src={lightboxItem.imageUrl}
                alt={lightboxItem.imageAlt}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                aria-label="Close photograph inspector"
                onClick={() => setLightboxItem(null)}
                className="absolute top-3 right-3 p-2 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <span className="text-xs font-mono-tabular font-semibold text-[#0284C7]">
                  {lightboxItem.bayCode} · {lightboxItem.category}
                </span>
                <h3
                  id="lightbox-bay-title"
                  className="text-xl font-bold text-[#0A2540] font-display mt-0.5"
                >
                  {lightboxItem.title}
                </h3>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">{lightboxItem.caption}</p>

              <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs flex items-center justify-between">
                <span className="text-slate-500">Clinical Specification:</span>
                <span className="font-mono-tabular font-semibold text-slate-900">
                  {lightboxItem.equipmentSpec}
                </span>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setLightboxItem(null)}
                  className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold cursor-pointer"
                >
                  Close Photo
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLightboxItem(null);
                    scrollToSection('contact');
                  }}
                  className="px-5 py-2 rounded-full bg-[#4CAF50] hover:bg-[#43A047] text-white text-xs font-semibold cursor-pointer"
                >
                  Schedule Clinic Visit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: PATIENT EDUCATION GUIDE READER */}
      {inspectedArticle && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/75 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="education-modal-title"
        >
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl">
            <div className="relative h-48 bg-slate-900">
              <img
                src={inspectedArticle.imageUrl}
                alt={inspectedArticle.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                aria-label="Close patient education guide"
                onClick={() => setInspectedArticle(null)}
                className="absolute top-3 right-3 p-2 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <span className="text-xs font-semibold text-[#0284C7]">
                  {inspectedArticle.category} · {inspectedArticle.readTime}
                </span>
                <h3
                  id="education-modal-title"
                  className="text-xl font-bold text-[#0A2540] font-display mt-1"
                >
                  {inspectedArticle.title}
                </h3>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">{inspectedArticle.summary}</p>

              <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-[#0A2540]">Key Patient Takeaways:</div>
                <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-inside">
                  {inspectedArticle.takeaways.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setInspectedArticle(null)}
                  className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold cursor-pointer"
                >
                  Close Guide
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInspectedArticle(null);
                    scrollToSection('contact');
                  }}
                  className="px-5 py-2 rounded-full bg-[#4CAF50] hover:bg-[#43A047] text-white text-xs font-semibold cursor-pointer"
                >
                  Book Consultation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
