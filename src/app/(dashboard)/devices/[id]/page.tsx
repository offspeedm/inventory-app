import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, User, Building2, Wrench, Paperclip } from "lucide-react";
import { hitungUsia, usiaBadgeColor } from "@/lib/format-usia";
import { urgencyColor, statusColor } from "@/config/ticket-fields";
import { DetailFormDevice } from "./detail-form";
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

export default async function DeviceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const deviceId = Number(id);

  const [device, deviceTypes, companies, branches, users] = await Promise.all([
    prisma.device.findUnique({
      where: { id: deviceId },
      include: {
        type: true,
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
    }),
    prisma.deviceType.findMany({ select: { id: true, nama: true }, orderBy: { nama: "asc" } }),
    prisma.company.findMany({ select: { id: true, nama: true }, orderBy: { nama: "asc" } }),
    prisma.branch.findMany({
      select: { id: true, nama: true, companyId: true },
      orderBy: { nama: "asc" },
    }),
    prisma.user.findMany({ select: { id: true, nama: true }, orderBy: { nama: "asc" } }),
  ]);

  if (!device) notFound();

  const usia = hitungUsia(device.tglBeli);
  const warnaUsia = usiaBadgeColor(device.tglBeli);

  return (
    <div>
      <Link
        href="/devices"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600"
      >
        <ArrowLeft className="h-4 w-4" /> Kembali ke Devices
      </Link>

      <DetailFormDevice
        device={{
          id: device.id,
          nama: device.nama,
          kodeInventaris: device.kodeInventaris,
          merk: device.merk,
          tipe: device.tipe,
          serialNumber: device.serialNumber,
          keterangan: device.keterangan,
          tglBeli: device.tglBeli,
          hargaBeli: device.hargaBeli ? Number(device.hargaBeli) : null,
          status: device.status,
          typeId: device.typeId,
          companyId: device.companyId,
          branchId: device.branchId,
          userId: device.userId,
          attributes: device.attributes,
        }}
        deviceTypes={deviceTypes}
        companies={companies}
        branches={branches}
        users={users}
        usia={usia}
        warnaUsia={warnaUsia}
      />

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <Paperclip className="h-4 w-4" />
          </span>
          <h2 className="font-semibold text-slate-800">
            Foto & Lampiran{" "}
            <span className="text-sm font-normal text-slate-400">
              ({device.attachments.length})
            </span>
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-[280px_1fr]">
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
                <li key={a.id} className="relative border-l-2 border-slate-100 pl-4">
                  <span className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-amber-500" />
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
                <li key={p.id} className="relative border-l-2 border-slate-100 pl-4">
                  <span className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-emerald-500" />
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
                <li key={t.id} className="relative border-l-2 border-slate-100 pl-4">
                  <span className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-rose-500" />
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
      </div>
    </div>
  );
}

function Kosong({ text }: { text: string }) {
  return <p className="py-4 text-center text-sm text-slate-400">{text}</p>;
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
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <span className={"inline-flex h-8 w-8 items-center justify-center rounded-lg " + accent}>
          <Icon className="h-4 w-4" />
        </span>
        <h2 className="font-semibold text-slate-800">{title}</h2>
      </div>
      {children}
    </div>
  );
}
