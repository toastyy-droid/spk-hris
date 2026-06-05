const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const out = path.join(root, 'PANDUAN_COPY_PASTE_DRAF_LAPORAN.docx');
const work = path.join(root, '.tmp-panduan-copy-laporan');

fs.rmSync(work, { recursive: true, force: true });
fs.mkdirSync(path.join(work, '_rels'), { recursive: true });
fs.mkdirSync(path.join(work, 'word', '_rels'), { recursive: true });
fs.mkdirSync(path.join(work, 'docProps'), { recursive: true });

const esc = (value) => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function p(text, style = 'Normal') {
  const styleXml = style === 'Normal' ? '' : `<w:pStyle w:val="${style}"/>`;
  const runs = String(text).split('\n').map((line, i) => `<w:r>${i ? '<w:br/>' : ''}<w:t xml:space="preserve">${esc(line)}</w:t></w:r>`).join('');
  return `<w:p><w:pPr>${styleXml}</w:pPr>${runs}</w:p>`;
}

function h(level, text) {
  return p(text, `Heading${level}`);
}

function bullet(text) {
  return `<w:p><w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr></w:pPr><w:r><w:t xml:space="preserve">${esc(text)}</w:t></w:r></w:p>`;
}

function code(text) {
  return p(text, 'Code');
}

const body = [];

body.push(p('PANDUAN COPY-PASTE REVISI DRAF LAPORAN SPK SAW', 'Title'));
body.push(p('Dokumen ini berisi teks siap salin untuk melengkapi Draf_Laporan.docx. File ini bukan pengganti laporan utama, tetapi panduan agar bagian yang kurang dapat langsung dimasukkan ke draft.'));

body.push(h(1, '1. Judul BAB dan Subbab'));
body.push(p('Gunakan penomoran berikut agar isi laporan sesuai dengan daftar isi.'));
code('BAB I PENDAHULUAN\n\n1.1 Latar Belakang\n1.2 Rumusan Masalah\n1.3 Tujuan Penelitian\n1.4 Batasan Masalah\n1.5 Manfaat Penelitian\n1.6 Metode Penelitian\n1.6.1 Observasi\n1.6.2 Wawancara\n1.6.3 Studi Pustaka\n1.6.4 Perancangan Sistem\n1.6.5 Implementasi\n1.6.6 Pengujian');
code('BAB II PEMBAHASAN\n\n2.1 Profil CV Anugerah Mega Makmur\n2.2 Landasan Teori\n2.2.1 Sistem Pendukung Keputusan\n2.2.2 Metode Simple Additive Weighting (SAW)\n2.3 Identifikasi Kriteria dan Bobot\n2.4 Perhitungan Manual Metode SAW\n2.4.1 Data Alternatif Supplier\n2.4.2 Proses Normalisasi\n2.4.3 Perhitungan Skor Akhir\n2.4.4 Perankingan\n2.5 Implementasi Sistem Berbasis Web\n2.6 Perbandingan Perhitungan Manual dan Web\n2.7 Dokumentasi Observasi dan Wawancara');

body.push(h(1, '2. Daftar Tabel'));
body.push(p('Letakkan bagian ini di bawah judul DAFTAR TABEL.'));
code('DAFTAR TABEL\n\nTabel 2.1 Kriteria dan Bobot Penilaian\nTabel 2.2 Data Alternatif Supplier\nTabel 2.3 Nilai Alternatif Skala 0-1\nTabel 2.4 Nilai Minimum dan Maksimum\nTabel 2.5 Hasil Normalisasi\nTabel 2.6 Skor Akhir SAW\nTabel 2.7 Ranking Supplier\nTabel 2.8 Perbandingan Perhitungan Manual dan Web');

body.push(h(1, '3. Daftar Gambar'));
body.push(p('Letakkan bagian ini setelah DAFTAR TABEL jika kamu memakai diagram atau screenshot web.'));
code('DAFTAR GAMBAR\n\nGambar 2.1 Alur Perhitungan Metode SAW\nGambar 2.2 Halaman Data Supplier\nGambar 2.3 Halaman Kriteria Penilaian\nGambar 2.4 Halaman Evaluasi Supplier\nGambar 2.5 Hasil Ranking Supplier');

