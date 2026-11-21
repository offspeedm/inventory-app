// src/app/(dashboard)/users/actions.ts
'use server';

import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';

export type UserActionResult = {
  success?: boolean;
  error?: string;
  message?: string;
};

function normalisasiStatus(raw: unknown): 'Aktif' | 'Non-Aktif' {
  const val = String(raw ?? '').trim().toLowerCase();
  if (val === 'non-aktif' || val === 'nonaktif' || val === 'inactive' || val === 'false') {
    return 'Non-Aktif';
  }
  return 'Aktif';
}

function toNullableInt(value: FormDataEntryValue | null): number | null {
  if (value === null || value === undefined) return null;
  const str = String(value).trim();
  if (!str) return null;
  const parsed = Number.parseInt(str, 10);
  return Number.isNaN(parsed) ? null : parsed;
}

function toNullableString(value: FormDataEntryValue | null): string | null {
  if (value === null || value === undefined) return null;
  const str = String(value).trim();
  return str.length > 0 ? str : null;
}

export async function tambahUser(formData: FormData): Promise<UserActionResult> {
  const nama = String(formData.get('nama') ?? formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const rawPassword = String(formData.get('password') ?? '').trim();
  const jabatan = toNullableString(formData.get('jabatan'));
  const role = String(formData.get('role') ?? 'Teknisi').trim() || 'Teknisi';
  const divisi = toNullableString(formData.get('divisi'));
  const noTelp = toNullableString(formData.get('noTelp') ?? formData.get('no_telp'));
  const status = normalisasiStatus(formData.get('status') ?? 'Aktif');
  const companyId = toNullableInt(formData.get('companyId'));
  const branchId = toNullableInt(formData.get('branchId'));

  if (!nama || !email) {
    return {
      success: false,
      error: 'Nama lengkap dan email wajib diisi.',
    };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return {
        success: false,
        error: `Email "${email}" sudah terdaftar. Gunakan email lain.`,
      };
    }

    // Jika password dikosongkan saat tambah user, buat password acak 8 karakter
    const plainPassword =
      rawPassword.length > 0
        ? rawPassword
        : crypto.randomBytes(4).toString('hex');
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    await prisma.user.create({
      data: {
        nama,
        email,
        password: hashedPassword,
        jabatan,
        role,
        divisi,
        noTelp,
        status,
        companyId,
        branchId,
      },
    });

    revalidatePath('/users');
    return {
      success: true,
      message: 'Pengguna berhasil ditambahkan.',
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return {
        success: false,
        error: `Email "${email}" sudah terdaftar.`,
      };
    }

    console.error('Error tambahUser:', error);
    return {
      success: false,
      error: 'Gagal menambahkan pengguna karena kesalahan server.',
    };
  }
}

export async function updateUser(formData: FormData): Promise<UserActionResult>;
export async function updateUser(id: number, formData: FormData): Promise<UserActionResult>;
export async function updateUser(
  idOrFormData: number | FormData,
  maybeFormData?: FormData
): Promise<UserActionResult> {
  const formData =
    idOrFormData instanceof FormData ? idOrFormData : maybeFormData!;
  const id =
    idOrFormData instanceof FormData
      ? toNullableInt(formData.get('id'))
      : Number(idOrFormData);

  if (!id) {
    return { success: false, error: 'ID pengguna tidak valid.' };
  }

  const nama = String(formData.get('nama') ?? formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const rawPassword = String(formData.get('password') ?? '').trim();
  const jabatan = toNullableString(formData.get('jabatan'));
  const role = String(formData.get('role') ?? '').trim();
  const divisi = toNullableString(formData.get('divisi'));
  const noTelp = toNullableString(formData.get('noTelp') ?? formData.get('no_telp'));
  const statusRaw = formData.get('status');
  const companyId = toNullableInt(formData.get('companyId'));
  const branchId = toNullableInt(formData.get('branchId'));

  if (!nama || !email) {
    return {
      success: false,
      error: 'Nama lengkap dan email wajib diisi.',
    };
  }

  try {
    const duplicateUser = await prisma.user.findFirst({
      where: {
        email,
        NOT: { id },
      },
      select: { id: true },
    });

    if (duplicateUser) {
      return {
        success: false,
        error: `Email "${email}" sudah digunakan oleh akun lain.`,
      };
    }

    const updateData: Prisma.UserUpdateInput = {
      nama,
      email,
      jabatan,
      ...(role ? { role } : {}),
      divisi,
      noTelp,
      ...(statusRaw !== null ? { status: normalisasiStatus(statusRaw) } : {}),
      company: companyId ? { connect: { id: companyId } } : { disconnect: true },
      branch: branchId ? { connect: { id: branchId } } : { disconnect: true },
    };

    if (rawPassword.length > 0) {
      updateData.password = await bcrypt.hash(rawPassword, 10);
    }

    await prisma.user.update({
      where: { id },
      data: updateData,
    });

    revalidatePath('/users');
    return {
      success: true,
      message: 'Data pengguna berhasil diperbarui.',
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return {
        success: false,
        error: `Email "${email}" sudah digunakan oleh akun lain.`,
      };
    }

    console.error('Error updateUser:', error);
    return {
      success: false,
      error: 'Gagal memperbarui data pengguna.',
    };
  }
}

export async function toggleStatusUser(
  idOrFormData: number | FormData,
  currentStatus?: string
): Promise<UserActionResult> {
  const id =
    idOrFormData instanceof FormData
      ? toNullableInt(idOrFormData.get('id'))
      : Number(idOrFormData);

  if (!id) {
    return { success: false, error: 'ID pengguna tidak valid.' };
  }

  try {
    let statusSekarang = currentStatus;

    if (!statusSekarang) {
      const user = await prisma.user.findUnique({
        where: { id },
        select: { status: true },
      });
      if (!user) {
        return { success: false, error: 'Pengguna tidak ditemukan.' };
      }
      statusSekarang = user.status;
    }

    const statusBaru =
      normalisasiStatus(statusSekarang) === 'Aktif' ? 'Non-Aktif' : 'Aktif';

    await prisma.user.update({
      where: { id },
      data: { status: statusBaru },
    });

    revalidatePath('/users');
    return {
      success: true,
      message: `Status pengguna diubah menjadi ${statusBaru}.`,
    };
  } catch (error) {
    console.error('Error toggleStatusUser:', error);
    return {
      success: false,
      error: 'Gagal mengubah status pengguna.',
    };
  }
}

export async function hapusUser(
  idOrFormData: number | FormData
): Promise<UserActionResult> {
  const id =
    idOrFormData instanceof FormData
      ? toNullableInt(idOrFormData.get('id'))
      : Number(idOrFormData);

  if (!id) {
    return { success: false, error: 'ID pengguna tidak valid.' };
  }

  try {
    await prisma.user.delete({
      where: { id },
    });

    revalidatePath('/users');
    return {
      success: true,
      message: 'Pengguna berhasil dihapus.',
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2003'
    ) {
      return {
        success: false,
        error:
          'Pengguna tidak dapat dihapus karena masih terhubung dengan data tiket atau perangkat. Ubah status menjadi Non-Aktif sebagai gantinya.',
      };
    }

    console.error('Error hapusUser:', error);
    return {
      success: false,
      error: 'Gagal menghapus pengguna.',
    };
  }
}