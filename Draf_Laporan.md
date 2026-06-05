**LAPORAN**

**SISTEM PENUNJANG KEPUTUSAN**

**IMPLEMENTASI METODE SIMPLE ADDITIVE WEIGHTING (SAW) UNTUK SELEKSI SUPPLIER AKSESORIS HANDPHONE PADA CV ANUGERAH MEGA MAKMUR PONTIANAK**

![Portal Mahasiswa | UWDP](data:image/png;base64...)

Disusun oleh:

DEIGO JANVIER (23412978)

FERDINANDUS ABDIAR (23412983)

IRNIAWATI SONIA (23412991)

JACKSON (23412992)

JHULIO THENDEUX (23412994)

**PROGRAM STUDI SISTEM INFORMASI**

**FAKULTAS TEKNOLOGI INFORMASI**

**UNIVERSITAS WIDYA DHARMA PONTIANAK**

**2026**

# KATA PENGANTAR

Puji syukur kami panjatkan ke hadirat Tuhan Yang Maha Esa karena atas rahmat dan karunia-Nya, kami dapat menyelesaikan laporan tugas Sistem Pendukung Keputusan ini dengan baik. Laporan ini disusun sebagai salah satu bentuk pemenuhan tugas mata kuliah Sistem Pendukung Keputusan pada Program Studi Sistem Informasi.

Laporan ini berisi tentang implementasi metode Simple Additive Weighting (SAW) untuk menyelesaikan permasalahan seleksi supplier aksesoris handphone di CV Anugerah Mega Makmur Pontianak. Dalam penyusunan laporan ini, kami melakukan observasi langsung ke lapangan, wawancara dengan pemilik perusahaan, serta studi pustaka dari berbagai sumber referensi.

Kami menyadari bahwa laporan ini masih jauh dari sempurna. Oleh karena itu, kami sangat mengharapkan kritik dan saran yang membangun dari berbagai pihak demi perbaikan laporan ini ke depannya. Semoga laporan ini dapat bermanfaat bagi seluruh pembaca, khususnya bagi mahasiswa yang ingin mempelajari lebih lanjut tentang sistem pendukung keputusan dan metode SAW.

Pontianak, 20 Mei 2026

Tim Penyusun

# DAFTAR ISI

