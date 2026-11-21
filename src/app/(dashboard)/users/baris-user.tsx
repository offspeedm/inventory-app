// src/app/(dashboard)/users/baris-user.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Trash2, Power, Eye, EyeOff, X } from "lucide-react";
import { hapusUser, toggleStatusUser, updateUser } from "./actions";

export type UserSummary = {
  id: number;
  nama: string;
  email: string;
  jabatan: string | null;
  role: string;
  divisi: string | null;
  noTelp: string | null;
  status: string;
  companyId: number | null;
  branchId: number | null;
  company?: { id: number; nama: string } | null;
  branch?: { id: number; nama: string } | null;
};

type Company = { id: number; nama: string };
type Branch = { id: number; nama: string; companyId: number | null };

function getInisial(nama: string): string {
  return nama
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function BarisUser({
  user,
  companies,
  branches,
  nomor,
  index,
}: {
  user: UserSummary;
  companies: Company[];
  branches: Branch[];
  nomor?: number;
  index?: number;
}) {
  const [editing, setEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(
    user.companyId ? String(user.companyId) : "",
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const nomorUrut = nomor ?? (typeof index === "number" ? index + 1 : "-");

  const filteredBranches = selectedCompanyId
    ? branches.filter(
        (b) =>
          b.companyId === null || String(b.companyId) === selectedCompanyId,
      )
    : branches;

  async function handleUpdate(formData: FormData) {
    setSubmitting(true);
    setErrorMsg(null);
    const res = await updateUser(user.id, formData);
    setSubmitting(false);

    if (res?.error) {
      setErrorMsg(res.error);
      return;
    }
    setEditing(false);
  }

  async function handleToggleStatus() {
    const res = await toggleStatusUser(user.id, user.status);
    if (res?.error) alert(res.error);
  }

  async function handleHapus() {
    if (!confirm(`Yakin ingin menghapus user "${user.nama}"?`)) return;
    const res = await hapusUser(user.id);
    if (res?.error) alert(res.error);
  }

  return (
    <>
      <tr className="border-b border-slate-100 transition hover:bg-slate-50/80">
        {/* 1. No */}
        <td className="px-4 py-3 text-sm text-slate-500">{nomorUrut}</td>

        {/* 2. Nama / Kontak -> Navigasi ke /users/[id] */}
        <td className="px-4 py-3">
          <Link
            href={`/users/${user.id}`}
            className="group flex items-center gap-3"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
              {getInisial(user.nama)}
            </div>
            <div>
              <div className="font-medium text-slate-900 group-hover:text-indigo-600 group-hover:underline">
                {user.nama}
              </div>
              <div className="text-xs text-slate-500">
                {user.email}
                {user.noTelp ? ` · ${user.noTelp}` : ""}
              </div>
            </div>
          </Link>
        </td>

        {/* 3. Divisi */}
        <td className="px-4 py-3 text-sm text-slate-700">
          {user.divisi ? (
            <span className="inline-flex rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
              {user.divisi}
            </span>
          ) : (
            <span className="text-slate-400">-</span>
          )}
          {user.jabatan && (
            <div className="mt-0.5 text-xs text-slate-400">{user.jabatan}</div>
          )}
        </td>

        {/* 4. Penempatan */}
        <td className="px-4 py-3 text-sm text-slate-700">
          <div>{user.company?.nama || "-"}</div>
          <div className="text-xs text-slate-400">
            {user.branch?.nama || "-"}
          </div>
        </td>

        {/* 5. Status */}
        <td className="px-4 py-3">
          <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
              user.status === "Aktif"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-rose-50 text-rose-700"
            }`}
          >
            {user.status}
          </span>
        </td>

        {/* 6. Aksi */}
        <td className="px-4 py-3 text-right">
          <div className="inline-flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                setErrorMsg(null);
                setEditing(true);
              }}
              title="Edit user"
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-indigo-600"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleToggleStatus}
              title={user.status === "Aktif" ? "Nonaktifkan" : "Aktifkan"}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-amber-600"
            >
              <Power className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleHapus}
              title="Hapus user"
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-rose-600"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </td>
      </tr>

      {/* Modal Form Edit User (dari tombol aksi tabel) */}
      {editing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs"
          onClick={() => setEditing(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-semibold text-slate-900">
                Edit Data User
              </h3>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {errorMsg && (
              <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                {errorMsg}
              </div>
            )}

            <form action={handleUpdate} className="space-y-3.5">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  name="nama"
                  defaultValue={user.nama}
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={user.email}
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">
                    No. Telepon
                  </label>
                  <input
                    type="text"
                    name="noTelp"
                    defaultValue={user.noTelp ?? ""}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">
                    Jabatan
                  </label>
                  <input
                    type="text"
                    name="jabatan"
                    defaultValue={user.jabatan ?? ""}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">
                    Divisi
                  </label>
                  <input
                    type="text"
                    name="divisi"
                    defaultValue={user.divisi ?? ""}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">
                    Perusahaan
                  </label>
                  <select
                    name="companyId"
                    value={selectedCompanyId}
                    onChange={(e) => setSelectedCompanyId(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="">- Pilih Perusahaan -</option>
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nama}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">
                    Cabang
                  </label>
                  <select
                    name="branchId"
                    defaultValue={user.branchId ? String(user.branchId) : ""}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="">- Pilih Cabang -</option>
                    {filteredBranches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.nama}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">
                    Role
                  </label>
                  <select
                    name="role"
                    defaultValue={user.role}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Teknisi">Teknisi</option>
                    <option value="Staff">Staff</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">
                    Status
                  </label>
                  <select
                    name="status"
                    defaultValue={user.status}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Non-Aktif">Non-Aktif</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Password Baru
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Kosongkan jika tidak diubah"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 pr-10 text-sm focus:border-indigo-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
                >
                  {submitting ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default BarisUser;
