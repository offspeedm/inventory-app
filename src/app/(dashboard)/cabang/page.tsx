import { Suspense } from "react";
import prisma from "@/lib/prisma";
import { FormCabang } from "./form-cabang";
import { TabelCabang } from "./tabel-cabang";
import { Network } from "lucide-react";

export default async function CabangPage() {
  const [companies, branchesRaw] = await Promise.all([
    prisma.company.findMany({
      select: { id: true, nama: true },
      orderBy: { nama: "asc" },
    }),
    prisma.branch.findMany({
      include: {
        company: { select: { nama: true } },
        _count: { select: { users: true, devices: true } },
      },
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
        <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm">
          <Network className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Cabang</h1>
          <p className="text-slate-500 text-sm">
            Kelola cabang tiap perusahaan. Total: {branches.length} cabang.
          </p>
        </div>
      </div>

      <FormCabang companies={companies} />

      <Suspense fallback={<p className="text-sm text-slate-400">Memuat data…</p>}>
        <TabelCabang branches={branches} companies={companies} />
      </Suspense>
    </div>
  );
}
