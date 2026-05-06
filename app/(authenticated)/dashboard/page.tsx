"use client";

export const dynamic = 'force-dynamic';

import Link from "next/link";
import Image from "next/image";
import { usePageTitle } from "@/context/PageTitleContext";
import { useAuth } from "@/hooks/useAuth";
import { useApplications } from "@/hooks/useApplications";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDateShort } from "@/lib/utils";
import { APPLICATION_TYPE_SHORT } from "@/lib/constants";
import type { ApplicationType } from "@/lib/types";
import { Eye } from "lucide-react";

// Icons using the requested PNG files
const icons = {
  total: (
    <Image src="/docCheck.png" alt="Total Applications" width={64} height={64} className="object-contain" />
  ),
  payment: (
    <Image src="/clock.png" alt="For Payment" width={64} height={64} className="object-contain" />
  ),
  evaluation: (
    <Image src="/people.png" alt="Ongoing Evaluation" width={64} height={64} className="object-contain" />
  ),
  inspection: (
    <Image src="/helmet.png" alt="Ongoing Inspection" width={64} height={64} className="object-contain" />
  ),
  approval: (
    <Image src="/stamp.png" alt="Ongoing Approval" width={64} height={64} className="object-contain" />
  ),
  released: (
    <Image src="/check-mark.png" alt="Released" width={64} height={64} className="object-contain" />
  ),
};

const STAT_CARDS = [
  { key: "total", label: "Total Applications", icon: icons.total },
  { key: "forPayment", label: "For Payment", icon: icons.payment },
  { key: "ongoingEvaluation", label: "Ongoing Evaluation", icon: icons.evaluation },
  { key: "ongoingInspection", label: "Ongoing Inspection", icon: icons.inspection },
  { key: "ongoingApproval", label: "Ongoing Approval", icon: icons.approval },
  { key: "released", label: "Released", icon: icons.released },
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
