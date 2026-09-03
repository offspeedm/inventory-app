"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  BarChart3,
  Building2,
  Calendar,
  MonitorSmartphone,
  Network,
  Wrench,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import {
  getLaporanDevices,
  getLaporanTiket,
  getOpsiFilter,
  type LaporanDevice,
  type LaporanTiket,
  type Breakdown,
  type OpsiFilter,
} from "./actions";
import { DevicesDetailSection } from "./devices-detail-section";

type Tab = "devices" | "troubleshooting";
type Preset = "bulan-ini" | "6-bulan" | "tahun-ini" | "tahun-lalu" | "12-bulan" | "kustom";

const WARNA_CHART = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899"];

function formatTanggalInput(d: Date): string {
  return d.toISOString().slice(0, 10);
}

// Menghitung rentang tanggal untuk masing-masing preset cepat.
function hitungPresetRange(preset: Preset): { start: string; end: string } {
  const now = new Date();
  let start: Date;
  let end: Date = now;

  switch (preset) {
    case "bulan-ini":
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case "6-bulan":
      start = new Date(now.getFullYear(), now.getMonth() - 5, 1);
      break;
    case "tahun-ini":
      start = new Date(now.getFullYear(), 0, 1);
      break;
    case "tahun-lalu":
      start = new Date(now.getFullYear() - 1, 0, 1);
      end = new Date(now.getFullYear() - 1, 11, 31);
      break;
    case "12-bulan":
      start = new Date(now.getFullYear(), now.getMonth() - 11, 1);
      break;
    default:
      start = new Date(now.getFullYear(), 0, 1);
  }

  return { start: formatTanggalInput(start), end: formatTanggalInput(end) };
}

function formatRupiah(n: number): string {
  return "Rp " + n.toLocaleString("id-ID");
}

// null berarti "tak terhingga" (periode lalu = 0), ditampilkan sbg "Baru".
function hitungPersenPerubahan(sekarang: number, sebelumnya: number): number | null {
  if (sebelumnya === 0) return sekarang === 0 ? 0 : null;
  return ((sekarang - sebelumnya) / sebelumnya) * 100;
}

// Mengubah string dari <select> ("" atau "123") menjadi number|null,
// dipakai sebelum dikirim ke server action.
function parseFilterId(value: string): number | null {
  const n = Number(value);
  return value && !Number.isNaN(n) && n > 0 ? n : null;
}

const PRESET_LIST: { value: Preset; label: string }[] = [
  { value: "bulan-ini", label: "Bulan Ini" },
  { value: "6-bulan", label: "6 Bulan Terakhir" },
  { value: "tahun-ini", label: "Tahun Ini" },
  { value: "tahun-lalu", label: "Tahun Lalu" },
  { value: "12-bulan", label: "12 Bulan Terakhir" },
  { value: "kustom", label: "Kustom" },
];

