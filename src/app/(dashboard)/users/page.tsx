// src/app/(dashboard)/users/page.tsx
import { Suspense } from "react";
import prisma from "@/lib/prisma";
import { Users } from "lucide-react";
import { FormUser } from "./form-user";
import { TabelUser } from "./tabel-user";
import { StatistikUser } from "./statistik-user";
import { WHERE_USER_AKTIF } from "@/lib/status-filter";

export default async function UsersPage() {
  const [companies, branches, users, activeUsers] = await Promise.all([
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
      orderBy: { nama: "asc" },
    }),
    prisma.user.findMany({
      where: WHERE_USER_AKTIF,
      include: {
        company: { select: { nama: true } },
      },
    }),
  ]);

  // Statistik per perusahaan (khusus user aktif)
  const perPerusahaanMap = new Map<string, number>();
  activeUsers.forEach((u) => {
    const nama = u.company?.nama ?? "Belum ditempatkan";
    perPerusahaanMap.set(nama, (perPerusahaanMap.get(nama) ?? 0) + 1);
  });
  const perPerusahaan = Array.from(perPerusahaanMap, ([nama, jumlah]) => ({
    nama: nama.replace(/^PT\.?\s*/i, ""),
    jumlah,
  })).sort((a, b) => b.jumlah - a.jumlah);

  // Statistik per divisi (khusus user aktif)
  const perDivisiMap = new Map<string, number>();
  activeUsers.forEach((u) => {
    const nama = u.divisi?.trim() || "Tanpa divisi";
    perDivisiMap.set(nama, (perDivisiMap.get(nama) ?? 0) + 1);
  });
  const perDivisi = Array.from(perDivisiMap, ([nama, jumlah]) => ({
    nama,
    jumlah,
  })).sort((a, b) => b.jumlah - a.jumlah);

  return (
    <div>
      {/* Header halaman */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-sm">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Manajemen User
            </h1>
            <p className="text-sm text-slate-500">
              Total user aktif:{" "}
              <span className="font-semibold text-slate-700">
                {activeUsers.length}
              </span>
            </p>
          </div>
        </div>

        <FormUser companies={companies} branches={branches} />
      </div>

      {/* Filter Slicer, Search, & Tabel User */}
      <Suspense fallback={null}>
        <TabelUser users={users} companies={companies} branches={branches} />
      </Suspense>

      {/* Kartu Statistik dipindahkan ke bawah baris tabel */}
      <div className="mt-6">
        <StatistikUser perPerusahaan={perPerusahaan} perDivisi={perDivisi} />
      </div>
    </div>
  );
}
