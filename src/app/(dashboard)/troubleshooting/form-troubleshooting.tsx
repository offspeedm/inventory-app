"use client";

import { useRef, useState } from "react";
import { Plus, X, Wrench, Upload, FileText, Image as ImageIcon, Sparkles } from "lucide-react";
import { tambahTiket } from "./actions";
import { KATEGORI_MASALAH, URGENCY_OPTIONS, STATUS_OPTIONS } from "@/config/ticket-fields";

type Company = { id: number; nama: string };
type Branch = { id: number; nama: string; companyId: number | null };
type UserOpt = {
  id: number;
  nama: string;
  divisi: string | null;
  companyId: number | null;
  branchId: number | null;
};
type DeviceOpt = { id: number; nama: string; userId: number | null };

export function FormTiket({
  companies,
  branches,
  devices,
  users,
}: {
  companies: Company[];
  branches: Branch[];
  devices: DeviceOpt[];
  users: UserOpt[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [userTerkendalaId, setUserTerkendalaId] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [divisi, setDivisi] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const filteredBranches = companyId
    ? branches.filter((b) => b.companyId === Number(companyId))
    : [];

  // Perangkat hanya difilter bila user terkendala sudah dipilih
  const filteredDevices = userTerkendalaId
    ? devices.filter((dv) => dv.userId === Number(userTerkendalaId))
    : devices;

  const inputClass =
    "w-full border border-slate-300 rounded-lg px-3 py-2 text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";

  function handleUserTerkendalaChange(value: string) {
    setUserTerkendalaId(value);
    const u = users.find((x) => String(x.id) === value);
    if (u) {
      setDivisi(u.divisi ?? "");
      setCompanyId(u.companyId ? String(u.companyId) : "");
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
    setUserTerkendalaId("");
    setCompanyId("");
    setDivisi("");
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
          Tambah Tiket
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
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-slate-800 leading-tight">
                    Tambah Tiket Troubleshooting
                  </h2>
                  <p className="text-xs text-slate-400">Catat kendala perangkat/user</p>
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
                await tambahTiket(formData);
                resetSemua();
                setSaving(false);
                setOpen(false);
              }}
              className="px-6 py-5 grid gap-4"
            >
              <div className="flex items-start gap-2 bg-indigo-50 text-indigo-700 rounded-lg px-3 py-2 text-xs">
                <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  No. tiket akan dibuat otomatis, format: <strong>TKT-TANGGAL-URUT</strong>
                </span>
              </div>

              {/* Judul */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Judul</label>
                <input name="judul" placeholder="mis. Laptop tidak bisa menyala" required className={inputClass} />
              </div>

              {/* Kategori + Urgency + Status */}
              <div className="grid sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Kategori</label>
                  <select name="kategori" defaultValue="" className={inputClass}>
                    <option value="">Pilih kategori…</option>
                    {KATEGORI_MASALAH.map((k) => (
                      <option key={k} value={k}>
                        {k}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Urgency</label>
                  <select name="urgency" defaultValue="Mengganggu pekerjaan" className={inputClass}>
                    {URGENCY_OPTIONS.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
                  <select name="status" defaultValue="Baru" className={inputClass}>
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Waktu Laporan + No Tiket info */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Waktu Laporan{" "}
                  <span className="text-slate-400 font-normal">
                    (kosongkan untuk waktu sekarang)
                  </span>
                </label>
                <input name="waktu_lapor" type="datetime-local" className={inputClass} />
              </div>

              {/* Pelapor + User Terkendala */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Pelapor</label>
                  <select name="user_id" defaultValue="" className={inputClass}>
                    <option value="">Pilih pelapor…</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.nama}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    User Terkendala
                  </label>
                  <select
                    name="user_terkendala_id"
                    value={userTerkendalaId}
                    onChange={(e) => handleUserTerkendalaChange(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Pilih user…</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.nama}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Perangkat (difilter berdasar user terkendala) */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Perangkat Terkendala{" "}
                  <span className="text-slate-400 font-normal">(opsional)</span>
                </label>
                <select name="device_id" defaultValue="" className={inputClass}>
                  <option value="">
                    {userTerkendalaId ? "Pilih perangkat user ini…" : "Pilih perangkat…"}
                  </option>
                  {filteredDevices.map((dv) => (
                    <option key={dv.id} value={dv.id}>
                      {dv.nama}
                    </option>
                  ))}
                </select>
                {userTerkendalaId && filteredDevices.length === 0 && (
                  <p className="text-xs text-amber-600 mt-1">
                    User ini belum memiliki perangkat terdaftar.
                  </p>
                )}
              </div>

              {/* Divisi + Perusahaan + Cabang */}
              <div className="grid sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Divisi</label>
                  <input
                    name="divisi"
                    value={divisi}
                    onChange={(e) => setDivisi(e.target.value)}
                    placeholder="Divisi user"
                    className={inputClass}
                  />
                </div>
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
                  <select
                    name="branch_id"
                    disabled={!companyId}
                    className={inputClass + " disabled:bg-slate-100"}
                  >
                    <option value="">{companyId ? "Pilih…" : "Pilih PT dulu"}</option>
                    {filteredBranches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.nama}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Kendala */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Kendala</label>
                <textarea
                  name="kendala"
                  rows={3}
                  placeholder="Jelaskan kendala yang dialami…"
                  className={inputClass + " resize-y"}
                />
              </div>

              {/* Teknisi + Diagnosa */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Teknisi <span className="text-slate-400 font-normal">(opsional)</span>
                  </label>
                  <select name="teknisi_id" defaultValue="" className={inputClass}>
                    <option value="">Belum ditugaskan</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.nama}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Diagnosa <span className="text-slate-400 font-normal">(opsional)</span>
                  </label>
                  <input name="diagnosa" placeholder="Hasil pemeriksaan teknisi" className={inputClass} />
                </div>
              </div>

              {/* Solusi + Catatan Teknisi */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Solusi <span className="text-slate-400 font-normal">(opsional)</span>
                </label>
                <textarea name="solusi" rows={2} placeholder="Solusi yang diberikan…" className={inputClass + " resize-y"} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Catatan Teknisi <span className="text-slate-400 font-normal">(opsional)</span>
                </label>
                <textarea
                  name="catatan_teknisi"
                  rows={2}
                  placeholder="Catatan tambahan dari teknisi…"
                  className={inputClass + " resize-y"}
                />
              </div>

              {/* Upload Foto & Lampiran */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Foto & Lampiran{" "}
                  <span className="text-slate-400 font-normal">(opsional, bisa lebih dari satu)</span>
                </label>
                <label className="flex flex-col items-center justify-center gap-1.5 border-2 border-dashed border-slate-300 rounded-xl py-5 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/40 transition-colors">
                  <Upload className="w-5 h-5 text-slate-400" />
                  <span className="text-xs text-slate-500 text-center px-4">
                    Klik untuk pilih foto/dokumen
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
                      <div key={i} className="flex items-center justify-between gap-2 bg-slate-50 rounded-lg px-3 py-2 text-sm">
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
