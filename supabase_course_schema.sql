-- Voice Alchemy Academy - Course Management Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- =====================================================
-- COURSES TABLE
-- =====================================================
create table if not exists courses (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  instructor_id uuid references profiles(id) not null,
  thumbnail_url text,
  level text check (level in ('beginner', 'intermediate', 'advanced')),
  is_published boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- =====================================================
-- MODULES TABLE (Course sections)
-- =====================================================
create table if not exists modules (
  id uuid primary key default uuid_generate_v4(),
  course_id uuid references courses(id) on delete cascade not null,
  title text not null,
  description text,
  order_index integer not null,
  created_at timestamp with time zone default now()
);

-- =====================================================
-- LESSONS TABLE (Individual video lessons)
-- =====================================================
create table if not exists lessons (
  id uuid primary key default uuid_generate_v4(),
  module_id uuid references modules(id) on delete cascade not null,
  title text not null,
  description text,
  video_url text not null,
  duration integer, -- duration in seconds
  keywords text[], -- array of keywords
  watch_required boolean default true, -- must watch full video
  order_index integer not null,
  created_at timestamp with time zone default now()
);

-- =====================================================
-- QUIZZES TABLE (One quiz per lesson)
-- =====================================================
create table if not exists quizzes (
  id uuid primary key default uuid_generate_v4(),
  lesson_id uuid references lessons(id) on delete cascade not null unique,
  title text not null,
  passing_score integer default 70, -- percentage required to pass
  created_at timestamp with time zone default now()
);

-- =====================================================
-- QUIZ QUESTIONS TABLE
-- =====================================================
create table if not exists quiz_questions (
  id uuid primary key default uuid_generate_v4(),
  quiz_id uuid references quizzes(id) on delete cascade not null,
  question_text text not null,
  question_type text check (question_type in ('multiple_choice', 'true_false')) default 'multiple_choice',
  order_index integer not null,
  points integer default 1,
  created_at timestamp with time zone default now()
);

-- =====================================================
-- QUIZ QUESTION OPTIONS TABLE (Answer choices)
-- =====================================================
create table if not exists quiz_question_options (
  id uuid primary key default uuid_generate_v4(),
  question_id uuid references quiz_questions(id) on delete cascade not null,
  option_text text not null,
  is_correct boolean default false,
  order_index integer not null
);

-- =====================================================
-- COURSE ENROLLMENTS TABLE (Student enrollments)
-- =====================================================
create table if not exists course_enrollments (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid references profiles(id) not null,
  course_id uuid references courses(id) on delete cascade not null,
  enrolled_at timestamp with time zone default now(),
  unique(student_id, course_id)
);

-- =====================================================
-- STUDENT LESSON PROGRESS TABLE (Track video watching)
-- =====================================================
create table if not exists student_lesson_progress (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid references profiles(id) not null,
  lesson_id uuid references lessons(id) on delete cascade not null,
  video_progress float default 0, -- percentage watched (0-100)
  video_completed boolean default false,
  quiz_passed boolean default false,
  lesson_completed boolean default false, -- true when video watched AND quiz passed
  last_watched_at timestamp with time zone,
  completed_at timestamp with time zone,
  unique(student_id, lesson_id)
);

-- =====================================================
-- STUDENT QUIZ ATTEMPTS TABLE (Track quiz attempts)
-- =====================================================
create table if not exists student_quiz_attempts (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid references profiles(id) not null,
  quiz_id uuid references quizzes(id) on delete cascade not null,
  score float, -- percentage score
  passed boolean default false,
  answers jsonb, -- store student's answers
  started_at timestamp with time zone default now(),
  completed_at timestamp with time zone
);

-- =====================================================
-- INDEXES for better query performance
-- =====================================================
create index if not exists idx_courses_instructor on courses(instructor_id);
create index if not exists idx_courses_published on courses(is_published);
create index if not exists idx_modules_course on modules(course_id);
create index if not exists idx_lessons_module on lessons(module_id);
create index if not exists idx_quizzes_lesson on quizzes(lesson_id);
create index if not exists idx_quiz_questions_quiz on quiz_questions(quiz_id);
create index if not exists idx_quiz_options_question on quiz_question_options(question_id);
create index if not exists idx_enrollments_student on course_enrollments(student_id);
create index if not exists idx_enrollments_course on course_enrollments(course_id);
create index if not exists idx_progress_student on student_lesson_progress(student_id);
create index if not exists idx_progress_lesson on student_lesson_progress(lesson_id);
create index if not exists idx_attempts_student on student_quiz_attempts(student_id);
create index if not exists idx_attempts_quiz on student_quiz_attempts(quiz_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
alter table courses enable row level security;
alter table modules enable row level security;
alter table lessons enable row level security;
alter table quizzes enable row level security;
alter table quiz_questions enable row level security;
alter table quiz_question_options enable row level security;
alter table course_enrollments enable row level security;
alter table student_lesson_progress enable row level security;
alter table student_quiz_attempts enable row level security;

-- COURSES POLICIES
-- Anyone can view published courses
create policy "Anyone can view published courses"
  on courses for select
  using (is_published = true or auth.uid() = instructor_id);

-- Instructors can insert their own courses
create policy "Instructors can create courses"
  on courses for insert
  with check (auth.uid() = instructor_id);

-- Instructors can update their own courses
create policy "Instructors can update their courses"
  on courses for update
  using (auth.uid() = instructor_id);

-- Instructors can delete their own courses
create policy "Instructors can delete their courses"
  on courses for delete
  using (auth.uid() = instructor_id);

-- MODULES POLICIES
-- Anyone can view modules of published courses
create policy "Anyone can view modules of published courses"
  on modules for select
  using (
    exists (
      select 1 from courses
      where courses.id = modules.course_id
      and (courses.is_published = true or courses.instructor_id = auth.uid())
    )
  );

-- Instructors can manage modules of their courses
create policy "Instructors can manage their course modules"
  on modules for all
  using (
    exists (
      select 1 from courses
      where courses.id = modules.course_id
      and courses.instructor_id = auth.uid()
    )
  );

-- LESSONS POLICIES
-- Anyone can view lessons of published courses
create policy "Anyone can view lessons of published courses"
  on lessons for select
  using (
    exists (
      select 1 from modules
      join courses on courses.id = modules.course_id
      where modules.id = lessons.module_id
      and (courses.is_published = true or courses.instructor_id = auth.uid())
    )
  );

-- Instructors can manage lessons of their courses
create policy "Instructors can manage their course lessons"
  on lessons for all
  using (
    exists (
      select 1 from modules
      join courses on courses.id = modules.course_id
      where modules.id = lessons.module_id
      and courses.instructor_id = auth.uid()
    )
  );

-- QUIZZES POLICIES
-- Students can view quizzes for enrolled courses
create policy "Students can view quizzes"
  on quizzes for select
  using (
    exists (
      select 1 from lessons
      join modules on modules.id = lessons.module_id
      join courses on courses.id = modules.course_id
      where lessons.id = quizzes.lesson_id
      and (courses.is_published = true or courses.instructor_id = auth.uid())
    )
  );

-- Instructors can manage quizzes
create policy "Instructors can manage quizzes"
  on quizzes for all
  using (
    exists (
      select 1 from lessons
      join modules on modules.id = lessons.module_id
      join courses on courses.id = modules.course_id
      where lessons.id = quizzes.lesson_id
      and courses.instructor_id = auth.uid()
    )
  );

-- QUIZ QUESTIONS POLICIES
-- Same as quizzes
create policy "Students can view quiz questions"
  on quiz_questions for select
  using (
    exists (
      select 1 from quizzes
      join lessons on lessons.id = quizzes.lesson_id
      join modules on modules.id = lessons.module_id
      join courses on courses.id = modules.course_id
      where quizzes.id = quiz_questions.quiz_id
      and (courses.is_published = true or courses.instructor_id = auth.uid())
    )
  );

create policy "Instructors can manage quiz questions"
  on quiz_questions for all
  using (
    exists (
      select 1 from quizzes
      join lessons on lessons.id = quizzes.lesson_id
      join modules on modules.id = lessons.module_id
      join courses on courses.id = modules.course_id
      where quizzes.id = quiz_questions.quiz_id
      and courses.instructor_id = auth.uid()
    )
  );

-- QUIZ OPTIONS POLICIES
create policy "Students can view quiz options"
  on quiz_question_options for select
  using (
    exists (
      select 1 from quiz_questions
      join quizzes on quizzes.id = quiz_questions.quiz_id
      join lessons on lessons.id = quizzes.lesson_id
      join modules on modules.id = lessons.module_id
      join courses on courses.id = modules.course_id
      where quiz_questions.id = quiz_question_options.question_id
      and (courses.is_published = true or courses.instructor_id = auth.uid())
    )
  );

create policy "Instructors can manage quiz options"
  on quiz_question_options for all
  using (
    exists (
      select 1 from quiz_questions
      join quizzes on quizzes.id = quiz_questions.quiz_id
      join lessons on lessons.id = quizzes.lesson_id
      join modules on modules.id = lessons.module_id
      join courses on courses.id = modules.course_id
      where quiz_questions.id = quiz_question_options.question_id
      and courses.instructor_id = auth.uid()
    )
  );

-- COURSE ENROLLMENTS POLICIES
-- Students can view their own enrollments
create policy "Students can view their enrollments"
  on course_enrollments for select
  using (auth.uid() = student_id);

-- Students can enroll themselves in published courses
create policy "Students can enroll in published courses"
  on course_enrollments for insert
  with check (
    auth.uid() = student_id
    and exists (
      select 1 from courses
      where courses.id = course_enrollments.course_id
      and courses.is_published = true
    )
  );

-- Instructors can view enrollments for their courses
create policy "Instructors can view their course enrollments"
  on course_enrollments for select
  using (
    exists (
      select 1 from courses
      where courses.id = course_enrollments.course_id
      and courses.instructor_id = auth.uid()
    )
  );

-- STUDENT PROGRESS POLICIES
-- Students can view and update their own progress
create policy "Students can manage their progress"
  on student_lesson_progress for all
  using (auth.uid() = student_id);

-- Instructors can view progress for their course students
create policy "Instructors can view student progress"
  on student_lesson_progress for select
  using (
    exists (
      select 1 from lessons
      join modules on modules.id = lessons.module_id
      join courses on courses.id = modules.course_id
      where lessons.id = student_lesson_progress.lesson_id
      and courses.instructor_id = auth.uid()
    )
  );

-- QUIZ ATTEMPTS POLICIES
-- Students can view and create their own attempts
create policy "Students can manage their quiz attempts"
  on student_quiz_attempts for all
  using (auth.uid() = student_id);

-- Instructors can view attempts for their courses
create policy "Instructors can view quiz attempts"
  on student_quiz_attempts for select
  using (
    exists (
      select 1 from quizzes
      join lessons on lessons.id = quizzes.lesson_id
      join modules on modules.id = lessons.module_id
      join courses on courses.id = modules.course_id
      where quizzes.id = student_quiz_attempts.quiz_id
      and courses.instructor_id = auth.uid()
    )
  );

-- =====================================================
-- DIRECT MESSAGING TABLE
-- =====================================================
create table if not exists messages (
  id uuid primary key default uuid_generate_v4(),
  sender_id uuid references profiles(id) on delete cascade not null,
  recipient_id uuid references profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamp with time zone default now(),
  read_at timestamp with time zone
);

create index if not exists idx_messages_sender on messages(sender_id);
create index if not exists idx_messages_recipient on messages(recipient_id);
create index if not exists idx_messages_conversation
  on messages (least(sender_id, recipient_id), greatest(sender_id, recipient_id));

alter table messages enable row level security;

create policy "Users can read their conversations"
  on messages for select
  using (auth.uid() = sender_id or auth.uid() = recipient_id);

create policy "Users can send messages"
  on messages for insert
  with check (auth.uid() = sender_id);

-- Allow listing of user profiles for contact selection
create policy "Authenticated users can view profiles"
  on profiles for select
  using (auth.role() = 'authenticated');

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to update course updated_at timestamp
create or replace function update_course_updated_at()
returns trigger as $$
begin
  update courses set updated_at = now() where id = new.course_id;
  return new;
end;
$$ language plpgsql;

-- Triggers to update course updated_at when modules/lessons change
create trigger update_course_timestamp_on_module
  after insert or update or delete on modules
  for each row execute function update_course_updated_at();

create trigger update_course_timestamp_on_lesson
  after insert or update or delete on lessons
  for each row execute function update_course_updated_at();
