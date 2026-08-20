# 📋 PROJECT STATUS — Inventory App

> **Terakhir diperbarui:** 20 Agustus 2026
> **Pemilik:** Chairul Imam — Grup Speedmark & Afiliasi
> **Tujuan file ini:** Ringkasan progres agar sesi baru (chat/AI assistant baru) bisa langsung memahami konteks project tanpa perlu dijelaskan ulang dari awal.

---

## 🧱 Tech Stack

| Layer | Teknologi |
|---|---|
| Framework | Next.js (App Router, Server Actions) |
| Bahasa | TypeScript |
| Styling | Tailwind CSS |
| Ikon | lucide-react |
| Database | PostgreSQL (via Supabase) |
| ORM | Prisma **v6** (bukan v7 — lihat catatan masalah di bawah) |
| Auth | Supabase Auth (`@supabase/ssr`) — bukan NextAuth |
| File Storage | Supabase Storage (2 bucket terpisah) |
| Grafik | Recharts |
| Version Control | Git + GitHub |

---

## 🗺️ Roadmap — Status per Tahap

| Tahap | Nama | Status |
|---|---|---|
| 0 | Persiapan (Node.js, VS Code, Git, GitHub) | ✅ Selesai |
| 1 | Fondasi Tampilan (Tailwind, sidebar, layout) | ✅ Selesai |
| 2 | Database (Prisma + Supabase, schema, seed data master) | ✅ Selesai |
| 3 | Autentikasi (Supabase Auth, middleware, login, logout) | ✅ Selesai |
| 4 | CRUD Inti (Perusahaan, Cabang, User, Devices) | ✅ Selesai |
| 5 | Troubleshooting (tiket, lampiran, riwayat) | ✅ Selesai |
| 6 | Dashboard & Grafik (KPI, Recharts) | ✅ Selesai |
| 7 | Publikasi (Deploy ke Vercel) | ⏳ **Belum dikerjakan** |

**Progress keseluruhan: 6 dari 7 tahap besar tuntas.** Sisa pekerjaan utama: deploy ke Vercel + database cloud production, lalu uji end-to-end.

---

## 🗄️ Skema Database (Prisma) — Ringkasan Model

> Nama field pakai **camelCase** di Prisma, tersimpan sebagai **snake_case** di Postgres (via `@map`). Nama relasi memakai **PascalCase tunggal** (mis. `Company`, `Branch`) — ini penting saat menulis query `include`/`_count`.

| Model | Kolom penting | Relasi |
|---|---|---|
| `Company` | nama, alamat, noTelp, inisial | → branches, devices, tickets, users, placements |
| `Branch` | nama, kota, companyId | → devices, tickets, users, placements |
| `User` | nama, email, jabatan, role, divisi, noTelp, status, companyId, branchId | → devices, assignments; tiket via 3 relasi: `ticketsPelapor`, `ticketsTerkendala`, `ticketsTeknisi` |
| `DeviceType` | nama, kode (inisial 2 huruf, mis. "LT") | → devices |
| `Device` | nama, merk, tipe, keterangan, serialNumber, **kodeInventaris** (unik, auto-generate), tglBeli, hargaBeli (Decimal), status, typeId, companyId, branchId, userId | → attributes, assignments, placements, tickets, attachments |
| `DeviceAttribute` | key, value (field dinamis spesifikasi per jenis) | → device |
| `DeviceAssignment` | userId, tglMulai, tglSelesai (riwayat siapa memakai kapan) | → device, user |
| `DevicePlacement` | companyId, branchId, tglMulai, tglSelesai (riwayat perpindahan lokasi) | → device, company, branch |
| `DeviceAttachment` | fileName, fileUrl, fileType | → device (foto/lampiran perangkat) |
| `Ticket` | **noTiket** (unik, auto-generate), judul, kategori, kendala, diagnosa, solusi, catatanTeknisi, prioritas (dipakai sebagai **urgency**), status, tglLapor, tglSelesai, deviceId, userId (pelapor), userTerkendalaId, teknisiId, companyId, branchId | → attachments |
| `TicketAttachment` | fileName, fileUrl, fileType | → ticket (foto/lampiran tiket) |

