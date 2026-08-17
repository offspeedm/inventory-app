"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type DataItem = { bulan: string; jumlah: number };

export function ChartTiket({ data }: { data: DataItem[] }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h3 className="text-sm font-semibold text-slate-700 mb-4">
        Tren Tiket Troubleshoot per Bulan
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="bulan" tick={{ fontSize: 12, fill: "#64748b" }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#64748b" }} />
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: "1px solid #e2e8f0",
              fontSize: 12,
            }}
          />
          <Line
            type="monotone"
            dataKey="jumlah"
            stroke="#10b981"
            strokeWidth={2.5}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            name="Tiket"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
