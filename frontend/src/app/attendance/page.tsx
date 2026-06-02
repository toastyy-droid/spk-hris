"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { toast } from "sonner"
import { CheckCircle, XCircle, Clock, Loader2, AlertCircle, RefreshCw, LogIn, LogOut, Eye } from "lucide-react"
import { api } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"

interface LeaveRecord {
  id: number
  type: string
  startDate: string
  endDate: string
  status: string
  reason: string | null
  employee: { id: number; name: string; nik: string }
}

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

interface TodaySummary {
  total: number
  hadir: number
  izin: number
  sakit: number
  cuti: number
  alpha: number
}

const leaveStatusVariant: Record<string, "success" | "destructive" | "warning" | "secondary"> = {
  APPROVED: "success",
  REJECTED: "destructive",
  PENDING: "warning",
}

const leaveStatusLabel: Record<string, string> = {
  APPROVED: "Disetujui",
  REJECTED: "Ditolak",
  PENDING: "Menunggu",
}

const leaveTypeLabel: Record<string, string> = {
  TAHUNAN: "Cuti Tahunan",
  SAKIT: "Cuti Sakit",
  MELAHIRKAN: "Cuti Melahirkan",
  PENTING: "Cuti Kepentingan",
}

const statusLabel: Record<string, string> = {
  HADIR: "Hadir",
  IZIN: "Izin",
  SAKIT: "Sakit",
  CUTI: "Cuti",
  ALPHA: "Alpha",
}

const statusVariant: Record<string, "success" | "warning" | "destructive" | "secondary" | "default"> = {
  HADIR: "success",
  IZIN: "warning",
  SAKIT: "destructive",
  CUTI: "secondary",
  ALPHA: "destructive",
}

const now = new Date()
const currentMonth = now.getMonth() + 1
const currentYear = now.getFullYear()

