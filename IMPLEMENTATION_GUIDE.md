# Course Management System - Implementation Guide

## What Has Been Built

### ✅ Completed Components

#### 1. Database Schema (`supabase_course_schema.sql`)
- Complete database schema with RLS policies
- Tables: courses, modules, lessons, quizzes, quiz_questions, quiz_question_options, course_enrollments, student_lesson_progress, student_quiz_attempts
- Proper indexing and relationships
- Row-level security policies for data protection

#### 2. Storage Setup (`SUPABASE_STORAGE_SETUP.md`)
- Configuration for `course-videos` and `course-thumbnails` buckets
- Storage policies for instructor uploads and public viewing

#### 3. API Routes (All Complete)
- **`/api/upload`** - Video/thumbnail upload to Supabase Storage
- **`/api/courses`** - GET (list courses), POST (create course)
- **`/api/courses/[courseId]`** - GET (get course), PUT (update), DELETE
- **`/api/modules`** - POST (create), PUT (update), DELETE
- **`/api/lessons`** - GET, POST (create with quiz), PUT (update), DELETE
- **`/api/quizzes/[quizId]`** - GET quiz
- **`/api/quizzes/[quizId]/attempt`** - POST (submit), GET (history)
- **`/api/progress`** - GET (fetch progress), POST (update video progress)
- **`/api/enrollments`** - GET (list enrollments), POST (enroll), DELETE (unenroll)

#### 4. Teacher Components
- **`VideoUploader`** - Drag & drop video upload with progress
- **`KeywordsInput`** - Tag-style keyword management
- **`QuizBuilder`** - Full quiz creation with multiple-choice and true/false questions
- **`/courses/create`** - Complete 3-step course creation wizard
  - Step 1: Course details (title, description, level, thumbnail)
  - Step 2: Modules and lessons (nested management, video upload, keywords, quizzes)
  - Step 3: Review and publish

#### 5. Student Components
- **`TrackedVideoPlayer`** - React Player with:
  - Auto-save progress every 5 seconds
  - Prevent seeking ahead if `watch_required = true`
  - Track max watched position
  - Complete at 95% watched
- **`QuizTaker`** - Interactive quiz interface with:
  - Radio button selection for answers
  - Instant grading and feedback
  - Show correct/incorrect answers
  - Retake functionality if failed
  - Visual pass/fail indication

---

## Next Steps: Integration & Student Pages

### Step 1: Run Database Setup
```bash
# 1. Go to your Supabase Dashboard → SQL Editor
# 2. Copy contents of supabase_course_schema.sql
# 3. Run the SQL

# 4. Go to Storage → Create buckets:
#    - course-videos (public)
#    - course-thumbnails (public)

# 5. Run storage policies from SUPABASE_STORAGE_SETUP.md
```

### Step 2: Update Existing Lesson Page

Update `/src/app/courses/[courseId]/lesson/[lessonId]/page.tsx`:

```tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout'
import { TrackedVideoPlayer } from '@/components/video/TrackedVideoPlayer'
import { QuizTaker } from '@/components/quiz/QuizTaker'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Lock, CheckCircle2 } from 'lucide-react'

export default function LessonPage() {
  const params = useParams()
  const [lesson, setLesson] = useState<any>(null)
  const [progress, setProgress] = useState<any>(null)
  const [quiz, setQuiz] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [videoCompleted, setVideoCompleted] = useState(false)
  const [quizUnlocked, setQuizUnlocked] = useState(false)

  useEffect(() => {
    fetchLessonData()
  }, [params.lessonId])

  const fetchLessonData = async () => {
    try {
      // Fetch lesson
      const lessonRes = await fetch(`/api/lessons?id=${params.lessonId}`)
      const lessonData = await lessonRes.json()
      setLesson(lessonData)

      // Fetch progress
      const progressRes = await fetch(`/api/progress?lessonId=${params.lessonId}`)
      const progressData = await progressRes.json()
      setProgress(progressData)

      if (progressData?.video_completed) {
        setVideoCompleted(true)
        setQuizUnlocked(true)
      }

      // Fetch quiz if exists
      if (lessonData.quizzes && lessonData.quizzes.length > 0) {
        const quizRes = await fetch(`/api/quizzes/${lessonData.quizzes[0].id}`)
        const quizData = await quizRes.json()
        setQuiz(quizData)
      }
    } catch (error) {
      console.error('Error fetching lesson:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVideoComplete = () => {
    setVideoCompleted(true)
    setQuizUnlocked(true)
  }

  const handleQuizComplete = (passed: boolean, score: number) => {
    if (passed) {
      // Refresh progress
      fetchLessonData()
    }
  }

  if (loading) return <AuthenticatedLayout><div>Loading...</div></AuthenticatedLayout>
  if (!lesson) return <AuthenticatedLayout><div>Lesson not found</div></AuthenticatedLayout>

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        {/* Lesson Info */}
        <div>
          <Badge variant="secondary">{lesson.modules.title}</Badge>
          <h1 className="mt-2 text-3xl font-bold">{lesson.title}</h1>
          <p className="mt-2 text-muted-foreground">{lesson.description}</p>
        </div>

        {/* Video Player */}
        <Card>
          <CardContent className="p-6">
            <TrackedVideoPlayer
              videoUrl={lesson.video_url}
              lessonId={lesson.id}
              watchRequired={lesson.watch_required}
              initialProgress={progress?.video_progress || 0}
              onProgressUpdate={(prog) => console.log('Progress:', prog)}
              onComplete={handleVideoComplete}
            />
          </CardContent>
        </Card>

        {/* Quiz Section */}
        {quiz && (
          <div>
            {quizUnlocked || !lesson.watch_required ? (
              <QuizTaker quiz={quiz} onComplete={handleQuizComplete} />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Quiz Locked
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Complete watching the video to unlock the quiz.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Lesson Completion Status */}
        {progress?.lesson_completed && (
          <Card className="border-green-500 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-medium">Lesson completed!</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AuthenticatedLayout>
  )
}
```