body.push(h(1, '4. Pengganti Bagian Observasi'));
body.push(p('Ganti isi subbab 1.6.1 Observasi dengan teks berikut.'));
body.push(p('Observasi dilakukan dengan mengamati proses bisnis yang berjalan pada CV Anugerah Mega Makmur, khususnya proses pemilihan supplier aksesoris handphone. Kegiatan observasi difokuskan pada cara perusahaan memilih supplier, mencatat data supplier, memeriksa kualitas barang, serta mempertimbangkan faktor harga, kualitas, pengiriman, layanan, dan kapasitas stok.'));
body.push(p('Berdasarkan hasil observasi, proses pemilihan supplier masih dilakukan secara manual dan belum menggunakan sistem penilaian yang terstruktur. Penilaian supplier masih bergantung pada pengalaman pemilik atau pengelola, sehingga diperlukan sistem pendukung keputusan yang dapat membantu proses seleksi supplier secara lebih objektif.'));

body.push(h(1, '5. Pengganti Bagian Wawancara'));
body.push(p('Ganti isi subbab 1.6.2 Wawancara dengan teks berikut.'));
body.push(p('Wawancara dilakukan dengan pihak pemilik atau pengelola CV Anugerah Mega Makmur untuk memperoleh informasi mengenai proses pemilihan supplier yang berjalan saat ini. Wawancara juga digunakan untuk mengetahui kriteria yang dianggap penting dalam menilai supplier, bobot prioritas setiap kriteria, kendala yang dihadapi, serta kebutuhan terhadap sistem pendukung keputusan.'));
body.push(p('Berdasarkan hasil wawancara, kriteria yang digunakan dalam proses pemilihan supplier terdiri dari Harga, Kualitas, Pengiriman, Layanan, dan Kapasitas. Harga dan kualitas menjadi kriteria yang paling penting, sedangkan pengiriman, layanan, dan kapasitas menjadi faktor pendukung dalam proses seleksi supplier.'));

body.push(h(1, '6. Rumus LaTeX Untuk Word Equation'));
body.push(p('Di Word, tekan Alt + =, lalu paste rumus berikut satu per satu.'));
code('r_{ij}=\frac{x_{ij}}{\max(x_{ij})}');
code('r_{ij}=\frac{\min(x_{ij})}{x_{ij}}');
code('V_i=\sum_{j=1}^{n}(w_j \times r_{ij})');
code('V_i=\sum_{j=1}^{n}(w_j \times r_{ij})+B_i');
code('V_i \geq 0{,}75');
body.push(p('Tambahkan keterangan berikut setelah rumus.'));
code('Keterangan:\nVi = nilai preferensi atau skor akhir alternatif ke-i\nwj = bobot kriteria ke-j\nrij = nilai rating kinerja ternormalisasi alternatif ke-i pada kriteria ke-j\nBi = bonus ongkos kirim pada alternatif ke-i\n\nNilai Bi bernilai 0,05 apabila supplier menanggung ongkos kirim, sedangkan Bi bernilai 0 apabila supplier tidak menanggung ongkos kirim.');

