CREATE TABLE IF NOT EXISTS course (
    code VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS "user" (
    username VARCHAR PRIMARY KEY,
    full_name VARCHAR NOT NULL,
    password VARCHAR NOT NULL,
    salt BYTEA NOT NULL,
    is_admin BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS exam (
    id SERIAL PRIMARY KEY,
    course_id VARCHAR NOT NULL REFERENCES course(code),
    user_username VARCHAR NOT NULL REFERENCES "user"(username),
    held_at TIMESTAMP,
    question_amount INTEGER NOT NULL,
    correct_limit INTEGER NOT NULL,
    applied_students TEXT,
    CONSTRAINT valid_question_amount CHECK (question_amount > 0),
    CONSTRAINT valid_correct_limit CHECK (correct_limit > 0 AND correct_limit <= question_amount)
);

CREATE TABLE IF NOT EXISTS questionnaire (
    id SERIAL PRIMARY KEY,
    exam_id INTEGER NOT NULL REFERENCES exam(id),
    gift_file TEXT,
    answers TEXT,
    course_code VARCHAR NOT NULL REFERENCES course(code)
);

CREATE TABLE IF NOT EXISTS exam_result (
    id SERIAL PRIMARY KEY,
    exam_id INTEGER NOT NULL REFERENCES exam(id),
    examinee_neptun_code TEXT NOT NULL,
    user_username VARCHAR NOT NULL REFERENCES "user"(username),
    correct_answers INTEGER NOT NULL,
    CONSTRAINT valid_correct_answers CHECK (correct_answers >= 0)
);

COMMENT ON COLUMN "user".username IS 'Neptun code for examinors, username for admins';
COMMENT ON COLUMN "user".is_admin IS 'If false, the user is examinor';

COMMENT ON COLUMN exam.user_username IS 'The teacher who the exam was created by';
COMMENT ON COLUMN exam.question_amount IS 'How many questions should be generated for the exam sheet';
COMMENT ON COLUMN exam.correct_limit IS 'Minimum number of correct answers needed to pass the exam';

COMMENT ON COLUMN questionnaire.answers IS 'Parsed answers from gift_file';

COMMENT ON COLUMN exam_result.user_username IS 'The teacher who owns the exam';
COMMENT ON COLUMN exam_result.correct_answers IS 'Number of correct answers the examinee got';