"use client";

import { useRef, useState } from "react";
import { tambahTiket } from "./actions";

type Company = { id: number; nama: string };
type Branch = { id: number; nama: string; companyId: number | null };
type DeviceOpt = { id: number; nama: string };
type UserOpt = { id: number; nama: string };

const PRIORITAS = ["Rendah", "Normal", "Tinggi", "Kritis"];
const STATUS = ["Baru", "Diproses", "Selesai"];

export function FormTiket({
  companies,
  branches,
  devices,
  users,
}: {
  companies: Company[];
  branches: Branch[];
  devices: DeviceOpt[];
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
        await tambahTiket(formData);
        formRef.current?.reset();
        setCompanyId("");
      }}
      className="bg-white rounded-lg border border-slate-200 p-4 mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
    >
      <input
        name="judul"
        placeholder="Judul kendala"
        required
        className={inputClass + " sm:col-span-2 lg:col-span-2"}
      />

      <select name="prioritas" defaultValue="Normal" className={inputClass}>
        {PRIORITAS.map((p) => (
          <option key={p} value={p}>
            Prioritas: {p}
          </option>
        ))}
      </select>

      <select name="status" defaultValue="Baru" className={inputClass}>
        {STATUS.map((s) => (
          <option key={s} value={s}>
            Status: {s}
          </option>
        ))}
      </select>

      <select name="device_id" defaultValue="" className={inputClass}>
        <option value="">Perangkat (opsional)…</option>
        {devices.map((d) => (
          <option key={d.id} value={d.id}>
            {d.nama}
          </option>
        ))}
      </select>

      <select name="user_id" defaultValue="" className={inputClass}>
        <option value="">Pelapor (opsional)…</option>
        {users.map((u) => (
          <option key={u.id} value={u.id}>
            {u.nama}
          </option>
        ))}
      </select>

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

      <textarea
        name="deskripsi"
        placeholder="Deskripsi kendala (opsional)"
        rows={2}
        className={inputClass + " sm:col-span-2 lg:col-span-4"}
      />

      <button
        type="submit"
        className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors sm:col-span-2 lg:col-span-4"
      >
        + Tambah Tiket
      </button>
    </form>
  );
}
