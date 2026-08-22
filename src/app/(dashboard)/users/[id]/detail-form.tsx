"use client";

import { useState, type FormEvent } from "react";
import { UserRound, Check } from "lucide-react";
import { updateUser } from "../actions";

type Company = { id: number; nama: string };
type Branch = { id: number; nama: string; companyId: number | null };
type UserData = {
  id: number;
  nama: string;
  email: string | null;
  noTelp: string | null;
  divisi: string | null;
  status: string;
  companyId: number | null;
  branchId: number | null;
};

const fieldWrap =
  "group relative -mx-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-slate-50 focus-within:bg-indigo-50/60";
const fieldLabel = "mb-0.5 block text-[11px] font-medium text-slate-400";
const fieldInput =
  "w-full border-0 border-b border-dashed border-slate-200 bg-transparent p-0 pb-0.5 text-sm font-medium text-slate-800 focus:border-solid focus:border-indigo-400 focus:outline-none focus:ring-0";
const fieldSelect = fieldInput + " cursor-pointer";

export function DetailFormUser({
  user,
  companies,
  branches,
  jumlahPerangkat,
  jumlahTiketAktif,
}: {
  user: UserData;
  companies: Company[];
  branches: Branch[];
  jumlahPerangkat: number;
  jumlahTiketAktif: number;
}) {
  const [companyId, setCompanyId] = useState(
    user.companyId ? String(user.companyId) : "",
  );
  const [branchId, setBranchId] = useState(
    user.branchId ? String(user.branchId) : "",
  );
  const [saving, setSaving] = useState(false);
  const [savedTick, setSavedTick] = useState(0);

  const filteredBranches = companyId
    ? branches.filter((b) => b.companyId === Number(companyId))
    : [];

  const inisial = user.nama
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  // PENTING: dipanggil lewat onSubmit + preventDefault, BUKAN lewat prop
  // `action={handleSubmit}` pada <form>. Kalau dipasang sebagai form action,
  // React otomatis me-reset seluruh isi form (termasuk <select> yang
  // dikendalikan lewat useState) begitu proses selesai — sehingga tampilan
  // sempat kosong walau data sudah tersimpan benar di database.
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setSaving(true);
    await updateUser(formData);
    setSaving(false);
    setSavedTick((t) => t + 1);
  }

  return (
    <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <form onSubmit={handleSubmit}>
        <input type="hidden" name="id" value={user.id} />

        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-lg font-bold text-white shadow-sm">
            {inisial || <UserRound className="h-7 w-7" />}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className={fieldWrap + " flex-1"}>
                <label className={fieldLabel}>Nama Lengkap</label>
                <input
                  name="nama"
                  defaultValue={user.nama}
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
              <p className="mt-1 text-xs text-emerald-600">
                Perubahan tersimpan.
              </p>
            )}

            <div className="mt-2 grid gap-x-4 gap-y-1 sm:grid-cols-2">
              <div className={fieldWrap}>
                <label className={fieldLabel}>Email</label>
                <input
                  name="email"
                  type="email"
                  defaultValue={user.email ?? ""}
                  placeholder="-"
                  className={fieldInput}
                />
              </div>
              <div className={fieldWrap}>
                <label className={fieldLabel}>No. Telepon</label>
                <input
                  name="no_telp"
                  defaultValue={user.noTelp ?? ""}
                  placeholder="-"
                  className={fieldInput}
                />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-5">
              <div className={fieldWrap}>
                <label className={fieldLabel}>Divisi</label>
                <input
                  name="divisi"
                  defaultValue={user.divisi ?? ""}
                  placeholder="-"
                  className={fieldInput}
                />
              </div>
              <div className={fieldWrap}>
                <label className={fieldLabel}>Status</label>
                <select
                  name="status"
                  defaultValue={
                    user.status === "Non-Aktif" ? "Non-Aktif" : "Aktif"
                  }
                  className={fieldSelect}
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Non-Aktif">Non-Aktif</option>
                </select>
              </div>
              <div className={fieldWrap}>
                <label className={fieldLabel}>Perusahaan</label>
                <select
                  name="company_id"
                  value={companyId}
                  onChange={(e) => {
                    setCompanyId(e.target.value);
                    setBranchId("");
                  }}
                  className={fieldSelect}
                >
                  <option value="">-</option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nama}
                    </option>
                  ))}
                </select>
              </div>
              <div className={fieldWrap}>
                <label className={fieldLabel}>Cabang</label>
                <select
                  name="branch_id"
                  value={branchId}
                  onChange={(e) => setBranchId(e.target.value)}
                  disabled={!companyId}
                  className={
                    fieldSelect +
                    " disabled:cursor-not-allowed disabled:text-slate-300"
                  }
                >
                  <option value="">-</option>
                  {filteredBranches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.nama}
                    </option>
                  ))}
                </select>
              </div>
              <div className="rounded-lg bg-slate-50 px-2 py-1.5 text-center">
                <p className="text-[11px] font-medium text-slate-400">
                  Perangkat / Tiket Aktif
                </p>
                <p className="text-sm font-semibold text-slate-700">
                  {jumlahPerangkat} / {jumlahTiketAktif}
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}
