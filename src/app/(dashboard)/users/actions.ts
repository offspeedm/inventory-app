"use server";

import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export type UserActionResult = {
  ok: boolean;
  error?: string;
};

function toNullableInt(value: FormDataEntryValue | null): number | null {
  const n = Number(value);
  return value && !Number.isNaN(n) && n > 0 ? n : null;
}

function normalisasiStatus(value: FormDataEntryValue | null): "Aktif" | "Non-Aktif" {
  return value === "Non-Aktif" ? "Non-Aktif" : "Aktif";
}

// Tambah user baru (dengan password)
export async function tambahUser(formData: FormData): Promise<UserActionResult> {
  const nama = String(formData.get("nama") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim() || null;

  if (!nama) {
    return { ok: false, error: "Nama lengkap wajib diisi." };
  }

  if (email) {
    const duplikat = await prisma.user.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
      select: { id: true, nama: true },
    });

    if (duplikat) {
      return {
        ok: false,
        error: `Email "${email}" sudah digunakan oleh user "${duplikat.nama}".`,
      };
    }
  }

  let password = String(formData.get("password") ?? "").trim();
  if (!password) {
    password = Math.random().toString(36).slice(2, 10);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    await prisma.user.create({
      data: {
        nama,
        email,
        password: hashedPassword,
        noTelp: String(formData.get("no_telp") ?? "").trim() || null,
        divisi: String(formData.get("divisi") ?? "").trim() || null,
        status: normalisasiStatus(formData.get("status")),
        companyId: toNullableInt(formData.get("company_id")),
        branchId: toNullableInt(formData.get("branch_id")),
      },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return { ok: false, error: `Email "${email}" sudah terdaftar pada user lain.` };
    }
    throw err;
  }

  revalidatePath("/users");
  revalidatePath("/dashboard");
  return { ok: true };
}

// Ubah data user (dan opsi ubah password)
export async function updateUser(formData: FormData): Promise<UserActionResult> {
  const id = Number(formData.get("id"));
  const nama = String(formData.get("nama") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim() || null;
  const passwordBaru = String(formData.get("password") ?? "").trim();

  if (!Number.isInteger(id) || id <= 0) {
    return { ok: false, error: "ID user tidak valid." };
  }

  if (!nama) {
    return { ok: false, error: "Nama lengkap wajib diisi." };
  }

  if (email) {
    const duplikat = await prisma.user.findFirst({
      where: {
        email: { equals: email, mode: "insensitive" },
        NOT: { id },
      },
      select: { id: true, nama: true },
    });

    if (duplikat) {
      return {
        ok: false,
        error: `Email "${email}" sudah digunakan oleh user "${duplikat.nama}".`,
      };
    }
  }

  const updateData: Prisma.UserUncheckedUpdateInput = {
    nama,
    email,
    noTelp: String(formData.get("no_telp") ?? "").trim() || null,
    divisi: String(formData.get("divisi") ?? "").trim() || null,
    status: normalisasiStatus(formData.get("status")),
    companyId: toNullableInt(formData.get("company_id")),
    branchId: toNullableInt(formData.get("branch_id")),
  };

  if (passwordBaru) {
    const salt = await bcrypt.genSalt(10);
    updateData.password = await bcrypt.hash(passwordBaru, salt);
  }

  try {
    await prisma.user.update({
      where: { id },
      data: updateData,
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return { ok: false, error: `Email "${email}" sudah terdaftar pada user lain.` };
    }
    throw err;
  }

  revalidatePath("/users");
  revalidatePath(`/users/${id}`);
  revalidatePath("/dashboard");
  return { ok: true };
}

// Ubah status Aktif <-> Non-Aktif secara instan
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