"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Pencil,
  Trash2,
  X,
  MonitorSmartphone,
  History,
  Paperclip,
  Clock,
} from "lucide-react";
import { updateDevice, hapusDevice } from "./actions";
import { hitungUsia, usiaBadgeColor } from "@/lib/format-usia";

type DeviceType = { id: number; nama: string };
type Company = { id: number; nama: string };
type Branch = { id: number; nama: string; companyId: number | null };
type UserOpt = { id: number; nama: string };
type DeviceRow = {
  id: number;
  nama: string;
  kodeInventaris: string | null;
  merk: string | null;
  tipe: string | null;
  keterangan: string | null;
  serialNumber: string | null;
  tglBeli: Date | null;
  hargaBeli: number | null;
  status: string;
  typeId: number | null;
  companyId: number | null;
  branchId: number | null;
  userId: number | null;
  type: { nama: string } | null;
  company: { nama: string } | null;
  branch: { nama: string } | null;
  user: { nama: string } | null;
  attachmentsCount: number;
};

const STATUS = ["Aktif", "Rusak", "Perbaikan", "Tidak dipakai"];

function statusColor(s: string) {
  switch (s) {
    case "Aktif":
      return "bg-green-100 text-green-700";
    case "Rusak":
      return "bg-red-100 text-red-700";
    case "Perbaikan":
      return "bg-amber-100 text-amber-700";
    default:
      return "bg-slate-100 text-slate-600";
  }
}

function toDateInput(d: Date | null) {
  if (!d) return "";
  return new Date(d).toISOString().slice(0, 10);
}

export function BarisDevice({
  device,
  index,
  deviceTypes,
  companies,
  branches,
  users,
}: {
  device: DeviceRow;
  index: number;
  deviceTypes: DeviceType[];
  companies: Company[];
  branches: Branch[];
  users: UserOpt[];
}) {
  const [editing, setEditing] = useState(false);
  const [companyId, setCompanyId] = useState<string>(
    device.companyId ? String(device.companyId) : ""
  );

  const filteredBranches = companyId
    ? branches.filter((b) => b.companyId === Number(companyId))
    : [];

  const inputClass =
    "w-full border border-slate-300 rounded-lg px-3 py-2 text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";

  const usia = hitungUsia(device.tglBeli);
  const warnaUsia = usiaBadgeColor(device.tglBeli);

  return (
    <tr className="border-t border-slate-100 hover:bg-slate-50/60 transition-colors">
      <td className="px-4 py-3 text-slate-500">{index + 1}</td>

      {/* Perangkat */}
      <td className="px-4 py-3">
        <Link href={`/devices/${device.id}`} className="group inline-flex items-start gap-3">
          <div className="shrink-0 w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <MonitorSmartphone className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-slate-800 group-hover:text-indigo-600 truncate flex items-center gap-1.5">
              {device.nama}
              {device.attachmentsCount > 0 && (
                <span className="inline-flex items-center gap-0.5 text-[11px] text-slate-400 font-normal">
                  <Paperclip className="w-3 h-3" /> {device.attachmentsCount}
                </span>
              )}
            </p>
            {device.kodeInventaris && (
              <p className="text-[11px] font-mono text-indigo-500">
                {device.kodeInventaris}
              </p>
            )}
            <p className="text-xs text-slate-400 truncate">
              {[device.merk, device.tipe].filter(Boolean).join(" · ") || "—"}
              {device.serialNumber ? ` · SN: ${device.serialNumber}` : ""}
            </p>
          </div>
        </Link>
      </td>

      {/* Jenis */}
      <td className="px-4 py-3 text-slate-600">{device.type?.nama ?? "-"}</td>

      {/* Usia */}
      <td className="px-4 py-3">
        <span
          className={
            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium " +
            warnaUsia
          }
        >
          <Clock className="w-3 h-3" /> {usia}
        </span>
      </td>

      {/* Status */}
      <td className="px-4 py-3">
        <span className={"inline-block rounded-full px-2 py-0.5 text-xs font-medium " + statusColor(device.status)}>
          {device.status}
        </span>
      </td>

      {/* Penempatan / Pengguna */}
      <td className="px-4 py-3 text-slate-600">
        {device.company?.nama ?? "-"}
        {device.branch && <span className="block text-xs text-slate-400">{device.branch.nama}</span>}
        {device.user && <span className="block text-xs text-slate-400">👤 {device.user.nama}</span>}
      </td>

      {/* Aksi */}
      <td className="px-4 py-3">
        <div className="flex gap-1 justify-end">
          <Link
            href={`/devices/${device.id}`}
            title="Lihat riwayat & lampiran"
            aria-label="Riwayat"
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
          <form action={hapusDevice}>
            <input type="hidden" name="id" value={device.id} />
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

        {/* ===== MODAL EDIT ===== */}
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
                    <h2 className="text-base font-semibold text-slate-800 leading-tight">Edit Perangkat</h2>
                    <p className="text-xs text-slate-400">
                      {device.kodeInventaris ? (
                        <>Kode: <span className="font-mono">{device.kodeInventaris}</span> · </>
                      ) : null}
                      Perubahan pengguna/penempatan otomatis tercatat di riwayat
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
                  await updateDevice(formData);
                  setEditing(false);
                }}
                className="px-6 py-5 grid gap-4"
              >
                <input type="hidden" name="id" value={device.id} />

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama Perangkat</label>
                    <input name="nama" defaultValue={device.nama} required className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Jenis</label>
                    <select name="type_id" defaultValue={device.typeId ?? ""} className={inputClass}>
                      <option value="">Pilih jenis…</option>
                      {deviceTypes.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.nama}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Merk</label>
                    <input name="merk" defaultValue={device.merk ?? ""} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Tipe/Model</label>
                    <input name="tipe" defaultValue={device.tipe ?? ""} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">No. Seri</label>
                    <input name="serial_number" defaultValue={device.serialNumber ?? ""} className={inputClass} />
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
                    <select name="status" defaultValue={device.status} className={inputClass}>
                      {STATUS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Tgl Beli</label>
                    <input name="tgl_beli" type="date" defaultValue={toDateInput(device.tglBeli)} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Harga (Rp)</label>
                    <input
                      name="harga_beli"
                      type="number"
                      min="0"
                      defaultValue={device.hargaBeli ? String(device.hargaBeli) : ""}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-3">
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
                      defaultValue={device.branchId ?? ""}
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
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Pengguna</label>
                    <select name="user_id" defaultValue={device.userId ?? ""} className={inputClass}>
                      <option value="">Belum ada</option>
                      {users.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.nama}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Keterangan <span className="text-slate-400 font-normal">(opsional)</span>
                  </label>
                  <textarea
                    name="keterangan"
                    rows={2}
                    defaultValue={device.keterangan ?? ""}
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
