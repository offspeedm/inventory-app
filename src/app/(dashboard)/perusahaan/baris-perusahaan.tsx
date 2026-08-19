"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Trash2, X, Building2, History } from "lucide-react";
import { updatePerusahaan, hapusPerusahaan } from "./actions";

type Company = {
  id: number;
  nama: string;
  inisial: string | null;
  alamat: string | null;
  noTelp: string | null;
  cabang: number;
  user: number;
  device: number;
};

export function BarisPerusahaan({
  company,
  index,
}: {
  company: Company;
  index: number;
}) {
  const [editing, setEditing] = useState(false);

  const inputClass =
    "w-full border border-slate-300 rounded-lg px-3 py-2 text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";

  return (
    <tr className="border-t border-slate-100 hover:bg-slate-50/60 transition-colors">
      <td className="px-4 py-3 text-slate-500">{index + 1}</td>

      <td className="px-4 py-3">
        <Link
          href={`/perusahaan/${company.id}`}
          className="group flex items-center gap-2"
        >
          {company.inisial && (
            <span className="inline-flex items-center justify-center rounded-md bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 shrink-0">
              {company.inisial}
            </span>
          )}
          <span className="font-medium text-slate-800 group-hover:text-indigo-600">
            {company.nama}
          </span>
        </Link>
      </td>

      <td className="px-4 py-3 text-slate-600">
        {company.alamat ?? "-"}
        {company.noTelp && (
          <span className="block text-xs text-slate-400">
            📞 {company.noTelp}
          </span>
        )}
      </td>

      <td className="px-4 py-3 text-center text-slate-600">{company.cabang}</td>
      <td className="px-4 py-3 text-center text-slate-600">{company.user}</td>
      <td className="px-4 py-3 text-center text-slate-600">{company.device}</td>

      <td className="px-4 py-3">
        <div className="flex gap-1 justify-end">
          <Link
            href={`/perusahaan/${company.id}`}
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
          <form action={hapusPerusahaan}>
            <input type="hidden" name="id" value={company.id} />
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
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-slate-800 leading-tight">
                      Edit Perusahaan
                    </h2>
                    <p className="text-xs text-slate-400">
                      Perbarui informasi perusahaan
                    </p>
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
                  await updatePerusahaan(formData);
                  setEditing(false);
                }}
                className="px-6 py-5 grid gap-4"
              >
                <input type="hidden" name="id" value={company.id} />

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Nama Perusahaan
                    </label>
                    <input
                      name="nama"
                      defaultValue={company.nama}
                      required
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Inisial
                    </label>
                    <input
                      name="inisial"
                      defaultValue={company.inisial ?? ""}
                      placeholder="SLI"
                      maxLength={10}
                      className={inputClass + " uppercase"}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Alamat{" "}
                    <span className="text-slate-400 font-normal">
                      (opsional)
                    </span>
                  </label>
                  <textarea
                    name="alamat"
                    rows={4}
                    defaultValue={company.alamat ?? ""}
                    className={inputClass + " resize-y"}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    No. Telepon{" "}
                    <span className="text-slate-400 font-normal">
                      (opsional)
                    </span>
                  </label>
                  <input
                    name="no_telp"
                    defaultValue={company.noTelp ?? ""}
                    className={inputClass}
                  />
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
