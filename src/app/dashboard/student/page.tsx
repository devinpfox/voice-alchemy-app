import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getUser, getUserProfile } from '@/lib/supabase/session'
import { BookOpen, Video, TrendingUp, Clock, Play } from 'lucide-react'
import Link from 'next/link'

export default async function StudentDashboard() {
  const user = await getUser()
  const profile = await getUserProfile()

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {profile?.full_name?.split(' ')[0] || 'Student'}!
          </h1>
          <p className="text-muted-foreground">
            Continue your vocal training journey
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Courses Enrolled
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">
                +1 this month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Lessons Completed
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">
                +5 this week
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Practice Time
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12.5h</div>
              <p className="text-xs text-muted-foreground">
                This month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Upcoming Sessions
              </CardTitle>
              <Video className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">
                Next: Tomorrow
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Continue Learning */}
        <Card>
          <CardHeader>
            <CardTitle>Continue Learning</CardTitle>
            <CardDescription>Pick up where you left off</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Play className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Vocal Fundamentals</p>
                    <p className="text-sm text-muted-foreground">
                      Lesson 5: Breath Control Techniques
                    </p>
                    <div className="mt-1 h-2 w-48 overflow-hidden rounded-full bg-muted">
                      <div className="h-full w-3/4 bg-primary" />
                    </div>
                  </div>
                </div>
                <Link href="/courses/1/lesson/5">
                  <Button>Continue</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Live Sessions */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Live Sessions</CardTitle>
            <CardDescription>Join your scheduled classes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">Group Vocal Workshop</p>
                  <p className="text-sm text-muted-foreground">
                    Tomorrow at 3:00 PM • with Sarah Johnson
                  </p>
                </div>
                <Link href="/live/session-1">
                  <Button variant="outline">Join</Button>
                </Link>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">1-on-1 Coaching</p>
                  <p className="text-sm text-muted-foreground">
                    Friday at 2:00 PM • with Michael Chen
                  </p>
                </div>
                <Link href="/live/session-2">
                  <Button variant="outline">Join</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Access your vocal training tools</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Link href="/tools/tuner">
                <Button variant="outline" className="w-full">
                  Tuner
                </Button>
              </Link>
              <Link href="/tools/pitch-training">
                <Button variant="outline" className="w-full">
                  Pitch Training
                </Button>
              </Link>
              <Link href="/tools/ear-training">
                <Button variant="outline" className="w-full">
                  Ear Training
                </Button>
              </Link>
              <Link href="/tools/metronome">
                <Button variant="outline" className="w-full">
                  Metronome
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  )
}
