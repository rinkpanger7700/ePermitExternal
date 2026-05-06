"use client";

import React, { useEffect } from "react";
import { X, CheckCircle, AlertTriangle, Info, XCircle } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastItemProps {
  toast: Toast;
  onClose: (id: string) => void;
}

function ToastItem({ toast, onClose }: ToastItemProps) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  const styles = {
    success: { bg: "bg-green-50 border-green-200", icon: <CheckCircle className="w-5 h-5 text-green-600" />, title: "text-green-800" },
    error: { bg: "bg-red-50 border-red-200", icon: <XCircle className="w-5 h-5 text-red-600" />, title: "text-red-800" },
    warning: { bg: "bg-amber-50 border-amber-200", icon: <AlertTriangle className="w-5 h-5 text-amber-600" />, title: "text-amber-800" },
    info: { bg: "bg-blue-50 border-blue-200", icon: <Info className="w-5 h-5 text-blue-600" />, title: "text-blue-800" },
  };

  const style = styles[toast.type];

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg max-w-sm w-full ${style.bg} animate-slide-up`}
      role="alert"
    >
      <div className="flex-shrink-0 mt-0.5">{style.icon}</div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${style.title}`}>{toast.title}</p>
        {toast.message && (
          <p className="text-sm text-gray-600 mt-0.5">{toast.message}</p>
        )}
      </div>
      <button
        onClick={() => onClose(toast.id)}
        className="text-gray-400 hover:text-gray-600 flex-shrink-0"
        aria-label="Dismiss toast"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 items-end pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} onClose={onClose} />
        </div>
      ))}
    </div>
  );
}
