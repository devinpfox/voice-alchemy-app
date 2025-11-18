import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Video, Calendar, Clock, Users } from 'lucide-react'
import Link from 'next/link'
import { format, addDays } from 'date-fns'

const upcomingSessions = [
  {
    id: 'session-1',
    title: 'Group Vocal Workshop',
    instructor: 'Sarah Johnson',
    scheduledAt: addDays(new Date(), 1),
    duration: 60,
    participants: 12,
    maxParticipants: 15,
    status: 'scheduled' as const,
  },
  {
    id: 'session-2',
    title: '1-on-1 Coaching Session',
    instructor: 'Michael Chen',
    scheduledAt: addDays(new Date(), 3),
    duration: 45,
    participants: 1,
    maxParticipants: 1,
    status: 'scheduled' as const,
  },
  {
    id: 'session-3',
    title: 'Advanced Technique Masterclass',
    instructor: 'Sarah Johnson',
    scheduledAt: addDays(new Date(), 7),
    duration: 90,
    participants: 8,
    maxParticipants: 10,
    status: 'scheduled' as const,
  },
]

const pastSessions = [
  {
    id: 'past-1',
    title: 'Breathing Fundamentals Workshop',
    instructor: 'Emily Davis',
    completedAt: addDays(new Date(), -2),
    duration: 60,
  },
  {
    id: 'past-2',
    title: 'Pitch Training Session',
    instructor: 'Michael Chen',
    completedAt: addDays(new Date(), -5),
    duration: 45,
  },
]

export default function LiveSessionsPage() {
  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Live Sessions</h1>
          <p className="text-muted-foreground">
            Join live classes and workshops with your instructors
          </p>
        </div>

        {/* Upcoming Sessions */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Sessions</CardTitle>
            <CardDescription>Your scheduled live classes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Video className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{session.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        with {session.instructor}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(session.scheduledAt, 'MMM dd, yyyy')}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {format(session.scheduledAt, 'h:mm a')} ({session.duration} min)
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {session.participants}/{session.maxParticipants} participants
                        </div>
                      </div>
                    </div>
                  </div>
                  <Link href={`/live/${session.id}`}>
                    <Button>Join Session</Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Past Sessions */}
        <Card>
          <CardHeader>
            <CardTitle>Past Sessions</CardTitle>
            <CardDescription>Review recordings and notes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pastSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <h3 className="font-medium">{session.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      with {session.instructor} • {format(session.completedAt, 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View Recording
                    </Button>
                    <Button variant="outline" size="sm">
                      View Notes
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  )
}
