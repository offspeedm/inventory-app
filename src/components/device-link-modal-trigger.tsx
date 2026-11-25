"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  Loader2,
  MonitorSmartphone,
  Pencil,
  Save,
  Wrench,
  History,
  X,
} from "lucide-react";
import { updateDevice } from "@/app/(dashboard)/devices/actions";
import { getFieldsForType } from "@/config/device-fields";
import { SearchableSelect } from "@/components/searchable-select";

type Option = { id: number; nama: string };
type Branch = Option & { companyId: number | null };

type DeviceModalData = {
  id: number;
  nama: string;
  kodeInventaris: string | null;
  merk: string | null;
  tipe: string | null;
  serialNumber: string | null;
  keterangan: string | null;
  tglBeli: string | null;
  hargaBeli: number | string | null;
  status: string;
  typeId: number | null;
  companyId: number | null;
  branchId: number | null;
  userId: number | null;
  type?: { id?: number; nama: string } | null;
  company?: { id?: number; nama: string } | null;
  branch?: { id?: number; nama: string } | null;
  user?: { id?: number; nama: string } | null;
  attributes?: { key: string; value: string | null }[];
  assignments?: {
    id: number;
    tglMulai: string | null;
    tglSelesai: string | null;
    user: { nama: string } | null;
  }[];
  tickets?: {
    id: number;
    noTiket?: string | null;
    judul: string;
    status: string;
    tglLapor: string | null;
  }[];
};

type MasterOptions = {
  deviceTypes?: Option[];
  companies?: Option[];
  branches?: Branch[];
  users?: Option[];
};

type ApiResponse = {
  device?: DeviceModalData;
  options?: MasterOptions;
} & MasterOptions &
  Partial<DeviceModalData>;

const STATUS_OPTIONS = [
  "Aktif",
  "Available",
  "Rusak",
  "Perbaikan",
  "Tidak dipakai",
  "Hilang",
  "Dihibahkan",
];

