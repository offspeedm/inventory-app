// src/app/(dashboard)/dashboard/kartu-kpi.tsx
import Link from "next/link";
import {
  Building2,
  Network,
  Users,
  MonitorSmartphone,
  Wrench,
  AlertTriangle,
  ArrowUpRight,
} from "lucide-react";

type Kpi = {
  label: string;
  value: number;
  icon: keyof typeof ICON_MAP;
  color: string;
  href: string;
  sub?: string;
  subTone?: "sky" | "rose" | "amber";
};

const ICON_MAP = {
  Building2,
  Network,
  Users,
  MonitorSmartphone,
  Wrench,
  AlertTriangle,
};

const SUB_TONE_CLASS = {
  sky: "text-sky-600",
  rose: "text-rose-600",
  amber: "text-amber-600",
};

export function KartuKpi({ items }: { items: Kpi[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {items.map((item) => {
        const Icon = ICON_MAP[item.icon];
        const subColor = SUB_TONE_CLASS[item.subTone ?? "amber"];

        return (
          <Link
            key={item.label}
            href={item.href}
            className="group relative flex items-center gap-3.5 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
          >
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} text-white shadow-sm`}
            >
              <Icon className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <p className="text-2xl font-bold tabular-nums leading-tight text-slate-800">
                  {item.value}
                </p>
                <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-slate-300 transition-colors group-hover:text-indigo-500" />
              </div>
              <p className="truncate text-xs font-medium text-slate-500">
                {item.label}
              </p>
              {item.sub && (
                <p
                  className={`mt-0.5 truncate text-[11px] font-medium ${subColor}`}
                >
                  {item.sub}
                </p>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