### Step 3: Update Courses List Page

Update `/src/app/courses/page.tsx` to fetch real courses from Supabase:

```tsx
'use client'

import { useState, useEffect } from 'react'
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export default function CoursesPage() {
  const [courses, setCourses] = useState([])
  const [enrollments, setEnrollments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch published courses
      const coursesRes = await fetch('/api/courses')
      const coursesData = await coursesRes.json()
      setCourses(coursesData)

      // Fetch user's enrollments
      const enrollmentsRes = await fetch('/api/enrollments')
      const enrollmentsData = await enrollmentsRes.json()
      setEnrollments(enrollmentsData)
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEnroll = async (courseId: string) => {
    try {
      const res = await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ course_id: courseId })
      })

      if (res.ok) {
        fetchData() // Refresh
      }
    } catch (error) {
      console.error('Error enrolling:', error)
    }
  }

  const isEnrolled = (courseId: string) => {
    return enrollments.some(e => e.course_id === courseId)
  }

  if (loading) return <AuthenticatedLayout><div>Loading...</div></AuthenticatedLayout>

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Available Courses</h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course: any) => (
            <Card key={course.id}>
              <CardHeader>
                {course.thumbnail_url && (
                  <img
                    src={course.thumbnail_url}
                    alt={course.title}
                    className="mb-4 aspect-video w-full rounded-lg object-cover"
                  />
                )}
                <Badge variant="secondary">{course.level}</Badge>
                <CardTitle className="mt-2">{course.title}</CardTitle>
                <CardDescription>{course.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {isEnrolled(course.id) ? (
                  <Link href={`/courses/${course.id}`}>
                    <Button className="w-full">Continue Learning</Button>
                  </Link>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => handleEnroll(course.id)}
                  >
                    Enroll Now
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
```

### Step 4: Update Course Detail Page

Update `/src/app/courses/[courseId]/page.tsx` with lesson unlocking logic:

```tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Circle, Lock, Play } from 'lucide-react'
import Link from 'next/link'

export default function CoursePage() {
  const params = useParams()
  const [course, setCourse] = useState<any>(null)
  const [progress, setProgress] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCourseData()
  }, [params.courseId])

  const fetchCourseData = async () => {
    try {
      const courseRes = await fetch(`/api/courses/${params.courseId}`)
      const courseData = await courseRes.json()
      setCourse(courseData)

      const progressRes = await fetch(`/api/progress?courseId=${params.courseId}`)
      const progressData = await progressRes.json()
      setProgress(progressData)
    } catch (error) {
      console.error('Error fetching course:', error)
    } finally {
      setLoading(false)
    }
  }

  const isLessonCompleted = (lessonId: string) => {
    return progress.some(p => p.lesson_id === lessonId && p.lesson_completed)
  }

  const isLessonUnlocked = (moduleIndex: number, lessonIndex: number) => {
    // First lesson is always unlocked
    if (moduleIndex === 0 && lessonIndex === 0) return true

    // Check if previous lesson is completed
    if (lessonIndex > 0) {
      const prevLesson = course.modules[moduleIndex].lessons[lessonIndex - 1]
      return isLessonCompleted(prevLesson.id)
    }

    // Check if previous module's last lesson is completed
    if (moduleIndex > 0) {
      const prevModule = course.modules[moduleIndex - 1]
      const lastLesson = prevModule.lessons[prevModule.lessons.length - 1]
      return isLessonCompleted(lastLesson.id)
    }

    return false
  }

  if (loading) return <AuthenticatedLayout><div>Loading...</div></AuthenticatedLayout>
  if (!course) return <AuthenticatedLayout><div>Course not found</div></AuthenticatedLayout>

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        <div>
          <Badge variant="secondary">{course.level}</Badge>
          <h1 className="mt-2 text-4xl font-bold">{course.title}</h1>
          <p className="mt-2 text-lg text-muted-foreground">{course.description}</p>
        </div>

        {course.modules?.map((module: any, mIdx: number) => (
          <Card key={module.id}>
            <CardHeader>
              <CardTitle>
                Module {mIdx + 1}: {module.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {module.lessons.map((lesson: any, lIdx: number) => {
                const completed = isLessonCompleted(lesson.id)
                const unlocked = isLessonUnlocked(mIdx, lIdx)

                return (
                  <div
                    key={lesson.id}
                    className={`flex items-center justify-between rounded-lg border p-4 ${
                      !unlocked ? 'opacity-50' : 'hover:bg-accent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {completed ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : unlocked ? (
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <Lock className="h-5 w-5 text-muted-foreground" />
                      )}
                      <div>
                        <p className="font-medium">
                          {mIdx + 1}.{lIdx + 1} {lesson.title}
                        </p>
                        {lesson.quizzes?.length > 0 && (
                          <p className="text-sm text-muted-foreground">
                            Includes quiz
                          </p>
                        )}
                      </div>
                    </div>
                    {unlocked ? (
                      <Link href={`/courses/${params.courseId}/lesson/${lesson.id}`}>
                        <Button size="sm">
                          <Play className="h-4 w-4" />
                        </Button>
                      </Link>
                    ) : (
                      <Button size="sm" disabled>
                        <Lock className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )
              })}
            </CardContent>
          </Card>
        ))}
      </div>
    </AuthenticatedLayout>
  )
}
```

---

## Key Features Summary

### Teacher Features
✅ Create courses with modules and lessons
✅ Upload videos with progress tracking
✅ Add keywords to lessons for searchability
✅ Build quizzes with multiple question types
✅ Set passing scores
✅ Mark lessons as "watch required"
✅ Draft and publish courses

### Student Features
✅ Browse and enroll in courses
✅ Watch video lessons with auto-save progress
✅ Prevented from seeking ahead (if required)
✅ Take quizzes after watching videos
✅ See instant quiz results with feedback
✅ Retake quizzes if failed
✅ Sequential lesson unlocking
✅ Track progress through courses

### System Features
✅ Role-based access (instructor/student)
✅ Row-level security
✅ Video storage in Supabase
✅ Progress tracking
✅ Quiz attempt history
✅ Course enrollment management

---

## Testing Checklist

1. **Teacher Workflow**
   - [ ] Log in as instructor
   - [ ] Create a course via `/courses/create`
   - [ ] Add 2-3 modules with 2 lessons each
   - [ ] Upload videos for each lesson
   - [ ] Add quizzes with 3-5 questions
   - [ ] Publish course

2. **Student Workflow**
   - [ ] Log in as student
   - [ ] Browse courses
   - [ ] Enroll in a course
   - [ ] Watch first video (progress saves)
   - [ ] Complete quiz (must pass)
   - [ ] Verify next lesson unlocks
   - [ ] Try failing quiz (can retake)

3. **Progress Tracking**
   - [ ] Video progress saves every 5 seconds
   - [ ] Cannot seek ahead when required
   - [ ] Quiz unlocks at 95% video completion
   - [ ] Lesson marked complete after passing quiz
   - [ ] Next lesson unlocks automatically

---

## Environment Variables Required

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## Architecture Highlights

- **Modular Design**: Each component is self-contained
- **Progress Tracking**: Real-time video progress with debouncing
- **Sequential Unlocking**: Enforced lesson order
- **Quiz System**: Instant grading with detailed feedback
- **File Upload**: Direct to Supabase Storage
- **Role Separation**: Clear teacher vs student interfaces

---

## Potential Enhancements

- Course preview before enrollment
- Student dashboard with progress overview
- Certificate generation upon course completion
- Discussion forums per lesson
- Instructor analytics dashboard
- Bulk quiz import from CSV
- Video captions/subtitles support
- Mobile-responsive video player controls
