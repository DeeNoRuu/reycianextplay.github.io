# Reycia Nextplay — HEN All Firmware

Paket hanya berisi HEN All Firmware dan dependensinya.

- Unggah seluruh isi folder ini ke satu direktori hosting.
- Buka `index.html` melalui browser PS4; jalur firmware mengikuti engine bawaan.
- Selesaikan penyimpanan cache saat online sebelum memakai akses offline.
- Tombol Lihat status HEN menuju pesan status, tanpa animasi gulir.
- UI mengikuti referensi: header ringkas, hero dua kolom, ilustrasi permainan,
  background grid, status HEN, dan empat kartu Play, snack, repeat.
- Logo asli dan palet biru, kuning, merah dipertahankan.
- Seluruh engine JavaScript, payload HEN, serta pengelola cache tetap identik
  dengan paket r29; tidak menambah dukungan firmware baru.

Host terpisah, dashboard lama, restore, dan berkas pengembangan tidak disertakan.

Background foto menu:
- Seluruh 39 foto menu dipakai dan dibagi acak ke setiap baris.
- Urutan diacak setiap halaman dibuka atau ukuran layar berubah.
- Baris ganjil bergerak kiri ke kanan; baris genap kanan ke kiri.
- Setiap baris berulang tanpa jeda; gerakan ditangani CSS.
- Foto transparan dioptimalkan menjadi PNG maksimum 192 piksel.
- Animasi mengikuti preferensi pengurangan gerak perangkat dan berhenti
  sementara ketika tab tidak terlihat. Panel utama tetap statis.
