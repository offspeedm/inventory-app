"use client";

import { useRef, useState } from "react";
import {
  Plus,
  X,
  MonitorSmartphone,
  Upload,
  FileText,
  Image as ImageIcon,
  Sparkles,
} from "lucide-react";
import { tambahDevice } from "./actions";

type DeviceType = { id: number; nama: string };
type Company = { id: number; nama: string };
type Branch = { id: number; nama: string; companyId: number | null };
type UserOpt = { id: number; nama: string };

const STATUS = ["Aktif", "Rusak", "Perbaikan", "Tidak dipakai"];

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
  const [companyId, setCompanyId] = useState<string>("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);

  const filteredBranches = companyId
    ? branches.filter((b) => b.companyId === Number(companyId))
    : [];

  const inputClass =
    "w-full border border-slate-300 rounded-lg px-3 py-2 text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";

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
    setCompanyId("");
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
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
          />

          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl text-left animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white flex items-center justify-between px-6 py-4 border-b border-slate-100 z-10">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-100 text-indigo-600">
                  <MonitorSmartphone className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-slate-800 leading-tight">
                    Tambah Perangkat
                  </h2>
                  <p className="text-xs text-slate-400">Isi data perangkat baru</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Tutup"
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
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
              {/* Info kode otomatis */}
              <div className="flex items-start gap-2 bg-indigo-50 text-indigo-700 rounded-lg px-3 py-2 text-xs">
                <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  Kode inventaris akan dibuat otomatis, format:{" "}
                  <strong>JENIS-TAHUNBULAN-URUT</strong> (mis.{" "}
                  <span className="font-mono">LT-202601-001</span>)
                </span>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Nama Perangkat
                  </label>
                  <input name="nama" placeholder="mis. Laptop Kasir 01" required className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Jenis
                  </label>
                  <select name="type_id" defaultValue="" className={inputClass}>
                    <option value="">Pilih jenis…</option>
                    {deviceTypes.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.nama}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Merk</label>
                  <input name="merk" placeholder="mis. Lenovo" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Tipe/Model</label>
                  <input name="tipe" placeholder="mis. ThinkPad X1" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">No. Seri</label>
                  <input name="serial_number" placeholder="Serial number" className={inputClass} />
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
                  <select name="status" defaultValue="Aktif" className={inputClass}>
                    {STATUS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Tgl Beli</label>
                  <input name="tgl_beli" type="date" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Harga (Rp)</label>
                  <input name="harga_beli" type="number" min="0" placeholder="0" className={inputClass} />
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Perusahaan</label>
                  <select
                    name="company_id"
                    value={companyId}
                    onChange={(e) => setCompanyId(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Pilih…</option>
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nama}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Cabang</label>
                  <select name="branch_id" disabled={!companyId} className={inputClass + " disabled:bg-slate-100"}>
                    <option value="">{companyId ? "Pilih…" : "Pilih PT dulu"}</option>
                    {filteredBranches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.nama}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Pengguna</label>
                  <select name="user_id" defaultValue="" className={inputClass}>
                    <option value="">Belum ada</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.nama}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Keterangan <span className="text-slate-400 font-normal">(opsional)</span>
                </label>
                <textarea
                  name="keterangan"
                  rows={2}
                  placeholder="Catatan tambahan tentang perangkat…"
                  className={inputClass + " resize-y"}
                />
              </div>

              {/* ===== Upload Foto & Lampiran ===== */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Foto & Lampiran <span className="text-slate-400 font-normal">(opsional, bisa lebih dari satu)</span>
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

              {/* Footer */}
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
