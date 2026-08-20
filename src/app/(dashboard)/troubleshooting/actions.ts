"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { generateNoTiket } from "@/lib/no-tiket";
import { simpanLampiranTiket } from "@/lib/lampiran-tiket";

function toNullableInt(value: FormDataEntryValue | null): number | null {
  const n = Number(value);
  return value && !Number.isNaN(n) && n > 0 ? n : null;
}

function toNullableDateTime(value: FormDataEntryValue | null): Date | null {
  const v = value as string;
  return v ? new Date(v) : null;
}

function bacaForm(formData: FormData) {
  const status = (formData.get("status") as string) || "Baru";
  return {
    judul: formData.get("judul") as string,
    kategori: (formData.get("kategori") as string) || null,
    kendala: (formData.get("kendala") as string) || null,
    solusi: (formData.get("solusi") as string) || null,
    diagnosa: (formData.get("diagnosa") as string) || null,
    catatanTeknisi: (formData.get("catatan_teknisi") as string) || null,
    divisi: (formData.get("divisi") as string) || null,
    prioritas: (formData.get("urgency") as string) || "Mengganggu pekerjaan",
    status,
    deviceId: toNullableInt(formData.get("device_id")),
    userId: toNullableInt(formData.get("user_id")),
    userTerkendalaId: toNullableInt(formData.get("user_terkendala_id")),
    teknisiId: toNullableInt(formData.get("teknisi_id")),
    companyId: toNullableInt(formData.get("company_id")),
    branchId: toNullableInt(formData.get("branch_id")),
  };
}

export async function tambahTiket(formData: FormData) {
  const d = bacaForm(formData);
  const noTiket = await generateNoTiket();

  const waktuLapor = toNullableDateTime(formData.get("waktu_lapor"));
  const tglSelesai = d.status === "Selesai" ? new Date() : null;

  const ticket = await prisma.ticket.create({
    data: {
      ...d,
      noTiket,
      tglLapor: waktuLapor ?? new Date(),
      tglSelesai,
    },
  });

  const files = formData.getAll("files") as File[];
  await simpanLampiranTiket(ticket.id, files);

  revalidatePath("/troubleshooting");
  revalidatePath("/dashboard");
  if (d.deviceId) revalidatePath(`/devices/${d.deviceId}`);
}

export async function updateTiket(formData: FormData) {
  const id = Number(formData.get("id"));
  const d = bacaForm(formData);

  const lama = await prisma.ticket.findUnique({ where: { id } });
  if (!lama) return;

  const waktuLapor = toNullableDateTime(formData.get("waktu_lapor"));
  const tglSelesai =
    d.status === "Selesai" ? lama.tglSelesai ?? new Date() : null;

  await prisma.ticket.update({
    where: { id },
    data: {
      ...d,
      tglLapor: waktuLapor ?? lama.tglLapor,
      tglSelesai,
    },
  });

  const files = formData.getAll("files") as File[];
  await simpanLampiranTiket(id, files);

  revalidatePath("/troubleshooting");
  revalidatePath("/dashboard");
  revalidatePath(`/troubleshooting/${id}`);
  if (d.deviceId) revalidatePath(`/devices/${d.deviceId}`);
  if (lama.deviceId && lama.deviceId !== d.deviceId) {
    revalidatePath(`/devices/${lama.deviceId}`);
  }
}

export async function hapusTiket(formData: FormData) {
  const id = Number(formData.get("id"));
  const tiket = await prisma.ticket.findUnique({ where: { id } });
  await prisma.ticket.delete({ where: { id } });
  revalidatePath("/troubleshooting");
  revalidatePath("/dashboard");
  if (tiket?.deviceId) revalidatePath(`/devices/${tiket.deviceId}`);
}
