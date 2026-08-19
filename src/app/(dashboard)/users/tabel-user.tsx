"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
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
  const [filterCompany, setFilterCompany] = useState<string>("");

  const hasil = useMemo(() => {
    const kata = cari.trim().toLowerCase();

    return users.filter((u) => {
      // Filter perusahaan
      if (filterCompany && String(u.companyId) !== filterCompany) return false;

      // Pencarian bebas
      if (!kata) return true;
      const gabungan = [
        u.nama,
        u.email ?? "",
        u.noTelp ?? "",
        u.divisi ?? "",
        u.company?.nama ?? "",
        u.branch?.nama ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return gabungan.includes(kata);
    });
  }, [users, cari, filterCompany]);

  const inputClass =
    "border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";

  return (
    <div>
      {/* Pencarian & filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={cari}
            onChange={(e) => setCari(e.target.value)}
            placeholder="Cari nama, email, telepon, divisi, cabang…"
            className={inputClass + " w-full pl-9"}
          />
        </div>

        <select
          value={filterCompany}
          onChange={(e) => setFilterCompany(e.target.value)}
          className={inputClass + " sm:w-64"}
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
        Menampilkan {hasil.length} dari {users.length} user.
      </p>

      {/* Tabel */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead className="bg-slate-50 text-slate-600 text-left">
            <tr>
              <th className="px-4 py-3 w-14">No</th>
              <th className="px-4 py-3">Nama / Kontak</th>
              <th className="px-4 py-3">Divisi</th>
              <th className="px-4 py-3">Penempatan</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {hasil.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                  Tidak ada user yang cocok.
                </td>
              </tr>
            )}
            {hasil.map((user, i) => (
              <BarisUser
                key={user.id}
                user={user}
                index={i}
                companies={companies}
                branches={branches}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
