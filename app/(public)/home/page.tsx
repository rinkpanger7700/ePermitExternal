"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Search, MapPin } from "lucide-react";

/* ─── Service definitions ─── */
const services = [
  {
    id: "e4ph",
    name: "e4PH",
    description: "4PH submissions, tracking, coordination, and reporting.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" aria-hidden="true">
        <rect x="8" y="4" width="28" height="36" rx="3" stroke="#1A3A8F" strokeWidth="2.5" fill="none"/>
        <line x1="14" y1="14" x2="30" y2="14" stroke="#1A3A8F" strokeWidth="2"/>
        <line x1="14" y1="20" x2="30" y2="20" stroke="#1A3A8F" strokeWidth="2"/>
        <line x1="14" y1="26" x2="24" y2="26" stroke="#1A3A8F" strokeWidth="2"/>
        <text x="7" y="44" fontSize="9" fontWeight="700" fill="#1A3A8F">4PH</text>
      </svg>
    ),
    href: "#",
  },
  {
    id: "epermits",
    name: "ePermits",
    description: "Permits, clearances, certifications, and approvals online.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" aria-hidden="true">
        <rect x="8" y="4" width="28" height="36" rx="3" stroke="#1A3A8F" strokeWidth="2.5" fill="none"/>
        <line x1="14" y1="14" x2="30" y2="14" stroke="#1A3A8F" strokeWidth="2"/>
        <line x1="14" y1="20" x2="30" y2="20" stroke="#1A3A8F" strokeWidth="2"/>
        <line x1="14" y1="26" x2="22" y2="26" stroke="#1A3A8F" strokeWidth="2"/>
        <circle cx="33" cy="33" r="8" fill="#1A3A8F"/>
        <polyline points="29,33 32,36 38,30" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
    ),
    href: "/epermits",
  },
  {
    id: "emaps",
    name: "eMaps",
    description: "Zoning, land use, hazard, and project maps.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" aria-hidden="true">
        <path d="M8 10 L18 7 L30 11 L40 8 L40 38 L30 41 L18 37 L8 40 Z" stroke="#1A3A8F" strokeWidth="2.5" fill="none"/>
        <line x1="18" y1="7" x2="18" y2="37" stroke="#1A3A8F" strokeWidth="1.5"/>
        <line x1="30" y1="11" x2="30" y2="41" stroke="#1A3A8F" strokeWidth="1.5"/>
        <path d="M21 22 C21 18 27 18 27 22 C27 26 24 30 24 30 C24 30 21 26 21 22Z" stroke="#1A3A8F" strokeWidth="2" fill="none"/>
        <circle cx="24" cy="22" r="2" fill="#1A3A8F"/>
      </svg>
    ),
    href: "#",
  },
  {
    id: "ehoa",
    name: "eHOA",
    description: "HOA registration, monitoring, compliance, and reporting.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" aria-hidden="true">
        <path d="M24 8 L10 20 L10 40 L20 40 L20 30 L28 30 L28 40 L38 40 L38 20 Z" stroke="#1A3A8F" strokeWidth="2.5" fill="none"/>
        <circle cx="18" cy="16" r="3" stroke="#1A3A8F" strokeWidth="2" fill="none"/>
        <circle cx="24" cy="13" r="3" stroke="#1A3A8F" strokeWidth="2" fill="none"/>
        <circle cx="30" cy="16" r="3" stroke="#1A3A8F" strokeWidth="2" fill="none"/>
      </svg>
    ),
    href: "#",
  },
  {
    id: "ehousing-registry",
    name: "eHousing Registry",
    description: "Unified housing data for planning and validation.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" aria-hidden="true">
        <rect x="6" y="8" width="36" height="32" rx="3" stroke="#1A3A8F" strokeWidth="2.5" fill="none"/>
        <rect x="12" y="14" width="10" height="10" rx="1" stroke="#1A3A8F" strokeWidth="2" fill="none"/>
        <rect x="26" y="14" width="10" height="4" rx="1" stroke="#1A3A8F" strokeWidth="2" fill="none"/>
        <rect x="26" y="22" width="10" height="4" rx="1" stroke="#1A3A8F" strokeWidth="2" fill="none"/>
        <line x1="12" y1="30" x2="36" y2="30" stroke="#1A3A8F" strokeWidth="2"/>
        <line x1="12" y1="35" x2="28" y2="35" stroke="#1A3A8F" strokeWidth="2"/>
      </svg>
    ),
    href: "#",
  },
  {
    id: "ehousing-hub",
    name: "eHousing Hub",
    description: "Housing knowledge, policies, and reference resources.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" aria-hidden="true">
        <path d="M8 36 C8 36 8 12 8 12 Q8 8 12 8 L36 8 Q40 8 40 12 L40 36 Q40 40 36 40 L12 40 Q8 40 8 36Z" stroke="#1A3A8F" strokeWidth="2.5" fill="none"/>
        <path d="M14 16 Q14 12 24 12 Q34 12 34 18 Q34 24 24 24" stroke="#1A3A8F" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        <circle cx="24" cy="32" r="2.5" fill="#1A3A8F"/>
      </svg>
    ),
    href: "#",
  },
  {
    id: "ecitizen",
    name: "eCitizen",
    description: "Complaints, suggestions, inquiries, and commendations.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" aria-hidden="true">
        <path d="M8 12 Q8 8 12 8 L36 8 Q40 8 40 12 L40 30 Q40 34 36 34 L28 34 L20 42 L20 34 L12 34 Q8 34 8 30 Z" stroke="#1A3A8F" strokeWidth="2.5" fill="none"/>
        <circle cx="18" cy="21" r="2" fill="#1A3A8F"/>
        <circle cx="24" cy="21" r="2" fill="#1A3A8F"/>
        <circle cx="30" cy="21" r="2" fill="#1A3A8F"/>
      </svg>
    ),
    href: "#",
  },
];

