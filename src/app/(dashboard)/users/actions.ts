"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

function toNullableInt(value: FormDataEntryValue | null): number | null {
  const n = Number(value);
  return value && !Number.isNaN(n) && n > 0 ? n : null;
}

export async function tambahUser(formData: FormData) {
  await prisma.user.create({
    data: {
      nama: formData.get("nama") as string,
      email: (formData.get("email") as string) || null,
      noTelp: (formData.get("no_telp") as string) || null,
      divisi: (formData.get("divisi") as string) || null,
      companyId: toNullableInt(formData.get("company_id")),
      branchId: toNullableInt(formData.get("branch_id")),
    },
  });

  revalidatePath("/users");
  revalidatePath("/dashboard");
}

export async function updateUser(formData: FormData) {
  const id = Number(formData.get("id"));

  await prisma.user.update({
    where: { id },
    data: {
      nama: formData.get("nama") as string,
      email: (formData.get("email") as string) || null,
      noTelp: (formData.get("no_telp") as string) || null,
      divisi: (formData.get("divisi") as string) || null,
      companyId: toNullableInt(formData.get("company_id")),
      branchId: toNullableInt(formData.get("branch_id")),
    },
  });

  revalidatePath("/users");
  revalidatePath(`/users/${id}`);
}

export async function hapusUser(formData: FormData) {
  const id = Number(formData.get("id"));
  await prisma.user.delete({ where: { id } });
  revalidatePath("/users");
  revalidatePath("/dashboard");
}
