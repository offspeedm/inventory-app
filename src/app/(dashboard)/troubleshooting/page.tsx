import prisma from "@/lib/prisma";
import { FormTiket } from "./form-troubleshooting";
import { BarisTiket } from "./baris-troubleshooting";

type TicketRow = {
  id: number;
  judul: string;
  deskripsi: string | null;
  prioritas: string;
  status: string;
  deviceId: number | null;
  userId: number | null;
  companyId: number | null;
  branchId: number | null;
  device: { nama: string } | null;
  user: { nama: string } | null;
  company: { nama: string } | null;
  branch: { nama: string } | null;
};

export default async function TroubleshootingPage() {
  // Data pendukung untuk pilihan di form
  const companies = await prisma.company.findMany({
    select: { id: true, nama: true },
    orderBy: { nama: "asc" },
  });

  const branches = await prisma.branch.findMany({
    select: { id: true, nama: true, companyId: true },
    orderBy: { nama: "asc" },
  });

  const devices = await prisma.device.findMany({
    select: { id: true, nama: true },
    orderBy: { nama: "asc" },
  });

  const users = await prisma.user.findMany({
    select: { id: true, nama: true },
    orderBy: { nama: "asc" },
  });

  // Ambil daftar tiket + relasinya (yang terbaru di atas)
  const tickets = await prisma.ticket.findMany({
    include: {
      device: { select: { nama: true } },
      user: { select: { nama: true } },
      company: { select: { nama: true } },
      branch: { select: { nama: true } },
    },
    orderBy: { id: "desc" },
  });

  const tiketAktif = tickets.filter((t) => t.status !== "Selesai").length;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800">Troubleshooting</h1>
      <p className="text-slate-500 mt-1 mb-4">
        Catatan kendala & tiket perbaikan. Total: {tickets.length} tiket ·{" "}
        <span className="text-amber-600 font-medium">{tiketAktif} aktif</span>.
      </p>

      {/* Form tambah tiket */}
      <FormTiket
        companies={companies}
        branches={branches}
        devices={devices}
        users={users}
      />

      {/* Tabel daftar tiket */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead className="bg-slate-50 text-slate-600 text-left">
            <tr>
              <th className="px-4 py-3 w-16">No</th>
              <th className="px-4 py-3">Kendala</th>
              <th className="px-4 py-3">Prioritas</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Penempatan / Pelapor</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {tickets.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-slate-400">
                  Belum ada tiket. Tambahkan lewat form di atas.
                </td>
              </tr>
            )}
            {tickets.map((ticket: TicketRow, i: number) => (
              <BarisTiket
                key={ticket.id}
                ticket={ticket}
                index={i}
                companies={companies}
                branches={branches}
                devices={devices}
                users={users}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
