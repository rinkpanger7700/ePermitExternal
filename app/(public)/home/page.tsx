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
    icon: <Image src="/4ph.png" alt="4PH" width={80} height={80} className="object-contain" />,
    href: "#",
  },
  {
    id: "epermits",
    name: "ePermits",
    description: "Permits, clearances, certifications, and approvals online.",
    icon: <Image src="/ePermit.png" alt="ePermits" width={80} height={80} className="object-contain" />,
    href: "/epermits",
  },
  {
    id: "emaps",
    name: "eMaps",
    description: "Zoning, land use, hazard, and project maps.",
    icon: <Image src="/eMaps.png" alt="eMaps" width={80} height={80} className="object-contain" />,
    href: "#",
  },
  {
    id: "ehoa",
    name: "eHOA",
    description: "HOA registration, monitoring, compliance, and reporting.",
    icon: <Image src="/eHoa.png" alt="eHOA" width={80} height={80} className="object-contain" />,
    href: "#",
  },
  {
    id: "ehousing-registry",
    name: "eHousing Registry",
    description: "Unified housing data for planning and validation.",
    icon: <Image src="/eRegistry.png" alt="eHousing Registry" width={80} height={80} className="object-contain" />,
    href: "#",
  },
  {
    id: "ehousing-hub",
    name: "eHousing Hub",
    description: "Housing knowledge, policies, and reference resources.",
    icon: <Image src="/eHousing.png" alt="eHousing Hub" width={80} height={80} className="object-contain" />,
    href: "#",
  },
  {
    id: "ecitizen",
    name: "eCitizen",
    description: "Complaints, suggestions, inquiries, and commendations.",
    icon: <Image src="/eCitizen.png" alt="eCitizen" width={80} height={80} className="object-contain" />,
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
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          id="services-modal-close"
          onClick={onClose}
          className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors z-10"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="px-8 pt-8 pb-4 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A3A8F] mb-2">
            Explore DHSUD Digital Services
          </h2>
          <p className="text-base md:text-lg text-gray-500">
            Choose a service to apply, access information, submit documents, or track requests.
          </p>
        </div>

        {/* Search */}
        <div className="px-8 pb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
            <input
              id="services-search"
              type="text"
              placeholder="Search services by name or keyword..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-4 rounded-xl border border-gray-200 text-base focus:outline-none focus:ring-2 focus:ring-[#1A3A8F] focus:border-transparent text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>

        <div className="px-8 pb-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {filtered.map((svc) => (
              <div
                key={svc.id}
                id={`service-card-${svc.id}`}
                className="border border-gray-200 rounded-2xl p-6 flex flex-col items-center text-center gap-3 hover:border-[#1A3A8F] hover:shadow-lg transition-all duration-200 group"
              >
                <div className="w-24 h-24 flex items-center justify-center mb-2">
                  {svc.icon}
                </div>
                <h3 className="font-bold text-[#1A3A8F] text-lg leading-tight">{svc.name}</h3>
                <p className="text-sm text-gray-500 leading-snug flex-1">{svc.description}</p>
                <Link
                  href={svc.href}
                  id={`open-service-${svc.id}`}
                  className="mt-2 px-6 py-2.5 text-sm font-bold text-white bg-[#1A3A8F] rounded-lg hover:bg-[#0F2461] transition-colors w-full text-center"
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
          backgroundImage: "url('/backgroundimage.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
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
