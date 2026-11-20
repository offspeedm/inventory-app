"use server";

import fs from "fs/promises";
import path from "path";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { simpanLampiranDevice } from "@/lib/lampiran";

function toNullableInt(value: FormDataEntryValue | null): number | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function toNullableDate(value: FormDataEntryValue | null): Date | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const date = new Date(trimmed);
  return Number.isNaN(date.getTime()) ? null : date;
}

function revalidateDevicePaths(deviceId: number) {
  revalidatePath(`/devices/${deviceId}`);
  revalidatePath("/devices");
  revalidatePath("/dashboard");
  revalidatePath("/report");
}

export async function uploadLampiran(formData: FormData) {
  const deviceId = Number(formData.get("device_id"));
  const files = formData.getAll("files") as File[];

  if (!deviceId || files.length === 0) return;

  await simpanLampiranDevice(deviceId, files);

  revalidatePath(`/devices/${deviceId}`);
}

export async function hapusLampiran(formData: FormData) {
  const id = Number(formData.get("id"));
  const deviceId = Number(formData.get("device_id"));
  const fileUrl = formData.get("file_url") as string;

  try {
    if (fileUrl.startsWith("/uploads/")) {
      const parts = fileUrl.split("/").filter(Boolean);
      const filePath = path.join(process.cwd(), "public", ...parts);

      await fs.unlink(filePath).catch((e) => {
        console.error(
          "File fisik tidak ditemukan atau sudah terhapus:",
          e.message,
        );
      });
    }
  } catch (e) {
    console.error("Gagal memproses penghapusan file lokal:", e);
  }

  await prisma.deviceAttachment.delete({ where: { id } });

  revalidatePath(`/devices/${deviceId}`);
}

// ==================== RIWAYAT PENGGUNA ====================

export async function tambahRiwayatPengguna(formData: FormData) {
  const deviceId = Number(formData.get("device_id"));
  if (!Number.isInteger(deviceId) || deviceId <= 0) {
    throw new Error("ID perangkat tidak valid.");
  }

  const userId = toNullableInt(formData.get("user_id"));
  const tglMulai = toNullableDate(formData.get("tgl_mulai")) ?? new Date();
  const tglSelesai = toNullableDate(formData.get("tgl_selesai"));

  await prisma.$transaction(async (tx) => {
    if (tglSelesai === null) {
      await tx.deviceAssignment.updateMany({
        where: { deviceId, tglSelesai: null },
        data: { tglSelesai: tglMulai },
      });
      await tx.device.update({
        where: { id: deviceId },
        data: { userId },
      });
    }

    await tx.deviceAssignment.create({
      data: {
        deviceId,
        userId,
        tglMulai,
        tglSelesai,
      },
    });
  });

  revalidateDevicePaths(deviceId);
}

export async function updateRiwayatPengguna(formData: FormData) {
  const id = Number(formData.get("id"));
  const deviceId = Number(formData.get("device_id"));

  if (!Number.isInteger(id) || id <= 0 || !Number.isInteger(deviceId) || deviceId <= 0) {
    throw new Error("Data riwayat pengguna tidak valid.");
  }

  const userId = toNullableInt(formData.get("user_id"));
  const tglMulai = toNullableDate(formData.get("tgl_mulai"));
  const tglSelesai = toNullableDate(formData.get("tgl_selesai"));

  await prisma.$transaction(async (tx) => {
    const lama = await tx.deviceAssignment.findUnique({
      where: { id },
      select: { tglSelesai: true },
    });

    await tx.deviceAssignment.update({
      where: { id },
      data: {
        userId,
        tglMulai,
        tglSelesai,
      },
    });

    if (tglSelesai === null) {
      await tx.device.update({
        where: { id: deviceId },
        data: { userId },
      });
    } else if (lama?.tglSelesai === null) {
      const aktifLain = await tx.deviceAssignment.findFirst({
        where: { deviceId, tglSelesai: null },
        orderBy: { tglMulai: "desc" },
      });
      await tx.device.update({
        where: { id: deviceId },
        data: { userId: aktifLain?.userId ?? null },
      });
    }
  });

  revalidateDevicePaths(deviceId);
}

