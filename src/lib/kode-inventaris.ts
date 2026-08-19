import prisma from "@/lib/prisma";

/**
 * Membuat kode inventaris otomatis dengan format:
 *   {INISIAL-JENIS}-{TAHUNBULAN}-{NO-URUT}
 * Contoh: LT-202601-001 (Laptop, dibeli Januari 2026, urutan ke-1)
 *
 * - Inisial jenis diambil dari kolom `kode` pada device_types.
 *   Kalau kosong, diambil otomatis dari 3 huruf pertama nama jenis.
 * - Nomor urut dihitung ulang per kombinasi (jenis + tahun-bulan),
 *   sehingga tiap bulan mulai dari 001 lagi untuk jenis yang sama.
 */
export async function generateKodeInventaris(
  typeId: number | null,
  tglBeli: Date | null
): Promise<string | null> {
  if (!typeId) return null;

  const type = await prisma.deviceType.findUnique({ where: { id: typeId } });
  if (!type) return null;

  const kodeJenis = (
    type.kode || type.nama.replace(/[^a-zA-Z]/g, "").slice(0, 3) || "DV"
  ).toUpperCase();

  const tanggal = tglBeli ?? new Date();
  const yyyy = tanggal.getFullYear();
  const mm = String(tanggal.getMonth() + 1).padStart(2, "0");
  const prefix = `${kodeJenis}-${yyyy}${mm}-`;

  // Cari kode yang sudah ada dengan prefix sama, ambil nomor urut terbesar
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
