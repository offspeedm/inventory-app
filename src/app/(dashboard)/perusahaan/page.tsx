// src/app/(dashboard)/perusahaan/page.tsx
import { Suspense } from "react";
import prisma from "@/lib/prisma";
import { Building2 } from "lucide-react";
import { TabelPerusahaan } from "./tabel-perusahaan";
import { WHERE_DEVICE_AKTIF, WHERE_USER_AKTIF } from "@/lib/status-filter";

export default async function PerusahaanPage() {
  const companiesRaw = await prisma.company.findMany({
    orderBy: { nama: "asc" },
    include: {
      _count: {
        select: {
          branches: true,
          devices: { where: WHERE_DEVICE_AKTIF },
          users: { where: WHERE_USER_AKTIF },
        },
      },
    },
  });

  const companies = companiesRaw.map((c) => ({
    id: c.id,
    nama: c.nama,
    inisial: c.inisial,
    alamat: c.alamat,
    noTelp: c.noTelp,
    cabang: c._count.branches,
    user: c._count.users,
    device: c._count.devices,
  }));

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-sm">
          <Building2 className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Data Perusahaan</h1>
          <p className="text-sm text-slate-500">
            Total perusahaan:{" "}
            <span className="font-semibold text-slate-700">
              {companies.length}
            </span>
          </p>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="py-8 text-center text-sm text-slate-400">
            Memuat data perusahaan...
          </div>
        }
      >
        <TabelPerusahaan companies={companies} />
      </Suspense>
    </div>
  );
}
