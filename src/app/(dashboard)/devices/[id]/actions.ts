"use server";

import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { simpanLampiranDevice } from "@/lib/lampiran";

const BUCKET = "device-attachments";

// Unggah satu atau beberapa file (foto/lampiran) untuk sebuah perangkat
// (dipakai dari halaman detail perangkat)
export async function uploadLampiran(formData: FormData) {
  const deviceId = Number(formData.get("device_id"));
  const files = formData.getAll("files") as File[];

  if (!deviceId || files.length === 0) return;

  await simpanLampiranDevice(deviceId, files);

  revalidatePath(`/devices/${deviceId}`);
}

// Hapus satu lampiran (dari storage & database)
export async function hapusLampiran(formData: FormData) {
  const id = Number(formData.get("id"));
  const deviceId = Number(formData.get("device_id"));
  const fileUrl = formData.get("file_url") as string;

  try {
    const supabase = await createClient();
    const marker = `/object/public/${BUCKET}/`;
    const idx = fileUrl.indexOf(marker);
    if (idx !== -1) {
      const path = fileUrl.slice(idx + marker.length);
      await supabase.storage.from(BUCKET).remove([path]);
    }
  } catch (e) {
    console.error("Gagal hapus file storage:", e);
  }

  await prisma.deviceAttachment.delete({ where: { id } });

  revalidatePath(`/devices/${deviceId}`);
}