export async function hapusRiwayatPengguna(formData: FormData) {
  const id = Number(formData.get("id"));
  const deviceId = Number(formData.get("device_id"));

  if (!Number.isInteger(id) || id <= 0 || !Number.isInteger(deviceId) || deviceId <= 0) {
    throw new Error("ID riwayat tidak valid.");
  }

  await prisma.$transaction(async (tx) => {
    const target = await tx.deviceAssignment.findUnique({
      where: { id },
      select: { tglSelesai: true },
    });

    await tx.deviceAssignment.delete({ where: { id } });

    if (target?.tglSelesai === null) {
      const aktifLain = await tx.deviceAssignment.findFirst({
        where: { deviceId, tglSelesai: null },
        orderBy: { tglMulai: "desc" },
      });
      await tx.device.update({
        where: { id: deviceId },
        data: { userId: aktifLain?.userId ?? null },
      });
    }
  });

  revalidateDevicePaths(deviceId);
}

// ==================== RIWAYAT PENEMPATAN ====================

export async function tambahRiwayatPenempatan(formData: FormData) {
  const deviceId = Number(formData.get("device_id"));
  if (!Number.isInteger(deviceId) || deviceId <= 0) {
    throw new Error("ID perangkat tidak valid.");
  }

  const companyId = toNullableInt(formData.get("company_id"));
  const branchId = toNullableInt(formData.get("branch_id"));
  const tglMulai = toNullableDate(formData.get("tgl_mulai")) ?? new Date();
  const tglSelesai = toNullableDate(formData.get("tgl_selesai"));

  await prisma.$transaction(async (tx) => {
    if (tglSelesai === null) {
      await tx.devicePlacement.updateMany({
        where: { deviceId, tglSelesai: null },
        data: { tglSelesai: tglMulai },
      });
      await tx.device.update({
        where: { id: deviceId },
        data: { companyId, branchId },
      });
    }

    await tx.devicePlacement.create({
      data: {
        deviceId,
        companyId,
        branchId,
        tglMulai,
        tglSelesai,
      },
    });
  });

  revalidateDevicePaths(deviceId);
}

export async function updateRiwayatPenempatan(formData: FormData) {
  const id = Number(formData.get("id"));
  const deviceId = Number(formData.get("device_id"));

  if (!Number.isInteger(id) || id <= 0 || !Number.isInteger(deviceId) || deviceId <= 0) {
    throw new Error("Data riwayat penempatan tidak valid.");
  }

  const companyId = toNullableInt(formData.get("company_id"));
  const branchId = toNullableInt(formData.get("branch_id"));
  const tglMulai = toNullableDate(formData.get("tgl_mulai")) ?? new Date();
  const tglSelesai = toNullableDate(formData.get("tgl_selesai"));

  await prisma.$transaction(async (tx) => {
    const lama = await tx.devicePlacement.findUnique({
      where: { id },
      select: { tglSelesai: true },
    });

    await tx.devicePlacement.update({
      where: { id },
      data: {
        companyId,
        branchId,
        tglMulai,
        tglSelesai,
      },
    });

    if (tglSelesai === null) {
      await tx.device.update({
        where: { id: deviceId },
        data: { companyId, branchId },
      });
    } else if (lama?.tglSelesai === null) {
      const aktifLain = await tx.devicePlacement.findFirst({
        where: { deviceId, tglSelesai: null },
        orderBy: { tglMulai: "desc" },
      });
      await tx.device.update({
        where: { id: deviceId },
        data: {
          companyId: aktifLain?.companyId ?? null,
          branchId: aktifLain?.branchId ?? null,
        },
      });
    }
  });

  revalidateDevicePaths(deviceId);
}

export async function hapusRiwayatPenempatan(formData: FormData) {
  const id = Number(formData.get("id"));
  const deviceId = Number(formData.get("device_id"));

  if (!Number.isInteger(id) || id <= 0 || !Number.isInteger(deviceId) || deviceId <= 0) {
    throw new Error("ID riwayat tidak valid.");
  }

  await prisma.$transaction(async (tx) => {
    const target = await tx.devicePlacement.findUnique({
      where: { id },
      select: { tglSelesai: true },
    });

    await tx.devicePlacement.delete({ where: { id } });

    if (target?.tglSelesai === null) {
      const aktifLain = await tx.devicePlacement.findFirst({
        where: { deviceId, tglSelesai: null },
        orderBy: { tglMulai: "desc" },
      });
      await tx.device.update({
        where: { id: deviceId },
        data: {
          companyId: aktifLain?.companyId ?? null,
          branchId: aktifLain?.branchId ?? null,
        },
      });
    }
  });

  revalidateDevicePaths(deviceId);
}