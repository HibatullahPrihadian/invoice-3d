# phd.craft - 3D Printing & Custom Merchandise Invoice Generator

Aplikasi web **Invoice Generator** modern, interaktif, dan intuitif yang dirancang khusus untuk bisnis 3D Printing **phd.craft** (Owner: Ibet). Dilengkapi dengan tabel dinamis spesifikasi cetak (jenis filamen, berat & waktu print), integrasi biaya pengiriman (ongkir), live preview lembar A4 secara *real-time*, dan ekspor PDF resolusi tinggi siap cetak.

---

## 🚀 Fitur Utama

1. **Branding & Kontak Terintegrasi**:
   - Kop resmi **phd.craft - 3D Printing & Custom Merchandise**.
   - Kontak default atas nama **Ibet** (WhatsApp, Email, Workshop Address).
   - Pengaturan rekening transfer bank (BCA, Mandiri, QRIS) yang dapat disesuaikan langsung lewat modal settings.

2. **Tabel Item Dinamis Khusus 3D Printing**:
   - **Nama Model 3D / Jasa**: e.g., Casing ESP32, Maket Miniatur, Prototipe CAD.
   - **Pilihan Filamen Cepat**: PLA, PLA+, PETG, ABS/ASA, TPU 95A, Resin SLA, Nylon CF, atau Custom.
   - **Berat / Durasi Print**: Kolom khusus untuk estimasi gram atau jam kerja mesin cetak.
   - **Fitur Ongkir Terintegrasi**: Tombol instan `+ Tambah Ongkir` dengan pilihan kurir populer (J&T, SiCepat, JNE, GoSend, Paxel) langsung di dalam tabel rincian sebelum subtotal.
   - Tambah, duplikat, dan hapus baris dengan animasi halus (Framer Motion).

3. **Perhitungan Keuangan Otomatis**:
   - Subtotal otomatis untuk item cetak 3D dan ekspedisi.
   - Potongan / Diskon (Persentase `%` atau Nominal `Rp`).
   - Pajak / PPN (Toggle instan 11% atau kustom).
   - Uang Muka (DP) & kalkulasi sisa pembayaran (*Balance Due*).
   - Terbilang otomatis dalam ejaan Rupiah Indonesia (contoh: *Dua Ratus Lima Puluh Ribu Rupiah*).

4. **Live A4 Preview & Ekspor PDF**:
   - Tampilan *Split-Screen* (Formulir di kiri, Lembar A4 di kanan).
   - Ekspor satu klik ke file PDF ukuran A4 resolusi tinggi (300 DPI retina) menggunakan `jspdf` + `html2canvas`.
   - Cetak langsung (*direct print*) dengan layout `@media print` presisi tanpa terpotong.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS, Lucide React Icons
- **Animation**: Framer Motion
- **PDF & Canvas**: jsPDF, html2canvas, canvas-confetti
- **Deployment**: Docker (Multi-stage build), Nginx Alpine, Docker Compose

---

## 📂 Struktur Direktori

```
Web-Invoice/
├── Dockerfile                  # Multi-stage build (Node 20 -> Nginx Alpine)
├── docker-compose.yml          # Konfigurasi container port 8080:80
├── nginx.conf                  # Nginx configuration (SPA routing, Gzip, Cache)
├── index.html                  # HTML entry point dengan Google Font Inter
├── package.json                # Dependensi frontend
├── tailwind.config.js          # Konfigurasi tema warna studio & glassmorphism
├── vite.config.js              # Vite bundler config
└── src/
    ├── App.jsx                 # Layout utama split view & state management
    ├── main.jsx                # React DOM render
    ├── index.css               # Base Tailwind & print A4 styling
    ├── components/
    │   ├── Header.jsx          # Navbar atas dengan action buttons & sample loader
    │   ├── InvoiceForm.jsx     # Form input header, customer & dates
    │   ├── ItemTable.jsx       # Dynamic table baris 3D & ekspedisi
    │   ├── SummarySection.jsx  # Kalkulasi diskon, PPN, DP & terbilang
    │   ├── InvoicePreview.jsx  # Lembar kertas A4 siap cetak / unduh
    │   └── CompanyProfileModal.jsx # Modal pengaturan profil Ibet & rekening bank
    └── utils/
        ├── currency.js         # Formatter Rupiah (IDR) & konversi Terbilang
        ├── defaultData.js      # Preset filamen, kurir, dan sample 3D printing
        └── pdfGenerator.js     # Engine PDF & print dialog
```

---

## 🐳 Cara Menjalankan dengan Docker (Rekomendasi)

Hanya perlu **satu perintah** untuk menjalankan seluruh aplikasi menggunakan Docker Compose:

### 1. Build dan Jalankan Container
Buka terminal di dalam folder project ini dan jalankan:
```bash
docker-compose up -d --build
```
*Atau jika menggunakan Docker CLI versi terbaru:*
```bash
docker compose up -d --build
```

### 2. Buka Aplikasi di Browser
Akses URL berikut:
👉 **[http://localhost:8080](http://localhost:8080)**

### 3. Menghentikan Container
Untuk mematikan container saat tidak digunakan:
```bash
docker-compose down
```

---

## 💻 Cara Menjalankan Secara Lokal (Node.js)

Jika Anda ingin menjalankan atau mengembangkan aplikasi langsung tanpa Docker:

### Prasyarat
- Node.js versi 18 atau 20+
- npm atau pnpm

### Langkah:
1. Install seluruh dependensi:
   ```bash
   npm install
   ```

2. Jalankan development server:
   ```bash
   npm run dev
   ```

3. Buka browser pada alamat yang tertera di terminal (biasanya `http://localhost:3000` atau `http://localhost:5173`).

4. Untuk build production statis:
   ```bash
   npm run build
   ```
   File hasil build akan berada di folder `/dist`.

---

## 📝 Tips Penggunaan

- **Tombol "Load Sample"**: Tekan tombol ini di header atas untuk langsung memuat contoh invoice 3D printing yang realistis (Maket Villa PLA, Bracket PETG, Dampener TPU, dan Ongkir Cargo SiCepat).
- **Tombol "+ Tambah Ongkir"**: Klik untuk memilih ekspedisi pengiriman (JNE, SiCepat, J&T, GoSend, Paxel) yang akan langsung masuk sebagai baris berlabel khusus di tabel.
- **Tombol "Profil & Rekening"**: Gunakan untuk mengganti nomor rekening BCA/Mandiri atau alamat workshop jika ada perubahan. Pengaturan ini otomatis tersimpan di penyimpanan browser (`localStorage`).
- **Ekspor PDF**: Klik tombol **"Export to PDF"** untuk menghasilkan dokumen PDF A4 tajam dengan efek konfeti saat berhasil.
