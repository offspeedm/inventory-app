"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { BarisDevice } from "./baris-device";
import { FilterDropdown } from "@/components/filter-dropdown";
import { PaginationBar } from "@/components/pagination-bar";

type DeviceType = { id: number; nama: string };
type Company = { id: number; nama: string };
type Branch = { id: number; nama: string; companyId: number | null };
type UserOpt = { id: number; nama: string };
type Attr = { key: string; value: string | null };
type DeviceRow = {
  id: number;
  kodeInventaris: string | null;
  nama: string;
  merk: string | null;
  tipe: string | null;
  keterangan: string | null;
  serialNumber: string | null;
  tglBeli: Date | null;
  hargaBeli: number | null;
  status: string;
  typeId: number | null;
  companyId: number | null;
  branchId: number | null;
  userId: number | null;
  type: { nama: string } | null;
  company: { nama: string } | null;
  branch: { nama: string } | null;
  user: { nama: string } | null;
  attachmentsCount: number;
  attributes: Attr[];
};

const STATUS_LIST = ["Aktif", "Rusak", "Perbaikan", "Tidak dipakai", "Hilang"];
const VALID_PAGE_SIZES = [10, 25, 50, 100];
type SortField = "nama" | "jenis" | "status";
type SortDir = "asc" | "desc";
const VALID_SORT_FIELDS: SortField[] = ["nama", "jenis", "status"];

function parsePage(raw: string | null): number {
  const n = Number(raw);
  return Number.isInteger(n) && n > 0 ? n : 1;
}

function parsePageSize(raw: string | null): number {
  const n = Number(raw);
  return VALID_PAGE_SIZES.includes(n) ? n : 10;
}

function parseSortField(raw: string | null): SortField {
  return VALID_SORT_FIELDS.includes(raw as SortField)
    ? (raw as SortField)
    : "nama";
}

function parseSortDir(raw: string | null): SortDir {
  return raw === "desc" ? "desc" : "asc";
}

function parseIdList(values: string[]): number[] {
  return Array.from(
    new Set(
      values
        .flatMap((v) => v.split(","))
        .map((v) => Number(v.trim()))
        .filter((n) => Number.isInteger(n) && n > 0),
    ),
  );
}

function buildQueryString(state: {
  q: string;
  companies: number[];
  branches: number[];
  types: number[];
  status: string[];
  usia: string[];
  sort: SortField;
  dir: SortDir;
  page: number;
  pageSize: number;
}): string {
  const params = new URLSearchParams();

  const trimmedQ = state.q.trim();
  if (trimmedQ) params.set("q", trimmedQ);

  state.companies.forEach((id) => params.append("company", String(id)));
  state.branches.forEach((id) => params.append("branch", String(id)));
  state.types.forEach((id) => params.append("type", String(id)));
  state.status.forEach((s) => params.append("status", s));
  state.usia.forEach((u) => params.append("usia", u));

  if (state.sort !== "nama") params.set("sort", state.sort);
  if (state.dir !== "asc") params.set("dir", state.dir);
  if (state.page > 1) params.set("page", String(state.page));
  if (state.pageSize !== 10) params.set("pageSize", String(state.pageSize));

  return params.toString();
}

