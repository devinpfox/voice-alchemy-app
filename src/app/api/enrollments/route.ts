import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/enrollments - Get student's enrolled courses
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId')

    if (courseId) {
      // Check if student is enrolled in specific course
      const { data: enrollment, error } = await supabase
        .from('course_enrollments')
        .select('*')
        .eq('student_id', user.id)
        .eq('course_id', courseId)
        .single()

      if (error && error.code !== 'PGRST116') {
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        )
      }

      return NextResponse.json({ enrolled: !!enrollment, enrollment })
    } else {
      // Get all enrolled courses
      const { data: enrollments, error } = await supabase
        .from('course_enrollments')
        .select(`
          *,
          courses (
            *,
            profiles!courses_instructor_id_fkey(id, full_name, avatar_url)
          )
        `)
        .eq('student_id', user.id)
        .order('enrolled_at', { ascending: false })

      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        )
      }

      return NextResponse.json(enrollments)
    }
  } catch (error) {
    console.error('Error fetching enrollments:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/enrollments - Enroll in a course
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { course_id } = body

    if (!course_id) {
      return NextResponse.json(
        { error: 'course_id is required' },
        { status: 400 }
      )
    }

    // Verify course exists and is published
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id, is_published')
      .eq('id', course_id)
      .single()

    if (courseError) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    if (!course.is_published) {
      return NextResponse.json(
        { error: 'Course is not published' },
        { status: 400 }
      )
    }

    // Check if already enrolled
    const { data: existingEnrollment } = await supabase
      .from('course_enrollments')
      .select('id')
      .eq('student_id', user.id)
      .eq('course_id', course_id)
      .single()

    if (existingEnrollment) {
      return NextResponse.json(
        { message: 'Already enrolled', enrollment: existingEnrollment },
        { status: 200 }
      )
    }

    // Create enrollment
    const { data: enrollment, error } = await supabase
      .from('course_enrollments')
      .insert({
        student_id: user.id,
        course_id
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(enrollment, { status: 201 })
  } catch (error) {
    console.error('Error creating enrollment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/enrollments - Unenroll from a course
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId')

    if (!courseId) {
      return NextResponse.json(
        { error: 'courseId is required' },
        { status: 400 }
      )
    }

    // Delete enrollment
    const { error } = await supabase
      .from('course_enrollments')
      .delete()
      .eq('student_id', user.id)
      .eq('course_id', courseId)

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Unenrolled successfully' })
  } catch (error) {
    console.error('Error deleting enrollment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
