"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase";
import type { Application } from "@/lib/types";

export function useApplications(userId?: string) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchApplications = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const { data } = await supabase
      .from("applications")
      .select("*")
      .eq("applicant_id", userId)
      .order("updated_at", { ascending: false });
    setApplications(data ?? []);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchApplications();

    if (!userId) return;

    const channelId = `applications-channel-${userId}-${Math.random()}`;
    const channel = supabase
      .channel(channelId)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "applications",
          filter: `applicant_id=eq.${userId}`,
        },
        () => {
          fetchApplications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, fetchApplications]);

  const stats = {
    total: applications.length,
    forPayment: applications.filter((a) => a.status === "For Payment").length,
    ongoingEvaluation: applications.filter((a) => a.status === "Ongoing Evaluation").length,
    ongoingInspection: applications.filter((a) => a.status === "Ongoing Inspection").length,
    ongoingApproval: applications.filter((a) => a.status === "Ongoing Approval").length,
    released: applications.filter((a) => a.status === "Released").length,
  };

  return { applications, loading, stats, refetch: fetchApplications };
}
