"use client";

export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { CreditCard, Clock, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { usePageTitle } from "@/context/PageTitleContext";
import { Badge } from "@/components/ui/StatusBadge";
import { formatDateShort, formatCurrency } from "@/lib/utils";
import type { Payment } from "@/lib/types";

function PaymentStatusBadge({ status }: { status: string }) {
  if (status === "Paid") return <Badge variant="success">Paid</Badge>;
  if (status === "Expired") return <Badge variant="danger">Expired</Badge>;
  return <Badge variant="warning">Pending</Badge>;
}

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

export default function PaymentsPage() {
  usePageTitle("PAYMENTS");
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchPayments = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from("payments")
        .select("*, applications(reference_no, application_type, project_name)")
        .order("date_issued", { ascending: false });
      
      if (error) console.error("Error fetching payments:", error);
      
      setPayments(data ?? []);
      setLoading(false);
    };
    fetchPayments();
  }, [user]);

  const [selectedPayment, setSelectedPayment] = useState<any | null>(null);

  const totalPaid = payments.filter((p) => p.status === "Paid").reduce((sum, p) => sum + p.amount, 0);
  const pending = payments.filter((p) => p.status === "Pending").length;

  return (
    <div className="px-6 py-6 space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">Payments</h2>
          <p className="text-gray-500 mt-2 text-sm">View and manage your payment records.</p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm flex items-center gap-5">
            <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-gray-900">{formatCurrency(totalPaid)}</p>
              <p className="text-sm text-gray-500 mt-1">Total Paid</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm flex items-center gap-5">
            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Clock className="w-8 h-8 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-gray-900">{pending}</p>
              <p className="text-sm text-gray-500 mt-1">Pending Payments</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm flex items-center gap-5">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-gray-900">{payments.length}</p>
              <p className="text-sm text-gray-500 mt-1">Total Payments</p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-8 py-5 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900">Payment Records</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-8 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Reference No.</th>
                  <th className="text-left px-6 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Application</th>
                  <th className="text-left px-6 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount</th>
                  <th className="text-left px-6 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date Issued</th>
                  <th className="text-left px-6 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Valid Until</th>
                  <th className="text-left px-6 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)
                ) : payments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
                          <CreditCard className="w-8 h-8 text-gray-300" />
                        </div>
                        <p className="text-gray-500 font-semibold">No payments yet.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  payments.map((payment) => {
                    const app = (payment as any).applications;
                    return (
                      <tr 
                        key={payment.id} 
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => setSelectedPayment(payment)}
                      >
                        <td className="px-8 py-5 text-sm font-mono font-bold text-[#1A3A8F]">{payment.reference_no}</td>
                        <td className="px-6 py-5 text-sm text-gray-700">{app?.project_name || app?.reference_no || "—"}</td>
                        <td className="px-6 py-5 text-sm font-extrabold text-gray-900 text-base">{formatCurrency(payment.amount)}</td>
                        <td className="px-6 py-5 text-sm text-gray-500">{formatDateShort(payment.date_issued)}</td>
                        <td className="px-6 py-5 text-sm text-gray-500">{payment.valid_until ? formatDateShort(payment.valid_until) : "—"}</td>
                        <td className="px-6 py-5"><PaymentStatusBadge status={payment.status} /></td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Details Modal */}
        {selectedPayment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900">Payment Details</h3>
                <button onClick={() => setSelectedPayment(null)} className="text-gray-400 hover:text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
              <div className="px-6 py-5 space-y-4">
                {[
                  { label: "Reference Number", value: selectedPayment.reference_no },
                  { label: "Application Type", value: selectedPayment.applications?.application_type || "—" },
                  { label: "Project Name", value: selectedPayment.applications?.project_name || "—" },
                  { label: "Amount Due", value: formatCurrency(selectedPayment.amount) },
                  { label: "Date Issued", value: formatDateShort(selectedPayment.date_issued) },
                  { label: "Valid Until", value: selectedPayment.valid_until ? formatDateShort(selectedPayment.valid_until) : "—" },
                  { label: "Status", value: <PaymentStatusBadge status={selectedPayment.status} /> },
                ].map((item, i) => (
                  <div key={i} className="grid grid-cols-3 gap-4 border-b border-gray-50 pb-3 last:border-0 last:pb-0 items-center">
                    <span className="text-sm font-medium text-gray-500">{item.label}</span>
                    <span className="col-span-2 text-sm text-gray-900 font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
                <button onClick={() => setSelectedPayment(null)} className="px-6 py-2 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-gray-800">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
