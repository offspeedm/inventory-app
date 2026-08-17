import prisma from "@/lib/prisma";
import { Laptop, Users, Building2, Wrench } from "lucide-react";

export default async function DashboardPage() {
  // Hitung data nyata dari database (berjalan paralel agar cepat)
  const [totalDevices, totalUsers, totalBranches, tiketAktif] =
    await Promise.all([
      prisma.device.count(),
      prisma.user.count(),
      prisma.branch.count(),
      prisma.ticket.count({ where: { status: { not: "Selesai" } } }),
    ]);

  const stats = [
    {
      title: "Total Devices",
      value: totalDevices,
      icon: Laptop,
      accent: "bg-blue-500",
    },
    {
      title: "Total User",
      value: totalUsers,
      icon: Users,
      accent: "bg-green-500",
    },
    {
      title: "Total Cabang",
      value: totalBranches,
      icon: Building2,
      accent: "bg-purple-500",
    },
    {
      title: "Tiket Aktif",
      value: tiketAktif,
      icon: Wrench,
      accent: "bg-orange-500",
    },
  ];

  // Ambil 5 perangkat terbaru
  const perangkatTerbaru = await prisma.device.findMany({
    take: 5,
    orderBy: { id: "desc" },
    include: {
      type: { select: { nama: true } },
      company: { select: { nama: true } },
    },
  });

  return (
    <div>
      {/* Judul */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 mt-1">
          Ringkasan data inventaris dan perangkat.
        </p>
      </div>

      {/* Kartu Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-slate-800 mt-2">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={
                    "flex items-center justify-center h-12 w-12 rounded-lg text-white " +
                    stat.accent
                  }
                >
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Perangkat Terbaru */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 mb-3">
            Perangkat Terbaru
          </h2>
          {perangkatTerbaru.length === 0 ? (
            <p className="text-slate-400 text-sm">
              Belum ada perangkat. Tambahkan di menu Devices.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {perangkatTerbaru.map((d) => (
                <li
                  key={d.id}
                  className="py-2 flex items-center justify-between text-sm"
                >
                  <span className="font-medium text-slate-700">{d.nama}</span>
                  <span className="text-slate-400">
                    {d.type?.nama ?? "-"}
                    {d.company?.nama ? " · " + d.company.nama : ""}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 mb-3">
            Tiket Terakhir
          </h2>
          <p className="text-slate-400 text-sm">
            Daftar tiket troubleshooting akan tampil di sini setelah menu
            Troubleshooting dibuat.
          </p>
        </div>
      </div>
    </div>
  );
}
