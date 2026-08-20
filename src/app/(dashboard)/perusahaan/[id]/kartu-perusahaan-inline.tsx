"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, MapPin, Network, Pencil, Phone, Users, MonitorSmartphone, Wrench, Save, X } from "lucide-react";
import { updatePerusahaan } from "../actions";

type Company = {
  id: number;
  nama: string;
  inisial: string | null;
  alamat: string | null;
  noTelp: string | null;
};

type Ringkasan = {
  cabang: number;
  user: number;
  device: number;
  tiketAktif: number;
};

export function KartuPerusahaanInline({
  company,
  ringkasan,
}: {
  company: Company;
  ringkasan: Ringkasan;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

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
              await updatePerusahaan(formData);
              setEditing(false);
              router.refresh();
            } finally {
              setSaving(false);
            }
          }}
        >
          <input type="hidden" name="id" value={company.id} />

          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-lg font-bold text-white shadow-sm">
              {company.inisial || <Building2 className="h-7 w-7" />}
            </div>
            <div className="min-w-0 flex-1 grid gap-3">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="mb-1 block text-xs font-medium text-slate-500">
                    Nama Perusahaan
                  </label>
                  <input
                    name="nama"
                    required
                    defaultValue={company.nama}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">
                    Inisial
                  </label>
                  <input
                    name="inisial"
                    defaultValue={company.inisial ?? ""}
                    maxLength={10}
                    className={inputClass + " uppercase"}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">
                  Alamat
                </label>
                <textarea
                  name="alamat"
                  rows={3}
                  defaultValue={company.alamat ?? ""}
                  className={inputClass + " resize-y"}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">
                  No. Telepon
                </label>
                <input
                  name="no_telp"
                  defaultValue={company.noTelp ?? ""}
                  className={inputClass}
                />
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
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-lg font-bold text-white shadow-sm">
          {company.inisial || <Building2 className="h-7 w-7" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-xl font-bold text-slate-800">{company.nama}</h1>
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-100"
            >
              <Pencil className="h-3.5 w-3.5" /> Edit
            </button>
          </div>

          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
            {company.alamat && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {company.alamat}
              </span>
            )}
            {company.noTelp && (
              <span className="inline-flex items-center gap-1">
                <Phone className="h-3.5 w-3.5" /> {company.noTelp}
              </span>
            )}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Ringkasan icon={Network} label="Cabang" value={ringkasan.cabang} color="bg-emerald-50 text-emerald-600" />
            <Ringkasan icon={Users} label="User" value={ringkasan.user} color="bg-amber-50 text-amber-600" />
            <Ringkasan icon={MonitorSmartphone} label="Devices" value={ringkasan.device} color="bg-indigo-50 text-indigo-600" />
            <Ringkasan icon={Wrench} label="Tiket Aktif" value={ringkasan.tiketAktif} color="bg-rose-50 text-rose-600" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Ringkasan({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="rounded-lg bg-slate-50 p-3 text-center">
      <span className={`mb-1 inline-flex h-7 w-7 items-center justify-center rounded-lg ${color}`}>
        <Icon className="h-3.5 w-3.5" />
      </span>
      <p className="text-lg font-bold leading-none text-slate-800">{value}</p>
      <p className="mt-1 text-[11px] text-slate-500">{label}</p>
    </div>
  );
}