body.push(h(1, '7. Tabel Hasil Normalisasi'));
body.push(p('Letakkan setelah tabel nilai minimum dan maksimum, sebelum bagian Perhitungan Nilai Preferensi.'));
code('Tabel 2.5 Hasil Normalisasi\n\nAlternatif\tHarga\tKualitas\tPengiriman\tLayanan\tKapasitas\nPontianak Mobile Grosir\t0,8791\t0,9474\t0,9565\t0,9663\t1,0000\nKhatulistiwa Gadget Supply\t0,9302\t0,9789\t0,9783\t1,0000\t0,9565\nBorneo Tech Distributor\t0,9756\t1,0000\t0,9130\t0,9888\t0,9348\nMega Jaya Cellular\t0,8989\t0,9263\t1,0000\t0,9775\t0,9674\nJBL Audio Partner\t1,0000\t0,9895\t0,9022\t0,9775\t0,8913');
body.push(p('Tabel 2.5 menunjukkan hasil normalisasi dari setiap alternatif supplier. Nilai normalisasi diperoleh berdasarkan jenis kriteria. Untuk kriteria Harga yang termasuk cost, nilai normalisasi dihitung dengan membagi nilai minimum Harga terhadap nilai Harga setiap supplier. Sedangkan untuk kriteria Kualitas, Pengiriman, Layanan, dan Kapasitas yang termasuk benefit, nilai normalisasi dihitung dengan membagi nilai setiap supplier terhadap nilai maksimum pada kriteria tersebut.'));
body.push(p('Contoh perhitungan normalisasi pada Pontianak Mobile Grosir adalah sebagai berikut:'));
code('Harga = 0,80 / 0,91 = 0,8791\nKualitas = 0,90 / 0,95 = 0,9474\nPengiriman = 0,88 / 0,92 = 0,9565\nLayanan = 0,86 / 0,89 = 0,9663\nKapasitas = 0,92 / 0,92 = 1,0000');

body.push(h(1, '8. Diagram Alur SAW'));
body.push(p('Letakkan di bagian metode SAW atau sebelum perhitungan manual.'));
code('Gambar 2.1 Alur Perhitungan Metode SAW\n\nMulai\n↓\nInput data supplier\n↓\nInput nilai kriteria\n↓\nMenentukan jenis kriteria cost dan benefit\n↓\nMenentukan bobot setiap kriteria\n↓\nNormalisasi nilai alternatif\n↓\nMenghitung nilai preferensi Vi\n↓\nMenambahkan bonus ongkir jika ada\n↓\nMengurutkan supplier berdasarkan skor\n↓\nMenentukan rekomendasi berdasarkan threshold\n↓\nSelesai');
body.push(p('Gambar 2.1 menunjukkan alur perhitungan metode SAW dalam proses seleksi supplier. Proses dimulai dari input data supplier dan nilai kriteria, kemudian dilanjutkan dengan penentuan jenis kriteria, normalisasi, perhitungan nilai preferensi, penambahan bonus ongkir, perankingan, dan penentuan rekomendasi berdasarkan threshold.'));

body.push(h(1, '9. Penjelasan Screenshot Web'));
body.push(p('Letakkan di subbab 2.5 Implementasi Sistem Berbasis Web setelah screenshot masing-masing halaman.'));
body.push(p('Gambar 2.2 Halaman Data Supplier'));
body.push(p('Gambar 2.2 menunjukkan halaman Data Supplier yang digunakan untuk menampilkan dan mengelola data supplier. Data pada halaman ini menjadi input utama dalam proses perhitungan metode SAW, seperti nilai Harga, Kualitas, Pengiriman, Layanan, Kapasitas, dan status ongkos kirim.'));
body.push(p('Gambar 2.3 Halaman Kriteria Penilaian'));
body.push(p('Gambar 2.3 menunjukkan halaman Kriteria Penilaian yang berisi daftar kriteria, jenis kriteria, dan bobot yang digunakan dalam proses seleksi supplier. Halaman ini membantu pengguna memahami dasar perhitungan yang digunakan oleh sistem.'));
body.push(p('Gambar 2.4 Halaman Evaluasi Supplier'));
body.push(p('Gambar 2.4 menunjukkan halaman Evaluasi Supplier yang digunakan untuk menjalankan proses perhitungan metode SAW. Pada halaman ini, sistem menampilkan nilai supplier, hasil normalisasi, skor akhir, dan ranking supplier berdasarkan kriteria serta bobot yang telah ditentukan.'));
body.push(p('Gambar 2.5 Hasil Ranking Supplier'));
body.push(p('Gambar 2.5 menunjukkan hasil ranking supplier berdasarkan perhitungan metode SAW. Supplier dengan skor tertinggi berada pada peringkat pertama dan menjadi rekomendasi utama bagi perusahaan.'));

