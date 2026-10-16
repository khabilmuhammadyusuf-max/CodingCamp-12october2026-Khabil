# Rencana Implementasi: To-Do Life Dashboard

## Ikhtisar

Dokumen ini mencatat semua tugas implementasi untuk To-Do Life Dashboard — aplikasi web satu halaman (*single-page application*) berbasis HTML, CSS, dan JavaScript vanilla. Seluruh tugas telah diselesaikan. Implementasi mencakup enam komponen utama: jam digital, salam personal, timer fokus, pengelola tugas, pengelola tautan cepat, serta pengaturan tema dan aksesibilitas.

## Tugas

- [x] 1. Penyiapan struktur proyek
  - [x] 1.1 Buat struktur direktori proyek
    - Buat file `index.html` di direktori root
    - Buat direktori `css/` dan file `css/style.css`
    - Buat direktori `js/` dan file `js/script.js`
    - Buat direktori `.kiro/specs/todo-dashboard/` untuk artefak spesifikasi
    - _Persyaratan: 10.1, 10.5_

- [x] 2. Markup HTML dan struktur semantik
  - [x] 2.1 Buat elemen header dengan jam dan tombol tema
    - Tulis elemen `<header>` dengan elemen `#clock`, `#date`, dan `#themeToggle`
    - Terapkan atribut `title` pada tombol tema untuk aksesibilitas
    - _Persyaratan: 1.1, 4.1, 11.3_

  - [x] 2.2 Buat grid utama dan kartu salam
    - Tulis elemen `<main class="main-grid">` sebagai kontainer grid dua kolom
    - Buat `<section class="card greeting-card">` dengan elemen `#greeting` dan `#displayName`
    - Tambahkan tombol `#editNameBtn` dan modal `#nameModal` di dalam kartu salam
    - _Persyaratan: 2.1, 3.1, 3.2, 10.1, 11.2_

  - [x] 2.3 Buat kartu timer fokus
    - Tulis `<section class="card timer-card">` dengan elemen `#timerDisplay`, `#timerDuration`, `#startBtn`, `#stopBtn`, `#resetBtn`, dan `#timerStatus`
    - Atur atribut `min="1"`, `max="99"`, dan `value="25"` pada input durasi
    - _Persyaratan: 5.1, 5.2, 11.2_

  - [x] 2.4 Buat kartu daftar tugas (*to-do list*)
    - Tulis `<section class="card todo-card">` dengan input `#todoInput`, tombol `#addTodoBtn`, elemen `#duplicateMsg`, `#taskCount`, dropdown `#sortSelect`, dan `<ul id="todoList">`
    - Tambahkan modal `#editModal` di luar main grid untuk pengeditan tugas
    - Atur atribut `maxlength="100"` pada input tugas
    - _Persyaratan: 6.1, 6.3, 6.4, 7.2, 8.1, 11.2_

  - [x] 2.5 Buat kartu tautan cepat (*quick links*)
    - Tulis `<section class="card links-card">` dengan input `#linkLabel`, `#linkUrl`, tombol `#addLinkBtn`, dan kontainer `#linksList`
    - Atur atribut `maxlength="30"` pada input label dan `maxlength="200"` pada input URL
    - _Persyaratan: 9.1, 9.12, 11.2_

- [x] 3. Gaya CSS dan sistem tema
  - [x] 3.1 Implementasikan CSS custom properties untuk tema terang dan gelap
    - Definisikan variabel warna, spasi, bayangan, dan transisi di `:root`
    - Tulis blok `[data-theme="dark"]` yang menimpa semua variabel warna
    - Pastikan semua elemen menggunakan variabel CSS agar transisi tema berfungsi otomatis
    - _Persyaratan: 4.4, 4.7, 11.7_

  - [x] 3.2 Implementasikan tata letak grid responsif
    - Tulis `.main-grid` dengan `grid-template-columns: repeat(2, 1fr)` untuk layar lebar
    - Tulis media query `@media (max-width: 768px)` untuk tata letak satu kolom
    - Pastikan header bersifat *sticky* dengan `position: sticky; top: 0`
    - _Persyaratan: 10.1, 10.2, 10.3_

  - [x] 3.3 Implementasikan gaya komponen dan animasi
    - Tulis gaya untuk `.card`, `.todo-item`, `.link-chip`, tombol, input, dan modal
    - Tambahkan animasi `@keyframes slideIn` untuk item baru dan `@keyframes pulse` untuk timer yang berjalan
    - Tambahkan `@keyframes slideUp` dan `@keyframes fadeIn` untuk modal
    - _Persyaratan: 10.4, 5.4_

