"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard, Users, DollarSign, Clock, Target, Briefcase, GraduationCap, Brain, Settings,
  Building2, BadgeCheck, BookOpen, Shield,
  ChevronLeft, ChevronRight,
} from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Users, label: "Data Karyawan", href: "/employees" },
  { icon: DollarSign, label: "Payroll", href: "/payroll" },
  { icon: Clock, label: "Absensi", href: "/attendance" },
  { icon: Target, label: "Kinerja", href: "/performance" },
  { icon: Briefcase, label: "Rekrutmen", href: "/recruitment" },
  { icon: GraduationCap, label: "Training", href: "/training" },
  { icon: Brain, label: "SPK", href: "/spk" },
  { icon: Building2, label: "Departemen", href: "/departments" },
  { icon: BadgeCheck, label: "Jabatan", href: "/positions" },
  { icon: BookOpen, label: "Skills", href: "/skills" },
  { icon: Shield, label: "Users", href: "/users" },
  { icon: Settings, label: "Settings", href: "/settings" },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "flex flex-col border-r bg-card transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-14 items-center justify-between px-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              A
            </div>
            <span className="font-semibold text-sm">HRIS AMM</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      <Separator />
      <nav className="flex-1 space-y-1 p-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
