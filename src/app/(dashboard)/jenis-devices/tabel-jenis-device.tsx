// src/app/(dashboard)/jenis-devices/tabel-jenis-device.tsx
"use client";

import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Check, X, Search, Loader2 } from "lucide-react";
import {
  tambahJenisDevice,
  updateJenisDevice,
  hapusJenisDevice,
} from "./actions";
import { parseSpesifikasiInput } from "@/config/device-fields";

export type JenisDeviceRow = {
  id: number;
  nama: string;
  kode: string | null;
  spesifikasi: string[];
  jumlahPerangkatAktif: number;
};

function defaultPrefix(nama: string): string {
  return nama
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 3)
    .toUpperCase();
}

export function TabelJenisDevice({ items }: { items: JenisDeviceRow[] }) {
  // State form tambah baru
  const [namaBaru, setNamaBaru] = useState("");
  const [kodeBaru, setKodeBaru] = useState("");
  const [spekBaru, setSpekBaru] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // State pencarian
  const [search, setSearch] = useState("");

  // State edit baris inline
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editNama, setEditNama] = useState("");
  const [editKode, setEditKode] = useState("");
  const [editSpek, setEditSpek] = useState("");
  const [savingId, setSavingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // State pesan error inline
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const previewSpekBaru = useMemo(
    () => parseSpesifikasiInput(spekBaru),
    [spekBaru],
  );

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.nama.toLowerCase().includes(q) ||
        (item.kode ?? "").toLowerCase().includes(q) ||
        item.spesifikasi.some((s) => s.toLowerCase().includes(q)),
    );
  }, [items, search]);

  async function handleTambah(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);

    const res = await tambahJenisDevice({
      nama: namaBaru,
      kode: kodeBaru,
      spesifikasi: parseSpesifikasiInput(spekBaru),
    });

    setSubmitting(false);
    if (!res.ok) {
      setErrorMsg(res.error);
      return;
    }

    setNamaBaru("");
    setKodeBaru("");
    setSpekBaru("");
  }

  function mulaiEdit(item: JenisDeviceRow) {
    setErrorMsg(null);
    setEditingId(item.id);
    setEditNama(item.nama);
    setEditKode(item.kode ?? "");
    setEditSpek(item.spesifikasi.join(", "));
  }

  function batalEdit() {
    setEditingId(null);
    setEditNama("");
    setEditKode("");
    setEditSpek("");
  }

  async function handleSimpanEdit(id: number) {
    setErrorMsg(null);
    setSavingId(id);

    const res = await updateJenisDevice(id, {
      nama: editNama,
      kode: editKode,
      spesifikasi: parseSpesifikasiInput(editSpek),
    });

    setSavingId(null);
    if (!res.ok) {
      setErrorMsg(res.error);
      return;
    }

    batalEdit();
  }

  async function handleHapus(item: JenisDeviceRow) {
    const konfirmasi = window.confirm(`Hapus jenis perangkat "${item.nama}"?`);
    if (!konfirmasi) return;

    setErrorMsg(null);
    setDeletingId(item.id);

    const res = await hapusJenisDevice(item.id);

    setDeletingId(null);
    if (!res.ok) {
      setErrorMsg(res.error);
    }
  }

  return (
    <div className="space-y-5">
      {/* Banner Error Inline */}
      {errorMsg && (
        <div className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <span>{errorMsg}</span>
          <button
            type="button"
            onClick={() => setErrorMsg(null)}
            className="rounded p-1 text-rose-500 hover:bg-rose-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Form Tambah Jenis Perangkat */}
      <form
        onSubmit={handleTambah}
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs"
      >
        <h2 className="mb-3 text-sm font-semibold text-slate-800">
          Tambah Jenis Perangkat Baru
        </h2>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
          <div className="sm:col-span-4">
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Nama Jenis Perangkat *
            </label>
            <input
              type="text"
              required
              value={namaBaru}
              onChange={(e) => setNamaBaru(e.target.value)}
              placeholder="Contoh: Switch, UPS, Scanner"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Kode Prefix
            </label>
            <input
              type="text"
              maxLength={10}
              value={kodeBaru}
              onChange={(e) => setKodeBaru(e.target.value.toUpperCase())}
              placeholder={
                namaBaru ? `Auto: ${defaultPrefix(namaBaru)}` : "Contoh: SWT"
              }
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2 font-mono text-sm uppercase text-slate-800 placeholder:font-sans placeholder:normal-case placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-4">
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Kolom Spesifikasi{" "}
              <span className="font-normal text-slate-400">(pisah koma)</span>
            </label>
            <input
              type="text"
              value={spekBaru}
              onChange={(e) => setSpekBaru(e.target.value)}
              placeholder="Contoh: Jumlah Port, Kecepatan, Tipe"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex items-end sm:col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-xs transition hover:bg-indigo-700 disabled:opacity-60 cursor-pointer"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              {submitting ? "Menyimpan..." : "Tambah"}
            </button>
          </div>
        </div>

        {previewSpekBaru.length > 0 && (
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-slate-500">Preview kolom input:</span>
            {previewSpekBaru.map((sp) => (
              <span
                key={sp}
                className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-200"
              >
                {sp}
              </span>
            ))}
          </div>
        )}

        <p className="mt-2 text-xs text-slate-400">
          Kode prefix dipakai untuk nomor inventaris otomatis (misal:{" "}
          <span className="font-mono text-slate-600">NTB</span>/SLI/2026/001).
          Kolom spesifikasi otomatis muncul saat menambah atau mengedit
          perangkat dengan jenis ini.
        </p>
      </form>

      {/* Search Bar */}
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama jenis perangkat, kode prefix, atau kolom spesifikasi..."
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pr-9 pl-10 text-sm text-slate-700 shadow-xs placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="absolute top-1/2 right-3 -translate-y-1/2 rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Tabel Daftar Jenis Perangkat */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="border-b border-slate-200 bg-slate-50/80 text-left text-xs font-semibold text-slate-600">
              <tr>
                <th className="w-14 px-4 py-3">No</th>
                <th className="w-52 px-4 py-3">Nama Jenis Perangkat</th>
                <th className="w-36 px-4 py-3">Kode Prefix</th>
                <th className="px-4 py-3">Kolom Spesifikasi</th>
                <th className="w-36 px-4 py-3 text-center">Perangkat Aktif</th>
                <th className="w-32 px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-sm text-slate-400"
                  >
                    {search
                      ? "Tidak ada jenis perangkat yang cocok dengan pencarian."
                      : "Belum ada data jenis perangkat."}
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => {
                  const isEditing = editingId === item.id;
                  const isSaving = savingId === item.id;
                  const isDeleting = deletingId === item.id;

                  return (
                    <tr
                      key={item.id}
                      className="transition hover:bg-slate-50/70"
                    >
                      <td className="px-4 py-3 text-slate-500">{idx + 1}</td>

                      {/* Kolom Nama */}
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editNama}
                            onChange={(e) => setEditNama(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleSimpanEdit(item.id);
                              } else if (e.key === "Escape") {
                                batalEdit();
                              }
                            }}
                            autoFocus
                            className="w-full rounded-lg border border-indigo-400 px-2.5 py-1.5 text-sm font-medium text-slate-800 focus:outline-none"
                          />
                        ) : (
                          <span className="font-medium text-slate-800">
                            {item.nama}
                          </span>
                        )}
                      </td>

                      {/* Kolom Kode Prefix */}
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <input
                            type="text"
                            maxLength={10}
                            value={editKode}
                            onChange={(e) =>
                              setEditKode(e.target.value.toUpperCase())
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleSimpanEdit(item.id);
                              } else if (e.key === "Escape") {
                                batalEdit();
                              }
                            }}
                            placeholder={`Auto: ${defaultPrefix(editNama || item.nama)}`}
                            className="w-28 rounded-lg border border-indigo-400 px-2.5 py-1.5 font-mono text-xs uppercase text-slate-800 placeholder:font-sans placeholder:normal-case placeholder:text-slate-400 focus:outline-none"
                          />
                        ) : item.kode ? (
                          <span className="inline-flex rounded-md bg-indigo-50 px-2.5 py-0.5 font-mono text-xs font-semibold text-indigo-700">
                            {item.kode}
                          </span>
                        ) : (
                          <span className="inline-flex rounded-md bg-slate-100 px-2.5 py-0.5 font-mono text-xs text-slate-500">
                            {defaultPrefix(item.nama)} (auto)
                          </span>
                        )}
                      </td>

                      {/* Kolom Spesifikasi */}
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editSpek}
                            onChange={(e) => setEditSpek(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleSimpanEdit(item.id);
                              } else if (e.key === "Escape") {
                                batalEdit();
                              }
                            }}
                            placeholder="Pisahkan dengan koma, mis: RAM, CPU, Storage"
                            className="w-full rounded-lg border border-indigo-400 px-2.5 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none"
                          />
                        ) : item.spesifikasi.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {item.spesifikasi.map((sp) => (
                              <span
                                key={sp}
                                className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700"
                              >
                                {sp}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">
                            Tidak ada spesifikasi khusus
                          </span>
                        )}
                      </td>

                      {/* Kolom Jumlah Perangkat Aktif */}
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                          {item.jumlahPerangkatAktif} unit
                        </span>
                      </td>

                      {/* Kolom Aksi */}
                      <td className="px-4 py-3 text-right">
                        {isEditing ? (
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              disabled={isSaving}
                              onClick={() => handleSimpanEdit(item.id)}
                              title="Simpan perubahan"
                              className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-60 cursor-pointer"
                            >
                              {isSaving ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Check className="h-3.5 w-3.5" />
                              )}
                              Simpan
                            </button>
                            <button
                              type="button"
                              disabled={isSaving}
                              onClick={batalEdit}
                              title="Batal"
                              className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => mulaiEdit(item)}
                              title="Edit jenis perangkat"
                              className="rounded-lg p-1.5 text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              disabled={isDeleting}
                              onClick={() => handleHapus(item)}
                              title="Hapus jenis perangkat"
                              className="rounded-lg p-1.5 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50 cursor-pointer"
                            >
                              {isDeleting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
