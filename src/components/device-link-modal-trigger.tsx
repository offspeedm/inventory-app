// src/components/device-link-modal-trigger.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  X,
  Pencil,
  Laptop,
  History,
  Paperclip,
  Wrench,
  Loader2,
  ArrowLeft,
  Save,
} from "lucide-react";
import { statusColor, urgencyColor } from "@/config/ticket-fields";

type DeviceDetailData = {
  id: number;
  nama: string;
  kodeInventaris: string | null;
  merk: string | null;
  tipe: string | null;
  serialNumber: string | null;
  tglBeli: string | null;
  status: string;
  keterangan: string | null;
  typeId: number | null;
  companyId: number | null;
  branchId: number | null;
  userId: number | null;
  type?: { id: number; nama: string } | null;
  company?: { id: number; nama: string } | null;
  branch?: { id: number; nama: string } | null;
  user?: {
    id: number;
    nama: string;
    email: string;
    divisi?: string | null;
  } | null;
  attributes?: Record<string, unknown>[];
  attachments?: {
    id: number | string;
    fileName?: string;
    fileUrl?: string;
  }[];
  assignments?: {
    id: number;
    tglMulai: string;
    tglSelesai: string | null;
    user?: { id: number; nama: string } | null;
  }[];
  tickets?: {
    id: number;
    noTiket: string | null;
    judul: string;
    prioritas: string;
    status: string;
    tglLapor: string;
    teknisi?: { id: number; nama: string } | null;
    userTerkendala?: { id: number; nama: string } | null;
  }[];
};

type MasterOptions = {
  deviceTypes: { id: number; nama: string }[];
  companies: { id: number; nama: string }[];
  branches: { id: number; nama: string; companyId?: number | null }[];
  users: { id: number; nama: string }[];
};

