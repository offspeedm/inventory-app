import prisma from "@/lib/prisma";
import { FormDevice } from "./form-devices";
import { BarisDevice } from "./baris-devices";

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

export default async function DevicesPage() {
  // Ambil data pendukung untuk pilihan di form
  const deviceTypes = await prisma.deviceType.findMany({
    select: { id: true, nama: true },
    orderBy: { nama: "asc" },
  });

  const companies = await prisma.company.findMany({
    select: { id: true, nama: true },
    orderBy: { nama: "asc" },
  });

  const branches = await prisma.branch.findMany({
    select: { id: true, nama: true, companyId: true },
    orderBy: { nama: "asc" },
  });

  const users = await prisma.user.findMany({
    select: { id: true, nama: true },
    orderBy: { nama: "asc" },
  });

  // Ambil daftar device + semua relasinya + field dinamis
  const devicesRaw = await prisma.device.findMany({
    include: {
      type: { select: { nama: true } },
      company: { select: { nama: true } },
      branch: { select: { nama: true } },
      user: { select: { nama: true } },
      attributes: { select: { key: true, value: true } },
    },
    orderBy: { id: "asc" },
  });

  // Ubah hargaBeli (Decimal) menjadi number agar bisa dikirim ke Client Component
  const devices: DeviceRow[] = devicesRaw.map((d) => ({
    ...d,
    hargaBeli: d.hargaBeli ? Number(d.hargaBeli) : null,
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800">Devices</h1>
      <p className="text-slate-500 mt-1 mb-4">
        Kelola perangkat/aset IT. Total: {devices.length} perangkat.
      </p>

      {/* Form tambah device */}
      <FormDevice
        deviceTypes={deviceTypes}
        companies={companies}
        branches={branches}
        users={users}
      />

      {/* Tabel daftar device */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead className="bg-slate-50 text-slate-600 text-left">
            <tr>
              <th className="px-4 py-3 w-16">No</th>
              <th className="px-4 py-3">Perangkat</th>
              <th className="px-4 py-3">Jenis</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Penempatan</th>
              <th className="px-4 py-3">Pengguna / Harga</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {devices.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-slate-400">
                  Belum ada perangkat. Tambahkan lewat form di atas.
                </td>
              </tr>
            )}
            {devices.map((device: DeviceRow, i: number) => (
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
