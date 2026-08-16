"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, Boxes } from "lucide-react";
import { navItems } from "@/config/nav";

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={
        (collapsed ? "w-20" : "w-64") +
        " min-h-screen bg-slate-900 text-slate-100 flex flex-col transition-all duration-300 ease-in-out"
      }
    >
      {/* Header / Logo */}
      <div className="flex items-center gap-2 h-16 px-4 border-b border-slate-700">
        <Boxes className="h-7 w-7 text-blue-400 shrink-0" />
        {!collapsed && (
          <span className="text-lg font-bold whitespace-nowrap">
            Inventory App
          </span>
        )}
      </div>

      {/* Menu */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          const baseClass =
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors";
          const stateClass = isActive
            ? "bg-blue-600 text-white"
            : "text-slate-300 hover:bg-slate-800 hover:text-white";
          const alignClass = collapsed ? "justify-center" : "";
          const linkClass = baseClass + " " + stateClass + " " + alignClass;

          return (
            <Link key={item.href} href={item.href} className={linkClass}>
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && (
                <span className="whitespace-nowrap">{item.title}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Tombol Collapse */}
      <div className="p-2 border-t border-slate-700">
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="flex items-center justify-center w-full gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <ChevronLeft
            className={
              "h-5 w-5 transition-transform " + (collapsed ? "rotate-180" : "")
            }
          />
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
