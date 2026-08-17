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

// Tambah device baru
export async function tambahDevice(formData: FormData) {
  const nama = formData.get("nama") as string;
  const serialNumber = (formData.get("serial_number") as string) || null;
  const hargaRaw = formData.get("harga_beli") as string;
  const hargaBeli = hargaRaw ? Number(hargaRaw) : null;

  await prisma.device.create({
    data: {
      nama,
      serialNumber,
      hargaBeli,
      status: (formData.get("status") as string) || "Aktif",
      tglBeli: toNullableDate(formData.get("tgl_beli")),
      typeId: toNullableInt(formData.get("type_id")),
      companyId: toNullableInt(formData.get("company_id")),
      branchId: toNullableInt(formData.get("branch_id")),
      userId: toNullableInt(formData.get("user_id")),
    },
  });

  revalidatePath("/devices");
}

// Ubah data device
export async function updateDevice(formData: FormData) {
  const id = Number(formData.get("id"));
  const nama = formData.get("nama") as string;
  const serialNumber = (formData.get("serial_number") as string) || null;
  const hargaRaw = formData.get("harga_beli") as string;
  const hargaBeli = hargaRaw ? Number(hargaRaw) : null;

  await prisma.device.update({
    where: { id },
    data: {
      nama,
      serialNumber,
      hargaBeli,
      status: (formData.get("status") as string) || "Aktif",
      tglBeli: toNullableDate(formData.get("tgl_beli")),
      typeId: toNullableInt(formData.get("type_id")),
      companyId: toNullableInt(formData.get("company_id")),
      branchId: toNullableInt(formData.get("branch_id")),
      userId: toNullableInt(formData.get("user_id")),
    },
  });

  revalidatePath("/devices");
}

// Hapus device
export async function hapusDevice(formData: FormData) {
  const id = Number(formData.get("id"));

  await prisma.device.delete({
    where: { id },
  });

  revalidatePath("/devices");
}