body.push(h(1, '10. Dokumentasi Observasi dan Wawancara'));
body.push(p('Ganti bagian hasil observasi dan wawancara dengan teks berikut.'));
body.push(h(2, '2.7 Dokumentasi Observasi dan Wawancara'));
body.push(p('Observasi dan wawancara dilakukan untuk memperoleh informasi mengenai proses bisnis yang berjalan pada CV Anugerah Mega Makmur, khususnya dalam proses pemilihan supplier aksesoris handphone. Kegiatan ini bertujuan untuk mengetahui permasalahan yang dihadapi, kriteria yang digunakan dalam pemilihan supplier, serta kebutuhan sistem pendukung keputusan.'));
body.push(h(3, '2.7.1 Hasil Observasi'));
body.push(p('Berdasarkan hasil observasi, proses pencatatan supplier pada CV Anugerah Mega Makmur masih dilakukan secara manual dan belum memiliki sistem evaluasi yang terstruktur. Penilaian supplier masih bergantung pada pengalaman pemilik atau pengelola. Selain itu, belum terdapat bobot kriteria yang digunakan sebagai dasar perbandingan antar supplier.'));
['Data supplier belum dikelola dalam sistem yang terstruktur.', 'Penilaian supplier masih dilakukan berdasarkan pengalaman.', 'Belum terdapat metode perhitungan yang digunakan untuk membandingkan supplier.', 'Kriteria pemilihan supplier belum terdokumentasi secara formal.', 'Perusahaan membutuhkan sistem yang dapat membantu proses evaluasi supplier.'].forEach((x) => body.push(bullet(x)));
body.push(h(3, '2.7.2 Hasil Wawancara'));
body.push(p('Berdasarkan hasil wawancara, diketahui bahwa harga dan kualitas merupakan kriteria utama dalam pemilihan supplier. Selain itu, pengiriman, layanan, dan kapasitas stok juga menjadi faktor penting yang dipertimbangkan. Pemilik atau pengelola membutuhkan sistem yang dapat membantu menilai supplier secara lebih objektif agar proses pemilihan tidak hanya berdasarkan perkiraan atau pengalaman pribadi.'));
['Proses pemilihan supplier masih dilakukan secara manual.', 'Kriteria yang digunakan dalam pemilihan supplier adalah Harga, Kualitas, Pengiriman, Layanan, dan Kapasitas.', 'Harga dan kualitas menjadi kriteria yang paling penting.', 'Belum terdapat sistem yang menghitung dan membandingkan supplier secara otomatis.', 'Sistem pendukung keputusan dibutuhkan untuk membantu menghasilkan rekomendasi supplier.'].forEach((x) => body.push(bullet(x)));

