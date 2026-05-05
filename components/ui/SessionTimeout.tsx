"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

const TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes

export function SessionTimeout() {
  const router = useRouter();
  const { logout } = useAuth();
  
  const resetTimeout = useCallback(() => {
    // Only update if we're running in the browser
    if (typeof window !== 'undefined') {
      localStorage.setItem("lastActivity", Date.now().toString());
    }
  }, []);

  useEffect(() => {
    // Set initial activity
    resetTimeout();

    // Events to track user activity
    const events = [
      "mousemove",
      "mousedown",
      "keypress",
      "DOMMouseScroll",
      "mousewheel",
      "touchmove",
      "MSPointerMove",
    ];

    // Attach event listeners
    events.forEach((event) => {
      window.addEventListener(event, resetTimeout);
    });

    // Check for inactivity every minute
    const interval = setInterval(() => {
      const lastActivity = localStorage.getItem("lastActivity");
      if (lastActivity) {
        const timeSinceLastActivity = Date.now() - parseInt(lastActivity, 10);
        if (timeSinceLastActivity > TIMEOUT_MS) {
          // Timeout reached, log out
          logout();
        }
      }
    }, 60 * 1000);

    return () => {
      // Cleanup
      events.forEach((event) => {
        window.removeEventListener(event, resetTimeout);
      });
      clearInterval(interval);
    };
  }, [logout, resetTimeout]);

  // This component doesn't render anything
  return null;
}
