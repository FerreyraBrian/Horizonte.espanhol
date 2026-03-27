-- Horizonte Español - PostgreSQL Database Schema
-- A1 Level Spanish Learning Platform

-- Courses table
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    level VARCHAR(10) NOT NULL,      -- 'A1', 'A2', 'B1', etc.
    slug VARCHAR(50) UNIQUE NOT NULL, -- 'a1', 'a2'
    title VARCHAR(200) NOT NULL,
    type VARCHAR(20) DEFAULT 'adult'  -- 'adult' or 'kids'
);

-- Modules table (6 modules for A1)
CREATE TABLE modules (
    id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    order_index INTEGER NOT NULL
);

-- Lessons table (30 lessons for A1)
CREATE TABLE lessons (
    id SERIAL PRIMARY KEY,
    module_id INTEGER REFERENCES modules(id) ON DELETE CASCADE,
    slug VARCHAR(100) UNIQUE NOT NULL,   -- 'a1-01-alfabeto'
    title VARCHAR(200) NOT NULL,
    short_summary TEXT,
    full_summary TEXT,
    video_url VARCHAR(500),               -- YouTube embed URL
    order_index INTEGER NOT NULL,
    is_free BOOLEAN DEFAULT FALSE
);

-- Slides (3-5 per lesson)
CREATE TABLE slides (
    id SERIAL PRIMARY KEY,
    lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
    title VARCHAR(200),
    content TEXT,
    order_index INTEGER NOT NULL
);

-- Resources (PDFs, etc.)
CREATE TABLE resources (
    id SERIAL PRIMARY KEY,
    lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    url VARCHAR(500) NOT NULL,             -- Hostinger file URL
    type VARCHAR(50)                       -- 'PDF', 'AUDIO', 'VIDEO'
);

-- Quizzes
CREATE TABLE quizzes (
    id SERIAL PRIMARY KEY,
    lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE UNIQUE
);

CREATE TABLE quiz_questions (
    id SERIAL PRIMARY KEY,
    quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    correct_answer VARCHAR(255) NOT NULL,
    correct_feedback TEXT,
    incorrect_feedback TEXT,
    order_index INTEGER NOT NULL
);

CREATE TABLE quiz_options (
    question_id INTEGER REFERENCES quiz_questions(id) ON DELETE CASCADE,
    option_text VARCHAR(255) NOT NULL,
    PRIMARY KEY (question_id, option_text)
);

-- Listening Exercises
CREATE TABLE listening_exercises (
    id SERIAL PRIMARY KEY,
    lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE UNIQUE,
    audio_url VARCHAR(500) NOT NULL,
    transcript TEXT
);

CREATE TABLE listening_questions (
    id SERIAL PRIMARY KEY,
    exercise_id INTEGER REFERENCES listening_exercises(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    correct_answer VARCHAR(255) NOT NULL,
    correct_feedback TEXT,
    incorrect_feedback TEXT,
    order_index INTEGER NOT NULL
);

CREATE TABLE listening_options (
    question_id INTEGER REFERENCES listening_questions(id) ON DELETE CASCADE,
    option_text VARCHAR(255) NOT NULL,
    PRIMARY KEY (question_id, option_text)
);

-- Users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(500),
    current_course_id INTEGER REFERENCES courses(id),
    progress INTEGER DEFAULT 0,
    role VARCHAR(20) DEFAULT 'student',   -- 'student', 'admin'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Progress (tracking completed lessons)
CREATE TABLE user_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT FALSE,
    quiz_score INTEGER,
    completed_at TIMESTAMP,
    UNIQUE(user_id, lesson_id)
);

-- Writing Submissions
CREATE TABLE writing_submissions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
    content TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    corrected BOOLEAN DEFAULT FALSE,
    feedback TEXT,
    score INTEGER
);

-- Evaluations (Module Exams)
CREATE TABLE evaluations (
    id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    module_number INTEGER NOT NULL,       -- 1, 2, or 3
    title VARCHAR(200) NOT NULL,
    passing_score INTEGER DEFAULT 70
);

-- User Evaluation Results
CREATE TABLE user_evaluations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    evaluation_id INTEGER REFERENCES evaluations(id) ON DELETE CASCADE,
    score INTEGER,
    passed BOOLEAN,
    completed_at TIMESTAMP
);

-- Characters (Tito, Grandma Elena, etc.)
CREATE TABLE characters (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(500)
);

-- Create indexes for better query performance
CREATE INDEX idx_lessons_module ON lessons(module_id);
CREATE INDEX idx_lessons_slug ON lessons(slug);
CREATE INDEX idx_user_progress_user ON user_progress(user_id);
CREATE INDEX idx_user_progress_lesson ON user_progress(lesson_id);
CREATE INDEX idx_writing_submissions_user ON writing_submissions(user_id);
CREATE INDEX idx_users_email ON users(email);