export function ReportView() {
  const [tab, setTab] = useState<Tab>("devices");
  const [preset, setPreset] = useState<Preset>("tahun-ini");
  const [startDate, setStartDate] = useState(() => hitungPresetRange("tahun-ini").start);
  const [endDate, setEndDate] = useState(() => hitungPresetRange("tahun-ini").end);
  const [bandingkan, setBandingkan] = useState(true);

  // ===== Filter Perusahaan & Cabang =====
  // Berlaku untuk seluruh laporan (Devices maupun Troubleshooting),
  // memenuhi 3 skenario: (1) satu Perusahaan - semua Cabang, (2) satu
  // Cabang spesifik, (3) semua Perusahaan & Cabang (dikosongkan).
  const [companyIdStr, setCompanyIdStr] = useState("");
  const [branchIdStr, setBranchIdStr] = useState("");
  const [opsiFilter, setOpsiFilter] = useState<OpsiFilter>({ companies: [], branches: [] });

  const companyId = parseFilterId(companyIdStr);
  const branchId = parseFilterId(branchIdStr);
  const cabangTersaring = companyId
    ? opsiFilter.branches.filter((b) => b.companyId === companyId)
    : opsiFilter.branches;

  // Mulai dari true supaya render pertama (sebelum data sempat diambil)
  // langsung menampilkan teks "Memuat...", menghindari kedipan konten
  // kosong. Karena sudah true sejak awal, effect pemuatan pertama TIDAK
  // perlu memanggil setLoading(true) lagi (lihat useEffect di bawah).
  const [loading, setLoading] = useState(true);
  const [dataDevices, setDataDevices] = useState<LaporanDevice | null>(null);
  const [dataTiket, setDataTiket] = useState<LaporanTiket | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Dipakai oleh tombol preset & tombol "Terapkan" — keduanya dipicu dari
  // event handler klik (bukan dari dalam useEffect), sehingga memanggil
  // setLoading(true) sebagai baris pertama di sini aman-aman saja.
  async function muatData(
    s: string,
    e: string,
    b: boolean,
    cId: number | null,
    bId: number | null
  ) {
    setLoading(true);
    setError(null);
    try {
      const [devices, tiket] = await Promise.all([
        getLaporanDevices(s, e, b, cId, bId),
        getLaporanTiket(s, e, b, cId, bId),
      ]);
      setDataDevices(devices);
      setDataTiket(tiket);
    } catch (err) {
      console.error("Gagal memuat data laporan:", err);
      setError("Gagal memuat data laporan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  // Pemuatan data PERTAMA KALI saat halaman dibuka ditulis TERPISAH dari
  // muatData() di atas — supaya TIDAK ADA setState yang terpanggil secara
  // sinkron langsung di dalam body useEffect (yang memicu error ESLint
  // "react-hooks/set-state-in-effect"). Nilai `loading` sudah true sejak
  // useState awal, jadi tidak perlu di-set ulang; setState lain di bawah
  // baru berjalan SETELAH `await` selesai.
  useEffect(() => {
    async function muatAwal() {
      try {
        const [devices, tiket, opsi] = await Promise.all([
          getLaporanDevices(startDate, endDate, bandingkan, null, null),
          getLaporanTiket(startDate, endDate, bandingkan, null, null),
          getOpsiFilter(),
        ]);
        setDataDevices(devices);
        setDataTiket(tiket);
        setOpsiFilter(opsi);
      } catch (err) {
        console.error("Gagal memuat data laporan:", err);
        setError("Gagal memuat data laporan. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    }
    muatAwal();
    // Hanya dijalankan sekali saat halaman pertama dibuka.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function terapkanPreset(p: Preset) {
    setPreset(p);
    if (p !== "kustom") {
      const range = hitungPresetRange(p);
      setStartDate(range.start);
      setEndDate(range.end);
      muatData(range.start, range.end, bandingkan, companyId, branchId);
    }
  }

  function terapkanFilter() {
    muatData(startDate, endDate, bandingkan, companyId, branchId);
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-sm">
          <BarChart3 className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Laporan</h1>
          <p className="text-sm text-slate-500">
            Analisis Devices dan Troubleshooting berdasarkan periode &amp; lokasi, dengan
            perbandingan tahun sebelumnya.
          </p>
        </div>
      </div>

      {/* Filter periode + lokasi */}
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <Calendar className="h-4 w-4 text-slate-400" />
          <p className="text-sm font-semibold text-slate-700">Periode Laporan</p>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {PRESET_LIST.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => terapkanPreset(p.value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                preset === p.value
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="mb-4 flex flex-wrap items-end gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Dari Tanggal</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setPreset("kustom");
              }}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Sampai Tanggal</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setPreset("kustom");
              }}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <label className="flex items-center gap-2 pb-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={bandingkan}
              onChange={(e) => setBandingkan(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            Bandingkan dengan periode setahun sebelumnya
          </label>
        </div>

        {/* Filter Perusahaan & Cabang — berlaku untuk seluruh laporan */}
        <div className="mb-2 flex items-center gap-2 border-t border-slate-100 pt-4">
          <Building2 className="h-4 w-4 text-slate-400" />
          <p className="text-sm font-semibold text-slate-700">Filter Perusahaan &amp; Cabang</p>
        </div>
        <p className="mb-3 text-xs text-slate-500">
          Pilih satu Perusahaan untuk melihat seluruh cabangnya, pilih Cabang spesifik untuk data
          lebih rinci, atau biarkan keduanya kosong untuk melihat seluruh Perusahaan &amp; Cabang.
        </p>

        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Perusahaan</label>
            <select
              value={companyIdStr}
              onChange={(e) => {
                setCompanyIdStr(e.target.value);
                setBranchIdStr(""); // reset cabang setiap kali perusahaan berganti
              }}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Semua Perusahaan</option>
              {opsiFilter.companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nama}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Cabang</label>
            <select
              value={branchIdStr}
              onChange={(e) => setBranchIdStr(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Semua Cabang</option>
              {cabangTersaring.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.nama}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={terapkanFilter}
            disabled={loading}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {loading ? "Memuat..." : "Terapkan"}
          </button>
        </div>
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      {/* Tab pemilih */}
      <div className="mb-6 inline-flex rounded-lg border border-slate-200 bg-slate-100 p-1">
        <button
          type="button"
          onClick={() => setTab("devices")}
          className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition ${
            tab === "devices" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <MonitorSmartphone className="h-4 w-4" /> Devices
        </button>
        <button
          type="button"
          onClick={() => setTab("troubleshooting")}
          className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition ${
            tab === "troubleshooting"
              ? "bg-white text-indigo-600 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <Wrench className="h-4 w-4" /> Troubleshooting
        </button>
      </div>

      {/* Indikator filter lokasi aktif */}
      {(companyId || branchId) && (
        <div className="mb-4 inline-flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700">
          <Network className="h-3.5 w-3.5" />
          Menampilkan:{" "}
          {opsiFilter.companies.find((c) => c.id === companyId)?.nama ?? "Semua Perusahaan"}
          {branchId && ` — ${opsiFilter.branches.find((b) => b.id === branchId)?.nama ?? ""}`}
        </div>
      )}

      {loading && !dataDevices && !dataTiket ? (
        <p className="py-12 text-center text-sm text-slate-400">Memuat data laporan...</p>
      ) : tab === "devices" ? (
        dataDevices && (
          <>
            <LaporanDevicesView data={dataDevices} bandingkan={bandingkan} />
            <div className="mt-6">
              <DevicesDetailSection
                startDate={startDate}
                endDate={endDate}
                companyId={companyId}
                branchId={branchId}
              />
            </div>
          </>
        )
      ) : (
        dataTiket && <LaporanTiketView data={dataTiket} bandingkan={bandingkan} />
      )}
    </div>
  );
}

function KpiCard({
  label,
  value,
  sebelumnya,
  bandingkan,
  format,
}: {
  label: string;
  value: number;
  sebelumnya: number | null;
  bandingkan: boolean;
  format?: (n: number) => string;
}) {
  const tampilkanValue = format ? format(value) : value.toLocaleString("id-ID");
  const persen =
    bandingkan && sebelumnya !== null ? hitungPersenPerubahan(value, sebelumnya) : null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-medium text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-800">{tampilkanValue}</p>
      {bandingkan && sebelumnya !== null && (
        <div className="mt-2 flex items-center gap-1 text-xs">
          {persen === null ? (
            <span className="text-slate-400">Baru (periode lalu: 0)</span>
          ) : persen > 0 ? (
            <span className="flex items-center gap-0.5 text-emerald-600">
              <TrendingUp className="h-3 w-3" /> {persen.toFixed(1)}% vs tahun lalu
            </span>
          ) : persen < 0 ? (
            <span className="flex items-center gap-0.5 text-red-600">
              <TrendingDown className="h-3 w-3" /> {Math.abs(persen).toFixed(1)}% vs tahun lalu
            </span>
          ) : (
            <span className="flex items-center gap-0.5 text-slate-400">
              <Minus className="h-3 w-3" /> Sama dengan tahun lalu
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function BreakdownCard({ title, items }: { title: string; items: Breakdown[] }) {
  const total = items.reduce((sum, item) => sum + item.jumlah, 0);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="mb-4 text-sm font-semibold text-slate-800">{title}</h3>
      {items.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-400">Belum ada data.</p>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={items}
                dataKey="jumlah"
                nameKey="nama"
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={2}
              >
                {items.map((_, idx) => (
                  <Cell key={idx} fill={WARNA_CHART[idx % WARNA_CHART.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <ul className="mt-3 space-y-1.5">
            {items.map((item, idx) => (
              <li key={item.nama} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: WARNA_CHART[idx % WARNA_CHART.length] }}
                  />
                  <span className="truncate">{item.nama}</span>
                </span>
                <span className="shrink-0 font-medium text-slate-700">
                  {item.jumlah} ({total > 0 ? ((item.jumlah / total) * 100).toFixed(0) : 0}%)
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function LaporanDevicesView({ data, bandingkan }: { data: LaporanDevice; bandingkan: boolean }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard
          label="Perangkat Baru"
          value={data.ringkasan.totalPerangkatBaru}
          sebelumnya={data.ringkasanSebelumnya?.totalPerangkatBaru ?? null}
          bandingkan={bandingkan}
        />
        <KpiCard
          label="Nilai Pembelian"
          value={data.ringkasan.totalNilaiPembelian}
          sebelumnya={data.ringkasanSebelumnya?.totalNilaiPembelian ?? null}
          bandingkan={bandingkan}
          format={formatRupiah}
        />
        <KpiCard
          label="Perangkat Aktif"
          value={data.ringkasan.totalAktif}
          sebelumnya={data.ringkasanSebelumnya?.totalAktif ?? null}
          bandingkan={bandingkan}
        />
        <KpiCard
          label="Bermasalah (Rusak/Perbaikan)"
          value={data.ringkasan.totalBermasalah}
          sebelumnya={data.ringkasanSebelumnya?.totalBermasalah ?? null}
          bandingkan={bandingkan}
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="mb-4 text-sm font-semibold text-slate-800">
          Tren Perangkat Baru per Bulan{bandingkan ? " (Periode Ini vs Setahun Lalu)" : ""}
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data.trenBulanan}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="bulan" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="periodeIni" name="Periode Ini" fill="#6366f1" radius={[4, 4, 0, 0]} />
            {bandingkan && (
              <Bar
                dataKey="periodeSebelumnya"
                name="Setahun Lalu"
                fill="#cbd5e1"
                radius={[4, 4, 0, 0]}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <BreakdownCard title="Per Jenis" items={data.perJenis} />
        <BreakdownCard title="Per Perusahaan" items={data.perPerusahaan} />
        <BreakdownCard title="Per Status" items={data.perStatus} />
      </div>
    </div>
  );
}

function LaporanTiketView({ data, bandingkan }: { data: LaporanTiket; bandingkan: boolean }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard
          label="Total Tiket"
          value={data.ringkasan.totalTiket}
          sebelumnya={data.ringkasanSebelumnya?.totalTiket ?? null}
          bandingkan={bandingkan}
        />
        <KpiCard
          label="Tiket Selesai"
          value={data.ringkasan.totalSelesai}
          sebelumnya={data.ringkasanSebelumnya?.totalSelesai ?? null}
          bandingkan={bandingkan}
        />
        <KpiCard
          label="Tiket Aktif"
          value={data.ringkasan.totalAktif}
          sebelumnya={data.ringkasanSebelumnya?.totalAktif ?? null}
          bandingkan={bandingkan}
        />
        <KpiCard
          label="Tiket Kritis"
          value={data.ringkasan.totalKritis}
          sebelumnya={data.ringkasanSebelumnya?.totalKritis ?? null}
          bandingkan={bandingkan}
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="mb-4 text-sm font-semibold text-slate-800">
          Tren Tiket per Bulan{bandingkan ? " (Periode Ini vs Setahun Lalu)" : ""}
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data.trenBulanan}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="bulan" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="periodeIni" name="Periode Ini" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            {bandingkan && (
              <Bar
                dataKey="periodeSebelumnya"
                name="Setahun Lalu"
                fill="#cbd5e1"
                radius={[4, 4, 0, 0]}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <BreakdownCard title="Per Kategori" items={data.perKategori} />
        <BreakdownCard title="Per Urgency" items={data.perUrgency} />
        <BreakdownCard title="Per Status" items={data.perStatus} />
      </div>
    </div>
  );
}
