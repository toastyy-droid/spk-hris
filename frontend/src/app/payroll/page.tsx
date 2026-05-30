"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { api } from "@/lib/api"
import Link from "next/link"
import { Download, FileText, Loader2, AlertCircle, RefreshCw, Play } from "lucide-react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog"

const now = new Date()
const currentMonth = now.getMonth() + 1
const currentYear = now.getFullYear()

const months = [
  { value: "1", label: "Januari" }, { value: "2", label: "Februari" }, { value: "3", label: "Maret" },
  { value: "4", label: "April" }, { value: "5", label: "Mei" }, { value: "6", label: "Juni" },
  { value: "7", label: "Juli" }, { value: "8", label: "Agustus" }, { value: "9", label: "September" },
  { value: "10", label: "Oktober" }, { value: "11", label: "November" }, { value: "12", label: "Desember" },
]

const statusVariant: Record<string, "success" | "warning" | "secondary" | "default"> = {
  PAID: "success", REVIEWED: "warning", DRAFT: "secondary",
}

const statusLabel: Record<string, string> = {
  PAID: "Dibayar", REVIEWED: "Direview", DRAFT: "Draf",
}

function fmt(n: number) { return new Intl.NumberFormat("id-ID", { minimumFractionDigits: 0 }).format(n) }

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

