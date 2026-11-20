"use server";

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

function toNullableString(value: FormDataEntryValue | null): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed || null;
}

function bacaForm(formData: FormData) {
  const hargaRaw = toNullableString(formData.get("harga_beli"));
  const hargaBeli = hargaRaw === null ? null : Number(hargaRaw);

  return {
    nama: String(formData.get("nama") ?? "").trim(),
    merk: toNullableString(formData.get("merk")),
    tipe: toNullableString(formData.get("tipe")),
    keterangan: toNullableString(formData.get("keterangan")),
    serialNumber: toNullableString(formData.get("serial_number")),
    hargaBeli: hargaBeli !== null && Number.isFinite(hargaBeli) ? hargaBeli : null,
    status: String(formData.get("status") ?? "Aktif").trim() || "Aktif",
    tglBeli: toNullableDate(formData.get("tgl_beli")),
    typeId: toNullableInt(formData.get("type_id")),
    companyId: toNullableInt(formData.get("company_id")),
    branchId: toNullableInt(formData.get("branch_id")),
    userId: toNullableInt(formData.get("user_id")),
  };
}

function kumpulkanAtribut(
  formData: FormData,
  deviceId: number
): { deviceId: number; key: string; value: string }[] {
  const hasil: { deviceId: number; key: string; value: string }[] = [];
  for (const [key, value] of formData.entries()) {
    if (key.startsWith("attr_") && typeof value === "string" && value.trim() !== "") {
      hasil.push({
        deviceId,
        key: key.slice(5),
        value: value.trim(),
      });
    }
  }
  return hasil;
}

function ambilFiles(formData: FormData): File[] {
  return formData
    .getAll("files")
    .filter((value): value is File => value instanceof File && value.size > 0);
}

export async function tambahDevice(formData: FormData) {
  const dataBaru = bacaForm(formData);

  if (!dataBaru.nama) {
    throw new Error("Nama perangkat wajib diisi.");
  }

  const waktuSekarang = new Date();

  const device = await prisma.$transaction(async (tx) => {
    const created = await tx.device.create({
      data: {
        ...dataBaru,
      },
    });

    const atribut = kumpulkanAtribut(formData, created.id);
    if (atribut.length > 0) {
      await tx.deviceAttribute.createMany({ data: atribut });
    }

    if (dataBaru.userId !== null) {
      await tx.deviceAssignment.create({
        data: {
          deviceId: created.id,
          userId: dataBaru.userId,
          tglMulai: waktuSekarang,
        },
      });
    }

    if (dataBaru.companyId !== null || dataBaru.branchId !== null) {
      await tx.devicePlacement.create({
        data: {
          deviceId: created.id,
          companyId: dataBaru.companyId,
          branchId: dataBaru.branchId,
          tglMulai: waktuSekarang,
        },
      });
    }

    return created;
  });

  const files = ambilFiles(formData);
  if (files.length > 0) {
    await simpanLampiranDevice(device.id, files);
  }

  revalidatePath("/devices");
  revalidatePath(`/devices/${device.id}`);
  revalidatePath("/dashboard");
  revalidatePath("/report");
}

export async function updateDevice(formData: FormData) {
  const id = Number(formData.get("id"));

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("ID perangkat tidak valid.");
  }

  const dataBaru = bacaForm(formData);

  if (!dataBaru.nama) {
    throw new Error("Nama perangkat wajib diisi.");
  }

  const atribut = kumpulkanAtribut(formData, id);
  const waktuPerubahan = new Date();

  await prisma.$transaction(async (tx) => {
    const dataLama = await tx.device.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        companyId: true,
        branchId: true,
        status: true,
      },
    });

    if (!dataLama) {
      throw new Error("Perangkat tidak ditemukan.");
    }

    const userBerubah = dataLama.userId !== dataBaru.userId;
    const perusahaanBerubah = dataLama.companyId !== dataBaru.companyId;
    const cabangBerubah = dataLama.branchId !== dataBaru.branchId;
    const penempatanBerubah = perusahaanBerubah || cabangBerubah;

    const statusMenutupRiwayat = new Set(["Rusak", "Hilang"]);
    const statusLamaMenutup = statusMenutupRiwayat.has(dataLama.status);
    const statusBaruMenutup = statusMenutupRiwayat.has(dataBaru.status);
    const mulaiDitutup = !statusLamaMenutup && statusBaruMenutup;
    const kembaliAktif = statusLamaMenutup && !statusBaruMenutup;

    await tx.device.update({
      where: { id },
      data: dataBaru,
    });

    if (userBerubah || mulaiDitutup) {
      await tx.deviceAssignment.updateMany({
        where: { deviceId: id, tglSelesai: null },
        data: { tglSelesai: waktuPerubahan },
      });
    }

    const perluBukaRiwayatUser =
      !statusBaruMenutup && (userBerubah || kembaliAktif) && dataBaru.userId !== null;

    if (perluBukaRiwayatUser) {
      await tx.deviceAssignment.create({
        data: {
          deviceId: id,
          userId: dataBaru.userId,
          tglMulai: waktuPerubahan,
        },
      });
    }

    if (penempatanBerubah || mulaiDitutup) {
      await tx.devicePlacement.updateMany({
        where: { deviceId: id, tglSelesai: null },
        data: { tglSelesai: waktuPerubahan },
      });
    }

    const perluBukaPenempatan =
      !statusBaruMenutup &&
      (penempatanBerubah || kembaliAktif) &&
      (dataBaru.companyId !== null || dataBaru.branchId !== null);

    if (perluBukaPenempatan) {
      await tx.devicePlacement.create({
        data: {
          deviceId: id,
          companyId: dataBaru.companyId,
          branchId: dataBaru.branchId,
          tglMulai: waktuPerubahan,
        },
      });
    }

    await tx.deviceAttribute.deleteMany({ where: { deviceId: id } });

    if (atribut.length > 0) {
      await tx.deviceAttribute.createMany({ data: atribut });
    }
  });

  const files = ambilFiles(formData);
  if (files.length > 0) {
    await simpanLampiranDevice(id, files);
  }

  revalidatePath("/devices");
  revalidatePath(`/devices/${id}`);
  revalidatePath("/dashboard");
  revalidatePath("/report");
}

export async function hapusDevice(formData: FormData) {
  const id = Number(formData.get("id"));

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("ID perangkat tidak valid.");
  }

  await prisma.device.delete({ where: { id } });

  revalidatePath("/devices");
  revalidatePath("/dashboard");
  revalidatePath("/report");
}