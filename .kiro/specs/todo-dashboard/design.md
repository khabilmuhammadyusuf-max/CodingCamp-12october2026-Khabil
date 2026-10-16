# Dokumen Desain: To-Do Life Dashboard

## Overview

To-Do Life Dashboard adalah aplikasi web satu halaman (*single-page application / SPA*) yang dibangun menggunakan HTML, CSS, dan JavaScript vanilla murni — tanpa framework, tanpa build tool, tanpa dependensi eksternal. Aplikasi ini berfungsi sebagai dasbor produktivitas pribadi yang menyatukan empat widget utama dalam satu tampilan: jam digital + salam personal, timer fokus gaya Pomodoro, pengelola daftar tugas (*to-do list*), dan penyimpan tautan cepat (*quick links*).

Seluruh data pengguna dipertahankan secara lokal menggunakan Web Storage API (`localStorage`) sehingga tidak ada backend, tidak ada koneksi jaringan yang diperlukan, dan tidak ada data pengguna yang dikirim ke server mana pun.

---

## Architecture

### Struktur Berkas

```
project-root/
├── index.html        # Markup HTML lengkap: semua elemen, modal, struktur semantik
├── css/
│   └── style.css     # Semua gaya: CSS custom properties, tata letak, tema, animasi
├── js/
│   └── script.js     # Semua logika aplikasi: state, rendering, event handlers
└── .kiro/            # Konfigurasi Kiro IDE
    └── steering/
        └── project.md
```

### Pola Arsitektur

Aplikasi ini menggunakan **pola modul vanilla** (*vanilla module pattern*) tanpa framework:

```
┌─────────────────────────────────────────────────────────────────┐
│                        index.html (View)                        │
│  header │ greeting-card │ timer-card │ todo-card │ links-card   │
└─────────────────────────────────────────────────────────────────┘
                              ↑ DOM manipulation
┌─────────────────────────────────────────────────────────────────┐
│                     script.js (Controller)                      │
│                                                                 │
│  state {} ──→ save.*() ──→ localStorage                        │
│      ↑                                                          │
│  event handlers ──→ update state ──→ render*()                 │
└─────────────────────────────────────────────────────────────────┘
                              ↑ CSS custom properties
┌─────────────────────────────────────────────────────────────────┐
│                     style.css (Style)                           │
│   :root {} │ [data-theme="dark"] {} │ components │ animations  │
└─────────────────────────────────────────────────────────────────┘
```

### Alur Data

```
Muat Halaman
     │
     ▼
localStorage.getItem() untuk setiap kunci
     │
     ▼
Populasi objek state {}
     │
     ▼
render*() semua komponen ke DOM
     │
     ▼
setInterval(updateClock, 1000) berjalan setiap detik

Interaksi Pengguna
     │
     ▼
Event handler menangkap aksi
     │
     ▼
Validasi input (isDuplicate, URL check, dll.)
     │
     ▼
Mutasi state (state.todos.push(), dll.)
     │
     ▼
save.*() → localStorage.setItem()
     │
     ▼
render*() → pembaruan DOM
```

---

## Visual Layout

Wireframe tata letak antarmuka pada berbagai ukuran layar.

### Desktop (> 768px) — Grid 2 Kolom

```
┌──────────────────────────────────────────────────────────────────────┐
│  HEADER (sticky)                                                     │
│  ┌──────────────────────────┐              ┌────────────────────┐   │
│  │  🕐 HH:MM:SS             │              │  [🌙 Theme Toggle] │   │
│  │  Day, Month Date, Year   │              └────────────────────┘   │
│  └──────────────────────────┘                                        │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│  GREETING CARD  (full width — spans 2 columns)                       │
│                                                                      │
│  Good Morning, Budi! ☀️                                              │
│  [Stranger]  [✏️ Edit Name]                                          │
└──────────────────────────────────────────────────────────────────────┘

┌───────────────────────────────┐  ┌───────────────────────────────────┐
│  FOCUS TIMER CARD             │  │  (part of 2-col row — reserved    │
│                               │  │   for future widget or empty)     │
│       25:00                   │  │                                   │
│  [Set Minutes: 25 ▲▼]        │  │                                   │
│  [▶ Start] [⏸ Pause] [↺ Reset]│  │                                   │
│  Ready to focus?              │  │                                   │
└───────────────────────────────┘  └───────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│  TO-DO LIST CARD  (full width — spans 2 columns)                     │
│                                                                      │
│  [Add a new task...                          ] [Add]                 │
│  ⚠️ Task already exists!  (hidden by default)                        │
│  3 tasks                                   Sort: [Default ▼]        │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │ ☐  Task one                                       [✏️]  [🗑️] │ │
│  │ ☐  Task two                                       [✏️]  [🗑️] │ │
│  │ ☑  Task three (strikethrough, faded)               [✏️]  [🗑️] │ │
│  └────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│  QUICK LINKS CARD  (full width — spans 2 columns)                    │
│                                                                      │
│  [Label...        ] [https://...               ] [Add]              │
│                                                                      │
│  ( 🌐 Google )  ( 🌐 GitHub )  ( 🌐 YouTube )                       │
└──────────────────────────────────────────────────────────────────────┘
```

