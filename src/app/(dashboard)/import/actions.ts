"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { generateKodeInventaris } from "@/lib/kode-inventaris";

// PENTING: file ini TIDAK boleh mengimpor "xlsx" atau "exceljs" — kedua
// library itu hanya dipakai di sisi BROWSER (di dalam import-data-view.tsx,
// yang punya "use client") untuk membuat template & membaca file .xlsx.
// File ini ("use server") hanya menerima array objek biasa yang SUDAH
// diparse di browser, lalu menyimpannya ke database lewat Prisma.

type ImportUserRow = {
  "Nama Lengkap"?: string;
  Email?: string;
  "No. Telepon"?: string;
  Divisi?: string;
  Perusahaan?: string;
  Cabang?: string;
};

type ImportDeviceRow = {
  "Nama Perangkat"?: string;
  Jenis?: string;
  Merk?: string;
  "Tipe/Model"?: string;
  "No. Seri"?: string;
  Status?: string;
  "Tanggal Beli"?: string;
  "Harga Beli"?: string | number;
  Perusahaan?: string;
  Cabang?: string;
  Pengguna?: string;
  Keterangan?: string;
};

export type HasilImport = {
  berhasil: number;
  gagal: number;
  errors: { baris: number; pesan: string }[];
};

const STATUS_DEVICE_VALID = ["Aktif", "Rusak", "Perbaikan", "Tidak dipakai"];

function bersih(value: unknown): string {
  return String(value ?? "").trim();
}

