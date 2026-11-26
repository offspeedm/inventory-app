import prisma from "@/lib/prisma";
import { ImportDataView } from "./import-data-view";
import { getFieldsForType } from "@/config/device-fields";
import { WHERE_USER_AKTIF } from "@/lib/status-filter";

// Batas maksimal user aktif untuk dimasukkan ke dropdown template Excel.
// Jika melebihi angka ini, dropdown Pengguna dibatalkan agar aplikasi & file Excel tetap ringan.
const BATAS_MAKSIMAL_USER = 1000;

// Daftar divisi standar aplikasi (sama dengan form Tambah/Edit User)
const DEFAULT_DIVISI = [
  "Operational",
  "Finance - Accounting",
  "Admin - HR",
  "Billing",
  "IT-CI-BD",
  "Sales",
  "Management",
  "Messenger",
  "Others",
];

export default async function ImportDataPage() {
  const [deviceTypesRaw, companiesRaw, branchesRaw, divisiRaw, totalUserAktif] =
    await Promise.all([
      prisma.deviceType.findMany({
        select: { nama: true },
        orderBy: { nama: "asc" },
      }),
      prisma.company.findMany({
        select: { id: true, nama: true },
        orderBy: { nama: "asc" },
      }),
      prisma.branch.findMany({
        select: { nama: true, companyId: true },
        orderBy: { nama: "asc" },
      }),
      prisma.user.findMany({
        where: { divisi: { not: null } },
        distinct: ["divisi"],
        select: { divisi: true },
      }),
      prisma.user.count({
        where: WHERE_USER_AKTIF,
      }),
    ]);

  const userTerlaluBanyak = totalUserAktif > BATAS_MAKSIMAL_USER;

  const usersRaw = userTerlaluBanyak
    ? []
    : await prisma.user.findMany({
        where: WHERE_USER_AKTIF,
        select: { nama: true },
        orderBy: { nama: "asc" },
      });

  const jenisSpesifikasiMap: Record<string, string[]> = {};
  for (const dt of deviceTypesRaw) {
    jenisSpesifikasiMap[dt.nama] = getFieldsForType(dt.nama);
  }

  const daftarPerusahaan = companiesRaw.map((c) => c.nama);

  // Kelompokkan daftar cabang berdasarkan nama perusahaan (PT)
  const cabangPerPerusahaan: Record<string, string[]> = {};
  for (const c of companiesRaw) {
    const cabangMilikPt = branchesRaw
      .filter((b) => b.companyId === c.id)
      .map((b) => b.nama);
    cabangPerPerusahaan[c.nama] = Array.from(new Set(cabangMilikPt));
  }

  // Gabungkan daftar divisi standar dengan divisi unik yang sudah tersimpan di database
  const divisiSet = new Set<string>(DEFAULT_DIVISI);
  for (const u of divisiRaw) {
    const d = u.divisi?.trim();
    if (d) divisiSet.add(d);
  }
  const daftarDivisi = Array.from(divisiSet);

  const daftarPengguna = usersRaw.map((u) => u.nama);

  return (
    <ImportDataView
      jenisSpesifikasiMap={jenisSpesifikasiMap}
      daftarPerusahaan={daftarPerusahaan}
      cabangPerPerusahaan={cabangPerPerusahaan}
      daftarDivisi={daftarDivisi}
      daftarPengguna={daftarPengguna}
      userDropdownDibatalkan={userTerlaluBanyak}
      batasMaksimalUser={BATAS_MAKSIMAL_USER}
    />
  );
}
