// src/app/(dashboard)/users/[id]/detail-form.tsx
"use client";

import { useMemo, useState } from "react";
import { Check, Eye, EyeOff, Loader2, X } from "lucide-react";
import { updateUser } from "../actions";

type UserDetail = {
  id: number;
  nama: string;
  email: string;
  noTelp: string | null;
  divisi: string | null;
  status: string;
  companyId: number | null;
  branchId: number | null;
};

type CompanyOpt = { id: number; nama: string };
type BranchOpt = { id: number; nama: string; companyId: number | null };

const DEFAULT_DIVISI = [
  "Operational",
  "Finance - Accounting",
  "Admin - HR",
  "Billing",
  "IT-CI-BD",
  "Sales",
  "Management",
];

function getInitials(nama: string): string {
  const parts = nama.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function normalizeStatusValue(status: string): "Aktif" | "Non-Aktif" {
  const s = status.trim().toLowerCase();
  return s === "non-aktif" || s === "nonaktif" ? "Non-Aktif" : "Aktif";
}

export function DetailFormUser({
  user,
  companies,
  branches,
  jumlahPerangkat = 0,
  jumlahTiketAktif = 0,
}: {
  user: UserDetail;
  companies: CompanyOpt[];
  branches: BranchOpt[];
  jumlahPerangkat?: number;
  jumlahTiketAktif?: number;
}) {
  const [nama, setNama] = useState(user.nama);
  const [email, setEmail] = useState(user.email);
  const [noTelp, setNoTelp] = useState(user.noTelp ?? "");
  const [passwordBaru, setPasswordBaru] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [divisi, setDivisi] = useState(user.divisi ?? "");
  const [status, setStatus] = useState<"Aktif" | "Non-Aktif">(
    normalizeStatusValue(user.status),
  );
  const [companyId, setCompanyId] = useState<string>(
    user.companyId ? String(user.companyId) : "",
  );
  const [branchId, setBranchId] = useState<string>(
    user.branchId ? String(user.branchId) : "",
  );

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const divisiOptions = useMemo(() => {
    const set = new Set(DEFAULT_DIVISI);
    if (user.divisi?.trim()) set.add(user.divisi.trim());
    return Array.from(set);
  }, [user.divisi]);

  const filteredBranches = useMemo(() => {
    if (!companyId) return [];
    return branches.filter((b) => b.companyId === Number(companyId));
  }, [branches, companyId]);

  function handleCompanyChange(nextCompanyId: string) {
    setCompanyId(nextCompanyId);
    if (!nextCompanyId) {
      setBranchId("");
      return;
    }
    const stillValid = branches.some(
      (b) => b.id === Number(branchId) && b.companyId === Number(nextCompanyId),
    );
    if (!stillValid) {
      setBranchId("");
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setSaving(true);

    const formData = new FormData();
    formData.set("id", String(user.id));
    formData.set("nama", nama);
    formData.set("email", email);
    formData.set("no_telp", noTelp);
    formData.set("divisi", divisi);
    formData.set("status", status);
    formData.set("company_id", companyId);
    formData.set("branch_id", branchId);
    if (passwordBaru.trim()) {
      formData.set("password", passwordBaru.trim());
    }

    const res = await updateUser(formData);
    setSaving(false);

    if (!res.ok) {
      setErrorMsg(res.error);
      return;
    }

    setPasswordBaru("");
    setSuccessMsg("Perubahan data user berhasil disimpan.");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs"
    >
      <input type="hidden" name="id" value={user.id} />

      {/* Header: Avatar + Nama Lengkap + Tombol Simpan */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-lg font-bold text-white shadow-xs">
            {getInitials(nama)}
          </div>
          <div className="min-w-0 flex-1">
            <label className="block text-xs font-medium text-slate-400">
              Nama Lengkap
            </label>
            <input
              type="text"
              name="nama"
              required
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="mt-0.5 w-full border-b border-slate-200 bg-transparent pb-1 text-base font-semibold text-slate-800 focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-60 cursor-pointer"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Check className="h-4 w-4" />
          )}
          {saving ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>

      {/* Notifikasi Error / Sukses */}
      {errorMsg && (
        <div className="mt-4 flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-medium text-rose-600">
          <span>{errorMsg}</span>
          <button
            type="button"
            onClick={() => setErrorMsg(null)}
            className="rounded p-0.5 hover:bg-rose-100"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {successMsg && (
        <div className="mt-4 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-medium text-emerald-700">
          <span>{successMsg}</span>
          <button
            type="button"
            onClick={() => setSuccessMsg(null)}
            className="rounded p-0.5 hover:bg-emerald-100"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Baris 1: Email | No. Telepon | Password Baru */}
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div>
          <label className="block text-xs font-medium text-slate-400">
            Email
          </label>
          <input
            type="email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full border-b border-slate-200 bg-transparent pb-1.5 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400">
            No. Telepon
          </label>
          <input
            type="text"
            name="no_telp"
            value={noTelp}
            onChange={(e) => setNoTelp(e.target.value)}
            placeholder="-"
            className="mt-1 w-full border-b border-slate-200 bg-transparent pb-1.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400">
            Password Baru
          </label>
          <div className="relative mt-1">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={passwordBaru}
              onChange={(e) => setPasswordBaru(e.target.value)}
              placeholder="Kosongkan jika tak diubah"
              autoComplete="new-password"
              className="w-full border-b border-slate-200 bg-transparent pr-8 pb-1.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label="Tampilkan password"
              className="absolute top-1/2 right-1 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Baris 2: Divisi | Status | Perusahaan | Cabang | Perangkat / Tiket Aktif */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <label className="block text-xs font-medium text-slate-400">
            Divisi
          </label>
          <select
            name="divisi"
            value={divisi}
            onChange={(e) => setDivisi(e.target.value)}
            className="mt-1 w-full border-b border-slate-200 bg-transparent pb-1.5 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none"
          >
            <option value="">Tanpa divisi</option>
            {divisiOptions.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400">
            Status
          </label>
          <select
            name="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as "Aktif" | "Non-Aktif")}
            className="mt-1 w-full border-b border-slate-200 bg-transparent pb-1.5 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none"
          >
            <option value="Aktif">Aktif</option>
            <option value="Non-Aktif">Non-Aktif</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400">
            Perusahaan
          </label>
          <select
            name="company_id"
            value={companyId}
            onChange={(e) => handleCompanyChange(e.target.value)}
            className="mt-1 w-full border-b border-slate-200 bg-transparent pb-1.5 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none"
          >
            <option value="">Belum ditempatkan</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nama}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400">
            Cabang
          </label>
          <select
            name="branch_id"
            value={branchId}
            disabled={!companyId}
            onChange={(e) => setBranchId(e.target.value)}
            className="mt-1 w-full border-b border-slate-200 bg-transparent pb-1.5 text-sm text-slate-800 disabled:text-slate-400 focus:border-indigo-500 focus:outline-none"
          >
            <option value="">
              {companyId ? "Pilih cabang..." : "Pilih PT dulu"}
            </option>
            {filteredBranches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.nama}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col items-center justify-center rounded-xl bg-slate-50 px-4 py-2.5 text-center">
          <span className="text-[11px] font-medium text-slate-400">
            Perangkat / Tiket Aktif
          </span>
          <span className="mt-0.5 text-sm font-bold text-slate-800">
            {jumlahPerangkat} / {jumlahTiketAktif}
          </span>
        </div>
      </div>
    </form>
  );
}
