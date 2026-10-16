# Dokumen Persyaratan: To-Do Life Dashboard

## Pendahuluan

To-Do Life Dashboard adalah aplikasi web satu halaman (*single-page application*) yang dibangun menggunakan HTML, CSS, dan JavaScript murni (vanilla) tanpa framework apapun. Aplikasi ini berfungsi sebagai dasbor produktivitas pribadi yang menyatukan empat fitur utama: salam personal berbasis waktu, timer fokus gaya Pomodoro, daftar tugas (*to-do list*) lengkap, dan penyimpan tautan cepat. Seluruh data pengguna disimpan secara lokal menggunakan API LocalStorage browser, sehingga tidak memerlukan backend atau koneksi internet untuk berfungsi (kecuali untuk memuat favicon tautan).

---

## Glosarium

- **Dashboard**: Antarmuka utama aplikasi yang menampilkan semua widget dalam satu halaman.
- **LocalStorage**: API penyimpanan bawaan browser yang menyimpan data secara persisten di perangkat pengguna.
- **Clock**: Widget jam digital yang menampilkan waktu saat ini dan diperbarui setiap detik.
- **Greeter**: Komponen yang menampilkan salam, nama pengguna, dan tanggal.
- **Timer**: Komponen hitung mundur yang dapat dikonfigurasi oleh pengguna.
- **Todo_Manager**: Komponen pengelola daftar tugas termasuk operasi tambah, edit, hapus, dan tandai selesai.
- **Link_Manager**: Komponen pengelola tautan cepat termasuk operasi tambah dan hapus.
- **Theme_Controller**: Komponen yang mengatur tampilan terang (*light*) dan gelap (*dark*).
- **Name_Editor**: Komponen modal untuk mengatur nama tampilan pengguna.
- **Task**: Satu entri tugas dalam Todo_Manager, terdiri dari teks dan status selesai.
- **Link**: Satu entri tautan dalam Link_Manager, terdiri dari label dan URL.
- **Favicon**: Ikon kecil yang mewakili sebuah situs web, dimuat dari layanan Google Favicon.
- **Duplicate**: Tugas dengan teks yang sama secara *case-insensitive* dengan tugas yang sudah ada.

---

## Persyaratan

### Persyaratan 1: Jam Digital dan Tanggal

**User Story:** Sebagai pengguna, saya ingin melihat jam dan tanggal yang selalu diperbarui, sehingga saya dapat mengetahui waktu saat ini tanpa meninggalkan dasbor.

#### Kriteria Penerimaan

1. THE Clock SHALL menampilkan waktu saat ini dalam format HH:MM:SS dengan padding angka nol di depan.
2. THE Clock SHALL memperbarui tampilan waktu setiap satu detik secara otomatis.
3. THE Clock SHALL menampilkan nama hari, nama bulan, tanggal, dan tahun dalam format "Hari, Bulan Tanggal, Tahun" (contoh: "Monday, October 12, 2026").
4. WHEN halaman pertama kali dimuat, THE Clock SHALL langsung menampilkan waktu dan tanggal yang benar tanpa jeda.

---

### Persyaratan 2: Salam Personal Berbasis Waktu

**User Story:** Sebagai pengguna, saya ingin mendapatkan salam yang sesuai dengan waktu hari ini dan nama saya, sehingga dasbor terasa lebih personal.

#### Kriteria Penerimaan

1. WHEN jam berada di antara 00:00 dan 04:59, THE Greeter SHALL menampilkan salam "Good Night 🌙".
2. WHEN jam berada di antara 05:00 dan 11:59, THE Greeter SHALL menampilkan salam "Good Morning ☀️".
3. WHEN jam berada di antara 12:00 dan 16:59, THE Greeter SHALL menampilkan salam "Good Afternoon 🌤️".
4. WHEN jam berada di antara 17:00 dan 20:59, THE Greeter SHALL menampilkan salam "Good Evening 🌆".
5. WHEN jam berada di antara 21:00 dan 23:59, THE Greeter SHALL menampilkan salam "Good Night 🌙".
6. WHILE nama pengguna telah disimpan, THE Greeter SHALL menyertakan nama tersebut dalam salam (contoh: "Good Morning, Budi!").
7. WHILE nama pengguna belum disimpan, THE Greeter SHALL menampilkan teks "Stranger" sebagai nama default.
8. WHEN waktu berganti ke rentang waktu yang berbeda, THE Greeter SHALL memperbarui teks salam secara otomatis.

---

### Persyaratan 3: Nama Kustom Pengguna

