"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Briefcase,
  Users,
  Star,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Palette,
  Info,
} from "lucide-react";
import { useState } from "react";

const menuItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Hero", href: "/admin/hero", icon: Settings },
  { label: "Layanan", href: "/admin/services", icon: FileText },
  { label: "Portofolio", href: "/admin/portfolio", icon: Briefcase },
  { label: "Tentang", href: "/admin/about", icon: Info },
  { label: "Tim", href: "/admin/team", icon: Users },
  { label: "Testimoni", href: "/admin/testimonials", icon: Star },
  { label: "Pesan", href: "/admin/contacts", icon: MessageSquare },
  { label: "Pengaturan Tema", href: "/admin/settings", icon: Palette },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  // Helper function to delete cookie
  function deleteCookie(name: string) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  }

  function handleLogout() {
    localStorage.removeItem("adminToken");
    deleteCookie("admin_token");
    router.push("/admin/login");
  }

  return (
    <aside
      className={`bg-card border-r flex flex-col h-screen sticky top-0 transition-all ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="p-4 border-b flex items-center justify-between">
        {!collapsed && (
<span className="font-bold text-lg">Menu Admin</span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded hover:bg-muted"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>
      <nav className="flex-1 p-2 space-y-1">
        {menuItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
      <div className="p-2 border-t">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          title={collapsed ? "Lihat Website" : undefined}
        >
          <FileText className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Lihat Website</span>}
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground w-full"
          title={collapsed ? "Keluar" : undefined}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Keluar</span>}
        </button>
      </div>
    </aside>
  );
}