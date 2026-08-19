import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Network,
  Users,
  MonitorSmartphone,
  Wrench,
  Phone,
  MapPin,
} from "lucide-react";
import { urgencyColor, statusColor } from "@/config/ticket-fields";

function fmtTanggal(d: Date): string {
  return new Date(d).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function PerusahaanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const companyId = Number(id);

  const company = await prisma.company.findUnique({
    where: { id: companyId },
    include: {
      branches: { orderBy: { nama: "asc" } },
      users: { orderBy: { nama: "asc" } },
      devices: {
        include: { type: { select: { nama: true } } },
        orderBy: { id: "desc" },
      },
      tickets: {
        include: { device: { select: { nama: true } } },
        orderBy: { tglLapor: "desc" },
      },
    },
  });

  if (!company) notFound();

  return (
    <div>
      <Link
        href="/perusahaan"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali ke Perusahaan
      </Link>

      {/* Kartu identitas perusahaan */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-lg font-bold shadow-sm">
            {company.inisial || <Building2 className="w-7 h-7" />}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-slate-800">{company.nama}</h1>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 mt-1">
              {company.alamat && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {company.alamat}
                </span>
              )}
              {company.noTelp && (
                <span className="inline-flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" /> {company.noTelp}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
              <RingkasanKecil
                icon={Network}
                label="Cabang"
                value={company.branches.length}
                color="text-emerald-600 bg-emerald-50"
              />
              <RingkasanKecil
                icon={Users}
                label="User"
                value={company.users.length}
                color="text-amber-600 bg-amber-50"
              />
              <RingkasanKecil
                icon={MonitorSmartphone}
                label="Devices"
                value={company.devices.length}
                color="text-indigo-600 bg-indigo-50"
              />
              <RingkasanKecil
                icon={Wrench}
                label="Tiket Aktif"
                value={
                  company.tickets.filter((t) => t.status !== "Selesai").length
                }
                color="text-rose-600 bg-rose-50"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Cabang Terdaftar */}
        <Seksi
          title="Cabang Terdaftar"
          icon={Network}
          accent="text-emerald-600 bg-emerald-50"
          count={company.branches.length}
        >
          {company.branches.length === 0 ? (
            <Kosong text="Belum ada cabang terdaftar." />
          ) : (
            <ul className="divide-y divide-slate-100">
              {company.branches.map((b) => (
                <li
                  key={b.id}
                  className="py-2.5 flex items-center justify-between text-sm"
                >
                  <span className="font-medium text-slate-700">{b.nama}</span>
                  <span className="text-slate-400 text-xs">
                    {b.kota ?? "-"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Seksi>

        {/* User Terdaftar */}
        <Seksi
          title="User Terdaftar"
          icon={Users}
          accent="text-amber-600 bg-amber-50"
          count={company.users.length}
        >
          {company.users.length === 0 ? (
            <Kosong text="Belum ada user terdaftar." />
          ) : (
            <ul className="divide-y divide-slate-100">
              {company.users.map((u) => (
                <li key={u.id} className="py-2.5">
                  <Link
                    href={`/users/${u.id}`}
                    className="flex items-center justify-between text-sm group"
                  >
                    <span className="font-medium text-slate-700 group-hover:text-indigo-600">
                      {u.nama}
                    </span>
                    <span className="text-slate-400 text-xs">
                      {u.divisi ?? "-"}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Seksi>

        {/* Devices Terdaftar */}
        <Seksi
          title="Devices Terdaftar"
          icon={MonitorSmartphone}
          accent="text-indigo-600 bg-indigo-50"
          count={company.devices.length}
        >
          {company.devices.length === 0 ? (
            <Kosong text="Belum ada perangkat terdaftar." />
          ) : (
            <ul className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
              {company.devices.map((d) => (
                <li key={d.id} className="py-2.5">
                  <Link
                    href={`/devices/${d.id}`}
                    className="flex items-center justify-between text-sm group"
                  >
                    <span className="min-w-0">
                      <span className="block font-medium text-slate-700 group-hover:text-indigo-600 truncate">
                        {d.nama}
                      </span>
                      {d.kodeInventaris && (
                        <span className="block text-xs font-mono text-slate-400">
                          {d.kodeInventaris}
                        </span>
                      )}
                    </span>
                    <span className="text-slate-400 text-xs shrink-0 ml-2">
                      {d.type?.nama ?? "-"}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Seksi>

        {/* Riwayat Troubleshooting */}
        <Seksi
          title="Riwayat Troubleshooting"
          icon={Wrench}
          accent="text-rose-600 bg-rose-50"
          count={company.tickets.length}
        >
          {company.tickets.length === 0 ? (
            <Kosong text="Belum ada tiket troubleshooting." />
          ) : (
            <ul className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
              {company.tickets.map((t) => (
                <li key={t.id} className="py-2.5">
                  <Link
                    href={`/troubleshooting/${t.id}`}
                    className="block group"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-slate-700 group-hover:text-indigo-600 truncate text-sm">
                        {t.judul}
                      </span>
                      <span className="text-xs text-slate-400 shrink-0">
                        {fmtTanggal(t.tglLapor)}
                      </span>
                    </div>
                    <div className="flex gap-1.5 mt-1">
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
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Seksi>
      </div>
    </div>
  );
}

function RingkasanKecil({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="rounded-lg bg-slate-50 p-3 text-center">
      <span
        className={`inline-flex items-center justify-center w-7 h-7 rounded-lg mb-1 ${color}`}
      >
        <Icon className="w-3.5 h-3.5" />
      </span>
      <p className="text-lg font-bold text-slate-800 leading-none">{value}</p>
      <p className="text-[11px] text-slate-500 mt-1">{label}</p>
    </div>
  );
}

function Seksi({
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
      <div className="flex items-center gap-2 mb-3">
        <span
          className={
            "inline-flex items-center justify-center w-8 h-8 rounded-lg " +
            accent
          }
        >
          <Icon className="w-4 h-4" />
        </span>
        <h2 className="font-semibold text-slate-800">
          {title}{" "}
          <span className="text-slate-400 font-normal text-sm">({count})</span>
        </h2>
      </div>
      {children}
    </div>
  );
}

function Kosong({ text }: { text: string }) {
  return <p className="text-sm text-slate-400 text-center py-6">{text}</p>;
}
