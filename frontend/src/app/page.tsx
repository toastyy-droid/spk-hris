"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import {
  Users, Clock, DollarSign, TrendingUp, AlertTriangle, ArrowUpRight, ArrowDownRight,
} from "lucide-react"

const now = new Date()
const currentMonth = now.getMonth() + 1
const currentYear = now.getFullYear()

function formatRp(value: number): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value)
}

function getMonthName(m: number) {
  const names = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"]
  return names[m - 1] ?? ""
}

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-muted ${className ?? ""}`} />
}

export default function Dashboard() {
  const [employeeStats, setEmployeeStats] = useState<{ total: number; active: number; byDept: { name: string; _count: { employees: number } }[]; byStatus: { status: string; _count: number }[]; contractExpiring: { id: number; name: string; nik: string; contractEnd: string }[] } | null>(null)
  const [attendanceToday, setAttendanceToday] = useState<{ total: number; hadir: number; izin: number; sakit: number; cuti: number; alpha: number } | null>(null)
  const [payrollSummary, setPayrollSummary] = useState<{ count: number; totalGross: number; totalNet: number; byDepartment: Record<string, number> } | null>(null)
  const [earlyWarnings, setEarlyWarnings] = useState<{ decliningPerformance: unknown[]; contractExpiring: unknown[]; noRaiseLongTerm: unknown[]; highAbsence: unknown[] } | null>(null)

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
    fetchOne(setPayrollSummary, `/payroll/summary?month=${currentMonth}&year=${currentYear}`)
    fetchOne(setEarlyWarnings, "/spk/early-warnings")
    return () => { alive = false }
  }, [])

  const totalKaryawan = employeeStats?.total ?? 0
  const hadirHariIni = attendanceToday?.hadir ?? 0
  const hadirPersen = attendanceToday && attendanceToday.total > 0
    ? ((attendanceToday.hadir / attendanceToday.total) * 100).toFixed(1)
    : "0"
  const cutiHariIni = attendanceToday?.cuti ?? 0
  const bebanGaji = payrollSummary?.totalGross ?? 0

  const alerts: { label: string; count: string; variant: "warning" | "destructive" | "success" | "secondary" }[] = []
  if (employeeStats?.contractExpiring && employeeStats.contractExpiring.length > 0) {
    alerts.push({ label: "Kontrak habis < 60 hari", count: String(employeeStats.contractExpiring.length), variant: "warning" })
  }
  if (earlyWarnings?.decliningPerformance && earlyWarnings.decliningPerformance.length > 0) {
    alerts.push({ label: "Kinerja turun 3 bulan", count: String(earlyWarnings.decliningPerformance.length), variant: "destructive" })
  }
  if (earlyWarnings?.highAbsence && earlyWarnings.highAbsence.length > 0) {
    alerts.push({ label: "Absensi anomaly", count: String(earlyWarnings.highAbsence.length), variant: "warning" })
  }
  if (earlyWarnings?.noRaiseLongTerm && earlyWarnings.noRaiseLongTerm.length > 0) {
    alerts.push({ label: "Belum naik gaji > 2 thn", count: String(earlyWarnings.noRaiseLongTerm.length), variant: "secondary" })
  }
  if (alerts.length === 0) {
    alerts.push({ label: "Tidak ada alert", count: "0", variant: "success" })
  }

  const promoCount = earlyWarnings?.decliningPerformance
    ? Math.max(0, (employeeStats?.active ?? 0) - earlyWarnings.decliningPerformance.length)
    : null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview HRIS CV Anugerah Mega Makmur</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Karyawan</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employeeStats ? totalKaryawan : <Skeleton className="h-8 w-16" />}</div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <ArrowUpRight className="h-3 w-3" />
              {employeeStats ? `${employeeStats.active} aktif` : <Skeleton className="h-3 w-12" />}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Hadir Hari Ini</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceToday ? hadirHariIni : <Skeleton className="h-8 w-16" />}</div>
            <div className={`flex items-center gap-1 text-xs ${Number(hadirPersen) >= 80 ? "text-green-600" : "text-red-600"}`}>
              <ArrowUpRight className="h-3 w-3" />
              {attendanceToday ? `${hadirPersen}% kehadiran` : <Skeleton className="h-3 w-20" />}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cuti Hari Ini</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceToday ? cutiHariIni : <Skeleton className="h-8 w-16" />}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {attendanceToday ? `${attendanceToday.izin + attendanceToday.sakit} izin/sakit` : <Skeleton className="h-3 w-24" />}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Beban Gaji {getMonthName(currentMonth)}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payrollSummary ? (bebanGaji > 0 ? formatRp(bebanGaji) : "-") : <Skeleton className="h-8 w-24" />}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {payrollSummary ? `${payrollSummary.count} karyawan` : <Skeleton className="h-3 w-20" />}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Distribusi Karyawan per Departemen</CardTitle>
          </CardHeader>
          <CardContent>
            {employeeStats?.byDept && employeeStats.byDept.length > 0 ? (
              <div className="space-y-3">
                {employeeStats.byDept.map((d) => (
                  <div key={d.name} className="flex items-center gap-3">
                    <span className="w-28 text-sm font-medium truncate">{d.name}</span>
                    <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${(d._count.employees / totalKaryawan) * 100}%` }}
                      />
                    </div>
                    <span className="w-10 text-sm text-right text-muted-foreground">{d._count.employees}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed text-muted-foreground text-sm">
                {employeeStats === null ? "Memuat..." : "Belum ada data"}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Alert System</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map((a) => (
              <div key={a.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{a.label}</span>
                </div>
                <Badge variant={a.variant}>{a.count}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Status Karyawan</CardTitle>
          </CardHeader>
          <CardContent>
            {employeeStats?.byStatus && employeeStats.byStatus.length > 0 ? (
              <div className="space-y-3">
                {employeeStats.byStatus.map((s) => (
                  <div key={s.status} className="flex items-center justify-between text-sm">
                    <span>{s.status === "ACTIVE" ? "Aktif" : s.status === "PROBATION" ? "Probation" : s.status === "RESIGNED" ? "Resign" : s.status}</span>
                    <Badge variant={s.status === "ACTIVE" ? "success" : s.status === "PROBATION" ? "warning" : "destructive"}>
                      {s._count}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed text-muted-foreground text-sm">
                {employeeStats === null ? "Memuat..." : "Belum ada data"}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">SPK Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {employeeStats && promoCount !== null ? (
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span>{promoCount} karyawan layak promosi</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                <span>Jalankan SPK untuk melihat</span>
              </div>
            )}
            {employeeStats?.contractExpiring && employeeStats.contractExpiring.length > 0 ? (
              <div className="flex items-center gap-2 text-sm">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span>{employeeStats.contractExpiring.length} kontrak &lt; 60 hari</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertTriangle className="h-4 w-4" />
                <span>Tidak ada kontrak mendekati habis</span>
              </div>
            )}
            {earlyWarnings?.highAbsence && earlyWarnings.highAbsence.length > 0 ? (
              <div className="flex items-center gap-2 text-sm">
                <ArrowDownRight className="h-4 w-4 text-red-600" />
                <span>Anomali absensi: {earlyWarnings.highAbsence.length} karyawan</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ArrowDownRight className="h-4 w-4" />
                <span>Tidak ada anomali absensi</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start" variant="outline" size="sm" asChild>
              <a href="/attendance">+ Input Absen</a>
            </Button>
            <Button className="w-full justify-start" variant="outline" size="sm" asChild>
              <a href="/attendance">+ Review Cuti</a>
            </Button>
            <Button className="w-full justify-start" variant="outline" size="sm" asChild>
              <a href="/payroll">+ Buat Slip Gaji</a>
            </Button>
            <Button className="w-full justify-start" variant="outline" size="sm" asChild>
              <a href="/recruitment">+ Buka Lowongan</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}