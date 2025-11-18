import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

type ContactRecord = {
  id: string
  full_name: string | null
  avatar_url: string | null
  role: string | null
}

type ProfileRow = {
  id: string
  name?: string | null
  display_name?: string | null
  first_name?: string | null
  last_name?: string | null
  role: string | null
}

function formatProfile(row: ProfileRow): ContactRecord {
  const parts = [row.first_name, row.last_name].filter(Boolean)
  const fullName = row.display_name || (parts.length ? parts.join(' ') : row.name) || null

  return {
    id: row.id,
    full_name: fullName,
    avatar_url: null,
    role: row.role,
  }
}

async function attachLastMessage(
  supabase: ReturnType<typeof createClient>,
  currentUserId: string,
  contact: ContactRecord
) {
  const { data: lastMessage } = await supabase
    .from('messages')
    .select('id, sender_id, recipient_id, content, created_at')
    .or(
      `and(sender_id.eq.${currentUserId},recipient_id.eq.${contact.id}),and(sender_id.eq.${contact.id},recipient_id.eq.${currentUserId})`
    )
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  return {
    ...contact,
    last_message: lastMessage?.content ?? null,
    last_message_at: lastMessage?.created_at ?? null,
    last_message_sender_id: lastMessage?.sender_id ?? null,
  }
}

async function fetchContactsByRole(
  supabase: ReturnType<typeof createClient>,
  role: 'admin' | 'student',
  currentUserId: string
) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, display_name, first_name, last_name, role')
    .eq('role', role)
    .neq('id', currentUserId)
    .order('name', { ascending: true })

  if (error) throw error

  const contacts = (data ?? []).map(formatProfile)
  return Promise.all(contacts.map((contact) => attachLastMessage(supabase, currentUserId, contact)))
}

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profileRow } = await supabase
      .from('profiles')
      .select('id, name, display_name, first_name, last_name, role')
      .eq('id', user.id)
      .single()

    const [teachers, classmates] = await Promise.all([
      fetchContactsByRole(supabase, 'admin', user.id),
      fetchContactsByRole(supabase, 'student', user.id),
    ])

    return NextResponse.json({
      user: profileRow
        ? formatProfile(profileRow)
        : { id: user.id, full_name: user.email, avatar_url: null, role: null },
      teachers,
      classmates,
    })
  } catch (error) {
    console.error('Error fetching contacts:', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
