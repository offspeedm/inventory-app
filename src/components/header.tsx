"use client";

import { usePathname } from "next/navigation";
import { navItems } from "@/config/nav";
import { useSidebar } from "@/components/sidebar-context";
import { Menu, UserCircle2 } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const { setMobileOpen } = useSidebar();

  // Cari judul halaman dari daftar menu
  const current = navItems.find(
    (item) => pathname === item.href || pathname.startsWith(item.href + "/"),
  );
  const title = current?.title ?? "Inventory App";

  return (
    <header className="flex items-center justify-between h-16 px-4 md:px-6 bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        {/* Tombol menu (hanya tampil di HP/tablet) */}
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Buka menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold text-slate-800">{title}</h1>
      </div>

      {/* Profil user */}
      <div className="flex items-center gap-2">
        <div className="text-right hidden sm:block leading-tight">
          <p className="text-sm font-medium text-slate-800">Chairul Imam</p>
          <p className="text-xs text-slate-500">Administrator</p>
        </div>
        <UserCircle2 className="w-9 h-9 text-slate-400" />
      </div>
    </header>
  );
}
