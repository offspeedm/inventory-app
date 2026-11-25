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
import { deviceFields } from "@/config/device-fields";

type Tab = "user" | "device";

const BIRU_HEADER = "FF2563EB";
const ABU_CONTOH_FILL = "FFF8FAFC";
const ABU_CONTOH_FONT = "FF94A3B8";
const BORDER_ABU = "FFD1D5DB";

const JUMLAH_SLOT_SPESIFIKASI = 4;
const STATUS_LIST = ["Aktif", "Rusak", "Perbaikan", "Tidak dipakai"];
const ROWS_VALIDASI = 200;

type KolomTemplate = { header: string; width: number };

// ===== Sheet "Data" — User =====
const USER_KOLOM: KolomTemplate[] = [
  { header: "Nama Lengkap", width: 24 },
  { header: "Email", width: 28 },
  { header: "No. Telepon", width: 16 },
  { header: "Divisi", width: 14 },
  { header: "Perusahaan", width: 36 },
  { header: "Cabang", width: 16 },
];
const USER_CONTOH = [
  [
    "Budi Santoso",
    "budi@perusahaan.com",
    "081234567890",
    "IT",
    "PT. Speedmark Logistics Indonesia",
    "Jakarta",
  ],
  ["Siti Aminah", "", "081298765432", "Finance", "", ""],
];

// ===== Sheet "Data" — Device =====
const DEVICE_KOLOM_DASAR: KolomTemplate[] = [
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
  { header: "Tgl Mulai Penempatan", width: 18 },
  { header: "Pengguna", width: 20 },
  { header: "Tgl Mulai Pengguna", width: 18 },
  { header: "Keterangan", width: 26 },
];

function buatKolomSpesifikasi(): KolomTemplate[] {
  const kolom: KolomTemplate[] = [];
  for (let slot = 1; slot <= JUMLAH_SLOT_SPESIFIKASI; slot++) {
    kolom.push({ header: `Spesifikasi ${slot} (Nama)`, width: 18 });
    kolom.push({ header: `Spesifikasi ${slot} (Nilai)`, width: 16 });
  }
  return kolom;
}

const DEVICE_KOLOM: KolomTemplate[] = [
  ...DEVICE_KOLOM_DASAR,
  ...buatKolomSpesifikasi(),
];

const DEVICE_CONTOH = [
  [
    "Laptop Kasir 01",
    "Laptop",
    "Lenovo",
    "ThinkPad E14",
    "SN12345",
    "Aktif",
    "2024-01-15",
    "12000000",
    "PT. Speedmark Logistics Indonesia",
    "Jakarta",
    "2024-01-15",
    "Budi Santoso",
    "2026-03-01",
    "",
    "RAM",
    "8GB",
    "CPU",
    "Core i5",
    "Storage",
    "512GB SSD",
    "",
    "",
  ],
  [
    "CCTV Lobi Utama",
    "CCTV",
    "Hikvision",
    "DS-2CE16",
    "",
    "Aktif",
    "2025-06-01",
    "1800000",
    "PT. CNL Logistics Indonesia",
    "",
    "2025-06-01",
    "",
    "",
    "Terpasang di lobi utama",
    "Resolusi",
    "4MP",
    "Lokasi Pasang",
    "Lobi",
    "",
    "",
    "",
    "",
  ],
];

// ===== Sheet "Riwayat Pengguna" =====
const RIWAYAT_PENGGUNA_KOLOM: KolomTemplate[] = [
  { header: "No. Seri", width: 14 },
  { header: "Nama Perangkat", width: 24 },
  { header: "Nama User", width: 22 },
  { header: "Tanggal Mulai", width: 16 },
  { header: "Tanggal Selesai", width: 16 },
];
const RIWAYAT_PENGGUNA_CONTOH = [
  ["SN12345", "Laptop Kasir 01", "Andi Wijaya", "2024-01-15", "2026-03-01"],
  ["", "Laptop Kasir 01", "Rina Marlina", "2023-06-01", "2024-01-15"],
];

// ===== Sheet "Riwayat Penempatan" =====
const RIWAYAT_PENEMPATAN_KOLOM: KolomTemplate[] = [
  { header: "No. Seri", width: 14 },
  { header: "Nama Perangkat", width: 24 },
  { header: "Perusahaan", width: 36 },
  { header: "Cabang", width: 16 },
  { header: "Tanggal Mulai", width: 16 },
  { header: "Tanggal Selesai", width: 16 },
];
const RIWAYAT_PENEMPATAN_CONTOH = [
  [
    "SN12345",
    "Laptop Kasir 01",
    "PT. Speedmark Logistics Indonesia",
    "Bandung",
    "2024-01-15",
    "2024-01-15",
  ],
];

