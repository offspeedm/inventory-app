"use client";

import { useState } from "react";
import { updatePerusahaan, hapusPerusahaan } from "./actions";

type Company = {
  id: number;
  nama: string;
  alamat: string | null;
};

export function BarisPerusahaan({
  company,
  index,
}: {
  company: Company;
  index: number;
}) {
  const [editing, setEditing] = useState(false);

  // ===== MODE EDIT =====
  if (editing) {
    return (
      <tr className="border-t border-slate-100 bg-indigo-50/40">
        <td className="px-4 py-2 text-slate-500">{index + 1}</td>
        <td colSpan={2} className="px-4 py-2">
          <form
            action={async (formData: FormData) => {
              await updatePerusahaan(formData);
              setEditing(false);
            }}
            className="flex flex-wrap gap-2 items-center"
          >
            <input type="hidden" name="id" value={company.id} />
            <input
              name="nama"
              defaultValue={company.nama}
              required
              className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm flex-1 min-w-45"
            />
            <input
              name="alamat"
              defaultValue={company.alamat ?? ""}
              placeholder="Alamat"
              className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm flex-1 min-w-45"
            />
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
      <td className="px-4 py-3 font-medium text-slate-800">{company.nama}</td>
      <td className="px-4 py-3 text-slate-600">
        <div className="flex items-center justify-between gap-2">
          <span>{company.alamat ?? "-"}</span>
          <div className="flex gap-2">
            <button
              onClick={() => setEditing(true)}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              Edit
            </button>
            <form action={hapusPerusahaan}>
              <input type="hidden" name="id" value={company.id} />
              <button
                type="submit"
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Hapus
              </button>
            </form>
          </div>
        </div>
      </td>
    </tr>
  );
}
