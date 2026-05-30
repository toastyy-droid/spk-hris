"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { api } from "@/lib/api"
import { Plus, Loader2, AlertCircle, RefreshCw, Shield, RotateCcw } from "lucide-react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

interface User {
  id: number
  username: string
  role: string
  employee: { id: number; name: string } | null
  createdAt: string
}

const roleVariant: Record<string, "destructive" | "warning" | "default" | "secondary"> = {
  SUPER_ADMIN: "destructive",
  ADMIN_HR: "warning",
  MANAGER: "default",
  KARYAWAN: "secondary",
}

const roleLabel: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN_HR: "Admin HR",
  MANAGER: "Manager",
  KARYAWAN: "Karyawan",
}

const roleOptions = ["SUPER_ADMIN", "ADMIN_HR", "MANAGER", "KARYAWAN"]

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showCreate, setShowCreate] = useState(false)
  const [showRoleDialog, setShowRoleDialog] = useState<number | null>(null)
  const [selectedRole, setSelectedRole] = useState("")
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ username: "", password: "", role: "" })
  const [resetId, setResetId] = useState<number | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const data = await api.get<User[]>("/users")
      setUsers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat data")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  async function openCreate() {
    setShowCreate(true)
    setForm({ username: "", password: "", role: "" })
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await api.post("/auth/register", {
        username: form.username,
        password: form.password,
        role: form.role,
      })
      setShowCreate(false)
      fetchData()
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menyimpan")
    } finally {
      setSaving(false)
    }
  }

  function openRoleDialog(user: User) {
    setShowRoleDialog(user.id)
    setSelectedRole(user.role)
  }

  async function handleRoleUpdate() {
    if (!showRoleDialog) return
    setSaving(true)
    try {
      await api.patch(`/users/${showRoleDialog}/role`, { role: selectedRole })
      setUsers((prev) => prev.map((u) => u.id === showRoleDialog ? { ...u, role: selectedRole } : u))
      setShowRoleDialog(null)
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal mengubah role")
    } finally {
      setSaving(false)
    }
  }

  async function handleResetPassword(id: number) {
    if (!confirm("Reset password user ini?")) return
    setResetId(id)
    try {
      await api.patch(`/users/${id}/reset-password`, {})
      alert("Password berhasil direset")
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal reset password")
    } finally {
      setResetId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manajemen User</h1>
          <p className="text-muted-foreground">Kelola pengguna sistem dan hak akses</p>
        </div>
        <Button size="sm" onClick={openCreate}>
          <Plus className="h-4 w-4 mr-1" /> Tambah User
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Daftar User</CardTitle>
            <Button variant="outline" size="icon" onClick={fetchData}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="h-8 w-8 text-destructive mb-2" />
              <p className="text-sm text-destructive mb-3">{error}</p>
              <Button variant="outline" size="sm" onClick={fetchData}>
                <RefreshCw className="h-4 w-4 mr-1" /> Coba Lagi
              </Button>
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Shield className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Belum ada user</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Karyawan</TableHead>
                  <TableHead>Dibuat</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.username}</TableCell>
                    <TableCell>
                      <Badge variant={roleVariant[u.role] ?? "secondary"}>
                        {roleLabel[u.role] ?? u.role}
                      </Badge>
                    </TableCell>
                    <TableCell>{u.employee?.name ?? "-"}</TableCell>
                    <TableCell>{new Date(u.createdAt).toLocaleDateString("id-ID")}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openRoleDialog(u)}>
                          <Shield className="h-4 w-4 mr-1" /> Role
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleResetPassword(u.id)} disabled={resetId === u.id}>
                          {resetId === u.id ? (
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <RotateCcw className="h-4 w-4 mr-1" />
                          )}
                          Reset Pass
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Tambah User</DialogTitle>
            <DialogDescription>Buat user baru</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username *</Label>
              <Input id="username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input id="password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Role *</Label>
              <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })} required>
                <SelectTrigger><SelectValue placeholder="Pilih role" /></SelectTrigger>
                <SelectContent>
                  {roleOptions.map((r) => (
                    <SelectItem key={r} value={r}>{roleLabel[r]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>Batal</Button>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Simpan
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showRoleDialog !== null} onOpenChange={(open) => { if (!open) setShowRoleDialog(null) }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Ubah Role</DialogTitle>
            <DialogDescription>Pilih role baru untuk user</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {roleOptions.map((r) => (
                    <SelectItem key={r} value={r}>{roleLabel[r]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowRoleDialog(null)}>Batal</Button>
              <Button type="button" onClick={handleRoleUpdate} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Simpan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
