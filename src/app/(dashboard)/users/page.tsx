import { Suspense } from "react";
import prisma from "@/lib/prisma";
import { FormUser } from "./form-user";
import { TabelUser } from "./tabel-user";
import { StatistikUser } from "./statistik-user";
import { Users } from "lucide-react";

export default async function UsersPage() {
  const [companies, branches, users] = await Promise.all([
    prisma.company.findMany({
      select: { id: true, nama: true },
      orderBy: { nama: "asc" },
    }),
    prisma.branch.findMany({
      select: { id: true, nama: true, companyId: true },
      orderBy: { nama: "asc" },
    }),
    prisma.user.findMany({
      include: {
        company: { select: { nama: true } },
        branch: { select: { nama: true } },
      },
      orderBy: { id: "asc" },
    }),
  ]);

  const perPerusahaanMap = new Map<string, number>();
  users.forEach((u) => {
    const nama = u.company?.nama ?? "Belum ditempatkan";
    perPerusahaanMap.set(nama, (perPerusahaanMap.get(nama) ?? 0) + 1);
  });
  const perPerusahaan = Array.from(perPerusahaanMap, ([nama, jumlah]) => ({
    nama: nama.replace(/^PT\.?\s*/i, ""),
    jumlah,
  })).sort((a, b) => b.jumlah - a.jumlah);

  const perDivisiMap = new Map<string, number>();
  users.forEach((u) => {
    const nama = u.divisi ?? "Tanpa divisi";
    perDivisiMap.set(nama, (perDivisiMap.get(nama) ?? 0) + 1);
  });
  const perDivisi = Array.from(perDivisiMap, ([nama, jumlah]) => ({ nama, jumlah })).sort(
    (a, b) => b.jumlah - a.jumlah
  );

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-sm">
          <Users className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">User</h1>
          <p className="text-slate-500 text-sm">
            Kelola data pengguna aplikasi. Total: {users.length} user.
          </p>
        </div>
      </div>

      <StatistikUser perDivisi={perDivisi} perPerusahaan={perPerusahaan} />

      <FormUser companies={companies} branches={branches} />

      <Suspense fallback={<p className="text-sm text-slate-400">Memuat data…</p>}>
        <TabelUser users={users} companies={companies} branches={branches} />
      </Suspense>
    </div>
  );
}