### Mobile (≤ 768px) — Grid 1 Kolom

Semua kartu ditumpuk secara vertikal dalam satu kolom. Urutan tampilan tetap sama: Header → Greeting → Timer → To-Do → Quick Links.

### Modal (Tersembunyi secara Default)

```
Modal tersembunyi — ditampilkan sebagai overlay saat dipicu

┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
  ╔═══════════════════════════════╗
│ ║  What's your name?           ║ │    ← Name Editor Modal
  ║  [Enter your name...       ] ║        (dipicu oleh tombol ✏️ Edit Name)
│ ║  [Save]  [Cancel]            ║ │
  ╚═══════════════════════════════╝
└ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘

┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
  ╔═══════════════════════════════╗
│ ║  Edit Task                   ║ │    ← Edit Task Modal
  ║  [Task text...             ] ║        (dipicu oleh tombol ✏️ pada item tugas)
│ ║  [Save]  [Cancel]            ║ │
  ╚═══════════════════════════════╝
└ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
```

---

## CSS Custom Properties

Sistem *design token* berbasis CSS custom properties yang memungkinkan pergantian tema terang/gelap tanpa JavaScript. Semua nilai didefinisikan di `:root` (tema terang) dan di-*override* oleh `[data-theme="dark"]`.

| Variabel          | Nilai Light              | Nilai Dark               | Tujuan                                         |
|-------------------|--------------------------|--------------------------|------------------------------------------------|
| `--bg`            | `#f0f4f8`                | `#0f172a`                | Warna latar belakang halaman                   |
| `--surface`       | `#ffffff`                | `#1e293b`                | Warna latar kartu dan komponen utama           |
| `--surface-alt`   | `#f7f9fc`                | `#162032`                | Warna latar input dan item daftar              |
| `--border`        | `#e2e8f0`                | `#2d3f55`                | Warna garis tepi elemen                        |
| `--text`          | `#1a202c`                | `#f1f5f9`                | Warna teks utama                               |
| `--text-muted`    | `#718096`                | `#94a3b8`                | Warna teks sekunder / placeholder              |
| `--primary`       | `#4f46e5`                | `#818cf8`                | Warna aksen utama (tombol, jam, judul salam)   |
| `--secondary`     | `#64748b`                | `#94a3b8`                | Warna tombol sekunder (Pause)                  |
| `--danger`        | `#ef4444`                | `#f87171`                | Warna error, tombol hapus, pesan duplikat      |
| `--done-text`     | `#a0aec0`                | `#475569`                | Warna teks tugas yang sudah selesai            |
| `--shadow`        | `0 2px 12px rgba(0,0,0,0.07)` | `0 2px 12px rgba(0,0,0,0.3)` | Bayangan kartu standar                  |
| `--shadow-lg`     | `0 8px 30px rgba(0,0,0,0.12)` | `0 8px 30px rgba(0,0,0,0.45)` | Bayangan kartu saat hover / modal       |
| `--radius`        | `14px`                   | `14px`                   | Radius sudut kartu dan modal                   |
| `--radius-sm`     | `8px`                    | `8px`                    | Radius sudut input, tombol, dan item daftar    |
| `--transition`    | `0.2s ease`              | `0.2s ease`              | Durasi transisi warna untuk pergantian tema    |

> Semua elemen yang menggunakan variabel ini secara otomatis bertransisi antar tema karena `transition: background var(--transition), color var(--transition)` diterapkan secara global di `body` dan komponen individual.

---

## Components and Interfaces

### 1. Clock & Greeter

**Tanggung Jawab:** Menampilkan waktu saat ini, tanggal, dan salam personal berbasis jam. Memenuhi Persyaratan 1 dan 2.

