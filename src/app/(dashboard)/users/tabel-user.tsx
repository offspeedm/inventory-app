// src/app/(dashboard)/users/tabel-user.tsx
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
import { BarisUser } from "./baris-user";
import { PaginationBar } from "@/components/pagination-bar";

export type UserRow = {
  id: number;
  nama: string;
  email: string;
  noTelp: string | null;
  divisi: string | null;
  status: string;
  companyId: number | null;
  branchId: number | null;
  company: { nama: string } | null;
  branch: { nama: string } | null;
};

type TabelUserProps = {
  users: UserRow[];
  companies: { id: number; nama: string }[];
  branches: { id: number; nama: string; companyId: number | null }[];
};

type SortField = "nama" | "divisi" | "penempatan" | "status";
type SortDir = "asc" | "desc";

const STATUS_OPTIONS = ["Aktif", "Non-Aktif"] as const;
const TANPA_DIVISI_VALUE = "__TANPA_DIVISI__";

function isNonAktifStatus(status: string): boolean {
  const s = status.trim().toLowerCase();
  return s === "non-aktif" || s === "nonaktif";
}

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

export function TabelUser({ users, companies, branches }: TabelUserProps) {
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
  const [selectedDivisions, setSelectedDivisions] = useState<string[]>(() =>
    parseStringList(searchParams.get("divisi")),
  );
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(() =>
    parseStringList(searchParams.get("status")),
  );

  // Otomatis terbuka jika sudah ada filter aktif di URL, default tertutup agar ringkas
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(() =>
    Boolean(
      searchParams.get("company") ||
      searchParams.get("branch") ||
      searchParams.get("divisi") ||
      searchParams.get("status"),
    ),
  );

  const [sortField, setSortField] = useState<SortField>(() => {
    const s = searchParams.get("sort");
    if (
      s === "nama" ||
      s === "divisi" ||
      s === "penempatan" ||
      s === "status"
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
    if (selectedDivisions.length > 0)
      params.set("divisi", selectedDivisions.join(","));
    if (selectedStatuses.length > 0)
      params.set("status", selectedStatuses.join(","));
    if (sortField !== "nama") params.set("sort", sortField);
    if (sortDir !== "asc") params.set("dir", sortDir);
    if (page > 1) params.set("page", String(page));
    if (pageSize !== 10) params.set("size", String(pageSize));
    return params.toString();
  }, [
    search,
    selectedCompanies,
    selectedBranches,
    selectedDivisions,
    selectedStatuses,
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

  // Daftar divisi unik dari data user
  const divisionOptions = useMemo(() => {
    const set = new Set<string>();
    let hasEmpty = false;
    users.forEach((u) => {
      const div = u.divisi?.trim();
      if (div) {
        set.add(div);
      } else {
        hasEmpty = true;
      }
    });
    const list = Array.from(set)
      .sort((a, b) => a.localeCompare(b, "id"))
      .map((val) => ({ value: val, label: val }));
    if (hasEmpty) {
      list.push({ value: TANPA_DIVISI_VALUE, label: "Tanpa divisi" });
    }
    return list;
  }, [users]);

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
    selectedDivisions.length +
    selectedStatuses.length;

  function resetAllFilters() {
    setSelectedCompanies([]);
    setSelectedBranches([]);
    setSelectedDivisions([]);
    setSelectedStatuses([]);
    setPage(1);
  }

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();

    return users.filter((u) => {
      if (q) {
        const haystack = [
          u.nama,
          u.email,
          u.noTelp,
          u.divisi,
          u.status,
          u.company?.nama,
          u.branch?.nama,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      if (
        selectedCompanies.length > 0 &&
        (!u.companyId || !selectedCompanies.includes(u.companyId))
      ) {
        return false;
      }

      if (
        selectedBranches.length > 0 &&
        (!u.branchId || !selectedBranches.includes(u.branchId))
      ) {
        return false;
      }

      if (selectedDivisions.length > 0) {
        const userDiv = u.divisi?.trim() || TANPA_DIVISI_VALUE;
        if (!selectedDivisions.includes(userDiv)) return false;
      }

      if (selectedStatuses.length > 0) {
        const normalizedStatus = isNonAktifStatus(u.status)
          ? "Non-Aktif"
          : "Aktif";
        if (!selectedStatuses.includes(normalizedStatus)) return false;
      }

      return true;
    });
  }, [
    users,
    search,
    selectedCompanies,
    selectedBranches,
    selectedDivisions,
    selectedStatuses,
  ]);

  const sortedUsers = useMemo(() => {
    const copy = [...filteredUsers];
    const dir = sortDir === "asc" ? 1 : -1;

    copy.sort((a, b) => {
      if (sortField === "nama") {
        return a.nama.localeCompare(b.nama, "id") * dir;
      }
      if (sortField === "divisi") {
        return (a.divisi ?? "").localeCompare(b.divisi ?? "", "id") * dir;
      }
      if (sortField === "penempatan") {
        const penA = `${a.company?.nama ?? ""} ${a.branch?.nama ?? ""}`;
        const penB = `${b.company?.nama ?? ""} ${b.branch?.nama ?? ""}`;
        return penA.localeCompare(penB, "id") * dir;
      }
      if (sortField === "status") {
        return a.status.localeCompare(b.status, "id") * dir;
      }
      return 0;
    });

    return copy;
  }, [filteredUsers, sortField, sortDir]);

  const totalItems = sortedUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(page, totalPages);

  const paginatedUsers = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return sortedUsers.slice(start, start + pageSize);
  }, [sortedUsers, safePage, pageSize]);

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
        {/* Header Bar Filter (Klik untuk buka/tutup dropdown) */}
        <div
          role="button"
          tabIndex={0}
          aria-expanded={isFilterOpen}
          onClick={() => setIsFilterOpen((prev) => !prev)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setIsFilterOpen((prev) => !prev);
            }
          }}
          className={
            "flex flex-wrap items-center justify-between gap-2 bg-slate-50/80 px-4 py-2.5 transition hover:bg-slate-100/80 select-none cursor-pointer " +
            (isFilterOpen ? "border-b border-slate-200" : "")
          }
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-3.5 w-3.5 text-indigo-600" />
            <span className="text-xs font-semibold tracking-wider text-slate-600 uppercase">
              Filter User
            </span>
            {activeFilterCount > 0 && (
              <span className="inline-flex items-center rounded-full bg-indigo-600 px-2 py-0.5 text-[11px] font-semibold text-white">
                {activeFilterCount} aktif
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  resetAllFilters();
                }}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" />
                Reset Filter
              </button>
            )}

            <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500">
              <span>{isFilterOpen ? "Tutup" : "Tampilkan"}</span>
              <ChevronDown
                className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${
                  isFilterOpen ? "rotate-180" : ""
                }`}
              />
            </span>
          </div>
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

            {/* Kolom 3: Divisi */}
            <div className="flex flex-col p-3 lg:col-span-3">
              <div className="mb-2 border-b border-slate-100 pb-1.5 text-center text-xs font-semibold text-slate-700">
                Divisi
              </div>
              <div className="flex flex-col gap-1.5">
                {divisionOptions.map((div) => (
                  <SlicerButton
                    key={div.value}
                    label={div.label}
                    active={selectedDivisions.includes(div.value)}
                    onClick={() => {
                      setSelectedDivisions((prev) =>
                        toggleString(prev, div.value),
                      );
                      setPage(1);
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Kolom 4: Status */}
            <div className="flex flex-col p-3 lg:col-span-2">
              <div className="mb-2 border-b border-slate-100 pb-1.5 text-center text-xs font-semibold text-slate-700">
                Status
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
          placeholder="Cari nama, kontak, divisi, status..."
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
          {paginatedUsers.length}
        </span>{" "}
        dari <span className="font-medium text-slate-700">{totalItems}</span>{" "}
        user (total {users.length}).
      </p>

      {/* ================= TABEL USER ================= */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50/80 text-left text-xs font-semibold text-slate-600">
              <tr>
                <th className="w-12 px-4 py-3">No</th>
                <th className="px-4 py-3">
                  <SortButton
                    label="Nama / Kontak"
                    active={sortField === "nama"}
                    dir={sortDir}
                    onClick={() => handleSort("nama")}
                  />
                </th>
                <th className="px-4 py-3">
                  <SortButton
                    label="Divisi"
                    active={sortField === "divisi"}
                    dir={sortDir}
                    onClick={() => handleSort("divisi")}
                  />
                </th>
                <th className="px-4 py-3">
                  <SortButton
                    label="Penempatan"
                    active={sortField === "penempatan"}
                    dir={sortDir}
                    onClick={() => handleSort("penempatan")}
                  />
                </th>
                <th className="px-4 py-3">
                  <SortButton
                    label="Status"
                    active={sortField === "status"}
                    dir={sortDir}
                    onClick={() => handleSort("status")}
                  />
                </th>
                <th className="w-28 px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-sm text-slate-400"
                  >
                    Tidak ada user yang sesuai dengan filter atau pencarian.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user, idx) => (
                  <BarisUser
                    key={user.id}
                    user={user}
                    index={(safePage - 1) * pageSize + idx}
                    companies={companies}
                    branches={branches}
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
