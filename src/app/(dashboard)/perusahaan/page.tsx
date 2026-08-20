import { Suspense } from "react";
import prisma from "@/lib/prisma";
import { FormPerusahaan } from "./form-perusahaan";
import { TabelPerusahaan } from "./tabel-perusahaan";
import { Building2 } from "lucide-react";

export default async function PerusahaanPage() {
  const companiesRaw = await prisma.company.findMany({
    orderBy: { id: "asc" },
    include: {
      _count: {
        select: { branches: true, users: true, devices: true },
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
        <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-sm">
          <Building2 className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Perusahaan</h1>
          <p className="text-slate-500 text-sm">
            Kelola data perusahaan. Total: {companies.length} perusahaan.
          </p>
        </div>
      </div>

      <FormPerusahaan />

      <Suspense fallback={<p className="text-sm text-slate-400">Memuat data…</p>}>
        <TabelPerusahaan companies={companies} />
      </Suspense>
    </div>
  );
}
