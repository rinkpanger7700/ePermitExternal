"use client";

import { ApplicationFormProvider } from "@/context/ApplicationFormContext";

export default function NewApplicationTypeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ApplicationFormProvider>{children}</ApplicationFormProvider>;
}
