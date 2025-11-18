'use client'

import { use } from 'react'
import SessionView from '@/components/SessionView/SessionView'

interface LiveSessionPageProps {
  params: Promise<{
    sessionId: string
  }>
}

export default function LiveSessionPage({ params }: LiveSessionPageProps) {
  // In Next.js 15, params is a Promise
  const { sessionId } = use(params)

  return <SessionView studentId={sessionId} isAdmin={false} />
}
