import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

const BUCKET = "ticket-attachments";

/**
 * Mengunggah satu atau beberapa file (foto/lampiran) ke Supabase Storage
 * lalu mencatat setiap file ke tabel ticket_attachments.
 */
export async function simpanLampiranTiket(ticketId: number, files: File[]) {
  if (!ticketId || !files || files.length === 0) return;

  const supabase = await createClient();

  for (const file of files) {
    if (!file || file.size === 0) continue;

    const ext = file.name.includes(".") ? file.name.split(".").pop() : "bin";
    const namaUnik = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const path = `ticket-${ticketId}/${namaUnik}`;

    const arrayBuffer = await file.arrayBuffer();

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, arrayBuffer, {
        contentType: file.type || "application/octet-stream",
      });

    if (uploadError) {
      console.error("Gagal upload lampiran tiket:", uploadError.message);
      continue;
    }

    const { data: publicUrlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(path);

    await prisma.ticketAttachment.create({
      data: {
        ticketId,
        fileName: file.name,
        fileUrl: publicUrlData.publicUrl,
        fileType: file.type || null,
      },
    });
  }
}
