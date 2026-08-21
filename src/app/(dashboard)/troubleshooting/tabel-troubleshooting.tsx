"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { BarisTiket } from "./baris-troubleshooting";
import { FilterDropdown } from "@/components/filter-dropdown";
import { PaginationBar } from "@/components/pagination-bar";
import { KATEGORI_MASALAH, URGENCY_OPTIONS, STATUS_OPTIONS } from "@/config/ticket-fields";

type Company = { id: number; nama: string };
type Branch = { id: number; nama: string; companyId: number | null };
type UserOpt = {
  id: number;
  nama: string;
  divisi: string | null;
  companyId: number | null;
  branchId: number | null;
};
type DeviceOpt = { id: number; nama: string; userId: number | null };
type TicketRow = {
  id: number;
  noTiket: string | null;
  judul: string;
  kategori: string | null;
  kendala: string | null;
  diagnosa: string | null;
  solusi: string | null;
  catatanTeknisi: string | null;
  divisi: string | null;
  prioritas: string;
  status: string;
  tglLapor: Date;
  deviceId: number | null;
  userId: number | null;
  userTerkendalaId: number | null;
  teknisiId: number | null;
  companyId: number | null;
  branchId: number | null;
  device: { nama: string } | null;
  user: { nama: string } | null;
  userTerkendala: { nama: string } | null;
  teknisi: { nama: string } | null;
  company: { nama: string } | null;
  branch: { nama: string } | null;
  attachmentsCount: number;
};

type SortField = "judul" | "urgency" | "status";
type SortDir = "asc" | "desc";

export function TabelTiket({
  tickets,
  companies,
  branches,
  devices,
  users,
}: {
  tickets: TicketRow[];
  companies: Company[];
  branches: Branch[];
  devices: DeviceOpt[];
  users: UserOpt[];
}) {
  const [cari, setCari] = useState("");
  const [selectedKategori, setSelectedKategori] = useState<string[]>([]);
  const [selectedUrgency, setSelectedUrgency] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [sortField, setSortField] = useState<SortField>("judul");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  function toggle(setter: React.Dispatch<React.SetStateAction<string[]>>, value: string) {
    setter((prev) => (prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]));
    setPage(1);
  }
  function resetFilter() {
    setSelectedKategori([]);
    setSelectedUrgency([]);
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

    let data = tickets.filter((t) => {
      if (selectedKategori.length > 0 && !selectedKategori.includes(t.kategori ?? "")) return false;
      if (selectedUrgency.length > 0 && !selectedUrgency.includes(t.prioritas)) return false;
      if (selectedStatus.length > 0 && !selectedStatus.includes(t.status)) return false;
      if (!keyword) return true;
      return [
        t.noTiket,
        t.judul,
        t.kendala,
        t.kategori,
        t.device?.nama,
        t.user?.nama,
        t.userTerkendala?.nama,
        t.teknisi?.nama,
        t.divisi,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(keyword);
    });

    data = [...data].sort((a, b) => {
      let cmp = 0;
      if (sortField === "judul") cmp = a.judul.localeCompare(b.judul);
      if (sortField === "urgency") cmp = a.prioritas.localeCompare(b.prioritas);
      if (sortField === "status") cmp = a.status.localeCompare(b.status);
      return sortDir === "asc" ? cmp : -cmp;
    });

    return data;
  }, [tickets, cari, selectedKategori, selectedUrgency, selectedStatus, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const activeCount = selectedKategori.length + selectedUrgency.length + selectedStatus.length;
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
            placeholder="Cari no tiket, judul, kendala, pelapor, teknisi..."
            className={inputClass + " w-full pl-9"}
          />
        </div>

        <FilterDropdown
          activeCount={activeCount}
          onReset={resetFilter}
          sections={[
            {
              title: "Kategori",
              options: KATEGORI_MASALAH.map((k) => ({
                key: k,
                label: k,
                checked: selectedKategori.includes(k),
                onToggle: () => toggle(setSelectedKategori, k),
              })),
            },
            {
              title: "Urgency",
              options: URGENCY_OPTIONS.map((u) => ({
                key: u,
                label: u,
                checked: selectedUrgency.includes(u),
                onToggle: () => toggle(setSelectedUrgency, u),
              })),
            },
            {
              title: "Status",
              options: STATUS_OPTIONS.map((s) => ({
                key: s,
                label: s,
                checked: selectedStatus.includes(s),
                onToggle: () => toggle(setSelectedStatus, s),
              })),
            },
          ]}
        />
      </div>

      <p className="mb-2 text-xs text-slate-400">
        Menampilkan {paged.length} dari {filtered.length} tiket (total {tickets.length}).
      </p>

      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="w-14 px-4 py-3">No</th>
                <th className="px-4 py-3">
                  <SortButton label="Tiket" field="judul" sortField={sortField} sortDir={sortDir} onClick={toggleSort} />
                </th>
                <th className="px-4 py-3">
                  <SortButton label="Urgency" field="urgency" sortField={sortField} sortDir={sortDir} onClick={toggleSort} />
                </th>
                <th className="px-4 py-3">
                  <SortButton label="Status" field="status" sortField={sortField} sortDir={sortDir} onClick={toggleSort} />
                </th>
                <th className="px-4 py-3">Pelapor / Terkendala</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                    Tidak ada tiket yang cocok.
                  </td>
                </tr>
              ) : (
                paged.map((ticket, index) => (
                  <BarisTiket
                    key={ticket.id}
                    ticket={ticket}
                    index={(safePage - 1) * pageSize + index}
                    companies={companies}
                    branches={branches}
                    devices={devices}
                    users={users}
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
