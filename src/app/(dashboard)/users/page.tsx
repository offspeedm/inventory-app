import prisma from "@/lib/prisma";
import { FormUser } from "./form-user";
import { BarisUser } from "./baris-user";

export default async function UsersPage() {
  const [companies, branches, users] = await Promise.all([
    prisma.company.findMany({
      select: { id: true, nama: true },
      orderBy: { nama: "asc" },
    }),
    prisma.branch.findMany({
      select: { id: true, nama: true, companyId: true },
      orderBy: { nama: "asc" },
    }),
    prisma.user.findMany({
      orderBy: { id: "asc" },
      include: { company: true, branch: true },
    }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800">User</h1>
      <p className="text-slate-500 mt-1 mb-4">Kelola pengguna aplikasi.</p>

      <FormUser companies={companies} branches={branches} />

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 text-left">
            <tr>
              <th className="px-4 py-3 w-16">No</th>
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Jabatan</th>
              <th className="px-4 py-3">Perusahaan</th>
              <th className="px-4 py-3">Cabang</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <BarisUser
                key={u.id}
                user={u as any}
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
