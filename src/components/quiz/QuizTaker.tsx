'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, XCircle, Loader2, Trophy, RefreshCw } from 'lucide-react'

interface QuizOption {
  id: string
  option_text: string
  is_correct: boolean
  order_index: number
}

interface QuizQuestion {
  id: string
  question_text: string
  question_type: 'multiple_choice' | 'true_false'
  points: number
  order_index: number
  quiz_question_options: QuizOption[]
}

interface Quiz {
  id: string
  title: string
  passing_score: number
  quiz_questions: QuizQuestion[]
}

interface QuizTakerProps {
  quiz: Quiz
  onComplete: (passed: boolean, score: number) => void
}

export function QuizTaker({ quiz, onComplete }: QuizTakerProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [results, setResults] = useState<{
    score: number
    passed: boolean
    detailedResults: Record<string, { correct: boolean; points: number }>
  } | null>(null)

  const handleSelectAnswer = (questionId: string, optionId: string) => {
    if (submitted) return
    setAnswers({ ...answers, [questionId]: optionId })
  }

  const allQuestionsAnswered = () => {
    return quiz.quiz_questions.every((q) => answers[q.id])
  }

  const handleSubmit = async () => {
    if (!allQuestionsAnswered()) {
      alert('Please answer all questions before submitting')
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch(`/api/quizzes/${quiz.id}/attempt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers })
      })

      if (!response.ok) throw new Error('Failed to submit quiz')

      const data = await response.json()
      setResults({
        score: data.score,
        passed: data.passed,
        detailedResults: data.detailedResults
      })
      setSubmitted(true)
      onComplete(data.passed, data.score)
    } catch (error) {
      console.error('Error submitting quiz:', error)
      alert('Failed to submit quiz. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleRetake = () => {
    setAnswers({})
    setSubmitted(false)
    setResults(null)
  }

  if (submitted && results) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Quiz Results</CardTitle>
            {results.passed ? (
              <Badge className="bg-green-500">
                <Trophy className="mr-1 h-3 w-3" />
                Passed
              </Badge>
            ) : (
              <Badge variant="destructive">Failed</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Score Summary */}
          <div className="rounded-lg bg-muted p-6 text-center">
            <p className="text-sm text-muted-foreground">Your Score</p>
            <p className="text-4xl font-bold">
              {Math.round(results.score)}%
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Passing score: {quiz.passing_score}%
            </p>
          </div>

          {results.passed ? (
            <div className="rounded-lg border-2 border-green-500 bg-green-50 p-4 text-center">
              <p className="font-medium text-green-900">
                Congratulations! You passed the quiz.
              </p>
              <p className="text-sm text-green-700">
                You can now proceed to the next lesson.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg border-2 border-orange-500 bg-orange-50 p-4 text-center">
                <p className="font-medium text-orange-900">
                  You didn't pass this time, but don't give up!
                </p>
                <p className="text-sm text-orange-700">
                  Review the lesson material and try again.
                </p>
              </div>
              <Button onClick={handleRetake} className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                Retake Quiz
              </Button>
            </div>
          )}

          {/* Detailed Results */}
          <div className="space-y-3">
            <h4 className="font-medium">Question Breakdown</h4>
            {quiz.quiz_questions.map((question, idx) => {
              const result = results.detailedResults[question.id]
              const selectedOptionId = answers[question.id]
              const selectedOption = question.quiz_question_options.find(
                (opt) => opt.id === selectedOptionId
              )
              const correctOption = question.quiz_question_options.find(
                (opt) => opt.is_correct
              )

              return (
                <Card key={question.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardDescription>Question {idx + 1}</CardDescription>
                      {result.correct ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <CardTitle className="text-base">{question.question_text}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-medium">Your answer:</span>{' '}
                        <span className={result.correct ? 'text-green-600' : 'text-red-600'}>
                          {selectedOption?.option_text}
                        </span>
                      </p>
                      {!result.correct && (
                        <p>
                          <span className="font-medium">Correct answer:</span>{' '}
                          <span className="text-green-600">
                            {correctOption?.option_text}
                          </span>
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{quiz.title}</CardTitle>
        <CardDescription>
          Answer all questions to complete this lesson. Passing score: {quiz.passing_score}%
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {quiz.quiz_questions.map((question, idx) => (
          <Card key={question.id}>
            <CardHeader>
              <CardDescription>Question {idx + 1}</CardDescription>
              <CardTitle className="text-base">{question.question_text}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {question.quiz_question_options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleSelectAnswer(question.id, option.id)}
                    className={`w-full rounded-lg border-2 p-4 text-left transition-colors ${
                      answers[question.id] === option.id
                        ? 'border-primary bg-primary/5'
                        : 'border-muted hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-5 w-5 rounded-full border-2 ${
                          answers[question.id] === option.id
                            ? 'border-primary bg-primary'
                            : 'border-muted-foreground'
                        }`}
                      >
                        {answers[question.id] === option.id && (
                          <div className="flex h-full w-full items-center justify-center">
                            <div className="h-2 w-2 rounded-full bg-white" />
                          </div>
                        )}
                      </div>
                      <span>{option.option_text}</span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        <Button
          onClick={handleSubmit}
          disabled={!allQuestionsAnswered() || submitting}
          className="w-full"
          size="lg"
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Quiz'
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
