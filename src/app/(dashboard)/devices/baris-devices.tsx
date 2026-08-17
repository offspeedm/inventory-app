"use client";

import { useState } from "react";
import { updateDevice, hapusDevice } from "./actions";
import { getFieldsForType } from "@/config/device-fields";

type DeviceType = { id: number; nama: string };
type Company = { id: number; nama: string };
type Branch = { id: number; nama: string; companyId: number | null };
type UserOpt = { id: number; nama: string };
type Attr = { key: string; value: string | null };
type DeviceRow = {
  id: number;
  nama: string;
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
  attributes: Attr[];
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

function formatRupiah(value: number | null): string {
  if (value === null || value === undefined) return "-";
  return "Rp " + Number(value).toLocaleString("id-ID");
}

function toDateInput(d: Date | null): string {
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
  const [typeId, setTypeId] = useState<string>(
    device.typeId ? String(device.typeId) : ""
  );

  const filteredBranches = companyId
    ? branches.filter((b) => b.companyId === Number(companyId))
    : [];

  const selectedTypeName = deviceTypes.find((t) => t.id === Number(typeId))?.nama;
  const dynamicFields = getFieldsForType(selectedTypeName);

  // Cari nilai atribut yang tersimpan berdasarkan key
  function attrValue(key: string): string {
    const found = device.attributes.find((a) => a.key === key);
    return found?.value ?? "";
  }

  const inputClass = "border border-slate-300 rounded-lg px-3 py-1.5 text-sm";

  // ===== MODE EDIT =====
  if (editing) {
    return (
      <tr className="border-t border-slate-100 bg-indigo-50/40">
        <td className="px-4 py-2 text-slate-500">{index + 1}</td>
        <td colSpan={6} className="px-4 py-2">
          <form
            action={async (formData: FormData) => {
              await updateDevice(formData);
              setEditing(false);
            }}
            className="flex flex-wrap gap-2 items-center"
          >
            <input type="hidden" name="id" value={device.id} />
            <input
              name="nama"
              defaultValue={device.nama}
              required
              placeholder="Nama"
              className={inputClass}
            />
            <select
              name="type_id"
              value={typeId}
              onChange={(e) => setTypeId(e.target.value)}
              className={inputClass}
            >
              <option value="">Jenis…</option>
              {deviceTypes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nama}
                </option>
              ))}
            </select>
            <input
              name="serial_number"
              defaultValue={device.serialNumber ?? ""}
              placeholder="No. seri"
              className={inputClass}
            />
            <select name="status" defaultValue={device.status} className={inputClass}>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <input
              name="tgl_beli"
              type="date"
              defaultValue={toDateInput(device.tglBeli)}
              className={inputClass}
            />
            <input
              name="harga_beli"
              type="number"
              min="0"
              defaultValue={device.hargaBeli ? String(device.hargaBeli) : ""}
              placeholder="Harga"
              className={inputClass}
            />
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
              defaultValue={device.branchId ?? ""}
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
            <select name="user_id" defaultValue={device.userId ?? ""} className={inputClass}>
              <option value="">Pengguna…</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nama}
                </option>
              ))}
            </select>

            {/* Field dinamis saat edit (prefilled dengan nilai tersimpan) */}
            {dynamicFields.map((field) => (
              <input
                key={field}
                name={"attr_" + field}
                defaultValue={attrValue(field)}
                placeholder={field}
                className={inputClass}
              />
            ))}

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
        {device.nama}
        {device.serialNumber && (
          <span className="block text-xs text-slate-400">
            SN: {device.serialNumber}
          </span>
        )}
        {device.attributes.length > 0 && (
          <span className="block text-xs text-slate-400 mt-0.5">
            {device.attributes
              .map((a) => a.key + ": " + (a.value ?? "-"))
              .join(" · ")}
          </span>
        )}
      </td>
      <td className="px-4 py-3 text-slate-600">{device.type?.nama ?? "-"}</td>
      <td className="px-4 py-3">
        <span
          className={
            "inline-block rounded-full px-2 py-0.5 text-xs font-medium " +
            statusColor(device.status)
          }
        >
          {device.status}
        </span>
      </td>
      <td className="px-4 py-3 text-slate-600">
        {device.company?.nama ?? "-"}
        {device.branch && (
          <span className="block text-xs text-slate-400">
            {device.branch.nama}
          </span>
        )}
      </td>
      <td className="px-4 py-3 text-slate-600">
        {device.user?.nama ?? "-"}
        <span className="block text-xs text-slate-400">
          {formatRupiah(device.hargaBeli)}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => setEditing(true)}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            Edit
          </button>
          <form action={hapusDevice}>
            <input type="hidden" name="id" value={device.id} />
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
