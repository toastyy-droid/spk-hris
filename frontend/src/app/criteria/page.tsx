"use client"

import { BarChart3, CheckCircle2, DollarSign, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const criteria: Array<{ name: string; weight: number; type: "cost" | "benefit"; description: string }> = [
  {
    name: "Harga",
    weight: 30,
    type: "cost",
    description: "Semakin kompetitif harga grosir, semakin tinggi nilai. Cost criterion: nilai lebih kecil = lebih baik.",
  },
  {
    name: "Kualitas",
    weight: 30,
    type: "benefit",
    description: "Menilai kondisi barang, keaslian, garansi, dan risiko retur. Benefit criterion: nilai lebih besar = lebih baik.",
  },
  {
    name: "Pengiriman",
    weight: 20,
    type: "benefit",
    description: "Menilai ketepatan waktu dan kelancaran distribusi ke toko. Benefit criterion: nilai lebih besar = lebih baik.",
  },
  {
    name: "Layanan",
    weight: 10,
    type: "benefit",
    description: "Menilai kecepatan respons, komunikasi, dan penanganan komplain. Benefit criterion: nilai lebih besar = lebih baik.",
  },
  {
    name: "Kapasitas",
    weight: 10,
    type: "benefit",
    description: "Menilai ketersediaan stok aksesori fast moving. Benefit criterion: nilai lebih besar = lebih baik.",
  },
]

const typeConfig = {
  cost: { label: "Cost", icon: DollarSign, variant: "warning" as const },
  benefit: { label: "Benefit", icon: TrendingUp, variant: "success" as const },
}

export default function CriteriaPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Kriteria Penilaian</h1>

      <Card>
        <CardContent className="pt-6 text-sm text-muted-foreground">
          Setiap kriteria dinilai dengan skala 1 sampai 10. Skor SAW dihitung menggunakan metode
          Simple Additive Weighting (SAW) dengan normalisasi benefit/cost. Cost criterion (Harga)
          dinormalisasi dengan rumus min/x, sedangkan benefit criteria dinormalisasi dengan rumus x/max.
          Bonus +0.05 diberikan jika ongkos kirim ditanggung supplier.
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-5">
        {criteria.map((item) => {
            const cfg = typeConfig[item.type]
          return (
            <Card key={item.name}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">{item.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-2xl font-bold text-primary">{item.weight}%</div>
                <Badge variant={cfg.variant} className="gap-1">
                  <cfg.icon className="h-3 w-3" /> {cfg.label}
                </Badge>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" /> Bobot Evaluasi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {criteria.map((item) => (
            <div key={item.name} className="space-y-2 rounded-lg border p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="h-4 w-4 text-green-600" /> {item.name}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={typeConfig[item.type].variant}>{typeConfig[item.type].label}</Badge>
                  <span className="font-semibold text-primary">{item.weight}%</span>
                </div>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${item.weight}%` }} />
              </div>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
