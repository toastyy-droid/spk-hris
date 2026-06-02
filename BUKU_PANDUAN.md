# Buku Panduan Pengguna HRIS AMM

**Sistem Informasi Sumber Daya Manusia Terintegrasi CV Anugerah Mega Makmur**

---

## 📌 Daftar Isi

1. [Tentang Sistem](#1-tentang-sistem)
2. [Persyaratan Sistem & Instalasi](#2-persyaratan-sistem--instalasi)
3. [Cara Menjalankan Aplikasi](#3-cara-menjalankan-aplikasi)
4. [Login & Akun Demo](#4-login--akun-demo)
5. [Dashboard](#5-dashboard)
6. [Manajemen Karyawan](#6-manajemen-karyawan)
7. [Absensi & Time Management](#7-absensi--time-management)
8. [Penilaian Kinerja](#8-penilaian-kinerja)
9. [Skills & Kompetensi](#9-skills--kompetensi)
10. [SPK Dashboard](#10-spk-dashboard)
11. [Departemen & Jabatan](#11-departemen--jabatan)
12. [Reset Data (Seed)](#12-reset-data-seed)
13. [Struktur Folder](#13-struktur-folder)

---

## 1. Tentang Sistem

HRIS AMM adalah sistem informasi sumber daya manusia terintegrasi yang dibangun khusus untuk CV Anugerah Mega Makmur. Sistem ini mencakup:

- **Manajemen Data Karyawan** — Data master karyawan, dokumen, kontrak
- **Absensi & Time Management** — Check-in/out, cuti, izin
- **Penilaian Kinerja** — KPI, self review, 360° review
- **Skills & Kompetensi** — Matrix keahlian karyawan
- **SPK Dashboard** — Sistem Penunjang Keputusan untuk promosi & early warning
- **Manajemen Departemen & Jabatan** — Struktur organisasi

**Teknologi yang Digunakan:**

| Komponen | Teknologi |
|----------|-----------|
| Frontend | Next.js 14 (App Router) + Tailwind CSS + shadcn/ui |
| Backend | NestJS + Prisma ORM |
| Database | PostgreSQL (via Supabase) |
| Autentikasi | JWT (passport-jwt) |
| Role Access | RBAC (SUPER_ADMIN, ADMIN_HR, MANAGER, KARYAWAN) |

---

## 2. Persyaratan Sistem & Instalasi

### Prasyarat

- **Node.js** versi 18+ (disarankan 20 LTS)
- **NPM** atau **Yarn**
- Koneksi internet (database menggunakan Supabase cloud)

### Langkah Instalasi

```bash
# Clone repositori
git clone <repository-url>
cd spk_hris

# Install semua dependensi (root, backend, frontend)
cd backend
npm install
cd ../frontend
npm install
cd ..
npm install
```

### Konfigurasi Database

Database sudah terhubung ke Supabase PostgreSQL cloud. Konfigurasi ada di file:

```
backend/.env  →  DATABASE_URL
```

Jika ingin menggunakan database lokal, ubah `DATABASE_URL` di `.env`:

```
DATABASE_URL="postgresql://user:password@localhost:5432/hris_amm"
```

### Migrasi Database

```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
```

---

## 3. Cara Menjalankan Aplikasi

### Cara 1: Double-click (Paling Mudah)

Double-click file **`dev.bat`** yang ada di folder utama (`C:\Users\ideapad GAMING\spk_hris\dev.bat`).

### Cara 2: Terminal (Satu Perintah)

```bash
cd C:\Users\ideapad GAMING\spk_hris
npm run dev
```

### Cara 3: Manual (Terpisah)

```bash
# Terminal 1 - Backend (port 4000)
cd backend
npm run dev

# Terminal 2 - Frontend (port 3000)
cd frontend
npm run dev
```

Setelah berjalan, buka browser ke: **http://localhost:3000**

---

## 4. Login & Akun Demo

### Akun Super Admin

| Username | Password | Role |
|----------|----------|------|
| `admin` | `admin123` | SUPER_ADMIN |

### Akun Karyawan (Login menggunakan NIK)

| NIK | Nama | Password | Role |
|-----|------|----------|------|
| `19800101` | Admin HR | `admin123` | ADMIN_HR |
| `19900101` | Budi Santoso | `admin123` | KARYAWAN |
| `19910202` | Siti Rahmawati | `admin123` | KARYAWAN |
| `19920303` | Ahmad Hidayat | `admin123` | KARYAWAN |
| `19930404` | Dewi Lestari | `admin123` | KARYAWAN |
| `19940505` | Rudi Hartono | `admin123` | KARYAWAN |
| `19950606` | Maya Anggraini | `admin123` | KARYAWAN |
| `19960707` | Dimas Pratama | `admin123` | KARYAWAN |
| `19970808` | Fitri Handayani | `admin123` | KARYAWAN |
| `19980909` | Agus Wijaya | `admin123` | KARYAWAN |
| `19991010` | Rina Amelia | `admin123` | KARYAWAN |
| `20001111` | Hendra Gunawan | `admin123` | KARYAWAN |
| `20011212` | Sarah Mutiara | `admin123` | KARYAWAN |
| `19930001` | Manager HR | `admin123` | MANAGER |

---

## 5. Dashboard

Halaman pertama setelah login. Dashboard menampilkan:

**Ringkasan Statistik:**
- Total Karyawan (dan jumlah aktif)
- Kehadiran Hari Ini (jumlah & persentase)
- Cuti Hari Ini (plus jumlah izin/sakit)

**Distribusi Karyawan per Departemen:**
- Grafik batang horizontal per departemen

**Alert System:**
- Kontrak habis < 60 hari
- Kinerja menurun 3 bulan
- Absensi anomali
- Karyawan belum naik gaji > 2 tahun

**SPK Insights:**
- Jumlah karyawan layak promosi
- Jumlah kontrak mendekati habis
- Anomali absensi

---

## 6. Manajemen Karyawan

Menu **Data Karyawan** menampilkan seluruh data master karyawan dalam bentuk tabel.

### Fitur

- **Pencarian**: Cari berdasarkan Nama atau NIK
- **Filter Status**: ACTIVE, PROBATION, RESIGNED
- **Tambah Karyawan**: Form lengkap dengan data pribadi, departemen, jabatan
- **Detail Karyawan**: Lihat profil lengkap + riwayat (absensi, cuti, payroll, kinerja, training, skills)

### Data Demo

Terdapat 14 karyawan dengan variasi:
- 10 karyawan aktif (ACTIVE)
- 3 karyawan masa percobaan (PROBATION)
- Tersebar di 6 departemen (HR, IT, Finance, Marketing, Operations, GA)
- Berbagai level jabatan (Staff, Supervisor, Manager)

---

## 7. Absensi & Time Management

### Fitur

- **Riwayat Absensi**: Menampilkan check-in/check-out per bulan
- **Today Summary**: Ringkasan kehadiran hari ini (Hadir, Izin, Sakit, Cuti, Alpha)
- **Pengajuan Cuti**: Karyawan bisa mengajukan cuti, Manager/HR bisa approve/reject
- **Filter Bulan**: Lihat riwayat per bulan tertentu

### Data Demo

Terdapat 588 record absensi selama 60 hari kerja, dengan variasi status:
- HADIR (mayoritas)
- IZIN
- SAKIT
- ALPHA (tanpa check-in)

Juga terdapat 10 data cuti dengan berbagai status (PENDING, APPROVED, REJECTED) dan tipe (TAHUNAN, SAKIT, PENTING, MELAHIRKAN).

---

## 8. Penilaian Kinerja

Sistem penilaian menggunakan 3 komponen dengan bobot:

| Komponen | Bobot |
|----------|-------|
| KPI Score | 40% |
| Self Review | 20% |
| 360° Review | 40% |

### Fitur

- **Input Penilaian**: Pilih karyawan, periode, masukkan skor
- **Grade Otomatis**: A (≥85), B (≥70), C (≥55), D (<55)
- **Detail Kinerja**: Lihat histori penilaian per periode

### Data Demo

70 record penilaian untuk 14 karyawan selama 5 bulan (Januari - Mei 2026).

Beberapa karyawan sengaja memiliki skor rendah di bulan April-Mei untuk mendemokan fitur Early Warning SPK (skor < 50).

---

## 9. Skills & Kompetensi

### Fitur

- **Daftar Skill**: 18 jenis skill (Teknis & Non-Teknis)
- **Assign Skill**: Hubungkan skill ke karyawan dengan level proficiency (1-5)
- **Skill Matrix**: Lihat peta kompetensi seluruh karyawan

### Data Demo

| Kategori | Contoh Skill |
|----------|-------------|
| Teknis | JavaScript, TypeScript, React, Node.js, Python, SQL, UI/UX, Excel, Photoshop, SAP |
| Non-Teknis | Digital Marketing, Financial Analysis, Project Management, Public Speaking, Leadership, Copywriting, Negotiation |

Setiap karyawan memiliki 2-5 skill dengan level proficiency bervariasi.

---

## 10. SPK Dashboard

Sistem Penunjang Keputusan menggunakan metode SMART untuk perhitungan promosi.

### Kriteria Penilaian Promosi

| Kriteria | Bobot |
|----------|-------|
| Kinerja (KPI) | 40% |
| Masa Kerja | 20% |
| Skill Match | 20% |
| Disiplin | 10% |
| 360° Review | 10% |

### Fitur

- **Jalankan SPK Promosi**: Hitung otomatis semua karyawan aktif
- **Ranking Kandidat**: Urut berdasarkan skor total
- **Recommended Threshold**: Skor ≥ 75 = direkomendasikan
- **Early Warning System**:
  - Kinerja menurun 3 bulan berturut-turut
  - Kontrak habis < 60 hari
  - Belum ada kenaikan > 2 tahun
  - Absensi anomali tinggi

### Data Demo

- 6 kandidat promosi dengan skor dan peringkat
- Karyawan dengan kinerja menurun (skor < 50)
- Karyawan dengan kontrak mendekati habis
- Grafik distribusi menggunakan Recharts

---

## 11. Departemen & Jabatan

### Departemen

| Departemen | Kode |
|-----------|------|
| Human Resources | HR |
| Information Technology | IT |
| Finance & Accounting | FIN |
| Marketing | MKT |
| Operations | OPS |
| General Affairs | GA |

### Jabatan

13 jabatan tersebar di 6 departemen dengan level:
- **MANAGER**: HR Manager, IT Manager, Finance Manager, Marketing Manager, Operations Manager
- **SUPERVISOR**: HR Supervisor
- **STAFF**: HR Staff, Developer, System Analyst, Accountant, Marketing Staff, Operations Staff, GA Staff

---

## 12. Reset Data (Seed)

Untuk mereset database ke data demo awal:

```bash
cd backend
npm run prisma:seed
```

Perintah ini akan:
1. Menghapus semua data yang ada
2. Mengisi ulang dengan 14 karyawan + data dummy lengkap
3. Reset semua akun ke password default (`admin123`)

### Detail Seed Data

| Modul | Jumlah |
|-------|--------|
| Departemen | 6 |
| Jabatan | 13 |
| Karyawan | 14 |
| Absensi | 588 record |
| Cuti | 10 record |
| Payroll | 42 record (3 bulan) |
| Kinerja | 70 record (5 bulan) |
| Skill | 18 jenis |
| Training | 10 record |
| Rekrutmen | 10 kandidat |
| SPK | 6 hasil promosi |

---

## 13. Struktur Folder

```
spk_hris/
├── dev.bat                 # Shortcut double-click untuk menjalankan app
├── package.json            # Root package.json (concurrently untuk FE+BE)
├── AGENTS.md               # Konfigurasi AI Assistant
├── BUKU_PANDUAN.md         # Buku panduan ini
├── prd.md                  # Product Requirements Document
│
├── frontend/               # Next.js 14 App Router
│   ├── package.json
│   └── src/
│       ├── app/            # Halaman-halaman (route)
│       │   ├── page.tsx         # Dashboard
│       │   ├── employees/       # Data Karyawan
│       │   ├── attendance/      # Absensi
│       │   ├── performance/     # Kinerja
│       │   ├── spk/             # SPK Dashboard
│       │   ├── skills/          # Skills & Kompetensi
│       │   ├── departments/     # Departemen
│       │   ├── positions/       # Jabatan
│       │   ├── login/           # Halaman Login
│       │   └── layout.tsx       # Layout utama
│       ├── components/     # Komponen UI
│       │   ├── ui/              # shadcn/ui primitives
│       │   ├── sidebar.tsx      # Navigasi sidebar
│       │   └── header.tsx       # Header atas
│       ├── contexts/       # React Context (Auth, Notification)
│       ├── lib/            # Utilities (API client, helpers)
│       └── styles/         # Global CSS
│
├── backend/                # NestJS REST API
│   ├── package.json
│   ├── prisma/
│   │   ├── schema.prisma  # Database schema
│   │   ├── seed.ts        # Data seeder
│   │   └── migrations/    # Migrasi database
│   └── src/
│       ├── main.ts        # Entry point (port 4000)
│       ├── auth/          # Autentikasi JWT
│       ├── employees/     # CRUD Karyawan
│       ├── attendance/    # Absensi
│       ├── leaves/        # Cuti & Izin
│       ├── payroll/       # Penggajian
│       ├── performance/   # Kinerja
│       ├── training/      # Pelatihan
│       ├── skills/        # Skills & Matrix
│       ├── recruitment/   # Rekrutmen
│       ├── spk/           # SPK & Early Warning
│       ├── departments/   # Departemen
│       ├── positions/     # Jabatan
│       ├── users/         # Manajemen User
│       └── common/        # Shared (Guards, Decorators, Interceptors)
│
└── docker-compose.yml     # Docker setup (opsional)
```

---

**CV Anugerah Mega Makmur** — *Membangun Tim yang Solid, Tangguh, dan Terukur.*
