"use client";

import { useRef } from "react";
import { tambahPerusahaan } from "./actions";

export function FormPerusahaan() {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData: FormData) => {
        await tambahPerusahaan(formData);
        formRef.current?.reset();
      }}
      className="bg-white rounded-lg border border-slate-200 p-4 mb-6 grid gap-3 sm:grid-cols-3"
    >
      <input
        name="nama"
        placeholder="Nama perusahaan"
        required
        className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <input
        name="alamat"
        placeholder="Alamat (opsional)"
        className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <button
        type="submit"
        className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors"
      >
        + Tambah Perusahaan
      </button>
    </form>
  );
}
