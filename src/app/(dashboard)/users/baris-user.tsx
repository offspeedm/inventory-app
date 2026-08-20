"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Trash2, X, UserCog, Mail, Phone, History } from "lucide-react";
import { updateUser, hapusUser } from "./actions";

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
  nomor,
  companies,
  branches,
  autoEditId,
}: {
  user: UserRow;
  nomor: number;
  companies: Company[];
  branches: Branch[];
  autoEditId?: number | null;
}) {
  const [editing, setEditing] = useState(false);
  const [companyId, setCompanyId] = useState<string>(
    user.companyId ? String(user.companyId) : ""
  );

  useEffect(() => {
    if (autoEditId && autoEditId === user.id) {
      setEditing(true);
    }
  }, [autoEditId, user.id]);

  const filteredBranches = companyId
    ? branches.filter((b) => b.companyId === Number(companyId))
    : [];

  const inputClass =
    "w-full border border-slate-300 rounded-lg px-3 py-2 text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";

  const inisial = user.nama
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  const warna = AVATAR_COLORS[nomor % AVATAR_COLORS.length];

  return (
    <tr className="border-t border-slate-100 hover:bg-slate-50/60 transition-colors">
      <td className="px-4 py-3 text-slate-500">{nomor}</td>

      <td className="px-4 py-3">
        <Link href={`/users/${user.id}`} className="group flex items-center gap-3">
          <div
            className={`shrink-0 w-9 h-9 rounded-full ${warna} text-white text-xs font-bold flex items-center justify-center`}
          >
            {inisial}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-slate-800 group-hover:text-indigo-600 truncate">
              {user.nama}
            </p>
            <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-slate-400">
              {user.email && (
                <span className="inline-flex items-center gap-1">
                  <Mail className="w-3 h-3" /> {user.email}
                </span>
              )}
              {user.noTelp && (
                <span className="inline-flex items-center gap-1">
                  <Phone className="w-3 h-3" /> {user.noTelp}
                </span>
              )}
            </div>
          </div>
        </Link>
      </td>

      <td className="px-4 py-3">
        {user.divisi ? (
          <span className="inline-block rounded-full bg-slate-100 text-slate-600 text-xs font-medium px-2.5 py-1">
            {user.divisi}
          </span>
        ) : (
          <span className="text-slate-400 text-xs">-</span>
        )}
      </td>

      <td className="px-4 py-3 text-slate-600">
        {user.company?.nama ?? "-"}
        {user.branch && (
          <span className="block text-xs text-slate-400">{user.branch.nama}</span>
        )}
      </td>

      <td className="px-4 py-3">
        <div className="flex gap-1 justify-end">
          <Link
            href={`/users/${user.id}`}
            title="Lihat riwayat troubleshooting"
            aria-label="Riwayat"
            className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
          >
            <History className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setEditing(true)}
            title="Edit"
            aria-label="Edit"
            className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <form action={hapusUser}>
            <input type="hidden" name="id" value={user.id} />
            <button
              type="submit"
              title="Hapus"
              aria-label="Hapus"
              className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* ===== POPUP / MODAL EDIT ===== */}
        {editing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              onClick={() => setEditing(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
            />

            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg text-left animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white flex items-center justify-between px-6 py-4 border-b border-slate-100 z-10">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-100 text-indigo-600">
                    <UserCog className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-slate-800 leading-tight">
                      Edit User
                    </h2>
                    <p className="text-xs text-slate-400">Perbarui data pengguna</p>
                  </div>
                </div>
                <button
                  onClick={() => setEditing(false)}
                  aria-label="Tutup"
                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form
                action={async (formData: FormData) => {
                  await updateUser(formData);
                  setEditing(false);
                }}
                className="px-6 py-5 grid gap-4"
              >
                <input type="hidden" name="id" value={user.id} />

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Nama Lengkap
                  </label>
                  <input name="nama" defaultValue={user.nama} required className={inputClass} />
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Email
                    </label>
                    <input
                      name="email"
                      type="email"
                      defaultValue={user.email ?? ""}
                      placeholder="nama@perusahaan.com"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      No. Telepon
                    </label>
                    <input
                      name="no_telp"
                      defaultValue={user.noTelp ?? ""}
                      placeholder="mis. 0812xxxxxxx"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Divisi
                  </label>
                  <input
                    name="divisi"
                    defaultValue={user.divisi ?? ""}
                    placeholder="mis. IT / Finance / Operasional"
                    className={inputClass}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Perusahaan
                    </label>
                    <select
                      name="company_id"
                      value={companyId}
                      onChange={(e) => setCompanyId(e.target.value)}
                      className={inputClass}
                    >
                      <option value="">Pilih perusahaan…</option>
                      {companies.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nama}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Cabang
                    </label>
                    <select
                      name="branch_id"
                      defaultValue={user.branchId ?? ""}
                      disabled={!companyId}
                      className={inputClass + " disabled:bg-slate-100"}
                    >
                      <option value="">
                        {companyId ? "Pilih cabang…" : "Pilih perusahaan dulu"}
                      </option>
                      {filteredBranches.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.nama}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="sticky bottom-0 bg-white flex justify-end gap-2 mt-1 border-t border-slate-100 -mx-6 px-6 pt-4">
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg px-4 py-2 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg px-5 py-2 shadow-sm transition-colors"
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