**User Story:** Sebagai pengguna, saya ingin mengatur nama saya sendiri, sehingga salam pada dasbor terasa lebih personal.

#### Kriteria Penerimaan

1. THE Dashboard SHALL menyediakan tombol "✏️ Edit Name" yang dapat diklik untuk membuka modal pengaturan nama.
2. WHEN tombol "Edit Name" diklik, THE Name_Editor SHALL menampilkan modal dengan input teks yang sudah terisi nama saat ini (jika ada).
3. WHEN pengguna menekan tombol "Save" atau tombol Enter di dalam modal, THE Name_Editor SHALL menyimpan nama baru ke LocalStorage dan memperbarui tampilan salam.
4. WHEN pengguna menekan tombol "Cancel" atau mengklik area di luar modal, THE Name_Editor SHALL menutup modal tanpa menyimpan perubahan.
5. THE Name_Editor SHALL membatasi panjang nama maksimum 30 karakter.
6. WHEN halaman dimuat ulang, THE Name_Editor SHALL memuat nama yang tersimpan dari LocalStorage dan menampilkannya.

---

### Persyaratan 4: Tema Terang dan Gelap

**User Story:** Sebagai pengguna, saya ingin beralih antara tema terang dan gelap, sehingga saya dapat menggunakan dasbor dengan nyaman di berbagai kondisi pencahayaan.

#### Kriteria Penerimaan

1. THE Dashboard SHALL menyediakan tombol ikon di header untuk beralih tema.
2. WHEN tema aktif adalah terang (*light*), THE Theme_Controller SHALL menampilkan ikon 🌙 pada tombol.
3. WHEN tema aktif adalah gelap (*dark*), THE Theme_Controller SHALL menampilkan ikon ☀️ pada tombol.
4. WHEN tombol tema diklik, THE Theme_Controller SHALL beralih antara tema terang dan gelap dengan mengubah atribut `data-theme` pada elemen `<html>`.
5. WHEN tema berubah, THE Theme_Controller SHALL menyimpan preferensi tema ke LocalStorage.
6. WHEN halaman dimuat ulang, THE Theme_Controller SHALL memuat preferensi tema dari LocalStorage dan menerapkannya sebelum konten tampil.
7. THE Theme_Controller SHALL menerapkan perubahan warna secara halus menggunakan transisi CSS pada semua elemen antarmuka.

---

### Persyaratan 5: Timer Fokus

**User Story:** Sebagai pengguna, saya ingin menggunakan timer hitung mundur yang dapat dikonfigurasi, sehingga saya dapat mengelola sesi kerja dengan teknik Pomodoro.

#### Kriteria Penerimaan

1. THE Timer SHALL menampilkan sisa waktu dalam format MM:SS.
2. THE Dashboard SHALL menyediakan input angka untuk mengatur durasi timer dengan nilai default 25 menit dan rentang 1–99 menit.
3. WHEN tombol "▶ Start" diklik dan timer tidak sedang berjalan, THE Timer SHALL memulai hitung mundur satu detik per detik.
4. WHEN timer sedang berjalan, THE Timer SHALL memperlihatkan animasi *pulsing* pada tampilan waktu dan menonaktifkan tombol "▶ Start".
5. WHEN tombol "⏸ Pause" diklik dan timer sedang berjalan, THE Timer SHALL menghentikan hitung mundur sementara sambil mempertahankan sisa waktu yang sudah dihitung.
6. WHEN tombol "↺ Reset" diklik, THE Timer SHALL menghentikan hitung mundur, mengatur ulang sisa waktu ke durasi yang disetel, dan mengaktifkan kembali input durasi.
7. WHEN sisa waktu mencapai nol, THE Timer SHALL menghentikan hitung mundur dan menampilkan pesan "⏰ Time is up! Great job!".
8. WHEN sisa waktu mencapai nol dan izin notifikasi browser telah diberikan, THE Timer SHALL mengirimkan notifikasi browser dengan pesan penyelesaian.
9. WHEN tombol "▶ Start" diklik untuk pertama kalinya, THE Timer SHALL meminta izin notifikasi browser kepada pengguna.
10. THE Timer SHALL menyimpan durasi yang disetel ke LocalStorage sehingga tetap ada saat halaman dimuat ulang.
11. WHILE timer sedang berjalan, THE Timer SHALL menonaktifkan input durasi untuk mencegah perubahan tidak terduga.

---

### Persyaratan 6: Pengelolaan Daftar Tugas (To-Do List)

**User Story:** Sebagai pengguna, saya ingin menambah, mengedit, menyelesaikan, dan menghapus tugas, sehingga saya dapat mengelola pekerjaan harian saya dari satu tempat.

