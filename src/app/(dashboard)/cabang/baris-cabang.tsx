"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { History, Network, Pencil, Trash2, X } from "lucide-react";
import { hapusCabang, updateCabang } from "./actions";

type Company = {
  id: number;
  nama: string;
};

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
    "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm transition-shadow focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500";

  return (
    <tr className="border-t border-slate-100 transition-colors hover:bg-slate-50/60">
      <td className="px-4 py-3 text-slate-500">{nomor}</td>

      <td className="px-4 py-3">
        <Link
          href={`/cabang/${branch.id}`}
          className="group flex min-w-0 items-center gap-2"
        >
          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <Network className="h-4 w-4" />
          </span>
          <span className="min-w-0 truncate font-medium text-slate-800 group-hover:text-indigo-600">
            {branch.nama}
          </span>
        </Link>
      </td>

      <td className="truncate px-4 py-3 text-slate-600">
        {branch.kota ?? "-"}
      </td>

      <td className="truncate px-4 py-3 text-slate-600">
        {branch.company?.nama ?? "-"}
      </td>

      <td className="px-4 py-3 text-center tabular-nums text-slate-600">
        {branch.user}
      </td>

      <td className="px-4 py-3 text-center tabular-nums text-slate-600">
        {branch.device}
      </td>

      <td className="px-4 py-3">
        <div className="flex items-center justify-center gap-1">
          <Link
            href={`/cabang/${branch.id}`}
            title="Lihat detail & riwayat"
            aria-label="Detail"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100"
          >
            <History className="h-4 w-4" />
          </Link>

          <button
            type="button"
            onClick={() => setEditing(true)}
            title="Edit"
            aria-label="Edit"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-indigo-600 transition-colors hover:bg-indigo-50"
          >
            <Pencil className="h-4 w-4" />
          </button>

          <form action={hapusCabang}>
            <input type="hidden" name="id" value={branch.id} />
            <button
              type="submit"
              title="Hapus"
              aria-label="Hapus"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-red-600 transition-colors hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </form>
        </div>

        {editing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <button
              type="button"
              aria-label="Tutup modal"
              onClick={() => setEditing(false)}
              className="absolute inset-0 cursor-default bg-slate-900/40 backdrop-blur-sm"
            />

            <div className="relative w-full max-w-lg rounded-2xl bg-white text-left shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                    <Network className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold leading-tight text-slate-800">
                      Edit Cabang
                    </h2>
                    <p className="text-xs text-slate-400">
                      Perbarui informasi cabang
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  aria-label="Tutup"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form
                action={async (formData: FormData) => {
                  await updateCabang(formData);
                  setEditing(false);
                }}
                className="grid gap-4 px-6 py-5"
              >
                <input type="hidden" name="id" value={branch.id} />

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Nama Cabang
                  </label>
                  <input
                    name="nama"
                    defaultValue={branch.nama}
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Kota{" "}
                    <span className="font-normal text-slate-400">
                      (opsional)
                    </span>
                  </label>
                  <input
                    name="kota"
                    defaultValue={branch.kota ?? ""}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Perusahaan
                  </label>
                  <select
                    name="company_id"
                    defaultValue={branch.companyId ?? ""}
                    required
                    className={inputClass}
                  >
                    <option value="" disabled>
                      Pilih perusahaan
                    </option>
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.nama}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="-mx-6 mt-1 flex justify-end gap-2 border-t border-slate-100 px-6 pt-4">
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
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