- [x] 4. Jam digital dan tampilan tanggal
  - [x] 4.1 Implementasikan fungsi `updateClock()` dengan pembaruan otomatis
    - Tulis logika format HH:MM:SS dengan `String.padStart(2, '0')` untuk ketiga komponen
    - Tulis logika format tanggal "Hari, Bulan Tanggal, Tahun" menggunakan array `DAYS` dan `MONTHS`
    - Panggil `updateClock()` sekali saat startup dan jalankan `setInterval(updateClock, 1000)`
    - _Persyaratan: 1.1, 1.2, 1.3, 1.4_

- [x] 5. Salam personal berbasis waktu
  - [x] 5.1 Implementasikan fungsi `getGreeting(hour)` dengan pemetaan rentang jam
    - Tulis kondisi untuk setiap rentang: 0–4 → "Good Night 🌙", 5–11 → "Good Morning ☀️", 12–16 → "Good Afternoon 🌤️", 17–20 → "Good Evening 🌆", 21–23 → "Good Night 🌙"
    - Integrasikan hasil `getGreeting()` ke dalam `updateClock()` sehingga teks salam diperbarui setiap detik
    - _Persyaratan: 2.1, 2.2, 2.3, 2.4, 2.5, 2.8_

  - [x] 5.2 Implementasikan tampilan nama pengguna dalam salam
    - Tulis logika di `updateClock()`: jika `state.name` ada, format salam menjadi `"${text}, ${name}! ${emoji}"`, jika tidak tampilkan `"${text}! ${emoji}"`
    - Tampilkan "Stranger" sebagai *fallback* di elemen `#displayName`
    - _Persyaratan: 2.6, 2.7_

- [x] 6. Editor nama kustom (modal)
  - [x] 6.1 Implementasikan fungsi `saveName()` dan `renderName()`
    - Tulis `saveName()`: trim nilai input, simpan ke `state.name`, panggil `save.name()`, panggil `renderName()`, tutup modal
    - Tulis `renderName()`: set `displayNameEl.textContent = state.name || 'Stranger'`, panggil `updateClock()`
    - _Persyaratan: 3.3, 3.5, 3.6_

  - [x] 6.2 Pasang event listeners untuk modal nama
    - Buka modal saat `#editNameBtn` diklik, isi input dengan nilai `state.name` saat ini
    - Simpan dengan tombol "Save" atau tombol Enter di dalam `#nameInput`
    - Tutup tanpa menyimpan saat tombol "Cancel" diklik atau area luar modal diklik
    - _Persyaratan: 3.1, 3.2, 3.4_

- [x] 7. Toggle tema terang/gelap
  - [x] 7.1 Implementasikan fungsi `applyTheme()` dan event listener toggle
    - Tulis `applyTheme()`: set atribut `data-theme` pada `document.documentElement`, perbarui ikon (`🌙`/`☀️`) dan tooltip tombol
    - Pasang listener pada `#themeToggle` yang membalik `state.theme` antara `'light'` dan `'dark'`, panggil `save.theme()`, lalu `applyTheme()`
    - Panggil `applyTheme()` saat inisialisasi untuk menerapkan tema tersimpan
    - _Persyaratan: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

