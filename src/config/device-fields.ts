// src/config/device-fields.ts
// Konfigurasi default field dinamis per jenis perangkat (fallback jika kolom spesifikasi di DB masih kosong).

export const deviceFields: Record<string, string[]> = {
  Laptop: ["RAM", "CPU", "Storage"],
  Desktop: ["RAM", "CPU", "Storage"],
  Monitor: ["Ukuran", "Resolusi"],
  Printer: ["Tipe", "Konektivitas"],
  Router: ["Jumlah Port", "Kecepatan"],
  CCTV: ["Resolusi", "Lokasi Pasang"],
  "Perangkat Lainnya": ["Keterangan Spesifikasi"],
};

export function parseSpesifikasiInput(raw: string): string[] {
  const seen = new Set<string>();
  const hasil: string[] = [];

  for (const part of raw.split(",")) {
    const clean = part.trim();
    if (!clean) continue;
    const key = clean.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      hasil.push(clean);
    }
  }

  return hasil;
}

export function getFieldsForType(
  typeName: string | null | undefined,
  customFields?: string[] | null
): string[] {
  if (customFields && customFields.length > 0) {
    return customFields;
  }

  if (!typeName) return [];

  const normalized = typeName.trim().toLowerCase();
  const matchedKey = Object.keys(deviceFields).find(
    (key) => key.toLowerCase() === normalized
  );

  return matchedKey ? deviceFields[matchedKey] : [];
}