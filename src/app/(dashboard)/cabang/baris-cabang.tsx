"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Trash2, X, Network, History } from "lucide-react";
import { updateCabang, hapusCabang } from "./actions";

type Company = { id: number; nama: string };
type BranchRow = {
  id: number;
  nama: string;
  kota: string | null;
  companyId: number | null;
  company: { nama: string } | null;
  user: number;
  device: number;
};

export function BarisCabang({
  branch,
  nomor,
  companies,
  autoEditId,
}: {
  branch: BranchRow;
  nomor: number;
  companies: Company[];
  autoEditId?: number | null;
}) {
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (autoEditId && autoEditId === branch.id) {
      setEditing(true);
    }
  }, [autoEditId, branch.id]);

  const inputClass =
    "w-full border border-slate-300 rounded-lg px-3 py-2 text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";

  return (
    <tr className="border-t border-slate-100 hover:bg-slate-50/60 transition-colors">
      <td className="px-4 py-3 text-slate-500">{nomor}</td>

      <td className="px-4 py-3">
        <Link href={`/cabang/${branch.id}`} className="group flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
            <Network className="w-4 h-4" />
          </span>
          <span>
            <span className="block font-medium text-slate-800 group-hover:text-indigo-600">
              {branch.nama}
            </span>
          </span>
        </Link>
      </td>

      <td className="px-4 py-3 text-slate-600">{branch.kota ?? "-"}</td>

      <td className="px-4 py-3 text-slate-600">{branch.company?.nama ?? "-"}</td>

      <td className="px-4 py-3 text-center text-slate-600">{branch.user}</td>
      <td className="px-4 py-3 text-center text-slate-600">{branch.device}</td>

      <td className="px-4 py-3">
        <div className="flex gap-1 justify-end">
          <Link
            href={`/cabang/${branch.id}`}
            title="Lihat detail & riwayat"
            aria-label="Detail"
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
          <form action={hapusCabang}>
            <input type="hidden" name="id" value={branch.id} />
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

        {editing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              onClick={() => setEditing(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
            />

            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg text-left animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-100 text-indigo-600">
                    <Network className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-slate-800 leading-tight">
                      Edit Cabang
                    </h2>
                    <p className="text-xs text-slate-400">Perbarui informasi cabang</p>
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
                  await updateCabang(formData);
                  setEditing(false);
                }}
                className="px-6 py-5 grid gap-4"
              >
                <input type="hidden" name="id" value={branch.id} />

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Nama Cabang
                  </label>
                  <input name="nama" defaultValue={branch.nama} required className={inputClass} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Kota <span className="text-slate-400 font-normal">(opsional)</span>
                  </label>
                  <input name="kota" defaultValue={branch.kota ?? ""} className={inputClass} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Perusahaan
                  </label>
                  <select
                    name="company_id"
                    defaultValue={branch.companyId ?? ""}
                    required
                    className={inputClass}
                  >
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nama}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end gap-2 mt-1 border-t border-slate-100 -mx-6 px-6 pt-4">
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
