import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  MonitorSmartphone,
  User,
  Building2,
  Wrench,
} from "lucide-react";

function fmtTanggal(d: Date | null): string {
  if (!d) return "sekarang";
  return new Date(d).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function statusColor(s: string) {
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
    },
  });

  if (!device) notFound();

  const harga = device.hargaBeli ? Number(device.hargaBeli) : null;

  return (
    <div>
      {/* Kembali */}
      <Link
        href="/devices"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali ke Devices
      </Link>

      {/* Kartu identitas perangkat */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center shadow-sm">
            <MonitorSmartphone className="w-7 h-7" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-bold text-slate-800">
                {device.nama}
              </h1>
              <span
                className={
                  "inline-block rounded-full px-2.5 py-0.5 text-xs font-medium " +
                  statusColor(device.status)
                }
              >
                {device.status}
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              {[device.merk, device.tipe].filter(Boolean).join(" · ") || "—"}
              {device.serialNumber ? ` · SN: ${device.serialNumber}` : ""}
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5 text-sm">
              <Info label="Jenis" value={device.type?.nama ?? "-"} />
              <Info label="Perusahaan" value={device.company?.nama ?? "-"} />
              <Info label="Cabang" value={device.branch?.nama ?? "-"} />
              <Info
                label="Pengguna Saat Ini"
                value={device.user?.nama ?? "-"}
              />
              <Info
                label="Tanggal Beli"
                value={device.tglBeli ? fmtTanggal(device.tglBeli) : "-"}
              />
              <Info
                label="Harga Beli"
                value={harga ? "Rp " + harga.toLocaleString("id-ID") : "-"}
              />
              <Info label="Keterangan" value={device.keterangan ?? "-"} />
            </div>
          </div>
        </div>
      </div>

      {/* Tiga riwayat */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Riwayat Pengguna */}
        <RiwayatCard
          title="Riwayat Pengguna"
          icon={User}
          accent="text-amber-600 bg-amber-50"
        >
          {device.assignments.length === 0 ? (
            <Kosong text="Belum ada riwayat pengguna." />
          ) : (
            <ul className="space-y-3">
              {device.assignments.map((a) => (
                <li
                  key={a.id}
                  className="relative pl-4 border-l-2 border-slate-100"
                >
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

        {/* Riwayat Penempatan */}
        <RiwayatCard
          title="Riwayat Penempatan"
          icon={Building2}
          accent="text-emerald-600 bg-emerald-50"
        >
          {device.placements.length === 0 ? (
            <Kosong text="Belum ada riwayat penempatan." />
          ) : (
            <ul className="space-y-3">
              {device.placements.map((p) => (
                <li
                  key={p.id}
                  className="relative pl-4 border-l-2 border-slate-100"
                >
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

        {/* Riwayat Troubleshooting */}
        <RiwayatCard
          title="Riwayat Troubleshooting"
          icon={Wrench}
          accent="text-rose-600 bg-rose-50"
        >
          {device.tickets.length === 0 ? (
            <Kosong text="Belum ada tiket troubleshoot." />
          ) : (
            <ul className="space-y-3">
              {device.tickets.map((t) => (
                <li
                  key={t.id}
                  className="relative pl-4 border-l-2 border-slate-100"
                >
                  <span className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-rose-500" />
                  <p className="text-sm font-medium text-slate-700">
                    {t.judul}
                  </p>
                  <p className="text-xs text-slate-400">
                    {fmtTanggal(t.tglLapor)} · {t.status} · {t.prioritas}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </RiwayatCard>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-slate-700 font-medium">{value}</p>
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
        <span
          className={
            "inline-flex items-center justify-center w-8 h-8 rounded-lg " +
            accent
          }
        >
          <Icon className="w-4 h-4" />
        </span>
        <h2 className="font-semibold text-slate-800">{title}</h2>
      </div>
      {children}
    </div>
  );
}
