import prisma from "@/lib/prisma";
import { FormUser } from "./form-users";
import { BarisUser } from "./baris-users";

// Tipe data
type UserRow = {
  id: number;
  nama: string;
  email: string | null;
  jabatan: string | null;
  role: string;
  companyId: number | null;
  branchId: number | null;
  company: { nama: string } | null;
  branch: { nama: string } | null;
};

export default async function UsersPage() {
  // Ambil perusahaan & cabang (untuk pilihan di form)
  const companies = await prisma.company.findMany({
    select: { id: true, nama: true },
    orderBy: { nama: "asc" },
  });

  const branches = await prisma.branch.findMany({
    select: { id: true, nama: true, companyId: true },
    orderBy: { nama: "asc" },
  });

  // Ambil daftar user + perusahaan & cabangnya
  const users = await prisma.user.findMany({
    include: {
      company: { select: { nama: true } },
      branch: { select: { nama: true } },
    },
    orderBy: { id: "asc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800">User</h1>
      <p className="text-slate-500 mt-1 mb-4">
        Kelola pengguna aplikasi. Total: {users.length} user.
      </p>

      {/* Form tambah user */}
      <FormUser companies={companies} branches={branches} />

      {/* Tabel daftar user */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 text-left">
            <tr>
              <th className="px-4 py-3 w-16">No</th>
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">Jabatan</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Penempatan</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-slate-400">
                  Belum ada user. Tambahkan lewat form di atas.
                </td>
              </tr>
            )}
            {users.map((user: UserRow, i: number) => (
              <BarisUser
                key={user.id}
                user={user}
                index={i}
                companies={companies}
                branches={branches}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
