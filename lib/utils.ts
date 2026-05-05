import type { ApplicationStatus, RequirementStatus } from "./types";

export function formatDate(dateString?: string | null): string {
  if (!dateString) return "—";
  return new Intl.DateTimeFormat("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
}

export function formatDateShort(dateString?: string | null): string {
  if (!dateString) return "—";
  return new Intl.DateTimeFormat("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateString));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function getStatusBadgeClass(status: ApplicationStatus): string {
  const map: Record<ApplicationStatus, string> = {
    Draft: "bg-gray-100 text-gray-600",
    "For Payment": "bg-amber-100 text-amber-700",
    Received: "bg-blue-100 text-blue-700",
    "Ongoing Evaluation": "bg-blue-100 text-blue-700",
    "Ongoing Inspection": "bg-purple-100 text-purple-700",
    "Ongoing Approval": "bg-indigo-100 text-indigo-700",
    Released: "bg-green-100 text-green-700",
    Disapproved: "bg-red-100 text-red-700",
  };
  return map[status] ?? "bg-gray-100 text-gray-600";
}

export function getRequirementStatusClass(status: RequirementStatus): string {
  const map: Record<RequirementStatus, string> = {
    Compliant: "text-green-600",
    "Incorrect File": "text-amber-600",
    Missing: "text-red-600",
  };
  return map[status] ?? "text-gray-500";
}

export function getStageIndex(status: ApplicationStatus): number {
  const stages: ApplicationStatus[] = [
    "Received",
    "Ongoing Evaluation",
    "Ongoing Inspection",
    "Ongoing Approval",
    "Released",
  ];
  return stages.indexOf(status);
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}
