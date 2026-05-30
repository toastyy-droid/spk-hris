"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { api } from "@/lib/api"
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react"

interface TrainingRecord {
  id: number
  name: string
  provider: string | null
  date: string
  cost: string | null
  duration: number | null
  certificate: string | null
  notes: string | null
  employee: { id: number; name: string; nik: string }
}

function getStatus(dateStr: string) {
  const now = new Date()
  const d = new Date(dateStr)
  const diffDays = Math.ceil((d.getTime() - now.getTime()) / 86400000)
  if (diffDays < -1) return { label: "Selesai", variant: "success" as const }
  if (diffDays <= 1) return { label: "Berjalan", variant: "warning" as const }
  return { label: "Direncanakan", variant: "secondary" as const }
}

export default function TrainingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [data, setData] = useState<TrainingRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    setLoading(true)
    setError("")
    api.get<TrainingRecord>("/training/" + id)
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

  const status = getStatus(data.date)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{data.name}</h1>
          <p className="text-muted-foreground">Detail Pelatihan</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Pelatihan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div><Label className="text-muted-foreground">Nama Training</Label><p className="font-medium">{data.name}</p></div>
            <div><Label className="text-muted-foreground">Status</Label><Badge variant={status.variant}>{status.label}</Badge></div>
            <div><Label className="text-muted-foreground">Karyawan</Label><p>{data.employee.name}</p></div>
            <div><Label className="text-muted-foreground">NIK</Label><p>{data.employee.nik}</p></div>
            <div><Label className="text-muted-foreground">Penyelenggara</Label><p>{data.provider ?? "-"}</p></div>
            <div><Label className="text-muted-foreground">Tanggal</Label><p>{new Date(data.date).toLocaleDateString("id-ID")}</p></div>
            <div><Label className="text-muted-foreground">Durasi</Label><p>{data.duration != null ? `${data.duration} jam` : "-"}</p></div>
            <div><Label className="text-muted-foreground">Biaya</Label><p>{data.cost != null ? `Rp ${Number(data.cost).toLocaleString("id-ID")}` : "-"}</p></div>
            <div><Label className="text-muted-foreground">Sertifikat</Label><p>{data.certificate ? <Badge variant="success">Tersedia</Badge> : "-"}</p></div>
            <div className="col-span-2"><Label className="text-muted-foreground">Catatan</Label><p>{data.notes ?? "-"}</p></div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