**Field custom penting yang dibuat lewat pengembangan iteratif:**
- `Device.kodeInventaris` — otomatis dibuat format **`JENIS-TAHUNBULAN-URUT`** (mis. `LT-202601-001`), lihat `src/lib/kode-inventaris.ts`
- `Ticket.noTiket` — otomatis dibuat format **`TKT-TAHUNBULANTANGGAL-URUT`**, lihat `src/lib/no-tiket.ts`
- `Ticket.prioritas` dipakai sebagai kolom **Urgency** dengan 3 nilai: `Tidak mengganggu pekerjaan`, `Mengganggu pekerjaan`, `Pekerjaan berhenti`

---

## 🏢 Data Master (Seed)

**5 Perusahaan:**
1. PT. Speedmark Logistics Indonesia (SLI)
2. PT. Sarana Allport Cargo Services
3. PT. Glorindo Oksana Logistics
4. PT. Swift Kargonize
5. PT. CNL Logistics Indonesia

**21 Cabang** tersebar di: Jakarta, Bandung, Denpasar, Medan, Surabaya, Semarang, Cengkareng, Tanjung Priok, Bekasi.

**7 Jenis Perangkat:** Laptop (LT), Desktop (DT), Monitor (MN), Printer (PR), Router (RT), CCTV (CC), Perangkat Lainnya (LN).

Konfigurasi field spesifikasi dinamis per jenis ada di `src/config/device-fields.ts` (mis. Laptop → RAM/CPU/Storage; CCTV → Resolusi/Lokasi Pasang).

---

## 🔐 Autentikasi

- Pakai **Supabase Auth**, bukan NextAuth (menyimpang dari blueprint awal karena project sudah pakai Supabase).
- `middleware.ts` **wajib ada di dalam folder `src/`** (bukan di root project) karena project memakai struktur `src/`.
- Route publik: `/login`. Semua route lain memaksa login.
- Root layout (`src/app/layout.tsx`) bersih tanpa sidebar; sidebar+header hanya ada di `src/app/(dashboard)/layout.tsx`.
- `src/app/page.tsx` — redirect otomatis: belum login → `/login`, sudah login → `/dashboard`.
- Header menampilkan email user asli + tombol Keluar (`src/components/logout-button.tsx`), serta judul dinamis mengikuti menu aktif (`src/components/header-title.tsx`, baca dari `src/config/nav.ts`).

---

## 🧩 Struktur Fitur per Modul

Semua modul memakai pola yang konsisten:
- **Popup modal** untuk Tambah & Edit (bukan form/halaman terpisah) — dengan backdrop blur + animasi
- **Server Actions** di `actions.ts` untuk create/update/delete
- Tombol aksi berupa **ikon** (pensil edit, tempat sampah hapus, jam riwayat)
- Halaman **detail** (`[id]/page.tsx`) dengan tombol **Edit** yang mengarahkan ke `?edit=ID` di halaman list, lalu otomatis membuka modal edit (`useSearchParams` + `useEffect` di komponen baris)

### 🏢 Perusahaan (`src/app/(dashboard)/perusahaan/`)
- Tabel sederhana (bukan card) dengan kolom: Perusahaan, Alamat/Telepon, jumlah Cabang/User/Device
- Kotak pencarian
- Halaman detail: identitas + 4 seksi (Cabang Terdaftar, User Terdaftar, Devices Terdaftar, Riwayat Troubleshooting) — semua bisa diklik ke halaman terkait

### 👥 User (`src/app/(dashboard)/users/`)
- Kartu statistik: User per Perusahaan & User per Divisi (bar horizontal)
- **Tabel dengan fitur lengkap** (dikerjakan terakhir):
  - Paginasi **50 data/halaman** dengan kontrol nomor halaman
  - Sort alfabetis (klik header **Nama**, **Divisi**, **Penempatan** — toggle asc/desc)
  - **Filter dropdown checkbox** multi-pilih (Perusahaan & Divisi) — panel dirender via **React Portal** ke `document.body` dengan `position: fixed` agar tidak terpotong oleh container overflow manapun (lihat catatan masalah di bawah)
  - Scroll vertikal pada tabel dengan header sticky
- Halaman detail: identitas + perangkat yang dipegang + riwayat penggunaan perangkat + riwayat troubleshooting (peran: Pelapor/User Terkendala/Teknisi) — 3 bagian punya scroll container sendiri (`max-h-80`/`max-h-96` + `overflow-y-auto`)

