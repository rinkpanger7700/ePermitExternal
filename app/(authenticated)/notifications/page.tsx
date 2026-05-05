"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import Link from "next/link";
import { Bell, AlertTriangle, MessageSquare, FileCheck, Download } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNotifications } from "@/hooks/useNotifications";
import { usePageTitle } from "@/context/PageTitleContext";

const TABS = ["Notifications", "Results / Documents"] as const;
type Tab = typeof TABS[number];

const NOTIF_ICON: Record<string, { icon: React.ElementType; bg: string; color: string }> = {
  application_update: { icon: Bell,          bg: "bg-green-100",  color: "text-green-600" },
  payment_reminder:   { icon: AlertTriangle, bg: "bg-orange-100", color: "text-orange-500" },
  result_ready:       { icon: FileCheck,     bg: "bg-blue-100",   color: "text-blue-600" },
  default:            { icon: MessageSquare, bg: "bg-blue-100",   color: "text-blue-500" },
};

const NOTIF_TYPE_LABEL: Record<string, { label: string; color: string }> = {
  application_update: { label: "Application Update", color: "text-green-600" },
  payment_reminder:   { label: "Payment Reminder",   color: "text-orange-500" },
  result_ready:       { label: "Result Ready",        color: "text-blue-600" },
  default:            { label: "New Message",         color: "text-blue-500" },
};

export default function NotificationsPage() {
  usePageTitle("NOTIFICATIONS / RESULTS");
  const { user } = useAuth();
  const { notifications, markAsRead, markAllAsRead } = useNotifications(user?.id);
  const [tab, setTab] = useState<Tab>("Notifications");

  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Auto-select the first notification if none is selected
  const selected = notifications.find((n) => n.id === selectedId) || notifications[0];

  const handleSelect = (id: string) => {
    setSelectedId(id);
    markAsRead(id);
  };

  return (
    <div className="px-6 py-6">
      <div className="grid lg:grid-cols-3 gap-5">

        {/* Left: Tabs + Notification list */}
        <div className="lg:col-span-2">
          {/* Tab bar */}
          <div className="flex border-b border-gray-200 mb-4">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-5 py-3 text-sm font-semibold transition-colors border-b-2 -mb-px ${
                  tab === t
                    ? "text-[#1A3A8F] border-[#1A3A8F]"
                    : "text-gray-500 border-transparent hover:text-gray-700"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Notifications tab */}
          {tab === "Notifications" && (
            <div className="space-y-3">
              {notifications.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-xl px-6 py-12 text-center">
                  <Bell className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">No notifications yet.</p>
                </div>
              ) : (
                notifications.map((n) => {
                  const type = NOTIF_ICON[n.type as string] ?? NOTIF_ICON.default;
                  const typeLabel = NOTIF_TYPE_LABEL[n.type as string] ?? NOTIF_TYPE_LABEL.default;
                  const Icon = type.icon;
                  const isSelected = selected?.id === n.id;
                  return (
                    <div
                      key={n.id}
                      onClick={() => handleSelect(n.id)}
                      className={`flex items-start gap-4 bg-white border border-gray-200 rounded-xl px-5 py-4 cursor-pointer transition-all ${
                        isSelected ? "border-[#1A3A8F] bg-blue-50/50 shadow-sm" : "hover:border-gray-300"
                      } ${!n.is_read ? "border-l-4 border-l-[#1A3A8F]" : ""}`}
                    >
                      <div className={`w-11 h-11 ${type.bg} rounded-full flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-5 h-5 ${type.color}`} strokeWidth={1.8} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className={`text-xs font-semibold ${typeLabel.color}`}>{typeLabel.label}</span>
                            <p className="font-bold text-gray-900 text-sm mt-0.5">{n.message || n.title}</p>
                            {(n as any).reference_no && (
                              <p className="text-xs text-gray-500 mt-0.5">Reference No. <span className="font-semibold text-gray-700">{(n as any).reference_no}</span></p>
                            )}
                            <p className="text-xs text-gray-400 mt-0.5">
                              {new Date(n.created_at).toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" })}
                              {" "}
                              {new Date(n.created_at).toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                          {!n.is_read && (
                            <div className="w-2.5 h-2.5 bg-red-500 rounded-full flex-shrink-0 mt-1.5" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              {notifications.length > 0 && (
                <div className="text-center pt-1">
                  <button onClick={() => markAllAsRead()} className="text-sm text-[#2563EB] hover:underline font-medium">
                    Mark all as read
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Results tab */}
          {tab === "Results / Documents" && (
            <div className="bg-white border border-gray-200 rounded-xl px-6 py-12 text-center">
              <FileCheck className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500 font-semibold">No released permits yet.</p>
              <p className="text-gray-400 text-sm mt-1">Your permit documents will appear here once released.</p>
            </div>
          )}
        </div>

        {/* Right: Application Result panel */}
        <div className="bg-white border border-gray-200 rounded-xl px-6 py-6 h-fit sticky top-6">
          <h3 className="font-extrabold text-gray-900 mb-5">Details / Result</h3>
          
          {selected ? (
            <div className="flex flex-col items-center text-center">
              {/* Document + checkmark illustration */}
              <div className="relative mb-4">
                <div className="w-20 h-24 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex flex-col gap-1.5 items-center justify-center">
                  <div className="w-10 h-1.5 bg-gray-300 rounded" />
                  <div className="w-10 h-1.5 bg-gray-300 rounded" />
                  <div className="w-10 h-1.5 bg-gray-300 rounded" />
                </div>
                {selected.type === "result_ready" ? (
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : selected.type === "payment_reminder" ? (
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center shadow">
                    <AlertTriangle className="w-4 h-4 text-white" />
                  </div>
                ) : (
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow">
                    <Bell className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              <p className="text-sm font-bold text-gray-900 mb-2">{selected.title}</p>
              <p className="text-sm text-gray-700 mb-5">{selected.message}</p>

              {selected.type === "result_ready" && (
                <button className="w-full flex items-center justify-center gap-2 py-3 bg-[#1A3A8F] text-white text-sm font-bold rounded-xl hover:bg-[#0F2461] transition-colors mb-5">
                  <Download className="w-4 h-4" />
                  Download Permit
                </button>
              )}

              <div className="w-full space-y-3 text-left border-t border-gray-100 pt-4 mt-2">
                {[
                  { label: "Reference No.", value: (selected as any).reference_no || "—" },
                  { label: "Date Updated", value: new Date(selected.created_at).toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }) },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-xs text-gray-400">{label}</p>
                    <p className="text-sm font-bold text-gray-900">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <Bell className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-sm text-gray-400">Select a notification to view details</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