body.push(h(1, '11. BAB III Penutup'));
body.push(p('Letakkan setelah bagian 2.7 Dokumentasi Observasi dan Wawancara.'));
body.push(h(2, 'BAB III PENUTUP'));
body.push(h(3, '3.1 Kesimpulan'));
body.push(p('Berdasarkan hasil pembahasan, perhitungan, dan pengujian yang telah dilakukan, dapat disimpulkan bahwa:'));
['Proses seleksi supplier aksesoris handphone pada CV Anugerah Mega Makmur dapat diselesaikan menggunakan metode Simple Additive Weighting (SAW) dengan lima kriteria penilaian, yaitu Harga, Kualitas, Pengiriman, Layanan, dan Kapasitas.', 'Kriteria Harga termasuk dalam kriteria cost karena semakin rendah harga yang ditawarkan maka semakin baik bagi perusahaan. Sedangkan kriteria Kualitas, Pengiriman, Layanan, dan Kapasitas termasuk dalam kriteria benefit karena semakin tinggi nilainya maka semakin baik.', 'Bobot kriteria yang digunakan dalam proses seleksi supplier adalah Harga sebesar 30%, Kualitas sebesar 30%, Pengiriman sebesar 20%, Layanan sebesar 10%, dan Kapasitas sebesar 10%. Selain itu, terdapat bonus sebesar 0,05 bagi supplier yang menanggung ongkos kirim.', 'Berdasarkan hasil perhitungan manual metode SAW, Khatulistiwa Gadget Supply memperoleh skor tertinggi sebesar 1,0142 dan menempati peringkat pertama sebagai supplier yang paling direkomendasikan.', 'Hasil perhitungan sistem berbasis web menunjukkan nilai yang sama dengan hasil perhitungan manual. Selisih sebesar 0,0000 pada seluruh alternatif menunjukkan bahwa sistem telah mengimplementasikan metode SAW dengan benar.'].forEach((x) => body.push(bullet(x)));
body.push(h(3, '3.2 Future Works'));
body.push(p('Untuk pengembangan selanjutnya, terdapat beberapa hal yang dapat dilakukan, yaitu:'));
['Sistem dapat dikembangkan dengan menambahkan kriteria penilaian lain, seperti garansi produk, reputasi supplier, lama kerja sama, dan kelengkapan dokumen.', 'Data penilaian supplier sebaiknya diperbarui secara berkala agar hasil evaluasi tetap sesuai dengan kondisi terbaru.', 'Sistem dapat dikembangkan agar terintegrasi dengan data pembelian atau data stok barang sehingga proses penilaian supplier dapat dilakukan berdasarkan data transaksi yang lebih lengkap.', 'Penelitian selanjutnya dapat membandingkan metode SAW dengan metode lain, seperti AHP, TOPSIS, atau Weighted Product untuk mengetahui metode yang paling sesuai dalam kasus seleksi supplier.', 'Sistem dapat ditambahkan fitur ekspor laporan ke PDF atau Excel agar hasil evaluasi supplier dapat didokumentasikan dan digunakan sebagai bahan pertimbangan dalam pengambilan keputusan.'].forEach((x) => body.push(bullet(x)));

body.push(h(1, '12. Daftar Pustaka'));
body.push(p('Letakkan setelah BAB III.'));
code('DAFTAR PUSTAKA\n\nAfshari, A., Mojahed, M., & Yusuff, R. M. (2010). Simple Additive Weighting approach to personnel selection problem. International Journal of Innovation, Management and Technology, 1(5), 511-515.\n\nKusumadewi, S., Hartati, S., Harjoko, A., & Wardoyo, R. (2006). Fuzzy Multi-Attribute Decision Making (Fuzzy MADM). Yogyakarta: Graha Ilmu.\n\nSuryadi, K., & Ramdhani, M. A. (2000). Sistem Pendukung Keputusan: Suatu Wacana Struktural Idealisasi dan Implementasi Konsep Pengambilan Keputusan. Bandung: PT Remaja Rosdakarya.\n\nTurban, E., Aronson, J. E., & Liang, T. P. (2005). Decision Support Systems and Intelligent Systems (7th ed.). New Jersey: Pearson Education.');

body.push(h(1, '13. Lampiran Wawancara'));
body.push(p('Letakkan setelah daftar pustaka jika kamu ingin menyertakan bukti wawancara.'));
code('LAMPIRAN\n\nLampiran 1. Ringkasan Wawancara\n\nPertanyaan 1:\nBagaimana proses pemilihan supplier yang selama ini berjalan?\n\nJawaban:\nPemilihan supplier masih dilakukan secara manual berdasarkan pengalaman, harga, kualitas barang, dan rekomendasi dari pihak lain.\n\nPertanyaan 2:\nKriteria apa saja yang dipertimbangkan dalam memilih supplier?\n\nJawaban:\nKriteria yang dipertimbangkan adalah harga, kualitas barang, pengiriman, layanan, dan kapasitas stok.\n\nPertanyaan 3:\nDari kelima kriteria tersebut, mana yang paling penting?\n\nJawaban:\nHarga dan kualitas menjadi kriteria paling penting. Pengiriman juga cukup penting, sedangkan layanan dan kapasitas menjadi faktor pendukung.\n\nPertanyaan 4:\nApakah ada standar nilai minimal untuk menilai supplier?\n\nJawaban:\nBelum ada standar angka yang pasti. Namun supplier yang sering terlambat mengirim barang atau memiliki kualitas barang yang kurang baik biasanya tidak menjadi prioritas.\n\nPertanyaan 5:\nApakah diperlukan sistem untuk membantu proses pemilihan supplier?\n\nJawaban:\nSistem diperlukan agar proses penilaian supplier menjadi lebih rapi, objektif, dan mudah dilihat kembali.');

