"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

type DataItem = { nama: string; jumlah: number };

const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#8b5cf6", "#64748b"];

export function ChartJenis({ data }: { data: DataItem[] }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h3 className="text-sm font-semibold text-slate-700 mb-4">
        Komposisi Perangkat berdasarkan Jenis
      </h3>
      {data.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-16">
          Belum ada data perangkat.
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              dataKey="jumlah"
              nameKey="nama"
              cx="50%"
              cy="50%"
              outerRadius={90}
              label={(entry) => `${entry.nama} (${entry.jumlah})`}
              labelLine={false}
              style={{ fontSize: 11 }}
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
