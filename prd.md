Berikut adalah file **PRD-Web-HRIS-SPK-CV-Anugerah-Mega-Makmur.md** yang sudah digabung dengan seluruh UML diagram:

```markdown
# Product Requirement Document (PRD)
# Web HRIS + SPK — CV Anugerah Mega Makmur

> **Versi:** 1.0  
> **Tanggal:** Juli 2025  
> **Target:** ±27 Minggu Pengembangan  
> **Pemilik:** CV Anugerah Mega Makmur

---

## Daftar Isi

1. [Executive Summary](#1-executive-summary)
2. [Latar Belakang & Problem Statement](#2-latar-belakang--problem-statement)
3. [Goals & Objectives](#3-goals--objectives)
4. [User Personas](#4-user-personas)
5. [Functional Requirements](#5-functional-requirements)
6. [SPK — Sistem Penunjang Keputusan](#6-spk--sistem-penunjang-keputusan)
7. [Non-Functional Requirements](#7-non-functional-requirements)
8. [Technology Stack](#8-technology-stack)
9. [Wireframe Overview](#9-wireframe-overview)
10. [Roadmap & Timeline](#10-roadmap--timeline)
11. [Success Metrics](#11-success-metrics)
12. [Risiko & Mitigasi](#12-risiko--mitigasi)
13. [UML Diagrams](#13-uml-diagrams)

---

## 1. Executive Summary

Sistem **Web HRIS (Human Resource Information System)** ini dirancang untuk CV Anugerah Mega Makmur guna mengintegrasikan seluruh proses manajemen SDM dalam satu platform terpadu. Selain fitur standar seperti pelacakan gaji, absensi, dan data karyawan, sistem ini dilengkapi dengan modul **SPK (Sistem Penunjang Keputusan)** berbasis data analytics untuk membantu manajemen dalam pengambilan keputusan strategis seperti promosi, rekrutmen, penilaian kinerja, dan perencanaan tenaga kerja.

---

## 2. Latar Belakang & Problem Statement

| Masalah Saat Ini | Dampak |
|---|---|
| Pencatatan gaji masih semi-manual (Excel) | Rentan human error, keterlambatan slip gaji |
| Data karyawan tersebar di beberapa file | Sulit tracking riwayat, kontrak, dan dokumen |
| Belum ada sistem penilaian kinerja terstruktur | Promosi/jenjang karir subjektif |
| Rekrutmen masih manual tanpa pipeline tracking | Proses hiring lambat, kandidat hilang |
| Tidak ada analitik tenaga kerja | Keputusan strategis berdasarkan intuisi, bukan data |

---

## 3. Goals & Objectives

1. **Pencatatan gaji otomatis** — slip gaji digital, perhitungan otomatis (BPJS, PPh 21, lembur, potongan)
2. **Manajemen data karyawan** — database terpusat dengan riwayat lengkap
3. **Penilaian kinerja terstruktur** — KPI-based performance review
4. **Pipeline rekrutmen digital** — tracking kandidat end-to-end
5. **SPK berbasis data** — dashboard analitik untuk keputusan promosi, PHK, rekrutmen, dan perencanaan suksesi

---

## 4. User Personas

| Role | Kebutuhan Utama |
|---|---|
| **Admin HR** | Kelola data karyawan, slip gaji, absensi, dokumen |
| **Manager/Approver** | Approve cuti/lembur, review tim, lihat dashboard SPK |
| **Karyawan** | Lihat slip gaji, ajukan cuti/lembur, isi self-assessment |
| **Direksi** | Dashboard SPK, laporan keuangan SDM, workforce analytics |
| **Kandidat** | Lamar lowongan, tracking status lamaran (sisi publik) |

---

## 5. Functional Requirements

### 5.1 Modul Manajemen Karyawan

| Fitur | Deskripsi |
|---|---|
| Database Karyawan | Profil lengkap, foto, kontak darurat, keluarga |
| Riwayat Pekerjaan | Riwayat jabatan, kenaikan gaji, mutasi |
| Manajemen Kontrak | PKWT/PKWTT, reminder masa berlaku kontrak |
| Dokumen Digital | Scan KTP, KK, ijazah, sertifikat — upload & storage |
| Struktur Organisasi | Visualisasi org-chart interaktif |

### 5.2 Modul Penggajian (Payroll)

| Fitur | Deskripsi |
|---|---|
| Komponen Gaji | Gaji pokok, tunjangan (transport, makan, kesehatan, jabatan) |
| Perhitungan Otomatis | PPh 21, BPJS TK, BPJS Kesehatan, THR |
| Lembur | Kalkulasi otomatis sesuai UU Cipta Kerja |
| Potongan | Kasbon, pinjaman, keterlambatan, denda |
| Slip Gaji Digital | PDF auto-generated, terkirim email, akses di portal karyawan |
| Bank Integration | Export format CSV/MT940 untuk transfer massal |
| Histori Gaji | Rekapan tahunan untuk laporan SPT |

### 5.3 Modul Absensi & Time Management

| Fitur | Deskripsi |
|---|---|
| Check-in/out | Integrasi fingerprint/face recognition atau manual web |
| Jadwal Shift | Atur shift kerja fleksibel |
| Overtime Tracking | Approval manager sebelum dihitung ke payroll |
| Cuti Online | Kuota cuti tahunan, cuti melahirkan, sakit, alasan penting |
| Izin/Dispensasi | Terlambat, pulang cepat — dengan approval berjenjang |

### 5.4 Modul Rekrutmen (ATS)

| Fitur | Deskripsi |
|---|---|
| Publikasi Lowongan | Form lamaran publik, auto-format jadi kartu kandidat |
| Pipeline Kandidat | Kanban board: Screening → Interview → Offering → Onboarding |
| Scoring Otomatis | Bobot berdasarkan pendidikan, pengalaman, skill |
| Interview Scheduling | Google Calendar/Outlook sync |
| Onboarding Checklist | Dokumen, peralatan, akses sistem — tracking selesai/belum |

### 5.5 Modul Kinerja (Performance Management)

| Fitur | Deskripsi |
|---|---|
| KPI Setting | Per departemen & individu — bobot & target |
| Self-Assessment | Karyawan isi capaian & kendala |
| 360° Review | Feedback dari atasan, rekan, bawahan |
| Scoring Otomatis | Hitung skor akhir berbobot |
| Catatan Kinerja | Notulen pembinaan, penghargaan, surat peringatan |

### 5.6 Modul Pelatihan (L&D)

| Fitur | Deskripsi |
|---|---|
| Training Request | Usulan pelatihan dari karyawan/manager |
| Training Approval | Budget approval berjenjang |
| Riwayat Pelatihan | Sertifikat digital, jam pelatihan |
| Skill Matrix | Pemetaan kompetensi per karyawan vs kebutuhan jabatan |

---

## 6. SPK — Sistem Penunjang Keputusan

SPK diintegrasikan ke dashboard analytics dengan metode **Simple Multi-Attribute Rating Technique (SMART)** atau **AHP (Analytical Hierarchy Process)** untuk keputusan multi-kriteria.

### 6.1 SPK: Rekomendasi Promosi & Kenaikan Gaji

**Kriteria & Bobot:**

| Kriteria | Bobot |
|---|---|
| Skor kinerja | 40% |
| Masa kerja | 20% |
| Skill matrix match | 20% |
| Rekam disiplin/SP | 10% |
| Feedback 360° | 10% |

**Output:** Peringkat kandidat layak promosi divisi X → direksi tinggal approve.

### 6.2 SPK: Rekomendasi Rekrutmen

**Kriteria per kandidat:**

| Kriteria | Bobot |
|---|---|
| Match pengalaman kerja | 30% |
| Match pendidikan/sertifikasi | 25% |
| Skor interview | 25% |
| Soft skill assessment | 10% |
| Ekspektasi gaji vs anggaran | 10% |

**Output:** Ranking kandidat otomatis untuk posisi yang dilamar.

### 6.3 SPK: Peringatan Dini (Early Warning System)

Deteksi anomali otomatis:

- 🚩 Kinerja turun 3 bulan berturut-turut → flag
- 🚩 Tingkat absensi > threshold → flag
- 🚩 Karyawan belum naik gaji > 2 tahun → flag
- 🚩 Kontrak habis dalam < 3 bulan → alert

### 6.4 SPK: Workforce Planning

- Proyeksi kebutuhan tenaga kerja 6–12 bulan ke depan (berdasarkan tren ekspansi/PHK)
- Simulasi budget payroll jika ada rencana rekrutmen
- Analisis beban kerja vs headcount per departemen

### 6.5 Dashboard Analitik

| Dashboard | Visualisasi |
|---|---|
| Turnover Rate | Line chart per bulan/tahun |
| Komposisi Demografi | Pie chart: gender, usia, pendidikan |
| Beban Gaji | Bar chart: payroll per departemen vs budget |
| Overtime Trend | Heatmap per divisi |
| Training ROI | Perbandingan sebelum vs sesudah pelatihan |

---

## 7. Non-Functional Requirements

| Aspek | Spesifikasi |
|---|---|
| **Platform** | Web-based (responsive mobile) |
| **Keamanan** | RBAC (role-based access), SSL, 2FA opsional, data encryption at rest |
| **Backup** | Harian otomatis, retensi 30 hari |
| **Kinerja** | Load time < 3 detik, mampu handle 200+ concurrent users |
| **Integrasi** | REST API siap integrasi fingerprint, email, Google Workspace |
| **Compliance** | UU Ketenagakerjaan No.13/2003 & UU Cipta Kerja; UU PDP (Perlindungan Data Pribadi) |
| **Self-hosted** | Deploy di server internal atau VPS perusahaan |

---

## 8. Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14 + React + Tailwind CSS + shadcn/ui |
| **Backend** | Laravel / NestJS (REST API) |
| **Database** | PostgreSQL (relasi kompleks) + Redis (cache) |
| **Storage** | MinIO / AWS S3 (dokumen) |
| **PDF Engine** | Puppeteer / wkhtmltopdf (slip gaji, laporan) |
| **Authentication** | JWT + RBAC, NextAuth / Laravel Sanctum |
| **SPK Engine** | Python Flask microservice (pandas, scikit-learn) |
| **Deployment** | Docker + Nginx reverse proxy |

---

## 9. Wireframe Overview

### Dashboard Utama

```
┌──────────────────────────────────────────────────────────────────┐
│  LOGO              HRIS AMM                  🔔 👤 Settings     │
├──────────┬──────────────────────────────────────────────────────┤
│ Sidebar  │  📊 Dashboard                                        │
│          │  ┌───────────┬───────────┬───────────┐              │
│  👥 Data │  │ Total     │ Hadir     │ Cuti      │              │
│  Karyawan│  │ Karyawan  │ Hari Ini  │ Hari Ini  │              │
│          │  │   127     │   118     │    3      │              │
│  💰 Pay- │  └───────────┴───────────┴───────────┘              │
│    roll  │                                                      │
│          │  📈 Turnover    📊 Beban Gaji    ⚠️ Alert System     │
│  🕐 Ab-  │  [LineChart]   [BarChart]       ┌─────────────────┐ │
│    sensi │                                  │ ⬤ Kontrak habis │ │
│          │                                  │ ⬤ Kinerja turun │ │
│  🎯 Ki-  │  🧠 SPK Insights:               │ ⬤ Absensi anom. │ │
│    nerja │  • 5 karyawan layak promosi      └─────────────────┘ │
│          │  • 3 kontrak < 60 hari                                │
│  📋 Re-  │  • Anomali: Divisi Produksi                          │
│    krut  │                                                      │
│          │  ────────────────────────────────────                │
│  🎓 Trai-│  Quick Actions:                                      │
│    ning  │  [+ Input Absen] [+ Review Cuti]                     │
│          │  [+ Buat Slip Gaji] [+ Buka Lowongan]                │
│  🧠 SPK  │                                                      │
│          │                                                      │
│  ⚙️ Set- │                                                      │
│    tings │                                                      │
└──────────┴──────────────────────────────────────────────────────┘
```

---

## 10. Roadmap & Timeline

| Fase | Durasi | Deliverables |
|---|---|---|
| **Fase 1: Core** | 6 minggu | Database karyawan, absensi, cuti, slip gaji |
| **Fase 2: Payroll** | 4 minggu | Kalkulasi otomatis, BPJS, PPh 21, export bank |
| **Fase 3: Rekrutmen** | 4 minggu | ATS pipeline, portal karir publik |
| **Fase 4: Kinerja** | 4 minggu | KPI, 360° review, scoring |
| **Fase 5: SPK** | 6 minggu | Scoring engine, dashboard analitik, early warning |
| **Fase 6: UAT & Deploy** | 3 minggu | Testing, training HR, go-live |
| **Total** | **±27 minggu** | |

---

## 11. Success Metrics

| Metrik | Target |
|---|---|
| Waktu pembuatan slip gaji | Dari 3 hari → < 1 jam (otomatis) |
| Error rate payroll | Turun ke < 0.5% |
| Waktu approval cuti | Dari 2 hari → < 4 jam |
| Time-to-hire | Turun 30% |
| Akurasi SPK promosi | ≥ 85% kesesuaian dengan keputusan akhir direksi |
| Adopsi pengguna | ≥ 90% karyawan aktif login bulanan |

---

## 12. Risiko & Mitigasi

| Risiko | Mitigasi |
|---|---|
| Data migration dari Excel error | Validasi bertahap, parallel run 2 bulan |
| Resistensi user | Training intensif, UI sederhana, support chat |
| Perubahan regulasi perpajakan | Update engine payroll modular |
| Overload fitur | Rilis bertahap per modul (MVP dulu) |

---

## 13. UML Diagrams

---

### 13.1 Use Case Diagram — Keseluruhan Sistem

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                                  WEB HRIS + SPK SYSTEM                                │
│                                                                                      │
│  ┌─────────────────────┐                                                             │
│  │      DIREKSI        │                                                             │
│  │  ───────────────    │─────── Lihat Dashboard SPK ──────────────┐                   │
│  │  • View SPK         │─────── Lihat Workforce Analytics         │                   │
│  │  • Approve Anggaran │─────── Approve Kenaikan Gaji ────┐       │                   │
│  └─────────────────────┘                                  │       │                   │
│                                                           ▼       ▼                   │
│  ┌─────────────────────┐    ┌──────────────────────────────────────────────┐         │
│  │   MANAGER/DEPT HEAD │    │               MODUL SPK                      │         │
│  │  ───────────────    │    │  ┌──────────────────────────────────┐        │         │
│  │  • Review Tim       │───▶│  │  Rekomendasi Promosi             │        │         │
│  │  • Approve Cuti     │    │  │  Rekomendasi Rekrutmen           │        │         │
│  │  • Approve Lembur   │    │  │  Early Warning System            │        │         │
│  │  • Isi 360° Review  │    │  │  Workforce Planning              │        │         │
│  └─────────────────────┘    │  │  Dashboard Analitik              │        │         │
│                              │  └──────────────────────────────────┘        │         │
│  ┌─────────────────────┐    └──────────────────────────────────────────────┘         │
│  │     ADMIN HR        │                                                             │
│  │  ───────────────    │◄──────────────────────────────────────────────────┐         │
│  │  • Kelola Karyawan  │─────── CRUD Data Karyawan ─────────────────┐      │         │
│  │  • Generate Payroll │─────── Proses Gaji Bulanan ────────────┐   │      │         │
│  │  • Atur Absensi     │─────── Input/Import Absensi ───────┐   │   │      │         │
│  │  • Post Lowongan    │─────── Kelola Rekrutmen ───┐       │   │   │      │         │
│  │  • Setup KPI        │─────── Konfigurasi KPI ─┐  │       │   │   │      │         │
│  │  • Manage Training  │                          │  │       │   │   │      │         │
│  └─────────────────────┘                          │  │       │   │   │      │         │
│                                                   ▼  ▼       ▼   ▼   ▼      ▼         │
│  ┌─────────────────────┐    ┌──────────────────────────────────────────────────┐     │
│  │      KARYAWAN       │    │                 MODUL CORE                       │     │
│  │  ───────────────    │    │  ┌────────┐ ┌────────┐ ┌────────┐ ┌──────────┐  │     │
│  │  • Lihat Slip Gaji  │───▶│  │Employee│ │Payroll │ │Absensi │ │Rekrutmen │  │     │
│  │  • Ajukan Cuti      │    │  │Database│ │Engine  │ │& Time  │ │ATS       │  │     │
│  │  • Clock In/Out     │    │  └────────┘ └────────┘ └────────┘ └──────────┘  │     │
│  │  • Self Assessment  │    │  ┌──────────┐ ┌────────────┐ ┌──────────────┐    │     │
│  │  • Request Training │    │  │Kinerja & │ │Pelatihan & │ │Dokumen       │    │     │
│  │  • Update Profil    │    │  │360 Review│ │Skill Matrix│ │Digital       │    │     │
│  └─────────────────────┘    │  └──────────┘ └────────────┘ └──────────────┘    │     │
│                              └──────────────────────────────────────────────────┘     │
│                                                                                      │
│  ┌─────────────────────┐                                                             │
│  │      KANDIDAT       │─────── Lamar Lowongan ──────────────────────────┐           │
│  │  (Public/External)  │─────── Cek Status Lamaran ──────────────────     │           │
│  └─────────────────────┘                                 │               │           │
│                                                          ▼               ▼           │
│                                              ┌──────────────────────────────────┐    │
│                                              │     PORTAL KARIR (PUBLIC)       │    │
│                                              │  • Halaman Lowongan             │    │
│                                              │  • Form Lamaran Online          │    │
│                                              │  • Tracking Status Kandidat     │    │
│                                              └──────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

---

### 13.2 Activity Diagram — Flow Penggajian Bulanan

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ACTIVITY: PROSES GAJI BULANAN                             │
└─────────────────────────────────────────────────────────────────────────────┘

     [ADMIN HR]                  [SISTEM]                    [MANAGER]        [KARYAWAN]
         │                          │                            │                │
         │  Mulai Periode Gaji     │                            │                │
         │────────────────────────▶│                            │                │
         │                          │                            │                │
         │                          │  Fetch Data Absensi        │                │
         │                          │  (Hadir/Izin/Cuti/         │                │
         │                          │   Terlambat/Lembur)        │                │
         │                          │────────┐                   │                │
         │                          │        │                   │                │
         │                          │◄───────┘                   │                │
         │                          │                            │                │
         │                          │  Kalkulasi Otomatis:       │                │
         │                          │  ┌─────────────────────┐   │                │
         │                          │  │ Gaji Pokok          │   │                │
         │                          │  │ + Tunjangan Tetap   │   │                │
         │                          │  │ + Tunjangan Hadir   │   │                │
         │                          │  │ + Lembur (rate x)   │   │                │
         │                          │  │ - Potongan Terlambat│   │                │
         │                          │  │ - Pinjaman/Kasbon   │   │                │
         │                          │  │ - BPJS TK & Kes     │   │                │
         │                          │  │ - PPh 21            │   │                │
         │                          │  │ = GAJI BERSIH       │   │                │
         │                          │  └─────────────────────┘   │                │
         │                          │                            │                │
         │                          │  Generate Draft Slip       │                │
         │                          │  (Status: DRAFT)           │                │
         │                          │                            │                │
         │  Review Draft Payroll ◀──│                            │                │
         │  (Bisa edit manual)      │                            │                │
         │───────┐                  │                            │                │
         │       │                  │                            │                │
         │  [Ada │Kesalahan?]       │                            │                │
         │       │                  │                            │                │
         │   YA  │──────────────▶   │  Re-kalkulasi              │                │
         │       │                  │                            │                │
         │  TIDAK│                  │                            │                │
         │       │                  │                            │                │
         │  Submit Final ──────────▶│                            │                │
         │                          │                            │                │
         │                          │  Generate PDF Slip Gaji    │                │
         │                          │  Final                     │                │
         │                          │                            │                │
         │                          │  Export CSV Bank ─────────▶│                │
         │                          │  (untuk transfer massal)   │   Approve      │
         │                          │                            │   Transfer     │
         │                          │                            │──────┐         │
         │                          │                            │      │         │
         │                          │  Kirim Email Slip ─────────┼──────┼────────▶│
         │                          │  ke masing-masing          │      │   Terima│
         │                          │                            │      │   Slip  │
         │                          │                            │◄─────┘         │
         │                          │                            │                │
         │                          │  Update Histori Gaji       │                │
         │                          │  Update Status: PAID       │                │
         │                          │                            │                │
         │  Selesai ◀───────────────│                            │                │
         │                          │                            │                │
```

