insert into public.crops (name_en, name_sw, typical_duration_days)
values
  ('Maize', 'Mahindi', 120),
  ('Common beans', 'Maharage', 90),
  ('Rice', 'Mpunga', 150),
  ('Cassava', 'Muhogo', 300),
  ('Sunflower', 'Alizeti', 110)
on conflict do nothing;