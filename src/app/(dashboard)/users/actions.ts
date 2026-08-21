"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

function toNullableInt(value: FormDataEntryValue | null): number | null {
  const n = Number(value);
  return value && !Number.isNaN(n) && n > 0 ? n : null;
}

function normalisasiStatus(value: FormDataEntryValue | null): "Aktif" | "Non-Aktif" {
  return value === "Non-Aktif" ? "Non-Aktif" : "Aktif";
}

// Tambah user baru
export async function tambahUser(formData: FormData) {
  await prisma.user.create({
    data: {
      nama: String(formData.get("nama") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim() || null,
      noTelp: String(formData.get("no_telp") ?? "").trim() || null,
      divisi: String(formData.get("divisi") ?? "").trim() || null,
      status: normalisasiStatus(formData.get("status")),
      companyId: toNullableInt(formData.get("company_id")),
      branchId: toNullableInt(formData.get("branch_id")),
    },
  });

  revalidatePath("/users");
  revalidatePath("/dashboard");
}

// Ubah data user
export async function updateUser(formData: FormData) {
  const id = Number(formData.get("id"));

  await prisma.user.update({
    where: { id },
    data: {
      nama: String(formData.get("nama") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim() || null,
      noTelp: String(formData.get("no_telp") ?? "").trim() || null,
      divisi: String(formData.get("divisi") ?? "").trim() || null,
      status: normalisasiStatus(formData.get("status")),
      companyId: toNullableInt(formData.get("company_id")),
      branchId: toNullableInt(formData.get("branch_id")),
    },
  });

  revalidatePath("/users");
  revalidatePath(`/users/${id}`);
  revalidatePath("/dashboard");
}

// Ubah status Aktif <-> Non-Aktif secara instan (klik badge, tanpa buka form)
export async function toggleStatusUser(formData: FormData) {
  const id = Number(formData.get("id"));
  const status = normalisasiStatus(formData.get("status"));

  await prisma.user.update({ where: { id }, data: { status } });

  revalidatePath("/users");
  revalidatePath(`/users/${id}`);
  revalidatePath("/dashboard");
}

// Hapus user
export async function hapusUser(formData: FormData) {
  const id = Number(formData.get("id"));
  await prisma.user.delete({ where: { id } });
  revalidatePath("/users");
  revalidatePath("/dashboard");
}
