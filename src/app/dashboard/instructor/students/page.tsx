'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

type Student = { id: string; name: string | null }

export default function InstructorStudentsPage() {
  const [students, setStudents] = useState<Student[] | null>(null)

  useEffect(() => {
    (async () => {
      // 1) Must be logged in
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }

      // 2) Check role for THIS user
      const { data: me, error: meErr } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle()

      if (meErr || (me?.role !== 'admin' && me?.role !== 'instructor')) {
        // not an admin or instructor
        window.location.href = '/'
        return
      }

      // 3) Load students (admin/instructor can read all via RLS)
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name')
        .eq('role', 'student')
        .order('name', { ascending: true })

      if (error) { console.error(error); window.location.href = '/'; return }
      setStudents(data ?? [])
    })()
  }, [])

  if (!students) return <main className="p-8">Loading…</main>

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-white">My Students</h1>
      <ul className="space-y-2">
        {students.map(s => (
          <li key={s.id} className="border border-[#d0bf86] bg-[#322c4e] p-4 rounded flex items-center justify-between">
            <span className="text-white font-medium">{s.name || '(no name)'}</span>
            <Link className="px-4 py-2 rounded bg-[#d0bf86] text-[#322c4e] font-semibold hover:opacity-90 transition-opacity" href={`/dashboard/instructor/students/${s.id}`}>
              Open session
            </Link>
          </li>
        ))}
        {students.length === 0 && (
          <li className="text-sm text-gray-400 p-4">No students yet.</li>
        )}
      </ul>
    </main>
  )
}