[KATA PENGANTAR 2](#_Toc231596421)

[DAFTAR ISI 3](#_Toc231596422)

[DAFTAR TABEL 5](#_Toc231596423)

[DAFTAR GAMBAR 6](#_Toc231596424)

[BAB I PENDAHULUAN 7](#_Toc231596425)

[1.1 Latar Belakang 7](#_Toc231596426)

[1.2 Rumusan Masalah 8](#_Toc231596427)

[1.3 Tujuan Penelitian 8](#_Toc231596428)

[1.4 Batasan Masalah 9](#_Toc231596429)

[1.5 Manfaat Penelitian 9](#_Toc231596430)

[1.6 Metode Penelitian 10](#_Toc231596431)

[BAB II PEMBAHASAN 11](#_Toc231596432)

[2.1 Profil CV Anugerah Mega Makmur 11](#_Toc231596433)

[2.2 Landasan Teori 11](#_Toc231596434)

[2.2.1 Sistem Pendukung Keputusan 11](#_Toc231596435)

[2.2.2 Metode Simple Additive Weighting (SAW) 12](#_Toc231596436)

[2.3 Identifikasi Kriteria dan Bobot 14](#_Toc231596437)

[2.4 Perhitungan Manual Metode SAW 15](#_Toc231596438)

[2.4.1 Data Alternatif Supplier 15](#_Toc231596439)

[2.4.2 Perhitungan Nilai Preferensi 16](#_Toc231596440)

[2.4.3 Perankingan Supplier 17](#_Toc231596441)

[2.4.4 Validasi Threshold Rekomendasi 17](#_Toc231596442)

[2.5 Implementasi Sistem 18](#_Toc231596443)

[2.5.1 Arsitektur Sistem 18](#_Toc231596444)

[2.5.2 Teknologi yang Digunakan 19](#_Toc231596445)

[2.5.3 Fitur Sistem 19](#_Toc231596446)

[2.5.4 Alur Kerja Sistem 20](#_Toc231596447)

[2.5.5 Endpoint Backend 20](#_Toc231596448)

[2.5.6 Diagram Arsitektur Sistem 21](#_Toc231596449)

[2.5.7 Tampilan Antarmuka Sistem 22](#_Toc231596450)

[2.6 Perbandingan Hasil Manual dan Web 24](#_Toc231596451)

[2.7 Dokumentasi Observasi dan Wawancara 25](#_Toc231596452)

[2.7.1 Hasil Observasi 25](#_Toc231596453)

[2.7.2 Hasil Wawancara 26](#_Toc231596454)

[2.8 Kelebihan dan Keterbatasan Metode SAW 26](#_Toc231596455)

[BAB III PENUTUP 28](#_Toc231596456)

[3.1 Kesimpulan 28](#_Toc231596457)

[3.2 Future Works 29](#_Toc231596458)

[DAFTAR PUSTAKA 31](#_Toc231596459)

[LAMPIRAN 32](#_Toc231596460)

[LAMPIRAN 1. DOKUMENTASI WAWANCARA 32](#_Toc231596461)

# DAFTAR TABEL

[Tabel 2.1 Kriteria dan Bobot Penilaian Supplier 14](#_Toc231594751)

[Tabel 2.2 Data Alternatif Supplier 16](#_Toc231594752)

[Tabel 2.3 Konversi Nilai Supplier ke Skala 0-1 16](#_Toc231594753)

[Tabel 2.4 Nilai Minimum dan Maksimum Kriteria 16](#_Toc231594754)

[Tabel 2.5 Perhitungan Nilai Preferensi 17](#_Toc231594755)

[Tabel 2.6 Perankingan Supplier 17](#_Toc231594756)

[Tabel 2.7 Endpoint Backend Sistem 20](#_Toc231594757)

[Tabel 2.8 Perbandingan Hasil Manual dan Sistem 23](#_Toc231594758)

# DAFTAR GAMBAR

[Gambar 2.1 Arsitektur Sistem SPK Seleksi Supplier 22](#_Toc231595564)

[Gambar 2.2 Tampilan Dashboard Supplier 23](#_Toc231595565)

[Gambar 2.3 Tampilan Data Supplier 24](#_Toc231595566)

[Gambar 2.4 Tampilan Kriteria Penilaian 24](#_Toc231595567)

[Gambar 2.5 Tampilan Evaluasi Supplier 25](#_Toc231595568)

# PENDAHULUAN

## Latar Belakang

Perkembangan penggunaan smartphone di Indonesia mendorong meningkatnya kebutuhan terhadap produk aksesoris handphone, seperti charger, kabel data, casing, tempered glass, powerbank, earphone, dan berbagai perlengkapan pendukung lainnya. Kondisi tersebut membuka peluang bagi pelaku usaha grosir aksesoris handphone untuk memperluas pasar dan meningkatkan kualitas layanan kepada pelanggan.

CV Anugerah Mega Makmur merupakan perusahaan yang bergerak di bidang perdagangan grosir aksesoris handphone di Kota Pontianak, Kalimantan Barat. Dalam menjalankan kegiatan operasionalnya, perusahaan bekerja sama dengan sejumlah supplier yang menyediakan berbagai jenis produk. Pemilihan supplier menjadi salah satu keputusan penting karena berpengaruh langsung terhadap harga jual, kualitas barang, ketersediaan stok, ketepatan pengiriman, dan kepuasan pelanggan.

Permasalahan yang dihadapi perusahaan adalah proses pemilihan supplier masih dilakukan secara subjektif berdasarkan pengalaman, hubungan kerja sama, atau rekomendasi dari pihak lain. Cara tersebut dapat membantu dalam kondisi tertentu, tetapi belum memberikan dasar penilaian yang terukur dan terdokumentasi. Akibatnya, keputusan pemilihan supplier berpotensi tidak konsisten, terutama ketika terdapat beberapa supplier dengan kualitas dan penawaran yang relatif seimbang.

Untuk mengatasi permasalahan tersebut, diperlukan Sistem Pendukung Keputusan (SPK) yang mampu membantu proses seleksi supplier secara lebih objektif, terstruktur, dan transparan. SPK dapat mengolah data supplier berdasarkan sejumlah kriteria yang telah ditentukan, kemudian menghasilkan rekomendasi dalam bentuk skor dan peringkat.

Metode yang digunakan dalam penelitian ini adalah Simple Additive Weighting (SAW). Metode SAW dipilih karena memiliki konsep yang sederhana, mudah diterapkan, dan sesuai untuk menyelesaikan permasalahan pengambilan keputusan dengan banyak kriteria. Melalui proses normalisasi dan pembobotan, metode SAW dapat menghasilkan nilai preferensi untuk setiap alternatif supplier sehingga perusahaan dapat menentukan supplier terbaik berdasarkan hasil perhitungan yang jelas.

## Rumusan Masalah

Berdasarkan uraian latar belakang di atas, maka rumusan masalah dalam laporan ini adalah sebagai berikut:

1. Bagaimana menentukan kriteria dan bobot penilaian yang relevan dalam proses seleksi supplier aksesoris handphone pada CV Anugerah Mega Makmur?
2. Bagaimana menerapkan metode Simple Additive Weighting (SAW) untuk menghasilkan rekomendasi supplier terbaik?
3. Bagaimana merancang dan membangun sistem pendukung keputusan berbasis web untuk membantu proses seleksi supplier?
4. Bagaimana kesesuaian hasil perhitungan sistem dengan hasil perhitungan manual metode SAW?

## Tujuan Penelitian

Adapun tujuan dari penelitian ini adalah:

1. Mengidentifikasi kriteria dan bobot yang digunakan dalam proses seleksi supplier.
2. Menerapkan metode Simple Additive Weighting (SAW) dalam proses perhitungan dan perankingan supplier.
3. Merancang dan membangun sistem pendukung keputusan berbasis web yang dapat membantu proses evaluasi supplier secara objektif, terstruktur, dan terdokumentasi.
4. Membandingkan hasil perhitungan manual dengan hasil perhitungan sistem untuk mengetahui kesesuaiannya.

## Batasan Masalah

Agar pembahasan dalam laporan ini lebih terarah dan tidak meluas, maka diberikan beberapa batasan masalah sebagai berikut:

1. Penelitian dilakukan pada CV Anugerah Mega Makmur Pontianak.
2. Kriteria penilaian yang digunakan terdiri dari Harga, Kualitas, Pengiriman, Layanan, dan Kapasitas.
3. Metode yang digunakan adalah Simple Additive Weighting (SAW).
4. Data alternatif supplier yang digunakan berjumlah lima supplier sebagai sampel perhitungan.
5. Sistem yang dirancang berbasis web dan digunakan untuk membantu proses evaluasi supplier.
6. Sistem yang dibahas dalam laporan ini difokuskan pada modul Sistem Pendukung Keputusan seleksi supplier.
7. Modul lain yang terdapat pada struktur project, seperti data karyawan, absensi, payroll, cuti, pelatihan, dan rekrutmen tidak menjadi ruang lingkup pembahasan karena tidak digunakan dalam proses evaluasi supplier.

## Manfaat Penelitian

Penelitian ini diharapkan dapat memberikan manfaat sebagai berikut:

1. Bagi Perusahaan: Memberikan solusi sistem pendukung keputusan yang dapat membantu proses seleksi supplier secara objektif dan terstruktur, sehingga kualitas keputusan yang diambil menjadi lebih baik.
2. Bagi Akademisi: Menambah wawasan dan pengetahuan mengenai penerapan metode Simple Additive Weighting (SAW) dalam sistem pendukung keputusan, khususnya dalam konteks pemilihan supplier.
3. Bagi Penulis: Menerapkan ilmu yang telah diperoleh selama perkuliahan, khususnya mata kuliah Sistem Pendukung Keputusan, ke dalam bentuk aplikasi nyata yang dapat digunakan oleh masyarakat.

## Metode Penelitian

Metode penelitian yang digunakan dalam penyusunan laporan ini terdiri dari observasi, wawancara, studi pustaka, perancangan sistem, implementasi, dan pengujian. Observasi dilakukan dengan mengamati proses pemilihan supplier pada CV Anugerah Mega Makmur. Wawancara dilakukan untuk memperoleh informasi mengenai kriteria yang digunakan dalam memilih supplier, bobot prioritas setiap kriteria, dan kebutuhan sistem yang diharapkan.

Studi pustaka dilakukan dengan mempelajari referensi yang berkaitan dengan Sistem Pendukung Keputusan dan metode Simple Additive Weighting. Perancangan sistem dilakukan dengan menentukan alur kerja sistem, data yang diperlukan, dan tampilan utama sistem. Implementasi dilakukan dengan membangun sistem berbasis web. Pengujian dilakukan dengan membandingkan hasil perhitungan manual dengan hasil perhitungan sistem.

Pengembangan sistem dilakukan dengan pendekatan implementasi berbasis web. Sistem dibangun dengan memisahkan bagian frontend, backend, dan database. Frontend digunakan sebagai antarmuka pengguna untuk mengelola data supplier dan melihat hasil evaluasi. Backend digunakan untuk menyediakan API, menjalankan proses perhitungan metode SAW, serta mengelola penyimpanan data. Database digunakan untuk menyimpan data supplier dan hasil evaluasi agar dapat digunakan kembali sebagai riwayat pengambilan keputusan.

# PEMBAHASAN

## Profil CV Anugerah Mega Makmur

CV Anugerah Mega Makmur merupakan usaha yang bergerak dalam perdagangan grosir aksesoris handphone di Pontianak. Produk yang dijual meliputi charger, kabel data, casing, tempered glass, powerbank, earphone, dan aksesoris pendukung lainnya. Dalam kegiatan operasionalnya, perusahaan bekerja sama dengan beberapa supplier untuk memenuhi kebutuhan stok barang. Supplier yang dipilih harus mampu menyediakan produk dengan harga yang kompetitif, kualitas yang baik, pengiriman yang tepat waktu, layanan yang responsif, dan kapasitas stok yang memadai.

Pemilihan supplier sebelumnya masih dilakukan secara manual dan berdasarkan pengalaman. Oleh karena itu, diperlukan sistem pendukung keputusan yang dapat membantu proses seleksi supplier secara lebih objektif berdasarkan kriteria dan bobot yang jelas.

## Landasan Teori

### Sistem Pendukung Keputusan

Sistem Pendukung Keputusan (SPK) adalah sistem berbasis komputer yang digunakan untuk membantu pengambil keputusan dalam menyelesaikan permasalahan yang bersifat semi-terstruktur atau tidak terstruktur. SPK tidak menggantikan peran pengambil keputusan, tetapi memberikan informasi, data, dan model perhitungan yang dapat digunakan sebagai dasar pertimbangan.

Dalam penelitian ini, SPK digunakan untuk membantu proses seleksi supplier. Sistem mengolah data supplier berdasarkan kriteria yang telah ditentukan, kemudian menghasilkan skor akhir dan ranking supplier. Dengan adanya SPK, keputusan pemilihan supplier dapat dilakukan secara lebih objektif dan terdokumentasi.

### Metode Simple Additive Weighting (SAW)

Simple Additive Weighting (SAW) merupakan salah satu metode dalam Multi-Attribute Decision Making (MADM). Metode ini sering disebut sebagai metode penjumlahan terbobot karena proses penilaiannya dilakukan dengan menjumlahkan hasil perkalian antara bobot kriteria dan nilai rating kinerja setiap alternatif. Alternatif dengan nilai preferensi tertinggi akan menjadi alternatif terbaik.

Metode SAW digunakan untuk menyelesaikan permasalahan yang memiliki beberapa alternatif dan beberapa kriteria penilaian. Dalam penelitian ini, alternatif yang dinilai adalah supplier aksesoris handphone, sedangkan kriteria yang digunakan adalah Harga, Kualitas, Pengiriman, Layanan, dan Kapasitas.

Sebelum menghitung nilai akhir, setiap nilai alternatif pada masing-masing kriteria harus dinormalisasi terlebih dahulu. Normalisasi dilakukan agar seluruh nilai kriteria berada pada skala yang sebanding. Proses normalisasi pada metode SAW dibedakan berdasarkan jenis kriteria, yaitu kriteria benefit dan kriteria cost.

Kriteria benefit adalah kriteria yang semakin besar nilainya maka semakin baik. Contoh kriteria benefit dalam penelitian ini adalah Kualitas, Pengiriman, Layanan, dan Kapasitas. Rumus normalisasi untuk kriteria benefit adalah sebagai berikut:

Kriteria cost adalah kriteria yang semakin kecil nilainya maka semakin baik. Contoh kriteria cost dalam penelitian ini adalah Harga. Rumus normalisasi untuk kriteria cost adalah sebagai berikut:

Keterangan:

rij = nilai rating kinerja ternormalisasi dari alternatif ke-i pada kriteria ke-j

xij = nilai alternatif ke-i pada kriteria ke-j

max(xij) = nilai maksimum pada kriteria ke-j

min(xij) = nilai minimum pada kriteria ke-j

Setelah proses normalisasi dilakukan, langkah selanjutnya adalah menghitung nilai preferensi atau skor akhir setiap alternatif. Nilai preferensi dihitung dengan menjumlahkan hasil perkalian antara bobot setiap kriteria dan nilai normalisasi setiap alternatif.

Rumus nilai preferensi adalah sebagai berikut:

Keterangan:

Vi = nilai preferensi atau skor akhir alternatif ke-i

wj = bobot kriteria ke-j

rij = nilai rating kinerja ternormalisasi alternatif ke-i pada kriteria ke-j

Σ = penjumlahan seluruh kriteria

Pada penelitian ini, terdapat bonus sebesar 0,05 bagi supplier yang menanggung ongkos kirim. Bonus tersebut ditambahkan setelah skor SAW dihitung. Dengan demikian, rumus akhir yang digunakan dalam sistem adalah sebagai berikut:

Keterangan:

Vi = nilai preferensi atau skor akhir alternatif ke-i

wj = bobot kriteria ke-j

rij = nilai rating kinerja ternormalisasi alternatif ke-i pada kriteria ke-j

Bi = bonus ongkos kirim pada alternatif ke-i

Nilai Bi bernilai 0,05 apabila supplier menanggung ongkos kirim, sedangkan Bi bernilai 0 apabila supplier tidak menanggung ongkos kirim. Supplier dengan nilai Vi ≥ 0,75 dinyatakan direkomendasikan, sedangkan supplier dengan nilai Vi < 0,75 dinyatakan tidak direkomendasikan.

## Identifikasi Kriteria dan Bobot

Berdasarkan hasil observasi dan wawancara dengan pemilik CV Anugerah Mega Makmur, terdapat lima kriteria utama yang digunakan dalam proses seleksi supplier aksesoris handphone. Setiap kriteria memiliki bobot yang mencerminkan tingkat kepentingannya. Berikut adalah rincian kriteria, jenis, dan bobotnya:

|  |  |  |  |  |
| --- | --- | --- | --- | --- |
| **No** | **Kriteria** | **Jenis** | **Bobot** | **Keterangan** |
| 1 | Harga | Cost | 30% | Semakin murah harga, semakin baik |
| 2 | Kualitas | Benefit | 30% | Semakin baik kualitas, semakin baik |
| 3 | Pengiriman | Benefit | 20% | Semakin cepat & tepat, semakin baik |
| 4 | Layanan | Benefit | 10% | Semakin responsif, semakin baik |
| 5 | Kapasitas | Benefit | 10% | Semakin besar stok, semakin baik |
| Bonus Ongkir | | Tambahan | +0.05 | Jika supplier menanggung ongkos kirim |

Tabel 2.1 Kriteria dan Bobot Penilaian Supplier

Tabel 2.1 menunjukkan bahwa terdapat lima kriteria utama dalam proses seleksi supplier, yaitu Harga, Kualitas, Pengiriman, Layanan, dan Kapasitas. Kriteria Harga termasuk dalam jenis cost karena semakin rendah harga yang ditawarkan supplier maka semakin baik bagi perusahaan. Sementara itu, Kualitas, Pengiriman, Layanan, dan Kapasitas termasuk dalam jenis benefit karena semakin tinggi nilainya maka semakin baik.

Bobot terbesar diberikan pada kriteria Harga dan Kualitas, masing-masing sebesar 30%. Hal ini menunjukkan bahwa perusahaan memprioritaskan supplier yang mampu memberikan harga kompetitif tanpa mengabaikan kualitas produk. Kriteria Pengiriman memiliki bobot 20% karena ketepatan dan kecepatan pengiriman berpengaruh terhadap ketersediaan stok barang. Kriteria Layanan dan Kapasitas masing-masing memiliki bobot 10%. Selain itu, supplier yang menanggung ongkos kirim memperoleh bonus tambahan sebesar 0,05 pada skor akhir.

## Perhitungan Manual Metode SAW

Untuk memahami penerapan metode SAW secara lebih mendalam, berikut akan disajikan perhitungan manual menggunakan 5 sampel supplier aksesoris handphone yang menjadi mitra CV Anugerah Mega Makmur. Perhitungan ini akan dilakukan langkah demi langkah sesuai dengan prosedur metode SAW yang telah dijelaskan pada subbab sebelumnya.

### Data Alternatif Supplier

Lima sampel supplier yang digunakan dalam perhitungan manual ini adalah sebagai berikut:

1. Pontianak Mobile Grosir - Menyediakan charger dengan berbagai merek
2. Khatulistiwa Gadget Supply - Menyediakan kabel data dan aksesoris gadget
3. Borneo Tech Distributor - Menyediakan aksesoris premium
4. Mega Jaya Cellular Pontianak - Menyediakan casing handphone
5. JBL Audio Partner - Menyediakan perangkat audio

Setiap supplier dinilai pada masing-masing kriteria menggunakan skala 1 sampai 10. Penilaian dilakukan oleh pemilik CV Anugerah Mega Makmur berdasarkan pengalaman dan data transaksi selama bekerja sama dengan supplier-supplier tersebut. Berikut adalah data nilai dari masing-masing alternatif:

|  |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- |
| **Alternatif** | **Harga** | **Kualitas** | **Pengiriman** | **Layanan** | **Kapasitas** | **Ongkir** |
| Pontianak Mobile Grosir | 9,1 | 9,0 | 8,8 | 8,6 | 9,2 | Tidak |
| Khatulistiwa Gadget Supply | 8,6 | 9,3 | 9,0 | 8,9 | 8,8 | Ya |
| Borneo Tech Distributor | 8,2 | 9,5 | 8,4 | 8,8 | 8,6 | Tidak |
| Mega Jaya Cellular | 8,9 | 8,8 | 9,2 | 8,7 | 8,9 | Tidak |
| JBL Audio Partner | 8,0 | 9,4 | 8,3 | 8,7 | 8,2 | Tidak |

Tabel 2.2 Data Alternatif Supplier

Tabel 2.2 menunjukkan data nilai kelima supplier pada setiap kriteria. Nilai-nilai ini kemudian dikonversi ke dalam skala 0-1 dengan cara membagi setiap nilai dengan 10. Hasil konversi dapat dilihat pada tabel berikut:

|  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
| **Alternatif** | **Harga** | **Kualitas** | **Pengiriman** | **Layanan** | **Kapasitas** |
| Pontianak Mobile Grosir | 0,91 | 0,90 | 0,88 | 0,86 | 0,92 |
| Khatulistiwa Gadget Supply | 0,86 | 0,93 | 0,90 | 0,89 | 0,88 |
| Borneo Tech Distributor | 0,82 | 0,95 | 0,84 | 0,88 | 0,86 |
| Mega Jaya Cellular | 0,89 | 0,88 | 0,92 | 0,87 | 0,89 |
| JBL Audio Partner | 0,80 | 0,94 | 0,83 | 0,87 | 0,82 |

Tabel 2.3 Konversi Nilai Supplier ke Skala 0-1

Setelah mendapatkan nilai dalam skala 0-1, langkah selanjutnya adalah menentukan nilai minimum dan maksimum untuk setiap kriteria. Nilai minimum digunakan untuk kriteria cost (Harga), sedangkan nilai maksimum digunakan untuk kriteria benefit (Kualitas, Pengiriman, Layanan, dan Kapasitas).

|  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
| **Harga** | | **Kualitas** | **Pengiriman** | **Layanan** | **Kapasitas** |
| Min (Cost) | 0,80 | - | - | - | - |
| Max (Benefit) | - | 0,95 | 0,92 | 0,89 | 0,92 |

Tabel 2.4 Nilai Minimum dan Maksimum Kriteria

Nilai minimum untuk Harga (kriteria cost) adalah 0,80 yang dimiliki oleh JBL Audio Partner. Nilai maksimum untuk Kualitas adalah 0,95 (Borneo Tech Distributor), Pengiriman adalah 0,92 (Mega Jaya Cellular), Layanan adalah 0,89 (Khatulistiwa Gadget Supply), dan Kapasitas adalah 0,92 (Pontianak Mobile Grosir).

### Perhitungan Nilai Preferensi

|  |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- |
| **Alternatif** | **Harga × 0,3** | **Kualitas × 0,3** | **Pengiriman × 0,2** | **Layanan × 0,1** | **Kapasitas × 0,1** | **Skor Akhir** |
| Pontianak Mobile Grosir | 0,2637 | 0,2842 | 0,1913 | 0,0966 | 0,1000 | 0,9358 |
| Khatulistiwa Gadget Supply | 0,2791 | 0,2937 | 0,1957 | 0,1000 | 0,0957 | 1,0142 |
| Borneo Tech Distributor | 0,2927 | 0,3000 | 0,1826 | 0,0989 | 0,0935 | 0,9677 |
| Mega Jaya Cellular | 0,2697 | 0,2779 | 0,2000 | 0,0978 | 0,0967 | 0,9421 |
| JBL Audio Partner | 0,3000 | 0,2969 | 0,1804 | 0,0978 | 0,0891 | 0,9642 |

Tabel 2.5 Perhitungan Nilai Preferensi

Contoh perhitungan Khatulistiwa Gadget Supply: Vi = (0,9302 × 0,3) + (0,9789 × 0,3) + (0,9783 × 0,2) + (1,0000 × 0,1) + (0,9565 × 0,1) + 0,05 = 1,0142.

### Perankingan Supplier

|  |  |  |  |  |
| --- | --- | --- | --- | --- |
| **Ranking** | **Supplier** | **Skor SAW** | **Threshold 0,75** | **Rekomendasi** |
| 1 | Khatulistiwa Gadget Supply | 1,0142 | ≥ 0,75 | Direkomendasikan |
| 2 | Borneo Tech Distributor | 0,9677 | ≥ 0,75 | Direkomendasikan |
| 3 | JBL Audio Partner | 0,9642 | ≥ 0,75 | Direkomendasikan |
| 4 | Mega Jaya Cellular | 0,9421 | ≥ 0,75 | Direkomendasikan |
| 5 | Pontianak Mobile Grosir | 0,9358 | ≥ 0,75 | Direkomendasikan |

Tabel 2.6 Perankingan Supplier

Berdasarkan hasil perankingan, Khatulistiwa Gadget Supply menempati peringkat pertama dengan skor 1,0142. Skor tersebut melebihi 1,0 karena supplier mendapatkan bonus ongkos kirim sebesar 0,05.

### Validasi Threshold Rekomendasi

Threshold sebesar 0,75 digunakan sebagai batas kelayakan awal dalam menentukan apakah supplier direkomendasikan atau tidak. Nilai tersebut dipilih karena menunjukkan bahwa supplier telah memenuhi minimal 75% dari keseluruhan bobot penilaian. Dengan adanya threshold, sistem tidak hanya menampilkan ranking supplier, tetapi juga memberikan status rekomendasi yang lebih mudah dipahami oleh pengguna. Nilai threshold ini dapat disesuaikan kembali oleh perusahaan apabila di masa depan terdapat perubahan standar penilaian supplier.

## Implementasi Sistem

Sistem pendukung keputusan seleksi supplier dirancang berbasis web. Sistem ini digunakan untuk mengelola data supplier, menyimpan nilai kriteria, menjalankan perhitungan SAW, dan menampilkan hasil ranking supplier. Secara umum, sistem terdiri dari antarmuka pengguna, proses perhitungan, dan penyimpanan data.

Fitur utama sistem meliputi pengelolaan data supplier, halaman kriteria penilaian, evaluasi supplier, dan hasil ranking. Dengan fitur tersebut, pengguna dapat melakukan evaluasi supplier secara lebih mudah dan terdokumentasi.

### Arsitektur Sistem

Sistem pendukung keputusan seleksi supplier dibangun dengan arsitektur berbasis web yang terdiri dari frontend, backend, dan database. Frontend digunakan sebagai antarmuka pengguna untuk mengakses halaman dashboard, data supplier, kriteria penilaian, dan evaluasi supplier. Backend digunakan untuk mengelola proses bisnis, menyediakan REST API, menjalankan algoritma perhitungan SAW, serta menghubungkan sistem dengan database. Database digunakan untuk menyimpan data supplier, nilai kriteria, skor akhir, ranking, dan riwayat hasil evaluasi.

Teknologi yang digunakan dalam pengembangan sistem adalah Next.js pada sisi frontend, NestJS pada sisi backend, Prisma ORM sebagai penghubung antara backend dan database, serta PostgreSQL sebagai sistem manajemen basis data. Pemisahan antara frontend dan backend membuat sistem lebih terstruktur karena tampilan pengguna dan proses pengolahan data berada pada bagian yang berbeda.

### Teknologi yang Digunakan

Teknologi yang digunakan dalam pengembangan sistem adalah sebagai berikut:

1. Next.js digunakan untuk membangun antarmuka sistem berbasis web, seperti halaman dashboard, data supplier, kriteria penilaian, dan evaluasi supplier.
2. NestJS digunakan sebagai backend REST API untuk menerima permintaan dari frontend, mengelola data supplier, menjalankan metode SAW, dan mengirim hasil evaluasi.
3. Prisma ORM digunakan untuk menghubungkan backend dengan database dan membantu proses pengelolaan data secara terstruktur.
4. PostgreSQL digunakan sebagai database untuk menyimpan data supplier, nilai kriteria, skor akhir, ranking, dan riwayat evaluasi.
5. Tailwind CSS digunakan untuk membantu pembuatan tampilan antarmuka agar lebih rapi, responsif, dan mudah digunakan.

### Fitur Sistem

1. Dashboard Supplier digunakan untuk menampilkan ringkasan informasi terkait supplier dan hasil evaluasi.
2. Data Supplier digunakan untuk menambah, mengubah, menghapus, dan melihat data supplier.
3. Kriteria Penilaian digunakan untuk menampilkan kriteria, jenis kriteria, dan bobot yang digunakan dalam metode SAW.
4. Evaluasi Supplier digunakan untuk menjalankan proses perhitungan SAW dan menampilkan hasil ranking supplier.
5. Riwayat Hasil Evaluasi digunakan untuk menyimpan hasil evaluasi sebagai dokumentasi dan bahan pertimbangan keputusan berikutnya.

### Alur Kerja Sistem

Alur kerja sistem dimulai dari pengguna melakukan login ke dalam aplikasi. Setelah masuk ke sistem, pengguna dapat mengelola data supplier melalui halaman Data Supplier. Data supplier yang dimasukkan mencakup nilai pada setiap kriteria penilaian, yaitu Harga, Kualitas, Pengiriman, Layanan, dan Kapasitas.

Setelah data supplier tersedia, pengguna dapat membuka halaman Evaluasi Supplier untuk menjalankan proses seleksi. Sistem kemudian mengambil data supplier yang aktif dari database. Nilai setiap supplier dikonversi ke skala 0 sampai 1, kemudian dilakukan normalisasi berdasarkan jenis kriteria. Untuk kriteria Harga yang bersifat cost, sistem menggunakan nilai minimum sebagai pembanding. Untuk kriteria Kualitas, Pengiriman, Layanan, dan Kapasitas yang bersifat benefit, sistem menggunakan nilai maksimum sebagai pembanding.

Setelah proses normalisasi selesai, sistem menghitung skor akhir dengan mengalikan nilai normalisasi setiap kriteria dengan bobot masing-masing. Jika supplier menanggung ongkos kirim, maka sistem menambahkan bonus sebesar 0,05 pada skor akhir. Selanjutnya, sistem mengurutkan supplier berdasarkan skor tertinggi dan menampilkan hasil ranking. Supplier dengan skor akhir lebih besar atau sama dengan 0,75 dinyatakan direkomendasikan.

### Endpoint Backend

Backend sistem menyediakan beberapa endpoint utama untuk mendukung proses seleksi supplier. Endpoint tersebut digunakan oleh frontend untuk mengirim dan mengambil data melalui REST API.

|  |  |
| --- | --- |
| **Endpoint** | **Fungsi** |
| /api/spk/suppliers | Mengelola data supplier |
| /api/spk/supplier-selection | Menjalankan proses evaluasi supplier menggunakan metode SAW |
| /api/auth/login | Melakukan proses login pengguna |
| /api/auth/profile | Mengambil data profil pengguna yang sedang login |

Tabel 2.7 Endpoint Backend Sistem

Endpoint /api/spk/suppliers digunakan untuk proses tambah, ubah, hapus, dan lihat data supplier. Endpoint /api/spk/supplier-selection digunakan untuk menjalankan proses perhitungan SAW dan menghasilkan ranking supplier. Seluruh endpoint selain login membutuhkan token autentikasi agar hanya pengguna yang memiliki akses yang dapat menggunakan sistem.

### Diagram Arsitektur Sistem

![](data:image/png;base64...)

Gambar 2.1 Arsitektur Sistem SPK Seleksi Supplier

1. Pengguna mengakses sistem melalui browser.
2. Frontend Next.js menampilkan halaman dan mengirim permintaan data ke backend.
3. Backend NestJS menerima permintaan dari frontend dan menjalankan proses bisnis.
4. Prisma ORM digunakan untuk mengakses dan mengelola data pada database.
5. PostgreSQL menyimpan data supplier dan hasil evaluasi.
6. Hasil perhitungan dikirim kembali dari backend ke frontend untuk ditampilkan kepada pengguna.

### Tampilan Antarmuka Sistem

Tampilan antarmuka sistem terdiri dari beberapa halaman utama yang digunakan untuk mendukung proses seleksi supplier. Halaman-halaman tersebut antara lain dashboard supplier, data supplier, kriteria penilaian, dan evaluasi supplier.

Dashboard supplier digunakan untuk menampilkan ringkasan informasi mengenai supplier dan hasil evaluasi. Halaman data supplier digunakan untuk mengelola data supplier yang akan dinilai. Halaman kriteria penilaian digunakan untuk menampilkan kriteria, bobot, dan jenis kriteria yang digunakan dalam metode SAW. Halaman evaluasi supplier digunakan untuk menjalankan proses perhitungan dan menampilkan hasil ranking supplier berdasarkan skor akhir.

![](data:image/png;base64...)

Gambar 2.2 Tampilan Dashboard Supplier

![](data:image/png;base64...)

Gambar 2.3 Tampilan Data Supplier

![](data:image/png;base64...)

Gambar 2.4 Tampilan Kriteria Penilaian

![](data:image/png;base64...)

Gambar 2.5 Tampilan Evaluasi Supplier

## Perbandingan Hasil Manual dan Web

Setelah melakukan perhitungan manual dan implementasi sistem, langkah selanjutnya adalah membandingkan hasil keduanya untuk memvalidasi keakuratan sistem. Berikut adalah tabel perbandingan hasil perhitungan manual dan hasil perhitungan pada sistem berbasis web:

|  |  |  |  |
| --- | --- | --- | --- |
| **Supplier** | **Skor Manual** | **Skor Web** | **Selisih** |
| Pontianak Mobile Grosir | 0,9358 | 0,9358 | 0,0000 |
| Khatulistiwa Gadget Supply | 1,0142 | 1,0142 | 0,0000 |
| Borneo Tech Distributor | 0,9677 | 0,9677 | 0,0000 |
| Mega Jaya Cellular | 0,9421 | 0,9421 | 0,0000 |
| JBL Audio Partner | 0,9642 | 0,9642 | 0,0000 |

Tabel 2.8 Perbandingan Hasil Manual dan Sistem

Kesamaan antara hasil perhitungan manual dan hasil perhitungan sistem menunjukkan bahwa algoritma SAW telah diimplementasikan dengan benar pada sistem. Proses normalisasi, pembobotan, penambahan bonus ongkir, dan perankingan menghasilkan nilai yang sama dengan perhitungan manual. Dengan demikian, sistem dapat digunakan sebagai alat bantu yang valid untuk mendukung proses pengambilan keputusan dalam seleksi supplier.

## Dokumentasi Observasi dan Wawancara

Observasi dan wawancara dilakukan untuk memperoleh informasi mengenai proses bisnis yang berjalan pada CV Anugerah Mega Makmur, khususnya dalam proses pemilihan supplier aksesoris handphone. Kegiatan ini bertujuan untuk mengetahui permasalahan yang dihadapi, kriteria yang digunakan dalam pemilihan supplier, serta kebutuhan sistem pendukung keputusan.

### Hasil Observasi

Berdasarkan hasil observasi, proses pencatatan supplier pada CV Anugerah Mega Makmur masih dilakukan secara manual dan belum memiliki sistem evaluasi yang terstruktur. Penilaian supplier masih bergantung pada pengalaman pemilik atau pengelola. Selain itu, belum terdapat bobot kriteria yang digunakan sebagai dasar perbandingan antar supplier.

Data supplier belum dikelola dalam sistem yang terstruktur.

Penilaian supplier masih dilakukan berdasarkan pengalaman.

Belum terdapat metode perhitungan yang digunakan untuk membandingkan supplier.

Kriteria pemilihan supplier belum terdokumentasi secara formal.

Perusahaan membutuhkan sistem yang dapat membantu proses evaluasi supplier.

### Hasil Wawancara

Berdasarkan hasil wawancara, diketahui bahwa harga dan kualitas merupakan kriteria utama dalam pemilihan supplier. Selain itu, pengiriman, layanan, dan kapasitas stok juga menjadi faktor penting yang dipertimbangkan. Pemilik atau pengelola membutuhkan sistem yang dapat membantu menilai supplier secara lebih objektif agar proses pemilihan tidak hanya berdasarkan perkiraan atau pengalaman pribadi.

Proses pemilihan supplier masih dilakukan secara manual.

Kriteria yang digunakan dalam pemilihan supplier adalah Harga, Kualitas, Pengiriman, Layanan, dan Kapasitas.

Harga dan kualitas menjadi kriteria yang paling penting.

Belum terdapat sistem yang menghitung dan membandingkan supplier secara otomatis.

Sistem pendukung keputusan dibutuhkan untuk membantu menghasilkan rekomendasi supplier.

## Kelebihan dan Keterbatasan Metode SAW

Metode Simple Additive Weighting memiliki beberapa kelebihan dalam proses seleksi supplier. Pertama, metode ini mudah dipahami karena menggunakan konsep penjumlahan terbobot. Kedua, proses perhitungannya sederhana sehingga mudah diterapkan pada sistem berbasis web. Ketiga, metode SAW dapat membandingkan beberapa supplier berdasarkan banyak kriteria secara objektif. Keempat, hasil akhir metode SAW dapat ditampilkan dalam bentuk ranking sehingga memudahkan pengguna dalam menentukan supplier terbaik.

Meskipun demikian, metode SAW juga memiliki keterbatasan. Hasil akhir sangat bergantung pada bobot kriteria yang ditentukan di awal. Jika bobot tidak sesuai dengan kebutuhan perusahaan, maka hasil rekomendasi juga dapat menjadi kurang tepat. Selain itu, nilai penilaian supplier masih membutuhkan input dari pengguna sehingga tetap memerlukan ketelitian dalam proses pengisian data. Oleh karena itu, penggunaan metode SAW sebaiknya tetap didukung dengan data supplier yang akurat dan evaluasi berkala terhadap bobot kriteria.

# PENUTUP

## Kesimpulan

Berdasarkan hasil pembahasan, perhitungan, dan pengujian yang telah dilakukan, dapat disimpulkan bahwa:

Proses seleksi supplier aksesoris handphone pada CV Anugerah Mega Makmur dapat diselesaikan menggunakan metode Simple Additive Weighting (SAW) dengan lima kriteria penilaian, yaitu Harga, Kualitas, Pengiriman, Layanan, dan Kapasitas.

Kriteria Harga termasuk dalam kriteria cost karena semakin rendah harga yang ditawarkan maka semakin baik bagi perusahaan. Sedangkan kriteria Kualitas, Pengiriman, Layanan, dan Kapasitas termasuk dalam kriteria benefit karena semakin tinggi nilainya maka semakin baik.

Bobot kriteria yang digunakan dalam proses seleksi supplier adalah Harga sebesar 30%, Kualitas sebesar 30%, Pengiriman sebesar 20%, Layanan sebesar 10%, dan Kapasitas sebesar 10%. Selain itu, terdapat bonus sebesar 0,05 bagi supplier yang menanggung ongkos kirim.

Berdasarkan hasil perhitungan manual metode SAW, Khatulistiwa Gadget Supply memperoleh skor tertinggi sebesar 1,0142 dan menempati peringkat pertama sebagai supplier yang paling direkomendasikan.

Hasil perhitungan sistem berbasis web menunjukkan nilai yang sama dengan hasil perhitungan manual. Selisih sebesar 0,0000 pada seluruh alternatif menunjukkan bahwa sistem telah mengimplementasikan metode SAW dengan benar.

Sistem pendukung keputusan berbasis web yang dibangun menggunakan Next.js, NestJS, Prisma, dan PostgreSQL mampu membantu proses pengelolaan data supplier, perhitungan metode SAW, perangkingan supplier, serta penyimpanan hasil evaluasi. Dengan adanya sistem ini, proses seleksi supplier menjadi lebih objektif, terstruktur, dan terdokumentasi. Dengan adanya sistem ini, proses seleksi supplier menjadi lebih objektif, terstruktur, dan terdokumentasi.

Ruang lingkup sistem pada laporan ini difokuskan pada modul seleksi supplier. Oleh karena itu, fitur lain di luar proses evaluasi supplier tidak menjadi pembahasan utama dalam laporan ini

## Future Works

Untuk pengembangan selanjutnya, terdapat beberapa hal yang dapat dilakukan, yaitu:

Sistem dapat dikembangkan dengan menambahkan kriteria penilaian lain, seperti garansi produk, reputasi supplier, lama kerja sama, dan kelengkapan dokumen.

Data penilaian supplier sebaiknya diperbarui secara berkala agar hasil evaluasi tetap sesuai dengan kondisi terbaru.

Sistem dapat dikembangkan agar terintegrasi dengan data pembelian atau data stok barang sehingga proses penilaian supplier dapat dilakukan berdasarkan data transaksi yang lebih lengkap.

Penelitian selanjutnya dapat membandingkan metode SAW dengan metode lain, seperti AHP, TOPSIS, atau Weighted Product untuk mengetahui metode yang paling sesuai dalam kasus seleksi supplier.

Sistem dapat ditambahkan fitur ekspor laporan ke PDF atau Excel agar hasil evaluasi supplier dapat didokumentasikan dan digunakan sebagai bahan pertimbangan dalam pengambilan keputusan.

Sistem dapat dikembangkan dengan menambahkan fitur pengaturan bobot kriteria secara dinamis, sehingga perusahaan dapat menyesuaikan bobot penilaian sesuai kebutuhan tanpa harus mengubah kode program.

Sistem dapat dikembangkan dengan fitur cetak laporan hasil evaluasi supplier dalam format PDF agar hasil keputusan dapat disimpan sebagai dokumen resmi perusahaan.

Sistem dapat dikembangkan dengan grafik analisis hasil evaluasi supplier agar pengguna dapat melihat perbandingan performa supplier secara lebih visual.

# DAFTAR PUSTAKA

Afshari, A., Mojahed, M., & Yusuff, R. M. (2010). Simple Additive Weighting approach to personnel selection problem. International Journal of Innovation, Management and Technology, 1(5), 511-515.

Kusumadewi, S., Hartati, S., Harjoko, A., & Wardoyo, R. (2006). Fuzzy Multi-Attribute Decision Making (Fuzzy MADM). Yogyakarta: Graha Ilmu.

NestJS. (2026). NestJS Documentation. Diakses dari https://docs.nestjs.com/

Next.js. (2026). Next.js Documentation. Diakses dari https://nextjs.org/docs

PostgreSQL Global Development Group. (2026). PostgreSQL Documentation. Diakses dari https://www.postgresql.org/docs/

Prisma. (2026). Prisma Documentation. Diakses dari https://www.prisma.io/docs

Suryadi, K., & Ramdhani, M. A. (2000). Sistem Pendukung Keputusan: Suatu Wacana Struktural Idealisasi dan Implementasi Konsep Pengambilan Keputusan. Bandung: PT Remaja Rosdakarya.

Turban, E., Aronson, J. E., & Liang, T. P. (2005). Decision Support Systems and Intelligent Systems (7th ed.). New Jersey: Pearson Education.

# LAMPIRAN

## LAMPIRAN 1. DOKUMENTASI WAWANCARA

Dokumentasi berikut merupakan bukti kegiatan wawancara yang dilakukan oleh tim penyusun dengan pihak CV Anugerah Mega Makmur Pontianak. Wawancara dilakukan untuk memperoleh informasi mengenai proses pemilihan supplier, kriteria penilaian supplier, serta kebutuhan sistem pendukung keputusan dalam proses seleksi supplier.

![](data:image/jpeg;base64...)

Gambar Lampiran 1. Dokumentasi wawancara tim penyusun dengan pihak CV Anugerah Mega Makmur Pontianak.