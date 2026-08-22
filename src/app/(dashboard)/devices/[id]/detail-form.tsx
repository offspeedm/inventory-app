"use client";

import { useState, type FormEvent } from "react";
import { MonitorSmartphone, Check, Tag, Clock, ListChecks } from "lucide-react";
import { updateDevice } from "../actions";
import { getFieldsForType } from "@/config/device-fields";

type Option = { id: number; nama: string };
type Branch = Option & { companyId: number | null };
type Attr = { key: string; value: string | null };

type DeviceData = {
  id: number;
  nama: string;
  kodeInventaris: string | null;
  merk: string | null;
  tipe: string | null;
  serialNumber: string | null;
  keterangan: string | null;
  tglBeli: Date | string | null;
  hargaBeli: number | null;
  status: string;
  typeId: number | null;
  companyId: number | null;
  branchId: number | null;
  userId: number | null;
  attributes: Attr[];
};

const STATUS_OPTIONS = [
  "Aktif",
  "Rusak",
  "Perbaikan",
  "Tidak dipakai",
  "Hilang",
];

function toDateInputValue(value: Date | string | null): string {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}

function statusColor(status: string): string {
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

const fieldWrap =
  "group relative -mx-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-slate-50 focus-within:bg-indigo-50/60";
const fieldLabel = "mb-0.5 block text-[11px] font-medium text-slate-400";
const fieldInput =
  "w-full border-0 border-b border-dashed border-slate-200 bg-transparent p-0 pb-0.5 text-sm font-medium text-slate-800 focus:border-solid focus:border-indigo-400 focus:outline-none focus:ring-0";
const fieldSelect = fieldInput + " cursor-pointer";
const fieldTextarea = fieldInput + " resize-y";

export function DetailFormDevice({
  device,
  deviceTypes,
  companies,
  branches,
  users,
  usia,
  warnaUsia,
}: {
  device: DeviceData;
  deviceTypes: Option[];
  companies: Option[];
  branches: Branch[];
  users: Option[];
  usia: string;
  warnaUsia: string;
}) {
  const [typeId, setTypeId] = useState(
    device.typeId ? String(device.typeId) : "",
  );
  const [companyId, setCompanyId] = useState(
    device.companyId ? String(device.companyId) : "",
  );
  const [branchId, setBranchId] = useState(
    device.branchId ? String(device.branchId) : "",
  );
  const [userId, setUserId] = useState(
    device.userId ? String(device.userId) : "",
  );
  const [saving, setSaving] = useState(false);
  const [savedTick, setSavedTick] = useState(0);

  const selectedTypeName = deviceTypes.find(
    (t) => t.id === Number(typeId),
  )?.nama;
  const dynamicFields = getFieldsForType(selectedTypeName);
  const filteredBranches = companyId
    ? branches.filter((b) => b.companyId === Number(companyId))
    : [];

  function attrValue(key: string): string {
    return device.attributes.find((a) => a.key === key)?.value ?? "";
  }

  // PENTING: pakai onSubmit + preventDefault (bukan prop `action` pada
  // <form>) supaya React TIDAK otomatis me-reset <select> yang dikendalikan
  // lewat useState (Jenis, Perusahaan, Cabang, Pengguna) setelah data
  // tersimpan. Tanpa ini, tampilan sempat kosong walau database sudah benar.
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setSaving(true);
    await updateDevice(formData);
    setSaving(false);
    setSavedTick((t) => t + 1);
  }

  return (
    <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <form onSubmit={handleSubmit} className="grid gap-4">
        <input type="hidden" name="id" value={device.id} />

        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-sm">
            <MonitorSmartphone className="h-7 w-7" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className={fieldWrap}>
                  <label className={fieldLabel}>Nama Perangkat</label>
                  <input
                    name="nama"
                    defaultValue={device.nama}
                    required
                    className={fieldInput + " text-lg font-bold"}
                  />
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {device.kodeInventaris && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-2.5 py-0.5 font-mono text-xs font-medium text-white">
                      <Tag className="h-3 w-3" /> {device.kodeInventaris}
                    </span>
                  )}
                  <span
                    className={
                      "inline-block rounded-full px-2.5 py-0.5 text-xs font-medium " +
                      statusColor(device.status)
                    }
                  >
                    {device.status}
                  </span>
                  <span
                    className={
                      "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium " +
                      warnaUsia
                    }
                  >
                    <Clock className="h-3 w-3" /> {usia}
                  </span>
                </div>
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
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className={fieldWrap}>
            <label className={fieldLabel}>Jenis</label>
            <select
              name="type_id"
              value={typeId}
              onChange={(e) => setTypeId(e.target.value)}
              className={fieldSelect}
            >
              <option value="">-</option>
              {deviceTypes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nama}
                </option>
              ))}
            </select>
          </div>
          <div className={fieldWrap}>
            <label className={fieldLabel}>Merk</label>
            <input
              name="merk"
              defaultValue={device.merk ?? ""}
              placeholder="-"
              className={fieldInput}
            />
          </div>
          <div className={fieldWrap}>
            <label className={fieldLabel}>Tipe/Model</label>
            <input
              name="tipe"
              defaultValue={device.tipe ?? ""}
              placeholder="-"
              className={fieldInput}
            />
          </div>
          <div className={fieldWrap}>
            <label className={fieldLabel}>No. Seri</label>
            <input
              name="serial_number"
              defaultValue={device.serialNumber ?? ""}
              placeholder="-"
              className={fieldInput}
            />
          </div>
        </div>

        {dynamicFields.length > 0 && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="mb-2 flex items-center gap-2">
              <ListChecks className="h-4 w-4 text-indigo-500" />
              <p className="text-xs font-semibold text-slate-500">
                Spesifikasi {selectedTypeName}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {dynamicFields.map((field) => (
                <div key={field} className={fieldWrap}>
                  <label className={fieldLabel}>{field}</label>
                  <input
                    name={"attr_" + field}
                    defaultValue={attrValue(field)}
                    placeholder="-"
                    className={fieldInput + " bg-white"}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className={fieldWrap}>
            <label className={fieldLabel}>Status</label>
            <select
              name="status"
              defaultValue={device.status}
              className={fieldSelect}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className={fieldWrap}>
            <label className={fieldLabel}>Tgl Beli</label>
            <input
              name="tgl_beli"
              type="date"
              defaultValue={toDateInputValue(device.tglBeli)}
              className={fieldInput}
            />
          </div>
          <div className={fieldWrap}>
            <label className={fieldLabel}>Harga Beli</label>
            <input
              name="harga_beli"
              type="number"
              min="0"
              defaultValue={device.hargaBeli ?? ""}
              placeholder="-"
              className={fieldInput}
            />
          </div>
          <div className={fieldWrap}>
            <label className={fieldLabel}>Pengguna</label>
            <select
              name="user_id"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className={fieldSelect}
            >
              <option value="">Belum ada</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nama}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
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
        </div>

        <div className={fieldWrap}>
          <label className={fieldLabel}>Keterangan</label>
          <textarea
            name="keterangan"
            rows={2}
            defaultValue={device.keterangan ?? ""}
            placeholder="-"
            className={fieldTextarea}
          />
        </div>
      </form>
    </section>
  );
}
