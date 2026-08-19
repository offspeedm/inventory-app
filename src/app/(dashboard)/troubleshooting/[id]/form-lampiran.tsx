"use client";

import { useRef, useState } from "react";
import { Upload, X, FileText, Image as ImageIcon } from "lucide-react";
import { uploadLampiranTiket } from "./actions";

export function FormLampiranTiket({ ticketId }: { ticketId: number }) {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [selected, setSelected] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSelected(Array.from(e.target.files ?? []));
  }

  function hapusPilihan(idx: number) {
    const sisa = selected.filter((_, i) => i !== idx);
    const dt = new DataTransfer();
    sisa.forEach((f) => dt.items.add(f));
    if (inputRef.current) inputRef.current.files = dt.files;
    setSelected(sisa);
  }

  return (
    <form
      ref={formRef}
      action={async (formData: FormData) => {
        setUploading(true);
        await uploadLampiranTiket(formData);
        setSelected([]);
        formRef.current?.reset();
        setUploading(false);
      }}
      className="space-y-3"
    >
      <input type="hidden" name="ticket_id" value={ticketId} />

      <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-300 rounded-xl py-6 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/40 transition-colors">
        <Upload className="w-6 h-6 text-slate-400" />
        <span className="text-sm text-slate-500 text-center px-4">
          Klik untuk pilih foto/lampiran
          <span className="block text-xs text-slate-400">
            Bisa pilih lebih dari satu file sekaligus
          </span>
        </span>
        <input
          ref={inputRef}
          type="file"
          name="files"
          multiple
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
          className="hidden"
          onChange={handleChange}
        />
      </label>

      {selected.length > 0 && (
        <div className="grid gap-2">
          {selected.map((f, i) => (
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
                onClick={() => hapusPilihan(i)}
                className="text-slate-400 hover:text-red-500 shrink-0"
                aria-label="Batalkan file ini"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        type="submit"
        disabled={selected.length === 0 || uploading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors"
      >
        {uploading ? "Mengunggah…" : selected.length > 0 ? `Unggah ${selected.length} file` : "Pilih file dulu"}
      </button>
    </form>
  );
}
