import { UserCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/logout-button";
import { HeaderTitle } from "@/components/header-title";

export async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="flex items-center justify-between h-16 px-4 md:px-6 bg-white border-b border-slate-200 sticky top-0 z-30">
      {/* Judul dinamis sesuai menu aktif */}
      <HeaderTitle />

      <div className="flex items-center gap-3">
        {/* Info user */}
        <div className="flex items-center gap-2">
          <UserCircle2 className="w-8 h-8 text-slate-400" />
          <div className="text-right hidden sm:block leading-tight">
            <p className="text-sm font-medium text-slate-800">
              {user?.email ?? "Pengguna"}
            </p>
            <p className="text-xs text-slate-500">Administrator</p>
          </div>
        </div>

        {/* Tombol Keluar */}
        <LogoutButton />
      </div>
    </header>
  );
}
