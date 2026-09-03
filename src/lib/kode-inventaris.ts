import prisma from "@/lib/prisma";

/**
 * Membuat kode inventaris otomatis dengan format:
 *   {JENIS}/{PERUSAHAAN}-{BULANTAHUN}-{NO-URUT}
 * Contoh: NTB/SAI-0826-001
 *
 * - JENIS       : 3 huruf kode jenis perangkat, diambil dari DeviceType.kode
 *                 (mis. Notebook -> "NTB"). Bila kolom kode belum diisi,
 *                 diturunkan otomatis dari 3 huruf pertama nama jenis.
 * - PERUSAHAAN  : 3 huruf kode perusahaan, diambil dari Company.inisial
 *                 (mis. PT. Sarana Allport Cargo Services -> "SAI"). Bila
 *                 kolom inisial belum diisi, diturunkan otomatis dari 3
 *                 huruf pertama nama perusahaan.
 * - BULANTAHUN  : format BBTT (bulan 2 digit + tahun 2 digit), mis.
 *                 Agustus 2026 -> "0826".
 * - NO-URUT     : 3 digit nomor urut, dihitung ulang mulai dari 001 untuk
 *                 setiap kombinasi Jenis + Perusahaan + Bulan + Tahun yang
 *                 berbeda (persis seperti perilaku sebelumnya, hanya kini
 *                 turut memperhitungkan Perusahaan).
 */
export async function generateKodeInventaris(
  typeId: number | null,
  companyId: number | null,
  tglBeli: Date | null
): Promise<string | null> {
  if (!typeId || !companyId) return null;

  const [type, company] = await Promise.all([
    prisma.deviceType.findUnique({ where: { id: typeId } }),
    prisma.company.findUnique({ where: { id: companyId } }),
  ]);

  if (!type || !company) return null;

  const kodeJenis = ambilKode3Huruf(type.kode, type.nama, "DEV");
  const kodePerusahaan = ambilKode3Huruf(company.inisial, company.nama, "CMP");

  const tanggal = tglBeli ?? new Date();
  const tt = String(tanggal.getFullYear()).slice(-2);
  const bb = String(tanggal.getMonth() + 1).padStart(2, "0");
  const bulanTahun = `${bb}${tt}`;

  const prefix = `${kodeJenis}/${kodePerusahaan}-${bulanTahun}-`;

  const existing = await prisma.device.findMany({
    where: { kodeInventaris: { startsWith: prefix } },
    select: { kodeInventaris: true },
  });

  let maxUrut = 0;
  for (const d of existing) {
    const bagianUrut = d.kodeInventaris?.slice(prefix.length);
    const n = bagianUrut ? parseInt(bagianUrut, 10) : 0;
    if (!Number.isNaN(n) && n > maxUrut) maxUrut = n;
  }

  const urutBaru = String(maxUrut + 1).padStart(3, "0");
  return `${prefix}${urutBaru}`;
}

/**
 * Mengambil kode 3 huruf dengan urutan prioritas:
 *   1. Kolom kode/inisial yang sudah diisi manual (dipangkas/diberi
 *      padding menjadi tepat 3 huruf).
 *   2. Bila kosong, diturunkan dari 3 huruf pertama nama (huruf saja,
 *      tanpa spasi/simbol/angka).
 *   3. Bila keduanya kosong, memakai nilai cadangan (default).
 */
function ambilKode3Huruf(
  kodeManual: string | null | undefined,
  nama: string | null | undefined,
  cadangan: string
): string {
  const sumber =
    (kodeManual && kodeManual.trim()) ||
    (nama ? nama.replace(/[^a-zA-Z]/g, "") : "") ||
    cadangan;

  return sumber.toUpperCase().padEnd(3, "X").slice(0, 3);
}
