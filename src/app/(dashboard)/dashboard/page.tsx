import { Laptop, Users, Building2, Wrench } from "lucide-react";

type Stat = {
  title: string;
  value: string;
  icon: typeof Laptop;
  accent: string;
};

const stats: Stat[] = [
  { title: "Total Devices", value: "128", icon: Laptop, accent: "bg-blue-500" },
  { title: "Total User", value: "54", icon: Users, accent: "bg-green-500" },
  {
    title: "Total Cabang",
    value: "12",
    icon: Building2,
    accent: "bg-purple-500",
  },
  {
    title: "Tiket Troubleshooting",
    value: "7",
    icon: Wrench,
    accent: "bg-orange-500",
  },
];

export default function DashboardPage() {
  return (
    <div className="p-6">
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

      {/* Placeholder area bawah */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 mb-2">
            Perangkat Terbaru
          </h2>
          <p className="text-slate-500 text-sm">
            Daftar perangkat akan tampil di sini setelah database terhubung.
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 mb-2">
            Tiket Terakhir
          </h2>
          <p className="text-slate-500 text-sm">
            Daftar tiket troubleshooting akan tampil di sini nanti.
          </p>
        </div>
      </div>
    </div>
  );
}
