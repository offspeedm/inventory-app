"use client";

import { useRef, useState } from "react";
import { Plus, X, Building2 } from "lucide-react";
import { tambahPerusahaan } from "./actions";

export function FormPerusahaan() {
  const formRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);

  const inputClass =
    "w-full border border-slate-300 rounded-lg px-3 py-2 text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";

  return (
    <>
      {/* Tombol pembuka popup */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setOpen(true)}
          className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all duration-200 hover:from-indigo-700 hover:to-violet-700 hover:shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
        >
          <span className="flex items-center justify-center rounded-full bg-white/20 p-0.5 transition-transform duration-200 group-hover:rotate-90">
            <Plus className="w-4 h-4" />
          </span>
          Tambah Perusahaan
        </button>
      </div>

      {/* ===== Popup / Modal Tambah ===== */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Latar gelap + blur, dengan animasi fade */}
          <div
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
          />

          {/* Kotak modal dengan animasi muncul */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg text-left animate-in fade-in zoom-in-95 duration-200">
            {/* Header berwarna dengan ikon */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-100 text-indigo-600">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-slate-800 leading-tight">
                    Tambah Perusahaan
                  </h2>
                  <p className="text-xs text-slate-400">
                    Isi informasi perusahaan baru
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Tutup"
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body form */}
            <form
              ref={formRef}
              action={async (formData: FormData) => {
                await tambahPerusahaan(formData);
                formRef.current?.reset();
                setOpen(false);
              }}
              className="px-6 py-5 grid gap-4"
            >
              {/* Nama + Inisial */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Nama Perusahaan
                  </label>
                  <input
                    name="nama"
                    placeholder="mis. PT. Speedmark Logistics Indonesia"
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Inisial
                  </label>
                  <input
                    name="inisial"
                    placeholder="SLI"
                    maxLength={10}
                    className={inputClass + " uppercase"}
                  />
                </div>
              </div>

              {/* Alamat */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Alamat <span className="text-slate-400 font-normal">(opsional)</span>
                </label>
                <textarea
                  name="alamat"
                  rows={4}
                  placeholder="Tulis alamat lengkap: jalan, nomor, kelurahan, kota, kode pos…"
                  className={inputClass + " resize-y"}
                />
              </div>

              {/* No. Telepon */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  No. Telepon <span className="text-slate-400 font-normal">(opsional)</span>
                </label>
                <input
                  name="no_telp"
                  placeholder="mis. 021-1234567"
                  className={inputClass}
                />
              </div>

              {/* Footer tombol */}
              <div className="flex justify-end gap-2 mt-1 border-t border-slate-100 -mx-6 px-6 pt-4">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg px-4 py-2 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg px-5 py-2 shadow-sm transition-colors"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
