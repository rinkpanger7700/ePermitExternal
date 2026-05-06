"use client";

import React from "react";
import type { ApplicationStatus } from "@/lib/types";
import { getStatusBadgeClass } from "@/lib/utils";

interface StatusBadgeProps {
  status: ApplicationStatus | string;
  className?: string;
}

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const colorClass = getStatusBadgeClass(status as ApplicationStatus);
  return (
    <span
      className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap ${colorClass} ${className}`}
    >
      {status}
    </span>
  );
}

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "purple";
}

export function Badge({ children, className = "", variant = "default" }: BadgeProps) {
  const variants = {
    default: "bg-gray-100 text-gray-700",
    success: "bg-green-100 text-green-700",
    warning: "bg-amber-100 text-amber-700",
    danger: "bg-red-100 text-red-700",
    info: "bg-blue-100 text-blue-700",
    purple: "bg-purple-100 text-purple-700",
  };
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
