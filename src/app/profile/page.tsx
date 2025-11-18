import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getUser, getUserProfile } from '@/lib/supabase/session'
import { Mail, Calendar, Award, BookOpen, Clock } from 'lucide-react'
import { format } from 'date-fns'

export default async function ProfilePage() {
  const user = await getUser()
  const profile = await getUserProfile()

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="text-2xl">
                  {profile?.full_name
                    ?.split(' ')
                    .map((n: string) => n[0])
                    .join('') || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-3xl font-bold">{profile?.full_name || 'User'}</h1>
                <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <Badge variant="secondary">
                    {profile?.role === 'instructor' ? 'Instructor' : 'Student'}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    {user?.email}
                  </div>
                  {user?.created_at && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      Joined {format(new Date(user.created_at), 'MMM yyyy')}
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <Button>Edit Profile</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-3">
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
                24 lessons completed
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
              <div className="text-2xl font-bold">42.5h</div>
              <p className="text-xs text-muted-foreground">
                Total practice time
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Achievements
              </CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7</div>
              <p className="text-xs text-muted-foreground">
                Badges earned
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest achievements and progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                  <Award className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Completed Breathing Techniques Module</p>
                  <p className="text-sm text-muted-foreground">2 days ago</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Started Advanced Vocal Techniques</p>
                  <p className="text-sm text-muted-foreground">5 days ago</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                  <Award className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Earned "Pitch Perfect" Badge</p>
                  <p className="text-sm text-muted-foreground">1 week ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
            <CardDescription>Your earned badges and milestones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { name: 'First Lesson', icon: '🎓', earned: true },
                { name: 'Week Streak', icon: '🔥', earned: true },
                { name: 'Pitch Perfect', icon: '🎵', earned: true },
                { name: 'Practice Master', icon: '⏰', earned: false },
              ].map((badge) => (
                <div
                  key={badge.name}
                  className={`flex flex-col items-center rounded-lg border p-4 ${
                    badge.earned ? 'bg-background' : 'bg-muted/50 opacity-50'
                  }`}
                >
                  <div className="mb-2 text-4xl">{badge.icon}</div>
                  <p className="text-center text-sm font-medium">{badge.name}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  )
}
