import prisma from "@/lib/prisma";
import { FormCabang } from "./form-cabang";
import { BarisCabang } from "./baris-cabang";

// Tipe data cabang (sesuai hasil query di bawah)
type BranchWithCompany = {
  id: number;
  nama: string;
  kota: string | null;
  companyId: number | null;
  company: { nama: string } | null;
};

export default async function CabangPage() {
  // Ambil daftar perusahaan (untuk pilihan di form)
  const companies = await prisma.company.findMany({
    select: { id: true, nama: true },
    orderBy: { nama: "asc" },
  });

  // Ambil daftar cabang + nama perusahaannya
  const branches = await prisma.branch.findMany({
    include: { company: { select: { nama: true } } },
    orderBy: { id: "asc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800">Cabang</h1>
      <p className="text-slate-500 mt-1 mb-4">
        Kelola cabang tiap perusahaan. Total: {branches.length} cabang.
      </p>

      {/* Form tambah cabang */}
      <FormCabang companies={companies} />

      {/* Tabel daftar cabang */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 text-left">
            <tr>
              <th className="px-4 py-3 w-16">No</th>
              <th className="px-4 py-3">Nama Cabang</th>
              <th className="px-4 py-3">Kota</th>
              <th className="px-4 py-3">Perusahaan</th>
            </tr>
          </thead>
          <tbody>
            {branches.map((branch: BranchWithCompany, i: number) => (
              <BarisCabang
                key={branch.id}
                branch={branch}
                index={i}
                companies={companies}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
