import React from 'react';
import { GalleryItem } from '../utils/clinicLogic';

interface ClinicIllustrationProps {
  type: GalleryItem['illustrationType'];
  className?: string;
}

export const ClinicIllustration: React.FC<ClinicIllustrationProps> = ({
  type,
  className = 'w-full h-56',
}) => {
  switch (type) {
    case 'entrance':
      return (
        <div
          className={`relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 flex items-center justify-center ${className}`}
        >
          <svg
            viewBox="0 0 400 240"
            className="w-full h-full object-cover"
            role="img"
            aria-label="Architectural rendering of Dental House Shop #19 entrance on Daud Pota Road, Bohri Bazar, Saddar"
          >
            <defs>
              <linearGradient id="glassGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#0F766E" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#0F172A" stopOpacity="0.85" />
              </linearGradient>
            </defs>
            {/* Heritage Bohri Bazar sandstone arch frame */}
            <rect x="20" y="15" width="360" height="210" rx="8" fill="#1E293B" stroke="#334155" strokeWidth="2" />
            <rect x="40" y="28" width="320" height="44" rx="4" fill="#0F766E" />
            <text x="200" y="48" textAnchor="middle" fill="#FFFFFF" fontSize="14" fontWeight="700" fontFamily="sans-serif">
              DENTAL HOUSE · SHOP #19
            </text>
            <text x="200" y="64" textAnchor="middle" fill="#99F6E4" fontSize="9.5" fontFamily="monospace">
              DAUD POTA ROAD · BOHRI BAZAR · SADDAR, KARACHI
            </text>
            {/* Glass clinical double doors */}
            <rect x="55" y="84" width="140" height="126" rx="4" fill="url(#glassGrad)" stroke="#2DD4BF" strokeWidth="1.5" />
            <rect x="205" y="84" width="140" height="126" rx="4" fill="url(#glassGrad)" stroke="#2DD4BF" strokeWidth="1.5" />
            <line x1="182" y1="130" x2="182" y2="165" stroke="#F8FAFC" strokeWidth="3" strokeLinecap="round" />
            <line x1="218" y1="130" x2="218" y2="165" stroke="#F8FAFC" strokeWidth="3" strokeLinecap="round" />
            {/* Daily hours plate */}
            <rect x="230" y="105" width="95" height="54" rx="4" fill="#0F172A" stroke="#475569" strokeWidth="1" />
            <text x="277" y="122" textAnchor="middle" fill="#5EEAD4" fontSize="8" fontWeight="600" fontFamily="sans-serif">
              MON – SAT TIMINGS
            </text>
            <text x="277" y="136" textAnchor="middle" fill="#F8FAFC" fontSize="8.5" fontFamily="monospace">
              11:00 AM – 9:00 PM
            </text>
            <text x="277" y="150" textAnchor="middle" fill="#FDE68A" fontSize="8" fontFamily="monospace">
              TEL: 0344 2730018
            </text>
          </svg>
        </div>
      );

    case 'operatory':
      return (
        <div
          className={`relative overflow-hidden bg-gradient-to-br from-teal-950 via-slate-900 to-slate-800 flex items-center justify-center ${className}`}
        >
          <svg
            viewBox="0 0 400 240"
            className="w-full h-full object-cover"
            role="img"
            aria-label="Clinical Dental Operatory Suite with hydraulic chair and shadowless LED lamp"
          >
            <rect x="0" y="0" width="400" height="240" fill="#0F172A" />
            {/* Subtle wall grid */}
            <line x1="0" y1="190" x2="400" y2="190" stroke="#334155" strokeWidth="2" />
            {/* Overhead articulated dental LED lamp */}
            <path d="M 110 15 L 110 55 L 195 55 L 210 75" fill="none" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />
            <ellipse cx="215" cy="80" rx="26" ry="9" fill="#E2E8F0" stroke="#38BDF8" strokeWidth="2" />
            <polygon points="195,88 235,88 265,165 165,165" fill="#2DD4BF" fillOpacity="0.12" />
            {/* Ergonomic Dental Chair */}
            <path d="M 115 100 Q 135 155 180 155 L 270 155 Q 295 155 310 175" fill="none" stroke="#14B8A6" strokeWidth="18" strokeLinecap="round" />
            <rect x="175" y="158" width="50" height="32" rx="4" fill="#475569" />
            <rect x="155" y="185" width="90" height="8" rx="3" fill="#64748B" />
            {/* Chairside RVG X-Ray Monitor */}
            <rect x="285" y="65" width="80" height="52" rx="5" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.5" />
            <path d="M 310 82 C 315 74, 335 74, 340 82 C 342 94, 334 106, 330 108 C 326 100, 324 100, 320 108 C 316 106, 308 94, 310 82 Z" fill="#5EEAD4" fillOpacity="0.8" />
          </svg>
        </div>
      );

    case 'sterilization':
      return (
        <div
          className={`relative overflow-hidden bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 flex items-center justify-center ${className}`}
        >
          <svg
            viewBox="0 0 400 240"
            className="w-full h-full object-cover"
            role="img"
            aria-label="Class-B Vacuum Autoclave and Ultrasonic Instrument Sterilization Bay"
          >
            <rect x="35" y="40" width="160" height="155" rx="10" fill="#1E293B" stroke="#475569" strokeWidth="2" />
            <circle cx="105" cy="118" r="46" fill="#0F172A" stroke="#2DD4BF" strokeWidth="3" />
            <circle cx="105" cy="118" r="32" fill="none" stroke="#38BDF8" strokeWidth="1" strokeDasharray="4 4" />
            <rect x="160" y="62" width="24" height="45" rx="3" fill="#0F172A" stroke="#334155" strokeWidth="1" />
            <text x="172" y="82" textAnchor="middle" fill="#2DD4BF" fontSize="8" fontFamily="monospace">
              134°C
            </text>
            <text x="172" y="96" textAnchor="middle" fill="#F8FAFC" fontSize="6.5" fontFamily="monospace">
              CLASS-B
            </text>
            {/* Sealed Pouched Instrument Trays */}
            <rect x="225" y="52" width="140" height="62" rx="6" fill="#1E293B" stroke="#2DD4BF" strokeWidth="1.5" />
            <line x1="245" y1="72" x2="345" y2="72" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
            <line x1="245" y1="86" x2="335" y2="86" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
            <line x1="245" y1="100" x2="320" y2="100" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
            <rect x="225" y="130" width="140" height="62" rx="6" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.5" />
            <text x="295" y="160" textAnchor="middle" fill="#E2E8F0" fontSize="10" fontWeight="600" fontFamily="sans-serif">
              SEALED STERILE POUCHES
            </text>
            <text x="295" y="176" textAnchor="middle" fill="#5EEAD4" fontSize="8" fontFamily="monospace">
              100% SPORE-TESTED CYCLES
            </text>
          </svg>
        </div>
      );

    case 'lounge':
      return (
        <div
          className={`relative overflow-hidden bg-gradient-to-br from-stone-900 via-slate-900 to-teal-950 flex items-center justify-center ${className}`}
        >
          <svg
            viewBox="0 0 400 240"
            className="w-full h-full object-cover"
            role="img"
            aria-label="Air-conditioned patient waiting lounge and reception desk at Dental House"
          >
            {/* Warm minimalist reception desk & seating */}
            <rect x="35" y="45" width="145" height="90" rx="6" fill="#1E293B" stroke="#2DD4BF" strokeWidth="1.5" />
            <text x="107" y="72" textAnchor="middle" fill="#5EEAD4" fontSize="9" fontWeight="700" fontFamily="sans-serif">
              ORTHODONTIC GUIDE
            </text>
            <line x1="55" y1="88" x2="155" y2="88" stroke="#64748B" strokeWidth="2" />
            <line x1="55" y1="104" x2="145" y2="104" stroke="#64748B" strokeWidth="2" />
            <line x1="55" y1="120" x2="135" y2="120" stroke="#64748B" strokeWidth="2" />
            {/* Reception Counter */}
            <rect x="215" y="115" width="150" height="80" rx="6" fill="#0F766E" stroke="#5EEAD4" strokeWidth="1.5" />
            <rect x="230" y="130" width="120" height="50" rx="4" fill="#0F172A" />
            <text x="290" y="154" textAnchor="middle" fill="#F8FAFC" fontSize="10" fontWeight="600" fontFamily="sans-serif">
              RECEPTION DESK
            </text>
            <text x="290" y="169" textAnchor="middle" fill="#99F6E4" fontSize="8.5" fontFamily="monospace">
              APPOINTMENT CHECK-IN
            </text>
            {/* Lounge Sofa */}
            <rect x="40" y="155" width="140" height="40" rx="8" fill="#334155" stroke="#64748B" strokeWidth="1.5" />
          </svg>
        </div>
      );

    case 'ortho_bay':
      return (
        <div
          className={`relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-teal-950 flex items-center justify-center ${className}`}
        >
          <svg
            viewBox="0 0 400 240"
            className="w-full h-full object-cover"
            role="img"
            aria-label="Orthodontic Archwire & Bracket Precision Station"
          >
            {/* Archwire Curve Diagram */}
            <path
              d="M 85 180 C 85 60, 315 60, 315 180"
              fill="none"
              stroke="#2DD4BF"
              strokeWidth="4"
              strokeDasharray="6 3"
            />
            {[110, 145, 182, 218, 255, 290].map((cx, idx) => (
              <g key={idx}>
                <rect
                  x={cx - 12}
                  y={idx === 2 || idx === 3 ? 78 : idx === 1 || idx === 4 ? 96 : 126}
                  width="24"
                  height="20"
                  rx="4"
                  fill="#F8FAFC"
                  stroke="#94A3B8"
                  strokeWidth="1.5"
                />
                <rect
                  x={cx - 6}
                  y={(idx === 2 || idx === 3 ? 78 : idx === 1 || idx === 4 ? 96 : 126) + 6}
                  width="12"
                  height="8"
                  rx="1.5"
                  fill="#0284C7"
                />
              </g>
            ))}
            <text x="200" y="212" textAnchor="middle" fill="#99F6E4" fontSize="10" fontFamily="monospace">
              THERMAL NiTi ARCHWIRE & TORQUE BRACKETS
            </text>
          </svg>
        </div>
      );

    default:
      return (
        <div
          className={`relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 flex items-center justify-center ${className}`}
        >
          <svg
            viewBox="0 0 400 240"
            className="w-full h-full object-cover"
            role="img"
            aria-label="Digital RVG Dental X-Ray Sensor and Root Canal Apex Diagnostic Screen"
          >
            <rect x="65" y="30" width="270" height="180" rx="12" fill="#090D16" stroke="#2DD4BF" strokeWidth="2" />
            {/* Tooth X-ray silhouette */}
            <path
              d="M 165 65 C 165 48, 235 48, 235 65 C 242 95, 232 120, 224 165 C 218 182, 210 182, 204 140 C 198 140, 192 182, 184 182 C 174 165, 158 95, 165 65 Z"
              fill="#38BDF8"
              fillOpacity="0.22"
              stroke="#5EEAD4"
              strokeWidth="2.5"
            />
            <path
              d="M 185 85 L 184 168 M 215 85 L 218 168"
              stroke="#F43F5E"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <text x="200" y="198" textAnchor="middle" fill="#38BDF8" fontSize="9.5" fontFamily="monospace">
              DIGITAL PERIAPICAL SENSOR · 0.04s EXPOSURE
            </text>
          </svg>
        </div>
      );
  }
};
