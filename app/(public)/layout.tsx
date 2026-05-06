import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ePermits — DHSUD eServices Portal",
  description:
    "ePermits is the online platform of DHSUD that allows you to apply, pay, and track your permit applications.",
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