export default function PayrollPage() {
  const [payrolls, setPayrolls] = useState<PayrollRecord[]>([])
  const [summary, setSummary] = useState<{ count: number; totalGross: number; totalNet: number } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [month, setMonth] = useState(String(currentMonth))
  const [year, setYear] = useState(String(currentYear))
  const [processing, setProcessing] = useState(false)
  const [slipId, setSlipId] = useState<number | null>(null)
  const [slip, setSlip] = useState<PayrollRecord | null>(null)
  const [payrollTab, setPayrollTab] = useState("slip")
  const [historiData, setHistoriData] = useState<{ month: number; totalGaji: number; totalTunjangan: number; totalPotongan: number; netTotal: number }[]>([])
  const [historiLoading, setHistoriLoading] = useState(false)

  async function fetchData() {
    setLoading(true)
    setError("")
    try {
      const [pay, sum] = await Promise.all([
        api.get<PayrollRecord[]>(`/payroll?month=${month}&year=${year}`),
        api.get<typeof summary>(`/payroll/summary?month=${month}&year=${year}`).catch(() => null),
      ])
      setPayrolls(pay)
      if (sum) setSummary(sum)
    } catch {
      setError("Gagal memuat data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [month, year])

  async function fetchHistori() {
    setHistoriLoading(true)
    try {
      const results = []
      for (let m = 1; m <= currentMonth; m++) {
        const pay = await api.get<PayrollRecord[]>(`/payroll?month=${m}&year=${currentYear}`).catch(() => [] as PayrollRecord[])
        if (pay.length > 0) {
          const totalGaji = pay.reduce((s, p) => s + (Number(p.basicSalary) || 0), 0)
          const totalTunjangan = pay.reduce((s, p) => s + (Number(p.allowanceTransport) || 0) + (Number(p.allowanceMeal) || 0) + (Number(p.allowanceHealth) || 0) + (Number(p.allowancePosition) || 0) + (Number(p.overtimePay) || 0) + (Number(p.thrAmount) || 0), 0)
          const totalPotongan = pay.reduce((s, p) => s + (Number(p.deductionBpjsTk) || 0) + (Number(p.deductionBpjsKes) || 0) + (Number(p.deductionPph21) || 0) + (Number(p.deductionLoan) || 0) + (Number(p.deductionLate) || 0), 0)
          const netTotal = pay.reduce((s, p) => s + (Number(p.netSalary) || 0), 0)
          results.push({ month: m, totalGaji, totalTunjangan, totalPotongan, netTotal })
        }
      }
      setHistoriData(results)
    } catch {} finally { setHistoriLoading(false) }
  }

  useEffect(() => {
    if (payrollTab === "histori" && historiData.length === 0) fetchHistori()
  }, [payrollTab])

  async function handleProcess() {
    setProcessing(true)
    try {
      await api.post("/payroll/process", { month: Number(month), year: Number(year) })
      fetchData()
    } catch { alert("Gagal memproses payroll") }
    finally { setProcessing(false) }
  }

  async function openSlip(id: number) {
    setSlipId(id)
    try {
      const all = payrolls
      const found = all.find((p) => p.id === id) ?? await api.get<PayrollRecord>(`/payroll/${id}`)
      setSlip(found)
    } catch { setSlip(null) }
  }

  function exportCsv() {
    const header = "Nama,Departemen,Gaji Pokok,Tunjangan,Lembur,Potongan,Net,Status\n"
    const rows = payrolls.map((p) => {
      const tunjangan = [p.allowanceTransport, p.allowanceMeal, p.allowanceHealth, p.allowancePosition].reduce((s, v) => s + (Number(v) || 0), 0)
      const potongan = [p.deductionLate, p.deductionLoan, p.deductionBpjsTk, p.deductionBpjsKes, p.deductionPph21].reduce((s, v) => s + (Number(v) || 0), 0)
      return `"${p.employee.name}","${p.employee.department.name}",${Number(p.basicSalary)},${tunjangan},${Number(p.overtimePay) || 0},${potongan},${Number(p.netSalary)},"${statusLabel[p.status] ?? p.status}"`
    }).join("\n")
    const blob = new Blob(["\uFEFF" + header + rows], { type: "text/csv;charset=utf-8;" })
    const a = document.createElement("a")
    a.href = URL.createObjectURL(blob); a.download = `payroll_${month}_${year}.csv`; a.click()
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <AlertCircle className="h-8 w-8 text-destructive mb-2" />
        <p className="text-sm text-destructive mb-3">{error}</p>
        <Button variant="outline" size="sm" onClick={fetchData}><RefreshCw className="h-4 w-4 mr-1" /> Coba Lagi</Button>
      </div>
    )
  }

  const totalAll = payrolls.length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Payroll</h1>
          <p className="text-muted-foreground">Penggajian bulanan & slip gaji digital</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={exportCsv} disabled={payrolls.length === 0}>
            <Download className="h-4 w-4 mr-1" /> Export CSV
          </Button>
          <Button size="sm" onClick={handleProcess} disabled={processing}>
            {processing ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Play className="h-4 w-4 mr-1" />}
            Proses Gaji
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Beban Gaji</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{summary ? `Rp ${fmt(summary.totalGross)}` : "-"}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Karyawan</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{totalAll}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Rata-rata Gaji</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalAll > 0 ? `Rp ${fmt(Math.round((summary?.totalGross ?? 0) / totalAll))}` : "-"}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={payrollTab} onValueChange={setPayrollTab}>
        <TabsList>
          <TabsTrigger value="slip">Slip Gaji</TabsTrigger>
          <TabsTrigger value="komponen">Komponen Gaji</TabsTrigger>
          <TabsTrigger value="histori">Histori Gaji</TabsTrigger>
        </TabsList>

        <TabsContent value="slip" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Input placeholder="Cari karyawan..." className="max-w-sm" />
                <Select value={month} onValueChange={setMonth}>
                  <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {months.map((m) => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={year} onValueChange={setYear}>
                  <SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[currentYear - 1, currentYear, currentYear + 1].map((y) => (
                      <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {payrolls.length === 0 ? (
                <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
                  Belum ada data. Klik &quot;Proses Gaji&quot; untuk generate payroll.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>Dept</TableHead>
                      <TableHead>Gaji Pokok</TableHead>
                      <TableHead>Tunjangan</TableHead>
                      <TableHead>Lembur</TableHead>
                      <TableHead>Potongan</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payrolls.map((p) => {
                      const tunjangan = [p.allowanceTransport, p.allowanceMeal, p.allowanceHealth, p.allowancePosition].reduce((s, v) => s + (Number(v) || 0), 0)
                      const potongan = [p.deductionLate, p.deductionLoan, p.deductionBpjsTk, p.deductionBpjsKes, p.deductionPph21].reduce((s, v) => s + (Number(v) || 0), 0)
                      return (
                        <TableRow key={p.id}>
                          <TableCell className="font-medium">{p.employee.name}</TableCell>
                          <TableCell>{p.employee.department.name}</TableCell>
                          <TableCell>Rp {fmt(Number(p.basicSalary))}</TableCell>
                          <TableCell>Rp {fmt(tunjangan)}</TableCell>
                          <TableCell>Rp {fmt(Number(p.overtimePay) || 0)}</TableCell>
                          <TableCell className="text-red-600">-Rp {fmt(potongan)}</TableCell>
                          <TableCell className="font-bold">Rp {fmt(Number(p.netSalary))}</TableCell>
                          <TableCell><Badge variant={statusVariant[p.status] ?? "secondary"}>{statusLabel[p.status] ?? p.status}</Badge></TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm" onClick={() => openSlip(p.id)}>
                                <FileText className="h-4 w-4 mr-1" /> Slip
                              </Button>
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/payroll/${p.id}`}>
                                  <FileText className="h-4 w-4 mr-1" /> Lihat Detail
                                </Link>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="komponen">
          <Card>
            <CardHeader><CardTitle>Komponen Gaji - {months.find((m) => m.value === month)?.label} {year}</CardTitle></CardHeader>
            <CardContent>
              {payrolls.length === 0 ? (
                <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">Belum ada data payroll bulan ini</div>
              ) : (
                <div className="space-y-6">
                  {(() => {
                    const totalTransport = payrolls.reduce((s, p) => s + (Number(p.allowanceTransport) || 0), 0)
                    const totalMeal = payrolls.reduce((s, p) => s + (Number(p.allowanceMeal) || 0), 0)
                    const totalHealth = payrolls.reduce((s, p) => s + (Number(p.allowanceHealth) || 0), 0)
                    const totalPosition = payrolls.reduce((s, p) => s + (Number(p.allowancePosition) || 0), 0)
                    const totalBpjsTk = payrolls.reduce((s, p) => s + (Number(p.deductionBpjsTk) || 0), 0)
                    const totalBpjsKes = payrolls.reduce((s, p) => s + (Number(p.deductionBpjsKes) || 0), 0)
                    const totalPph21 = payrolls.reduce((s, p) => s + (Number(p.deductionPph21) || 0), 0)
                    const totalLoan = payrolls.reduce((s, p) => s + (Number(p.deductionLoan) || 0), 0)
                    const totalOvertime = payrolls.reduce((s, p) => s + (Number(p.overtimePay) || 0), 0)
                    const totalGross = payrolls.reduce((s, p) => s + (Number(p.basicSalary) || 0), 0)
                    const totalLate = payrolls.reduce((s, p) => s + (Number(p.deductionLate) || 0), 0)
                    const totalThr = payrolls.reduce((s, p) => s + (Number(p.thrAmount) || 0), 0)
                    const components = [
                      { name: "Gaji Pokok", desc: "Gaji dasar bulanan", value: totalGross, type: "tunjangan" },
                      { name: "Tunj. Transport", desc: "Transportasi harian", value: totalTransport, type: "tunjangan" },
                      { name: "Tunj. Makan", desc: "Uang makan harian", value: totalMeal, type: "tunjangan" },
                      { name: "Tunj. Kesehatan", desc: "Jaminan kesehatan", value: totalHealth, type: "tunjangan" },
                      { name: "Tunj. Jabatan", desc: "Tunjangan struktural", value: totalPosition, type: "tunjangan" },
                      { name: "Lembur", desc: "Upah lembur", value: totalOvertime, type: "tunjangan" },
                      { name: "THR", desc: "Tunjangan Hari Raya", value: totalThr, type: "tunjangan" },
                      { name: "BPJS TK", desc: "BPJS Ketenagakerjaan", value: totalBpjsTk, type: "potongan" },
                      { name: "BPJS Kes", desc: "BPJS Kesehatan", value: totalBpjsKes, type: "potongan" },
                      { name: "PPh 21", desc: "Pajak penghasilan", value: totalPph21, type: "potongan" },
                      { name: "Pinjaman", desc: "Cicilan pinjaman", value: totalLoan, type: "potongan" },
                      { name: "Denda", desc: "Denda keterlambatan", value: totalLate, type: "potongan" },
                    ]
                    const totalTunjangan = components.filter((c) => c.type === "tunjangan").reduce((s, c) => s + c.value, 0)
                    const totalPotongan = components.filter((c) => c.type === "potongan").reduce((s, c) => s + c.value, 0)
                    return (
                      <>
                        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                          {components.map((c) => (
                            <Card key={c.name} className={c.type === "potongan" ? "border-red-200 dark:border-red-900" : "border-green-200 dark:border-green-900"}>
                              <CardContent className="p-4">
                                <div className="text-xs text-muted-foreground">{c.desc}</div>
                                <div className="font-semibold text-sm mt-1">{c.name}</div>
                                <div className={`text-lg font-bold mt-1 ${c.type === "potongan" ? "text-red-600" : "text-green-600"}`}>
                                  {c.type === "potongan" ? "- " : "+ "}Rp {fmt(c.value)}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                          <div className="text-center">
                            <div className="text-sm text-muted-foreground">Total Tunjangan</div>
                            <div className="text-xl font-bold text-green-600">Rp {fmt(totalTunjangan)}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-muted-foreground">Total Potongan</div>
                            <div className="text-xl font-bold text-red-600">Rp {fmt(totalPotongan)}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-muted-foreground">Net Total</div>
                            <div className="text-xl font-bold">Rp {fmt(totalTunjangan + totalOvertime + totalThr - totalPotongan)}</div>
                          </div>
                        </div>
                      </>
                    )
                  })()}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="histori">
          <Card>
            <CardHeader><CardTitle>Histori Gaji Tahunan {currentYear}</CardTitle></CardHeader>
            <CardContent>
              {historiLoading ? (
                <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
              ) : historiData.length === 0 ? (
                <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">Belum ada data payroll tahun ini. Proses payroll bulanan terlebih dahulu.</div>
              ) : (
                <div className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Bulan</TableHead>
                        <TableHead>Total Gaji Pokok</TableHead>
                        <TableHead>Total Tunjangan</TableHead>
                        <TableHead>Total Potongan</TableHead>
                        <TableHead>Net Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {historiData.map((h) => (
                        <TableRow key={h.month}>
                          <TableCell className="font-medium">{months[h.month - 1]?.label}</TableCell>
                          <TableCell>Rp {fmt(h.totalGaji)}</TableCell>
                          <TableCell className="text-green-600">Rp {fmt(h.totalTunjangan)}</TableCell>
                          <TableCell className="text-red-600">-Rp {fmt(h.totalPotongan)}</TableCell>
                          <TableCell className="font-bold">Rp {fmt(h.netTotal)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="grid grid-cols-4 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Total Gaji</div>
                      <div className="text-lg font-bold">Rp {fmt(historiData.reduce((s, h) => s + h.totalGaji, 0))}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Total Tunjangan</div>
                      <div className="text-lg font-bold text-green-600">Rp {fmt(historiData.reduce((s, h) => s + h.totalTunjangan, 0))}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Total Potongan</div>
                      <div className="text-lg font-bold text-red-600">Rp {fmt(historiData.reduce((s, h) => s + h.totalPotongan, 0))}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Net Total</div>
                      <div className="text-lg font-bold">Rp {fmt(historiData.reduce((s, h) => s + h.netTotal, 0))}</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Slip Dialog */}
      <Dialog open={slipId !== null} onOpenChange={(open) => { if (!open) { setSlipId(null); setSlip(null) } }}>
        <DialogContent className="max-w-md">
          {slip ? (
            <>
              <DialogHeader>
                <DialogTitle>Slip Gaji - {slip.employee.name}</DialogTitle>
                <DialogDescription>Periode {month}/{year}</DialogDescription>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Gaji Pokok</span><span>Rp {fmt(Number(slip.basicSalary))}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Tunj. Transport</span><span>Rp {fmt(Number(slip.allowanceTransport) || 0)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Tunj. Makan</span><span>Rp {fmt(Number(slip.allowanceMeal) || 0)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Tunj. Kesehatan</span><span>Rp {fmt(Number(slip.allowanceHealth) || 0)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Tunj. Jabatan</span><span>Rp {fmt(Number(slip.allowancePosition) || 0)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Lembur</span><span>Rp {fmt(Number(slip.overtimePay) || 0)}</span></div>
                <hr />
                <div className="flex justify-between"><span className="text-muted-foreground">Pot. BPJS TK</span><span className="text-red-600">-Rp {fmt(Number(slip.deductionBpjsTk) || 0)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Pot. BPJS Kes</span><span className="text-red-600">-Rp {fmt(Number(slip.deductionBpjsKes) || 0)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Pot. PPh 21</span><span className="text-red-600">-Rp {fmt(Number(slip.deductionPph21) || 0)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Pot. Lainnya</span><span className="text-red-600">-Rp {fmt((Number(slip.deductionLate) || 0) + (Number(slip.deductionLoan) || 0))}</span></div>
                <hr />
                <div className="flex justify-between font-bold text-base"><span>Take Home Pay</span><span>Rp {fmt(Number(slip.netSalary))}</span></div>
                <div className="flex justify-between text-xs text-muted-foreground"><span>Status</span><Badge variant={statusVariant[slip.status] ?? "secondary"}>{statusLabel[slip.status] ?? slip.status}</Badge></div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
