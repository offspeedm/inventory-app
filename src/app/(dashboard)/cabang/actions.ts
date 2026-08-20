"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

function toNullableInt(value: FormDataEntryValue | null): number | null {
  const n = Number(value);
  return value && !Number.isNaN(n) && n > 0 ? n : null;
}

export async function tambahCabang(formData: FormData) {
  const nama = formData.get("nama") as string;
  const kota = formData.get("kota") as string;
  const companyId = toNullableInt(formData.get("company_id"));

  await prisma.branch.create({
    data: { nama, kota: kota || null, companyId },
  });

  revalidatePath("/cabang");
  revalidatePath("/dashboard");
}

export async function updateCabang(formData: FormData) {
  const id = Number(formData.get("id"));
  const nama = formData.get("nama") as string;
  const kota = formData.get("kota") as string;
  const companyId = toNullableInt(formData.get("company_id"));

  await prisma.branch.update({
    where: { id },
    data: { nama, kota: kota || null, companyId },
  });

  revalidatePath("/cabang");
  revalidatePath(`/cabang/${id}`);
}

export async function hapusCabang(formData: FormData) {
  const id = Number(formData.get("id"));

  await prisma.branch.delete({ where: { id } });

  revalidatePath("/cabang");
  revalidatePath("/dashboard");
}
