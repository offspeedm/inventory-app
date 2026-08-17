import prisma from "@/lib/prisma";
import { FormPerusahaan } from "./form-perusahaan";
import { KartuPerusahaan } from "./kartu-perusahaan";
import { Building2, Network, Users, MonitorSmartphone } from "lucide-react";

export default async function PerusahaanPage() {
  const companies = await prisma.company.findMany({
    orderBy: { id: "asc" },
    include: {
      _count: {
        select: { branches: true, users: true, devices: true },
      },
    },
  });

  // Ringkasan total (untuk kartu statistik atas)
  const totalPerusahaan = companies.length;
  const totalCabang = companies.reduce((s, c) => s + c._count.branches, 0);
  const totalUser = companies.reduce((s, c) => s + c._count.users, 0);
  const totalDevice = companies.reduce((s, c) => s + c._count.devices, 0);

  const stats = [
    { label: "Perusahaan", value: totalPerusahaan, icon: Building2, color: "from-blue-500 to-blue-600" },
    { label: "Total Cabang", value: totalCabang, icon: Network, color: "from-emerald-500 to-emerald-600" },
    { label: "Total User", value: totalUser, icon: Users, color: "from-amber-500 to-amber-600" },
    { label: "Total Device", value: totalDevice, icon: MonitorSmartphone, color: "from-indigo-500 to-indigo-600" },
  ];

  return (
    <div>
      {/* Header halaman */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Perusahaan</h1>
        <p className="text-slate-500 mt-1">
          Kelola data perusahaan beserta ringkasan cabang, user, dan perangkat.
        </p>
      </div>

      {/* Kartu statistik ringkas */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="relative overflow-hidden bg-white rounded-xl border border-slate-200 p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-slate-800">{s.value}</p>
                  <p className="text-sm text-slate-500 mt-1">{s.label}</p>
                </div>
                <div
                  className={`bg-gradient-to-br ${s.color} w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-sm`}
                >
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Form tambah perusahaan */}
      <FormPerusahaan />

      {/* Daftar perusahaan dalam bentuk kartu */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {companies.map((c, i) => (
          <KartuPerusahaan
            key={c.id}
            perusahaan={{
              id: c.id,
              nama: c.nama,
              inisial: c.inisial,
              alamat: c.alamat,
              noTelp: c.noTelp,
              cabang: c._count.branches,
              user: c._count.users,
              device: c._count.devices,
            }}
            index={i}
          />
        ))}
      </div>

      {companies.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <Building2 className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p>Belum ada perusahaan. Tambahkan lewat form di atas.</p>
        </div>
      )}
    </div>
  );
}
