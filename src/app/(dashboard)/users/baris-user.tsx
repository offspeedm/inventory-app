"use client";

import { useState } from "react";
import Link from "next/link";
import { History, Mail, Pencil, Phone, Trash2, UserCog, X } from "lucide-react";
import { hapusUser, toggleStatusUser, updateUser } from "./actions";

type Company = { id: number; nama: string };
type Branch = { id: number; nama: string; companyId: number | null };
type UserRow = {
  id: number;
  nama: string;
  email: string | null;
  noTelp: string | null;
  divisi: string | null;
  status: string;
  companyId: number | null;
  branchId: number | null;
  company: { nama: string } | null;
  branch: { nama: string } | null;
};

const AVATAR_COLORS = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-fuchsia-500",
  "bg-rose-500",
  "bg-cyan-500",
];

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
  const [companyId, setCompanyId] = useState(user.companyId ? String(user.companyId) : "");
  const [branchId, setBranchId] = useState(user.branchId ? String(user.branchId) : "");

  const filteredBranches = companyId
    ? branches.filter((b) => b.companyId === Number(companyId))
    : [];

  const aktif = user.status !== "Non-Aktif";
  const inisial = user.nama
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  const warna = AVATAR_COLORS[index % AVATAR_COLORS.length];

  const inputClass =
    "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500";

  return (
    <tr className="border-t border-slate-100 transition-colors hover:bg-slate-50/60">
      <td className="px-4 py-3 text-slate-500">{index + 1}</td>

      {/* Nama + avatar + email/telp */}
      <td className="px-4 py-3">
        <Link href={`/users/${user.id}`} className="group flex items-center gap-3">
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${warna}`}
          >
            {inisial}
          </span>
          <span className="min-w-0">
            <span className="block truncate font-medium text-slate-800 group-hover:text-indigo-600">
              {user.nama}
            </span>
            <span className="flex flex-wrap gap-x-3 text-xs text-slate-400">
              {user.email && (
                <span className="inline-flex items-center gap-1">
                  <Mail className="h-3 w-3" /> {user.email}
                </span>
              )}
              {user.noTelp && (
                <span className="inline-flex items-center gap-1">
                  <Phone className="h-3 w-3" /> {user.noTelp}
                </span>
              )}
            </span>
          </span>
        </Link>
      </td>

      {/* Divisi */}
      <td className="px-4 py-3">
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
          {user.divisi || "-"}
        </span>
      </td>

      {/* Penempatan */}
      <td className="px-4 py-3 text-sm text-slate-600">
        {user.company?.nama || "-"}
        {user.branch && <span className="block text-xs text-slate-400">{user.branch.nama}</span>}
      </td>

      {/* Status — badge klik untuk toggle instan */}
      <td className="px-4 py-3">
        <form action={toggleStatusUser}>
          <input type="hidden" name="id" value={user.id} />
          <input type="hidden" name="status" value={aktif ? "Non-Aktif" : "Aktif"} />
          <button
            type="submit"
            title={`Ubah menjadi ${aktif ? "Non-Aktif" : "Aktif"}`}
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition ${
              aktif
                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                : "bg-slate-200 text-slate-600 hover:bg-slate-300"
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${aktif ? "bg-emerald-500" : "bg-slate-400"}`} />
            {aktif ? "Aktif" : "Non-Aktif"}
          </button>
        </form>
      </td>

      {/* Aksi */}
      <td className="px-4 py-3">
        <div className="flex justify-end gap-1">
          <Link
            href={`/users/${user.id}`}
            title="Riwayat troubleshooting"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <History className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={() => setEditing(true)}
            title="Edit"
            className="rounded-lg p-2 text-indigo-600 hover:bg-indigo-50"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <form action={hapusUser}>
            <input type="hidden" name="id" value={user.id} />
            <button type="submit" title="Hapus" className="rounded-lg p-2 text-red-600 hover:bg-red-50">
              <Trash2 className="h-4 w-4" />
            </button>
          </form>
        </div>

        {editing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <button
              type="button"
              aria-label="Tutup modal"
              onClick={() => setEditing(false)}
              className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm"
            />
            <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                    <UserCog className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="font-semibold text-slate-800">Edit User</h2>
                    <p className="text-xs text-slate-400">Perbarui data dan status pengguna</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form
                action={async (formData) => {
                  await updateUser(formData);
                  setEditing(false);
                }}
                className="grid gap-4 px-6 py-5"
              >
                <input type="hidden" name="id" value={user.id} />
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Nama Lengkap</label>
                  <input name="nama" required defaultValue={user.nama} className={inputClass} />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
                    <input name="email" type="email" defaultValue={user.email || ""} className={inputClass} />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">No. Telepon</label>
                    <input name="no_telp" defaultValue={user.noTelp || ""} className={inputClass} />
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Divisi</label>
                    <input name="divisi" defaultValue={user.divisi || ""} className={inputClass} />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Status</label>
                    <select name="status" defaultValue={aktif ? "Aktif" : "Non-Aktif"} className={inputClass}>
                      <option value="Aktif">Aktif</option>
                      <option value="Non-Aktif">Non-Aktif</option>
                    </select>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Perusahaan</label>
                    <select
                      name="company_id"
                      value={companyId}
                      onChange={(e) => {
                        setCompanyId(e.target.value);
                        setBranchId("");
                      }}
                      className={inputClass}
                    >
                      <option value="">Pilih perusahaan</option>
                      {companies.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nama}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Cabang</label>
                    <select
                      name="branch_id"
                      value={branchId}
                      onChange={(e) => setBranchId(e.target.value)}
                      disabled={!companyId}
                      className={inputClass + " disabled:bg-slate-100"}
                    >
                      <option value="">{companyId ? "Pilih cabang" : "Pilih perusahaan dulu"}</option>
                      {filteredBranches.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.nama}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="-mx-6 mt-1 flex justify-end gap-2 border-t border-slate-100 px-6 pt-4">
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </td>
    </tr>
  );
}
