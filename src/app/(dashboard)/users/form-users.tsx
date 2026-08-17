"use client";

import { useRef, useState } from "react";
import { tambahUser } from "./actions";

type Company = { id: number; nama: string };
type Branch = { id: number; nama: string; companyId: number | null };

export function FormUser({
  companies,
  branches,
}: {
  companies: Company[];
  branches: Branch[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [companyId, setCompanyId] = useState<string>("");

  // Cabang yang tampil menyesuaikan perusahaan yang dipilih
  const filteredBranches = companyId
    ? branches.filter((b) => b.companyId === Number(companyId))
    : [];

  const inputClass =
    "border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";

  return (
    <form
      ref={formRef}
      action={async (formData: FormData) => {
        await tambahUser(formData);
        formRef.current?.reset();
        setCompanyId("");
      }}
      className="bg-white rounded-lg border border-slate-200 p-4 mb-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-6"
    >
      <input name="nama" placeholder="Nama user" required className={inputClass} />
      <input name="email" type="email" placeholder="Email" className={inputClass} />
      <input name="jabatan" placeholder="Jabatan" className={inputClass} />

      <select name="role" defaultValue="staff" className={inputClass}>
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

      <select name="branch_id" disabled={!companyId} className={inputClass}>
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
        className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors sm:col-span-3 lg:col-span-6"
      >
        + Tambah User
      </button>
    </form>
  );
}
