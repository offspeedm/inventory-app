import prisma from "@/lib/prisma";
import { FormPerusahaan } from "./form-perusahaan";
import { BarisPerusahaan } from "./baris-perusahaan";

// Tipe data perusahaan
type Company = {
  id: number;
  nama: string;
  alamat: string | null;
};

export default async function PerusahaanPage() {
  // Ambil daftar perusahaan
  const companies = await prisma.company.findMany({
    orderBy: { id: "asc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800">Perusahaan</h1>
      <p className="text-slate-500 mt-1 mb-4">
        Kelola data perusahaan. Total: {companies.length} perusahaan.
      </p>

      {/* Form tambah perusahaan */}
      <FormPerusahaan />

      {/* Tabel daftar perusahaan */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 text-left">
            <tr>
              <th className="px-4 py-3 w-16">No</th>
              <th className="px-4 py-3">Nama Perusahaan</th>
              <th className="px-4 py-3">Alamat</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company: Company, i: number) => (
              <BarisPerusahaan key={company.id} company={company} index={i} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
