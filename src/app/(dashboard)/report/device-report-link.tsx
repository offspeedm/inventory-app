"use client";

import { ExternalLink } from "lucide-react";
import { DeviceLinkModalTrigger } from "@/components/device-link-modal-trigger";

/**
 * Tautan perangkat di halaman Laporan: klik nama membuka pop-up detail/edit,
 * sedangkan ikon eksternal membuka halaman detail perangkat di tab baru.
 */
export function DeviceReportLink({
  deviceId,
  nama,
  kodeInventaris,
  onSaved,
}: {
  deviceId: number;
  nama: string;
  kodeInventaris?: string | null;
  onSaved?: () => void;
}) {
  return (
    <div>
      <div className="inline-flex items-center gap-1.5">
        <DeviceLinkModalTrigger
          deviceId={deviceId}
          onSaved={onSaved}
          title="Lihat detail perangkat"
          className="cursor-pointer text-left font-medium text-slate-800 hover:text-indigo-600 hover:underline"
        >
          {nama}
        </DeviceLinkModalTrigger>
        <a
          href={`/devices/${deviceId}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Buka detail perangkat di tab baru"
          aria-label={`Buka detail ${nama} di tab baru`}
          className="inline-flex shrink-0 items-center rounded p-0.5 text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600"
        >
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
      {kodeInventaris && (
        <p className="font-mono text-xs text-slate-400">{kodeInventaris}</p>
      )}
    </div>
  );
}
