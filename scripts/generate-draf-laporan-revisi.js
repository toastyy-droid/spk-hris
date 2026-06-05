const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const out = path.join(root, 'Draf_Laporan_REVISI.docx');
const work = path.join(root, '.tmp-draf-laporan-revisi');

fs.rmSync(work, { recursive: true, force: true });
fs.mkdirSync(path.join(work, '_rels'), { recursive: true });
fs.mkdirSync(path.join(work, 'word', '_rels'), { recursive: true });
fs.mkdirSync(path.join(work, 'docProps'), { recursive: true });

const esc = (value) => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function paragraph(text, style = 'Normal') {
  const styleXml = style === 'Normal' ? '' : `<w:pStyle w:val="${style}"/>`;
  const runs = String(text).split('\n').map((line, i) => `<w:r>${i ? '<w:br/>' : ''}<w:t xml:space="preserve">${esc(line)}</w:t></w:r>`).join('');
  return `<w:p><w:pPr>${styleXml}</w:pPr>${runs}</w:p>`;
}

function heading(level, text) {
  return paragraph(text, `Heading${level}`);
}

function bullet(text) {
  return `<w:p><w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr></w:pPr><w:r><w:t xml:space="preserve">${esc(text)}</w:t></w:r></w:p>`;
}

function table(rows) {
  return `<w:tbl><w:tblPr><w:tblW w:w="0" w:type="auto"/><w:tblBorders><w:top w:val="single" w:sz="4"/><w:left w:val="single" w:sz="4"/><w:bottom w:val="single" w:sz="4"/><w:right w:val="single" w:sz="4"/><w:insideH w:val="single" w:sz="4"/><w:insideV w:val="single" w:sz="4"/></w:tblBorders></w:tblPr>${rows.map((row) => `<w:tr>${row.map((cell) => `<w:tc><w:tcPr><w:tcW w:w="2200" w:type="dxa"/></w:tcPr>${paragraph(cell)}</w:tc>`).join('')}</w:tr>`).join('')}</w:tbl>`;
}

const body = [];

body.push(paragraph('LAPORAN', 'Title'));
body.push(paragraph('SISTEM PENDUKUNG KEPUTUSAN', 'Title'));
body.push(paragraph('IMPLEMENTASI METODE SIMPLE ADDITIVE WEIGHTING (SAW)\nUNTUK SELEKSI SUPPLIER AKSESORIS HANDPHONE\nPADA CV ANUGERAH MEGA MAKMUR PONTIANAK', 'Title'));
body.push(paragraph('Disusun oleh:', 'Center'));
body.push(paragraph('DEIGO JANVIER (23412978)\nFERDINANDUS ABDIAR (23412983)\nIRNIAWATI SONIA (23412991)\nJACKSON (23412992)\nJHULIO THENDEUX (23412994)', 'Center'));
body.push(paragraph('PROGRAM STUDI SISTEM INFORMASI\nFAKULTAS TEKNOLOGI INFORMASI\nUNIVERSITAS WIDYA DHARMA PONTIANAK\n2026', 'Center'));

body.push(heading(1, 'KATA PENGANTAR'));
body.push(paragraph('Puji syukur kami panjatkan ke hadirat Tuhan Yang Maha Esa karena atas rahmat dan karunia-Nya, laporan tugas Sistem Pendukung Keputusan ini dapat diselesaikan dengan baik. Laporan ini disusun sebagai salah satu bentuk pemenuhan tugas mata kuliah Sistem Pendukung Keputusan pada Program Studi Sistem Informasi.'));
body.push(paragraph('Laporan ini membahas penerapan metode Simple Additive Weighting (SAW) untuk membantu proses seleksi supplier aksesoris handphone pada CV Anugerah Mega Makmur Pontianak. Pembahasan dalam laporan ini meliputi latar belakang permasalahan, landasan teori, penentuan kriteria dan bobot, perhitungan manual metode SAW, implementasi sistem, serta perbandingan hasil perhitungan manual dengan sistem.'));
body.push(paragraph('Kami menyadari bahwa laporan ini masih memiliki kekurangan. Oleh karena itu, kritik dan saran yang membangun sangat kami harapkan agar laporan ini dapat menjadi lebih baik. Semoga laporan ini dapat bermanfaat bagi pembaca, khususnya bagi mahasiswa yang mempelajari sistem pendukung keputusan dan penerapan metode SAW.'));
body.push(paragraph('Pontianak, 20 Mei 2026\n\nTim Penyusun'));