---

### 13.3 Activity Diagram — Flow SPK Rekomendasi Promosi

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                ACTIVITY: SPK REKOMENDASI PROMOSI                              │
└──────────────────────────────────────────────────────────────────────────────┘

      [DIREKSI/DEPT HEAD]               [SISTEM SPK]                  [DATABASE]
            │                                │                            │
            │  Buka Modul SPK               │                            │
            │  Pilih: Rekomendasi Promosi   │                            │
            │──────────────────────────────▶│                            │
            │                                │                            │
            │                                │  Fetch Semua Karyawan      │
            │                                │  divisi terpilih ─────────▶│
            │                                │                            │
            │                                │          Data Karyawan ◀───│
            │                                │          (profil, kinerja, │
            │                                │           masa kerja, SP)  │
            │                                │                            │
            │                                │  ┌────────────────────────┐│
            │                                │  │ NORMALISASI DATA       ││
            │                                │  │ (min-max scaling)      ││
            │                                │  └───────────┬────────────┘│
            │                                │              │              │
            │                                │              ▼              │
            │                                │  ┌────────────────────────┐│
            │                                │  │ HITUNG SKOR PER        ││
            │                                │  │ KRITERIA (SMART):      ││
            │                                │  │                        ││
            │                                │  │ 40% Skor Kinerja       ││
            │                                │  │ 20% Masa Kerja         ││
            │                                │  │ 20% Skill Match        ││
            │                                │  │ 10% Rekam Disiplin     ││
            │                                │  │ 10% Hasil 360° Review  ││
            │                                │  │                        ││
            │                                │  │ TOTAL = Σ(Bobot×Skor)  ││
            │                                │  └───────────┬────────────┘│
            │                                │              │              │
            │                                │              ▼              │
            │                                │  ┌────────────────────────┐│
            │                                │  │ RANKING & FILTER       ││
            │                                │  │ • Urutkan skor DESC    ││
            │                                │  │ • Filter > threshold   ││
            │                                │  │ • Exclude yg ada SP3   ││
            │                                │  └───────────┬────────────┘│
            │                                │              │              │
            │                                │              ▼              │
            │                                │  ┌────────────────────────┐│
            │                                │  │ GENERATE REKOMENDASI   ││
            │                                │  │ + Justifikasi per      ││
            │                                │  │   kandidat             ││
            │                                │  └───────────┬────────────┘│
            │                                │              │              │
            │  Tampilkan Dashboard ◀─────────│              │              │
            │                                │                            │
            │  ┌──────────────────────────┐  │                            │
            │  │ PERINGKAT PROMOSI        │  │                            │
            │  │ ┌───┬────────┬──────┬───┐│  │                            │
            │  │ │ # │ Nama   │ Skor │Rek││  │                            │
            │  │ ├───┼────────┼──────┼───┤│  │                            │
            │  │ │ 1 │ Budi   │ 92.5 │ ⭐ ││  │                            │
            │  │ │ 2 │ Ani    │ 88.3 │ ⭐ ││  │                            │
            │  │ │ 3 │ Cici   │ 85.1 │ ⭐ ││  │                            │
            │  │ │ 4 │ Doni   │ 79.8 │ - ││  │                            │
            │  │ │ 5 │ Eka    │ 76.2 │ - ││  │                            │
            │  │ └───┴────────┴──────┴───┘│  │                            │
            │  └──────────────────────────┘  │                            │
            │                                │                            │
            │  ┌──────────────────────────┐  │                            │
            │  │ ACTION:                  │  │                            │
            │  │ [Approve Promosi]        │  │                            │
            │  │ [Tunda - Review Manual]  │  │                            │
            │  │ [Export PDF Laporan]     │  │                            │
            │  └───────────┬──────────────┘  │                            │
            │              │                  │                            │
            │  Pilih Approve ───────────────▶│                            │
            │                                │                            │
            │                                │  Trigger workflow:         │
            │                                │  • Update jabatan          │
            │                                │  • Update gaji pokok       │
            │                                │  • Notifikasi ke karyawan  │
            │                                │  • Catat di riwayat        │
            │                                │                            │
            │  Konfirmasi ◀──────────────────│                            │
            │  Selesai                      │                            │
            │                                │                            │
