"use client";

import { useRef, useState } from "react";
import {
  Upload,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { importUsers, type HasilImport } from "./actions";

export function ImportUserPanel() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasil, setHasil] = useState<HasilImport | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFile(e.target.files?.[0] ?? null);
    setHasil(null);
  }

  async function handleUpload() {
    if (!file) return;
    setLoading(true);
    setHasil(null);
    const fd = new FormData();
    fd.append("file", file);
    const result = await importUsers(fd);
    setHasil(result);
    setLoading(false);
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
      {/* Kolom kiri: unduh template + petunjuk singkat */}
      <div className="space-y-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="mb-3 flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <FileSpreadsheet className="h-5 w-5" />
            </span>
            <h3 className="font-semibold text-slate-800">Langkah 1: Unduh Template</h3>
          </div>
          <p className="mb-4 text-sm text-slate-500">
            Unduh template Excel, isi data user pada sheet <strong>Data</strong>,
            lalu hapus/timpa 2 baris contoh sebelum diunggah.
          </p>
          <a
            href="/templates/template-import-user.xlsx"
            download
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
          >
            <Download className="h-4 w-4" />
            Unduh Template User
          </a>
        </div>

        <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-5 text-sm text-indigo-800">
          <p className="mb-2 font-semibold">Format Kolom</p>
          <ul className="list-inside list-disc space-y-1">
            <li>
              <strong>Nama Lengkap</strong> — wajib diisi
            </li>
            <li>Email — opsional, harus unik</li>
            <li>No. Telepon, Divisi — opsional, bebas</li>
            <li>
              Perusahaan, Cabang — opsional, harus sama persis dengan data
              terdaftar
            </li>
          </ul>
        </div>
      </div>

      {/* Kolom kanan: area upload + hasil */}
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="mb-3 flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <Upload className="h-5 w-5" />
          </span>
          <h3 className="font-semibold text-slate-800">Langkah 2: Unggah File</h3>
        </div>

        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 py-8 transition-colors hover:border-indigo-400 hover:bg-indigo-50/40">
          <Upload className="h-6 w-6 text-slate-400" />
          <span className="px-4 text-center text-sm text-slate-500">
            {file ? (
              <span className="font-medium text-slate-700">{file.name}</span>
            ) : (
              "Klik untuk pilih file .xlsx hasil isian"
            )}
          </span>
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>

        <button
          type="button"
          onClick={handleUpload}
          disabled={!file || loading}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Memproses...
            </>
          ) : (
            "Mulai Import"
          )}
        </button>

        {/* ===== Laporan Hasil ===== */}
        {hasil && (
          <div className="mt-5 border-t border-slate-100 pt-5">
            <div className="mb-3 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-lg font-bold text-slate-800">{hasil.total}</p>
                <p className="text-[11px] text-slate-500">Total Baris</p>
              </div>
              <div className="rounded-lg bg-green-50 p-3">
                <p className="text-lg font-bold text-green-700">{hasil.berhasil}</p>
                <p className="text-[11px] text-green-600">Berhasil</p>
              </div>
              <div className="rounded-lg bg-red-50 p-3">
                <p className="text-lg font-bold text-red-700">{hasil.gagal}</p>
                <p className="text-[11px] text-red-600">Gagal</p>
              </div>
            </div>

            {hasil.berhasil > 0 && hasil.errors.length === 0 && (
              <p className="flex items-center gap-2 text-sm text-green-700">
                <CheckCircle2 className="h-4 w-4" /> Semua baris berhasil diimpor.
              </p>
            )}

            {hasil.errors.length > 0 && (
              <div>
                <p className="mb-2 flex items-center gap-1.5 text-sm font-medium text-slate-700">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  Rincian baris yang gagal:
                </p>
                <ul className="max-h-60 space-y-1.5 overflow-y-auto rounded-lg bg-red-50/50 p-3">
                  {hasil.errors.map((e, i) => (
                    <li key={i} className="flex gap-2 text-xs text-red-700">
                      <XCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                      <span>
                        {e.baris > 0 && (
                          <span className="font-semibold">Baris {e.baris}: </span>
                        )}
                        {e.pesan}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
