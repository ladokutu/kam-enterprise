# Setup Telegram Bot untuk Notifikasi Contact Form

Panduan lengkap untuk mengkonfigurasi Telegram bot agar menerima notifikasi saat ada pesan baru dari form kontak website.

## Langkah 1: Buat Telegram Bot

1. Buka Telegram dan cari **@BotFather** (official bot dari Telegram)
2. Kirim pesan `/newbot`
3. Ikuti instruksi:
   - Beri nama untuk bot (contoh: `KAM Enterprise Notification Bot`)
   - Beri username untuk bot (contoh: `kamenterprise_bot`)
4. Setelah bot dibuat, BotFather akan memberikan **TOKEN** dalam format:
   ```
   <token>
   ```
5. **Simpan token ini!** Contoh: `123456789:ABCdefGhIJKlmNoPQRstUvWxYz1234567890`

## Langkah 2: Dapatkan Chat ID

Ada 2 cara untuk mendapatkan Chat ID:

### Opsi A: Menggunakan @userinfobot (Paling Mudah)

1. Buka Telegram dan cari **@userinfobot**
2. Kirim pesan apapun ke bot
3. Bot akan membalas dengan **Chat ID** Anda
4. **Simpan Chat ID ini!** Contoh: `-1001234567890` atau `123456789`

### Opsi B: Menggunakan API Telegram

1. Buka browser dan akses URL berikut (ganti YOUR_TOKEN dengan token dari BotFather):
   ```
   https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates
   ```
   Contoh: `https://api.telegram.org/bot123456789:ABCdefGhIJKlmNoPQRstUvWxYz1234567890/getUpdates`

2. Kirim pesan ke bot Anda dari Telegram
3. Refresh halaman browser
4. Cari `"chat":{"id":XXX` dalam response
5. **Simpan Chat ID tersebut!**

## Langkah 3: Konfigurasi Environment Variables

1. Buka file `.env` di root project
2. Tambahkan atau update baris berikut:

```env
# Telegram Bot Configuration (for contact form notifications)
TELEGRAM_BOT_TOKEN="123456789:ABCdefGhIJKlmNoPQRstUvWxYz1234567890"
TELEGRAM_CHAT_ID="-1001234567890"
```

3. Ganti dengan token dan chat ID yang Anda dapatkan

## Langkah 4: Restart Server

Jika development server sedang berjalan, restart untuk memuat environment variables baru:

```bash
# Stop server (Ctrl+C)
# Kemudian jalankan kembali
npm run dev
```

## Testing

1. Buka website di halaman Contact: http://localhost:3000/contact
2. Isi dan submit form kontak
3. Cek Telegram, Anda akan menerima notifikasi dalam format:

```
📬 Pesan Baru dari Website KAM Enterprise

👤 Nama: John Doe
📧 Email: john@example.com
📱 Telepon: 081234567890
💼 Layanan: Pengembangan Aplikasi

💬 Pesan:
Saya tertarik dengan layanan pengembangan aplikasi...

⏰ 9/8/2026, 11:58:00 AM
```

## Troubleshooting

### Notifikasi tidak muncul?

1. **Cek token dan chat ID:**
   - Pastikan token benar (dari @BotFather)
   - Pastikan chat ID benar (dari @userinfobot)

2. **Cek logs server:**
   - Lihat console/server logs untuk error messages
   - Jika muncul `Telegram credentials not configured, skipping notification`, berarti env variables tidak ter-load

3. **Pastikan env variables ter-load:**
   - Restart development server setelah mengubah `.env`
   - Di production, pastikan environment variables di-set di hosting platform

4. **Test Telegram API manual:**
   ```bash
   curl -X POST "https://api.telegram.org/bot<YOUR_TOKEN>/sendMessage" \
     -H "Content-Type: application/json" \
     -d '{"chat_id":"<YOUR_CHAT_ID>","text":"Test message"}'
   ```

### Format Chat ID

- Untuk **personal chat**: `123456789` (tanpa tanda minus)
- Untuk **group/channel**: `-1001234567890` (dengan awalan `-100`)

## Keamanan

⚠️ **PENTING:**
- Jangan commit file `.env` ke Git
- Jangan share token bot ke publik
- Token bot bisa di-reset via @BotFather jika bocor
- File `.env.example` sudah disediakan sebagai template (tanpa credentials asli)

## Fitur Telegram Bot Lainnya (Opsional)

Anda bisa mengembangkan bot lebih lanjut dengan fitur:

- **Quick Reply**: Balas pesan langsung dari Telegram
- **Command**: Gunakan `/help`, `/stats` untuk melihat statistik
- **Inline Keyboard**: Tombol aksi cepat di notifikasi
- **Media Support**: Kirim foto/dokumen
- **Auto-reply**: Balas otomatis ke pengirim

## Bantuan

Jika mengalami kendala:
1. Cek dokumentasi Telegram Bot API: https://core.telegram.org/bots/api
2. Test bot dengan @BotFather terlebih dahulu
3. Pastikan internet connection stabil