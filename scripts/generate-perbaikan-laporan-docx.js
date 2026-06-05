const fs = require('fs');
const path = require('path');
const {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} = require('docx');

const outPath = path.join(__dirname, '..', 'PERBAIKAN_DRAF_LAPORAN.docx');

function p(text = '', options = {}) {
  return new Paragraph({
    spacing: { after: options.after ?? 160 },
    alignment: options.alignment,
    heading: options.heading,
    children: [
      new TextRun({
        text,
        bold: options.bold,
        size: options.size,
      }),
    ],
  });
}

function title(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 240 },
    children: [new TextRun({ text, bold: true, size: 28 })],
  });
}

function h1(text) {
  return p(text, { heading: HeadingLevel.HEADING_1, bold: true, after: 200 });
}

function h2(text) {
  return p(text, { heading: HeadingLevel.HEADING_2, bold: true, after: 160 });
}

function bullet(text) {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 100 },
    children: [new TextRun(text)],
  });
}

function code(text) {
  return new Paragraph({
    spacing: { after: 160 },
    children: [new TextRun({ text, font: 'Courier New', size: 20 })],
  });
}

function table(headers, rows) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: headers.map((cell) =>
          new TableCell({
            children: [p(cell, { bold: true, after: 80 })],
          }),
        ),
      }),
      ...rows.map((row) =>
        new TableRow({
          children: row.map((cell) =>
            new TableCell({
              children: [p(cell, { after: 80 })],
            }),
          ),
        }),
      ),
    ],
  });
}

