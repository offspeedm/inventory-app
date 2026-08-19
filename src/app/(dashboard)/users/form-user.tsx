"use client";

import { useRef, useState } from "react";
import { Plus, X, UserPlus } from "lucide-react";
import { tambahUser } from "./actions";

type Company = { id: number; nama: string };
type Branch = { id: number; nama: string; companyId: number | null };

export function FormUser({
  companies,
  branches,
}: {
  companies: Company[];
  branches: Branch[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);
  const [companyId, setCompanyId] = useState<string>("");
  const [saving, setSaving] = useState(false);

  const filteredBranches = companyId
    ? branches.filter((b) => b.companyId === Number(companyId))
    : [];

  const inputClass =
    "w-full border border-slate-300 rounded-lg px-3 py-2 text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";

  function resetSemua() {
    formRef.current?.reset();
    setCompanyId("");
  }

  return (
    <>
      {/* Tombol pembuka popup */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setOpen(true)}
          className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all duration-200 hover:from-indigo-700 hover:to-violet-700 hover:shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
        >
          <span className="flex items-center justify-center rounded-full bg-white/20 p-0.5 transition-transform duration-200 group-hover:rotate-90">
            <Plus className="w-4 h-4" />
          </span>
          Tambah User
        </button>
      </div>

      {/* ===== Popup / Modal Tambah ===== */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
          />

          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg text-left animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white flex items-center justify-between px-6 py-4 border-b border-slate-100 z-10">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-100 text-indigo-600">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-slate-800 leading-tight">
                    Tambah User
                  </h2>
                  <p className="text-xs text-slate-400">Isi data pengguna baru</p>
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

            {/* Body form */}
            <form
              ref={formRef}
              action={async (formData: FormData) => {
                setSaving(true);
                await tambahUser(formData);
                resetSemua();
                setSaving(false);
                setOpen(false);
              }}
              className="px-6 py-5 grid gap-4"
            >
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Nama Lengkap
                </label>
                <input name="nama" placeholder="mis. Budi Santoso" required className={inputClass} />
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Email
                  </label>
                  <input name="email" type="email" placeholder="nama@perusahaan.com" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    No. Telepon
                  </label>
                  <input name="no_telp" placeholder="mis. 0812xxxxxxx" className={inputClass} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Divisi
                </label>
                <input name="divisi" placeholder="mis. IT / Finance / Operasional" className={inputClass} />
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Perusahaan
                  </label>
                  <select
                    name="company_id"
                    value={companyId}
                    onChange={(e) => setCompanyId(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Pilih perusahaan…</option>
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nama}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Cabang
                  </label>
                  <select
                    name="branch_id"
                    disabled={!companyId}
                    className={inputClass + " disabled:bg-slate-100"}
                  >
                    <option value="">
                      {companyId ? "Pilih cabang…" : "Pilih perusahaan dulu"}
                    </option>
                    {filteredBranches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.nama}
                      </option>
                    ))}
                  </select>
                </div>
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