body.push(heading(1, 'DAFTAR ISI'));
['KATA PENGANTAR', 'DAFTAR ISI', 'DAFTAR TABEL', 'BAB I PENDAHULUAN', '1.1 Latar Belakang', '1.2 Rumusan Masalah', '1.3 Tujuan Penelitian', '1.4 Batasan Masalah', '1.5 Manfaat Penelitian', '1.6 Metode Penelitian', 'BAB II PEMBAHASAN', '2.1 Profil Singkat Objek Penelitian', '2.2 Landasan Teori', '2.3 Identifikasi Kriteria dan Bobot', '2.4 Data Alternatif Supplier', '2.5 Perhitungan Manual Metode SAW', '2.6 Implementasi Sistem', '2.7 Perbandingan Hasil Manual dan Sistem', '2.8 Hasil Observasi dan Wawancara', 'BAB III PENUTUP', '3.1 Kesimpulan', '3.2 Saran', 'DAFTAR PUSTAKA', 'LAMPIRAN'].forEach((x) => body.push(paragraph(x)));

body.push(heading(1, 'DAFTAR TABEL'));
['Tabel 2.1 Kriteria dan Bobot Penilaian', 'Tabel 2.2 Data Alternatif Supplier', 'Tabel 2.3 Nilai Alternatif Skala 0-1', 'Tabel 2.4 Nilai Minimum dan Maksimum', 'Tabel 2.5 Hasil Normalisasi', 'Tabel 2.6 Skor Akhir SAW', 'Tabel 2.7 Ranking Supplier', 'Tabel 2.8 Perbandingan Hasil Manual dan Sistem'].forEach((x) => body.push(paragraph(x)));

body.push(heading(1, 'BAB I PENDAHULUAN'));
body.push(heading(2, '1.1 Latar Belakang'));
body.push(paragraph('Perkembangan penggunaan smartphone mendorong meningkatnya kebutuhan terhadap produk aksesoris handphone, seperti charger, kabel data, casing, tempered glass, powerbank, earphone, dan berbagai perlengkapan pendukung lainnya. Kondisi tersebut membuka peluang bagi pelaku usaha grosir aksesoris handphone untuk memenuhi kebutuhan pasar dengan menyediakan produk yang berkualitas, harga yang kompetitif, dan stok yang tersedia secara berkelanjutan.'));
body.push(paragraph('CV Anugerah Mega Makmur merupakan usaha yang bergerak dalam perdagangan grosir aksesoris handphone di Pontianak. Dalam menjalankan kegiatan operasionalnya, perusahaan bekerja sama dengan beberapa supplier untuk memenuhi kebutuhan stok barang. Pemilihan supplier menjadi salah satu keputusan penting karena berpengaruh terhadap harga jual, kualitas barang, ketersediaan stok, ketepatan pengiriman, dan kepuasan pelanggan.'));
body.push(paragraph('Permasalahan yang dihadapi adalah proses pemilihan supplier masih dilakukan secara subjektif berdasarkan pengalaman, kebiasaan kerja sama, atau pertimbangan pribadi. Cara tersebut dapat membantu dalam kondisi tertentu, tetapi belum memberikan dasar penilaian yang terukur dan terdokumentasi. Akibatnya, keputusan pemilihan supplier dapat menjadi kurang konsisten, terutama ketika terdapat beberapa supplier dengan kualitas dan penawaran yang relatif seimbang.'));
body.push(paragraph('Untuk mengatasi permasalahan tersebut, diperlukan Sistem Pendukung Keputusan (SPK) yang dapat membantu proses seleksi supplier secara lebih objektif dan terstruktur. SPK dapat mengolah data supplier berdasarkan beberapa kriteria yang telah ditentukan, kemudian menghasilkan rekomendasi dalam bentuk skor dan peringkat.'));
body.push(paragraph('Metode yang digunakan dalam laporan ini adalah Simple Additive Weighting (SAW). Metode SAW dipilih karena memiliki konsep yang sederhana, mudah diterapkan, dan sesuai untuk menyelesaikan permasalahan pengambilan keputusan dengan banyak kriteria. Melalui proses normalisasi dan pembobotan, metode SAW dapat menghasilkan nilai preferensi untuk setiap alternatif supplier sehingga perusahaan dapat menentukan supplier terbaik berdasarkan hasil perhitungan yang jelas.'));

