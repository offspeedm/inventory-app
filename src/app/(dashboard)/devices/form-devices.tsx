"use client";

import { useRef, useState } from "react";
import { tambahDevice } from "./actions";

type DeviceType = { id: number; nama: string };
type Company = { id: number; nama: string };
type Branch = { id: number; nama: string; companyId: number | null };
type UserOpt = { id: number; nama: string };

const STATUS_OPTIONS = ["Aktif", "Rusak", "Perbaikan", "Tidak dipakai"];

export function FormDevice({
  deviceTypes,
  companies,
  branches,
  users,
}: {
  deviceTypes: DeviceType[];
  companies: Company[];
  branches: Branch[];
  users: UserOpt[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [companyId, setCompanyId] = useState<string>("");

  const filteredBranches = companyId
    ? branches.filter((b) => b.companyId === Number(companyId))
    : [];

  const inputClass =
    "border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";

  return (
    <form
      ref={formRef}
      action={async (formData: FormData) => {
        await tambahDevice(formData);
        formRef.current?.reset();
        setCompanyId("");
      }}
      className="bg-white rounded-lg border border-slate-200 p-4 mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
    >
      <input name="nama" placeholder="Nama perangkat" required className={inputClass} />

      <select name="type_id" defaultValue="" className={inputClass}>
        <option value="">Jenis perangkat…</option>
        {deviceTypes.map((t) => (
          <option key={t.id} value={t.id}>
            {t.nama}
          </option>
        ))}
      </select>

      <input name="serial_number" placeholder="Nomor seri" className={inputClass} />

      <select name="status" defaultValue="Aktif" className={inputClass}>
        {STATUS_OPTIONS.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <div className="flex flex-col">
        <label className="text-xs text-slate-500 mb-1">Tanggal beli</label>
        <input name="tgl_beli" type="date" className={inputClass} />
      </div>

      <div className="flex flex-col">
        <label className="text-xs text-slate-500 mb-1">Harga beli (Rp)</label>
        <input name="harga_beli" type="number" min="0" placeholder="0" className={inputClass} />
      </div>

      <select
        name="company_id"
        value={companyId}
        onChange={(e) => setCompanyId(e.target.value)}
        className={inputClass}
      >
        <option value="">Perusahaan…</option>
        {companies.map((c) => (
          <option key={c.id} value={c.id}>
            {c.nama}
          </option>
        ))}
      </select>

      <select name="branch_id" disabled={!companyId} className={inputClass}>
        <option value="">
          {companyId ? "Cabang…" : "Pilih perusahaan dulu"}
        </option>
        {filteredBranches.map((b) => (
          <option key={b.id} value={b.id}>
            {b.nama}
          </option>
        ))}
      </select>

      <select name="user_id" defaultValue="" className={inputClass}>
        <option value="">Pengguna (opsional)…</option>
        {users.map((u) => (
          <option key={u.id} value={u.id}>
            {u.nama}
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors sm:col-span-2 lg:col-span-4"
      >
        + Tambah Perangkat
      </button>
    </form>
  );
}
