import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Network,
  Users,
  MonitorSmartphone,
  Wrench,
  Building2,
} from "lucide-react";
import { urgencyColor, statusColor } from "@/config/ticket-fields";
import { DetailFormCabang } from "./detail-form";

function fmtTanggal(d: Date): string {
  return new Date(d).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function CabangDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const branchId = Number(id);

  const [branch, companies] = await Promise.all([
    prisma.branch.findUnique({
      where: { id: branchId },
      include: {
        company: { select: { id: true, nama: true, inisial: true } },
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
    }),
    prisma.company.findMany({ select: { id: true, nama: true }, orderBy: { nama: "asc" } }),
  ]);

  if (!branch) notFound();

  return (
    <div>
      <Link
        href="/cabang"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600"
      >
        <ArrowLeft className="h-4 w-4" /> Kembali ke Cabang
      </Link>

      {/* Kartu identitas cabang — langsung bisa diedit, tanpa tombol Edit terpisah */}
      <DetailFormCabang
        branch={{
          id: branch.id,
          nama: branch.nama,
          kota: branch.kota,
          companyId: branch.companyId,
        }}
        companies={companies}
        jumlahUser={branch.users.length}
        jumlahDevice={branch.devices.length}
        jumlahTiketAktif={branch.tickets.filter((t) => t.status !== "Selesai").length}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* User Terdaftar — tetap seperti semula, dengan scroll internal */}
        <Seksi
          title="User Terdaftar"
          icon={Users}
          accent="bg-amber-50 text-amber-600"
          count={branch.users.length}
        >
          {branch.users.length === 0 ? (
            <Kosong text="Belum ada user terdaftar di cabang ini." />
          ) : (
            <ul className="max-h-80 divide-y divide-slate-100 overflow-y-auto">
              {branch.users.map((u) => (
                <li key={u.id} className="py-2.5">
                  <Link
                    href={`/users/${u.id}`}
                    className="group flex items-center justify-between text-sm"
                  >
                    <span className="font-medium text-slate-700 group-hover:text-indigo-600">
                      {u.nama}
                    </span>
                    <span className="text-xs text-slate-400">{u.divisi ?? "-"}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Seksi>

        {/* Devices Terdaftar — tetap seperti semula */}
        <Seksi
          title="Devices Terdaftar"
          icon={MonitorSmartphone}
          accent="bg-indigo-50 text-indigo-600"
          count={branch.devices.length}
        >
          {branch.devices.length === 0 ? (
            <Kosong text="Belum ada perangkat terdaftar di cabang ini." />
          ) : (
            <ul className="max-h-80 divide-y divide-slate-100 overflow-y-auto">
              {branch.devices.map((d) => (
                <li key={d.id} className="py-2.5">
                  <Link
                    href={`/devices/${d.id}`}
                    className="group flex items-center justify-between text-sm"
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-medium text-slate-700 group-hover:text-indigo-600">
                        {d.nama}
                      </span>
                      {d.kodeInventaris && (
                        <span className="block font-mono text-xs text-slate-400">
                          {d.kodeInventaris}
                        </span>
                      )}
                    </span>
                    <span className="ml-2 shrink-0 text-xs text-slate-400">
                      {d.type?.nama ?? "-"}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Seksi>

        {/* Riwayat Troubleshooting — tetap seperti semula */}
        <div className="lg:col-span-2">
          <Seksi
            title="Riwayat Troubleshooting"
            icon={Wrench}
            accent="bg-rose-50 text-rose-600"
            count={branch.tickets.length}
          >
            {branch.tickets.length === 0 ? (
              <Kosong text="Belum ada tiket troubleshooting di cabang ini." />
            ) : (
              <ul className="max-h-80 divide-y divide-slate-100 overflow-y-auto">
                {branch.tickets.map((t) => (
                  <li key={t.id} className="py-2.5">
                    <Link href={`/troubleshooting/${t.id}`} className="group block">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-medium text-slate-700 group-hover:text-indigo-600">
                          {t.judul}
                        </span>
                        <span className="shrink-0 text-xs text-slate-400">
                          {fmtTanggal(t.tglLapor)}
                        </span>
                      </div>
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
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Seksi>
        </div>
      </div>
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
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <span className={"inline-flex h-8 w-8 items-center justify-center rounded-lg " + accent}>
          <Icon className="h-4 w-4" />
        </span>
        <h2 className="font-semibold text-slate-800">
          {title} <span className="text-sm font-normal text-slate-400">({count})</span>
        </h2>
      </div>
      {children}
    </div>
  );
}

function Kosong({ text }: { text: string }) {
  return <p className="py-6 text-center text-sm text-slate-400">{text}</p>;
}
