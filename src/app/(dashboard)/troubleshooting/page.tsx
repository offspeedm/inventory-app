import { Suspense } from "react";
import prisma from "@/lib/prisma";
import { FormTiket } from "./form-troubleshooting";
import { TabelTiket } from "./tabel-troubleshooting";
import { Wrench } from "lucide-react";

export default async function TroubleshootingPage() {
  const [companies, branches, devices, users, tickets] = await Promise.all([
    prisma.company.findMany({ select: { id: true, nama: true }, orderBy: { nama: "asc" } }),
    prisma.branch.findMany({ select: { id: true, nama: true, companyId: true }, orderBy: { nama: "asc" } }),
    prisma.device.findMany({ select: { id: true, nama: true, userId: true }, orderBy: { nama: "asc" } }),
    prisma.user.findMany({
      select: { id: true, nama: true, divisi: true, companyId: true, branchId: true },
      orderBy: { nama: "asc" },
    }),
    prisma.ticket.findMany({
      include: {
        device: { select: { nama: true } },
        user: { select: { nama: true } },
        userTerkendala: { select: { nama: true } },
        teknisi: { select: { nama: true } },
        company: { select: { nama: true } },
        branch: { select: { nama: true } },
        _count: { select: { attachments: true } },
      },
      orderBy: { id: "desc" },
    }),
  ]);

  const ticketsFlat = tickets.map((t) => ({
    ...t,
    attachmentsCount: t._count.attachments,
  }));

  const tiketAktif = ticketsFlat.filter((t) => t.status !== "Selesai").length;

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-rose-500 to-orange-600 text-white shadow-sm">
          <Wrench className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Troubleshooting</h1>
          <p className="text-slate-500 text-sm">
            Total: {ticketsFlat.length} tiket ·{" "}
            <span className="text-amber-600 font-medium">{tiketAktif} aktif</span>
          </p>
        </div>
      </div>

      <FormTiket companies={companies} branches={branches} devices={devices} users={users} />

      <Suspense fallback={<p className="text-sm text-slate-400">Memuat data…</p>}>
        <TabelTiket
          tickets={ticketsFlat}
          companies={companies}
          branches={branches}
          devices={devices}
          users={users}
        />
      </Suspense>
    </div>
  );
}