**Elemen DOM:**
- `#clock` — menampilkan waktu HH:MM:SS
- `#date` — menampilkan tanggal dalam format "Hari, Bulan Tanggal, Tahun"
- `#greeting` — menampilkan teks salam + emoji
- `#displayName` — menampilkan nama pengguna atau "Stranger"

**Fungsi Utama:**

```javascript
getGreeting(hour) → { text: string, emoji: string }
// Pemetaan jam ke salam:
// 0–4   → "Good Night 🌙"
// 5–11  → "Good Morning ☀️"
// 12–16 → "Good Afternoon 🌤️"
// 17–20 → "Good Evening 🌆"
// 21–23 → "Good Night 🌙"

updateClock() → void
// Dipanggil setiap detik via setInterval
// Memperbarui #clock, #date, dan #greeting sekaligus
```

**Siklus Hidup:** `updateClock()` dipanggil sekali saat startup untuk memastikan tampilan langsung benar (Persyaratan 1.4), kemudian diulang setiap 1000ms via `setInterval` (Persyaratan 1.2).

---

### 2. Name Editor

**Tanggung Jawab:** Mengizinkan pengguna mengatur nama tampilan mereka melalui modal popup. Memenuhi Persyaratan 3.

**Elemen DOM:**
- `#editNameBtn` — tombol yang membuka modal
- `#nameModal` — overlay modal
- `#nameInput` — input teks (maxlength="30")
- `#saveNameBtn`, `#cancelNameBtn` — tombol aksi modal
- `#displayName` — tempat nama ditampilkan

**Fungsi Utama:**

```javascript
saveName() → void
// Trim input, simpan ke state.name, panggil save.name(),
// panggil renderName(), tutup modal

renderName() → void
// Set displayName.textContent = state.name || 'Stranger'
// Panggil updateClock() untuk refresh salam
```

**Perilaku Modal:**
- Tekan Enter di `#nameInput` → memanggil `saveName()` (Persyaratan 3.3)
- Klik luar area modal → menutup tanpa menyimpan (Persyaratan 3.4)
- Membuka modal: mengisi input dengan nilai `state.name` saat ini (Persyaratan 3.2)
- Nama dimuat dari LocalStorage saat halaman dimuat (Persyaratan 3.6)

---

### 3. Theme Controller

**Tanggung Jawab:** Mengatur perpindahan tema terang/gelap dengan persistensi. Memenuhi Persyaratan 4.

**Elemen DOM:**
- `#themeToggle` — tombol di header
- `#themeIcon` — emoji ikon (🌙 saat tema terang, ☀️ saat tema gelap)

**Fungsi Utama:**

```javascript
applyTheme() → void
// Atur document.documentElement.setAttribute('data-theme', state.theme)
// Perbarui ikon (🌙 jika light, ☀️ jika dark) dan tooltip tombol
```

**Mekanisme Tema:** CSS custom properties di-*override* oleh selektor `[data-theme="dark"]` pada elemen `<html>`. Transisi warna ditangani oleh CSS `transition` pada semua elemen (Persyaratan 4.7).

---

### 4. Focus Timer

**Tanggung Jawab:** Hitung mundur yang dapat dikonfigurasi dengan notifikasi browser saat selesai. Memenuhi Persyaratan 5.

**Elemen DOM:**
- `#timerDisplay` — menampilkan MM:SS
- `#timerDuration` — input angka (min=1, max=99, default=25)
- `#startBtn`, `#stopBtn`, `#resetBtn` — tombol kontrol
- `#timerStatus` — teks status ("Ready to focus?", "Focus! 🎯", "Paused.", "⏰ Time is up!")

**Fungsi Utama:**

```javascript
formatTime(min, sec) → string   // Menghasilkan "MM:SS" dengan zero-padding

startTimer() → void
// Guard: jika sudah berjalan, tidak melakukan apa-apa
// Set state.timerRunning = true
// Mulai setInterval(1000ms) yang menaikkan state.timerSeconds
// Ketika timerSeconds >= timerMinutes * 60 → panggil completion handler

stopTimer() → void
// clearInterval, state.timerRunning = false, perbarui UI

resetTimer() → void
// clearInterval, state.timerSeconds = 0, perbarui timerMinutes dari input, render ulang

renderTimer() → void
// Hitung remaining = timerMinutes * 60 - timerSeconds
// Tampilkan sebagai MM:SS
```

**Notifikasi Browser:** Izin diminta saat pertama kali tombol Start diklik via `Notification.requestPermission()` (Persyaratan 5.9). Notifikasi dikirim via `new Notification(...)` hanya jika `Notification.permission === 'granted'` (Persyaratan 5.8).

