import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth-helpers'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/courses/[courseId] - Get course by ID with modules and lessons
export async function GET(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const supabase = await createClient()
    const { courseId } = params

    // Get course with nested modules and lessons
    const { data: course, error } = await supabase
      .from('courses')
      .select(`
        *,
        profiles!courses_instructor_id_fkey(id, full_name, avatar_url),
        modules (
          *,
          lessons (
            *,
            quizzes (
              id,
              title,
              passing_score
            )
          )
        )
      `)
      .eq('id', courseId)
      .single()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: error.code === 'PGRST116' ? 404 : 500 }
      )
    }

    // Sort modules and lessons by order_index
    if (course.modules) {
      course.modules.sort((a: any, b: any) => a.order_index - b.order_index)
      course.modules.forEach((module: any) => {
        if (module.lessons) {
          module.lessons.sort((a: any, b: any) => a.order_index - b.order_index)
        }
      })
    }

    return NextResponse.json(course)
  } catch (error) {
    console.error('Error fetching course:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/courses/[courseId] - Update course (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    // Check if user is admin
    const { user } = await requireAdmin()

    const supabase = await createClient()
    const { courseId } = params

    // Verify ownership
    const { data: existingCourse } = await supabase
      .from('courses')
      .select('instructor_id')
      .eq('id', courseId)
      .single()

    if (!existingCourse || existingCourse.instructor_id !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden - You can only edit your own courses' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { title, description, level, thumbnail_url, is_published } = body

    // Update course
    const { data: course, error } = await supabase
      .from('courses')
      .update({
        title,
        description,
        level,
        thumbnail_url,
        is_published,
        updated_at: new Date().toISOString()
      })
      .eq('id', courseId)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(course)
  } catch (error) {
    console.error('Error updating course:', error)
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

// DELETE /api/courses/[courseId] - Delete course (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    // Check if user is admin
    const { user } = await requireAdmin()

    const supabase = await createClient()
    const { courseId } = params

    // Verify ownership
    const { data: existingCourse } = await supabase
      .from('courses')
      .select('instructor_id')
      .eq('id', courseId)
      .single()

    if (!existingCourse || existingCourse.instructor_id !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden - You can only delete your own courses' },
        { status: 403 }
      )
    }

    // Delete course (cascades to modules, lessons, etc.)
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', courseId)

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Course deleted successfully' })
  } catch (error) {
    console.error('Error deleting course:', error)
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
