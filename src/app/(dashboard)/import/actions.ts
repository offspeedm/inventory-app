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

// Jumlah pasang kolom Spesifikasi (Nama)/(Nilai) yang disediakan di
// template. Fleksibel menampung jenis perangkat apa pun (Laptop butuh 3
// spesifikasi, CCTV butuh 2, dst.) — kolom yang tidak dipakai cukup
// dikosongkan.
const JUMLAH_SLOT_SPESIFIKASI = 4;

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
  "Tgl Mulai Penempatan"?: string;
  Pengguna?: string;
  "Tgl Mulai Pengguna"?: string;
  Keterangan?: string;
  // Kolom "Spesifikasi 1 (Nama)"..."Spesifikasi 4 (Nilai)" bersifat dinamis
  // (jumlahnya ditentukan JUMLAH_SLOT_SPESIFIKASI), jadi diakses lewat
  // Record<string, unknown> di ambilSpesifikasi() alih-alih didaftarkan
  // satu per satu di sini.
};

type ImportRiwayatPenggunaRow = {
  "No. Seri"?: string;
  "Nama Perangkat"?: string;
  "Nama User"?: string;
  "Tanggal Mulai"?: string;
  "Tanggal Selesai"?: string;
};

type ImportRiwayatPenempatanRow = {
  "No. Seri"?: string;
  "Nama Perangkat"?: string;
  Perusahaan?: string;
  Cabang?: string;
  "Tanggal Mulai"?: string;
  "Tanggal Selesai"?: string;
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

// Ubah teks tanggal (mis. "2026-01-15") menjadi objek Date. Mengembalikan
// null bila kosong atau formatnya tidak bisa dibaca.
function toTanggal(value: unknown): Date | null {
  const s = bersih(value);
  if (!s) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

// Mengambil pasangan Spesifikasi (Nama)/(Nilai) dari satu baris Excel,
// mengabaikan slot yang salah satu atau kedua sisinya kosong. Dipakai
// setelah device berhasil dibuat, untuk mengisi tabel DeviceAttribute —
// persis seperti field spesifikasi dinamis di form Tambah Device manual
// (mis. RAM/CPU/Storage untuk Laptop, Resolusi/Lokasi Pasang untuk CCTV).
function ambilSpesifikasi(
  row: ImportDeviceRow,
  deviceId: number
): { deviceId: number; key: string; value: string }[] {
  const rowAny = row as unknown as Record<string, unknown>;
  const hasil: { deviceId: number; key: string; value: string }[] = [];
  for (let slot = 1; slot <= JUMLAH_SLOT_SPESIFIKASI; slot++) {
    const key = bersih(rowAny[`Spesifikasi ${slot} (Nama)`]);
    const value = bersih(rowAny[`Spesifikasi ${slot} (Nilai)`]);
    if (key && value) hasil.push({ deviceId, key, value });
  }
  return hasil;
}

// Mencari ID perangkat berdasarkan No. Seri terlebih dahulu (lebih akurat
// karena wajib unik), baru fallback ke Nama Perangkat. Dipakai oleh sheet
// "Riwayat Pengguna" dan "Riwayat Penempatan" untuk mencocokkan baris
// riwayat ke perangkat yang benar — baik perangkat baru di batch import
// ini, maupun perangkat yang sudah ada di database sebelumnya.
function cariDeviceId(
  serial: string,
  namaPerangkat: string,
  deviceBySerial: Map<string, number>,
  deviceByNama: Map<string, number>
): number | null {
  if (serial) {
    const id = deviceBySerial.get(serial.toLowerCase());
    if (id) return id;
  }
  if (namaPerangkat) {
    const id = deviceByNama.get(kunciNama(namaPerangkat));
    if (id) return id;
  }
  return null;
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

// Import banyak Device sekaligus, LENGKAP dengan spesifikasi dinamis,
// riwayat pengguna & riwayat penempatan (masing-masing bisa berisi banyak
// baris per perangkat, dengan tanggal mulai & selesai sendiri).
export async function importDevices(payload: {
  devices: ImportDeviceRow[];
  riwayatPengguna?: ImportRiwayatPenggunaRow[];
  riwayatPenempatan?: ImportRiwayatPenempatanRow[];
}): Promise<HasilImport> {
  const { devices: rows, riwayatPengguna = [], riwayatPenempatan = [] } = payload;

  const [companies, branches, deviceTypes, users, existingDevices] = await Promise.all([
    prisma.company.findMany({ select: { id: true, nama: true } }),
    prisma.branch.findMany({ select: { id: true, nama: true, companyId: true } }),
    prisma.deviceType.findMany({ select: { id: true, nama: true } }),
    prisma.user.findMany({ select: { id: true, nama: true } }),
    prisma.device.findMany({ select: { id: true, nama: true, serialNumber: true } }),
  ]);

  const namaTerdaftar = new Set(existingDevices.map((d) => kunciNama(d.nama)));
  const serialTerdaftar = new Set(
    existingDevices.map((d) => d.serialNumber?.toLowerCase()).filter((v): v is string => Boolean(v))
  );

  // Peta nama/serial -> id perangkat. Diisi dari perangkat yang SUDAH ADA
  // di database, lalu ditambah lagi setiap kali perangkat baru berhasil
  // dibuat di Tahap 1 — sehingga sheet "Riwayat Pengguna"/"Riwayat
  // Penempatan" bisa mengacu baik ke perangkat baru maupun perangkat lama.
  const deviceByNama = new Map<string, number>(existingDevices.map((d) => [kunciNama(d.nama), d.id]));
  const deviceBySerial = new Map<string, number>(
    existingDevices
      .filter((d): d is typeof d & { serialNumber: string } => Boolean(d.serialNumber))
      .map((d) => [d.serialNumber.toLowerCase(), d.id])
  );

  const namaDalamFile = new Set<string>();
  const serialDalamFile = new Set<string>();

  let berhasil = 0;
  const errors: { baris: number; pesan: string }[] = [];

  // ===== TAHAP 1 — Buat perangkat + spesifikasi + riwayat "saat ini" (sheet Data) =====
  for (let i = 0; i < rows.length; i++) {
    const baris = i + 2;
    const row = rows[i];
    const nama = bersih(row["Nama Perangkat"]);

    if (!nama) {
      errors.push({ baris, pesan: "[Data] Nama Perangkat wajib diisi" });
      continue;
    }

    const kunci = kunciNama(nama);
    const serial = bersih(row["No. Seri"]) || null;
    const kunciSerial = serial?.toLowerCase() ?? null;

    if (namaTerdaftar.has(kunci)) {
      errors.push({ baris, pesan: `[Data] Nama perangkat "${nama}" sudah terdaftar di database` });
      continue;
    }
    if (namaDalamFile.has(kunci)) {
      errors.push({
        baris,
        pesan: `[Data] Nama perangkat "${nama}" duplikat di dalam file (baris lain sudah memakai nama ini)`,
      });
      continue;
    }
    if (kunciSerial && serialTerdaftar.has(kunciSerial)) {
      errors.push({ baris, pesan: `[Data] No. Seri "${serial}" sudah dipakai perangkat lain di database` });
      continue;
    }
    if (kunciSerial && serialDalamFile.has(kunciSerial)) {
      errors.push({
        baris,
        pesan: `[Data] No. Seri "${serial}" duplikat di dalam file (baris lain sudah memakai serial ini)`,
      });
      continue;
    }

    const namaJenis = bersih(row["Jenis"]);
    let typeId: number | null = null;
    if (namaJenis) {
      const found = deviceTypes.find((t) => t.nama.toLowerCase() === namaJenis.toLowerCase());
      if (!found) {
        errors.push({ baris, pesan: `[Data] Jenis "${namaJenis}" tidak ditemukan` });
        continue;
      }
      typeId = found.id;
    }

    const namaPerusahaan = bersih(row["Perusahaan"]);
    let companyId: number | null = null;
    if (namaPerusahaan) {
      const found = companies.find((c) => c.nama.toLowerCase() === namaPerusahaan.toLowerCase());
      if (!found) {
        errors.push({ baris, pesan: `[Data] Perusahaan "${namaPerusahaan}" tidak ditemukan` });
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
        errors.push({ baris, pesan: `[Data] Cabang "${namaCabang}" tidak ditemukan` });
        continue;
      }
      branchId = found.id;
    }

    const namaPengguna = bersih(row["Pengguna"]);
    let userId: number | null = null;
    if (namaPengguna) {
      const found = users.find((u) => kunciNama(u.nama) === kunciNama(namaPengguna));
      if (!found) {
        errors.push({ baris, pesan: `[Data] Pengguna "${namaPengguna}" tidak ditemukan` });
        continue;
      }
      userId = found.id;
    }

    const statusRaw = bersih(row["Status"]) || "Aktif";
    const status = STATUS_DEVICE_VALID.includes(statusRaw) ? statusRaw : "Aktif";

    const tglBeli = toTanggal(row["Tanggal Beli"]);
    const hargaRaw = row["Harga Beli"];
    const hargaBeli = hargaRaw !== undefined && hargaRaw !== "" ? Number(hargaRaw) : null;

    // Tanggal mulai riwayat "saat ini": pakai kolom eksplisit bila diisi,
    // kalau kosong jatuh ke Tanggal Beli, kalau itu pun kosong pakai waktu
    // sekarang (sama seperti perilaku tambah manual).
    const tglMulaiPengguna = toTanggal(row["Tgl Mulai Pengguna"]) ?? tglBeli ?? new Date();
    const tglMulaiPenempatan = toTanggal(row["Tgl Mulai Penempatan"]) ?? tglBeli ?? new Date();

    try {
      const kodeInventaris = await generateKodeInventaris(typeId, tglBeli);
      const device = await prisma.device.create({
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

      // Spesifikasi dinamis (mis. RAM/CPU/Storage) — sama seperti yang
      // tersimpan lewat form Tambah Device manual.
      const spesifikasi = ambilSpesifikasi(row, device.id);
      if (spesifikasi.length > 0) {
        await prisma.deviceAttribute.createMany({ data: spesifikasi });
      }

      if (userId) {
        await prisma.deviceAssignment.create({
          data: { deviceId: device.id, userId, tglMulai: tglMulaiPengguna },
        });
      }
      if (companyId || branchId) {
        await prisma.devicePlacement.create({
          data: { deviceId: device.id, companyId, branchId, tglMulai: tglMulaiPenempatan },
        });
      }

      berhasil++;
      namaTerdaftar.add(kunci);
      namaDalamFile.add(kunci);
      deviceByNama.set(kunci, device.id);
      if (kunciSerial) {
        serialTerdaftar.add(kunciSerial);
        serialDalamFile.add(kunciSerial);
        deviceBySerial.set(kunciSerial, device.id);
      }
    } catch {
      errors.push({ baris, pesan: "[Data] Gagal menyimpan data perangkat" });
    }
  }

  // ===== TAHAP 2 — Riwayat Pengguna tambahan (periode-periode sebelumnya) =====
  for (let i = 0; i < riwayatPengguna.length; i++) {
    const baris = i + 2;
    const row = riwayatPengguna[i];

    const serial = bersih(row["No. Seri"]);
    const namaPerangkat = bersih(row["Nama Perangkat"]);
    const namaUser = bersih(row["Nama User"]);

    if (!serial && !namaPerangkat && !namaUser) continue; // baris kosong, lewati

    if (!serial && !namaPerangkat) {
      errors.push({ baris, pesan: "[Riwayat Pengguna] No. Seri atau Nama Perangkat wajib diisi" });
      continue;
    }
    if (!namaUser) {
      errors.push({ baris, pesan: "[Riwayat Pengguna] Nama User wajib diisi" });
      continue;
    }

    const deviceId = cariDeviceId(serial, namaPerangkat, deviceBySerial, deviceByNama);
    if (!deviceId) {
      errors.push({
        baris,
        pesan: `[Riwayat Pengguna] Perangkat "${serial || namaPerangkat}" tidak ditemukan`,
      });
      continue;
    }

    const user = users.find((u) => kunciNama(u.nama) === kunciNama(namaUser));
    if (!user) {
      errors.push({ baris, pesan: `[Riwayat Pengguna] User "${namaUser}" tidak ditemukan` });
      continue;
    }

    const tglMulai = toTanggal(row["Tanggal Mulai"]);
    if (!tglMulai) {
      errors.push({
        baris,
        pesan: "[Riwayat Pengguna] Tanggal Mulai wajib diisi dengan format YYYY-MM-DD",
      });
      continue;
    }
    const tglSelesai = toTanggal(row["Tanggal Selesai"]);

    try {
      await prisma.deviceAssignment.create({
        data: { deviceId, userId: user.id, tglMulai, tglSelesai },
      });
      berhasil++;
    } catch {
      errors.push({ baris, pesan: "[Riwayat Pengguna] Gagal menyimpan data" });
    }
  }

  // ===== TAHAP 3 — Riwayat Penempatan tambahan =====
  for (let i = 0; i < riwayatPenempatan.length; i++) {
    const baris = i + 2;
    const row = riwayatPenempatan[i];

    const serial = bersih(row["No. Seri"]);
    const namaPerangkat = bersih(row["Nama Perangkat"]);
    const namaPerusahaan = bersih(row["Perusahaan"]);
    const namaCabang = bersih(row["Cabang"]);

    if (!serial && !namaPerangkat && !namaPerusahaan) continue; // baris kosong, lewati

    if (!serial && !namaPerangkat) {
      errors.push({ baris, pesan: "[Riwayat Penempatan] No. Seri atau Nama Perangkat wajib diisi" });
      continue;
    }
    if (!namaPerusahaan) {
      errors.push({ baris, pesan: "[Riwayat Penempatan] Perusahaan wajib diisi" });
      continue;
    }

    const deviceId = cariDeviceId(serial, namaPerangkat, deviceBySerial, deviceByNama);
    if (!deviceId) {
      errors.push({
        baris,
        pesan: `[Riwayat Penempatan] Perangkat "${serial || namaPerangkat}" tidak ditemukan`,
      });
      continue;
    }

    const company = companies.find((c) => c.nama.toLowerCase() === namaPerusahaan.toLowerCase());
    if (!company) {
      errors.push({
        baris,
        pesan: `[Riwayat Penempatan] Perusahaan "${namaPerusahaan}" tidak ditemukan`,
      });
      continue;
    }

    let branchId: number | null = null;
    if (namaCabang) {
      const branch = branches.find(
        (b) => b.nama.toLowerCase() === namaCabang.toLowerCase() && b.companyId === company.id
      );
      if (!branch) {
        errors.push({
          baris,
          pesan: `[Riwayat Penempatan] Cabang "${namaCabang}" tidak ditemukan di perusahaan tersebut`,
        });
        continue;
      }
      branchId = branch.id;
    }

    const tglMulai = toTanggal(row["Tanggal Mulai"]);
    if (!tglMulai) {
      errors.push({
        baris,
        pesan: "[Riwayat Penempatan] Tanggal Mulai wajib diisi dengan format YYYY-MM-DD",
      });
      continue;
    }
    const tglSelesai = toTanggal(row["Tanggal Selesai"]);

    try {
      await prisma.devicePlacement.create({
        data: { deviceId, companyId: company.id, branchId, tglMulai, tglSelesai },
      });
      berhasil++;
    } catch {
      errors.push({ baris, pesan: "[Riwayat Penempatan] Gagal menyimpan data" });
    }
  }

  revalidatePath("/devices");
  revalidatePath("/dashboard");
  revalidatePath("/users");

  return { berhasil, gagal: errors.length, errors };
}
