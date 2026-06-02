"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { api } from "@/lib/api"
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react"

interface PerformanceRecord {
  id: number
  period: string
  kpiScore: string
  selfScore: string | null
  review360Score: string | null
  totalScore: string
  grade: string | null
  notes: string | null
  employee: { id: number; name: string; nik: string; department?: { id: number; name: string } | null }
}

const gradeVariant: Record<string, "success" | "warning" | "destructive" | "secondary"> = {
  A: "success", B: "warning", C: "destructive", D: "destructive",
}

export default function PerformanceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [data, setData] = useState<PerformanceRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    setLoading(true)
    setError("")
    api.get<PerformanceRecord>("/performance/" + id)
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
          <h1 className="text-2xl font-bold tracking-tight">{data.employee.name}</h1>
          <p className="text-muted-foreground">Performance Review - {data.period}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Karyawan</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <div className="flex justify-between"><span className="text-muted-foreground">Nama</span><span className="font-medium">{data.employee.name}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">NIK</span><span>{data.employee.nik}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Departemen</span><span>{data.employee.department?.name ?? "-"}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Periode</span><span>{data.period}</span></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Skor Penilaian</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-3">
          <div className="flex justify-between"><span className="text-muted-foreground">KPI Score</span><span>{Number(data.kpiScore)}%</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Self Score</span><span>{data.selfScore ? `${Number(data.selfScore)}%` : "-"}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">360° Review</span><span>{data.review360Score ? `${Number(data.review360Score)}%` : "-"}</span></div>
          <hr />
          <div className="flex justify-between font-bold text-lg"><span>Total Score</span><span>{Number(data.totalScore)}%</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Grade</span><Badge variant={gradeVariant[data.grade ?? ""] ?? "secondary"}>{data.grade ?? "-"}</Badge></div>
          {data.notes && <div className="flex justify-between"><span className="text-muted-foreground">Catatan</span><span>{data.notes}</span></div>}
        </CardContent>
      </Card>
    </div>
  )
}
