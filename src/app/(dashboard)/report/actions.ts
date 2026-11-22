// src/app/(dashboard)/report/actions.ts
"use server";

import prisma from "@/lib/prisma";
import { WHERE_DEVICE_AKTIF } from "@/lib/status-filter";

export type RingkasanDevice = {
  totalPerangkatBaru: number;
  totalNilaiPembelian: number;
  totalAktif: number;
  totalBermasalah: number;
};

export type RingkasanTiket = {
  totalTiket: number;
  totalSelesai: number;
  totalAktif: number;
  totalKritis: number;
};

export type TrenBulanan = {
  bulan: string;
  tahun: number;
  bulanIndex: number;
  periodeIni: number;
  periodeSebelumnya: number | null;
};

export type Breakdown = { nama: string; jumlah: number };

export type DeviceBaruItem = {
  id: number;
  nama: string;
  kodeInventaris: string | null;
  merk: string | null;
  tipe: string | null;
  serialNumber: string | null;
  jenis: string;
  perusahaan: string;
  cabang: string;
  pengguna: string;
  status: string;
  tglBeli: Date | null;
  hargaBeli: number | null;
};

export type LaporanDevice = {
  ringkasan: RingkasanDevice;
  ringkasanSebelumnya: RingkasanDevice | null;
  trenBulanan: TrenBulanan[];
  perJenis: Breakdown[];
  perPerusahaan: Breakdown[];
  perStatus: Breakdown[];
  devicesPeriodeIni: DeviceBaruItem[];
  devicesSebelumnya: DeviceBaruItem[];
};

export type LaporanTiket = {
  ringkasan: RingkasanTiket;
  ringkasanSebelumnya: RingkasanTiket | null;
  trenBulanan: TrenBulanan[];
  perKategori: Breakdown[];
  perUrgency: Breakdown[];
  perStatus: Breakdown[];
};

// ===== Tabel detail Device (bisa di-sort, difilter, & diekspor) =====
export type DetailDeviceRow = {
  id: number;
  nama: string;
  kodeInventaris: string | null;
  jenis: string;
  perusahaan: string;
  cabang: string;
  pengguna: string;
  status: string;
  tglBeli: Date | null;
  jumlahPerubahanUser: number;
  jumlahPerubahanPerusahaan: number;
  jumlahPerubahanCabang: number;
};

export type JenisPerubahan = "User" | "Perusahaan" | "Cabang";

export type RiwayatPerubahanRow = {
  deviceId: number;
  deviceNama: string;
  kodeInventaris: string | null;
  jenisPerubahan: JenisPerubahan;
  dari: string;
  ke: string;
  tanggal: Date;
};

export type OpsiFilter = {
  companies: { id: number; nama: string }[];
  branches: { id: number; nama: string; companyId: number | null }[];
};

const NAMA_BULAN = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
];