function fmtTanggal(iso: string | null | undefined, fallback = "-"): string {
  if (!iso) return fallback;
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function toDateInput(iso: string | null | undefined): string {
  if (!iso) return "";
  return new Date(iso).toISOString().slice(0, 10);
}

function statusBadgeColor(status: string): string {
  switch (status) {
    case "Aktif":
      return "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200";
    case "Available":
      return "bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-200";
    case "Rusak":
      return "bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-200";
    case "Perbaikan":
      return "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200";
    case "Hilang":
      return "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200";
    default:
      return "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200";
  }
}

export function DeviceLinkModalTrigger({
  deviceId,
  className,
  children,
}: {
  deviceId: number;
  className?: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const [device, setDevice] = useState<DeviceModalData | null>(null);
  const [deviceTypes, setDeviceTypes] = useState<Option[]>([]);
  const [companies, setCompanies] = useState<Option[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [users, setUsers] = useState<Option[]>([]);

  // State form edit
  const [typeId, setTypeId] = useState("");
  const [status, setStatus] = useState("Aktif");
  const [userId, setUserId] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [branchId, setBranchId] = useState("");

  useEffect(() => {
    if (!open) return;

    let active = true;

    fetch(`/api/devices/${deviceId}`)
      .then(async (res) => {
        const json = (await res.json()) as ApiResponse & { error?: string };
        if (!res.ok) {
          throw new Error(json.error || "Gagal memuat detail perangkat.");
        }
        return json;
      })
      .then((json) => {
        if (!active) return;
        const dev = (json.device ?? json) as DeviceModalData;
        const opts = json.options ?? json;
        setDevice(dev);
        if (opts.deviceTypes) setDeviceTypes(opts.deviceTypes);
        if (opts.companies) setCompanies(opts.companies);
        if (opts.branches) setBranches(opts.branches);
        if (opts.users) setUsers(opts.users);
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
  }, [open, deviceId, reloadKey]);

  function masukModeEdit() {
    if (!device) return;
    const resolvedTypeId = device.typeId ?? device.type?.id ?? null;
    const resolvedUserId = device.userId ?? device.user?.id ?? null;
    const resolvedCompanyId = device.companyId ?? device.company?.id ?? null;
    const resolvedBranchId = device.branchId ?? device.branch?.id ?? null;

    setTypeId(resolvedTypeId ? String(resolvedTypeId) : "");
    setStatus(device.status || "Aktif");
    setUserId(resolvedUserId ? String(resolvedUserId) : "");
    setCompanyId(resolvedCompanyId ? String(resolvedCompanyId) : "");
    setBranchId(resolvedBranchId ? String(resolvedBranchId) : "");
    setEditing(true);
  }

  function bukaModal() {
    setLoading(true);
    setErrorMsg(null);
    setOpen(true);
  }

  function tutupModal() {
    setOpen(false);
    setEditing(false);
    setErrorMsg(null);
  }

  const filteredBranches = useMemo(
    () =>
      companyId
        ? branches.filter((b) => b.companyId === Number(companyId))
        : [],
    [branches, companyId],
  );

  const typeOptions = useMemo(
    () => deviceTypes.map((t) => ({ value: String(t.id), label: t.nama })),
    [deviceTypes],
  );

  const statusSelectOptions = useMemo(
    () => STATUS_OPTIONS.map((s) => ({ value: s, label: s })),
    [],
  );

  const userOptions = useMemo(
    () => users.map((u) => ({ value: String(u.id), label: u.nama })),
    [users],
  );

  const companyOptions = useMemo(
    () => companies.map((c) => ({ value: String(c.id), label: c.nama })),
    [companies],
  );

  const branchOptions = useMemo(
    () => filteredBranches.map((b) => ({ value: String(b.id), label: b.nama })),
    [filteredBranches],
  );

  const selectedTypeName =
    deviceTypes.find((t) => t.id === Number(typeId))?.nama ??
    device?.type?.nama;
  const dynamicFields = getFieldsForType(selectedTypeName);

  function handleCompanyChange(nextCompanyId: string) {
    setCompanyId(nextCompanyId);
    if (!nextCompanyId) {
      setBranchId("");
      return;
    }
    const stillValid = branches.some(
      (b) => b.id === Number(branchId) && b.companyId === Number(nextCompanyId),
    );
    if (!stillValid) {
      setBranchId("");
    }
  }

  function attrValue(key: string): string {
    return device?.attributes?.find((a) => a.key === key)?.value ?? "";
  }

  async function handleSubmitEdit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!device) return;
    const formData = new FormData(e.currentTarget);
    setSaving(true);
    setErrorMsg(null);
    try {
      await updateDevice(formData);
      setEditing(false);
      setLoading(true);
      setErrorMsg(null);
      setReloadKey((k) => k + 1);
      router.refresh();
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "Gagal menyimpan perubahan.",
      );
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20";

  return (
    <>
      <button type="button" onClick={bukaModal} className={className}>
        {children}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs"
          onClick={tutupModal}
        >
          <div
            className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal: Bersih tanpa tombol aksi ganda */}
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/70 px-6 py-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <MonitorSmartphone className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h2 className="truncate text-base font-bold text-slate-900">
                    {editing
                      ? `Edit Perangkat${device ? ` · ${device.nama}` : ""}`
                      : (device?.nama ?? "Detail Perangkat")}
                  </h2>
                  {device && (
                    <p className="truncate text-xs text-slate-500">
                      {[device.kodeInventaris, device.type?.nama]
                        .filter(Boolean)
                        .join(" · ") || "Inventaris Perangkat"}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                {editing && (
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Kembali ke Detail
                  </button>
                )}

                <button
                  type="button"
                  onClick={tutupModal}
                  aria-label="Tutup modal"
                  className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-200/70 hover:text-slate-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Body Modal */}
            <div className="flex-1 overflow-y-auto p-6">
              {loading ? (
                <div className="flex items-center justify-center gap-2 py-12 text-sm text-slate-500">
                  <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
                  Memuat detail perangkat...
                </div>
              ) : errorMsg ? (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {errorMsg}
                </div>
              ) : !device ? null : editing ? (
                /* ================= MODE EDIT (DENGAN SEARCHABLE SELECT) ================= */
                <form onSubmit={handleSubmitEdit} className="space-y-4">
                  <input type="hidden" name="id" value={device.id} />

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-600">
                        Nama Perangkat
                      </label>
                      <input
                        name="nama"
                        required
                        defaultValue={device.nama}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-600">
                        Kode Inventaris
                      </label>
                      <input
                        disabled
                        value={device.kodeInventaris ?? "Otomatis"}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-sm text-slate-500"
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-600">
                        Jenis Perangkat
                      </label>
                      <SearchableSelect
                        name="type_id"
                        value={typeId}
                        onChange={setTypeId}
                        options={typeOptions}
                        placeholder="Ketik atau pilih jenis…"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-600">
                        Merk
                      </label>
                      <input
                        name="merk"
                        defaultValue={device.merk ?? ""}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-600">
                        Tipe / Model
                      </label>
                      <input
                        name="tipe"
                        defaultValue={device.tipe ?? ""}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  {dynamicFields.length > 0 && (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                      <p className="mb-2 text-xs font-semibold text-slate-600">
                        Spesifikasi {selectedTypeName}
                      </p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {dynamicFields.map((field) => (
                          <div key={field}>
                            <label className="mb-1 block text-xs font-medium text-slate-600">
                              {field}
                            </label>
                            <input
                              name={"attr_" + field}
                              defaultValue={attrValue(field)}
                              placeholder={field}
                              className={inputClass}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-600">
                        No. Seri
                      </label>
                      <input
                        name="serial_number"
                        defaultValue={device.serialNumber ?? ""}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-600">
                        Tanggal Beli
                      </label>
                      <input
                        type="date"
                        name="tgl_beli"
                        defaultValue={toDateInput(device.tglBeli)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-600">
                        Harga Beli (Rp)
                      </label>
                      <input
                        type="number"
                        min="0"
                        name="harga_beli"
                        defaultValue={
                          device.hargaBeli != null
                            ? String(device.hargaBeli)
                            : ""
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-600">
                        Status
                      </label>
                      <SearchableSelect
                        name="status"
                        value={status}
                        onChange={(val) => setStatus(val || device.status)}
                        options={statusSelectOptions}
                        allowClear={false}
                        placeholder="Pilih status…"
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-600">
                        Pemegang Saat Ini
                      </label>
                      <SearchableSelect
                        name="user_id"
                        value={userId}
                        onChange={setUserId}
                        options={userOptions}
                        placeholder="Ketik nama pengguna…"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-600">
                        Perusahaan
                      </label>
                      <SearchableSelect
                        name="company_id"
                        value={companyId}
                        onChange={handleCompanyChange}
                        options={companyOptions}
                        placeholder="Ketik perusahaan…"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-600">
                        Cabang
                      </label>
                      <SearchableSelect
                        name="branch_id"
                        value={branchId}
                        onChange={setBranchId}
                        options={branchOptions}
                        disabled={!companyId}
                        placeholder={
                          companyId ? "Ketik cabang…" : "Pilih PT dulu"
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">
                      Keterangan
                    </label>
                    <textarea
                      name="keterangan"
                      rows={3}
                      defaultValue={device.keterangan ?? ""}
                      className={inputClass + " resize-y"}
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      disabled={saving}
                      className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-xs hover:bg-indigo-700 disabled:opacity-60"
                    >
                      <Save className="h-4 w-4" />
                      {saving ? "Menyimpan..." : "Simpan Perubahan"}
                    </button>
                  </div>
                </form>
              ) : (
                /* ================= MODE DETAIL READ-ONLY ================= */
                <div className="space-y-4">
                  {/* Informasi Utama */}
                  <div className="grid grid-cols-1 gap-4 rounded-xl border border-slate-200/80 bg-slate-50/40 p-4 sm:grid-cols-3">
                    <div>
                      <span className="text-xs text-slate-400">
                        Kode Inventaris
                      </span>
                      <p className="mt-0.5 font-mono text-sm font-semibold text-slate-800">
                        {device.kodeInventaris || "-"}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400">
                        Jenis Perangkat
                      </span>
                      <p className="mt-0.5 text-sm font-semibold text-slate-800">
                        {device.type?.nama || "-"}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400">Status</span>
                      <div className="mt-0.5">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadgeColor(device.status)}`}
                        >
                          {device.status}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-xs text-slate-400">
                        Merk & Tipe
                      </span>
                      <p className="mt-0.5 text-sm font-semibold text-slate-800">
                        {[device.merk, device.tipe]
                          .filter(Boolean)
                          .join(" · ") || "-"}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400">
                        Serial Number
                      </span>
                      <p className="mt-0.5 font-mono text-sm font-semibold text-slate-800">
                        {device.serialNumber || "-"}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400">
                        Tanggal Beli
                      </span>
                      <p className="mt-0.5 text-sm font-semibold text-slate-800">
                        {fmtTanggal(device.tglBeli)}
                      </p>
                    </div>

                    <div>
                      <span className="text-xs text-slate-400">
                        Pemegang Saat Ini
                      </span>
                      <p className="mt-0.5 text-sm font-semibold text-slate-800">
                        {device.user?.nama || "-"}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400">Perusahaan</span>
                      <p className="mt-0.5 text-sm font-semibold text-slate-800">
                        {device.company?.nama || "-"}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400">Cabang</span>
                      <p className="mt-0.5 text-sm font-semibold text-slate-800">
                        {device.branch?.nama || "-"}
                      </p>
                    </div>

                    <div className="sm:col-span-3">
                      <span className="text-xs text-slate-400">Keterangan</span>
                      <p className="mt-0.5 text-sm text-slate-700">
                        {device.keterangan || "-"}
                      </p>
                    </div>
                  </div>

                  {/* Spesifikasi Teknis */}
                  {device.attributes && device.attributes.length > 0 && (
                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                      <h3 className="mb-3 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                        Spesifikasi Teknis
                      </h3>
                      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                        {device.attributes.map((attr) => (
                          <div
                            key={attr.key}
                            className="flex items-start justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2 text-xs"
                          >
                            <span className="shrink-0 font-medium text-slate-500">
                              {attr.key}
                            </span>
                            <span className="text-right font-semibold text-slate-800">
                              {attr.value || "-"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Riwayat Pemegang */}
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <History className="h-4 w-4 text-slate-500" />
                      <h3 className="text-xs font-semibold tracking-wider text-slate-600 uppercase">
                        Riwayat Pemegang ({device.assignments?.length ?? 0})
                      </h3>
                    </div>

                    {!device.assignments?.length ? (
                      <p className="py-3 text-center text-xs text-slate-400">
                        Belum ada riwayat pemegang.
                      </p>
                    ) : (
                      <div className="divide-y divide-slate-100">
                        {device.assignments.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between gap-3 py-2 text-xs first:pt-0 last:pb-0"
                          >
                            <span className="font-semibold text-slate-800">
                              {item.user?.nama || "Tidak diketahui"}
                            </span>
                            <span className="text-slate-500">
                              {fmtTanggal(item.tglMulai)} —{" "}
                              {fmtTanggal(item.tglSelesai, "Sekarang")}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Riwayat Troubleshooting */}
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <Wrench className="h-4 w-4 text-rose-500" />
                      <h3 className="text-xs font-semibold tracking-wider text-slate-600 uppercase">
                        Riwayat Troubleshooting ({device.tickets?.length ?? 0})
                      </h3>
                    </div>

                    {!device.tickets?.length ? (
                      <p className="py-3 text-center text-xs text-slate-400">
                        Belum ada tiket troubleshooting untuk perangkat ini.
                      </p>
                    ) : (
                      <div className="divide-y divide-slate-100">
                        {device.tickets.map((t) => (
                          <div
                            key={t.id}
                            className="flex items-center justify-between gap-3 py-2 text-xs first:pt-0 last:pb-0"
                          >
                            <div>
                              <a
                                href={`/troubleshooting/${t.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-semibold text-indigo-600 hover:underline"
                              >
                                {t.judul}
                              </a>
                              <p className="text-[11px] text-slate-400">
                                {fmtTanggal(t.tglLapor)}
                                {t.noTiket ? ` · ${t.noTiket}` : ""}
                              </p>
                            </div>
                            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-700">
                              {t.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Modal (Mode Detail): Urutan Buka Halaman -> Edit -> Tutup */}
            {!editing && (
              <div className="flex shrink-0 items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/70 px-6 py-3.5">
                <a
                  href={`/devices/${deviceId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Buka halaman detail perangkat di tab baru"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Buka Halaman
                </a>

                {device && (
                  <button
                    type="button"
                    onClick={masukModeEdit}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-indigo-700"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </button>
                )}

                <button
                  type="button"
                  onClick={tutupModal}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
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