- [x] 8. Timer fokus (*focus timer*)
  - [x] 8.1 Implementasikan fungsi `formatTime()` dan `renderTimer()`
    - Tulis `formatTime(min, sec)`: kembalikan string `"MM:SS"` dengan zero-padding pada kedua komponen
    - Tulis `renderTimer()`: hitung `remaining = timerMinutes * 60 - timerSeconds`, tampilkan sebagai MM:SS
    - _Persyaratan: 5.1_

  - [x] 8.2 Implementasikan fungsi `startTimer()`
    - Tulis guard: jika `state.timerRunning === true`, langsung return
    - Set `state.timerRunning = true`, nonaktifkan `#startBtn` dan `#timerDuration`, tambahkan kelas `.running` ke `#timerDisplay`
    - Jalankan `setInterval(1000ms)` yang menaikkan `state.timerSeconds` dan memanggil `renderTimer()`
    - Ketika `timerSeconds >= timerMinutes * 60`, hentikan interval, perbarui UI, tampilkan pesan selesai
    - _Persyaratan: 5.3, 5.4, 5.7, 5.11_

  - [x] 8.3 Implementasikan fungsi `stopTimer()` dan `resetTimer()`
    - Tulis `stopTimer()`: `clearInterval`, set `state.timerRunning = false`, aktifkan kembali `#startBtn`, hapus kelas `.running`, tampilkan status "Paused"
    - Tulis `resetTimer()`: `clearInterval`, set `state.timerSeconds = 0`, perbarui `state.timerMinutes` dari nilai input, aktifkan input durasi, panggil `renderTimer()`
    - _Persyaratan: 5.5, 5.6, 5.10_

  - [x] 8.4 Implementasikan notifikasi browser dan persistensi durasi
    - Minta izin notifikasi browser via `Notification.requestPermission()` saat tombol Start pertama kali diklik
    - Kirim `new Notification(...)` saat timer selesai jika `Notification.permission === 'granted'`
    - Simpan nilai `timerMinutes` ke LocalStorage via `save.timer()` saat nilai berubah
    - _Persyaratan: 5.8, 5.9, 5.10_

- [x] 9. Daftar tugas — operasi CRUD
  - [x] 9.1 Implementasikan fungsi `addTodo()`
    - Trim nilai input, return jika kosong
    - Panggil `isDuplicate(text)`: jika duplikat, tampilkan `#duplicateMsg` selama 3 detik dan return
    - Push `{ id: uid(), text, done: false }` ke `state.todos`, panggil `save.todos()` dan `renderTodos()`, bersihkan input
    - _Persyaratan: 6.1, 6.2, 6.13_

  - [x] 9.2 Implementasikan fungsi `renderTodos()`
    - Ambil `getSortedTodos()`, perbarui `#taskCount` dengan format "N task" / "N tasks"
    - Jika array kosong, render elemen `<li class="empty-state">` dengan pesan informatif
    - Render setiap tugas sebagai `<li>` dengan checkbox, teks ter-*escape*, tombol edit, dan tombol hapus
    - Pasang event listeners pada setiap checkbox, tombol edit, dan tombol hapus yang dirender
    - _Persyaratan: 6.3, 6.4, 6.5, 11.1_

  - [x] 9.3 Implementasikan fungsi `toggleTodo()`, `deleteTodo()`, dan modal edit
    - Tulis `toggleTodo(id)`: temukan tugas by id, balik nilai `done`, simpan, render ulang
    - Tulis `deleteTodo(id)`: filter `state.todos` untuk menghapus id yang sesuai, simpan, render ulang
    - Tulis `openEditModal(id)`: set `state.editingId`, isi `#editInput` dengan teks tugas, tampilkan `#editModal`
    - Tulis `saveEdit()`: validasi teks tidak kosong dan tidak duplikat (kecuali diri sendiri), perbarui `todo.text`, simpan, render ulang, tutup modal
    - _Persyaratan: 6.5, 6.6, 6.7, 6.8, 6.9, 6.10, 6.11, 6.12_

