import { redirect } from "next/navigation";

export default function HomePage() {
  // Alihkan halaman root (/) langsung ke dashboard
  redirect("/dashboard");
}
