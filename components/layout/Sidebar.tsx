"use client";

export const dynamic = 'force-dynamic';

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, FileText, PlusCircle, CreditCard,
  Bell, User, HelpCircle, LogOut, Menu, X,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const NAV = [
  { label: "Dashboard",       href: "/dashboard",       icon: LayoutDashboard },
  { label: "My Applications", href: "/applications",    icon: FileText },
  { label: "New Application", href: "/new-application", icon: PlusCircle },
  { label: "Payments",        href: "/payments",        icon: CreditCard },
  { label: "Notifications",   href: "/notifications",   icon: Bell },
  { label: "My Account",      href: "/account",         icon: User },
  { label: "Help & Support",  href: "/help",            icon: HelpCircle },
];

export function Sidebar({ unreadCount = 0 }: { unreadCount?: number }) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => pathname.startsWith(href);

  const Inner = () => (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Logo */}
      <div className="px-6 pt-6 pb-6 border-b border-gray-100">
        <Link href="/dashboard" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <div className="w-14 h-14 relative flex-shrink-0">
            <Image src="/dhsud-logo.png" alt="DHSUD" fill className="object-contain" priority />
          </div>
          <div className="leading-tight">
            <p className="text-lg font-extrabold text-[#1A3A8F]">DHSUD</p>
            <p className="text-xs text-gray-500 font-medium">eServices Portal</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-4 space-y-1">
        {NAV.map(({ label, href, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href} href={href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? "bg-[#EFF6FF] text-[#1A3A8F] font-semibold"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${active ? "text-[#1A3A8F]" : "text-gray-400"}`} strokeWidth={active ? 2.2 : 1.8} />
              <span className="text-[15px]">{label}</span>
              {label === "Notifications" && unreadCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-4 pb-5 border-t border-gray-100 pt-3">
        <button
          onClick={logout}
          className="flex items-center gap-3.5 px-4 py-3 w-full rounded-xl text-[15px] font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-5 h-5 text-gray-400" strokeWidth={1.8} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:flex flex-col fixed top-[64px] left-0 bottom-0 w-[260px] bg-white border-r border-gray-200 z-40">
        <Inner />
      </aside>

      {/* Mobile toggle */}
      <button
        className="lg:hidden fixed top-[70px] left-3 z-50 bg-white border border-gray-200 p-2.5 rounded-xl shadow-sm"
        onClick={() => setOpen(!open)}
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {open && <div className="lg:hidden fixed inset-0 bg-black/40 z-40 top-[64px]" onClick={() => setOpen(false)} />}

      <aside className={`lg:hidden fixed top-[64px] left-0 bottom-0 w-[260px] bg-white border-r border-gray-200 z-50 transition-transform duration-200 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <Inner />
      </aside>
    </>
  );
}
