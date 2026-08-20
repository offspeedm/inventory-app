"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Trash2, X, Wrench, History, Paperclip } from "lucide-react";
import { updateTiket, hapusTiket } from "./actions";
import {
  KATEGORI_MASALAH,
  URGENCY_OPTIONS,
  STATUS_OPTIONS,
  urgencyColor,
  statusColor,
} from "@/config/ticket-fields";

type Company = { id: number; nama: string };
type Branch = { id: number; nama: string; companyId: number | null };
type UserOpt = {
  id: number;
  nama: string;
  divisi: string | null;
  companyId: number | null;
  branchId: number | null;
};
type DeviceOpt = { id: number; nama: string; userId: number | null };
type TicketRow = {
  id: number;
  noTiket: string | null;
  judul: string;
  kategori: string | null;
  kendala: string | null;
  diagnosa: string | null;
  solusi: string | null;
  catatanTeknisi: string | null;
  divisi: string | null;
  prioritas: string;
  status: string;
  tglLapor: Date;
  deviceId: number | null;
  userId: number | null;
  userTerkendalaId: number | null;
  teknisiId: number | null;
  companyId: number | null;
  branchId: number | null;
  device: { nama: string } | null;
  user: { nama: string } | null;
  userTerkendala: { nama: string } | null;
  teknisi: { nama: string } | null;
  company: { nama: string } | null;
  branch: { nama: string } | null;
  attachmentsCount: number;
};

function toDateTimeInput(d: Date | null): string {
  if (!d) return "";
  const dt = new Date(d);
  dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset());
  return dt.toISOString().slice(0, 16);
}

