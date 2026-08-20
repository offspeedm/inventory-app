import Link from "next/link";
import { Pencil } from "lucide-react";

type TombolEditDetailProps = {
  href: string;
  label?: string;
};

export function TombolEditDetail({
  href,
  label = "Edit Data",
}: TombolEditDetailProps) {
  return (
    <Link
      href={href}
      className="group inline-flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all duration-200 hover:from-indigo-700 hover:to-violet-700 hover:shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
    >
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/20 transition-transform duration-200 group-hover:rotate-12">
        <Pencil className="h-3.5 w-3.5" />
      </span>
      {label}
    </Link>
  );
}