function normalisasiRentang(startDate: string, endDate: string): { start: Date; end: Date } {
  let start = new Date(startDate);
  let end = new Date(endDate);
  if (Number.isNaN(start.getTime())) start = new Date();
  if (Number.isNaN(end.getTime())) end = new Date();
  if (start > end) {
    const tmp = start;
    start = end;
    end = tmp;
  }
  end = new Date(end);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

function periodeSetahunSebelumnya(start: Date, end: Date): { start: Date; end: Date } {
  const s = new Date(start);
  s.setFullYear(s.getFullYear() - 1);
  const e = new Date(end);
  e.setFullYear(e.getFullYear() - 1);
  e.setHours(23, 59, 59, 999);
  return { start: s, end: e };
}

function labelBulanUrut(
  start: Date,
  end: Date
): { label: string; tahun: number; bulan: number }[] {
  const hasil: { label: string; tahun: number; bulan: number }[] = [];
  const cursor = new Date(start.getFullYear(), start.getMonth(), 1);
  const batas = new Date(end.getFullYear(), end.getMonth(), 1);

  while (cursor <= batas) {
    const tahun = cursor.getFullYear();
    const bulan = cursor.getMonth();
    hasil.push({ label: `${NAMA_BULAN[bulan]} ${String(tahun).slice(-2)}`, tahun, bulan });
    cursor.setMonth(cursor.getMonth() + 1);
  }

  return hasil;
}

function kelompokkan<T>(items: T[], keyFn: (item: T) => string): Breakdown[] {
  const map = new Map<string, number>();
  for (const item of items) {
    const key = keyFn(item);
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([nama, jumlah]) => ({ nama, jumlah }))
    .sort((a, b) => b.jumlah - a.jumlah);
}

function hitungRingkasanDevice<T extends { hargaBeli: unknown; status: string }>(
  devices: T[]
): RingkasanDevice {
  const totalPerangkatBaru = devices.length;
  const totalNilaiPembelian = devices.reduce(
    (sum, d) => sum + (d.hargaBeli ? Number(d.hargaBeli) : 0),
    0
  );
  const totalAktif = devices.filter((d) => d.status === "Aktif").length;
  const totalBermasalah = devices.filter(
    (d) => d.status === "Rusak" || d.status === "Perbaikan"
  ).length;
  return { totalPerangkatBaru, totalNilaiPembelian, totalAktif, totalBermasalah };
}

function hitungRingkasanTiket<T extends { status: string; prioritas: string }>(
  tikets: T[]
): RingkasanTiket {
  const totalTiket = tikets.length;
  const totalSelesai = tikets.filter((t) => t.status === "Selesai").length;
  const totalAktif = totalTiket - totalSelesai;
  const totalKritis = tikets.filter((t) => t.prioritas === "Pekerjaan berhenti").length;
  return { totalTiket, totalSelesai, totalAktif, totalKritis };
}

function toNullableInt(value: number | null | undefined): number | null {
  return value && value > 0 ? value : null;
}

const SELECT_DEVICE_LAPORAN = {
  id: true,
  nama: true,
  kodeInventaris: true,
  merk: true,
  tipe: true,
  serialNumber: true,
  hargaBeli: true,
  status: true,
  tglBeli: true,
  type: { select: { nama: true } },
  company: { select: { nama: true } },
  branch: { select: { nama: true } },
  user: { select: { nama: true } },
} as const;

function mapDeviceBaruItem(d: {
  id: number;
  nama: string;
  kodeInventaris: string | null;
  merk: string | null;
  tipe: string | null;
  serialNumber: string | null;
  hargaBeli: unknown;
  status: string;
  tglBeli: Date | null;
  type: { nama: string } | null;
  company: { nama: string } | null;
  branch: { nama: string } | null;
  user: { nama: string } | null;
}): DeviceBaruItem {
  return {
    id: d.id,
    nama: d.nama,
    kodeInventaris: d.kodeInventaris,
    merk: d.merk,
    tipe: d.tipe,
    serialNumber: d.serialNumber,
    jenis: d.type?.nama ?? "Tanpa Jenis",
    perusahaan: d.company?.nama ?? "Belum Ditempatkan",
    cabang: d.branch?.nama ?? "-",
    pengguna: d.user?.nama ?? "-",
    status: d.status,
    tglBeli: d.tglBeli,
    hargaBeli: d.hargaBeli ? Number(d.hargaBeli) : null,
  };
}

/** Daftar Perusahaan & Cabang untuk mengisi dropdown filter di halaman. */
export async function getOpsiFilter(): Promise<OpsiFilter> {
  const [companies, branches] = await Promise.all([
    prisma.company.findMany({ select: { id: true, nama: true }, orderBy: { nama: "asc" } }),
    prisma.branch.findMany({
      select: { id: true, nama: true, companyId: true },
      orderBy: { nama: "asc" },
    }),
  ]);
  return { companies, branches };
}

/**
 * Mengambil data laporan Devices untuk satu rentang tanggal (berdasarkan
 * Tanggal Beli), mengecualikan perangkat non-aktif, dengan filter opsional
 * Perusahaan/Cabang, lengkap dengan tren bulanan, breakdown, daftar perangkat
 * baru, dan data pembanding.
 */
export async function getLaporanDevices(
  startDate: string,
  endDate: string,
  bandingkan: boolean,
  companyId?: number | null,
  branchId?: number | null
): Promise<LaporanDevice> {
  const { start, end } = normalisasiRentang(startDate, endDate);
  const cId = toNullableInt(companyId);
  const bId = toNullableInt(branchId);
  const filterLokasi = {
    ...(cId ? { companyId: cId } : {}),
    ...(bId ? { branchId: bId } : {}),
  };

  const devicesPeriodeIniRaw = await prisma.device.findMany({
    where: {
      ...WHERE_DEVICE_AKTIF,
      tglBeli: { gte: start, lte: end },
      ...filterLokasi,
    },
    select: SELECT_DEVICE_LAPORAN,
    orderBy: [{ tglBeli: "desc" }, { nama: "asc" }],
  });

  const ringkasan = hitungRingkasanDevice(devicesPeriodeIniRaw);

  let ringkasanSebelumnya: RingkasanDevice | null = null;
  let devicesSebelumnyaRaw: typeof devicesPeriodeIniRaw = [];

  if (bandingkan) {
    const periodeLalu = periodeSetahunSebelumnya(start, end);
    devicesSebelumnyaRaw = await prisma.device.findMany({
      where: {
        ...WHERE_DEVICE_AKTIF,
        tglBeli: { gte: periodeLalu.start, lte: periodeLalu.end },
        ...filterLokasi,
      },
      select: SELECT_DEVICE_LAPORAN,
      orderBy: [{ tglBeli: "desc" }, { nama: "asc" }],
    });
    ringkasanSebelumnya = hitungRingkasanDevice(devicesSebelumnyaRaw);
  }

  const bulanList = labelBulanUrut(start, end);
  const trenBulanan: TrenBulanan[] = bulanList.map(({ label, tahun, bulan }) => {
    const periodeIni = devicesPeriodeIniRaw.filter((d) => {
      if (!d.tglBeli) return false;
      const t = new Date(d.tglBeli);
      return t.getFullYear() === tahun && t.getMonth() === bulan;
    }).length;

    const periodeSebelumnya = bandingkan
      ? devicesSebelumnyaRaw.filter((d) => {
          if (!d.tglBeli) return false;
          const t = new Date(d.tglBeli);
          return t.getFullYear() === tahun - 1 && t.getMonth() === bulan;
        }).length
      : null;

    return {
      bulan: label,
      tahun,
      bulanIndex: bulan,
      periodeIni,
      periodeSebelumnya,
    };
  });

  const perJenis = kelompokkan(devicesPeriodeIniRaw, (d) => d.type?.nama ?? "Tanpa Jenis");
  const perPerusahaan = kelompokkan(
    devicesPeriodeIniRaw,
    (d) => d.company?.nama ?? "Belum Ditempatkan"
  );
  const perStatus = kelompokkan(devicesPeriodeIniRaw, (d) => d.status);

  return {
    ringkasan,
    ringkasanSebelumnya,
    trenBulanan,
    perJenis,
    perPerusahaan,
    perStatus,
    devicesPeriodeIni: devicesPeriodeIniRaw.map(mapDeviceBaruItem),
    devicesSebelumnya: devicesSebelumnyaRaw.map(mapDeviceBaruItem),
  };
}

/**
 * Mengambil data laporan Troubleshooting untuk satu rentang tanggal
 * (berdasarkan Tanggal Lapor), dengan filter opsional Perusahaan/Cabang.
 */
export async function getLaporanTiket(
  startDate: string,
  endDate: string,
  bandingkan: boolean,
  companyId?: number | null,
  branchId?: number | null
): Promise<LaporanTiket> {
  const { start, end } = normalisasiRentang(startDate, endDate);
  const cId = toNullableInt(companyId);
  const bId = toNullableInt(branchId);
  const filterLokasi = {
    ...(cId ? { companyId: cId } : {}),
    ...(bId ? { branchId: bId } : {}),
  };

  const tiketPeriodeIni = await prisma.ticket.findMany({
    where: { tglLapor: { gte: start, lte: end }, ...filterLokasi },
    select: { status: true, prioritas: true, kategori: true, tglLapor: true },
  });

  const ringkasan = hitungRingkasanTiket(tiketPeriodeIni);

  let ringkasanSebelumnya: RingkasanTiket | null = null;
  let tiketSebelumnya: typeof tiketPeriodeIni = [];

  if (bandingkan) {
    const periodeLalu = periodeSetahunSebelumnya(start, end);
    tiketSebelumnya = await prisma.ticket.findMany({
      where: { tglLapor: { gte: periodeLalu.start, lte: periodeLalu.end }, ...filterLokasi },
      select: { status: true, prioritas: true, kategori: true, tglLapor: true },
    });
    ringkasanSebelumnya = hitungRingkasanTiket(tiketSebelumnya);
  }

  const bulanList = labelBulanUrut(start, end);
  const trenBulanan: TrenBulanan[] = bulanList.map(({ label, tahun, bulan }) => {
    const periodeIni = tiketPeriodeIni.filter((t) => {
      const d = new Date(t.tglLapor);
      return d.getFullYear() === tahun && d.getMonth() === bulan;
    }).length;

    const periodeSebelumnya = bandingkan
      ? tiketSebelumnya.filter((t) => {
          const d = new Date(t.tglLapor);
          return d.getFullYear() === tahun - 1 && d.getMonth() === bulan;
        }).length
      : null;

    return {
      bulan: label,
      tahun,
      bulanIndex: bulan,
      periodeIni,
      periodeSebelumnya,
    };
  });

  const perKategori = kelompokkan(tiketPeriodeIni, (t) => t.kategori ?? "Tanpa Kategori");
  const perUrgency = kelompokkan(tiketPeriodeIni, (t) => t.prioritas);
  const perStatus = kelompokkan(tiketPeriodeIni, (t) => t.status);

  return { ringkasan, ringkasanSebelumnya, trenBulanan, perKategori, perUrgency, perStatus };
}

async function idPerangkatSesuaiFilter(
  companyId: number | null,
  branchId: number | null
): Promise<Set<number> | null> {
  if (!companyId && !branchId) return null;
  const devices = await prisma.device.findMany({
    where: {
      ...WHERE_DEVICE_AKTIF,
      ...(companyId ? { companyId } : {}),
      ...(branchId ? { branchId } : {}),
    },
    select: { id: true },
  });
  return new Set(devices.map((d) => d.id));
}

async function ambilRiwayatMentah(start: Date, end: Date): Promise<RiwayatPerubahanRow[]> {
  const [assignments, placements] = await Promise.all([
    prisma.deviceAssignment.findMany({
      where: {
        tglMulai: { gte: start, lte: end },
        device: WHERE_DEVICE_AKTIF,
      },
      include: {
        device: { select: { nama: true, kodeInventaris: true } },
        user: { select: { nama: true } },
      },
      orderBy: { tglMulai: "asc" },
    }),
    prisma.devicePlacement.findMany({
      where: {
        tglMulai: { gte: start, lte: end },
        device: WHERE_DEVICE_AKTIF,
      },
      include: {
        device: { select: { nama: true, kodeInventaris: true } },
        company: { select: { nama: true } },
        branch: { select: { nama: true } },
      },
      orderBy: { tglMulai: "asc" },
    }),
  ]);

  const hasil: RiwayatPerubahanRow[] = [];

  for (const a of assignments) {
    if (!a.tglMulai) continue;

    const sebelumnya = await prisma.deviceAssignment.findFirst({
      where: { deviceId: a.deviceId, tglMulai: { lt: a.tglMulai } },
      include: { user: { select: { nama: true } } },
      orderBy: { tglMulai: "desc" },
    });

    hasil.push({
      deviceId: a.deviceId,
      deviceNama: a.device.nama,
      kodeInventaris: a.device.kodeInventaris,
      jenisPerubahan: "User",
      dari: sebelumnya?.user?.nama ?? "Belum ada",
      ke: a.user?.nama ?? "-",
      tanggal: a.tglMulai,
    });
  }

  for (const p of placements) {
    if (!p.tglMulai) continue;

    const sebelumnya = await prisma.devicePlacement.findFirst({
      where: { deviceId: p.deviceId, tglMulai: { lt: p.tglMulai } },
      include: {
        company: { select: { nama: true } },
        branch: { select: { nama: true } },
      },
      orderBy: { tglMulai: "desc" },
    });

    const perusahaanBerubah = !sebelumnya || sebelumnya.companyId !== p.companyId;
    const jenisPerubahan: JenisPerubahan = perusahaanBerubah ? "Perusahaan" : "Cabang";

    const keText = [p.company?.nama, p.branch?.nama].filter(Boolean).join(" - ") || "-";
    const dariText = sebelumnya
      ? [sebelumnya.company?.nama, sebelumnya.branch?.nama].filter(Boolean).join(" - ") ||
        "Belum ada"
      : "Belum ada";

    hasil.push({
      deviceId: p.deviceId,
      deviceNama: p.device.nama,
      kodeInventaris: p.device.kodeInventaris,
      jenisPerubahan,
      dari: dariText,
      ke: keText,
      tanggal: p.tglMulai,
    });
  }

  hasil.sort((x, y) => y.tanggal.getTime() - x.tanggal.getTime());
  return hasil;
}

export async function getDetailDevices(
  startDate: string,
  endDate: string,
  companyId?: number | null,
  branchId?: number | null
): Promise<DetailDeviceRow[]> {
  const { start, end } = normalisasiRentang(startDate, endDate);
  const cId = toNullableInt(companyId);
  const bId = toNullableInt(branchId);

  const devices = await prisma.device.findMany({
    where: {
      ...WHERE_DEVICE_AKTIF,
      ...(cId ? { companyId: cId } : {}),
      ...(bId ? { branchId: bId } : {}),
    },
    include: {
      type: { select: { nama: true } },
      company: { select: { nama: true } },
      branch: { select: { nama: true } },
      user: { select: { nama: true } },
    },
    orderBy: { nama: "asc" },
  });

  const riwayat = await ambilRiwayatMentah(start, end);

  const countMap = new Map<number, { user: number; perusahaan: number; cabang: number }>();
  for (const r of riwayat) {
    const c = countMap.get(r.deviceId) ?? { user: 0, perusahaan: 0, cabang: 0 };
    if (r.jenisPerubahan === "User") c.user++;
    else if (r.jenisPerubahan === "Perusahaan") c.perusahaan++;
    else c.cabang++;
    countMap.set(r.deviceId, c);
  }

  return devices.map((d) => {
    const c = countMap.get(d.id) ?? { user: 0, perusahaan: 0, cabang: 0 };
    return {
      id: d.id,
      nama: d.nama,
      kodeInventaris: d.kodeInventaris,
      jenis: d.type?.nama ?? "-",
      perusahaan: d.company?.nama ?? "-",
      cabang: d.branch?.nama ?? "-",
      pengguna: d.user?.nama ?? "-",
      status: d.status,
      tglBeli: d.tglBeli,
      jumlahPerubahanUser: c.user,
      jumlahPerubahanPerusahaan: c.perusahaan,
      jumlahPerubahanCabang: c.cabang,
    };
  });
}

export async function getRiwayatPerubahan(
  startDate: string,
  endDate: string,
  companyId?: number | null,
  branchId?: number | null
): Promise<RiwayatPerubahanRow[]> {
  const { start, end } = normalisasiRentang(startDate, endDate);
  const cId = toNullableInt(companyId);
  const bId = toNullableInt(branchId);

  let rows = await ambilRiwayatMentah(start, end);

  const idSet = await idPerangkatSesuaiFilter(cId, bId);
  if (idSet) rows = rows.filter((r) => idSet.has(r.deviceId));

  return rows;
}