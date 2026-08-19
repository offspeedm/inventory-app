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
} from "lucide-react";
import { urgencyColor, statusColor } from "@/config/ticket-fields";
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
            <div className="flex items-center gap-3 flex-wrap">
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
