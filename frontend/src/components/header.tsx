"use client"

import { useRouter } from "next/navigation"
import { Bell, Search, Trash2, CheckCheck } from "lucide-react"
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
    <header className="flex h-14 items-center gap-4 border-b bg-card px-6">
      <div className="flex-1">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Cari karyawan, slip gaji..."
            className="w-full pl-8 bg-background"
          />
        </div>
      </div>
      <ThemeToggle />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 min-w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground px-0.5">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80" align="end" forceMount>
          <DropdownMenuLabel className="flex items-center justify-between">
            <span>Notifikasi ({notifications.length})</span>
            <div className="flex gap-1">
              {unreadCount > 0 && (
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={markAllRead} title="Tandai sudah dibaca">
                  <CheckCheck className="h-3.5 w-3.5" />
                </Button>
              )}
              {notifications.length > 0 && (
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={clearAll} title="Hapus semua">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Belum ada notifikasi
            </div>
          ) : (
            <div className="max-h-72 overflow-y-auto">
              {notifications.slice(0, 20).map((n) => (
                <DropdownMenuItem key={n.id} className={`flex flex-col items-start gap-0.5 py-2 px-3 cursor-pointer ${!n.read ? "bg-accent/50" : ""}`} onClick={() => markAsRead(n.id)}>
                  <div className="flex items-center gap-2 w-full">
                    <span className={`text-sm font-medium ${!n.read ? "font-semibold" : ""}`}>{n.title}</span>
                    <span className="ml-auto text-[10px] text-muted-foreground shrink-0">
                      {formatTime(n.timestamp)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{n.message}</p>
                </DropdownMenuItem>
              ))}
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user?.employeeName ?? user?.username}</p>
              <p className="text-xs leading-none text-muted-foreground">{user?.username}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profil</DropdownMenuItem>
          <DropdownMenuItem>Pengaturan Akun</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive" onClick={handleLogout}>Logout</DropdownMenuItem>
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