- [x] 10. Pencegahan duplikasi tugas
  - [x] 10.1 Implementasikan fungsi `isDuplicate(text, excludeId?)`
    - Bandingkan `text.trim().toLowerCase()` dengan setiap `todo.text.trim().toLowerCase()` dalam `state.todos`
    - Sertakan parameter opsional `excludeId` yang mengecualikan tugas dengan id tersebut dari pemeriksaan (untuk kasus edit)
    - _Persyaratan: 7.1, 7.3, 7.4_

  - [x] 10.2 Integrasikan umpan balik visual untuk duplikat
    - Pada `addTodo()`: tampilkan `#duplicateMsg` dengan kelas `.hidden` dihapus, set timeout 3 detik untuk menyembunyikannya kembali
    - Pada `saveEdit()`: ubah `borderColor` `#editInput` menjadi `var(--danger)` dan reset setelah 2500ms
    - _Persyaratan: 7.2, 7.3_

- [x] 11. Pengurutan daftar tugas
  - [x] 11.1 Implementasikan fungsi `getSortedTodos()` dengan empat mode pengurutan
    - Tulis `switch (state.sortMode)` dengan kasus: `'default'` (urutan asli), `'asc'` (`localeCompare` naik), `'desc'` (`localeCompare` turun), `'done'` (`Number(a.done) - Number(b.done)`)
    - Kembalikan salinan array (bukan mutasi `state.todos` secara langsung) menggunakan spread operator
    - Pasang event listener pada `#sortSelect` yang memperbarui `state.sortMode` dan memanggil `renderTodos()`
    - _Persyaratan: 8.1, 8.2, 8.3, 8.4_

- [x] 12. Pengelola tautan cepat (*quick links*)
  - [x] 12.1 Implementasikan fungsi `addLink()` dengan normalisasi dan validasi URL
    - Trim label dan url, return jika salah satunya kosong
    - Tambahkan awalan `'https://'` jika url tidak dimulai dengan `http://` atau `https://` menggunakan regex `/^https?:\/\//i`
    - Validasi url hasil normalisasi via `new URL(url)` di blok `try/catch`; jika gagal, ubah `borderColor` input menjadi `var(--danger)` dan return
    - Push `{ id: uid(), label, url }` ke `state.links`, simpan, render ulang
    - _Persyaratan: 9.1, 9.2, 9.3, 9.4, 9.12_

  - [x] 12.2 Implementasikan fungsi `renderLinks()` dan `getFavicon()`
    - Tulis `getFavicon(url)`: ekstrak `origin` via `new URL(url).origin`, kembalikan URL Google Favicon `https://www.google.com/s2/favicons?sz=16&domain_url=<origin>`
    - Tulis `renderLinks()`: render setiap tautan sebagai `.link-chip` dengan elemen `<img>` favicon (atribut `onerror="this.style.display='none'"`), elemen `<a>` dengan `target="_blank" rel="noopener noreferrer"`, dan tombol hapus
    - Tulis `deleteLink(id)`: filter `state.links`, simpan, render ulang
    - _Persyaratan: 9.5, 9.6, 9.7, 9.8, 9.9, 9.10, 9.11_

- [x] 13. Persistensi LocalStorage untuk semua data
  - [x] 13.1 Implementasikan konstanta kunci dan helper penyimpanan terpusat
    - Definisikan objek `KEYS` dengan lima kunci: `ld_theme`, `ld_name`, `ld_todos`, `ld_links`, `ld_timer_minutes`
    - Tulis objek `save` dengan metode `theme()`, `name()`, `todos()`, `links()`, dan `timer()` yang masing-masing memanggil `localStorage.setItem()`
    - _Persyaratan: 3.6, 4.5, 4.6, 5.10, 6.11, 6.12, 9.10, 9.11_

  - [x] 13.2 Implementasikan inisialisasi state dari LocalStorage saat halaman dimuat
    - Baca semua nilai dari LocalStorage saat deklarasi objek `state` menggunakan `localStorage.getItem()` dengan nilai *fallback* yang sesuai
    - Parse nilai JSON untuk `todos` dan `links` menggunakan `JSON.parse(...  || '[]')`
    - Parse nilai integer untuk `timerMinutes` menggunakan `parseInt(... || '25', 10)`
    - _Persyaratan: 3.6, 4.6, 5.10, 6.12, 9.11_

