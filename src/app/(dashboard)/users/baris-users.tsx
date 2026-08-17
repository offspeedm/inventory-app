"use client";

import { useState } from "react";
import { updateUser, hapusUser } from "./actions";

type Company = { id: number; nama: string };
type Branch = { id: number; nama: string; companyId: number | null };
type UserRow = {
  id: number;
  nama: string;
  email: string | null;
  jabatan: string | null;
  role: string;
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
  const [companyId, setCompanyId] = useState<string>(
    user.companyId ? String(user.companyId) : ""
  );

  const filteredBranches = companyId
    ? branches.filter((b) => b.companyId === Number(companyId))
    : [];

  const inputClass =
    "border border-slate-300 rounded-lg px-3 py-1.5 text-sm";

  // ===== MODE EDIT =====
  if (editing) {
    return (
      <tr className="border-t border-slate-100 bg-indigo-50/40">
        <td className="px-4 py-2 text-slate-500">{index + 1}</td>
        <td colSpan={5} className="px-4 py-2">
          <form
            action={async (formData: FormData) => {
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
              className={inputClass}
            />
            <input
              name="email"
              type="email"
              defaultValue={user.email ?? ""}
              placeholder="Email"
              className={inputClass}
            />
            <input
              name="jabatan"
              defaultValue={user.jabatan ?? ""}
              placeholder="Jabatan"
              className={inputClass}
            />
            <select name="role" defaultValue={user.role} className={inputClass}>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
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
            <select
              name="branch_id"
              defaultValue={user.branchId ?? ""}
              disabled={!companyId}
              className={inputClass}
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
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg px-3 py-1.5"
            >
              Simpan
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm rounded-lg px-3 py-1.5"
            >
              Batal
            </button>
          </form>
        </td>
      </tr>
    );
  }

  // ===== MODE TAMPIL =====
  return (
    <tr className="border-t border-slate-100">
      <td className="px-4 py-3 text-slate-500">{index + 1}</td>
      <td className="px-4 py-3 font-medium text-slate-800">
        {user.nama}
        {user.email && (
          <span className="block text-xs text-slate-400">{user.email}</span>
        )}
      </td>
      <td className="px-4 py-3 text-slate-600">{user.jabatan ?? "-"}</td>
      <td className="px-4 py-3">
        <span
          className={
            "inline-block rounded-full px-2 py-0.5 text-xs font-medium " +
            (user.role === "admin"
              ? "bg-purple-100 text-purple-700"
              : "bg-slate-100 text-slate-600")
          }
        >
          {user.role}
        </span>
      </td>
      <td className="px-4 py-3 text-slate-600">
        {user.company?.nama ?? "-"}
        {user.branch && (
          <span className="block text-xs text-slate-400">
            {user.branch.nama}
          </span>
        )}
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => setEditing(true)}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            Edit
          </button>
          <form action={hapusUser}>
            <input type="hidden" name="id" value={user.id} />
            <button
              type="submit"
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Hapus
            </button>
          </form>
        </div>
      </td>
    </tr>
  );
}
