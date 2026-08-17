import { login } from "./actions";
import { Boxes } from "lucide-react";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-indigo-600 text-white mb-3">
            <Boxes className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-slate-800">Inventory App</h1>
          <p className="text-sm text-slate-500">
            Silakan masuk untuk melanjutkan
          </p>
        </div>

        {/* Kartu login */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <form action={login} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="nama@perusahaan.com"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg px-4 py-2.5 transition-colors"
            >
              Masuk
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400 mt-4">
          Grup Speedmark &amp; Afiliasi
        </p>
      </div>
    </div>
  );
}
