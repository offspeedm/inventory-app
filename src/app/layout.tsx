import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";

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
      <body>
        <div className="flex">
          <Sidebar />
          <main className="flex-1 bg-slate-50 min-h-screen">{children}</main>
        </div>
      </body>
    </html>
  );
}
