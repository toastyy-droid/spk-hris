const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const out = path.join(root, 'Laporan_SPK_SAW_Supplier_REVISI_LENGKAP.docx');
const work = path.join(root, '.tmp-revised-saw-docx');

fs.rmSync(work, { recursive: true, force: true });
fs.mkdirSync(path.join(work, '_rels'), { recursive: true });
fs.mkdirSync(path.join(work, 'word', '_rels'), { recursive: true });
fs.mkdirSync(path.join(work, 'word', 'theme'), { recursive: true });
fs.mkdirSync(path.join(work, 'docProps'), { recursive: true });

function esc(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function p(text, style = 'Normal') {
  const styleXml = style === 'Normal' ? '' : `<w:pStyle w:val="${style}"/>`;
  const lines = String(text).split('\n');
  const runs = lines.map((line, index) => {
    const br = index === 0 ? '' : '<w:br/>';
    return `<w:r>${br}<w:t xml:space="preserve">${esc(line)}</w:t></w:r>`;
  }).join('');
  return `<w:p><w:pPr>${styleXml}</w:pPr>${runs}</w:p>`;
}

function bullet(text) {
  return `<w:p><w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr></w:pPr><w:r><w:t xml:space="preserve">${esc(text)}</w:t></w:r></w:p>`;
}

function table(rows) {
  return `<w:tbl><w:tblPr><w:tblW w:w="0" w:type="auto"/><w:tblBorders><w:top w:val="single" w:sz="4"/><w:left w:val="single" w:sz="4"/><w:bottom w:val="single" w:sz="4"/><w:right w:val="single" w:sz="4"/><w:insideH w:val="single" w:sz="4"/><w:insideV w:val="single" w:sz="4"/></w:tblBorders></w:tblPr>${rows.map(row => `<w:tr>${row.map(cell => `<w:tc><w:tcPr><w:tcW w:w="2400" w:type="dxa"/></w:tcPr>${p(cell)}</w:tc>`).join('')}</w:tr>`).join('')}</w:tbl>`;
}

function heading(level, text) {
  return p(text, `Heading${level}`);
}

const body = [];

body.push(p('LAPORAN TUGAS', 'Title'));
body.push(p('SISTEM PENDUKUNG KEPUTUSAN', 'Title'));
body.push(p('IMPLEMENTASI METODE SIMPLE ADDITIVE WEIGHTING (SAW) DALAM SISTEM PENDUKUNG KEPUTUSAN SELEKSI SUPPLIER AKSESORIS HANDPHONE PADA CV ANUGERAH MEGA MAKMUR PONTIANAK', 'Title'));
body.push(p('Disusun Oleh:'));
body.push(p('[NAMA MAHASISWA 1] / [NIM]'));
body.push(p('[NAMA MAHASISWA 2] / [NIM]'));
body.push(p('[NAMA MAHASISWA 3] / [NIM]'));
body.push(p('[NAMA MAHASISWA 4] / [NIM]'));
body.push(p('[NAMA UNIVERSITAS]'));
body.push(p('[FAKULTAS / PROGRAM STUDI]'));
body.push(p('[KOTA]'));
body.push(p('[TAHUN]'));

body.push(heading(1, 'KATA PENGANTAR'));
body.push(p('Puji syukur kami panjatkan ke hadirat Tuhan Yang Maha Esa karena atas rahmat dan karunia-Nya laporan tugas Sistem Pendukung Keputusan ini dapat diselesaikan dengan baik. Laporan ini disusun sebagai salah satu bentuk pemenuhan tugas mata kuliah Sistem Pendukung Keputusan pada Program Studi [NAMA PRODI] di [NAMA UNIVERSITAS].'));
body.push(p('Laporan ini membahas penerapan metode Simple Additive Weighting (SAW) untuk membantu proses seleksi supplier aksesoris handphone pada CV Anugerah Mega Makmur Pontianak. Pembahasan meliputi identifikasi kriteria, penentuan bobot, perhitungan manual, implementasi sistem berbasis web, serta pengujian kesesuaian hasil perhitungan sistem dengan perhitungan manual.'));
body.push(p('Kami menyadari bahwa laporan ini masih memiliki keterbatasan. Oleh karena itu, kritik dan saran yang membangun sangat diharapkan agar laporan ini dapat menjadi lebih baik. Semoga laporan ini bermanfaat bagi pembaca, khususnya bagi mahasiswa yang mempelajari sistem pendukung keputusan dan metode SAW.'));
body.push(p('Pontianak, [TANGGAL]'));
body.push(p('Tim Penyusun'));

body.push(heading(1, 'BAB I PENDAHULUAN'));
body.push(heading(2, '1.1 Latar Belakang'));
body.push(p('Perkembangan penggunaan smartphone di Indonesia mendorong meningkatnya kebutuhan terhadap produk aksesoris handphone, seperti charger, kabel data, casing, tempered glass, powerbank, earphone, dan berbagai perlengkapan pendukung lainnya. Kondisi tersebut membuka peluang bagi pelaku usaha grosir aksesoris handphone untuk memperluas pasar dan meningkatkan kualitas layanan kepada pelanggan.'));
body.push(p('CV Anugerah Mega Makmur merupakan perusahaan yang bergerak di bidang perdagangan grosir aksesoris handphone di Kota Pontianak, Kalimantan Barat. Dalam menjalankan kegiatan operasionalnya, perusahaan bekerja sama dengan sejumlah supplier yang menyediakan berbagai jenis produk. Pemilihan supplier menjadi salah satu keputusan penting karena berpengaruh langsung terhadap harga jual, kualitas barang, ketersediaan stok, ketepatan pengiriman, dan kepuasan pelanggan.'));
body.push(p('Permasalahan yang dihadapi perusahaan adalah proses pemilihan supplier masih dilakukan secara subjektif berdasarkan pengalaman, hubungan kerja sama, atau rekomendasi dari pihak lain. Cara tersebut dapat membantu dalam kondisi tertentu, tetapi belum memberikan dasar penilaian yang terukur dan terdokumentasi. Akibatnya, keputusan pemilihan supplier berpotensi tidak konsisten, terutama ketika terdapat beberapa supplier dengan kualitas dan penawaran yang relatif seimbang.'));
body.push(p('Untuk mengatasi permasalahan tersebut, diperlukan Sistem Pendukung Keputusan (SPK) yang mampu membantu proses seleksi supplier secara lebih objektif, terstruktur, dan transparan. SPK dapat mengolah data supplier berdasarkan sejumlah kriteria yang telah ditentukan, kemudian menghasilkan rekomendasi dalam bentuk skor dan peringkat.'));
body.push(p('Metode yang digunakan dalam penelitian ini adalah Simple Additive Weighting (SAW). Metode SAW dipilih karena memiliki konsep yang sederhana, mudah diterapkan, dan sesuai untuk menyelesaikan permasalahan pengambilan keputusan dengan banyak kriteria. Melalui proses normalisasi dan pembobotan, metode SAW dapat menghasilkan nilai preferensi untuk setiap alternatif supplier sehingga perusahaan dapat menentukan supplier terbaik berdasarkan hasil perhitungan yang jelas.'));

body.push(heading(2, '1.2 Rumusan Masalah'));
['Bagaimana menentukan kriteria dan bobot penilaian yang relevan dalam proses seleksi supplier aksesoris handphone pada CV Anugerah Mega Makmur?', 'Bagaimana menerapkan metode Simple Additive Weighting (SAW) untuk menghasilkan rekomendasi supplier terbaik?', 'Bagaimana merancang dan membangun sistem pendukung keputusan berbasis web untuk proses seleksi supplier?', 'Bagaimana kesesuaian hasil perhitungan sistem dengan hasil perhitungan manual metode SAW?'].forEach(x => body.push(bullet(x)));

body.push(heading(2, '1.3 Tujuan Penelitian'));
['Mengidentifikasi kriteria dan bobot yang digunakan dalam proses seleksi supplier pada CV Anugerah Mega Makmur.', 'Menerapkan metode Simple Additive Weighting (SAW) dalam proses perhitungan dan perankingan supplier.', 'Membangun sistem pendukung keputusan berbasis web yang dapat membantu perusahaan dalam mengevaluasi supplier secara objektif.', 'Menguji akurasi hasil perhitungan sistem dengan membandingkannya terhadap perhitungan manual.'].forEach(x => body.push(bullet(x)));

body.push(heading(2, '1.4 Batasan Masalah'));
['Penelitian dilakukan pada CV Anugerah Mega Makmur Pontianak.', 'Kriteria penilaian terdiri dari Harga, Kualitas, Pengiriman, Layanan, dan Kapasitas.', 'Metode yang digunakan adalah Simple Additive Weighting (SAW).', 'Sistem yang dibangun berbasis web dan belum dikembangkan sebagai aplikasi mobile native.'].forEach(x => body.push(bullet(x)));

body.push(heading(2, '1.5 Manfaat Penelitian'));
['Bagi perusahaan, sistem dapat membantu proses seleksi supplier secara lebih objektif dan terdokumentasi.', 'Bagi akademisi, laporan ini dapat menjadi contoh penerapan metode SAW dalam kasus seleksi supplier.', 'Bagi penulis, penelitian ini menjadi sarana penerapan teori sistem pendukung keputusan ke dalam aplikasi nyata.'].forEach(x => body.push(bullet(x)));

body.push(heading(2, '1.6 Metode Penelitian'));
body.push(p('Metode penelitian terdiri dari observasi, wawancara, studi pustaka, perancangan sistem, implementasi, dan pengujian. Observasi dilakukan untuk memahami proses bisnis, sedangkan wawancara digunakan untuk memperoleh informasi kriteria, bobot, dan kebutuhan sistem. Studi pustaka dilakukan untuk memperkuat landasan teori mengenai SPK dan metode SAW.'));
body.push(p('Gambar 1.1 Alur Penelitian'));
body.push(table([
  ['Mulai', 'Observasi', 'Wawancara', 'Identifikasi kriteria dan bobot'],
  ['Pengumpulan data supplier', 'Perhitungan manual SAW', 'Perancangan sistem', 'Implementasi sistem'],
  ['Pengujian fungsionalitas', 'Validasi manual dan sistem', 'Kesimpulan dan saran', 'Selesai']
]));

body.push(heading(1, 'BAB II PEMBAHASAN'));
body.push(heading(2, '2.1 Profil CV Anugerah Mega Makmur'));
body.push(p('CV Anugerah Mega Makmur adalah perusahaan yang bergerak di bidang perdagangan grosir aksesoris handphone di Kota Pontianak, Kalimantan Barat. Produk yang disediakan meliputi charger, kabel data, casing handphone, tempered glass, powerbank, earphone, headset, dan berbagai aksesoris pendukung lainnya. Dalam proses pemesanan barang, perusahaan perlu memilih supplier yang mampu memberikan harga kompetitif, kualitas produk yang baik, pengiriman tepat waktu, layanan responsif, dan kapasitas stok yang memadai.'));

body.push(heading(2, '2.2 Landasan Teori'));
body.push(heading(3, '2.2.1 Sistem Pendukung Keputusan'));
body.push(p('Sistem Pendukung Keputusan (SPK) adalah sistem berbasis komputer yang membantu pengambil keputusan dalam menggunakan data dan model untuk menyelesaikan permasalahan semi-terstruktur atau tidak terstruktur. SPK tidak menggantikan peran pengambil keputusan, tetapi menyediakan informasi dan perhitungan yang dapat dijadikan dasar pertimbangan.'));
body.push(heading(3, '2.2.2 Metode Simple Additive Weighting (SAW)'));
body.push(p('Simple Additive Weighting (SAW) merupakan salah satu metode dalam Multi-Attribute Decision Making (MADM). Metode ini dikenal sebagai metode penjumlahan terbobot karena proses penilaiannya dilakukan dengan menjumlahkan hasil perkalian antara bobot kriteria dan nilai rating kinerja setiap alternatif. Alternatif dengan nilai preferensi tertinggi dianggap sebagai alternatif terbaik.'));
body.push(p('Rumus normalisasi untuk kriteria benefit: rij = xij / max(xij).'));
body.push(p('Rumus normalisasi untuk kriteria cost: rij = min(xij) / xij.'));
body.push(p('Rumus nilai preferensi: Vi = Σ(wj × rij).'));
body.push(p('Pada penelitian ini, sistem menambahkan bonus sebesar 0,05 untuk supplier yang menanggung ongkos kirim. Dengan demikian, rumus akhir yang digunakan adalah Vi = Σ(wj × rij) + bonus ongkir.'));
body.push(p('Gambar 2.1 Alur Perhitungan Metode SAW'));
body.push(table([
  ['Input data supplier', 'Input nilai kriteria', 'Tentukan cost/benefit'],
  ['Tentukan bobot', 'Normalisasi matriks', 'Hitung nilai Vi'],
  ['Tambahkan bonus ongkir jika ada', 'Urutkan ranking', 'Bandingkan dengan threshold']
]));

body.push(heading(2, '2.3 Identifikasi Kriteria dan Bobot'));
body.push(table([
  ['No', 'Kriteria', 'Jenis', 'Bobot', 'Keterangan'],
  ['1', 'Harga', 'Cost', '30%', 'Semakin murah harga, semakin baik'],
  ['2', 'Kualitas', 'Benefit', '30%', 'Semakin baik kualitas, semakin baik'],
  ['3', 'Pengiriman', 'Benefit', '20%', 'Semakin cepat dan tepat, semakin baik'],
  ['4', 'Layanan', 'Benefit', '10%', 'Semakin responsif layanan, semakin baik'],
  ['5', 'Kapasitas', 'Benefit', '10%', 'Semakin besar kapasitas stok, semakin baik'],
  ['-', 'Bonus Ongkir', 'Tambahan', '+0,05', 'Jika supplier menanggung ongkos kirim']
]));
body.push(p('Harga dan kualitas memiliki bobot tertinggi karena keduanya menjadi faktor paling penting dalam bisnis grosir aksesoris handphone. Harga memengaruhi daya saing penjualan, sedangkan kualitas memengaruhi kepuasan pelanggan dan jumlah komplain.'));

body.push(heading(2, '2.4 Perhitungan Manual Metode SAW'));
body.push(table([
  ['Alternatif', 'Harga', 'Kualitas', 'Pengiriman', 'Layanan', 'Kapasitas', 'Ongkir'],
  ['Pontianak Mobile Grosir', '9,1', '9,0', '8,8', '8,6', '9,2', 'Tidak'],
  ['Khatulistiwa Gadget Supply', '8,6', '9,3', '9,0', '8,9', '8,8', 'Ya'],
  ['Borneo Tech Distributor', '8,2', '9,5', '8,4', '8,8', '8,6', 'Tidak'],
  ['Mega Jaya Cellular', '8,9', '8,8', '9,2', '8,7', '8,9', 'Tidak'],
  ['JBL Audio Partner', '8,0', '9,4', '8,3', '8,7', '8,2', 'Tidak']
]));
body.push(p('Nilai alternatif dikonversi ke skala 0-1 dengan membagi setiap nilai dengan 10. Untuk kriteria Harga digunakan rumus cost, sedangkan Kualitas, Pengiriman, Layanan, dan Kapasitas menggunakan rumus benefit.'));
body.push(table([
  ['Ranking', 'Supplier', 'Skor SAW', 'Threshold 0,75', 'Rekomendasi'],
  ['1', 'Khatulistiwa Gadget Supply', '1,0142', '≥ 0,75', 'Direkomendasikan'],
  ['2', 'Borneo Tech Distributor', '0,9677', '≥ 0,75', 'Direkomendasikan'],
  ['3', 'JBL Audio Partner', '0,9642', '≥ 0,75', 'Direkomendasikan'],
  ['4', 'Mega Jaya Cellular', '0,9421', '≥ 0,75', 'Direkomendasikan'],
  ['5', 'Pontianak Mobile Grosir', '0,9358', '≥ 0,75', 'Direkomendasikan']
]));
body.push(p('Khatulistiwa Gadget Supply memperoleh skor tertinggi sebesar 1,0142 karena memiliki nilai yang baik pada sebagian besar kriteria dan mendapatkan bonus ongkos kirim sebesar 0,05. Skor yang melebihi 1,0 merupakan konsekuensi dari penambahan bonus di luar skor normalisasi SAW.'));

body.push(heading(2, '2.5 Implementasi Sistem Berbasis Web'));
body.push(p('Sistem dibangun dengan arsitektur client-server. Frontend menggunakan Next.js 14, backend menggunakan NestJS, dan database menggunakan PostgreSQL yang dikelola melalui Prisma ORM. Komunikasi antara frontend dan backend dilakukan melalui REST API dengan format JSON.'));
body.push(p('Gambar 2.2 Arsitektur Sistem'));
body.push(table([
  ['Pengguna', 'Frontend Next.js 14', 'Backend NestJS REST API'],
  ['JWT dan Role-Based Access Control', 'Modul Perhitungan SAW', 'Prisma ORM'],
  ['PostgreSQL / Supabase', 'Hasil ranking dan rekomendasi', 'Riwayat evaluasi']
]));
body.push(p('Fitur utama sistem meliputi login, pengelolaan data supplier, informasi kriteria penilaian, evaluasi SAW, perankingan supplier, serta penyimpanan hasil evaluasi.'));

body.push(heading(2, '2.6 Perbandingan Perhitungan Manual dan Web'));
body.push(table([
  ['Supplier', 'Skor Manual', 'Skor Web', 'Selisih'],
  ['Pontianak Mobile Grosir', '0,9358', '0,9358', '0,0000'],
  ['Khatulistiwa Gadget Supply', '1,0142', '1,0142', '0,0000'],
  ['Borneo Tech Distributor', '0,9677', '0,9677', '0,0000'],
  ['Mega Jaya Cellular', '0,9421', '0,9421', '0,0000'],
  ['JBL Audio Partner', '0,9642', '0,9642', '0,0000']
]));
body.push(p('Hasil pengujian menunjukkan bahwa skor yang dihasilkan sistem sama dengan hasil perhitungan manual. Selisih 0,0000 menunjukkan bahwa implementasi algoritma SAW pada sistem telah sesuai dengan rumus yang digunakan.'));

body.push(heading(2, '2.7 Dokumentasi Observasi dan Wawancara'));
body.push(p('Observasi dan wawancara dilakukan untuk memperoleh informasi mengenai proses seleksi supplier, kriteria penilaian, bobot prioritas, serta kebutuhan sistem. Berdasarkan hasil wawancara, harga dan kualitas menjadi kriteria paling penting, diikuti oleh pengiriman, layanan, dan kapasitas stok.'));

body.push(heading(3, '2.7.1 Waktu dan Tempat Observasi'));
body.push(p('Kegiatan observasi dilakukan pada CV Anugerah Mega Makmur Pontianak dengan tujuan memahami proses bisnis yang berkaitan dengan pemilihan supplier. Informasi waktu, tanggal, dan narasumber masih perlu disesuaikan dengan data aktual dari kelompok penyusun laporan.'));
body.push(table([
  ['Komponen', 'Keterangan'],
  ['Hari/Tanggal', '[HARI], [TANGGAL]'],
  ['Waktu', '[PUKUL] WIB'],
  ['Tempat', 'CV Anugerah Mega Makmur, Pontianak'],
  ['Narasumber', '[NAMA PEMILIK]'],
  ['Agenda', 'Observasi proses seleksi supplier dan wawancara kebutuhan sistem']
]));
body.push(p('Observasi difokuskan pada cara perusahaan melakukan pemesanan barang, pengecekan kualitas barang, pencatatan data supplier, dan penanganan masalah seperti keterlambatan pengiriman atau komplain produk. Dari observasi tersebut diketahui bahwa proses seleksi supplier masih bergantung pada pengalaman pemilik dan belum menggunakan perhitungan terstruktur.'));

body.push(heading(3, '2.7.2 Ringkasan Hasil Wawancara'));
body.push(p('Wawancara dilakukan secara semi-terstruktur. Pertanyaan disusun untuk menggali proses pemilihan supplier yang berjalan saat ini, kriteria yang dianggap penting, kendala yang dihadapi, serta kebutuhan terhadap sistem pendukung keputusan.'));
body.push(table([
  ['No', 'Pertanyaan', 'Ringkasan Jawaban'],
  ['1', 'Bagaimana proses pemilihan supplier saat ini?', 'Pemilihan supplier masih dilakukan secara manual berdasarkan pengalaman, harga, kualitas, dan rekomendasi dari sesama pedagang.'],
  ['2', 'Kriteria apa saja yang dipertimbangkan?', 'Harga, kualitas, pengiriman, layanan, dan kapasitas stok menjadi faktor utama.'],
  ['3', 'Kriteria mana yang paling penting?', 'Harga dan kualitas dianggap paling penting, kemudian pengiriman, layanan, dan kapasitas.'],
  ['4', 'Apakah ada nilai minimal supplier?', 'Belum ada standar angka pasti, tetapi supplier yang sering bermasalah biasanya tidak diprioritaskan.'],
  ['5', 'Apakah sistem otomatis dibutuhkan?', 'Sistem dianggap membantu karena dapat membuat evaluasi supplier lebih rapi dan objektif.']
]));

body.push(heading(2, '2.8 Analisis Permasalahan'));
body.push(p('Berdasarkan hasil observasi dan wawancara, permasalahan utama yang ditemukan adalah belum adanya mekanisme penilaian supplier yang terukur. Penilaian masih mengandalkan pengalaman dan ingatan pemilik. Meskipun pengalaman pemilik sangat penting, cara tersebut memiliki kelemahan karena tidak semua aspek supplier terdokumentasi dengan baik.'));
body.push(p('Permasalahan lain adalah tidak adanya bobot penilaian yang formal. Dalam praktiknya, harga dan kualitas sering dianggap lebih penting daripada layanan atau kapasitas. Namun tanpa bobot yang jelas, proses pemilihan supplier dapat berubah-ubah sesuai kondisi atau preferensi pada saat keputusan dibuat. Hal ini dapat menimbulkan ketidakkonsistenan dalam pengambilan keputusan.'));
body.push(p('Selain itu, pencatatan data supplier yang belum terstruktur membuat perusahaan sulit membandingkan performa antar supplier. Data seperti kualitas produk, ketepatan pengiriman, dan kapasitas stok seharusnya dapat digunakan sebagai dasar evaluasi berkala. Dengan adanya sistem pendukung keputusan, data tersebut dapat disimpan, dihitung, dan digunakan kembali untuk proses evaluasi selanjutnya.'));

body.push(heading(2, '2.9 Analisis Kebutuhan Sistem'));
body.push(p('Sistem yang dibangun harus mampu membantu pengguna dalam mengelola data supplier, memberikan nilai pada setiap kriteria, menjalankan proses perhitungan SAW, dan menampilkan hasil ranking secara jelas. Sistem juga harus dapat menyimpan riwayat hasil evaluasi agar keputusan yang pernah dibuat dapat ditinjau kembali.'));
body.push(heading(3, '2.9.1 Kebutuhan Fungsional'));
['Sistem dapat melakukan autentikasi pengguna melalui halaman login.', 'Sistem dapat menampilkan daftar supplier yang tersimpan di database.', 'Sistem dapat menambah, mengubah, dan menghapus data supplier.', 'Sistem dapat menampilkan informasi kriteria, bobot, dan jenis kriteria.', 'Sistem dapat menjalankan perhitungan SAW berdasarkan data supplier.', 'Sistem dapat menampilkan hasil ranking supplier dari skor tertinggi ke terendah.', 'Sistem dapat menentukan status rekomendasi berdasarkan threshold.', 'Sistem dapat menyimpan riwayat hasil evaluasi supplier.'].forEach(x => body.push(bullet(x)));
body.push(heading(3, '2.9.2 Kebutuhan Nonfungsional'));
['Sistem harus mudah digunakan oleh pengguna yang tidak memiliki latar belakang teknis.', 'Tampilan sistem harus responsif agar dapat diakses melalui laptop maupun perangkat mobile.', 'Perhitungan sistem harus konsisten dengan rumus metode SAW.', 'Data supplier dan hasil evaluasi harus tersimpan secara aman di database.', 'API harus memiliki mekanisme autentikasi untuk mencegah akses tanpa izin.'].forEach(x => body.push(bullet(x)));

body.push(heading(2, '2.10 Perancangan Basis Data'));
body.push(p('Basis data dirancang untuk menyimpan data pengguna, data supplier, dan hasil evaluasi SPK. Data supplier menjadi input utama dalam proses perhitungan SAW, sedangkan data hasil evaluasi digunakan sebagai dokumentasi keputusan.'));
body.push(table([
  ['Entitas', 'Atribut Utama', 'Keterangan'],
  ['User', 'id, nama, email, password, role', 'Menyimpan data pengguna sistem dan hak akses.'],
  ['Supplier', 'id, nama, kategori, kontak, nilai kriteria, status ongkir', 'Menyimpan data supplier dan nilai penilaian.'],
  ['SpkResult', 'id, supplierId, score, rank, recommendation, createdAt', 'Menyimpan hasil evaluasi dan ranking supplier.']
]));
body.push(p('Model Supplier memiliki atribut nilai untuk Harga, Kualitas, Pengiriman, Layanan, dan Kapasitas. Nilai tersebut menggunakan skala 1 sampai 10 agar mudah dipahami oleh pengguna. Pada proses perhitungan, nilai tersebut dapat dikonversi ke skala 0 sampai 1 untuk menyesuaikan proses normalisasi SAW.'));

body.push(heading(2, '2.11 Perancangan Antarmuka'));
body.push(p('Antarmuka sistem dirancang agar pengguna dapat memahami proses evaluasi supplier secara bertahap. Halaman dashboard digunakan untuk melihat ringkasan, halaman data supplier digunakan untuk mengelola data, halaman evaluasi supplier digunakan untuk menjalankan perhitungan SAW, dan halaman kriteria penilaian digunakan untuk melihat bobot serta jenis kriteria.'));
body.push(table([
  ['Halaman', 'Fungsi'],
  ['Dashboard', 'Menampilkan ringkasan jumlah supplier, supplier aktif, rata-rata skor, dan supplier terbaik.'],
  ['Data Supplier', 'Mengelola data supplier dan nilai kriteria.'],
  ['Evaluasi Supplier', 'Menjalankan proses perhitungan SAW dan menampilkan ranking.'],
  ['Kriteria Penilaian', 'Menampilkan informasi bobot, jenis kriteria, dan deskripsi kriteria.']
]));
body.push(p('Tampilan sistem perlu mempertahankan bahasa Indonesia pada label, navigasi, dan deskripsi agar sesuai dengan konteks pengguna. Dengan penggunaan istilah yang familiar, pengguna dapat lebih mudah memahami fungsi setiap halaman.'));

body.push(heading(2, '2.12 Detail Proses Perhitungan Sistem'));
body.push(p('Proses perhitungan pada sistem dimulai dari pengambilan data supplier yang aktif. Setelah data diperoleh, sistem menentukan nilai minimum untuk kriteria Harga karena Harga termasuk kriteria cost. Untuk kriteria Kualitas, Pengiriman, Layanan, dan Kapasitas, sistem menentukan nilai maksimum karena keempat kriteria tersebut termasuk kriteria benefit.'));
body.push(p('Setelah nilai minimum dan maksimum diketahui, sistem melakukan normalisasi setiap nilai supplier. Nilai Harga dinormalisasi dengan membagi nilai minimum Harga terhadap nilai Harga masing-masing supplier. Sementara itu, nilai benefit dinormalisasi dengan membagi nilai supplier terhadap nilai maksimum pada kriteria tersebut.'));
body.push(p('Nilai normalisasi kemudian dikalikan dengan bobot masing-masing kriteria. Hasil perkalian seluruh kriteria dijumlahkan untuk mendapatkan skor SAW. Apabila supplier menanggung ongkos kirim, sistem menambahkan bonus sebesar 0,05. Setelah skor akhir diperoleh, sistem mengurutkan supplier dari skor tertinggi ke terendah dan membandingkan skor dengan threshold 0,75.'));
body.push(p('Threshold 0,75 digunakan sebagai batas awal kelayakan. Artinya, supplier dengan skor akhir sama dengan atau lebih besar dari 0,75 dinyatakan direkomendasikan. Nilai threshold ini dapat disesuaikan apabila perusahaan ingin membuat standar seleksi yang lebih ketat atau lebih longgar.'));

body.push(heading(2, '2.13 Pengujian Sistem'));
body.push(p('Pengujian sistem dilakukan untuk memastikan bahwa fitur yang dibangun berjalan sesuai kebutuhan dan hasil perhitungan SAW sesuai dengan perhitungan manual. Pengujian dibagi menjadi pengujian fungsional dan pengujian akurasi.'));
body.push(heading(3, '2.13.1 Pengujian Fungsional'));
body.push(table([
  ['No', 'Fitur', 'Skenario', 'Hasil Yang Diharapkan', 'Status'],
  ['1', 'Login', 'Pengguna memasukkan email dan password valid.', 'Pengguna berhasil masuk ke sistem.', 'Sesuai'],
  ['2', 'Data Supplier', 'Pengguna menambah data supplier.', 'Data supplier tersimpan dan tampil di daftar.', 'Sesuai'],
  ['3', 'Edit Supplier', 'Pengguna mengubah nilai kriteria supplier.', 'Data supplier diperbarui.', 'Sesuai'],
  ['4', 'Evaluasi SAW', 'Pengguna menjalankan evaluasi supplier.', 'Sistem menampilkan ranking supplier.', 'Sesuai'],
  ['5', 'Threshold', 'Pengguna mengubah nilai threshold.', 'Status rekomendasi mengikuti threshold baru.', 'Sesuai'],
  ['6', 'Riwayat Evaluasi', 'Pengguna membuka hasil evaluasi sebelumnya.', 'Riwayat hasil evaluasi tampil.', 'Sesuai']
]));
body.push(heading(3, '2.13.2 Pengujian Akurasi'));
body.push(p('Pengujian akurasi dilakukan dengan membandingkan hasil perhitungan manual dan hasil perhitungan sistem menggunakan data supplier yang sama. Berdasarkan hasil pengujian, seluruh skor yang dihasilkan sistem sama dengan skor manual. Hal ini menunjukkan bahwa proses normalisasi, pembobotan, penambahan bonus ongkir, dan perankingan telah diimplementasikan dengan benar.'));

body.push(heading(2, '2.14 Kelebihan dan Keterbatasan Metode SAW'));
body.push(heading(3, '2.14.1 Kelebihan Metode SAW'));
['Konsep metode sederhana dan mudah dipahami.', 'Proses perhitungan relatif cepat dan cocok untuk sistem berbasis web.', 'Dapat menangani beberapa kriteria dengan bobot yang berbeda.', 'Hasil akhir berupa skor dan ranking mudah dipahami oleh pengguna.', 'Metode dapat diterapkan pada berbagai kasus pemilihan alternatif, termasuk seleksi supplier.'].forEach(x => body.push(bullet(x)));
body.push(heading(3, '2.14.2 Keterbatasan Metode SAW'));
['Hasil sangat bergantung pada ketepatan penentuan bobot kriteria.', 'Nilai awal alternatif harus diberikan secara objektif agar hasil tidak bias.', 'Metode SAW belum mempertimbangkan hubungan antar kriteria secara mendalam.', 'Jika data penilaian tidak diperbarui secara berkala, hasil ranking dapat menjadi kurang relevan.', 'Perubahan kecil pada bobot dapat memengaruhi urutan ranking dalam kondisi skor supplier yang berdekatan.'].forEach(x => body.push(bullet(x)));

body.push(heading(2, '2.15 Pembahasan Hasil'));
body.push(p('Hasil perhitungan menunjukkan bahwa Khatulistiwa Gadget Supply menjadi supplier dengan skor tertinggi. Keunggulan supplier ini tidak hanya berasal dari nilai kriteria yang baik, tetapi juga dari adanya bonus ongkos kirim. Dalam konteks bisnis grosir, biaya pengiriman dapat menjadi faktor penting karena memengaruhi total biaya pembelian barang.'));
body.push(p('Borneo Tech Distributor berada pada peringkat kedua karena memiliki nilai kualitas tertinggi dan harga yang cukup kompetitif. JBL Audio Partner berada pada peringkat ketiga dengan keunggulan pada harga dan kualitas, meskipun nilai pengiriman dan kapasitasnya lebih rendah dibanding beberapa supplier lain. Mega Jaya Cellular unggul pada pengiriman, tetapi nilai kualitas dan harga membuat posisinya berada di bawah tiga supplier teratas. Pontianak Mobile Grosir memiliki kapasitas tertinggi, tetapi skor akhirnya berada di posisi kelima karena nilai harga sebagai kriteria cost kurang kompetitif dibanding supplier lain.'));
body.push(p('Meskipun seluruh supplier dinyatakan direkomendasikan karena skor berada di atas threshold 0,75, sistem tetap memberikan urutan prioritas. Dengan demikian, perusahaan dapat menjadikan supplier peringkat pertama sebagai prioritas utama, sedangkan supplier lain dapat menjadi alternatif cadangan sesuai kebutuhan produk dan ketersediaan stok.'));

body.push(heading(2, '2.16 Rekomendasi Penggunaan Sistem'));
body.push(p('Agar sistem dapat memberikan hasil yang lebih akurat, perusahaan perlu memperbarui nilai supplier secara berkala. Penilaian tidak sebaiknya hanya dilakukan satu kali, tetapi dapat dilakukan setiap bulan atau setiap periode pembelian tertentu. Dengan pembaruan data berkala, sistem dapat mencerminkan performa supplier yang lebih aktual.'));
body.push(p('Perusahaan juga disarankan untuk menyimpan bukti pendukung penilaian, seperti catatan keterlambatan pengiriman, jumlah komplain barang rusak, perubahan harga, dan ketersediaan stok. Bukti tersebut dapat membantu pengguna memberikan nilai yang lebih objektif pada setiap kriteria.'));
body.push(p('Selain itu, hasil ranking dari sistem sebaiknya digunakan sebagai alat bantu, bukan sebagai satu-satunya dasar keputusan. Pengambil keputusan tetap dapat mempertimbangkan faktor lain seperti kondisi pasar, hubungan bisnis jangka panjang, dan kebutuhan mendadak yang tidak selalu tercermin dalam data sistem.'));

body.push(heading(1, 'BAB III PENUTUP'));
body.push(heading(2, '3.1 Kesimpulan'));
['Proses seleksi supplier aksesoris handphone pada CV Anugerah Mega Makmur dapat dilakukan menggunakan metode SAW dengan lima kriteria utama, yaitu Harga, Kualitas, Pengiriman, Layanan, dan Kapasitas.', 'Bobot kriteria yang digunakan adalah Harga 30%, Kualitas 30%, Pengiriman 20%, Layanan 10%, dan Kapasitas 10%.', 'Hasil perhitungan manual menunjukkan bahwa Khatulistiwa Gadget Supply memperoleh skor tertinggi sebesar 1,0142 setelah mendapatkan bonus ongkos kirim.', 'Sistem pendukung keputusan berbasis web yang dibangun menggunakan Next.js, NestJS, dan PostgreSQL mampu mengimplementasikan metode SAW dengan baik.', 'Hasil pengujian menunjukkan bahwa perhitungan sistem sama dengan perhitungan manual dengan selisih 0,0000.'].forEach(x => body.push(bullet(x)));
body.push(heading(2, '3.2 Saran'));
['Menambahkan kriteria lain seperti garansi produk, reputasi supplier, lama kerja sama, atau kelengkapan dokumen.', 'Melakukan perbandingan metode SAW dengan metode lain seperti AHP, TOPSIS, atau Weighted Product.', 'Menambahkan fitur analisis sensitivitas untuk melihat pengaruh perubahan bobot terhadap hasil ranking.', 'Mengintegrasikan sistem dengan inventory agar penilaian supplier dapat menggunakan data transaksi dan stok secara langsung.', 'Menambahkan fitur ekspor laporan ke PDF atau Excel.'].forEach(x => body.push(bullet(x)));

body.push(heading(1, 'DAFTAR PUSTAKA'));
[
  'Afshari, A., Mojahed, M., & Yusuff, R. M. (2010). Simple Additive Weighting approach to personnel selection problem. International Journal of Innovation, Management and Technology, 1(5), 511-515.',
  'Fishburn, P. C. (1967). Additive Utilities with Incomplete Product Set: Applications to Priorities and Assignments. Baltimore: Johns Hopkins Press.',
  'Keen, P. G. W., & Scott Morton, M. S. (1978). Decision Support Systems: An Organizational Perspective. Reading, MA: Addison-Wesley.',
  'Kusumadewi, S., Hartati, S., Harjoko, A., & Wardoyo, R. (2006). Fuzzy Multi-Attribute Decision Making (Fuzzy MADM). Yogyakarta: Graha Ilmu.',
  'NestJS. (2026). NestJS Documentation. Diakses dari https://docs.nestjs.com/',
  'Next.js. (2026). Next.js Documentation. Diakses dari https://nextjs.org/docs',
  'PostgreSQL Global Development Group. (2026). PostgreSQL Documentation. Diakses dari https://www.postgresql.org/docs/',
  'Prisma. (2026). Prisma Documentation. Diakses dari https://www.prisma.io/docs',
  'Saaty, T. L. (1980). The Analytic Hierarchy Process: Planning, Priority Setting, Resource Allocation. New York: McGraw-Hill.',
  'Supabase. (2026). Supabase Documentation. Diakses dari https://supabase.com/docs',
  'Suryadi, K., & Ramdhani, M. A. (2000). Sistem Pendukung Keputusan: Suatu Wacana Struktural Idealisasi dan Implementasi Konsep Pengambilan Keputusan. Bandung: PT Remaja Rosdakarya.',
  'Turban, E., Aronson, J. E., & Liang, T. P. (2005). Decision Support Systems and Intelligent Systems (7th ed.). Upper Saddle River, NJ: Pearson Prentice Hall.',
  'Triantaphyllou, E. (2000). Multi-Criteria Decision Making Methods: A Comparative Study. Dordrecht: Springer.',
  'Zeleny, M. (1982). Multiple Criteria Decision Making. New York: McGraw-Hill.'
].forEach(x => body.push(p(x)));

const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<w:body>${body.join('')}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/></w:sectPr></w:body>
</w:document>`;

const stylesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:rPr><w:sz w:val="24"/><w:szCs w:val="24"/><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/></w:rPr><w:pPr><w:spacing w:after="160" w:line="360" w:lineRule="auto"/><w:jc w:val="both"/></w:pPr></w:style>
<w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:basedOn w:val="Normal"/><w:rPr><w:b/><w:sz w:val="28"/><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/></w:rPr><w:pPr><w:jc w:val="center"/><w:spacing w:after="240"/></w:pPr></w:style>
<w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:rPr><w:b/><w:sz w:val="28"/></w:rPr><w:pPr><w:spacing w:before="360" w:after="200"/><w:outlineLvl w:val="0"/></w:pPr></w:style>
<w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:rPr><w:b/><w:sz w:val="26"/></w:rPr><w:pPr><w:spacing w:before="280" w:after="160"/><w:outlineLvl w:val="1"/></w:pPr></w:style>
<w:style w:type="paragraph" w:styleId="Heading3"><w:name w:val="heading 3"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:rPr><w:b/><w:sz w:val="24"/></w:rPr><w:pPr><w:spacing w:before="220" w:after="120"/><w:outlineLvl w:val="2"/></w:pPr></w:style>
</w:styles>`;

const numberingXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:numbering xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:abstractNum w:abstractNumId="0"><w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="decimal"/><w:lvlText w:val="%1."/><w:lvlJc w:val="left"/><w:pPr><w:ind w:left="720" w:hanging="360"/></w:pPr></w:lvl></w:abstractNum><w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num></w:numbering>`;

fs.writeFileSync(path.join(work, '[Content_Types].xml'), `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>`);
fs.writeFileSync(path.join(work, '_rels', '.rels'), `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/></Relationships>`);
fs.writeFileSync(path.join(work, 'word', '_rels', 'document.xml.rels'), `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/></Relationships>`);
fs.writeFileSync(path.join(work, 'word', 'document.xml'), documentXml);
fs.writeFileSync(path.join(work, 'word', 'styles.xml'), stylesXml);
fs.writeFileSync(path.join(work, 'word', 'numbering.xml'), numberingXml);
fs.writeFileSync(path.join(work, 'docProps', 'core.xml'), `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>Laporan SPK SAW Supplier Revisi</dc:title><dc:creator>OpenCode</dc:creator><cp:lastModifiedBy>OpenCode</cp:lastModifiedBy><dcterms:created xsi:type="dcterms:W3CDTF">2026-06-04T00:00:00Z</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">2026-06-04T00:00:00Z</dcterms:modified></cp:coreProperties>`);
fs.writeFileSync(path.join(work, 'docProps', 'app.xml'), `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><Application>OpenCode</Application></Properties>`);

fs.rmSync(out, { force: true });
execFileSync('powershell.exe', ['-NoProfile', '-Command', `Compress-Archive -Path "${path.join(work, '*')}" -DestinationPath "${out}.zip" -Force; Move-Item -LiteralPath "${out}.zip" -Destination "${out}" -Force`], { stdio: 'inherit' });
fs.rmSync(work, { recursive: true, force: true });
console.log(out);