/* ─── Services Modal ─── */
function ServicesModal({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");

  const filtered = services.filter(
    (s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(10,30,80,0.45)", backdropFilter: "blur(2px)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Explore DHSUD Digital Services"
    >
      {/* Modal panel */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          id="services-modal-close"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors z-10"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="px-8 pt-8 pb-4 text-center">
          <h2 className="text-2xl font-extrabold text-[#1A3A8F] mb-1">
            Explore DHSUD Digital Services
          </h2>
          <p className="text-sm text-gray-500">
            Choose a service to apply, access information, submit documents, or track requests.
          </p>
        </div>

        {/* Search */}
        <div className="px-8 pb-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              id="services-search"
              type="text"
              placeholder="Search services by name or keyword..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3A8F] focus:border-transparent text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Service cards grid */}
        <div className="px-8 pb-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filtered.map((svc) => (
              <div
                key={svc.id}
                id={`service-card-${svc.id}`}
                className="border border-gray-200 rounded-xl p-4 flex flex-col items-center text-center gap-2 hover:border-[#1A3A8F] hover:shadow-md transition-all duration-200 group"
              >
                <div className="w-14 h-14 flex items-center justify-center mb-1">
                  {svc.icon}
                </div>
                <h3 className="font-bold text-[#1A3A8F] text-sm leading-tight">{svc.name}</h3>
                <p className="text-xs text-gray-500 leading-snug flex-1">{svc.description}</p>
                <Link
                  href={svc.href}
                  id={`open-service-${svc.id}`}
                  className="mt-1 px-4 py-1.5 text-xs font-semibold text-white bg-[#1A3A8F] rounded-md hover:bg-[#0F2461] transition-colors w-full text-center"
                  onClick={onClose}
                >
                  Open Service
                </Link>
              </div>
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="text-center text-gray-400 py-8 text-sm">
              No services found matching &ldquo;{query}&rdquo;.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Landing Page ─── */
export default function HomePage() {
  const [showServices, setShowServices] = useState(false);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── NAVBAR ── */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 h-[72px] flex items-center gap-4">

          {/* Logo */}
          <Link href="/home" id="nav-logo" className="flex items-center gap-3 flex-shrink-0">
            <div className="w-12 h-12 relative flex-shrink-0">
              <Image
                src="/dhsud-logo.png"
                alt="DHSUD Official Seal"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-lg font-extrabold text-[#1A3A8F] leading-tight">
              DHSUD <span className="font-semibold text-gray-600">eServices Portal</span>
            </span>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center" aria-label="Main navigation">
            <Link
              href="/home"
              id="nav-home"
              className="px-4 py-2 text-sm font-semibold text-[#1A3A8F] border-b-2 border-[#1A3A8F] transition-colors"
            >
              Home
            </Link>
            <button
              id="nav-services"
              onClick={() => setShowServices(true)}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-[#1A3A8F] transition-colors border-b-2 border-transparent hover:border-[#1A3A8F]"
            >
              Services
            </button>
            <Link
              href="#about"
              id="nav-about"
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-[#1A3A8F] transition-colors border-b-2 border-transparent hover:border-[#1A3A8F]"
            >
              About
            </Link>
            <Link
              href="/help"
              id="nav-help"
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-[#1A3A8F] transition-colors border-b-2 border-transparent hover:border-[#1A3A8F]"
            >
              Help
            </Link>
          </nav>

          {/* Auth buttons */}
          <div className="flex items-center gap-3 ml-auto">
            <Link
              href="/login"
              id="nav-login"
              className="px-5 py-2 text-sm font-semibold text-[#1A3A8F] border-2 border-[#1A3A8F] rounded-lg hover:bg-[#EFF6FF] transition-colors"
            >
              Login
            </Link>
            <Link
              href="/login?tab=register"
              id="nav-register"
              className="px-5 py-2 text-sm font-semibold text-white bg-[#1A3A8F] rounded-lg hover:bg-[#0F2461] transition-colors shadow-sm"
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO SECTION ── */}
      <main
        className="flex-1 relative overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #EBF2FF 0%, #DBEAFE 40%, #C7D8F8 100%)",
          minHeight: "calc(100vh - 72px)",
        }}
      >
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(26,58,143,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(26,58,143,0.05) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12 h-full flex items-center pt-16 pb-0 min-h-[calc(100vh-72px)]">
          {/* Left — Text content */}
          <div className="flex-1 max-w-xl z-10 pb-20">
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold text-[#0F2461] leading-[1.1] mb-4">
              Access DHSUD<br />services online
            </h1>
            <p className="text-base text-gray-600 mb-8 leading-relaxed max-w-sm">
              One portal for key DHSUD digital services, applications, tracking, payments, and results.
            </p>
            <button
              id="hero-explore-btn"
              onClick={() => setShowServices(true)}
              className="inline-flex items-center px-8 py-4 bg-[#1A3A8F] text-white font-bold rounded-xl hover:bg-[#0F2461] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-base"
            >
              Explore Services
            </button>
          </div>

          {/* Right — Hero illustration fills the right side and bottom */}
          <div className="absolute right-0 bottom-0 w-[55%] xl:w-[58%] h-full flex items-end justify-end pointer-events-none select-none">
            <Image
              src="/hero-cityscape.png"
              alt="DHSUD City Blueprint Illustration"
              width={1100}
              height={800}
              className="object-contain object-bottom w-full h-full"
              priority
              style={{ mixBlendMode: "multiply", opacity: 0.92 }}
            />
          </div>

          {/* Map location pins decorative */}
          <div className="absolute bottom-12 left-[38%] z-10 pointer-events-none">
            <MapPin className="w-6 h-6 text-[#1A3A8F] opacity-60 animate-bounce" style={{ animationDelay: "0.2s" }} />
          </div>
          <div className="absolute bottom-28 left-[45%] z-10 pointer-events-none">
            <MapPin className="w-5 h-5 text-[#2563EB] opacity-50 animate-bounce" style={{ animationDelay: "0.6s" }} />
          </div>
        </div>
      </main>

      {/* ── SERVICES MODAL ── */}
      {showServices && <ServicesModal onClose={() => setShowServices(false)} />}
    </div>
  );
}
