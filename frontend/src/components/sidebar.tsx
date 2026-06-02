"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  ClipboardList, LayoutDashboard, PackageCheck, SlidersHorizontal, Settings,
  ChevronLeft, ChevronRight,
} from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { ROLES, type Role } from "@/lib/permissions"

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/", roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN_HR, ROLES.MANAGER, ROLES.KARYAWAN] },
  { icon: ClipboardList, label: "Data Supplier", href: "/suppliers", roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN_HR, ROLES.MANAGER] },
  { icon: PackageCheck, label: "Evaluasi Supplier", href: "/spk", roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN_HR, ROLES.MANAGER] },
  { icon: SlidersHorizontal, label: "Kriteria Penilaian", href: "/criteria", roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN_HR, ROLES.MANAGER, ROLES.KARYAWAN] },
  { icon: Settings, label: "Pengaturan", href: "/settings", roles: [ROLES.SUPER_ADMIN] },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { user } = useAuth()
  const [collapsed, setCollapsed] = useState(false)

  const visibleItems = menuItems.filter((item) => (user?.role ? item.roles.includes(user.role as Role) : true))

  return (
    <aside
      className={cn(
        "flex flex-col border-r bg-card transition-all duration-300 relative",
        collapsed ? "w-[68px]" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-sm">
              <span className="text-primary-foreground font-semibold text-sm">A</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm leading-tight">Supplier Terbaik</span>
              <span className="text-[10px] text-muted-foreground leading-tight">Evaluasi & Ranking</span>
            </div>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50",
            collapsed && "mx-auto"
          )}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </Button>
      </div>
      <div className="mx-3 h-px bg-border/60" />
      <nav className="flex-1 space-y-0.5 p-3 pt-3 overflow-y-auto scrollbar-none">
        {visibleItems.map((item, i) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{ animationDelay: `${0.3 + i * 0.03}s` }}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 animate-fade-in-up",
                isActive
                  ? "bg-gradient-to-r from-primary/10 to-primary/5 text-primary shadow-sm border border-primary/15"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/40 border border-transparent"
              )}
            >
              <div className={cn(
                "flex items-center justify-center w-5 h-5 shrink-0 transition-colors",
                isActive && "text-primary"
              )}>
                <item.icon className="h-[18px] w-[18px]" />
              </div>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>
      <div className="mx-3 h-px bg-border/60" />
      <div className="p-3">
        {!collapsed && (
          <p className="text-[10px] text-muted-foreground/60 text-center">
            {new Date().getFullYear()} Supplier Terbaik
          </p>
        )}
      </div>
    </aside>
  )
}
