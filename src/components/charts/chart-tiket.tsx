// src/components/charts/chart-tiket.tsx
"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type DataItem = { bulan: string; jumlah: number };

export function ChartTiket({ data }: { data: DataItem[] }) {
  const total6Bulan = data.reduce((sum, item) => sum + item.jumlah, 0);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">
            Tren Tiket Troubleshoot per Bulan
          </h3>
          <p className="text-xs text-slate-400">
            Jumlah laporan kendala dalam 6 bulan terakhir
          </p>
        </div>
        <span className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold tabular-nums text-rose-600">
          {total6Bulan} tiket
        </span>
      </div>

      {data.every((d) => d.jumlah === 0) ? (
        <p className="py-16 text-center text-sm text-slate-400">
          Belum ada data tiket dalam 6 bulan terakhir.
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart
            data={data}
            margin={{ top: 8, right: 12, left: -16, bottom: 4 }}
          >
            <defs>
              <linearGradient id="tiketAreaFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f1f5f9"
            />
            <XAxis
              dataKey="bulan"
              tick={{ fontSize: 12, fill: "#64748b" }}
              axisLine={{ stroke: "#e2e8f0" }}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 12, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 10,
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 12px rgba(15, 23, 42, 0.06)",
                fontSize: 12,
              }}
            />
            <Area
              type="monotone"
              dataKey="jumlah"
              stroke="#f43f5e"
              strokeWidth={2.5}
              fill="url(#tiketAreaFill)"
              dot={{ r: 4, fill: "#f43f5e", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6 }}
              name="Tiket"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
