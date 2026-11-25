// src/app/(dashboard)/devices/[id]/page.tsx
import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Wrench, Paperclip } from "lucide-react";
import { hitungUsia, usiaBadgeColor } from "@/lib/format-usia";
import { urgencyColor, statusColor } from "@/config/ticket-fields";
import { DetailFormDevice } from "./detail-form";
import { FormLampiran } from "./form-lampiran";
import { GaleriLampiran } from "./galeri-lampiran";
import { RiwayatPenggunaCard, RiwayatPenempatanCard } from "./riwayat-device";
import { WHERE_USER_AKTIF } from "@/lib/status-filter";

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
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ id }, sp] = await Promise.all([params, searchParams]);

  if (id === "jenis-devices") {
    redirect("/jenis-devices");
  }

  const deviceId = Number(id);
  if (!Number.isInteger(deviceId) || deviceId <= 0) {
    notFound();
  }

  const backParams = new URLSearchParams();
  for (const [key, val] of Object.entries(sp)) {
    if (typeof val === "string" && val) {
      backParams.set(key, val);
    } else if (Array.isArray(val)) {
      val.forEach((v) => {
        if (v) backParams.append(key, v);
      });
    }
  }
  const backQuery = backParams.toString();
  const backHref = backQuery ? `/devices?${backQuery}` : "/devices";

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
    prisma.deviceType.findMany({
      select: { id: true, nama: true, spesifikasi: true },
      orderBy: { nama: "asc" },
    }),
    prisma.company.findMany({
      select: { id: true, nama: true },
      orderBy: { nama: "asc" },
    }),
    prisma.branch.findMany({
      select: { id: true, nama: true, companyId: true },
      orderBy: { nama: "asc" },
    }),
    prisma.user.findMany({
      where: {
        OR: [WHERE_USER_AKTIF, { devices: { some: { id: deviceId } } }],
      },
      select: { id: true, nama: true },
      orderBy: { nama: "asc" },
    }),
  ]);

  if (!device) notFound();

  const usia = hitungUsia(device.tglBeli);
  const warnaUsia = usiaBadgeColor(device.tglBeli);

  return (
    <div>
      <Link
        href={backHref}
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
        <RiwayatPenggunaCard
          deviceId={device.id}
          assignments={device.assignments}
          users={users}
        />

        <RiwayatPenempatanCard
          deviceId={device.id}
          placements={device.placements}
          companies={companies}
          branches={branches}
        />

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
              <Wrench className="h-4 w-4" />
            </span>
            <h2 className="font-semibold text-slate-800">
              Riwayat Troubleshooting
            </h2>
          </div>

          {device.tickets.length === 0 ? (
            <p className="py-4 text-center text-sm text-slate-400">
              Belum ada tiket troubleshoot.
            </p>
          ) : (
            <ul className="max-h-80 space-y-3 overflow-y-auto pr-2">
              {device.tickets.map((t) => (
                <li
                  key={t.id}
                  className="relative border-l-2 border-slate-100 pl-4"
                >
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
        </div>
      </div>
    </div>
  );
}
