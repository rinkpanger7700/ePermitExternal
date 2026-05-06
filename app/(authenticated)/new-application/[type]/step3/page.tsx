"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Folder } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { useApplicationForm } from "@/context/ApplicationFormContext";
import { Stepper } from "@/components/ui/Stepper";
import { usePageTitle } from "@/context/PageTitleContext";

const STEPS = [
  { step: 1, label: "Application Form" },
  { step: 2, label: "Requirements" },
  { step: 3, label: "Review & Submit" },
  { step: 4, label: "Payment" },
];

export default function Step3Page() {
  usePageTitle("REVIEW AND SUBMIT");
  const router = useRouter();
  const { type } = useParams<{ type: string }>();
  const { formState } = useApplicationForm();
  const [certified, setCertified] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSubmit = async () => {
    if (!certified) return;
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    const { data: app, error } = await supabase
      .from("applications")
      .update({ status: "For Payment", date_submitted: new Date().toISOString() })
      .eq("id", formState.applicationId!)
      .select()
      .single();

    if (error || !app) { setLoading(false); return; }

    // Add timeline event
    await supabase.from("application_timeline").insert({
      application_id: app.id,
      event_date: new Date().toISOString(),
      description: "Application submitted successfully.",
      stage: "Received"
    });

    // Add notification
    await supabase.from("notifications").insert({
      user_id: user.id,
      title: "Application Update",
      message: "Your application has been received and is pending payment.",
      type: "application_update",
      reference_no: app.reference_no
    });

    const { error: payError } = await supabase.from("payments").insert({
      application_id: app.id,
      reference_no: app.reference_no,
      amount: 700,
      status: "Pending",
      date_issued: new Date().toISOString(),
      valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    });

    if (payError) {
      console.error("Failed to create payment record:", payError);
      // Even if payment creation fails, we might still want to proceed to step 4,
      // but let's at least log it.
    }

    router.push(`/new-application/${type}/step4`);
  };

  return (
    <div className="px-6 py-6 w-full">
      {/* Stepper */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
        <Stepper steps={STEPS} currentStep={3} />
      </div>

      {/* Title */}
      <div className="mb-5">
        <h2 className="text-xl font-extrabold text-gray-900">Review Your Application</h2>
        <p className="text-sm text-gray-500 mt-1">
          Please review your information and uploaded documents before submission.
        </p>
      </div>

      {/* Application Information Card */}
      <div className="bg-white border border-gray-200 rounded-xl mb-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">Application Information</h3>
          <button
            onClick={() => router.push(`/new-application/${type}/step1`)}
            className="px-4 py-1.5 text-sm font-semibold text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Edit
          </button>
        </div>
        <div className="px-6 py-4 space-y-3">
          {[
            { label: "Application Type", value: formState.applicantType || "—" },
            { label: "Applicant / Company", value: formState.companyName || formState.authorizedRepresentative || "—" },
            { label: "Project Name", value: formState.projectName || "—" },
            { label: "Project Location", value: formState.projectLocation || "—" },
            { label: "Date of Application", value: new Date().toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" }) },
          ].map(({ label, value }) => (
            <div key={label} className="flex gap-8">
              <span className="text-sm text-gray-500 w-44 flex-shrink-0">{label}</span>
              <span className="text-sm font-medium text-gray-800">{value}</span>
            </div>
          ))}
        </div>

        {/* Requirements row */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center gap-2.5">
            <Folder className="w-5 h-5 text-[#1A3A8F]" strokeWidth={1.8} />
            <span className="font-semibold text-gray-800 text-sm">Requirements</span>
            <span className="text-sm text-gray-500 ml-1">Documents uploaded</span>
          </div>
          <button
            onClick={() => router.push(`/new-application/${type}/step2`)}
            className="px-4 py-1.5 text-sm font-semibold text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            View All
          </button>
        </div>
      </div>

      {/* Certification Checkbox */}
      <label className="flex items-start gap-3 mb-6 cursor-pointer">
        <div className="relative mt-0.5 flex-shrink-0">
          <input
            type="checkbox"
            checked={certified}
            onChange={(e) => setCertified(e.target.checked)}
            className="sr-only"
            id="certify-checkbox"
          />
          <div
            className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-colors ${
              certified ? "bg-[#1A3A8F] border-[#1A3A8F]" : "bg-white border-gray-300"
            }`}
          >
            {certified && (
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        </div>
        <span className="text-sm text-gray-700 leading-relaxed">
          I hereby certify that all information provided is true and correct to the best of my knowledge.
          I understand that any false information may be ground for disapproval of my application.
        </span>
      </label>

      {/* Action Buttons */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push(`/new-application/${type}/step2`)}
          className="px-8 py-3 font-bold text-gray-700 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={!certified || loading}
          className="flex-1 py-3 font-bold text-white bg-[#1A3A8F] rounded-xl hover:bg-[#0F2461] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? "Submitting..." : "Submit Application"}
        </button>
      </div>
    </div>
  );
}