#### Kriteria Penerimaan

1. THE Dashboard SHALL menyediakan input teks dan tombol "Add" untuk menambahkan tugas baru.
2. WHEN tombol "Add" diklik atau tombol Enter ditekan di input tugas, THE Todo_Manager SHALL menambahkan tugas baru ke daftar jika input tidak kosong.
3. THE Todo_Manager SHALL menampilkan jumlah tugas saat ini (contoh: "3 tasks" atau "1 task").
4. WHEN daftar tugas kosong, THE Todo_Manager SHALL menampilkan pesan kosong (*empty state*) yang informatif.
5. WHEN pengguna mencentang kotak pada sebuah tugas, THE Todo_Manager SHALL menandai tugas tersebut sebagai selesai dengan menerapkan efek *strikethrough* dan memudarkan tampilannya.
6. WHEN pengguna menghilangkan centang pada tugas yang selesai, THE Todo_Manager SHALL mengembalikan tugas ke status belum selesai.
7. WHEN tombol edit (✏️) pada sebuah tugas diklik, THE Todo_Manager SHALL membuka modal edit dengan teks tugas yang sudah terisi di input.
8. WHEN pengguna menyimpan hasil edit di modal, THE Todo_Manager SHALL memperbarui teks tugas dan menutup modal.
9. WHEN pengguna membatalkan edit atau mengklik area di luar modal edit, THE Todo_Manager SHALL menutup modal tanpa menyimpan perubahan.
10. WHEN tombol hapus (🗑️) pada sebuah tugas diklik, THE Todo_Manager SHALL menghapus tugas tersebut dari daftar secara permanen.
11. THE Todo_Manager SHALL menyimpan seluruh daftar tugas ke LocalStorage setiap kali terjadi perubahan (tambah, edit, hapus, ubah status).
12. WHEN halaman dimuat ulang, THE Todo_Manager SHALL memuat daftar tugas dari LocalStorage dan menampilkannya kembali.
13. THE Todo_Manager SHALL membatasi panjang teks tugas maksimum 100 karakter.

---

### Persyaratan 7: Pencegahan Duplikasi Tugas

**User Story:** Sebagai pengguna, saya ingin dicegah menambahkan tugas yang identik, sehingga daftar tugas saya tetap bersih dan tidak memiliki entri ganda.

#### Kriteria Penerimaan

1. WHEN pengguna mencoba menambahkan tugas dengan teks yang sama (perbandingan *case-insensitive*) dengan tugas yang sudah ada, THE Todo_Manager SHALL memblokir penambahan tersebut.
2. WHEN penambahan tugas duplikat diblokir, THE Todo_Manager SHALL menampilkan pesan peringatan "⚠️ Task already exists!" selama 3 detik lalu menyembunyikannya secara otomatis.
3. WHEN pengguna mencoba menyimpan hasil edit dengan teks yang sama (perbandingan *case-insensitive*) dengan tugas lain yang sudah ada, THE Todo_Manager SHALL memblokir penyimpanan tersebut dan memberikan umpan balik visual pada input edit.
4. WHEN perbandingan duplikat dilakukan saat pengeditan, THE Todo_Manager SHALL mengecualikan tugas yang sedang diedit dari pemeriksaan sehingga menyimpan teks yang sama dengan teks aslinya tetap diizinkan.

---

### Persyaratan 8: Pengurutan Daftar Tugas

**User Story:** Sebagai pengguna, saya ingin mengurutkan daftar tugas sesuai kebutuhan, sehingga saya dapat memprioritaskan atau mengelompokkan tugas dengan lebih mudah.

#### Kriteria Penerimaan

1. THE Dashboard SHALL menyediakan menu pilihan (*dropdown*) untuk mengatur mode pengurutan tugas.
2. THE Todo_Manager SHALL mendukung empat mode pengurutan: "Default" (urutan penambahan), "A → Z" (alfabetik naik), "Z → A" (alfabetik turun), dan "Done Last" (tugas selesai di bagian bawah).
3. WHEN mode pengurutan diubah, THE Todo_Manager SHALL langsung mengurutkan ulang dan merender ulang daftar tugas.
4. WHEN mode "Done Last" dipilih, THE Todo_Manager SHALL menampilkan semua tugas yang belum selesai di atas tugas yang sudah selesai.

---

### Persyaratan 9: Pengelolaan Tautan Cepat (Quick Links)