export default function AttendancePage() {
  const { user } = useAuth()
  const [todaySummary, setTodaySummary] = useState<TodaySummary | null>(null)
  const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null)
  const [monthlyRecords, setMonthlyRecords] = useState<AttendanceRecord[]>([])
  const [leaves, setLeaves] = useState<LeaveRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [actionLoading, setActionLoading] = useState<number | null>(null)
  const [checkLoading, setCheckLoading] = useState(false)
  const [monthTab, setMonthTab] = useState(`${currentYear}-${String(currentMonth).padStart(2, "0")}`)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const [att, lev, monthly] = await Promise.all([
        api.get<TodaySummary>("/attendance/summary/today"),
        api.get<LeaveRecord[]>("/leaves"),
        api.get<AttendanceRecord[]>(`/attendance?month=${currentMonth}&year=${currentYear}`),
      ])
      setTodaySummary(att)
      setLeaves(lev)
      setMonthlyRecords(monthly)

      if (user?.employeeId) {
        const myRecord = monthly.find((r) => {
          const rDate = new Date(r.date)
          const today = new Date()
          return r.employeeId === user.employeeId &&
            rDate.getDate() === today.getDate() &&
            rDate.getMonth() === today.getMonth() &&
            rDate.getFullYear() === today.getFullYear()
        })
        setTodayRecord(myRecord ?? null)
      }
    } catch {
      setError("Gagal memuat data")
    } finally {
      setLoading(false)
    }
  }, [user?.employeeId])

  useEffect(() => { fetchData() }, [fetchData])

  async function handleCheckIn() {
    setCheckLoading(true)
    try {
      const record = await api.post<AttendanceRecord>("/attendance/checkin")
      setTodayRecord(record)
      fetchData()
    } catch (e: unknown) {
      toast.error((e as Error).message || "Gagal check-in")
    } finally {
      setCheckLoading(false)
    }
  }

  async function handleCheckOut() {
    setCheckLoading(true)
    try {
      const record = await api.post<AttendanceRecord>("/attendance/checkout")
      setTodayRecord(record)
      fetchData()
    } catch (e: unknown) {
      toast.error((e as Error).message || "Gagal check-out")
    } finally {
      setCheckLoading(false)
    }
  }

  async function handleApprove(id: number) {
    setActionLoading(id)
    try {
      await api.patch(`/leaves/${id}/approve`, {})
      setLeaves((prev) => prev.map((l) => l.id === id ? { ...l, status: "APPROVED" } : l))
    } catch { toast.error("Gagal approve cuti") }
    finally { setActionLoading(null) }
  }

  async function handleReject(id: number) {
    setActionLoading(id)
    try {
      await api.patch(`/leaves/${id}/reject`, {})
      setLeaves((prev) => prev.map((l) => l.id === id ? { ...l, status: "REJECTED" } : l))
    } catch { toast.error("Gagal menolak cuti") }
    finally { setActionLoading(null) }
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

  const checkedIn = !!todayRecord?.checkIn
  const checkedOut = !!todayRecord?.checkOut

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Absensi & Time Management</h1>
        </div>
        {user?.employeeId && (
          <div className="flex gap-2">
            {!checkedIn ? (
              <Button size="sm" onClick={handleCheckIn} disabled={checkLoading}>
                {checkLoading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <LogIn className="h-4 w-4 mr-1" />}
                Check In
              </Button>
            ) : !checkedOut ? (
              <Button size="sm" variant="secondary" onClick={handleCheckOut} disabled={checkLoading}>
                {checkLoading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <LogOut className="h-4 w-4 mr-1" />}
                Check Out
              </Button>
            ) : (
              <Badge variant="success" className="py-2 px-3">
                <CheckCircle className="h-4 w-4 mr-1" />
                Selesai
              </Badge>
            )}
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Hadir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{todaySummary?.hadir ?? "-"}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Cuti</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{todaySummary?.cuti ?? "-"}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Izin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{todaySummary?.izin ?? "-"}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Sakit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{todaySummary?.sakit ?? "-"}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Alpha</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{todaySummary?.alpha ?? "-"}</div>
          </CardContent>
        </Card>
      </div>

      {todayRecord && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Status Absen Hari Ini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6 text-sm">
              <div>
                <span className="text-muted-foreground mr-2">Check In:</span>
                <span className="font-medium">
                  {todayRecord.checkIn ? new Date(todayRecord.checkIn).toLocaleTimeString("id-ID") : "-"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground mr-2">Check Out:</span>
                <span className="font-medium">
                  {todayRecord.checkOut ? new Date(todayRecord.checkOut).toLocaleTimeString("id-ID") : "-"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground mr-2">Status:</span>
                <Badge variant={statusVariant[todayRecord.status] ?? "default"}>
                  {statusLabel[todayRecord.status] ?? todayRecord.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="history">
        <TabsList>
          <TabsTrigger value="history">Riwayat Absensi</TabsTrigger>
          <TabsTrigger value="leave">Cuti & Izin</TabsTrigger>
          <TabsTrigger value="shift">Jadwal Shift</TabsTrigger>
          <TabsTrigger value="overtime">Lembur</TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Riwayat Absensi Bulan Ini</CardTitle>
                <input
                  type="month"
                  className="h-8 rounded-md border border-input bg-background px-3 text-xs"
                  value={monthTab}
                  onChange={(e) => setMonthTab(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              {monthlyRecords.length === 0 ? (
                <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
                  Belum ada data absensi bulan ini
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>NIK</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Check In</TableHead>
                      <TableHead>Check Out</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {monthlyRecords.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="font-medium">{r.employee.name}</TableCell>
                        <TableCell>{r.employee.nik}</TableCell>
                        <TableCell>{new Date(r.date).toLocaleDateString("id-ID")}</TableCell>
                        <TableCell>
                          {r.checkIn ? new Date(r.checkIn).toLocaleTimeString("id-ID") : "-"}
                        </TableCell>
                        <TableCell>
                          {r.checkOut ? new Date(r.checkOut).toLocaleTimeString("id-ID") : "-"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusVariant[r.status] ?? "default"}>
                            {statusLabel[r.status] ?? r.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/attendance/${r.id}`}>
                              <Eye className="h-4 w-4 mr-1" /> Detail
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leave" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Pengajuan Cuti</CardTitle></CardHeader>
            <CardContent>
              {leaves.length === 0 ? (
                <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">Belum ada pengajuan cuti</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>Jenis</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaves.map((l) => {
                      const start = new Date(l.startDate).toLocaleDateString("id-ID")
                      const end = new Date(l.endDate).toLocaleDateString("id-ID")
                      const dateLabel = start === end ? start : `${start} - ${end}`
                      return (
                        <TableRow key={l.id}>
                          <TableCell className="font-medium">{l.employee.name}</TableCell>
                          <TableCell>{leaveTypeLabel[l.type] ?? l.type}</TableCell>
                          <TableCell>{dateLabel}</TableCell>
                          <TableCell>
                            <Badge variant={leaveStatusVariant[l.status] ?? "secondary"}>
                              {l.status === "APPROVED" && <CheckCircle className="h-3 w-3 mr-1 inline" />}
                              {l.status === "REJECTED" && <XCircle className="h-3 w-3 mr-1 inline" />}
                              {l.status === "PENDING" && <Clock className="h-3 w-3 mr-1 inline" />}
                              {leaveStatusLabel[l.status] ?? l.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {l.status === "PENDING" && (
                              <div className="flex gap-1">
                                <Button variant="ghost" size="sm" className="text-green-600" onClick={() => handleApprove(l.id)} disabled={actionLoading === l.id}>
                                  {actionLoading === l.id ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <CheckCircle className="h-3 w-3 mr-1" />}
                                  Approve
                                </Button>
                                <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleReject(l.id)} disabled={actionLoading === l.id}>
                                  {actionLoading === l.id ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <XCircle className="h-3 w-3 mr-1" />}
                                  Tolak
                                </Button>
                              </div>
                            )}
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

        <TabsContent value="shift">
          <Card>
            <CardHeader><CardTitle>Kalender Absensi - {new Date(currentYear, currentMonth - 1).toLocaleDateString("id-ID", { month: "long", year: "numeric" })}</CardTitle></CardHeader>
            <CardContent>
              {monthlyRecords.length === 0 ? (
                <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">Belum ada data absensi bulan ini</div>
              ) : (
                <div className="space-y-2">
                  <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground">
                    <div>Min</div><div>Sen</div><div>Sel</div><div>Rab</div><div>Kam</div><div>Jum</div><div>Sab</div>
                  </div>
                  {(() => {
                    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate()
                    const firstDay = new Date(currentYear, currentMonth - 1, 1).getDay()
                    const weeks: React.ReactNode[] = []
                    const dayRecords = new Map<number, AttendanceRecord[]>()
                    monthlyRecords.forEach((r) => {
                      const d = new Date(r.date).getDate()
                      if (!dayRecords.has(d)) dayRecords.set(d, [])
                      dayRecords.get(d)!.push(r)
                    })
                    let day = 1
                    for (let row = 0; row < Math.ceil((daysInMonth + firstDay) / 7); row++) {
                      const cells: React.ReactNode[] = []
                      for (let col = 0; col < 7; col++) {
                        if ((row === 0 && col < firstDay) || day > daysInMonth) {
                          cells.push(<div key={`${row}-${col}`} className="aspect-square p-1" />)
                        } else {
                          const records = dayRecords.get(day) ?? []
                          const statuses = Array.from(new Set(records.map((r) => r.status)))
                          const dotColor: Record<string, string> = {
                            HADIR: "bg-green-500", IZIN: "bg-blue-500", SAKIT: "bg-purple-500", CUTI: "bg-yellow-500", ALPHA: "bg-red-500",
                          }
                          cells.push(
                            <div key={day} className="aspect-square rounded-lg border p-1 text-xs hover:bg-muted/50 transition-colors">
                              <div className="font-medium text-center">{day}</div>
                              <div className="flex justify-center gap-0.5 mt-0.5 flex-wrap">
                                {statuses.map((s) => (
                                  <div key={s} className={`h-1.5 w-1.5 rounded-full ${dotColor[s] ?? "bg-gray-300"}`} title={statusLabel[s] ?? s} />
                                ))}
                              </div>
                              {records.length > 0 && (
                                <div className="text-[9px] text-center text-muted-foreground mt-0.5">{records.length}</div>
                              )}
                            </div>
                          )
                          day++
                        }
                      }
                      weeks.push(<div key={row} className="grid grid-cols-7 gap-1">{cells}</div>)
                    }
                    return weeks
                  })()}
                  <div className="flex items-center gap-4 pt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-green-500" /> Hadir</span>
                    <span className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-blue-500" /> Izin</span>
                    <span className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-purple-500" /> Sakit</span>
                    <span className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-yellow-500" /> Cuti</span>
                    <span className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-red-500" /> Alpha</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overtime" className="space-y-4">
          {(() => {
            const overtimeRecords = monthlyRecords.filter((r) => (r.overtimeHours ?? 0) > 0)
            const totalOvertime = overtimeRecords.reduce((s, r) => s + (r.overtimeHours ?? 0), 0)
            return (
              <>
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Jam Lembur Bulan Ini</CardTitle></CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600">{totalOvertime.toFixed(1)} <span className="text-base font-normal text-muted-foreground">jam</span></div>
                    <p className="text-xs text-muted-foreground mt-1">{overtimeRecords.length} karyawan tercatat lembur</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle>Daftar Lembur</CardTitle></CardHeader>
                  <CardContent>
                    {overtimeRecords.length === 0 ? (
                      <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">Tidak ada data lembur bulan ini</div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nama</TableHead>
                            <TableHead>NIK</TableHead>
                            <TableHead>Tanggal</TableHead>
                            <TableHead>Check In</TableHead>
                            <TableHead>Check Out</TableHead>
                            <TableHead>Jam Lembur</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {overtimeRecords.map((r) => (
                            <TableRow key={r.id}>
                              <TableCell className="font-medium">{r.employee.name}</TableCell>
                              <TableCell>{r.employee.nik}</TableCell>
                              <TableCell>{new Date(r.date).toLocaleDateString("id-ID")}</TableCell>
                              <TableCell>{r.checkIn ? new Date(r.checkIn).toLocaleTimeString("id-ID") : "-"}</TableCell>
                              <TableCell>{r.checkOut ? new Date(r.checkOut).toLocaleTimeString("id-ID") : "-"}</TableCell>
                              <TableCell className="font-medium">{r.overtimeHours} jam</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </>
            )
          })()}
        </TabsContent>
      </Tabs>
    </div>
  )
}