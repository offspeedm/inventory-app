"use client";

import { useState } from "react";
import { updatePerusahaan, hapusPerusahaan } from "./actions";
import {
  Building2,
  MapPin,
  Network,
  Users,
  MonitorSmartphone,
  Phone,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

type Perusahaan = {
  id: number;
  nama: string;
  inisial: string | null;
  alamat: string | null;
  noTelp: string | null;
  cabang: number;
  user: number;
  device: number;
};

// Palet warna aksen bergiliran agar tiap kartu tampil berbeda
const ACCENTS = [
  "from-blue-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-fuchsia-500 to-purple-600",
  "from-rose-500 to-red-600",
  "from-cyan-500 to-sky-600",
];

export function KartuPerusahaan({
  perusahaan,
  index,
}: {
  perusahaan: Perusahaan;
  index: number;
}) {
  const [editing, setEditing] = useState(false);
  const accent = ACCENTS[index % ACCENTS.length];

  const inputClass =
    "w-full border border-slate-300 rounded-lg px-3 py-2 text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";

  // Avatar: pakai inisial dari DB bila ada, kalau tidak ambil dari nama
  const avatar =
    perusahaan.inisial ||
    perusahaan.nama
      .replace(/^PT\.?\s*/i, "")
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();

  return (
    <>
      {/* ===== KARTU ===== */}
      <div className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all overflow-hidden">
        {/* Pita warna atas */}
        <div className={`h-1.5 bg-gradient-to-r ${accent}`} />

        <div className="p-5">
          {/* Kepala kartu */}
          <div className="flex items-start gap-3">
            <div
              className={`shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${accent} text-white font-bold flex items-center justify-center shadow-sm`}
            >
              {avatar || <Building2 className="w-6 h-6" />}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-slate-800 leading-snug truncate">
                {perusahaan.nama}
              </h3>
              <p className="flex items-start gap-1 text-xs text-slate-500 mt-1">
                <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span className="line-clamp-2">
                  {perusahaan.alamat || "Alamat belum diisi"}
                </span>
              </p>
              {perusahaan.noTelp && (
                <p className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                  <Phone className="w-3.5 h-3.5 shrink-0" />
                  {perusahaan.noTelp}
                </p>
              )}
            </div>
          </div>

          {/* Statistik ringkas */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="rounded-lg bg-slate-50 p-2.5 text-center">
              <Network className="w-4 h-4 mx-auto text-emerald-600 mb-1" />
              <p className="text-lg font-bold text-slate-800 leading-none">
                {perusahaan.cabang}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Cabang</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-2.5 text-center">
              <Users className="w-4 h-4 mx-auto text-amber-600 mb-1" />
              <p className="text-lg font-bold text-slate-800 leading-none">
                {perusahaan.user}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">User</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-2.5 text-center">
              <MonitorSmartphone className="w-4 h-4 mx-auto text-indigo-600 mb-1" />
              <p className="text-lg font-bold text-slate-800 leading-none">
                {perusahaan.device}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Device</p>
            </div>
          </div>

          {/* Aksi */}
          <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
            <button
              onClick={() => setEditing(true)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 text-indigo-600 hover:bg-indigo-50 text-sm font-medium rounded-lg px-3 py-2 transition-colors"
            >
              <Pencil className="w-4 h-4" /> Edit
            </button>
            <button
              onClick={() => {
                if (confirm(`Hapus perusahaan "${perusahaan.nama}"?`)) {
                  const fd = new FormData();
                  fd.append("id", String(perusahaan.id));
                  hapusPerusahaan(fd);
                }
              }}
              className="flex-1 inline-flex items-center justify-center gap-1.5 text-red-600 hover:bg-red-50 text-sm font-medium rounded-lg px-3 py-2 transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Hapus
            </button>
          </div>
        </div>
      </div>

      {/* ===== POPUP / MODAL EDIT ===== */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Latar gelap + blur */}
          <div
            onClick={() => setEditing(false)}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
          />

          {/* Kotak modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg text-left animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-100 text-indigo-600">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-slate-800 leading-tight">
                    Edit Perusahaan
                  </h2>
                  <p className="text-xs text-slate-400">
                    Perbarui informasi perusahaan
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditing(false)}
                aria-label="Tutup"
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body form */}
            <form
              action={async (formData) => {
                await updatePerusahaan(formData);
                setEditing(false);
              }}
              className="px-6 py-5 grid gap-4"
            >
              <input type="hidden" name="id" value={perusahaan.id} />

              {/* Nama + Inisial */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Nama Perusahaan
                  </label>
                  <input
                    name="nama"
                    defaultValue={perusahaan.nama}
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
                    defaultValue={perusahaan.inisial ?? ""}
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
                  defaultValue={perusahaan.alamat ?? ""}
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
                  defaultValue={perusahaan.noTelp ?? ""}
                  placeholder="mis. 021-1234567"
                  className={inputClass}
                />
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-2 mt-1 border-t border-slate-100 -mx-6 px-6 pt-4">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg px-4 py-2 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg px-5 py-2 shadow-sm transition-colors"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
