// src/app/(dashboard)/cabang/page.tsx
import { Suspense } from "react";
import prisma from "@/lib/prisma";
import { GitBranch } from "lucide-react";
import { TabelCabang } from "./tabel-cabang";
import { WHERE_DEVICE_AKTIF, WHERE_USER_AKTIF } from "@/lib/status-filter";

export default async function CabangPage() {
  const [branchesRaw, companies] = await Promise.all([
    prisma.branch.findMany({
      orderBy: { nama: "asc" },
      include: {
        company: { select: { id: true, nama: true } },
        _count: {
          select: {
            devices: { where: WHERE_DEVICE_AKTIF },
            users: { where: WHERE_USER_AKTIF },
          },
        },
      },
    }),
    prisma.company.findMany({
      select: { id: true, nama: true },
      orderBy: { nama: "asc" },
    }),
  ]);

  const branches = branchesRaw.map((b) => ({
    id: b.id,
    nama: b.nama,
    kota: b.kota,
    companyId: b.companyId,
    company: b.company,
    user: b._count.users,
    device: b._count.devices,
  }));

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-sm">
          <GitBranch className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Data Cabang</h1>
          <p className="text-sm text-slate-500">
            Total cabang:{" "}
            <span className="font-semibold text-slate-700">
              {branches.length}
            </span>
          </p>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="py-8 text-center text-sm text-slate-400">
            Memuat data cabang...
          </div>
        }
      >
        <TabelCabang branches={branches} companies={companies} />
      </Suspense>
    </div>
  );
}
