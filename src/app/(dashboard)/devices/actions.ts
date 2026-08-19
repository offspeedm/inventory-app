"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { generateKodeInventaris } from "@/lib/kode-inventaris";
import { simpanLampiranDevice } from "@/lib/lampiran";

function toNullableInt(value: FormDataEntryValue | null): number | null {
  const n = Number(value);
  return value && !Number.isNaN(n) && n > 0 ? n : null;
}

function toNullableDate(value: FormDataEntryValue | null): Date | null {
  const v = value as string;
  return v ? new Date(v) : null;
}

// Bacakan field umum dari form
function bacaForm(formData: FormData) {
  const hargaRaw = formData.get("harga_beli") as string;
  return {
    nama: formData.get("nama") as string,
    merk: (formData.get("merk") as string) || null,
    tipe: (formData.get("tipe") as string) || null,
    keterangan: (formData.get("keterangan") as string) || null,
    serialNumber: (formData.get("serial_number") as string) || null,
    hargaBeli: hargaRaw ? Number(hargaRaw) : null,
    status: (formData.get("status") as string) || "Aktif",
    tglBeli: toNullableDate(formData.get("tgl_beli")),
    typeId: toNullableInt(formData.get("type_id")),
    companyId: toNullableInt(formData.get("company_id")),
    branchId: toNullableInt(formData.get("branch_id")),
    userId: toNullableInt(formData.get("user_id")),
  };
}

// Tambah device baru + kode inventaris otomatis + riwayat awal + lampiran
export async function tambahDevice(formData: FormData) {
  const d = bacaForm(formData);

  // Buat kode inventaris otomatis: JENIS-TAHUNBULAN-URUT
  const kodeInventaris = await generateKodeInventaris(d.typeId, d.tglBeli);

  const device = await prisma.device.create({
    data: { ...d, kodeInventaris },
  });

  // Catat riwayat pengguna awal
  if (d.userId) {
    await prisma.deviceAssignment.create({
      data: { deviceId: device.id, userId: d.userId, tglMulai: new Date() },
    });
  }

  // Catat riwayat penempatan awal
  if (d.companyId || d.branchId) {
    await prisma.devicePlacement.create({
      data: {
        deviceId: device.id,
        companyId: d.companyId,
        branchId: d.branchId,
        tglMulai: new Date(),
      },
    });
  }

  // Simpan foto/lampiran yang ikut diunggah di form tambah
  const files = formData.getAll("files") as File[];
  await simpanLampiranDevice(device.id, files);

  revalidatePath("/devices");
}

// Ubah device + catat perubahan pengguna & penempatan ke riwayat
// (kode inventaris TIDAK berubah agar tetap jadi identitas tetap aset)
export async function updateDevice(formData: FormData) {
  const id = Number(formData.get("id"));
  const d = bacaForm(formData);

  const lama = await prisma.device.findUnique({ where: { id } });
  if (!lama) return;

  // --- Riwayat PENGGUNA: bila userId berubah ---
  if (lama.userId !== d.userId) {
    await prisma.deviceAssignment.updateMany({
      where: { deviceId: id, tglSelesai: null },
      data: { tglSelesai: new Date() },
    });
    if (d.userId) {
      await prisma.deviceAssignment.create({
        data: { deviceId: id, userId: d.userId, tglMulai: new Date() },
      });
    }
  }

  // --- Riwayat PENEMPATAN: bila company/branch berubah ---
  if (lama.companyId !== d.companyId || lama.branchId !== d.branchId) {
    await prisma.devicePlacement.updateMany({
      where: { deviceId: id, tglSelesai: null },
      data: { tglSelesai: new Date() },
    });
    if (d.companyId || d.branchId) {
      await prisma.devicePlacement.create({
        data: {
          deviceId: id,
          companyId: d.companyId,
          branchId: d.branchId,
          tglMulai: new Date(),
        },
      });
    }
  }

  await prisma.device.update({ where: { id }, data: d });

  revalidatePath("/devices");
  revalidatePath(`/devices/${id}`);
}

// Hapus device
export async function hapusDevice(formData: FormData) {
  const id = Number(formData.get("id"));
  await prisma.device.delete({ where: { id } });
  revalidatePath("/devices");
}
