"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { BarisPerusahaan } from "./baris-perusahaan";

type Company = {
  id: number;
  nama: string;
  inisial: string | null;
  alamat: string | null;
  noTelp: string | null;
};

type FilterPunya = "semua" | "dengan_telp" | "tanpa_telp";

export function TabelPerusahaan({ companies }: { companies: Company[] }) {
  const [cari, setCari] = useState("");
  const [filter, setFilter] = useState<FilterPunya>("semua");

  const hasilFilter = useMemo(() => {
    const kata = cari.trim().toLowerCase();

    return companies.filter((c) => {
      if (filter === "dengan_telp" && !c.noTelp) return false;
      if (filter === "tanpa_telp" && c.noTelp) return false;

      if (!kata) return true;
      const gabungan = [c.nama, c.inisial ?? "", c.alamat ?? "", c.noTelp ?? ""]
        .join(" ")
        .toLowerCase();
      return gabungan.includes(kata);
    });
  }, [companies, cari, filter]);

  const inputClass =
    "border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";

  return (
    <div>
      {/* Baris pencarian & filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={cari}
            onChange={(e) => setCari(e.target.value)}
            placeholder="Cari nama, inisial, alamat, atau no. telepon…"
            className={inputClass + " w-full pl-9"}
          />
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as FilterPunya)}
          className={inputClass + " sm:w-56"}
        >
          <option value="semua">Semua perusahaan</option>
          <option value="dengan_telp">Ada no. telepon</option>
          <option value="tanpa_telp">Tanpa no. telepon</option>
        </select>
      </div>

      <p className="text-xs text-slate-400 mb-2">
        Menampilkan {hasilFilter.length} dari {companies.length} perusahaan.
      </p>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 text-left">
            <tr>
              <th className="px-4 py-3 w-16">No</th>
              <th className="px-4 py-3">Perusahaan</th>
              <th className="px-4 py-3">Alamat / Telepon</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {hasilFilter.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-slate-400">
                  Tidak ada perusahaan yang cocok dengan pencarian.
                </td>
              </tr>
            )}
            {hasilFilter.map((company, i) => (
              <BarisPerusahaan key={company.id} company={company} index={i} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
