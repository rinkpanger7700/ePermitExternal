"use client";

export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FileText, Folder, Printer, X, Download } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TrackingStepper } from "@/components/ui/Stepper";
import { usePageTitle } from "@/context/PageTitleContext";
import { useToast } from "@/components/ui/ToastProvider";
import { formatDateShort, getStageIndex } from "@/lib/utils";
import type { Application, ApplicationTimeline } from "@/lib/types";

const STAGES = ["Received", "Evaluation", "Inspection", "Approval", "Release"];

export default function ApplicationDetailPage() {
  usePageTitle("TRACK APPLICATION");
  const { id } = useParams();
  const { showToast } = useToast();
  const [app, setApp] = useState<Application | null>(null);
  const [timeline, setTimeline] = useState<ApplicationTimeline[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [showAppModal, setShowAppModal] = useState(false);
  const [showDocsModal, setShowDocsModal] = useState(false);
  const [requirements, setRequirements] = useState<any[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  
  const supabase = createClient();

  useEffect(() => {
    const fetch = async () => {
      const [a, t] = await Promise.all([
        supabase.from("applications").select("*").eq("id", id).single(),
        supabase.from("application_timeline").select("*").eq("application_id", id).order("event_date"),
      ]);
      setApp(a.data); setTimeline(t.data ?? []); setLoading(false);
    };
    fetch();
    const channelId = `app-${id}-${Math.random()}`;
    const ch = supabase.channel(channelId)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "applications", filter: `id=eq.${id}` },
        (p) => setApp(p.new as Application))
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [id]);

  const handleAction = async (action: string) => {
    if (action === "View Application") {
      setShowAppModal(true);
    } else if (action === "View Documents") {
      setShowDocsModal(true);
      setLoadingDocs(true);
      const { data } = await supabase.from("requirements").select("*").eq("application_id", id);
      setRequirements(data || []);
      setLoadingDocs(false);
    } else if (action === "Download Receipt") {
      showToast("success", "Downloading...", "Your receipt is being generated and downloaded.");
    }
  };

  const downloadDoc = async (filePath: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage.from("permit-documents").createSignedUrl(filePath, 60);
      if (error) throw error;
      window.open(data.signedUrl, "_blank");
    } catch (err) {
      showToast("error", "Error", "Could not open document.");
    }
  };

  const trackingSteps = STAGES.map((label, i) => {
    const idx = getStageIndex(app?.status ?? "Draft");
    const done = idx > i;
    const active = idx === i;
    const event = timeline[i];
    return {
      label,
      status: done ? ("completed" as const) : active ? ("active" as const) : ("pending" as const),
      date: event ? formatDateShort(event.event_date) : undefined,
    };
  });

  const fmt = (d?: string) => d ? new Date(d).toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" }) : "—";

  if (loading) {
    return (
      <div className="px-6 py-6 space-y-4">
        {[1, 2, 3].map((i) => <div key={i} className="h-28 bg-white rounded-xl animate-pulse border border-gray-200" />)}
      </div>
    );
  }

  if (!app) {
    return (
      <div className="px-6 py-6">
        <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
          <p className="text-gray-400">Application not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-6 space-y-5">
      {/* Section header */}
      <h2 className="text-xl font-extrabold text-gray-900">My Application</h2>

      {/* Info card */}
      <div className="bg-white border border-gray-200 rounded-xl px-6 py-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { label: "Reference Number", value: <span className="font-extrabold text-gray-900">{app.reference_no || "—"}</span> },
            { label: "Application Type", value: <span className="font-extrabold text-gray-900">{app.application_type}</span> },
            { label: "Date Submitted", value: <span className="font-extrabold text-gray-900">{fmt(app.date_submitted)}</span> },
            { label: "Status", value: <StatusBadge status={app.status} /> },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs text-gray-400 font-medium mb-1">{label}</p>
              {value}
            </div>
          ))}
        </div>
      </div>

      {/* Application Progress */}
      <div>
        <h3 className="text-lg font-extrabold text-gray-900 mb-4">Application Progress</h3>
        <div className="bg-white border border-gray-200 rounded-xl px-6 py-6">
          <TrackingStepper steps={trackingSteps} />
        </div>
      </div>

      {/* Two-column: Timeline + Actions */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Timeline */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl px-6 py-5">
          <h3 className="font-extrabold text-gray-900 mb-4">Timeline / Status Updates</h3>
          {timeline.length === 0 ? (
            <p className="text-sm text-gray-400">No updates yet.</p>
          ) : (
            <div className="space-y-0">
              {timeline.map((ev, i) => {
                const isLast = i === timeline.length - 1;
                const isActive = i === timeline.length - 2;
                return (
                  <div key={ev.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full flex-shrink-0 mt-1 ${isLast ? "bg-gray-300" : isActive ? "bg-blue-500" : "bg-green-500"}`} />
                      {!isLast && <div className="w-px flex-1 bg-gray-200 my-1" />}
                    </div>
                    <div className="pb-4">
                      <p className="text-xs text-gray-400 font-medium">
                        {new Date(ev.event_date).toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" })}
                        {" "}
                        {new Date(ev.event_date).toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                      <p className="text-sm text-gray-800 font-medium mt-0.5">{ev.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="bg-white border border-gray-200 rounded-xl px-6 py-5">
          <h3 className="font-extrabold text-gray-900 mb-4">Actions</h3>
          <div className="space-y-3">
            {[
              { icon: FileText, label: "View Application", color: "text-[#1A3A8F]", bg: "bg-blue-50" },
              { icon: Folder,   label: "View Documents",   color: "text-blue-600",  bg: "bg-blue-50" },
              { icon: Printer,  label: "Download Receipt", color: "text-blue-600",  bg: "bg-blue-50" },
            ].map(({ icon: Icon, label, color, bg }) => (
              <button
                key={label}
                onClick={() => handleAction(label)}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border border-gray-200 hover:border-[#1A3A8F] hover:bg-blue-50 transition-all text-left group"
              >
                <div className={`w-8 h-8 ${bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-4 h-4 ${color}`} strokeWidth={1.8} />
                </div>
                <span className="text-sm font-semibold text-gray-700 group-hover:text-[#1A3A8F]">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Application Details Modal */}
      {showAppModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Application Details</h3>
              <button onClick={() => setShowAppModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
              {[
                { label: "Applicant Type", value: app.applicant_type },
                { label: "Company Name", value: app.company_name },
                { label: "Authorized Rep.", value: app.authorized_representative },
                { label: "Contact Number", value: app.contact_number },
                { label: "Email Address", value: app.email_address },
                { label: "Project Name", value: app.project_name },
                { label: "Project Location", value: app.project_location },
              ].map((item, i) => (
                <div key={i} className="grid grid-cols-3 gap-4 border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                  <span className="text-sm font-medium text-gray-500">{item.label}</span>
                  <span className="col-span-2 text-sm text-gray-900 font-semibold">{item.value || "—"}</span>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button onClick={() => setShowAppModal(false)} className="px-6 py-2 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-gray-800">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Documents Modal */}
      {showDocsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Submitted Documents</h3>
              <button onClick={() => setShowDocsModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
              {loadingDocs ? (
                <p className="text-sm text-gray-500 text-center py-8">Loading documents...</p>
              ) : requirements.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">No documents found.</p>
              ) : (
                <div className="space-y-3">
                  {requirements.map((req) => (
                    <div key={req.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:border-blue-200 transition-colors">
                      <div>
                        <p className="text-sm font-bold text-gray-800">{req.requirement_name}</p>
                        <p className="text-xs text-gray-500">{req.file_name}</p>
                      </div>
                      <button
                        onClick={() => downloadDoc(req.file_path, req.file_name)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" /> Open
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button onClick={() => setShowDocsModal(false)} className="px-6 py-2 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-gray-800">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
