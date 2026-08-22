"use client";

import { useState, type FormEvent } from "react";
import { Network, Check } from "lucide-react";
import { updateCabang } from "../actions";

type Company = { id: number; nama: string };
type BranchData = {
  id: number;
  nama: string;
  kota: string | null;
  companyId: number | null;
};

const fieldWrap =
  "group relative -mx-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-slate-50 focus-within:bg-indigo-50/60";
const fieldLabel = "mb-0.5 block text-[11px] font-medium text-slate-400";
const fieldInput =
  "w-full border-0 border-b border-dashed border-slate-200 bg-transparent p-0 pb-0.5 text-sm font-medium text-slate-800 focus:border-solid focus:border-indigo-400 focus:outline-none focus:ring-0";
const fieldSelect = fieldInput + " cursor-pointer";

export function DetailFormCabang({
  branch,
  companies,
  jumlahUser,
  jumlahDevice,
  jumlahTiketAktif,
}: {
  branch: BranchData;
  companies: Company[];
  jumlahUser: number;
  jumlahDevice: number;
  jumlahTiketAktif: number;
}) {
  const [companyId, setCompanyId] = useState(branch.companyId ? String(branch.companyId) : "");
  const [saving, setSaving] = useState(false);
  const [savedTick, setSavedTick] = useState(0);

  // PENTING: pakai onSubmit + preventDefault (bukan prop `action` pada
  // <form>). Kalau dipasang sebagai form action, React otomatis me-reset
  // <select> Perusahaan yang dikendalikan lewat useState setelah data
  // tersimpan — sehingga tampilan sempat kosong walau database sudah benar
  // (baru terlihat benar lagi setelah refresh manual).
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setSaving(true);
    await updateCabang(formData);
    setSaving(false);
    setSavedTick((t) => t + 1);
  }

  return (
    <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <form onSubmit={handleSubmit}>
        <input type="hidden" name="id" value={branch.id} />

        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm">
            <Network className="h-7 w-7" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className={fieldWrap + " flex-1"}>
                <label className={fieldLabel}>Nama Cabang</label>
                <input
                  name="nama"
                  defaultValue={branch.nama}
                  required
                  className={fieldInput + " text-lg font-bold"}
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:from-indigo-700 hover:to-violet-700 disabled:opacity-60"
              >
                <Check className="h-4 w-4" />
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>

            {savedTick > 0 && !saving && (
              <p className="mt-1 text-xs text-emerald-600">Perubahan tersimpan.</p>
            )}

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className={fieldWrap}>
                <label className={fieldLabel}>Kota</label>
                <input
                  name="kota"
                  defaultValue={branch.kota ?? ""}
                  placeholder="-"
                  className={fieldInput}
                />
              </div>
              <div className={fieldWrap}>
                <label className={fieldLabel}>Perusahaan</label>
                <select
                  name="company_id"
                  value={companyId}
                  onChange={(e) => setCompanyId(e.target.value)}
                  required
                  className={fieldSelect}
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
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <RingkasanKecil label="User" value={jumlahUser} />
              <RingkasanKecil label="Devices" value={jumlahDevice} />
              <RingkasanKecil label="Tiket Aktif" value={jumlahTiketAktif} />
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}

function RingkasanKecil({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3 text-center">
      <p className="text-lg font-bold leading-none text-slate-800">{value}</p>
      <p className="mt-1 text-[11px] text-slate-500">{label}</p>
    </div>
  );
}
