import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

const BUCKET = "device-attachments";

export async function simpanLampiranDevice(deviceId: number, files: File[]) {
  if (!deviceId || !files || files.length === 0) return;

  const supabase = await createClient();

  for (const file of files) {
    if (!file || file.size === 0) continue;

    const ext = file.name.includes(".") ? file.name.split(".").pop() : "bin";
    const namaUnik = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const path = `device-${deviceId}/${namaUnik}`;

    const arrayBuffer = await file.arrayBuffer();

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, arrayBuffer, {
        contentType: file.type || "application/octet-stream",
      });

    if (uploadError) {
      console.error("Gagal upload lampiran:", uploadError.message);
      continue;
    }

    const { data: publicUrlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(path);

    await prisma.deviceAttachment.create({
      data: {
        deviceId,
        fileName: file.name,
        fileUrl: publicUrlData.publicUrl,
        fileType: file.type || null,
      },
    });
  }
}
