'use client'

import { useState } from 'react'
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { VideoUploader } from '@/components/course-builder/VideoUploader'
import { KeywordsInput } from '@/components/course-builder/KeywordsInput'
import { QuizBuilder } from '@/components/course-builder/QuizBuilder'
import { ChevronRight, ChevronLeft, Plus, Trash2, Check, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Quiz {
  title: string
  passing_score: number
  questions: Array<{
    question_text: string
    question_type: 'multiple_choice' | 'true_false'
    points: number
    options: Array<{
      option_text: string
      is_correct: boolean
    }>
  }>
}

interface Lesson {
  title: string
  description: string
  video_url: string
  keywords: string[]
  watch_required: boolean
  quiz: Quiz | null
}

interface Module {
  title: string
  description: string
  lessons: Lesson[]
}

type Step = 'course-details' | 'modules' | 'review'

export default function CreateCoursePage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('course-details')
  const [saving, setSaving] = useState(false)

  // Course details
  const [courseTitle, setCourseTitle] = useState('')
  const [courseDescription, setCourseDescription] = useState('')
  const [courseLevel, setCourseLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner')
  const [courseThumbnail, setCourseThumbnail] = useState('')

  // Modules and lessons
  const [modules, setModules] = useState<Module[]>([])
  const [currentModuleIndex, setCurrentModuleIndex] = useState<number | null>(null)
  const [currentLessonIndex, setCurrentLessonIndex] = useState<number | null>(null)

  const addModule = () => {
    setModules([...modules, { title: '', description: '', lessons: [] }])
  }

  const updateModule = (index: number, updates: Partial<Module>) => {
    setModules(modules.map((m, i) => (i === index ? { ...m, ...updates } : m)))
  }

  const removeModule = (index: number) => {
    setModules(modules.filter((_, i) => i !== index))
    if (currentModuleIndex === index) {
      setCurrentModuleIndex(null)
      setCurrentLessonIndex(null)
    }
  }

  const addLesson = (moduleIndex: number) => {
    const newLesson: Lesson = {
      title: '',
      description: '',
      video_url: '',
      keywords: [],
      watch_required: true,
      quiz: null
    }
    const updatedModules = modules.map((m, i) =>
      i === moduleIndex ? { ...m, lessons: [...m.lessons, newLesson] } : m
    )
    setModules(updatedModules)
    setCurrentModuleIndex(moduleIndex)
    setCurrentLessonIndex(updatedModules[moduleIndex].lessons.length - 1)
  }

  const updateLesson = (moduleIndex: number, lessonIndex: number, updates: Partial<Lesson>) => {
    setModules(
      modules.map((m, mIdx) =>
        mIdx === moduleIndex
          ? {
              ...m,
              lessons: m.lessons.map((l, lIdx) =>
                lIdx === lessonIndex ? { ...l, ...updates } : l
              )
            }
          : m
      )
    )
  }

  const removeLesson = (moduleIndex: number, lessonIndex: number) => {
    setModules(
      modules.map((m, mIdx) =>
        mIdx === moduleIndex
          ? { ...m, lessons: m.lessons.filter((_, lIdx) => lIdx !== lessonIndex) }
          : m
      )
    )
    if (currentModuleIndex === moduleIndex && currentLessonIndex === lessonIndex) {
      setCurrentLessonIndex(null)
    }
  }

  const canProceedFromCourseDetails = () => {
    return courseTitle.trim() !== '' && courseDescription.trim() !== ''
  }

  const canProceedFromModules = () => {
    if (modules.length === 0) return false
    return modules.every(
      (m) =>
        m.title.trim() !== '' &&
        m.lessons.length > 0 &&
        m.lessons.every((l) => l.title.trim() !== '' && l.video_url !== '')
    )
  }

  const handleSaveCourse = async () => {
    setSaving(true)
    try {
      // 1. Create course
      const courseRes = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: courseTitle,
          description: courseDescription,
          level: courseLevel,
          thumbnail_url: courseThumbnail || null
        })
      })

      if (!courseRes.ok) throw new Error('Failed to create course')
      const course = await courseRes.json()

      // 2. Create modules and lessons
      for (const [moduleIdx, module] of modules.entries()) {
        const moduleRes = await fetch('/api/modules', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            course_id: course.id,
            title: module.title,
            description: module.description,
            order_index: moduleIdx
          })
        })

        if (!moduleRes.ok) throw new Error('Failed to create module')
        const createdModule = await moduleRes.json()

        // Create lessons for this module
        for (const [lessonIdx, lesson] of module.lessons.entries()) {
          const lessonRes = await fetch('/api/lessons', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              module_id: createdModule.id,
              title: lesson.title,
              description: lesson.description,
              video_url: lesson.video_url,
              keywords: lesson.keywords,
              watch_required: lesson.watch_required,
              order_index: lessonIdx,
              quiz: lesson.quiz
            })
          })

          if (!lessonRes.ok) throw new Error('Failed to create lesson')
        }
      }

      // Success! Redirect to course page
      alert('Course created successfully!')
      router.push(`/courses/${course.id}`)
    } catch (error) {
      console.error('Error saving course:', error)
      alert('Failed to save course. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const renderCourseDetailsStep = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Course Information</CardTitle>
          <CardDescription>Enter the basic details about your course</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="course-title">Course Title *</Label>
            <Input
              id="course-title"
              value={courseTitle}
              onChange={(e) => setCourseTitle(e.target.value)}
              placeholder="e.g., Vocal Fundamentals for Beginners"
            />
          </div>

          <div>
            <Label htmlFor="course-description">Course Description *</Label>
            <Textarea
              id="course-description"
              value={courseDescription}
              onChange={(e) => setCourseDescription(e.target.value)}
              placeholder="Describe what students will learn in this course..."
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="course-level">Course Level</Label>
            <select
              id="course-level"
              value={courseLevel}
              onChange={(e) => setCourseLevel(e.target.value as any)}
              className="glass-input w-full"
            >
              <option value="beginner" className="bg-brand-purple text-white">Beginner</option>
              <option value="intermediate" className="bg-brand-purple text-white">Intermediate</option>
              <option value="advanced" className="bg-brand-purple text-white">Advanced</option>
            </select>
          </div>

          <div>
            <Label>Course Thumbnail (Optional)</Label>
            <VideoUploader
              onUploadComplete={(url) => setCourseThumbnail(url)}
              currentVideoUrl={courseThumbnail}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={() => setStep('modules')}
          disabled={!canProceedFromCourseDetails()}
        >
          Next: Add Modules
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )

  const renderModulesStep = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Course Modules</CardTitle>
              <CardDescription>
                Organize your course into modules with video lessons
              </CardDescription>
            </div>
            <Button onClick={addModule}>
              <Plus className="mr-2 h-4 w-4" />
              Add Module
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {modules.length === 0 ? (
            <div className="rounded-lg border-2 border-dashed p-8 text-center">
              <p className="text-sm text-muted-foreground">
                No modules yet. Click "Add Module" to get started.
              </p>
            </div>
          ) : (
            modules.map((module, mIdx) => (
              <div key={mIdx} className="glass-card p-0 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <Input
                        value={module.title}
                        onChange={(e) => updateModule(mIdx, { title: e.target.value })}
                        placeholder={`Module ${mIdx + 1} Title`}
                        className="text-lg font-semibold"
                      />
                      <Textarea
                        value={module.description}
                        onChange={(e) => updateModule(mIdx, { description: e.target.value })}
                        placeholder="Module description..."
                        rows={2}
                      />
                    </div>
                    <Button
                      onClick={() => removeModule(mIdx)}
                      variant="ghost"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4 text-white/70" />
                    </Button>
                  </div>
                </div>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Lessons ({module.lessons.length})</Label>
                    <Button onClick={() => addLesson(mIdx)} size="sm" variant="outline">
                      <Plus className="mr-2 h-3 w-3" />
                      Add Lesson
                    </Button>
                  </div>

                  {module.lessons.map((lesson, lIdx) => (
                    <div
                      key={lIdx}
                      className={`rounded-xl p-4 transition-all ${
                        currentModuleIndex === mIdx && currentLessonIndex === lIdx
                          ? 'bg-white/10 border-2 border-primary/50 shadow-lg'
                          : 'bg-white/5 border border-white/10 hover:bg-white/8 cursor-pointer'
                      }`}
                    >
                      {currentModuleIndex === mIdx && currentLessonIndex === lIdx ? (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">Edit Lesson {lIdx + 1}</h4>
                            <div className="flex gap-2">
                              <Button
                                onClick={() => setCurrentLessonIndex(null)}
                                variant="outline"
                                size="sm"
                              >
                                <Check className="mr-2 h-3 w-3" />
                                Done
                              </Button>
                              <Button
                                onClick={() => removeLesson(mIdx, lIdx)}
                                variant="ghost"
                                size="sm"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <div>
                            <Label>Lesson Title *</Label>
                            <Input
                              value={lesson.title}
                              onChange={(e) =>
                                updateLesson(mIdx, lIdx, { title: e.target.value })
                              }
                              placeholder="Lesson title"
                            />
                          </div>

                          <div>
                            <Label>Lesson Description</Label>
                            <Textarea
                              value={lesson.description}
                              onChange={(e) =>
                                updateLesson(mIdx, lIdx, { description: e.target.value })
                              }
                              placeholder="Describe what this lesson covers..."
                              rows={3}
                            />
                          </div>

                          <div>
                            <Label>Video *</Label>
                            <VideoUploader
                              onUploadComplete={(url) =>
                                updateLesson(mIdx, lIdx, { video_url: url })
                              }
                              currentVideoUrl={lesson.video_url}
                              courseId="temp"
                              lessonId={`${mIdx}-${lIdx}`}
                            />
                          </div>

                          <div>
                            <Label>Keywords</Label>
                            <KeywordsInput
                              keywords={lesson.keywords}
                              onChange={(keywords) =>
                                updateLesson(mIdx, lIdx, { keywords })
                              }
                            />
                          </div>

                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id={`watch-required-${mIdx}-${lIdx}`}
                              checked={lesson.watch_required}
                              onChange={(e) =>
                                updateLesson(mIdx, lIdx, {
                                  watch_required: e.target.checked
                                })
                              }
                              className="h-4 w-4"
                            />
                            <Label htmlFor={`watch-required-${mIdx}-${lIdx}`}>
                              Require students to watch full video before taking quiz
                            </Label>
                          </div>

                          <div>
                            <Label>Quiz (Optional)</Label>
                            <QuizBuilder
                              quiz={lesson.quiz}
                              onChange={(quiz) => updateLesson(mIdx, lIdx, { quiz })}
                            />
                          </div>
                        </div>
                      ) : (
                        <div
                          className="flex cursor-pointer items-center justify-between"
                          onClick={() => {
                            setCurrentModuleIndex(mIdx)
                            setCurrentLessonIndex(lIdx)
                          }}
                        >
                          <div>
                            <p className="font-medium">
                              Lesson {lIdx + 1}: {lesson.title || 'Untitled'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {lesson.video_url ? 'Video uploaded' : 'No video'} •{' '}
                              {lesson.quiz ? `Quiz (${lesson.quiz.questions.length} questions)` : 'No quiz'}
                            </p>
                          </div>
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button onClick={() => setStep('course-details')} variant="outline">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={() => setStep('review')}
          disabled={!canProceedFromModules()}
        >
          Next: Review & Publish
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )

  const renderReviewStep = () => {
    const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0)
    const lessonsWithQuizzes = modules.reduce(
      (sum, m) => sum + m.lessons.filter((l) => l.quiz).length,
      0
    )

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Review Your Course</CardTitle>
            <CardDescription>
              Make sure everything looks good before publishing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="mb-2 font-semibold">Course Details</h3>
              <div className="space-y-1 text-sm">
                <p><strong>Title:</strong> {courseTitle}</p>
                <p><strong>Level:</strong> {courseLevel}</p>
                <p><strong>Modules:</strong> {modules.length}</p>
                <p><strong>Total Lessons:</strong> {totalLessons}</p>
                <p><strong>Lessons with Quizzes:</strong> {lessonsWithQuizzes}</p>
              </div>
            </div>

            <div>
              <h3 className="mb-2 font-semibold">Course Structure</h3>
              {modules.map((module, mIdx) => (
                <div key={mIdx} className="mb-4 rounded-lg border p-4">
                  <p className="font-medium">
                    Module {mIdx + 1}: {module.title}
                  </p>
                  <ul className="ml-4 mt-2 list-disc space-y-1 text-sm text-muted-foreground">
                    {module.lessons.map((lesson, lIdx) => (
                      <li key={lIdx}>
                        {lesson.title}
                        {lesson.quiz && ` (Quiz: ${lesson.quiz.questions.length} questions)`}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button onClick={() => setStep('modules')} variant="outline">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="flex gap-2">
            <Button onClick={handleSaveCourse} variant="outline" disabled={saving}>
              Save as Draft
            </Button>
            <Button onClick={handleSaveCourse} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                'Publish Course'
              )}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <AuthenticatedLayout>
      <div className="max-w-5xl mx-auto space-y-8 pb-12">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white">Create New Course</h1>
          <p className="text-white/70 text-lg">
            Build a comprehensive course with modules, lessons, and quizzes
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold transition-all ${
              step === 'course-details'
                ? 'glass-button'
                : 'glass-badge text-base'
            }`}
          >
            1
          </div>
          <div className="glass-progress-bg h-2 w-16">
            <div className={`glass-progress-fill ${step === 'course-details' ? 'w-0' : 'w-full'}`} />
          </div>
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold transition-all ${
              step === 'modules'
                ? 'glass-button'
                : step === 'review'
                ? 'glass-badge text-base'
                : 'bg-white/5 text-white/50'
            }`}
          >
            2
          </div>
          <div className="glass-progress-bg h-2 w-16">
            <div className={`glass-progress-fill ${step === 'review' ? 'w-full' : 'w-0'}`} />
          </div>
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold transition-all ${
              step === 'review'
                ? 'glass-button'
                : 'bg-white/5 text-white/50'
            }`}
          >
            3
          </div>
        </div>

        {/* Step Content */}
        {step === 'course-details' && renderCourseDetailsStep()}
        {step === 'modules' && renderModulesStep()}
        {step === 'review' && renderReviewStep()}
      </div>
    </AuthenticatedLayout>
  )
}
