import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth-helpers'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/courses - Get all published courses (or admin's courses)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const instructorId = searchParams.get('instructorId')
    const includeUnpublished = searchParams.get('includeUnpublished') === 'true'

    const { data: { user } } = await supabase.auth.getUser()

    let query = supabase
      .from('courses')
      .select('*, profiles!courses_instructor_id_fkey(id, full_name, avatar_url)')
      .order('created_at', { ascending: false })

    // Filter by instructor if specified
    if (instructorId) {
      query = query.eq('instructor_id', instructorId)
    }

    // Include unpublished courses only if requesting own courses
    if (!includeUnpublished || !user || (instructorId && instructorId !== user.id)) {
      query = query.eq('is_published', true)
    }

    const { data: courses, error } = await query

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(courses)
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/courses - Create a new course (admin only)
export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    const { user } = await requireAdmin()

    const supabase = await createClient()
    const body = await request.json()
    const { title, description, level, thumbnail_url } = body

    // Validate required fields
    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    // Create course
    const { data: course, error } = await supabase
      .from('courses')
      .insert({
        title,
        description,
        level: level || 'beginner',
        thumbnail_url,
        instructor_id: user.id,
        is_published: false
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(course, { status: 201 })
  } catch (error) {
    console.error('Error creating course:', error)
    if (error instanceof Error && (error.message === 'Unauthorized' || error.message === 'Admin access required')) {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
