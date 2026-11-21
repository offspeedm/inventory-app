// src/app/(dashboard)/troubleshooting/[id]/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { hapusLampiranLokal } from '@/lib/lampiran';

export async function hapusLampiranTiket(formData: FormData): Promise<void> {
  const id = String(formData.get('id') ?? '').trim();
  const ticketId = String(formData.get('ticket_id') ?? '').trim();
  const fileUrl = String(formData.get('file_url') ?? '').trim();

  if (!id || !ticketId) {
    throw new Error('ID lampiran dan ID tiket wajib disertakan.');
  }

  // Ambil path dari database jika file_url tidak dikirim melalui formData
  let targetUrl = fileUrl;
  if (!targetUrl) {
    const attachment = await prisma.ticketAttachment.findUnique({
      where: { id },
      select: { file_url: true },
    });
    targetUrl = attachment?.file_url ?? '';
  }

  // Hapus file fisik dari public/uploads/
  if (targetUrl) {
    await hapusLampiranLokal(targetUrl);
  }

  // Hapus record dari PostgreSQL
  await prisma.ticketAttachment.delete({
    where: { id },
  });

  revalidatePath(`/troubleshooting/${ticketId}`);
  revalidatePath('/troubleshooting');
}