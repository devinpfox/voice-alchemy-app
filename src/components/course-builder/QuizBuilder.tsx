'use client'

import { useState } from 'react'
import { Plus, Trash2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface QuizOption {
  option_text: string
  is_correct: boolean
}

interface QuizQuestion {
  question_text: string
  question_type: 'multiple_choice' | 'true_false'
  points: number
  options: QuizOption[]
}

interface Quiz {
  title: string
  passing_score: number
  questions: QuizQuestion[]
}

interface QuizBuilderProps {
  quiz: Quiz | null
  onChange: (quiz: Quiz | null) => void
}

export function QuizBuilder({ quiz, onChange }: QuizBuilderProps) {
  const [isEnabled, setIsEnabled] = useState(!!quiz)

  const handleEnableToggle = () => {
    if (isEnabled) {
      setIsEnabled(false)
      onChange(null)
    } else {
      setIsEnabled(true)
      onChange({
        title: '',
        passing_score: 70,
        questions: []
      })
    }
  }

  const updateQuiz = (updates: Partial<Quiz>) => {
    if (!quiz) return
    onChange({ ...quiz, ...updates })
  }

  const addQuestion = () => {
    if (!quiz) return
    const newQuestion: QuizQuestion = {
      question_text: '',
      question_type: 'multiple_choice',
      points: 1,
      options: [
        { option_text: '', is_correct: false },
        { option_text: '', is_correct: false }
      ]
    }
    onChange({ ...quiz, questions: [...quiz.questions, newQuestion] })
  }

  const updateQuestion = (index: number, updates: Partial<QuizQuestion>) => {
    if (!quiz) return
    const updatedQuestions = quiz.questions.map((q, i) =>
      i === index ? { ...q, ...updates } : q
    )
    onChange({ ...quiz, questions: updatedQuestions })
  }

  const removeQuestion = (index: number) => {
    if (!quiz) return
    onChange({
      ...quiz,
      questions: quiz.questions.filter((_, i) => i !== index)
    })
  }

  const addOption = (questionIndex: number) => {
    if (!quiz) return
    const updatedQuestions = quiz.questions.map((q, i) => {
      if (i === questionIndex) {
        return {
          ...q,
          options: [...q.options, { option_text: '', is_correct: false }]
        }
      }
      return q
    })
    onChange({ ...quiz, questions: updatedQuestions })
  }

  const updateOption = (questionIndex: number, optionIndex: number, updates: Partial<QuizOption>) => {
    if (!quiz) return
    const updatedQuestions = quiz.questions.map((q, qIdx) => {
      if (qIdx === questionIndex) {
        const updatedOptions = q.options.map((opt, oIdx) => {
          if (oIdx === optionIndex) {
            // If marking this option as correct, unmark others (for single-answer questions)
            if (updates.is_correct) {
              return { ...opt, ...updates }
            }
            return { ...opt, ...updates }
          }
          // Unmark other options if this one is being marked correct
          if (updates.is_correct) {
            return { ...opt, is_correct: false }
          }
          return opt
        })
        return { ...q, options: updatedOptions }
      }
      return q
    })
    onChange({ ...quiz, questions: updatedQuestions })
  }

  const removeOption = (questionIndex: number, optionIndex: number) => {
    if (!quiz) return
    const updatedQuestions = quiz.questions.map((q, qIdx) => {
      if (qIdx === questionIndex) {
        return {
          ...q,
          options: q.options.filter((_, oIdx) => oIdx !== optionIndex)
        }
      }
      return q
    })
    onChange({ ...quiz, questions: updatedQuestions })
  }

  if (!isEnabled) {
    return (
      <div className="rounded-lg border-2 border-dashed p-6 text-center">
        <p className="mb-4 text-sm text-muted-foreground">
          Add a quiz to test student comprehension after watching the video
        </p>
        <Button onClick={handleEnableToggle} variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Add Quiz
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Quiz Configuration</h3>
        <Button onClick={handleEnableToggle} variant="ghost" size="sm">
          Remove Quiz
        </Button>
      </div>

      <div className="grid gap-4">
        <div>
          <Label htmlFor="quiz-title">Quiz Title</Label>
          <Input
            id="quiz-title"
            value={quiz?.title || ''}
            onChange={(e) => updateQuiz({ title: e.target.value })}
            placeholder="e.g., Lesson 1 Quiz"
          />
        </div>

        <div>
          <Label htmlFor="passing-score">Passing Score (%)</Label>
          <Input
            id="passing-score"
            type="number"
            min="0"
            max="100"
            value={quiz?.passing_score || 70}
            onChange={(e) => updateQuiz({ passing_score: parseInt(e.target.value) || 70 })}
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Students must score this percentage or higher to pass
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Questions</h4>
          <Button onClick={addQuestion} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Question
          </Button>
        </div>

        {quiz?.questions.map((question, qIdx) => (
          <Card key={qIdx}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-base">Question {qIdx + 1}</CardTitle>
                <Button
                  onClick={() => removeQuestion(qIdx)}
                  variant="ghost"
                  size="sm"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Question Text</Label>
                <Textarea
                  value={question.question_text}
                  onChange={(e) =>
                    updateQuestion(qIdx, { question_text: e.target.value })
                  }
                  placeholder="Enter your question here..."
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Question Type</Label>
                  <select
                    value={question.question_type}
                    onChange={(e) =>
                      updateQuestion(qIdx, {
                        question_type: e.target.value as 'multiple_choice' | 'true_false'
                      })
                    }
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="multiple_choice">Multiple Choice</option>
                    <option value="true_false">True/False</option>
                  </select>
                </div>

                <div>
                  <Label>Points</Label>
                  <Input
                    type="number"
                    min="1"
                    value={question.points}
                    onChange={(e) =>
                      updateQuestion(qIdx, { points: parseInt(e.target.value) || 1 })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Answer Options</Label>
                  {question.question_type === 'multiple_choice' && (
                    <Button
                      onClick={() => addOption(qIdx)}
                      variant="outline"
                      size="sm"
                    >
                      <Plus className="mr-2 h-3 w-3" />
                      Add Option
                    </Button>
                  )}
                </div>

                {question.options.map((option, oIdx) => (
                  <div key={oIdx} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        updateOption(qIdx, oIdx, { is_correct: !option.is_correct })
                      }
                      className={`flex h-9 w-9 items-center justify-center rounded-md border-2 transition-colors ${
                        option.is_correct
                          ? 'border-green-500 bg-green-50 text-green-600'
                          : 'border-muted bg-background hover:border-primary/50'
                      }`}
                    >
                      {option.is_correct && <Check className="h-4 w-4" />}
                    </button>

                    <Input
                      value={option.option_text}
                      onChange={(e) =>
                        updateOption(qIdx, oIdx, { option_text: e.target.value })
                      }
                      placeholder={`Option ${oIdx + 1}`}
                      className="flex-1"
                    />

                    {question.options.length > 2 && (
                      <Button
                        onClick={() => removeOption(qIdx, oIdx)}
                        variant="ghost"
                        size="sm"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}

                <p className="text-xs text-muted-foreground">
                  Click the checkbox to mark the correct answer
                </p>
              </div>
            </CardContent>
          </Card>
        ))}

        {quiz?.questions.length === 0 && (
          <div className="rounded-lg border-2 border-dashed p-6 text-center text-sm text-muted-foreground">
            No questions added yet. Click "Add Question" to get started.
          </div>
        )}
      </div>
    </div>
  )
}
