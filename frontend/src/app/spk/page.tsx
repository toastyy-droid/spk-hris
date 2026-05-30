"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { api } from "@/lib/api"
import { useNotifications } from "@/contexts/notification-context"
import { TrendingUp, AlertTriangle, Users, DollarSign, BarChart3, PieChart } from "lucide-react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Legend } from "recharts"

interface Candidate {
  employeeId: number
  resultId: number
  rank: number
  name: string
  department: string
  position: string
  totalScore: number
  recommended: boolean
  kpiScore: number
  masaKerja: number
  skillMatch: number
  status?: string
}

interface EarlyWarningBase {
  employee?: { id: number; name: string; nik: string }
  score?: number
  period?: string
  contractEnd?: string
  joinDate?: string
  date?: string
  name?: string
  nik?: string
}

interface CandidateScore {
  id: number
  candidateName: string
  stage: string
  totalScore: number | null
  scoreExperience: number | null
  scoreEducation: number | null
  scoreInterview: number | null
  scoreSoftskill: number | null
  scoreSalary: number | null
  position: { name: string; department: { name: string } }
}

const severityVariant: Record<string, "destructive" | "warning" | "secondary"> = {
  HIGH: "destructive",
  MEDIUM: "warning",
  LOW: "secondary",
}

const stageVariant: Record<string, "default" | "secondary" | "warning" | "success" | "destructive"> = {
  SCREENING: "secondary",
  INTERVIEW: "warning",
  OFFERING: "default",
  ONBOARDING: "success",
  HIRED: "success",
}

const stageLabel: Record<string, string> = {
  SCREENING: "Screening",
  INTERVIEW: "Interview",
  OFFERING: "Offering",
  ONBOARDING: "Onboarding",
  HIRED: "Hired",
}

