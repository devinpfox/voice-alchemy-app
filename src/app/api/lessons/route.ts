import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth-helpers'
import { NextRequest, NextResponse } from 'next/server'

// POST /api/lessons - Create a new lesson with optional quiz (admin only)
export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    const { user } = await requireAdmin()

    const supabase = await createClient()

    const body = await request.json()
    const {
      module_id,
      title,
      description,
      video_url,
      duration,
      keywords,
      watch_required,
      order_index,
      quiz
    } = body

    // Validate required fields
    if (!module_id || !title || !video_url || order_index === undefined) {
      return NextResponse.json(
        { error: 'module_id, title, video_url, and order_index are required' },
        { status: 400 }
      )
    }

    // Verify module ownership
    const { data: module } = await supabase
      .from('modules')
      .select('course_id, courses!inner(instructor_id)')
      .eq('id', module_id)
      .single()

    if (!module || (module.courses as any).instructor_id !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Create lesson
    const { data: lesson, error: lessonError } = await supabase
      .from('lessons')
      .insert({
        module_id,
        title,
        description,
        video_url,
        duration,
        keywords: keywords || [],
        watch_required: watch_required !== false,
        order_index
      })
      .select()
      .single()

    if (lessonError) {
      return NextResponse.json(
        { error: lessonError.message },
        { status: 500 }
      )
    }

    // Create quiz if provided
    if (quiz && quiz.questions && quiz.questions.length > 0) {
      const { data: quizData, error: quizError } = await supabase
        .from('quizzes')
        .insert({
          lesson_id: lesson.id,
          title: quiz.title || `${title} Quiz`,
          passing_score: quiz.passing_score || 70
        })
        .select()
        .single()

      if (quizError) {
        // Delete the lesson if quiz creation fails
        await supabase.from('lessons').delete().eq('id', lesson.id)
        return NextResponse.json(
          { error: `Failed to create quiz: ${quizError.message}` },
          { status: 500 }
        )
      }

      // Create quiz questions and options
      for (const [qIndex, question] of quiz.questions.entries()) {
        const { data: questionData, error: questionError } = await supabase
          .from('quiz_questions')
          .insert({
            quiz_id: quizData.id,
            question_text: question.question_text,
            question_type: question.question_type || 'multiple_choice',
            order_index: qIndex,
            points: question.points || 1
          })
          .select()
          .single()

        if (questionError) {
          // Clean up on error
          await supabase.from('lessons').delete().eq('id', lesson.id)
          return NextResponse.json(
            { error: `Failed to create question: ${questionError.message}` },
            { status: 500 }
          )
        }

        // Create options for this question
        if (question.options && question.options.length > 0) {
          const optionsToInsert = question.options.map((opt: any, oIndex: number) => ({
            question_id: questionData.id,
            option_text: opt.option_text,
            is_correct: opt.is_correct || false,
            order_index: oIndex
          }))

          const { error: optionsError } = await supabase
            .from('quiz_question_options')
            .insert(optionsToInsert)

          if (optionsError) {
            // Clean up on error
            await supabase.from('lessons').delete().eq('id', lesson.id)
            return NextResponse.json(
              { error: `Failed to create options: ${optionsError.message}` },
              { status: 500 }
            )
          }
        }
      }
    }

    // Fetch the complete lesson with quiz data
    const { data: completeLesson } = await supabase
      .from('lessons')
      .select(`
        *,
        quizzes (
          *,
          quiz_questions (
            *,
            quiz_question_options (*)
          )
        )
      `)
      .eq('id', lesson.id)
      .single()

    return NextResponse.json(completeLesson, { status: 201 })
  } catch (error) {
    console.error('Error creating lesson:', error)
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

// GET /api/lessons/[lessonId] - Get lesson details
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const lessonId = searchParams.get('id')

    if (!lessonId) {
      return NextResponse.json(
        { error: 'Lesson id is required' },
        { status: 400 }
      )
    }

    const { data: lesson, error } = await supabase
      .from('lessons')
      .select(`
        *,
        modules!inner(
          *,
          courses!inner(*)
        ),
        quizzes (
          *,
          quiz_questions (
            *,
            quiz_question_options (*)
          )
        )
      `)
      .eq('id', lessonId)
      .single()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: error.code === 'PGRST116' ? 404 : 500 }
      )
    }

    return NextResponse.json(lesson)
  } catch (error) {
    console.error('Error fetching lesson:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/lessons - Update a lesson (admin only)
export async function PUT(request: NextRequest) {
  try {
    // Check if user is admin
    const { user } = await requireAdmin()

    const supabase = await createClient()

    const body = await request.json()
    const {
      id,
      title,
      description,
      video_url,
      duration,
      keywords,
      watch_required,
      order_index
    } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Lesson id is required' },
        { status: 400 }
      )
    }

    // Verify ownership
    const { data: lesson } = await supabase
      .from('lessons')
      .select('module_id, modules!inner(course_id, courses!inner(instructor_id))')
      .eq('id', id)
      .single()

    if (!lesson || (lesson.modules as any).courses.instructor_id !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Update lesson
    const { data: updatedLesson, error } = await supabase
      .from('lessons')
      .update({
        title,
        description,
        video_url,
        duration,
        keywords,
        watch_required,
        order_index
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(updatedLesson)
  } catch (error) {
    console.error('Error updating lesson:', error)
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

// DELETE /api/lessons - Delete a lesson (admin only)
export async function DELETE(request: NextRequest) {
  try {
    // Check if user is admin
    const { user } = await requireAdmin()

    const supabase = await createClient()

    const { searchParams } = new URL(request.url)
    const lessonId = searchParams.get('id')

    if (!lessonId) {
      return NextResponse.json(
        { error: 'Lesson id is required' },
        { status: 400 }
      )
    }

    // Verify ownership
    const { data: lesson } = await supabase
      .from('lessons')
      .select('module_id, modules!inner(course_id, courses!inner(instructor_id))')
      .eq('id', lessonId)
      .single()

    if (!lesson || (lesson.modules as any).courses.instructor_id !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Delete lesson
    const { error } = await supabase
      .from('lessons')
      .delete()
      .eq('id', lessonId)

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Lesson deleted successfully' })
  } catch (error) {
    console.error('Error deleting lesson:', error)
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
