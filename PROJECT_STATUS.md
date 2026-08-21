# PROJECT STATUS — Inventory & Device Management App

> **Cara pakai file ini:** tempel seluruh isi file ini ke awal percakapan baru
> dengan Copilot supaya konteks project langsung tersambung tanpa perlu
> menjelaskan ulang dari nol. Perbarui bagian "Riwayat Perubahan" setiap kali
> ada fitur besar yang selesai dikerjakan.

**Terakhir diperbarui:** 21 Agustus 2026
**Pemilik project:** Chairul Imam
**Lokasi project:** `C:\Users\Chairul Imam\Development\inventory-app`
**Repo:** disarankan disimpan di GitHub sebagai workspace permanen

---

## 1. Ringkasan Project

Aplikasi web manajemen inventaris IT untuk 5 perusahaan (PT. Speedmark
Logistics Indonesia, PT. Sarana Allport Cargo Services, PT. Glorindo Oksana
Logistics, PT. Swift Kargonize, PT. CNL Logistics Indonesia) beserta
cabang-cabangnya. Mengelola data Perusahaan, Cabang, User, Devices
(perangkat IT), dan Troubleshooting (tiket kendala), lengkap dengan riwayat
penggunaan/penempatan perangkat dan laporan gangguan.

## 2. Stack Teknologi

| Lapisan | Teknologi |
|---|---|
| Framework | Next.js (App Router) |
| Bahasa | TypeScript |
| Styling | Tailwind CSS |
| Ikon | lucide-react |
| Database | PostgreSQL via Supabase |
| ORM | Prisma v6 |
| Autentikasi | Supabase Auth (email/password) + middleware proteksi rute |
| Penyimpanan file | Supabase Storage (2 bucket: `device-attachments`,
  `ticket-attachments`) |
| Grafik | Recharts |
| Import/Export Excel | ExcelJS (baca & tulis file .xlsx di browser) |
| Hosting rencana | Vercel (belum dieksekusi) |

## 3. Struktur Folder Utama

```
src/
├── app/
│   ├── login/                          # Halaman login (di luar folder dashboard)
│   └── (dashboard)/                    # Semua halaman setelah login
│       ├── layout.tsx                  # Sidebar + Header (Server Component)
│       ├── dashboard/                  # KPI + grafik + aktivitas terbaru
│       ├── perusahaan/
│       │   ├── page.tsx                # Tabel sederhana (bukan card)
│       │   ├── [id]/page.tsx           # Detail: cabang/user/device/tiket terkait
│       │   ├── actions.ts, form-perusahaan.tsx, baris-perusahaan.tsx,
│       │   │   tabel-perusahaan.tsx (dengan pagination+filter+sort)
│       ├── cabang/                     # Sama polanya dengan Perusahaan
│       ├── users/
│       │   ├── page.tsx, actions.ts, form-user.tsx, baris-user.tsx,
│       │   │   tabel-user.tsx (status Aktif/Non-Aktif, pagination, filter, sort)
│       │   ├── statistik-user.tsx      # Statistik per perusahaan & divisi
│       │   └── [id]/page.tsx           # Detail user + riwayat troubleshooting
│       ├── devices/
│       │   ├── page.tsx, actions.ts, form-device.tsx, baris-device.tsx,
│       │   │   tabel-device.tsx (kode inventaris otomatis, field dinamis,
│       │   │   pagination, filter, sort)
│       │   └── [id]/
│       │       ├── page.tsx            # Detail: usia, spesifikasi, lampiran,
│       │       │                         3 riwayat (pengguna/penempatan/tiket)
│       │       ├── actions.ts, form-lampiran.tsx, galeri-lampiran.tsx
│       ├── troubleshooting/
│       │   ├── page.tsx, actions.ts, form-troubleshooting.tsx,
│       │   │   baris-troubleshooting.tsx, tabel-troubleshooting.tsx
│       │   └── [id]/
│       │       ├── page.tsx, actions.ts, form-lampiran.tsx, galeri-lampiran.tsx
│       └── import/
│           ├── page.tsx, actions.ts    # Import User & Devices dari Excel
│           └── import-data-view.tsx    # Generate template + baca file (ExcelJS)
├── components/
│   ├── filter-dropdown.tsx             # Filter checkbox, pakai React Portal
│   ├── pagination-bar.tsx              # Bar paginasi dipakai di 4 halaman
│   └── charts/                         # chart-perusahaan, chart-jenis, chart-tiket
├── config/
│   ├── ticket-fields.ts                # KATEGORI_MASALAH, URGENCY_OPTIONS, dll.
│   └── device-fields.ts                # Field dinamis spesifikasi per jenis device
└── lib/
    ├── prisma.ts, supabase/ (client & server & middleware)
    ├── kode-inventaris.ts              # Generator kode: JENIS-TAHUNBULAN-URUT
    ├── lampiran.ts, lampiran-tiket.ts   # Upload ke Supabase Storage
    └── format-usia.ts                  # Hitung usia pakai perangkat
```

