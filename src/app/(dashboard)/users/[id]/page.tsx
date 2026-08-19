import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  Network,
  Layers,
  Wrench,
  MonitorSmartphone,
} from "lucide-react";
import { urgencyColor, statusColor } from "@/config/ticket-fields";

function fmtTanggal(d: Date): string {
  return new Date(d).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// Menentukan "peran" user pada sebuah tiket (bisa lebih dari satu peran sekaligus)
function perananTiket(
  ticket: { userId: number | null; userTerkendalaId: number | null; teknisiId: number | null },
  userId: number
): string[] {
  const peran: string[] = [];
  if (ticket.userId === userId) peran.push("Pelapor");
  if (ticket.userTerkendalaId === userId) peran.push("Terkendala");
  if (ticket.teknisiId === userId) peran.push("Teknisi");
  return peran;
}

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const userId = Number(id);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      company: true,
      branch: true,
      devices: { select: { id: true, nama: true, kodeInventaris: true } },
    },
  });

  if (!user) notFound();

  // Ambil semua tiket yang berkaitan dengan user ini di peran mana pun
  const tickets = await prisma.ticket.findMany({
    where: {
      OR: [
        { userId: user.id },
        { userTerkendalaId: user.id },
        { teknisiId: user.id },
      ],
    },
    include: { device: { select: { nama: true } } },
    orderBy: { tglLapor: "desc" },
  });

  const inisial = user.nama
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div>
      <Link
        href="/users"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali ke User
      </Link>

      {/* Kartu identitas user */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center text-lg font-bold shadow-sm">
            {inisial}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-slate-800">{user.nama}</h1>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 mt-1">
              {user.email && (
                <span className="inline-flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" /> {user.email}
                </span>
              )}
              {user.noTelp && (
                <span className="inline-flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" /> {user.noTelp}
                </span>
              )}
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5 text-sm">
              <Info icon={Layers} label="Divisi" value={user.divisi ?? "-"} />
              <Info icon={Building2} label="Perusahaan" value={user.company?.nama ?? "-"} />
              <Info icon={Network} label="Cabang" value={user.branch?.nama ?? "-"} />
              <Info
                icon={MonitorSmartphone}
                label="Perangkat Dipegang"
                value={String(user.devices.length)}
              />
            </div>

            {/* Daftar perangkat yang dipegang */}
            {user.devices.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-400 mb-2">Perangkat saat ini:</p>
                <div className="flex flex-wrap gap-2">
                  {user.devices.map((d) => (
                    <Link
                      key={d.id}
                      href={`/devices/${d.id}`}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 hover:bg-indigo-50 border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:text-indigo-600 transition-colors"
                    >
                      <MonitorSmartphone className="w-3.5 h-3.5" />
                      {d.nama}
                      {d.kodeInventaris && (
                        <span className="font-mono text-slate-400">{d.kodeInventaris}</span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Riwayat Troubleshooting */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-rose-50 text-rose-600">
            <Wrench className="w-4 h-4" />
          </span>
          <h2 className="font-semibold text-slate-800">
            Riwayat Troubleshooting{" "}
            <span className="text-slate-400 font-normal text-sm">
              ({tickets.length})
            </span>
          </h2>
        </div>

        {tickets.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-8">
            Belum ada tiket troubleshooting yang berkaitan dengan user ini.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">
              <thead className="bg-slate-50 text-slate-600 text-left">
                <tr>
                  <th className="px-3 py-2">Tiket</th>
                  <th className="px-3 py-2">Peran</th>
                  <th className="px-3 py-2">Urgency</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((t) => (
                  <tr key={t.id} className="border-t border-slate-100 hover:bg-slate-50/60">
                    <td className="px-3 py-2.5">
                      <Link
                        href={`/troubleshooting/${t.id}`}
                        className="font-medium text-slate-700 hover:text-indigo-600 hover:underline"
                      >
                        {t.judul}
                      </Link>
                      <p className="text-xs text-slate-400">
                        {t.noTiket}
                        {t.device?.nama ? ` · 🖥️ ${t.device.nama}` : ""}
                      </p>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex flex-wrap gap-1">
                        {perananTiket(t, user.id).map((p) => (
                          <span
                            key={p}
                            className="inline-block rounded-full bg-indigo-50 text-indigo-600 px-2 py-0.5 text-[10px] font-medium"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className={"inline-block rounded-full px-2 py-0.5 text-[11px] font-medium " + urgencyColor(t.prioritas)}>
                        {t.prioritas}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className={"inline-block rounded-full px-2 py-0.5 text-[11px] font-medium " + statusColor(t.status)}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-slate-500 text-xs">
                      {fmtTanggal(t.tglLapor)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function Info({
  icon: Icon,
  label,
  value,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs text-slate-400 flex items-center gap-1">
        {Icon && <Icon className="w-3 h-3" />} {label}
      </p>
      <p className="text-slate-700 font-medium">{value}</p>
    </div>
  );
}
