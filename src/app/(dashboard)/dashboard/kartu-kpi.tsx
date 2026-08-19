import {
  Building2,
  Network,
  Users,
  MonitorSmartphone,
  Wrench,
  AlertTriangle,
} from "lucide-react";

type Kpi = {
  label: string;
  value: number;
  icon: keyof typeof ICON_MAP;
  color: string;
  sub?: string;
};

const ICON_MAP = {
  Building2,
  Network,
  Users,
  MonitorSmartphone,
  Wrench,
  AlertTriangle,
};

export function KartuKpi({ items }: { items: Kpi[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {items.map((item) => {
        const Icon = ICON_MAP[item.icon];
        return (
          <div
            key={item.label}
            className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3"
          >
            <div
              className={`shrink-0 bg-gradient-to-br ${item.color} w-11 h-11 rounded-lg flex items-center justify-center text-white shadow-sm`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xl font-bold text-slate-800 leading-tight">
                {item.value}
              </p>
              <p className="text-xs text-slate-500 truncate">{item.label}</p>
              {item.sub && (
                <p className="text-[11px] text-amber-600 font-medium">{item.sub}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
