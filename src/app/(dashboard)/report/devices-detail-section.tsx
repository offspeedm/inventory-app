"use client";

import { useEffect, useState } from "react";
import ExcelJS from "exceljs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  FileSpreadsheet,
  FileText,
  History,
  Table2,
} from "lucide-react";
import {
  getDetailDevices,
  getRiwayatPerubahan,
  type DetailDeviceRow,
  type RiwayatPerubahanRow,
} from "./actions";
import { DeviceReportLink } from "./device-report-link";

type SortField = "nama" | "jenis" | "perusahaan" | "cabang" | "status";
type SortDir = "asc" | "desc";
type TampilanData = "berubah" | "semua";

const BIRU_HEADER: [number, number, number] = [37, 99, 235]; // blue-600
const BIRU_HEX = "FF2563EB";

function fmtTanggal(value: Date | string | null): string {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function badgeJenisPerubahan(jenis: string): string {
  switch (jenis) {
    case "User":
      return "bg-amber-100 text-amber-700";
    case "Perusahaan":
      return "bg-indigo-100 text-indigo-700";
    case "Cabang":
      return "bg-emerald-100 text-emerald-700";
    default:
      return "bg-slate-100 text-slate-600";
  }
}

function SortButton({
  label,
  field,
  sortField,
  sortDir,
  onClick,
}: {
  label: string;
  field: SortField;
  sortField: SortField;
  sortDir: SortDir;
  onClick: (f: SortField) => void;
}) {
  const active = sortField === field;
  return (
    <button
      type="button"
      onClick={() => onClick(field)}
      className="inline-flex items-center gap-1 hover:text-slate-800"
    >
      {label}
      {active ? (
        sortDir === "asc" ? (
          <ArrowUp className="h-3.5 w-3.5 text-indigo-600" />
        ) : (
          <ArrowDown className="h-3.5 w-3.5 text-indigo-600" />
        )
      ) : (
        <ArrowUpDown className="h-3.5 w-3.5 text-slate-300" />
      )}
    </button>
  );
}

export function DevicesDetailSection({
  startDate,
  endDate,
  companyId,
  branchId,
}: {
  startDate: string;
  endDate: string;
  companyId: number | null;
  branchId: number | null;
}) {
  const [data, setData] = useState<DetailDeviceRow[]>([]);
  const [riwayat, setRiwayat] = useState<RiwayatPerubahanRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<SortField>("perusahaan");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  // Default "berubah" — langsung menampilkan HANYA perangkat yang benar-
  // benar mengalami perubahan pada periode ini. Bisa dialihkan ke "semua"
  // lewat toggle di bawah.
  const [tampilan, setTampilan] = useState<TampilanData>("berubah");
  const [reloadTick, setReloadTick] = useState(0);

  useEffect(() => {
    let batal = false;

    async function muat() {
      setLoading(true);
      try {
        const [detail, riwayatData] = await Promise.all([
          getDetailDevices(startDate, endDate, companyId, branchId),
          getRiwayatPerubahan(startDate, endDate, companyId, branchId),
        ]);
        if (!batal) {
          setData(detail);
          setRiwayat(riwayatData);
        }
      } catch (err) {
        console.error("Gagal memuat detail devices:", err);
      } finally {
        if (!batal) setLoading(false);
      }
    }

    muat();
    return () => {
      batal = true;
    };
  }, [startDate, endDate, companyId, branchId, reloadTick]);

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  }

  const dataSaring =
    tampilan === "berubah"
      ? data.filter(
          (d) =>
            d.jumlahPerubahanUser > 0 ||
            d.jumlahPerubahanPerusahaan > 0 ||
            d.jumlahPerubahanCabang > 0
        )
      : data;

  const dataTersortir = [...dataSaring].sort((a, b) => {
    let cmp = 0;
    if (sortField === "nama") cmp = a.nama.localeCompare(b.nama, "id");
    if (sortField === "jenis") cmp = a.jenis.localeCompare(b.jenis, "id");
    if (sortField === "perusahaan") cmp = a.perusahaan.localeCompare(b.perusahaan, "id");
    if (sortField === "cabang") cmp = a.cabang.localeCompare(b.cabang, "id");
    if (sortField === "status") cmp = a.status.localeCompare(b.status, "id");
    return sortDir === "asc" ? cmp : -cmp;
  });

  // ===== Export ke Excel — 2 sheet: Detail Devices + Riwayat Perubahan =====
  async function exportExcel() {
    const workbook = new ExcelJS.Workbook();

    const sheet = workbook.addWorksheet("Detail Devices");
    sheet.columns = [
      { header: "Nama Perangkat", key: "nama", width: 24 },
      { header: "Kode Inventaris", key: "kodeInventaris", width: 20 },
      { header: "Jenis", key: "jenis", width: 14 },
      { header: "Perusahaan", key: "perusahaan", width: 32 },
      { header: "Cabang", key: "cabang", width: 16 },
      { header: "Pengguna", key: "pengguna", width: 20 },
      { header: "Status", key: "status", width: 14 },
      { header: "Perubahan User", key: "jumlahPerubahanUser", width: 16 },
      { header: "Perubahan Perusahaan", key: "jumlahPerubahanPerusahaan", width: 20 },
      { header: "Perubahan Cabang", key: "jumlahPerubahanCabang", width: 18 },
    ];
    sheet.getRow(1).eachCell((cell) => {
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: BIRU_HEX } };
      cell.font = { color: { argb: "FFFFFFFF" }, bold: true };
    });
    dataTersortir.forEach((d) =>
      sheet.addRow({ ...d, kodeInventaris: d.kodeInventaris ?? "-" })
    );

    const sheetRiwayat = workbook.addWorksheet("Riwayat Perubahan");
    sheetRiwayat.columns = [
      { header: "Perangkat", key: "deviceNama", width: 24 },
      { header: "Kode Inventaris", key: "kodeInventaris", width: 20 },
      { header: "Jenis Perubahan", key: "jenisPerubahan", width: 16 },
      { header: "Dari", key: "dari", width: 26 },
      { header: "Menjadi", key: "ke", width: 26 },
      { header: "Tanggal", key: "tanggal", width: 16 },
    ];
    sheetRiwayat.getRow(1).eachCell((cell) => {
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: BIRU_HEX } };
      cell.font = { color: { argb: "FFFFFFFF" }, bold: true };
    });
    riwayat.forEach((r) =>
      sheetRiwayat.addRow({
        deviceNama: r.deviceNama,
        kodeInventaris: r.kodeInventaris ?? "-",
        jenisPerubahan: r.jenisPerubahan,
        dari: r.dari,
        ke: r.ke,
        tanggal: fmtTanggal(r.tanggal),
      })
    );

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `laporan-devices-${startDate}_${endDate}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // ===== Export ke PDF — 2 halaman: Detail Devices + Riwayat Perubahan =====
  function exportPdf() {
    const doc = new jsPDF({ orientation: "landscape" });

    doc.setFontSize(14);
    doc.text("Laporan Detail Devices", 14, 15);
    doc.setFontSize(9);
    doc.text(`Periode: ${fmtTanggal(startDate)} - ${fmtTanggal(endDate)}`, 14, 21);

    autoTable(doc, {
      startY: 26,
      head: [
        [
          "Nama",
          "Kode Inventaris",
          "Jenis",
          "Perusahaan",
          "Cabang",
          "Pengguna",
          "Status",
          "Perub. User",
          "Perub. Perusahaan",
          "Perub. Cabang",
        ],
      ],
      body: dataTersortir.map((d) => [
        d.nama,
        d.kodeInventaris ?? "-",
        d.jenis,
        d.perusahaan,
        d.cabang,
        d.pengguna,
        d.status,
        String(d.jumlahPerubahanUser),
        String(d.jumlahPerubahanPerusahaan),
        String(d.jumlahPerubahanCabang),
      ]),
      headStyles: { fillColor: BIRU_HEADER },
      styles: { fontSize: 7.5 },
    });

    doc.addPage();
    doc.setFontSize(14);
    doc.text("Riwayat Perubahan User, Perusahaan & Cabang", 14, 15);
    doc.setFontSize(9);
    doc.text(`Periode: ${fmtTanggal(startDate)} - ${fmtTanggal(endDate)}`, 14, 21);

    autoTable(doc, {
      startY: 26,
      head: [["Perangkat", "Jenis Perubahan", "Dari", "Menjadi", "Tanggal"]],
      body: riwayat.map((r) => [r.deviceNama, r.jenisPerubahan, r.dari, r.ke, fmtTanggal(r.tanggal)]),
      headStyles: { fillColor: BIRU_HEADER },
      styles: { fontSize: 8 },
    });

    doc.save(`laporan-devices-${startDate}_${endDate}.pdf`);
  }

  return (
    // PENTING (perbaikan tumpang tindih): setiap kotak tabel di bawah
    // sekarang diberi `relative isolate` — ini memaksa browser membuat
    // "lapisan tampilan" (stacking context) yang benar-benar terpisah
    // untuk masing-masing kotak, sehingga konten satu tabel TIDAK BISA
    // lagi "menembus"/tertumpuk secara visual ke kotak lain di bawahnya,
    // berapa pun panjang isi tabel tersebut. `space-y-8` (bukan 6) juga
    // menambah jarak antar kotak sebagai lapisan pengaman kedua.
    <div className="space-y-8">
      {/* Tombol export */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-800">Detail Data &amp; Riwayat Perubahan</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={exportExcel}
            disabled={loading || data.length === 0}
            className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FileSpreadsheet className="h-3.5 w-3.5" /> Export Excel
          </button>
          <button
            type="button"
            onClick={exportPdf}
            disabled={loading || data.length === 0}
            className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FileText className="h-3.5 w-3.5" /> Export PDF
          </button>
        </div>
      </div>

      {/* Tabel Detail Devices — bisa di-sort, dengan toggle tampilan */}
      <div className="relative isolate rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <Table2 className="h-4 w-4" />
            </span>
            <h3 className="text-sm font-semibold text-slate-800">
              Detail Devices{" "}
              <span className="font-normal text-slate-400">({dataTersortir.length})</span>
            </h3>
          </div>

          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setTampilan("berubah")}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                tampilan === "berubah"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Hanya yang Berubah
            </button>
            <button
              type="button"
              onClick={() => setTampilan("semua")}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                tampilan === "semua"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Semua Data
            </button>
          </div>
        </div>

        {loading ? (
          <p className="py-8 text-center text-sm text-slate-400">Memuat data...</p>
        ) : dataTersortir.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400">
            {tampilan === "berubah"
              ? "Tidak ada perangkat yang mengalami perubahan pada periode ini."
              : "Tidak ada perangkat untuk ditampilkan."}
          </p>
        ) : (
          // max-h dikurangi dari 96 (384px) menjadi 80 (320px) supaya
          // scroll internal aktif lebih cepat dan tabel terasa lebih
          // ringkas, sesuai keluhan "scroll kebawah terlalu panjang".
          <div className="max-h-80 overflow-y-auto overflow-x-auto rounded-lg border border-slate-100">
            <table className="w-full min-w-[960px] text-sm">
              <thead className="bg-slate-50 text-left text-slate-600">
                <tr>
                  <th className="px-3 py-2">
                    <SortButton
                      label="Nama"
                      field="nama"
                      sortField={sortField}
                      sortDir={sortDir}
                      onClick={toggleSort}
                    />
                  </th>
                  <th className="px-3 py-2">
                    <SortButton
                      label="Jenis"
                      field="jenis"
                      sortField={sortField}
                      sortDir={sortDir}
                      onClick={toggleSort}
                    />
                  </th>
                  <th className="px-3 py-2">
                    <SortButton
                      label="Perusahaan"
                      field="perusahaan"
                      sortField={sortField}
                      sortDir={sortDir}
                      onClick={toggleSort}
                    />
                  </th>
                  <th className="px-3 py-2">
                    <SortButton
                      label="Cabang"
                      field="cabang"
                      sortField={sortField}
                      sortDir={sortDir}
                      onClick={toggleSort}
                    />
                  </th>
                  <th className="px-3 py-2">Pengguna</th>
                  <th className="px-3 py-2">
                    <SortButton
                      label="Status"
                      field="status"
                      sortField={sortField}
                      sortDir={sortDir}
                      onClick={toggleSort}
                    />
                  </th>
                  <th className="px-3 py-2 text-center">Perub. User</th>
                  <th className="px-3 py-2 text-center">Perub. Perusahaan</th>
                  <th className="px-3 py-2 text-center">Perub. Cabang</th>
                </tr>
              </thead>
              <tbody>
                {dataTersortir.map((d) => (
                  <tr key={d.id} className="border-t border-slate-100 hover:bg-slate-50/60">
                    <td className="px-3 py-2.5">
                      <DeviceReportLink
                        deviceId={d.id}
                        nama={d.nama}
                        kodeInventaris={d.kodeInventaris}
                        onSaved={() => setReloadTick((t) => t + 1)}
                      />
                    </td>
                    <td className="px-3 py-2.5 text-slate-600">{d.jenis}</td>
                    <td className="px-3 py-2.5 text-slate-600">{d.perusahaan}</td>
                    <td className="px-3 py-2.5 text-slate-600">{d.cabang}</td>
                    <td className="px-3 py-2.5 text-slate-600">{d.pengguna}</td>
                    <td className="px-3 py-2.5 text-slate-600">{d.status}</td>
                    <td className="px-3 py-2.5 text-center">
                      {d.jumlahPerubahanUser > 0 ? (
                        <span className="inline-block rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                          {d.jumlahPerubahanUser}
                        </span>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      {d.jumlahPerubahanPerusahaan > 0 ? (
                        <span className="inline-block rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
                          {d.jumlahPerubahanPerusahaan}
                        </span>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      {d.jumlahPerubahanCabang > 0 ? (
                        <span className="inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                          {d.jumlahPerubahanCabang}
                        </span>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Tabel Riwayat Perubahan dalam periode terpilih */}
      <div className="relative isolate rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-3 flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
            <History className="h-4 w-4" />
          </span>
          <h3 className="text-sm font-semibold text-slate-800">
            Riwayat Perubahan User, Perusahaan &amp; Cabang{" "}
            <span className="font-normal text-slate-400">({riwayat.length})</span>
          </h3>
        </div>

        {loading ? (
          <p className="py-8 text-center text-sm text-slate-400">Memuat data...</p>
        ) : riwayat.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400">
            Tidak ada perubahan User/Perusahaan/Cabang pada periode ini.
          </p>
        ) : (
          <div className="max-h-80 overflow-y-auto overflow-x-auto rounded-lg border border-slate-100">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="bg-slate-50 text-left text-slate-600">
                <tr>
                  <th className="px-3 py-2">Perangkat</th>
                  <th className="px-3 py-2">Jenis Perubahan</th>
                  <th className="px-3 py-2">Dari</th>
                  <th className="px-3 py-2">Menjadi</th>
                  <th className="px-3 py-2">Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {riwayat.map((r, idx) => (
                  <tr key={idx} className="border-t border-slate-100 hover:bg-slate-50/60">
                    <td className="px-3 py-2.5">
                      <DeviceReportLink
                        deviceId={r.deviceId}
                        nama={r.deviceNama}
                        kodeInventaris={r.kodeInventaris}
                        onSaved={() => setReloadTick((t) => t + 1)}
                      />
                    </td>
                    <td className="px-3 py-2.5">
                      <span
                        className={
                          "inline-block rounded-full px-2 py-0.5 text-xs font-medium " +
                          badgeJenisPerubahan(r.jenisPerubahan)
                        }
                      >
                        {r.jenisPerubahan}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-slate-500">{r.dari}</td>
                    <td className="px-3 py-2.5 font-medium text-slate-700">{r.ke}</td>
                    <td className="px-3 py-2.5 text-xs text-slate-500">{fmtTanggal(r.tanggal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