body.push(h(1, '14. Format Word'));
code('Font: Times New Roman\nUkuran font: 12\nSpasi: 1,5\nAlignment: Justify\nUkuran kertas: A4\nMargin: Kiri 4 cm, Atas 4 cm, Kanan 3 cm, Bawah 3 cm\nIndent paragraf pertama: 1,25 cm');

const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${body.join('')}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/></w:sectPr></w:body></w:document>`;
const stylesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="24"/></w:rPr><w:pPr><w:spacing w:after="160" w:line="360" w:lineRule="auto"/><w:jc w:val="both"/></w:pPr></w:style><w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:basedOn w:val="Normal"/><w:rPr><w:b/><w:sz w:val="28"/></w:rPr><w:pPr><w:jc w:val="center"/><w:spacing w:after="240"/></w:pPr></w:style><w:style w:type="paragraph" w:styleId="Code"><w:name w:val="Code"/><w:basedOn w:val="Normal"/><w:rPr><w:rFonts w:ascii="Consolas" w:hAnsi="Consolas"/><w:sz w:val="20"/></w:rPr><w:pPr><w:spacing w:after="120"/><w:jc w:val="left"/></w:pPr></w:style><w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:rPr><w:b/><w:sz w:val="28"/></w:rPr><w:pPr><w:spacing w:before="360" w:after="200"/><w:outlineLvl w:val="0"/></w:pPr></w:style><w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:basedOn w:val="Normal"/><w:rPr><w:b/><w:sz w:val="26"/></w:rPr><w:pPr><w:spacing w:before="280" w:after="160"/><w:outlineLvl w:val="1"/></w:pPr></w:style><w:style w:type="paragraph" w:styleId="Heading3"><w:name w:val="heading 3"/><w:basedOn w:val="Normal"/><w:rPr><w:b/><w:sz w:val="24"/></w:rPr><w:pPr><w:spacing w:before="220" w:after="120"/><w:outlineLvl w:val="2"/></w:pPr></w:style></w:styles>`;
const numberingXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:numbering xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:abstractNum w:abstractNumId="0"><w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="decimal"/><w:lvlText w:val="%1."/><w:pPr><w:ind w:left="720" w:hanging="360"/></w:pPr></w:lvl></w:abstractNum><w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num></w:numbering>`;

fs.writeFileSync(path.join(work, '[Content_Types].xml'), `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>`);
fs.writeFileSync(path.join(work, '_rels', '.rels'), `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/></Relationships>`);
fs.writeFileSync(path.join(work, 'word', '_rels', 'document.xml.rels'), `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/></Relationships>`);
fs.writeFileSync(path.join(work, 'word', 'document.xml'), documentXml);
fs.writeFileSync(path.join(work, 'word', 'styles.xml'), stylesXml);
fs.writeFileSync(path.join(work, 'word', 'numbering.xml'), numberingXml);
fs.writeFileSync(path.join(work, 'docProps', 'core.xml'), `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>Panduan Copy Paste Draf Laporan</dc:title><dc:creator>OpenCode</dc:creator><cp:lastModifiedBy>OpenCode</cp:lastModifiedBy><dcterms:created xsi:type="dcterms:W3CDTF">2026-06-04T00:00:00Z</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">2026-06-04T00:00:00Z</dcterms:modified></cp:coreProperties>`);
fs.writeFileSync(path.join(work, 'docProps', 'app.xml'), `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"><Application>OpenCode</Application></Properties>`);

fs.rmSync(out, { force: true });
execFileSync('powershell.exe', ['-NoProfile', '-Command', `Compress-Archive -Path "${path.join(work, '*')}" -DestinationPath "${out}.zip" -Force; Move-Item -LiteralPath "${out}.zip" -Destination "${out}" -Force`], { stdio: 'inherit' });
fs.rmSync(work, { recursive: true, force: true });
console.log(out);
