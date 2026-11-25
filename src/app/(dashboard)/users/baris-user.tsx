// src/app/(dashboard)/users/baris-user.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Pencil, Trash2, Power, Eye, EyeOff, X } from "lucide-react";
import { hapusUser, toggleStatusUser, updateUser } from "./actions";
import { SearchableSelect } from "@/components/searchable-select";

export type UserSummary = {
  id: number;
  nama: string;
  email: string;
  jabatan?: string | null;
  role?: string;
  divisi: string | null;
  noTelp: string | null;
  status: string;
  companyId: number | null;
  branchId: number | null;
  company?: { id?: number; nama: string } | null;
  branch?: { id?: number; nama: string } | null;
};

type Company = { id: number; nama: string };
type Branch = { id: number; nama: string; companyId: number | null };

const DIVISI_LIST = [
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

const ROLE_OPTIONS = [
  { value: "Admin", label: "Admin" },
  { value: "Teknisi", label: "Teknisi" },
  { value: "Staff", label: "Staff" },
];

const STATUS_OPTIONS = [
  { value: "Aktif", label: "Aktif" },
  { value: "Non-Aktif", label: "Non-Aktif" },
];

function getInisial(nama: string): string {
  return nama
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function BarisUser({
  user,
  companies,
  branches,
  nomor,
  index,
  autoEditId,
  detailQuery = "",
}: {
  user: UserSummary;
  companies: Company[];
  branches: Branch[];
  nomor?: number;
  index?: number;
  autoEditId?: number | null;
  detailQuery?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedDivisi, setSelectedDivisi] = useState<string>(
    user.divisi ?? "",
  );
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(
    user.companyId ? String(user.companyId) : "",
  );
  const [selectedBranchId, setSelectedBranchId] = useState<string>(
    user.branchId ? String(user.branchId) : "",
  );
  const [selectedRole, setSelectedRole] = useState<string>(
    user.role ?? "Staff",
  );
  const [selectedStatus, setSelectedStatus] = useState<string>(user.status);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (autoEditId && autoEditId === user.id) {
      openEditModal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoEditId, user.id]);

  function openEditModal() {
    setErrorMsg(null);
    setShowPassword(false);
    setSelectedDivisi(user.divisi ?? "");
    setSelectedCompanyId(user.companyId ? String(user.companyId) : "");
    setSelectedBranchId(user.branchId ? String(user.branchId) : "");
    setSelectedRole(user.role ?? "Staff");
    setSelectedStatus(user.status);
    setEditing(true);
  }

  const nomorUrut = nomor ?? (typeof index === "number" ? index + 1 : "-");
  const detailHref = `/users/${user.id}${detailQuery}`;

  const divisiOptions = useMemo(() => {
    const set = new Set(DIVISI_LIST);
    if (user.divisi?.trim()) set.add(user.divisi.trim());
    return Array.from(set).map((d) => ({ value: d, label: d }));
  }, [user.divisi]);

  const companyOptions = useMemo(
    () => companies.map((c) => ({ value: String(c.id), label: c.nama })),
    [companies],
  );

  const branchOptions = useMemo(() => {
    const list = selectedCompanyId
      ? branches.filter(
          (b) =>
            b.companyId === null || String(b.companyId) === selectedCompanyId,
        )
      : branches;
    return list.map((b) => ({ value: String(b.id), label: b.nama }));
  }, [branches, selectedCompanyId]);

  function handleCompanyChange(nextCompanyId: string) {
    setSelectedCompanyId(nextCompanyId);
    if (!nextCompanyId) {
      setSelectedBranchId("");
      return;
    }
    const stillValid = branches.some(
      (b) =>
        String(b.id) === selectedBranchId &&
        (b.companyId === null || String(b.companyId) === nextCompanyId),
    );
    if (!stillValid) {
      setSelectedBranchId("");
    }
  }

  async function handleUpdate(formData: FormData) {
    setSubmitting(true);
    setErrorMsg(null);
    const res = await updateUser(user.id, formData);
    setSubmitting(false);

    if (res && "error" in res && res.error) {
      setErrorMsg(res.error);
      return;
    }
    setEditing(false);
  }

  async function handleToggleStatus() {
    const res = await toggleStatusUser(user.id);
    if (res && "error" in res && res.error) alert(res.error);
  }

  async function handleHapus() {
    if (!confirm(`Yakin ingin menghapus user "${user.nama}"?`)) return;
    await hapusUser(user.id);
  }

  return (
    <>
      <tr className="border-b border-slate-100 transition hover:bg-slate-50/80">
        {/* 1. No */}
        <td className="px-4 py-3 text-sm text-slate-500">{nomorUrut}</td>

        {/* 2. Nama / Kontak */}
        <td className="px-4 py-3">
          <Link href={detailHref} className="group flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
              {getInisial(user.nama)}
            </div>
            <div>
              <div className="font-medium text-slate-900 group-hover:text-indigo-600 group-hover:underline">
                {user.nama}
              </div>
              <div className="text-xs text-slate-500">
                {user.email}
                {user.noTelp ? ` · ${user.noTelp}` : ""}
              </div>
            </div>
          </Link>
        </td>

        {/* 3. Divisi */}
        <td className="px-4 py-3 text-sm text-slate-700">
          {user.divisi ? (
            <span className="inline-flex rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
              {user.divisi}
            </span>
          ) : (
            <span className="text-slate-400">-</span>
          )}
          {user.jabatan && (
            <div className="mt-0.5 text-xs text-slate-400">{user.jabatan}</div>
          )}
        </td>

        {/* 4. Penempatan */}
        <td className="px-4 py-3 text-sm text-slate-700">
          <div>{user.company?.nama || "-"}</div>
          <div className="text-xs text-slate-400">
            {user.branch?.nama || "-"}
          </div>
        </td>

        {/* 5. Status */}
        <td className="px-4 py-3">
          <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
              user.status === "Aktif"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-rose-50 text-rose-700"
            }`}
          >
            {user.status}
          </span>
        </td>

        {/* 6. Aksi */}
        <td className="px-4 py-3 text-right">
          <div className="inline-flex items-center gap-1">
            <button
              type="button"
              onClick={openEditModal}
              title="Edit user"
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-indigo-600"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleToggleStatus}
              title={user.status === "Aktif" ? "Nonaktifkan" : "Aktifkan"}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-amber-600"
            >
              <Power className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleHapus}
              title="Hapus user"
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-rose-600"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </td>
      </tr>

      {/* Modal Form Edit User */}
      {editing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs"
          onClick={() => setEditing(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-semibold text-slate-900">
                Edit Data User
              </h3>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {errorMsg && (
              <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                {errorMsg}
              </div>
            )}

            <form action={handleUpdate} className="space-y-3.5">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  name="nama"
                  defaultValue={user.nama}
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={user.email}
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">
                    No. Telepon
                  </label>
                  <input
                    type="text"
                    name="noTelp"
                    defaultValue={user.noTelp ?? ""}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">
                    Jabatan
                  </label>
                  <input
                    type="text"
                    name="jabatan"
                    defaultValue={user.jabatan ?? ""}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">
                    Divisi
                  </label>
                  <SearchableSelect
                    name="divisi"
                    value={selectedDivisi}
                    onChange={setSelectedDivisi}
                    options={divisiOptions}
                    placeholder="Ketik atau pilih divisi..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">
                    Perusahaan
                  </label>
                  <SearchableSelect
                    name="companyId"
                    value={selectedCompanyId}
                    onChange={handleCompanyChange}
                    options={companyOptions}
                    placeholder="Ketik nama perusahaan..."
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">
                    Cabang
                  </label>
                  <SearchableSelect
                    name="branchId"
                    value={selectedBranchId}
                    onChange={setSelectedBranchId}
                    disabled={!selectedCompanyId}
                    options={branchOptions}
                    placeholder={
                      selectedCompanyId
                        ? "Ketik nama cabang..."
                        : "Pilih perusahaan dulu"
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">
                    Role
                  </label>
                  <SearchableSelect
                    name="role"
                    value={selectedRole}
                    onChange={setSelectedRole}
                    options={ROLE_OPTIONS}
                    placeholder="Pilih role..."
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">
                    Status
                  </label>
                  <SearchableSelect
                    name="status"
                    value={selectedStatus}
                    onChange={setSelectedStatus}
                    options={STATUS_OPTIONS}
                    placeholder="Pilih status..."
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Password Baru
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Kosongkan jika tidak diubah"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 pr-10 text-sm focus:border-indigo-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
                >
                  {submitting ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default BarisUser;
