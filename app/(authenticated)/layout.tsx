"use client";

export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { PageTitleProvider, useCurrentTitle } from "@/context/PageTitleContext";
import { Sidebar } from "@/components/layout/Sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useNotifications } from "@/hooks/useNotifications";
import Image from "next/image";
import Link from "next/link";
import { Bell, ChevronDown, User } from "lucide-react";

// Inner layout reads title from context
function LayoutInner({ children }: { children: React.ReactNode }) {
  const { profile, user } = useAuth();
  const { unreadCount } = useNotifications(user?.id);
  const title = useCurrentTitle();

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* ── Full-width dark page title bar ── */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[64px] bg-[#0F2461] flex items-center px-10">
        <h1 className="text-white font-extrabold text-base uppercase tracking-[0.18em]">
          {title}
        </h1>
      </div>

      {/* ── Sidebar ── */}
      <Sidebar unreadCount={unreadCount} />

      {/* ── TopNav ── */}
      <header className="fixed top-[64px] left-0 lg:left-[260px] right-0 h-[80px] z-30 bg-white border-b border-gray-200 flex items-center px-10 gap-4">
        {/* Mobile spacer */}
        <div className="lg:hidden w-12" />

        {/* Left: ePermits brand */}
        <div className="flex items-center gap-4 flex-1">
          {/* Logo visible on mobile */}
          <div className="lg:hidden flex items-center gap-2">
            <div className="w-10 h-10 relative">
              <Image src="/dhsud-logo.png" alt="DHSUD" fill className="object-contain" />
            </div>
          </div>
          <span className="text-3xl font-extrabold text-[#2563EB]">ePermits</span>
        </div>

        {/* Right: Bell + divider + user */}
        <div className="flex items-center gap-5">
          <Link href="/notifications" className="relative p-2.5 text-gray-500 hover:text-[#1A3A8F] transition-colors">
            <Bell className="w-7 h-7" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
            )}
          </Link>

          <div className="w-px h-10 bg-gray-200" />

          <Link href="/account" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-[#EFF6FF] rounded-full flex items-center justify-center border border-[#DBEAFE]">
              <User className="w-6 h-6 text-[#1A3A8F]" />
            </div>
            <div className="hidden sm:block">
              <p className="text-base font-semibold text-gray-900 leading-tight">
                {profile?.full_name?.split(" ")[0] || "Applicant"}
              </p>
              <p className="text-sm text-gray-400 capitalize">Applicant</p>
            </div>
            <ChevronDown className="w-5 h-5 text-gray-400 hidden sm:block" />
          </Link>
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="lg:pl-[260px] pt-[144px] min-h-screen">
        {children}
      </main>
    </div>
  );
}

import { SessionTimeout } from "@/components/ui/SessionTimeout";

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <PageTitleProvider>
      <SessionTimeout />
      <LayoutInner>{children}</LayoutInner>
    </PageTitleProvider>
  );
}
