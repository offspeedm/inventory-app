"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Tambah perusahaan baru
export async function tambahPerusahaan(formData: FormData) {
  const nama = formData.get("nama") as string;
  const inisial = formData.get("inisial") as string;
  const alamat = formData.get("alamat") as string;
  const noTelp = formData.get("no_telp") as string;

  await prisma.company.create({
    data: {
      nama,
      inisial: inisial || null,
      alamat: alamat || null,
      noTelp: noTelp || null,
    },
  });

  revalidatePath("/perusahaan");
}

// Ubah data perusahaan
export async function updatePerusahaan(formData: FormData) {
  const id = Number(formData.get("id"));
  const nama = formData.get("nama") as string;
  const inisial = formData.get("inisial") as string;
  const alamat = formData.get("alamat") as string;
  const noTelp = formData.get("no_telp") as string;

  await prisma.company.update({
    where: { id },
    data: {
      nama,
      inisial: inisial || null,
      alamat: alamat || null,
      noTelp: noTelp || null,
    },
  });

  revalidatePath("/perusahaan");
}

// Hapus perusahaan
export async function hapusPerusahaan(formData: FormData) {
  const id = Number(formData.get("id"));

  await prisma.company.delete({
    where: { id },
  });

  revalidatePath("/perusahaan");
}
