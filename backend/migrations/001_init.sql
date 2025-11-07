CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS persons (
  id BIGSERIAL PRIMARY KEY,
  identifier VARCHAR(100) NOT NULL UNIQUE,
  first_initial CHAR(1) NOT NULL,
  last_initial CHAR(1) NOT NULL,
  mother_initial CHAR(1),
  section VARCHAR(10) NOT NULL,
  cp VARCHAR(11) NOT NULL,
  birth_year INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS surveys (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  active BOOLEAN DEFAULT true,
  starts_at TIMESTAMP,
  ends_at TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY,
  survey_id INT REFERENCES surveys(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  text TEXT NOT NULL,
  required BOOLEAN DEFAULT true,
  position INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS question_options (
  id SERIAL PRIMARY KEY,
  question_id INT REFERENCES questions(id) ON DELETE CASCADE,
  text VARCHAR(500),
  position INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS responses (
  id BIGSERIAL PRIMARY KEY,
  survey_id INT REFERENCES surveys(id) ON DELETE CASCADE,
  person_id BIGINT REFERENCES persons(id) ON DELETE SET NULL,
  cp VARCHAR(11),
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS answers (
  id BIGSERIAL PRIMARY KEY,
  response_id BIGINT REFERENCES responses(id) ON DELETE CASCADE,
  question_id INT REFERENCES questions(id) ON DELETE CASCADE,
  option_id INT NULL REFERENCES question_options(id),
  text_answer TEXT NULL,
  number_answer NUMERIC NULL
);
