"use client";

import { useRef, useState } from "react";
import ExcelJS from "exceljs";
import {
  CheckCircle2,
  Cloud,
  FileSpreadsheet,
  Upload,
  Users,
  XCircle,
} from "lucide-react";
import { importUsers, importDevices, type HasilImport } from "./actions";

type Tab = "user" | "device";

const BIRU_HEADER = "FF2563EB"; // biru (blue-600)
const ABU_CONTOH_FILL = "FFF8FAFC"; // slate-50, latar baris contoh
const ABU_CONTOH_FONT = "FF94A3B8"; // slate-400, teks baris contoh
const BORDER_ABU = "FFD1D5DB"; // slate-300

type KolomTemplate = { header: string; width: number };

const USER_KOLOM: KolomTemplate[] = [
  { header: "Nama Lengkap", width: 24 },
  { header: "Email", width: 28 },
  { header: "No. Telepon", width: 16 },
  { header: "Divisi", width: 14 },
  { header: "Perusahaan", width: 36 },
  { header: "Cabang", width: 16 },
];
const USER_CONTOH = [
  ["Budi Santoso", "budi@perusahaan.com", "081234567890", "IT", "PT. Speedmark Logistics Indonesia", "Jakarta"],
  ["Siti Aminah", "", "081298765432", "Finance", "", ""],
];

const DEVICE_KOLOM: KolomTemplate[] = [
  { header: "Nama Perangkat", width: 24 },
  { header: "Jenis", width: 14 },
  { header: "Merk", width: 14 },
  { header: "Tipe/Model", width: 16 },
  { header: "No. Seri", width: 14 },
  { header: "Status", width: 14 },
  { header: "Tanggal Beli", width: 14 },
  { header: "Harga Beli", width: 14 },
  { header: "Perusahaan", width: 36 },
  { header: "Cabang", width: 16 },
  { header: "Pengguna", width: 20 },
  { header: "Keterangan", width: 26 },
];
const DEVICE_CONTOH = [
  [
    "Laptop Kasir 01",
    "Laptop",
    "Lenovo",
    "ThinkPad E14",
    "SN12345",
    "Aktif",
    "2026-01-15",
    "12000000",
    "PT. Speedmark Logistics Indonesia",
    "Jakarta",
    "Budi Santoso",
    "",
  ],
  ["Printer Gudang", "Printer", "Epson", "L3110", "", "Aktif", "", "", "", "", "", "Printer cadangan"],
];

/**
 * Membuat & mengunduh template Excel dengan header berwarna biru, tebal,
 * bergaris tepi, dan baris contoh yang ditandai abu-abu agar mudah dibedakan
 * dari data asli.
 */
async function unduhTemplate(kolom: KolomTemplate[], contoh: string[][], fileName: string) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Data");

  sheet.columns = kolom.map((k) => ({ header: k.header, width: k.width }));

  const headerRow = sheet.getRow(1);
  headerRow.eachCell((cell) => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: BIRU_HEADER } };
    cell.font = { color: { argb: "FFFFFFFF" }, bold: true, size: 11 };
    cell.alignment = { vertical: "middle", horizontal: "left" };
    cell.border = {
      top: { style: "thin", color: { argb: BORDER_ABU } },
      bottom: { style: "thin", color: { argb: BORDER_ABU } },
      left: { style: "thin", color: { argb: BORDER_ABU } },
      right: { style: "thin", color: { argb: BORDER_ABU } },
    };
  });
  headerRow.height = 22;

  contoh.forEach((nilaiBaris) => {
    const row = sheet.addRow(nilaiBaris);
    row.eachCell({ includeEmpty: true }, (cell) => {
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: ABU_CONTOH_FILL } };
      cell.font = { color: { argb: ABU_CONTOH_FONT }, italic: true, size: 10 };
      cell.border = {
        top: { style: "thin", color: { argb: BORDER_ABU } },
        bottom: { style: "thin", color: { argb: BORDER_ABU } },
        left: { style: "thin", color: { argb: BORDER_ABU } },
        right: { style: "thin", color: { argb: BORDER_ABU } },
      };
    });
  });

  sheet.views = [{ state: "frozen", ySplit: 1 }];

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Membaca file .xlsx yang diunggah pengguna dan mengubahnya jadi array
 * objek biasa: [{ "Nama Lengkap": "Budi", "Email": "...", ... }, ...]
 *
 * PENTING: dulu bagian ini memakai library `xlsx` (SheetJS) sementara
 * template dibuat dengan `exceljs` — kombinasi ini bisa gagal membaca file
 * karena perbedaan cara kedua library menulis/membaca metadata internal
 * file .xlsx (shared strings, calcChain, dll.). Sekarang KEDUANYA memakai
 * `exceljs`, sehingga file yang dihasilkan dari "Unduh Template" dijamin
 * bisa dibaca kembali tanpa masalah kompatibilitas format.
 */
