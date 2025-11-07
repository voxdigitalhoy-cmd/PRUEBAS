-- create_superadmin.sql
-- Requires pgcrypto extension:
--   CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO admins (username, email, password_hash, role, created_at)
VALUES (
  'superadmin',
  'voxdigitalhoy@gmail.com',
  crypt('987654321', gen_salt('bf')),
  'superadmin',
  NOW()
);
