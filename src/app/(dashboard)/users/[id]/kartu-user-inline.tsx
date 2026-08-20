"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Layers, Mail, MonitorSmartphone, Network, Pencil, Phone, Save, X } from "lucide-react";
import { updateUser } from "../actions";

type Company = { id: number; nama: string };
type Branch = { id: number; nama: string; companyId: number | null };
type UserData = {
  id: number;
  nama: string;
  email: string | null;
  noTelp: string | null;
  divisi: string | null;
  status: string;
  companyId: number | null;
  branchId: number | null;
  company: { nama: string } | null;
  branch: { nama: string } | null;
};

export function KartuUserInline({
  user,
  companies,
  branches,
  jumlahDevice,
}: {
  user: UserData;
  companies: Company[];
  branches: Branch[];
  jumlahDevice: number;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [companyId, setCompanyId] = useState(user.companyId ? String(user.companyId) : "");
  const [branchId, setBranchId] = useState(user.branchId ? String(user.branchId) : "");

  const filteredBranches = companyId
    ? branches.filter((branch) => branch.companyId === Number(companyId))
    : [];

  const aktif = user.status !== "Non-Aktif";
  const inisial = user.nama
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const inputClass =
    "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500";

  // ===== MODE EDIT LANGSUNG =====
  if (editing) {
    return (
      <div className="mb-6 rounded-2xl border border-indigo-200 bg-white p-6 shadow-sm">
        <form
          action={async (formData) => {
            setSaving(true);
            try {
              await updateUser(formData);
              setEditing(false);
              router.refresh();
            } finally {
              setSaving(false);
            }
          }}
        >
          <input type="hidden" name="id" value={user.id} />

          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-lg font-bold text-white shadow-sm">
              {inisial}
            </div>
            <div className="min-w-0 flex-1 grid gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Nama Lengkap</label>
                <input name="nama" required defaultValue={user.nama} className={inputClass} />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">Email</label>
                  <input name="email" type="email" defaultValue={user.email ?? ""} className={inputClass} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">No. Telepon</label>
                  <input name="no_telp" defaultValue={user.noTelp ?? ""} className={inputClass} />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">Divisi</label>
                  <input name="divisi" defaultValue={user.divisi ?? ""} className={inputClass} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">Status</label>
                  <select name="status" defaultValue={aktif ? "Aktif" : "Non-Aktif"} className={inputClass}>
                    <option value="Aktif">Aktif</option>
                    <option value="Non-Aktif">Non-Aktif</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">Perusahaan</label>
                  <select
                    name="company_id"
                    value={companyId}
                    onChange={(e) => {
                      setCompanyId(e.target.value);
                      setBranchId("");
                    }}
                    className={inputClass}
                  >
                    <option value="">Pilih perusahaan</option>
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nama}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">Cabang</label>
                  <select
                    name="branch_id"
                    value={branchId}
                    onChange={(e) => setBranchId(e.target.value)}
                    disabled={!companyId}
                    className={inputClass + " disabled:bg-slate-100"}
                  >
                    <option value="">{companyId ? "Pilih cabang" : "Pilih perusahaan dulu"}</option>
                    {filteredBranches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.nama}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-2 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
            >
              <X className="h-4 w-4" /> Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:bg-slate-300"
            >
              <Save className="h-4 w-4" /> {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // ===== MODE TAMPIL BIASA =====
  return (
    <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-lg font-bold text-white shadow-sm">
          {inisial}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-slate-800">{user.nama}</h1>
              <span
                className={`mt-1 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  aktif ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${aktif ? "bg-emerald-500" : "bg-slate-400"}`} />
                {aktif ? "Aktif" : "Non-Aktif"}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-100"
            >
              <Pencil className="h-3.5 w-3.5" /> Edit
            </button>
          </div>

          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
            {user.email && (
              <span className="inline-flex items-center gap-1">
                <Mail className="h-3.5 w-3.5" /> {user.email}
              </span>
            )}
            {user.noTelp && (
              <span className="inline-flex items-center gap-1">
                <Phone className="h-3.5 w-3.5" /> {user.noTelp}
              </span>
            )}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
            <Info icon={Layers} label="Divisi" value={user.divisi ?? "-"} />
            <Info icon={Building2} label="Perusahaan" value={user.company?.nama ?? "-"} />
            <Info icon={Network} label="Cabang" value={user.branch?.nama ?? "-"} />
            <Info icon={MonitorSmartphone} label="Perangkat Dipegang" value={String(jumlahDevice)} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="flex items-center gap-1 text-xs text-slate-400">
        <Icon className="h-3 w-3" /> {label}
      </p>
      <p className="font-medium text-slate-700">{value}</p>
    </div>
  );
}
