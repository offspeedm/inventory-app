"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { BarisUser } from "./baris-user";
import { FilterDropdown } from "@/components/filter-dropdown";
import { PaginationBar } from "@/components/pagination-bar";

type Company = { id: number; nama: string };
type Branch = { id: number; nama: string; companyId: number | null };
type UserRow = {
  id: number;
  nama: string;
  email: string | null;
  noTelp: string | null;
  divisi: string | null;
  status: string;
  companyId: number | null;
  branchId: number | null;
  company: { nama: string } | null;
  branch: { nama: string } | null;
};

type SortField = "nama" | "divisi" | "penempatan";
type SortDir = "asc" | "desc";

const VALID_PAGE_SIZES = [10, 25, 50, 100];
const VALID_SORT_FIELDS: SortField[] = ["nama", "divisi", "penempatan"];

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
  divisi: string[];
  status: string[];
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
  state.divisi.forEach((d) => params.append("divisi", d));
  state.status.forEach((s) => params.append("status", s));

  if (state.sort !== "nama") params.set("sort", state.sort);
  if (state.dir !== "asc") params.set("dir", state.dir);
  if (state.page > 1) params.set("page", String(state.page));
  if (state.pageSize !== 10) params.set("pageSize", String(state.pageSize));

  return params.toString();
}

