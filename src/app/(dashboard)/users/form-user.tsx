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
  const [companyId, setCompanyId] = useState<number | "">("");

  const filteredBranches = branches.filter((b) => b.companyId === companyId);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await tambahUser(formData);
        formRef.current?.reset();
        setCompanyId("");
      }}
      className="bg-white rounded-lg border border-slate-200 p-4 mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-7"
    >
      <input
        name="nama"
        placeholder="Nama user"
        required
        className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <input
        name="jabatan"
        placeholder="Jabatan"
        className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <select
        name="companyId"
        required
        value={companyId}
        onChange={(e) => setCompanyId(Number(e.target.value))}
        className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="">Pilih perusahaan…</option>
        {companies.map((c) => (
          <option key={c.id} value={c.id}>
            {c.nama}
          </option>
        ))}
      </select>
      <select
        name="branchId"
        required
        disabled={!companyId}
        className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100"
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
      <select
        name="status"
        defaultValue="Aktif"
        className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="Aktif">Aktif</option>
        <option value="Non-Aktif">Non-Aktif</option>
      </select>
      <button
        type="submit"
        className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors"
      >
        + Tambah User
      </button>
    </form>
  );
}
