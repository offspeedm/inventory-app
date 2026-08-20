"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { generateKodeInventaris } from "@/lib/kode-inventaris";
import { simpanLampiranDevice } from "@/lib/lampiran";

function toNullableInt(value: FormDataEntryValue | null): number | null {
  const n = Number(value);
  return value && !Number.isNaN(n) && n > 0 ? n : null;
}

function toNullableDate(value: FormDataEntryValue | null): Date | null {
  const v = value as string;
  return v ? new Date(v) : null;
}

function bacaForm(formData: FormData) {
  const hargaRaw = formData.get("harga_beli") as string;
  return {
    nama: formData.get("nama") as string,
    merk: (formData.get("merk") as string) || null,
    tipe: (formData.get("tipe") as string) || null,
    keterangan: (formData.get("keterangan") as string) || null,
    serialNumber: (formData.get("serial_number") as string) || null,
    hargaBeli: hargaRaw ? Number(hargaRaw) : null,
    status: (formData.get("status") as string) || "Aktif",
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
      hasil.push({ deviceId, key: key.slice(5), value: value.trim() });
    }
  }
  return hasil;
}

export async function tambahDevice(formData: FormData) {
  const d = bacaForm(formData);
  const kodeInventaris = await generateKodeInventaris(d.typeId, d.tglBeli);

  const device = await prisma.device.create({
    data: { ...d, kodeInventaris },
  });

  const atribut = kumpulkanAtribut(formData, device.id);
  if (atribut.length > 0) {
    await prisma.deviceAttribute.createMany({ data: atribut });
  }

  if (d.userId) {
    await prisma.deviceAssignment.create({
      data: { deviceId: device.id, userId: d.userId, tglMulai: new Date() },
    });
  }

  if (d.companyId || d.branchId) {
    await prisma.devicePlacement.create({
      data: {
        deviceId: device.id,
        companyId: d.companyId,
        branchId: d.branchId,
        tglMulai: new Date(),
      },
    });
  }

  const files = formData.getAll("files") as File[];
  await simpanLampiranDevice(device.id, files);

  revalidatePath("/devices");
  revalidatePath("/dashboard");
}

export async function updateDevice(formData: FormData) {
  const id = Number(formData.get("id"));
  const d = bacaForm(formData);

  const lama = await prisma.device.findUnique({ where: { id } });
  if (!lama) return;

  if (lama.userId !== d.userId) {
    await prisma.deviceAssignment.updateMany({
      where: { deviceId: id, tglSelesai: null },
      data: { tglSelesai: new Date() },
    });
    if (d.userId) {
      await prisma.deviceAssignment.create({
        data: { deviceId: id, userId: d.userId, tglMulai: new Date() },
      });
    }
  }

  if (lama.companyId !== d.companyId || lama.branchId !== d.branchId) {
    await prisma.devicePlacement.updateMany({
      where: { deviceId: id, tglSelesai: null },
      data: { tglSelesai: new Date() },
    });
    if (d.companyId || d.branchId) {
      await prisma.devicePlacement.create({
        data: {
          deviceId: id,
          companyId: d.companyId,
          branchId: d.branchId,
          tglMulai: new Date(),
        },
      });
    }
  }

  await prisma.device.update({ where: { id }, data: d });

  await prisma.deviceAttribute.deleteMany({ where: { deviceId: id } });
  const atribut = kumpulkanAtribut(formData, id);
  if (atribut.length > 0) {
    await prisma.deviceAttribute.createMany({ data: atribut });
  }

  const files = formData.getAll("files") as File[];
  await simpanLampiranDevice(id, files);

  revalidatePath("/devices");
  revalidatePath(`/devices/${id}`);
}

export async function hapusDevice(formData: FormData) {
  const id = Number(formData.get("id"));
  await prisma.device.delete({ where: { id } });
  revalidatePath("/devices");
  revalidatePath("/dashboard");
}
