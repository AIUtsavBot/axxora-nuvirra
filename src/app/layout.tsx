import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nuvirra Ops CRM",
  description: "Internal CRM for Nuvirra conversations, orders, support, and content workflows.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
