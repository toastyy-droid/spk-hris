"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { api } from "@/lib/api"
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react"

interface PayrollRecord {
  id: number
  basicSalary: string
  allowanceTransport: string | null
  allowanceMeal: string | null
  allowanceHealth: string | null
  allowancePosition: string | null
  overtimePay: string | null
  deductionLate: string | null
  deductionLoan: string | null
  deductionBpjsTk: string | null
  deductionBpjsKes: string | null
  deductionPph21: string | null
  thrAmount: string | null
  netSalary: string
  status: string
  paidAt: string | null
  notes: string | null
  employee: { id: number; name: string; nik: string; department: { id: number; name: string } }
}

const statusVariant: Record<string, "success" | "warning" | "secondary" | "default"> = {
  PAID: "success", REVIEWED: "warning", DRAFT: "secondary",
}

const statusLabel: Record<string, string> = {
  PAID: "Dibayar", REVIEWED: "Direview", DRAFT: "Draf",
}

function fmt(n: number) { return new Intl.NumberFormat("id-ID", { minimumFractionDigits: 0 }).format(n) }

export default function PayrollDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [data, setData] = useState<PayrollRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    setLoading(true)
    setError("")
    api.get<PayrollRecord>("/payroll/" + id)
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

  const periodLabel = new Date().toLocaleDateString("id-ID", { month: "long", year: "numeric" })

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Slip Gaji</h1>
          <p className="text-muted-foreground">{data.employee.name} - {periodLabel}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Karyawan</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <div className="flex justify-between"><span className="text-muted-foreground">Nama</span><span className="font-medium">{data.employee.name}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">NIK</span><span>{data.employee.nik}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Departemen</span><span>{data.employee.department.name}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Periode</span><span>{periodLabel}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Status</span><Badge variant={statusVariant[data.status] ?? "secondary"}>{statusLabel[data.status] ?? data.status}</Badge></div>
          {data.paidAt && (
            <div className="flex justify-between"><span className="text-muted-foreground">Dibayar Pada</span><span>{new Date(data.paidAt).toLocaleDateString("id-ID")}</span></div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Penerimaan</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Gaji Pokok</span><span>Rp {fmt(Number(data.basicSalary))}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Tunj. Transport</span><span>Rp {fmt(Number(data.allowanceTransport) || 0)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Tunj. Makan</span><span>Rp {fmt(Number(data.allowanceMeal) || 0)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Tunj. Kesehatan</span><span>Rp {fmt(Number(data.allowanceHealth) || 0)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Tunj. Jabatan</span><span>Rp {fmt(Number(data.allowancePosition) || 0)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Lembur</span><span>Rp {fmt(Number(data.overtimePay) || 0)}</span></div>
            {data.thrAmount && Number(data.thrAmount) > 0 && (
              <div className="flex justify-between"><span className="text-muted-foreground">THR</span><span>Rp {fmt(Number(data.thrAmount))}</span></div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Potongan</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">BPJS TK</span><span className="text-red-600">-Rp {fmt(Number(data.deductionBpjsTk) || 0)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">BPJS Kes</span><span className="text-red-600">-Rp {fmt(Number(data.deductionBpjsKes) || 0)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">PPh 21</span><span className="text-red-600">-Rp {fmt(Number(data.deductionPph21) || 0)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Pot. Lainnya</span><span className="text-red-600">-Rp {fmt((Number(data.deductionLate) || 0) + (Number(data.deductionLoan) || 0))}</span></div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Ringkasan</CardTitle></CardHeader>
        <CardContent className="text-sm space-y-2">
          <div className="flex justify-between font-bold text-lg"><span>Take Home Pay</span><span>Rp {fmt(Number(data.netSalary))}</span></div>
          {data.notes && <div className="flex justify-between"><span className="text-muted-foreground">Catatan</span><span>{data.notes}</span></div>}
        </CardContent>
      </Card>
    </div>
  )
}