```

---

### 13.4 Activity Diagram — Flow Rekrutmen (ATS Pipeline)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                    ACTIVITY: REKRUTMEN END-TO-END                              │
└──────────────────────────────────────────────────────────────────────────────┘

   [KANDIDAT]          [ADMIN HR]              [SISTEM]              [MANAGER]
       │                    │                      │                     │
       │                    │  Buat Lowongan       │                     │
       │                    │─────────────────────▶│                     │
       │                    │                      │  Posting di Portal   │
       │                    │                      │  Karir + Job Portal  │
       │                    │                      │                     │
       │  Lihat Lowongan ◀──│                      │                     │
       │  di Portal Karir   │                      │                     │
       │                    │                      │                     │
       │  Isi Form Lamaran  │                      │                     │
       │  + Upload CV       │                      │                     │
       │──────────────────────────────────────────▶│                     │
       │                    │                      │                     │
       │                    │                      │  Parse CV (OCR)     │
       │                    │                      │  Auto-scoring:      │
       │                    │                      │  ┌───────────────┐  │
       │                    │                      │  │30% Pengalaman │  │
       │                    │                      │  │25% Pendidikan │  │
       │                    │                      │  │25% Skill Match│  │
       │                    │                      │  │10% Sertifikasi│  │
       │                    │                      │  │10% Gaji Match │  │
       │                    │                      │  └───────────────┘  │
       │                    │                      │                     │
       │                    │  Pipeline Board ◀────│                     │
       │                    │                      │                     │
       │                    │  ┌─────────────────────────────────────┐  │
       │                    │  │ SCREENING │ INTERVIEW │ OFFERING   │  │
       │                    │  │ ┌──┐ ┌──┐  │ ┌──┐      │ ┌──┐       │  │
       │                    │  │ │A │ │B │  │ │D │      │ │  │       │  │
       │                    │  │ └──┘ └──┘  │ └──┘      │ └──┘       │  │
       │                    │  │ ┌──┐       │            │            │  │
       │                    │  │ │C │       │            │            │  │
       │                    │  │ └──┘       │            │            │  │
       │                    │  └─────────────────────────────────────┘  │
       │                    │                      │                     │
       │                    │  Pilih Kandidat      │                     │
       │                    │  → Interview ───────▶│                     │
       │                    │                      │  Kirim Undangan     │
       │  Terima Email ◀───────────────────────────│  Interview          │
       │  Interview        │                      │                     │
       │                    │                      │                     │
       │                    │  Input Hasil         │                     │
       │                    │  Interview ─────────▶│────────┐            │
       │                    │                      │        │            │
       │                    │                      │  SPK Rekomendasi    │
       │                    │                      │  Ranking Final ◀────│
       │                    │                      │                     │
       │                    │  Kirim Offering ────▶│                     │
       │  Terima Offering ◀────────────────────────│                     │
       │                    │                      │                     │
       │  Accept? ─────────┼──────────────────────▶│                     │
       │  YA                │                      │                     │
       │                    │                      │  Onboarding         │
       │                    │                      │  Checklist:         │
       │                    │                      │  ☐ Dokumen          │
       │                    │                      │  ☐ Peralatan        │
       │                    │                      │  ☐ Akses Sistem     │
       │                    │                      │  ☐ Training Awal    │
       │                    │                      │  ☐ Kontrak TTD      │
       │                    │                      │                     │
       │                    │                      │  Status: HIRED      │
       │                    │                      │  → Auto-entry ke    │
       │                    │                      │    Database Karyawan│
       │                    │                      │                     │
```

