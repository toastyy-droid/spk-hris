"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { api } from "@/lib/api"
import { generateExcel, downloadExcel, excelFilename } from "@/lib/excel"
import Link from "next/link"
import { toast } from "sonner"
import { Plus, Download, Search, Loader2, AlertCircle, RefreshCw, Eye } from "lucide-react"

const statusMap: Record<string, string> = {
  ACTIVE: "Aktif",
  PROBATION: "Probation",
  RESIGNED: "Resign",
  TERMINATED: "Diberhentikan",
}

const badgeVariant: Record<string, "success" | "warning" | "destructive" | "secondary"> = {
  ACTIVE: "success",
  PROBATION: "warning",
  RESIGNED: "destructive",
  TERMINATED: "destructive",
}

interface Employee {
  id: number
  nik: string
  name: string
  email: string
  phone: string | null
  status: string
  joinDate: string
  position: { id: number; name: string }
  department: { id: number; name: string }
}

interface EmployeeDetail extends Employee {
  birthDate: string | null
  gender: string | null
  address: string | null
  religion: string | null
  education: string | null
  maritalStatus: string | null
  contractType: string | null
  contractEnd: string | null
  emergencyName: string | null
  emergencyPhone: string | null
  emergencyRelation: string | null
  user: { id: number; username: string; role: string } | null
}

interface Department {
  id: number
  name: string
}

interface Position {
  id: number
  name: string
  departmentId?: number
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [detail, setDetail] = useState<EmployeeDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [departments, setDepartments] = useState<Department[]>([])
  const [positions, setPositions] = useState<Position[]>([])
  const [saving, setSaving] = useState(false)

  const [structureDepts, setStructureDepts] = useState<Department[]>([])
  const [structurePositions, setStructurePositions] = useState<Position[]>([])
  const [deptEmpCount, setDeptEmpCount] = useState<Record<number, number>>({})
  const [structureLoading, setStructureLoading] = useState(false)
  const [contractEmployees, setContractEmployees] = useState<EmployeeDetail[]>([])
  const [contractLoading, setContractLoading] = useState(false)
  const [expandedDept, setExpandedDept] = useState<number | null>(null)

  const [form, setForm] = useState({
    nik: "", name: "", email: "", phone: "", departmentId: "", positionId: "",
    gender: "", religion: "", education: "", birthDate: "", joinDate: "",
  })

