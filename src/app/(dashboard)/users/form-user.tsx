// src/app/(dashboard)/users/form-user.tsx
"use client";

import { useMemo, useRef, useState } from "react";
import { Plus, X, UserPlus, Eye, EyeOff } from "lucide-react";
import { tambahUser } from "./actions";
import { SearchableSelect } from "@/components/searchable-select";

type Company = { id: number; nama: string };
type Branch = { id: number; nama: string; companyId: number | null };

const DIVISI = [
  "Others",
  "Admin - HR",
  "Operational",
  "Finance - Accounting",
  "Billing",
  "IT-CI-BD",
  "Messenger",
  "Management",
  "Sales",
];

export function FormUser({
  companies,
  branches,
}: {
  companies: Company[];
  branches: Branch[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);
  const [divisi, setDivisi] = useState<string>("Others");
  const [companyId, setCompanyId] = useState<string>("");
  const [branchId, setBranchId] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const divisiOptions = useMemo(
    () => DIVISI.map((s) => ({ value: s, label: s })),
    [],
  );

  const companyOptions = useMemo(
    () => companies.map((c) => ({ value: String(c.id), label: c.nama })),
    [companies],
  );

  const branchOptions = useMemo(() => {
    if (!companyId) return [];
    return branches
      .filter((b) => b.companyId === Number(companyId))
      .map((b) => ({ value: String(b.id), label: b.nama }));
  }, [branches, companyId]);

  const inputClass =
    "w-full border border-slate-300 rounded-lg px-3 py-2 text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";

  function resetSemua() {
    formRef.current?.reset();
    setDivisi("Others");
    setCompanyId("");
    setBranchId("");
    setShowPassword(false);
    setErrorMsg(null);
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => {
            setErrorMsg(null);
            setOpen(true);
          }}
          className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all duration-200 hover:from-indigo-700 hover:to-violet-700 hover:shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
        >
          <span className="flex items-center justify-center rounded-full bg-white/20 p-0.5 transition-transform duration-200 group-hover:rotate-90">
            <Plus className="w-4 h-4" />
          </span>
          Tambah User
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

          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg text-left animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white flex items-center justify-between px-6 py-4 border-b border-slate-100 z-10">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-100 text-indigo-600">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-slate-800 leading-tight">
                    Tambah User
                  </h2>
                  <p className="text-xs text-slate-400">
                    Isi data pengguna baru beserta akses login
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
                setErrorMsg(null);
                const res = await tambahUser(formData);
                setSaving(false);
                if (!res.ok) {
                  setErrorMsg(res.error ?? "Gagal menambahkan user.");
                  return;
                }
                resetSemua();
                setOpen(false);
              }}
              className="px-6 py-5 grid gap-4"
            >
              {errorMsg && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-700">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Nama Lengkap
                </label>
                <input
                  name="nama"
                  placeholder="Nama User"
                  required
                  className={inputClass}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Email (Untuk Login)
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="nama@speedmark.co.id"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    No. Telepon
                  </label>
                  <input
                    name="no_telp"
                    placeholder="mis. 0812xxxxxxx"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Password Login
                </label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimal 6 karakter"
                    minLength={6}
                    className={inputClass + " pr-10"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Gunakan password ini untuk masuk ke aplikasi.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Divisi
                </label>
                <SearchableSelect
                  name="divisi"
                  value={divisi}
                  onChange={setDivisi}
                  options={divisiOptions}
                  placeholder="Ketik atau pilih divisi..."
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Perusahaan
                  </label>
                  <SearchableSelect
                    name="company_id"
                    value={companyId}
                    onChange={(nextId) => {
                      setCompanyId(nextId);
                      setBranchId("");
                    }}
                    options={companyOptions}
                    placeholder="Ketik nama perusahaan..."
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
                    disabled={!companyId}
                    options={branchOptions}
                    placeholder={
                      companyId
                        ? "Ketik nama cabang..."
                        : "Pilih perusahaan dulu"
                    }
                  />
                </div>
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
