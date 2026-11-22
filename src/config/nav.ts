import {
  LayoutDashboard,
  Users,
  Building2,
  GitBranch,
  Laptop,
  Tags,
  Wrench,
  Upload,
  BarChart3,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export const navItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "User", href: "/users", icon: Users },
  { title: "Perusahaan", href: "/perusahaan", icon: Building2 },
  { title: "Cabang", href: "/cabang", icon: GitBranch },
  { title: "Jenis Devices", href: "/jenis-devices", icon: Tags, },
  { title: "Devices", href: "/devices", icon: Laptop },
  { title: "Troubleshooting", href: "/troubleshooting", icon: Wrench },
  { title: "Import Data", href: "/import", icon: Upload },
  { title: "Laporan", href: "/report", icon: BarChart3 }
];
