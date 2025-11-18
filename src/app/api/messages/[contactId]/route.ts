import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

function conversationFilter(currentUserId: string, contactId: string) {
  return `and(sender_id.eq.${currentUserId},recipient_id.eq.${contactId}),and(sender_id.eq.${contactId},recipient_id.eq.${currentUserId})`
}

export async function GET(request: NextRequest, { params }: { params: { contactId: string } }) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const contactId = params.contactId
    if (!contactId) {
      return NextResponse.json({ error: 'Contact id is required' }, { status: 400 })
    }

    const { searchParams } = new URL(request.url)
    const requestedLimit = Number(searchParams.get('limit') ?? '200')
    const limit = Number.isFinite(requestedLimit) ? Math.min(Math.max(requestedLimit, 1), 500) : 200

    const { data, error } = await supabase
      .from('messages')
      .select('id, sender_id, recipient_id, content, created_at')
      .or(conversationFilter(user.id, contactId))
      .order('created_at', { ascending: true })
      .limit(limit)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ messages: data ?? [] })
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { contactId: string } }) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const contactId = params.contactId
    if (!contactId || contactId === user.id) {
      return NextResponse.json({ error: 'Invalid contact id' }, { status: 400 })
    }

    const body = await request.json().catch(() => null)
    const content = typeof body?.content === 'string' ? body.content.trim() : ''

    if (!content) {
      return NextResponse.json({ error: 'Message content is required' }, { status: 400 })
    }

    const { data: contact, error: contactError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', contactId)
      .single()

    if (contactError || !contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 })
    }

    const { data, error } = await supabase
      .from('messages')
      .insert({
        sender_id: user.id,
        recipient_id: contactId,
        content,
      })
      .select('id, sender_id, recipient_id, content, created_at')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: data })
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