function formatTanggal(iso: string | null | undefined): string {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function toInputDate(iso: string | null | undefined): string {
  if (!iso) return "";
  return new Date(iso).toISOString().slice(0, 10);
}

export function DeviceLinkModalTrigger({
  deviceId,
  children,
  className = "font-semibold text-indigo-600 hover:underline text-left",
}: {
  deviceId: number;
  children: React.ReactNode;
  className?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [device, setDevice] = useState<DeviceDetailData | null>(null);
  const [options, setOptions] = useState<MasterOptions>({
    deviceTypes: [],
    companies: [],
    branches: [],
    users: [],
  });

  const [formState, setFormState] = useState({
    nama: "",
    kodeInventaris: "",
    typeId: "",
    merk: "",
    tipe: "",
    serialNumber: "",
    tglBeli: "",
    status: "Aktif",
    companyId: "",
    branchId: "",
    userId: "",
    keterangan: "",
  });

  async function loadDetail() {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/devices/${deviceId}`);
      const json = await res.json();
      if (!res.ok)
        throw new Error(json.error || "Gagal memuat detail perangkat.");

      const dev: DeviceDetailData = json.device;
      setDevice(dev);
      setOptions({
        deviceTypes: json.options?.deviceTypes ?? [],
        companies: json.options?.companies ?? [],
        branches: json.options?.branches ?? [],
        users: json.options?.users ?? [],
      });
      setFormState({
        nama: dev.nama ?? "",
        kodeInventaris: dev.kodeInventaris ?? "",
        typeId: dev.typeId ? String(dev.typeId) : "",
        merk: dev.merk ?? "",
        tipe: dev.tipe ?? "",
        serialNumber: dev.serialNumber ?? "",
        tglBeli: toInputDate(dev.tglBeli),
        status: dev.status ?? "Aktif",
        companyId: dev.companyId ? String(dev.companyId) : "",
        branchId: dev.branchId ? String(dev.branchId) : "",
        userId: dev.userId ? String(dev.userId) : "",
        keterangan: dev.keterangan ?? "",
      });
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!open) {
      setIsEditing(false);
      return;
    }
    loadDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, deviceId]);

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`/api/devices/${deviceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal menyimpan perangkat.");

      await loadDetail();
      setIsEditing(false);
      router.refresh();
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  const filteredBranches = formState.companyId
    ? (options.branches ?? []).filter(
        (b) => !b.companyId || String(b.companyId) === formState.companyId,
      )
    : (options.branches ?? []);

  const ticketList = device?.tickets ?? [];

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {children}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs"
          onClick={() => setOpen(false)}
        >
          <div
            className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Pop-up */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                  <Laptop className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900">
                    {isEditing
                      ? `Edit Perangkat: ${device?.nama ?? ""}`
                      : (device?.nama ?? "Detail Perangkat")}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {device?.kodeInventaris || "Tanpa kode inventaris"}
                    {device?.type?.nama ? ` · ${device.type.nama}` : ""}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!loading && device && !isEditing && (
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMsg(null);
                      setIsEditing(true);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-medium text-white shadow-xs transition hover:bg-indigo-700"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </button>
                )}

                {isEditing && (
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMsg(null);
                      setIsEditing(false);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Kembali ke Detail
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Tutup pop-up"
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/70 hover:text-slate-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Body Pop-up */}
            <div className="overflow-y-auto p-6">
              {loading ? (
                <div className="flex items-center justify-center gap-2 py-12 text-sm text-slate-500">
                  <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
                  Memuat data perangkat...
                </div>
              ) : errorMsg && !device ? (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {errorMsg}
                </div>
              ) : device && !isEditing ? (
                /* ================= MODE READ-ONLY (TIDAK EDITABLE) ================= */
                <div className="space-y-5">
                  <div className="grid grid-cols-1 gap-4 rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <span className="text-xs text-slate-400">
                        Kode Inventaris
                      </span>
                      <p className="mt-0.5 text-sm font-medium text-slate-800">
                        {device.kodeInventaris || "-"}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400">
                        Jenis Perangkat
                      </span>
                      <p className="mt-0.5 text-sm font-medium text-slate-800">
                        {device.type?.nama || "-"}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400">Status</span>
                      <div className="mt-0.5">
                        <span className="inline-flex rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
                          {device.status}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400">
                        Merk & Tipe
                      </span>
                      <p className="mt-0.5 text-sm font-medium text-slate-800">
                        {[device.merk, device.tipe]
                          .filter(Boolean)
                          .join(" · ") || "-"}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400">
                        Serial Number
                      </span>
                      <p className="mt-0.5 text-sm font-medium text-slate-800">
                        {device.serialNumber || "-"}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400">
                        Tanggal Beli
                      </span>
                      <p className="mt-0.5 text-sm font-medium text-slate-800">
                        {formatTanggal(device.tglBeli)}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400">
                        Pemegang Saat Ini
                      </span>
                      <p className="mt-0.5 text-sm font-medium text-slate-800">
                        {device.user?.nama || "-"}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400">Perusahaan</span>
                      <p className="mt-0.5 text-sm font-medium text-slate-800">
                        {device.company?.nama || "-"}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400">Cabang</span>
                      <p className="mt-0.5 text-sm font-medium text-slate-800">
                        {device.branch?.nama || "-"}
                      </p>
                    </div>
                    {device.keterangan && (
                      <div className="sm:col-span-2 lg:col-span-3">
                        <span className="text-xs text-slate-400">
                          Keterangan
                        </span>
                        <p className="mt-0.5 text-sm text-slate-700">
                          {device.keterangan}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Spesifikasi Tambahan */}
                  {device.attributes && device.attributes.length > 0 && (
                    <div className="rounded-xl border border-slate-200 p-4">
                      <h4 className="mb-3 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                        Spesifikasi Teknis
                      </h4>
                      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                        {device.attributes.map((attr, idx) => {
                          const label = String(
                            attr.nama ??
                              attr.key ??
                              attr.label ??
                              `Atribut ${idx + 1}`,
                          );
                          const val = String(attr.nilai ?? attr.value ?? "-");
                          return (
                            <div
                              key={String(attr.id ?? idx)}
                              className="flex justify-between rounded-lg bg-slate-50 px-3 py-2 text-xs"
                            >
                              <span className="text-slate-500">{label}</span>
                              <span className="font-medium text-slate-800">
                                {val}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Lampiran */}
                  {device.attachments && device.attachments.length > 0 && (
                    <div className="rounded-xl border border-slate-200 p-4">
                      <div className="mb-3 flex items-center gap-1.5">
                        <Paperclip className="h-4 w-4 text-slate-500" />
                        <h4 className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                          Lampiran ({device.attachments.length})
                        </h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {device.attachments.map((att) => (
                          <a
                            key={att.id}
                            href={att.fileUrl ?? "#"}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50"
                          >
                            {att.fileName || "Lihat Lampiran"}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Riwayat Penggunaan */}
                  {device.assignments && device.assignments.length > 0 && (
                    <div className="rounded-xl border border-slate-200 p-4">
                      <div className="mb-3 flex items-center gap-1.5">
                        <History className="h-4 w-4 text-slate-500" />
                        <h4 className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                          Riwayat Pemegang ({device.assignments.length})
                        </h4>
                      </div>
                      <div className="divide-y divide-slate-100 text-xs">
                        {device.assignments.map((a) => (
                          <div
                            key={a.id}
                            className="flex items-center justify-between py-2 first:pt-0 last:pb-0"
                          >
                            <span className="font-medium text-slate-800">
                              {a.user?.nama || "User tidak diketahui"}
                            </span>
                            <span className="text-slate-500">
                              {formatTanggal(a.tglMulai)} –{" "}
                              {a.tglSelesai
                                ? formatTanggal(a.tglSelesai)
                                : "Sekarang"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Riwayat Troubleshooting */}
                  <div className="rounded-xl border border-slate-200 p-4">
                    <div className="mb-3 flex items-center gap-1.5">
                      <Wrench className="h-4 w-4 text-rose-500" />
                      <h4 className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                        Riwayat Troubleshooting ({ticketList.length})
                      </h4>
                    </div>

                    {ticketList.length === 0 ? (
                      <p className="py-4 text-center text-xs text-slate-400">
                        Belum ada tiket troubleshooting untuk perangkat ini.
                      </p>
                    ) : (
                      <div className="divide-y divide-slate-100 text-xs">
                        {ticketList.map((tiket) => (
                          <div
                            key={tiket.id}
                            className="flex flex-wrap items-center justify-between gap-2 py-2.5 first:pt-0 last:pb-0"
                          >
                            <div>
                              <Link
                                href={`/troubleshooting/${tiket.id}`}
                                onClick={() => setOpen(false)}
                                className="font-medium text-slate-800 hover:text-indigo-600 hover:underline"
                              >
                                {tiket.judul}
                              </Link>
                              <p className="mt-0.5 text-[11px] text-slate-400">
                                <span className="font-mono">
                                  {tiket.noTiket ?? "Tanpa nomor tiket"}
                                </span>
                                {" · "}
                                {formatTanggal(tiket.tglLapor)}
                                {tiket.teknisi?.nama
                                  ? ` · Teknisi: ${tiket.teknisi.nama}`
                                  : ""}
                              </p>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <span
                                className={
                                  "inline-block rounded-full px-2 py-0.5 text-[11px] font-medium " +
                                  urgencyColor(tiket.prioritas)
                                }
                              >
                                {tiket.prioritas}
                              </span>
                              <span
                                className={
                                  "inline-block rounded-full px-2 py-0.5 text-[11px] font-medium " +
                                  statusColor(tiket.status)
                                }
                              >
                                {tiket.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* ================= MODE FORM EDIT DEVICE ================= */
                <form onSubmit={handleSaveEdit} className="space-y-4">
                  {errorMsg && (
                    <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-700">
                        Nama Perangkat *
                      </label>
                      <input
                        type="text"
                        required
                        value={formState.nama}
                        onChange={(e) =>
                          setFormState((s) => ({ ...s, nama: e.target.value }))
                        }
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-700">
                        Kode Inventaris
                      </label>
                      <input
                        type="text"
                        value={formState.kodeInventaris}
                        onChange={(e) =>
                          setFormState((s) => ({
                            ...s,
                            kodeInventaris: e.target.value,
                          }))
                        }
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-700">
                        Jenis Perangkat
                      </label>
                      <select
                        value={formState.typeId}
                        onChange={(e) =>
                          setFormState((s) => ({
                            ...s,
                            typeId: e.target.value,
                          }))
                        }
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                      >
                        <option value="">- Pilih Jenis -</option>
                        {(options.deviceTypes ?? []).map((dt) => (
                          <option key={dt.id} value={dt.id}>
                            {dt.nama}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-700">
                        Merk
                      </label>
                      <input
                        type="text"
                        value={formState.merk}
                        onChange={(e) =>
                          setFormState((s) => ({ ...s, merk: e.target.value }))
                        }
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-700">
                        Tipe / Model
                      </label>
                      <input
                        type="text"
                        value={formState.tipe}
                        onChange={(e) =>
                          setFormState((s) => ({ ...s, tipe: e.target.value }))
                        }
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-700">
                        Serial Number
                      </label>
                      <input
                        type="text"
                        value={formState.serialNumber}
                        onChange={(e) =>
                          setFormState((s) => ({
                            ...s,
                            serialNumber: e.target.value,
                          }))
                        }
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-700">
                        Tanggal Beli
                      </label>
                      <input
                        type="date"
                        value={formState.tglBeli}
                        onChange={(e) =>
                          setFormState((s) => ({
                            ...s,
                            tglBeli: e.target.value,
                          }))
                        }
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-700">
                        Status
                      </label>
                      <select
                        value={formState.status}
                        onChange={(e) =>
                          setFormState((s) => ({
                            ...s,
                            status: e.target.value,
                          }))
                        }
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                      >
                        <option value="Aktif">Aktif</option>
                        <option value="Cadangan">Cadangan</option>
                        <option value="Rusak">Rusak</option>
                        <option value="Perbaikan">Perbaikan</option>
                        <option value="Non-Aktif">Non-Aktif</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-700">
                        Pemegang
                      </label>
                      <select
                        value={formState.userId}
                        onChange={(e) =>
                          setFormState((s) => ({
                            ...s,
                            userId: e.target.value,
                          }))
                        }
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                      >
                        <option value="">- Tanpa Pemegang -</option>
                        {(options.users ?? []).map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.nama}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-700">
                        Perusahaan
                      </label>
                      <select
                        value={formState.companyId}
                        onChange={(e) =>
                          setFormState((s) => ({
                            ...s,
                            companyId: e.target.value,
                          }))
                        }
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                      >
                        <option value="">- Pilih Perusahaan -</option>
                        {(options.companies ?? []).map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.nama}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-700">
                        Cabang
                      </label>
                      <select
                        value={formState.branchId}
                        onChange={(e) =>
                          setFormState((s) => ({
                            ...s,
                            branchId: e.target.value,
                          }))
                        }
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                      >
                        <option value="">- Pilih Cabang -</option>
                        {filteredBranches.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.nama}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-700">
                      Keterangan
                    </label>
                    <textarea
                      rows={3}
                      value={formState.keterangan}
                      onChange={(e) =>
                        setFormState((s) => ({
                          ...s,
                          keterangan: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
                    >
                      <Save className="h-4 w-4" />
                      {saving ? "Menyimpan..." : "Simpan Perubahan"}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Footer (khusus mode Read-Only) */}
            {!isEditing && (
              <div className="flex items-center justify-end border-t border-slate-100 bg-slate-50/80 px-6 py-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Tutup
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
