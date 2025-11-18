'use client'

import { use } from 'react'
import SessionView from '@/components/SessionView/SessionView'

interface InstructorStudentSessionPageProps {
  params: Promise<{
    studentId: string
  }>
}

export default function InstructorStudentSessionPage({ params }: InstructorStudentSessionPageProps) {
  const { studentId } = use(params)

  return <SessionView studentId={studentId} isAdmin={true} />
}
