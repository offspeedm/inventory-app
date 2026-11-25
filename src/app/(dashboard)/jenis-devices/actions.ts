// src/app/(dashboard)/jenis-devices/actions.ts
"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type ActionResult =
  | { ok: true }
  | { ok: false; error: string };

function revalidateAll() {
  revalidatePath("/jenis-devices");
  revalidatePath("/devices");
  revalidatePath("/import");
  revalidatePath("/dashboard");
  revalidatePath("/report");
}

function bersihkanSpesifikasi(list?: string[]): string[] {
  if (!Array.isArray(list)) return [];
  const seen = new Set<string>();
  const hasil: string[] = [];

  for (const item of list) {
    const clean = String(item ?? "").trim();
    if (!clean) continue;
    const key = clean.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      hasil.push(clean);
    }
  }

  return hasil;
}

export async function tambahJenisDevice(data: {
  nama: string;
  kode?: string;
  spesifikasi?: string[];
}): Promise<ActionResult> {
  const nama = data.nama.trim();
  const kodeRaw = (data.kode ?? "").trim().toUpperCase();
  const spesifikasi = bersihkanSpesifikasi(data.spesifikasi);

  if (!nama) {
    return { ok: false, error: "Nama jenis perangkat wajib diisi." };
  }

  if (kodeRaw && kodeRaw.length > 10) {
    return { ok: false, error: "Kode prefix maksimal 10 karakter." };
  }

  try {
    const duplikat = await prisma.deviceType.findFirst({
      where: { nama: { equals: nama, mode: "insensitive" } },
    });

    if (duplikat) {
      return {
        ok: false,
        error: `Jenis perangkat "${duplikat.nama}" sudah terdaftar.`,
      };
    }

    await prisma.deviceType.create({
      data: {
        nama,
        kode: kodeRaw || null,
        spesifikasi,
      },
    });

    revalidateAll();
    return { ok: true };
  } catch (error) {
    console.error("Error tambahJenisDevice:", error);
    return { ok: false, error: "Gagal menambahkan jenis perangkat." };
  }
}

export async function updateJenisDevice(
  id: number,
  data: { nama: string; kode?: string; spesifikasi?: string[] }
): Promise<ActionResult> {
  const nama = data.nama.trim();
  const kodeRaw = (data.kode ?? "").trim().toUpperCase();
  const spesifikasi = bersihkanSpesifikasi(data.spesifikasi);

  if (!nama) {
    return { ok: false, error: "Nama jenis perangkat wajib diisi." };
  }

  if (kodeRaw && kodeRaw.length > 10) {
    return { ok: false, error: "Kode prefix maksimal 10 karakter." };
  }

  try {
    const duplikat = await prisma.deviceType.findFirst({
      where: {
        id: { not: id },
        nama: { equals: nama, mode: "insensitive" },
      },
    });

    if (duplikat) {
      return {
        ok: false,
        error: `Nama jenis perangkat "${duplikat.nama}" sudah digunakan.`,
      };
    }

    await prisma.deviceType.update({
      where: { id },
      data: {
        nama,
        kode: kodeRaw || null,
        spesifikasi,
      },
    });

    revalidateAll();
    return { ok: true };
  } catch (error) {
    console.error("Error updateJenisDevice:", error);
    return { ok: false, error: "Gagal menyimpan perubahan jenis perangkat." };
  }
}

export async function hapusJenisDevice(id: number): Promise<ActionResult> {
  try {
    const jumlahDipakai = await prisma.device.count({
      where: { typeId: id },
    });

    if (jumlahDipakai > 0) {
      return {
        ok: false,
        error: `Tidak dapat dihapus karena masih terhubung dengan ${jumlahDipakai} perangkat.`,
      };
    }

    await prisma.deviceType.delete({
      where: { id },
    });

    revalidateAll();
    return { ok: true };
  } catch (error) {
    console.error("Error hapusJenisDevice:", error);
    return { ok: false, error: "Gagal menghapus jenis perangkat." };
  }
}