function tambahSheet(
  workbook: ExcelJS.Workbook,
  namaSheet: string,
  kolom: KolomTemplate[],
  contoh: string[][],
) {
  const sheet = workbook.addWorksheet(namaSheet);
  sheet.columns = kolom.map((k) => ({ header: k.header, width: k.width }));

  const headerRow = sheet.getRow(1);
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: BIRU_HEADER },
    };
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
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: ABU_CONTOH_FILL },
      };
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
  return sheet;
}

function kolomHuruf(index: number): string {
  let hasil = "";
  let n = index;
  while (n > 0) {
    const sisa = (n - 1) % 26;
    hasil = String.fromCharCode(65 + sisa) + hasil;
    n = Math.floor((n - 1) / 26);
  }
  return hasil;
}

function tambahSheetDaftarSpesifikasi(
  workbook: ExcelJS.Workbook,
  spekMap: Record<string, string[]>,
): string[] {
  const sheet = workbook.addWorksheet("Daftar Spesifikasi", {
    state: "hidden",
  });
  const sumber = Object.keys(spekMap).length > 0 ? spekMap : deviceFields;
  const daftarJenis = Object.keys(sumber);

  daftarJenis.forEach((jenis, idx) => {
    const kolom = idx + 1;
    const daftarSpek = sumber[jenis] ?? [];

    sheet.getCell(1, kolom).value = jenis;
    daftarSpek.forEach((spek, i) => {
      sheet.getCell(2 + i, kolom).value = spek;
    });

    const kolomHurufIni = kolomHuruf(kolom);
    const namaRange = jenis.replace(/ /g, "_");
    const barisTerakhir = 1 + Math.max(daftarSpek.length, 1);

    workbook.definedNames.add(
      `'Daftar Spesifikasi'!$${kolomHurufIni}$2:$${kolomHurufIni}$${barisTerakhir}`,
      namaRange,
    );
  });

  return daftarJenis;
}

function tambahDropdownDevice(
  sheetData: ExcelJS.Worksheet,
  daftarJenis: string[],
) {
  const idxJenis =
    DEVICE_KOLOM_DASAR.findIndex((k) => k.header === "Jenis") + 1;
  const idxStatus =
    DEVICE_KOLOM_DASAR.findIndex((k) => k.header === "Status") + 1;
  const kolomJenis = kolomHuruf(idxJenis);
  const kolomStatus = kolomHuruf(idxStatus);

  const formulaJenis = `"${daftarJenis.join(",")}"`;
  const formulaStatus = `"${STATUS_LIST.join(",")}"`;

  for (let baris = 2; baris <= 1 + ROWS_VALIDASI; baris++) {
    sheetData.getCell(`${kolomJenis}${baris}`).dataValidation = {
      type: "list",
      allowBlank: true,
      formulae: [formulaJenis],
      showErrorMessage: true,
      errorStyle: "warning",
      errorTitle: "Jenis tidak dikenali",
      error:
        "Jenis ini tidak ada di daftar. Anda tetap bisa melanjutkan bila memang sengaja.",
    };

    sheetData.getCell(`${kolomStatus}${baris}`).dataValidation = {
      type: "list",
      allowBlank: true,
      formulae: [formulaStatus],
      showErrorMessage: true,
      errorStyle: "warning",
      errorTitle: "Status tidak dikenali",
      error:
        "Status ini tidak ada di daftar. Kosongkan bila ingin memakai status Aktif (default).",
    };

    for (let slot = 1; slot <= JUMLAH_SLOT_SPESIFIKASI; slot++) {
      const idxNama = DEVICE_KOLOM_DASAR.length + (slot - 1) * 2 + 1;
      const kolomNama = kolomHuruf(idxNama);
      sheetData.getCell(`${kolomNama}${baris}`).dataValidation = {
        type: "list",
        allowBlank: true,
        formulae: [`INDIRECT(SUBSTITUTE($${kolomJenis}${baris}," ","_"))`],
        showErrorMessage: false,
      };
    }
  }
}

