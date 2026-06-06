"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AlertTriangle, Award, PackageCheck, RefreshCw, Star, Truck } from "lucide-react"
import { api } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"
import { useNotifications } from "@/contexts/notification-context"
import { canAccess, ROLES } from "@/lib/permissions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Supplier {
  id: number
  name: string
  category: string
  productBrand?: string | null
  totalScore?: number | string | null
  status: string
}

interface SupplierResult {
  supplierId: number
  resultId?: number
  rank: number
  name: string
  category: string
  productBrand?: string | null
  contactPerson?: string | null
  phone?: string | null
  priceScore: number
  qualityScore: number
  deliveryScore: number
  serviceScore: number
  capacityScore: number
  normalizedPrice: number
  normalizedQuality: number
  normalizedDelivery: number
  normalizedService: number
  normalizedCapacity: number
  shippingCoverage: "SUPPLIER_COVERS" | "BUYER_COVERS"
  bonus: number
  totalScore: number
  recommended: boolean
  status?: string
}

function shippingCoverageLabel(value: SupplierResult["shippingCoverage"]) {
  return value === "SUPPLIER_COVERS" ? "Supplier (+0.05)" : "Pembeli"
}

function toNumber(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === "") return 0
  return Number(value)
}

function formatScore(value: number | string | null | undefined, decimals = 4) {
  return toNumber(value).toFixed(decimals).replace(/\.?0+$/, "")
}