export function TabelDevice({
  devices,
  deviceTypes,
  companies,
  branches,
  users,
}: {
  devices: DeviceRow[];
  deviceTypes: DeviceType[];
  companies: Company[];
  branches: Branch[];
  users: UserOpt[];
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [cari, setCari] = useState(() => searchParams.get("q") ?? "");
  const [selectedCompanies, setSelectedCompanies] = useState<number[]>(() =>
    parseIdList(searchParams.getAll("company")),
  );
  const [selectedBranches, setSelectedBranches] = useState<number[]>(() =>
    parseIdList(searchParams.getAll("branch")),
  );
  const [selectedTypes, setSelectedTypes] = useState<number[]>(() =>
    parseIdList(searchParams.getAll("type")),
  );
  const [selectedStatus, setSelectedStatus] = useState<string[]>(() =>
    searchParams.getAll("status").filter((s) => STATUS_LIST.includes(s)),
  );
  const [filterUsia3Thn, setFilterUsia3Thn] = useState<string[]>(() =>
    searchParams.getAll("usia").filter((u) => u === "diatas_3_tahun"),
  );

  const [sortField, setSortField] = useState<SortField>(() =>
    parseSortField(searchParams.get("sort")),
  );
  const [sortDir, setSortDir] = useState<SortDir>(() =>
    parseSortDir(searchParams.get("dir")),
  );
  const [page, setPage] = useState(() => parsePage(searchParams.get("page")));
  const [pageSize, setPageSize] = useState(() =>
    parsePageSize(searchParams.get("pageSize")),
  );

  const lastPushedQueryRef = useRef<string>(searchParams.toString());

  const syncQueryToUrl = useCallback(
    (qs: string) => {
      if (qs === lastPushedQueryRef.current) return;
      lastPushedQueryRef.current = qs;
      const target = qs ? `${pathname}?${qs}` : pathname;
      window.history.replaceState(null, "", target);
    },
    [pathname],
  );

  // Sinkronkan ulang state jika navigasi datang dari luar (tombol Back/Forward browser)
  useEffect(() => {
    const currentUrlQs = searchParams.toString();
    if (currentUrlQs === lastPushedQueryRef.current) return;

    lastPushedQueryRef.current = currentUrlQs;
    setCari(searchParams.get("q") ?? "");
    setSelectedCompanies(parseIdList(searchParams.getAll("company")));
    setSelectedBranches(parseIdList(searchParams.getAll("branch")));
    setSelectedTypes(parseIdList(searchParams.getAll("type")));
    setSelectedStatus(
      searchParams.getAll("status").filter((s) => STATUS_LIST.includes(s)),
    );
    setFilterUsia3Thn(
      searchParams.getAll("usia").filter((u) => u === "diatas_3_tahun"),
    );
    setSortField(parseSortField(searchParams.get("sort")));
    setSortDir(parseSortDir(searchParams.get("dir")));
    setPage(parsePage(searchParams.get("page")));
    setPageSize(parsePageSize(searchParams.get("pageSize")));
  }, [searchParams]);

  // Debounce pembaruan URL khusus input pencarian
  useEffect(() => {
    const timer = setTimeout(() => {
      const qs = buildQueryString({
        q: cari,
        companies: selectedCompanies,
        branches: selectedBranches,
        types: selectedTypes,
        status: selectedStatus,
        usia: filterUsia3Thn,
        sort: sortField,
        dir: sortDir,
        page,
        pageSize,
      });
      syncQueryToUrl(qs);
    }, 200);

    return () => clearTimeout(timer);
  }, [
    cari,
    selectedCompanies,
    selectedBranches,
    selectedTypes,
    selectedStatus,
    filterUsia3Thn,
    sortField,
    sortDir,
    page,
    pageSize,
    syncQueryToUrl,
  ]);

  const branchList = useMemo(() => {
    if (selectedCompanies.length === 0) return branches;
    return branches.filter(
      (b) => b.companyId && selectedCompanies.includes(b.companyId),
    );
  }, [branches, selectedCompanies]);

  function toggleCompany(id: number) {
    const nextCompanies = selectedCompanies.includes(id)
      ? selectedCompanies.filter((x) => x !== id)
      : [...selectedCompanies, id];

    const nextBranches =
      nextCompanies.length > 0
        ? selectedBranches.filter((bId) => {
            const br = branches.find((b) => b.id === bId);
            return br && br.companyId && nextCompanies.includes(br.companyId);
          })
        : selectedBranches;

    setSelectedCompanies(nextCompanies);
    setSelectedBranches(nextBranches);
    setPage(1);

    syncQueryToUrl(
      buildQueryString({
        q: cari,
        companies: nextCompanies,
        branches: nextBranches,
        types: selectedTypes,
        status: selectedStatus,
        usia: filterUsia3Thn,
        sort: sortField,
        dir: sortDir,
        page: 1,
        pageSize,
      }),
    );
  }

  function toggleBranch(id: number) {
    const nextBranches = selectedBranches.includes(id)
      ? selectedBranches.filter((x) => x !== id)
      : [...selectedBranches, id];

    setSelectedBranches(nextBranches);
    setPage(1);

    syncQueryToUrl(
      buildQueryString({
        q: cari,
        companies: selectedCompanies,
        branches: nextBranches,
        types: selectedTypes,
        status: selectedStatus,
        usia: filterUsia3Thn,
        sort: sortField,
        dir: sortDir,
        page: 1,
        pageSize,
      }),
    );
  }

  function toggleType(id: number) {
    const nextTypes = selectedTypes.includes(id)
      ? selectedTypes.filter((x) => x !== id)
      : [...selectedTypes, id];

    setSelectedTypes(nextTypes);
    setPage(1);

    syncQueryToUrl(
      buildQueryString({
        q: cari,
        companies: selectedCompanies,
        branches: selectedBranches,
        types: nextTypes,
        status: selectedStatus,
        usia: filterUsia3Thn,
        sort: sortField,
        dir: sortDir,
        page: 1,
        pageSize,
      }),
    );
  }

  function toggleStatus(value: string) {
    const nextStatus = selectedStatus.includes(value)
      ? selectedStatus.filter((x) => x !== value)
      : [...selectedStatus, value];

    setSelectedStatus(nextStatus);
    setPage(1);

    syncQueryToUrl(
      buildQueryString({
        q: cari,
        companies: selectedCompanies,
        branches: selectedBranches,
        types: selectedTypes,
        status: nextStatus,
        usia: filterUsia3Thn,
        sort: sortField,
        dir: sortDir,
        page: 1,
        pageSize,
      }),
    );
  }

  function toggleUsia3Thn(value: string) {
    const nextUsia = filterUsia3Thn.includes(value) ? [] : [value];

    setFilterUsia3Thn(nextUsia);
    setPage(1);

    syncQueryToUrl(
      buildQueryString({
        q: cari,
        companies: selectedCompanies,
        branches: selectedBranches,
        types: selectedTypes,
        status: selectedStatus,
        usia: nextUsia,
        sort: sortField,
        dir: sortDir,
        page: 1,
        pageSize,
      }),
    );
  }

  function resetFilter() {
    setSelectedCompanies([]);
    setSelectedBranches([]);
    setSelectedTypes([]);
    setSelectedStatus([]);
    setFilterUsia3Thn([]);
    setPage(1);

    syncQueryToUrl(
      buildQueryString({
        q: cari,
        companies: [],
        branches: [],
        types: [],
        status: [],
        usia: [],
        sort: sortField,
        dir: sortDir,
        page: 1,
        pageSize,
      }),
    );
  }

  function toggleSort(field: SortField) {
    const nextDir: SortDir =
      sortField === field ? (sortDir === "asc" ? "desc" : "asc") : "asc";

    setSortField(field);
    setSortDir(nextDir);
    setPage(1);

    syncQueryToUrl(
      buildQueryString({
        q: cari,
        companies: selectedCompanies,
        branches: selectedBranches,
        types: selectedTypes,
        status: selectedStatus,
        usia: filterUsia3Thn,
        sort: field,
        dir: nextDir,
        page: 1,
        pageSize,
      }),
    );
  }

  function handlePageChange(nextPage: number) {
    setPage(nextPage);
    syncQueryToUrl(
      buildQueryString({
        q: cari,
        companies: selectedCompanies,
        branches: selectedBranches,
        types: selectedTypes,
        status: selectedStatus,
        usia: filterUsia3Thn,
        sort: sortField,
        dir: sortDir,
        page: nextPage,
        pageSize,
      }),
    );
  }

  function handlePageSizeChange(nextSize: number) {
    setPage(1);
    setPageSize(nextSize);
    syncQueryToUrl(
      buildQueryString({
        q: cari,
        companies: selectedCompanies,
        branches: selectedBranches,
        types: selectedTypes,
        status: selectedStatus,
        usia: filterUsia3Thn,
        sort: sortField,
        dir: sortDir,
        page: 1,
        pageSize: nextSize,
      }),
    );
  }

  const filtered = useMemo(() => {
    const keyword = cari.trim().toLowerCase();
    const now = new Date();

    let data = devices.filter((d) => {
      if (
        selectedCompanies.length > 0 &&
        !selectedCompanies.includes(d.companyId ?? -1)
      )
        return false;
      if (
        selectedBranches.length > 0 &&
        !selectedBranches.includes(d.branchId ?? -1)
      )
        return false;
      if (selectedTypes.length > 0 && !selectedTypes.includes(d.typeId ?? -1))
        return false;
      if (selectedStatus.length > 0 && !selectedStatus.includes(d.status))
        return false;

      if (filterUsia3Thn.includes("diatas_3_tahun")) {
        if (!d.tglBeli) return false;
        const tglBeli = new Date(d.tglBeli);
        const selisihTahun =
          (now.getTime() - tglBeli.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
        if (selisihTahun <= 3) return false;
      }

      if (!keyword) return true;
      return [
        d.nama,
        d.kodeInventaris,
        d.merk,
        d.tipe,
        d.serialNumber,
        d.type?.nama,
        d.company?.nama,
        d.branch?.nama,
        d.user?.nama,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(keyword);
    });

    data = [...data].sort((a, b) => {
      let cmp = 0;
      if (sortField === "nama") cmp = a.nama.localeCompare(b.nama);
      if (sortField === "jenis")
        cmp = (a.type?.nama ?? "").localeCompare(b.type?.nama ?? "");
      if (sortField === "status") cmp = a.status.localeCompare(b.status);
      return sortDir === "asc" ? cmp : -cmp;
    });

    return data;
  }, [
    devices,
    cari,
    selectedCompanies,
    selectedBranches,
    selectedTypes,
    selectedStatus,
    filterUsia3Thn,
    sortField,
    sortDir,
  ]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const detailQuery = useMemo(() => {
    const qs = buildQueryString({
      q: cari,
      companies: selectedCompanies,
      branches: selectedBranches,
      types: selectedTypes,
      status: selectedStatus,
      usia: filterUsia3Thn,
      sort: sortField,
      dir: sortDir,
      page: safePage,
      pageSize,
    });
    return qs ? `?${qs}` : "";
  }, [
    cari,
    selectedCompanies,
    selectedBranches,
    selectedTypes,
    selectedStatus,
    filterUsia3Thn,
    sortField,
    sortDir,
    safePage,
    pageSize,
  ]);

  const activeCount =
    selectedCompanies.length +
    selectedBranches.length +
    selectedTypes.length +
    selectedStatus.length +
    filterUsia3Thn.length;

  const inputClass =
    "rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500";

  return (
    <div>
      <div className="mb-3 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={cari}
            onChange={(e) => {
              setCari(e.target.value);
              setPage(1);
            }}
            placeholder="Cari kode inventaris, nama, merk, serial..."
            className={inputClass + " w-full pl-9"}
          />
        </div>

        <FilterDropdown
          activeCount={activeCount}
          onReset={resetFilter}
          sections={[
            {
              title: "Perusahaan",
              options: companies.map((c) => ({
                key: String(c.id),
                label: c.nama,
                checked: selectedCompanies.includes(c.id),
                onToggle: () => toggleCompany(c.id),
              })),
            },
            {
              title: "Cabang",
              options: branchList.map((b) => ({
                key: String(b.id),
                label: b.nama,
                checked: selectedBranches.includes(b.id),
                onToggle: () => toggleBranch(b.id),
              })),
            },
            {
              title: "Jenis Perangkat",
              options: deviceTypes.map((t) => ({
                key: String(t.id),
                label: t.nama,
                checked: selectedTypes.includes(t.id),
                onToggle: () => toggleType(t.id),
              })),
            },
            {
              title: "Status",
              options: STATUS_LIST.map((s) => ({
                key: s,
                label: s,
                checked: selectedStatus.includes(s),
                onToggle: () => toggleStatus(s),
              })),
            },
            {
              title: "Masa Aktif",
              options: [
                {
                  key: "diatas_3_tahun",
                  label: "Di atas 3 Tahun (> 3 Thn)",
                  checked: filterUsia3Thn.includes("diatas_3_tahun"),
                  onToggle: () => toggleUsia3Thn("diatas_3_tahun"),
                },
              ],
            },
          ]}
        />
      </div>

      <p className="mb-2 text-xs text-slate-400">
        Menampilkan {paged.length} dari {filtered.length} perangkat (total{" "}
        {devices.length}).
      </p>

      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="w-14 px-4 py-3">No</th>
                <th className="px-4 py-3">
                  <SortButton
                    label="Perangkat"
                    field="nama"
                    sortField={sortField}
                    sortDir={sortDir}
                    onClick={toggleSort}
                  />
                </th>
                <th className="px-4 py-3">
                  <SortButton
                    label="Jenis"
                    field="jenis"
                    sortField={sortField}
                    sortDir={sortDir}
                    onClick={toggleSort}
                  />
                </th>
                <th className="px-4 py-3">Usia</th>
                <th className="px-4 py-3">
                  <SortButton
                    label="Status"
                    field="status"
                    sortField={sortField}
                    sortDir={sortDir}
                    onClick={toggleSort}
                  />
                </th>
                <th className="px-4 py-3">Penempatan / Pengguna</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-10 text-center text-slate-400"
                  >
                    Tidak ada perangkat yang cocok.
                  </td>
                </tr>
              ) : (
                paged.map((device, index) => (
                  <BarisDevice
                    key={device.id}
                    device={device}
                    index={(safePage - 1) * pageSize + index}
                    deviceTypes={deviceTypes}
                    companies={companies}
                    branches={branches}
                    users={users}
                    detailQuery={detailQuery}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        <PaginationBar
          page={safePage}
          totalPages={totalPages}
          totalItems={filtered.length}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </div>
  );
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
      {label}{" "}
      <span className={active ? "text-indigo-600" : "text-slate-300"}>
        {active ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
      </span>
    </button>
  );
}
