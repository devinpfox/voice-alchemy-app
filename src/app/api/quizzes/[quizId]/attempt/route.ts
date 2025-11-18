import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// POST /api/quizzes/[quizId]/attempt - Submit quiz attempt
export async function POST(
  request: NextRequest,
  { params }: { params: { quizId: string } }
) {
  try {
    const supabase = await createClient()
    const { quizId } = params

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { answers } = body // answers format: { [questionId]: selectedOptionId }

    if (!answers) {
      return NextResponse.json(
        { error: 'Answers are required' },
        { status: 400 }
      )
    }

    // Get quiz with questions and correct answers
    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .select(`
        *,
        lesson_id,
        quiz_questions (
          id,
          points,
          quiz_question_options (
            id,
            is_correct
          )
        )
      `)
      .eq('id', quizId)
      .single()

    if (quizError) {
      return NextResponse.json(
        { error: quizError.message },
        { status: 500 }
      )
    }

    // Calculate score
    let totalPoints = 0
    let earnedPoints = 0
    const detailedResults: any = {}

    for (const question of quiz.quiz_questions) {
      totalPoints += question.points
      const studentAnswer = answers[question.id]

      if (studentAnswer) {
        const selectedOption = question.quiz_question_options.find(
          (opt: any) => opt.id === studentAnswer
        )

        if (selectedOption && selectedOption.is_correct) {
          earnedPoints += question.points
          detailedResults[question.id] = { correct: true, points: question.points }
        } else {
          detailedResults[question.id] = { correct: false, points: 0 }
        }
      } else {
        detailedResults[question.id] = { correct: false, points: 0 }
      }
    }

    const scorePercentage = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0
    const passed = scorePercentage >= quiz.passing_score

    // Save quiz attempt
    const { data: attempt, error: attemptError } = await supabase
      .from('student_quiz_attempts')
      .insert({
        student_id: user.id,
        quiz_id: quizId,
        score: scorePercentage,
        passed,
        answers,
        completed_at: new Date().toISOString()
      })
      .select()
      .single()

    if (attemptError) {
      return NextResponse.json(
        { error: attemptError.message },
        { status: 500 }
      )
    }

    // If passed, update lesson progress
    if (passed) {
      // Check if video was already completed
      const { data: progress } = await supabase
        .from('student_lesson_progress')
        .select('video_completed')
        .eq('student_id', user.id)
        .eq('lesson_id', quiz.lesson_id)
        .single()

      const lessonCompleted = progress?.video_completed || false

      // Update progress
      await supabase
        .from('student_lesson_progress')
        .upsert({
          student_id: user.id,
          lesson_id: quiz.lesson_id,
          quiz_passed: true,
          lesson_completed: lessonCompleted, // Only mark complete if video was also completed
          completed_at: lessonCompleted ? new Date().toISOString() : null
        })
    }

    return NextResponse.json({
      attempt,
      score: scorePercentage,
      passed,
      detailedResults,
      passingScore: quiz.passing_score
    })
  } catch (error) {
    console.error('Error submitting quiz attempt:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET /api/quizzes/[quizId]/attempt - Get student's quiz attempts
export async function GET(
  request: NextRequest,
  { params }: { params: { quizId: string } }
) {
  try {
    const supabase = await createClient()
    const { quizId } = params

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get student's attempts for this quiz
    const { data: attempts, error } = await supabase
      .from('student_quiz_attempts')
      .select('*')
      .eq('quiz_id', quizId)
      .eq('student_id', user.id)
      .order('started_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(attempts)
  } catch (error) {
    console.error('Error fetching quiz attempts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
