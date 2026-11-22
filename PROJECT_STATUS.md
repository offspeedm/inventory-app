# Status Proyek — Inventory App

**Terakhir diperbarui:** 22 November 2026  
**Tech Stack:** Next.js 16 (App Router + Turbopack), TypeScript, Prisma ORM, Tailwind CSS, Lucide Icons, Bcryptjs

---

## 1. Ringkasan Arsitektur & Struktur Folder

Aplikasi manajemen inventaris aset IT, pengguna, perusahaan/cabang, serta tiket troubleshooting dengan struktur berbasis Next.js App Router:

```text
src/
├── app/
│   ├── (dashboard)/
│   │   ├── dashboard/          # Ringkasan KPI, grafik distribusi, & aktivitas terbaru
│   │   ├── devices/            # Inventaris perangkat, filter slicer, & detail riwayat/lampiran
│   │   ├── jenis-devices/      # Master kategori/jenis perangkat
│   │   ├── users/              # Manajemen user, filter slicer, statistik, & riwayat aset
│   │   ├── perusahaan/         # Master data perusahaan (PT) & detail aset
│   │   ├── cabang/             # Master data cabang per perusahaan & detail aset
│   │   ├── troubleshooting/    # Manajemen tiket perbaikan/kendala & lampiran
│   │   ├── import/             # Import data massal (Excel/CSV)
│   │   └── report/             # Laporan inventaris & perangkat baru
│   ├── api/                    # Endpoint REST internal (/api/devices/[id], /api/users/[id])
│   └── login/                  # Autentikasi & manajemen sesi
├── components/                 # Komponen UI reusable (Sidebar, Header, Pagination, Charts, Modal)
├── config/                     # Konfigurasi navigasi, field dinamis perangkat, & status tiket
├── lib/                        # Utilitas Prisma, kode inventaris, nomor tiket, usia aset, & lampiran
└── middleware.ts               # Proteksi route dashboard
```

---

## 2. Status Modul & Fitur

| Modul | Route | Status | Keterangan Fitur Utama |
| :--- | :--- | :---: | :--- |
| **Autentikasi** | `/login` | Selesai | Login berbasis session (`src/lib/session.ts`) dan proteksi route via `middleware.ts`. |
| **Dashboard** | `/dashboard` | Selesai | Kartu KPI utama, grafik per jenis/perusahaan/tiket, serta log aktivitas terbaru. |
| **Inventaris Perangkat** | `/devices` & `/devices/[id]` | Selesai | CRUD perangkat, kode inventaris otomatis, field spesifikasi dinamis per jenis, filter *Excel Slicer* collapsible, pembatasan lebar kolom tabel, galeri foto/PDF lightbox, serta riwayat pengguna & penempatan. |
| **Jenis Devices** | `/jenis-devices` | Selesai | Manajemen master kategori perangkat (`DeviceType`) terintegrasi dengan form perangkat. |
| **Manajemen User** | `/users` & `/users/[id]` | Selesai | CRUD user, filter *Excel Slicer* collapsible, kartu statistik di bawah tabel, edit profil & reset password di halaman detail, serta riwayat perangkat & tiket. |
| **Perusahaan** | `/perusahaan` & `/perusahaan/[id]` | Selesai | CRUD perusahaan, ringkasan aset/user per PT, dan tampilan detail inline. |
| **Cabang** | `/cabang` & `/cabang/[id]` | Selesai | CRUD cabang terhubung ke perusahaan, pencarian, dan halaman detail cabang. |
| **Troubleshooting** | `/troubleshooting` & `/troubleshooting/[id]` | Selesai | Pencatatan tiket kendala, nomor tiket otomatis, prioritas/status, lampiran bukti, dan relasi ke perangkat/user/teknisi. |
| **Import Data** | `/import` | Selesai | Pratinjau dan import massal data inventaris. |
| **Laporan** | `/report` | Selesai | Rekap detail perangkat dan laporan perangkat baru. |

