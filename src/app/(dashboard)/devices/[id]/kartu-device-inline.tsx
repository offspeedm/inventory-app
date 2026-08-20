"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, ListChecks, MonitorSmartphone, Pencil, Save, Tag, X } from "lucide-react";
import { updateDevice } from "../actions";

type Option = { id: number; nama: string };
type Branch = Option & { companyId: number | null };
type Attribute = { key: string; value: string | null };

type DeviceData = {
  id: number;
  nama: string;
  kodeInventaris: string | null;
  merk: string | null;
  tipe: string | null;
  keterangan: string | null;
  serialNumber: string | null;
  tglBeli: Date | string | null;
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
  attributes: Attribute[];
};

const STATUS_OPTIONS = ["Aktif", "Rusak", "Perbaikan", "Tidak dipakai"];

function statusColor(status: string) {
  switch (status) {
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

function toDateInput(value: Date | string | null): string {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}

function hitungUsia(tglBeli: Date | string | null): string {
  if (!tglBeli) return "-";
  const beli = new Date(tglBeli);
  const now = new Date();
  let tahun = now.getFullYear() - beli.getFullYear();
  let bulan = now.getMonth() - beli.getMonth();
  if (now.getDate() < beli.getDate()) bulan -= 1;
  if (bulan < 0) {
    tahun -= 1;
    bulan += 12;
  }
  if (tahun <= 0 && bulan <= 0) return "Baru dibeli";
  const bagian: string[] = [];
  if (tahun > 0) bagian.push(`${tahun} thn`);
  if (bulan > 0) bagian.push(`${bulan} bln`);
  return bagian.join(" ");
}

export function KartuDeviceInline({
  device,
  deviceTypes,
  companies,
  branches,
  users,
}: {
  device: DeviceData;
  deviceTypes: Option[];
  companies: Option[];
  branches: Branch[];
  users: Option[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [companyId, setCompanyId] = useState(device.companyId ? String(device.companyId) : "");
  const [branchId, setBranchId] = useState(device.branchId ? String(device.branchId) : "");

  const filteredBranches = companyId
    ? branches.filter((b) => b.companyId === Number(companyId))
    : [];

  const inputClass =
    "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500";

  const usia = hitungUsia(device.tglBeli);

  // ===== MODE EDIT LANGSUNG =====
  if (editing) {
    return (
      <div className="mb-6 rounded-2xl border border-indigo-200 bg-white p-6 shadow-sm">
        <form
          action={async (formData) => {
            setSaving(true);
            try {
              await updateDevice(formData);
              setEditing(false);
              router.refresh();
            } finally {
              setSaving(false);
            }
          }}
          className="grid gap-4"
        >
          <input type="hidden" name="id" value={device.id} />

          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-sm">
              <MonitorSmartphone className="h-7 w-7" />
            </div>
            <div className="min-w-0 flex-1 grid gap-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">Nama Perangkat</label>
                  <input name="nama" required defaultValue={device.nama} className={inputClass} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">Jenis</label>
                  <select name="type_id" defaultValue={device.typeId ?? ""} className={inputClass}>
                    <option value="">Pilih jenis</option>
                    {deviceTypes.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.nama}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">Merk</label>
                  <input name="merk" defaultValue={device.merk ?? ""} className={inputClass} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">Tipe/Model</label>
                  <input name="tipe" defaultValue={device.tipe ?? ""} className={inputClass} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">No. Seri</label>
                  <input name="serial_number" defaultValue={device.serialNumber ?? ""} className={inputClass} />
                </div>
              </div>

              {device.attributes.length > 0 && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="mb-2 text-xs font-semibold text-slate-500">
                    Spesifikasi {device.type?.nama}
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {device.attributes.map((attr) => (
                      <div key={attr.key}>
                        <label className="mb-1 block text-xs font-medium text-slate-500">{attr.key}</label>
                        <input
                          name={"attr_" + attr.key}
                          defaultValue={attr.value ?? ""}
                          className={inputClass + " bg-white"}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">Status</label>
                  <select name="status" defaultValue={device.status} className={inputClass}>
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">Tgl Beli</label>
                  <input name="tgl_beli" type="date" defaultValue={toDateInput(device.tglBeli)} className={inputClass} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">Harga Beli</label>
                  <input
                    name="harga_beli"
                    type="number"
                    min="0"
                    defaultValue={device.hargaBeli != null ? String(device.hargaBeli) : ""}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">Perusahaan</label>
                  <select
                    name="company_id"
                    value={companyId}
                    onChange={(e) => {
                      setCompanyId(e.target.value);
                      setBranchId("");
                    }}
                    className={inputClass}
                  >
                    <option value="">Pilih perusahaan</option>
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nama}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">Cabang</label>
                  <select
                    name="branch_id"
                    value={branchId}
                    onChange={(e) => setBranchId(e.target.value)}
                    disabled={!companyId}
                    className={inputClass + " disabled:bg-slate-100"}
                  >
                    <option value="">{companyId ? "Pilih cabang" : "Pilih perusahaan dulu"}</option>
                    {filteredBranches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.nama}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">Pengguna</label>
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
                <label className="mb-1 block text-xs font-medium text-slate-500">Keterangan</label>
                <textarea
                  name="keterangan"
                  rows={2}
                  defaultValue={device.keterangan ?? ""}
                  className={inputClass + " resize-y"}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
            >
              <X className="h-4 w-4" /> Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:bg-slate-300"
            >
              <Save className="h-4 w-4" /> {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // ===== MODE TAMPIL BIASA =====
  return (
    <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-sm">
          <MonitorSmartphone className="h-7 w-7" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-xl font-bold text-slate-800">{device.nama}</h1>
              {device.kodeInventaris && (
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-2.5 py-0.5 font-mono text-xs font-medium text-white">
                  <Tag className="h-3 w-3" /> {device.kodeInventaris}
                </span>
              )}
              <span className={"inline-block rounded-full px-2.5 py-0.5 text-xs font-medium " + statusColor(device.status)}>
                {device.status}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                <Clock className="h-3 w-3" /> {usia}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-100"
            >
              <Pencil className="h-3.5 w-3.5" /> Edit
            </button>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            {[device.merk, device.tipe].filter(Boolean).join(" · ") || "—"}
            {device.serialNumber ? ` · SN: ${device.serialNumber}` : ""}
          </p>

          <div className="mt-5 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <Info label="Kode Inventaris" value={device.kodeInventaris ?? "-"} mono />
            <Info label="Jenis" value={device.type?.nama ?? "-"} />
            <Info label="Perusahaan" value={device.company?.nama ?? "-"} />
            <Info label="Cabang" value={device.branch?.nama ?? "-"} />
            <Info label="Pengguna Saat Ini" value={device.user?.nama ?? "-"} />
            <Info label="Tanggal Beli" value={device.tglBeli ? toDateInput(device.tglBeli) : "-"} />
            <Info
              label="Harga Beli"
              value={device.hargaBeli ? "Rp " + Number(device.hargaBeli).toLocaleString("id-ID") : "-"}
            />
            <Info label="Keterangan" value={device.keterangan ?? "-"} />
          </div>

          {device.attributes.length > 0 && (
            <div className="mt-5 border-t border-slate-100 pt-5">
              <div className="mb-3 flex items-center gap-2">
                <ListChecks className="h-4 w-4 text-indigo-500" />
                <p className="text-sm font-semibold text-slate-700">
                  Spesifikasi {device.type?.nama}
                </p>
              </div>
              <div className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
                {device.attributes.map((attr) => (
                  <Info key={attr.key} label={attr.key} value={attr.value ?? "-"} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Info({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className={"font-medium text-slate-700" + (mono ? " font-mono" : "")}>{value}</p>
    </div>
  );
}
