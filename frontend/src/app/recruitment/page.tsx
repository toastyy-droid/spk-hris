"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { api } from "@/lib/api"
import Link from "next/link"
import { Plus, MoveRight, Loader2, AlertCircle, RefreshCw } from "lucide-react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Candidate {
  id: number
  candidateName: string
  email: string
  phone: string | null
  stage: string
  totalScore: string | null
  position: { id: number; name: string; department: { id: number; name: string } }
}

interface PipelineStage {
  stage: string
  _count: number
}

const stageLabel: Record<string, string> = {
  SCREENING: "Screening", INTERVIEW: "Interview", OFFERING: "Offering",
  ONBOARDING: "Onboarding", HIRED: "Diterima", REJECTED: "Ditolak",
}

const stageColor: Record<string, string> = {
  SCREENING: "bg-blue-100 dark:bg-blue-900", INTERVIEW: "bg-yellow-100 dark:bg-yellow-900",
  OFFERING: "bg-purple-100 dark:bg-purple-900", ONBOARDING: "bg-green-100 dark:bg-green-900",
  HIRED: "bg-emerald-100 dark:bg-emerald-900", REJECTED: "bg-red-100 dark:bg-red-900",
}

const stageOrder = ["SCREENING", "INTERVIEW", "OFFERING", "ONBOARDING", "HIRED"]

const nextStage: Record<string, string> = {
  SCREENING: "INTERVIEW", INTERVIEW: "OFFERING", OFFERING: "ONBOARDING", ONBOARDING: "HIRED",
}

