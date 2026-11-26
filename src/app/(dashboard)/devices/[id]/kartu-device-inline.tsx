"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Clock,
  ListChecks,
  MonitorSmartphone,
  Pencil,
  Save,
  X,
} from "lucide-react";
import { updateDevice } from "../actions";
import { getFieldsForType } from "@/config/device-fields";
import { SearchableSelect } from "@/components/searchable-select";

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

const STATUS_OPTIONS = [
  "Aktif",
  "Available",
  "Rusak",
  "Perbaikan",
  "Tidak dipakai",
  "Hilang",
  "Dihibahkan",
];

function statusColor(status: string) {
  switch (status) {
    case "Aktif":
      return "bg-green-100 text-green-700";
    case "Rusak":
      return "bg-orange-100 text-orange-700";
    case "Perbaikan":
      return "bg-amber-100 text-amber-700";
    case "Hilang":
      return "bg-red-100 text-red-700";
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

  const statusOptions = useMemo(
    () => STATUS_OPTIONS.map((s) => ({ value: s, label: s })),
    [],
  );

  const companyOptions = useMemo(
    () => companies.map((c) => ({ value: String(c.id), label: c.nama })),
    [companies],
  );

  const branchOptions = useMemo(
    () => filteredBranches.map((b) => ({ value: String(b.id), label: b.nama })),
    [filteredBranches],
  );

  const userOptions = useMemo(
    () => users.map((u) => ({ value: String(u.id), label: u.nama })),
    [users],
  );

  const selectedTypeName = deviceTypes.find(
    (t) => t.id === Number(typeId),
  )?.nama;
  const dynamicFields = getFieldsForType(selectedTypeName);

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

  function mulaiEdit() {
    setTypeId(device.typeId ? String(device.typeId) : "");
    setStatus(device.status);
    setCompanyId(device.companyId ? String(device.companyId) : "");
    setBranchId(device.branchId ? String(device.branchId) : "");
    setUserId(device.userId ? String(device.userId) : "");
    setEditing(true);
  }

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
                  <label className="mb-1 block text-xs font-medium text-slate-500">
                    Nama Perangkat
                  </label>
                  <input
                    name="nama"
                    required
                    defaultValue={device.nama}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">
                    Jenis
                  </label>
                  <SearchableSelect
                    name="type_id"
                    value={typeId}
                    onChange={setTypeId}
                    options={typeOptions}
                    placeholder="Ketik atau pilih jenis…"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">
                    Merk
                  </label>
                  <input
                    name="merk"
                    defaultValue={device.merk ?? ""}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">
                    Tipe/Model
                  </label>
                  <input
                    name="tipe"
                    defaultValue={device.tipe ?? ""}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">
                    No. Seri
                  </label>
                  <input
                    name="serial_number"
                    defaultValue={device.serialNumber ?? ""}
                    className={inputClass}
                  />
                </div>
              </div>

              {dynamicFields.length > 0 && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="mb-2 text-xs font-semibold text-slate-500">
                    Spesifikasi {selectedTypeName}
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {dynamicFields.map((field) => (
                      <div key={field}>
                        <label className="mb-1 block text-xs font-medium text-slate-500">
                          {field}
                        </label>
                        <input
                          name={"attr_" + field}
                          defaultValue={attrValue(field)}
                          className={inputClass + " bg-white"}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">
                    Status
                  </label>
                  <SearchableSelect
                    name="status"
                    value={status}
                    onChange={(val) => setStatus(val || device.status)}
                    options={statusOptions}
                    allowClear={false}
                    placeholder="Pilih status…"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">
                    Tgl Beli
                  </label>
                  <input
                    name="tgl_beli"
                    type="date"
                    defaultValue={toDateInput(device.tglBeli)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">
                    Harga Beli
                  </label>
                  <input
                    name="harga_beli"
                    type="number"
                    min="0"
                    defaultValue={
                      device.hargaBeli != null ? String(device.hargaBeli) : ""
                    }
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">
                    Perusahaan
                  </label>
                  <SearchableSelect
                    name="company_id"
                    value={companyId}
                    onChange={handleCompanyChange}
                    options={companyOptions}
                    placeholder="Ketik perusahaan…"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">
                    Cabang
                  </label>
                  <SearchableSelect
                    name="branch_id"
                    value={branchId}
                    onChange={setBranchId}
                    options={branchOptions}
                    disabled={!companyId}
                    placeholder={
                      companyId ? "Ketik cabang…" : "Pilih perusahaan dulu"
                    }
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">
                    Pengguna
                  </label>
                  <SearchableSelect
                    name="user_id"
                    value={userId}
                    onChange={setUserId}
                    options={userOptions}
                    placeholder="Ketik nama pengguna…"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">
                  Keterangan
                </label>
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
              <h1 className="text-xl font-bold text-slate-800">
                {device.nama}
              </h1>
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
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                <Clock className="h-3 w-3" /> {usia}
              </span>
            </div>
            <button
              type="button"
              onClick={mulaiEdit}
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
            <Info label="Jenis" value={device.type?.nama ?? "-"} />
            <Info label="Perusahaan" value={device.company?.nama ?? "-"} />
            <Info label="Cabang" value={device.branch?.nama ?? "-"} />
            <Info label="Pengguna Saat Ini" value={device.user?.nama ?? "-"} />
            <Info
              label="Tanggal Beli"
              value={device.tglBeli ? toDateInput(device.tglBeli) : "-"}
            />
            <Info
              label="Harga Beli"
              value={
                device.hargaBeli
                  ? "Rp " + Number(device.hargaBeli).toLocaleString("id-ID")
                  : "-"
              }
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
                  <Info
                    key={attr.key}
                    label={attr.key}
                    value={attr.value ?? "-"}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Info({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className={"font-medium text-slate-700" + (mono ? " font-mono" : "")}>
        {value}
      </p>
    </div>
  );
}
