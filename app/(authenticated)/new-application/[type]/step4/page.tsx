"use client";

export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { CheckCircle, Info } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { useApplicationForm } from "@/context/ApplicationFormContext";
import { Stepper } from "@/components/ui/Stepper";
import { usePageTitle } from "@/context/PageTitleContext";
import { formatCurrency } from "@/lib/utils";
import type { Application, Payment } from "@/lib/types";

const STEPS = [
  { step: 1, label: "Application Form" },
  { step: 2, label: "Requirements" },
  { step: 3, label: "Review & Submit" },
  { step: 4, label: "Payment" },
];

export default function Step4Page() {
  usePageTitle("PAYMENT STATUS");
  const { type } = useParams<{ type: string }>();
  const router = useRouter();
  const { formState } = useApplicationForm();
  const supabase = createClient();

  const [app, setApp] = useState<Application | null>(null);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    if (!formState.applicationId) return;
    const fetchData = async () => {
      const [appRes, payRes] = await Promise.all([
        supabase.from("applications").select("*").eq("id", formState.applicationId!).single(),
        supabase.from("payments").select("*").eq("application_id", formState.applicationId!).order("date_issued", { ascending: false }).limit(1).single(),
      ]);
      setApp(appRes.data);
      setPayment(payRes.data);
    };
    fetchData();
  }, [formState.applicationId]);

  const handlePayNow = async () => {
    setPaying(true);
    await new Promise((r) => setTimeout(r, 1500));
    
    if (payment) {
      await supabase.from("payments").update({ status: "Paid" }).eq("id", payment.id);
    } else {
      // Create it if it was missing
      await supabase.from("payments").insert({
        application_id: formState.applicationId,
        reference_no: app?.reference_no,
        amount: 700,
        status: "Paid",
        date_issued: new Date().toISOString(),
        valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }
    
    await supabase.from("applications").update({ status: "Ongoing Evaluation" }).eq("id", formState.applicationId!);

    // Insert timeline updates
    await supabase.from("application_timeline").insert([
      {
        application_id: formState.applicationId,
        event_date: new Date().toISOString(),
        description: "Payment confirmed. Evaluation is in progress.",
        stage: "Evaluation"
      },
      {
        application_id: formState.applicationId,
        event_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        description: "For inspection (schedule to be advised).",
        stage: "Inspection"
      }
    ]);

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      // Add notification
      await supabase.from("notifications").insert({
        user_id: user.id,
        title: "Application Update",
        message: "Payment confirmed. Your application is now under Ongoing Evaluation.",
        type: "application_update",
        reference_no: app?.reference_no
      });
    }

    setPaid(true);
    setPaying(false);
    setTimeout(() => router.push("/dashboard"), 2000);
  };

  const fmt = (d?: string) =>
    d ? new Date(d).toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" }) : "—";

  return (
    <div className="px-6 py-6 w-full">
      {/* Stepper */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
        <Stepper steps={STEPS} currentStep={4} />
      </div>

      {/* Success banner */}
      <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-4 mb-6 flex items-start gap-3">
        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-green-800">Your application has been submitted successfully!</p>
          <p className="text-sm text-green-700 mt-1">
            Reference Number: <span className="font-semibold">{app?.reference_no || "—"}</span>
          </p>
          <p className="text-sm text-green-700">
            Date Submitted: <span className="font-semibold">{fmt(app?.date_submitted)}</span>
          </p>
        </div>
      </div>

      {/* Two-column: Order of Payment + QR */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Order of Payment */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-extrabold text-gray-900 mb-5">Order of Payment</h3>
          <div className="space-y-4">
            {[
              { label: "Reference No.", value: payment?.reference_no || app?.reference_no || "—" },
              { label: "Amount Due", value: payment ? formatCurrency(payment.amount) : "₱700.00" },
              { label: "Date Issued", value: fmt(payment?.date_issued || new Date().toISOString()) },
              { label: "Valid Until", value: fmt(payment?.valid_until || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()) },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{label}</span>
                <span className="text-sm font-semibold text-gray-800">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* QR Code / Pay Now */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center gap-3">
          <p className="text-sm font-semibold text-gray-700">Scan to Pay via LinkBiz</p>
          <div className="w-36 h-36 relative">
            <Image
              src="/qr-placeholder.png"
              alt="QR Code for payment"
              fill
              className="object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            {/* Fallback QR pattern */}
            <div className="w-36 h-36 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
              <span className="text-xs text-gray-400">QR Code</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 font-medium">OR</p>
          {paid ? (
            <div className="w-full py-3 text-center font-bold text-white bg-green-500 rounded-xl">
              Payment Confirmed ✓
            </div>
          ) : (
            <button
              onClick={handlePayNow}
              disabled={paying}
              className="w-full py-3 font-bold text-white bg-[#1A3A8F] rounded-xl hover:bg-[#0F2461] transition-colors disabled:opacity-60"
            >
              {paying ? "Processing..." : "Pay Now"}
            </button>
          )}
        </div>
      </div>

      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-700">
          After payment, please wait for confirmation. You will receive a notification once your payment is verified.
        </p>
      </div>
    </div>
  );
}
