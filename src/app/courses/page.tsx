import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Clock, Users } from 'lucide-react'
import Link from 'next/link'

const courses = [
  {
    id: '1',
    title: 'Vocal Fundamentals',
    description: 'Master the basics of vocal technique and build a strong foundation',
    level: 'Beginner',
    duration: '8 weeks',
    students: 45,
    thumbnail: '/placeholder-course.jpg',
    progress: 75,
  },
  {
    id: '2',
    title: 'Advanced Vocal Techniques',
    description: 'Take your voice to the next level with advanced training methods',
    level: 'Advanced',
    duration: '10 weeks',
    students: 23,
    thumbnail: '/placeholder-course.jpg',
    progress: 30,
  },
  {
    id: '3',
    title: 'Performance Mastery',
    description: 'Learn to perform with confidence and connect with your audience',
    level: 'Intermediate',
    duration: '6 weeks',
    students: 31,
    thumbnail: '/placeholder-course.jpg',
    progress: 0,
  },
]

export default function CoursesPage() {
  return (
    <AuthenticatedLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white">My Courses</h1>
          <p className="text-white/70 text-lg">
            Continue your learning journey
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <div key={course.id} className="glass-card-hover flex flex-col p-0 overflow-hidden">
              <div className="p-6 flex flex-col flex-1">
                <div className="mb-4 aspect-video w-full rounded-xl bg-gradient-to-br from-brand-gold/20 to-brand-purple/40 backdrop-blur-sm border border-white/10 flex items-center justify-center">
                  <BookOpen className="h-12 w-12 text-brand-gold/50" />
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="glass-badge">{course.level}</span>
                  <div className="flex items-center gap-1 text-sm text-white/60">
                    <Users className="h-4 w-4" />
                    {course.students}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{course.title}</h3>
                <p className="text-white/60 text-sm mb-4 flex-1">{course.description}</p>

                <div className="mb-4 flex items-center gap-4 text-sm text-white/60">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {course.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    12 lessons
                  </div>
                </div>

                {course.progress > 0 && (
                  <div className="mb-4">
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-white/60">Progress</span>
                      <span className="font-semibold text-brand-gold">{course.progress}%</span>
                    </div>
                    <div className="glass-progress-bg h-2">
                      <div
                        className="glass-progress-fill"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                <Link href={`/courses/${course.id}`}>
                  <Button className="w-full">
                    {course.progress > 0 ? 'Continue Learning' : 'Start Course'}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Discover More */}
        <div className="glass-card text-center">
          <h3 className="text-2xl font-semibold text-white mb-2">Discover More Courses</h3>
          <p className="text-white/60 mb-6">
            Explore additional courses to enhance your vocal skills
          </p>
          <Button variant="outline">Browse Catalog</Button>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