body.push(heading(2, '1.2 Rumusan Masalah'));
['Bagaimana menentukan kriteria dan bobot penilaian yang relevan dalam proses seleksi supplier aksesoris handphone pada CV Anugerah Mega Makmur?', 'Bagaimana menerapkan metode Simple Additive Weighting (SAW) untuk menghasilkan rekomendasi supplier terbaik?', 'Bagaimana merancang sistem pendukung keputusan berbasis web untuk proses seleksi supplier?', 'Bagaimana kesesuaian hasil perhitungan sistem dengan hasil perhitungan manual metode SAW?'].forEach((x) => body.push(bullet(x)));
body.push(heading(2, '1.3 Tujuan Penelitian'));
['Mengidentifikasi kriteria dan bobot yang digunakan dalam proses seleksi supplier.', 'Menerapkan metode Simple Additive Weighting (SAW) dalam proses perhitungan dan perankingan supplier.', 'Merancang sistem pendukung keputusan berbasis web untuk membantu evaluasi supplier.', 'Membandingkan hasil perhitungan manual dengan hasil perhitungan sistem untuk mengetahui kesesuaiannya.'].forEach((x) => body.push(bullet(x)));
body.push(heading(2, '1.4 Batasan Masalah'));
['Penelitian dilakukan pada CV Anugerah Mega Makmur Pontianak.', 'Kriteria penilaian yang digunakan terdiri dari Harga, Kualitas, Pengiriman, Layanan, dan Kapasitas.', 'Metode yang digunakan adalah Simple Additive Weighting (SAW).', 'Data alternatif supplier yang digunakan berjumlah lima supplier sebagai sampel perhitungan.', 'Sistem yang dirancang berbasis web dan digunakan untuk membantu proses evaluasi supplier.'].forEach((x) => body.push(bullet(x)));
body.push(heading(2, '1.5 Manfaat Penelitian'));
['Bagi perusahaan, sistem dapat membantu proses seleksi supplier secara lebih objektif dan terstruktur.', 'Bagi mahasiswa, laporan ini dapat menjadi contoh penerapan metode SAW dalam kasus pemilihan supplier.', 'Bagi penulis, penelitian ini menjadi sarana penerapan materi Sistem Pendukung Keputusan ke dalam studi kasus nyata.'].forEach((x) => body.push(bullet(x)));
body.push(heading(2, '1.6 Metode Penelitian'));
body.push(paragraph('Metode penelitian yang digunakan dalam penyusunan laporan ini terdiri dari observasi, wawancara, studi pustaka, perancangan sistem, implementasi, dan pengujian. Observasi dilakukan dengan mengamati proses pemilihan supplier pada CV Anugerah Mega Makmur. Wawancara dilakukan untuk memperoleh informasi mengenai kriteria yang digunakan dalam memilih supplier, bobot prioritas setiap kriteria, dan kebutuhan sistem yang diharapkan.'));
body.push(paragraph('Studi pustaka dilakukan dengan mempelajari referensi yang berkaitan dengan Sistem Pendukung Keputusan dan metode Simple Additive Weighting. Perancangan sistem dilakukan dengan menentukan alur kerja sistem, data yang diperlukan, dan tampilan utama sistem. Implementasi dilakukan dengan membangun sistem berbasis web. Pengujian dilakukan dengan membandingkan hasil perhitungan manual dengan hasil perhitungan sistem.'));