## 4. Schema Prisma (Model & Relasi Kunci)

> ⚠️ **Catatan penting:** nama model pakai PascalCase (`Company`, `Branch`,
> `User`, `Device`, dst.), tapi diakses di kode dengan huruf kecil di awal
> (`prisma.company`, `prisma.branch`, `prisma.user`). Field relasi JUGA
> huruf kecil (`branch.company`, bukan `branch.Company`). Ini pernah jadi
> sumber banyak bug — selalu cek `schema.prisma` asli sebelum menulis query
> baru bila ragu.

Model utama: `Company`, `Branch`, `User`, `DeviceType`, `Device`,
`DeviceAttribute` (spesifikasi dinamis), `DeviceAssignment` (riwayat
pengguna), `DevicePlacement` (riwayat penempatan), `DeviceAttachment`
(lampiran foto/dokumen device), `Ticket` (troubleshooting, dengan 3 relasi
User terpisah: pelapor/`userId`, user terkendala/`userTerkendalaId`,
teknisi/`teknisiId`), `TicketAttachment`.

Field penting yang sudah ditambahkan seiring waktu:
- `Company`: `inisial`, `noTelp`
- `User`: `noTelp`, `divisi`, `status` (default `"Aktif"`)
- `Device`: `merk`, `tipe`, `keterangan`, `kodeInventaris` (unik, auto-generate)
- `Ticket`: `noTiket` (unik, auto-generate), `kategori`, `kendala`, `diagnosa`,
  `solusi`, `catatanTeknisi`, `divisi`, `prioritas` (dipakai sebagai field
  urgency: "Tidak mengganggu pekerjaan" / "Mengganggu pekerjaan" / "Pekerjaan
  berhenti"), `status` ("Baru"/"Diproses"/"Selesai")

## 5. Fitur yang Sudah Selesai

- [x] **Tahap 0-1**: Fondasi Next.js + Tailwind + sidebar responsif
- [x] **Tahap 2**: Database Supabase + Prisma, seluruh model di atas
- [x] **Tahap 3**: Login (Supabase Auth) + middleware proteksi + logout
- [x] **Tahap 4 — CRUD Perusahaan**: tambah/edit (popup)/hapus, tabel dengan
      cari+filter+sort+pagination, halaman detail (cabang/user/device/tiket
      terkait, dengan scroll internal agar tidak memanjang tak terbatas)
- [x] **CRUD Cabang**: sama polanya dengan Perusahaan, filter per
      perusahaan & kota
- [x] **CRUD User**: status Aktif/Non-Aktif (badge bisa diklik langsung),
      filter per perusahaan/divisi/status, statistik jumlah user per
      perusahaan & divisi, halaman detail + riwayat troubleshooting (3
      peran: pelapor/terkendala/teknisi)
- [x] **CRUD Devices**: kode inventaris otomatis (format
      `JENIS-TAHUNBULAN-URUT`), field spesifikasi dinamis sesuai jenis
      (Laptop→RAM/CPU/Storage, CCTV→Resolusi/Lokasi, dll. — dikonfigurasi di
      `config/device-fields.ts`), upload foto/lampiran multi-file, usia
      pakai otomatis, halaman detail dengan 3 riwayat (pengguna, penempatan,
      troubleshooting) + galeri lampiran
- [x] **CRUD Troubleshooting**: pelapor vs user terkendala terpisah,
      dropdown perangkat otomatis terfilter sesuai user terkendala,
      kategori, urgency (3 level), teknisi, diagnosa, solusi, catatan
      teknisi, upload lampiran, halaman detail lengkap
- [x] **Dashboard**: 6 KPI (termasuk Tiket Kritis), grafik batang (device
      per perusahaan), pie (device per jenis), garis (tren tiket 6 bulan),
      daftar device & tiket terbaru
- [x] **Komponen bersama**: `FilterDropdown` (checkbox multi-pilih, pakai
      React Portal + position fixed agar tidak pernah terpotong di sisi
      layar manapun) dan `PaginationBar` (X-Y dari Z data, pemilih jumlah
      baris, navigasi halaman) — dipakai konsisten di Cabang, Devices,
      Troubleshooting, User
- [x] **Import Data massal**: import User & Devices dari file Excel
      (template otomatis dengan header biru via ExcelJS), validasi baris
      wajib, validasi duplikat nama/email/serial number (cek ke database
      DAN ke sesama baris dalam satu file), pencatatan otomatis
      DeviceAssignment & DevicePlacement saat device diimpor dengan user
      terkait

## 6. Belum Dikerjakan / Rencana Lanjutan

- [ ] Paginasi/CRUD popup untuk Cabang dipasang secara eksplisit di
      `page.tsx` (komponen `TabelCabang` sudah dibuat, perlu dicek sudah
      terhubung di halaman)
- [ ] Edit inline (tanpa popup) untuk Perusahaan/User/Devices/Troubleshooting
      — sudah dibuat sebagai paket terpisah, perlu dikonfirmasi status
      pemasangannya
- [ ] Role & permission (Admin vs Staff) — disebut di blueprint awal, belum
      diimplementasikan
- [ ] Export data ke Excel/PDF (kebalikan dari fitur import)
- [ ] Deploy ke Vercel (Tahap 7 blueprint)
- [ ] Notifikasi tiket baru
- [ ] Import untuk Perusahaan & Cabang (saat ini hanya User & Devices)

## 7. Catatan Teknis Penting (Sering Jadi Sumber Bug)

1. **Next.js Server Actions** hanya menerima *plain object* biasa. Data hasil
   parsing Excel (ExcelJS/xlsx) kadang punya prototype khusus — selalu
   sanitasi dengan `JSON.parse(JSON.stringify(data))` sebelum dikirim ke
   server action.
2. **`hargaBeli` bertipe `Decimal`** di Prisma — wajib diubah ke `Number()`
   sebelum dikirim ke Client Component, kalau tidak akan error "Only plain
   objects can be passed to Client Components".
3. **Panel dropdown/filter** yang memakai `position: absolute` bisa
   terpotong oleh `overflow-hidden`/`overflow-x-auto` di ancestor manapun.
   Solusi yang terbukti bekerja: render lewat `createPortal` ke
   `document.body` dengan `position: fixed`, koordinat dihitung dari
   `getBoundingClientRect()` tombol pemicu.
3b. **PaginationBar** harus diletakkan **di luar** wrapper
   `overflow-x-auto` milik tabel, supaya tidak ikut ter-scroll horizontal
   bersama tabel yang lebar.
4. **Generator template Excel & pembaca file upload harus pakai library
   yang sama** (ExcelJS untuk keduanya) — mencampur `xlsx` (SheetJS) dan
   `exceljs` bisa menyebabkan file gagal dibaca ulang karena perbedaan
   metadata internal `.xlsx`.
5. **Rich text dari ExcelJS** berbentuk `{ richText: [{ text: "..." }] }`,
   bukan `{ text: "..." }` langsung — kalau tidak ditangani, nilai sel bisa
   "hilang" secara diam-diam tanpa error (karena banyak field bersifat
   opsional).
6. **Sandbox coding Copilot bereset setiap sesi baru** (dan kadang di
   tengah sesi yang sama) — file yang dibuat Copilot untuk diunduh **tidak**
   otomatis tersimpan permanen di sisi Copilot. **GitHub adalah satu-satunya
   workspace permanen** yang sesungguhnya. Selalu `git add` → `git commit`
   → `git push` setelah setiap fitur selesai dipasang & diuji.

## 8. Riwayat Perubahan (Changelog Singkat)

> Tambahkan baris baru di paling atas setiap kali ada progres baru.

- **21 Agu 2026** — Validasi duplikat nama/email/serial saat import;
  perbaikan DeviceAssignment & DevicePlacement ikut tercatat saat import
  device; perbaikan pembacaan rich text Excel.
- **21 Agu 2026** — Fitur Import Data (User & Devices) dari Excel,
  template dengan header biru (ExcelJS).
- **20 Agu 2026** — Paginasi + sort alfabet + filter dropdown checkbox
  untuk Cabang, Devices, Troubleshooting, User (dengan perbaikan posisi
  filter via React Portal).
- **20 Agu 2026** — Halaman detail Perusahaan disederhanakan jadi tabel
  (bukan card), scroll internal untuk seksi dengan data banyak.
- **19-20 Agu 2026** — Status Aktif/Non-Aktif User; statistik user per
  divisi/perusahaan; riwayat troubleshooting di halaman detail User.
- **19 Agu 2026** — Kode inventaris otomatis Device; upload foto/lampiran
  multi-file (Device & Ticket); field spesifikasi dinamis per jenis
  perangkat; 3 riwayat di halaman detail Device.
- **18 Agu 2026** — CRUD Troubleshooting lengkap (pelapor/terkendala/
  teknisi, kategori, urgency, kendala, diagnosa, solusi).
- **17-18 Agu 2026** — CRUD Perusahaan, Cabang, User, Devices dasar
  (popup tambah/edit modern); Dashboard dengan grafik Recharts.
- **13-17 Agu 2026** — Setup Next.js + Tailwind + sidebar; database
  Prisma + Supabase; autentikasi login.
