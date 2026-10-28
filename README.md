# 🍩 Milkluxe D'leche — Donat Preorder

Website preorder donat **Milkluxe D'leche**. Single-page, tanpa framework, tanpa backend — semua pesanan dikirim langsung lewat **WhatsApp** pelanggan.

## ✨ Fitur

- **Menu donat dinamis** — Original (Rp 10.000/box) & Variant (Coklat, Strawberry, Blueberry, Keju, Mix — Rp 15.000/box, 4 donat per box).
- **Stepper jumlah** — tombol +/− dan input angka dengan validasi (bilangan bulat, maks 50 box per menu).
- **Ringkasan pesanan real-time** — rincian per rasa, total box, total donat, dan total harga dengan animasi angka naik/turun.
- **Form data pemesan tervalidasi** — nama, nomor WhatsApp (normalisasi otomatis format 08/62/+62), alamat (min. 10 karakter), plus tombol **Gunakan lokasi saya** (Geolocation API → link Google Maps otomatis masuk alamat).
- **Kirim via WhatsApp** — satu klik membuka `wa.me` dengan pesan pesanan lengkap yang sudah terformat (rincian, total, nomor pembayaran QRIS/ShopeePay).
- **Salin cepat** — tombol salin nomor ShopeePay, salin total bayar, dan salin teks pesanan (clipboard API + fallback `execCommand`).
- **Sticky bottom bar** — total & tombol lanjut selalu terlihat saat memilih donat.
- **Dark mode otomatis** — mengikuti `prefers-color-scheme`, tetap bisa dipaksa light via `data-theme`.
- **Aksesibel** — `aria-label`, `aria-live`, fokus terlihat, dukungan `prefers-reduced-motion`.

## 📱 Kompatibel Mobile

- `<meta viewport>` + `viewport-fit=cover`, aman untuk notch (safe-area insets di atas & bawah).
- Layout max-width 460px, tombol & stepper ukuran sentuh (min 44px), `touch-action: manipulation` anti double-tap zoom.
- `inputmode="numeric"` / `tel` untuk keyboard angka & telepon di HP.
- Ringan: total 3 file statis + 6 foto, tanpa framework, cepat dibuka di jaringan lambat.

## 📂 Struktur

```
milkluxe-donat/
├── index.html      # Markup halaman (form, menu, ringkasan, pembayaran)
├── style.css       # Tema, animasi, responsive, dark mode
├── script.js       # Logika menu, validasi, ringkasan, WhatsApp
└── assets/         # Foto tiap varian donat (jpg)
```

## 🚀 Cara Pakai

1. Clone / download repo ini.
2. Buka `index.html` di browser — tidak perlu build, server, atau dependency.
3. Host di mana saja (GitHub Pages, Netlify, Vercel) — situs 100% statis.

## ⚙️ Kustomisasi

Semua pengaturan ada di atas `script.js`:

```js
const MAX = 50;                 // maks. box per menu
const PAY_NO = '083141740173';  // ShopeePay
const WA_NO = '6283141740173';  // WhatsApp (format 62…)
const MENU = [ ... ];           // rasa, harga, foto (assets/)
```

## 🔒 Privasi

Lokasi GPS hanya dibaca di browser dan tidak pernah dikirim/diimpan ke server — hanya ikut sebagai teks di pesan WhatsApp yang dikirim sendiri oleh pengguna.

## 📄 Lisensi

Bebas digunakan untuk kebutuhan usaha Milkluxe D'leche.