// Kunci pembanding nama: huruf kecil semua + spasi berlebih dirapikan,
// supaya "Budi   Santoso" dan "budi santoso" dianggap nama yang sama.
function kunciNama(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

// Import banyak User sekaligus dari hasil parse Excel
export async function importUsers(rows: ImportUserRow[]): Promise<HasilImport> {
  const [companies, branches, existingUsers] = await Promise.all([
    prisma.company.findMany({ select: { id: true, nama: true } }),
    prisma.branch.findMany({ select: { id: true, nama: true, companyId: true } }),
    prisma.user.findMany({ select: { nama: true, email: true } }),
  ]);

  // Nama & email yang SUDAH ADA di database
  const namaTerdaftar = new Set(existingUsers.map((u) => kunciNama(u.nama)));
  const emailTerdaftar = new Set(
    existingUsers.map((u) => u.email?.toLowerCase()).filter((v): v is string => Boolean(v))
  );

  // Nama & email yang MUNCUL DI FILE INI SENDIRI (cek duplikat di dalam satu file)
  const namaDalamFile = new Set<string>();
  const emailDalamFile = new Set<string>();

  let berhasil = 0;
  const errors: { baris: number; pesan: string }[] = [];

  for (let i = 0; i < rows.length; i++) {
    const baris = i + 2; // baris ke-2 di Excel (baris ke-1 adalah header)
    const row = rows[i];
    const nama = bersih(row["Nama Lengkap"]);

    if (!nama) {
      errors.push({ baris, pesan: "Nama Lengkap wajib diisi" });
      continue;
    }

    const kunci = kunciNama(nama);
    const email = bersih(row["Email"]) || null;
    const kunciEmail = email?.toLowerCase() ?? null;

    // ===== Validasi duplikat nama =====
    if (namaTerdaftar.has(kunci)) {
      errors.push({ baris, pesan: `Nama "${nama}" sudah terdaftar di database` });
      continue;
    }
    if (namaDalamFile.has(kunci)) {
      errors.push({
        baris,
        pesan: `Nama "${nama}" duplikat di dalam file (baris lain sudah memakai nama ini)`,
      });
      continue;
    }

    // ===== Validasi duplikat email (bila diisi) =====
    if (kunciEmail && emailTerdaftar.has(kunciEmail)) {
      errors.push({ baris, pesan: `Email "${email}" sudah dipakai user lain di database` });
      continue;
    }
    if (kunciEmail && emailDalamFile.has(kunciEmail)) {
      errors.push({
        baris,
        pesan: `Email "${email}" duplikat di dalam file (baris lain sudah memakai email ini)`,
      });
      continue;
    }

    const namaPerusahaan = bersih(row["Perusahaan"]);
    let companyId: number | null = null;
    if (namaPerusahaan) {
      const found = companies.find((c) => c.nama.toLowerCase() === namaPerusahaan.toLowerCase());
      if (!found) {
        errors.push({ baris, pesan: `Perusahaan "${namaPerusahaan}" tidak ditemukan` });
        continue;
      }
      companyId = found.id;
    }

    const namaCabang = bersih(row["Cabang"]);
    let branchId: number | null = null;
    if (namaCabang) {
      const found = branches.find(
        (b) =>
          b.nama.toLowerCase() === namaCabang.toLowerCase() &&
          (companyId ? b.companyId === companyId : true)
      );
      if (!found) {
        errors.push({ baris, pesan: `Cabang "${namaCabang}" tidak ditemukan` });
        continue;
      }
      branchId = found.id;
    }

    try {
      await prisma.user.create({
        data: {
          nama,
          email,
          noTelp: bersih(row["No. Telepon"]) || null,
          divisi: bersih(row["Divisi"]) || null,
          status: "Aktif",
          companyId,
          branchId,
        },
      });
      berhasil++;
      namaTerdaftar.add(kunci);
      namaDalamFile.add(kunci);
      if (kunciEmail) {
        emailTerdaftar.add(kunciEmail);
        emailDalamFile.add(kunciEmail);
      }
    } catch {
      errors.push({ baris, pesan: "Gagal menyimpan data" });
    }
  }

  revalidatePath("/users");
  revalidatePath("/dashboard");

  return { berhasil, gagal: errors.length, errors };
}

// Import banyak Device sekaligus dari hasil parse Excel
export async function importDevices(rows: ImportDeviceRow[]): Promise<HasilImport> {
  const [companies, branches, deviceTypes, users, existingDevices] = await Promise.all([
    prisma.company.findMany({ select: { id: true, nama: true } }),
    prisma.branch.findMany({ select: { id: true, nama: true, companyId: true } }),
    prisma.deviceType.findMany({ select: { id: true, nama: true } }),
    prisma.user.findMany({ select: { id: true, nama: true } }),
    prisma.device.findMany({ select: { nama: true, serialNumber: true } }),
  ]);

  const namaTerdaftar = new Set(existingDevices.map((d) => kunciNama(d.nama)));
  const serialTerdaftar = new Set(
    existingDevices.map((d) => d.serialNumber?.toLowerCase()).filter((v): v is string => Boolean(v))
  );

  const namaDalamFile = new Set<string>();
  const serialDalamFile = new Set<string>();

  let berhasil = 0;
  const errors: { baris: number; pesan: string }[] = [];

  for (let i = 0; i < rows.length; i++) {
    const baris = i + 2;
    const row = rows[i];
    const nama = bersih(row["Nama Perangkat"]);

    if (!nama) {
      errors.push({ baris, pesan: "Nama Perangkat wajib diisi" });
      continue;
    }

    const kunci = kunciNama(nama);
    const serial = bersih(row["No. Seri"]) || null;
    const kunciSerial = serial?.toLowerCase() ?? null;

    // ===== Validasi duplikat nama perangkat =====
    if (namaTerdaftar.has(kunci)) {
      errors.push({ baris, pesan: `Nama perangkat "${nama}" sudah terdaftar di database` });
      continue;
    }
    if (namaDalamFile.has(kunci)) {
      errors.push({
        baris,
        pesan: `Nama perangkat "${nama}" duplikat di dalam file (baris lain sudah memakai nama ini)`,
      });
      continue;
    }

    // ===== Validasi duplikat No. Seri (bila diisi) =====
    if (kunciSerial && serialTerdaftar.has(kunciSerial)) {
      errors.push({ baris, pesan: `No. Seri "${serial}" sudah dipakai perangkat lain di database` });
      continue;
    }
    if (kunciSerial && serialDalamFile.has(kunciSerial)) {
      errors.push({
        baris,
        pesan: `No. Seri "${serial}" duplikat di dalam file (baris lain sudah memakai serial ini)`,
      });
      continue;
    }

    const namaJenis = bersih(row["Jenis"]);
    let typeId: number | null = null;
    if (namaJenis) {
      const found = deviceTypes.find((t) => t.nama.toLowerCase() === namaJenis.toLowerCase());
      if (!found) {
        errors.push({ baris, pesan: `Jenis "${namaJenis}" tidak ditemukan` });
        continue;
      }
      typeId = found.id;
    }

    const namaPerusahaan = bersih(row["Perusahaan"]);
    let companyId: number | null = null;
    if (namaPerusahaan) {
      const found = companies.find((c) => c.nama.toLowerCase() === namaPerusahaan.toLowerCase());
      if (!found) {
        errors.push({ baris, pesan: `Perusahaan "${namaPerusahaan}" tidak ditemukan` });
        continue;
      }
      companyId = found.id;
    }

    const namaCabang = bersih(row["Cabang"]);
    let branchId: number | null = null;
    if (namaCabang) {
      const found = branches.find(
        (b) =>
          b.nama.toLowerCase() === namaCabang.toLowerCase() &&
          (companyId ? b.companyId === companyId : true)
      );
      if (!found) {
        errors.push({ baris, pesan: `Cabang "${namaCabang}" tidak ditemukan` });
        continue;
      }
      branchId = found.id;
    }

    const namaPengguna = bersih(row["Pengguna"]);
    let userId: number | null = null;
    if (namaPengguna) {
      const found = users.find((u) => u.nama.toLowerCase() === namaPengguna.toLowerCase());
      if (!found) {
        errors.push({ baris, pesan: `Pengguna "${namaPengguna}" tidak ditemukan` });
        continue;
      }
      userId = found.id;
    }

    const statusRaw = bersih(row["Status"]) || "Aktif";
    const status = STATUS_DEVICE_VALID.includes(statusRaw) ? statusRaw : "Aktif";

    const tglBeliRaw = bersih(row["Tanggal Beli"]);
    const tglBeli = tglBeliRaw ? new Date(tglBeliRaw) : null;

    const hargaRaw = row["Harga Beli"];
    const hargaBeli = hargaRaw !== undefined && hargaRaw !== "" ? Number(hargaRaw) : null;

    try {
      const kodeInventaris = await generateKodeInventaris(typeId, tglBeli);
      await prisma.device.create({
        data: {
          nama,
          merk: bersih(row["Merk"]) || null,
          tipe: bersih(row["Tipe/Model"]) || null,
          serialNumber: serial,
          keterangan: bersih(row["Keterangan"]) || null,
          status,
          tglBeli,
          hargaBeli,
          typeId,
          companyId,
          branchId,
          userId,
          kodeInventaris,
        },
      });
      berhasil++;
      namaTerdaftar.add(kunci);
      namaDalamFile.add(kunci);
      if (kunciSerial) {
        serialTerdaftar.add(kunciSerial);
        serialDalamFile.add(kunciSerial);
      }
    } catch {
      errors.push({ baris, pesan: "Gagal menyimpan data" });
    }
  }

  revalidatePath("/devices");
  revalidatePath("/dashboard");

  return { berhasil, gagal: errors.length, errors };
}
