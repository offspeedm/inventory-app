"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { BarisCabang } from "./baris-cabang";
import { FilterDropdown } from "@/components/filter-dropdown";
import { PaginationBar } from "@/components/pagination-bar";

type Company = { id: number; nama: string };
type BranchRow = {
  id: number;
  nama: string;
  kota: string | null;
  companyId: number | null;
  company: { nama: string } | null;
};

type SortField = "nama" | "kota" | "perusahaan";
type SortDir = "asc" | "desc";

export function TabelCabang({
  branches,
  companies,
}: {
  branches: BranchRow[];
  companies: Company[];
}) {
  const [cari, setCari] = useState("");
  const [selectedCompanies, setSelectedCompanies] = useState<number[]>([]);
  const [selectedKota, setSelectedKota] = useState<string[]>([]);
  const [sortField, setSortField] = useState<SortField>("nama");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const kotaList = useMemo(
    () =>
      Array.from(
        new Set(branches.map((b) => b.kota).filter((v): v is string => Boolean(v)))
      ).sort(),
    [branches]
  );

  function toggleCompany(id: number) {
    setSelectedCompanies((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    setPage(1);
  }
  function toggleKota(name: string) {
    setSelectedKota((prev) => (prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name]));
    setPage(1);
  }
  function resetFilter() {
    setSelectedCompanies([]);
    setSelectedKota([]);
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

    let data = branches.filter((b) => {
      if (selectedCompanies.length > 0 && !selectedCompanies.includes(b.companyId ?? -1)) return false;
      if (selectedKota.length > 0 && !selectedKota.includes(b.kota ?? "")) return false;
      if (!keyword) return true;
      return [b.nama, b.kota, b.company?.nama]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(keyword);
    });

    data = [...data].sort((a, c) => {
      let cmp = 0;
      if (sortField === "nama") cmp = a.nama.localeCompare(c.nama);
      if (sortField === "kota") cmp = (a.kota ?? "").localeCompare(c.kota ?? "");
      if (sortField === "perusahaan") cmp = (a.company?.nama ?? "").localeCompare(c.company?.nama ?? "");
      return sortDir === "asc" ? cmp : -cmp;
    });

    return data;
  }, [branches, cari, selectedCompanies, selectedKota, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const activeCount = selectedCompanies.length + selectedKota.length;
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
            placeholder="Cari nama cabang, kota, perusahaan..."
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
              title: "Kota",
              options: kotaList.map((k) => ({
                key: k,
                label: k,
                checked: selectedKota.includes(k),
                onToggle: () => toggleKota(k),
              })),
            },
          ]}
        />
      </div>

      <p className="mb-2 text-xs text-slate-400">
        Menampilkan {paged.length} dari {filtered.length} cabang (total {branches.length}).
      </p>

      {/*
        Wrapper luar TIDAK overflow-x-auto — hanya wrapper dalam (tabel) yang
        di-scroll horizontal, supaya PaginationBar di bawah tetap penuh lebar
        container dan tidak ikut ter-scroll/terpotong.
      */}
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="w-14 px-4 py-3">No</th>
                <th className="px-4 py-3">
                  <SortButton label="Nama Cabang" field="nama" sortField={sortField} sortDir={sortDir} onClick={toggleSort} />
                </th>
                <th className="px-4 py-3">
                  <SortButton label="Kota" field="kota" sortField={sortField} sortDir={sortDir} onClick={toggleSort} />
                </th>
                <th className="px-4 py-3">
                  <SortButton label="Perusahaan" field="perusahaan" sortField={sortField} sortDir={sortDir} onClick={toggleSort} />
                </th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-slate-400">
                    Tidak ada cabang yang cocok.
                  </td>
                </tr>
              ) : (
                paged.map((branch, index) => (
                  <BarisCabang
                    key={branch.id}
                    branch={branch}
                    index={(safePage - 1) * pageSize + index}
                    companies={companies}
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
