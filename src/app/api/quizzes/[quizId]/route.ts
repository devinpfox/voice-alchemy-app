import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/quizzes/[quizId] - Get quiz with questions and options
export async function GET(
  request: NextRequest,
  { params }: { params: { quizId: string } }
) {
  try {
    const supabase = await createClient()
    const { quizId } = params

    const { data: quiz, error } = await supabase
      .from('quizzes')
      .select(`
        *,
        quiz_questions (
          *,
          quiz_question_options (*)
        )
      `)
      .eq('id', quizId)
      .single()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: error.code === 'PGRST116' ? 404 : 500 }
      )
    }

    // Sort questions and options by order_index
    if (quiz.quiz_questions) {
      quiz.quiz_questions.sort((a: any, b: any) => a.order_index - b.order_index)
      quiz.quiz_questions.forEach((question: any) => {
        if (question.quiz_question_options) {
          question.quiz_question_options.sort((a: any, b: any) => a.order_index - b.order_index)
        }
      })
    }

    return NextResponse.json(quiz)
  } catch (error) {
    console.error('Error fetching quiz:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