export function TabelUser({
  users,
  companies,
  branches,
}: {
  users: UserRow[];
  companies: Company[];
  branches: Branch[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [cari, setCari] = useState(() => searchParams.get("q") ?? "");
  const [selectedCompanies, setSelectedCompanies] = useState<number[]>(() =>
    parseIdList(searchParams.getAll("company")),
  );
  const [selectedBranches, setSelectedBranches] = useState<number[]>(() =>
    parseIdList(searchParams.getAll("branch")),
  );
  const [selectedDivisi, setSelectedDivisi] = useState<string[]>(() =>
    searchParams.getAll("divisi").filter(Boolean),
  );
  const [selectedStatus, setSelectedStatus] = useState<string[]>(() =>
    searchParams
      .getAll("status")
      .filter((s) => s === "Aktif" || s === "Non-Aktif"),
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

  const pushQueryToUrl = useCallback(
    (qs: string) => {
      if (qs === lastPushedQueryRef.current) return;
      lastPushedQueryRef.current = qs;
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router],
  );

  // Sinkronkan state bila navigasi datang dari luar (mis. tombol Back/Forward browser)
  useEffect(() => {
    const currentUrlQs = searchParams.toString();
    if (currentUrlQs === lastPushedQueryRef.current) return;

    lastPushedQueryRef.current = currentUrlQs;
    setCari(searchParams.get("q") ?? "");
    setSelectedCompanies(parseIdList(searchParams.getAll("company")));
    setSelectedBranches(parseIdList(searchParams.getAll("branch")));
    setSelectedDivisi(searchParams.getAll("divisi").filter(Boolean));
    setSelectedStatus(
      searchParams
        .getAll("status")
        .filter((s) => s === "Aktif" || s === "Non-Aktif"),
    );
    setSortField(parseSortField(searchParams.get("sort")));
    setSortDir(parseSortDir(searchParams.get("dir")));
    setPage(parsePage(searchParams.get("page")));
    setPageSize(parsePageSize(searchParams.get("pageSize")));
  }, [searchParams]);

  // Debounce update URL khusus input pencarian agar ketikan tetap responsif
  useEffect(() => {
    const timer = setTimeout(() => {
      const qs = buildQueryString({
        q: cari,
        companies: selectedCompanies,
        branches: selectedBranches,
        divisi: selectedDivisi,
        status: selectedStatus,
        sort: sortField,
        dir: sortDir,
        page,
        pageSize,
      });
      pushQueryToUrl(qs);
    }, 250);

    return () => clearTimeout(timer);
  }, [
    cari,
    selectedCompanies,
    selectedBranches,
    selectedDivisi,
    selectedStatus,
    sortField,
    sortDir,
    page,
    pageSize,
    pushQueryToUrl,
  ]);

  const divisiList = useMemo(
    () =>
      Array.from(
        new Set(
          users.map((u) => u.divisi).filter((v): v is string => Boolean(v)),
        ),
      ).sort(),
    [users],
  );

  // Menyesuaikan daftar cabang sesuai perusahaan yang dipilih (jika ada)
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

    pushQueryToUrl(
      buildQueryString({
        q: cari,
        companies: nextCompanies,
        branches: nextBranches,
        divisi: selectedDivisi,
        status: selectedStatus,
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

    pushQueryToUrl(
      buildQueryString({
        q: cari,
        companies: selectedCompanies,
        branches: nextBranches,
        divisi: selectedDivisi,
        status: selectedStatus,
        sort: sortField,
        dir: sortDir,
        page: 1,
        pageSize,
      }),
    );
  }

  function toggleDivisi(name: string) {
    const nextDivisi = selectedDivisi.includes(name)
      ? selectedDivisi.filter((x) => x !== name)
      : [...selectedDivisi, name];

    setSelectedDivisi(nextDivisi);
    setPage(1);

    pushQueryToUrl(
      buildQueryString({
        q: cari,
        companies: selectedCompanies,
        branches: selectedBranches,
        divisi: nextDivisi,
        status: selectedStatus,
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

    pushQueryToUrl(
      buildQueryString({
        q: cari,
        companies: selectedCompanies,
        branches: selectedBranches,
        divisi: selectedDivisi,
        status: nextStatus,
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
    setSelectedDivisi([]);
    setSelectedStatus([]);
    setPage(1);

    pushQueryToUrl(
      buildQueryString({
        q: cari,
        companies: [],
        branches: [],
        divisi: [],
        status: [],
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

    pushQueryToUrl(
      buildQueryString({
        q: cari,
        companies: selectedCompanies,
        branches: selectedBranches,
        divisi: selectedDivisi,
        status: selectedStatus,
        sort: field,
        dir: nextDir,
        page: 1,
        pageSize,
      }),
    );
  }

  function handlePageChange(nextPage: number) {
    setPage(nextPage);
    pushQueryToUrl(
      buildQueryString({
        q: cari,
        companies: selectedCompanies,
        branches: selectedBranches,
        divisi: selectedDivisi,
        status: selectedStatus,
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
    pushQueryToUrl(
      buildQueryString({
        q: cari,
        companies: selectedCompanies,
        branches: selectedBranches,
        divisi: selectedDivisi,
        status: selectedStatus,
        sort: sortField,
        dir: sortDir,
        page: 1,
        pageSize: nextSize,
      }),
    );
  }

  const filtered = useMemo(() => {
    const keyword = cari.trim().toLowerCase();

    let data = users.filter((u) => {
      const status = u.status === "Non-Aktif" ? "Non-Aktif" : "Aktif";
      if (
        selectedCompanies.length > 0 &&
        !selectedCompanies.includes(u.companyId ?? -1)
      )
        return false;
      if (
        selectedBranches.length > 0 &&
        !selectedBranches.includes(u.branchId ?? -1)
      )
        return false;
      if (selectedDivisi.length > 0 && !selectedDivisi.includes(u.divisi ?? ""))
        return false;
      if (selectedStatus.length > 0 && !selectedStatus.includes(status))
        return false;
      if (!keyword) return true;
      return [
        u.nama,
        u.email,
        u.noTelp,
        u.divisi,
        status,
        u.company?.nama,
        u.branch?.nama,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(keyword);
    });

    data = [...data].sort((a, b) => {
      let cmp = 0;
      if (sortField === "nama") cmp = a.nama.localeCompare(b.nama);
      if (sortField === "divisi")
        cmp = (a.divisi ?? "").localeCompare(b.divisi ?? "");
      if (sortField === "penempatan")
        cmp = (a.company?.nama ?? "").localeCompare(b.company?.nama ?? "");
      return sortDir === "asc" ? cmp : -cmp;
    });

    return data;
  }, [
    users,
    cari,
    selectedCompanies,
    selectedBranches,
    selectedDivisi,
    selectedStatus,
    sortField,
    sortDir,
  ]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  // Selalu bangun detailQuery dari state terkini agar klik cepat setelah mengetik tetap membawa keyword
  const detailQuery = useMemo(() => {
    const qs = buildQueryString({
      q: cari,
      companies: selectedCompanies,
      branches: selectedBranches,
      divisi: selectedDivisi,
      status: selectedStatus,
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
    selectedDivisi,
    selectedStatus,
    sortField,
    sortDir,
    safePage,
    pageSize,
  ]);

  const activeCount =
    selectedCompanies.length +
    selectedBranches.length +
    selectedDivisi.length +
    selectedStatus.length;

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
            placeholder="Cari nama, kontak, divisi, status..."
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
              title: "Divisi",
              options: divisiList.map((d) => ({
                key: d,
                label: d,
                checked: selectedDivisi.includes(d),
                onToggle: () => toggleDivisi(d),
              })),
            },
            {
              title: "Status",
              options: ["Aktif", "Non-Aktif"].map((s) => ({
                key: s,
                label: s,
                checked: selectedStatus.includes(s),
                onToggle: () => toggleStatus(s),
              })),
            },
          ]}
        />
      </div>

      <p className="mb-2 text-xs text-slate-400">
        Menampilkan {paged.length} dari {filtered.length} user (total{" "}
        {users.length}).
      </p>

      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="w-14 px-4 py-3">No</th>
                <th className="px-4 py-3">
                  <SortButton
                    label="Nama / Kontak"
                    field="nama"
                    sortField={sortField}
                    sortDir={sortDir}
                    onClick={toggleSort}
                  />
                </th>
                <th className="px-4 py-3">
                  <SortButton
                    label="Divisi"
                    field="divisi"
                    sortField={sortField}
                    sortDir={sortDir}
                    onClick={toggleSort}
                  />
                </th>
                <th className="px-4 py-3">
                  <SortButton
                    label="Penempatan"
                    field="penempatan"
                    sortField={sortField}
                    sortDir={sortDir}
                    onClick={toggleSort}
                  />
                </th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-slate-400"
                  >
                    Tidak ada user yang cocok.
                  </td>
                </tr>
              ) : (
                paged.map((user, index) => (
                  <BarisUser
                    key={user.id}
                    user={user}
                    index={(safePage - 1) * pageSize + index}
                    companies={companies}
                    branches={branches}
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