  const fetchEmployees = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const params = new URLSearchParams()
      if (search) params.set("search", search)
      if (statusFilter) params.set("status", statusFilter)
      const qs = params.toString()
      const data = await api.get<Employee[]>(`/employees${qs ? `?${qs}` : ""}`)
      setEmployees(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat data")
    } finally {
      setLoading(false)
    }
  }, [search, statusFilter])

  const [tab, setTab] = useState("all")
  useEffect(() => { fetchEmployees() }, [fetchEmployees])
  useEffect(() => {
    if (tab === "structure") loadStructure()
    if (tab === "contract") loadContractData()
  }, [tab])

  async function openDetail(id: number) {
    setSelectedId(id)
    setDetailLoading(true)
    setDetail(null)
    try {
      const data = await api.get<EmployeeDetail>(`/employees/${id}`)
      setDetail(data)
    } catch {
      setDetail(null)
    } finally {
      setDetailLoading(false)
    }
  }

  async function openCreate() {
    setShowCreate(true)
    setForm({ nik: "", name: "", email: "", phone: "", departmentId: "", positionId: "", gender: "", religion: "", education: "", birthDate: "", joinDate: "" })
    const [depts, pos] = await Promise.all([
      api.get<Department[]>("/departments").catch(() => [] as Department[]),
      api.get<Position[]>("/positions").catch(() => [] as Position[]),
    ])
    setDepartments(depts)
    setPositions(pos)
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await api.post("/employees", {
        nik: form.nik,
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        gender: form.gender || undefined,
        religion: form.religion || undefined,
        education: form.education || undefined,
        birthDate: form.birthDate || undefined,
        joinDate: form.joinDate || undefined,
        departmentId: Number(form.departmentId),
        positionId: Number(form.positionId),
      })
      setShowCreate(false)
      fetchEmployees()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menyimpan")
    } finally {
      setSaving(false)
    }
  }

  async function loadStructure() {
    setStructureLoading(true)
    try {
      const [depts, pos, emps] = await Promise.all([
        api.get<Department[]>("/departments"),
        api.get<Position[]>("/positions"),
        api.get<Employee[]>("/employees"),
      ])
      setStructureDepts(depts)
      setStructurePositions(pos)
      const count: Record<number, number> = {}
      emps.forEach((e) => { if (e.department?.id) count[e.department.id] = (count[e.department.id] ?? 0) + 1 })
      setDeptEmpCount(count)
    } catch { } finally { setStructureLoading(false) }
  }

  async function loadContractData() {
    setContractLoading(true)
    try {
      const list = await api.get<Employee[]>("/employees")
      const details = await Promise.allSettled(list.map((e) => api.get<EmployeeDetail>(`/employees/${e.id}`)))
      const withContracts: EmployeeDetail[] = []
      details.forEach((r) => {
        if (r.status === "fulfilled" && r.value.contractEnd) withContracts.push(r.value)
      })
      setContractEmployees(withContracts)
    } catch { } finally { setContractLoading(false) }
  }

  async function exportExcel() {
    const cols = [
      { header: "NIK", value: (e: Employee) => e.nik, width: 16 },
      { header: "Nama", value: (e: Employee) => e.name, width: 22 },
      { header: "Email", value: (e: Employee) => e.email, width: 28 },
      { header: "Telepon", value: (e: Employee) => e.phone ?? "", width: 16 },
      { header: "Departemen", value: (e: Employee) => e.department?.name ?? "", width: 20 },
      { header: "Jabatan", value: (e: Employee) => e.position?.name ?? "", width: 20 },
      { header: "Status", value: (e: Employee) => statusMap[e.status] ?? e.status, width: 14 },
      { header: "Tanggal Masuk", value: (e: Employee) => e.joinDate ? new Date(e.joinDate).toLocaleDateString("id-ID") : "", width: 16 },
    ]
    const blob = await generateExcel(employees, cols, "Data Karyawan")
    downloadExcel(blob, excelFilename("karyawan"))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Data Karyawan</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={exportExcel} disabled={employees.length === 0}>
            <Download className="h-4 w-4 mr-1" /> Export Excel
          </Button>
          <Button size="sm" onClick={openCreate}><Plus className="h-4 w-4 mr-1" /> Tambah Karyawan</Button>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="all">Semua Karyawan</TabsTrigger>
          <TabsTrigger value="structure">Struktur Organisasi</TabsTrigger>
          <TabsTrigger value="contract">Kontrak</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Cari karyawan..." className="pl-8 max-w-sm" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v === "all" ? "" : v)}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Semua Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="ACTIVE">Aktif</SelectItem>
                    <SelectItem value="PROBATION">Probation</SelectItem>
                    <SelectItem value="RESIGNED">Resign</SelectItem>
                    <SelectItem value="TERMINATED">Diberhentikan</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" onClick={fetchEmployees}><RefreshCw className="h-4 w-4" /></Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <AlertCircle className="h-8 w-8 text-destructive mb-2" />
                  <p className="text-sm text-destructive mb-3">{error}</p>
                  <Button variant="outline" size="sm" onClick={fetchEmployees}><RefreshCw className="h-4 w-4 mr-1" /> Coba Lagi</Button>
                </div>
              ) : employees.length === 0 ? (
                <div className="flex items-center justify-center py-12 text-center">
                  <p className="text-sm text-muted-foreground">Tidak ada data karyawan</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>NIK</TableHead>
                      <TableHead>Nama</TableHead>
                      <TableHead>Jabatan</TableHead>
                      <TableHead>Departemen</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Telepon</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees.map((emp) => (
                      <TableRow key={emp.id}>
                        <TableCell className="font-medium">{emp.nik}</TableCell>
                        <TableCell>{emp.name}</TableCell>
                        <TableCell>{emp.position?.name}</TableCell>
                        <TableCell>{emp.department?.name}</TableCell>
                        <TableCell>
                          <Badge variant={badgeVariant[emp.status] ?? "secondary"}>{statusMap[emp.status] ?? emp.status}</Badge>
                        </TableCell>
                        <TableCell>{emp.phone ?? "-"}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" onClick={() => openDetail(emp.id)}>
                              <Eye className="h-4 w-4 mr-1" /> Detail
                            </Button>
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/employees/${emp.id}`}>
                                <Eye className="h-4 w-4 mr-1" /> Lihat Detail
                              </Link>
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

        <TabsContent value="structure">
          <Card>
            <CardHeader><CardTitle>Struktur Organisasi</CardTitle></CardHeader>
            <CardContent>
              {structureLoading ? (
                <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
              ) : structureDepts.length === 0 ? (
                <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">Tidak ada data departemen</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Departemen</TableHead>
                      <TableHead>Jumlah Karyawan</TableHead>
                      <TableHead>Jabatan</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {structureDepts.flatMap((d) => {
                      const rows: React.ReactNode[] = [
                        <TableRow key={d.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setExpandedDept(expandedDept === d.id ? null : d.id)}>
                          <TableCell className="font-medium">{d.name}</TableCell>
                          <TableCell>{deptEmpCount[d.id] ?? 0} orang</TableCell>
                          <TableCell>{structurePositions.filter((p) => p.departmentId === d.id).length} jabatan</TableCell>
                          <TableCell className="text-muted-foreground text-xs">{expandedDept === d.id ? "▲" : "▼"}</TableCell>
                        </TableRow>
                      ]
                      if (expandedDept === d.id) {
                        const posList = structurePositions.filter((p) => p.departmentId === d.id)
                        if (posList.length === 0) {
                          rows.push(
                            <TableRow key={`${d.id}-empty`}>
                              <TableCell colSpan={4} className="bg-muted/30 pl-10 text-xs text-muted-foreground py-2">Belum ada jabatan</TableCell>
                            </TableRow>
                          )
                        } else {
                          posList.forEach((p) => {
                            rows.push(
                              <TableRow key={`${d.id}-${p.id}`}>
                                <TableCell colSpan={4} className="bg-muted/30 pl-10 text-sm py-1.5">
                                  <div className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-primary" />{p.name}</div>
                                </TableCell>
                              </TableRow>
                            )
                          })
                        }
                      }
                      return rows
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="contract">
          <Card>
            <CardHeader><CardTitle>Manajemen Kontrak</CardTitle></CardHeader>
            <CardContent>
              {contractLoading ? (
                <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
              ) : contractEmployees.length === 0 ? (
                <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">Tidak ada karyawan dengan kontrak aktif</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>NIK</TableHead>
                      <TableHead>Jabatan</TableHead>
                      <TableHead>Tipe Kontrak</TableHead>
                      <TableHead>Tanggal Mulai</TableHead>
                      <TableHead>Tanggal Berakhir</TableHead>
                      <TableHead>Sisa Hari</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contractEmployees.map((e) => {
                      const end = new Date(e.contractEnd!)
                      const today = new Date()
                      const diff = Math.ceil((end.getTime() - today.getTime()) / (86400000))
                      const sisaLabel = diff < 0 ? 0 : diff
                      const statusBadge: "destructive" | "warning" | "success" = diff < 0 ? "destructive" : diff < 30 ? "warning" : "success"
                      const statusLabel = diff < 0 ? "Expired" : diff < 30 ? "Segera Habis" : "Aktif"
                      return (
                        <TableRow key={e.id}>
                          <TableCell className="font-medium">{e.name}</TableCell>
                          <TableCell>{e.nik}</TableCell>
                          <TableCell>{e.position?.name}</TableCell>
                          <TableCell>{e.contractType ?? "-"}</TableCell>
                          <TableCell>{e.joinDate ? new Date(e.joinDate).toLocaleDateString("id-ID") : "-"}</TableCell>
                          <TableCell>{new Date(e.contractEnd!).toLocaleDateString("id-ID")}</TableCell>
                          <TableCell className={diff < 0 ? "text-destructive font-bold" : diff < 30 ? "text-yellow-600 font-bold" : ""}>{sisaLabel} hari</TableCell>
                          <TableCell><Badge variant={statusBadge}>{statusLabel}</Badge></TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Detail Dialog */}
      <Dialog open={selectedId !== null} onOpenChange={(open) => { if (!open) setSelectedId(null) }}>
        <DialogContent className="max-w-2xl">
          {detailLoading ? (
            <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          ) : detail ? (
            <>
              <DialogHeader>
                <DialogTitle>{detail.name}</DialogTitle>
                <DialogDescription>NIK: {detail.nik}</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><Label className="text-muted-foreground">Email</Label><p>{detail.email}</p></div>
                <div><Label className="text-muted-foreground">Telepon</Label><p>{detail.phone ?? "-"}</p></div>
                <div><Label className="text-muted-foreground">Jabatan</Label><p>{detail.position?.name}</p></div>
                <div><Label className="text-muted-foreground">Departemen</Label><p>{detail.department?.name}</p></div>
                <div><Label className="text-muted-foreground">Status</Label><Badge variant={badgeVariant[detail.status] ?? "secondary"}>{statusMap[detail.status] ?? detail.status}</Badge></div>
                <div><Label className="text-muted-foreground">Jenis Kelamin</Label><p>{detail.gender ?? "-"}</p></div>
                <div><Label className="text-muted-foreground">Agama</Label><p>{detail.religion ?? "-"}</p></div>
                <div><Label className="text-muted-foreground">Pendidikan</Label><p>{detail.education ?? "-"}</p></div>
                <div><Label className="text-muted-foreground">Status Pernikahan</Label><p>{detail.maritalStatus ?? "-"}</p></div>
                <div><Label className="text-muted-foreground">Tanggal Masuk</Label><p>{detail.joinDate ? new Date(detail.joinDate).toLocaleDateString("id-ID") : "-"}</p></div>
                <div><Label className="text-muted-foreground">Tipe Kontrak</Label><p>{detail.contractType ?? "-"}</p></div>
                <div><Label className="text-muted-foreground">Akhir Kontrak</Label><p>{detail.contractEnd ? new Date(detail.contractEnd).toLocaleDateString("id-ID") : "-"}</p></div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="h-8 w-8 text-destructive mb-2" />
              <p className="text-sm text-destructive">Gagal memuat detail karyawan</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Tambah Karyawan</DialogTitle>
            <DialogDescription>Isi data karyawan baru</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nik">NIK *</Label>
                <Input id="nik" value={form.nik} onChange={(e) => setForm({ ...form, nik: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Nama *</Label>
                <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
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
                <Label>Departemen *</Label>
                <Select value={form.departmentId} onValueChange={(v) => setForm({ ...form, departmentId: v })} required>
                  <SelectTrigger><SelectValue placeholder="Pilih departemen" /></SelectTrigger>
                  <SelectContent>
                    {departments.map((d) => <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Jabatan *</Label>
                <Select value={form.positionId} onValueChange={(v) => setForm({ ...form, positionId: v })} required>
                  <SelectTrigger><SelectValue placeholder="Pilih jabatan" /></SelectTrigger>
                  <SelectContent>
                    {positions.map((p) => <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Jenis Kelamin</Label>
                <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v })}>
                  <SelectTrigger><SelectValue placeholder="-" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                    <SelectItem value="Perempuan">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="religion">Agama</Label>
                <Input id="religion" value={form.religion} onChange={(e) => setForm({ ...form, religion: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="education">Pendidikan</Label>
                <Input id="education" value={form.education} onChange={(e) => setForm({ ...form, education: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthDate">Tanggal Lahir</Label>
                <Input id="birthDate" type="date" value={form.birthDate} onChange={(e) => setForm({ ...form, birthDate: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="joinDate">Tanggal Masuk</Label>
                <Input id="joinDate" type="date" value={form.joinDate} onChange={(e) => setForm({ ...form, joinDate: e.target.value })} />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>Batal</Button>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Simpan
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
