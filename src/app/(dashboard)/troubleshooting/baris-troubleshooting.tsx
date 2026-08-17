"use client";

import { useState } from "react";
import { updateTiket, hapusTiket } from "./actions";

type Company = { id: number; nama: string };
type Branch = { id: number; nama: string; companyId: number | null };
type DeviceOpt = { id: number; nama: string };
type UserOpt = { id: number; nama: string };
type TicketRow = {
  id: number;
  judul: string;
  deskripsi: string | null;
  prioritas: string;
  status: string;
  deviceId: number | null;
  userId: number | null;
  companyId: number | null;
  branchId: number | null;
  device: { nama: string } | null;
  user: { nama: string } | null;
  company: { nama: string } | null;
  branch: { nama: string } | null;
};

const PRIORITAS = ["Rendah", "Normal", "Tinggi", "Kritis"];
const STATUS = ["Baru", "Diproses", "Selesai"];

function statusColor(status: string) {
  switch (status) {
    case "Baru":
      return "bg-blue-100 text-blue-700";
    case "Diproses":
      return "bg-amber-100 text-amber-700";
    case "Selesai":
      return "bg-green-100 text-green-700";
    default:
      return "bg-slate-100 text-slate-600";
  }
}

function prioritasColor(prioritas: string) {
  switch (prioritas) {
    case "Kritis":
      return "bg-red-100 text-red-700";
    case "Tinggi":
      return "bg-orange-100 text-orange-700";
    case "Rendah":
      return "bg-slate-100 text-slate-500";
    default:
      return "bg-slate-100 text-slate-600";
  }
}

export function BarisTiket({
  ticket,
  index,
  companies,
  branches,
  devices,
  users,
}: {
  ticket: TicketRow;
  index: number;
  companies: Company[];
  branches: Branch[];
  devices: DeviceOpt[];
  users: UserOpt[];
}) {
  const [editing, setEditing] = useState(false);
  const [companyId, setCompanyId] = useState<string>(
    ticket.companyId ? String(ticket.companyId) : ""
  );

  const filteredBranches = companyId
    ? branches.filter((b) => b.companyId === Number(companyId))
    : [];

  const inputClass = "border border-slate-300 rounded-lg px-3 py-1.5 text-sm";

  // ===== MODE EDIT =====
  if (editing) {
    return (
      <tr className="border-t border-slate-100 bg-indigo-50/40">
        <td className="px-4 py-2 text-slate-500">{index + 1}</td>
        <td colSpan={5} className="px-4 py-2">
          <form
            action={async (formData: FormData) => {
              await updateTiket(formData);
              setEditing(false);
            }}
            className="flex flex-wrap gap-2 items-center"
          >
            <input type="hidden" name="id" value={ticket.id} />
            <input
              name="judul"
              defaultValue={ticket.judul}
              required
              placeholder="Judul"
              className={inputClass}
            />
            <select name="prioritas" defaultValue={ticket.prioritas} className={inputClass}>
              {PRIORITAS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <select name="status" defaultValue={ticket.status} className={inputClass}>
              {STATUS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <select name="device_id" defaultValue={ticket.deviceId ?? ""} className={inputClass}>
              <option value="">Perangkat…</option>
              {devices.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nama}
                </option>
              ))}
            </select>
            <select name="user_id" defaultValue={ticket.userId ?? ""} className={inputClass}>
              <option value="">Pelapor…</option>
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
            <select
              name="branch_id"
              defaultValue={ticket.branchId ?? ""}
              disabled={!companyId}
              className={inputClass}
            >
              <option value="">{companyId ? "Cabang…" : "Pilih PT dulu"}</option>
              {filteredBranches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.nama}
                </option>
              ))}
            </select>
            <input
              name="deskripsi"
              defaultValue={ticket.deskripsi ?? ""}
              placeholder="Deskripsi"
              className={inputClass}
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
      <td className="px-4 py-3 font-medium text-slate-800">
        {ticket.judul}
        {ticket.deskripsi && (
          <span className="block text-xs text-slate-400 font-normal">
            {ticket.deskripsi}
          </span>
        )}
        {ticket.device && (
          <span className="block text-xs text-slate-400 font-normal">
            🖥️ {ticket.device.nama}
          </span>
        )}
      </td>
      <td className="px-4 py-3">
        <span
          className={
            "inline-block rounded-full px-2 py-0.5 text-xs font-medium " +
            prioritasColor(ticket.prioritas)
          }
        >
          {ticket.prioritas}
        </span>
      </td>
      <td className="px-4 py-3">
        <span
          className={
            "inline-block rounded-full px-2 py-0.5 text-xs font-medium " +
            statusColor(ticket.status)
          }
        >
          {ticket.status}
        </span>
      </td>
      <td className="px-4 py-3 text-slate-600">
        {ticket.company?.nama ?? "-"}
        {ticket.branch && (
          <span className="block text-xs text-slate-400">
            {ticket.branch.nama}
          </span>
        )}
        {ticket.user && (
          <span className="block text-xs text-slate-400">
            👤 {ticket.user.nama}
          </span>
        )}
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => setEditing(true)}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            Edit
          </button>
          <form action={hapusTiket}>
            <input type="hidden" name="id" value={ticket.id} />
            <button
              type="submit"
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Hapus
            </button>
          </form>
        </div>
      </td>
    </tr>
  );
}