export default function SupplierEvaluationPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { pushNotification } = useNotifications()
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [allSuppliers, setAllSuppliers] = useState<Supplier[]>([])
  const [results, setResults] = useState<SupplierResult[]>([])
  const [loading, setLoading] = useState(true)
  const [running, setRunning] = useState(false)
  const [actionId, setActionId] = useState<number | null>(null)
  const [threshold, setThreshold] = useState("0.75")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [brandFilter, setBrandFilter] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const canManage = !!user && canAccess(user.role, [ROLES.SUPER_ADMIN, ROLES.ADMIN_HR])

  useEffect(() => {
    if (!authLoading && user && !canAccess(user.role, [ROLES.SUPER_ADMIN, ROLES.ADMIN_HR, ROLES.MANAGER])) {
      router.push("/")
    }
  }, [user, authLoading, router])

  const loadSuppliers = useCallback(async (category = "", brand = "", clearResults = true) => {
    setLoading(true)
    setError("")
    if (clearResults) {
      setResults([])
      setMessage("")
    }
    try {
      const params = new URLSearchParams()
      if (category.trim()) params.set("category", category.trim())
      if (brand.trim()) params.set("brand", brand.trim())
      const query = params.toString() ? `?${params.toString()}` : ""
      const data = await api.get<Supplier[]>(`/spk/suppliers${query}`)
      setSuppliers(data)
      if (!category.trim() && !brand.trim()) {
        setAllSuppliers(data)
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Gagal memuat data supplier.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadSuppliers()
  }, [loadSuppliers])

  async function runSelection() {
    const thresholdValue = Number(threshold)
    if (!Number.isFinite(thresholdValue) || thresholdValue < 0.1 || thresholdValue > 1) {
      setError("Threshold harus berupa angka 0.1 sampai 1.")
      setMessage("")
      return
    }

    setRunning(true)
    setError("")
    setMessage("")
    try {
      const data = await api.post<{ threshold: number; suppliers: SupplierResult[] }>("/spk/supplier-selection", {
        threshold: thresholdValue,
        category: categoryFilter.trim() || undefined,
        productBrand: brandFilter.trim() || undefined,
      })
      setResults(data.suppliers ?? [])
      const recommended = data.suppliers.filter((supplier) => supplier.recommended).length
      setMessage(`Perhitungan SAW selesai: ${data.suppliers.length} supplier dinilai, ${recommended} direkomendasikan.`)
      pushNotification("Evaluasi Supplier", `Perhitungan SAW selesai dengan threshold ${data.threshold}`)
      await loadSuppliers(categoryFilter, brandFilter, false)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Gagal menjalankan evaluasi supplier.")
    } finally {
      setRunning(false)
    }
  }

  async function updateResultStatus(resultId: number | undefined, status: "APPROVED" | "REJECTED") {
    if (!resultId) return
    setActionId(resultId)
    setError("")
    try {
      await api.patch(`/spk/results/${resultId}`, { status })
      setResults((prev) => prev.map((item) => (item.resultId === resultId ? { ...item, status } : item)))
      pushNotification("Evaluasi Supplier", status === "APPROVED" ? "Supplier disetujui" : "Rekomendasi supplier ditunda")
    } catch {
      setError("Gagal memperbarui status rekomendasi")
    } finally {
      setActionId(null)
    }
  }

  const activeSuppliers = suppliers.filter((supplier) => supplier.status === "ACTIVE").length
  const bestSupplier = results[0]
  const recommendedCount = results.filter((supplier) => supplier.recommended).length
  const categoryOptions = Array.from(new Set(allSuppliers.map((supplier) => supplier.category))).sort()
  const brandOptions = Array.from(new Set(allSuppliers.map((supplier) => supplier.productBrand).filter((brand): brand is string => !!brand))).sort()
  const averageScore = suppliers.length > 0
    ? suppliers.reduce((total, supplier) => total + toNumber(supplier.totalScore), 0) / suppliers.length
    : 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Evaluasi Supplier</h1>
        <Button asChild variant="outline">
          <Link href="/suppliers">Kelola Data Supplier</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Supplier</CardTitle>
            <PackageCheck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{suppliers.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-muted-foreground">Supplier Aktif</CardTitle>
            <Truck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-green-600">{activeSuppliers}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-muted-foreground">Direkomendasikan</CardTitle>
            <Award className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-yellow-600">{recommendedCount}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-muted-foreground">Rata-rata Skor</CardTitle>
            <Star className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-purple-600">{formatScore(averageScore)}</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Proses Evaluasi (Metode SAW)</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-[1fr_1fr_160px_auto_auto] md:items-end">
            <div className="space-y-2">
              <Label htmlFor="categoryFilter">Jenis Aksesoris HP</Label>
              <Select value={categoryFilter || "ALL"} onValueChange={(value) => setCategoryFilter(value === "ALL" ? "" : value)}>
                <SelectTrigger id="categoryFilter"><SelectValue placeholder="Pilih jenis aksesoris" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Semua Aksesoris HP</SelectItem>
                  {categoryOptions.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="brandFilter">Brand Produk</Label>
              <Select value={brandFilter || "ALL"} onValueChange={(value) => setBrandFilter(value === "ALL" ? "" : value)}>
                <SelectTrigger id="brandFilter"><SelectValue placeholder="Pilih brand produk" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Semua Brand</SelectItem>
                  {brandOptions.map((brand) => (
                    <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="threshold">Threshold (0-1)</Label>
              <Input id="threshold" type="number" min="0.1" max="1" step="0.05" value={threshold} onChange={(event) => setThreshold(event.target.value)} />
            </div>
            <Button variant="outline" onClick={() => loadSuppliers(categoryFilter, brandFilter)} disabled={loading}>
              <RefreshCw className="mr-2 h-4 w-4" /> Muat Data
            </Button>
            <Button onClick={runSelection} disabled={running || allSuppliers.length === 0}>
              {running ? "Memproses..." : "Jalankan Evaluasi"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Metode SAW (Simple Additive Weighting). Harga = kriteria Cost, sisanya = Benefit.
            Normalisasi: Cost = min/x, Benefit = x/max. Bobot: Harga 30%, Kualitas 30%, Pengiriman 20%, Layanan 10%, Kapasitas 10%.
            Bonus ongkir +0.05 jika supplier menanggung biaya kirim.
          </p>
          {!loading && suppliers.length === 0 && (
            <p className="text-sm text-muted-foreground">Tidak ada supplier aktif yang cocok dengan filter ini.</p>
          )}
          {message && <p className="text-sm text-green-600 dark:text-green-400">{message}</p>}
          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
          {bestSupplier && (
            <div className="rounded-lg border bg-muted/40 p-4 text-sm">
              Supplier terbaik saat ini adalah <span className="font-semibold">{bestSupplier.name}</span> dengan skor SAW <span className="font-semibold">{formatScore(bestSupplier.totalScore)}</span>.
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Ranking Hasil Evaluasi SAW</CardTitle></CardHeader>
        <CardContent>
          {results.length === 0 ? (
            <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
              <AlertTriangle className="h-4 w-4" /> Belum ada hasil. Jalankan evaluasi untuk membuat ranking supplier.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Jenis</TableHead>
                    <TableHead>Brand</TableHead>
                    <TableHead>Harga</TableHead>
                    <TableHead>Kualitas</TableHead>
                    <TableHead>Pengiriman</TableHead>
                    <TableHead>Layanan</TableHead>
                    <TableHead>Kapasitas</TableHead>
                    <TableHead>Bonus</TableHead>
                    <TableHead>Skor SAW</TableHead>
                    <TableHead>Rekomendasi</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((supplier) => (
                    <TableRow key={supplier.supplierId}>
                      <TableCell className="font-bold">{supplier.rank}</TableCell>
                      <TableCell>
                        <div className="font-medium">{supplier.name}</div>
                        <div className="text-xs text-muted-foreground">{supplier.contactPerson || supplier.phone || "-"}</div>
                      </TableCell>
                      <TableCell>{supplier.category}</TableCell>
                      <TableCell>{supplier.productBrand || "-"}</TableCell>
                      <TableCell>{formatScore(supplier.priceScore, 1)}</TableCell>
                      <TableCell>{formatScore(supplier.qualityScore, 1)}</TableCell>
                      <TableCell>{formatScore(supplier.deliveryScore, 1)}</TableCell>
                      <TableCell>{formatScore(supplier.serviceScore, 1)}</TableCell>
                      <TableCell>{formatScore(supplier.capacityScore, 1)}</TableCell>
                      <TableCell>
                        <Badge variant={supplier.shippingCoverage === "SUPPLIER_COVERS" ? "success" : "outline"}>
                          {shippingCoverageLabel(supplier.shippingCoverage)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-lg font-bold">{formatScore(supplier.totalScore)}</TableCell>
                      <TableCell>
                        <Badge variant={supplier.recommended ? "success" : "secondary"}>{supplier.recommended ? "Direkomendasikan" : "Tidak"}</Badge>
                      </TableCell>
                      <TableCell>
                        {supplier.status === "APPROVED" || supplier.status === "REJECTED" ? (
                          <Badge variant={supplier.status === "APPROVED" ? "success" : "warning"}>{supplier.status === "APPROVED" ? "Disetujui" : "Ditunda"}</Badge>
                        ) : canManage ? (
                          <div className="flex gap-2">
                            <Button size="sm" disabled={actionId === supplier.resultId} onClick={() => updateResultStatus(supplier.resultId, "APPROVED")}>Approve</Button>
                            <Button size="sm" variant="outline" disabled={actionId === supplier.resultId} onClick={() => updateResultStatus(supplier.resultId, "REJECTED")}>Tunda</Button>
                          </div>
                        ) : null}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