async function unduhWorkbook(workbook: ExcelJS.Workbook, fileName: string) {
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

async function unduhTemplateUser() {
  const workbook = new ExcelJS.Workbook();
  tambahSheet(workbook, "Data", USER_KOLOM, USER_CONTOH);
  await unduhWorkbook(workbook, "template-import-user.xlsx");
}

async function unduhTemplateDevice(spekMap: Record<string, string[]>) {
  const workbook = new ExcelJS.Workbook();
  const sheetData = tambahSheet(workbook, "Data", DEVICE_KOLOM, DEVICE_CONTOH);
  tambahSheet(
    workbook,
    "Riwayat Pengguna",
    RIWAYAT_PENGGUNA_KOLOM,
    RIWAYAT_PENGGUNA_CONTOH,
  );
  tambahSheet(
    workbook,
    "Riwayat Penempatan",
    RIWAYAT_PENEMPATAN_KOLOM,
    RIWAYAT_PENEMPATAN_CONTOH,
  );

  const daftarJenis = tambahSheetDaftarSpesifikasi(workbook, spekMap);
  tambahDropdownDevice(sheetData, daftarJenis);

  await unduhWorkbook(workbook, "template-import-devices.xlsx");
}

function nilaiSelKeString(nilai: unknown): string {
  if (nilai === null || nilai === undefined) return "";

  if (nilai instanceof Date) {
    return nilai.toISOString().slice(0, 10);
  }

  if (typeof nilai === "object") {
    const obj = nilai as Record<string, unknown>;

    if (Array.isArray(obj.richText)) {
      return obj.richText
        .map((segment) => (segment as { text?: unknown })?.text ?? "")
        .join("")
        .trim();
    }
    if ("result" in obj) return nilaiSelKeString(obj.result);
    if ("text" in obj) return nilaiSelKeString(obj.text);

    return "";
  }

  return String(nilai).trim();
}

async function bacaWorkbook(file: File): Promise<ExcelJS.Workbook> {
  const buffer = await file.arrayBuffer();
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  return workbook;
}

function bacaSheetRows(
  sheet: ExcelJS.Worksheet | undefined,
): Record<string, unknown>[] {
  if (!sheet) return [];

  const headerRow = sheet.getRow(1);
  const headers: string[] = [];
  headerRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
    headers[colNumber] = nilaiSelKeString(cell.value);
  });

  const jumlahKolom = headers.length - 1;
  const rows: Record<string, unknown>[] = [];

  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;

    const obj: Record<string, unknown> = {};
    let adaIsi = false;

    for (let col = 1; col <= jumlahKolom; col++) {
      const header = headers[col];
      if (!header) continue;

      const cell = row.getCell(col);
      const teks = nilaiSelKeString(cell.value);
      obj[header] = teks;
      if (teks !== "") adaIsi = true;
    }

    if (adaIsi) rows.push(obj);
  });

  return rows;
}