body.push(heading(1, 'BAB II PEMBAHASAN'));
body.push(heading(2, '2.1 Profil Singkat Objek Penelitian'));
body.push(paragraph('CV Anugerah Mega Makmur merupakan usaha yang bergerak dalam perdagangan grosir aksesoris handphone di Pontianak. Produk yang dijual meliputi charger, kabel data, casing, tempered glass, powerbank, earphone, dan aksesoris pendukung lainnya. Dalam kegiatan operasionalnya, perusahaan bekerja sama dengan beberapa supplier untuk memenuhi kebutuhan stok barang. Supplier yang dipilih harus mampu menyediakan produk dengan harga yang kompetitif, kualitas yang baik, pengiriman yang tepat waktu, layanan yang responsif, dan kapasitas stok yang memadai.'));
body.push(paragraph('Pemilihan supplier sebelumnya masih dilakukan secara manual dan berdasarkan pengalaman. Oleh karena itu, diperlukan sistem pendukung keputusan yang dapat membantu proses seleksi supplier secara lebih objektif berdasarkan kriteria dan bobot yang jelas.'));

body.push(heading(2, '2.2 Landasan Teori'));
body.push(heading(3, '2.2.1 Sistem Pendukung Keputusan'));
body.push(paragraph('Sistem Pendukung Keputusan (SPK) adalah sistem berbasis komputer yang digunakan untuk membantu pengambil keputusan dalam menyelesaikan permasalahan yang bersifat semi-terstruktur atau tidak terstruktur. SPK tidak menggantikan peran pengambil keputusan, tetapi memberikan informasi, data, dan model perhitungan yang dapat digunakan sebagai dasar pertimbangan.'));
body.push(paragraph('Dalam penelitian ini, SPK digunakan untuk membantu proses seleksi supplier. Sistem mengolah data supplier berdasarkan kriteria yang telah ditentukan, kemudian menghasilkan skor akhir dan ranking supplier. Dengan adanya SPK, keputusan pemilihan supplier dapat dilakukan secara lebih objektif dan terdokumentasi.'));
body.push(heading(3, '2.2.2 Metode Simple Additive Weighting (SAW)'));
body.push(paragraph('Simple Additive Weighting (SAW) merupakan salah satu metode dalam Multi-Attribute Decision Making (MADM). Metode ini dikenal sebagai metode penjumlahan terbobot karena proses penilaiannya dilakukan dengan menjumlahkan hasil perkalian antara bobot kriteria dan nilai rating kinerja setiap alternatif.'));
body.push(paragraph('Rumus normalisasi untuk kriteria benefit adalah: rij = xij / max(xij).'));
body.push(paragraph('Rumus normalisasi untuk kriteria cost adalah: rij = min(xij) / xij.'));
body.push(paragraph('Nilai preferensi setiap alternatif dihitung dengan rumus: Vi = Σ(wj × rij). Pada laporan ini, terdapat bonus sebesar 0,05 bagi supplier yang menanggung ongkos kirim, sehingga rumus akhir yang digunakan adalah: Vi = Σ(wj × rij) + bonus ongkir.'));

body.push(heading(2, '2.3 Identifikasi Kriteria dan Bobot'));
body.push(table([
  ['No', 'Kriteria', 'Jenis', 'Bobot', 'Keterangan'],
  ['1', 'Harga', 'Cost', '30%', 'Semakin murah harga, semakin baik'],
  ['2', 'Kualitas', 'Benefit', '30%', 'Semakin baik kualitas, semakin baik'],
  ['3', 'Pengiriman', 'Benefit', '20%', 'Semakin cepat dan tepat, semakin baik'],
  ['4', 'Layanan', 'Benefit', '10%', 'Semakin responsif layanan, semakin baik'],
  ['5', 'Kapasitas', 'Benefit', '10%', 'Semakin besar kapasitas stok, semakin baik'],
  ['-', 'Bonus Ongkir', 'Tambahan', '+0,05', 'Jika supplier menanggung ongkos kirim'],
]));
body.push(paragraph('Harga dan kualitas memiliki bobot tertinggi karena keduanya menjadi faktor utama dalam pemilihan supplier. Harga berpengaruh terhadap daya saing penjualan, sedangkan kualitas berpengaruh terhadap kepuasan pelanggan.'));

