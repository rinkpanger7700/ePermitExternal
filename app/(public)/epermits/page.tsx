import Link from "next/link";
import Image from "next/image";
import {
  FileText,
  CreditCard,
  Search,
  Download,
  Home,
  ChevronRight,
  Grid2X2,
  Info,
} from "lucide-react";
import { createClient } from "@/lib/supabase-server";

const features = [
  {
    icon: FileText,
    title: "Apply Online",
    description:
      "Submit your application and complete requirements entirely online—no need to visit our office.",
  },
  {
    icon: CreditCard,
    title: "Pay Online",
    description:
      "Secure, convenient payments via LANDBank LinkBiz portal or QR code.",
  },
  {
    icon: Search,
    title: "Track Status",
    description:
      "Monitor your application progress in real time from anywhere.",
  },
  {
    icon: Download,
    title: "Get Results",
    description:
      "Receive instant notifications and download your permit when it's ready.",
  },
];

export default async function ePermitsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-hidden">
      {/* ── TOP NAV ── */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-8 xl:px-16 h-20 flex items-center gap-6">
          {/* Logo */}
          <Link href="/home" id="epermits-nav-logo" className="flex items-center gap-4 flex-shrink-0">
            <div className="w-14 h-14 relative flex-shrink-0">
              <Image
                src="/dhsud-logo.png"
                alt="DHSUD Official Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">
                DHSUD
              </p>
              <p className="text-xl font-extrabold text-[#1A3A8F]">
                eServices Portal
              </p>
            </div>
            <div className="w-px h-11 bg-gray-200 mx-2" />
            <span className="text-3xl font-extrabold text-[#2563EB]">
              ePermits
            </span>
          </Link>

          {/* Nav links */}
          <nav
            className="hidden lg:flex items-center gap-2 flex-1 justify-end mr-4"
            aria-label="ePermits navigation"
          >
            <Link
              href="/home"
              id="epermits-nav-home"
              className="px-5 py-2 text-sm text-gray-600 hover:text-[#1A3A8F] transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              href="/epermits#about"
              id="epermits-nav-about"
              className="px-5 py-2 text-sm text-gray-600 hover:text-[#1A3A8F] transition-colors font-medium"
            >
              About ePermits
            </Link>
            <Link
              href="/epermits#requirements"
              id="epermits-nav-requirements"
              className="px-5 py-2 text-sm text-gray-600 hover:text-[#1A3A8F] transition-colors font-medium"
            >
              Requirements
            </Link>
            <Link
              href="/help"
              id="epermits-nav-help"
              className="px-5 py-2 text-sm text-gray-600 hover:text-[#1A3A8F] transition-colors font-medium"
            >
              Help
            </Link>
          </nav>

          {/* Auth buttons */}
          <div className="flex items-center gap-4 ml-auto">
            <Link
              href="/login"
              id="epermits-nav-login"
              className="px-6 py-2.5 text-sm font-semibold text-[#1A3A8F] border-2 border-[#1A3A8F] rounded-xl hover:bg-[#EFF6FF] transition-colors"
            >
              Login
            </Link>
            <Link
              href="/login?tab=register"
              id="epermits-nav-register"
              className="px-6 py-2.5 text-sm font-semibold text-white bg-[#1A3A8F] rounded-xl hover:bg-[#0F2461] transition-colors shadow-md"
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO SECTION ── */}
      <section className="bg-[#EFF6FF] flex-1 relative">
        {/* Breadcrumb */}
        <div className="max-w-[1600px] mx-auto px-8 xl:px-16 pt-5">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-gray-500">
            <Link href="/home" id="breadcrumb-home" className="flex items-center gap-1 hover:text-[#1A3A8F] transition-colors">
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <Link href="/home" id="breadcrumb-services" className="hover:text-[#1A3A8F] transition-colors">Services</Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-[#1A3A8F] font-semibold">ePermits</span>
          </nav>
        </div>

        <div className="max-w-[1600px] mx-auto px-8 xl:px-16 py-14 flex flex-col lg:flex-row items-center gap-16 min-h-[520px]">
          {/* Left */}
          <div className="flex-1 max-w-xl z-10">
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold text-gray-900 leading-[1.1] mb-4">
              Apply for your permits and track your applications online.
            </h1>
            <p className="text-lg font-bold text-[#1A3A8F] mb-3">
              Fast. Transparent. Convenient.
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed text-sm max-w-md">
              ePermits is a service under the DHSUD eServices Portal that allows
              you to apply and track the status of your permit applications online.
            </p>

            {/* Row 1: Apply + Track Status */}
            <div className="flex items-center gap-3 mb-3">
              <Link
                href="/login?tab=register"
                id="epermits-apply-btn"
                className="px-8 py-3 bg-[#1A3A8F] text-white font-bold rounded-lg hover:bg-[#0F2461] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 text-sm"
              >
                Apply
              </Link>
              <Link
                href="/login"
                id="epermits-track-btn"
                className="px-8 py-3 text-[#1A3A8F] font-bold border-2 border-[#1A3A8F] rounded-lg hover:bg-[#EFF6FF] transition-all text-sm"
              >
                Track Status
              </Link>
            </div>

            {/* Row 2: BHDP Calculator */}
            <div className="mb-2">
              <Link
                href="/bhdp-calculator"
                id="epermits-bhdp-btn"
                className="inline-flex items-center gap-2.5 px-8 py-3 bg-[#F5A623] text-white font-bold rounded-lg hover:bg-[#E09510] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 text-sm w-full sm:w-auto justify-center"
              >
                <Grid2X2 className="w-4 h-4" />
                BHDP Calculator
              </Link>
            </div>

            {/* Info text */}
            <p className="flex items-center gap-1.5 text-xs text-[#2563EB] font-medium">
              <Info className="w-3.5 h-3.5 flex-shrink-0" />
              Compute BHDP fees instantly, even without logging in.
            </p>
          </div>

          {/* Right — Illustration */}
          <div className="flex-1 flex justify-center lg:justify-end absolute right-0 bottom-0 opacity-20 lg:opacity-100 lg:relative lg:flex lg:items-center">
            <div className="relative w-full max-w-2xl transform lg:scale-[1.10] lg:translate-x-12 xl:translate-x-20 -translate-y-4">
              <div className="absolute inset-0 bg-[#DBEAFE] rounded-full opacity-60 blur-[80px]" />
              <Image
                src="/hero-illustration.png"
                alt="ePermits Portal on Laptop"
                width={900}
                height={700}
                className="relative object-contain z-10 mix-blend-multiply"
                priority
              />
            </div>
          </div>
        </div>

        {/* ── FEATURE CARDS ── */}
        <div className="max-w-[1600px] mx-auto px-8 xl:px-16 pb-24 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="bg-white rounded-3xl p-10 text-center shadow-md border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                >
                  <div className="w-20 h-20 bg-[#EFF6FF] rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-10 h-10 text-[#1A3A8F]" />
                  </div>
                  <h3 className="font-extrabold text-gray-900 mb-3 text-lg">
                    {feature.title}
                  </h3>
                  <p className="text-base text-gray-500 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
