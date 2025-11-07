CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255),
  password_hash TEXT NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'editor',
  totp_secret TEXT,
  backup_codes TEXT[],
  is_locked BOOLEAN DEFAULT false,
  locked_until TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admin_refresh_tokens (
  id SERIAL PRIMARY KEY,
  admin_id INT REFERENCES admins(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  revoked BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS admin_logs (
  id BIGSERIAL PRIMARY KEY,
  admin_id INT REFERENCES admins(id),
  action TEXT NOT NULL,
  ip VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admin_failed_logins (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR(100),
  ip VARCHAR(45),
  attempt_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
