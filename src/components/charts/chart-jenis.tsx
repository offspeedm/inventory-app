"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type DataItem = {
  nama: string;
  jumlah: number;
};

type PieLabelValue = {
  payload?: DataItem;
  name?: string;
  value?: number | string;
};

const COLORS = [
  "#4f46e5",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#3b82f6",
  "#8b5cf6",
  "#64748b",
];

function renderPieLabel(props: unknown): string {
  const label = props as PieLabelValue;
  const nama = label.payload?.nama ?? label.name ?? "";
  const jumlah = Number(label.payload?.jumlah ?? label.value ?? 0);

  return `${nama} (${jumlah})`;
}

export function ChartJenis({ data }: { data: DataItem[] }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <h3 className="mb-4 text-sm font-semibold text-slate-700">
        Komposisi Perangkat berdasarkan Jenis
      </h3>

      {data.length === 0 ? (
        <p className="py-16 text-center text-sm text-slate-400">
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
              label={renderPieLabel}
              labelLine={false}
              style={{ fontSize: 11 }}
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
                borderRadius: 8,
                border: "1px solid #e2e8f0",
                fontSize: 12,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
