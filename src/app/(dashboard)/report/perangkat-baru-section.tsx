"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ExcelJS from "exceljs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ExternalLink,
  FileSpreadsheet,
  FileText,
  Laptop,
  Search,
  X,
} from "lucide-react";
import type { DeviceBaruItem } from "./actions";

type SortField =
  | "tglBeli"
  | "nama"
  | "jenis"
  | "perusahaan"
  | "hargaBeli"
  | "status";
type SortDir = "asc" | "desc";

const BIRU_HEADER: [number, number, number] = [37, 99, 235];
const BIRU_HEX = "FF2563EB";

function fmtTanggal(value: Date | string | null): string {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function fmtRupiah(value: number | null): string {
  if (value === null || value === undefined) return "-";
  return "Rp " + value.toLocaleString("id-ID");
}

function statusBadge(status: string): string {
  switch (status) {
    case "Aktif":
      return "bg-emerald-100 text-emerald-700";
    case "Rusak":
      return "bg-orange-100 text-orange-700";
    case "Perbaikan":
      return "bg-amber-100 text-amber-700";
    case "Hilang":
      return "bg-red-100 text-red-700";
    default:
      return "bg-slate-100 text-slate-600";
  }
}

function jenisBadge(jenis: string): string {
  if (jenis.toLowerCase() === "laptop") {
    return "bg-indigo-100 text-indigo-700";
  }
  return "bg-slate-100 text-slate-700";
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

// ============================================================================
// 1. SUB-MENU: DAFTAR PERANGKAT / LAPTOP BARU
// ============================================================================
export function PerangkatBaruTabSection({
  devices,
  startDate,
  endDate,
  initialJenis = "ALL",
}: {
  devices: DeviceBaruItem[];
  startDate: string;
  endDate: string;
  initialJenis?: string;
}) {
  const [jenisFilter, setJenisFilter] = useState<string>(initialJenis);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("tglBeli");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  useEffect(() => {
    setJenisFilter(initialJenis);
  }, [initialJenis]);

  // Daftar pill jenis: "Laptop" selalu ditampilkan di posisi pertama setelah "Semua Jenis"
  const daftarJenisPill = useMemo(() => {
    const countMap = new Map<string, number>();
    for (const d of devices) {
      countMap.set(d.jenis, (countMap.get(d.jenis) ?? 0) + 1);
    }

    const laptopCount = countMap.get("Laptop") ?? 0;
    const lainnya = Array.from(countMap.entries())
      .filter(([nama]) => nama !== "Laptop")
      .sort((a, b) => b[1] - a[1]);

    return [
      { nama: "ALL", label: "Semua Jenis", jumlah: devices.length },
      { nama: "Laptop", label: "Laptop", jumlah: laptopCount },
      ...lainnya.map(([nama, jumlah]) => ({ nama, label: nama, jumlah })),
    ];
  }, [devices]);

  const daftarStatus = useMemo(() => {
    return Array.from(new Set(devices.map((d) => d.status))).sort((a, b) =>
      a.localeCompare(b, "id"),
    );
  }, [devices]);

  const hasilFilter = useMemo(() => {
    const q = search.trim().toLowerCase();
    return devices.filter((d) => {
      if (jenisFilter !== "ALL" && d.jenis !== jenisFilter) return false;
      if (statusFilter !== "ALL" && d.status !== statusFilter) return false;
      if (!q) return true;

      const haystack = [
        d.nama,
        d.kodeInventaris ?? "",
        d.merk ?? "",
        d.tipe ?? "",
        d.serialNumber ?? "",
        d.jenis,
        d.perusahaan,
        d.cabang,
        d.pengguna,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [devices, jenisFilter, statusFilter, search]);

  const hasilTersortir = useMemo(() => {
    return [...hasilFilter].sort((a, b) => {
      let cmp = 0;
      if (sortField === "tglBeli") {
        const ta = a.tglBeli ? new Date(a.tglBeli).getTime() : 0;
        const tb = b.tglBeli ? new Date(b.tglBeli).getTime() : 0;
        cmp = ta - tb;
      } else if (sortField === "nama") {
        cmp = a.nama.localeCompare(b.nama, "id");
      } else if (sortField === "jenis") {
        cmp = a.jenis.localeCompare(b.jenis, "id");
      } else if (sortField === "perusahaan") {
        cmp = a.perusahaan.localeCompare(b.perusahaan, "id");
      } else if (sortField === "hargaBeli") {
        cmp = (a.hargaBeli ?? 0) - (b.hargaBeli ?? 0);
      } else if (sortField === "status") {
        cmp = a.status.localeCompare(b.status, "id");
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [hasilFilter, sortField, sortDir]);

  const totalNilaiTersaring = useMemo(
    () => hasilTersortir.reduce((sum, d) => sum + (d.hargaBeli ?? 0), 0),
    [hasilTersortir],
  );

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir(field === "tglBeli" || field === "hargaBeli" ? "desc" : "asc");
    }
  }

  async function exportExcel() {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(
      jenisFilter === "Laptop" ? "Laptop Baru" : "Perangkat Baru",
    );

    sheet.columns = [
      { header: "Nama Perangkat", key: "nama", width: 26 },
      { header: "Kode Inventaris", key: "kodeInventaris", width: 20 },
      { header: "Jenis", key: "jenis", width: 14 },
      { header: "Merk", key: "merk", width: 14 },
      { header: "Tipe/Model", key: "tipe", width: 18 },
      { header: "No. Seri", key: "serialNumber", width: 18 },
      { header: "Perusahaan", key: "perusahaan", width: 32 },
      { header: "Cabang", key: "cabang", width: 16 },
      { header: "Pengguna", key: "pengguna", width: 20 },
      { header: "Tanggal Beli", key: "tglBeli", width: 15 },
      { header: "Harga Beli", key: "hargaBeli", width: 18 },
      { header: "Status", key: "status", width: 14 },
    ];

    sheet.getRow(1).eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: BIRU_HEX },
      };
      cell.font = { color: { argb: "FFFFFFFF" }, bold: true };
    });

    hasilTersortir.forEach((d) => {
      sheet.addRow({
        nama: d.nama,
        kodeInventaris: d.kodeInventaris ?? "-",
        jenis: d.jenis,
        merk: d.merk ?? "-",
        tipe: d.tipe ?? "-",
        serialNumber: d.serialNumber ?? "-",
        perusahaan: d.perusahaan,
        cabang: d.cabang,
        pengguna: d.pengguna,
        tglBeli: fmtTanggal(d.tglBeli),
        hargaBeli: d.hargaBeli ?? 0,
        status: d.status,
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const slug =
      jenisFilter === "ALL" ? "perangkat-baru" : jenisFilter.toLowerCase();
    link.download = `laporan-${slug}-${startDate}_${endDate}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function exportPdf() {
    const doc = new jsPDF({ orientation: "landscape" });
    const judul =
      jenisFilter === "ALL"
        ? "Laporan Daftar Perangkat Baru"
        : `Laporan Daftar ${jenisFilter} Baru`;

    doc.setFontSize(14);
    doc.text(judul, 14, 15);
    doc.setFontSize(9);
    doc.text(
      `Periode: ${fmtTanggal(startDate)} - ${fmtTanggal(endDate)} · Total: ${hasilTersortir.length} unit (${fmtRupiah(totalNilaiTersaring)})`,
      14,
      21,
    );

    autoTable(doc, {
      startY: 26,
      head: [
        [
          "Nama",
          "Kode Inventaris",
          "Jenis",
          "Merk / Tipe",
          "No. Seri",
          "Perusahaan",
          "Cabang",
          "Pengguna",
          "Tgl Beli",
          "Harga Beli",
          "Status",
        ],
      ],
      body: hasilTersortir.map((d) => [
        d.nama,
        d.kodeInventaris ?? "-",
        d.jenis,
        [d.merk, d.tipe].filter(Boolean).join(" ") || "-",
        d.serialNumber ?? "-",
        d.perusahaan,
        d.cabang,
        d.pengguna,
        fmtTanggal(d.tglBeli),
        fmtRupiah(d.hargaBeli),
        d.status,
      ]),
      headStyles: { fillColor: BIRU_HEADER },
      styles: { fontSize: 7.5 },
    });

    const slug =
      jenisFilter === "ALL" ? "perangkat-baru" : jenisFilter.toLowerCase();
    doc.save(`laporan-${slug}-${startDate}_${endDate}.pdf`);
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* Header & Tombol Export */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <Laptop className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-base font-semibold text-slate-800">
              {jenisFilter === "Laptop"
                ? "Daftar Laptop Baru"
                : jenisFilter === "ALL"
                  ? "Daftar Perangkat Baru"
                  : `Daftar ${jenisFilter} Baru`}
            </h2>
            <p className="text-xs text-slate-500">
              Menampilkan {hasilTersortir.length} unit · Total Nilai Pembelian:{" "}
              <span className="font-semibold text-slate-700">
                {fmtRupiah(totalNilaiTersaring)}
              </span>
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={exportExcel}
            disabled={hasilTersortir.length === 0}
            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FileSpreadsheet className="h-3.5 w-3.5" /> Export Excel
          </button>
          <button
            type="button"
            onClick={exportPdf}
            disabled={hasilTersortir.length === 0}
            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FileText className="h-3.5 w-3.5" /> Export PDF
          </button>
        </div>
      </div>

      {/* Filter Cepat Jenis Perangkat (Pill) */}
      <div className="mb-4 flex flex-wrap gap-2">
        {daftarJenisPill.map((pill) => {
          const aktif = jenisFilter === pill.nama;
          return (
            <button
              key={pill.nama}
              type="button"
              onClick={() => setJenisFilter(pill.nama)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                aktif
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {pill.nama === "Laptop" && <Laptop className="h-3.5 w-3.5" />}
              <span>{pill.label}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                  aktif ? "bg-white/20 text-white" : "bg-white text-slate-600"
                }`}
              >
                {pill.jumlah}
              </span>
            </button>
          );
        })}
      </div>

      {/* Pencarian & Filter Status */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama perangkat, kode inventaris, merk, SN, perusahaan, atau pengguna..."
            className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
        >
          <option value="ALL">Semua Status</option>
          {daftarStatus.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Tabel Data */}
      {hasilTersortir.length === 0 ? (
        <p className="py-10 text-center text-sm text-slate-400">
          {jenisFilter === "Laptop"
            ? "Tidak ada data pembelian Laptop baru pada periode dan filter ini."
            : "Tidak ada data perangkat baru yang sesuai dengan filter."}
        </p>
      ) : (
        <div className="max-h-[460px] overflow-auto rounded-xl border border-slate-100">
          <table className="w-full min-w-[980px] text-sm">
            <thead className="sticky top-0 z-10 bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="px-3 py-2.5">
                  <SortButton
                    label="Perangkat"
                    field="nama"
                    sortField={sortField}
                    sortDir={sortDir}
                    onClick={toggleSort}
                  />
                </th>
                <th className="px-3 py-2.5">
                  <SortButton
                    label="Jenis"
                    field="jenis"
                    sortField={sortField}
                    sortDir={sortDir}
                    onClick={toggleSort}
                  />
                </th>
                <th className="px-3 py-2.5">Merk / Tipe &amp; SN</th>
                <th className="px-3 py-2.5">
                  <SortButton
                    label="Perusahaan & Cabang"
                    field="perusahaan"
                    sortField={sortField}
                    sortDir={sortDir}
                    onClick={toggleSort}
                  />
                </th>
                <th className="px-3 py-2.5">Pengguna</th>
                <th className="px-3 py-2.5">
                  <SortButton
                    label="Tgl Beli"
                    field="tglBeli"
                    sortField={sortField}
                    sortDir={sortDir}
                    onClick={toggleSort}
                  />
                </th>
                <th className="px-3 py-2.5 text-right">
                  <SortButton
                    label="Harga Beli"
                    field="hargaBeli"
                    sortField={sortField}
                    sortDir={sortDir}
                    onClick={toggleSort}
                  />
                </th>
                <th className="px-3 py-2.5">
                  <SortButton
                    label="Status"
                    field="status"
                    sortField={sortField}
                    sortDir={sortDir}
                    onClick={toggleSort}
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {hasilTersortir.map((d) => (
                <tr
                  key={d.id}
                  className="border-t border-slate-100 hover:bg-slate-50/70"
                >
                  <td className="px-3 py-2.5">
                    <Link
                      href={`/devices/${d.id}`}
                      className="inline-flex items-center gap-1 font-medium text-slate-800 hover:text-indigo-600 hover:underline"
                    >
                      <span>{d.nama}</span>
                      <ExternalLink className="h-3 w-3 text-slate-400" />
                    </Link>
                    {d.kodeInventaris && (
                      <p className="font-mono text-xs text-slate-400">
                        {d.kodeInventaris}
                      </p>
                    )}
                  </td>
                  <td className="px-3 py-2.5">
                    <span
                      className={
                        "inline-block rounded-full px-2.5 py-0.5 text-xs font-medium " +
                        jenisBadge(d.jenis)
                      }
                    >
                      {d.jenis}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-slate-600">
                    <p>{[d.merk, d.tipe].filter(Boolean).join(" · ") || "-"}</p>
                    {d.serialNumber && (
                      <p className="font-mono text-xs text-slate-400">
                        SN: {d.serialNumber}
                      </p>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-slate-600">
                    <p className="font-medium text-slate-700">{d.perusahaan}</p>
                    {d.cabang !== "-" && (
                      <p className="text-xs text-slate-400">{d.cabang}</p>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-slate-600">{d.pengguna}</td>
                  <td className="px-3 py-2.5 whitespace-nowrap text-xs text-slate-600">
                    {fmtTanggal(d.tglBeli)}
                  </td>
                  <td className="px-3 py-2.5 whitespace-nowrap text-right font-medium text-slate-700">
                    {fmtRupiah(d.hargaBeli)}
                  </td>
                  <td className="px-3 py-2.5">
                    <span
                      className={
                        "inline-block rounded-full px-2.5 py-0.5 text-xs font-medium " +
                        statusBadge(d.status)
                      }
                    >
                      {d.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 2. POP-UP MODAL: DETAIL PERANGKAT DARI KLIK GRAFIK / KPI
// ============================================================================
export function PerangkatBaruModal({
  title,
  subtitle,
  items,
  hideJenisFilter = false,
  onClose,
  onBukaSubMenu,
}: {
  title: string;
  subtitle?: string;
  items: DeviceBaruItem[];
  hideJenisFilter?: boolean;
  onClose: () => void;
  onBukaSubMenu?: (jenisTerpilih: string) => void;
}) {
  const [jenisFilter, setJenisFilter] = useState<string>("ALL");
  const [search, setSearch] = useState("");

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const jenisPills = useMemo(() => {
    if (hideJenisFilter) return [];
    const map = new Map<string, number>();
    for (const d of items) {
      map.set(d.jenis, (map.get(d.jenis) ?? 0) + 1);
    }
    const entries = Array.from(map.entries()).sort((a, b) => {
      if (a[0] === "Laptop") return -1;
      if (b[0] === "Laptop") return 1;
      return b[1] - a[1];
    });
    return [
      { nama: "ALL", label: "Semua", jumlah: items.length },
      ...entries.map(([nama, jumlah]) => ({ nama, label: nama, jumlah })),
    ];
  }, [items, hideJenisFilter]);

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((d) => {
      if (
        !hideJenisFilter &&
        jenisFilter !== "ALL" &&
        d.jenis !== jenisFilter
      ) {
        return false;
      }
      if (!q) return true;
      return [
        d.nama,
        d.kodeInventaris ?? "",
        d.merk ?? "",
        d.tipe ?? "",
        d.serialNumber ?? "",
        d.perusahaan,
        d.cabang,
        d.pengguna,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [items, jenisFilter, search, hideJenisFilter]);

  const totalNilai = useMemo(
    () => filteredItems.reduce((sum, d) => sum + (d.hargaBeli ?? 0), 0),
    [filteredItems],
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/45 backdrop-blur-sm"
      />

      {/* Dialog */}
      <div className="relative z-10 flex max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header Modal */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-6 py-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
              <Laptop className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-800">
                {title}
              </h3>
              {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
              <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 font-medium text-indigo-700">
                  {filteredItems.length} unit
                </span>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 font-medium text-slate-700">
                  Total Nilai: {fmtRupiah(totalNilai)}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Filter Bar di dalam Modal */}
        <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            {jenisPills.length > 1 ? (
              <div className="flex flex-wrap gap-1.5">
                {jenisPills.map((p) => (
                  <button
                    key={p.nama}
                    type="button"
                    onClick={() => setJenisFilter(p.nama)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                      jenisFilter === p.nama
                        ? "bg-indigo-600 text-white"
                        : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {p.label} ({p.jumlah})
                  </button>
                ))}
              </div>
            ) : (
              <div />
            )}

            {onBukaSubMenu && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onBukaSubMenu(jenisFilter);
                }}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
              >
                Buka di Sub-Menu Daftar Perangkat →
              </button>
            )}
          </div>

          <div className="relative mt-2.5">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter cepat nama, kode inventaris, merk, SN, perusahaan, atau pengguna..."
              className="w-full rounded-lg border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-xs outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        {/* Isi Tabel */}
        <div className="flex-1 overflow-auto p-6">
          {filteredItems.length === 0 ? (
            <p className="py-10 text-center text-sm text-slate-400">
              Tidak ada perangkat untuk kriteria ini.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-100">
              <table className="w-full min-w-[780px] text-sm">
                <thead className="bg-slate-50 text-left text-xs text-slate-600">
                  <tr>
                    <th className="px-3 py-2.5">Perangkat</th>
                    <th className="px-3 py-2.5">Jenis</th>
                    <th className="px-3 py-2.5">Merk / Tipe &amp; SN</th>
                    <th className="px-3 py-2.5">Perusahaan &amp; Cabang</th>
                    <th className="px-3 py-2.5">Pengguna</th>
                    <th className="px-3 py-2.5">Tgl Beli</th>
                    <th className="px-3 py-2.5 text-right">Harga Beli</th>
                    <th className="px-3 py-2.5">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((d) => (
                    <tr
                      key={d.id}
                      className="border-t border-slate-100 hover:bg-slate-50/70"
                    >
                      <td className="px-3 py-2.5">
                        <Link
                          href={`/devices/${d.id}`}
                          className="inline-flex items-center gap-1 font-medium text-slate-800 hover:text-indigo-600 hover:underline"
                        >
                          <span>{d.nama}</span>
                          <ExternalLink className="h-3 w-3 text-slate-400" />
                        </Link>
                        {d.kodeInventaris && (
                          <p className="font-mono text-xs text-slate-400">
                            {d.kodeInventaris}
                          </p>
                        )}
                      </td>
                      <td className="px-3 py-2.5">
                        <span
                          className={
                            "inline-block rounded-full px-2 py-0.5 text-xs font-medium " +
                            jenisBadge(d.jenis)
                          }
                        >
                          {d.jenis}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-xs text-slate-600">
                        <p>
                          {[d.merk, d.tipe].filter(Boolean).join(" · ") || "-"}
                        </p>
                        {d.serialNumber && (
                          <p className="font-mono text-[11px] text-slate-400">
                            SN: {d.serialNumber}
                          </p>
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-xs text-slate-600">
                        <p className="font-medium text-slate-700">
                          {d.perusahaan}
                        </p>
                        {d.cabang !== "-" && (
                          <p className="text-slate-400">{d.cabang}</p>
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-xs text-slate-600">
                        {d.pengguna}
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap text-xs text-slate-500">
                        {fmtTanggal(d.tglBeli)}
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap text-right text-xs font-medium text-slate-700">
                        {fmtRupiah(d.hargaBeli)}
                      </td>
                      <td className="px-3 py-2.5">
                        <span
                          className={
                            "inline-block rounded-full px-2 py-0.5 text-[11px] font-medium " +
                            statusBadge(d.status)
                          }
                        >
                          {d.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