---

### 13.5 Sequence Diagram — Approval Cuti

```
┌──────────┐       ┌──────────┐       ┌──────────┐       ┌──────────┐       ┌──────────┐
│ KARYAWAN │       │  CLIENT  │       │  SERVER  │       │ MANAGER  │       │ NOTIFIKASI│
│          │       │ (Browser)│       │ (Backend)│       │ (Client) │       │ (Email/WA)│
└────┬─────┘       └────┬─────┘       └────┬─────┘       └────┬─────┘       └────┬─────┘
     │                   │                 │                  │                  │
     │ 1. Buka Form Cuti │                 │                  │                  │
     │──────────────────▶│                 │                  │                  │
     │                   │                 │                  │                  │
     │                   │ 2. GET /api/    │                  │                  │
     │                   │    leaves/      │                  │                  │
     │                   │    quota        │                  │                  │
     │                   │────────────────▶│                  │                  │
     │                   │                 │                  │                  │
     │                   │ 3. Return       │                  │                  │
     │                   │    kuota: 12,   │                  │                  │
     │                   │    terpakai: 5  │                  │                  │
     │                   │◀────────────────│                  │                  │
     │                   │                 │                  │                  │
     │ 4. Isi Form:      │                 │                  │                  │
     │    Tgl: 10-12 Jun │                 │                  │                  │
     │    Jenis: Tahunan │                 │                  │                  │
     │    Alasan: Liburan│                 │                  │                  │
     │──────────────────▶│                 │                  │                  │
     │                   │                 │                  │                  │
     │                   │ 5. POST /api/   │                  │                  │
     │                   │    leaves/      │                  │                  │
     │                   │    submit       │                  │                  │
     │                   │────────────────▶│                  │                  │
     │                   │                 │                  │                  │
     │                   │                 │ 6. Validasi:     │                  │
     │                   │                 │    • Sisa cuti   │                  │
     │                   │                 │    • Tidak       │                  │
     │                   │                 │      bentrok     │                  │
     │                   │                 │    • Ada manager  │                  │
     │                   │                 │──────┐           │                  │
     │                   │                 │      │           │                  │
     │                   │                 │◄─────┘           │                  │
     │                   │                 │                  │                  │
     │                   │                 │ 7. Simpan di DB  │                  │
     │                   │                 │    Status:       │                  │
     │                   │                 │    PENDING       │                  │
     │                   │                 │                  │                  │
     │                   │                 │ 8. Kirim         │                  │
     │                   │                 │    Notifikasi    │                  │
     │                   │                 │──────────────────┼─────────────────▶│
     │                   │                 │                  │                  │
     │                   │                 │                  │ 9. Notifikasi    │
     │                   │                 │                  │    "Ada          │
     │                   │                 │                  │    pengajuan     │
     │                   │                 │                  │    cuti dari     │
     │                   │                 │                  │    Budi"         │
     │                   │                 │                  │◀─────────────────│
     │                   │                 │                  │                  │
     │                   │ 10. Return      │                  │                  │
     │                   │     success +   │                  │                  │
     │                   │     tracking ID │                  │                  │
     │                   │◀────────────────│                  │                  │
     │                   │                 │                  │                  │
     │ 11. Tampilkan     │                 │                  │                  │
     │     "Menunggu     │                 │                  │                  │
     │     Approval"     │                 │                  │                  │
     │◀──────────────────│                 │                  │                  │
     │                   │                 │                  │                  │
     │                   │                 │                  │ 12. Manager      │
     │                   │                 │                  │     buka notif   │
     │                   │                 │                  │──────┐           │
     │                   │                 │                  │      │           │
     │                   │                 │                  │◄─────┘           │
     │                   │                 │                  │                  │
     │                   │                 │ 13. GET /api/    │                  │
     │                   │                 │     leaves/      │                  │
     │                   │                 │     pending      │                  │
     │                   │                 │◀─────────────────│                  │
     │                   │                 │                  │                  │
     │                   │                 │ 14. Return list  │                  │
     │                   │                 │     pending      │                  │
     │                   │                 │─────────────────▶│                  │
     │                   │                 │                  │                  │
     │                   │                 │ 15. PUT /api/    │                  │
     │                   │                 │     leaves/      │                  │
     │                   │                 │     approve      │                  │
     │                   │                 │◀─────────────────│                  │
     │                   │                 │                  │                  │
     │                   │                 │ 16. Update       │                  │
     │                   │                 │     Status:      │                  │
     │                   │                 │     APPROVED     │                  │
     │                   │                 │                  │                  │
     │                   │                 │ 17. Kirim        │                  │
     │                   │                 │     Notifikasi   │                  │
     │                   │                 │──────────────────┼─────────────────▶│
     │                   │                 │                  │                  │
     │                   │ 18. Notifikasi  │                  │                  │
     │                   │     "Cuti       │                  │                  │
     │                   │     Disetujui"  │                  │                  │
     │◀──────────────────┼─────────────────┼──────────────────┼──────────────────│
     │                   │                 │                  │                  │
```

