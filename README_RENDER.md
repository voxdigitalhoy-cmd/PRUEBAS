ENCUESTAS VOX DIGITAL HOY X MEXICO - Render package


Files included:
- backend/ (server.js, migrations, public/logo.png)
- frontend/ (Vite minimal demo, public/logo.png)
- create_superadmin.sql (creates superadmin: voxdigitalhoy@gmail.com)
- render.yaml and Dockerfile

Instructions:
1) Create a PostgreSQL database in Render and set DATABASE_URL.
2) Run migrations:
   psql "<DATABASE_URL>" -f backend/migrations/001_init.sql
   psql "<DATABASE_URL>" -f backend/migrations/002_admins.sql
3) Enable pgcrypto:
   psql "<DATABASE_URL>" -c "CREATE EXTENSION IF NOT EXISTS pgcrypto;"
4) Create superadmin:
   psql "<DATABASE_URL>" -f create_superadmin.sql
5) Set TEST_DELETE_TOKEN in Render env if you want the test-data delete endpoint enabled.
