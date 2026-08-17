"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Tambah cabang baru
export async function tambahCabang(formData: FormData) {
  const nama = formData.get("nama") as string;
  const kota = formData.get("kota") as string;
  const companyId = Number(formData.get("company_id"));

  await prisma.branch.create({
    data: { nama, kota, companyId },
  });

  revalidatePath("/cabang");
}

// Ubah data cabang
export async function updateCabang(formData: FormData) {
  const id = Number(formData.get("id"));
  const nama = formData.get("nama") as string;
  const kota = formData.get("kota") as string;
  const companyId = Number(formData.get("company_id"));

  await prisma.branch.update({
    where: { id },
    data: { nama, kota, companyId },
  });

  revalidatePath("/cabang");
}

// Hapus cabang
export async function hapusCabang(formData: FormData) {
  const id = Number(formData.get("id"));

  await prisma.branch.delete({
    where: { id },
  });

  revalidatePath("/cabang");
}
