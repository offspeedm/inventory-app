"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, ChevronUp, SlidersHorizontal, X } from "lucide-react";

export type FilterOption = {
  key: string;
  label: string;
  checked: boolean;
  onToggle: () => void;
};

export type FilterSection = {
  title: string;
  options: FilterOption[];
};

/**
 * Panel filter berbentuk dropdown dengan checkbox, bisa dipakai berulang
 * di halaman mana pun (User, Cabang, Devices, Troubleshooting, dll.).
 *
 * PENTING: panel dirender lewat React Portal langsung ke <body> dan
 * memakai `position: fixed` yang koordinatnya dihitung dari posisi asli
 * tombol (getBoundingClientRect). Ini membuat panel KEBAL terhadap
 * ancestor mana pun yang punya overflow-hidden/overflow-x-auto — jadi
 * tidak akan pernah lagi terpotong di sisi kanan, apa pun struktur
 * layout halaman yang membungkusnya.
 */
export function FilterDropdown({
  sections,
  activeCount,
  onReset,
}: {
  sections: FilterSection[];
  activeCount: number;
  onReset: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState({ top: 0, right: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Portal hanya boleh dirender di client (document belum ada saat SSR)
  useEffect(() => setMounted(true), []);

  function updatePosition() {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;
    setCoords({
      top: rect.bottom + 8,
      // Jarak dari tepi kanan viewport, minimal 16px agar tidak mepet layar
      right: Math.max(16, window.innerWidth - rect.right),
    });
  }

  useLayoutEffect(() => {
    if (open) updatePosition();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function handleReposition() {
      updatePosition();
    }
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        panelRef.current &&
        !panelRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setOpen(false);
      }
    }

    window.addEventListener("scroll", handleReposition, true);
    window.addEventListener("resize", handleReposition);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleReposition, true);
      window.removeEventListener("resize", handleReposition);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="shrink-0">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filter
        {activeCount > 0 && (
          <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1 text-xs font-semibold text-white">
            {activeCount}
          </span>
        )}
        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>

      {open &&
        mounted &&
        createPortal(
          <div
            ref={panelRef}
            style={{ position: "fixed", top: coords.top, right: coords.right }}
            className="z-[100] w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-slate-200 bg-white p-4 shadow-xl sm:w-80"
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-700">Filter Data</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Tutup filter"
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-80 space-y-5 overflow-y-auto pr-1">
              {sections.map((section) => (
                <div key={section.title}>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {section.title}
                  </p>
                  <div className="space-y-2">
                    {section.options.length === 0 && (
                      <p className="text-xs text-slate-400">Belum ada data.</p>
                    )}
                    {section.options.map((opt) => (
                      <label key={opt.key} className="flex items-center gap-2 text-sm text-slate-600">
                        <input
                          type="checkbox"
                          checked={opt.checked}
                          onChange={opt.onToggle}
                          className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="truncate">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {activeCount > 0 && (
              <button
                type="button"
                onClick={onReset}
                className="mt-4 w-full rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-200"
              >
                Reset Filter
              </button>
            )}
          </div>,
          document.body
        )}
    </div>
  );
}
