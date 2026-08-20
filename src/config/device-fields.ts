// Konfigurasi field dinamis per jenis perangkat.
// Kunci = nama jenis (harus sama persis dengan data di tabel device_types).

export const deviceFields: Record<string, string[]> = {
  Laptop: ["RAM", "CPU", "Storage"],
  Desktop: ["RAM", "CPU", "Storage"],
  Monitor: ["Ukuran", "Resolusi"],
  Printer: ["Tipe", "Konektivitas"],
  Router: ["Jumlah Port", "Kecepatan"],
  CCTV: ["Resolusi", "Lokasi Pasang"],
  "Perangkat Lainnya": ["Keterangan Spesifikasi"],
};

export function getFieldsForType(typeName: string | null | undefined): string[] {
  if (!typeName) return [];
  return deviceFields[typeName] ?? [];
}
