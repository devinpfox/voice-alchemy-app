import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Clock, Users, Play, CheckCircle2, Circle } from 'lucide-react'
import Link from 'next/link'

interface CoursePageProps {
  params: {
    courseId: string
  }
}

// Mock data - replace with actual Supabase query
const course = {
  id: '1',
  title: 'Vocal Fundamentals',
  description: 'Master the basics of vocal technique and build a strong foundation for your singing journey. This comprehensive course covers everything from breathing techniques to pitch control.',
  level: 'Beginner',
  duration: '8 weeks',
  students: 45,
  instructor: 'Sarah Johnson',
  modules: [
    {
      id: '1',
      title: 'Getting Started',
      lessons: [
        { id: '1', title: 'Introduction to Vocal Training', duration: '10:30', completed: true },
        { id: '2', title: 'Understanding Your Voice', duration: '15:20', completed: true },
        { id: '3', title: 'Proper Posture and Alignment', duration: '12:45', completed: false },
      ],
    },
    {
      id: '2',
      title: 'Breathing Techniques',
      lessons: [
        { id: '4', title: 'Diaphragmatic Breathing', duration: '18:10', completed: false },
        { id: '5', title: 'Breath Control Exercises', duration: '14:30', completed: false },
        { id: '6', title: 'Breath Support for Singing', duration: '16:45', completed: false },
      ],
    },
    {
      id: '3',
      title: 'Pitch and Tone',
      lessons: [
        { id: '7', title: 'Pitch Accuracy Training', duration: '20:15', completed: false },
        { id: '8', title: 'Tone Quality Development', duration: '17:30', completed: false },
        { id: '9', title: 'Vocal Registers', duration: '19:20', completed: false },
      ],
    },
  ],
}

export default function CoursePage({ params }: CoursePageProps) {
  const completedLessons = course.modules.flatMap(m => m.lessons).filter(l => l.completed).length
  const totalLessons = course.modules.flatMap(m => m.lessons).length
  const progress = Math.round((completedLessons / totalLessons) * 100)

  return (
    <AuthenticatedLayout>
      <div className="max-w-6xl mx-auto space-y-8 pb-12">
        {/* Course Header */}
        <div className="glass-card p-8">
          <div className="flex items-start justify-between">
            <div className="max-w-2xl space-y-4">
              <div className="flex items-center gap-3 flex-wrap">
                <Badge>{course.level}</Badge>
                <div className="flex items-center gap-1 text-sm text-white/70">
                  <Users className="h-4 w-4" />
                  {course.students} students
                </div>
                <div className="flex items-center gap-1 text-sm text-white/70">
                  <Clock className="h-4 w-4" />
                  {course.duration}
                </div>
              </div>
              <h1 className="text-4xl font-bold text-white">{course.title}</h1>
              <p className="text-lg text-white/70">{course.description}</p>
              <p className="text-sm text-white/60">
                Instructor: <span className="font-semibold text-brand-gold">{course.instructor}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="glass-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">Your Progress</h3>
            <span className="text-3xl font-bold text-brand-gold">{progress}%</span>
          </div>
          <div className="glass-progress-bg h-3">
            <div
              className="glass-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-3 text-sm text-white/60">
            {completedLessons} of {totalLessons} lessons completed
          </p>
        </div>

        {/* Course Content */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-white">Course Content</h2>
          {course.modules.map((module, moduleIndex) => (
            <div key={module.id} className="glass-card p-0 overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-brand-gold" />
                  Module {moduleIndex + 1}: {module.title}
                </h3>
                <p className="text-sm text-white/60 mt-1">
                  {module.lessons.length} lessons
                </p>
              </div>
              <div className="p-6 space-y-2">
                {module.lessons.map((lesson, lessonIndex) => (
                  <Link
                    key={lesson.id}
                    href={`/courses/${params.courseId}/lesson/${lesson.id}`}
                  >
                    <div className="flex items-center justify-between rounded-xl bg-white/5 border border-white/10 p-4 transition-all hover:bg-white/10 hover:border-brand-gold/30 group">
                      <div className="flex items-center gap-3">
                        {lesson.completed ? (
                          <CheckCircle2 className="h-5 w-5 text-brand-gold" />
                        ) : (
                          <Circle className="h-5 w-5 text-white/40" />
                        )}
                        <div>
                          <p className="font-medium text-white group-hover:text-brand-gold transition-colors">
                            {moduleIndex + 1}.{lessonIndex + 1} {lesson.title}
                          </p>
                          <p className="text-sm text-white/60">
                            {lesson.duration}
                          </p>
                        </div>
                      </div>
                      <div className="glass-button px-4 py-2 flex items-center gap-2">
                        <Play className="h-4 w-4" />
                        <span className="text-sm">Play</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
