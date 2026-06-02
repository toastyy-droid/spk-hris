"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { api } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"
import { Key, Loader2, User, Calendar, Clock, Shield } from "lucide-react"

interface ProfileData {
  id: number
  username: string
  role: string
  isActive: boolean
  lastLogin: string | null
  employee: {
    id: number
    name: string
    email: string | null
    phone: string | null
  } | null
}

const roleLabel: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN_HR: "Admin HR",
  MANAGER: "Manager",
  KARYAWAN: "Karyawan",
}

const badgeVariant: Record<string, "destructive" | "warning" | "success" | "secondary"> = {
  SUPER_ADMIN: "destructive",
  ADMIN_HR: "warning",
  MANAGER: "success",
  KARYAWAN: "secondary",
}

export default function ProfilePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)

  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!user) { router.push("/login"); return }
    api.get<ProfileData>("/auth/profile")
      .then(setProfile)
      .catch(() => toast.error("Gagal memuat profil"))
      .finally(() => setLoading(false))
  }, [user, router])

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast.error("Konfirmasi password tidak cocok")
      return
    }
    if (newPassword.length < 6) {
      toast.error("Password minimal 6 karakter")
      return
    }
    setSubmitting(true)
    try {
      await api.patch("/auth/change-password", { oldPassword, newPassword })
      toast.success("Password berhasil diubah")
      setOldPassword(""); setNewPassword(""); setConfirmPassword("")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal mengubah password")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const initials = profile?.employee?.name
    ? profile.employee.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : profile?.username?.slice(0, 2).toUpperCase() ?? "AD"

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-semibold tracking-tight">Profil</h1>

      <Card className="shadow-card border-subtle">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-xl font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-semibold">{profile?.employee?.name ?? profile?.username}</h2>
              <p className="text-sm text-muted-foreground">@{profile?.username}</p>
              <Badge variant={badgeVariant[profile?.role ?? ""]} className="mt-1.5">
                {roleLabel[profile?.role ?? ""] ?? profile?.role}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-card border-subtle">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <User className="h-4 w-4 text-muted-foreground" /> Informasi Akun
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Role:</span>
              <Badge variant={badgeVariant[profile?.role ?? ""]}>
                {roleLabel[profile?.role ?? ""] ?? profile?.role}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Bergabung:</span>
              <span>-</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Terakhir login:</span>
              <span>{profile?.lastLogin ? new Date(profile.lastLogin).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "Belum pernah"}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-subtle">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Key className="h-4 w-4 text-muted-foreground" /> Ganti Password
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="oldPassword" className="text-sm">Password Lama</Label>
                <Input id="oldPassword" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required placeholder="Masukkan password saat ini" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="newPassword" className="text-sm">Password Baru</Label>
                <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required placeholder="Minimal 6 karakter" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-sm">Konfirmasi Password Baru</Label>
                <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required placeholder="Ulangi password baru" />
              </div>
              <Button type="submit" disabled={submitting || !oldPassword || !newPassword || !confirmPassword} className="w-full">
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {submitting ? "Menyimpan..." : "Simpan Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
