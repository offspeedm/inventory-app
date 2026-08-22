import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MonitorSmartphone, Paperclip, UserCog, Wrench } from "lucide-react";
import { urgencyColor, statusColor } from "@/config/ticket-fields";
import { DetailFormTiket } from "./detail-form";
import { FormLampiranTiket } from "./form-lampiran";
import { GaleriLampiranTiket } from "./galeri-lampiran";

function fmtTanggal(d: Date | null): string {
  if (!d) return "-";
  return new Date(d).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ticketId = Number(id);

  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    include: { attachments: { orderBy: { uploadedAt: "desc" } } },
  });

  if (!ticket) notFound();

  const [companies, branches, users, devices, riwayatPerangkat, riwayatUser] = await Promise.all([
    prisma.company.findMany({ select: { id: true, nama: true }, orderBy: { nama: "asc" } }),
    prisma.branch.findMany({
      select: { id: true, nama: true, companyId: true },
      orderBy: { nama: "asc" },
    }),
    prisma.user.findMany({
      select: { id: true, nama: true, divisi: true, companyId: true },
      orderBy: { nama: "asc" },
    }),
    prisma.device.findMany({ select: { id: true, nama: true, userId: true }, orderBy: { nama: "asc" } }),
    ticket.deviceId
      ? prisma.ticket.findMany({
          where: { deviceId: ticket.deviceId, id: { not: ticket.id } },
          select: { id: true, noTiket: true, judul: true, status: true, prioritas: true, tglLapor: true },
          orderBy: { tglLapor: "desc" },
        })
      : Promise.resolve([]),
    ticket.userTerkendalaId
      ? prisma.ticket.findMany({
          where: { userTerkendalaId: ticket.userTerkendalaId, id: { not: ticket.id } },
          select: { id: true, noTiket: true, judul: true, status: true, prioritas: true, tglLapor: true },
          orderBy: { tglLapor: "desc" },
        })
      : Promise.resolve([]),
  ]);

  const deviceTerkait = ticket.deviceId ? devices.find((d) => d.id === ticket.deviceId) : null;
  const userTerkendalaTerkait = ticket.userTerkendalaId
    ? users.find((u) => u.id === ticket.userTerkendalaId)
    : null;

  return (
    <div>
      <Link
        href="/troubleshooting"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600"
      >
        <ArrowLeft className="h-4 w-4" /> Kembali ke Troubleshooting
      </Link>

      <DetailFormTiket
        ticket={{
          id: ticket.id,
          noTiket: ticket.noTiket,
          judul: ticket.judul,
          kategori: ticket.kategori,
          kendala: ticket.kendala,
          diagnosa: ticket.diagnosa,
          solusi: ticket.solusi,
          catatanTeknisi: ticket.catatanTeknisi,
          divisi: ticket.divisi,
          prioritas: ticket.prioritas,
          status: ticket.status,
          tglLapor: ticket.tglLapor,
          deviceId: ticket.deviceId,
          userId: ticket.userId,
          userTerkendalaId: ticket.userTerkendalaId,
          teknisiId: ticket.teknisiId,
          companyId: ticket.companyId,
          branchId: ticket.branchId,
        }}
        companies={companies}
        branches={branches}
        users={users}
        devices={devices}
      />

      {(ticket.deviceId || ticket.userTerkendalaId) && (
        <div className="mb-6 grid gap-6 lg:grid-cols-2">
          {ticket.deviceId && (
            <RiwayatCard
              title={`Riwayat Perangkat: ${deviceTerkait?.nama ?? "-"}`}
              icon={MonitorSmartphone}
              accent="text-indigo-600 bg-indigo-50"
              count={riwayatPerangkat.length}
            >
              {riwayatPerangkat.length === 0 ? (
                <Kosong text="Belum ada tiket lain untuk perangkat ini." />
              ) : (
                <ul className="max-h-72 space-y-3 overflow-y-auto">
                  {riwayatPerangkat.map((t) => (
                    <li key={t.id} className="relative border-l-2 border-slate-100 pl-4">
                      <span className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-indigo-500" />
                      <Link
                        href={`/troubleshooting/${t.id}`}
                        className="text-sm font-medium text-slate-700 hover:text-indigo-600 hover:underline"
                      >
                        {t.judul}
                      </Link>
                      <p className="text-xs text-slate-400">
                        {fmtTanggal(t.tglLapor)}
                        {t.noTiket ? ` · ${t.noTiket}` : ""}
                      </p>
                      <div className="mt-1 flex gap-1.5">
                        <span
                          className={
                            "inline-block rounded-full px-2 py-0.5 text-[10px] font-medium " +
                            statusColor(t.status)
                          }
                        >
                          {t.status}
                        </span>
                        <span
                          className={
                            "inline-block rounded-full px-2 py-0.5 text-[10px] font-medium " +
                            urgencyColor(t.prioritas)
                          }
                        >
                          {t.prioritas}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </RiwayatCard>
          )}

          {ticket.userTerkendalaId && (
            <RiwayatCard
              title={`Riwayat User: ${userTerkendalaTerkait?.nama ?? "-"}`}
              icon={UserCog}
              accent="text-amber-600 bg-amber-50"
              count={riwayatUser.length}
            >
              {riwayatUser.length === 0 ? (
                <Kosong text="Belum ada tiket lain untuk user ini." />
              ) : (
                <ul className="max-h-72 space-y-3 overflow-y-auto">
                  {riwayatUser.map((t) => (
                    <li key={t.id} className="relative border-l-2 border-slate-100 pl-4">
                      <span className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-amber-500" />
                      <Link
                        href={`/troubleshooting/${t.id}`}
                        className="text-sm font-medium text-slate-700 hover:text-indigo-600 hover:underline"
                      >
                        {t.judul}
                      </Link>
                      <p className="text-xs text-slate-400">
                        {fmtTanggal(t.tglLapor)}
                        {t.noTiket ? ` · ${t.noTiket}` : ""}
                      </p>
                      <div className="mt-1 flex gap-1.5">
                        <span
                          className={
                            "inline-block rounded-full px-2 py-0.5 text-[10px] font-medium " +
                            statusColor(t.status)
                          }
                        >
                          {t.status}
                        </span>
                        <span
                          className={
                            "inline-block rounded-full px-2 py-0.5 text-[10px] font-medium " +
                            urgencyColor(t.prioritas)
                          }
                        >
                          {t.prioritas}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </RiwayatCard>
          )}
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <Paperclip className="h-4 w-4" />
          </span>
          <h2 className="font-semibold text-slate-800">
            Foto & Lampiran{" "}
            <span className="text-sm font-normal text-slate-400">
              ({ticket.attachments.length})
            </span>
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-[280px_1fr]">
          <FormLampiranTiket ticketId={ticket.id} />
          <GaleriLampiranTiket lampiran={ticket.attachments} ticketId={ticket.id} />
        </div>
      </div>
    </div>
  );
}

function RiwayatCard({
  title,
  icon: Icon,
  accent,
  count,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <span className={"inline-flex h-8 w-8 items-center justify-center rounded-lg " + accent}>
          <Icon className="h-4 w-4" />
        </span>
        <h2 className="truncate font-semibold text-slate-800">
          {title} <span className="text-sm font-normal text-slate-400">({count})</span>
        </h2>
      </div>
      {children}
    </div>
  );
}

function Kosong({ text }: { text: string }) {
  return <p className="py-4 text-center text-sm text-slate-400">{text}</p>;
}