export function BarisTiket({
  ticket,
  index,
  companies,
  branches,
  devices,
  users,
  autoEditId,
}: {
  ticket: TicketRow;
  index: number;
  companies: Company[];
  branches: Branch[];
  devices: DeviceOpt[];
  users: UserOpt[];
  autoEditId?: number | null;
}) {
  const [editing, setEditing] = useState(false);
  const [userTerkendalaId, setUserTerkendalaId] = useState(
    ticket.userTerkendalaId ? String(ticket.userTerkendalaId) : ""
  );
  const [companyId, setCompanyId] = useState(
    ticket.companyId ? String(ticket.companyId) : ""
  );
  const [divisi, setDivisi] = useState(ticket.divisi ?? "");

  useEffect(() => {
    if (autoEditId && autoEditId === ticket.id) {
      setEditing(true);
    }
  }, [autoEditId, ticket.id]);

  const filteredBranches = companyId
    ? branches.filter((b) => b.companyId === Number(companyId))
    : [];
  const filteredDevices = userTerkendalaId
    ? devices.filter((dv) => dv.userId === Number(userTerkendalaId))
    : devices;

  const inputClass =
    "w-full border border-slate-300 rounded-lg px-3 py-2 text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";

  function handleUserTerkendalaChange(value: string) {
    setUserTerkendalaId(value);
    const u = users.find((x) => String(x.id) === value);
    if (u) {
      setDivisi(u.divisi ?? "");
      setCompanyId(u.companyId ? String(u.companyId) : "");
    }
  }

  return (
    <tr className="border-t border-slate-100 hover:bg-slate-50/60 transition-colors">
      <td className="px-4 py-3 text-slate-500">{index + 1}</td>

      <td className="px-4 py-3">
        <Link href={`/troubleshooting/${ticket.id}`} className="group inline-flex items-start gap-3">
          <div className="shrink-0 w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Wrench className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-slate-800 group-hover:text-indigo-600 truncate flex items-center gap-1.5">
              {ticket.judul}
              {ticket.attachmentsCount > 0 && (
                <span className="inline-flex items-center gap-0.5 text-[11px] text-slate-400 font-normal">
                  <Paperclip className="w-3 h-3" /> {ticket.attachmentsCount}
                </span>
              )}
            </p>
            {ticket.noTiket && (
              <p className="text-[11px] font-mono text-indigo-500">{ticket.noTiket}</p>
            )}
            <p className="text-xs text-slate-400 truncate">
              {ticket.device?.nama ? `🖥️ ${ticket.device.nama}` : "—"}
              {ticket.kategori ? ` · ${ticket.kategori}` : ""}
            </p>
          </div>
        </Link>
      </td>

      <td className="px-4 py-3">
        <span className={"inline-block rounded-full px-2 py-0.5 text-xs font-medium " + urgencyColor(ticket.prioritas)}>
          {ticket.prioritas}
        </span>
      </td>

      <td className="px-4 py-3">
        <span className={"inline-block rounded-full px-2 py-0.5 text-xs font-medium " + statusColor(ticket.status)}>
          {ticket.status}
        </span>
      </td>

      <td className="px-4 py-3 text-slate-600">
        {ticket.userTerkendala?.nama ?? "-"}
        {ticket.user && ticket.user.nama !== ticket.userTerkendala?.nama && (
          <span className="block text-xs text-slate-400">Lapor: {ticket.user.nama}</span>
        )}
        {ticket.divisi && <span className="block text-xs text-slate-400">{ticket.divisi}</span>}
      </td>

      <td className="px-4 py-3">
        <div className="flex gap-1 justify-end">
          <Link
            href={`/troubleshooting/${ticket.id}`}
            title="Lihat detail"
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
          <form action={hapusTiket}>
            <input type="hidden" name="id" value={ticket.id} />
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
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl text-left animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-100 text-indigo-600">
                    <Pencil className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-slate-800 leading-tight">Edit Tiket</h2>
                    <p className="text-xs text-slate-400">
                      {ticket.noTiket && <span className="font-mono">{ticket.noTiket}</span>}
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
                  await updateTiket(formData);
                  setEditing(false);
                }}
                className="px-6 py-5 grid gap-4"
              >
                <input type="hidden" name="id" value={ticket.id} />

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Judul</label>
                  <input name="judul" defaultValue={ticket.judul} required className={inputClass} />
                </div>

                <div className="grid sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Kategori</label>
                    <select name="kategori" defaultValue={ticket.kategori ?? ""} className={inputClass}>
                      <option value="">Pilih…</option>
                      {KATEGORI_MASALAH.map((k) => (
                        <option key={k} value={k}>
                          {k}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Urgency</label>
                    <select name="urgency" defaultValue={ticket.prioritas} className={inputClass}>
                      {URGENCY_OPTIONS.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
                    <select name="status" defaultValue={ticket.status} className={inputClass}>
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Waktu Laporan</label>
                  <input
                    name="waktu_lapor"
                    type="datetime-local"
                    defaultValue={toDateTimeInput(ticket.tglLapor)}
                    className={inputClass}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Pelapor</label>
                    <select name="user_id" defaultValue={ticket.userId ?? ""} className={inputClass}>
                      <option value="">Pilih…</option>
                      {users.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.nama}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">User Terkendala</label>
                    <select
                      name="user_terkendala_id"
                      value={userTerkendalaId}
                      onChange={(e) => handleUserTerkendalaChange(e.target.value)}
                      className={inputClass}
                    >
                      <option value="">Pilih…</option>
                      {users.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.nama}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Perangkat Terkendala</label>
                  <select name="device_id" defaultValue={ticket.deviceId ?? ""} className={inputClass}>
                    <option value="">Tidak ada</option>
                    {filteredDevices.map((dv) => (
                      <option key={dv.id} value={dv.id}>
                        {dv.nama}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Divisi</label>
                    <input
                      name="divisi"
                      value={divisi}
                      onChange={(e) => setDivisi(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Perusahaan</label>
                    <select
                      name="company_id"
                      value={companyId}
                      onChange={(e) => setCompanyId(e.target.value)}
                      className={inputClass}
                    >
                      <option value="">Pilih…</option>
                      {companies.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nama}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Cabang</label>
                    <select
                      name="branch_id"
                      defaultValue={ticket.branchId ?? ""}
                      disabled={!companyId}
                      className={inputClass + " disabled:bg-slate-100"}
                    >
                      <option value="">{companyId ? "Pilih…" : "Pilih PT dulu"}</option>
                      {filteredBranches.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.nama}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Kendala</label>
                  <textarea
                    name="kendala"
                    rows={3}
                    defaultValue={ticket.kendala ?? ""}
                    className={inputClass + " resize-y"}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Teknisi</label>
                    <select name="teknisi_id" defaultValue={ticket.teknisiId ?? ""} className={inputClass}>
                      <option value="">Belum ditugaskan</option>
                      {users.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.nama}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Diagnosa</label>
                    <input name="diagnosa" defaultValue={ticket.diagnosa ?? ""} className={inputClass} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Solusi</label>
                  <textarea
                    name="solusi"
                    rows={2}
                    defaultValue={ticket.solusi ?? ""}
                    className={inputClass + " resize-y"}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Catatan Teknisi</label>
                  <textarea
                    name="catatan_teknisi"
                    rows={2}
                    defaultValue={ticket.catatanTeknisi ?? ""}
                    className={inputClass + " resize-y"}
                  />
                </div>

                <div className="sticky bottom-0 bg-white flex justify-end gap-2 mt-1 border-t border-slate-100 -mx-6 px-6 pt-4">
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