body.push(heading(2, '2.4 Data Alternatif Supplier'));
body.push(table([
  ['Alternatif', 'Harga', 'Kualitas', 'Pengiriman', 'Layanan', 'Kapasitas', 'Ongkir'],
  ['Pontianak Mobile Grosir', '9,1', '9,0', '8,8', '8,6', '9,2', 'Tidak'],
  ['Khatulistiwa Gadget Supply', '8,6', '9,3', '9,0', '8,9', '8,8', 'Ya'],
  ['Borneo Tech Distributor', '8,2', '9,5', '8,4', '8,8', '8,6', 'Tidak'],
  ['Mega Jaya Cellular', '8,9', '8,8', '9,2', '8,7', '8,9', 'Tidak'],
  ['JBL Audio Partner', '8,0', '9,4', '8,3', '8,7', '8,2', 'Tidak'],
]));
body.push(paragraph('Nilai tersebut kemudian dikonversi ke skala 0 sampai 1 dengan membagi setiap nilai dengan 10.'));
body.push(table([
  ['Alternatif', 'Harga', 'Kualitas', 'Pengiriman', 'Layanan', 'Kapasitas'],
  ['Pontianak Mobile Grosir', '0,91', '0,90', '0,88', '0,86', '0,92'],
  ['Khatulistiwa Gadget Supply', '0,86', '0,93', '0,90', '0,89', '0,88'],
  ['Borneo Tech Distributor', '0,82', '0,95', '0,84', '0,88', '0,86'],
  ['Mega Jaya Cellular', '0,89', '0,88', '0,92', '0,87', '0,89'],
  ['JBL Audio Partner', '0,80', '0,94', '0,83', '0,87', '0,82'],
]));

body.push(heading(2, '2.5 Perhitungan Manual Metode SAW'));
body.push(heading(3, '2.5.1 Normalisasi Matriks Keputusan'));
body.push(paragraph('Karena Harga merupakan kriteria cost, maka digunakan nilai minimum. Sedangkan Kualitas, Pengiriman, Layanan, dan Kapasitas merupakan kriteria benefit, sehingga digunakan nilai maksimum.'));
body.push(table([
  ['Keterangan', 'Harga', 'Kualitas', 'Pengiriman', 'Layanan', 'Kapasitas'],
  ['Min (Cost)', '0,80', '-', '-', '-', '-'],
  ['Max (Benefit)', '-', '0,95', '0,92', '0,89', '0,92'],
]));
body.push(table([
  ['Alternatif', 'Harga', 'Kualitas', 'Pengiriman', 'Layanan', 'Kapasitas'],
  ['Pontianak Mobile Grosir', '0,8791', '0,9474', '0,9565', '0,9663', '1,0000'],
  ['Khatulistiwa Gadget Supply', '0,9302', '0,9789', '0,9783', '1,0000', '0,9565'],
  ['Borneo Tech Distributor', '0,9756', '1,0000', '0,9130', '0,9888', '0,9348'],
  ['Mega Jaya Cellular', '0,8989', '0,9263', '1,0000', '0,9775', '0,9674'],
  ['JBL Audio Partner', '1,0000', '0,9895', '0,9022', '0,9775', '0,8913'],
]));
body.push(paragraph('Contoh perhitungan normalisasi Pontianak Mobile Grosir: Harga = 0,80 / 0,91 = 0,8791; Kualitas = 0,90 / 0,95 = 0,9474; Pengiriman = 0,88 / 0,92 = 0,9565; Layanan = 0,86 / 0,89 = 0,9663; Kapasitas = 0,92 / 0,92 = 1,0000.'));