**Animasi Pulse:** Kelas CSS `.running` ditambahkan ke `#timerDisplay` saat berjalan, memicu animasi `@keyframes pulse` (Persyaratan 5.4). Input durasi dinonaktifkan selama timer berjalan (Persyaratan 5.11).

---

### 5. To-Do Manager

**Tanggung Jawab:** Operasi CRUD lengkap pada daftar tugas dengan pencegahan duplikat, pengurutan, dan persistensi. Memenuhi Persyaratan 6, 7, dan 8.

**Elemen DOM:**
- `#todoInput` — input teks (maxlength="100")
- `#addTodoBtn` — tombol tambah
- `#duplicateMsg` — pesan error duplikat
- `#todoList` — `<ul>` yang berisi semua `<li>` tugas
- `#taskCount` — teks penghitung tugas
- `#sortSelect` — dropdown mode pengurutan
- `#editModal`, `#editInput`, `#saveEditBtn`, `#cancelEditBtn` — modal edit

**Fungsi Utama:**

```javascript
isDuplicate(text, excludeId?) → boolean
// Bandingkan text.trim().toLowerCase() dengan semua todo yang ada
// Kecualikan todo dengan id === excludeId (untuk kasus edit)

getSortedTodos() → Todo[]
// Kembalikan salinan state.todos yang diurutkan sesuai state.sortMode:
// 'default' → urutan asli
// 'asc'     → localeCompare naik
// 'desc'    → localeCompare turun
// 'done'    → Number(done) naik (false=0 dulu, true=1 kemudian)

addTodo() → void
// Validasi: tidak kosong, tidak duplikat
// Push { id: uid(), text, done: false } ke state.todos
// Simpan dan render ulang

toggleTodo(id) → void
// Temukan todo by id, flip todo.done, simpan, render ulang

deleteTodo(id) → void
// Filter state.todos, simpan, render ulang

openEditModal(id) → void
// Set state.editingId, isi editInput, tampilkan modal

saveEdit() → void
// Validasi: tidak kosong, tidak duplikat (kecuali diri sendiri)
// Perbarui todo.text, simpan, render ulang, tutup modal

renderTodos() → void
// Ambil getSortedTodos(), render setiap item sebagai <li>
// Gunakan escapeHtml() untuk semua teks yang dirender ke innerHTML
```

**Format Data Task:**
```javascript
{ id: string, text: string, done: boolean }
```

---

### 6. Link Manager

**Tanggung Jawab:** Menyimpan dan menampilkan tautan cepat dengan normalisasi URL otomatis dan favicon. Memenuhi Persyaratan 9.

**Elemen DOM:**
- `#linkLabel` — input label (maxlength="30")
- `#linkUrl` — input URL (maxlength="200")
- `#addLinkBtn` — tombol tambah
- `#linksList` — container untuk chip tautan

**Fungsi Utama:**

```javascript
getFavicon(url) → string
// Ekstrak origin dari URL via new URL(url).origin
// Kembalikan URL Google Favicon: https://www.google.com/s2/favicons?sz=16&domain_url=<origin>

addLink() → void
// Trim label dan url
// Jika url tidak diawali http:// atau https://, tambahkan 'https://'
// Validasi via new URL(url) — tangkap exception untuk URL tidak valid
// Push { id: uid(), label, url } ke state.links
// Simpan dan render ulang

deleteLink(id) → void
// Filter state.links, simpan, render ulang

renderLinks() → void
// Render setiap link sebagai .link-chip
// Gunakan escapeHtml() untuk href dan teks label
// Tambahkan onerror="this.style.display='none'" pada elemen <img> favicon
```

**Format Data Link:**
```javascript
{ id: string, label: string, url: string }
```

---

### 7. Utilitas

```javascript
uid() → string
// Menghasilkan ID unik: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

escapeHtml(str) → string
// Escape &, <, >, ", ' untuk mencegah XSS
// Digunakan setiap kali konten pengguna dirender ke innerHTML
```

---

## Data Models

### State Terpusat

```javascript
const state = {
  // Tema
  theme:         'light' | 'dark',           // default: 'light'

  // Nama pengguna
  name:          string,                      // default: ''

  // Daftar tugas
  todos:         Array<{ id: string, text: string, done: boolean }>,

  // Daftar tautan
  links:         Array<{ id: string, label: string, url: string }>,

  // Status timer
  timerMinutes:  number,                      // default: 25
  timerSeconds:  number,                      // 0 = belum dimulai
  timerRunning:  boolean,                     // apakah sedang berjalan
  timerInterval: ReturnType<setInterval> | null,

  // Status editing
  editingId:     string | null,               // id todo yang sedang diedit
  sortMode:      'default' | 'asc' | 'desc' | 'done',
};
```

