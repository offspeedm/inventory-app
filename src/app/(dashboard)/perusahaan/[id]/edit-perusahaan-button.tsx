"use client";

import { useState } from "react";
import { Building2, Pencil, X } from "lucide-react";
import { updatePerusahaan } from "../actions";

type Company = {
  id: number;
  nama: string;
  inisial: string | null;
  alamat: string | null;
  noTelp: string | null;
};

export function EditPerusahaanButton({ company }: { company: Company }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const inputClass = "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500";

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700">
        <Pencil className="h-4 w-4" /> Edit Perusahaan
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button type="button" aria-label="Tutup modal" onClick={() => setOpen(false)} className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm" />
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
            <ModalHeader icon={Building2} title="Edit Perusahaan" subtitle="Perbarui informasi perusahaan" close={() => setOpen(false)} />
            <form action={async (formData) => { setSaving(true); try { await updatePerusahaan(formData); setOpen(false); } finally { setSaving(false); } }} className="grid gap-4 px-6 py-5">
              <input type="hidden" name="id" value={company.id} />
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2"><Label text="Nama Perusahaan" /><input name="nama" required defaultValue={company.nama} className={inputClass} /></div>
                <div><Label text="Inisial" /><input name="inisial" defaultValue={company.inisial || ""} maxLength={10} className={inputClass + " uppercase"} /></div>
              </div>
              <div><Label text="Alamat" /><textarea name="alamat" rows={4} defaultValue={company.alamat || ""} className={inputClass + " resize-y"} /></div>
              <div><Label text="No. Telepon" /><input name="no_telp" defaultValue={company.noTelp || ""} className={inputClass} /></div>
              <ModalFooter saving={saving} close={() => setOpen(false)} />
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function Label({ text }: { text: string }) { return <label className="mb-1.5 block text-sm font-medium text-slate-700">{text}</label>; }
function ModalHeader({ icon: Icon, title, subtitle, close }: { icon: React.ComponentType<{ className?: string }>; title: string; subtitle: string; close: () => void }) {
  return <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600"><Icon className="h-5 w-5" /></span><div><h2 className="font-semibold text-slate-800">{title}</h2><p className="text-xs text-slate-400">{subtitle}</p></div></div><button type="button" onClick={close} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button></div>;
}
function ModalFooter({ saving, close }: { saving: boolean; close: () => void }) { return <div className="-mx-6 mt-1 flex justify-end gap-2 border-t border-slate-100 px-6 pt-4"><button type="button" onClick={close} className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200">Batal</button><button type="submit" disabled={saving} className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:bg-slate-300">{saving ? "Menyimpan..." : "Simpan Perubahan"}</button></div>; }