export function ImportDataView({
  jenisSpesifikasiMap = {},
}: {
  jenisSpesifikasiMap?: Record<string, string[]>;
}) {
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

    let workbook: ExcelJS.Workbook;
    try {
      workbook = await bacaWorkbook(file);
    } catch (err) {
      console.error("Gagal membaca file Excel:", err);
      setError(
        "Gagal membaca file. Pastikan file berformat .xlsx dan tidak rusak. " +
          "Jika masalah berlanjut, unduh ulang template dan coba lagi.",
      );
      setProcessing(false);
      return;
    }

    try {
      if (isUser) {
        const sheetData =
          workbook.getWorksheet("Data") ?? workbook.worksheets[0];
        const rows = bacaSheetRows(sheetData);

        if (rows.length === 0) {
          setError(
            "File tidak berisi data. Pastikan data diisi pada sheet Data.",
          );
          setProcessing(false);
          return;
        }

        const result = await importUsers(rows as never);
        setHasil(result);
      } else {
        const sheetData =
          workbook.getWorksheet("Data") ?? workbook.worksheets[0];
        const rowsDevice = bacaSheetRows(sheetData);
        const rowsRiwayatPengguna = bacaSheetRows(
          workbook.getWorksheet("Riwayat Pengguna"),
        );
        const rowsRiwayatPenempatan = bacaSheetRows(
          workbook.getWorksheet("Riwayat Penempatan"),
        );

        if (rowsDevice.length === 0) {
          setError(
            "File tidak berisi data. Pastikan data diisi pada sheet Data.",
          );
          setProcessing(false);
          return;
        }

        const result = await importDevices({
          devices: rowsDevice as never,
          riwayatPengguna: rowsRiwayatPengguna as never,
          riwayatPenempatan: rowsRiwayatPenempatan as never,
        });
        setHasil(result);
      }

      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
    } catch (err) {
      console.error("Gagal memproses import:", err);
      setError(
        "Gagal menyimpan data ke server. Silakan coba lagi, atau periksa apakah data pada file " +
          "sudah sesuai format kolom yang diminta.",
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
            isUser
              ? "bg-white text-indigo-600 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <Users className="h-4 w-4" /> Import User
        </button>
        <button
          type="button"
          onClick={() => gantiTab("device")}
          className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition ${
            !isUser
              ? "bg-white text-indigo-600 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
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
        {isUser ? (
          <p className="mb-3 text-sm text-slate-500">
            Unduh template Excel, isi data user pada sheet{" "}
            <span className="font-medium text-slate-700">Data</span>, lalu
            hapus/timpa baris contoh (berwarna abu-abu) sebelum diunggah.
          </p>
        ) : (
          <div className="mb-3 space-y-2 text-sm text-slate-500">
            <p>
              Template berisi 3 sheet:{" "}
              <span className="font-medium text-slate-700">Data</span> (kondisi
              perangkat saat ini + spesifikasi),{" "}
              <span className="font-medium text-slate-700">
                Riwayat Pengguna
              </span>{" "}
              (histori pengguna sebelumnya), dan{" "}
              <span className="font-medium text-slate-700">
                Riwayat Penempatan
              </span>{" "}
              (histori lokasi sebelumnya). Sheet Riwayat boleh dikosongkan bila
              perangkat memang belum pernah berpindah.
            </p>
            <p>
              Kolom <span className="font-medium text-slate-700">Jenis</span>{" "}
              dan <span className="font-medium text-slate-700">Status</span>{" "}
              sudah berbentuk dropdown. Kolom{" "}
              <span className="font-medium text-slate-700">
                Spesifikasi (Nama)
              </span>{" "}
              juga dropdown yang{" "}
              <span className="italic">otomatis menyesuaikan</span> daftar
              pilihannya mengikuti Jenis yang dipilih pada baris yang sama —
              pilih Jenis terlebih dahulu, baru pilih Spesifikasi. Dropdown
              tersedia untuk 200 baris pertama.
            </p>
          </div>
        )}
        <button
          type="button"
          onClick={() =>
            isUser
              ? unduhTemplateUser()
              : unduhTemplateDevice(jenisSpesifikasiMap)
          }
          className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100"
        >
          <FileSpreadsheet className="h-4 w-4" /> Unduh Template{" "}
          {isUser ? "User" : "Devices"}
        </button>
      </div>

      {/* Format Kolom */}
      <div className="mb-6 border-b border-slate-100 pb-6">
        <p className="mb-2 text-sm font-semibold text-slate-800">
          Format Kolom
        </p>
        {isUser ? (
          <ul className="space-y-1.5 text-sm text-slate-500">
            <li>
              <span className="font-medium text-slate-700">Nama Lengkap</span> —
              wajib diisi
            </li>
            <li>
              <span className="font-medium text-slate-700">Email</span> —
              opsional, harus unik
            </li>
            <li>
              <span className="font-medium text-slate-700">
                No. Telepon, Divisi
              </span>{" "}
              — opsional, bebas
            </li>
            <li>
              <span className="font-medium text-slate-700">
                Perusahaan, Cabang
              </span>{" "}
              — opsional, harus sama persis dengan data terdaftar
            </li>
          </ul>
        ) : (
          <div className="space-y-4 text-sm text-slate-500">
            <div>
              <p className="mb-1 font-semibold text-slate-700">
                Sheet &quot;Data&quot;
              </p>
              <ul className="space-y-1.5">
                <li>
                  <span className="font-medium text-slate-700">
                    Nama Perangkat
                  </span>{" "}
                  — wajib diisi
                </li>
                <li>
                  <span className="font-medium text-slate-700">
                    Jenis, Status
                  </span>{" "}
                  — opsional, sudah berbentuk dropdown di kolom Excel-nya
                  (Status default &quot;Aktif&quot; bila dikosongkan)
                </li>
                <li>
                  <span className="font-medium text-slate-700">
                    Merk, Tipe/Model, No. Seri, Keterangan
                  </span>{" "}
                  — opsional, bebas
                </li>
                <li>
                  <span className="font-medium text-slate-700">
                    Tanggal Beli
                  </span>{" "}
                  — opsional, format YYYY-MM-DD
                </li>
                <li>
                  <span className="font-medium text-slate-700">Harga Beli</span>{" "}
                  — opsional, angka saja
                </li>
                <li>
                  <span className="font-medium text-slate-700">
                    Perusahaan, Cabang, Pengguna
                  </span>{" "}
                  — opsional, ini adalah kondisi{" "}
                  <span className="italic">saat ini</span>, harus sama persis
                  dengan data terdaftar
                </li>
                <li>
                  <span className="font-medium text-slate-700">
                    Tgl Mulai Penempatan, Tgl Mulai Pengguna
                  </span>{" "}
                  — opsional, format YYYY-MM-DD; jika kosong ikut Tanggal Beli,
                  jika itu pun kosong memakai tanggal hari ini
                </li>
                <li>
                  <span className="font-medium text-slate-700">
                    Spesifikasi 1-4 (Nama) &amp; (Nilai)
                  </span>{" "}
                  — opsional, 4 pasang kolom untuk spesifikasi teknis. Kolom{" "}
                  <span className="font-medium text-slate-700">(Nama)</span>{" "}
                  berupa dropdown yang{" "}
                  <span className="italic">otomatis menyesuaikan</span> pilihan
                  Jenis pada baris yang sama; kolom{" "}
                  <span className="font-medium text-slate-700">(Nilai)</span>{" "}
                  tetap bebas diisi teks, contoh Nama=&quot;RAM&quot;
                  Nilai=&quot;8GB&quot;. Kosongkan pasangan yang tidak dipakai
                </li>
              </ul>
            </div>
            <div>
              <p className="mb-1 font-semibold text-slate-700">
                Sheet &quot;Riwayat Pengguna&quot; (opsional)
              </p>
              <ul className="space-y-1.5">
                <li>
                  <span className="font-medium text-slate-700">No. Seri</span>{" "}
                  atau{" "}
                  <span className="font-medium text-slate-700">
                    Nama Perangkat
                  </span>{" "}
                  — salah satu wajib diisi, untuk mencocokkan ke perangkat pada
                  sheet Data
                </li>
                <li>
                  <span className="font-medium text-slate-700">Nama User</span>{" "}
                  — wajib diisi, harus user yang sudah terdaftar
                </li>
                <li>
                  <span className="font-medium text-slate-700">
                    Tanggal Mulai
                  </span>{" "}
                  — wajib diisi, format YYYY-MM-DD
                </li>
                <li>
                  <span className="font-medium text-slate-700">
                    Tanggal Selesai
                  </span>{" "}
                  — opsional, format YYYY-MM-DD
                </li>
              </ul>
            </div>
            <div>
              <p className="mb-1 font-semibold text-slate-700">
                Sheet &quot;Riwayat Penempatan&quot; (opsional)
              </p>
              <ul className="space-y-1.5">
                <li>
                  <span className="font-medium text-slate-700">No. Seri</span>{" "}
                  atau{" "}
                  <span className="font-medium text-slate-700">
                    Nama Perangkat
                  </span>{" "}
                  — salah satu wajib diisi
                </li>
                <li>
                  <span className="font-medium text-slate-700">Perusahaan</span>{" "}
                  — wajib diisi;{" "}
                  <span className="font-medium text-slate-700">Cabang</span>{" "}
                  opsional
                </li>
                <li>
                  <span className="font-medium text-slate-700">
                    Tanggal Mulai
                  </span>{" "}
                  — wajib diisi;{" "}
                  <span className="font-medium text-slate-700">
                    Tanggal Selesai
                  </span>{" "}
                  — opsional
                </li>
              </ul>
            </div>
          </div>
        )}
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
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>

      {/* Tombol Mulai Import */}
      <button
        type="button"
        onClick={mulaiImport}
        disabled={!file || processing}
        className="w-full rounded-lg border border-indigo-600 bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-100 disabled:text-slate-500"
      >
        {processing
          ? "Memproses..."
          : file
            ? "Mulai Import"
            : "Pilih file terlebih dahulu"}
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
            {hasil.gagal > 0 && (
              <span className="text-red-600">, {hasil.gagal} gagal</span>
            )}
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
