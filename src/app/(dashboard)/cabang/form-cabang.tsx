"use client";

import { useRef } from "react";
import { tambahCabang } from "./actions";

type Company = { id: number; nama: string };

export function FormCabang({ companies }: { companies: Company[] }) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData: FormData) => {
        await tambahCabang(formData);
        formRef.current?.reset();
      }}
      className="bg-white rounded-lg border border-slate-200 p-4 mb-6 grid gap-3 sm:grid-cols-4"
    >
      <input
        name="nama"
        placeholder="Nama cabang"
        required
        className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <input
        name="kota"
        placeholder="Kota"
        className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <select
        name="company_id"
        required
        defaultValue=""
        className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="" disabled>
          Pilih perusahaan…
        </option>
        {companies.map((c) => (
          <option key={c.id} value={c.id}>
            {c.nama}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors"
      >
        + Tambah Cabang
      </button>
    </form>
  );
}
