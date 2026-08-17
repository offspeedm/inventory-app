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
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h3 className="text-sm font-semibold text-slate-700 mb-4">
        Jumlah Perangkat per Perusahaan
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="nama"
            angle={-25}
            textAnchor="end"
            height={60}
            tick={{ fontSize: 11, fill: "#64748b" }}
            interval={0}
          />
          <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#64748b" }} />
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: "1px solid #e2e8f0",
              fontSize: 12,
            }}
          />
          <Bar dataKey="jumlah" fill="#4f46e5" radius={[6, 6, 0, 0]} name="Perangkat" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