async function bacaFileExcel(file: File): Promise<Record<string, unknown>[]> {
  const buffer = await file.arrayBuffer();
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);

  const sheet = workbook.getWorksheet("Data") ?? workbook.worksheets[0];
  if (!sheet) return [];

  // Baris pertama = header kolom
  const headerRow = sheet.getRow(1);
  const headers: string[] = [];
  headerRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
    headers[colNumber] = String(cell.value ?? "").trim();
  });

  const rows: Record<string, unknown>[] = [];
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // lewati baris header

    const obj: Record<string, unknown> = {};
    let adaIsi = false;

    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      const header = headers[colNumber];
      if (!header) return;

      let nilai = cell.value;
      // ExcelJS bisa mengembalikan objek Date, formula, atau rich text —
      // ubah semua jadi string/angka polos agar aman dikirim ke server.
      if (nilai instanceof Date) {
        nilai = nilai.toISOString().slice(0, 10);
      } else if (nilai && typeof nilai === "object" && "result" in (nilai as object)) {
        nilai = (nilai as { result: unknown }).result;
      } else if (nilai && typeof nilai === "object" && "text" in (nilai as object)) {
        nilai = (nilai as { text: unknown }).text;
      }

      const teks = nilai === null || nilai === undefined ? "" : nilai;
      obj[header] = teks;
      if (String(teks).trim() !== "") adaIsi = true;
    });

    if (adaIsi) rows.push(obj);
  });

  return rows;
}

