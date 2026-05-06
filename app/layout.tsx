import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui/ToastProvider";

export const metadata: Metadata = {
  title: "DHSUD ePermits Portal",
  description:
    "Apply for your permits and track your applications online. Fast. Transparent. Convenient.",
  keywords: ["DHSUD", "ePermits", "Philippines", "permit", "development permit"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
