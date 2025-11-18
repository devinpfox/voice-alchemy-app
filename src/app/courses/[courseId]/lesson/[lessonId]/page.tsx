'use client'

import { useState, useEffect } from 'react'
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TrackedVideoPlayer } from '@/components/video/TrackedVideoPlayer'
import { QuizTaker } from '@/components/quiz/QuizTaker'
import { ChevronLeft, ChevronRight, Lock, CheckCircle2, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface LessonPageProps {
  params: {
    courseId: string
    lessonId: string
  }
}

export default function LessonPage({ params }: LessonPageProps) {
  const [lesson, setLesson] = useState<any>(null)
  const [progress, setProgress] = useState<any>(null)
  const [quiz, setQuiz] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [videoCompleted, setVideoCompleted] = useState(false)
  const [quizUnlocked, setQuizUnlocked] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)

  useEffect(() => {
    fetchLessonData()
  }, [params.lessonId])

  const fetchLessonData = async () => {
    try {
      // Fetch lesson with module and course info
      const lessonRes = await fetch(`/api/lessons?id=${params.lessonId}`)
      if (!lessonRes.ok) throw new Error('Failed to fetch lesson')
      const lessonData = await lessonRes.json()
      setLesson(lessonData)

      // Fetch progress
      const progressRes = await fetch(`/api/progress?lessonId=${params.lessonId}`)
      if (progressRes.ok) {
        const progressData = await progressRes.json()
        setProgress(progressData)

        if (progressData?.video_completed) {
          setVideoCompleted(true)
          setQuizUnlocked(true)
        }

        if (progressData?.lesson_completed) {
          setQuizCompleted(true)
        }
      }

      // Fetch quiz if exists
      if (lessonData.quizzes && lessonData.quizzes.length > 0) {
        const quizId = lessonData.quizzes[0].id
        const quizRes = await fetch(`/api/quizzes/${quizId}`)
        if (quizRes.ok) {
          const quizData = await quizRes.json()
          setQuiz(quizData)
        }
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
      setQuizCompleted(true)
      // Refresh progress to get updated completion status
      fetchLessonData()
    }
  }

  if (loading) {
    return (
      <AuthenticatedLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AuthenticatedLayout>
    )
  }

  if (!lesson) {
    return (
      <AuthenticatedLayout>
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">Lesson not found</p>
            <Link href={`/courses/${params.courseId}`}>
              <Button className="mt-4" variant="outline">
                Back to Course
              </Button>
            </Link>
          </CardContent>
        </Card>
      </AuthenticatedLayout>
    )
  }

  const courseTitle = lesson.modules?.courses?.title || 'Course'
  const moduleTitle = lesson.modules?.title || 'Module'
  return (
    <AuthenticatedLayout>
      <div className="max-w-5xl mx-auto space-y-6 pb-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-white/60">
          <Link href="/courses" className="hover:text-brand-gold transition-colors">
            Courses
          </Link>
          <span>/</span>
          <Link
            href={`/courses/${params.courseId}`}
            className="hover:text-brand-gold transition-colors"
          >
            {courseTitle}
          </Link>
          <span>/</span>
          <span className="text-white">{lesson.title}</span>
        </div>

        {/* Lesson Header */}
        <div className="glass-card">
          <Badge className="mb-3">
            {moduleTitle}
          </Badge>
          <h1 className="text-4xl font-bold text-white mb-3">{lesson.title}</h1>
          <p className="text-white/70">{lesson.description}</p>

          {/* Keywords */}
          {lesson.keywords && lesson.keywords.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {lesson.keywords.map((keyword: string, idx: number) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {keyword}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Completion Status */}
        {quizCompleted && (
          <div className="glass-card border-2 border-brand-gold/50 bg-brand-gold/10">
            <div className="flex items-center gap-3 text-brand-gold">
              <CheckCircle2 className="h-6 w-6" />
              <span className="font-semibold text-lg">Lesson completed! Great job!</span>
            </div>
          </div>
        )}

        {/* Video Player */}
        <div className="glass-card p-0 overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-2xl font-semibold text-white">Lesson Video</h2>
          </div>
          <div className="p-6">
            <TrackedVideoPlayer
              videoUrl={lesson.video_url}
              lessonId={lesson.id}
              watchRequired={lesson.watch_required}
              initialProgress={progress?.video_progress || 0}
              onProgressUpdate={(prog) => console.log('Progress:', prog)}
              onComplete={handleVideoComplete}
            />
          </div>
        </div>

        {/* Quiz Section */}
        {quiz && (
          <div>
            {quizUnlocked || !lesson.watch_required ? (
              <QuizTaker quiz={quiz} onComplete={handleQuizComplete} />
            ) : (
              <div className="glass-card p-0 overflow-hidden">
                <div className="p-6 border-b border-white/10">
                  <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
                    <Lock className="h-6 w-6 text-white/60" />
                    Quiz Locked
                  </h2>
                  <p className="text-white/60 mt-2">
                    Complete watching the video to unlock the quiz
                  </p>
                </div>
                <div className="p-6">
                  <p className="text-sm text-white/60">
                    You need to watch at least 95% of the video before you can take the quiz.
                  </p>
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-white/60">Current progress</span>
                      <span className="text-brand-gold font-semibold">{Math.round(progress?.video_progress || 0)}%</span>
                    </div>
                    <div className="glass-progress-bg h-2">
                      <div
                        className="glass-progress-fill"
                        style={{ width: `${progress?.video_progress || 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="glass-card">
          <div className="flex items-center justify-between">
            <Link href={`/courses/${params.courseId}`}>
              <Button variant="outline">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Course
              </Button>
            </Link>
            {quizCompleted && (
              <div className="glass-badge flex items-center gap-2 px-4 py-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>Completed</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
