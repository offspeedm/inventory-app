// src/app/(dashboard)/users/modal-detail-user.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  X,
  Pencil,
  Laptop,
  History,
  Wrench,
  Loader2,
  ExternalLink,
} from "lucide-react";

export type UserSummary = {
  id: number;
  nama: string;
  email: string;
  jabatan: string | null;
  role: string;
  divisi: string | null;
  noTelp: string | null;
  status: string;
  companyId: number | null;
  branchId: number | null;
  company?: { id: number; nama: string } | null;
  branch?: { id: number; nama: string } | null;
};

type UserDetailResponse = UserSummary & {
  devices: {
    id: number;
    nama: string;
    kodeInventaris: string | null;
    merk: string | null;
    tipe: string | null;
    status: string;
    deviceType?: { nama: string } | null;
  }[];
  assignments: {
    id: number;
    tglMulai: string;
    tglSelesai: string | null;
    device: {
      id: number;
      nama: string;
      kodeInventaris: string | null;
      merk: string | null;
      tipe: string | null;
    };
  }[];
  tickets: {
    id: number;
    nomorTiket: string;
    judul?: string | null;
    status: string;
    createdAt: string;
    device?: {
      id: number;
      nama: string;
      kodeInventaris: string | null;
    } | null;
  }[];
};

