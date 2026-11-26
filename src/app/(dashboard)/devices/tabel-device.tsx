// src/app/(dashboard)/devices/tabel-device.tsx
"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Search,
  X,
  RotateCcw,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Check,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";
import { BarisDevice } from "./baris-device";
import { PaginationBar } from "@/components/pagination-bar";

export type DeviceItem = {
  id: number;
  nama: string;
  kodeInventaris: string | null;
  merk: string | null;
  tipe: string | null;
  serialNumber: string | null;
  tglBeli: Date | null;
  hargaBeli: number | null;
  status: string;
  keterangan: string | null;
  typeId: number | null;
  companyId: number | null;
  branchId: number | null;
  userId: number | null;
  type: { nama: string } | null;
  company: { nama: string } | null;
  branch: { nama: string } | null;
  user: { nama: string } | null;
  attributes: { key: string; value: string }[];
  attachmentsCount: number;
};

type TabelDeviceProps = {
  devices: DeviceItem[];
  deviceTypes: { id: number; nama: string; spesifikasi?: string[] }[];
  companies: { id: number; nama: string }[];
  branches: { id: number; nama: string; companyId: number | null }[];
  users: { id: number; nama: string }[];
};

type SortField = "nama" | "jenis" | "usia" | "status" | "penempatan";
type SortDir = "asc" | "desc";

const STATUS_OPTIONS = [
  "Aktif",
  "Available",
  "Rusak",
  "Perbaikan",
  "Tidak dipakai",
  "Hilang",
  "Dihibahkan",
] as const;

function parseNumberList(param: string | null): number[] {
  if (!param) return [];
  return param
    .split(",")
    .map((v) => Number(v.trim()))
    .filter((n) => !Number.isNaN(n) && n > 0);
}

