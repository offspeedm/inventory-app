import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  MonitorSmartphone,
  User,
  Building2,
  Wrench,
  Paperclip,
  Clock,
  Tag,
  ListChecks,
} from "lucide-react";
import { hitungUsia, usiaBadgeColor } from "@/lib/format-usia";
import { urgencyColor, statusColor } from "@/config/ticket-fields";
import { TombolEditDetail } from "@/components/tombol-edit-detail";
import { FormLampiran } from "./form-lampiran";
import { GaleriLampiran } from "./galeri-lampiran";

function fmtTanggal(d: Date | null): string {
  if (!d) return "sekarang";
  return new Date(d).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function deviceStatusColor(s: string) {
  switch (s) {
    case "Aktif":
      return "bg-green-100 text-green-700";
    case "Rusak":
      return "bg-red-100 text-red-700";
    case "Perbaikan":
      return "bg-amber-100 text-amber-700";
    default:
      return "bg-slate-100 text-slate-600";
  }
}

export default async function DeviceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const deviceId = Number(id);

  const device = await prisma.device.findUnique({
    where: { id: deviceId },
    include: {
      type: true,
      company: true,
      branch: true,
      user: true,
      attributes: true,
      assignments: {
        include: { user: { select: { nama: true } } },
        orderBy: { tglMulai: "desc" },
      },
      placements: {
        include: {
          company: { select: { nama: true } },
          branch: { select: { nama: true } },
        },
        orderBy: { tglMulai: "desc" },
      },
      tickets: { orderBy: { tglLapor: "desc" } },
      attachments: { orderBy: { uploadedAt: "desc" } },
    },
  });

  if (!device) notFound();

  const harga = device.hargaBeli ? Number(device.hargaBeli) : null;
  const usia = hitungUsia(device.tglBeli);
  const warnaUsia = usiaBadgeColor(device.tglBeli);

  return (
    <div>
      <Link
        href="/devices"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali ke Devices
      </Link>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center shadow-sm">
            <MonitorSmartphone className="w-7 h-7" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-xl font-bold text-slate-800">{device.nama}</h1>
                  {device.kodeInventaris && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-800 text-white px-2.5 py-0.5 text-xs font-mono font-medium">
                      <Tag className="w-3 h-3" /> {device.kodeInventaris}
                    </span>
                  )}
                  <span
                    className={
                      "inline-block rounded-full px-2.5 py-0.5 text-xs font-medium " +
                      deviceStatusColor(device.status)
                    }
                  >
                    {device.status}
                  </span>
                  <span
                    className={
                      "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium " +
                      warnaUsia
                    }
                  >
                    <Clock className="w-3 h-3" /> {usia}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-1">
                  {[device.merk, device.tipe].filter(Boolean).join(" · ") || "—"}
                  {device.serialNumber ? ` · SN: ${device.serialNumber}` : ""}
                </p>
              </div>

              <TombolEditDetail href={`/devices?edit=${device.id}`} />
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5 text-sm">
              <Info label="Kode Inventaris" value={device.kodeInventaris ?? "-"} mono />
              <Info label="Jenis" value={device.type?.nama ?? "-"} />
              <Info label="Perusahaan" value={device.company?.nama ?? "-"} />
              <Info label="Cabang" value={device.branch?.nama ?? "-"} />
              <Info label="Pengguna Saat Ini" value={device.user?.nama ?? "-"} />
              <Info label="Tanggal Beli" value={device.tglBeli ? fmtTanggal(device.tglBeli) : "-"} />
              <Info label="Usia Pakai" value={usia} />
              <Info label="Harga Beli" value={harga ? "Rp " + harga.toLocaleString("id-ID") : "-"} />
              <Info label="Keterangan" value={device.keterangan ?? "-"} />
            </div>

            {device.attributes.length > 0 && (
              <div className="mt-5 pt-5 border-t border-slate-100">
                <div className="flex items-center gap-2 mb-3">
                  <ListChecks className="w-4 h-4 text-indigo-500" />
                  <p className="text-sm font-semibold text-slate-700">
                    Spesifikasi {device.type?.nama}
                  </p>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  {device.attributes.map((a) => (
                    <Info key={a.key} label={a.key} value={a.value ?? "-"} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600">
            <Paperclip className="w-4 h-4" />
          </span>
          <h2 className="font-semibold text-slate-800">
            Foto & Lampiran{" "}
            <span className="text-slate-400 font-normal text-sm">
              ({device.attachments.length})
            </span>
          </h2>
        </div>

        <div className="grid md:grid-cols-[280px_1fr] gap-5">
          <FormLampiran deviceId={device.id} />
          <GaleriLampiran lampiran={device.attachments} deviceId={device.id} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <RiwayatCard title="Riwayat Pengguna" icon={User} accent="text-amber-600 bg-amber-50">
          {device.assignments.length === 0 ? (
            <Kosong text="Belum ada riwayat pengguna." />
          ) : (
            <ul className="space-y-3">
              {device.assignments.map((a) => (
                <li key={a.id} className="relative pl-4 border-l-2 border-slate-100">
                  <span className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-amber-500" />
                  <p className="text-sm font-medium text-slate-700">
                    {a.user?.nama ?? "Tidak diketahui"}
                  </p>
                  <p className="text-xs text-slate-400">
                    {fmtTanggal(a.tglMulai)} — {fmtTanggal(a.tglSelesai)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </RiwayatCard>

        <RiwayatCard title="Riwayat Penempatan" icon={Building2} accent="text-emerald-600 bg-emerald-50">
          {device.placements.length === 0 ? (
            <Kosong text="Belum ada riwayat penempatan." />
          ) : (
            <ul className="space-y-3">
              {device.placements.map((p) => (
                <li key={p.id} className="relative pl-4 border-l-2 border-slate-100">
                  <span className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-emerald-500" />
                  <p className="text-sm font-medium text-slate-700">
                    {p.company?.nama ?? "-"}
                    {p.branch ? ` — ${p.branch.nama}` : ""}
                  </p>
                  <p className="text-xs text-slate-400">
                    {fmtTanggal(p.tglMulai)} — {fmtTanggal(p.tglSelesai)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </RiwayatCard>

        <RiwayatCard title="Riwayat Troubleshooting" icon={Wrench} accent="text-rose-600 bg-rose-50">
          {device.tickets.length === 0 ? (
            <Kosong text="Belum ada tiket troubleshoot." />
          ) : (
            <ul className="space-y-3">
              {device.tickets.map((t) => (
                <li key={t.id} className="relative pl-4 border-l-2 border-slate-100">
                  <span className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-rose-500" />
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
      </div>
    </div>
  );
}

function Info({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className={"text-slate-700 font-medium" + (mono ? " font-mono" : "")}>
        {value}
      </p>
    </div>
  );
}

function Kosong({ text }: { text: string }) {
  return <p className="text-sm text-slate-400 py-4 text-center">{text}</p>;
}

function RiwayatCard({
  title,
  icon: Icon,
  accent,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className={"inline-flex items-center justify-center w-8 h-8 rounded-lg " + accent}>
          <Icon className="w-4 h-4" />
        </span>
        <h2 className="font-semibold text-slate-800">{title}</h2>
      </div>
      {children}
    </div>
  );
}