function formatTanggal(isoDate: string | null | undefined): string {
  if (!isoDate) return "Sekarang";
  return new Date(isoDate).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getInisial(nama: string): string {
  return nama
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function ModalDetailUser({
  user,
  open,
  onClose,
  onEditClick,
}: {
  user: UserSummary;
  open: boolean;
  onClose: () => void;
  onEditClick: () => void;
}) {
  const [detail, setDetail] = useState<UserDetailResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    let active = true;
    setLoading(true);
    setErrorMsg(null);

    fetch(`/api/users/${user.id}`)
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Gagal memuat detail user.");
        return json as UserDetailResponse;
      })
      .then((data) => {
        if (active) setDetail(data);
      })
      .catch((err: Error) => {
        if (active) setErrorMsg(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [open, user.id]);

  if (!open) return null;

  const dataTampil = detail ?? user;
  const tiketAktifCount =
    detail?.tickets.filter(
      (t) =>
        t.status.toLowerCase() !== "selesai" &&
        t.status.toLowerCase() !== "closed",
    ).length ?? 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Pop-up */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
              {getInisial(dataTampil.nama)}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                {dataTampil.nama}
              </h2>
              <p className="text-xs text-slate-500">
                {dataTampil.jabatan || dataTampil.role} ·{" "}
                <span
                  className={
                    dataTampil.status === "Aktif"
                      ? "font-medium text-emerald-600"
                      : "font-medium text-rose-600"
                  }
                >
                  {dataTampil.status}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onEditClick();
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white shadow-xs transition hover:bg-indigo-700"
            >
              <Pencil className="h-4 w-4" />
              Edit User
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup pop-up"
              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-200/70 hover:text-slate-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Body Pop-up (Scrollable & Read-Only) */}
        <div className="space-y-6 overflow-y-auto p-6">
          {/* Informasi Profil Read-Only */}
          <div className="grid grid-cols-1 gap-4 rounded-xl border border-slate-200/80 bg-slate-50/40 p-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <span className="text-xs font-medium text-slate-400">Email</span>
              <p className="mt-0.5 text-sm font-medium text-slate-800 break-all">
                {dataTampil.email}
              </p>
            </div>
            <div>
              <span className="text-xs font-medium text-slate-400">
                No. Telepon
              </span>
              <p className="mt-0.5 text-sm font-medium text-slate-800">
                {dataTampil.noTelp || "-"}
              </p>
            </div>
            <div>
              <span className="text-xs font-medium text-slate-400">Divisi</span>
              <p className="mt-0.5 text-sm font-medium text-slate-800">
                {dataTampil.divisi || "-"}
              </p>
            </div>
            <div>
              <span className="text-xs font-medium text-slate-400">
                Role Sistem
              </span>
              <p className="mt-0.5 text-sm font-medium text-slate-800">
                {dataTampil.role}
              </p>
            </div>
            <div>
              <span className="text-xs font-medium text-slate-400">
                Perusahaan
              </span>
              <p className="mt-0.5 text-sm font-medium text-slate-800">
                {dataTampil.company?.nama || "-"}
              </p>
            </div>
            <div>
              <span className="text-xs font-medium text-slate-400">Cabang</span>
              <p className="mt-0.5 text-sm font-medium text-slate-800">
                {dataTampil.branch?.nama || "-"}
              </p>
            </div>
            <div>
              <span className="text-xs font-medium text-slate-400">
                Jabatan
              </span>
              <p className="mt-0.5 text-sm font-medium text-slate-800">
                {dataTampil.jabatan || "-"}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-center">
              <span className="block text-[11px] font-medium text-slate-400">
                Perangkat / Tiket Aktif
              </span>
              <span className="text-sm font-bold text-slate-800">
                {detail
                  ? `${detail.devices.length} / ${tiketAktifCount}`
                  : "..."}
              </span>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-2 py-10 text-sm text-slate-500">
              <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
              Memuat perangkat dan riwayat user...
            </div>
          ) : errorMsg ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {errorMsg}
            </div>
          ) : (
            <>
              {/* Grid 2 Kolom: Perangkat Saat Ini & Riwayat Penggunaan */}
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {/* Perangkat Terdaftar Saat Ini */}
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <Laptop className="h-4 w-4 text-indigo-600" />
                    <h3 className="text-sm font-semibold text-slate-800">
                      Perangkat Terdaftar Saat Ini (
                      {detail?.devices.length ?? 0})
                    </h3>
                  </div>

                  {!detail?.devices.length ? (
                    <p className="py-6 text-center text-xs text-slate-400">
                      Tidak ada perangkat yang terdaftar pada user ini.
                    </p>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {detail.devices.map((dev) => (
                        <div
                          key={dev.id}
                          className="flex items-start justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
                        >
                          <div>
                            <Link
                              href={`/devices/${dev.id}`}
                              className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:underline"
                            >
                              {dev.nama}
                              <ExternalLink className="h-3 w-3" />
                            </Link>
                            {dev.kodeInventaris && (
                              <p className="text-xs text-slate-500">
                                {dev.kodeInventaris}
                              </p>
                            )}
                            <p className="text-xs text-slate-400">
                              {[dev.merk, dev.tipe]
                                .filter(Boolean)
                                .join(" · ") || "-"}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="block text-xs font-medium text-slate-600">
                              {dev.deviceType?.nama || "Perangkat"}
                            </span>
                            <span className="mt-1 inline-block rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                              {dev.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Riwayat Penggunaan Perangkat */}
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <History className="h-4 w-4 text-indigo-600" />
                    <h3 className="text-sm font-semibold text-slate-800">
                      Riwayat Penggunaan Perangkat (
                      {detail?.assignments.length ?? 0})
                    </h3>
                  </div>

                  {!detail?.assignments.length ? (
                    <p className="py-6 text-center text-xs text-slate-400">
                      Belum ada riwayat penggunaan perangkat.
                    </p>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {detail.assignments.map((item) => (
                        <div
                          key={item.id}
                          className="py-2.5 first:pt-0 last:pb-0"
                        >
                          <Link
                            href={`/devices/${item.device.id}`}
                            className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:underline"
                          >
                            {item.device.nama}
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                          {item.device.kodeInventaris && (
                            <p className="text-xs text-slate-500">
                              {item.device.kodeInventaris}
                            </p>
                          )}
                          <p className="mt-0.5 text-xs text-slate-400">
                            {formatTanggal(item.tglMulai)} sampai{" "}
                            {formatTanggal(item.tglSelesai)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Riwayat Troubleshooting */}
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-rose-500" />
                  <h3 className="text-sm font-semibold text-slate-800">
                    Riwayat Troubleshooting ({detail?.tickets.length ?? 0})
                  </h3>
                </div>

                {!detail?.tickets.length ? (
                  <p className="py-6 text-center text-xs text-slate-400">
                    Belum ada tiket troubleshooting yang berkaitan dengan user
                    ini.
                  </p>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {detail.tickets.map((tiket) => (
                      <div
                        key={tiket.id}
                        className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
                      >
                        <div>
                          <Link
                            href={`/troubleshooting/${tiket.id}`}
                            className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:underline"
                          >
                            {tiket.nomorTiket}
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                          {tiket.judul && (
                            <p className="text-xs text-slate-600">
                              {tiket.judul}
                            </p>
                          )}
                          <p className="text-[11px] text-slate-400">
                            {formatTanggal(tiket.createdAt)}
                            {tiket.device ? ` · ${tiket.device.nama}` : ""}
                          </p>
                        </div>
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                          {tiket.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer Pop-up */}
        <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/70 px-6 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onEditClick();
            }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            <Pencil className="h-4 w-4" />
            Edit Data User
          </button>
        </div>
      </div>
    </div>
  );
}
