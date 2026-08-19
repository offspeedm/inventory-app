// Konfigurasi pilihan tetap untuk form Troubleshooting.

export const KATEGORI_MASALAH = [
  "Hardware",
  "Software",
  "Jaringan / Network",
  "Printer / Scanner",
  "Akun & Akses",
  "Lainnya",
];

export const URGENCY_OPTIONS = [
  "Tidak mengganggu pekerjaan",
  "Mengganggu pekerjaan",
  "Pekerjaan berhenti",
];

export const STATUS_OPTIONS = ["Baru", "Diproses", "Selesai"];

export function urgencyColor(value: string): string {
  switch (value) {
    case "Pekerjaan berhenti":
      return "bg-red-100 text-red-700";
    case "Mengganggu pekerjaan":
      return "bg-amber-100 text-amber-700";
    case "Tidak mengganggu pekerjaan":
      return "bg-slate-100 text-slate-600";
    default:
      return "bg-slate-100 text-slate-600";
  }
}

export function statusColor(value: string): string {
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
