import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Wrench,
  Tag,
  Paperclip,
  User,
  MonitorSmartphone,
  Building2,
  UserCog,
  History,
} from "lucide-react";
import { urgencyColor, statusColor } from "@/config/ticket-fields";
import { TombolEditDetail } from "@/components/tombol-edit-detail";
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
    include: {
      device: true,
      user: true,
      userTerkendala: true,
      teknisi: true,
      company: true,
      branch: true,
      attachments: { orderBy: { uploadedAt: "desc" } },
    },
  });

  if (!ticket) notFound();

  // ===== Riwayat tiket lain untuk PERANGKAT yang sama =====
  const riwayatPerangkat = ticket.deviceId
    ? await prisma.ticket.findMany({
        where: { deviceId: ticket.deviceId, id: { not: ticket.id } },
        select: { id: true, noTiket: true, judul: true, status: true, prioritas: true, tglLapor: true },
        orderBy: { tglLapor: "desc" },
      })
    : [];

  // ===== Riwayat tiket lain untuk USER TERKENDALA yang sama =====
  const riwayatUser = ticket.userTerkendalaId
    ? await prisma.ticket.findMany({
        where: { userTerkendalaId: ticket.userTerkendalaId, id: { not: ticket.id } },
        select: { id: true, noTiket: true, judul: true, status: true, prioritas: true, tglLapor: true },
        orderBy: { tglLapor: "desc" },
      })
    : [];

  return (
    <div>
      <Link
        href="/troubleshooting"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali ke Troubleshooting
      </Link>

      {/* Kartu identitas tiket */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-rose-500 to-orange-600 text-white flex items-center justify-center shadow-sm">
            <Wrench className="w-7 h-7" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-xl font-bold text-slate-800">{ticket.judul}</h1>
                  {ticket.noTiket && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-800 text-white px-2.5 py-0.5 text-xs font-mono font-medium">
                      <Tag className="w-3 h-3" /> {ticket.noTiket}
                    </span>
                  )}
                  <span className={"inline-block rounded-full px-2.5 py-0.5 text-xs font-medium " + urgencyColor(ticket.prioritas)}>
                    {ticket.prioritas}
                  </span>
                  <span className={"inline-block rounded-full px-2.5 py-0.5 text-xs font-medium " + statusColor(ticket.status)}>
                    {ticket.status}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-1">
                  {ticket.kategori ?? "Tanpa kategori"} · Dilaporkan {fmtTanggal(ticket.tglLapor)}
                </p>
              </div>

              <TombolEditDetail href={`/troubleshooting?edit=${ticket.id}`} />
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5 text-sm">
              <Info icon={User} label="Pelapor" value={ticket.user?.nama ?? "-"} />
              <Info icon={UserCog} label="User Terkendala" value={ticket.userTerkendala?.nama ?? "-"} />
              <Info icon={Wrench} label="Teknisi" value={ticket.teknisi?.nama ?? "Belum ditugaskan"} />
              <Info
                icon={MonitorSmartphone}
                label="Perangkat"
                value={ticket.device?.nama ?? "-"}
                href={ticket.deviceId ? `/devices/${ticket.deviceId}` : undefined}
              />
              <Info label="Divisi" value={ticket.divisi ?? "-"} />
              <Info icon={Building2} label="Perusahaan" value={ticket.company?.nama ?? "-"} />
              <Info label="Cabang" value={ticket.branch?.nama ?? "-"} />
              <Info label="Selesai Pada" value={fmtTanggal(ticket.tglSelesai)} />
            </div>
          </div>
        </div>

        {/* Detail teks panjang */}
        <div className="grid sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-100">
          <TeksPanjang label="Kendala" value={ticket.kendala} />
          <TeksPanjang label="Diagnosa" value={ticket.diagnosa} />
          <TeksPanjang label="Solusi" value={ticket.solusi} />
          <TeksPanjang label="Catatan Teknisi" value={ticket.catatanTeknisi} />
        </div>
      </div>

      {/* ===== Riwayat Troubleshooting Terkait ===== */}
      {(ticket.deviceId || ticket.userTerkendalaId) && (
        <div className="grid gap-6 lg:grid-cols-2 mb-6">
          {ticket.deviceId && (
            <RiwayatCard
              title={`Riwayat Perangkat: ${ticket.device?.nama ?? "-"}`}
              icon={MonitorSmartphone}
              accent="text-indigo-600 bg-indigo-50"
              count={riwayatPerangkat.length}
            >
              {riwayatPerangkat.length === 0 ? (
                <Kosong text="Belum ada tiket lain untuk perangkat ini." />
              ) : (
                <ul className="space-y-3 max-h-72 overflow-y-auto">
                  {riwayatPerangkat.map((t) => (
                    <li key={t.id} className="relative pl-4 border-l-2 border-slate-100">
                      <span className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-indigo-500" />
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
                      <div className="flex gap-1.5 mt-1">
                        <span className={"inline-block rounded-full px-2 py-0.5 text-[10px] font-medium " + statusColor(t.status)}>
                          {t.status}
                        </span>
                        <span className={"inline-block rounded-full px-2 py-0.5 text-[10px] font-medium " + urgencyColor(t.prioritas)}>
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
              title={`Riwayat User: ${ticket.userTerkendala?.nama ?? "-"}`}
              icon={UserCog}
              accent="text-amber-600 bg-amber-50"
              count={riwayatUser.length}
            >
              {riwayatUser.length === 0 ? (
                <Kosong text="Belum ada tiket lain untuk user ini." />
              ) : (
                <ul className="space-y-3 max-h-72 overflow-y-auto">
                  {riwayatUser.map((t) => (
                    <li key={t.id} className="relative pl-4 border-l-2 border-slate-100">
                      <span className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-amber-500" />
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
                      <div className="flex gap-1.5 mt-1">
                        <span className={"inline-block rounded-full px-2 py-0.5 text-[10px] font-medium " + statusColor(t.status)}>
                          {t.status}
                        </span>
                        <span className={"inline-block rounded-full px-2 py-0.5 text-[10px] font-medium " + urgencyColor(t.prioritas)}>
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

      {/* Foto & Lampiran */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600">
            <Paperclip className="w-4 h-4" />
          </span>
          <h2 className="font-semibold text-slate-800">
            Foto & Lampiran{" "}
            <span className="text-slate-400 font-normal text-sm">
              ({ticket.attachments.length})
            </span>
          </h2>
        </div>

        <div className="grid md:grid-cols-[280px_1fr] gap-5">
          <FormLampiranTiket ticketId={ticket.id} />
          <GaleriLampiranTiket lampiran={ticket.attachments} ticketId={ticket.id} />
        </div>
      </div>
    </div>
  );
}

function Info({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div>
      <p className="text-xs text-slate-400 flex items-center gap-1">
        {Icon && <Icon className="w-3 h-3" />} {label}
      </p>
      <p className={"font-medium " + (href ? "text-indigo-600 hover:underline" : "text-slate-700")}>
        {value}
      </p>
    </div>
  );
  return href ? <Link href={href}>{content}</Link> : content;
}

function TeksPanjang({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <p className="text-sm text-slate-700 whitespace-pre-line">
        {value || <span className="text-slate-300 italic">Belum diisi</span>}
      </p>
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
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className={"inline-flex items-center justify-center w-8 h-8 rounded-lg " + accent}>
          <Icon className="w-4 h-4" />
        </span>
        <h2 className="font-semibold text-slate-800 truncate">
          {title} <span className="text-slate-400 font-normal text-sm">({count})</span>
        </h2>
      </div>
      {children}
    </div>
  );
}

function Kosong({ text }: { text: string }) {
  return <p className="text-sm text-slate-400 py-4 text-center">{text}</p>;
}
