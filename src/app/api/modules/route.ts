import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth-helpers'
import { NextRequest, NextResponse } from 'next/server'

// POST /api/modules - Create a new module (admin only)
export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    const { user } = await requireAdmin()

    const supabase = await createClient()

    const body = await request.json()
    const { course_id, title, description, order_index } = body

    // Validate required fields
    if (!course_id || !title || order_index === undefined) {
      return NextResponse.json(
        { error: 'course_id, title, and order_index are required' },
        { status: 400 }
      )
    }

    // Verify course ownership
    const { data: course } = await supabase
      .from('courses')
      .select('instructor_id')
      .eq('id', course_id)
      .single()

    if (!course || course.instructor_id !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Create module
    const { data: module, error } = await supabase
      .from('modules')
      .insert({
        course_id,
        title,
        description,
        order_index
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(module, { status: 201 })
  } catch (error) {
    console.error('Error creating module:', error)
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

// PUT /api/modules - Update a module (admin only)
export async function PUT(request: NextRequest) {
  try {
    // Check if user is admin
    const { user } = await requireAdmin()

    const supabase = await createClient()

    const body = await request.json()
    const { id, title, description, order_index } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Module id is required' },
        { status: 400 }
      )
    }

    // Verify ownership
    const { data: module } = await supabase
      .from('modules')
      .select('course_id, courses!inner(instructor_id)')
      .eq('id', id)
      .single()

    if (!module || (module.courses as any).instructor_id !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Update module
    const { data: updatedModule, error } = await supabase
      .from('modules')
      .update({ title, description, order_index })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(updatedModule)
  } catch (error) {
    console.error('Error updating module:', error)
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

// DELETE /api/modules - Delete a module (admin only)
export async function DELETE(request: NextRequest) {
  try {
    // Check if user is admin
    const { user } = await requireAdmin()

    const supabase = await createClient()

    const { searchParams } = new URL(request.url)
    const moduleId = searchParams.get('id')

    if (!moduleId) {
      return NextResponse.json(
        { error: 'Module id is required' },
        { status: 400 }
      )
    }

    // Verify ownership
    const { data: module } = await supabase
      .from('modules')
      .select('course_id, courses!inner(instructor_id)')
      .eq('id', moduleId)
      .single()

    if (!module || (module.courses as any).instructor_id !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Delete module
    const { error } = await supabase
      .from('modules')
      .delete()
      .eq('id', moduleId)

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Module deleted successfully' })
  } catch (error) {
    console.error('Error deleting module:', error)
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