---

### 13.6 Entity Relationship Diagram (ERD) — Skema Database Sederhana

```
┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│    EMPLOYEES     │       │     PAYROLLS     │       │    ATTENDANCES   │
├──────────────────┤       ├──────────────────┤       ├──────────────────┤
│ PK id            │──┐    │ PK id            │    ┌──│ PK id            │
│    nik           │  │    │ FK employee_id   │◄───┘  │ FK employee_id   │──┐
│    name          │  └───▶│    period_month  │       │    date          │  │
│    email         │       │    basic_salary   │       │    check_in      │  │
│    phone         │       │    allowances     │       │    check_out     │  │
│    department_id │──┐    │    overtime_pay   │       │    status        │  │
│    position_id   │──┤    │    deductions     │       │    overtime_hours│  │
│    join_date     │  │    │    net_salary     │       └──────────────────┘  │
│    status        │  │    │    status         │                             │
│    contract_end  │  │    │    paid_at        │       ┌──────────────────┐  │
└──────────────────┘  │    └──────────────────┘       │     LEAVES       │  │
                      │                               ├──────────────────┤  │
┌──────────────────┐  │    ┌──────────────────┐       │ PK id            │  │
│   DEPARTMENTS    │  │    │    POSITIONS     │       │ FK employee_id   │──┘
├──────────────────┤  │    ├──────────────────┤       │    type          │
│ PK id            │◄─┘    │ PK id            │◄──────│    start_date    │
│    name          │       │    name          │       │    end_date      │
│    manager_id    │       │    department_id │──┐    │    reason        │
└──────────────────┘       │    level         │  │    │    status        │
                           └──────────────────┘  │    │    approved_by   │──┐
                                                  │    └──────────────────┘  │
┌──────────────────┐       ┌──────────────────┐  │                           │
│   PERFORMANCES   │       │    TRAININGS     │  │    ┌──────────────────┐   │
├──────────────────┤       ├──────────────────┤  │    │  RECRUITMENTS    │   │
│ PK id            │       │ PK id            │  │    ├──────────────────┤   │
│ FK employee_id   │──┐    │ FK employee_id   │──┤    │ PK id            │   │
│    period        │  │    │    name          │  │    │    position_id   │───┘
│    kpi_score     │  │    │    provider      │  │    │    candidate_name│
│    self_score    │  │    │    date          │  │    │    email         │
│    360_score     │  │    │    cost          │  │    │    cv_path       │
│    total_score   │  │    │    certificate   │  │    │    stage         │
│    notes         │  │    └──────────────────┘  │    │    score         │
└──────────────────┘  │                          │    │    status        │
                       │    ┌──────────────────┐  │    └──────────────────┘
                       │    │   SKILL_MATRIX   │  │
                       │    ├──────────────────┤  │
                       │    │ PK id            │  │
                       │    │ FK employee_id   │──┘
                       │    │ FK skill_id      │
                       │    │    proficiency   │
                       │    │    last_updated  │
                       │    └──────────────────┘
                       │
                       │    ┌──────────────────┐
                       │    │      USERS       │
                       │    ├──────────────────┤
                       └───▶│ PK id            │
                            │ FK employee_id   │ (opsional)
                            │    username      │
                            │    password_hash │
                            │    role          │
                            │    last_login    │
                            └──────────────────┘
```

---

## Penutup

Dokumen PRD ini beserta UML diagram terlampir mencakup seluruh kebutuhan bisnis, teknis, dan visual untuk pengembangan **Web HRIS + SPK CV Anugerah Mega Makmur**. Dokumen ini siap digunakan sebagai acuan tim developer, UI/UX designer, QA, dan stakeholder manajemen.

---

**Disusun oleh:** Tim Product  
**Distribusi:** Direksi, Manager HR, Tim IT, Vendor Developer
```