body.push(heading(3, '2.5.2 Perhitungan Nilai Preferensi'));
body.push(table([
  ['Alternatif', 'Harga × 0,3', 'Kualitas × 0,3', 'Pengiriman × 0,2', 'Layanan × 0,1', 'Kapasitas × 0,1', 'Skor Akhir'],
  ['Pontianak Mobile Grosir', '0,2637', '0,2842', '0,1913', '0,0966', '0,1000', '0,9358'],
  ['Khatulistiwa Gadget Supply', '0,2791', '0,2937', '0,1957', '0,1000', '0,0957', '1,0142'],
  ['Borneo Tech Distributor', '0,2927', '0,3000', '0,1826', '0,0989', '0,0935', '0,9677'],
  ['Mega Jaya Cellular', '0,2697', '0,2779', '0,2000', '0,0978', '0,0967', '0,9421'],
  ['JBL Audio Partner', '0,3000', '0,2969', '0,1804', '0,0978', '0,0891', '0,9642'],
]));
body.push(paragraph('Contoh perhitungan Khatulistiwa Gadget Supply: Vi = (0,9302 × 0,3) + (0,9789 × 0,3) + (0,9783 × 0,2) + (1,0000 × 0,1) + (0,9565 × 0,1) + 0,05 = 1,0142.'));

body.push(heading(3, '2.5.3 Perankingan Supplier'));
body.push(table([
  ['Ranking', 'Supplier', 'Skor SAW', 'Threshold 0,75', 'Rekomendasi'],
  ['1', 'Khatulistiwa Gadget Supply', '1,0142', '≥ 0,75', 'Direkomendasikan'],
  ['2', 'Borneo Tech Distributor', '0,9677', '≥ 0,75', 'Direkomendasikan'],
  ['3', 'JBL Audio Partner', '0,9642', '≥ 0,75', 'Direkomendasikan'],
  ['4', 'Mega Jaya Cellular', '0,9421', '≥ 0,75', 'Direkomendasikan'],
  ['5', 'Pontianak Mobile Grosir', '0,9358', '≥ 0,75', 'Direkomendasikan'],
]));
body.push(paragraph('Berdasarkan hasil perankingan, Khatulistiwa Gadget Supply menempati peringkat pertama dengan skor 1,0142. Skor tersebut melebihi 1,0 karena supplier mendapatkan bonus ongkos kirim sebesar 0,05.'));

body.push(heading(2, '2.6 Implementasi Sistem'));
body.push(paragraph('Sistem pendukung keputusan seleksi supplier dirancang berbasis web. Sistem ini digunakan untuk mengelola data supplier, menyimpan nilai kriteria, menjalankan perhitungan SAW, dan menampilkan hasil ranking supplier. Secara umum, sistem terdiri dari antarmuka pengguna, proses perhitungan, dan penyimpanan data.'));
body.push(paragraph('Fitur utama sistem meliputi pengelolaan data supplier, halaman kriteria penilaian, evaluasi supplier, dan hasil ranking. Dengan fitur tersebut, pengguna dapat melakukan evaluasi supplier secara lebih mudah dan terdokumentasi.'));

body.push(heading(2, '2.7 Perbandingan Hasil Manual dan Sistem'));
body.push(table([
  ['Supplier', 'Skor Manual', 'Skor Sistem', 'Selisih'],
  ['Pontianak Mobile Grosir', '0,9358', '0,9358', '0,0000'],
  ['Khatulistiwa Gadget Supply', '1,0142', '1,0142', '0,0000'],
  ['Borneo Tech Distributor', '0,9677', '0,9677', '0,0000'],
  ['Mega Jaya Cellular', '0,9421', '0,9421', '0,0000'],
  ['JBL Audio Partner', '0,9642', '0,9642', '0,0000'],
]));
body.push(paragraph('Berdasarkan tabel tersebut, hasil perhitungan manual dan sistem memiliki nilai yang sama. Selisih sebesar 0,0000 menunjukkan bahwa proses perhitungan pada sistem telah sesuai dengan perhitungan manual metode SAW.'));

body.push(heading(2, '2.8 Hasil Observasi dan Wawancara'));
body.push(paragraph('Berdasarkan hasil observasi, proses pencatatan supplier pada CV Anugerah Mega Makmur masih dilakukan secara manual dan belum memiliki sistem evaluasi yang terstruktur. Penilaian supplier masih bergantung pada pengalaman pemilik dan belum menggunakan bobot kriteria yang jelas.'));
body.push(paragraph('Berdasarkan hasil wawancara, kriteria yang paling diperhatikan dalam pemilihan supplier adalah harga dan kualitas. Selain itu, pengiriman, layanan, dan kapasitas stok juga menjadi pertimbangan penting. Pemilik membutuhkan sistem yang dapat membantu menilai supplier secara lebih objektif agar proses pemilihan supplier tidak hanya berdasarkan perkiraan atau pengalaman pribadi.'));

