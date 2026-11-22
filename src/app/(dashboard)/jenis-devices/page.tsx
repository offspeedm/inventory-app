// src/app/(dashboard)/jenis-devices/page.tsx
import prisma from "@/lib/prisma";
import { Tags } from "lucide-react";
import { TabelJenisDevice } from "./tabel-jenis-device";
import { WHERE_DEVICE_AKTIF } from "@/lib/status-filter";

export default async function JenisDevicesPage() {
  const deviceTypes = await prisma.deviceType.findMany({
    orderBy: { nama: "asc" },
    include: {
      _count: {
        select: {
          devices: { where: WHERE_DEVICE_AKTIF },
        },
      },
    },
  });

  const items = deviceTypes.map((dt) => ({
    id: dt.id,
    nama: dt.nama,
    kode: dt.kode,
    jumlahPerangkatAktif: dt._count.devices,
  }));

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-sm">
          <Tags className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Jenis Devices</h1>
          <p className="text-sm text-slate-500">
            Total jenis perangkat terdaftar:{" "}
            <span className="font-semibold text-slate-700">{items.length}</span>
          </p>
        </div>
      </div>

      <TabelJenisDevice items={items} />
    </div>
  );
}
