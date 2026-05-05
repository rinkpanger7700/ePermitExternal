"use client";

export const dynamic = 'force-dynamic';

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Upload, CheckCircle, AlertTriangle, XCircle, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { useApplicationForm } from "@/context/ApplicationFormContext";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/ToastProvider";
import { Stepper } from "@/components/ui/Stepper";
import { Button } from "@/components/ui/Button";
import { usePageTitle } from "@/context/PageTitleContext";
import { SLUG_TO_APPLICATION_TYPE, REQUIREMENTS_MAP } from "@/lib/constants";
import type { RequirementStatus } from "@/lib/types";

const STEPS = [
  { step: 1, label: "Application Form" },
  { step: 2, label: "Requirements" },
  { step: 3, label: "Review & Submit" },
  { step: 4, label: "Payment" },
];

interface RequirementRow {
  name: string;
  fileName?: string;
  filePath?: string;
  fileSize?: number;
  status: RequirementStatus;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function StatusIcon({ status }: { status: RequirementStatus }) {
  if (status === "Compliant") return <CheckCircle className="w-5 h-5 text-green-500" />;
  if (status === "Incorrect File") return <AlertTriangle className="w-5 h-5 text-amber-500" />;
  return <XCircle className="w-5 h-5 text-red-500" />;
}

export default function Step2Page() {
  usePageTitle("REQUIREMENTS UPLOAD");
  const { type } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { formState } = useApplicationForm();
  const { showToast } = useToast();
  const supabase = createClient();

  const applicationType = SLUG_TO_APPLICATION_TYPE[type as string];
  const requirementNames = REQUIREMENTS_MAP[applicationType] ?? [];

  const [rows, setRows] = useState<RequirementRow[]>(
    requirementNames.map((name) => ({ name, status: "Missing" }))
  );
  const [uploading, setUploading] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Load existing requirements if we are returning to this step
  useEffect(() => {
    const fetchRequirements = async () => {
      const appId = formState.applicationId;
      if (!appId) return;

      const { data, error } = await supabase
        .from("requirements")
        .select("*")
        .eq("application_id", appId);

      if (error || !data || data.length === 0) return;

      setRows((prev) =>
        prev.map((r) => {
          const existing = data.find((d) => d.requirement_name === r.name);
          if (existing) {
            return {
              ...r,
              fileName: existing.file_name,
              filePath: existing.file_path,
              fileSize: existing.file_size,
              status: existing.status as RequirementStatus,
            };
          }
          return r;
        })
      );
    };

    fetchRequirements();
  }, [formState.applicationId, supabase]);

  const handleUpload = async (index: number, file: File) => {
    // Validate
    const isValidType = file.type === "application/pdf" || file.type.startsWith("image/");
    const isValidSize = file.size <= MAX_FILE_SIZE;

    if (!isValidType || !isValidSize) {
      setRows((prev) =>
        prev.map((r, i) =>
          i === index ? { ...r, fileName: file.name, status: "Incorrect File", fileSize: file.size } : r
        )
      );
      return;
    }

    setUploading(index);
    const appId = formState.applicationId;
    const slug = requirementNames[index].toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    
    // Preserve original file extension
    const extension = file.name.split('.').pop() || "pdf";
    const filePath = `${user!.id}/${appId}/${slug}.${extension}`;

    const { error } = await supabase.storage
      .from("permit-documents")
      .upload(filePath, file, { upsert: true });

    if (error) {
      showToast("error", "Upload Failed", error.message);
      setUploading(null);
      return;
    }

    setRows((prev) =>
      prev.map((r, i) =>
        i === index
          ? { ...r, fileName: file.name, filePath, fileSize: file.size, status: "Compliant" }
          : r
      )
    );
    showToast("success", "Uploaded!", `${file.name} uploaded successfully.`);
    setUploading(null);
  };

  const allCompliant = rows.every((r) => r.status === "Compliant");
  const hasIssues = rows.some((r) => r.status !== "Compliant");

  const handleSaveAndContinue = async () => {
    if (!allCompliant) return;
    const appId = formState.applicationId;
    if (!appId) { showToast("error", "Error", "Application ID missing. Go back to step 1."); return; }

    setSaving(true);

    try {
      // Delete existing requirements to prevent duplicates
      await supabase.from("requirements").delete().eq("application_id", appId);

      // Save requirements to DB
      const inserts = rows.map((r) => ({
        application_id: appId,
        requirement_name: r.name,
        file_name: r.fileName,
        file_path: r.filePath,
        file_size: r.fileSize,
        status: r.status,
        uploaded_at: new Date().toISOString(),
      }));

      const { error } = await supabase.from("requirements").insert(inserts);
      if (error) throw new Error(error.message);

      showToast("success", "Requirements saved!");
      router.push(`/new-application/${type}/step3`);
    } catch (err: any) {
      console.error("Save error:", err);
      showToast("error", "Save Failed", err.message || "An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="px-6 py-6 w-full">
      {/* Stepper */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
        <Stepper steps={STEPS} currentStep={2} />
      </div>

        {/* Instructions */}
        <p className="text-gray-600 text-sm mb-4">
          Please upload the required documents. The system will automatically check if your uploads are complete and correct.
        </p>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-5">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase w-8">#</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Requirement</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">File Upload</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase w-44">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rows.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-400 font-medium">{i + 1}.</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">{row.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          accept=".pdf,image/*"
                          ref={(el) => { fileInputRefs.current[i] = el; }}
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleUpload(i, file);
                          }}
                          id={`file-upload-${i}`}
                        />
                        <button
                          onClick={() => fileInputRefs.current[i]?.click()}
                          disabled={uploading === i}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#1A3A8F] border border-[#1A3A8F] rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          {uploading === i ? "Uploading..." : "Upload"}
                        </button>
                        {row.fileName && (
                          <span className="text-xs text-gray-500 truncate max-w-32">{row.fileName}</span>
                        )}
                        {!row.fileName && (
                          <span className="text-xs text-gray-300">—</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <StatusIcon status={row.status} />
                        <div>
                          <span
                            className={`text-xs font-semibold ${
                              row.status === "Compliant"
                                ? "text-green-600"
                                : row.status === "Incorrect File"
                                ? "text-amber-600"
                                : "text-red-600"
                            }`}
                          >
                            {row.status}
                          </span>
                          {row.status === "Incorrect File" && (
                            <p className="text-[10px] text-gray-400">Expected PDF/Image (Max. 10MB)</p>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Error banner */}
        {hasIssues && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-sm font-semibold text-red-700">
              Please complete or correct the requirements with issues before proceeding.
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => router.push(`/new-application/${type}/step1`)} id="back-step2">
            Back
          </Button>
          <Button
            onClick={handleSaveAndContinue}
            disabled={!allCompliant}
            loading={saving}
            id="save-continue-step2"
          >
            Save and Continue
          </Button>
      </div>
    </div>
  );
}
