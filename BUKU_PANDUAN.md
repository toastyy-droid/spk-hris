# 📘 HRIS AMM
## Buku Panduan Sistem Informasi Sumber Daya Manusia
### CV Anugerah Mega Makmur

**Versi 1.0 — 31 Mei 2026**

---

## Daftar Isi

1. [Apa Itu HRIS AMM?](#1-apa-itu-hris-amm)
2. [Cara Mengakses Aplikasi](#2-cara-mengakses-aplikasi)
3. [Login dan Akun](#3-login-dan-akun)
4. [Navigasi Dashboard](#4-navigasi-dashboard)
5. [Panduan Fitur Lengkap](#5-panduan-fitur-lengkap)
   - [5.1 Dashboard Utama](#51-dashboard-utama)
   - [5.2 Data Karyawan](#52-data-karyawan)
   - [5.3 Payroll (Penggajian)](#53-payroll-penggajian)
   - [5.4 Absensi](#54-absensi)
   - [5.5 Kinerja (KPI & 360°)](#55-kinerja-kpi--360)
   - [5.6 Rekrutmen](#56-rekrutmen)
   - [5.7 Training & Skill Matrix](#57-training--skill-matrix)
   - [5.8 SPK (Sistem Pendukung Keputusan)](#58-spk-sistem-pendukung-keputusan)
   - [5.9 Manajemen Departemen](#59-manajemen-departemen)
   - [5.10 Manajemen Jabatan](#510-manajemen-jabatan)
   - [5.11 Manajemen Skills](#511-manajemen-skills)
   - [5.12 Manajemen Users](#512-manajemen-users)
   - [5.13 Settings](#513-settings)
6. [Arsitektur Sistem](#6-arsitektur-sistem)
7. [Teknologi yang Digunakan](#7-teknologi-yang-digunakan)
8. [Untuk Pengembang (Developer)](#8-untuk-pengembang-developer)
9. [Pemecahan Masalah (Troubleshooting)](#9-pemecahan-masalah-troubleshooting)
10. [Glosarium](#10-glosarium)

---

## 1. Apa Itu HRIS AMM?

**HRIS AMM** (Human Resource Information System — CV Anugerah Mega Makmur) adalah sistem informasi sumber daya manusia berbasis web yang dibangun untuk mengelola seluruh aspek kepegawaian secara digital.

### Apa yang bisa dilakukan HRIS AMM?

| Modul | Fungsi |
|---|---|
| **Data Karyawan** | Menyimpan data lengkap karyawan, kontrak, dokumen, struktur organisasi |
| **Payroll** | Menghitung gaji, tunjangan, potongan, dan menghasilkan slip gaji |
| **Absensi** | Mencatat kehadiran, check-in/out, cuti, izin, lembur |
| **Kinerja** | Penilaian KPI, review 360°, catatan kinerja |
| **Rekrutmen** | Mengelola lowongan kerja, pipeline kandidat |
| **Training** | Daftar pelatihan, riwayat pelatihan per karyawan |
| **Skill Matrix** | Skills yang dimiliki karyawan, mapping kompetensi |
| **SPK** | Sistem Pendukung Keputusan untuk promosi jabatan (metode SMART) |
| **Manajemen** | Departemen, jabatan, users, dan konfigurasi sistem |

### Kenapa dibangun?

Proyek ini dibangun sebagai tugas kelompok dan sekaligus solusi nyata untuk mengelola SDM perusahaan secara digital, menggantikan pencatatan manual menggunakan Excel/kertas.

---

## 2. Cara Mengakses Aplikasi

### 2.1 Langsung dari Browser

Aplikasi sudah **live** dan bisa diakses dari mana saja:

| Komponen | URL |
|---|---|
| **Frontend (Website)** | [https://hris-amm-frontend.vercel.app](https://hris-amm-frontend.vercel.app) |
| **Backend (API)** | [https://hris-amm-api.vercel.app/api](https://hris-amm-api.vercel.app/api) |
| **Dokumentasi API (Swagger)** | [https://hris-amm-api.vercel.app/api/docs](https://hris-amm-api.vercel.app/api/docs) |

### 2.2 Buka di HP

Website ini **responsive** — bisa dibuka di HP, tablet, atau laptop.

### 2.3 Tidak perlu install apa-apa

Cukup buka browser (Chrome, Edge, Firefox, Safari) dan ketik URL di atas.

### ⚠️ Catatan Penting: Cold Start

Karena aplikasi berjalan di server gratis (Vercel), server akan "tidur" jika tidak dipakai selama ~15 menit.

- **Akses pertama kali** setelah lama idle akan lambat (5-10 detik)
- **Tunggu saja**, jangan refresh berulang kali
- Setelah loading pertama selesai, halaman akan berjalan normal

---

## 3. Login dan Akun

### 3.1 Cara Login

1. Buka [https://hris-amm-frontend.vercel.app](https://hris-amm-frontend.vercel.app)
2. Anda akan melihat halaman login
3. Masukkan **Username** dan **Password**
4. Klik tombol **"Masuk"**

### 3.2 Akun yang Tersedia

| Username | Password | Role | Akses |
|---|---|---|---|
| `admin` | `admin123` | SUPER_ADMIN | Semua fitur |
| *(Akun lain bisa dibuat dari menu Users)* | | | |

### 3.3 Setelah Login

Setelah berhasil login, Anda akan masuk ke **Dashboard** utama.

### 3.4 Logout

Klik foto/avatar di pojok kanan atas → pilih **Keluar**.

---

## 4. Navigasi Dashboard

### 4.1 Layout Halaman

```
┌─────────────────────────────────────────────┐
│  Header: Logo + Pencarian + Profil          │
├──────────┬──────────────────────────────────┤
│          │                                  │
│ Sidebar  │     Area Konten Utama            │
│ (Menu)   │                                  │
│          │                                  │
│          │                                  │
├──────────┴──────────────────────────────────┤
│  Footer (jarang dipakai)                    │
└─────────────────────────────────────────────┘
```

### 4.2 Menu Sidebar (Kiri)

| Ikon | Menu | Keterangan |
|---|---|---|
| 📊 | Dashboard | Ringkasan statistik utama |
| 👥 | Data Karyawan | Manajemen data pegawai |
| 💰 | Payroll | Penggajian dan slip gaji |
| 📋 | Absensi | Kehadiran, cuti, izin |
| ⭐ | Kinerja | KPI dan 360° review |
| 🔍 | Rekrutmen | ATS dan pipeline kandidat |
| 🎓 | Training | Pelatihan dan skill matrix |
| 🤖 | SPK | Sistem Pendukung Keputusan |
| 🏢 | Departemen | Manajemen departemen |
| 💼 | Jabatan | Manajemen posisi/jabatan |
| 🛠️ | Skills | Daftar skill dan mapping |
| 👤 | Users | Manajemen akun pengguna |
| ⚙️ | Settings | Konfigurasi perusahaan |

### 4.3 Pencarian

Di header atas ada kolom **search** — bisa untuk mencari karyawan cepat.

---

## 5. Panduan Fitur Lengkap

### 5.1 Dashboard Utama

Halaman pertama setelah login. Menampilkan:

- **Total Karyawan** → jumlah seluruh pegawai
- **Karyawan Aktif** → yang masih bekerja
- **Absensi Hari Ini** → siapa yang sudah check-in
- **Kontrak Akan Habis** → peringatan 30 hari ke depan
- **Grafik** → tren jumlah karyawan (recharts)
- **Ringkasan SPK** → rekomendasi promosi terbaru

👉 Tidak ada tombol khusus — semua data tampil otomatis.

---

### 5.2 Data Karyawan

**Menu:** Sidebar → Data Karyawan

#### Cara Melihat Daftar Karyawan
1. Klik menu **Data Karyawan** di sidebar
2. Tabel menampilkan semua karyawan
3. Ada kolom pencarian dan filter departemen

#### Data yang Ditampilkan di Tabel
- NIK, Nama, Departemen, Jabatan, Status, Tanggal Masuk

#### Tombol Aksi
- **Detail** → Lihat halaman lengkap karyawan
- **Edit** → (jika punya akses) ubah data
- **Export CSV** → Download data ke Excel

#### Halaman Detail Karyawan
Klik **Detail** atau nama karyawan → masuk ke halaman profil lengkap:

| Tab | Isi |
|---|---|
| **Informasi Umum** | Data pribadi, kontak, alamat |
| **Struktur Organisasi** | Posisi di bagan organisasi |
| **Kontrak** | Riwayat kontrak, status, tanggal habis |
| **Dokumen** | File-file terkait (KTP, ijazah, dll) |
| **KPI** | Target KPI & pencapaian |
| **360 Feedback** | Review dari atasan/rekan/bawahan |
| **Catatan Kinerja** | Log catatan performa |

---

### 5.3 Payroll (Penggajian)

**Menu:** Sidebar → Payroll

#### Cara Memproses Gaji Bulanan
1. Pilih **Bulan** dan **Tahun**
2. Klik tombol **"Proses Gaji"**
3. Sistem menghitung gaji semua karyawan secara otomatis
4. Data muncul di tabel

#### Melihat Slip Gaji
- Klik **ID Payroll** atau tombol **Slip** di tabel
- Halaman detail menampilkan slip gaji lengkap:
  - Gaji Pokok
  - Tunjangan (makan, transport, jabatan, dll)
  - Potongan (BPJS, PPh, pinjaman, dll)
  - Total Take Home Pay

#### Tab Komponen Gaji
- **Tunjangan Tetap** → diatur di level jabatan
- **Potongan Tetap** → diatur sistem

#### Tab Histori Gaji
- Rekap gaji tahunan per karyawan
- Bisa lihat tren kenaikan gaji

#### Tombol Export
- Download data payroll dalam format CSV

---

### 5.4 Absensi

**Menu:** Sidebar → Absensi

#### Fitur Check-in / Check-out
1. Klik tombol **"Check In"** untuk mencatat kedatangan
2. Sistem mencatat waktu otomatis
3. Klik **"Check Out"** saat pulang

#### Riwayat Absensi
- Tabel menampilkan kehadiran harian
- Status: Hadir, Terlambat, Izin, Sakit, Alpha

#### Rekap Bulanan
- Ringkasan kehadiran per bulan
- Jumlah hadir, sakit, izin, cuti

#### Tab Cuti & Izin (Leaves)
- **Ajukan Cuti** → Pilih jenis, tanggal, alasan
- **Approval** → Atasan bisa menyetujui/menolak
- **Sisa Kuota** → Menampilkan jatah cuti tahunan

#### Tab Lembur
- Catatan lembur karyawan
- Perhitungan upah lembur

---

### 5.5 Kinerja (KPI & 360°)

**Menu:** Sidebar → Kinerja

#### Daftar Penilaian
- Tabel periode penilaian kinerja
- Klik **Detail** untuk lihat lengkap

#### Tab KPI Setting
- Atur **KPI (Key Performance Indicator)** per jabatan
- Tentukan target dan bobot penilaian

#### Tab 360 Feedback
- Review dari berbagai sudut pandang:
  - Atasan (30%)
  - Rekan kerja (30%)
  - Bawahan (20%)
  - Diri sendiri (20%)
- Memberikan gambaran objektif

#### Tab Catatan Kinerja
- Catatan harian/mingguan tentang performa
- Bisa ditambahkan oleh atasan

---

### 5.6 Rekrutmen

**Menu:** Sidebar → Rekrutmen

#### Melihat Lowongan
- Daftar posisi yang sedang dibuka
- Status: Open, Closed, On Hold

#### Pipeline Kandidat
Visual pipeline tahapan rekrutmen:

```
Applied → Screening → Interview → Offer → Hired
```

- **Seret (drag)** kandidat ke tahap berikutnya
- Klik kandidat untuk lihat detail

#### Menambah Kandidat
1. Klik tombol **Tambah Kandidat**
2. Isi nama, posisi, kontak, CV
3. Kandidat otomatis masuk tahap "Applied"

#### Portal Karir
- Halaman publik untuk pelamar luar
- Bisa melihat lowongan yang tersedia

---

### 5.7 Training & Skill Matrix

**Menu:** Sidebar → Training

#### Daftar Pelatihan
- Tabel semua program pelatihan
- Nama, tanggal, durasi, peserta

#### Menambah Pelatihan
1. Klik **Tambah Pelatihan**
2. Isi judul, deskripsi, tanggal, peserta
3. Simpan

#### Tab Riwayat Pelatihan
- Pelatihan yang pernah diikuti per karyawan
- Sertifikat dan nilai

#### Tab Skill Matrix
- Matriks kompetensi karyawan
- Skill apa saja yang dimiliki tiap karyawan
- Level: Beginner, Intermediate, Advanced, Expert
- Bisa melihat **gap** skill untuk kebutuhan training

---

### 5.8 SPK (Sistem Pendukung Keputusan)

**Menu:** Sidebar → SPK

**Ini adalah fitur canggih** untuk membantu keputusan promosi jabatan secara objektif.

#### Cara Kerja SPK (Metode SMART)
Sistem menilai karyawan berdasarkan **5 kriteria**:

| Kriteria | Bobot | Sumber Data |
|---|---|---|
| Performa Kinerja | 40% | Modul Kinerja |
| Masa Kerja (Tenure) | 20% | Data karyawan |
| Kesesuaian Skill | 20% | Skill Matrix |
| Disiplin | 10% | Data absensi |
| 360 Review | 10% | Modul Kinerja |

#### Menjalankan SPK
1. Buka menu **SPK**
2. Klik **"Jalankan SPK Promosi"**
3. Sistem menghitung skor otomatis
4. Hasil menampilkan peringkat karyawan terbaik untuk promosi

#### Halaman Detail Hasil SPK
- Skor per kriteria (visual chart)
- Total skor akhir
- Rekomendasi: **Direkomendasikan** / **Tidak**

#### Early Warning
- Peringatan dini untuk karyawan dengan performa menurun
- Membantu intervensi sebelum masalah membesar

---

### 5.9 Manajemen Departemen

**Menu:** Sidebar → Departemen

#### Melihat Departemen
- Tabel daftar departemen
- Nama, deskripsi, jumlah anggota

#### Menambah / Edit Departemen
1. Klik **Tambah Departemen**
2. Isi nama, deskripsi, parent departemen (jika ada)
3. Simpan

#### Struktur Organisasi
- Visual tree: bagaimana hierarki departemen

---

### 5.10 Manajemen Jabatan

**Menu:** Sidebar → Jabatan

#### Melihat Jabatan
- Tabel daftar posisi
- Nama jabatan, departemen, level, deskripsi

#### Menambah / Edit Jabatan
1. Klik **Tambah Jabatan**
2. Pilih departemen, isi nama jabatan, level
3. Simpan

#### Filter
- Filter jabatan berdasarkan departemen

---

### 5.11 Manajemen Skills

**Menu:** Sidebar → Skills

#### Melihat Skills
- Daftar semua skill yang terdaftar
- Nama skill, kategori

#### Menambah Skill
1. Klik **Tambah Skill**
2. Isi nama skill, kategori (Teknis, Non-Teknis, Sertifikasi)
3. Simpan

#### Assign Skill ke Karyawan
1. Klik **Assign**
2. Pilih karyawan dan level skill
3. Simpan → otomatis masuk ke Skill Matrix

---

### 5.12 Manajemen Users

**Menu:** Sidebar → Users

**Khusus untuk SUPER_ADMIN dan ADMIN_HR**

#### Melihat Users
- Daftar semua akun pengguna sistem
- Username, email, role, status aktif

#### Role (Hak Akses)

| Role | Akses |
|---|---|
| **SUPER_ADMIN** | Semua fitur, termasuk manajemen user |
| **ADMIN_HR** | Semua fitur HR, tidak bisa管理 user |
| **MANAGER** | Data tim sendiri, approve cuti/izin |
| **KARYAWAN** | Data diri sendiri, absensi, pengajuan cuti |

#### Menambah / Edit User
1. Klik **Tambah User**
2. Isi username, password, pilih role
3. Simpan

#### Reset Password
- Atur ulang password jika user lupa

---

### 5.13 Settings

**Menu:** Sidebar → Settings

- Nama perusahaan
- Alamat
- Nomor telepon
- Email
- Logo perusahaan

Semua data ini muncul di laporan dan slip gaji.

---

## 6. Arsitektur Sistem

### 6.1 Diagram Alur Sederhana

```
Anda (Browser)          Server Cloud          Database Cloud
     │                       │                     │
     │── Buka website ──────>│                     │
     │                       │                     │
     │<── Halaman Login ─────│                     │
     │                       │                     │
     │── Login ─────────────>│── Cek user ────────>│
     │   (user/pass)         │                     │
     │                       │<── Data user ───────│
     │                       │                     │
     │<── Token JWT ─────────│                     │
     │                       │                     │
     │── Minta data ────────>│── Query data ──────>│
     │   (dengan token)      │                     │
     │                       │<── Hasil data ──────│
     │<── Tampilkan data ────│                     │
```

### 6.2 Tiga Layer Utama

```
┌──────────────────────────────────┐
│   FRONTEND (Layer Tampilan)      │
│   Next.js 14 + React            │
│   https://hris-amm-frontend...   │
├──────────────────────────────────┤
│   BACKEND (Layer Logika Bisnis)   │
│   NestJS + Prisma ORM           │
│   https://hris-amm-api.vercel…   │
├──────────────────────────────────┤
│   DATABASE (Layer Penyimpanan)   │
│   PostgreSQL (Supabase)         │
└──────────────────────────────────┘
```

### 6.3 Penjelasan

1. **Frontend (Next.js)**
   - Tampilan web yang Anda lihat
   - Berisi halaman, tombol, tabel, grafik
   - "Bicara" ke backend via API

2. **Backend (NestJS)**
   - Otak aplikasi — semua logika bisnis
   - Menghitung gaji, SPK, validasi login
   - Terima permintaan dari frontend, olah data, kirim hasil

3. **Database (PostgreSQL)**
   - Penyimpanan data permanen
   - Semua data karyawan, absensi, payroll, dll
   - Di-host di Supabase (cloud)

### 6.4 Hosting (Jangan Khawatir — Gratis!)

Semua berjalan di cloud gratis:

| Layanan | Fungsi | Biaya |
|---|---|---|
| **Vercel** | Host frontend + backend | Gratis |
| **Supabase** | Database PostgreSQL | Gratis |
| **GitHub** | Source code | Gratis |

Tidak perlu bayar server, domain, atau hosting.

---

## 7. Teknologi yang Digunakan

### Frontend

| Teknologi | Kegunaan |
|---|---|
| **Next.js 14** | Framework React untuk web app |
| **TypeScript** | JavaScript dengan tipe data |
| **Tailwind CSS** | Framework CSS cepat |
| **shadcn/ui** | Komponen UI siap pakai |
| **Recharts** | Grafik dan chart |
| **Lucide Icons** | Ikon-ikon cantik |

### Backend

| Teknologi | Kegunaan |
|---|---|
| **NestJS** | Framework Node.js terstruktur |
| **Prisma ORM** | Penghubung ke database |
| **PostgreSQL** | Database relasional |
| **JWT (JSON Web Token)** | Sistem keamanan login |
| **Passport.js** | Autentikasi |
| **Swagger** | Dokumentasi API otomatis |

### Tools

| Tools | Kegunaan |
|---|---|
| **Git** | Version control |
| **GitHub** | Tempat nyimpan code |
| **VS Code** | Editor code (disarankan) |
| **Vercel CLI** | Deploy ke production |

---

## 8. Untuk Pengembang (Developer)

Bagian ini untuk anggota kelompok yang ingin **mengedit code** atau **menjalankan di laptop**.

### 8.1 Persiapan Awal

#### Yang perlu diinstall:
1. **Node.js** (versi 18 atau 20) → [nodejs.org](https://nodejs.org)
2. **Git** → [git-scm.com](https://git-scm.com)
3. **VS Code** → [code.visualstudio.com](https://code.visualstudio.com)

#### Clone project:
```bash
git clone https://github.com/toastyy-droid/spk-hris.git
cd spk-hris
```

### 8.2 Struktur Folder

```
spk_hris/
├── frontend/           # Aplikasi web (Next.js)
│   ├── src/
│   │   ├── app/        # Halaman-halaman
│   │   │   ├── login/     # Halaman login
│   │   │   ├── employees/ # Data karyawan
│   │   │   ├── payroll/   # Penggajian
│   │   │   ├── attendance/ # Absensi
│   │   │   ├── performance/ # Kinerja
│   │   │   ├── recruitment/ # Rekrutmen
│   │   │   ├── training/   # Training
│   │   │   ├── spk/        # SPK
│   │   │   ├── departments/# Departemen
│   │   │   ├── positions/  # Jabatan
│   │   │   ├── skills/     # Skills
│   │   │   ├── users/      # Users
│   │   │   └── settings/   # Settings
│   │   ├── components/  # Komponen reusable
│   │   ├── contexts/    # State management
│   │   └── lib/         # Utility & API client
│   ├── public/          # Gambar, icon
│   └── package.json
│
├── backend/            # API server (NestJS)
│   ├── src/
│   │   ├── modules/    # Modul-modul
│   │   │   ├── auth/       # Autentikasi
│   │   │   ├── users/      # Users
│   │   │   ├── employees/  # Karyawan
│   │   │   ├── departments/# Departemen
│   │   │   ├── positions/  # Jabatan
│   │   │   ├── attendance/ # Absensi
│   │   │   ├── leaves/     # Cuti
│   │   │   ├── payroll/    # Penggajian
│   │   │   ├── performance/# Kinerja
│   │   │   ├── training/   # Training
│   │   │   ├── skills/     # Skills
│   │   │   ├── recruitment/# Rekrutmen
│   │   │   └── spk/        # SPK
│   │   ├── common/     # Shared (guards, decorators)
│   │   └── main.ts     # Entry point
│   ├── prisma/
│   │   └── schema.prisma  # Model database
│   └── package.json
│
├── prd.md              # Dokumen requirement (PRD)
└── BUKU_PANDUAN.md     # Buku panduan ini
```

### 8.3 Menjalankan Frontend di Laptop

```bash
cd frontend
npm install
npm run dev
```

Buka browser: `http://localhost:3000`

### 8.4 Menjalankan Backend di Laptop

```bash
cd backend
npm install
npm run prisma:generate
npm run dev
```

Backend jalan di: `http://localhost:4000/api`

### 8.5 Deploy (Untuk yang Sudah Punya Akses)

Frontend & Backend sudah auto-deploy dari GitHub:
1. Edit code → commit → push ke `main`
2. Vercel otomatis build & deploy ulang
3. Tunggu ~1-2 menit

### 8.6 Perintah Penting

#### Frontend:
| Perintah | Fungsi |
|---|---|
| `npm run dev` | Menjalankan di laptop (development) |
| `npm run build` | Build untuk production |
| `npm run lint` | Cek kode dari error |

#### Backend:
| Perintah | Fungsi |
|---|---|
| `npm run dev` | Menjalankan API di laptop |
| `npm run build` | Compile ke JavaScript |
| `npm run lint` | Cek kode dari error |
| `npm run prisma:studio` | Buka database UI (Prisma Studio) |

---

## 9. Pemecahan Masalah (Troubleshooting)

### 9.1 Login Tidak Berhasil

| Masalah | Solusi |
|---|---|
| **"Login gagal"** | Cek username & password (case-sensitive) |
| **Tidak terjadi apa-apa** | Tunggu 10 detik (cold start), jangan klik berulang |
| **Error di console** | Buka F12 → Console, laporkan ke tim |

### 9.2 Halaman Kosong / Data Tidak Muncul

| Masalah | Solusi |
|---|---|
| **Loading terus** | Refresh halaman sekali |
| **Data tidak tampil** | Tunggu 5 detik, refresh |
| **Error 500** | Backend cold start — reload aja |

### 9.3 Aplikasi Lambat

| Penyebab | Solusi |
|---|---|
| Cold start server | Tunggu 5-10 detik, itu normal |
| Koneksi internet | Cek koneksi Anda |
| Server sibuk | Coba beberapa menit lagi |

### 9.4 Lupa Password

Hubungi **SUPER_ADMIN** (yang punya akses menu Users) untuk reset password.

### 9.5 Error Saat Development

| Error | Solusi |
|---|---|
| `npm install` error | Coba hapus `node_modules` lalu install ulang |
| `port 3000 already in use` | Matikan aplikasi lain yang pakai port 3000 |
| `PrismaClientInitializationError` | Pastikan database sedang jalan |

---

## 10. Glosarium

| Istilah | Arti |
|---|---|
| **API** | Jembatan antara frontend dan backend |
| **ATS** | Applicant Tracking System — sistem pelacak pelamar |
| **Cold Start** | Waktu tunggu pertama kali server dihidupkan |
| **CORS** | Pengaman agar hanya domain tertentu bisa akses API |
| **CRUD** | Create, Read, Update, Delete — operasi dasar data |
| **Deploy** | Proses menaikkan aplikasi ke server online |
| **Endpoint** | URL spesifik di API (contoh: `/api/auth/login`) |
| **JWT** | Token keamanan untuk login |
| **KPI** | Key Performance Indicator — target kinerja |
| **Kriteria** | Faktor penilaian dalam SPK |
| **Middleware** | Pengecek izin sebelum halaman diakses |
| **NestJS** | Framework backend yang digunakan |
| **Next.js** | Framework frontend yang digunakan |
| **ORM** | Penghubung antara code dan database |
| **Pipeline** | Alur tahapan rekrutmen |
| **Prisma** | ORM yang dipakai di project ini |
| **PRD** | Product Requirements Document — dokumen spesifikasi |
| **Responsive** | Tampilan yang menyesuaikan ukuran layar |
| **Role** | Hak akses pengguna (Super Admin, HR, Manager, Karyawan) |
| **SMART** | Metode SPK: Simple Multi-Attribute Rating Technique |
| **SPK** | Sistem Pendukung Keputusan |
| **Supabase** | Penyedia database PostgreSQL gratis |
| **Swagger** | Dokumentasi API interaktif |
| **Token** | Kode rahasia untuk akses API |
| **Vercel** | Platform hosting gratis untuk frontend & backend |
| **360° Review** | Penilaian dari atasan, rekan, bawahan, dan diri sendiri |

---

## Catatan Akhir

Aplikasi **HRIS AMM** adalah proyek ambisius yang dibangun oleh tim. Meskipun berjalan di hosting gratis dengan keterbatasan (cold start), semua fitur inti sudah berfungsi penuh.

**Tips sukses:**
- Gunakan Chrome/Edge untuk pengalaman terbaik
- Sabar dengan cold start (5-10 detik pertama)
- Laporkan bug ke tim developer

---

*Dokumen ini dibuat pada 31 Mei 2026. Versi terbaru selalu tersedia di repository GitHub.*

---

**Judul alternatif untuk buku ini:**
1. **HRIS AMM: Panduan Lengkap Sistem Informasi SDM Terintegrasi** ← (rekomendasi)
2. **Buku Sakti HRIS AMM: Panduan Penggunaan dan Pengembangan**
3. **HRIS AMM Handbook: Dari Login hingga SPK**
4. **Sistem SDM Digital CV Anugerah Mega Makmur: Panduan Komprehensif**
