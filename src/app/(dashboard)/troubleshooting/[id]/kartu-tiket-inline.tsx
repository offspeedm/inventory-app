"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, MonitorSmartphone, Pencil, Save, Tag, User, UserCog, Wrench, X } from "lucide-react";
import { updateTiket } from "../actions";

type Option = { id: number; nama: string };
type Branch = Option & { companyId: number | null };
type DeviceOption = Option & { userId: number | null };

type TicketData = {
  id: number;
  noTiket: string | null;
  judul: string;
  kategori: string | null;
  kendala: string | null;
  diagnosa: string | null;
  solusi: string | null;
  catatanTeknisi: string | null;
  divisi: string | null;
  prioritas: string;
  status: string;
  tglLapor: Date | string;
  tglSelesai: Date | string | null;
  deviceId: number | null;
  userId: number | null;
  userTerkendalaId: number | null;
  teknisiId: number | null;
  companyId: number | null;
  branchId: number | null;
  device: { nama: string } | null;
  user: { nama: string } | null;
  userTerkendala: { nama: string } | null;
  teknisi: { nama: string } | null;
  company: { nama: string } | null;
  branch: { nama: string } | null;
};

const KATEGORI_MASALAH = ["Hardware", "Software", "Jaringan / Network", "Printer / Scanner", "Akun & Akses", "Lainnya"];
const URGENCY_OPTIONS = ["Tidak mengganggu pekerjaan", "Mengganggu pekerjaan", "Pekerjaan berhenti"];
const STATUS_OPTIONS = ["Baru", "Diproses", "Selesai"];

function urgencyColor(value: string) {
  switch (value) {
    case "Pekerjaan berhenti":
      return "bg-red-100 text-red-700";
    case "Mengganggu pekerjaan":
      return "bg-amber-100 text-amber-700";
    default:
      return "bg-slate-100 text-slate-600";
  }
}

function statusColor(value: string) {
  switch (value) {
    case "Baru":
      return "bg-blue-100 text-blue-700";
    case "Diproses":
      return "bg-amber-100 text-amber-700";
    case "Selesai":
      return "bg-green-100 text-green-700";
    default:
      return "bg-slate-100 text-slate-600";
  }
}

