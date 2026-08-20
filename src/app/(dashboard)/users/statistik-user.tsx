import { Building2, Layers } from "lucide-react";

type StatItem = { nama: string; jumlah: number };

const ACCENTS = [
  "from-blue-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-fuchsia-500 to-purple-600",
  "from-rose-500 to-red-600",
  "from-cyan-500 to-sky-600",
];

function BarStatistik({ items, totalMax }: { items: StatItem[]; totalMax: number }) {
  return (
    <div className="space-y-2.5">
      {items.map((item, i) => (
        <div key={item.nama}>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-600 font-medium truncate">{item.nama}</span>
            <span className="text-slate-400 shrink-0 ml-2">{item.jumlah} user</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${ACCENTS[i % ACCENTS.length]}`}
              style={{ width: `${totalMax > 0 ? (item.jumlah / totalMax) * 100 : 0}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function StatistikUser({
  perDivisi,
  perPerusahaan,
}: {
  perDivisi: StatItem[];
  perPerusahaan: StatItem[];
}) {
  const maxDivisi = Math.max(1, ...perDivisi.map((d) => d.jumlah));
  const maxPerusahaan = Math.max(1, ...perPerusahaan.map((d) => d.jumlah));

  return (
    <div className="grid gap-4 sm:grid-cols-2 mb-6">
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600">
            <Building2 className="w-4 h-4" />
          </span>
          <h3 className="font-semibold text-slate-800 text-sm">User per Perusahaan</h3>
        </div>
        {perPerusahaan.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">Belum ada data.</p>
        ) : (
          <BarStatistik items={perPerusahaan} totalMax={maxPerusahaan} />
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-amber-50 text-amber-600">
            <Layers className="w-4 h-4" />
          </span>
          <h3 className="font-semibold text-slate-800 text-sm">User per Divisi</h3>
        </div>
        {perDivisi.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">Belum ada data.</p>
        ) : (
          <BarStatistik items={perDivisi} totalMax={maxDivisi} />
        )}
      </div>
    </div>
  );
}
