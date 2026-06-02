"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Award, BarChart3, PackageCheck, Star, Truck } from "lucide-react"
import { api } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Supplier {
  id: number
  name: string
  category: string
  productBrand?: string | null
  contactPerson?: string | null
  phone?: string | null
  priceScore: number | string
  qualityScore: number | string
  deliveryScore: number | string
  serviceScore: number | string
  capacityScore: number | string
  totalScore?: number | string | null
  status: string
}

interface SpkResult {
  id: number
  type: string
  referenceId: number | null
  score: number | string
  rank: number | null
  details?: {
    name?: string
    category?: string
    recommended?: boolean
    status?: string
    totalScore?: number
  } | null
}

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-muted ${className ?? ""}`} />
}

function toNumber(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === "") return 0
  return Number(value)
}

function formatScore(value: number | string | null | undefined) {
  return toNumber(value).toFixed(2).replace(/\.00$/, "")
}

export default function Dashboard() {
  const [suppliers, setSuppliers] = useState<Supplier[] | null>(null)
  const [results, setResults] = useState<SpkResult[] | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    let alive = true

    async function load() {
      setError("")
      try {
        const [supplierData, resultData] = await Promise.all([
          api.get<Supplier[]>("/spk/suppliers"),
          api.get<SpkResult[]>("/spk/results?type=SUPPLIER_SELECTION"),
        ])
        if (!alive) return
        setSuppliers(supplierData)
        setResults(resultData)
      } catch {
        if (alive) setError("Gagal memuat dashboard supplier. Pastikan backend berjalan dan akun memiliki akses evaluasi supplier.")
      }
    }

    load()
    return () => { alive = false }
  }, [])

  const totalSuppliers = suppliers?.length ?? 0
  const activeSuppliers = suppliers?.filter((supplier) => supplier.status === "ACTIVE").length ?? 0
  const averageScore = suppliers && suppliers.length > 0
    ? suppliers.reduce((total, supplier) => total + toNumber(supplier.totalScore), 0) / suppliers.length
    : 0

  const latestResults = (results ?? [])
    .filter((result) => result.type === "SUPPLIER_SELECTION")
    .sort((a, b) => (a.rank ?? 999) - (b.rank ?? 999))
  const recommendedResults = latestResults.filter((result) => result.details?.recommended)
  const categoryCounts = (suppliers ?? []).reduce<Record<string, number>>((acc, supplier) => {
    acc[supplier.category] = (acc[supplier.category] ?? 0) + 1
    return acc
  }, {})
  const categoryRows = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])
  const topSuppliers = [...(suppliers ?? [])]
    .sort((a, b) => toNumber(b.totalScore) - toNumber(a.totalScore))
    .slice(0, 5)
  const bestSupplier = topSuppliers[0]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard Supplier</h1>
        </div>
        <Button asChild>
          <Link href="/spk">Kelola Supplier</Link>
        </Button>
      </div>

      {error && <p className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-card border-subtle">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Supplier</CardTitle>
            <PackageCheck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{suppliers ? totalSuppliers : <Skeleton className="h-8 w-16" />}</div>
            <p className="mt-1 text-xs text-muted-foreground">Alternatif yang tersedia</p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-subtle">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Supplier Aktif</CardTitle>
            <Truck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{suppliers ? activeSuppliers : <Skeleton className="h-8 w-16" />}</div>
            <p className="mt-1 text-xs text-muted-foreground">Siap masuk proses evaluasi</p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-subtle">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Direkomendasikan</CardTitle>
            <Award className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{results ? recommendedResults.length : <Skeleton className="h-8 w-16" />}</div>
            <p className="mt-1 text-xs text-muted-foreground">Dari hasil evaluasi terakhir</p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-subtle">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Rata-rata Skor</CardTitle>
            <Star className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{suppliers ? formatScore(averageScore) : <Skeleton className="h-8 w-16" />}</div>
            <p className="mt-1 text-xs text-muted-foreground">Berdasarkan skor supplier</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-card border-subtle">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Supplier Terbaik</CardTitle>
          </CardHeader>
          <CardContent>
            {bestSupplier ? (
              <div className="rounded-xl border bg-muted/30 p-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Skor tertinggi saat ini</p>
                    <h2 className="mt-1 text-xl font-semibold">{bestSupplier.name}</h2>
                    <p className="text-sm text-muted-foreground">Jenis aksesoris HP: {bestSupplier.category}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary">{formatScore(bestSupplier.totalScore)}</div>
                    <Badge variant={toNumber(bestSupplier.totalScore) >= 7.5 ? "success" : "secondary"}>
                      {toNumber(bestSupplier.totalScore) >= 7.5 ? "Direkomendasikan" : "Perlu Review"}
                    </Badge>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-44 flex-col items-center justify-center rounded-lg border-2 border-dashed text-center text-sm text-muted-foreground">
                <BarChart3 className="mb-2 h-8 w-8 text-muted-foreground/50" />
                Belum ada hasil ranking. Jalankan evaluasi supplier terlebih dahulu.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card border-subtle">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Jenis Aksesoris HP</CardTitle>
          </CardHeader>
          <CardContent>
            {categoryRows.length > 0 ? (
              <div className="space-y-3">
                {categoryRows.map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between gap-3 text-sm">
                    <span className="truncate font-medium">{category}</span>
                    <Badge variant="outline">{count}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-44 items-center justify-center rounded-lg border-2 border-dashed text-sm text-muted-foreground">
                {suppliers === null ? "Memuat..." : "Belum ada jenis aksesoris"}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card border-subtle">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Top Supplier Berdasarkan Skor</CardTitle>
        </CardHeader>
        <CardContent>
          {topSuppliers.length > 0 ? (
            <div className="space-y-3">
              {topSuppliers.map((supplier, index) => (
                <div key={supplier.id} className="flex items-center gap-3 rounded-lg border p-3 text-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">{index + 1}</div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{supplier.name}</p>
                    <p className="text-xs text-muted-foreground">Jenis aksesoris HP: {supplier.category}</p>
                  </div>
                  <Badge variant={supplier.status === "ACTIVE" ? "success" : "secondary"}>{supplier.status === "ACTIVE" ? "Aktif" : "Nonaktif"}</Badge>
                  <div className="w-16 text-right font-semibold">{supplier.totalScore ? formatScore(supplier.totalScore) : "-"}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed text-sm text-muted-foreground">
              {suppliers === null ? "Memuat..." : "Belum ada supplier"}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
