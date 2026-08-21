"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Users, MonitorSmartphone } from "lucide-react";
import { ImportUserPanel } from "./import-user-panel";
import { ImportDevicePanel } from "./import-device-panel";

type Tab = "user" | "device";

export function ImportTabs() {
  const searchParams = useSearchParams();
  const initial = searchParams.get("tab") === "device" ? "device" : "user";
  const [tab, setTab] = useState<Tab>(initial as Tab);

  return (
    <div>
      <div className="mb-6 inline-flex rounded-xl border border-slate-200 bg-white p-1">
        <button
          onClick={() => setTab("user")}
          className={
            "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors " +
            (tab === "user"
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-50")
          }
        >
          <Users className="h-4 w-4" />
          Import User
        </button>
        <button
          onClick={() => setTab("device")}
          className={
            "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors " +
            (tab === "device"
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-50")
          }
        >
          <MonitorSmartphone className="h-4 w-4" />
          Import Devices
        </button>
      </div>

      {tab === "user" ? <ImportUserPanel /> : <ImportDevicePanel />}
    </div>
  );
}
