"use client";

import { useMemo, useState } from "react";
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

export function TabelUser({
  users,
  companies,
  branches,
}: {
  users: UserRow[];
  companies: Company[];
  branches: Branch[];
}) {
  const [cari, setCari] = useState("");
  const [selectedCompanies, setSelectedCompanies] = useState<number[]>([]);
  const [selectedDivisi, setSelectedDivisi] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [sortField, setSortField] = useState<SortField>("nama");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const divisiList = useMemo(
    () =>
      Array.from(
        new Set(users.map((u) => u.divisi).filter((v): v is string => Boolean(v)))
      ).sort(),
    [users]
  );

  function toggleCompany(id: number) {
    setSelectedCompanies((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    setPage(1);
  }
  function toggleDivisi(name: string) {
    setSelectedDivisi((prev) => (prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name]));
    setPage(1);
  }
  function toggleStatus(value: string) {
    setSelectedStatus((prev) => (prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]));
    setPage(1);
  }
  function resetFilter() {
    setSelectedCompanies([]);
    setSelectedDivisi([]);
    setSelectedStatus([]);
    setPage(1);
  }
  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
    setPage(1);
  }

  const filtered = useMemo(() => {
    const keyword = cari.trim().toLowerCase();

    let data = users.filter((u) => {
      const status = u.status === "Non-Aktif" ? "Non-Aktif" : "Aktif";
      if (selectedCompanies.length > 0 && !selectedCompanies.includes(u.companyId ?? -1)) return false;
      if (selectedDivisi.length > 0 && !selectedDivisi.includes(u.divisi ?? "")) return false;
      if (selectedStatus.length > 0 && !selectedStatus.includes(status)) return false;
      if (!keyword) return true;
      return [u.nama, u.email, u.noTelp, u.divisi, status, u.company?.nama, u.branch?.nama]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(keyword);
    });

    // Sort alfabet (localeCompare mendukung nama Indonesia dengan benar)
    data = [...data].sort((a, b) => {
      let cmp = 0;
      if (sortField === "nama") cmp = a.nama.localeCompare(b.nama);
      if (sortField === "divisi") cmp = (a.divisi ?? "").localeCompare(b.divisi ?? "");
      if (sortField === "penempatan") cmp = (a.company?.nama ?? "").localeCompare(b.company?.nama ?? "");
      return sortDir === "asc" ? cmp : -cmp;
    });

    return data;
  }, [users, cari, selectedCompanies, selectedDivisi, selectedStatus, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const activeCount = selectedCompanies.length + selectedDivisi.length + selectedStatus.length;
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
        Menampilkan {paged.length} dari {filtered.length} user (total {users.length}).
      </p>

      {/*
        PENTING: wrapper luar (border/rounded) TIDAK memakai overflow-x-auto.
        Hanya wrapper DALAM (khusus tabel) yang boleh di-scroll horizontal,
        supaya PaginationBar di bawahnya tetap selebar container luar dan
        tombol "Berikutnya" tidak pernah ikut terpotong/ter-scroll.
      */}
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="w-14 px-4 py-3">No</th>
                <th className="px-4 py-3">
                  <SortButton label="Nama / Kontak" field="nama" sortField={sortField} sortDir={sortDir} onClick={toggleSort} />
                </th>
                <th className="px-4 py-3">
                  <SortButton label="Divisi" field="divisi" sortField={sortField} sortDir={sortDir} onClick={toggleSort} />
                </th>
                <th className="px-4 py-3">
                  <SortButton label="Penempatan" field="penempatan" sortField={sortField} sortDir={sortDir} onClick={toggleSort} />
                </th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
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
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
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
