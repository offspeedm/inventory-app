"use client";

import { FileText, Trash2, Download } from "lucide-react";
import { hapusLampiran } from "./actions";

type Lampiran = {
  id: number;
  fileName: string;
  fileUrl: string;
  fileType: string | null;
};

export function GaleriLampiran({
  lampiran,
  deviceId,
}: {
  lampiran: Lampiran[];
  deviceId: number;
}) {
  if (lampiran.length === 0) {
    return (
      <p className="text-sm text-slate-400 text-center py-6">
        Belum ada foto atau lampiran.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {lampiran.map((file) => {
        const isImage = file.fileType?.startsWith("image/");
        return (
          <div key={file.id} className="group relative bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
            {isImage ? (
              <a href={file.fileUrl} target="_blank" rel="noopener noreferrer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={file.fileUrl} alt={file.fileName} className="w-full h-28 object-cover" />
              </a>
            ) : (
              <a
                href={file.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center h-28 gap-1 text-slate-400"
              >
                <FileText className="w-8 h-8" />
                <span className="text-[10px]">Dokumen</span>
              </a>
            )}

            <div className="p-2">
              <p className="text-xs text-slate-600 truncate" title={file.fileName}>
                {file.fileName}
              </p>
            </div>

            <div className="absolute top-1.5 right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <a
                href={file.fileUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                title="Unduh"
                className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-white/90 text-slate-600 hover:bg-white shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
              </a>
              <form action={hapusLampiran}>
                <input type="hidden" name="id" value={file.id} />
                <input type="hidden" name="device_id" value={deviceId} />
                <input type="hidden" name="file_url" value={file.fileUrl} />
                <button
                  type="submit"
                  title="Hapus"
                  className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-white/90 text-red-600 hover:bg-white shadow-sm"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        );
      })}
    </div>
  );
}
