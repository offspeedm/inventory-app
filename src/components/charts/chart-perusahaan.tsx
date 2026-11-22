// src/components/charts/chart-perusahaan.tsx
"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type DataItem = { nama: string; jumlah: number };

export function ChartPerusahaan({ data }: { data: DataItem[] }) {
  const total = data.reduce((sum, item) => sum + item.jumlah, 0);

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">
            Jumlah Perangkat per Perusahaan
          </h3>
          <p className="text-xs text-slate-400">
            Distribusi perangkat aktif di setiap entitas
          </p>
        </div>
        <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold tabular-nums text-indigo-600">
          {total} unit
        </span>
      </div>

      {data.every((d) => d.jumlah === 0) ? (
        <p className="flex flex-1 items-center justify-center py-16 text-sm text-slate-400">
          Belum ada data perangkat.
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={270}>
          <BarChart
            data={data}
            margin={{ top: 8, right: 12, left: -16, bottom: 42 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f1f5f9"
            />
            <XAxis
              dataKey="nama"
              angle={-25}
              textAnchor="end"
              height={60}
              tick={{ fontSize: 11, fill: "#64748b" }}
              axisLine={{ stroke: "#e2e8f0" }}
              tickLine={false}
              interval={0}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: "#f8fafc" }}
              contentStyle={{
                borderRadius: 10,
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 12px rgba(15, 23, 42, 0.06)",
                fontSize: 12,
              }}
            />
            <Bar
              dataKey="jumlah"
              fill="#4f46e5"
              maxBarSize={42}
              radius={[6, 6, 0, 0]}
              name="Perangkat"
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
