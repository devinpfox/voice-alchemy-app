'use client'

import { useState } from 'react'
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Play, Volume2, Check, X } from 'lucide-react'

const intervals = [
  { name: 'Minor 2nd', semitones: 1, type: 'minor' },
  { name: 'Major 2nd', semitones: 2, type: 'major' },
  { name: 'Minor 3rd', semitones: 3, type: 'minor' },
  { name: 'Major 3rd', semitones: 4, type: 'major' },
  { name: 'Perfect 4th', semitones: 5, type: 'perfect' },
  { name: 'Perfect 5th', semitones: 7, type: 'perfect' },
  { name: 'Octave', semitones: 12, type: 'perfect' },
]

export default function EarTrainingPage() {
  const [currentInterval, setCurrentInterval] = useState<typeof intervals[0] | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [score, setScore] = useState(0)
  const [totalAttempts, setTotalAttempts] = useState(0)

  const startExercise = () => {
    const randomInterval = intervals[Math.floor(Math.random() * intervals.length)]
    setCurrentInterval(randomInterval)
    setSelectedAnswer(null)
    setIsCorrect(null)
  }

  const playInterval = () => {
    // Play interval using Tone.js
    console.log(`Playing interval: ${currentInterval?.name}`)
  }

  const checkAnswer = (answer: string) => {
    setSelectedAnswer(answer)
    const correct = answer === currentInterval?.name
    setIsCorrect(correct)
    setTotalAttempts(totalAttempts + 1)
    if (correct) {
      setScore(score + 1)
    }
  }

  return (
    <AuthenticatedLayout>
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">Ear Training</h1>
          <p className="text-muted-foreground">
            Develop your ability to identify musical intervals
          </p>
        </div>

        {/* Score Card */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{score}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {totalAttempts > 0 ? Math.round((score / totalAttempts) * 100) : 0}%
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">0</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Training Area */}
        <Card>
          <CardHeader>
            <CardTitle>Identify the Interval</CardTitle>
            <CardDescription>
              Listen to the two notes and select the correct interval
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!currentInterval ? (
              <div className="py-12 text-center">
                <p className="mb-4 text-muted-foreground">
                  Ready to train your ear?
                </p>
                <Button size="lg" onClick={startExercise}>
                  <Play className="mr-2 h-5 w-5" />
                  Start Training
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Play Button */}
                <div className="text-center">
                  <Button size="lg" onClick={playInterval}>
                    <Volume2 className="mr-2 h-5 w-5" />
                    Play Interval
                  </Button>
                </div>

                {/* Answer Options */}
                <div className="grid gap-3 sm:grid-cols-2">
                  {intervals.map((interval) => {
                    const isSelected = selectedAnswer === interval.name
                    const showResult = isSelected && isCorrect !== null

                    return (
                      <Button
                        key={interval.name}
                        variant={isSelected ? 'default' : 'outline'}
                        size="lg"
                        onClick={() => !selectedAnswer && checkAnswer(interval.name)}
                        disabled={selectedAnswer !== null}
                        className={`relative ${
                          showResult
                            ? isCorrect
                              ? 'border-green-600 bg-green-600 hover:bg-green-600'
                              : 'border-red-600 bg-red-600 hover:bg-red-600'
                            : ''
                        }`}
                      >
                        {interval.name}
                        {showResult && (
                          <span className="ml-2">
                            {isCorrect ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <X className="h-4 w-4" />
                            )}
                          </span>
                        )}
                      </Button>
                    )
                  })}
                </div>

                {/* Feedback */}
                {isCorrect !== null && (
                  <div className="text-center">
                    <Badge
                      className={
                        isCorrect
                          ? 'bg-green-600'
                          : 'bg-red-600'
                      }
                    >
                      {isCorrect ? 'Correct!' : `Incorrect - It was ${currentInterval.name}`}
                    </Badge>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={startExercise}
                    >
                      Next Interval
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Interval Reference */}
        <Card>
          <CardHeader>
            <CardTitle>Interval Reference</CardTitle>
            <CardDescription>
              Common songs to help remember intervals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-medium">Minor 2nd (half step)</p>
                <p className="text-muted-foreground">Jaws theme</p>
              </div>
              <div>
                <p className="font-medium">Major 2nd (whole step)</p>
                <p className="text-muted-foreground">Happy Birthday</p>
              </div>
              <div>
                <p className="font-medium">Minor 3rd</p>
                <p className="text-muted-foreground">Greensleeves</p>
              </div>
              <div>
                <p className="font-medium">Major 3rd</p>
                <p className="text-muted-foreground">Kumbaya</p>
              </div>
              <div>
                <p className="font-medium">Perfect 4th</p>
                <p className="text-muted-foreground">Wedding March</p>
              </div>
              <div>
                <p className="font-medium">Perfect 5th</p>
                <p className="text-muted-foreground">Star Wars theme</p>
              </div>
              <div>
                <p className="font-medium">Octave</p>
                <p className="text-muted-foreground">Somewhere Over the Rainbow</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card>
          <CardHeader>
            <CardTitle>Training Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Listen to the interval multiple times before answering</li>
              <li>• Associate intervals with familiar songs</li>
              <li>• Start with perfect intervals (4th, 5th, octave)</li>
              <li>• Practice identifying intervals both ascending and descending</li>
              <li>• Train daily for best results</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  )
}
