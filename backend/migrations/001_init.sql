-- Habilitar extensión pgcrypto
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Tabla de personas / usuarios
CREATE TABLE IF NOT EXISTS persons (
  id BIGSERIAL PRIMARY KEY,
  identifier VARCHAR(100) NOT NULL UNIQUE,   -- # de INE + iniciales + sección + CP
  first_initial CHAR(1) NOT NULL,
  last_initial CHAR(1) NOT NULL,
  mother_initial CHAR(1),
  section VARCHAR(10) NOT NULL,
  cp VARCHAR(11) NOT NULL,
  sex CHAR(1),  -- H / M / X
  birth_year INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabla de encuestas
CREATE TABLE IF NOT EXISTS surveys (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  active BOOLEAN DEFAULT true,
  starts_at TIMESTAMP,
  ends_at TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabla de preguntas
CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY,
  survey_id INT REFERENCES surveys(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,   -- ej: single_choice
  text TEXT NOT NULL,
  required BOOLEAN DEFAULT true,
  position INT DEFAULT 0
);

-- Opciones de preguntas
CREATE TABLE IF NOT EXISTS question_options (
  id SERIAL PRIMARY KEY,
  question_id INT REFERENCES questions(id) ON DELETE CASCADE,
  text VARCHAR(500),
  position INT DEFAULT 0
);

-- Respuestas a encuestas (respuestas de cada persona)
CREATE TABLE IF NOT EXISTS responses (
  id BIGSERIAL PRIMARY KEY,
  survey_id INT REFERENCES surveys(id) ON DELETE CASCADE,
  person_id BIGINT REFERENCES persons(id) ON DELETE SET NULL,
  cp VARCHAR(11),
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Respuestas a preguntas
CREATE TABLE IF NOT EXISTS answers (
  id BIGSERIAL PRIMARY KEY,
  response_id BIGINT REFERENCES responses(id) ON DELETE CASCADE,
  question_id INT REFERENCES questions(id) ON DELETE CASCADE,
  option_id INT NULL REFERENCES question_options(id),
  text_answer TEXT NULL,
  number_answer NUMERIC NULL
);

-- ====================================
-- Encuesta inicial: Presidente Municipal
-- ====================================

-- Insertar encuesta
INSERT INTO surveys (title, description, active)
VALUES ('¿Quieres que siga el presidente municipal?', 'Encuesta pública sobre continuidad del presidente municipal', true)
ON CONFLICT DO NOTHING;

-- Obtener id de la encuesta
WITH s AS (SELECT id FROM surveys WHERE title='¿Quieres que siga el presidente municipal?')
INSERT INTO questions (survey_id, type, text, required, position)
SELECT id, 'single_choice', '¿Quieres que siga el presidente municipal?', true, 0 FROM s
ON CONFLICT DO NOTHING;

-- Insertar opciones
WITH q AS (SELECT id FROM questions WHERE text='¿Quieres que siga el presidente municipal?')
INSERT INTO question_options (question_id, text, position)
SELECT id, 'Sí', 0 FROM q
UNION ALL
SELECT id, 'No', 1 FROM q
ON CONFLICT DO NOTHING;
