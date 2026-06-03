"use client"

import { FormEvent, useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"
import { api } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"
import { useNotifications } from "@/contexts/notification-context"
import { canAccess, ROLES } from "@/lib/permissions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Supplier {
  id: number
  name: string
  category: string
  productBrand?: string | null
  contactPerson?: string | null
  phone?: string | null
  address?: string | null
  priceScore: number | string
  qualityScore: number | string
  deliveryScore: number | string
  serviceScore: number | string
  capacityScore: number | string
  shippingCoverage: "SUPPLIER_COVERS" | "BUYER_COVERS"
  totalScore?: number | string | null
  status: string
  notes?: string | null
}

interface SupplierForm {
  name: string
  category: string
  productBrand: string
  contactPerson: string
  phone: string
  address: string
  priceScore: string
  qualityScore: string
  deliveryScore: string
  serviceScore: string
  capacityScore: string
  shippingCoverage: "SUPPLIER_COVERS" | "BUYER_COVERS"
  status: string
  notes: string
}

const emptyForm: SupplierForm = {
  name: "",
  category: "",
  productBrand: "",
  contactPerson: "",
  phone: "",
  address: "",
  priceScore: "8",
  qualityScore: "8",
  deliveryScore: "8",
  serviceScore: "8",
  capacityScore: "8",
  shippingCoverage: "BUYER_COVERS",
  status: "ACTIVE",
  notes: "",
}

function shippingCoverageLabel(value: Supplier["shippingCoverage"]) {
  return value === "SUPPLIER_COVERS" ? "Supplier" : "Pembeli"
}

const scoreFields: Array<{ key: keyof SupplierForm; label: string; helper: string }> = [
  { key: "priceScore", label: "Harga", helper: "Harga kompetitif" },
  { key: "qualityScore", label: "Kualitas", helper: "Mutu barang" },
  { key: "deliveryScore", label: "Pengiriman", helper: "Tepat waktu" },
  { key: "serviceScore", label: "Layanan", helper: "Respons cepat" },
  { key: "capacityScore", label: "Kapasitas", helper: "Stok tersedia" },
]

function formatScore(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === "") return "-"
  return Number(value).toFixed(2).replace(/\.00$/, "")
}

function supplierToForm(supplier: Supplier): SupplierForm {
  return {
    name: supplier.name,
    category: supplier.category,
    productBrand: supplier.productBrand ?? "",
    contactPerson: supplier.contactPerson ?? "",
    phone: supplier.phone ?? "",
    address: supplier.address ?? "",
    priceScore: String(supplier.priceScore),
    qualityScore: String(supplier.qualityScore),
    deliveryScore: String(supplier.deliveryScore),
    serviceScore: String(supplier.serviceScore),
    capacityScore: String(supplier.capacityScore),
    shippingCoverage: supplier.shippingCoverage ?? "BUYER_COVERS",
    status: supplier.status,
    notes: supplier.notes ?? "",
  }
}

function formPayload(form: SupplierForm) {
  return {
    ...form,
    productBrand: "",
    priceScore: Number(form.priceScore),
    qualityScore: Number(form.qualityScore),
    deliveryScore: Number(form.deliveryScore),
    serviceScore: Number(form.serviceScore),
    capacityScore: Number(form.capacityScore),
  }
}

