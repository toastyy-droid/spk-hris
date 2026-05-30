"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { api } from "@/lib/api"
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react"

interface CandidateDetail {
  id: number
  candidateName: string
  email: string
  phone: string | null
  stage: string
  totalScore: string | null
  scoreExperience: string | null
  scoreEducation: string | null
  scoreInterview: string | null
  scoreSoftskill: string | null
  scoreSalary: string | null
  appliedAt: string
  notes: string | null
  position: { name: string; department: { name: string } }
}

const stageLabel: Record<string, string> = {
  SCREENING: "Screening", INTERVIEW: "Interview", OFFERING: "Offering",
  ONBOARDING: "Onboarding", HIRED: "Diterima", REJECTED: "Ditolak",
}

export default function RecruitmentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [data, setData] = useState<CandidateDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    setLoading(true)
    setError("")
    api.get<CandidateDetail>("/recruitment/" + id)
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
          <h1 className="text-2xl font-bold tracking-tight">{data.candidateName}</h1>
          <p className="text-muted-foreground">Detail Kandidat</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Kandidat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div><Label className="text-muted-foreground">Nama</Label><p className="font-medium">{data.candidateName}</p></div>
            <div><Label className="text-muted-foreground">Email</Label><p>{data.email}</p></div>
            <div><Label className="text-muted-foreground">Telepon</Label><p>{data.phone ?? "-"}</p></div>
            <div><Label className="text-muted-foreground">Posisi</Label><p>{data.position.name}</p></div>
            <div><Label className="text-muted-foreground">Departemen</Label><p>{data.position.department.name}</p></div>
            <div><Label className="text-muted-foreground">Stage</Label><Badge>{stageLabel[data.stage] ?? data.stage}</Badge></div>
            <div><Label className="text-muted-foreground">Tanggal Melamar</Label><p>{new Date(data.appliedAt).toLocaleDateString("id-ID")}</p></div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Skor Penilaian</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div><Label className="text-muted-foreground">Pengalaman</Label><p>{data.scoreExperience ?? "-"}</p></div>
            <div><Label className="text-muted-foreground">Pendidikan</Label><p>{data.scoreEducation ?? "-"}</p></div>
            <div><Label className="text-muted-foreground">Wawancara</Label><p>{data.scoreInterview ?? "-"}</p></div>
            <div><Label className="text-muted-foreground">Soft Skill</Label><p>{data.scoreSoftskill ?? "-"}</p></div>
            <div><Label className="text-muted-foreground">Gaji</Label><p>{data.scoreSalary ?? "-"}</p></div>
            <div><Label className="text-muted-foreground font-bold">Total Skor</Label><p className="font-bold">{data.totalScore ?? "-"}</p></div>
          </div>
        </CardContent>
      </Card>

      {data.notes && (
        <Card>
          <CardHeader><CardTitle>Catatan</CardTitle></CardHeader>
          <CardContent><p className="text-sm whitespace-pre-wrap">{data.notes}</p></CardContent>
        </Card>
      )}
    </div>
  )
}
