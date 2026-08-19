// Utilitas menghitung & menampilkan usia perangkat berdasarkan tanggal beli.

export function hitungUsia(tglBeli: Date | string | null): string {
  if (!tglBeli) return "-";

  const beli = new Date(tglBeli);
  const sekarang = new Date();

  let tahun = sekarang.getFullYear() - beli.getFullYear();
  let bulan = sekarang.getMonth() - beli.getMonth();

  if (sekarang.getDate() < beli.getDate()) {
    bulan -= 1;
  }
  if (bulan < 0) {
    tahun -= 1;
    bulan += 12;
  }

  if (tahun <= 0 && bulan <= 0) return "Baru dibeli";

  const bagian: string[] = [];
  if (tahun > 0) bagian.push(`${tahun} thn`);
  if (bulan > 0) bagian.push(`${bulan} bln`);
  return bagian.join(" ");
}

export function usiaBadgeColor(tglBeli: Date | string | null): string {
  if (!tglBeli) return "bg-slate-100 text-slate-500";

  const beli = new Date(tglBeli);
  const tahunUsia =
    (new Date().getTime() - beli.getTime()) / (1000 * 60 * 60 * 24 * 365.25);

  if (tahunUsia >= 5) return "bg-red-100 text-red-700";
  if (tahunUsia >= 3) return "bg-amber-100 text-amber-700";
  return "bg-green-100 text-green-700";
}