### Kunci LocalStorage

| Kunci              | Tipe          | Nilai Default | Deskripsi                       |
|--------------------|---------------|---------------|---------------------------------|
| `ld_theme`         | `string`      | `'light'`     | Preferensi tema                 |
| `ld_name`          | `string`      | `''`          | Nama tampilan pengguna          |
| `ld_todos`         | `JSON string` | `'[]'`        | Array serialisasi daftar tugas  |
| `ld_links`         | `JSON string` | `'[]'`        | Array serialisasi daftar tautan |
| `ld_timer_minutes` | `string`      | `'25'`        | Durasi timer yang disetel       |

### Helper Penyimpanan

```javascript
const save = {
  theme:  () => localStorage.setItem(KEYS.theme, state.theme),
  name:   () => localStorage.setItem(KEYS.name,  state.name),
  todos:  () => localStorage.setItem(KEYS.todos, JSON.stringify(state.todos)),
  links:  () => localStorage.setItem(KEYS.links, JSON.stringify(state.links)),
  timer:  () => localStorage.setItem(KEYS.timer, state.timerMinutes),
};
```

### Inisialisasi Saat Muat Halaman

```javascript
// Dibaca langsung dari localStorage saat state dideklarasikan
const state = {
  theme:        localStorage.getItem(KEYS.theme)  || 'light',
  name:         localStorage.getItem(KEYS.name)   || '',
  todos:        JSON.parse(localStorage.getItem(KEYS.todos) || '[]'),
  links:        JSON.parse(localStorage.getItem(KEYS.links) || '[]'),
  timerMinutes: parseInt(localStorage.getItem(KEYS.timer)   || '25', 10),
  // ...
};
```

---

## Correctness Properties

*Sebuah properti adalah karakteristik atau perilaku yang harus berlaku di seluruh eksekusi sistem yang valid — pada dasarnya, sebuah pernyataan formal tentang apa yang seharusnya dilakukan sistem. Properti berfungsi sebagai jembatan antara spesifikasi yang dapat dibaca manusia dan jaminan kebenaran yang dapat diverifikasi secara otomatis.*

### Property 1: Format Jam dengan Zero-Padding

*Untuk semua* nilai jam (0–23), menit (0–59), dan detik (0–59) yang valid, fungsi format jam harus menghasilkan string waktu dalam format HH:MM:SS di mana setiap komponen selalu terdiri dari tepat dua digit dengan zero-padding di depan.

**Validates: Requirements 1.1**

---

### Property 2: Pemetaan Salam Berbasis Jam

*Untuk semua* nilai jam integer dalam rentang 0–23, fungsi `getGreeting(hour)` harus mengembalikan teks dan emoji salam yang sesuai dengan rentang waktu yang didefinisikan: jam 0–4 dan 21–23 → "Good Night 🌙", jam 5–11 → "Good Morning ☀️", jam 12–16 → "Good Afternoon 🌤️", jam 17–20 → "Good Evening 🌆", dan tidak ada nilai jam yang valid yang menghasilkan output tak terdefinisi.

**Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5**

---

### Property 3: Salam Menyertakan Nama Pengguna

*Untuk semua* string nama yang tidak kosong yang disimpan ke `state.name`, teks salam yang dihasilkan oleh `updateClock()` harus menyertakan nama tersebut dan tidak menampilkan "Stranger".

**Validates: Requirements 2.6**

---

### Property 4: Toggle Tema adalah Idempoten Ganda (Round-Trip)

*Untuk semua* nilai tema awal ("light" atau "dark"), melakukan dua kali toggle tema harus menghasilkan tema yang identik dengan nilai awal — yaitu, `toggle(toggle(theme)) === theme`.

**Validates: Requirements 4.4**

---

### Property 5: Round-Trip Persistensi Tema

*Untuk semua* preferensi tema yang valid ("light" atau "dark"), menyimpan tema ke LocalStorage dan kemudian memuatnya kembali harus menghasilkan nilai yang identik dengan yang disimpan.

**Validates: Requirements 4.5, 4.6**

---

### Property 6: Format Timer MM:SS dengan Zero-Padding

