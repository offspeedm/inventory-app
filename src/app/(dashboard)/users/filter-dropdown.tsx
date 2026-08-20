"use client";

import { useEffect, useRef, useState } from "react";
import { SlidersHorizontal, ChevronDown, X } from "lucide-react";

type Opsi = { value: string; label: string };

type Grup = {
  judul: string;
  opsi: Opsi[];
  terpilih: string[];
  onChange: (values: string[]) => void;
};

export function FilterDropdown({ grup }: { grup: Grup[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Tutup dropdown saat klik di luar area
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const totalTerpilih = grup.reduce((sum, g) => sum + g.terpilih.length, 0);

  function toggleValue(g: Grup, value: string) {
    if (g.terpilih.includes(value)) {
      g.onChange(g.terpilih.filter((v) => v !== value));
    } else {
      g.onChange([...g.terpilih, value]);
    }
  }

  function resetSemua() {
    grup.forEach((g) => g.onChange([]));
  }

  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={
          "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap " +
          (totalTerpilih > 0
            ? "border-indigo-300 bg-indigo-50 text-indigo-700"
            : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50")
        }
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filter
        {totalTerpilih > 0 && (
          <span className="inline-flex items-center justify-center rounded-full bg-indigo-600 text-white text-[11px] font-semibold w-5 h-5">
            {totalTerpilih}
          </span>
        )}
        <ChevronDown className={"w-4 h-4 transition-transform " + (open ? "rotate-180" : "")} />
      </button>

      {open && (
        // PENTING: dropdown SELALU menempel ke kanan tombol (meluas ke kiri).
        // Ini menjaga panel tetap berada di dalam layar meskipun tombol
        // berada di ujung kanan (seperti pada layout dashboard ini).
        <div
          className="absolute right-0 top-full z-30 mt-2 w-72 max-w-[90vw] rounded-xl border border-slate-200 bg-white shadow-xl animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <p className="text-sm font-semibold text-slate-800">Filter Data</p>
            {totalTerpilih > 0 && (
              <button
                onClick={resetSemua}
                className="text-xs text-slate-400 hover:text-red-500 inline-flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Reset
              </button>
            )}
          </div>

          {/* Isi per grup */}
          <div className="max-h-80 overflow-y-auto px-4 py-3 space-y-4">
            {grup.map((g) => (
              <div key={g.judul}>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  {g.judul}
                </p>
                {g.opsi.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Belum ada data.</p>
                ) : (
                  <div className="space-y-1.5">
                    {g.opsi.map((o) => (
                      <label
                        key={o.value}
                        className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer hover:bg-slate-50 rounded-md px-1.5 py-1 -mx-1.5"
                        title={o.label}
                      >
                        <input
                          type="checkbox"
                          checked={g.terpilih.includes(o.value)}
                          onChange={() => toggleValue(g, o.value)}
                          className="shrink-0 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                        />
                        <span className="truncate">{o.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => setOpen(false)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg px-4 py-1.5 transition-colors"
            >
              Terapkan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
