"use client";

import { useSidebar } from "@/components/sidebar-context";
import { Menu } from "lucide-react";

export function HeaderMenuButton() {
  const { setMobileOpen } = useSidebar();

  return (
    <button
      onClick={() => setMobileOpen(true)}
      className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
      aria-label="Buka menu"
    >
      <Menu className="w-6 h-6" />
    </button>
  );
}