*Untuk semua* nilai menit (0–99) dan detik (0–59) yang valid, fungsi `formatTime(min, sec)` harus menghasilkan string dalam format "MM:SS" di mana kedua komponen selalu terdiri dari tepat dua digit dengan zero-padding.

**Validates: Requirements 5.1**

---

### Property 7: Penambahan Tugas Menambah Panjang Daftar

*Untuk semua* daftar tugas yang ada dan deskripsi tugas baru yang valid (tidak kosong, tidak duplikat), memanggil `addTodo()` harus menghasilkan panjang `state.todos` bertambah tepat satu.

**Validates: Requirements 6.2**

---

### Property 8: Penghapusan Tugas Mengurangi Panjang Daftar

*Untuk semua* daftar tugas yang berisi setidaknya satu tugas, memanggil `deleteTodo(id)` dengan id yang valid harus menghasilkan panjang `state.todos` berkurang tepat satu dan id tersebut tidak lagi ditemukan dalam array.

**Validates: Requirements 6.10**

---

### Property 9: Round-Trip Toggle Status Tugas

*Untuk semua* tugas dalam daftar, memanggil `toggleTodo(id)` dua kali berturut-turut harus menghasilkan nilai `done` yang identik dengan nilai awal sebelum toggle pertama — yaitu, `toggle(toggle(done)) === done`.

**Validates: Requirements 6.5, 6.6**

---

### Property 10: Round-Trip Persistensi Daftar Tugas

*Untuk semua* array tugas yang valid (dengan berbagai kombinasi teks dan status done), melakukan serialisasi ke LocalStorage via `JSON.stringify` dan kemudian deserialisasi via `JSON.parse` harus menghasilkan array yang secara struktural identik dengan array asli.

**Validates: Requirements 6.11, 6.12**

---

### Property 11: Deteksi Duplikat Bersifat Case-Insensitive

*Untuk semua* pasangan string teks dimana satu sudah ada dalam daftar tugas, fungsi `isDuplicate(text)` harus mengembalikan `true` jika dan hanya jika `text.trim().toLowerCase()` sama dengan teks tugas yang sudah ada setelah normalisasi yang sama — terlepas dari kombinasi huruf besar/kecil apapun.

**Validates: Requirements 7.1**

---

### Property 12: isDuplicate Mengecualikan Tugas yang Sedang Diedit

*Untuk semua* tugas yang sedang diedit dengan `excludeId` yang diberikan, fungsi `isDuplicate(text, excludeId)` harus mengembalikan `false` ketika `text` cocok dengan teks tugas yang memiliki id === `excludeId`, sehingga pengeditan ke teks yang sama diizinkan.

**Validates: Requirements 7.4**

---

### Property 13: Pengurutan A→Z Menghasilkan Output Terurut Secara Alfabetik

*Untuk semua* array tugas dengan mode pengurutan `'asc'`, fungsi `getSortedTodos()` harus menghasilkan array di mana untuk setiap pasangan tugas yang berurutan (i, i+1), `todos[i].text.localeCompare(todos[i+1].text) <= 0`.

**Validates: Requirements 8.2, 8.3**

---

### Property 14: Pengurutan "Done Last" Memisahkan Status

*Untuk semua* array tugas dengan mode pengurutan `'done'`, fungsi `getSortedTodos()` harus menghasilkan array di mana semua tugas dengan `done === false` muncul sebelum semua tugas dengan `done === true` — tidak ada tugas yang selesai yang muncul sebelum tugas yang belum selesai.

**Validates: Requirements 8.4**

---

### Property 15: Normalisasi URL Menambahkan Awalan HTTPS

*Untuk semua* string URL yang tidak diawali dengan `http://` atau `https://`, fungsi normalisasi URL dalam `addLink()` harus menghasilkan URL yang diawali dengan `https://` sebelum URL asli.

**Validates: Requirements 9.3**

---

### Property 16: Round-Trip Persistensi Daftar Tautan

*Untuk semua* array tautan yang valid (dengan berbagai label dan URL), melakukan serialisasi ke LocalStorage dan kemudian deserialisasi harus menghasilkan array yang secara struktural identik dengan array asli, termasuk semua properti id, label, dan url.

**Validates: Requirements 9.10, 9.11**

---

## Error Handling

### Validasi Input

