import prisma from "@/lib/prisma";
import { Building2, Network, Users, MonitorSmartphone } from "lucide-react";
import { ChartPerusahaan } from "@/components/charts/chart-perusahaan";
import { ChartJenis } from "@/components/charts/chart-jenis";
import { ChartTiket } from "@/components/charts/chart-tiket";

export default async function DashboardPage() {
  // ===== 1. Angka ringkas (KPI) =====
  const [totalPerusahaan, totalCabang, totalUser, totalDevice] =
    await Promise.all([
      prisma.company.count(),
      prisma.branch.count(),
      prisma.user.count(),
      prisma.device.count(),
    ]);

  const kpi = [
    { label: "Perusahaan", value: totalPerusahaan, icon: Building2, color: "bg-blue-500" },
    { label: "Cabang", value: totalCabang, icon: Network, color: "bg-emerald-500" },
    { label: "User", value: totalUser, icon: Users, color: "bg-amber-500" },
    { label: "Devices", value: totalDevice, icon: MonitorSmartphone, color: "bg-indigo-500" },
  ];

  // ===== 2. Data grafik BATANG: perangkat per perusahaan =====
  const companies = await prisma.company.findMany({
    select: { nama: true, _count: { select: { devices: true } } },
    orderBy: { id: "asc" },
  });
  const dataPerusahaan = companies.map((c) => ({
    nama: c.nama.replace(/^PT\.?\s*/i, ""), // ringkas: buang "PT."
    jumlah: c._count.devices,
  }));

  // ===== 3. Data grafik PIE: perangkat per jenis =====
  const deviceTypes = await prisma.deviceType.findMany({
    select: { nama: true, _count: { select: { devices: true } } },
    orderBy: { id: "asc" },
  });
  const dataJenis = deviceTypes
    .map((t) => ({ nama: t.nama, jumlah: t._count.devices }))
    .filter((t) => t.jumlah > 0); // tampilkan hanya jenis yang ada perangkatnya

  // ===== 4. Data grafik GARIS: tiket per bulan (6 bulan terakhir) =====
  const tickets = await prisma.ticket.findMany({
    select: { tglLapor: true },
  });
  const namaBulan = [
    "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
    "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
  ];
  const sekarang = new Date();
  const dataTiket: { bulan: string; jumlah: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(sekarang.getFullYear(), sekarang.getMonth() - i, 1);
    const jumlah = tickets.filter((t) => {
      if (!t.tglLapor) return false;
      const td = new Date(t.tglLapor);
      return (
        td.getFullYear() === d.getFullYear() && td.getMonth() === d.getMonth()
      );
    }).length;
    dataTiket.push({ bulan: namaBulan[d.getMonth()], jumlah });
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
      <p className="text-slate-500 mt-1 mb-6">Ringkasan data aset & aktivitas.</p>

      {/* Kartu KPI */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {kpi.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4"
            >
              <div className={`${item.color} w-12 h-12 rounded-lg flex items-center justify-center text-white`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{item.value}</p>
                <p className="text-sm text-slate-500">{item.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Grafik */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartPerusahaan data={dataPerusahaan} />
        <ChartJenis data={dataJenis} />
        <div className="lg:col-span-2">
          <ChartTiket data={dataTiket} />
        </div>
      </div>
    </div>
  );
}