### 🌿 Cabang (`src/app/(dashboard)/cabang/`)
- Tabel + pencarian + filter per Perusahaan
- Halaman detail: identitas + User Terdaftar + Devices Terdaftar + Riwayat Troubleshooting

### 💻 Devices (`src/app/(dashboard)/devices/`)
- Form Tambah/Edit lengkap: nama, jenis, merk, tipe, no. seri, **field spesifikasi dinamis** (menyesuaikan jenis), status, tgl beli, harga, Perusahaan→Cabang (berkaitan), pengguna, keterangan
- **Kode inventaris** dibuat otomatis saat submit (tidak bisa diedit manual)
- **Upload foto/lampiran** (bisa banyak file sekaligus) — Supabase Storage bucket `device-attachments`
- **Badge usia perangkat** dihitung otomatis dari tanggal beli (hijau <3th, kuning 3-5th, merah ≥5th) — lihat `src/lib/format-usia.ts`
- Halaman detail: identitas + spesifikasi + galeri lampiran + 3 riwayat (Pengguna, Penempatan, Troubleshooting — tiket bisa diklik ke detail tiket)

### 🎫 Troubleshooting (`src/app/(dashboard)/troubleshooting/`)
- Form lengkap: judul, kategori, **urgency** (3 level), status, waktu lapor, **Pelapor** & **User Terkendala** (2 field terpisah), **dropdown perangkat otomatis tersaring** berdasarkan user terkendala yang dipilih, divisi & perusahaan/cabang auto-terisi dari data user, kendala, teknisi, diagnosa, solusi, catatan teknisi, upload lampiran
- **No. tiket** dibuat otomatis saat submit
- Upload lampiran — Supabase Storage bucket `ticket-attachments` (bucket terpisah dari device!)
- Halaman detail: identitas lengkap + **Riwayat Terkait** (tiket lain untuk perangkat yang sama & user terkendala yang sama) + galeri lampiran

### 📊 Dashboard (`src/app/(dashboard)/dashboard/`)
- 6 kartu KPI: Perusahaan, Cabang, User, Devices, Tiket Aktif, **Tiket Kritis** (urgency = "Pekerjaan berhenti")
- 3 grafik Recharts: Bar (perangkat per perusahaan), Pie (komposisi per jenis), Line (tren tiket 6 bulan terakhir)
- Daftar aktivitas terbaru: 5 perangkat & 5 tiket terbaru (bisa diklik)

---

## 🧠 Utilitas Bersama (`src/lib/` & `src/config/`)

| File | Fungsi |
|---|---|
| `lib/prisma.ts` | Prisma Client singleton |
| `lib/supabase/server.ts` & `middleware.ts` | Supabase client untuk server component & middleware |
| `lib/format-usia.ts` | Hitung usia perangkat + warna badge |
| `lib/kode-inventaris.ts` | Generate kode inventaris otomatis |
| `lib/no-tiket.ts` | Generate nomor tiket otomatis |
| `lib/lampiran.ts` | Upload file ke bucket `device-attachments` |
| `lib/lampiran-tiket.ts` | Upload file ke bucket `ticket-attachments` |
| `config/device-fields.ts` | Field spesifikasi dinamis per jenis perangkat |
| `config/ticket-fields.ts` | Opsi kategori, urgency, status + fungsi warna badge |
| `components/tombol-edit-detail.tsx` | Tombol "Edit Data" seragam di semua halaman detail |

---

## ⚠️ Masalah yang Pernah Terjadi & Solusinya (Referensi Cepat)

Catatan ini penting supaya masalah yang sama tidak berulang di sesi berikutnya.

