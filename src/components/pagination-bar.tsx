"use client";

/**
 * Bar paginasi yang bisa dipakai berulang di halaman mana pun.
 * Menampilkan info "X-Y dari Z data", pemilih jumlah baris per halaman,
 * dan tombol navigasi halaman (dengan nomor + ellipsis bila halaman banyak).
 *
 * PENTING: komponen ini harus diletakkan DI LUAR wrapper `overflow-x-auto`
 * yang membungkus tabel (bukan di dalamnya), supaya lebarnya mengikuti
 * container luar, bukan ikut ter-scroll bersama tabel yang lebar.
 */
export function PaginationBar({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
}: {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
}) {
  const startItem = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalItems);

  function buildPages(): (number | "...")[] {
    if (totalPages <= 1) return [1];
    const delta = 1;
    const range: number[] = [];
    for (
      let i = Math.max(2, page - delta);
      i <= Math.min(totalPages - 1, page + delta);
      i++
    ) {
      range.push(i);
    }

    const pages: (number | "...")[] = [1];
    if (range[0] > 2) pages.push("...");
    pages.push(...range);
    if (range[range.length - 1] < totalPages - 1) pages.push("...");
    pages.push(totalPages);
    return pages;
  }

  const pageNumbers = buildPages();

  return (
    <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <span>
          Menampilkan {startItem}-{endItem} dari {totalItems} data
        </span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="rounded-lg border border-slate-300 px-2 py-1 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size} / halaman
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1}
          className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Sebelumnya
        </button>

        <div className="hidden items-center gap-1 sm:flex">
          {pageNumbers.map((p, idx) =>
            p === "..." ? (
              <span key={`ellipsis-${idx}`} className="px-1.5 text-xs text-slate-400">
                ...
              </span>
            ) : (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                className={`h-7 min-w-7 rounded-lg px-2 text-xs font-medium ${
                  p === page ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {p}
              </button>
            )
          )}
        </div>

        <span className="text-xs text-slate-400 sm:hidden">
          Hal. {page} / {totalPages || 1}
        </span>

        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
          className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Berikutnya
        </button>
      </div>
    </div>
  );
}
