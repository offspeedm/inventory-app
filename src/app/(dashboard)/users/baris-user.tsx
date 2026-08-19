"use client";

import { useState } from "react";
import { hapusUser, updateUser, toggleStatusUser } from "./actions";

type Company = { id: number; nama: string };
type Branch = { id: number; nama: string; companyId: number | null };
type UserRow = {
  id: number;
  nama: string;
  email: string | null;
  jabatan: string | null;
  status: string | null;
  companyId: number | null;
  branchId: number | null;
  company: { nama: string } | null;
  branch: { nama: string } | null;
};

export function BarisUser({
  user,
  index,
  companies,
  branches,
}: {
  user: UserRow;
  index: number;
  companies: Company[];
  branches: Branch[];
}) {
  const [editing, setEditing] = useState(false);
  const [companyId, setCompanyId] = useState<number | "">(user.companyId ?? "");

  const filteredBranches = branches.filter((b) => b.companyId === companyId);
  const isAktif = (user.status ?? "Aktif") === "Aktif";

  // ===== MODE EDIT =====
  if (editing) {
    return (
      <tr className="border-t border-slate-100 bg-indigo-50/40">
        <td className="px-4 py-2 text-slate-500">{index + 1}</td>
        <td colSpan={6} className="px-4 py-2">
          <form
            action={async (formData) => {
              await updateUser(formData);
              setEditing(false);
            }}
            className="flex flex-wrap gap-2 items-center"
          >
            <input type="hidden" name="id" value={user.id} />
            <input
              name="nama"
              defaultValue={user.nama}
              required
              className="border border-slate-300 rounded px-2 py-1 text-sm"
            />
            <input
              name="email"
              defaultValue={user.email ?? ""}
              className="border border-slate-300 rounded px-2 py-1 text-sm"
            />
            <input
              name="jabatan"
              defaultValue={user.jabatan ?? ""}
              className="border border-slate-300 rounded px-2 py-1 text-sm"
            />
            <select
              name="companyId"
              value={companyId}
              onChange={(e) => setCompanyId(Number(e.target.value))}
              className="border border-slate-300 rounded px-2 py-1 text-sm"
            >
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nama}
                </option>
              ))}
            </select>
            <select
              name="branchId"
              defaultValue={user.branchId ?? ""}
              className="border border-slate-300 rounded px-2 py-1 text-sm"
            >
              {filteredBranches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.nama}
                </option>
              ))}
            </select>
            <select
              name="status"
              defaultValue={user.status ?? "Aktif"}
              className="border border-slate-300 rounded px-2 py-1 text-sm"
            >
              <option value="Aktif">Aktif</option>
              <option value="Non-Aktif">Non-Aktif</option>
            </select>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded px-3 py-1.5"
            >
              Simpan
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-medium rounded px-3 py-1.5"
            >
              Batal
            </button>
          </form>
        </td>
      </tr>
    );
  }

  // ===== MODE TAMPILAN BIASA =====
  return (
    <tr className="border-t border-slate-100">
      <td className="px-4 py-3 text-slate-500">{index + 1}</td>
      <td className="px-4 py-3 font-medium text-slate-800">{user.nama}</td>
      <td className="px-4 py-3 text-slate-600">{user.email}</td>
      <td className="px-4 py-3 text-slate-600">{user.jabatan}</td>
      <td className="px-4 py-3 text-slate-600">{user.company?.nama ?? "-"}</td>
      <td className="px-4 py-3 text-slate-600">{user.branch?.nama ?? "-"}</td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          {/* Badge status yang bisa diklik untuk toggle */}
          <button
            onClick={() =>
              toggleStatusUser(user.id, isAktif ? "Non-Aktif" : "Aktif")
            }
            title="Klik untuk ubah status"
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
              isAktif
                ? "bg-green-100 text-green-700 hover:bg-green-200"
                : "bg-slate-200 text-slate-600 hover:bg-slate-300"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isAktif ? "bg-green-500" : "bg-slate-400"
              }`}
            />
            {isAktif ? "Aktif" : "Non-Aktif"}
          </button>

          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => setEditing(true)}
              className="text-indigo-600 hover:text-indigo-800 text-xs font-medium"
            >
              Edit
            </button>
            <button
              onClick={() => {
                if (confirm(`Hapus user "${user.nama}"?`)) {
                  hapusUser(user.id);
                }
              }}
              className="text-red-600 hover:text-red-800 text-xs font-medium"
            >
              Hapus
            </button>
          </div>
        </div>
      </td>
    </tr>
  );
}
