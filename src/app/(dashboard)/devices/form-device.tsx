"use client";

import { useMemo, useRef, useState } from "react";
import {
  Plus,
  X,
  MonitorSmartphone,
  Upload,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import { tambahDevice } from "./actions";
import { getFieldsForType } from "@/config/device-fields";
import { SearchableSelect } from "@/components/searchable-select";

type DeviceType = { id: number; nama: string };
type Company = { id: number; nama: string };
type Branch = { id: number; nama: string; companyId: number | null };
type UserOpt = { id: number; nama: string };

const STATUS = [
  "Aktif",
  "Available",
  "Rusak",
  "Perbaikan",
  "Tidak dipakai",
  "Hilang",
  "Dihibahkan",
];

export function FormDevice({
  deviceTypes,
  companies,
  branches,
  users,
}: {
  deviceTypes: DeviceType[];
  companies: Company[];
  branches: Branch[];
  users: UserOpt[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [typeId, setTypeId] = useState<string>("");
  const [status, setStatus] = useState<string>("Aktif");
  const [companyId, setCompanyId] = useState<string>("");
  const [branchId, setBranchId] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);

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

  const statusOptions = useMemo(
    () => STATUS.map((s) => ({ value: s, label: s })),
    [],
  );

  const companyOptions = useMemo(
    () => companies.map((c) => ({ value: String(c.id), label: c.nama })),
    [companies],
  );

  const branchOptions = useMemo(
    () => filteredBranches.map((b) => ({ value: String(b.id), label: b.nama })),
    [filteredBranches],
  );

  const userOptions = useMemo(
    () => users.map((u) => ({ value: String(u.id), label: u.nama })),
    [users],
  );

  const selectedTypeName = deviceTypes.find(
    (t) => t.id === Number(typeId),
  )?.nama;
  const dynamicFields = getFieldsForType(selectedTypeName);

  const inputClass =
    "w-full border border-slate-300 rounded-lg px-3 py-2 text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";

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

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSelectedFiles(Array.from(e.target.files ?? []));
  }

  function hapusPilihanFile(idx: number) {
    const sisa = selectedFiles.filter((_, i) => i !== idx);
    const dt = new DataTransfer();
    sisa.forEach((f) => dt.items.add(f));
    if (fileInputRef.current) fileInputRef.current.files = dt.files;
    setSelectedFiles(sisa);
  }

  function resetSemua() {
    formRef.current?.reset();
    setTypeId("");
    setStatus("Aktif");
    setCompanyId("");
    setBranchId("");
    setUserId("");
    setSelectedFiles([]);
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setOpen(true)}
          className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all duration-200 hover:from-indigo-700 hover:to-violet-700 hover:shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
        >
          <span className="flex items-center justify-center rounded-full bg-white/20 p-0.5 transition-transform duration-200 group-hover:rotate-90">
            <Plus className="w-4 h-4" />
          </span>
          Tambah Perangkat
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => {
              setOpen(false);
              resetSemua();
            }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
          />

          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl text-left animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white flex items-center justify-between px-6 py-4 border-b border-slate-100 z-10">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-100 text-indigo-600">
                  <MonitorSmartphone className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-slate-800 leading-tight">
                    Tambah Perangkat
                  </h2>
                  <p className="text-xs text-slate-400">
                    Isi data perangkat baru
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setOpen(false);
                  resetSemua();
                }}
                aria-label="Tutup"
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              ref={formRef}
              action={async (formData: FormData) => {
                setSaving(true);
                await tambahDevice(formData);
                resetSemua();
                setSaving(false);
                setOpen(false);
              }}
              className="px-6 py-5 grid gap-4"
            >
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Nama Perangkat
                  </label>
                  <input
                    name="nama"
                    placeholder="mis. NB001"
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Jenis
                  </label>
                  <SearchableSelect
                    name="type_id"
                    value={typeId}
                    onChange={setTypeId}
                    options={typeOptions}
                    placeholder="Ketik atau pilih jenis…"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Merk
                  </label>
                  <input
                    name="merk"
                    placeholder="mis. Lenovo"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Tipe/Model
                  </label>
                  <input
                    name="tipe"
                    placeholder="mis. ThinkPad X1"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    No. Seri
                  </label>
                  <input
                    name="serial_number"
                    placeholder="Serial number"
                    className={inputClass}
                  />
                </div>
              </div>

              {dynamicFields.length > 0 && (
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
                  <p className="text-xs font-semibold text-slate-500 mb-2">
                    Spesifikasi {selectedTypeName}
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {dynamicFields.map((field) => (
                      <div key={field}>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          {field}
                        </label>
                        <input
                          name={"attr_" + field}
                          placeholder={field}
                          className={inputClass + " bg-white"}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Status
                  </label>
                  <SearchableSelect
                    name="status"
                    value={status}
                    onChange={(val) => setStatus(val || "Aktif")}
                    options={statusOptions}
                    allowClear={false}
                    placeholder="Pilih status…"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Tgl Beli
                  </label>
                  <input name="tgl_beli" type="date" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Harga (Rp)
                  </label>
                  <input
                    name="harga_beli"
                    type="number"
                    min="0"
                    placeholder="0"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
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
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Cabang
                  </label>
                  <SearchableSelect
                    name="branch_id"
                    value={branchId}
                    onChange={setBranchId}
                    options={branchOptions}
                    disabled={!companyId}
                    placeholder={companyId ? "Ketik cabang…" : "Pilih PT dulu"}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Pengguna
                  </label>
                  <SearchableSelect
                    name="user_id"
                    value={userId}
                    onChange={setUserId}
                    options={userOptions}
                    placeholder="Ketik nama pengguna…"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Keterangan{" "}
                  <span className="text-slate-400 font-normal">(opsional)</span>
                </label>
                <textarea
                  name="keterangan"
                  rows={2}
                  placeholder="Catatan tambahan tentang perangkat…"
                  className={inputClass + " resize-y"}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Foto & Lampiran{" "}
                  <span className="text-slate-400 font-normal">
                    (opsional, bisa lebih dari satu)
                  </span>
                </label>

                <label className="flex flex-col items-center justify-center gap-1.5 border-2 border-dashed border-slate-300 rounded-xl py-5 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/40 transition-colors">
                  <Upload className="w-5 h-5 text-slate-400" />
                  <span className="text-xs text-slate-500 text-center px-4">
                    Klik untuk pilih foto/dokumen (bisa lebih dari satu file)
                  </span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    name="files"
                    multiple
                    accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>

                {selectedFiles.length > 0 && (
                  <div className="grid gap-2 mt-2">
                    {selectedFiles.map((f, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between gap-2 bg-slate-50 rounded-lg px-3 py-2 text-sm"
                      >
                        <span className="flex items-center gap-2 truncate">
                          {f.type.startsWith("image/") ? (
                            <ImageIcon className="w-4 h-4 text-indigo-500 shrink-0" />
                          ) : (
                            <FileText className="w-4 h-4 text-indigo-500 shrink-0" />
                          )}
                          <span className="truncate">{f.name}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => hapusPilihanFile(i)}
                          className="text-slate-400 hover:text-red-500 shrink-0"
                          aria-label="Batalkan file ini"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="sticky bottom-0 bg-white flex justify-end gap-2 mt-1 border-t border-slate-100 -mx-6 px-6 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    resetSemua();
                  }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg px-4 py-2 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white text-sm font-medium rounded-lg px-5 py-2 shadow-sm transition-colors"
                >
                  {saving ? "Menyimpan…" : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