const children = [
  title('PERBAIKAN DRAF LAPORAN'),
  title('SPK SELEKSI SUPPLIER CV ANUGERAH MEGA MAKMUR'),
  p('Dokumen ini berisi bagian perbaikan saja. Bagian yang sudah benar tidak dimasukkan kembali agar mudah digunakan sebagai bahan copy-paste ke laporan utama.'),

  h1('1. Perbaikan Judul'),
  p('Ganti judul laporan menjadi:'),
  code('IMPLEMENTASI METODE SIMPLE ADDITIVE WEIGHTING (SAW) DALAM SISTEM PENDUKUNG KEPUTUSAN SELEKSI SUPPLIER AKSESORIS HANDPHONE PADA CV ANUGERAH MEGA MAKMUR PONTIANAK'),
  p('Ganti juga tulisan SISTEM PENUNJANG KEPUTUSAN menjadi SISTEM PENDUKUNG KEPUTUSAN.'),

  h1('2. Tambahan Pada Batasan Masalah'),
  p('Tambahkan poin berikut pada bagian 1.4 Batasan Masalah:'),
  p('Sistem yang dibahas dalam laporan ini difokuskan pada modul Sistem Pendukung Keputusan seleksi supplier. Modul lain yang terdapat pada struktur project, seperti data karyawan, absensi, payroll, cuti, pelatihan, dan rekrutmen tidak menjadi ruang lingkup pembahasan karena tidak digunakan dalam proses evaluasi supplier.'),

  h1('3. Perbaikan Rumusan Masalah'),
  p('Ganti rumusan masalah nomor 3 menjadi:'),
  p('Bagaimana merancang dan membangun sistem pendukung keputusan berbasis web untuk membantu proses seleksi supplier?'),

  h1('4. Perbaikan Tujuan Penelitian'),
  p('Ganti tujuan nomor 3 menjadi:'),
  p('Merancang dan membangun sistem pendukung keputusan berbasis web yang dapat membantu proses evaluasi supplier secara objektif, terstruktur, dan terdokumentasi.'),

  h1('5. Tambahan Pada Metode Penelitian'),
  p('Tambahkan paragraf berikut di akhir bagian 1.6 Metode Penelitian:'),
  p('Pengembangan sistem dilakukan dengan pendekatan implementasi berbasis web. Sistem dibangun dengan memisahkan bagian frontend, backend, dan database. Frontend digunakan sebagai antarmuka pengguna untuk mengelola data supplier dan melihat hasil evaluasi. Backend digunakan untuk menyediakan API, menjalankan proses perhitungan metode SAW, serta mengelola penyimpanan data. Database digunakan untuk menyimpan data supplier dan hasil evaluasi agar dapat digunakan kembali sebagai riwayat pengambilan keputusan.'),

  h1('6. Tambahan Rumus SAW Pada Landasan Teori'),
  p('Letakkan setelah paragraf yang menjelaskan kriteria benefit dan cost.'),
  p('Rumus normalisasi untuk kriteria benefit adalah sebagai berikut:'),
  code('rij = xij / max(xij)'),
  p('Rumus normalisasi untuk kriteria cost adalah sebagai berikut:'),
  code('rij = min(xij) / xij'),
  p('Keterangan:'),
  bullet('rij = nilai rating kinerja ternormalisasi dari alternatif ke-i pada kriteria ke-j'),
  bullet('xij = nilai alternatif ke-i pada kriteria ke-j'),
  bullet('max(xij) = nilai maksimum pada kriteria ke-j'),
  bullet('min(xij) = nilai minimum pada kriteria ke-j'),
  p('Setelah nilai setiap kriteria dinormalisasi, langkah selanjutnya adalah menghitung nilai preferensi atau skor akhir setiap alternatif. Rumus nilai preferensi adalah sebagai berikut:'),
  code('Vi = Σ(wj × rij)'),
  p('Keterangan:'),
  bullet('Vi = nilai preferensi atau skor akhir alternatif ke-i'),
  bullet('wj = bobot kriteria ke-j'),
  bullet('rij = nilai rating kinerja ternormalisasi alternatif ke-i pada kriteria ke-j'),
  bullet('Σ = penjumlahan seluruh kriteria'),

  h1('7. Tambahan Rumus Bonus Ongkir'),
  p('Pada sistem yang dibangun, terdapat tambahan bonus ongkos kirim untuk supplier yang menanggung biaya pengiriman. Bonus ini diberikan sebesar 0,05 pada skor akhir. Dengan demikian, rumus akhir yang digunakan adalah sebagai berikut:'),
  code('Vi = Σ(wj × rij) + Bi'),
  p('Keterangan:'),
  bullet('Bi = bonus ongkos kirim pada alternatif ke-i'),
  p('Nilai Bi adalah 0,05 apabila supplier menanggung ongkos kirim, sedangkan Bi adalah 0 apabila supplier tidak menanggung ongkos kirim. Supplier dengan nilai Vi >= 0,75 dinyatakan direkomendasikan, sedangkan supplier dengan nilai Vi < 0,75 dinyatakan tidak direkomendasikan.'),

  h1('8. Perbaikan Tabel Kriteria'),
  p('Ganti tabel kriteria yang sekarang dengan tabel berikut:'),
  table(
    ['No', 'Kriteria', 'Jenis', 'Bobot', 'Keterangan'],
    [
      ['1', 'Harga', 'Cost', '30%', 'Semakin rendah harga, semakin baik'],
      ['2', 'Kualitas', 'Benefit', '30%', 'Semakin tinggi kualitas, semakin baik'],
      ['3', 'Pengiriman', 'Benefit', '20%', 'Semakin cepat dan tepat pengiriman, semakin baik'],
      ['4', 'Layanan', 'Benefit', '10%', 'Semakin responsif layanan supplier, semakin baik'],
      ['5', 'Kapasitas', 'Benefit', '10%', 'Semakin besar kapasitas stok, semakin baik'],
      ['-', 'Bonus Ongkir', 'Tambahan', '+0,05', 'Diberikan jika supplier menanggung ongkos kirim'],
    ],
  ),
  p('Judul tabel: Tabel 2.1 Kriteria dan Bobot Penilaian Supplier'),

  h1('9. Perbaikan Paragraf Setelah Tabel Kriteria'),
  p('Tabel 2.1 menunjukkan bahwa terdapat lima kriteria utama dalam proses seleksi supplier, yaitu Harga, Kualitas, Pengiriman, Layanan, dan Kapasitas. Kriteria Harga termasuk dalam jenis cost karena semakin rendah harga yang ditawarkan supplier maka semakin baik bagi perusahaan. Sementara itu, Kualitas, Pengiriman, Layanan, dan Kapasitas termasuk dalam jenis benefit karena semakin tinggi nilainya maka semakin baik.'),
  p('Bobot terbesar diberikan pada kriteria Harga dan Kualitas, masing-masing sebesar 30%. Hal ini menunjukkan bahwa perusahaan memprioritaskan supplier yang mampu memberikan harga kompetitif tanpa mengabaikan kualitas produk. Kriteria Pengiriman memiliki bobot 20% karena ketepatan dan kecepatan pengiriman berpengaruh terhadap ketersediaan stok barang. Kriteria Layanan dan Kapasitas masing-masing memiliki bobot 10%. Selain itu, supplier yang menanggung ongkos kirim memperoleh bonus tambahan sebesar 0,05 pada skor akhir.'),

  h1('10. Tambahan Subbab Implementasi Sistem'),
  h2('2.5.1 Arsitektur Sistem'),
  p('Sistem pendukung keputusan seleksi supplier dibangun dengan arsitektur berbasis web yang terdiri dari frontend, backend, dan database. Frontend digunakan sebagai antarmuka pengguna untuk mengakses halaman dashboard, data supplier, kriteria penilaian, dan evaluasi supplier. Backend digunakan untuk mengelola proses bisnis, menyediakan REST API, menjalankan algoritma perhitungan SAW, serta menghubungkan sistem dengan database. Database digunakan untuk menyimpan data supplier, nilai kriteria, skor akhir, ranking, dan riwayat hasil evaluasi.'),
  p('Teknologi yang digunakan dalam pengembangan sistem adalah Next.js pada sisi frontend, NestJS pada sisi backend, Prisma ORM sebagai penghubung antara backend dan database, serta PostgreSQL sebagai sistem manajemen basis data. Pemisahan antara frontend dan backend membuat sistem lebih terstruktur karena tampilan pengguna dan proses pengolahan data berada pada bagian yang berbeda.'),

  h2('2.5.2 Teknologi yang Digunakan'),
  p('Teknologi yang digunakan dalam pengembangan sistem adalah sebagai berikut:'),
  bullet('Next.js digunakan untuk membangun antarmuka sistem berbasis web, seperti halaman dashboard, data supplier, kriteria penilaian, dan evaluasi supplier.'),
  bullet('NestJS digunakan sebagai backend REST API untuk menerima permintaan dari frontend, mengelola data supplier, menjalankan metode SAW, dan mengirim hasil evaluasi.'),
  bullet('Prisma ORM digunakan untuk menghubungkan backend dengan database dan membantu proses pengelolaan data secara terstruktur.'),
  bullet('PostgreSQL digunakan sebagai database untuk menyimpan data supplier, nilai kriteria, skor akhir, ranking, dan riwayat evaluasi.'),
  bullet('Tailwind CSS digunakan untuk membantu pembuatan tampilan antarmuka agar lebih rapi, responsif, dan mudah digunakan.'),

  h2('2.5.3 Fitur Sistem'),
  bullet('Dashboard Supplier digunakan untuk menampilkan ringkasan informasi terkait supplier dan hasil evaluasi.'),
  bullet('Data Supplier digunakan untuk menambah, mengubah, menghapus, dan melihat data supplier.'),
  bullet('Kriteria Penilaian digunakan untuk menampilkan kriteria, jenis kriteria, dan bobot yang digunakan dalam metode SAW.'),
  bullet('Evaluasi Supplier digunakan untuk menjalankan proses perhitungan SAW dan menampilkan hasil ranking supplier.'),
  bullet('Riwayat Hasil Evaluasi digunakan untuk menyimpan hasil evaluasi sebagai dokumentasi dan bahan pertimbangan keputusan berikutnya.'),

  h2('2.5.4 Alur Kerja Sistem'),
  p('Alur kerja sistem dimulai dari pengguna melakukan login ke dalam aplikasi. Setelah masuk ke sistem, pengguna dapat mengelola data supplier melalui halaman Data Supplier. Data supplier yang dimasukkan mencakup nilai pada setiap kriteria penilaian, yaitu Harga, Kualitas, Pengiriman, Layanan, dan Kapasitas.'),
  p('Setelah data supplier tersedia, pengguna dapat membuka halaman Evaluasi Supplier untuk menjalankan proses seleksi. Sistem kemudian mengambil data supplier yang aktif dari database. Nilai setiap supplier dikonversi ke skala 0 sampai 1, kemudian dilakukan normalisasi berdasarkan jenis kriteria. Untuk kriteria Harga yang bersifat cost, sistem menggunakan nilai minimum sebagai pembanding. Untuk kriteria Kualitas, Pengiriman, Layanan, dan Kapasitas yang bersifat benefit, sistem menggunakan nilai maksimum sebagai pembanding.'),
  p('Setelah proses normalisasi selesai, sistem menghitung skor akhir dengan mengalikan nilai normalisasi setiap kriteria dengan bobot masing-masing. Jika supplier menanggung ongkos kirim, maka sistem menambahkan bonus sebesar 0,05 pada skor akhir. Selanjutnya, sistem mengurutkan supplier berdasarkan skor tertinggi dan menampilkan hasil ranking. Supplier dengan skor akhir lebih besar atau sama dengan 0,75 dinyatakan direkomendasikan.'),

  h2('2.5.5 Endpoint Backend'),
  p('Backend sistem menyediakan beberapa endpoint utama untuk mendukung proses seleksi supplier. Endpoint tersebut digunakan oleh frontend untuk mengirim dan mengambil data melalui REST API.'),
  table(
    ['Endpoint', 'Fungsi'],
    [
      ['/api/spk/suppliers', 'Mengelola data supplier'],
      ['/api/spk/supplier-selection', 'Menjalankan proses evaluasi supplier menggunakan metode SAW'],
      ['/api/auth/login', 'Melakukan proses login pengguna'],
      ['/api/auth/profile', 'Mengambil data profil pengguna yang sedang login'],
    ],
  ),
  p('Endpoint /api/spk/suppliers digunakan untuk proses tambah, ubah, hapus, dan lihat data supplier. Endpoint /api/spk/supplier-selection digunakan untuk menjalankan proses perhitungan SAW dan menghasilkan ranking supplier. Seluruh endpoint selain login membutuhkan token autentikasi agar hanya pengguna yang memiliki akses yang dapat menggunakan sistem.'),

  h2('2.5.6 Diagram Arsitektur Sistem'),
  p('Gambaran arsitektur sistem:'),
  code('Pengguna -> Frontend Next.js -> Backend NestJS REST API -> Prisma ORM -> Database PostgreSQL'),
  bullet('Pengguna mengakses sistem melalui browser.'),
  bullet('Frontend Next.js menampilkan halaman dan mengirim permintaan data ke backend.'),
  bullet('Backend NestJS menerima permintaan dari frontend dan menjalankan proses bisnis.'),
  bullet('Prisma ORM digunakan untuk mengakses dan mengelola data pada database.'),
  bullet('PostgreSQL menyimpan data supplier dan hasil evaluasi.'),
  bullet('Hasil perhitungan dikirim kembali dari backend ke frontend untuk ditampilkan kepada pengguna.'),

  h2('2.5.7 Tampilan Antarmuka Sistem'),
  p('Tampilan antarmuka sistem terdiri dari beberapa halaman utama yang digunakan untuk mendukung proses seleksi supplier. Halaman-halaman tersebut antara lain dashboard supplier, data supplier, kriteria penilaian, dan evaluasi supplier.'),
  p('Dashboard supplier digunakan untuk menampilkan ringkasan informasi mengenai supplier dan hasil evaluasi. Halaman data supplier digunakan untuk mengelola data supplier yang akan dinilai. Halaman kriteria penilaian digunakan untuk menampilkan kriteria, bobot, dan jenis kriteria yang digunakan dalam metode SAW. Halaman evaluasi supplier digunakan untuk menjalankan proses perhitungan dan menampilkan hasil ranking supplier berdasarkan skor akhir.'),
  bullet('Gambar 2.1 Tampilan Dashboard Supplier'),
  bullet('Gambar 2.2 Tampilan Data Supplier'),
  bullet('Gambar 2.3 Tampilan Kriteria Penilaian'),
  bullet('Gambar 2.4 Tampilan Evaluasi Supplier'),

  h1('11. Tambahan Validasi Threshold'),
  p('Threshold sebesar 0,75 digunakan sebagai batas kelayakan awal dalam menentukan apakah supplier direkomendasikan atau tidak. Nilai tersebut dipilih karena menunjukkan bahwa supplier telah memenuhi minimal 75% dari keseluruhan bobot penilaian. Dengan adanya threshold, sistem tidak hanya menampilkan ranking supplier, tetapi juga memberikan status rekomendasi yang lebih mudah dipahami oleh pengguna. Nilai threshold ini dapat disesuaikan kembali oleh perusahaan apabila di masa depan terdapat perubahan standar penilaian supplier.'),

  h1('12. Perbaikan Bagian Perbandingan Manual dan Web'),
  p('Tambahkan paragraf ini setelah tabel perbandingan manual dan web:'),
  p('Kesamaan antara hasil perhitungan manual dan hasil perhitungan sistem menunjukkan bahwa algoritma SAW telah diimplementasikan dengan benar pada sistem. Proses normalisasi, pembobotan, penambahan bonus ongkir, dan perankingan menghasilkan nilai yang sama dengan perhitungan manual. Dengan demikian, sistem dapat digunakan sebagai alat bantu yang valid untuk mendukung proses pengambilan keputusan dalam seleksi supplier.'),

  h1('13. Tambahan Kelebihan dan Keterbatasan Metode SAW'),
  p('Letakkan sebelum BAB III Penutup.'),
  h2('2.8 Kelebihan dan Keterbatasan Metode SAW'),
  p('Metode Simple Additive Weighting memiliki beberapa kelebihan dalam proses seleksi supplier. Pertama, metode ini mudah dipahami karena menggunakan konsep penjumlahan terbobot. Kedua, proses perhitungannya sederhana sehingga mudah diterapkan pada sistem berbasis web. Ketiga, metode SAW dapat membandingkan beberapa supplier berdasarkan banyak kriteria secara objektif. Keempat, hasil akhir metode SAW dapat ditampilkan dalam bentuk ranking sehingga memudahkan pengguna dalam menentukan supplier terbaik.'),
  p('Meskipun demikian, metode SAW juga memiliki keterbatasan. Hasil akhir sangat bergantung pada bobot kriteria yang ditentukan di awal. Jika bobot tidak sesuai dengan kebutuhan perusahaan, maka hasil rekomendasi juga dapat menjadi kurang tepat. Selain itu, nilai penilaian supplier masih membutuhkan input dari pengguna sehingga tetap memerlukan ketelitian dalam proses pengisian data. Oleh karena itu, penggunaan metode SAW sebaiknya tetap didukung dengan data supplier yang akurat dan evaluasi berkala terhadap bobot kriteria.'),

  h1('14. Perbaikan Kesimpulan'),
  p('Tambahkan poin berikut pada bagian kesimpulan:'),
  bullet('Sistem pendukung keputusan berbasis web yang dibangun menggunakan Next.js, NestJS, Prisma, dan PostgreSQL mampu membantu proses pengelolaan data supplier, perhitungan metode SAW, perangkingan supplier, serta penyimpanan hasil evaluasi. Dengan adanya sistem ini, proses seleksi supplier menjadi lebih objektif, terstruktur, dan terdokumentasi.'),
  bullet('Ruang lingkup sistem pada laporan ini difokuskan pada modul seleksi supplier. Oleh karena itu, fitur lain di luar proses evaluasi supplier tidak menjadi pembahasan utama dalam laporan ini.'),

  h1('15. Perbaikan Future Works'),
  p('Tambahkan poin berikut pada bagian Future Works:'),
  bullet('Sistem dapat dikembangkan dengan menambahkan fitur pengaturan bobot kriteria secara dinamis, sehingga perusahaan dapat menyesuaikan bobot penilaian sesuai kebutuhan tanpa harus mengubah kode program.'),
  bullet('Sistem dapat dikembangkan dengan fitur cetak laporan hasil evaluasi supplier dalam format PDF agar hasil keputusan dapat disimpan sebagai dokumen resmi perusahaan.'),
  bullet('Sistem dapat dikembangkan dengan grafik analisis hasil evaluasi supplier agar pengguna dapat melihat perbandingan performa supplier secara lebih visual.'),
  bullet('Sistem dapat dikembangkan dengan integrasi data pembelian dan stok barang sehingga nilai supplier dapat dihitung berdasarkan data transaksi yang lebih objektif.'),

  h1('16. Tambahan Daftar Pustaka Teknologi'),
  p('Tambahkan ke bagian daftar pustaka:'),
  p('NestJS. (2026). NestJS Documentation. Diakses dari https://docs.nestjs.com/'),
  p('Next.js. (2026). Next.js Documentation. Diakses dari https://nextjs.org/docs'),
  p('PostgreSQL Global Development Group. (2026). PostgreSQL Documentation. Diakses dari https://www.postgresql.org/docs/'),
  p('Prisma. (2026). Prisma Documentation. Diakses dari https://www.prisma.io/docs'),

  h1('17. Isi Daftar Tabel'),
  p('Jika bagian DAFTAR TABEL masih kosong, isi dengan ini:'),
  bullet('Tabel 2.1 Kriteria dan Bobot Penilaian Supplier'),
  bullet('Tabel 2.2 Data Alternatif Supplier'),
  bullet('Tabel 2.3 Konversi Nilai Supplier ke Skala 0-1'),
  bullet('Tabel 2.4 Nilai Minimum dan Maksimum Kriteria'),
  bullet('Tabel 2.5 Perhitungan Nilai Preferensi'),
  bullet('Tabel 2.6 Perankingan Supplier'),
  bullet('Tabel 2.7 Perbandingan Hasil Manual dan Sistem'),

  h1('18. Isi Daftar Gambar'),
  p('Jika menambahkan screenshot, tambahkan juga daftar gambar:'),
  bullet('Gambar 2.1 Tampilan Dashboard Supplier'),
  bullet('Gambar 2.2 Tampilan Data Supplier'),
  bullet('Gambar 2.3 Tampilan Kriteria Penilaian'),
  bullet('Gambar 2.4 Tampilan Evaluasi Supplier'),
  bullet('Gambar 2.5 Arsitektur Sistem SPK Seleksi Supplier'),

  h1('19. Panduan Urutan Copy-Paste'),
  bullet('Ganti judul laporan.'),
  bullet('Ganti semua istilah Sistem Penunjang Keputusan menjadi Sistem Pendukung Keputusan.'),
  bullet('Tambahkan batasan masalah tentang fokus sistem hanya pada modul SPK supplier.'),
  bullet('Perbaiki rumusan masalah nomor 3.'),
  bullet('Perbaiki tujuan penelitian nomor 3.'),
  bullet('Tambahkan paragraf metode penelitian tentang pengembangan sistem web.'),
  bullet('Tambahkan rumus SAW yang lengkap pada landasan teori.'),
  bullet('Ganti tabel kriteria dengan tabel yang lebih rapi.'),
  bullet('Tambahkan subbab implementasi sistem dari 2.5.1 sampai 2.5.7.'),
  bullet('Masukkan screenshot dari folder docs/images.'),
  bullet('Tambahkan penjelasan threshold 0,75.'),
  bullet('Tambahkan paragraf validasi hasil manual dan sistem.'),
  bullet('Tambahkan subbab kelebihan dan keterbatasan metode SAW.'),
  bullet('Tambahkan dua poin baru pada kesimpulan.'),
  bullet('Tambahkan future works tambahan.'),
  bullet('Tambahkan daftar pustaka teknologi.'),
  bullet('Isi daftar tabel dan daftar gambar.'),

  h1('20. Catatan Penting Saat Menempel Ke Word'),
  bullet('Pastikan setiap gambar memiliki nomor dan judul.'),
  bullet('Pastikan urutan gambar sesuai dengan daftar gambar.'),
  bullet('Gunakan istilah yang konsisten: SPK, Sistem Pendukung Keputusan, dan SAW.'),
  bullet('Jangan menyebut SMART di laporan, karena implementasi supplier pada project memakai SAW.'),
  bullet('Jangan membahas payroll, absensi, cuti, dan HRIS secara detail karena fitur utama laporan adalah SPK supplier.'),
];

const doc = new Document({
  sections: [
    {
      properties: {},
      children,
    },
  ],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(outPath, buffer);
  console.log(outPath);
});
