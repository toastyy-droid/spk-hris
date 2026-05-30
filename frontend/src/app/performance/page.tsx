"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { api } from "@/lib/api"
import Link from "next/link"
import { Loader2, AlertCircle, RefreshCw, Plus } from "lucide-react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog as DialogDetail, DialogContent as DetailContent, DialogHeader as DetailHeader, DialogTitle as DetailTitle, DialogDescription as DetailDesc,
} from "@/components/ui/dialog"

interface PerformanceRecord {
  id: number
  period: string
  kpiScore: string
  selfScore: string | null
  review360Score: string | null
  totalScore: string
  grade: string | null
  notes: string | null
  employee: { id: number; name: string; nik: string; department: { id: number; name: string } }
}

const gradeVariant: Record<string, "success" | "warning" | "destructive" | "secondary"> = {
  A: "success", B: "warning", C: "destructive", D: "destructive",
}

export default function PerformancePage() {
  const [records, setRecords] = useState<PerformanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showCreate, setShowCreate] = useState(false)
  const [saving, setSaving] = useState(false)
  const [employees, setEmployees] = useState<{ id: number; name: string }[]>([])
  const [detailId, setDetailId] = useState<number | null>(null)
  const [detail, setDetail] = useState<PerformanceRecord | null>(null)
  const [form, setForm] = useState({ employeeId: "", period: "", kpiScore: "", selfScore: "", review360Score: "", notes: "" })
  const [perfTab, setPerfTab] = useState("review")
  const [kpiWeight, setKpiWeight] = useState({ bobotKpi: "60", bobotSelf: "20", bobot360: "20" })
  const [kpiSaved, setKpiSaved] = useState(false)

  async function fetchData() {
    setLoading(true)
    setError("")
    try {
      const data = await api.get<PerformanceRecord[]>("/performance")
      setRecords(data)
    } catch { setError("Gagal memuat data") }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [])
  useEffect(() => {
    try {
      const saved = localStorage.getItem("kpiWeights")
      if (saved) setKpiWeight(JSON.parse(saved))
    } catch {}
  }, [])

  async function openCreate() {
    setShowCreate(true)
    setForm({ employeeId: "", period: "", kpiScore: "", selfScore: "", review360Score: "", notes: "" })
    const empData = await api.get<{ id: number; name: string }[]>("/employees").catch(() => [] as { id: number; name: string }[])
    setEmployees(empData)
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await api.post("/performance", {
        employeeId: Number(form.employeeId),
        period: form.period,
        kpiScore: Number(form.kpiScore),
        selfScore: form.selfScore ? Number(form.selfScore) : undefined,
        review360Score: form.review360Score ? Number(form.review360Score) : undefined,
        notes: form.notes || undefined,
      })
      setShowCreate(false)
      fetchData()
    } catch { alert("Gagal menyimpan KPI") }
    finally { setSaving(false) }
  }

  function openDetail(record: PerformanceRecord) {
    setDetailId(record.id)
    setDetail(record)
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Kinerja</h1>
          <p className="text-muted-foreground">Performance management & 360° review</p>
        </div>
        <Button size="sm" onClick={openCreate}><Plus className="h-4 w-4 mr-1" /> Setup KPI</Button>
      </div>

      <Tabs value={perfTab} onValueChange={setPerfTab}>
        <TabsList>
          <TabsTrigger value="review">Review Kinerja</TabsTrigger>
          <TabsTrigger value="kpi">KPI Setting</TabsTrigger>
          <TabsTrigger value="360">360° Feedback</TabsTrigger>
          <TabsTrigger value="catatan">Catatan Kinerja</TabsTrigger>
        </TabsList>

        <TabsContent value="review" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Performance Review</CardTitle></CardHeader>
            <CardContent>
              {error ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <AlertCircle className="h-8 w-8 text-destructive mb-2" />
                  <p className="text-sm text-destructive mb-3">{error}</p>
                  <Button variant="outline" size="sm" onClick={fetchData}><RefreshCw className="h-4 w-4 mr-1" /> Coba Lagi</Button>
                </div>
              ) : records.length === 0 ? (
                <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">Belum ada data performance review</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>Periode</TableHead>
                      <TableHead>KPI Score</TableHead>
                      <TableHead>Self Score</TableHead>
                      <TableHead>Final Score</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {records.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="font-medium">{r.employee.name}</TableCell>
                        <TableCell>{r.period}</TableCell>
                        <TableCell>{Number(r.kpiScore)}%</TableCell>
                        <TableCell>{r.selfScore ? `${Number(r.selfScore)}%` : "-"}</TableCell>
                        <TableCell className="font-bold">{Number(r.totalScore)}%</TableCell>
                        <TableCell><Badge variant={gradeVariant[r.grade ?? ""] ?? "secondary"}>{r.grade ?? "-"}</Badge></TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" onClick={() => openDetail(r)}>Detail</Button>
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/performance/${r.id}`}>Lihat Detail</Link>
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
        </TabsContent>

        <TabsContent value="kpi" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Konfigurasi Bobot KPI</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bobotKpi">Bobot KPI (%)</Label>
                  <Input id="bobotKpi" type="number" min="0" max="100" value={kpiWeight.bobotKpi} onChange={(e) => { setKpiWeight({ ...kpiWeight, bobotKpi: e.target.value }); setKpiSaved(false) }} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bobotSelf">Bobot Self Assessment (%)</Label>
                  <Input id="bobotSelf" type="number" min="0" max="100" value={kpiWeight.bobotSelf} onChange={(e) => { setKpiWeight({ ...kpiWeight, bobotSelf: e.target.value }); setKpiSaved(false) }} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bobot360">Bobot 360° Review (%)</Label>
                  <Input id="bobot360" type="number" min="0" max="100" value={kpiWeight.bobot360} onChange={(e) => { setKpiWeight({ ...kpiWeight, bobot360: e.target.value }); setKpiSaved(false) }} />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button onClick={() => { localStorage.setItem("kpiWeights", JSON.stringify(kpiWeight)); setKpiSaved(true); setTimeout(() => setKpiSaved(false), 3000) }}>
                  Simpan Konfigurasi
                </Button>
                {kpiSaved && <span className="text-sm text-green-600">✓ Tersimpan</span>}
              </div>
              {Number(kpiWeight.bobotKpi) + Number(kpiWeight.bobotSelf) + Number(kpiWeight.bobot360) !== 100 && (
                <p className="text-xs text-yellow-600">Total bobot harus 100% (saat ini {Number(kpiWeight.bobotKpi) + Number(kpiWeight.bobotSelf) + Number(kpiWeight.bobot360)}%)</p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Ringkasan Records</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">{records.length}</div>
                  <div className="text-xs text-muted-foreground">Total Records</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{records.filter((r) => r.grade === "A").length}</div>
                  <div className="text-xs text-muted-foreground">Grade A</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{records.length > 0 ? (records.reduce((s, r) => s + Number(r.totalScore), 0) / records.length).toFixed(1) : 0}</div>
                  <div className="text-xs text-muted-foreground">Rata-rata Score (%)</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="360">
          <Card>
            <CardHeader><CardTitle>360° Feedback</CardTitle></CardHeader>
            <CardContent>
              {records.filter((r) => r.review360Score).length === 0 ? (
                <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">Belum ada data 360° review</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>NIK</TableHead>
                      <TableHead>Periode</TableHead>
                      <TableHead>KPI Score</TableHead>
                      <TableHead>Self Score</TableHead>
                      <TableHead>360 Score</TableHead>
                      <TableHead>Total Score</TableHead>
                      <TableHead>Grade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {records.filter((r) => r.review360Score).map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="font-medium">{r.employee.name}</TableCell>
                        <TableCell>{r.employee.nik}</TableCell>
                        <TableCell>{r.period}</TableCell>
                        <TableCell>{Number(r.kpiScore)}%</TableCell>
                        <TableCell>{r.selfScore ? `${Number(r.selfScore)}%` : "-"}</TableCell>
                        <TableCell className="font-medium text-blue-600">{Number(r.review360Score)}%</TableCell>
                        <TableCell className="font-bold">{Number(r.totalScore)}%</TableCell>
                        <TableCell><Badge variant={gradeVariant[r.grade ?? ""] ?? "secondary"}>{r.grade ?? "-"}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="catatan">
          <Card>
            <CardHeader><CardTitle>Catatan Kinerja</CardTitle></CardHeader>
            <CardContent>
              {records.filter((r) => r.notes).length === 0 ? (
                <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">Belum ada catatan kinerja</div>
              ) : (
                <div className="space-y-4">
                  {records.filter((r) => r.notes).map((r) => (
                    <div key={r.id} className="flex gap-4 border-l-2 border-primary pl-4 py-2">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-medium">{r.employee.name}</span>
                            <span className="text-muted-foreground text-sm ml-2">({r.employee.nik})</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={gradeVariant[r.grade ?? ""] ?? "secondary"}>{r.grade ?? "-"}</Badge>
                            <span className="text-xs text-muted-foreground">{r.period}</span>
                          </div>
                        </div>
                        <p className="text-sm mt-2 text-muted-foreground">{r.notes}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create KPI Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Setup KPI</DialogTitle><DialogDescription>Buat atau update performance review</DialogDescription></DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label>Karyawan *</Label>
              <Select value={form.employeeId} onValueChange={(v) => setForm({ ...form, employeeId: v })} required>
                <SelectTrigger><SelectValue placeholder="Pilih karyawan" /></SelectTrigger>
                <SelectContent>
                  {employees.map((e) => <SelectItem key={e.id} value={String(e.id)}>{e.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="period">Periode (YYYY-MM) *</Label>
              <Input id="period" placeholder="2026-06" value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} required />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label htmlFor="kpiScore">KPI Score *</Label>
                <Input id="kpiScore" type="number" min="0" max="100" value={form.kpiScore} onChange={(e) => setForm({ ...form, kpiScore: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="selfScore">Self Score</Label>
                <Input id="selfScore" type="number" min="0" max="100" value={form.selfScore} onChange={(e) => setForm({ ...form, selfScore: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="review360Score">360 Score</Label>
                <Input id="review360Score" type="number" min="0" max="100" value={form.review360Score} onChange={(e) => setForm({ ...form, review360Score: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Catatan</Label>
              <Input id="notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>Batal</Button>
              <Button type="submit" disabled={saving}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Simpan</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <DialogDetail open={detailId !== null} onOpenChange={(open) => { if (!open) { setDetailId(null); setDetail(null) } }}>
        <DetailContent className="max-w-sm">
          {detail ? (
            <>
              <DetailHeader><DetailTitle>{detail.employee.name}</DetailTitle><DetailDesc>Periode {detail.period}</DetailDesc></DetailHeader>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">KPI Score</span><span>{Number(detail.kpiScore)}%</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Self Score</span><span>{detail.selfScore ? `${Number(detail.selfScore)}%` : "-"}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">360° Review</span><span>{detail.review360Score ? `${Number(detail.review360Score)}%` : "-"}</span></div>
                <hr />
                <div className="flex justify-between font-bold"><span>Total Score</span><span>{Number(detail.totalScore)}%</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Grade</span><Badge variant={gradeVariant[detail.grade ?? ""] ?? "secondary"}>{detail.grade ?? "-"}</Badge></div>
                {detail.notes && <div className="flex justify-between"><span className="text-muted-foreground">Catatan</span><span>{detail.notes}</span></div>}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          )}
        </DetailContent>
      </DialogDetail>
    </div>
  )
}
