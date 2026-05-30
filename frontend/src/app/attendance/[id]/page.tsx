"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { api } from "@/lib/api"
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react"

interface AttendanceRecord {
  id: number
  employeeId: number
  date: string
  checkIn: string | null
  checkOut: string | null
  status: string
  overtimeHours: number | null
  notes: string | null
  employee: { id: number; name: string; nik: string }
}

const statusLabel: Record<string, string> = {
  HADIR: "Hadir", IZIN: "Izin", SAKIT: "Sakit", CUTI: "Cuti", ALPHA: "Alpha",
}

const statusVariant: Record<string, "success" | "warning" | "destructive" | "secondary" | "default"> = {
  HADIR: "success", IZIN: "warning", SAKIT: "destructive", CUTI: "secondary", ALPHA: "destructive",
}

export default function AttendanceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [data, setData] = useState<AttendanceRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    setLoading(true)
    setError("")
    api.get<AttendanceRecord>("/attendance/" + id)
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
          <h1 className="text-2xl font-bold tracking-tight">Detail Absensi</h1>
          <p className="text-muted-foreground">{data.employee.name} - {new Date(data.date).toLocaleDateString("id-ID")}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Absensi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div><Label className="text-muted-foreground">Nama</Label><p className="font-medium">{data.employee.name}</p></div>
            <div><Label className="text-muted-foreground">NIK</Label><p>{data.employee.nik}</p></div>
            <div><Label className="text-muted-foreground">Tanggal</Label><p>{new Date(data.date).toLocaleDateString("id-ID")}</p></div>
            <div><Label className="text-muted-foreground">Status</Label><Badge variant={statusVariant[data.status] ?? "default"}>{statusLabel[data.status] ?? data.status}</Badge></div>
            <div><Label className="text-muted-foreground">Check In</Label><p>{data.checkIn ? new Date(data.checkIn).toLocaleTimeString("id-ID") : "-"}</p></div>
            <div><Label className="text-muted-foreground">Check Out</Label><p>{data.checkOut ? new Date(data.checkOut).toLocaleTimeString("id-ID") : "-"}</p></div>
            <div><Label className="text-muted-foreground">Jam Lembur</Label><p>{data.overtimeHours != null ? `${data.overtimeHours} jam` : "-"}</p></div>
            <div className="col-span-2"><Label className="text-muted-foreground">Catatan</Label><p>{data.notes ?? "-"}</p></div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
