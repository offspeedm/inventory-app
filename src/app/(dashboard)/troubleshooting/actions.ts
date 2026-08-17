"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Ubah nilai form menjadi angka bila valid, atau null
function toNullableInt(value: FormDataEntryValue | null): number | null {
  const n = Number(value);
  return value && !Number.isNaN(n) && n > 0 ? n : null;
}

// Bila status Selesai, isi tgl_selesai; selain itu null
function tglSelesaiFor(status: string): Date | null {
  return status === "Selesai" ? new Date() : null;
}

// Tambah tiket baru
export async function tambahTiket(formData: FormData) {
  const status = (formData.get("status") as string) || "Baru";

  await prisma.ticket.create({
    data: {
      judul: formData.get("judul") as string,
      deskripsi: (formData.get("deskripsi") as string) || null,
      prioritas: (formData.get("prioritas") as string) || "Normal",
      status,
      deviceId: toNullableInt(formData.get("device_id")),
      userId: toNullableInt(formData.get("user_id")),
      companyId: toNullableInt(formData.get("company_id")),
      branchId: toNullableInt(formData.get("branch_id")),
      tglSelesai: tglSelesaiFor(status),
    },
  });

  revalidatePath("/troubleshooting");
  revalidatePath("/dashboard");
}

// Ubah data tiket
export async function updateTiket(formData: FormData) {
  const id = Number(formData.get("id"));
  const status = (formData.get("status") as string) || "Baru";

  await prisma.ticket.update({
    where: { id },
    data: {
      judul: formData.get("judul") as string,
      deskripsi: (formData.get("deskripsi") as string) || null,
      prioritas: (formData.get("prioritas") as string) || "Normal",
      status,
      deviceId: toNullableInt(formData.get("device_id")),
      userId: toNullableInt(formData.get("user_id")),
      companyId: toNullableInt(formData.get("company_id")),
      branchId: toNullableInt(formData.get("branch_id")),
      tglSelesai: tglSelesaiFor(status),
    },
  });

  revalidatePath("/troubleshooting");
  revalidatePath("/dashboard");
}

// Hapus tiket
export async function hapusTiket(formData: FormData) {
  const id = Number(formData.get("id"));

  await prisma.ticket.delete({
    where: { id },
  });

  revalidatePath("/troubleshooting");
  revalidatePath("/dashboard");
}