function toDateTimeInput(value: Date | string): string {
  const d = new Date(value);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

function fmtTanggal(value: Date | string | null): string {
  if (!value) return "-";
  return new Date(value).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function KartuTiketInline({
  ticket,
  companies,
  branches,
  users,
  devices,
}: {
  ticket: TicketData;
  companies: Option[];
  branches: Branch[];
  users: Option[];
  devices: DeviceOption[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [companyId, setCompanyId] = useState(ticket.companyId ? String(ticket.companyId) : "");
  const [branchId, setBranchId] = useState(ticket.branchId ? String(ticket.branchId) : "");
  const [userTerkendalaId, setUserTerkendalaId] = useState(
    ticket.userTerkendalaId ? String(ticket.userTerkendalaId) : ""
  );

  const filteredBranches = companyId
    ? branches.filter((b) => b.companyId === Number(companyId))
    : [];
  const filteredDevices = userTerkendalaId
    ? devices.filter((d) => d.userId === Number(userTerkendalaId))
    : devices;

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
              await updateTiket(formData);
              setEditing(false);
              router.refresh();
            } finally {
              setSaving(false);
            }
          }}
          className="grid gap-4"
        >
          <input type="hidden" name="id" value={ticket.id} />

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Judul</label>
            <input name="judul" required defaultValue={ticket.judul} className={inputClass} />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Kategori</label>
              <select name="kategori" defaultValue={ticket.kategori ?? ""} className={inputClass}>
                <option value="">Pilih kategori</option>
                {KATEGORI_MASALAH.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Urgency</label>
              <select name="urgency" defaultValue={ticket.prioritas} className={inputClass}>
                {URGENCY_OPTIONS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Status</label>
              <select name="status" defaultValue={ticket.status} className={inputClass}>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Waktu Laporan</label>
            <input
              name="waktu_lapor"
              type="datetime-local"
              defaultValue={toDateTimeInput(ticket.tglLapor)}
              className={inputClass}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Pelapor</label>
              <select name="user_id" defaultValue={ticket.userId ?? ""} className={inputClass}>
                <option value="">Pilih pelapor</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.nama}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">User Terkendala</label>
              <select
                name="user_terkendala_id"
                value={userTerkendalaId}
                onChange={(e) => setUserTerkendalaId(e.target.value)}
                className={inputClass}
              >
                <option value="">Pilih user</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.nama}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Perangkat Terkendala</label>
            <select name="device_id" defaultValue={ticket.deviceId ?? ""} className={inputClass}>
              <option value="">Tidak ada</option>
              {filteredDevices.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nama}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Divisi</label>
              <input name="divisi" defaultValue={ticket.divisi ?? ""} className={inputClass} />
            </div>
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
                <option value="">{companyId ? "Pilih cabang" : "Pilih PT dulu"}</option>
                {filteredBranches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.nama}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Kendala</label>
            <textarea
              name="kendala"
              rows={3}
              defaultValue={ticket.kendala ?? ""}
              className={inputClass + " resize-y"}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Teknisi</label>
              <select name="teknisi_id" defaultValue={ticket.teknisiId ?? ""} className={inputClass}>
                <option value="">Belum ditugaskan</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.nama}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Diagnosa</label>
              <input name="diagnosa" defaultValue={ticket.diagnosa ?? ""} className={inputClass} />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Solusi</label>
            <textarea
              name="solusi"
              rows={2}
              defaultValue={ticket.solusi ?? ""}
              className={inputClass + " resize-y"}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Catatan Teknisi</label>
            <textarea
              name="catatan_teknisi"
              rows={2}
              defaultValue={ticket.catatanTeknisi ?? ""}
              className={inputClass + " resize-y"}
            />
          </div>

          <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
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
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-orange-600 text-white shadow-sm">
          <Wrench className="h-7 w-7" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-xl font-bold text-slate-800">{ticket.judul}</h1>
              {ticket.noTiket && (
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-2.5 py-0.5 font-mono text-xs font-medium text-white">
                  <Tag className="h-3 w-3" /> {ticket.noTiket}
                </span>
              )}
              <span className={"inline-block rounded-full px-2.5 py-0.5 text-xs font-medium " + urgencyColor(ticket.prioritas)}>
                {ticket.prioritas}
              </span>
              <span className={"inline-block rounded-full px-2.5 py-0.5 text-xs font-medium " + statusColor(ticket.status)}>
                {ticket.status}
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

          <p className="mt-1 text-sm text-slate-500">
            {ticket.kategori ?? "Tanpa kategori"} · Dilaporkan {fmtTanggal(ticket.tglLapor)}
          </p>

          <div className="mt-5 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <Info icon={User} label="Pelapor" value={ticket.user?.nama ?? "-"} />
            <Info icon={UserCog} label="User Terkendala" value={ticket.userTerkendala?.nama ?? "-"} />
            <Info icon={Wrench} label="Teknisi" value={ticket.teknisi?.nama ?? "Belum ditugaskan"} />
            <Info icon={MonitorSmartphone} label="Perangkat" value={ticket.device?.nama ?? "-"} />
            <Info label="Divisi" value={ticket.divisi ?? "-"} />
            <Info icon={Building2} label="Perusahaan" value={ticket.company?.nama ?? "-"} />
            <Info label="Cabang" value={ticket.branch?.nama ?? "-"} />
            <Info label="Selesai Pada" value={fmtTanggal(ticket.tglSelesai)} />
          </div>

          <div className="mt-6 grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-2">
            <TeksPanjang label="Kendala" value={ticket.kendala} />
            <TeksPanjang label="Diagnosa" value={ticket.diagnosa} />
            <TeksPanjang label="Solusi" value={ticket.solusi} />
            <TeksPanjang label="Catatan Teknisi" value={ticket.catatanTeknisi} />
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
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="flex items-center gap-1 text-xs text-slate-400">
        {Icon && <Icon className="h-3 w-3" />} {label}
      </p>
      <p className="font-medium text-slate-700">{value}</p>
    </div>
  );
}

function TeksPanjang({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <p className="mb-1 text-xs text-slate-400">{label}</p>
      <p className="whitespace-pre-line text-sm text-slate-700">
        {value || <span className="italic text-slate-300">Belum diisi</span>}
      </p>
    </div>
  );
}
