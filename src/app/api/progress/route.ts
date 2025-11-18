import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/progress - Get student progress for a lesson or course
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
    const lessonId = searchParams.get('lessonId')
    const courseId = searchParams.get('courseId')

    if (lessonId) {
      // Get progress for a specific lesson
      const { data: progress, error } = await supabase
        .from('student_lesson_progress')
        .select('*')
        .eq('student_id', user.id)
        .eq('lesson_id', lessonId)
        .single()

      if (error && error.code !== 'PGRST116') {
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        )
      }

      return NextResponse.json(progress || null)
    } else if (courseId) {
      // Get progress for all lessons in a course
      const { data: progress, error } = await supabase
        .from('student_lesson_progress')
        .select(`
          *,
          lessons!inner(
            id,
            title,
            modules!inner(
              course_id
            )
          )
        `)
        .eq('student_id', user.id)
        .eq('lessons.modules.course_id', courseId)

      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        )
      }

      return NextResponse.json(progress || [])
    } else {
      return NextResponse.json(
        { error: 'lessonId or courseId is required' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error fetching progress:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/progress - Update video progress
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
    const { lesson_id, video_progress } = body

    if (!lesson_id || video_progress === undefined) {
      return NextResponse.json(
        { error: 'lesson_id and video_progress are required' },
        { status: 400 }
      )
    }

    // Determine if video is completed (95% or more watched)
    const videoCompleted = video_progress >= 95

    // Get existing progress to check quiz status
    const { data: existingProgress } = await supabase
      .from('student_lesson_progress')
      .select('quiz_passed')
      .eq('student_id', user.id)
      .eq('lesson_id', lesson_id)
      .single()

    const quizPassed = existingProgress?.quiz_passed || false
    const lessonCompleted = videoCompleted && quizPassed

    // Upsert progress
    const { data: progress, error } = await supabase
      .from('student_lesson_progress')
      .upsert({
        student_id: user.id,
        lesson_id,
        video_progress,
        video_completed: videoCompleted,
        lesson_completed: lessonCompleted,
        last_watched_at: new Date().toISOString(),
        completed_at: lessonCompleted ? new Date().toISOString() : null
      }, {
        onConflict: 'student_id,lesson_id'
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(progress)
  } catch (error) {
    console.error('Error updating progress:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