- [x] 14. Sanitasi XSS dengan `escapeHtml()`
  - [x] 14.1 Implementasikan fungsi `escapeHtml(str)` dan terapkan ke semua konten pengguna
    - Tulis fungsi yang mengonversi karakter `&`, `<`, `>`, `"`, `'` ke entitas HTML yang sesuai
    - Terapkan `escapeHtml()` pada semua lokasi di `renderTodos()` dan `renderLinks()` di mana konten pengguna disisipkan ke `innerHTML`
    - _Persyaratan: 9.6 (keamanan tautan), 6.2 (rendering tugas)_

- [x] 15. Tata letak responsif (mobile)
  - [x] 15.1 Implementasikan media query dan penyesuaian mobile
    - Tulis `@media (max-width: 768px)` yang mengubah `.main-grid` menjadi `grid-template-columns: 1fr`
    - Sesuaikan padding header dan ukuran font jam untuk layar kecil
    - Pastikan semua kartu merentang penuh lebar pada tampilan satu kolom
    - _Persyaratan: 10.2_

- [x] 16. Aksesibilitas dan navigasi keyboard
  - [x] 16.1 Implementasikan atribut aksesibilitas dan navigasi keyboard
    - Tambahkan atribut `aria-label="Mark task done"` pada setiap checkbox tugas yang dirender di `renderTodos()`
    - Gunakan elemen semantik `<header>`, `<main>`, `<section>`, `<h1>`, `<h2>`, `<ul>`, `<li>` di seluruh markup HTML
    - Tambahkan atribut `title` yang deskriptif pada semua tombol ikon
    - _Persyaratan: 11.1, 11.2, 11.3_

  - [x] 16.2 Implementasikan penanganan tombol Enter pada semua input
    - Pasang listener `keydown` pada `#todoInput`: tekan Enter → panggil `addTodo()`
    - Pasang listener `keydown` pada `#linkLabel`: tekan Enter → pindahkan fokus ke `#linkUrl`
    - Pasang listener `keydown` pada `#linkUrl`: tekan Enter → panggil `addLink()`
    - Pasang listener `keydown` pada `#nameInput` dan `#editInput`: tekan Enter → panggil fungsi simpan yang sesuai
    - _Persyaratan: 11.4, 11.5, 11.6_

- [x] 17. Checkpoint akhir — Pastikan semua fungsi berjalan dengan benar
  - Verifikasi semua fitur berfungsi sesuai persyaratan, tanyakan kepada pengguna jika ada pertanyaan.

## Catatan

- Semua tugas telah diselesaikan. Ini adalah dokumen retrospektif yang mencatat apa yang telah diimplementasikan.
- Implementasi menggunakan JavaScript vanilla murni tanpa framework atau build tool.
- Seluruh data pengguna disimpan lokal di LocalStorage browser; tidak ada backend atau koneksi jaringan yang diperlukan.
- Fungsi-fungsi murni (*pure functions*) seperti `getGreeting()`, `formatTime()`, `isDuplicate()`, `getSortedTodos()`, dan `escapeHtml()` cocok untuk property-based testing menggunakan library **fast-check** bersama **vitest**.
- Properti kebenaran didokumentasikan dalam `design.md` (Properti 1–16) sebagai referensi untuk pengujian otomatis di masa mendatang.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["2.1", "2.2", "2.3", "2.4", "2.5"] },
    { "id": 2, "tasks": ["3.1", "3.2", "3.3"] },
    { "id": 3, "tasks": ["4.1", "5.1", "7.1", "8.1", "13.1"] },
    { "id": 4, "tasks": ["5.2", "6.1", "8.2", "8.3", "9.1", "9.2", "11.1", "12.1", "13.2", "14.1"] },
    { "id": 5, "tasks": ["6.2", "8.4", "9.3", "10.1", "12.2"] },
    { "id": 6, "tasks": ["10.2", "15.1", "16.1", "16.2"] }
  ]
}
```