const PIE_COLORS = ["#22c55e", "#eab308", "#3b82f6", "#a855f7", "#ef4444"]

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-muted ${className ?? ""}`} />
}

export default function SpkPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [earlyWarnings, setEarlyWarnings] = useState<{
    decliningPerformance: EarlyWarningBase[]
    contractExpiring: EarlyWarningBase[]
    noRaiseLongTerm: EarlyWarningBase[]
    highAbsence: EarlyWarningBase[]
  } | null>(null)
  const [recruitCandidates, setRecruitCandidates] = useState<CandidateScore[]>([])
  const [employeeStats, setEmployeeStats] = useState<{
    total: number; active: number; byDept: { name: string; _count: { employees: number } }[]
    byStatus: { status: string; _count: number }[]
  } | null>(null)
  const [attendanceToday, setAttendanceToday] = useState<{
    total: number; hadir: number; izin: number; sakit: number; cuti: number; alpha: number
  } | null>(null)
  const [running, setRunning] = useState(false)
  const [actionId, setActionId] = useState<number | null>(null)
  const [spkError, setSpkError] = useState("")
  const [spkSuccess, setSpkSuccess] = useState("")
  const { pushNotification } = useNotifications()
  const [selectedWarning, setSelectedWarning] = useState<{ name: string; nik: string; issue: string; severity: string; detail: string } | null>(null)

  useEffect(() => {
    let alive = true
    function fetchOne<T>(setter: (v: T) => void, endpoint: string, retries = 2) {
      const attempt = (n: number) => {
        if (!alive) return
        api.get<T>(endpoint).then((data) => { if (alive) setter(data) }).catch(() => {
          if (alive && n > 0) setTimeout(() => attempt(n - 1), 1500)
        })
      }
      attempt(retries)
    }
    fetchOne(setEmployeeStats, "/employees/stats")
    fetchOne(setAttendanceToday, "/attendance/summary/today")
    api.post<{ candidates: Candidate[] }>("/spk/promotion", {}).then((d) => {
      if (alive) setCandidates(d.candidates ?? [])
    }).catch(() => {})
    fetchOne(setEarlyWarnings, "/spk/early-warnings")
    fetchOne(setRecruitCandidates, "/recruitment")
    return () => { alive = false }
  }, [])

  async function fetchPromotion() {
    setRunning(true)
    setSpkError("")
    setSpkSuccess("")
    try {
      const data = await api.post<{ threshold: number; candidates: Candidate[] }>("/spk/promotion", {})
      setCandidates(data.candidates ?? [])
      const total = data.candidates?.length ?? 0
      const reco = data.candidates?.filter((c) => c.recommended).length ?? 0
      setSpkSuccess(`SPK selesai: ${total} kandidat, ${reco} direkomendasikan (threshold ${data.threshold})`)
      pushNotification("SPK Promosi", `Perhitungan selesai: ${total} kandidat, ${reco} direkomendasikan`)
      setTimeout(() => setSpkSuccess(""), 5000)
    } catch {
      setSpkError("Gagal menjalankan SPK. Pastikan ada data kinerja dan backend berjalan.")
    }
    finally { setRunning(false) }
  }

  async function handleApprove(id: number) {
    setActionId(id)
    try {
      await api.patch(`/spk/results/${id}`, { status: "APPROVED" })
      setCandidates((prev) => prev.map((c) => (c.resultId === id ? { ...c, status: "APPROVED" } : c)))
      pushNotification("Persetujuan Promosi", `Kandidat berhasil di-approve`)
      setSpkError("")
    } catch { setSpkError("Gagal approve") }
    finally { setActionId(null) }
  }

  async function handleReject(id: number) {
    setActionId(id)
    try {
      await api.patch(`/spk/results/${id}`, { status: "REJECTED" })
      setCandidates((prev) => prev.map((c) => (c.resultId === id ? { ...c, status: "REJECTED" } : c)))
      pushNotification("Persetujuan Promosi", `Kandidat ditunda`)
      setSpkError("")
    } catch { setSpkError("Gagal menolak") }
    finally { setActionId(null) }
  }

  const totalPromo = candidates.filter((c) => c.recommended).length
  const totalWarnings = earlyWarnings
    ? (earlyWarnings.decliningPerformance?.length ?? 0) +
      (earlyWarnings.contractExpiring?.length ?? 0) +
      (earlyWarnings.noRaiseLongTerm?.length ?? 0) +
      (earlyWarnings.highAbsence?.length ?? 0)
    : 0
  const contractCount = earlyWarnings?.contractExpiring?.length ?? 0

  const rankedRecruits = [...recruitCandidates]
    .filter((c) => c.totalScore !== null && c.totalScore !== 0)
    .sort((a, b) => (b.totalScore ?? 0) - (a.totalScore ?? 0))
    .map((c, i) => ({ ...c, rank: i + 1 }))

  const deptData = (employeeStats?.byDept ?? []).map((d) => ({
    name: d.name,
    value: d._count.employees,
  }))

  const statusData = (employeeStats?.byStatus ?? []).map((s) => {
    const labels: Record<string, string> = { ACTIVE: "Aktif", PROBATION: "Probation", RESIGNED: "Resign", TERMINATED: "Terminated" }
    return { name: labels[s.status] ?? s.status, value: s._count }
  })

  const attData = attendanceToday
    ? [
        { name: "Hadir", value: attendanceToday.hadir },
        { name: "Cuti", value: attendanceToday.cuti },
        { name: "Izin", value: attendanceToday.izin },
        { name: "Sakit", value: attendanceToday.sakit },
        { name: "Alpha", value: attendanceToday.alpha },
      ]
    : []

  const earlyWarningList: { name: string; nik: string; issue: string; severity: string; detail: string }[] = [
    ...(earlyWarnings?.decliningPerformance ?? []).map((w) => ({
      name: w.employee?.name ?? "", nik: w.employee?.nik ?? "", issue: "Kinerja turun 3 bulan", severity: "HIGH",
      detail: `Skor kinerja menurun selama 3 periode berturut-turut. Disarankan melakukan coaching dan evaluasi.`,
    })),
    ...(earlyWarnings?.highAbsence ?? []).map((w) => ({
      name: w.employee?.name ?? "", nik: w.employee?.nik ?? "", issue: "Absensi melebihi threshold", severity: "MEDIUM",
      detail: `Tingkat absensi di atas batas wajar (alpha/izin tanpa keterangan). Perlu tindakan disiplin atau konseling.`,
    })),
    ...(earlyWarnings?.noRaiseLongTerm ?? []).map((w) => ({
      name: w.employee?.name ?? "", nik: w.employee?.nik ?? "", issue: "Belum naik gaji > 2 tahun", severity: "LOW",
      detail: `Belum mendapatkan kenaikan gaji lebih dari 2 tahun. Pertimbangkan review kompensasi.`,
    })),
    ...(earlyWarnings?.contractExpiring ?? []).map((w) => ({
      name: w.employee?.name ?? w.name ?? "", nik: w.employee?.nik ?? w.nik ?? "", issue: "Kontrak habis < 60 hari", severity: "HIGH",
      detail: `Kontrak akan berakhir dalam waktu dekat. Segera lakukan review perpanjangan atau terminasi.`,
    })),
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">SPK Dashboard</h1>
        <p className="text-muted-foreground">Sistem Penunjang Keputusan berbasis data analytics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm text-muted-foreground">Layak Promosi</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalPromo}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm text-muted-foreground">Early Warning</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{totalWarnings}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm text-muted-foreground">Kontrak Mendekati Habis</CardTitle>
            <Users className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{contractCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm text-muted-foreground">Total Kandidat</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{recruitCandidates.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="promosi">
        <TabsList>
          <TabsTrigger value="promosi">Rekomendasi Promosi</TabsTrigger>
          <TabsTrigger value="early">Early Warning</TabsTrigger>
          <TabsTrigger value="rekrut">Rekomendasi Rekrutmen</TabsTrigger>
          <TabsTrigger value="analitik">Dashboard Analitik</TabsTrigger>
        </TabsList>

        <TabsContent value="promosi" className="space-y-4">
          <div className="flex items-center gap-4">
            <Button onClick={fetchPromotion} disabled={running}>
              {running ? "Memproses..." : "Jalankan SPK Promosi"}
            </Button>
            {spkSuccess && <p className="text-sm text-green-600 dark:text-green-400">{spkSuccess}</p>}
            {spkError && <p className="text-sm text-red-600 dark:text-red-400">{spkError}</p>}
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Peringkat Kandidat Promosi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 grid grid-cols-5 gap-2 text-xs text-muted-foreground">
                <div className="font-medium">Kriteria & Bobot:</div>
                <div>Skor Kinerja 40%</div>
                <div>Masa Kerja 20%</div>
                <div>Skill Match 20%</div>
                <div>Disiplin 10% + 360 10%</div>
              </div>
              {candidates.length === 0 ? (
                <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
                  Belum ada data. Jalankan SPK untuk melihat rekomendasi.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Nama</TableHead>
                      <TableHead>Divisi</TableHead>
                      <TableHead>KPI Score</TableHead>
                      <TableHead>Masa Kerja</TableHead>
                      <TableHead>Skill Match</TableHead>
                      <TableHead>Skor Total</TableHead>
                      <TableHead>Rekomendasi</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {candidates.map((c) => (
                      <TableRow key={c.rank}>
                        <TableCell className="font-bold">{c.rank}</TableCell>
                        <TableCell className="font-medium">{c.name}</TableCell>
                        <TableCell>{c.department}</TableCell>
                        <TableCell>{c.kpiScore}%</TableCell>
                        <TableCell>{c.masaKerja} thn</TableCell>
                        <TableCell>{c.skillMatch}%</TableCell>
                        <TableCell className="font-bold text-lg">{c.totalScore}</TableCell>
                        <TableCell>
                          <Badge variant={c.recommended ? "success" : "secondary"}>
                            {c.recommended ? "Direkomendasikan" : "Tidak"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {c.status === "APPROVED" || c.status === "REJECTED" ? (
                            <Badge variant={c.status === "APPROVED" ? "success" : "warning"}>
                              {c.status === "APPROVED" ? "Approved" : "Ditunda"}
                            </Badge>
                          ) : (
                            <div className="flex gap-1">
                              <Button size="sm" variant="default" disabled={actionId === c.resultId} onClick={() => handleApprove(c.resultId)}>
                                {actionId === c.resultId ? "..." : "Approve"}
                              </Button>
                              <Button size="sm" variant="outline" disabled={actionId === c.resultId} onClick={() => handleReject(c.resultId)}>
                                Tunda
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="early" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Early Warning System</CardTitle></CardHeader>
            <CardContent>
              {earlyWarningList.length === 0 ? (
                <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
                  Tidak ada early warning
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>Issue</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {earlyWarningList.map((w, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{w.name}</TableCell>
                        <TableCell>{w.issue}</TableCell>
                        <TableCell>
                          <Badge variant={severityVariant[w.severity] ?? "secondary"}>{w.severity}</Badge>
                        </TableCell>
                        <TableCell><Button variant="ghost" size="sm" onClick={() => setSelectedWarning(w)}>Detail</Button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rekrut" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rekomendasi Rekrutmen</CardTitle>
              <p className="text-xs text-muted-foreground">
                Bobot: Pengalaman 30% | Pendidikan 25% | Interview 25% | Soft Skill 10% | Gaji 10%
              </p>
            </CardHeader>
            <CardContent>
              {rankedRecruits.length === 0 ? (
                <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
                  Belum ada kandidat dengan skor. Lakukan penilaian di halaman Rekrutmen.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Nama</TableHead>
                      <TableHead>Posisi</TableHead>
                      <TableHead>Divisi</TableHead>
                      <TableHead>Stage</TableHead>
                      <TableHead>Pengalaman</TableHead>
                      <TableHead>Pendidikan</TableHead>
                      <TableHead>Interview</TableHead>
                      <TableHead>Soft Skill</TableHead>
                      <TableHead>Gaji</TableHead>
                      <TableHead>Skor Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rankedRecruits.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell className="font-bold">{c.rank}</TableCell>
                        <TableCell className="font-medium">{c.candidateName}</TableCell>
                        <TableCell>{c.position.name}</TableCell>
                        <TableCell>{c.position.department.name}</TableCell>
                        <TableCell>
                          <Badge variant={stageVariant[c.stage] ?? "default"}>
                            {stageLabel[c.stage] ?? c.stage}
                          </Badge>
                        </TableCell>
                        <TableCell>{c.scoreExperience ?? "-"}</TableCell>
                        <TableCell>{c.scoreEducation ?? "-"}</TableCell>
                        <TableCell>{c.scoreInterview ?? "-"}</TableCell>
                        <TableCell>{c.scoreSoftskill ?? "-"}</TableCell>
                        <TableCell>{c.scoreSalary ?? "-"}</TableCell>
                        <TableCell className="font-bold text-lg">{c.totalScore}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analitik" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" /> Karyawan per Departemen
                </CardTitle>
              </CardHeader>
              <CardContent>
                {deptData.length === 0 ? (
                  <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
                    {employeeStats === null ? <Skeleton className="h-48 w-full" /> : "Belum ada data"}
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={deptData}>
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <PieChart className="h-4 w-4" /> Status Kehadiran Hari Ini
                </CardTitle>
              </CardHeader>
              <CardContent>
                {attData.length === 0 || attData.every((d) => d.value === 0) ? (
                  <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
                    {attendanceToday === null ? <Skeleton className="h-48 w-full" /> : "Belum ada data"}
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={240}>
                    <RePieChart>
                      <Pie data={attData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                        {attData.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RePieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" /> Status Karyawan
                </CardTitle>
              </CardHeader>
              <CardContent>
                {statusData.length === 0 ? (
                  <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
                    {employeeStats === null ? <Skeleton className="h-48 w-full" /> : "Belum ada data"}
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={statusData}>
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      {/* Early Warning Detail Dialog */}
      <Dialog open={selectedWarning !== null} onOpenChange={(open) => { if (!open) setSelectedWarning(null) }}>
        <DialogContent className="max-w-sm">
          {selectedWarning && (
            <>
              <DialogHeader>
                <DialogTitle>Detail Early Warning</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Nama</span><span className="font-medium">{selectedWarning.name}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">NIK</span><span>{selectedWarning.nik}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Issue</span><span>{selectedWarning.issue}</span></div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Severity</span>
                  <Badge variant={severityVariant[selectedWarning.severity] ?? "secondary"}>{selectedWarning.severity}</Badge>
                </div>
                <hr />
                <p className="text-muted-foreground">{selectedWarning.detail}</p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}