body.push(heading(1, 'BAB III PENUTUP'));
body.push(heading(2, '3.1 Kesimpulan'));
['Proses seleksi supplier aksesoris handphone pada CV Anugerah Mega Makmur dapat dilakukan menggunakan metode Simple Additive Weighting (SAW) dengan lima kriteria, yaitu Harga, Kualitas, Pengiriman, Layanan, dan Kapasitas.', 'Kriteria Harga termasuk kriteria cost, sedangkan Kualitas, Pengiriman, Layanan, dan Kapasitas termasuk kriteria benefit.', 'Bobot yang digunakan adalah Harga 30%, Kualitas 30%, Pengiriman 20%, Layanan 10%, dan Kapasitas 10%.', 'Berdasarkan hasil perhitungan manual, Khatulistiwa Gadget Supply memperoleh skor tertinggi sebesar 1,0142 dan menjadi rekomendasi utama.', 'Hasil perhitungan sistem sama dengan hasil perhitungan manual, dengan selisih 0,0000 pada seluruh alternatif. Hal ini menunjukkan bahwa sistem telah mengimplementasikan metode SAW dengan benar.'].forEach((x) => body.push(bullet(x)));
body.push(heading(2, '3.2 Saran'));
['Data supplier sebaiknya diperbarui secara berkala agar hasil evaluasi tetap sesuai dengan kondisi terbaru.', 'Sistem dapat dikembangkan dengan menambahkan kriteria lain, seperti garansi produk, reputasi supplier, dan lama kerja sama.', 'Penelitian selanjutnya dapat membandingkan metode SAW dengan metode lain, seperti AHP atau TOPSIS.', 'Sistem dapat dikembangkan agar terintegrasi dengan data pembelian atau stok barang sehingga penilaian supplier menjadi lebih akurat.', 'Hasil evaluasi sebaiknya digunakan sebagai alat bantu pengambilan keputusan, bukan sebagai satu-satunya dasar keputusan.'].forEach((x) => body.push(bullet(x)));

body.push(heading(1, 'DAFTAR PUSTAKA'));
['Afshari, A., Mojahed, M., & Yusuff, R. M. (2010). Simple Additive Weighting approach to personnel selection problem. International Journal of Innovation, Management and Technology, 1(5), 511-515.', 'Kusumadewi, S., Hartati, S., Harjoko, A., & Wardoyo, R. (2006). Fuzzy Multi-Attribute Decision Making (Fuzzy MADM). Yogyakarta: Graha Ilmu.', 'Suryadi, K., & Ramdhani, M. A. (2000). Sistem Pendukung Keputusan: Suatu Wacana Struktural Idealisasi dan Implementasi Konsep Pengambilan Keputusan. Bandung: PT Remaja Rosdakarya.', 'Turban, E., Aronson, J. E., & Liang, T. P. (2005). Decision Support Systems and Intelligent Systems (7th ed.). New Jersey: Pearson Education.'].forEach((x) => body.push(paragraph(x)));

body.push(heading(1, 'LAMPIRAN'));
body.push(heading(2, 'Lampiran 1. Ringkasan Wawancara'));
body.push(paragraph('Pertanyaan 1: Bagaimana proses pemilihan supplier yang selama ini berjalan?\nJawaban: Pemilihan supplier masih dilakukan secara manual berdasarkan pengalaman, harga, kualitas barang, dan rekomendasi dari pihak lain.'));
body.push(paragraph('Pertanyaan 2: Kriteria apa saja yang dipertimbangkan dalam memilih supplier?\nJawaban: Kriteria yang dipertimbangkan adalah harga, kualitas, pengiriman, layanan, dan kapasitas stok.'));
body.push(paragraph('Pertanyaan 3: Kriteria mana yang paling penting?\nJawaban: Harga dan kualitas menjadi kriteria paling penting. Pengiriman juga penting, sedangkan layanan dan kapasitas menjadi faktor pendukung.'));
body.push(paragraph('Pertanyaan 4: Apakah diperlukan sistem untuk membantu proses pemilihan supplier?\nJawaban: Sistem diperlukan agar proses penilaian supplier menjadi lebih rapi, objektif, dan mudah dilihat kembali.'));
body.push(heading(2, 'Lampiran 2. Diagram Alur Metode SAW'));
body.push(paragraph('Mulai → Input data supplier → Input nilai kriteria → Menentukan jenis kriteria cost dan benefit → Menentukan bobot setiap kriteria → Normalisasi nilai alternatif → Menghitung nilai preferensi Vi → Menambahkan bonus ongkir jika ada → Mengurutkan supplier berdasarkan skor → Menentukan rekomendasi berdasarkan threshold → Selesai.'));

