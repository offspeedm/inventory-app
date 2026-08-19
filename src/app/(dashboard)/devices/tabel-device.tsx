"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { BarisDevice } from "./baris-device";

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

export function TabelDevice({
  devices,
  deviceTypes,
  companies,
  branches,
  users,
}: {
  devices: DeviceRow[];
  deviceTypes: DeviceType[];
  companies: Company[];
  branches: Branch[];
  users: UserOpt[];
}) {
  const [cari, setCari] = useState("");
  const [filterType, setFilterType] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");

  const hasil = useMemo(() => {
    const kata = cari.trim().toLowerCase();
    return devices.filter((d) => {
      if (filterType && String(d.typeId) !== filterType) return false;
      if (filterStatus && d.status !== filterStatus) return false;
      if (!kata) return true;
      const gabungan = [
        d.nama,
        d.kodeInventaris ?? "",
        d.merk ?? "",
        d.tipe ?? "",
        d.serialNumber ?? "",
        d.type?.nama ?? "",
        d.company?.nama ?? "",
        d.branch?.nama ?? "",
        d.user?.nama ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return gabungan.includes(kata);
    });
  }, [devices, cari, filterType, filterStatus]);

  const inputClass =
    "border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={cari}
            onChange={(e) => setCari(e.target.value)}
            placeholder="Cari kode, nama, merk, tipe, serial, pengguna…"
            className={inputClass + " w-full pl-9"}
          />
        </div>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className={inputClass + " sm:w-44"}>
          <option value="">Semua jenis</option>
          {deviceTypes.map((t) => (
            <option key={t.id} value={t.id}>
              {t.nama}
            </option>
          ))}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className={inputClass + " sm:w-40"}>
          <option value="">Semua status</option>
          {STATUS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <p className="text-xs text-slate-400 mb-2">
        Menampilkan {hasil.length} dari {devices.length} perangkat.
      </p>

      <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm min-w-[820px]">
          <thead className="bg-slate-50 text-slate-600 text-left">
            <tr>
              <th className="px-4 py-3 w-14">No</th>
              <th className="px-4 py-3">Perangkat</th>
              <th className="px-4 py-3">Jenis</th>
              <th className="px-4 py-3">Usia</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Penempatan / Pengguna</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {hasil.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                  Tidak ada perangkat yang cocok.
                </td>
              </tr>
            )}
            {hasil.map((device, i) => (
              <BarisDevice
                key={device.id}
                device={device}
                index={i}
                deviceTypes={deviceTypes}
                companies={companies}
                branches={branches}
                users={users}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
