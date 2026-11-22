// src/app/(dashboard)/dashboard/page.tsx
import prisma from "@/lib/prisma";
import { KartuKpi } from "./kartu-kpi";
import { AktivitasTerbaru } from "./aktivitas-terbaru";
import { ChartPerusahaan } from "@/components/charts/chart-perusahaan";
import { ChartJenis } from "@/components/charts/chart-jenis";
import { ChartTiket } from "@/components/charts/chart-tiket";
import { WHERE_DEVICE_AKTIF, WHERE_USER_AKTIF } from "@/lib/status-filter";

export default async function DashboardPage() {
  const enamBulanLalu = new Date();
  enamBulanLalu.setMonth(enamBulanLalu.getMonth() - 5);
  enamBulanLalu.setDate(1);
  enamBulanLalu.setHours(0, 0, 0, 0);

  const [
    totalPerusahaan,
    totalCabang,
    totalUserAktif,
    totalDeviceAktif,
    tiketAktif,
    tiketKritis,
    companies,
    deviceTypes,
    deviceGroupCompany,
    deviceGroupType,
    tiket6Bulan,
    devicesTerbaru,
    tiketTerbaru,
  ] = await Promise.all([
    prisma.company.count(),
    prisma.branch.count(),
    prisma.user.count({ where: WHERE_USER_AKTIF }),
    prisma.device.count({ where: WHERE_DEVICE_AKTIF }),
    prisma.ticket.count({ where: { status: { not: "Selesai" } } }),
    prisma.ticket.count({
      where: {
        status: { not: "Selesai" },
        prioritas: "Pekerjaan berhenti",
      },
    }),
    prisma.company.findMany({
      select: { id: true, nama: true },
      orderBy: { nama: "asc" },
    }),
    prisma.deviceType.findMany({
      select: { id: true, nama: true },
      orderBy: { nama: "asc" },
    }),
    prisma.device.groupBy({
      by: ["companyId"],
      where: WHERE_DEVICE_AKTIF,
      _count: { _all: true },
    }),
    prisma.device.groupBy({
      by: ["typeId"],
      where: WHERE_DEVICE_AKTIF,
      _count: { _all: true },
    }),
    prisma.ticket.findMany({
      where: { tglLapor: { gte: enamBulanLalu } },
      select: { tglLapor: true },
    }),
    prisma.device.findMany({
      where: WHERE_DEVICE_AKTIF,
      take: 5,
      orderBy: { id: "desc" },
      include: {
        type: { select: { nama: true } },
        company: { select: { nama: true } },
        branch: { select: { nama: true } },
        user: { select: { nama: true } },
      },
    }),
    prisma.ticket.findMany({
      take: 5,
      orderBy: { tglLapor: "desc" },
      include: {
        device: { select: { nama: true, kodeInventaris: true } },
        user: { select: { nama: true } },
        userTerkendala: { select: { nama: true } },
      },
    }),
  ]);

  const kpi = [
    {
      label: "Perusahaan",
      value: totalPerusahaan,
      icon: "Building2",
      color: "from-blue-500 to-blue-600",
      href: "/perusahaan",
    },
    {
      label: "Cabang",
      value: totalCabang,
      icon: "Network",
      color: "from-violet-500 to-violet-600",
      href: "/cabang",
    },
    {
      label: "User Aktif",
      value: totalUserAktif,
      icon: "Users",
      color: "from-emerald-500 to-emerald-600",
      href: "/users",
    },
    {
      label: "Devices Aktif",
      value: totalDeviceAktif,
      icon: "MonitorSmartphone",
      color: "from-indigo-500 to-indigo-600",
      href: "/devices",
    },
    {
      label: "Tiket Aktif",
      value: tiketAktif,
      icon: "Wrench",
      color: "from-amber-500 to-amber-600",
      href: "/troubleshooting",
    },
    {
      label: "Tiket Kritis",
      value: tiketKritis,
      icon: "AlertTriangle",
      color: "from-rose-500 to-rose-600",
      href: "/troubleshooting",
    },
  ];

  const companyCountMap = new Map(
    deviceGroupCompany.map((g) => [g.companyId, g._count._all]),
  );
  const dataPerusahaan = companies.map((c) => ({
    nama: c.nama.replace(/^PT\.?\s*/i, ""),
    jumlah: companyCountMap.get(c.id) ?? 0,
  }));

  const typeCountMap = new Map(
    deviceGroupType.map((g) => [g.typeId, g._count._all]),
  );
  const dataJenis = deviceTypes
    .map((t) => ({
      nama: t.nama,
      jumlah: typeCountMap.get(t.id) ?? 0,
    }))
    .filter((d) => d.jumlah > 0);

  const bulanMap = new Map<string, number>();
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const key = d.toLocaleDateString("id-ID", {
      month: "short",
      year: "2-digit",
    });
    bulanMap.set(key, 0);
  }
  tiket6Bulan.forEach((t) => {
    const key = new Date(t.tglLapor).toLocaleDateString("id-ID", {
      month: "short",
      year: "2-digit",
    });
    if (bulanMap.has(key)) {
      bulanMap.set(key, (bulanMap.get(key) ?? 0) + 1);
    }
  });
  const dataTiket = Array.from(bulanMap, ([bulan, jumlah]) => ({
    bulan,
    jumlah,
  }));

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-800">Dashboard</h1>
      <KartuKpi items={kpi} />
      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <ChartPerusahaan data={dataPerusahaan} />
        <ChartJenis data={dataJenis} />
        <div className="lg:col-span-2">
          <ChartTiket data={dataTiket} />
        </div>
      </div>
      <AktivitasTerbaru
        devicesTerbaru={devicesTerbaru}
        tiketTerbaru={tiketTerbaru}
      />
    </div>
  );
}
