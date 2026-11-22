// src/app/(dashboard)/users/actions.ts
"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export type UserActionResult =
  | { ok: true }
  | { ok: false; error: string };

function normalizeStatus(raw: string | null | undefined): string {
  const s = (raw ?? "").trim().toLowerCase();
  if (s === "non-aktif" || s === "nonaktif") return "Non-Aktif";
  return "Aktif";
}

function parseOptionalInt(raw: FormDataEntryValue | null): number | null {
  if (raw === null || raw === undefined) return null;
  const str = String(raw).trim();
  if (!str) return null;
  const num = Number(str);
  return Number.isInteger(num) && num > 0 ? num : null;
}

function getStr(formData: FormData, ...keys: string[]): string {
  for (const key of keys) {
    const val = formData.get(key);
    if (typeof val === "string") return val;
  }
  return "";
}

function revalidateUserPaths(userId?: number) {
  revalidatePath("/users");
  if (userId) revalidatePath(`/users/${userId}`);
  revalidatePath("/devices");
  revalidatePath("/dashboard");
  revalidatePath("/report");
}

export async function tambahUser(
  formData: FormData
): Promise<UserActionResult> {
  const nama = getStr(formData, "nama").trim();
  const email = getStr(formData, "email").trim().toLowerCase();
  const noTelpRaw = getStr(formData, "no_telp", "noTelp").trim();
  const divisiRaw = getStr(formData, "divisi").trim();
  const status = normalizeStatus(getStr(formData, "status") || "Aktif");
  const companyId = parseOptionalInt(
    formData.get("company_id") ?? formData.get("companyId")
  );
  let branchId = parseOptionalInt(
    formData.get("branch_id") ?? formData.get("branchId")
  );
  const passwordRaw = getStr(formData, "password", "passwordBaru").trim();

  if (!nama) {
    return { ok: false, error: "Nama lengkap wajib diisi." };
  }
  if (!email) {
    return { ok: false, error: "Email wajib diisi." };
  }

  try {
    const existing = await prisma.user.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
    });
    if (existing) {
      return { ok: false, error: `Email "${email}" sudah digunakan user lain.` };
    }

    if (!companyId) {
      branchId = null;
    } else if (branchId) {
      const validBranch = await prisma.branch.findFirst({
        where: { id: branchId, companyId },
      });
      if (!validBranch) branchId = null;
    }

    const plainPassword =
      passwordRaw || Math.random().toString(36).slice(-10) + "A1!";
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    await prisma.user.create({
      data: {
        nama,
        email,
        noTelp: noTelpRaw && noTelpRaw !== "-" ? noTelpRaw : null,
        divisi: divisiRaw || null,
        status,
        companyId,
        branchId,
        password: hashedPassword,
      },
    });

    revalidateUserPaths();
    return { ok: true };
  } catch (error) {
    console.error("Error tambahUser:", error);
    return { ok: false, error: "Gagal menambahkan user baru." };
  }
}

export async function updateUser(
  idOrFormData: number | FormData,
  maybeFormData?: FormData
): Promise<UserActionResult> {
  const formData =
    idOrFormData instanceof FormData ? idOrFormData : maybeFormData;
  const id =
    typeof idOrFormData === "number"
      ? idOrFormData
      : parseOptionalInt(formData?.get("id") ?? null);

  if (!formData || !id) {
    return { ok: false, error: "ID user tidak valid." };
  }

  const nama = getStr(formData, "nama").trim();
  const email = getStr(formData, "email").trim().toLowerCase();
  const noTelpRaw = getStr(formData, "no_telp", "noTelp").trim();
  const divisiRaw = getStr(formData, "divisi").trim();
  const status = normalizeStatus(getStr(formData, "status"));
  const companyId = parseOptionalInt(
    formData.get("company_id") ?? formData.get("companyId")
  );
  let branchId = parseOptionalInt(
    formData.get("branch_id") ?? formData.get("branchId")
  );
  const passwordBaru = getStr(formData, "password", "passwordBaru").trim();

  if (!nama) {
    return { ok: false, error: "Nama lengkap wajib diisi." };
  }
  if (!email) {
    return { ok: false, error: "Email wajib diisi." };
  }

  try {
    const duplikat = await prisma.user.findFirst({
      where: {
        id: { not: id },
        email: { equals: email, mode: "insensitive" },
      },
    });

    if (duplikat) {
      return {
        ok: false,
        error: `Email "${email}" sudah digunakan oleh ${duplikat.nama}.`,
      };
    }

    if (!companyId) {
      branchId = null;
    } else if (branchId) {
      const validBranch = await prisma.branch.findFirst({
        where: { id: branchId, companyId },
      });
      if (!validBranch) branchId = null;
    }

    const updateData: {
      nama: string;
      email: string;
      noTelp: string | null;
      divisi: string | null;
      status: string;
      companyId: number | null;
      branchId: number | null;
      password?: string;
    } = {
      nama,
      email,
      noTelp: noTelpRaw && noTelpRaw !== "-" ? noTelpRaw : null,
      divisi: divisiRaw || null,
      status,
      companyId,
      branchId,
    };

    if (passwordBaru) {
      updateData.password = await bcrypt.hash(passwordBaru, 10);
    }

    await prisma.user.update({
      where: { id },
      data: updateData,
    });

    revalidateUserPaths(id);
    return { ok: true };
  } catch (error) {
    console.error("Error updateUser:", error);
    return { ok: false, error: "Gagal menyimpan perubahan." };
  }
}

export async function toggleStatusUser(
  idOrFormData: number | FormData
): Promise<UserActionResult> {
  const id =
    typeof idOrFormData === "number"
      ? idOrFormData
      : parseOptionalInt(idOrFormData.get("id"));

  if (!id) return { ok: false, error: "ID user tidak valid." };

  try {
    const current = await prisma.user.findUnique({
      where: { id },
      select: { status: true },
    });
    if (!current) return { ok: false, error: "User tidak ditemukan." };

    const s = current.status.trim().toLowerCase();
    const nextStatus =
      s === "non-aktif" || s === "nonaktif" ? "Aktif" : "Non-Aktif";

    await prisma.user.update({
      where: { id },
      data: { status: nextStatus },
    });

    revalidateUserPaths(id);
    return { ok: true };
  } catch (error) {
    console.error("Error toggleStatusUser:", error);
    return { ok: false, error: "Gagal mengubah status user." };
  }
}

export async function hapusUser(idOrFormData: number | FormData): Promise<void> {
  const id =
    typeof idOrFormData === "number"
      ? idOrFormData
      : parseOptionalInt(idOrFormData.get("id"));

  if (!id) return;

  try {
    await prisma.user.delete({ where: { id } });
    revalidateUserPaths();
  } catch (error) {
    console.error("Error hapusUser:", error);
  }
}