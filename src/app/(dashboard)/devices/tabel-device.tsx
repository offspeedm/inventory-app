"use client";

import { useMemo, useState } from "react";
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
  nama: string;
  kodeInventaris: string | null;
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

const STATUS_LIST = ["Aktif", "Rusak", "Perbaikan", "Tidak dipakai"];
type SortField = "nama" | "jenis" | "status";
type SortDir = "asc" | "desc";

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
  const [cari, setCari] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<number[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [sortField, setSortField] = useState<SortField>("nama");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  function toggleType(id: number) {
    setSelectedTypes((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    setPage(1);
  }
  function toggleStatus(value: string) {
    setSelectedStatus((prev) => (prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]));
    setPage(1);
  }
  function resetFilter() {
    setSelectedTypes([]);
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

    let data = devices.filter((d) => {
      if (selectedTypes.length > 0 && !selectedTypes.includes(d.typeId ?? -1)) return false;
      if (selectedStatus.length > 0 && !selectedStatus.includes(d.status)) return false;
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
      if (sortField === "jenis") cmp = (a.type?.nama ?? "").localeCompare(b.type?.nama ?? "");
      if (sortField === "status") cmp = a.status.localeCompare(b.status);
      return sortDir === "asc" ? cmp : -cmp;
    });

    return data;
  }, [devices, cari, selectedTypes, selectedStatus, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const activeCount = selectedTypes.length + selectedStatus.length;
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
            placeholder="Cari kode, nama, merk, tipe, serial, pengguna..."
            className={inputClass + " w-full pl-9"}
          />
        </div>

        <FilterDropdown
          activeCount={activeCount}
          onReset={resetFilter}
          sections={[
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
          ]}
        />
      </div>

      <p className="mb-2 text-xs text-slate-400">
        Menampilkan {paged.length} dari {filtered.length} perangkat (total {devices.length}).
      </p>

      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="w-14 px-4 py-3">No</th>
                <th className="px-4 py-3">
                  <SortButton label="Perangkat" field="nama" sortField={sortField} sortDir={sortDir} onClick={toggleSort} />
                </th>
                <th className="px-4 py-3">
                  <SortButton label="Jenis" field="jenis" sortField={sortField} sortDir={sortDir} onClick={toggleSort} />
                </th>
                <th className="px-4 py-3">Usia</th>
                <th className="px-4 py-3">
                  <SortButton label="Status" field="status" sortField={sortField} sortDir={sortDir} onClick={toggleSort} />
                </th>
                <th className="px-4 py-3">Penempatan / Pengguna</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-slate-400">
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
