import prisma from "@/lib/prisma";
import { FormDevice } from "./form-devices";
import { TabelDevice } from "./tabel-devices";
import { MonitorSmartphone } from "lucide-react";

export default async function DevicesPage() {
  const [deviceTypes, companies, branches, users, devicesRaw] =
    await Promise.all([
      prisma.deviceType.findMany({
        select: { id: true, nama: true },
        orderBy: { nama: "asc" },
      }),
      prisma.company.findMany({
        select: { id: true, nama: true },
        orderBy: { nama: "asc" },
      }),
      prisma.branch.findMany({
        select: { id: true, nama: true, companyId: true },
        orderBy: { nama: "asc" },
      }),
      prisma.user.findMany({
        select: { id: true, nama: true },
        orderBy: { nama: "asc" },
      }),
      prisma.device.findMany({
        include: {
          type: { select: { nama: true } },
          company: { select: { nama: true } },
          branch: { select: { nama: true } },
          user: { select: { nama: true } },
        },
        orderBy: { id: "asc" },
      }),
    ]);

  // Ubah Decimal (hargaBeli) menjadi number agar aman dikirim ke client
  const devices = devicesRaw.map((d) => ({
    ...d,
    hargaBeli: d.hargaBeli ? Number(d.hargaBeli) : null,
  }));

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-sm">
          <MonitorSmartphone className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Devices</h1>
          <p className="text-slate-500 text-sm">
            Kelola aset perangkat IT. Total: {devices.length} perangkat.
          </p>
        </div>
      </div>

      <FormDevice
        deviceTypes={deviceTypes}
        companies={companies}
        branches={branches}
        users={users}
      />

      <TabelDevice
        devices={devices}
        deviceTypes={deviceTypes}
        companies={companies}
        branches={branches}
        users={users}
      />
    </div>
  );
}
