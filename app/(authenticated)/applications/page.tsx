"use client";

export const dynamic = 'force-dynamic';

import Link from "next/link";
import { Eye, FileText, PlusCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useApplications } from "@/hooks/useApplications";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { usePageTitle } from "@/context/PageTitleContext";
import { formatDateShort } from "@/lib/utils";
import { APPLICATION_TYPE_SHORT } from "@/lib/constants";
import type { ApplicationType } from "@/lib/types";

function SkeletonRow() {
  return (
    <tr>
      {[...Array(6)].map((_, i) => (
        <td key={i} className="px-8 py-5">
          <div className="h-4 bg-gray-100 rounded animate-pulse" />
        </td>
      ))}
    </tr>
  );
}

export default function ApplicationsPage() {
  usePageTitle("MY APPLICATIONS");
  const { user } = useAuth();
  const { applications, loading } = useApplications(user?.id);

  return (
    <div className="px-6 py-6">

      <div className="p-8 lg:p-12">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900">All Applications</h2>
            <p className="text-gray-500 mt-1.5 text-sm">Track all your permit applications here.</p>
          </div>
          <Link
            href="/new-application"
            className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#1A3A8F] text-white text-sm font-semibold rounded-xl hover:bg-[#0F2461] transition-colors shadow-md"
          >
            <PlusCircle className="w-5 h-5" />
            New Application
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-8 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Reference No.</th>
                  <th className="text-left px-6 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Application Type</th>
                  <th className="text-left px-6 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Project Name</th>
                  <th className="text-left px-6 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="text-left px-6 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date Submitted</th>
                  <th className="text-left px-6 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                ) : applications.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-8 py-24 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center">
                          <FileText className="w-10 h-10 text-gray-300" />
                        </div>
                        <div>
                          <p className="text-gray-500 font-semibold text-base">No applications found</p>
                          <p className="text-gray-400 text-sm mt-1">You haven&apos;t filed any permit applications yet.</p>
                        </div>
                        <Link
                          href="/new-application"
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1A3A8F] text-white text-sm font-semibold rounded-xl hover:bg-[#0F2461] transition-colors"
                        >
                          <PlusCircle className="w-4 h-4" />
                          Start Application
                        </Link>
                      </div>
                    </td>
                  </tr>
                ) : (
                  applications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-8 py-5 text-sm font-mono font-bold text-[#1A3A8F]">
                        {app.reference_no || <span className="text-gray-300 italic font-sans font-normal">Pending</span>}
                      </td>
                      <td className="px-6 py-5 text-sm text-gray-700">
                        {APPLICATION_TYPE_SHORT[app.application_type as ApplicationType] || app.application_type}
                      </td>
                      <td className="px-6 py-5 text-sm text-gray-700">{app.project_name || "—"}</td>
                      <td className="px-6 py-5">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="px-6 py-5 text-sm text-gray-500">
                        {app.date_submitted ? formatDateShort(app.date_submitted) : "—"}
                      </td>
                      <td className="px-6 py-5">
                        <Link
                          href={`/applications/${app.id}`}
                          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#1A3A8F] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
