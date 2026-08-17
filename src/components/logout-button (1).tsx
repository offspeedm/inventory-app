"use client";

import { logout } from "@/app/login/actions";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 hover:text-red-600 transition-colors"
        title="Keluar"
      >
        <LogOut className="w-5 h-5" />
        <span className="hidden sm:inline">Keluar</span>
      </button>
    </form>
  );
}
