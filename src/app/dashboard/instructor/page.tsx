import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getUser, getUserProfile } from '@/lib/supabase/session'
import { BookOpen, Users, Video, Calendar, Plus } from 'lucide-react'
import Link from 'next/link'

export default async function InstructorDashboard() {
  const user = await getUser()
  const profile = await getUserProfile()

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Instructor Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your courses and students
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/dashboard/instructor/students">
              <Button variant="outline">
                <Users className="mr-2 h-4 w-4" />
                My Students
              </Button>
            </Link>
            <Link href="/courses/create">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Course
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Courses
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">
                +2 this quarter
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Students
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">127</div>
              <p className="text-xs text-muted-foreground">
                +18 this month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Live Sessions
              </CardTitle>
              <Video className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">
                This week
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Reviews
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">
                Homework submissions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Sessions */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Live Sessions</CardTitle>
            <CardDescription>Your scheduled teaching sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">Beginner Vocal Workshop</p>
                  <p className="text-sm text-muted-foreground">
                    Today at 2:00 PM • 12 students enrolled
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link href="/live/session-1">
                    <Button variant="outline">Manage</Button>
                  </Link>
                  <Link href="/live/session-1">
                    <Button>Start</Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">Advanced Technique Class</p>
                  <p className="text-sm text-muted-foreground">
                    Tomorrow at 4:00 PM • 8 students enrolled
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link href="/live/session-2">
                    <Button variant="outline">Manage</Button>
                  </Link>
                  <Link href="/live/session-2">
                    <Button disabled>Start</Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Homework Submissions</CardTitle>
              <CardDescription>Review student work</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">Emily Davis</p>
                    <p className="text-xs text-muted-foreground">
                      Breathing Exercise Recording
                    </p>
                  </div>
                  <Button size="sm" variant="outline">Review</Button>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">Alex Thompson</p>
                    <p className="text-xs text-muted-foreground">
                      Scale Practice Video
                    </p>
                  </div>
                  <Button size="sm" variant="outline">Review</Button>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">Sarah Kim</p>
                    <p className="text-xs text-muted-foreground">
                      Vocal Warm-up Recording
                    </p>
                  </div>
                  <Button size="sm" variant="outline">Review</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Courses</CardTitle>
              <CardDescription>Manage course content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">Vocal Fundamentals</p>
                    <p className="text-xs text-muted-foreground">
                      45 students • 12 lessons
                    </p>
                  </div>
                  <Button size="sm" variant="outline">Edit</Button>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">Advanced Techniques</p>
                    <p className="text-xs text-muted-foreground">
                      23 students • 8 lessons
                    </p>
                  </div>
                  <Button size="sm" variant="outline">Edit</Button>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">Performance Mastery</p>
                    <p className="text-xs text-muted-foreground">
                      31 students • 10 lessons
                    </p>
                  </div>
                  <Button size="sm" variant="outline">Edit</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
