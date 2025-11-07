-- ====================================
-- Tabla de administradores
-- ====================================
CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255),
  password_hash TEXT NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'editor', -- roles: editor / admin / superadmin
  totp_secret TEXT,
  backup_codes TEXT[],
  is_locked BOOLEAN DEFAULT false,
  locked_until TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabla para almacenar tokens de refresh
CREATE TABLE IF NOT EXISTS admin_refresh_tokens (
  id SERIAL PRIMARY KEY,
  admin_id INT REFERENCES admins(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  revoked BOOLEAN DEFAULT false
);

-- Tabla de logs de acciones de admins
CREATE TABLE IF NOT EXISTS admin_logs (
  id BIGSERIAL PRIMARY KEY,
  admin_id INT REFERENCES admins(id),
  action TEXT NOT NULL,
  ip VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabla de intentos fallidos de login
CREATE TABLE IF NOT EXISTS admin_failed_logins (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR(100),
  ip VARCHAR(45),
  attempt_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ====================================
-- Usuario administrador inicial (opcional)
-- ====================================
-- Reemplaza 'admin123' y el hash por tus credenciales seguras
INSERT INTO admins (username, email, password_hash, role)
VALUES (
  'admin',
  'admin@example.com',
  '$2b$12$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', -- hash de tu password
  'superadmin'
)
ON CONFLICT (username) DO NOTHING;

