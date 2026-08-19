import prisma from "@/lib/prisma";

/**
 * Membuat nomor tiket otomatis dengan format:
 *   TKT-{TAHUNBULANTANGGAL}-{NO-URUT}
 * Contoh: TKT-20260118-001 (tiket ke-1 pada 18 Januari 2026)
 */
export async function generateNoTiket(): Promise<string> {
  const sekarang = new Date();
  const yyyy = sekarang.getFullYear();
  const mm = String(sekarang.getMonth() + 1).padStart(2, "0");
  const dd = String(sekarang.getDate()).padStart(2, "0");
  const prefix = `TKT-${yyyy}${mm}${dd}-`;

  const existing = await prisma.ticket.findMany({
    where: { noTiket: { startsWith: prefix } },
    select: { noTiket: true },
  });

  let maxUrut = 0;
  for (const t of existing) {
    const bagianUrut = t.noTiket?.slice(prefix.length);
    const n = bagianUrut ? parseInt(bagianUrut, 10) : 0;
    if (!Number.isNaN(n) && n > maxUrut) maxUrut = n;
  }

  const urutBaru = String(maxUrut + 1).padStart(3, "0");
  return `${prefix}${urutBaru}`;
}
