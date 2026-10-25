-- Jalankan sekali di Supabase SQL Editor (aman dijalankan ulang).
-- Menambah kolom opsional untuk tanggal pernikahan dan ukuran badan (cm)
-- pada permintaan fitting. Jalankan SEBELUM men-deploy kodenya.
alter table public.appointments
  add column if not exists wedding_date date,
  add column if not exists height_cm smallint check (height_cm between 100 and 230),
  add column if not exists bust_cm smallint check (bust_cm between 50 and 200),
  add column if not exists waist_cm smallint check (waist_cm between 40 and 200),
  add column if not exists hips_cm smallint check (hips_cm between 50 and 220);