export function ImportDataView() {
  const [tab, setTab] = useState<Tab>("user");
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [hasil, setHasil] = useState<HasilImport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isUser = tab === "user";

  function gantiTab(next: Tab) {
    setTab(next);
    setFile(null);
    setHasil(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFile(e.target.files?.[0] ?? null);
    setHasil(null);
    setError(null);
  }

  async function mulaiImport() {
    if (!file) return;
    setProcessing(true);
    setError(null);
    setHasil(null);

    // ===== Tahap 1: baca & pecah file =====
    // Dipisah dari tahap 2 agar pesan error tidak lagi menyesatkan —
    // sebelumnya SATU try/catch membungkus baca-file DAN kirim-ke-server
    // sekaligus, sehingga error dari server ikut diberi label "Gagal
    // membaca file" padahal file-nya sendiri baik-baik saja.
    let rows: Record<string, unknown>[];
    try {
      rows = await bacaFileExcel(file);
    } catch (err) {
      console.error("Gagal membaca file Excel:", err);
      setError(
        "Gagal membaca file. Pastikan file berformat .xlsx dan tidak rusak. " +
          "Jika masalah berlanjut, unduh ulang template dan coba lagi."
      );
      setProcessing(false);
      return;
    }

    if (rows.length === 0) {
      setError("File tidak berisi data. Pastikan data diisi pada baris di bawah header.");
      setProcessing(false);
      return;
    }

    // ===== Tahap 2: kirim ke server untuk disimpan =====
    try {
      const result = isUser
        ? await importUsers(rows as never)
        : await importDevices(rows as never);

      setHasil(result);
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
    } catch (err) {
      console.error("Gagal memproses import:", err);
      setError(
        "Gagal menyimpan data ke server. Silakan coba lagi, atau periksa apakah data pada file " +
          "sudah sesuai format kolom yang diminta."
      );
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-sm">
          <Cloud className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Import Data</h1>
          <p className="text-sm text-slate-500">
            Impor banyak data User atau Devices sekaligus dari file Excel.
          </p>
        </div>
      </div>

      {/* Tab pemilih */}
      <div className="mb-6 inline-flex rounded-lg border border-slate-200 bg-slate-100 p-1">
        <button
          type="button"
          onClick={() => gantiTab("user")}
          className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition ${
            isUser ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <Users className="h-4 w-4" /> Import User
        </button>
        <button
          type="button"
          onClick={() => gantiTab("device")}
          className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition ${
            !isUser ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <FileSpreadsheet className="h-4 w-4" /> Import Devices
        </button>
      </div>

      {/* Langkah 1 — Unduh Template */}
      <div className="mb-6 border-b border-slate-100 pb-6">
        <h2 className="mb-1 flex items-center gap-2 text-sm font-semibold text-slate-800">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[11px] text-white">
            1
          </span>
          Unduh Template
        </h2>
        <p className="mb-3 text-sm text-slate-500">
          Unduh template Excel, isi data {isUser ? "user" : "perangkat"} pada sheet{" "}
          <span className="font-medium text-slate-700">Data</span>, lalu hapus/timpa baris contoh
          (berwarna abu-abu) sebelum diunggah.
        </p>
        <button
          type="button"
          onClick={() =>
            isUser
              ? unduhTemplate(USER_KOLOM, USER_CONTOH, "template-import-user.xlsx")
              : unduhTemplate(DEVICE_KOLOM, DEVICE_CONTOH, "template-import-devices.xlsx")
          }
          className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100"
        >
          <FileSpreadsheet className="h-4 w-4" /> Unduh Template {isUser ? "User" : "Devices"}
        </button>
      </div>

      {/* Format Kolom */}
      <div className="mb-6 border-b border-slate-100 pb-6">
        <p className="mb-2 text-sm font-semibold text-slate-800">Format Kolom</p>
        <ul className="space-y-1.5 text-sm text-slate-500">
          {isUser ? (
            <>
              <li>
                <span className="font-medium text-slate-700">Nama Lengkap</span> — wajib diisi
              </li>
              <li>
                <span className="font-medium text-slate-700">Email</span> — opsional, harus unik
              </li>
              <li>
                <span className="font-medium text-slate-700">No. Telepon, Divisi</span> — opsional, bebas
              </li>
              <li>
                <span className="font-medium text-slate-700">Perusahaan, Cabang</span> — opsional, harus
                sama persis dengan data terdaftar
              </li>
            </>
          ) : (
            <>
              <li>
                <span className="font-medium text-slate-700">Nama Perangkat</span> — wajib diisi
              </li>
              <li>
                <span className="font-medium text-slate-700">Jenis</span> — opsional, harus sama persis
                dengan jenis perangkat terdaftar
              </li>
              <li>
                <span className="font-medium text-slate-700">
                  Merk, Tipe/Model, No. Seri, Keterangan
                </span>{" "}
                — opsional, bebas
              </li>
              <li>
                <span className="font-medium text-slate-700">Status</span> — opsional
                (Aktif/Rusak/Perbaikan/Tidak dipakai), default Aktif
              </li>
              <li>
                <span className="font-medium text-slate-700">Tanggal Beli</span> — opsional, format
                YYYY-MM-DD
              </li>
              <li>
                <span className="font-medium text-slate-700">Harga Beli</span> — opsional, angka saja
              </li>
              <li>
                <span className="font-medium text-slate-700">Perusahaan, Cabang, Pengguna</span> —
                opsional, harus sama persis dengan data terdaftar
              </li>
            </>
          )}
        </ul>
      </div>

      {/* Langkah 2 — Unggah File */}
      <div className="mb-6">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[11px] text-white">
            2
          </span>
          Unggah File
        </h2>

        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 py-10 hover:border-indigo-400 hover:bg-indigo-50/40">
          <Upload className="h-6 w-6 text-slate-400" />
          <span className="text-sm text-slate-500">
            {file ? file.name : "Klik untuk pilih file .xlsx hasil isian"}
          </span>
          <input ref={inputRef} type="file" accept=".xlsx" onChange={handleFileChange} className="hidden" />
        </label>
      </div>

      {/* Tombol Mulai Import — kontras jelas di kedua kondisi */}
      <button
        type="button"
        onClick={mulaiImport}
        disabled={!file || processing}
        className="w-full rounded-lg border border-indigo-600 bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-100 disabled:text-slate-500"
      >
        {processing ? "Memproses..." : file ? "Mulai Import" : "Pilih file terlebih dahulu"}
      </button>

      {/* Pesan error umum */}
      {error && (
        <p className="mt-3 flex items-start gap-2 text-sm text-red-600">
          <XCircle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
        </p>
      )}

      {/* Hasil import */}
      {hasil && (
        <div className="mt-6">
          <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            {hasil.berhasil} data berhasil diimpor
            {hasil.gagal > 0 && <span className="text-red-600">, {hasil.gagal} gagal</span>}
          </p>

          {hasil.errors.length > 0 && (
            <div className="max-h-56 overflow-y-auto rounded-lg border border-red-100 bg-red-50 p-3">
              <ul className="space-y-1 text-xs text-red-700">
                {hasil.errors.map((err, idx) => (
                  <li key={idx}>
                    Baris {err.baris}: {err.pesan}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
