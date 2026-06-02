"use client"

import { useRouter } from "next/navigation"
import { Bell, Search, Trash2, CheckCheck, LogOut, User, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth-context"
import { useNotifications } from "@/contexts/notification-context"
import ThemeToggle from "@/components/theme-toggle"

export default function Header() {
  const { user, logout } = useAuth()
  const { notifications, unreadCount, markAsRead, markAllRead, clearAll } = useNotifications()
  const router = useRouter()

  const initials = user?.employeeName
    ? user.employeeName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : user?.username?.slice(0, 2).toUpperCase() ?? "AD"

  function handleLogout() {
    logout()
    router.push("/login")
  }

  return (
    <header className="flex h-16 items-center gap-4 border-b bg-card/80 backdrop-blur-sm px-6 sticky top-0 z-10">
      <div className="flex-1">
        <div className="relative w-full max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
            <Input
              type="search"
              placeholder="Cari supplier, kategori, skor..."
              className="w-full pl-10 h-9 rounded-xl bg-muted/50 border-subtle focus:bg-background text-sm"
            />
        </div>
      </div>
      <ThemeToggle />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-xl">
            <Bell className="h-[18px] w-[18px]" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 min-w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-semibold text-destructive-foreground px-0.5 ring-2 ring-card">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80 rounded-xl p-1.5 shadow-lg border-subtle" align="end" forceMount>
          <DropdownMenuLabel className="flex items-center justify-between px-2.5 py-2">
            <span className="text-sm font-medium">Notifikasi ({notifications.length})</span>
            <div className="flex gap-1">
              {unreadCount > 0 && (
                <Button variant="ghost" size="icon" className="h-6 w-6 rounded-lg" onClick={markAllRead} title="Tandai sudah dibaca">
                  <CheckCheck className="h-3.5 w-3.5" />
                </Button>
              )}
              {notifications.length > 0 && (
                <Button variant="ghost" size="icon" className="h-6 w-6 rounded-lg" onClick={clearAll} title="Hapus semua">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {notifications.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 text-muted-foreground/30" />
              Belum ada notifikasi
            </div>
          ) : (
            <div className="max-h-72 overflow-y-auto space-y-0.5">
              {notifications.slice(0, 20).map((n) => (
                <DropdownMenuItem
                  key={n.id}
                  className={cn(
                    "flex flex-col items-start gap-0.5 py-2.5 px-3 cursor-pointer rounded-lg transition-colors",
                    !n.read ? "bg-accent/30" : ""
                  )}
                  onClick={() => markAsRead(n.id)}
                >
                  <div className="flex items-center gap-2 w-full">
                    <span className={`text-sm ${!n.read ? "font-semibold" : ""}`}>{n.title}</span>
                    <span className="ml-auto text-[10px] text-muted-foreground/60 shrink-0">
                      {formatTime(n.timestamp)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground/80 line-clamp-2">{n.message}</p>
                </DropdownMenuItem>
              ))}
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-9 w-9 rounded-xl overflow-hidden">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 rounded-xl p-1.5 shadow-lg border-subtle" align="end" forceMount>
          <DropdownMenuLabel className="font-normal px-2.5 py-2">
            <div className="flex flex-col space-y-0.5">
              <p className="text-sm font-medium leading-none">{user?.employeeName ?? user?.username}</p>
              <p className="text-xs leading-none text-muted-foreground/70">{user?.username}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="rounded-lg gap-2.5 py-2" onClick={() => router.push("/profile")}>
            <User className="h-4 w-4 text-muted-foreground" />
            Profil
          </DropdownMenuItem>
          <DropdownMenuItem className="rounded-lg gap-2.5 py-2" onClick={() => router.push("/settings")}>
            <Settings className="h-4 w-4 text-muted-foreground" />
            Pengaturan Akun
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="rounded-lg gap-2.5 py-2 text-destructive focus:text-destructive" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}

function formatTime(date: Date) {
  const now = Date.now()
  const diff = now - date.getTime()
  if (diff < 60000) return "baru saja"
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}j`
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" })
}

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ")
}
