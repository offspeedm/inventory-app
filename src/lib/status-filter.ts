// src/lib/status-filter.ts
import type { Prisma } from '@prisma/client';

/**
 * Daftar status yang dianggap NON-AKTIF (case-insensitive).
 * Ubah daftar ini jika ada status lain yang ingin dikecualikan dari perhitungan
 * (misalnya menambahkan 'Rusak' ke DEVICE_NON_AKTIF_STATUSES).
 */
export const USER_NON_AKTIF_STATUSES = ['Non-Aktif', 'Nonaktif'] as const;

export const DEVICE_NON_AKTIF_STATUSES = [
  'Non-Aktif',
  'Nonaktif',
  'Rusak',
  'Hilang',
] as const;

const userNonAktifSet = new Set(
  USER_NON_AKTIF_STATUSES.map((s) => s.toLowerCase())
);
const deviceNonAktifSet = new Set(
  DEVICE_NON_AKTIF_STATUSES.map((s) => s.toLowerCase())
);

/**
 * Filter Prisma `where` untuk menghitung User aktif saja
 */
export const WHERE_USER_AKTIF: Prisma.UserWhereInput = {
  AND: USER_NON_AKTIF_STATUSES.map((s) => ({
    NOT: { status: { equals: s, mode: 'insensitive' } },
  })),
};

/**
 * Filter Prisma `where` untuk menghitung Device aktif saja
 */
export const WHERE_DEVICE_AKTIF: Prisma.DeviceWhereInput = {
  AND: DEVICE_NON_AKTIF_STATUSES.map((s) => ({
    NOT: { status: { equals: s, mode: 'insensitive' } },
  })),
};

/**
 * Helper JavaScript untuk memfilter array user di sisi server/klien
 */
export function isUserAktif(status: string | null | undefined): boolean {
  if (!status) return false;
  return !userNonAktifSet.has(status.trim().toLowerCase());
}

/**
 * Helper JavaScript untuk memfilter array device di sisi server/klien
 */
export function isDeviceAktif(status: string | null | undefined): boolean {
  if (!status) return false;
  return !deviceNonAktifSet.has(status.trim().toLowerCase());
}