function parseStringList(param: string | null): string[] {
  if (!param) return [];
  return param
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

export function TabelDevice({
  devices,
  deviceTypes,
  companies,
  branches,
  users,
}: TabelDeviceProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(() => searchParams.get("q") ?? "");
  const [selectedCompanies, setSelectedCompanies] = useState<number[]>(() =>
    parseNumberList(searchParams.get("company")),
  );
  const [selectedBranches, setSelectedBranches] = useState<number[]>(() =>
    parseNumberList(searchParams.get("branch")),
  );
  const [selectedTypes, setSelectedTypes] = useState<number[]>(() =>
    parseNumberList(searchParams.get("type")),
  );
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(() =>
    parseStringList(searchParams.get("status")),
  );
  const [onlyOver3Years, setOnlyOver3Years] = useState<boolean>(
    () => searchParams.get("over3y") === "1",
  );

  // Otomatis terbuka jika ada filter aktif di URL, default tertutup saat bersih
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(() =>
    Boolean(
      searchParams.get("company") ||
      searchParams.get("branch") ||
      searchParams.get("type") ||
      searchParams.get("status") ||
      searchParams.get("over3y") === "1",
    ),
  );

  const [sortField, setSortField] = useState<SortField>(() => {
    const s = searchParams.get("sort");
    if (
      s === "nama" ||
      s === "jenis" ||
      s === "usia" ||
      s === "status" ||
      s === "penempatan"
    ) {
      return s;
    }
    return "nama";
  });
  const [sortDir, setSortDir] = useState<SortDir>(() =>
    searchParams.get("dir") === "desc" ? "desc" : "asc",
  );

  const [page, setPage] = useState<number>(() => {
    const p = Number(searchParams.get("page"));
    return !Number.isNaN(p) && p > 0 ? p : 1;
  });
  const [pageSize, setPageSize] = useState<number>(() => {
    const s = Number(searchParams.get("size"));
    return [10, 25, 50, 100].includes(s) ? s : 10;
  });

  const autoEditId = useMemo(() => {
    const e = Number(searchParams.get("edit"));
    return !Number.isNaN(e) && e > 0 ? e : null;
  }, [searchParams]);

  // Sinkronisasi state filter/pencarian ke URL query string
  const buildQueryString = useCallback(() => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("q", search.trim());
    if (selectedCompanies.length > 0)
      params.set("company", selectedCompanies.join(","));
    if (selectedBranches.length > 0)
      params.set("branch", selectedBranches.join(","));
    if (selectedTypes.length > 0) params.set("type", selectedTypes.join(","));
    if (selectedStatuses.length > 0)
      params.set("status", selectedStatuses.join(","));
    if (onlyOver3Years) params.set("over3y", "1");
    if (sortField !== "nama") params.set("sort", sortField);
    if (sortDir !== "asc") params.set("dir", sortDir);
    if (page > 1) params.set("page", String(page));
    if (pageSize !== 10) params.set("size", String(pageSize));
    return params.toString();
  }, [
    search,
    selectedCompanies,
    selectedBranches,
    selectedTypes,
    selectedStatuses,
    onlyOver3Years,
    sortField,
    sortDir,
    page,
    pageSize,
  ]);

  useEffect(() => {
    const qs = buildQueryString();
    const currentQs = searchParams.toString();
    if (qs !== currentQs) {
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    }
  }, [buildQueryString, pathname, router, searchParams]);

  const rawQuery = buildQueryString();
  const detailQuery = rawQuery ? `?${rawQuery}` : "";

  const availableBranches = useMemo(() => {
    if (selectedCompanies.length === 0) return branches;
    return branches.filter(
      (b) => b.companyId !== null && selectedCompanies.includes(b.companyId),
    );
  }, [branches, selectedCompanies]);

  function toggleNumber(list: number[], id: number): number[] {
    return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
  }

  function toggleString(list: string[], val: string): string[] {
    return list.includes(val) ? list.filter((x) => x !== val) : [...list, val];
  }

  function handleToggleCompany(companyId: number) {
    const nextCompanies = toggleNumber(selectedCompanies, companyId);
    setSelectedCompanies(nextCompanies);
    if (nextCompanies.length > 0) {
      setSelectedBranches((prev) =>
        prev.filter((bId) => {
          const branch = branches.find((b) => b.id === bId);
          return (
            branch?.companyId !== null &&
            branch?.companyId !== undefined &&
            nextCompanies.includes(branch.companyId)
          );
        }),
      );
    }
    setPage(1);
  }

  const activeFilterCount =
    selectedCompanies.length +
    selectedBranches.length +
    selectedTypes.length +
    selectedStatuses.length +
    (onlyOver3Years ? 1 : 0);

  function resetAllFilters() {
    setSelectedCompanies([]);
    setSelectedBranches([]);
    setSelectedTypes([]);
    setSelectedStatuses([]);
    setOnlyOver3Years(false);
    setPage(1);
  }

  const filteredDevices = useMemo(() => {
    const q = search.trim().toLowerCase();
    const batasTigaTahun = new Date();
    batasTigaTahun.setFullYear(batasTigaTahun.getFullYear() - 3);

    return devices.filter((d) => {
      if (q) {
        const haystack = [
          d.nama,
          d.merk,
          d.tipe,
          d.serialNumber,
          d.type?.nama,
          d.company?.nama,
          d.branch?.nama,
          d.user?.nama,
          ...d.attributes.map((a) => `${a.key} ${a.value}`),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      if (
        selectedCompanies.length > 0 &&
        (!d.companyId || !selectedCompanies.includes(d.companyId))
      ) {
        return false;
      }

      if (
        selectedBranches.length > 0 &&
        (!d.branchId || !selectedBranches.includes(d.branchId))
      ) {
        return false;
      }

      if (
        selectedTypes.length > 0 &&
        (!d.typeId || !selectedTypes.includes(d.typeId))
      ) {
        return false;
      }

      if (selectedStatuses.length > 0 && !selectedStatuses.includes(d.status)) {
        return false;
      }

      if (onlyOver3Years) {
        if (!d.tglBeli) return false;
        if (new Date(d.tglBeli) > batasTigaTahun) return false;
      }

      return true;
    });
  }, [
    devices,
    search,
    selectedCompanies,
    selectedBranches,
    selectedTypes,
    selectedStatuses,
    onlyOver3Years,
  ]);

  const sortedDevices = useMemo(() => {
    const copy = [...filteredDevices];
    const dir = sortDir === "asc" ? 1 : -1;

    copy.sort((a, b) => {
      if (sortField === "nama") {
        return a.nama.localeCompare(b.nama, "id") * dir;
      }
      if (sortField === "jenis") {
        return (
          (a.type?.nama ?? "").localeCompare(b.type?.nama ?? "", "id") * dir
        );
      }
      if (sortField === "status") {
        return a.status.localeCompare(b.status, "id") * dir;
      }
      if (sortField === "penempatan") {
        const penA = `${a.company?.nama ?? ""} ${a.branch?.nama ?? ""} ${a.user?.nama ?? ""}`;
        const penB = `${b.company?.nama ?? ""} ${b.branch?.nama ?? ""} ${b.user?.nama ?? ""}`;
        return penA.localeCompare(penB, "id") * dir;
      }
      if (sortField === "usia") {
        if (!a.tglBeli && !b.tglBeli) return 0;
        if (!a.tglBeli) return 1;
        if (!b.tglBeli) return -1;
        return (
          (new Date(b.tglBeli).getTime() - new Date(a.tglBeli).getTime()) * dir
        );
      }
      return 0;
    });

    return copy;
  }, [filteredDevices, sortField, sortDir]);

  const totalItems = sortedDevices.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(page, totalPages);

  const paginatedDevices = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return sortedDevices.slice(start, start + pageSize);
  }, [sortedDevices, safePage, pageSize]);

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
    setPage(1);
  }

  return (
    <div className="space-y-3">
      {/* ================= FILTER SLICER DROPDOWN CARD ================= */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        {/* Header Bar Filter */}
        <div
          className={
            "flex items-center justify-between gap-2 bg-slate-50/80 px-4 py-2.5 " +
            (isFilterOpen ? "border-b border-slate-200" : "")
          }
        >
          <button
            type="button"
            aria-expanded={isFilterOpen}
            onClick={() => setIsFilterOpen((prev) => !prev)}
            className="flex flex-1 items-center justify-between gap-2 text-left cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-3.5 w-3.5 text-indigo-600" />
              <span className="text-xs font-semibold tracking-wider text-slate-600 uppercase">
                Filter Perangkat
              </span>
              {activeFilterCount > 0 && (
                <span className="inline-flex items-center rounded-full bg-indigo-600 px-2 py-0.5 text-[11px] font-semibold text-white">
                  {activeFilterCount} aktif
                </span>
              )}
            </div>

            <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-indigo-600">
              <span>{isFilterOpen ? "Tutup" : "Tampilkan"}</span>
              <ChevronDown
                className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${
                  isFilterOpen ? "rotate-180" : ""
                }`}
              />
            </span>
          </button>

          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={resetAllFilters}
              className="ml-2 inline-flex shrink-0 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" />
              Reset Filter
            </button>
          )}
        </div>

        {/* Isi Dropdown: Grid 12 Kolom */}
        {isFilterOpen && (
          <div className="grid grid-cols-1 divide-y divide-slate-200 sm:grid-cols-2 lg:grid-cols-12 lg:divide-x lg:divide-y-0">
            {/* Kolom 1: Perusahaan */}
            <div className="flex flex-col p-3 lg:col-span-3">
              <div className="mb-2 border-b border-slate-100 pb-1.5 text-center text-xs font-semibold text-slate-700">
                Perusahaan
              </div>
              <div className="flex flex-col gap-1.5">
                {companies.map((c) => (
                  <SlicerButton
                    key={c.id}
                    label={c.nama.replace(/^PT\.?\s*/i, "")}
                    active={selectedCompanies.includes(c.id)}
                    onClick={() => handleToggleCompany(c.id)}
                  />
                ))}
              </div>
            </div>

            {/* Kolom 2: Cabang (3 sub-kolom, judul di tengah) */}
            <div className="flex flex-col p-3 sm:col-span-2 lg:col-span-4">
              <div className="mb-2 flex items-center justify-center gap-1.5 border-b border-slate-100 pb-1.5 text-center">
                <span className="text-xs font-semibold text-slate-700">
                  Cabang
                </span>
                {selectedCompanies.length > 0 && (
                  <span className="text-[11px] text-slate-400">
                    ({availableBranches.length})
                  </span>
                )}
              </div>
              {availableBranches.length === 0 ? (
                <p className="py-4 text-center text-xs text-slate-400">
                  Tidak ada cabang
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                  {availableBranches.map((b) => (
                    <SlicerButton
                      key={b.id}
                      label={b.nama}
                      compact
                      active={selectedBranches.includes(b.id)}
                      onClick={() => {
                        setSelectedBranches((prev) => toggleNumber(prev, b.id));
                        setPage(1);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Kolom 3: Jenis */}
            <div className="flex flex-col p-3 lg:col-span-2">
              <div className="mb-2 border-b border-slate-100 pb-1.5 text-center text-xs font-semibold text-slate-700">
                Jenis
              </div>
              <div className="flex flex-col gap-1.5">
                {deviceTypes.map((dt) => (
                  <SlicerButton
                    key={dt.id}
                    label={dt.nama}
                    active={selectedTypes.includes(dt.id)}
                    onClick={() => {
                      setSelectedTypes((prev) => toggleNumber(prev, dt.id));
                      setPage(1);
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Kolom 4: Status dan Usia */}
            <div className="flex flex-col justify-between p-3 lg:col-span-3">
              <div>
                <div className="mb-2 border-b border-slate-100 pb-1.5 text-center text-xs font-semibold text-slate-700">
                  Status dan Usia
                </div>
                <div className="flex flex-col gap-1.5">
                  {STATUS_OPTIONS.map((st) => (
                    <SlicerButton
                      key={st}
                      label={st}
                      active={selectedStatuses.includes(st)}
                      onClick={() => {
                        setSelectedStatuses((prev) => toggleString(prev, st));
                        setPage(1);
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-2.5 border-t border-slate-100 pt-2.5">
                <SlicerButton
                  label="Di atas 3 Tahun (> 3 Thn)"
                  active={onlyOver3Years}
                  onClick={() => {
                    setOnlyOver3Years((prev) => !prev);
                    setPage(1);
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ================= TEXTBOX SEARCH ================= */}
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Cari nama, merk, serial..."
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pr-9 pl-10 text-sm text-slate-700 shadow-xs placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none"
        />
        {search && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setPage(1);
            }}
            aria-label="Hapus pencarian"
            className="absolute top-1/2 right-3 -translate-y-1/2 rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Info jumlah data */}
      <p className="text-xs text-slate-500">
        Menampilkan{" "}
        <span className="font-medium text-slate-700">
          {paginatedDevices.length}
        </span>{" "}
        dari <span className="font-medium text-slate-700">{totalItems}</span>{" "}
        perangkat (total {devices.length}).
      </p>

      {/* ================= TABEL PERANGKAT ================= */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50/80 text-left text-xs font-semibold text-slate-600">
              <tr>
                <th className="w-12 px-4 py-3">No</th>
                <th className="w-[320px] max-w-[320px] px-4 py-3">
                  <SortButton
                    label="Perangkat"
                    active={sortField === "nama"}
                    dir={sortDir}
                    onClick={() => handleSort("nama")}
                  />
                </th>
                <th className="w-28 px-4 py-3">
                  <SortButton
                    label="Jenis"
                    active={sortField === "jenis"}
                    dir={sortDir}
                    onClick={() => handleSort("jenis")}
                  />
                </th>
                <th className="w-28 px-4 py-3">
                  <SortButton
                    label="Usia"
                    active={sortField === "usia"}
                    dir={sortDir}
                    onClick={() => handleSort("usia")}
                  />
                </th>
                <th className="w-28 px-4 py-3">
                  <SortButton
                    label="Status"
                    active={sortField === "status"}
                    dir={sortDir}
                    onClick={() => handleSort("status")}
                  />
                </th>
                <th className="w-52 px-4 py-3">
                  <SortButton
                    label="Penempatan / Pengguna"
                    active={sortField === "penempatan"}
                    dir={sortDir}
                    onClick={() => handleSort("penempatan")}
                  />
                </th>
                <th className="w-28 px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedDevices.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-sm text-slate-400"
                  >
                    Tidak ada perangkat yang sesuai dengan filter atau
                    pencarian.
                  </td>
                </tr>
              ) : (
                paginatedDevices.map((device, idx) => (
                  <BarisDevice
                    key={device.id}
                    device={device}
                    index={(safePage - 1) * pageSize + idx}
                    deviceTypes={deviceTypes}
                    companies={companies}
                    branches={branches}
                    users={users}
                    autoEditId={autoEditId}
                    detailQuery={detailQuery}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <PaginationBar
        page={safePage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
        pageSizeOptions={[10, 25, 50, 100]}
      />
    </div>
  );
}

function SlicerButton({
  label,
  active,
  compact = false,
  onClick,
}: {
  label: string;
  active: boolean;
  compact?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className={
        "flex w-full items-center justify-between gap-1 rounded-lg border text-left font-medium transition cursor-pointer " +
        (compact ? "px-2 py-1.5 text-[11px] " : "px-2.5 py-1.5 text-xs ") +
        (active
          ? "border-indigo-600 bg-indigo-600 text-white shadow-xs"
          : "border-slate-200/80 bg-slate-50/70 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50/60 hover:text-indigo-700")
      }
    >
      <span className="truncate">{label}</span>
      {active && <Check className="h-3 w-3 shrink-0" />}
    </button>
  );
}

function SortButton({
  label,
  active,
  dir,
  onClick,
}: {
  label: string;
  active: boolean;
  dir: SortDir;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 text-left font-semibold text-slate-600 hover:text-indigo-600 cursor-pointer"
    >
      <span>{label}</span>
      {!active ? (
        <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
      ) : dir === "asc" ? (
        <ArrowUp className="h-3.5 w-3.5 text-indigo-600" />
      ) : (
        <ArrowDown className="h-3.5 w-3.5 text-indigo-600" />
      )}
    </button>
  );
}
