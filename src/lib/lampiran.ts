import fs from "fs/promises";
import path from "path";
import prisma from "@/lib/prisma";

export async function simpanLampiranDevice(deviceId: number, files: File[]) {
  if (!deviceId || !files || files.length === 0) return;

  // Tentukan path folder lokal tujuan: public/uploads/devices/device-{id}
  const uploadDir = path.join(
    process.cwd(),
    "public",
    "uploads",
    "devices",
    `device-${deviceId}`
  );

  // Buat folder jika belum ada (recursive)
  await fs.mkdir(uploadDir, { recursive: true });

  for (const file of files) {
    if (!file || file.size === 0) continue;

    const ext = file.name.includes(".") ? file.name.split(".").pop() : "bin";
    const namaUnik = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const filePath = path.join(uploadDir, namaUnik);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    try {
      // Simpan file ke sistem lokal
      await fs.writeFile(filePath, buffer);

      // Path untuk diakses dari web browser (dimulai dari /uploads/...)
      const publicUrl = `/uploads/devices/device-${deviceId}/${namaUnik}`;

      await prisma.deviceAttachment.create({
        data: {
          deviceId,
          fileName: file.name,
          fileUrl: publicUrl,
          fileType: file.type || null,
        },
      });
    } catch (error) {
      console.error("Gagal menyimpan lampiran:", error);
    }
  }
}