---

## 3. Pembaruan & Perbaikan Terkini

1. **Modul Master `Jenis Devices` (`/jenis-devices`)**
   - Menambahkan halaman dan server actions pengelolaan kategori perangkat.
   - Menambahkan guard validasi ID pada `src/app/(dashboard)/devices/[id]/page.tsx` (`Number.isInteger(deviceId)`) agar parameter non-numerik tidak memicu `PrismaClientValidationError`.

2. **Filter Model *Excel Slicer* & Collapsible Dropdown**
   - Menerapkan tata letak filter grid sejajar (*Perusahaan*, *Cabang* 3 sub-kolom dengan header rata tengah, *Jenis/Divisi*, dan *Status/Usia*) pada halaman **Devices** dan **User**.
   - Menambahkan fitur buka-tutup (*dropdown*) pada header kartu filter dengan indikator jumlah filter aktif dan tombol **Reset Filter**.
   - Memindahkan kartu statistik (`StatistikUser`) ke bagian bawah tabel pada halaman `/users` agar hierarki fokus langsung ke filter dan daftar data.

3. **Keterbacaan Tabel Perangkat**
   - Membatasi lebar kolom **Perangkat** (`320px`) pada `tabel-device.tsx` dan `baris-device.tsx` dengan `whitespace-normal break-words` sehingga spesifikasi panjang turun ke baris baru dan kolom **Aksi** tidak terpotong ke kanan.

4. **Persistensi State Filter & Pencarian Saat Navigasi Detail**
   - Memperbaiki format `detailQuery` (`?${rawQuery}`) pada `tabel-device.tsx` dan meneruskannya ke `baris-user.tsx` agar filter, pencarian, urutan kolom, dan halaman terakhir tetap terjaga saat pengguna masuk ke halaman detail (`/devices/[id]` atau `/users/[id]`) lalu menekan tombol kembali.

5. **Perbaikan Simpan Detail User (`/users/[id]`)**
   - Menyelaraskan payload `FormData` pada `users/[id]/detail-form.tsx` dengan `updateUser` di `users/actions.ts` (mendukung parameter `id` maupun `FormData`, validasi duplikat email, relasi perusahaan-cabang, dan pembaruan password opsional).

6. **Galeri Preview Gambar & PDF + Pop-up Lightbox (`/devices/[id]`)**
   - Memperbarui `devices/[id]/galeri-lampiran.tsx` agar file gambar (`.jpg`, `.jpeg`, `.png`, `.webp`, dll.) dan dokumen `.pdf` langsung menampilkan preview visual pada kartu lampiran.
   - Menambahkan pop-up galeri (*lightbox*) dengan navigasi tombol/keyboard (`ArrowLeft`, `ArrowRight`, `Esc`), strip thumbnail, viewer PDF interaktif, dan tombol unduh.

---

## 4. Catatan Teknis & Rekomendasi Berikutnya

- **Verifikasi Tampilan Dropdown Filter `/devices`:** Pastikan `src/app/(dashboard)/devices/tabel-device.tsx` sudah tersimpan dan lakukan hard refresh (`Ctrl + Shift + R`) atau restart dev server jika Turbopack masih menyimpan cache komponen lama.
- **Keseragaman Galeri Lampiran Tiket:** Komponen `src/app/(dashboard)/troubleshooting/[id]/galeri-lampiran.tsx` dapat disamakan dengan `devices/[id]/galeri-lampiran.tsx` agar lampiran foto dan PDF pada tiket troubleshooting juga mendukung preview kartu dan pop-up lightbox.
- **Pembersihan File Lama (Opsional):** File `src/app/(dashboard)/users/filter-dropdown.tsx` dan `src/components/filter-dropdown.tsx` dapat dihapus apabila sudah tidak di-import di halaman mana pun setelah migrasi ke filter *Excel Slicer*.