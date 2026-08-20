"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { BarisUser } from "./baris-user";

type Company = { id: number; nama: string };
type Branch = { id: number; nama: string; companyId: number | null };
type UserRow = {
  id: number;
  nama: string;
  email: string | null;
  noTelp: string | null;
  divisi: string | null;
  companyId: number | null;
  branchId: number | null;
  company: { nama: string } | null;
  branch: { nama: string } | null;
};

type SortField = "nama" | "divisi" | "penempatan";
type SortDir = "asc" | "desc";

const PAGE_SIZE = 50;

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
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCompanies, setSelectedCompanies] = useState<number[]>([]);
  const [selectedDivisi, setSelectedDivisi] = useState<string[]>([]);
  const [sortField, setSortField] = useState<SortField>("nama");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);

  // ===== Untuk panel filter yang dirender via Portal =====
  const [mounted, setMounted] = useState(false);
  const [panelPos, setPanelPos] = useState({ top: 0, right: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  // Hitung posisi panel berdasar lokasi tombol Filter di layar.
  // Memakai position: fixed (bukan absolute) supaya TIDAK ikut terpotong
  // oleh container manapun yang punya overflow-x-auto/hidden.
  function updatePanelPosition() {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const panelWidth = 320; // harus sama dengan lebar panel (w-80 = 320px)
    const margin = 16;

    // Selalu pastikan panel tidak keluar dari sisi kanan MAUPUN kiri layar.
    let right = window.innerWidth - rect.right;
    if (right < margin) right = margin;
    if (window.innerWidth - right - panelWidth < margin) {
      right = window.innerWidth - panelWidth - margin;
    }

    setPanelPos({ top: rect.bottom + 8, right });
  }

  function openFilter() {
    updatePanelPosition();
    setFilterOpen(true);
  }

  // Tutup panel saat klik di luar, dan reposisi saat resize/scroll
  useEffect(() => {
    if (!filterOpen) return;

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        panelRef.current &&
        !panelRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setFilterOpen(false);
      }
    }
    function handleReposition() {
      updatePanelPosition();
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [filterOpen]);

  const divisiList = useMemo(
    () =>
      Array.from(
        new Set(users.map((u) => u.divisi).filter((v): v is string => Boolean(v)))
      ).sort((a, b) => a.localeCompare(b, "id")),
    [users]
  );

  function toggleCompany(id: number) {
    setSelectedCompanies((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }
  function toggleDivisi(name: string) {
    setSelectedDivisi((prev) =>
      prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name]
    );
  }
  function resetFilter() {
    setSelectedCompanies([]);
    setSelectedDivisi([]);
  }

  const jumlahFilterAktif = selectedCompanies.length + selectedDivisi.length;

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  }

  // ===== Saring + urutkan =====
  const hasil = useMemo(() => {
    const keyword = cari.trim().toLowerCase();
    let data = users.filter((u) => {
      if (
        selectedCompanies.length > 0 &&
        !selectedCompanies.includes(u.companyId ?? -1)
      ) {
        return false;
      }
      if (selectedDivisi.length > 0 && !selectedDivisi.includes(u.divisi ?? "")) {
        return false;
      }
      if (!keyword) return true;
      return [u.nama, u.email, u.noTelp, u.divisi, u.company?.nama, u.branch?.nama]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(keyword);
    });

    data = [...data].sort((a, b) => {
      let cmp = 0;
      if (sortField === "nama") cmp = a.nama.localeCompare(b.nama, "id");
      if (sortField === "divisi")
        cmp = (a.divisi ?? "").localeCompare(b.divisi ?? "", "id");
      if (sortField === "penempatan") {
        cmp = (a.company?.nama ?? "").localeCompare(b.company?.nama ?? "", "id");
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return data;
  }, [users, cari, selectedCompanies, selectedDivisi, sortField, sortDir]);

  // Reset ke halaman 1 setiap kali pencarian/filter/sort berubah
  useEffect(() => {
    setPage(1);
  }, [cari, selectedCompanies, selectedDivisi, sortField, sortDir]);

  // ===== Paginasi (50 per halaman) =====
  const totalHalaman = Math.max(1, Math.ceil(hasil.length / PAGE_SIZE));
  const halamanAman = Math.min(page, totalHalaman);
  const startIdx = (halamanAman - 1) * PAGE_SIZE;
  const dataHalaman = hasil.slice(startIdx, startIdx + PAGE_SIZE);

  const inputClass =
    "rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500";

  return (
    <div>
      {/* Baris pencarian & tombol filter */}
      <div className="mb-3 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={cari}
            onChange={(e) => setCari(e.target.value)}
            placeholder="Cari nama, email, telepon, divisi, cabang..."
            className={inputClass + " w-full pl-9"}
          />
        </div>

        <div className="relative shrink-0">
          <button
            ref={buttonRef}
            type="button"
            onClick={() => (filterOpen ? setFilterOpen(false) : openFilter())}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filter
            {jumlahFilterAktif > 0 && (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1 text-xs font-semibold text-white">
                {jumlahFilterAktif}
              </span>
            )}
            {filterOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>

          {/* ===== Panel filter dirender via PORTAL langsung ke <body> =====
              Ini kunci perbaikannya: panel tidak lagi berada di dalam DOM
              halaman yang overflow-x-auto, sehingga TIDAK mungkin terpotong,
              berapa pun lebar layarnya. Posisinya dihitung manual mengikuti
              lokasi tombol (position: fixed, koordinat dari getBoundingClientRect). */}
          {mounted &&
            filterOpen &&
            createPortal(
              <div
                ref={panelRef}
                style={{
                  position: "fixed",
                  top: panelPos.top,
                  right: panelPos.right,
                  width: 320,
                }}
                className="z-[100] max-w-[calc(100vw-2rem)] rounded-xl border border-slate-200 bg-white p-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-700">Filter Data</p>
                  <button
                    type="button"
                    onClick={() => setFilterOpen(false)}
                    aria-label="Tutup filter"
                    className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="max-h-72 space-y-5 overflow-y-auto pr-1">
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Perusahaan
                    </p>
                    <div className="space-y-2">
                      {companies.map((c) => (
                        <label
                          key={c.id}
                          className="flex items-center gap-2 text-sm text-slate-600"
                          title={c.nama}
                        >
                          <input
                            type="checkbox"
                            checked={selectedCompanies.includes(c.id)}
                            onChange={() => toggleCompany(c.id)}
                            className="h-4 w-4 shrink-0 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="truncate">{c.nama}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Divisi
                    </p>
                    <div className="space-y-2">
                      {divisiList.length === 0 && (
                        <p className="text-xs text-slate-400">Belum ada data divisi.</p>
                      )}
                      {divisiList.map((d) => (
                        <label
                          key={d}
                          className="flex items-center gap-2 text-sm text-slate-600"
                        >
                          <input
                            type="checkbox"
                            checked={selectedDivisi.includes(d)}
                            onChange={() => toggleDivisi(d)}
                            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="truncate">{d}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {jumlahFilterAktif > 0 && (
                  <button
                    type="button"
                    onClick={resetFilter}
                    className="mt-4 w-full rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-200"
                  >
                    Reset Filter
                  </button>
                )}
              </div>,
              document.body
            )}
        </div>
      </div>

      <p className="mb-2 text-xs text-slate-400">
        Menampilkan {dataHalaman.length} dari {hasil.length} user
        {hasil.length !== users.length ? ` (total ${users.length})` : ""}.
      </p>

      {/* Tabel dengan scroll vertikal + header sticky */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <div className="max-h-[600px] overflow-y-auto">
            <table className="w-full min-w-[820px] text-sm">
              <thead className="sticky top-0 z-10 bg-slate-50 text-left text-slate-600">
                <tr>
                  <th className="w-14 px-4 py-3 bg-slate-50">No</th>
                  <th className="px-4 py-3 bg-slate-50">
                    <button
                      type="button"
                      onClick={() => toggleSort("nama")}
                      className="inline-flex items-center gap-1 hover:text-slate-800"
                    >
                      Nama / Kontak <SortIcon active={sortField === "nama"} dir={sortDir} />
                    </button>
                  </th>
                  <th className="px-4 py-3 bg-slate-50">
                    <button
                      type="button"
                      onClick={() => toggleSort("divisi")}
                      className="inline-flex items-center gap-1 hover:text-slate-800"
                    >
                      Divisi <SortIcon active={sortField === "divisi"} dir={sortDir} />
                    </button>
                  </th>
                  <th className="px-4 py-3 bg-slate-50">
                    <button
                      type="button"
                      onClick={() => toggleSort("penempatan")}
                      className="inline-flex items-center gap-1 hover:text-slate-800"
                    >
                      Penempatan <SortIcon active={sortField === "penempatan"} dir={sortDir} />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-right bg-slate-50">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {dataHalaman.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-slate-400">
                      Tidak ada user yang cocok.
                    </td>
                  </tr>
                ) : (
                  dataHalaman.map((user, i) => (
                    <BarisUser
                      key={user.id}
                      user={user}
                      nomor={startIdx + i + 1}
                      companies={companies}
                      branches={branches}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Paginasi */}
      {totalHalaman > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-slate-400">
            Halaman {halamanAman} dari {totalHalaman}
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={halamanAman === 1}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" /> Sebelumnya
            </button>

            <div className="hidden items-center gap-1 sm:flex">
              {Array.from({ length: totalHalaman }, (_, i) => i + 1)
                .filter(
                  (n) => n === 1 || n === totalHalaman || Math.abs(n - halamanAman) <= 1
                )
                .reduce<number[]>((acc, n) => {
                  if (acc.length > 0 && n - acc[acc.length - 1] > 1) acc.push(-1);
                  acc.push(n);
                  return acc;
                }, [])
                .map((n, idx) =>
                  n === -1 ? (
                    <span key={`gap-${idx}`} className="px-2 text-slate-300">
                      …
                    </span>
                  ) : (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      className={
                        "h-8 w-8 rounded-lg text-sm font-medium transition-colors " +
                        (n === halamanAman
                          ? "bg-indigo-600 text-white"
                          : "text-slate-600 hover:bg-slate-100")
                      }
                    >
                      {n}
                    </button>
                  )
                )}
            </div>

            <button
              onClick={() => setPage((p) => Math.min(totalHalaman, p + 1))}
              disabled={halamanAman === totalHalaman}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Berikutnya <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <span className="text-slate-300">↕</span>;
  return <span className="text-indigo-600">{dir === "asc" ? "↑" : "↓"}</span>;
}
