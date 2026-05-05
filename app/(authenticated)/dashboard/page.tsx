"use client";

export const dynamic = 'force-dynamic';

import Link from "next/link";
import { usePageTitle } from "@/context/PageTitleContext";
import { useAuth } from "@/hooks/useAuth";
import { useApplications } from "@/hooks/useApplications";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDateShort } from "@/lib/utils";
import { APPLICATION_TYPE_SHORT } from "@/lib/constants";
import type { ApplicationType } from "@/lib/types";
import { Eye } from "lucide-react";

// Outline icon SVGs matching the screenshot style
const icons = {
  total: (
    <svg className="w-11 h-11 text-[#1A3A8F]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 3v5a1 1 0 001 1h5" />
    </svg>
  ),
  payment: (
    <svg className="w-11 h-11 text-[#1A3A8F]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 3" />
    </svg>
  ),
  evaluation: (
    <svg className="w-11 h-11 text-[#1A3A8F]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  inspection: (
    <svg className="w-11 h-11 text-[#1A3A8F]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  approval: (
    <svg className="w-11 h-11 text-[#1A3A8F]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  ),
  released: (
    <svg className="w-11 h-11 text-[#1A3A8F]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

const STAT_CARDS = [
  { key: "total",             label: "Total Applications",  icon: icons.total },
  { key: "forPayment",        label: "For Payment",         icon: icons.payment },
  { key: "ongoingEvaluation", label: "Ongoing Evaluation",  icon: icons.evaluation },
  { key: "ongoingInspection", label: "Ongoing Inspection",  icon: icons.inspection },
  { key: "ongoingApproval",   label: "Ongoing Approval",    icon: icons.approval },
  { key: "released",          label: "Released",            icon: icons.released },
] as const;

export default function DashboardPage() {
  usePageTitle("CLIENT DASHBOARD");
  const { user } = useAuth();
  const { applications, loading, stats } = useApplications(user?.id);

  return (
    <div className="px-10 py-9">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 mb-10">
        {STAT_CARDS.map(({ key, label, icon }) => (
          <div key={key} className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col items-center text-center gap-3 hover:shadow-md transition-shadow">
            {icon}
            <p className="text-sm text-gray-500 font-medium leading-tight">{label}</p>
            <p className="text-4xl font-extrabold text-gray-900">{(stats as any)[key] ?? 0}</p>
          </div>
        ))}
      </div>

      {/* Applications Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="px-8 py-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">My Applications</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-base">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-8 py-4 font-semibold text-gray-600">Reference No.</th>
                <th className="text-left px-5 py-4 font-semibold text-gray-600">Application Type</th>
                <th className="text-left px-5 py-4 font-semibold text-gray-600">Project Name</th>
                <th className="text-left px-5 py-4 font-semibold text-gray-600">Status</th>
                <th className="text-left px-5 py-4 font-semibold text-gray-600">Last Updated</th>
                <th className="text-left px-5 py-4 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-8 py-5">
                        <div className="h-5 bg-gray-100 rounded animate-pulse w-3/4" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-gray-400 text-base">
                    No applications yet.
                    <Link href="/new-application" className="ml-2 text-[#1A3A8F] font-semibold hover:underline">Apply now</Link>
                  </td>
                </tr>
              ) : (
                applications.slice(0, 5).map((app) => (
                  <tr key={app.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-8 py-5 font-semibold text-gray-800 font-mono text-sm">
                      {app.reference_no || "—"}
                    </td>
                    <td className="px-5 py-5 text-gray-700">
                      {APPLICATION_TYPE_SHORT[app.application_type as ApplicationType] || app.application_type}
                    </td>
                    <td className="px-5 py-5 text-gray-700">{app.project_name || "—"}</td>
                    <td className="px-5 py-5"><StatusBadge status={app.status} /></td>
                    <td className="px-5 py-5 text-gray-500">{formatDateShort(app.updated_at)}</td>
                    <td className="px-5 py-5">
                      <Link href={`/applications/${app.id}`} className="text-[#1A3A8F] hover:text-[#0F2461] transition-colors">
                        <Eye className="w-6 h-6" strokeWidth={1.8} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-8 py-5 border-t border-gray-100 text-center">
          <Link href="/applications" className="text-[#2563EB] font-semibold text-base hover:underline">
            View all applications →
          </Link>
        </div>
      </div>
    </div>
  );
}
