"use client";

import { useState, type FormEvent } from "react";
import { Wrench, Check, Tag } from "lucide-react";
import { updateTiket } from "../actions";
import {
  KATEGORI_MASALAH,
  URGENCY_OPTIONS,
  STATUS_OPTIONS,
  urgencyColor,
  statusColor,
} from "@/config/ticket-fields";

type Option = { id: number; nama: string };
type Branch = Option & { companyId: number | null };
type UserOpt = Option & { divisi: string | null; companyId: number | null };
type DeviceOpt = Option & { userId: number | null };

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
  deviceId: number | null;
  userId: number | null;
  userTerkendalaId: number | null;
  teknisiId: number | null;
  companyId: number | null;
  branchId: number | null;
};

function toDateTimeInputValue(value: Date | string): string {
  const d = new Date(value);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

const fieldWrap =
  "group relative -mx-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-slate-50 focus-within:bg-indigo-50/60";
const fieldLabel = "mb-0.5 block text-[11px] font-medium text-slate-400";
const fieldInput =
  "w-full border-0 border-b border-dashed border-slate-200 bg-transparent p-0 pb-0.5 text-sm font-medium text-slate-800 focus:border-solid focus:border-indigo-400 focus:outline-none focus:ring-0";
const fieldSelect = fieldInput + " cursor-pointer";
const fieldTextarea = fieldInput + " resize-y";

export function DetailFormTiket({
  ticket,
  companies,
  branches,
  users,
  devices,
}: {
  ticket: TicketData;
  companies: Option[];
  branches: Branch[];
  users: UserOpt[];
  devices: DeviceOpt[];
}) {
  const [companyId, setCompanyId] = useState(
    ticket.companyId ? String(ticket.companyId) : "",
  );
  const [branchId, setBranchId] = useState(
    ticket.branchId ? String(ticket.branchId) : "",
  );
  const [userId, setUserId] = useState(
    ticket.userId ? String(ticket.userId) : "",
  );
  const [userTerkendalaId, setUserTerkendalaId] = useState(
    ticket.userTerkendalaId ? String(ticket.userTerkendalaId) : "",
  );
  const [deviceId, setDeviceId] = useState(
    ticket.deviceId ? String(ticket.deviceId) : "",
  );
  const [teknisiId, setTeknisiId] = useState(
    ticket.teknisiId ? String(ticket.teknisiId) : "",
  );
  const [divisi, setDivisi] = useState(ticket.divisi ?? "");
  const [saving, setSaving] = useState(false);
  const [savedTick, setSavedTick] = useState(0);

  const filteredBranches = companyId
    ? branches.filter((b) => b.companyId === Number(companyId))
    : [];
  const filteredDevices = userTerkendalaId
    ? devices.filter((d) => d.userId === Number(userTerkendalaId))
    : devices;

  function handleUserTerkendalaChange(value: string) {
    setUserTerkendalaId(value);
    const u = users.find((x) => String(x.id) === value);
    if (u) {
      setDivisi(u.divisi ?? "");
      setCompanyId(u.companyId ? String(u.companyId) : "");
      setBranchId("");
    }
  }

  // PENTING: pakai onSubmit + preventDefault (bukan prop `action` pada
  // <form>). Kalau dipasang sebagai form action, React otomatis me-reset
  // seluruh <select> (Pelapor, User Terkendala, Perangkat, Perusahaan,
  // Cabang, Teknisi) setelah data tersimpan — sehingga tampilan sempat
  // kosong walau data sudah benar di database.
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setSaving(true);
    await updateTiket(formData);
    setSaving(false);
    setSavedTick((t) => t + 1);
  }

  return (
    <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <form onSubmit={handleSubmit} className="grid gap-4">
        <input type="hidden" name="id" value={ticket.id} />

        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-orange-600 text-white shadow-sm">
            <Wrench className="h-7 w-7" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className={fieldWrap}>
                  <label className={fieldLabel}>Judul</label>
                  <input
                    name="judul"
                    defaultValue={ticket.judul}
                    required
                    className={fieldInput + " text-lg font-bold"}
                  />
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {ticket.noTiket && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-2.5 py-0.5 font-mono text-xs font-medium text-white">
                      <Tag className="h-3 w-3" /> {ticket.noTiket}
                    </span>
                  )}
                  <span
                    className={
                      "inline-block rounded-full px-2.5 py-0.5 text-xs font-medium " +
                      urgencyColor(ticket.prioritas)
                    }
                  >
                    {ticket.prioritas}
                  </span>
                  <span
                    className={
                      "inline-block rounded-full px-2.5 py-0.5 text-xs font-medium " +
                      statusColor(ticket.status)
                    }
                  >
                    {ticket.status}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:from-indigo-700 hover:to-violet-700 disabled:opacity-60"
              >
                <Check className="h-4 w-4" />
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
            {savedTick > 0 && !saving && (
              <p className="mt-1 text-xs text-emerald-600">
                Perubahan tersimpan.
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className={fieldWrap}>
            <label className={fieldLabel}>Kategori</label>
            <select
              name="kategori"
              defaultValue={ticket.kategori ?? ""}
              className={fieldSelect}
            >
              <option value="">-</option>
              {KATEGORI_MASALAH.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>
          <div className={fieldWrap}>
            <label className={fieldLabel}>Urgency</label>
            <select
              name="urgency"
              defaultValue={ticket.prioritas}
              className={fieldSelect}
            >
              {URGENCY_OPTIONS.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
          <div className={fieldWrap}>
            <label className={fieldLabel}>Status</label>
            <select
              name="status"
              defaultValue={ticket.status}
              className={fieldSelect}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={fieldWrap}>
          <label className={fieldLabel}>Waktu Laporan</label>
          <input
            name="waktu_lapor"
            type="datetime-local"
            defaultValue={toDateTimeInputValue(ticket.tglLapor)}
            className={fieldInput}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className={fieldWrap}>
            <label className={fieldLabel}>Pelapor</label>
            <select
              name="user_id"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className={fieldSelect}
            >
              <option value="">-</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nama}
                </option>
              ))}
            </select>
          </div>
          <div className={fieldWrap}>
            <label className={fieldLabel}>User Terkendala</label>
            <select
              name="user_terkendala_id"
              value={userTerkendalaId}
              onChange={(e) => handleUserTerkendalaChange(e.target.value)}
              className={fieldSelect}
            >
              <option value="">-</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nama}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={fieldWrap}>
          <label className={fieldLabel}>Perangkat Terkendala</label>
          <select
            name="device_id"
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value)}
            className={fieldSelect}
          >
            <option value="">Tidak ada</option>
            {filteredDevices.map((d) => (
              <option key={d.id} value={d.id}>
                {d.nama}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className={fieldWrap}>
            <label className={fieldLabel}>Divisi</label>
            <input
              name="divisi"
              value={divisi}
              onChange={(e) => setDivisi(e.target.value)}
              placeholder="-"
              className={fieldInput}
            />
          </div>
          <div className={fieldWrap}>
            <label className={fieldLabel}>Perusahaan</label>
            <select
              name="company_id"
              value={companyId}
              onChange={(e) => {
                setCompanyId(e.target.value);
                setBranchId("");
              }}
              className={fieldSelect}
            >
              <option value="">-</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nama}
                </option>
              ))}
            </select>
          </div>
          <div className={fieldWrap}>
            <label className={fieldLabel}>Cabang</label>
            <select
              name="branch_id"
              value={branchId}
              onChange={(e) => setBranchId(e.target.value)}
              disabled={!companyId}
              className={
                fieldSelect +
                " disabled:cursor-not-allowed disabled:text-slate-300"
              }
            >
              <option value="">-</option>
              {filteredBranches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.nama}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={fieldWrap}>
          <label className={fieldLabel}>Kendala</label>
          <textarea
            name="kendala"
            rows={3}
            defaultValue={ticket.kendala ?? ""}
            placeholder="-"
            className={fieldTextarea}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className={fieldWrap}>
            <label className={fieldLabel}>Teknisi</label>
            <select
              name="teknisi_id"
              value={teknisiId}
              onChange={(e) => setTeknisiId(e.target.value)}
              className={fieldSelect}
            >
              <option value="">Belum ditugaskan</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nama}
                </option>
              ))}
            </select>
          </div>
          <div className={fieldWrap}>
            <label className={fieldLabel}>Diagnosa</label>
            <input
              name="diagnosa"
              defaultValue={ticket.diagnosa ?? ""}
              placeholder="-"
              className={fieldInput}
            />
          </div>
        </div>

        <div className={fieldWrap}>
          <label className={fieldLabel}>Solusi</label>
          <textarea
            name="solusi"
            rows={2}
            defaultValue={ticket.solusi ?? ""}
            placeholder="-"
            className={fieldTextarea}
          />
        </div>
        <div className={fieldWrap}>
          <label className={fieldLabel}>Catatan Teknisi</label>
          <textarea
            name="catatan_teknisi"
            rows={2}
            defaultValue={ticket.catatanTeknisi ?? ""}
            placeholder="-"
            className={fieldTextarea}
          />
        </div>
      </form>
    </section>
  );
}
