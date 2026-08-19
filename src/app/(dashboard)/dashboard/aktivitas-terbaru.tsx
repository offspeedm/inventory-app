import Link from "next/link";
import { MonitorSmartphone, Wrench } from "lucide-react";
import { urgencyColor, statusColor } from "@/config/ticket-fields";

type DevicesTerbaru = {
  id: number;
  nama: string;
  kodeInventaris: string | null;
  companyNama: string | null;
};

type TiketTerbaru = {
  id: number;
  noTiket: string | null;
  judul: string;
  status: string;
  prioritas: string;
};

function fmtTanggalSingkat(d: Date): string {
  return new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "short" });
}

export function AktivitasTerbaru({
  devicesTerbaru,
  tiketTerbaru,
}: {
  devicesTerbaru: DevicesTerbaru[];
  tiketTerbaru: TiketTerbaru[];
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Perangkat terbaru */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600">
            <MonitorSmartphone className="w-4 h-4" />
          </span>
          <h3 className="font-semibold text-slate-800">Perangkat Terbaru</h3>
        </div>
        {devicesTerbaru.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">
            Belum ada perangkat.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {devicesTerbaru.map((d) => (
              <li key={d.id} className="py-2.5">
                <Link
                  href={`/devices/${d.id}`}
                  className="flex items-center justify-between gap-3 text-sm group"
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
                  <span className="shrink-0 text-xs text-slate-400">
                    {d.companyNama ?? "-"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Tiket terbaru */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-rose-50 text-rose-600">
            <Wrench className="w-4 h-4" />
          </span>
          <h3 className="font-semibold text-slate-800">Tiket Terbaru</h3>
        </div>
        {tiketTerbaru.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">
            Belum ada tiket troubleshoot.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {tiketTerbaru.map((t) => (
              <li key={t.id} className="py-2.5">
                <Link
                  href={`/troubleshooting/${t.id}`}
                  className="flex items-center justify-between gap-3 text-sm group"
                >
                  <span className="min-w-0">
                    <span className="block font-medium text-slate-700 group-hover:text-indigo-600 truncate">
                      {t.judul}
                    </span>
                    {t.noTiket && (
                      <span className="block text-xs font-mono text-slate-400">
                        {t.noTiket}
                      </span>
                    )}
                  </span>
                  <span className="shrink-0 flex gap-1">
                    <span className={"inline-block rounded-full px-2 py-0.5 text-[10px] font-medium " + statusColor(t.status)}>
                      {t.status}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
