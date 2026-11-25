// src/app/(dashboard)/troubleshooting/[id]/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { simpanLampiranTiket } from "@/lib/lampiran-tiket";
import { hapusLampiranLokal } from "@/lib/lampiran";

export async function uploadLampiranTiket(formData: FormData): Promise<void> {
  const ticketId = Number(formData.get("ticket_id"));
  const files = formData.getAll("files") as File[];

  if (!Number.isInteger(ticketId) || ticketId <= 0 || files.length === 0) {
    return;
  }

  await simpanLampiranTiket(ticketId, files);

  revalidatePath(`/troubleshooting/${ticketId}`);
  revalidatePath("/troubleshooting");
}

export async function hapusLampiranTiket(formData: FormData): Promise<void> {
  const id = Number(formData.get("id"));
  const ticketId = Number(formData.get("ticket_id"));
  const fileUrl = String(formData.get("file_url") ?? "").trim();

  if (!Number.isInteger(id) || id <= 0 || !Number.isInteger(ticketId) || ticketId <= 0) {
    throw new Error("ID lampiran dan ID tiket wajib disertakan.");
  }

  let targetUrl = fileUrl;
  if (!targetUrl) {
    const attachment = await prisma.ticketAttachment.findUnique({
      where: { id },
      select: { fileUrl: true },
    });
    targetUrl = attachment?.fileUrl ?? "";
  }

  if (targetUrl) {
    await hapusLampiranLokal(targetUrl);
  }

  await prisma.ticketAttachment.delete({
    where: { id },
  });

  revalidatePath(`/troubleshooting/${ticketId}`);
  revalidatePath("/troubleshooting");
}