1. **Prisma ter-install v7 padahal butuh v6** → uninstall lalu install ulang dengan versi eksak `prisma@6.16.2 --save-exact`.
2. **`prisma.config.ts` bikin error saat migrate** → solusi paling aman: **hapus file itu**, biarkan Prisma baca `.env` secara default.
3. **Error P1000 (Authentication failed)** → hampir selalu karena username connection string kurang lengkap. Untuk pooler Supabase, wajib format `postgres.[PROJECT-REF]`, bukan `postgres` saja.
4. **Error P1013 (invalid port)** → biasanya password mengandung karakter spesial (`@ # & ?`) yang merusak parsing URL. Solusi: reset password jadi huruf+angka saja.
5. **Middleware tidak jalan / login tidak redirect** → `middleware.ts` **harus** ditaruh di dalam folder `src/` (karena project pakai struktur `src/`), bukan di root project.
6. **File `.env.local` tidak dibaca** → pastikan nama file benar-benar `.env.local` (ada titik di depan), bukan `env.local`.
7. **Error "Decimal objects are not supported"** saat kirim data Device (kolom `hargaBeli`) dari Server Component ke Client Component → wajib convert dengan `Number(d.hargaBeli)` sebelum dioper sebagai props.
8. **Upload lampiran gagal diam-diam (tiket tersimpan tapi lampiran kosong)** → Next.js Server Actions defaultnya membatasi body 1MB. Solusi: tambahkan di `next.config.ts`:
   ```ts
   experimental: { serverActions: { bodySizeLimit: "15mb" } }
   ```
9. **Error "Bucket not found"** saat upload lampiran tiket → bucket `ticket-attachments` di Supabase Storage belum dibuat (jangan lupa buat **2 bucket terpisah**: `device-attachments` dan `ticket-attachments`, keduanya public + policy insert/select/delete).
10. **Nama bucket typo (`ticket-attachment` vs `ticket-attachments`)** → Supabase memperlakukan nama berbeda sebagai bucket yang berbeda total. Selalu cocokkan persis dengan yang dipakai di kode.
11. **Panel filter dropdown di halaman User terpotong di layar** → root cause: panel dirender di dalam DOM yang overflow-x-auto/hidden (halaman punya scrollbar horizontal). Solusi final: render panel via **React Portal** ke `document.body` dengan `position: fixed`, posisi dihitung manual dari `getBoundingClientRect()` tombol, plus reposisi otomatis saat scroll/resize.
12. **Kurung JSX terpotong saat disalin dari chat** (mis. `{href}` atau `{async {` bukan bentuk lengkap) → selalu salin dari **file terverifikasi**, bukan dari teks chat langsung, karena tampilan chat kadang memotong sintaks JSX kompleks.

---

## 📌 Konvensi Penting untuk Prisma

- **Nama model** di query = huruf kecil tunggal: `prisma.company`, `prisma.branch`, `prisma.user`, `prisma.device`, `prisma.deviceType`, `prisma.ticket`.
- **Nama relasi** dalam `include`/`_count` mengikuti PascalCase yang didefinisikan di schema (contoh: relasi ke banyak Device dari Company bernama `devices`, bukan `Device`).
- **Field** pakai camelCase (`companyId`, `hargaBeli`, `tglLapor`), bukan snake_case, meskipun kolom database aslinya snake_case (`@map`).
- Kolom **Decimal** (`hargaBeli`) wajib di-convert `Number()` sebelum dikirim ke Client Component.
- Kolom **BigInt** (bila ada) wajib di-convert juga sebelum dikirim ke client.

---

## 🚀 Rencana Selanjutnya (Belum Dikerjakan)

- [ ] **Tahap 7 — Deploy ke Vercel**: hubungkan repo GitHub ke Vercel, set environment variables (`DATABASE_URL`, `DIRECT_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`), uji versi online.
- [ ] Terapkan paginasi + sort + filter dropdown yang sama (pola Portal) ke halaman lain bila datanya sudah banyak (Devices, Troubleshooting).
- [ ] Pertimbangkan pengetatan **Row Level Security (RLS)** di Supabase untuk production (saat ini masih kebijakan longgar untuk tahap pengembangan).
- [ ] Fitur lanjutan dari blueprint: import/export Excel, QR/barcode label, notifikasi WhatsApp/email, manajemen garansi, audit log, laporan depresiasi aset.

---

## 💾 Kebiasaan Kerja yang Disepakati

- Setiap progres besar di-commit & push ke GitHub dengan pesan commit yang jelas.
- File `.env` (Prisma) dan `.env.local` (Supabase) **tidak pernah** ikut di-push — selalu cek `git status` sebelum `git add .`.
- Kode selalu ditulis lengkap ke file lalu diverifikasi (cek kurung seimbang, tag JSX berpasangan) sebelum diberikan ke user, untuk menghindari sintaks terpotong.
- Precise, step-by-step, tanpa melewati langkah — sesuai preferensi Chairul.