| Kondisi | Penanganan |
|---|---|
| Input tugas kosong | `addTodo()` langsung return tanpa aksi |
| Input edit kosong | `saveEdit()` langsung return tanpa aksi |
| Tugas duplikat (tambah) | Tampilkan `#duplicateMsg` selama 3 detik, fokus ke input |
| Tugas duplikat (edit) | Ubah `borderColor` input menjadi `--danger`, reset setelah 2500ms |
| Label atau URL tautan kosong | `addLink()` langsung return tanpa aksi |
| URL tidak valid (setelah normalisasi) | Ubah `borderColor` input URL menjadi `--danger`, reset setelah 2500ms |
| Favicon gagal dimuat | `onerror="this.style.display='none'"` — ikon disembunyikan tanpa error tampilan (Persyaratan 9.8) |
| `localStorage` tidak tersedia | Tidak ada penanganan eksplisit — aplikasi akan gagal saat inisialisasi (kasus edge yang jarang terjadi pada browser modern) |
| `Notification` API tidak tersedia | Tidak ada penanganan eksplisit — hanya dipanggil saat `Notification.permission === 'granted'` |
| `JSON.parse` gagal | Tidak ada penanganan eksplisit — state default (`'[]'`) digunakan sebagai fallback via operator `||` |

### Keamanan XSS

Semua konten yang berasal dari input pengguna diescap melalui fungsi `escapeHtml()` sebelum disisipkan ke `innerHTML`. Fungsi ini mengonversi `&`, `<`, `>`, `"`, dan `'` ke entitas HTML yang sesuai.

### Keamanan Tautan

Semua tautan dibuka di tab baru dengan atribut `rel="noopener noreferrer"` untuk mencegah tab anak mengakses objek `window.opener` dari halaman induk (Persyaratan 9.6).

---

## Testing Strategy

### Pendekatan Pengujian Ganda

Aplikasi ini memiliki dua lapisan pengujian yang saling melengkapi:

1. **Pengujian Unit (Berbasis Contoh):** Memverifikasi perilaku spesifik dengan contoh konkret dan kondisi edge case.
2. **Pengujian Berbasis Properti (Property-Based Testing / PBT):** Memverifikasi properti universal yang harus berlaku untuk semua input yang valid.

### Library yang Direkomendasikan

