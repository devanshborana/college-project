-- Run this in your Supabase SQL Editor

-- 1. Add 'role' to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role text DEFAULT 'student';

-- 2. Create coding_problems table
CREATE TABLE IF NOT EXISTS coding_problems (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  objective text,
  requirements jsonb, -- Array of strings
  expected_output text,
  starter_code text,
  difficulty text NOT NULL, -- Easy, Medium, Hard
  points integer NOT NULL, -- 10, 25, 50
  subject_id text NOT NULL, -- e.g., 'dsa', 'web-tech'
  teacher_id uuid REFERENCES profiles(id),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE coding_problems ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read coding problems
DROP POLICY IF EXISTS "Anyone can read coding problems" ON coding_problems;
CREATE POLICY "Anyone can read coding problems" 
ON coding_problems FOR SELECT 
USING (true);

-- Allow authenticated teachers to insert
DROP POLICY IF EXISTS "Teachers can insert coding problems" ON coding_problems;
CREATE POLICY "Teachers can insert coding problems" 
ON coding_problems FOR INSERT 
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = teacher_id AND student_id = (auth.jwt() ->> 'email') AND role = 'teacher')
);

-- 3. Create live_quizzes table
CREATE TABLE IF NOT EXISTS live_quizzes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  subject_id text NOT NULL,
  status text DEFAULT 'Scheduled', -- 'Scheduled', 'WaitingRoom', 'Active', 'Completed'
  current_question_index integer DEFAULT -1, -- -1 means not started
  scheduled_for timestamp with time zone,
  teacher_id uuid REFERENCES profiles(id),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE live_quizzes ADD COLUMN IF NOT EXISTS current_question_index integer DEFAULT -1;

-- 4. Create live_quiz_questions table
CREATE TABLE IF NOT EXISTS live_quiz_questions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id uuid REFERENCES live_quizzes(id) ON DELETE CASCADE,
  question_text text NOT NULL,
  options jsonb NOT NULL, -- Array of 4 strings
  correct_answer_index integer NOT NULL
);

-- Enable RLS for live_quizzes
ALTER TABLE live_quizzes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read live_quizzes" ON live_quizzes;
CREATE POLICY "Anyone can read live_quizzes" ON live_quizzes FOR SELECT USING (true);
DROP POLICY IF EXISTS "Anyone can insert live_quizzes" ON live_quizzes;
CREATE POLICY "Anyone can insert live_quizzes" ON live_quizzes FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Anyone can update live_quizzes" ON live_quizzes;
CREATE POLICY "Anyone can update live_quizzes" ON live_quizzes FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Anyone can delete live_quizzes" ON live_quizzes;
CREATE POLICY "Anyone can delete live_quizzes" ON live_quizzes FOR DELETE USING (true);

-- Enable RLS for live_quiz_questions
ALTER TABLE live_quiz_questions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read live_quiz_questions" ON live_quiz_questions;
CREATE POLICY "Anyone can read live_quiz_questions" ON live_quiz_questions FOR SELECT USING (true);
DROP POLICY IF EXISTS "Teachers can insert live_quiz_questions" ON live_quiz_questions;
CREATE POLICY "Teachers can insert live_quiz_questions" ON live_quiz_questions FOR INSERT WITH CHECK (true);

-- 5. Create live_quiz_participants table
CREATE TABLE IF NOT EXISTS live_quiz_participants (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id uuid REFERENCES live_quizzes(id) ON DELETE CASCADE,
  student_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  score integer DEFAULT 0,
  approval_status text DEFAULT 'pending',
  denial_count integer DEFAULT 0,
  joined_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(quiz_id, student_id)
);
ALTER TABLE live_quiz_participants ADD COLUMN IF NOT EXISTS approval_status text DEFAULT 'pending';
ALTER TABLE live_quiz_participants ADD COLUMN IF NOT EXISTS denial_count integer DEFAULT 0;

-- Enable RLS for live_quiz_participants
ALTER TABLE live_quiz_participants ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read live_quiz_participants" ON live_quiz_participants;
CREATE POLICY "Anyone can read live_quiz_participants" ON live_quiz_participants FOR SELECT USING (true);

DROP POLICY IF EXISTS "Students can insert their own participation" ON live_quiz_participants;
CREATE POLICY "Students can insert their own participation" ON live_quiz_participants FOR INSERT 
WITH CHECK (true);

DROP POLICY IF EXISTS "Students can update their own participation" ON live_quiz_participants;
CREATE POLICY "Students can update their own participation" ON live_quiz_participants FOR UPDATE
USING (true);

-- ENABLE REALTIME (Run these manually if they throw an error about publication)
-- ALTER PUBLICATION supabase_realtime ADD TABLE live_quizzes;
-- ALTER PUBLICATION supabase_realtime ADD TABLE live_quiz_participants;
