"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { BarisCabang } from "./baris-cabang";

type Company = { id: number; nama: string };
type BranchRow = {
  id: number;
  nama: string;
  kota: string | null;
  companyId: number | null;
  company: { nama: string } | null;
  user: number;
  device: number;
};

export function TabelCabang({
  branches,
  companies,
}: {
  branches: BranchRow[];
  companies: Company[];
}) {
  const [cari, setCari] = useState("");
  const [filterCompany, setFilterCompany] = useState("");
  const searchParams = useSearchParams();
  const editParam = searchParams.get("edit");
  const autoEditId = editParam ? Number(editParam) : null;

  const hasil = useMemo(() => {
    const kata = cari.trim().toLowerCase();
    return branches.filter((b) => {
      if (filterCompany && String(b.companyId) !== filterCompany) return false;
      if (!kata) return true;
      const gabungan = [b.nama, b.kota ?? "", b.company?.nama ?? ""].join(" ").toLowerCase();
      return gabungan.includes(kata);
    });
  }, [branches, cari, filterCompany]);

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
            placeholder="Cari nama cabang, kota, atau perusahaan…"
            className={inputClass + " w-full pl-9"}
          />
        </div>
        <select
          value={filterCompany}
          onChange={(e) => setFilterCompany(e.target.value)}
          className={inputClass + " sm:w-56"}
        >
          <option value="">Semua perusahaan</option>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nama}
            </option>
          ))}
        </select>
      </div>

      <p className="text-xs text-slate-400 mb-2">
        Menampilkan {hasil.length} dari {branches.length} cabang.
      </p>

      <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm min-w-[680px]">
          <thead className="bg-slate-50 text-slate-600 text-left">
            <tr>
              <th className="px-4 py-3 w-14">No</th>
              <th className="px-4 py-3">Cabang</th>
              <th className="px-4 py-3">Perusahaan</th>
              <th className="px-4 py-3 text-center">User</th>
              <th className="px-4 py-3 text-center">Device</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {hasil.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                  Tidak ada cabang yang cocok.
                </td>
              </tr>
            )}
            {hasil.map((branch, i) => (
              <BarisCabang
                key={branch.id}
                branch={branch}
                index={i}
                companies={companies}
                autoEditId={autoEditId}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
