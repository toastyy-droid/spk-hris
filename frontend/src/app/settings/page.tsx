"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { api } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"
import { useNotifications } from "@/contexts/notification-context"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { Loader2, Shield, UserPlus, Key, RefreshCw } from "lucide-react"

interface UserData {
  id: number
  username: string
  role: string
  isActive: boolean
  lastLogin: string | null
  employee: { name: string } | null
}

const roleOptions = [
  { value: "SUPER_ADMIN", label: "Super Admin" },
  { value: "ADMIN_HR", label: "Admin HR" },
  { value: "MANAGER", label: "Manager" },
  { value: "KARYAWAN", label: "Karyawan" },
]

const badgeVariant: Record<string, "destructive" | "warning" | "success" | "secondary"> = {
  SUPER_ADMIN: "destructive",
  ADMIN_HR: "warning",
  MANAGER: "success",
  KARYAWAN: "secondary",
}

export default function SettingsPage() {
  const { user } = useAuth()
  const { pushNotification } = useNotifications()
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)

  const [selectedUser, setSelectedUser] = useState<UserData | null>(null)
  const [newRole, setNewRole] = useState("")
  const [resetPassword, setResetPassword] = useState("")
  const [resetUserId, setResetUserId] = useState<number | null>(null)
  const [openRole, setOpenRole] = useState(false)
  const [openPassword, setOpenPassword] = useState(false)
  const [saving, setSaving] = useState(false)

  const isSuperAdmin = user?.role === "SUPER_ADMIN"

  async function loadUsers() {
    setLoading(true)
    try {
      const data = await api.get<UserData[]>("/users")
      setUsers(data)
    } catch {
      toast.error("Gagal memuat data pengguna")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { if (isSuperAdmin) loadUsers() }, [isSuperAdmin])

  async function handleUpdateRole() {
    if (!selectedUser || !newRole) return
    setSaving(true)
    try {
      await api.patch(`/users/${selectedUser.id}/role`, { role: newRole })
      toast.success(`Role ${selectedUser.username} diubah ke ${roleOptions.find((r) => r.value === newRole)?.label}`)
      pushNotification("Role Diubah", `${selectedUser.username} sekarang menjadi ${roleOptions.find((r) => r.value === newRole)?.label}`)
      setOpenRole(false)
      loadUsers()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal mengubah role")
    } finally {
      setSaving(false)
    }
  }

  async function handleResetPassword() {
    if (!resetUserId || !resetPassword || resetPassword.length < 6) {
      toast.error("Password minimal 6 karakter")
      return
    }
    setSaving(true)
    try {
      await api.patch(`/users/${resetUserId}/reset-password`, { password: resetPassword })
      const target = users.find((u) => u.id === resetUserId)
      toast.success(`Password ${target?.username} berhasil di-reset`)
      pushNotification("Password Direset", `Password ${target?.username} telah diubah oleh admin`)
      setOpenPassword(false)
      setResetPassword("")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal mereset password")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-semibold tracking-tight">Pengaturan Akun</h1>

      {!isSuperAdmin ? (
        <Card className="shadow-card border-subtle">
          <CardContent className="py-12 text-center">
            <Shield className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              Hanya Super Admin yang dapat mengelola pengguna.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-card border-subtle">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <UserPlus className="h-4 w-4 text-muted-foreground" /> Manajemen Pengguna
            </CardTitle>
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg" onClick={loadUsers} disabled={loading} title="Refresh">
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex h-32 items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>Nama</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Terakhir Login</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="py-12 text-center text-sm text-muted-foreground">
                          Tidak ada pengguna
                        </TableCell>
                      </TableRow>
                    ) : (
                      users.map((u) => (
                        <TableRow key={u.id}>
                          <TableCell className="font-medium">@{u.username}</TableCell>
                          <TableCell className="text-muted-foreground">{u.employee?.name ?? "-"}</TableCell>
                          <TableCell>
                            <Badge variant={badgeVariant[u.role]}>{roleOptions.find((r) => r.value === u.role)?.label ?? u.role}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={u.isActive ? "success" : "destructive"}>{u.isActive ? "Aktif" : "Nonaktif"}</Badge>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "Belum pernah"}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                variant="ghost" size="icon" className="h-8 w-8 rounded-lg"
                                onClick={() => { setSelectedUser(u); setNewRole(u.role); setOpenRole(true) }}
                                title="Ubah role"
                              >
                                <Shield className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost" size="icon" className="h-8 w-8 rounded-lg"
                                onClick={() => { setResetUserId(u.id); setResetPassword(""); setOpenPassword(true) }}
                                title="Reset password"
                              >
                                <Key className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Dialog open={openRole} onOpenChange={setOpenRole}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Ubah Role Pengguna</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="text-sm">
              <span className="text-muted-foreground">Pengguna: </span>
              <span className="font-medium">@{selectedUser?.username}</span>
            </div>
            <div className="space-y-1.5">
              <Label>Role Baru</Label>
              <Select value={newRole} onValueChange={setNewRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih role" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((r) => (
                    <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleUpdateRole} disabled={saving || !newRole} className="w-full">
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan Perubahan
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openPassword} onOpenChange={setOpenPassword}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="text-sm">
              <span className="text-muted-foreground">Pengguna: </span>
              <span className="font-medium">@{users.find((u) => u.id === resetUserId)?.username}</span>
            </div>
            <div className="space-y-1.5">
              <Label>Password Baru</Label>
              <Input type="password" value={resetPassword} onChange={(e) => setResetPassword(e.target.value)} placeholder="Minimal 6 karakter" />
            </div>
            <Button onClick={handleResetPassword} disabled={saving || resetPassword.length < 6} className="w-full">
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Reset Password
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
