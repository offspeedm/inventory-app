// src/app/(dashboard)/dashboard/aktivitas-terbaru.tsx
import Link from "next/link";
import { MonitorSmartphone, Wrench, ArrowRight } from "lucide-react";
import { urgencyColor, statusColor } from "@/config/ticket-fields";

type DevicesTerbaru = {
  id: number;
  nama: string;
  kodeInventaris: string | null;
  status: string;
  typeNama: string | null;
  companyNama: string | null;
  branchNama: string | null;
  userNama: string | null;
};

type TiketTerbaru = {
  id: number;
  noTiket: string | null;
  judul: string;
  status: string;
  prioritas: string;
  tglLapor: Date;
  deviceNama: string | null;
  pelaporNama: string | null;
};

function deviceStatusBadge(status: string): string {
  switch (status) {
    case "Aktif":
      return "bg-green-100 text-green-700";
    case "Available":
      return "bg-sky-100 text-sky-700";
    case "Rusak":
      return "bg-orange-100 text-orange-700";
    case "Perbaikan":
      return "bg-amber-100 text-amber-700";
    case "Hilang":
      return "bg-red-100 text-red-700";
    default:
      return "bg-slate-100 text-slate-600";
  }
}

function fmtTanggalSingkat(d: Date): string {
  return new Date(d).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
  });
}

export function AktivitasTerbaru({
  devicesTerbaru,
  tiketTerbaru,
}: {
  devicesTerbaru: DevicesTerbaru[];
  tiketTerbaru: TiketTerbaru[];
}) {
  return (
    <div className="grid items-stretch gap-6 lg:grid-cols-2">
      {/* Perangkat Terbaru */}
      <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
        <div className="mb-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <MonitorSmartphone className="h-4 w-4" />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-slate-800">
                Perangkat Terbaru
              </h3>
              <p className="text-xs text-slate-400">
                5 perangkat aktif terakhir ditambahkan
              </p>
            </div>
          </div>
          <Link
            href="/devices"
            className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700"
          >
            Semua <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {devicesTerbaru.length === 0 ? (
          <p className="py-10 text-center text-sm text-slate-400">
            Belum ada perangkat.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {devicesTerbaru.map((d) => {
              const lokasi = [d.companyNama, d.branchNama]
                .filter(Boolean)
                .join(" · ");
              const meta = [d.kodeInventaris, d.typeNama, d.userNama]
                .filter(Boolean)
                .join(" · ");

              return (
                <li key={d.id} className="py-3 first:pt-1 last:pb-1">
                  <Link
                    href={`/devices/${d.id}`}
                    className="group flex items-start justify-between gap-3 text-sm"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-slate-700 transition-colors group-hover:text-indigo-600">
                        {d.nama}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-slate-400">
                        {meta || "—"}
                      </p>
                    </div>

                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <span
                        className={
                          "inline-block rounded-full px-2 py-0.5 text-[10px] font-medium " +
                          deviceStatusBadge(d.status)
                        }
                      >
                        {d.status}
                      </span>
                      <span className="max-w-[140px] truncate text-[11px] text-slate-400">
                        {lokasi || "-"}
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Tiket Terbaru */}
      <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
        <div className="mb-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
              <Wrench className="h-4 w-4" />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-slate-800">
                Tiket Terbaru
              </h3>
              <p className="text-xs text-slate-400">
                5 laporan kendala terakhir masuk
              </p>
            </div>
          </div>
          <Link
            href="/troubleshooting"
            className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700"
          >
            Semua <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {tiketTerbaru.length === 0 ? (
          <p className="py-10 text-center text-sm text-slate-400">
            Belum ada tiket troubleshoot.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {tiketTerbaru.map((t) => {
              const detail = [
                t.noTiket,
                t.deviceNama,
                t.pelaporNama,
                fmtTanggalSingkat(t.tglLapor),
              ]
                .filter(Boolean)
                .join(" · ");

              return (
                <li key={t.id} className="py-3 first:pt-1 last:pb-1">
                  <Link
                    href={`/troubleshooting/${t.id}`}
                    className="group flex items-start justify-between gap-3 text-sm"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-slate-700 transition-colors group-hover:text-indigo-600">
                        {t.judul}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-slate-400">
                        {detail || "—"}
                      </p>
                    </div>

                    <div className="flex shrink-0 flex-col items-end gap-1">
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
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
