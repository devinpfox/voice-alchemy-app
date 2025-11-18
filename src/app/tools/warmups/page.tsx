'use client'

import { useState } from 'react'
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Play, Pause, SkipForward, RotateCcw, Clock } from 'lucide-react'

const warmupSequences = [
  {
    id: '1',
    name: 'Quick Warmup',
    duration: 5,
    exercises: [
      'Lip trills - 30 seconds',
      'Tongue trills - 30 seconds',
      'Sirens - 1 minute',
      'Humming scales - 2 minutes',
      'Vowel slides - 1 minute',
    ],
  },
  {
    id: '2',
    name: 'Standard Warmup',
    duration: 10,
    exercises: [
      'Breathing exercises - 2 minutes',
      'Lip trills - 1 minute',
      'Tongue trills - 1 minute',
      'Sirens - 2 minutes',
      'Scale exercises - 3 minutes',
      'Vowel modifications - 1 minute',
    ],
  },
  {
    id: '3',
    name: 'Comprehensive Warmup',
    duration: 15,
    exercises: [
      'Breathing fundamentals - 3 minutes',
      'Physical stretches - 2 minutes',
      'Lip trills - 2 minutes',
      'Tongue trills - 2 minutes',
      'Sirens and glides - 2 minutes',
      'Scale patterns - 3 minutes',
      'Articulation exercises - 1 minute',
    ],
  },
]

export default function WarmupsPage() {
  const [selectedSequence, setSelectedSequence] = useState<typeof warmupSequences[0] | null>(null)
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)

  const startSequence = (sequence: typeof warmupSequences[0]) => {
    setSelectedSequence(sequence)
    setCurrentExerciseIndex(0)
    setIsPlaying(true)
    setTimeRemaining(30) // Mock time
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const nextExercise = () => {
    if (selectedSequence && currentExerciseIndex < selectedSequence.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1)
      setTimeRemaining(30) // Reset timer for next exercise
    } else {
      // Sequence complete
      setIsPlaying(false)
    }
  }

  const resetSequence = () => {
    setSelectedSequence(null)
    setCurrentExerciseIndex(0)
    setIsPlaying(false)
    setTimeRemaining(0)
  }

  return (
    <AuthenticatedLayout>
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">Vocal Warmups</h1>
          <p className="text-muted-foreground">
            Guided warmup sequences to prepare your voice
          </p>
        </div>

        {!selectedSequence ? (
          <>
            {/* Warmup Selection */}
            <div className="space-y-4">
              {warmupSequences.map((sequence) => (
                <Card key={sequence.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{sequence.name}</CardTitle>
                        <CardDescription className="mt-2">
                          {sequence.exercises.length} exercises • {sequence.duration} minutes
                        </CardDescription>
                      </div>
                      <Button onClick={() => startSequence(sequence)}>
                        <Play className="mr-2 h-4 w-4" />
                        Start
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {sequence.exercises.map((exercise, idx) => (
                        <li key={idx}>• {exercise}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Warmup Guidelines</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Always warm up before singing or practicing</li>
                  <li>• Start gently and gradually increase intensity</li>
                  <li>• Stay hydrated throughout your warmup</li>
                  <li>• Focus on relaxation and proper breathing</li>
                  <li>• Stop if you feel any pain or discomfort</li>
                  <li>• Adjust exercises to your comfortable range</li>
                </ul>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            {/* Active Warmup Session */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{selectedSequence.name}</CardTitle>
                    <CardDescription>
                      Exercise {currentExerciseIndex + 1} of {selectedSequence.exercises.length}
                    </CardDescription>
                  </div>
                  <Button variant="outline" onClick={resetSequence}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Current Exercise */}
                <div className="mb-6 rounded-lg bg-gradient-to-br from-purple-50 to-blue-50 p-8 text-center">
                  <Badge className="mb-4">
                    {isPlaying ? 'In Progress' : 'Paused'}
                  </Badge>
                  <h2 className="mb-4 text-2xl font-bold">
                    {selectedSequence.exercises[currentExerciseIndex]}
                  </h2>
                  <div className="flex items-center justify-center gap-2 text-4xl font-bold">
                    <Clock className="h-8 w-8" />
                    {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{
                        width: `${((currentExerciseIndex + 1) / selectedSequence.exercises.length) * 100}%`,
                      }}
                    />
                  </div>
                  <p className="mt-2 text-center text-sm text-muted-foreground">
                    {currentExerciseIndex + 1} of {selectedSequence.exercises.length} exercises complete
                  </p>
                </div>

                {/* Controls */}
                <div className="flex justify-center gap-3">
                  <Button size="lg" onClick={togglePlayPause}>
                    {isPlaying ? (
                      <>
                        <Pause className="mr-2 h-5 w-5" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-5 w-5" />
                        Resume
                      </>
                    )}
                  </Button>
                  <Button size="lg" variant="outline" onClick={nextExercise}>
                    <SkipForward className="mr-2 h-5 w-5" />
                    Next
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Exercises */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Exercises</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {selectedSequence.exercises.map((exercise, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 rounded-lg p-3 ${
                        idx === currentExerciseIndex
                          ? 'bg-primary/10 border border-primary'
                          : idx < currentExerciseIndex
                          ? 'opacity-50'
                          : 'border'
                      }`}
                    >
                      <div
                        className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                          idx === currentExerciseIndex
                            ? 'bg-primary text-primary-foreground'
                            : idx < currentExerciseIndex
                            ? 'bg-green-600 text-white'
                            : 'bg-muted'
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <span className="text-sm">{exercise}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AuthenticatedLayout>
  )
}
