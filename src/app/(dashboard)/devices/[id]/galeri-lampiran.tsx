// src/app/(dashboard)/devices/[id]/galeri-lampiran.tsx
"use client";

import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  FileText,
  Maximize2,
  Trash2,
  X,
} from "lucide-react";
import { hapusLampiran } from "./actions";

export type Lampiran = {
  id: number;
  fileName: string;
  fileUrl: string;
  fileType?: string | null;
};

const IMAGE_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".bmp",
  ".svg",
  ".avif",
];

function getCleanLower(value?: string | null): string {
  if (!value) return "";
  return value.split("?")[0].split("#")[0].trim().toLowerCase();
}

function isImageAttachment(item: Lampiran): boolean {
  const mime = (item.fileType ?? "").trim().toLowerCase();
  if (mime.startsWith("image/") || mime === "image") return true;

  const name = getCleanLower(item.fileName);
  const url = getCleanLower(item.fileUrl);
  return IMAGE_EXTENSIONS.some(
    (ext) => name.endsWith(ext) || url.endsWith(ext),
  );
}

function isPdfAttachment(item: Lampiran): boolean {
  const mime = (item.fileType ?? "").trim().toLowerCase();
  if (mime.includes("pdf")) return true;

  const name = getCleanLower(item.fileName);
  const url = getCleanLower(item.fileUrl);
  return name.endsWith(".pdf") || url.endsWith(".pdf");
}

