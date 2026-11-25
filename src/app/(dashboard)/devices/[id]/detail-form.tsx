"use client";

import { useMemo, useState, type FormEvent } from "react";
import { MonitorSmartphone, Check, Clock, ListChecks, Tag } from "lucide-react";
import { updateDevice } from "../actions";
import { getFieldsForType } from "@/config/device-fields";
import { SearchableSelect } from "@/components/searchable-select";

type Option = { id: number; nama: string };
type DeviceTypeOption = Option & { spesifikasi?: string[] };
type Branch = Option & { companyId: number | null };
type Attr = { key: string; value: string | null };

type DeviceData = {
  id: number;
  kodeInventaris: string | null;
  nama: string;
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
  "Available",
  "Rusak",
  "Perbaikan",
  "Tidak dipakai",
  "Hilang",
  "Dihibahkan",
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
      return "bg-orange-100 text-orange-700";
    case "Perbaikan":
      return "bg-amber-100 text-amber-700";
    case "Hilang":
      return "bg-red-100 text-red-700 ring-1 ring-inset ring-red-200";
    case "Tidak dipakai":
      return "bg-slate-100 text-slate-600";
    default:
      return "bg-slate-100 text-slate-600";
  }
}

const fieldWrap =
  "group relative -mx-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-slate-50 focus-within:bg-indigo-50/60";
const fieldLabel = "mb-0.5 block text-[11px] font-medium text-slate-400";
const fieldInput =
  "w-full border-0 border-b border-dashed border-slate-200 bg-transparent p-0 pb-0.5 text-sm font-medium text-slate-800 focus:border-solid focus:border-indigo-400 focus:outline-none focus:ring-0";
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
  deviceTypes: DeviceTypeOption[];
  companies: Option[];
  branches: Branch[];
  users: Option[];
  usia: string;
  warnaUsia: string;
}) {
  const [typeId, setTypeId] = useState(
    device.typeId ? String(device.typeId) : "",
  );
  const [status, setStatus] = useState(device.status);
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

  const selectedType = deviceTypes.find((t) => t.id === Number(typeId));
  const selectedTypeName = selectedType?.nama;
  const dynamicFields = getFieldsForType(
    selectedTypeName,
    selectedType?.spesifikasi,
  );

  const filteredBranches = useMemo(
    () =>
      companyId
        ? branches.filter((b) => b.companyId === Number(companyId))
        : [],
    [branches, companyId],
  );

  const typeOptions = useMemo(
    () => deviceTypes.map((t) => ({ value: String(t.id), label: t.nama })),
    [deviceTypes],
  );

  const statusSelectOptions = useMemo(
    () => STATUS_OPTIONS.map((s) => ({ value: s, label: s })),
    [],
  );

  const userOptions = useMemo(
    () => users.map((u) => ({ value: String(u.id), label: u.nama })),
    [users],
  );

  const companyOptions = useMemo(
    () => companies.map((c) => ({ value: String(c.id), label: c.nama })),
    [companies],
  );

  const branchOptions = useMemo(
    () => filteredBranches.map((b) => ({ value: String(b.id), label: b.nama })),
    [filteredBranches],
  );

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

  function attrValue(key: string): string {
    return device.attributes.find((a) => a.key === key)?.value ?? "";
  }

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
                      statusColor(status)
                    }
                  >
                    {status}
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
            <SearchableSelect
              name="type_id"
              value={typeId}
              onChange={setTypeId}
              options={typeOptions}
              variant="underline"
              placeholder="Pilih jenis…"
            />
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
            <SearchableSelect
              name="status"
              value={status}
              onChange={(val) => setStatus(val || device.status)}
              options={statusSelectOptions}
              variant="underline"
              allowClear={false}
              placeholder="Pilih status…"
            />
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
            <SearchableSelect
              name="user_id"
              value={userId}
              onChange={setUserId}
              options={userOptions}
              variant="underline"
              placeholder="Belum ada"
            />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className={fieldWrap}>
            <label className={fieldLabel}>Perusahaan</label>
            <SearchableSelect
              name="company_id"
              value={companyId}
              onChange={handleCompanyChange}
              options={companyOptions}
              variant="underline"
              placeholder="Belum ditempatkan"
            />
          </div>
          <div className={fieldWrap}>
            <label className={fieldLabel}>Cabang</label>
            <SearchableSelect
              name="branch_id"
              value={branchId}
              onChange={setBranchId}
              options={branchOptions}
              disabled={!companyId}
              variant="underline"
              placeholder={companyId ? "Pilih cabang…" : "Pilih PT dulu"}
            />
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
