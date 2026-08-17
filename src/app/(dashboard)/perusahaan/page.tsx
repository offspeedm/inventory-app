import prisma from "@/lib/prisma";

export default async function PerusahaanPage() {
  // Ambil perusahaan + hitung jumlah cabang & user tiap perusahaan
  const companies = await prisma.companies.findMany({
    orderBy: { id: "asc" },
    include: {
      _count: {
        select: { branches: true, users: true },
      },
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800">Perusahaan</h1>
      <p className="text-slate-500 mt-1 mb-4">Data diambil via Prisma.</p>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 text-left">
            <tr>
              <th className="px-4 py-3 w-16">No</th>
              <th className="px-4 py-3">Nama Perusahaan</th>
              <th className="px-4 py-3 text-center">Jumlah Cabang</th>
              <th className="px-4 py-3 text-center">Jumlah User</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((c, i) => (
              <tr key={c.id} className="border-t border-slate-100">
                <td className="px-4 py-3 text-slate-500">{i + 1}</td>
                <td className="px-4 py-3 font-medium text-slate-800">
                  {c.nama}
                </td>
                <td className="px-4 py-3 text-center text-slate-600">
                  {c._count.branches}
                </td>
                <td className="px-4 py-3 text-center text-slate-600">
                  {c._count.users}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
