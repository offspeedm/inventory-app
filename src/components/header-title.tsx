"use client";

import { usePathname } from "next/navigation";
import { navItems } from "@/config/nav";

export function HeaderTitle() {
  const pathname = usePathname();

  // Cari menu yang cocok dengan alamat halaman saat ini
  const current = navItems.find(
    (item) => pathname === item.href || pathname.startsWith(item.href + "/")
  );

  const title = current?.title ?? "Inventory App";

  return <h1 className="text-lg font-semibold text-slate-800">{title}</h1>;
}