export default function SuppliersPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { pushNotification } = useNotifications()
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [form, setForm] = useState<SupplierForm>(emptyForm)
  const [editing, setEditing] = useState<Supplier | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [actionId, setActionId] = useState<number | null>(null)
  const [error, setError] = useState("")

  const canManage = !!user && canAccess(user.role, [ROLES.SUPER_ADMIN, ROLES.ADMIN_HR])

  useEffect(() => {
    if (!authLoading && user && !canAccess(user.role, [ROLES.SUPER_ADMIN, ROLES.ADMIN_HR, ROLES.MANAGER])) {
      router.push("/")
    }
  }, [user, authLoading, router])

  const loadSuppliers = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const data = await api.get<Supplier[]>("/spk/suppliers")
      setSuppliers(data)
    } catch {
      setError("Gagal memuat data supplier.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadSuppliers()
  }, [loadSuppliers])

  function openCreateDialog() {
    setEditing(null)
    setForm(emptyForm)
    setDialogOpen(true)
    setError("")
  }

  function openEditDialog(supplier: Supplier) {
    setEditing(supplier)
    setForm(supplierToForm(supplier))
    setDialogOpen(true)
    setError("")
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError("")
    try {
      if (editing) {
        await api.patch<Supplier>(`/spk/suppliers/${editing.id}`, formPayload(form))
        pushNotification("Supplier", "Data supplier berhasil diperbarui")
      } else {
        await api.post<Supplier>("/spk/suppliers", formPayload(form))
        pushNotification("Supplier", "Supplier baru berhasil ditambahkan")
      }
      setDialogOpen(false)
      await loadSuppliers()
    } catch {
      setError("Gagal menyimpan supplier. Periksa skor 1-10 dan lengkapi nama/kategori.")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: number) {
    setActionId(id)
    setError("")
    try {
      await api.delete(`/spk/suppliers/${id}`)
      setSuppliers((prev) => prev.filter((supplier) => supplier.id !== id))
      pushNotification("Supplier", "Supplier berhasil dihapus")
    } catch {
      setError("Gagal menghapus supplier")
    } finally {
      setActionId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Data Supplier</h1>
        {canManage && (
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" /> Tambah Supplier
          </Button>
        )}
      </div>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      <Card>
        <CardHeader><CardTitle>Daftar Supplier</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-12 text-center text-sm text-muted-foreground">Memuat data supplier...</div>
          ) : suppliers.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">Belum ada supplier.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Jenis Aksesoris HP</TableHead>
                  <TableHead>Kontak</TableHead>
                  <TableHead>Harga</TableHead>
                  <TableHead>Kualitas</TableHead>
                  <TableHead>Pengiriman</TableHead>
                  <TableHead>Ongkir</TableHead>
                  <TableHead>Skor</TableHead>
                  <TableHead>Status</TableHead>
                  {canManage && <TableHead></TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {suppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell className="font-medium">{supplier.name}</TableCell>
                    <TableCell>{supplier.category}</TableCell>
                    <TableCell>{supplier.contactPerson || supplier.phone || "-"}</TableCell>
                    <TableCell>{formatScore(supplier.priceScore)}</TableCell>
                    <TableCell>{formatScore(supplier.qualityScore)}</TableCell>
                    <TableCell>{formatScore(supplier.deliveryScore)}</TableCell>
                    <TableCell>
                      <Badge variant={supplier.shippingCoverage === "SUPPLIER_COVERS" ? "success" : "outline"}>
                        {shippingCoverageLabel(supplier.shippingCoverage)}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold">{formatScore(supplier.totalScore)}</TableCell>
                    <TableCell><Badge variant={supplier.status === "ACTIVE" ? "success" : "secondary"}>{supplier.status === "ACTIVE" ? "Aktif" : "Nonaktif"}</Badge></TableCell>
                    {canManage && (
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" onClick={() => openEditDialog(supplier)}>Edit</Button>
                          <Button size="sm" variant="destructive" disabled={actionId === supplier.id} onClick={() => handleDelete(supplier.id)}>Hapus</Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{editing ? "Edit Supplier" : "Tambah Supplier"}</DialogTitle></DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Supplier</Label>
                <Input id="name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Jenis Aksesoris HP</Label>
                <Input id="category" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} placeholder="Contoh: Charger, Kabel Data, Earphone" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPerson">PIC</Label>
                <Input id="contactPerson" value={form.contactPerson} onChange={(event) => setForm({ ...form, contactPerson: event.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telepon</Label>
                <Input id="phone" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
              </div>
            </div>
              <div className="space-y-2">
                <Label htmlFor="address">Alamat</Label>
                <Input id="address" value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shippingCoverage">Ongkir Ditanggung</Label>
                <Select value={form.shippingCoverage} onValueChange={(value: SupplierForm["shippingCoverage"]) => setForm({ ...form, shippingCoverage: value })}>
                  <SelectTrigger id="shippingCoverage"><SelectValue placeholder="Pilih penanggung ongkir" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BUYER_COVERS">Pembeli / Kita</SelectItem>
                    <SelectItem value="SUPPLIER_COVERS">Supplier (+0.05 poin SAW)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Jika ongkir ditanggung supplier, skor SAW mendapat tambahan 0.05.</p>
              </div>
            <div className="grid gap-4 md:grid-cols-5">
              {scoreFields.map((field) => (
                <div className="space-y-2" key={field.key}>
                  <Label htmlFor={field.key}>{field.label}</Label>
                  <Input id={field.key} type="number" min="1" max="10" step="0.1" value={form[field.key]} onChange={(event) => setForm({ ...form, [field.key]: event.target.value })} required />
                  <p className="text-[11px] text-muted-foreground">{field.helper}</p>
                </div>
              ))}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Input id="status" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value.toUpperCase() })} placeholder="ACTIVE" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Catatan</Label>
                <Input id="notes" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
              <Button type="submit" disabled={saving}>{saving ? "Menyimpan..." : "Simpan"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
