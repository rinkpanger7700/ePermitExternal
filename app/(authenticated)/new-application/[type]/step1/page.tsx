"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { useApplicationForm } from "@/context/ApplicationFormContext";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/ToastProvider";
import { Stepper } from "@/components/ui/Stepper";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { usePageTitle } from "@/context/PageTitleContext";
import { SLUG_TO_APPLICATION_TYPE, APPLICANT_TYPES } from "@/lib/constants";

const STEPS = [
  { step: 1, label: "Application Form" },
  { step: 2, label: "Requirements" },
  { step: 3, label: "Review & Submit" },
  { step: 4, label: "Payment" },
];

export default function Step1Page() {
  usePageTitle("APPLICATION FORM");
  const { type } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { formState, updateForm } = useApplicationForm();
  const { showToast } = useToast();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const applicationType = SLUG_TO_APPLICATION_TYPE[type as string];

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formState.applicantType) e.applicantType = "Applicant type is required";
    if (!formState.companyName.trim()) e.companyName = "Applicant / Company name is required";
    if (!formState.contactNumber.trim()) e.contactNumber = "Contact number is required";
    if (!formState.emailAddress.trim()) e.emailAddress = "Email address is required";
    if (!formState.projectName.trim()) e.projectName = "Project name is required";
    if (!formState.projectLocation.trim()) e.projectLocation = "Project location is required";
    return e;
  };

  const handleSaveAndContinue = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);

    try {
      if (!user) throw new Error("User not authenticated");

      let data, error;

      if (formState.applicationId) {
        // Update existing application
        const res = await supabase
          .from("applications")
          .update({
            applicant_type: formState.applicantType,
            company_name: formState.companyName,
            authorized_representative: formState.authorizedRepresentative,
            contact_number: formState.contactNumber,
            email_address: formState.emailAddress,
            project_name: formState.projectName,
            project_location: formState.projectLocation,
          })
          .eq("id", formState.applicationId)
          .select()
          .single();
        data = res.data;
        error = res.error;
      } else {
        // Create new application
        const res = await supabase
          .from("applications")
          .insert({
            applicant_id: user.id,
            application_type: applicationType,
            applicant_type: formState.applicantType,
            company_name: formState.companyName,
            authorized_representative: formState.authorizedRepresentative,
            contact_number: formState.contactNumber,
            email_address: formState.emailAddress,
            project_name: formState.projectName,
            project_location: formState.projectLocation,
            status: "Draft",
          })
          .select()
          .single();
        data = res.data;
        error = res.error;
      }

      if (error) throw new Error(error.message);
      if (!data) throw new Error("No data returned from database");

      updateForm({ applicationId: data.id, referenceNo: data.reference_no });
      showToast("success", "Saved!", "Application info saved.");
      router.push(`/new-application/${type}/step2`);
    } catch (err: any) {
      console.error("Error saving application:", err);
      showToast("error", "Save Failed", err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-6 py-6 w-full">
      {/* Stepper */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
        <Stepper steps={STEPS} currentStep={1} />
      </div>

      {/* Form */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900 mb-1">
              Application for {applicationType}
            </h2>
          </div>

          {/* Section A */}
          <div>
            <h3 className="text-base font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">
              A. Applicant Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="Applicant Type"
                required
                options={APPLICANT_TYPES.map((t) => ({ value: t, label: t }))}
                value={formState.applicantType}
                onChange={(e) => updateForm({ applicantType: e.target.value })}
                error={errors.applicantType}
                id="applicant-type"
              />
              <Input
                label="Applicant / Company Name"
                placeholder="Enter name"
                required
                value={formState.companyName}
                onChange={(e) => updateForm({ companyName: e.target.value })}
                error={errors.companyName}
                id="company-name"
              />
              <Input
                label="Authorized Representative"
                placeholder="Enter name"
                value={formState.authorizedRepresentative}
                onChange={(e) => updateForm({ authorizedRepresentative: e.target.value })}
                id="auth-representative"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Input
                label="Contact Number"
                placeholder="09XXXXXXXXX"
                required
                value={formState.contactNumber}
                onChange={(e) => updateForm({ contactNumber: e.target.value })}
                error={errors.contactNumber}
                id="contact-number"
              />
              <Input
                label="Email Address"
                type="email"
                placeholder="juan.delacruz@email.com"
                required
                value={formState.emailAddress}
                onChange={(e) => updateForm({ emailAddress: e.target.value })}
                error={errors.emailAddress}
                id="email-address"
              />
            </div>
          </div>

          {/* Section B */}
          <div>
            <h3 className="text-base font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">
              B. Project Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Project Name"
                placeholder="Enter project name"
                required
                value={formState.projectName}
                onChange={(e) => updateForm({ projectName: e.target.value })}
                error={errors.projectName}
                id="project-name"
              />
              <Input
                label="Project Location"
                placeholder="Enter project location"
                required
                value={formState.projectLocation}
                onChange={(e) => updateForm({ projectLocation: e.target.value })}
                error={errors.projectLocation}
                id="project-location"
              />
            </div>
          </div>

          {/* Footer */}
        <div className="flex justify-end pt-2">
          <Button size="lg" onClick={handleSaveAndContinue} loading={loading} id="save-continue-step1">
            Save and Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
