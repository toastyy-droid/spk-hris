"use client"

import { BarChart3, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const criteria = [
  { name: "Harga", weight: 30, description: "Semakin kompetitif harga grosir, semakin tinggi nilai." },
  { name: "Kualitas", weight: 30, description: "Menilai kondisi barang, keaslian, garansi, dan risiko retur." },
  { name: "Pengiriman", weight: 20, description: "Menilai ketepatan waktu dan kelancaran distribusi ke toko." },
  { name: "Layanan", weight: 10, description: "Menilai kecepatan respons, komunikasi, dan penanganan komplain." },
  { name: "Kapasitas", weight: 10, description: "Menilai ketersediaan stok aksesori fast moving." },
]

export default function CriteriaPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Kriteria Penilaian</h1>

      <Card>
        <CardContent className="pt-6 text-sm text-muted-foreground">
          Setiap kriteria dinilai dengan skala 1 sampai 10. Skor akhir dihitung menggunakan bobot SMART, dengan bonus +0.5 jika ongkir ditanggung supplier.
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-5">
        {criteria.map((item) => (
          <Card key={item.name}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">{item.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{item.weight}%</div>
            </CardContent>
          </Card>
        ))}
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
                <span className="font-semibold text-primary">{item.weight}%</span>
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
