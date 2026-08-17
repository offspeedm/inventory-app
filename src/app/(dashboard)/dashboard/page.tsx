import prisma from "@/lib/prisma";
import { Building2, Network, Users, MonitorSmartphone } from "lucide-react";

export default async function DashboardPage() {
  // Hitung jumlah tiap tabel secara paralel
  const [totalPerusahaan, totalCabang, totalUser, totalDevice] =
    await Promise.all([
      prisma.companies.count(),
      prisma.branches.count(),
      prisma.users.count(),
      prisma.devices.count(),
    ]);

  const kpi = [
    {
      label: "Perusahaan",
      value: totalPerusahaan,
      icon: Building2,
      color: "bg-blue-500",
    },
    {
      label: "Cabang",
      value: totalCabang,
      icon: Network,
      color: "bg-emerald-500",
    },
    { label: "User", value: totalUser, icon: Users, color: "bg-amber-500" },
    {
      label: "Devices",
      value: totalDevice,
      icon: MonitorSmartphone,
      color: "bg-indigo-500",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
      <p className="text-slate-500 mt-1 mb-6">
        Ringkasan data aset & aktivitas.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpi.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4"
            >
              <div
                className={`${item.color} w-12 h-12 rounded-lg flex items-center justify-center text-white`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">
                  {item.value}
                </p>
                <p className="text-sm text-slate-500">{item.label}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
