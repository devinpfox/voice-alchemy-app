'use client'

import { useState } from 'react'
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Play, Mic, RotateCcw, Volume2 } from 'lucide-react'

const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

export default function PitchTrainingPage() {
  const [targetNote, setTargetNote] = useState<string | null>(null)
  const [isListening, setIsListening] = useState(false)
  const [score, setScore] = useState(0)
  const [attempts, setAttempts] = useState(0)

  const startExercise = () => {
    // Generate random note
    const randomNote = notes[Math.floor(Math.random() * notes.length)]
    setTargetNote(randomNote)
    setIsListening(false)
  }

  const playTargetNote = () => {
    // Play note using Tone.js
    console.log(`Playing note: ${targetNote}`)
  }

  const startListening = () => {
    setIsListening(true)
    setAttempts(attempts + 1)
    // Start pitch detection
    // Simulate success after 2 seconds
    setTimeout(() => {
      setIsListening(false)
      setScore(score + 1)
    }, 2000)
  }

  return (
    <AuthenticatedLayout>
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">Pitch Training</h1>
          <p className="text-muted-foreground">
            Match the target pitch to improve your accuracy
          </p>
        </div>

        {/* Score Card */}
        <div className="grid gap-4 sm:grid-cols-2">
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
                {attempts > 0 ? Math.round((score / attempts) * 100) : 0}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Training Area */}
        <Card>
          <CardHeader>
            <CardTitle>Match the Pitch</CardTitle>
            <CardDescription>
              Listen to the target note and try to match it with your voice
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!targetNote ? (
              <div className="py-12 text-center">
                <p className="mb-4 text-muted-foreground">
                  Click below to start your practice session
                </p>
                <Button size="lg" onClick={startExercise}>
                  <Play className="mr-2 h-5 w-5" />
                  Start Exercise
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Target Note Display */}
                <div className="rounded-lg bg-gradient-to-br from-purple-50 to-blue-50 p-8 text-center">
                  <p className="mb-2 text-sm text-muted-foreground">
                    Target Note
                  </p>
                  <div className="mb-4 text-7xl font-bold">{targetNote}</div>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={playTargetNote}
                  >
                    <Volume2 className="mr-2 h-5 w-5" />
                    Play Target Note
                  </Button>
                </div>

                {/* Control Buttons */}
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    size="lg"
                    className="flex-1"
                    onClick={startListening}
                    disabled={isListening}
                  >
                    <Mic className="mr-2 h-5 w-5" />
                    {isListening ? 'Listening...' : 'Match This Note'}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={startExercise}
                  >
                    <RotateCcw className="mr-2 h-5 w-5" />
                    Next
                  </Button>
                </div>

                {/* Feedback */}
                {isListening && (
                  <div className="text-center">
                    <Badge className="animate-pulse">Listening...</Badge>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Visual Keyboard */}
        <Card>
          <CardHeader>
            <CardTitle>Keyboard Reference</CardTitle>
            <CardDescription>Visual guide for note positions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-1 overflow-x-auto pb-4">
              {notes.map((note) => (
                <div
                  key={note}
                  className={`flex h-24 w-12 flex-shrink-0 items-end justify-center rounded-lg border-2 ${
                    note === targetNote
                      ? 'border-primary bg-primary/10'
                      : note.includes('#')
                      ? 'border-foreground/20 bg-foreground/90 text-background'
                      : 'border-foreground/20 bg-background'
                  }`}
                >
                  <span className="mb-2 text-xs font-medium">{note}</span>
                </div>
              ))}
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
              <li>• Listen to the target note multiple times before matching</li>
              <li>• Start with notes in your comfortable range</li>
              <li>• Hold your matched note steady for best accuracy</li>
              <li>• Practice daily for consistent improvement</li>
              <li>• Use a quiet environment for best results</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  )
}
