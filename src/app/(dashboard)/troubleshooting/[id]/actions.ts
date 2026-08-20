"use server";

import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { simpanLampiranTiket } from "@/lib/lampiran-tiket";

const BUCKET = "ticket-attachments";

export async function uploadLampiranTiket(formData: FormData) {
  const ticketId = Number(formData.get("ticket_id"));
  const files = formData.getAll("files") as File[];

  if (!ticketId || files.length === 0) return;

  await simpanLampiranTiket(ticketId, files);

  revalidatePath(`/troubleshooting/${ticketId}`);
}

export async function hapusLampiranTiket(formData: FormData) {
  const id = Number(formData.get("id"));
  const ticketId = Number(formData.get("ticket_id"));
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
    console.error("Gagal hapus file storage tiket:", e);
  }

  await prisma.ticketAttachment.delete({ where: { id } });

  revalidatePath(`/troubleshooting/${ticketId}`);
}
