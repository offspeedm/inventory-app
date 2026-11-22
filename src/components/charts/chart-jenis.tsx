// src/components/charts/chart-jenis.tsx
"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

type DataItem = {
  nama: string;
  jumlah: number;
};

const COLORS = [
  "#4f46e5",
  "#10b981",
  "#f59e0b",
  "#0ea5e9",
  "#8b5cf6",
  "#f43f5e",
  "#64748b",
];

export function ChartJenis({ data }: { data: DataItem[] }) {
  const total = data.reduce((sum, item) => sum + item.jumlah, 0);

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">
            Komposisi Perangkat berdasarkan Jenis
          </h3>
          <p className="text-xs text-slate-400">
            Proporsi kategori perangkat aktif
          </p>
        </div>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold tabular-nums text-slate-600">
          {data.length} jenis
        </span>
      </div>

      {data.length === 0 ? (
        <p className="flex flex-1 items-center justify-center py-16 text-sm text-slate-400">
          Belum ada data perangkat.
        </p>
      ) : (
        <div className="grid flex-1 items-center gap-4 sm:grid-cols-5">
          <div className="sm:col-span-3">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="jumlah"
                  nameKey="nama"
                  cx="50%"
                  cy="50%"
                  innerRadius={54}
                  outerRadius={84}
                  paddingAngle={2}
                >
                  {data.map((item, index) => (
                    <Cell
                      key={`${item.nama}-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: 10,
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 12px rgba(15, 23, 42, 0.06)",
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <ul className="space-y-2 sm:col-span-2">
            {data.map((item, index) => {
              const persen =
                total > 0 ? Math.round((item.jumlah / total) * 100) : 0;
              return (
                <li
                  key={item.nama}
                  className="flex items-center justify-between gap-2 text-xs"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="truncate font-medium text-slate-700">
                      {item.nama}
                    </span>
                  </span>
                  <span className="shrink-0 tabular-nums text-slate-500">
                    {item.jumlah}{" "}
                    <span className="text-[11px] text-slate-400">
                      ({persen}%)
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
