-- Jalankan sekali di Supabase SQL Editor (aman dijalankan ulang).
-- Menghapus batas ukuran 5 MB pada bucket foto gaun. Batas bawaan paket gratis
-- Supabase (50 MB per file) tetap berlaku. Foto besar diperkecil di browser
-- sebelum diunggah, jadi file yang tersimpan umumnya hanya 1 sampai 2 MB.
update storage.buckets
set file_size_limit = null
where id = 'product-images';
