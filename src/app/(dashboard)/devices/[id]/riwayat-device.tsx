"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Building2, Pencil, Trash2, Plus, Check, X } from "lucide-react";
import {
  tambahRiwayatPengguna,
  updateRiwayatPengguna,
  hapusRiwayatPengguna,
  tambahRiwayatPenempatan,
  updateRiwayatPenempatan,
  hapusRiwayatPenempatan,
} from "./actions";
import { SearchableSelect } from "@/components/searchable-select";

type Option = { id: number; nama: string };
type Branch = Option & { companyId: number | null };

export type AssignmentItem = {
  id: number;
  userId: number | null;
  tglMulai: Date | string | null;
  tglSelesai: Date | string | null;
  user: { nama: string } | null;
};

export type PlacementItem = {
  id: number;
  companyId: number | null;
  branchId: number | null;
  tglMulai: Date | string;
  tglSelesai: Date | string | null;
  company: { nama: string } | null;
  branch: { nama: string } | null;
};

function fmtTanggal(d: Date | string | null): string {
  if (!d) return "sekarang";
  return new Date(d).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function toDateInput(d: Date | string | null): string {
  if (!d) return "";
  return new Date(d).toISOString().slice(0, 10);
}

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20";

// ============================================================================
// 1. KARTU RIWAYAT PENGGUNA
// ============================================================================
export function RiwayatPenggunaCard({
  deviceId,
  assignments,
  users,
}: {
  deviceId: number;
  assignments: AssignmentItem[];
  users: Option[];
}) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);

  const [userId, setUserId] = useState("");
  const [tglMulai, setTglMulai] = useState("");
  const [tglSelesai, setTglSelesai] = useState("");

  const userOptions = useMemo(
    () => users.map((u) => ({ value: String(u.id), label: u.nama })),
    [users],
  );

  function mulaiEdit(item: AssignmentItem) {
    setAdding(false);
    setEditingId(item.id);
    setUserId(item.userId ? String(item.userId) : "");
    setTglMulai(toDateInput(item.tglMulai));
    setTglSelesai(toDateInput(item.tglSelesai));
  }

  function mulaiTambah() {
    setEditingId(null);
    setAdding(true);
    setUserId("");
    setTglMulai(new Date().toISOString().slice(0, 10));
    setTglSelesai("");
  }

  function batalForm() {
    setEditingId(null);
    setAdding(false);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setSaving(true);
    try {
      if (adding) {
        await tambahRiwayatPengguna(formData);
      } else {
        await updateRiwayatPengguna(formData);
      }
      batalForm();
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Hapus catatan riwayat pengguna ini?")) return;
    const formData = new FormData();
    formData.set("id", String(id));
    formData.set("device_id", String(deviceId));
    await hapusRiwayatPengguna(formData);
    if (editingId === id) batalForm();
    router.refresh();
  }

  function renderForm(id?: number) {
    return (
      <form
        onSubmit={handleSubmit}
        className="space-y-2.5 rounded-xl border border-amber-200 bg-amber-50/40 p-3"
      >
        {id !== undefined && <input type="hidden" name="id" value={id} />}
        <input type="hidden" name="device_id" value={deviceId} />

        <div>
          <label className="mb-1 block text-[11px] font-medium text-slate-600">
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

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="mb-1 block text-[11px] font-medium text-slate-600">
              Tanggal Mulai
            </label>
            <input
              type="date"
              name="tgl_mulai"
              value={tglMulai}
              onChange={(e) => setTglMulai(e.target.value)}
              required
              className={inputClass}
            />
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-[11px] font-medium text-slate-600">
                Tanggal Selesai
              </label>
              {tglSelesai && (
                <button
                  type="button"
                  onClick={() => setTglSelesai("")}
                  className="text-[10px] font-medium text-indigo-600 hover:underline"
                >
                  Sekarang
                </button>
              )}
            </div>
            <input
              type="date"
              name="tgl_selesai"
              value={tglSelesai}
              onChange={(e) => setTglSelesai(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
        <p className="text-[10px] text-slate-400">
          Kosongkan tanggal selesai jika perangkat masih digunakan saat ini.
        </p>

        <div className="flex justify-end gap-1.5 pt-1">
          <button
            type="button"
            onClick={batalForm}
            disabled={saving}
            className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"
          >
            <X className="h-3.5 w-3.5" /> Batal
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            <Check className="h-3.5 w-3.5" />
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
            <User className="h-4 w-4" />
          </span>
          <h2 className="font-semibold text-slate-800">Riwayat Pengguna</h2>
        </div>

        {!adding && (
          <button
            type="button"
            onClick={mulaiTambah}
            className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 transition-colors hover:bg-amber-100"
          >
            <Plus className="h-3.5 w-3.5" /> Tambah
          </button>
        )}
      </div>

      {adding && <div className="mb-4">{renderForm()}</div>}

      {assignments.length === 0 && !adding ? (
        <p className="py-4 text-center text-sm text-slate-400">
          Belum ada riwayat pengguna.
        </p>
      ) : (
        <ul className="max-h-80 space-y-3 overflow-y-auto pr-1">
          {assignments.map((a) => (
            <li
              key={a.id}
              className="group relative border-l-2 border-slate-100 pl-4"
            >
              <span className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-amber-500" />

              {editingId === a.id ? (
                renderForm(a.id)
              ) : (
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    {a.userId ? (
                      <Link
                        href={`/users/${a.userId}`}
                        className="inline-block text-sm font-medium text-slate-700 transition-colors hover:text-indigo-600 hover:underline"
                      >
                        {a.user?.nama ?? "Tidak diketahui"}
                      </Link>
                    ) : (
                      <p className="text-sm font-medium text-slate-700">
                        {a.user?.nama ?? "Tidak diketahui"}
                      </p>
                    )}
                    <p className="text-xs text-slate-400">
                      {fmtTanggal(a.tglMulai)} — {fmtTanggal(a.tglSelesai)}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-0.5 opacity-70 transition-opacity group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => mulaiEdit(a)}
                      title="Edit riwayat pengguna"
                      className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-indigo-50 hover:text-indigo-600"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(a.id)}
                      title="Hapus riwayat pengguna"
                      className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ============================================================================
// 2. KARTU RIWAYAT PENEMPATAN
// ============================================================================
export function RiwayatPenempatanCard({
  deviceId,
  placements,
  companies,
  branches,
}: {
  deviceId: number;
  placements: PlacementItem[];
  companies: Option[];
  branches: Branch[];
}) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);

  const [companyId, setCompanyId] = useState("");
  const [branchId, setBranchId] = useState("");
  const [tglMulai, setTglMulai] = useState("");
  const [tglSelesai, setTglSelesai] = useState("");

  const filteredBranches = useMemo(
    () =>
      companyId
        ? branches.filter((b) => b.companyId === Number(companyId))
        : [],
    [branches, companyId],
  );

  const companyOptions = useMemo(
    () => companies.map((c) => ({ value: String(c.id), label: c.nama })),
    [companies],
  );

  const branchOptions = useMemo(
    () => filteredBranches.map((b) => ({ value: String(b.id), label: b.nama })),
    [filteredBranches],
  );

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

  function mulaiEdit(item: PlacementItem) {
    setAdding(false);
    setEditingId(item.id);
    setCompanyId(item.companyId ? String(item.companyId) : "");
    setBranchId(item.branchId ? String(item.branchId) : "");
    setTglMulai(toDateInput(item.tglMulai));
    setTglSelesai(toDateInput(item.tglSelesai));
  }

  function mulaiTambah() {
    setEditingId(null);
    setAdding(true);
    setCompanyId("");
    setBranchId("");
    setTglMulai(new Date().toISOString().slice(0, 10));
    setTglSelesai("");
  }

  function batalForm() {
    setEditingId(null);
    setAdding(false);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setSaving(true);
    try {
      if (adding) {
        await tambahRiwayatPenempatan(formData);
      } else {
        await updateRiwayatPenempatan(formData);
      }
      batalForm();
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Hapus catatan riwayat penempatan ini?")) return;
    const formData = new FormData();
    formData.set("id", String(id));
    formData.set("device_id", String(deviceId));
    await hapusRiwayatPenempatan(formData);
    if (editingId === id) batalForm();
    router.refresh();
  }

  function renderForm(id?: number) {
    return (
      <form
        onSubmit={handleSubmit}
        className="space-y-2.5 rounded-xl border border-emerald-200 bg-emerald-50/40 p-3"
      >
        {id !== undefined && <input type="hidden" name="id" value={id} />}
        <input type="hidden" name="device_id" value={deviceId} />

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-[11px] font-medium text-slate-600">
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
            <label className="mb-1 block text-[11px] font-medium text-slate-600">
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
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="mb-1 block text-[11px] font-medium text-slate-600">
              Tanggal Mulai
            </label>
            <input
              type="date"
              name="tgl_mulai"
              value={tglMulai}
              onChange={(e) => setTglMulai(e.target.value)}
              required
              className={inputClass}
            />
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-[11px] font-medium text-slate-600">
                Tanggal Selesai
              </label>
              {tglSelesai && (
                <button
                  type="button"
                  onClick={() => setTglSelesai("")}
                  className="text-[10px] font-medium text-indigo-600 hover:underline"
                >
                  Sekarang
                </button>
              )}
            </div>
            <input
              type="date"
              name="tgl_selesai"
              value={tglSelesai}
              onChange={(e) => setTglSelesai(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
        <p className="text-[10px] text-slate-400">
          Kosongkan tanggal selesai jika masih ditempatkan di lokasi ini.
        </p>

        <div className="flex justify-end gap-1.5 pt-1">
          <button
            type="button"
            onClick={batalForm}
            disabled={saving}
            className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"
          >
            <X className="h-3.5 w-3.5" /> Batal
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            <Check className="h-3.5 w-3.5" />
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <Building2 className="h-4 w-4" />
          </span>
          <h2 className="font-semibold text-slate-800">Riwayat Penempatan</h2>
        </div>

        {!adding && (
          <button
            type="button"
            onClick={mulaiTambah}
            className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-100"
          >
            <Plus className="h-3.5 w-3.5" /> Tambah
          </button>
        )}
      </div>

      {adding && <div className="mb-4">{renderForm()}</div>}

      {placements.length === 0 && !adding ? (
        <p className="py-4 text-center text-sm text-slate-400">
          Belum ada riwayat penempatan.
        </p>
      ) : (
        <ul className="max-h-80 space-y-3 overflow-y-auto pr-1">
          {placements.map((p) => (
            <li
              key={p.id}
              className="group relative border-l-2 border-slate-100 pl-4"
            >
              <span className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-emerald-500" />

              {editingId === p.id ? (
                renderForm(p.id)
              ) : (
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-700">
                      {p.company?.nama ?? "-"}
                      {p.branch ? ` — ${p.branch.nama}` : ""}
                    </p>
                    <p className="text-xs text-slate-400">
                      {fmtTanggal(p.tglMulai)} — {fmtTanggal(p.tglSelesai)}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-0.5 opacity-70 transition-opacity group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => mulaiEdit(p)}
                      title="Edit riwayat penempatan"
                      className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-indigo-50 hover:text-indigo-600"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(p.id)}
                      title="Hapus riwayat penempatan"
                      className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
