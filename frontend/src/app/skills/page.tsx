"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { api } from "@/lib/api"
import { Plus, Loader2, AlertCircle, RefreshCw, BookOpen, UserCheck } from "lucide-react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
interface Skill {
  id: number
  name: string
  category: string | null
  description: string | null
}

interface Employee {
  id: number
  name: string
}

const categoryOptions = ["Teknis", "Non-Teknis", "Sertifikasi", "Bahasa"]

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showCreate, setShowCreate] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: "", category: "", description: "" })
  const [assignForm, setAssignForm] = useState({ employeeId: "", skillId: "" })
  const [assignLoading, setAssignLoading] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const data = await api.get<Skill[]>("/skills")
      setSkills(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat data")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  async function openCreate() {
    setShowCreate(true)
    setForm({ name: "", category: "", description: "" })
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await api.post("/skills", {
        name: form.name,
        category: form.category || undefined,
        description: form.description || undefined,
      })
      setShowCreate(false)
      fetchData()
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menyimpan")
    } finally {
      setSaving(false)
    }
  }

  async function openAssign() {
    setAssignForm({ employeeId: "", skillId: "" })
    const [empData] = await Promise.all([
      api.get<Employee[]>("/employees").catch(() => [] as Employee[]),
    ])
    setEmployees(empData)
  }

  async function handleAssign(e: React.FormEvent) {
    e.preventDefault()
    setAssignLoading(true)
    try {
      await api.post("/skills/assign", {
        employeeId: Number(assignForm.employeeId),
        skillId: Number(assignForm.skillId),
      })
      setAssignForm({ employeeId: "", skillId: "" })
      alert("Skill berhasil ditugaskan")
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menugaskan skill")
    } finally {
      setAssignLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Skills & Kompetensi</h1>
          <p className="text-muted-foreground">Kelola daftar skill dan penugasan ke karyawan</p>
        </div>
        <Button size="sm" onClick={openCreate}>
          <Plus className="h-4 w-4 mr-1" /> Tambah Skill
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Daftar Skill</CardTitle>
            <Button variant="outline" size="icon" onClick={fetchData}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="h-8 w-8 text-destructive mb-2" />
              <p className="text-sm text-destructive mb-3">{error}</p>
              <Button variant="outline" size="sm" onClick={fetchData}>
                <RefreshCw className="h-4 w-4 mr-1" /> Coba Lagi
              </Button>
            </div>
          ) : skills.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <BookOpen className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Belum ada skill</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Skill</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Deskripsi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {skills.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell>{s.category ?? "-"}</TableCell>
                    <TableCell className="max-w-xs truncate">{s.description ?? "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Assign Skill ke Karyawan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAssign} className="flex items-end gap-4">
            <div className="space-y-2 flex-1">
              <Label>Karyawan</Label>
              <Select value={assignForm.employeeId} onValueChange={(v) => setAssignForm({ ...assignForm, employeeId: v })} required>
                <SelectTrigger><SelectValue placeholder="Pilih karyawan" /></SelectTrigger>
                <SelectContent>
                  {(employees.length > 0 ? employees : []).map((e) => (
                    <SelectItem key={e.id} value={String(e.id)}>{e.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 flex-1">
              <Label>Skill</Label>
              <Select value={assignForm.skillId} onValueChange={(v) => setAssignForm({ ...assignForm, skillId: v })} required>
                <SelectTrigger><SelectValue placeholder="Pilih skill" /></SelectTrigger>
                <SelectContent>
                  {skills.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="pb-0.5">
              <Button type="button" variant="outline" size="sm" onClick={openAssign} className="mr-2">
                Muat Data
              </Button>
              <Button type="submit" disabled={assignLoading || !assignForm.employeeId || !assignForm.skillId}>
                {assignLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Assign
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Tambah Skill</DialogTitle>
            <DialogDescription>Buat skill baru</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama *</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Kategori</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue placeholder="Pilih kategori" /></SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Input id="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
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
