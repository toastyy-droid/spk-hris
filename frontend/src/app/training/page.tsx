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

export default function TrainingPage() {
  const [trainings, setTrainings] = useState<TrainingRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showCreate, setShowCreate] = useState(false)
  const [saving, setSaving] = useState(false)
  const [detailId, setDetailId] = useState<number | null>(null)
  const [detail, setDetail] = useState<TrainingRecord | null>(null)
  const [employees, setEmployees] = useState<{ id: number; name: string }[]>([])
  const [form, setForm] = useState({ employeeId: "", name: "", provider: "", date: "", cost: "", duration: "", notes: "" })
  const [trainTab, setTrainTab] = useState("daftar")
  const [skills, setSkills] = useState<{ id: number; name: string; category: string | null }[]>([])
  const [skillsLoading, setSkillsLoading] = useState(false)

  async function fetchData() {
    setLoading(true)
    setError("")
    try {
      const data = await api.get<TrainingRecord[]>("/training")
      setTrainings(data)
    } catch { setError("Gagal memuat data") }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [])

  async function fetchSkills() {
    setSkillsLoading(true)
    try {
      const data = await api.get<{ id: number; name: string; category: string | null }[]>("/skills")
      setSkills(data)
    } catch {} finally { setSkillsLoading(false) }
  }

  useEffect(() => {
    if (trainTab === "skill" && skills.length === 0) fetchSkills()
  }, [trainTab])

  async function openCreate() {
    setShowCreate(true)
    setForm({ employeeId: "", name: "", provider: "", date: "", cost: "", duration: "", notes: "" })
    const empData = await api.get<{ id: number; name: string }[]>("/employees").catch(() => [] as { id: number; name: string }[])
    setEmployees(empData)
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await api.post("/training", {
        employeeId: Number(form.employeeId),
        name: form.name,
        provider: form.provider || undefined,
        date: form.date,
        cost: form.cost ? Number(form.cost) : undefined,
        duration: form.duration ? Number(form.duration) : undefined,
        notes: form.notes || undefined,
      })
      setShowCreate(false)
      fetchData()
    } catch { alert("Gagal menyimpan training") }
    finally { setSaving(false) }
  }

  async function openDetail(id: number) {
    setDetailId(id)
    try {
      const found = trainings.find((t) => t.id === id) ?? await api.get<TrainingRecord>(`/training/${id}`)
      setDetail(found)
    } catch { setDetail(null) }
  }

  const now = new Date()
  function getStatus(dateStr: string) {
    const d = new Date(dateStr)
    const diffDays = Math.ceil((d.getTime() - now.getTime()) / (86400000))
    if (diffDays < -1) return { label: "Selesai", variant: "success" as const }
    if (diffDays <= 1) return { label: "Berjalan", variant: "warning" as const }
    return { label: "Direncanakan", variant: "secondary" as const }
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pelatihan & Pengembangan</h1>
          <p className="text-muted-foreground">Training request, approval, dan skill matrix</p>
        </div>
        <Button size="sm" onClick={openCreate}><Plus className="h-4 w-4 mr-1" /> Ajukan Training</Button>
      </div>

      <Tabs value={trainTab} onValueChange={setTrainTab}>
        <TabsList>
          <TabsTrigger value="daftar">Daftar Training</TabsTrigger>
          <TabsTrigger value="riwayat">Riwayat Pelatihan</TabsTrigger>
          <TabsTrigger value="skill">Skill Matrix</TabsTrigger>
        </TabsList>

        <TabsContent value="daftar" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Program Pelatihan</CardTitle></CardHeader>
            <CardContent>
              {trainings.length === 0 ? (
                <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">Belum ada program pelatihan</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama Training</TableHead>
                      <TableHead>Karyawan</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trainings.map((t) => {
                      const status = getStatus(t.date)
                      return (
                        <TableRow key={t.id}>
                          <TableCell className="font-medium">{t.name}</TableCell>
                          <TableCell>{t.employee.name}</TableCell>
                          <TableCell>{new Date(t.date).toLocaleDateString("id-ID")}</TableCell>
                          <TableCell><Badge variant={status.variant}>{status.label}</Badge></TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm" onClick={() => openDetail(t.id)}>Detail</Button>
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/training/${t.id}`}>Lihat Detail</Link>
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

        <TabsContent value="riwayat">
          <Card>
            <CardHeader><CardTitle>Riwayat Pelatihan per Karyawan</CardTitle></CardHeader>
            <CardContent>
              {trainings.length === 0 ? (
                <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">Belum ada data pelatihan</div>
              ) : (
                (() => {
                  const grouped = new Map<number, { name: string; nik: string; totalTraining: number; totalBiaya: number; totalJam: number }>()
                  trainings.forEach((t) => {
                    const eid = t.employee.id
                    if (!grouped.has(eid)) grouped.set(eid, { name: t.employee.name, nik: t.employee.nik, totalTraining: 0, totalBiaya: 0, totalJam: 0 })
                    const g = grouped.get(eid)!
                    g.totalTraining++
                    g.totalBiaya += Number(t.cost) || 0
                    g.totalJam += t.duration || 0
                  })
                  const rows = Array.from(grouped.values())
                  return (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Karyawan</TableHead>
                          <TableHead>NIK</TableHead>
                          <TableHead>Total Training</TableHead>
                          <TableHead>Total Biaya</TableHead>
                          <TableHead>Total Jam</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rows.map((r) => (
                          <TableRow key={r.nik}>
                            <TableCell className="font-medium">{r.name}</TableCell>
                            <TableCell>{r.nik}</TableCell>
                            <TableCell><Badge variant="secondary">{r.totalTraining}</Badge></TableCell>
                            <TableCell>Rp {r.totalBiaya.toLocaleString("id-ID")}</TableCell>
                            <TableCell>{r.totalJam} jam</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )
                })()
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skill">
          <Card>
            <CardHeader><CardTitle>Skill Matrix</CardTitle></CardHeader>
            <CardContent>
              {skillsLoading ? (
                <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
              ) : skills.length === 0 ? (
                <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">Belum ada data skill</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Skill</TableHead>
                      <TableHead>Kategori</TableHead>
                      <TableHead>Jumlah Karyawan</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {skills.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell className="font-medium">{s.name}</TableCell>
                        <TableCell><Badge variant="outline">{s.category ?? "-"}</Badge></TableCell>
                        <TableCell className="text-muted-foreground">-</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              <div className="mt-4 text-xs text-muted-foreground italic">
                Integrasi skill matrix per karyawan membutuhkan endpoint /skills/employee/:id
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Training Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Ajukan Training</DialogTitle><DialogDescription>Buat pelatihan baru untuk karyawan</DialogDescription></DialogHeader>
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
              <Label htmlFor="name">Nama Training *</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="provider">Penyelenggara</Label>
              <Input id="provider" value={form.provider} onChange={(e) => setForm({ ...form, provider: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="date">Tanggal *</Label>
                <Input id="date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Durasi (jam)</Label>
                <Input id="duration" type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cost">Biaya (Rp)</Label>
              <Input id="cost" type="number" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} />
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
      <Dialog open={detailId !== null} onOpenChange={(open) => { if (!open) { setDetailId(null); setDetail(null) } }}>
        <DialogContent className="max-w-sm">
          {detail ? (
            <>
              <DialogHeader><DialogTitle>{detail.name}</DialogTitle><DialogDescription>{detail.employee.name}</DialogDescription></DialogHeader>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Penyelenggara</span><span>{detail.provider ?? "-"}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Tanggal</span><span>{new Date(detail.date).toLocaleDateString("id-ID")}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Durasi</span><span>{detail.duration ? `${detail.duration} jam` : "-"}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Biaya</span><span>{detail.cost ? `Rp ${Number(detail.cost).toLocaleString("id-ID")}` : "-"}</span></div>
                {detail.notes && <div><span className="text-muted-foreground">Catatan</span><p className="mt-1">{detail.notes}</p></div>}
                {detail.certificate && <Badge variant="success">Sertifikat tersedia</Badge>}
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
