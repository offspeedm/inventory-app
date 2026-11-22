// src/app/(dashboard)/dashboard/page.tsx
import Link from "next/link";
import prisma from "@/lib/prisma";
import { LayoutDashboard, MonitorSmartphone, Wrench } from "lucide-react";
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
    totalDeviceAvailable,
    tiketAktif,
    tiketKritis,
    companies,
    deviceTypes,
    deviceGroupCompany,
    deviceGroupType,
    tiket6Bulan,
    devicesTerbaruRaw,
    tiketTerbaruRaw,
  ] = await Promise.all([
    prisma.company.count(),
    prisma.branch.count(),
    prisma.user.count({ where: WHERE_USER_AKTIF }),
    prisma.device.count({ where: WHERE_DEVICE_AKTIF }),
    prisma.device.count({
      where: { status: { equals: "Available", mode: "insensitive" } },
    }),
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
      icon: "Building2" as const,
      color: "from-blue-500 to-blue-600",
      href: "/perusahaan",
    },
    {
      label: "Cabang",
      value: totalCabang,
      icon: "Network" as const,
      color: "from-violet-500 to-violet-600",
      href: "/cabang",
    },
    {
      label: "User Aktif",
      value: totalUserAktif,
      icon: "Users" as const,
      color: "from-emerald-500 to-emerald-600",
      href: "/users",
    },
    {
      label: "Devices Aktif",
      value: totalDeviceAktif,
      icon: "MonitorSmartphone" as const,
      color: "from-indigo-500 to-indigo-600",
      href: "/devices",
      sub:
        totalDeviceAvailable > 0
          ? `${totalDeviceAvailable} available`
          : undefined,
      subTone: "sky" as const,
    },
    {
      label: "Tiket Aktif",
      value: tiketAktif,
      icon: "Wrench" as const,
      color: "from-amber-500 to-amber-600",
      href: "/troubleshooting",
    },
    {
      label: "Tiket Kritis",
      value: tiketKritis,
      icon: "AlertTriangle" as const,
      color: "from-rose-500 to-rose-600",
      href: "/troubleshooting",
      sub: tiketKritis > 0 ? "Pekerjaan berhenti" : undefined,
      subTone: "rose" as const,
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
    .filter((d) => d.jumlah > 0)
    .sort((a, b) => b.jumlah - a.jumlah);

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

  const devicesTerbaru = devicesTerbaruRaw.map((d) => ({
    id: d.id,
    nama: d.nama,
    kodeInventaris: d.kodeInventaris,
    status: d.status,
    typeNama: d.type?.nama ?? null,
    companyNama: d.company?.nama ?? null,
    branchNama: d.branch?.nama ?? null,
    userNama: d.user?.nama ?? null,
  }));

  const tiketTerbaru = tiketTerbaruRaw.map((t) => ({
    id: t.id,
    noTiket: t.noTiket,
    judul: t.judul,
    status: t.status,
    prioritas: t.prioritas,
    tglLapor: t.tglLapor,
    deviceNama: t.device?.nama ?? null,
    pelaporNama: t.userTerkendala?.nama ?? t.user?.nama ?? null,
  }));

  return (
    <div className="space-y-6">
      {/* Header Halaman */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-sm">
            <LayoutDashboard className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
            <p className="text-sm text-slate-500">
              Ringkasan aset IT, distribusi perangkat, dan tiket troubleshooting
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/devices"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-xs transition-colors hover:border-indigo-200 hover:bg-indigo-50/50 hover:text-indigo-600"
          >
            <MonitorSmartphone className="h-4 w-4 text-indigo-500" />
            Kelola Perangkat
          </Link>
          <Link
            href="/troubleshooting"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-medium text-white shadow-xs transition-colors hover:bg-indigo-700"
          >
            <Wrench className="h-4 w-4" />
            Troubleshooting
          </Link>
        </div>
      </div>

      {/* Kartu KPI */}
      <KartuKpi items={kpi} />

      {/* Grafik Ringkasan */}
      <div className="grid items-stretch gap-6 lg:grid-cols-2">
        <ChartPerusahaan data={dataPerusahaan} />
        <ChartJenis data={dataJenis} />
        <div className="lg:col-span-2">
          <ChartTiket data={dataTiket} />
        </div>
      </div>

      {/* Aktivitas Terbaru */}
      <AktivitasTerbaru
        devicesTerbaru={devicesTerbaru}
        tiketTerbaru={tiketTerbaru}
      />
    </div>
  );
}