**User Story:** Sebagai pengguna, saya ingin menyimpan dan mengakses tautan-tautan penting dengan cepat, sehingga saya tidak perlu mengingat URL atau membuka bookmark browser secara terpisah.

#### Kriteria Penerimaan

1. THE Dashboard SHALL menyediakan input label, input URL, dan tombol "Add" untuk menambahkan tautan baru.
2. WHEN tombol "Add" diklik atau tombol Enter ditekan di input URL, THE Link_Manager SHALL menambahkan tautan baru jika label dan URL tidak kosong.
3. IF URL yang dimasukkan tidak dimulai dengan `http://` atau `https://`, THEN THE Link_Manager SHALL secara otomatis menambahkan awalan `https://` di depan URL tersebut.
4. IF URL yang dimasukkan tidak valid setelah normalisasi, THEN THE Link_Manager SHALL memberikan umpan balik visual pada input URL dan tidak menyimpan tautan.
5. THE Link_Manager SHALL menampilkan setiap tautan sebagai *chip* dengan favicon, label, dan tombol hapus.
6. WHEN sebuah tautan di klik, THE Link_Manager SHALL membuka URL tautan tersebut di tab baru dengan atribut `rel="noopener noreferrer"`.
7. THE Link_Manager SHALL memuat favicon dari layanan Google Favicon menggunakan URL asal (*origin*) dari tautan.
8. IF favicon gagal dimuat, THEN THE Link_Manager SHALL menyembunyikan elemen gambar favicon tanpa memunculkan error tampilan.
9. WHEN tombol hapus (✕) pada sebuah tautan diklik, THE Link_Manager SHALL menghapus tautan tersebut secara permanen.
10. THE Link_Manager SHALL menyimpan seluruh daftar tautan ke LocalStorage setiap kali terjadi perubahan.
11. WHEN halaman dimuat ulang, THE Link_Manager SHALL memuat daftar tautan dari LocalStorage dan menampilkannya kembali.
12. THE Link_Manager SHALL membatasi panjang label maksimum 30 karakter dan panjang URL maksimum 200 karakter.

---

### Persyaratan 10: Tata Letak dan Desain Responsif

**User Story:** Sebagai pengguna, saya ingin antarmuka dasbor yang bersih, tertata, dan dapat digunakan dengan nyaman di berbagai ukuran layar, sehingga dasbor dapat saya akses dari desktop maupun perangkat mobile.

#### Kriteria Penerimaan

1. THE Dashboard SHALL menampilkan semua widget dalam tata letak grid dua kolom pada layar dengan lebar lebih dari 768px.
2. WHEN lebar layar 768px atau lebih kecil, THE Dashboard SHALL beralih ke tata letak satu kolom secara otomatis.
3. THE Dashboard SHALL menampilkan header yang selalu terlihat (*sticky*) di bagian atas halaman saat pengguna menggulir konten.
4. THE Dashboard SHALL menerapkan animasi transisi yang halus saat elemen ditambahkan ke daftar tugas atau tautan.
5. THE Dashboard SHALL mendukung tampilan yang benar dan dapat digunakan pada browser Chrome, Firefox, Edge, dan Safari.

---

### Persyaratan 11: Aksesibilitas dan Kegunaan

**User Story:** Sebagai pengguna, saya ingin antarmuka yang mudah digunakan dan dapat diakses, sehingga interaksi terasa intuitif dan efisien.

#### Kriteria Penerimaan

1. THE Dashboard SHALL menyediakan atribut `aria-label` pada elemen interaktif yang tidak memiliki teks label yang terlihat (seperti kotak centang tugas).
2. THE Dashboard SHALL menggunakan elemen HTML semantik yang sesuai (`<header>`, `<main>`, `<section>`, `<h1>`, `<h2>`, `<ul>`, `<li>`) untuk membangun struktur dokumen yang dapat dibaca oleh teknologi bantuan.
3. THE Dashboard SHALL menampilkan *tooltip* (`title` attribute) pada tombol ikon untuk menjelaskan fungsinya.
4. WHEN pengguna menekan tombol Enter di input tugas, THE Todo_Manager SHALL memperlakukan aksi tersebut sama dengan mengklik tombol "Add".
5. WHEN pengguna menekan tombol Enter di input label tautan, THE Link_Manager SHALL memindahkan fokus ke input URL.
6. WHEN pengguna menekan tombol Enter di input URL, THE Link_Manager SHALL memperlakukan aksi tersebut sama dengan mengklik tombol "Add".
7. THE Dashboard SHALL memastikan kontras warna antara teks dan latar belakang memenuhi keterbacaan yang memadai pada kedua tema (terang dan gelap).
