"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function tambahUser(formData: FormData) {
  const nama = formData.get("nama") as string;
  const email = formData.get("email") as string;
  const jabatan = formData.get("jabatan") as string;
  const status = (formData.get("status") as string) || "Aktif";
  const companyId = Number(formData.get("companyId"));
  const branchId = Number(formData.get("branchId"));

  await prisma.user.create({
    data: { nama, email, jabatan, status, companyId, branchId },
  });
  revalidatePath("/users");
}

export async function updateUser(formData: FormData) {
  const id = Number(formData.get("id"));
  const nama = formData.get("nama") as string;
  const email = formData.get("email") as string;
  const jabatan = formData.get("jabatan") as string;
  const status = (formData.get("status") as string) || "Aktif";
  const companyId = Number(formData.get("companyId"));
  const branchId = Number(formData.get("branchId"));

  await prisma.user.update({
    where: { id },
    data: { nama, email, jabatan, status, companyId, branchId },
  });
  revalidatePath("/users");
}

export async function hapusUser(id: number) {
  await prisma.user.delete({ where: { id } });
  revalidatePath("/users");
}

// Ubah cepat status Aktif <-> Non-Aktif tanpa membuka form edit
export async function toggleStatusUser(id: number, statusBaru: string) {
  await prisma.user.update({
    where: { id },
    data: { status: statusBaru },
  });
  revalidatePath("/users");
}
