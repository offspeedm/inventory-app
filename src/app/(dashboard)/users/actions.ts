"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Ubah string kosong menjadi null, dan angka bila valid
function toNullableInt(value: FormDataEntryValue | null): number | null {
  const n = Number(value);
  return value && !Number.isNaN(n) && n > 0 ? n : null;
}

// Tambah user baru
export async function tambahUser(formData: FormData) {
  const nama = formData.get("nama") as string;
  const email = (formData.get("email") as string) || null;
  const jabatan = (formData.get("jabatan") as string) || null;
  const role = (formData.get("role") as string) || "staff";
  const companyId = toNullableInt(formData.get("company_id"));
  const branchId = toNullableInt(formData.get("branch_id"));

  await prisma.user.create({
    data: { nama, email, jabatan, role, companyId, branchId },
  });

  revalidatePath("/users");
}

// Ubah data user
export async function updateUser(formData: FormData) {
  const id = Number(formData.get("id"));
  const nama = formData.get("nama") as string;
  const email = (formData.get("email") as string) || null;
  const jabatan = (formData.get("jabatan") as string) || null;
  const role = (formData.get("role") as string) || "staff";
  const companyId = toNullableInt(formData.get("company_id"));
  const branchId = toNullableInt(formData.get("branch_id"));

  await prisma.user.update({
    where: { id },
    data: { nama, email, jabatan, role, companyId, branchId },
  });

  revalidatePath("/users");
}

// Hapus user
export async function hapusUser(formData: FormData) {
  const id = Number(formData.get("id"));

  await prisma.user.delete({
    where: { id },
  });

  revalidatePath("/users");
}
