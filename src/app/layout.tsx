import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Inventory App",
  description: "Aplikasi Inventory & Device Management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
