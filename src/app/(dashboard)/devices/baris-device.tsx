// src/app/(dashboard)/devices/baris-device.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Pencil,
  Trash2,
  X,
  MonitorSmartphone,
  History,
  Paperclip,
  Clock,
  Tag,
} from "lucide-react";
import { updateDevice, hapusDevice } from "./actions";
import { hitungUsia, usiaBadgeColor } from "@/lib/format-usia";
import { getFieldsForType } from "@/config/device-fields";
import { SearchableSelect } from "@/components/searchable-select";

type DeviceType = { id: number; nama: string; spesifikasi?: string[] };
type Company = { id: number; nama: string };
type Branch = { id: number; nama: string; companyId: number | null };
type UserOpt = { id: number; nama: string };
type Attr = { key: string; value: string | null };
type DeviceRow = {
  id: number;
  kodeInventaris: string | null;
  nama: string;
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
  attributes: Attr[];
};

const STATUS = [
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
      return "bg-red-100 text-red-700 ring-1 ring-inset ring-red-200";
    case "Tidak dipakai":
      return "bg-slate-100 text-slate-600";
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
  autoEditId,
  detailQuery = "",
}: {
  device: DeviceRow;
  index: number;
  deviceTypes: DeviceType[];
  companies: Company[];
  branches: Branch[];
  users: UserOpt[];
  autoEditId?: number | null;
  detailQuery?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [typeId, setTypeId] = useState<string>(
    device.typeId ? String(device.typeId) : "",
  );
  const [status, setStatus] = useState<string>(device.status);
  const [companyId, setCompanyId] = useState<string>(
    device.companyId ? String(device.companyId) : "",
  );
  const [branchId, setBranchId] = useState<string>(
    device.branchId ? String(device.branchId) : "",
  );
  const [userId, setUserId] = useState<string>(
    device.userId ? String(device.userId) : "",
  );

  function bukaEdit() {
    setTypeId(device.typeId ? String(device.typeId) : "");
    setStatus(device.status);
    setCompanyId(device.companyId ? String(device.companyId) : "");
    setBranchId(device.branchId ? String(device.branchId) : "");
    setUserId(device.userId ? String(device.userId) : "");
    setEditing(true);
  }

  useEffect(() => {
    if (autoEditId && autoEditId === device.id) {
      bukaEdit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoEditId, device.id]);

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
    () => STATUS.map((s) => ({ value: s, label: s })),
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

  const selectedType = deviceTypes.find((t) => t.id === Number(typeId));
  const selectedTypeName = selectedType?.nama;
  const dynamicFields = getFieldsForType(
    selectedTypeName,
    selectedType?.spesifikasi,
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
    const found = device.attributes.find((a) => a.key === key);
    return found?.value ?? "";
  }

  const inputClass =
    "w-full border border-slate-300 rounded-lg px-3 py-2 text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";

  const usia = hitungUsia(device.tglBeli);
  const warnaUsia = usiaBadgeColor(device.tglBeli);
  const detailHref = `/devices/${device.id}${detailQuery}`;

  return (
    <tr className="border-t border-slate-100 hover:bg-slate-50/60 transition-colors">
      <td className="px-4 py-3.5 align-top text-slate-500">{index + 1}</td>

      <td className="w-[320px] max-w-[320px] px-4 py-3.5 align-top whitespace-normal break-words">
        <Link
          href={detailHref}
          className="group flex items-start gap-3 max-w-full"
        >
          <div className="shrink-0 w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mt-0.5">
            <MonitorSmartphone className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-slate-800 group-hover:text-indigo-600 leading-snug break-words flex flex-wrap items-center gap-1.5">
              <span>{device.nama}</span>
              {device.attachmentsCount > 0 && (
                <span className="inline-flex items-center gap-0.5 text-[11px] text-slate-400 font-normal">
                  <Paperclip className="w-3 h-3" /> {device.attachmentsCount}
                </span>
              )}
            </p>
            {device.kodeInventaris && (
              <p className="text-[11px] font-mono text-indigo-500 flex items-center gap-1 mt-0.5 mb-0.5 break-all">
                <Tag className="w-3 h-3 shrink-0" /> {device.kodeInventaris}
              </p>
            )}
            <p className="text-xs text-slate-400 leading-relaxed break-words">
              {[device.merk, device.tipe].filter(Boolean).join(" · ") || "—"}
              {device.serialNumber ? ` · SN: ${device.serialNumber}` : ""}
            </p>
            {device.attributes.length > 0 && (
              <p className="text-[11px] text-slate-400 leading-relaxed break-words mt-0.5">
                {device.attributes
                  .map((a) => `${a.key}: ${a.value ?? "-"}`)
                  .join(" · ")}
              </p>
            )}
          </div>
        </Link>
      </td>

      <td className="px-4 py-3.5 align-top whitespace-nowrap text-slate-600">
        {device.type?.nama ?? "-"}
      </td>

      <td className="px-4 py-3.5 align-top whitespace-nowrap">
        <span
          className={
            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium " +
            warnaUsia
          }
        >
          <Clock className="w-3 h-3" /> {usia}
        </span>
      </td>

      <td className="px-4 py-3.5 align-top whitespace-nowrap">
        <span
          className={
            "inline-block rounded-full px-2 py-0.5 text-xs font-medium " +
            statusColor(device.status)
          }
        >
          {device.status}
        </span>
      </td>

      <td className="max-w-[200px] px-4 py-3.5 align-top text-slate-600 break-words">
        {device.company?.nama ?? "-"}
        {device.branch && (
          <span className="block text-xs text-slate-400">
            {device.branch.nama}
          </span>
        )}
        {device.user && (
          <span className="block text-xs text-slate-400">
            👤 {device.user.nama}
          </span>
        )}
      </td>

      <td className="px-4 py-3.5 align-top whitespace-nowrap">
        <div className="flex gap-1 justify-end">
          <Link
            href={detailHref}
            title="Lihat riwayat & lampiran"
            aria-label="Riwayat"
            className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
          >
            <History className="w-4 h-4" />
          </Link>
          <button
            onClick={bukaEdit}
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

        {editing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 whitespace-normal">
            <div
              onClick={() => setEditing(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
            />

            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl text-left animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 z-10 bg-white flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-100 text-indigo-600">
                    <Pencil className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-slate-800 leading-tight">
                      Edit Perangkat
                    </h2>
                    <p className="text-xs text-slate-400">
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
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Nama Perangkat
                    </label>
                    <input
                      name="nama"
                      defaultValue={device.nama}
                      required
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
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

                <div className="grid sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Merk
                    </label>
                    <input
                      name="merk"
                      defaultValue={device.merk ?? ""}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Tipe/Model
                    </label>
                    <input
                      name="tipe"
                      defaultValue={device.tipe ?? ""}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
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
                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
                    <p className="text-xs font-semibold text-slate-500 mb-2">
                      Spesifikasi {selectedTypeName}
                    </p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {dynamicFields.map((field) => (
                        <div key={field}>
                          <label className="block text-xs font-medium text-slate-600 mb-1">
                            {field}
                          </label>
                          <input
                            name={"attr_" + field}
                            defaultValue={attrValue(field)}
                            placeholder={field}
                            className={inputClass + " bg-white"}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
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
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
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
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Harga (Rp)
                    </label>
                    <input
                      name="harga_beli"
                      type="number"
                      min="0"
                      defaultValue={
                        device.hargaBeli ? String(device.hargaBeli) : ""
                      }
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
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
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Cabang
                    </label>
                    <SearchableSelect
                      name="branch_id"
                      value={branchId}
                      onChange={setBranchId}
                      options={branchOptions}
                      disabled={!companyId}
                      placeholder={
                        companyId ? "Ketik cabang…" : "Pilih PT dulu"
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
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
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Keterangan{" "}
                    <span className="text-slate-400 font-normal">
                      (opsional)
                    </span>
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
