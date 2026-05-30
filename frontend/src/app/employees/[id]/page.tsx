"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { api } from "@/lib/api"
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react"

interface EmployeeDetail {
  id: number
  nik: string
  name: string
  email: string
  phone: string | null
  status: string
  joinDate: string
  birthDate: string | null
  gender: string | null
  address: string | null
  religion: string | null
  education: string | null
  maritalStatus: string | null
  contractType: string | null
  contractEnd: string | null
  emergencyName: string | null
  emergencyPhone: string | null
  emergencyRelation: string | null
  position: { id: number; name: string }
  department: { id: number; name: string }
}

const statusMap: Record<string, string> = {
  ACTIVE: "Aktif",
  PROBATION: "Probation",
  RESIGNED: "Resign",
  TERMINATED: "Diberhentikan",
}

const badgeVariant: Record<string, "success" | "warning" | "destructive" | "secondary"> = {
  ACTIVE: "success",
  PROBATION: "warning",
  RESIGNED: "destructive",
  TERMINATED: "destructive",
}

export default function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [data, setData] = useState<EmployeeDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    setLoading(true)
    setError("")
    api.get<EmployeeDetail>("/employees/" + id)
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : "Gagal memuat data"))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <AlertCircle className="h-8 w-8 text-destructive mb-2" />
        <p className="text-sm text-destructive mb-3">{error}</p>
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Kembali
        </Button>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{data.name}</h1>
          <p className="text-muted-foreground">Detail Karyawan</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Karyawan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div><Label className="text-muted-foreground">NIK</Label><p className="font-medium">{data.nik}</p></div>
            <div><Label className="text-muted-foreground">Nama</Label><p className="font-medium">{data.name}</p></div>
            <div><Label className="text-muted-foreground">Email</Label><p>{data.email}</p></div>
            <div><Label className="text-muted-foreground">Telepon</Label><p>{data.phone ?? "-"}</p></div>
            <div><Label className="text-muted-foreground">Jabatan</Label><p>{data.position?.name}</p></div>
            <div><Label className="text-muted-foreground">Departemen</Label><p>{data.department?.name}</p></div>
            <div><Label className="text-muted-foreground">Status</Label><Badge variant={badgeVariant[data.status] ?? "secondary"}>{statusMap[data.status] ?? data.status}</Badge></div>
            <div><Label className="text-muted-foreground">Jenis Kelamin</Label><p>{data.gender ?? "-"}</p></div>
            <div><Label className="text-muted-foreground">Agama</Label><p>{data.religion ?? "-"}</p></div>
            <div><Label className="text-muted-foreground">Pendidikan</Label><p>{data.education ?? "-"}</p></div>
            <div><Label className="text-muted-foreground">Tanggal Lahir</Label><p>{data.birthDate ? new Date(data.birthDate).toLocaleDateString("id-ID") : "-"}</p></div>
            <div><Label className="text-muted-foreground">Tanggal Masuk</Label><p>{data.joinDate ? new Date(data.joinDate).toLocaleDateString("id-ID") : "-"}</p></div>
            <div><Label className="text-muted-foreground">Status Pernikahan</Label><p>{data.maritalStatus ?? "-"}</p></div>
            <div><Label className="text-muted-foreground">Tipe Kontrak</Label><p>{data.contractType ?? "-"}</p></div>
            <div><Label className="text-muted-foreground">Akhir Kontrak</Label><p>{data.contractEnd ? new Date(data.contractEnd).toLocaleDateString("id-ID") : "-"}</p></div>
            <div className="col-span-2"><Label className="text-muted-foreground">Alamat</Label><p>{data.address ?? "-"}</p></div>
            <div className="col-span-2"><Label className="text-muted-foreground">Kontak Darurat</Label><p>{[data.emergencyName, data.emergencyRelation].filter(Boolean).join(" - ") || "-"}{data.emergencyPhone ? ` (${data.emergencyPhone})` : ""}</p></div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