const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${body.join('')}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/></w:sectPr></w:body></w:document>`;

const stylesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="24"/></w:rPr><w:pPr><w:spacing w:after="160" w:line="360" w:lineRule="auto"/><w:jc w:val="both"/></w:pPr></w:style><w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:basedOn w:val="Normal"/><w:rPr><w:b/><w:sz w:val="28"/></w:rPr><w:pPr><w:jc w:val="center"/><w:spacing w:after="240"/></w:pPr></w:style><w:style w:type="paragraph" w:styleId="Center"><w:name w:val="Center"/><w:basedOn w:val="Normal"/><w:pPr><w:jc w:val="center"/></w:pPr></w:style><w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:rPr><w:b/><w:sz w:val="28"/></w:rPr><w:pPr><w:spacing w:before="360" w:after="200"/><w:outlineLvl w:val="0"/></w:pPr></w:style><w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:basedOn w:val="Normal"/><w:rPr><w:b/><w:sz w:val="26"/></w:rPr><w:pPr><w:spacing w:before="280" w:after="160"/><w:outlineLvl w:val="1"/></w:pPr></w:style><w:style w:type="paragraph" w:styleId="Heading3"><w:name w:val="heading 3"/><w:basedOn w:val="Normal"/><w:rPr><w:b/><w:sz w:val="24"/></w:rPr><w:pPr><w:spacing w:before="220" w:after="120"/><w:outlineLvl w:val="2"/></w:pPr></w:style></w:styles>`;

const numberingXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:numbering xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:abstractNum w:abstractNumId="0"><w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="decimal"/><w:lvlText w:val="%1."/><w:pPr><w:ind w:left="720" w:hanging="360"/></w:pPr></w:lvl></w:abstractNum><w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num></w:numbering>`;

fs.writeFileSync(path.join(work, '[Content_Types].xml'), `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>`);
fs.writeFileSync(path.join(work, '_rels', '.rels'), `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/></Relationships>`);
fs.writeFileSync(path.join(work, 'word', '_rels', 'document.xml.rels'), `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/></Relationships>`);
fs.writeFileSync(path.join(work, 'word', 'document.xml'), documentXml);
fs.writeFileSync(path.join(work, 'word', 'styles.xml'), stylesXml);
fs.writeFileSync(path.join(work, 'word', 'numbering.xml'), numberingXml);
fs.writeFileSync(path.join(work, 'docProps', 'core.xml'), `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>Draf Laporan Revisi</dc:title><dc:creator>OpenCode</dc:creator><cp:lastModifiedBy>OpenCode</cp:lastModifiedBy><dcterms:created xsi:type="dcterms:W3CDTF">2026-06-04T00:00:00Z</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">2026-06-04T00:00:00Z</dcterms:modified></cp:coreProperties>`);
fs.writeFileSync(path.join(work, 'docProps', 'app.xml'), `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"><Application>OpenCode</Application></Properties>`);

fs.rmSync(out, { force: true });
execFileSync('powershell.exe', ['-NoProfile', '-Command', `Compress-Archive -Path "${path.join(work, '*')}" -DestinationPath "${out}.zip" -Force; Move-Item -LiteralPath "${out}.zip" -Destination "${out}" -Force`], { stdio: 'inherit' });
fs.rmSync(work, { recursive: true, force: true });
console.log(out);
