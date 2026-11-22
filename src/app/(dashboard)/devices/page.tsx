// src/app/(dashboard)/devices/page.tsx
import { Suspense } from "react";
import prisma from "@/lib/prisma";
import { FormDevice } from "./form-device";
import { TabelDevice } from "./tabel-device";
import { MonitorSmartphone } from "lucide-react";
import { WHERE_USER_AKTIF, isDeviceAktif } from "@/lib/status-filter";

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
        where: WHERE_USER_AKTIF,
        select: { id: true, nama: true },
        orderBy: { nama: "asc" },
      }),
      prisma.device.findMany({
        include: {
          type: { select: { nama: true } },
          company: { select: { nama: true } },
          branch: { select: { nama: true } },
          user: { select: { nama: true } },
          attributes: { select: { key: true, value: true } },
          _count: { select: { attachments: true } },
        },
        orderBy: { id: "asc" },
      }),
    ]);

  const devices = devicesRaw.map((d) => ({
    ...d,
    hargaBeli: d.hargaBeli ? Number(d.hargaBeli) : null,
    attachmentsCount: d._count.attachments,
  }));

  const totalDeviceAktif = devices.filter((d) =>
    isDeviceAktif(d.status),
  ).length;

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-sm">
          <MonitorSmartphone className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Inventaris Perangkat
          </h1>
          <p className="text-sm text-slate-500">
            Total perangkat aktif:{" "}
            <span className="font-semibold text-slate-700">
              {totalDeviceAktif}
            </span>
          </p>
        </div>
      </div>

      <FormDevice
        deviceTypes={deviceTypes}
        companies={companies}
        branches={branches}
        users={users}
      />

      <Suspense
        fallback={
          <div className="py-8 text-center text-sm text-slate-400">
            Memuat tabel perangkat...
          </div>
        }
      >
        <TabelDevice
          devices={devices}
          deviceTypes={deviceTypes}
          companies={companies}
          branches={branches}
          users={users}
        />
      </Suspense>
    </div>
  );
}
