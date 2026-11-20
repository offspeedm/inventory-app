import fs from "fs/promises";
import path from "path";
import prisma from "@/lib/prisma";

export async function simpanLampiranTiket(ticketId: number, files: File[]) {
  if (!ticketId || !files || files.length === 0) return;

  // Folder tujuan: public/uploads/tickets/ticket-{id}
  const uploadDir = path.join(process.cwd(), "public", "uploads", "tickets", `ticket-${ticketId}`);
  
  await fs.mkdir(uploadDir, { recursive: true });

  for (const file of files) {
    if (!file || file.size === 0) continue;

    const ext = file.name.includes(".") ? file.name.split(".").pop() : "bin";
    const namaUnik = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const filePath = path.join(uploadDir, namaUnik);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    try {
      await fs.writeFile(filePath, buffer);
      
      const publicUrl = `/uploads/tickets/ticket-${ticketId}/${namaUnik}`;

      await prisma.ticketAttachment.create({
        data: {
          ticketId,
          fileName: file.name,
          fileUrl: publicUrl,
          fileType: file.type || null,
        },
      });
    } catch (error) {
      console.error("Gagal menyimpan lampiran tiket:", error);
    }
  }
}