export default function RecruitmentPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [pipeline, setPipeline] = useState<PipelineStage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [moveLoading, setMoveLoading] = useState<number | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ candidateName: "", email: "", phone: "", positionId: "" })
  const [positions, setPositions] = useState<{ id: number; name: string; department: { name: string } }[]>([])
  const [recruitTab, setRecruitTab] = useState("pipeline")

  async function fetchData() {
    setLoading(true)
    setError("")
    try {
      const [cand, pipe] = await Promise.all([
        api.get<Candidate[]>("/recruitment"),
        api.get<PipelineStage[]>("/recruitment/pipeline"),
      ])
      setCandidates(cand)
      setPipeline(pipe)
    } catch {
      setError("Gagal memuat data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  async function handleMove(id: number, currentStage: string) {
    const next = nextStage[currentStage]
    if (!next) return
    setMoveLoading(id)
    try {
      await api.patch(`/recruitment/${id}/stage`, { stage: next })
      setCandidates((prev) => prev.map((c) => c.id === id ? { ...c, stage: next } : c))
    } catch { alert("Gagal memindahkan kandidat") }
    finally { setMoveLoading(null) }
  }

  async function openCreate() {
    setShowCreate(true)
    setForm({ candidateName: "", email: "", phone: "", positionId: "" })
    const pos = await api.get<typeof positions>("/positions").catch(() => [])
    setPositions(pos)
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await api.post("/recruitment", {
        candidateName: form.candidateName,
        email: form.email,
        phone: form.phone || undefined,
        positionId: Number(form.positionId),
      })
      setShowCreate(false)
      fetchData()
    } catch { alert("Gagal membuat lowongan") }
    finally { setSaving(false) }
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

  const pipelineMap = new Map(pipeline.map((p) => [p.stage, p._count]))
  const pipelineStages = stageOrder.map((s) => ({
    stage: s,
    candidates: candidates.filter((c) => c.stage === s),
    count: pipelineMap.get(s) ?? 0,
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Rekrutmen (ATS)</h1>
          <p className="text-muted-foreground">Pipeline kandidat end-to-end</p>
        </div>
        <Button size="sm" onClick={openCreate}><Plus className="h-4 w-4 mr-1" /> Buat Lowongan</Button>
      </div>

      <Tabs value={recruitTab} onValueChange={setRecruitTab}>
        <TabsList>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="lowongan">Lowongan Aktif</TabsTrigger>
          <TabsTrigger value="portal">Portal Karir</TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline" className="space-y-4">
          {candidates.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">Belum ada kandidat</div>
          ) : (
            <div className="grid grid-cols-5 gap-4">
              {pipelineStages.map((stage) => (
                <div key={stage.stage} className="space-y-3">
                  <div className={`rounded-lg px-3 py-2 text-sm font-semibold ${stageColor[stage.stage] ?? "bg-muted"}`}>
                    {stageLabel[stage.stage] ?? stage.stage}
                    <span className="ml-2 text-xs opacity-70">({stage.count})</span>
                  </div>
                  {stage.candidates.map((c) => (
                    <Card key={c.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-3">
                        <Link href={`/recruitment/${c.id}`} className="block">
                          <p className="text-sm font-medium hover:text-primary">{c.candidateName}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{c.position.name}</p>
                        </Link>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">Skor: {c.totalScore ?? "-"}</Badge>
                          {nextStage[stage.stage] && (
                            <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto" onClick={() => handleMove(c.id, stage.stage)} disabled={moveLoading === c.id}>
                              {moveLoading === c.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <MoveRight className="h-3 w-3" />}
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <div className="flex h-12 items-center justify-center rounded-lg border-2 border-dashed text-muted-foreground cursor-pointer hover:border-primary" onClick={openCreate}>
                    <span className="text-xs">+ Tambah</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="lowongan">
          <Card>
            <CardHeader><CardTitle>Lowongan Aktif</CardTitle></CardHeader>
            <CardContent>
              {(() => {
                const grouped = new Map<string, { positionName: string; deptName: string; candidates: Candidate[] }>()
                candidates.forEach((c) => {
                  const key = `${c.position.id}`
                  if (!grouped.has(key)) grouped.set(key, { positionName: c.position.name, deptName: c.position.department.name, candidates: [] })
                  grouped.get(key)!.candidates.push(c)
                })
                const entries = Array.from(grouped.entries())
                if (entries.length === 0) return <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">Belum ada lowongan aktif</div>
                const stageCount = (cands: Candidate[], stage: string) => cands.filter((c) => c.stage === stage).length
                return (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Posisi</TableHead>
                        <TableHead>Departemen</TableHead>
                        <TableHead>Jumlah Kandidat</TableHead>
                        <TableHead>Screening</TableHead>
                        <TableHead>Interview</TableHead>
                        <TableHead>Offering</TableHead>
                        <TableHead>Onboarding</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {entries.map(([, g]) => (
                        <TableRow key={g.positionName}>
                          <TableCell className="font-medium">{g.positionName}</TableCell>
                          <TableCell>{g.deptName}</TableCell>
                          <TableCell className="font-bold">{g.candidates.length}</TableCell>
                          <TableCell><Badge variant="secondary">{stageCount(g.candidates, "SCREENING")}</Badge></TableCell>
                          <TableCell><Badge variant="warning">{stageCount(g.candidates, "INTERVIEW")}</Badge></TableCell>
                          <TableCell><Badge variant="default">{stageCount(g.candidates, "OFFERING")}</Badge></TableCell>
                          <TableCell><Badge variant="success">{stageCount(g.candidates, "ONBOARDING")}</Badge></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )
              })()}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="portal">
          <Card>
            <CardHeader><CardTitle>Portal Karir - CV Anugerah Mega Makmur</CardTitle></CardHeader>
            <CardContent>
              {(() => {
                const positionsMap = new Map<string, { positionName: string; deptName: string; count: number }>()
                candidates.forEach((c) => {
                  const key = `${c.position.id}`
                  if (!positionsMap.has(key)) positionsMap.set(key, { positionName: c.position.name, deptName: c.position.department.name, count: 0 })
                  positionsMap.get(key)!.count++
                })
                const entries = Array.from(positionsMap.values())
                if (entries.length === 0) return <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">Belum ada lowongan dipublikasikan</div>
                return (
                  <div className="grid gap-4 md:grid-cols-2">
                    {entries.map((p) => (
                      <Card key={p.positionName} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-5">
                          <h3 className="font-semibold text-lg">{p.positionName}</h3>
                          <p className="text-sm text-muted-foreground">{p.deptName}</p>
                          <div className="flex items-center justify-between mt-4">
                            <Badge variant="secondary">{p.count} kandidat</Badge>
                            <Button variant="default" size="sm" onClick={() => alert("Silakan hubungi HR CV Anugerah Mega Makmur untuk melamar posisi ini.")}>
                              Lamar
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )
              })()}
              <div className="mt-6 rounded-lg bg-muted/50 p-4 text-center text-sm text-muted-foreground">
                <p className="font-medium mb-1">Bergabunglah bersama CV Anugerah Mega Makmur</p>
                <p>Kirim CV dan dokumen pendukung ke hrd@anugerah-makmur.co.id</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Candidate Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Tambah Kandidat</DialogTitle>
            <DialogDescription>Isi data kandidat baru</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Kandidat *</Label>
              <Input id="name" value={form.candidateName} onChange={(e) => setForm({ ...form, candidateName: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telepon</Label>
              <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Posisi *</Label>
              <Select value={form.positionId} onValueChange={(v) => setForm({ ...form, positionId: v })} required>
                <SelectTrigger><SelectValue placeholder="Pilih posisi" /></SelectTrigger>
                <SelectContent>
                  {positions.map((p) => <SelectItem key={p.id} value={String(p.id)}>{p.name} - {p.department.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>Batal</Button>
              <Button type="submit" disabled={saving}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Simpan</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
