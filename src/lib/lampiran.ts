// src/lib/lampiran.ts
import { mkdir, writeFile, unlink } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import prisma from '@/lib/prisma';

const UPLOAD_ROOT = path.join(process.cwd(), 'public', 'uploads');
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'application/pdf': '.pdf',
};

export class UploadValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UploadValidationError';
  }
}

/**
 * Core helper: Validasi dan simpan satu file ke direktori lokal public/uploads/<subfolder>
 * Mengembalikan path publik relatif (contoh: "/uploads/devices/device-123/1732180000-a1b2c3.webp")
 */
export async function simpanLampiranLokal(
  file: File,
  subfolder: string = 'general'
): Promise<string> {
  if (!file || file.size === 0) {
    throw new UploadValidationError('File lampiran tidak boleh kosong.');
  }

  const ext = ALLOWED_MIME_TYPES[file.type];
  if (!ext) {
    throw new UploadValidationError(
      'Format file tidak didukung. Gunakan JPG, PNG, WEBP, atau PDF.'
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new UploadValidationError('Ukuran file maksimal adalah 5 MB.');
  }

  const sanitizedSubfolder = subfolder.replace(/^\/+|\/+$/g, '');
  const targetDir = path.join(UPLOAD_ROOT, sanitizedSubfolder);
  await mkdir(targetDir, { recursive: true });

  const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}`;
  const fileName = `${uniqueSuffix}${ext}`;
  const fullPath = path.join(targetDir, fileName);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(fullPath, buffer);

  return `/uploads/${sanitizedSubfolder}/${fileName}`;
}

/**
 * Simpan satu atau beberapa file lampiran perangkat ke public/uploads/devices/device-{deviceId}/
 * dan buat record di tabel DeviceAttachment.
 */
export async function simpanLampiranDevice(
  deviceId: string,
  files: File | File[]
) {
  const fileList = (Array.isArray(files) ? files : [files]).filter(
    (f) => f && f.size > 0
  );

  if (fileList.length === 0) return [];

  const savedRecords = [];

  for (const file of fileList) {
    const fileUrl = await simpanLampiranLokal(
      file,
      `devices/device-${deviceId}`
    );

    const record = await prisma.deviceAttachment.create({
      data: {
        deviceId,
        fileName: file.name,
        fileUrl,
      },
    });

    savedRecords.push(record);
  }

  return savedRecords;
}

/**
 * Simpan satu atau beberapa file lampiran tiket troubleshooting ke public/uploads/tickets/ticket-{ticketId}/
 * dan buat record di tabel TicketAttachment.
 */
export async function simpanLampiranTiket(
  ticketId: string,
  files: File | File[]
) {
  const fileList = (Array.isArray(files) ? files : [files]).filter(
    (f) => f && f.size > 0
  );

  if (fileList.length === 0) return [];

  const savedRecords = [];

  for (const file of fileList) {
    const fileUrl = await simpanLampiranLokal(
      file,
      `tickets/ticket-${ticketId}`
    );

    const record = await prisma.ticketAttachment.create({
      data: {
        ticketId,
        fileName: file.name,
        fileUrl,
      },
    });

    savedRecords.push(record);
  }

  return savedRecords;
}

/**
 * Hapus file fisik dari public/uploads saat data dihapus atau gambar diganti.
 * Dilengkapi proteksi path traversal agar tidak menghapus file di luar public/uploads.
 */
export async function hapusLampiranLokal(
  publicPath: string | null | undefined
): Promise<void> {
  if (!publicPath || !publicPath.startsWith('/uploads/')) return;

  const normalizedRelative = path
    .normalize(publicPath)
    .replace(/^(\.\.(\/|\\|$))+/, '');
  const fullPath = path.join(process.cwd(), 'public', normalizedRelative);

  if (!fullPath.startsWith(UPLOAD_ROOT)) return;

  try {
    await unlink(fullPath);
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException)?.code !== 'ENOENT') {
      console.error(`Gagal menghapus file lokal (${fullPath}):`, err);
    }
  }
}

/**
 * Normalisasi path gambar untuk komponen UI (menghilangkan ketergantungan URL storage lama)
 */
export function resolveLampiranUrl(
  storedPath: string | null | undefined,
  fallback = '/images/no-image.png'
): string {
  if (!storedPath) return fallback;
  if (storedPath.startsWith('/uploads/')) return storedPath;
  if (storedPath.startsWith('http://') || storedPath.startsWith('https://')) {
    return storedPath;
  }
  return `/uploads/${storedPath.replace(/^\/+/, '')}`;
}