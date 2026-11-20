import prisma from "@/lib/prisma";

/**
 * Membuat kode inventaris otomatis dengan format baru:
 *   {JENIS}/{PERUSAHAAN}/{TAHUN}/{NO-URUT}
 * Contoh: NTB/SAI/2026/001
 *
 * - JENIS       : 3 huruf inisial jenis perangkat (mis. NTB)
 * - PERUSAHAAN  : 3 huruf inisial perusahaan (mis. SAI)
 * - TAHUN       : 4 digit tahun pembelian (mis. 2026)
 * - NO-URUT     : 3 digit nomor urut, dihitung ulang mulai dari 001 untuk
 *                 setiap kombinasi Jenis + Perusahaan + Tahun yang berbeda.
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

  // 1. Ambil inisial device dan perusahaan
  const kodeJenis = ambilKode3Huruf(
    // @ts-ignore
    type.kode,
    type.nama,
    "DEV"
  );

  const kodePerusahaan = ambilKode3Huruf(
    // @ts-ignore
    company.inisial,
    company.nama,
    "CMP"
  );

  // 2. Ambil tahun (4 digit) dari tanggal beli atau tanggal hari ini
  const tanggal = tglBeli ?? new Date();
  const tahun = String(tanggal.getFullYear());

  // 3. Susun awalan/prefix kode inventaris (misal: "NTB/SAI/2026/")
  const prefix = `${kodeJenis}/${kodePerusahaan}/${tahun}/`;

  // 4. Hitung nomor urut terakhir di database untuk prefix yang sama
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

  // 5. Buat nomor urut baru (3 digit)
  const urutBaru = String(maxUrut + 1).padStart(3, "0");

  // 6. Kembalikan format akhir
  return `${prefix}${urutBaru}`;
}

/**
 * Fungsi bantu: Mengambil kode 3 huruf dengan urutan prioritas:
 *   1. Kolom kode/inisial yang sudah diisi manual di database
 *   2. Bila kosong, diturunkan otomatis dari 3 huruf pertama nama
 *   3. Bila keduanya kosong, memakai nilai cadangan/default
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

  // Pastikan selalu 3 karakter kapital
  return sumber.toUpperCase().padEnd(3, "X").slice(0, 3);
}