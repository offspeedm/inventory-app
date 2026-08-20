"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { BarisTiket } from "./baris-troubleshooting";
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
  const [filterStatus, setFilterStatus] = useState("");
  const [filterUrgency, setFilterUrgency] = useState("");
  const [filterKategori, setFilterKategori] = useState("");
  const searchParams = useSearchParams();
  const editParam = searchParams.get("edit");
  const autoEditId = editParam ? Number(editParam) : null;

  const hasil = useMemo(() => {
    const kata = cari.trim().toLowerCase();
    return tickets.filter((t) => {
      if (filterStatus && t.status !== filterStatus) return false;
      if (filterUrgency && t.prioritas !== filterUrgency) return false;
      if (filterKategori && t.kategori !== filterKategori) return false;
      if (!kata) return true;
      const gabungan = [
        t.noTiket ?? "",
        t.judul,
        t.kendala ?? "",
        t.kategori ?? "",
        t.device?.nama ?? "",
        t.user?.nama ?? "",
        t.userTerkendala?.nama ?? "",
        t.teknisi?.nama ?? "",
        t.divisi ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return gabungan.includes(kata);
    });
  }, [tickets, cari, filterStatus, filterUrgency, filterKategori]);

  const inputClass =
    "border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={cari}
            onChange={(e) => setCari(e.target.value)}
            placeholder="Cari no tiket, judul, kendala, pelapor, teknisi…"
            className={inputClass + " w-full pl-9"}
          />
        </div>
        <select value={filterKategori} onChange={(e) => setFilterKategori(e.target.value)} className={inputClass + " sm:w-48"}>
          <option value="">Semua kategori</option>
          {KATEGORI_MASALAH.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>
        <select value={filterUrgency} onChange={(e) => setFilterUrgency(e.target.value)} className={inputClass + " sm:w-52"}>
          <option value="">Semua urgency</option>
          {URGENCY_OPTIONS.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className={inputClass + " sm:w-40"}>
          <option value="">Semua status</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <p className="text-xs text-slate-400 mb-2">
        Menampilkan {hasil.length} dari {tickets.length} tiket.
      </p>

      <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm min-w-[820px]">
          <thead className="bg-slate-50 text-slate-600 text-left">
            <tr>
              <th className="px-4 py-3 w-14">No</th>
              <th className="px-4 py-3">Tiket</th>
              <th className="px-4 py-3">Urgency</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Pelapor / Terkendala</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {hasil.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                  Tidak ada tiket yang cocok.
                </td>
              </tr>
            )}
            {hasil.map((ticket, i) => (
              <BarisTiket
                key={ticket.id}
                ticket={ticket}
                index={i}
                companies={companies}
                branches={branches}
                devices={devices}
                users={users}
                autoEditId={autoEditId}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