Untuk property-based testing dalam lingkungan JavaScript vanilla, gunakan **[fast-check](https://github.com/dubzzz/fast-check)**. Library ini mendukung pengujian di Node.js dan browser.

```bash
npm install --save-dev fast-check vitest
```

### Target Fungsi yang Dapat Diuji

Berikut adalah fungsi murni (*pure functions*) yang paling cocok untuk pengujian:

| Fungsi | Tipe Pengujian |
|---|---|
| `getGreeting(hour)` | Property-based + Unit |
| `formatTime(min, sec)` | Property-based + Unit |
| `isDuplicate(text, excludeId)` | Property-based |
| `getSortedTodos()` | Property-based |
| `escapeHtml(str)` | Property-based (round-trip dengan DOM parser) |
| Normalisasi URL di `addLink()` | Property-based |
| `save.*()` + state load (round-trip) | Property-based |

### Contoh Pengujian Berbasis Properti

```javascript
import fc from 'fast-check';
import { describe, it, expect } from 'vitest';

// Feature: todo-dashboard, Property 1: Format jam selalu menghasilkan HH:MM:SS dua digit
describe('formatTime', () => {
  it('selalu menghasilkan format dua digit dengan zero-padding', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 99 }),
        fc.integer({ min: 0, max: 59 }),
        (min, sec) => {
          const result = formatTime(min, sec);
          const parts = result.split(':');
          return parts.length === 2 &&
                 parts[0].length === 2 &&
                 parts[1].length === 2;
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: todo-dashboard, Property 2: Setiap jam menghasilkan salam yang valid
describe('getGreeting', () => {
  it('mengembalikan salam yang valid untuk semua jam 0-23', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 23 }),
        (hour) => {
          const { text, emoji } = getGreeting(hour);
          const validTexts = ['Good Night', 'Good Morning', 'Good Afternoon', 'Good Evening'];
          return validTexts.includes(text) && emoji.length > 0;
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: todo-dashboard, Property 4: Toggle tema dua kali mengembalikan nilai awal
describe('theme toggle', () => {
  it('dua kali toggle mengembalikan tema awal (round-trip)', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('light', 'dark'),
        (initialTheme) => {
          const toggle = (t) => (t === 'light' ? 'dark' : 'light');
          return toggle(toggle(initialTheme)) === initialTheme;
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: todo-dashboard, Property 7: Penambahan tugas menambah panjang daftar tepat satu
describe('addTodo', () => {
  it('menambah panjang state.todos tepat satu untuk input valid', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 1, maxLength: 100 }), { minLength: 0, maxLength: 20 }),
        fc.string({ minLength: 1, maxLength: 100 }),
        (existingTexts, newText) => {
          const todos = existingTexts.map((t, i) => ({ id: String(i), text: t, done: false }));
          if (todos.some(t => t.text.trim().toLowerCase() === newText.trim().toLowerCase())) {
            return true; // skip duplicates
          }
          const before = todos.length;
          todos.push({ id: uid(), text: newText.trim(), done: false });
          return todos.length === before + 1;
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: todo-dashboard, Property 9: Toggle status tugas dua kali mengembalikan nilai awal
describe('toggleTodo', () => {
  it('toggle dua kali mengembalikan status done awal (round-trip)', () => {
    fc.assert(
      fc.property(
        fc.boolean(),
        (initialDone) => {
          const toggle = (d) => !d;
          return toggle(toggle(initialDone)) === initialDone;
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: todo-dashboard, Property 11: isDuplicate mendeteksi duplikat secara case-insensitive
describe('isDuplicate', () => {
  it('mendeteksi duplikat secara case-insensitive', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }),
        (text) => {
          const todos = [{ id: '1', text, done: false }];
          const variants = [text, text.toUpperCase(), text.toLowerCase()];
          return variants.every(v =>
            todos.some(t => t.text.trim().toLowerCase() === v.trim().toLowerCase())
          );
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: todo-dashboard, Property 13: getSortedTodos dengan mode 'asc' menghasilkan urutan alfabet
describe('getSortedTodos asc', () => {
  it('menghasilkan urutan alfabet naik untuk semua array tugas', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 1 }), { minLength: 2, maxLength: 20 }),
        (texts) => {
          const todos = texts.map((t, i) => ({ id: String(i), text: t, done: false }));
          const sorted = [...todos].sort((a, b) => a.text.localeCompare(b.text));
          for (let i = 0; i < sorted.length - 1; i++) {
            if (sorted[i].text.localeCompare(sorted[i + 1].text) > 0) return false;
          }
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: todo-dashboard, Property 15: Normalisasi URL menambahkan awalan https://
describe('URL normalization', () => {
  it('menambahkan awalan https:// untuk URL tanpa protokol', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }).filter(s => !/^https?:\/\//i.test(s)),
        (rawUrl) => {
          const normalized = /^https?:\/\//i.test(rawUrl) ? rawUrl : 'https://' + rawUrl;
          return normalized.startsWith('https://');
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Konfigurasi Pengujian Properti

- **Minimum iterasi per properti:** 100 (`numRuns: 100`)
- **Format tag komentar:** `// Feature: todo-dashboard, Property N: <teks properti>`
- Setiap properti diimplementasikan sebagai satu pengujian berbasis properti

### Pengujian Unit (Berbasis Contoh)

Fokus pada:
- Kondisi edge: input kosong, input hanya spasi, durasi timer 1 menit dan 99 menit
- Integrasi antar komponen: perubahan state → pembaruan DOM
- Interaksi keyboard: Enter pada input tugas (Persyaratan 11.4), Enter di input label pindah fokus ke URL (Persyaratan 11.5), Enter di input URL memicu tambah (Persyaratan 11.6)
- Inisialisasi: state dimuat dengan benar dari LocalStorage saat halaman dimuat
- Perilaku modal: membuka/menutup dengan benar, fokus diarahkan ke input (Persyaratan 3.2, 6.7)
- Tampilan kosong (*empty state*) saat daftar tugas atau tautan masih kosong (Persyaratan 6.4)

### Pengujian Manual (Aksesibilitas & Responsivitas)

Beberapa persyaratan tidak dapat diverifikasi secara otomatis dan memerlukan pengujian manual:
- Tata letak responsif: grid dua kolom di atas 768px, satu kolom di 768px ke bawah (Persyaratan 10.1, 10.2)
- Header sticky saat menggulir halaman (Persyaratan 10.3)
- Animasi transisi tema yang halus (Persyaratan 4.7)
- Animasi slideIn saat item ditambahkan (Persyaratan 10.4)
- Keterbacaan kontras warna pada kedua tema (Persyaratan 11.7)
- Kompatibilitas lintas browser: Chrome, Firefox, Edge, Safari (Persyaratan 10.5)
- Pengujian dengan teknologi bantuan (*screen reader*) untuk verifikasi aksesibilitas penuh (Persyaratan 11.1, 11.2, 11.3)
