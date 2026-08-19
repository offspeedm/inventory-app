import prisma from "@/lib/prisma";
import { KartuKpi } from "./kartu-kpi";
import { AktivitasTerbaru } from "./aktivitas-terbaru";
import { ChartPerusahaan } from "@/components/charts/chart-perusahaan";
import { ChartJenis } from "@/components/charts/chart-jenis";
import { ChartTiket } from "@/components/charts/chart-tiket";

export default async function DashboardPage() {
  // ===== 1. Angka ringkas (KPI) =====
  const [
    totalPerusahaan,
    totalCabang,
    totalUser,
    totalDevice,
    tiketAktif,
    tiketKritis,
  ] = await Promise.all([
    prisma.company.count(),
    prisma.branch.count(),
    prisma.user.count(),
    prisma.device.count(),
    prisma.ticket.count({ where: { status: { not: "Selesai" } } }),
    prisma.ticket.count({
      where: { status: { not: "Selesai" }, prioritas: "Pekerjaan berhenti" },
    }),
  ]);

  const kpi = [
    { label: "Perusahaan", value: totalPerusahaan, icon: "Building2" as const, color: "from-blue-500 to-blue-600" },
    { label: "Cabang", value: totalCabang, icon: "Network" as const, color: "from-emerald-500 to-emerald-600" },
    { label: "User", value: totalUser, icon: "Users" as const, color: "from-amber-500 to-amber-600" },
    { label: "Devices", value: totalDevice, icon: "MonitorSmartphone" as const, color: "from-indigo-500 to-indigo-600" },
    { label: "Tiket Aktif", value: tiketAktif, icon: "Wrench" as const, color: "from-rose-500 to-rose-600" },
    {
      label: "Tiket Kritis",
      value: tiketKritis,
      icon: "AlertTriangle" as const,
      color: "from-red-600 to-red-700",
      sub: tiketKritis > 0 ? "Pekerjaan berhenti!" : undefined,
    },
  ];

  // ===== 2. Grafik BATANG: perangkat per perusahaan =====
  const companies = await prisma.company.findMany({
    select: { nama: true, _count: { select: { devices: true } } },
    orderBy: { id: "asc" },
  });
  const dataPerusahaan = companies.map((c) => ({
    nama: c.nama.replace(/^PT\.?\s*/i, ""),
    jumlah: c._count.devices,
  }));

  // ===== 3. Grafik PIE: perangkat per jenis =====
  const deviceTypes = await prisma.deviceType.findMany({
    select: { nama: true, _count: { select: { devices: true } } },
    orderBy: { id: "asc" },
  });
  const dataJenis = deviceTypes
    .map((t) => ({ nama: t.nama, jumlah: t._count.devices }))
    .filter((t) => t.jumlah > 0);

  // ===== 4. Grafik GARIS: tiket per bulan (6 bulan terakhir) =====
  const tickets = await prisma.ticket.findMany({ select: { tglLapor: true } });
  const namaBulan = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  const sekarang = new Date();
  const dataTiket: { bulan: string; jumlah: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(sekarang.getFullYear(), sekarang.getMonth() - i, 1);
    const jumlah = tickets.filter((t) => {
      const td = new Date(t.tglLapor);
      return td.getFullYear() === d.getFullYear() && td.getMonth() === d.getMonth();
    }).length;
    dataTiket.push({ bulan: namaBulan[d.getMonth()], jumlah });
  }

  // ===== 5. Aktivitas terbaru =====
  const devicesTerbaruRaw = await prisma.device.findMany({
    take: 5,
    orderBy: { id: "desc" },
    include: { company: { select: { nama: true } } },
  });
  const devicesTerbaru = devicesTerbaruRaw.map((d) => ({
    id: d.id,
    nama: d.nama,
    kodeInventaris: d.kodeInventaris,
    companyNama: d.company?.nama ?? null,
  }));

  const tiketTerbaru = await prisma.ticket.findMany({
    take: 5,
    orderBy: { id: "desc" },
    select: { id: true, noTiket: true, judul: true, status: true, prioritas: true },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 mt-1">Ringkasan data aset & aktivitas terkini.</p>
      </div>

      {/* KPI */}
      <div className="mb-6">
        <KartuKpi items={kpi} />
      </div>

      {/* Grafik */}
      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        <ChartPerusahaan data={dataPerusahaan} />
        <ChartJenis data={dataJenis} />
        <div className="lg:col-span-2">
          <ChartTiket data={dataTiket} />
        </div>
      </div>

      {/* Aktivitas terbaru */}
      <AktivitasTerbaru devicesTerbaru={devicesTerbaru} tiketTerbaru={tiketTerbaru} />
    </div>
  );
}
