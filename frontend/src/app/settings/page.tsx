"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Konfigurasi sistem & pengaturan akun</p>
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">Umum</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
          <TabsTrigger value="keamanan">Keamanan</TabsTrigger>
          <TabsTrigger value="integrasi">Integrasi</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Informasi Perusahaan</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Nama Perusahaan</Label>
                  <Input value="CV Anugerah Mega Makmur" />
                </div>
                <div className="space-y-2">
                  <Label>Alamat</Label>
                  <Input value="Jl. Raya Utama No. 123" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value="admin@amm.co.id" />
                </div>
                <div className="space-y-2">
                  <Label>Telepon</Label>
                  <Input value="(021) 1234-5678" />
                </div>
              </div>
              <Button>Simpan</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Preferensi</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Accordion type="single" collapsible>
                <AccordionItem value="notif">
                  <AccordionTrigger>Notifikasi</AccordionTrigger>
                  <AccordionContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Email Notifikasi</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Notifikasi Kontrak</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Alert Early Warning</Label>
                      <Switch defaultChecked />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payroll">
          <Card>
            <CardHeader><CardTitle>Konfigurasi Payroll</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>BPJS TK (%)</Label>
                  <Input value="3.7" />
                </div>
                <div className="space-y-2">
                  <Label>BPJS Kesehatan (%)</Label>
                  <Input value="5" />
                </div>
                <div className="space-y-2">
                  <Label>PTKP (K/0)</Label>
                  <Input value="Rp 54.000.000" />
                </div>
                <div className="space-y-2">
                  <Label>Rate Lembur (x1.5)</Label>
                  <Input value="Rp 25.000" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label>Export CSV otomatis ke bank</Label>
                <Switch />
              </div>
              <Button>Simpan Konfigurasi</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="keamanan">
          <Card>
            <CardHeader><CardTitle>Keamanan & RBAC</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Two-Factor Authentication (2FA)</Label>
                <Switch />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label className="font-semibold">Role Access Control</Label>
                <div className="text-sm text-muted-foreground">
                  Admin HR • Manager • Karyawan • Direksi
                </div>
              </div>
              <Button>Kelola Role</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrasi">
          <Card>
            <CardHeader><CardTitle>Integrasi</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Google Calendar Sync</Label>
                  <p className="text-sm text-muted-foreground">Sinkronisasi jadwal interview</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Server (SMTP)</Label>
                  <p className="text-sm text-muted-foreground">Pengiriman slip gaji otomatis</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Fingerprint / Face Recognition</Label>
                  <p className="text-sm text-muted-foreground">Integrasi absensi biometrik</p>
                </div>
                <Switch />
              </div>
              <Button>Konfigurasi API</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
