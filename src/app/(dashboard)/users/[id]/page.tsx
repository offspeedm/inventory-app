import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Layers,
  Mail,
  MonitorSmartphone,
  Network,
  Phone,
  UserRound,
  Wrench,
} from "lucide-react";
import { statusColor, urgencyColor } from "@/config/ticket-fields";
import { TombolEditDetail } from "@/components/tombol-edit-detail";

function formatTanggal(value: Date | null): string {
  if (!value) return "Sekarang";
  return new Date(value).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function peranDalamTiket(
  tiket: {
    userId: number | null;
    userTerkendalaId: number | null;
    teknisiId: number | null;
  },
  userId: number
): string[] {
  const peran: string[] = [];
  if (tiket.userId === userId) peran.push("Pelapor");
  if (tiket.userTerkendalaId === userId) peran.push("User terkendala");
  if (tiket.teknisiId === userId) peran.push("Teknisi");
  return peran;
}

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const userId = Number(id);

  const [user, riwayatPerangkat, tiket] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      include: {
        company: { select: { id: true, nama: true, inisial: true } },
        branch: { select: { id: true, nama: true, kota: true } },
        devices: {
          select: {
            id: true,
            nama: true,
            kodeInventaris: true,
            merk: true,
            tipe: true,
            status: true,
            type: { select: { nama: true } },
          },
          orderBy: { nama: "asc" },
        },
      },
    }),
    prisma.deviceAssignment.findMany({
      where: { userId },
      include: {
        device: {
          select: { id: true, nama: true, kodeInventaris: true },
        },
      },
      orderBy: { tglMulai: "desc" },
    }),
    prisma.ticket.findMany({
      where: {
        OR: [{ userId }, { userTerkendalaId: userId }, { teknisiId: userId }],
      },
      include: {
        device: { select: { id: true, nama: true } },
      },
      orderBy: { tglLapor: "desc" },
    }),
  ]);

  if (!user) notFound();

  const inisial = user.nama
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((kata) => kata[0])
    .join("")
    .toUpperCase();

  const tiketAktif = tiket.filter((t) => t.status !== "Selesai").length;

  return (
    <div>
      <Link
        href="/users"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke User
      </Link>

      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-lg font-bold text-white shadow-sm">
            {inisial || <UserRound className="h-7 w-7" />}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="text-xl font-bold text-slate-800">{user.nama}</h1>
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                  {user.email && (
                    <span className="inline-flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5" />
                      {user.email}
                    </span>
                  )}
                  {user.noTelp && (
                    <span className="inline-flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5" />
                      {user.noTelp}
                    </span>
                  )}
                </div>
              </div>

              <TombolEditDetail href={`/users?edit=${user.id}`} />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-5">
              <Ringkasan
                icon={Layers}
                label="Divisi"
                value={user.divisi ?? "-"}
                color="bg-amber-50 text-amber-600"
              />
              <Ringkasan
                icon={Building2}
                label="Perusahaan"
                value={user.company?.inisial ?? user.company?.nama ?? "-"}
                color="bg-blue-50 text-blue-600"
                href={user.company ? `/perusahaan/${user.company.id}` : undefined}
              />
              <Ringkasan
                icon={Network}
                label="Cabang"
                value={user.branch?.nama ?? "-"}
                color="bg-emerald-50 text-emerald-600"
                href={user.branch ? `/cabang/${user.branch.id}` : undefined}
              />
              <Ringkasan
                icon={MonitorSmartphone}
                label="Perangkat Aktif"
                value={String(user.devices.length)}
                color="bg-indigo-50 text-indigo-600"
              />
              <Ringkasan
                icon={Wrench}
                label="Tiket Aktif"
                value={String(tiketAktif)}
                color="bg-rose-50 text-rose-600"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <Seksi
          title="Perangkat Terdaftar Saat Ini"
          icon={MonitorSmartphone}
          count={user.devices.length}
          accent="bg-indigo-50 text-indigo-600"
        >
          {user.devices.length === 0 ? (
            <Kosong text="Belum ada perangkat yang terdaftar pada user ini." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-sm">
                <thead className="bg-slate-50 text-left text-slate-600">
                  <tr>
                    <th className="px-3 py-2">Perangkat</th>
                    <th className="px-3 py-2">Jenis</th>
                    <th className="px-3 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {user.devices.map((device) => (
                    <tr key={device.id} className="border-t border-slate-100">
                      <td className="px-3 py-2.5">
                        <Link
                          href={`/devices/${device.id}`}
                          className="font-medium text-slate-700 hover:text-indigo-600 hover:underline"
                        >
                          {device.nama}
                        </Link>
                        <p className="text-xs font-mono text-slate-400">
                          {device.kodeInventaris ?? "Tanpa kode inventaris"}
                        </p>
                        <p className="text-xs text-slate-400">
                          {[device.merk, device.tipe].filter(Boolean).join(" · ") || "-"}
                        </p>
                      </td>
                      <td className="px-3 py-2.5 text-slate-600">
                        {device.type?.nama ?? "-"}
                      </td>
                      <td className="px-3 py-2.5">
                        <span className="inline-block rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                          {device.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Seksi>

        <Seksi
          title="Riwayat Penggunaan Perangkat"
          icon={MonitorSmartphone}
          count={riwayatPerangkat.length}
          accent="bg-violet-50 text-violet-600"
        >
          {riwayatPerangkat.length === 0 ? (
            <Kosong text="Belum ada riwayat penggunaan perangkat." />
          ) : (
            <ul className="max-h-96 divide-y divide-slate-100 overflow-y-auto">
              {riwayatPerangkat.map((item) => (
                <li key={item.id} className="py-3">
                  <Link
                    href={`/devices/${item.device.id}`}
                    className="font-medium text-slate-700 hover:text-indigo-600 hover:underline"
                  >
                    {item.device.nama}
                  </Link>
                  <p className="text-xs font-mono text-slate-400">
                    {item.device.kodeInventaris ?? "Tanpa kode inventaris"}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {formatTanggal(item.tglMulai)} sampai {formatTanggal(item.tglSelesai)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Seksi>
      </div>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
            <Wrench className="h-4 w-4" />
          </span>
          <h2 className="font-semibold text-slate-800">
            Riwayat Troubleshooting
            <span className="ml-1 font-normal text-slate-400">({tiket.length})</span>
          </h2>
        </div>

        {tiket.length === 0 ? (
          <Kosong text="Belum ada tiket troubleshooting yang berkaitan dengan user ini." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-sm">
              <thead className="bg-slate-50 text-left text-slate-600">
                <tr>
                  <th className="px-3 py-2">Tiket</th>
                  <th className="px-3 py-2">Peran</th>
                  <th className="px-3 py-2">Perangkat</th>
                  <th className="px-3 py-2">Urgency</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {tiket.map((item) => (
                  <tr key={item.id} className="border-t border-slate-100 hover:bg-slate-50/60">
                    <td className="px-3 py-2.5">
                      <Link
                        href={`/troubleshooting/${item.id}`}
                        className="font-medium text-slate-700 hover:text-indigo-600 hover:underline"
                      >
                        {item.judul}
                      </Link>
                      <p className="text-xs font-mono text-slate-400">
                        {item.noTiket ?? "Tanpa nomor tiket"}
                      </p>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex flex-wrap gap-1">
                        {peranDalamTiket(item, user.id).map((peran) => (
                          <span
                            key={peran}
                            className="inline-block rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-600"
                          >
                            {peran}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      {item.device ? (
                        <Link
                          href={`/devices/${item.device.id}`}
                          className="text-slate-600 hover:text-indigo-600 hover:underline"
                        >
                          {item.device.nama}
                        </Link>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-3 py-2.5">
                      <span
                        className={
                          "inline-block rounded-full px-2 py-0.5 text-[11px] font-medium " +
                          urgencyColor(item.prioritas)
                        }
                      >
                        {item.prioritas}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span
                        className={
                          "inline-block rounded-full px-2 py-0.5 text-[11px] font-medium " +
                          statusColor(item.status)
                        }
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-xs text-slate-500">
                      {formatTanggal(item.tglLapor)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function Ringkasan({
  icon: Icon,
  label,
  value,
  color,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  color: string;
  href?: string;
}) {
  const isi = (
    <div className="rounded-lg bg-slate-50 p-3">
      <span
        className={`mb-1 inline-flex h-7 w-7 items-center justify-center rounded-lg ${color}`}
      >
        <Icon className="h-3.5 w-3.5" />
      </span>
      <p className="truncate text-sm font-semibold text-slate-800">{value}</p>
      <p className="text-[11px] text-slate-500">{label}</p>
    </div>
  );

  return href ? <Link href={href}>{isi}</Link> : isi;
}

function Seksi({
  title,
  icon: Icon,
  count,
  accent,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  count: number;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${accent}`}>
          <Icon className="h-4 w-4" />
        </span>
        <h2 className="font-semibold text-slate-800">
          {title}
          <span className="ml-1 font-normal text-slate-400">({count})</span>
        </h2>
      </div>
      {children}
    </section>
  );
}

function Kosong({ text }: { text: string }) {
  return <p className="py-8 text-center text-sm text-slate-400">{text}</p>;
}
