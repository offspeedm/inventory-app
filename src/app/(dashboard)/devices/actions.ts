"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Ubah nilai form menjadi angka bila valid, atau null
function toNullableInt(value: FormDataEntryValue | null): number | null {
  const n = Number(value);
  return value && !Number.isNaN(n) && n > 0 ? n : null;
}

// Ubah nilai form menjadi Date bila ada, atau null
function toNullableDate(value: FormDataEntryValue | null): Date | null {
  const v = value as string;
  return v ? new Date(v) : null;
}

// Kumpulkan field dinamis (nama input diawali "attr_") menjadi daftar key-value
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

// Tambah device baru + field dinamis
export async function tambahDevice(formData: FormData) {
  const hargaRaw = formData.get("harga_beli") as string;

  const device = await prisma.device.create({
    data: {
      nama: formData.get("nama") as string,
      serialNumber: (formData.get("serial_number") as string) || null,
      hargaBeli: hargaRaw ? Number(hargaRaw) : null,
      status: (formData.get("status") as string) || "Aktif",
      tglBeli: toNullableDate(formData.get("tgl_beli")),
      typeId: toNullableInt(formData.get("type_id")),
      companyId: toNullableInt(formData.get("company_id")),
      branchId: toNullableInt(formData.get("branch_id")),
      userId: toNullableInt(formData.get("user_id")),
    },
  });

  const atribut = kumpulkanAtribut(formData, device.id);
  if (atribut.length > 0) {
    await prisma.deviceAttribute.createMany({ data: atribut });
  }

  revalidatePath("/devices");
}

// Ubah data device + perbarui field dinamis
export async function updateDevice(formData: FormData) {
  const id = Number(formData.get("id"));
  const hargaRaw = formData.get("harga_beli") as string;

  await prisma.device.update({
    where: { id },
    data: {
      nama: formData.get("nama") as string,
      serialNumber: (formData.get("serial_number") as string) || null,
      hargaBeli: hargaRaw ? Number(hargaRaw) : null,
      status: (formData.get("status") as string) || "Aktif",
      tglBeli: toNullableDate(formData.get("tgl_beli")),
      typeId: toNullableInt(formData.get("type_id")),
      companyId: toNullableInt(formData.get("company_id")),
      branchId: toNullableInt(formData.get("branch_id")),
      userId: toNullableInt(formData.get("user_id")),
    },
  });

  // Hapus atribut lama, lalu isi ulang dengan yang baru
  await prisma.deviceAttribute.deleteMany({ where: { deviceId: id } });
  const atribut = kumpulkanAtribut(formData, id);
  if (atribut.length > 0) {
    await prisma.deviceAttribute.createMany({ data: atribut });
  }

  revalidatePath("/devices");
}

// Hapus device (atribut ikut terhapus otomatis karena onDelete: Cascade)
export async function hapusDevice(formData: FormData) {
  const id = Number(formData.get("id"));

  await prisma.device.delete({
    where: { id },
  });

  revalidatePath("/devices");
}
