-- 003_seed_survey.sql
-- Insertar encuesta inicial: "¿Quieres que siga el presidente municipal?"

-- 1️⃣ Crear la encuesta
INSERT INTO surveys (title, description, active, starts_at, ends_at)
VALUES (
    'Encuesta Presidencia Municipal',
    'Encuesta sobre si quieres que siga el presidente municipal',
    true,
    now(),
    now() + interval '30 days'
)
RETURNING id;

-- Supongamos que la encuesta creada tiene id = 1
-- 2️⃣ Crear la pregunta
INSERT INTO questions (survey_id, type, text, required, position)
VALUES (
    1,
    'single_choice',
    '¿Quieres que siga el presidente municipal?',
    true,
    1
)
RETURNING id;

-- Supongamos que la pregunta creada tiene id = 1
-- 3️⃣ Crear opciones de respuesta
INSERT INTO question_options (question_id, text, position) VALUES (1, 'Sí', 1);
INSERT INTO question_options (question_id, text, position) VALUES (1, 'No', 2);
