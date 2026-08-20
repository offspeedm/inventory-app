"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { BarisPerusahaan } from "./baris-perusahaan";

type Company = {
  id: number;
  nama: string;
  inisial: string | null;
  alamat: string | null;
  noTelp: string | null;
  cabang: number;
  user: number;
  device: number;
};

export function TabelPerusahaan({ companies }: { companies: Company[] }) {
  const [cari, setCari] = useState("");
  const searchParams = useSearchParams();
  const editParam = searchParams.get("edit");
  const autoEditId = editParam ? Number(editParam) : null;

  const hasil = useMemo(() => {
    const kata = cari.trim().toLowerCase();
    if (!kata) return companies;
    return companies.filter((c) => {
      const gabungan = [c.nama, c.inisial ?? "", c.alamat ?? "", c.noTelp ?? ""]
        .join(" ")
        .toLowerCase();
      return gabungan.includes(kata);
    });
  }, [companies, cari]);

  const inputClass =
    "border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";

  return (
    <div>
      <div className="relative mb-4 max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          value={cari}
          onChange={(e) => setCari(e.target.value)}
          placeholder="Cari nama, inisial, alamat, atau no. telepon…"
          className={inputClass + " w-full pl-9"}
        />
      </div>

      <p className="text-xs text-slate-400 mb-2">
        Menampilkan {hasil.length} dari {companies.length} perusahaan.
      </p>

      <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead className="bg-slate-50 text-slate-600 text-left">
            <tr>
              <th className="px-4 py-3 w-14">No</th>
              <th className="px-4 py-3">Perusahaan</th>
              <th className="px-4 py-3">Alamat / Telepon</th>
              <th className="px-4 py-3 text-center">Cabang</th>
              <th className="px-4 py-3 text-center">User</th>
              <th className="px-4 py-3 text-center">Device</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {hasil.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                  Tidak ada perusahaan yang cocok.
                </td>
              </tr>
            )}
            {hasil.map((company, i) => (
              <BarisPerusahaan
                key={company.id}
                company={company}
                index={i}
                autoEditId={autoEditId}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