export function GaleriLampiran({
  lampiran,
  deviceId,
}: {
  lampiran: Lampiran[];
  deviceId: number;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [brokenImages, setBrokenImages] = useState<Record<number, boolean>>({});

  const total = lampiran.length;
  const activeItem =
    activeIndex !== null && activeIndex >= 0 && activeIndex < total
      ? lampiran[activeIndex]
      : null;

  useEffect(() => {
    if (activeIndex === null) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setActiveIndex(null);
      } else if (e.key === "ArrowRight") {
        setActiveIndex((prev) => (prev === null ? null : (prev + 1) % total));
      } else if (e.key === "ArrowLeft") {
        setActiveIndex((prev) =>
          prev === null ? null : (prev - 1 + total) % total,
        );
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, total]);

  if (lampiran.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-slate-400">
        Belum ada foto atau lampiran untuk perangkat ini.
      </p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {lampiran.map((item, idx) => {
          const isImage = isImageAttachment(item) && !brokenImages[item.id];
          const isPdf = !isImage && isPdfAttachment(item);

          return (
            <div
              key={item.id}
              role="button"
              tabIndex={0}
              onClick={() => setActiveIndex(idx)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActiveIndex(idx);
                }
              }}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs transition hover:border-indigo-300 hover:shadow-md cursor-pointer"
            >
              {/* Area Preview Gambar / PDF / Dokumen */}
              <div className="relative h-44 w-full overflow-hidden bg-slate-50">
                {isImage ? (
                  <img
                    src={item.fileUrl}
                    alt={item.fileName}
                    loading="lazy"
                    onError={() =>
                      setBrokenImages((prev) => ({ ...prev, [item.id]: true }))
                    }
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                ) : isPdf ? (
                  <div className="relative h-full w-full overflow-hidden bg-slate-100">
                    <iframe
                      src={`${item.fileUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                      title={item.fileName}
                      className="pointer-events-none h-full w-full border-0 bg-white"
                    />
                    <span className="absolute top-2.5 left-2.5 rounded-md bg-rose-600 px-2 py-0.5 text-[10px] font-bold tracking-wide text-white shadow-xs">
                      PDF
                    </span>
                  </div>
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 text-slate-400">
                    <FileText className="h-9 w-9 text-slate-400" />
                    <span className="text-xs font-medium text-slate-500">
                      Dokumen
                    </span>
                  </div>
                )}

                {/* Overlay hover */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-slate-900/0 opacity-0 transition group-hover:bg-slate-900/25 group-hover:opacity-100">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-medium text-slate-800 shadow-sm">
                    <Maximize2 className="h-3.5 w-3.5 text-indigo-600" />
                    Lihat Preview
                  </span>
                </div>
              </div>

              {/* Footer Kartu: Nama File + Aksi Download & Hapus */}
              <div className="flex items-center justify-between gap-2 border-t border-slate-100 bg-white px-3.5 py-2.5">
                <p
                  title={item.fileName}
                  className="min-w-0 flex-1 truncate text-xs font-medium text-slate-700"
                >
                  {item.fileName}
                </p>

                <div
                  className="flex shrink-0 items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <a
                    href={item.fileUrl}
                    download={item.fileName}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Download file"
                    className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-indigo-600"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </a>

                  <form
                    action={hapusLampiran}
                    onSubmit={(e) => {
                      if (!confirm(`Hapus lampiran "${item.fileName}"?`)) {
                        e.preventDefault();
                      }
                    }}
                  >
                    <input type="hidden" name="id" value={item.id} />
                    <input type="hidden" name="device_Id" value={deviceId} />
                    <input type="hidden" name="file_Url" value={item.fileUrl} />
                    <button
                      type="submit"
                      title="Hapus lampiran"
                      className="rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= POP-UP GALLERY / LIGHTBOX ================= */}
      {activeItem && activeIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-slate-950/85 p-3 backdrop-blur-xs sm:p-6"
          onClick={() => setActiveIndex(null)}
        >
          {/* Header Modal */}
          <div
            className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 rounded-t-2xl border-b border-slate-800 bg-slate-900 px-4 py-3 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="shrink-0 rounded-md bg-indigo-600 px-2 py-0.5 text-xs font-semibold">
                {activeIndex + 1} / {total}
              </span>
              <p className="truncate text-sm font-medium text-slate-100">
                {activeItem.fileName}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
              <a
                href={activeItem.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Buka di tab baru"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:bg-slate-700"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Tab Baru</span>
              </a>

              <a
                href={activeItem.fileUrl}
                download={activeItem.fileName}
                title="Download file"
                className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-indigo-500"
              >
                <Download className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Download</span>
              </a>

              <button
                type="button"
                onClick={() => setActiveIndex(null)}
                aria-label="Tutup galeri"
                className="ml-1 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Konten Utama Modal */}
          <div
            className="relative mx-auto flex min-h-0 w-full max-w-6xl flex-1 items-center justify-center overflow-hidden bg-slate-900/95 p-3 sm:p-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Tombol Prev */}
            {total > 1 && (
              <button
                type="button"
                onClick={() =>
                  setActiveIndex((prev) =>
                    prev === null ? null : (prev - 1 + total) % total,
                  )
                }
                aria-label="Sebelumnya"
                className="absolute left-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-slate-800/90 text-white shadow-lg ring-1 ring-white/15 transition hover:bg-indigo-600 cursor-pointer"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}

            {/* Viewer: Gambar / PDF / Dokumen */}
            {isImageAttachment(activeItem) && !brokenImages[activeItem.id] ? (
              <img
                src={activeItem.fileUrl}
                alt={activeItem.fileName}
                className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
              />
            ) : isPdfAttachment(activeItem) ? (
              <iframe
                src={activeItem.fileUrl}
                title={activeItem.fileName}
                className="h-full w-full rounded-lg border border-slate-700 bg-white"
              />
            ) : (
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-700 bg-slate-800/80 px-8 py-10 text-center text-slate-200">
                <FileText className="h-12 w-12 text-slate-400" />
                <p className="text-sm font-medium">{activeItem.fileName}</p>
                <p className="text-xs text-slate-400">
                  Preview langsung tidak tersedia untuk format file ini.
                </p>
                <a
                  href={activeItem.fileUrl}
                  download={activeItem.fileName}
                  className="mt-1 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-500"
                >
                  <Download className="h-4 w-4" />
                  Download File
                </a>
              </div>
            )}

            {/* Tombol Next */}
            {total > 1 && (
              <button
                type="button"
                onClick={() =>
                  setActiveIndex((prev) =>
                    prev === null ? null : (prev + 1) % total,
                  )
                }
                aria-label="Berikutnya"
                className="absolute right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-slate-800/90 text-white shadow-lg ring-1 ring-white/15 transition hover:bg-indigo-600 cursor-pointer"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Strip Thumbnail Navigasi Bawah */}
          {total > 1 && (
            <div
              className="mx-auto flex w-full max-w-6xl items-center justify-center gap-2 overflow-x-auto rounded-b-2xl border-t border-slate-800 bg-slate-900 px-4 py-2.5"
              onClick={(e) => e.stopPropagation()}
            >
              {lampiran.map((thumb, idx) => {
                const thumbIsImg =
                  isImageAttachment(thumb) && !brokenImages[thumb.id];
                const thumbIsPdf = !thumbIsImg && isPdfAttachment(thumb);
                const selected = idx === activeIndex;

                return (
                  <button
                    key={thumb.id}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    title={thumb.fileName}
                    className={
                      "relative h-12 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition cursor-pointer " +
                      (selected
                        ? "border-indigo-500 ring-2 ring-indigo-500/40"
                        : "border-slate-700 opacity-60 hover:opacity-100")
                    }
                  >
                    {thumbIsImg ? (
                      <img
                        src={thumb.fileUrl}
                        alt={thumb.fileName}
                        className="h-full w-full object-cover"
                      />
                    ) : thumbIsPdf ? (
                      <div className="flex h-full w-full flex-col items-center justify-center bg-rose-950/70 text-[10px] font-bold text-rose-300">
                        PDF
                      </div>
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-slate-800 text-slate-300">
                        <FileText className="h-4 w-4" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </>
  );
}
