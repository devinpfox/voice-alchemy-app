'use client'

import { useState, useEffect } from 'react'
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Mic, MicOff, Settings } from 'lucide-react'
import { useToolStore } from '@/store/useToolStore'

export default function TunerPage() {
  const [isListening, setIsListening] = useState(false)
  const [currentNote, setCurrentNote] = useState<string | null>(null)
  const [currentFrequency, setCurrentFrequency] = useState<number | null>(null)
  const [cents, setCents] = useState<number>(0)
  const { settings, initializeAudio, isAudioInitialized } = useToolStore()

  useEffect(() => {
    if (!isAudioInitialized) {
      initializeAudio()
    }
  }, [isAudioInitialized, initializeAudio])

  const toggleListening = () => {
    if (!isListening) {
      // Start listening - integrate with Tone.js and Pitchy here
      setIsListening(true)
      // Placeholder: simulate pitch detection
      setCurrentNote('A')
      setCurrentFrequency(440)
      setCents(0)
    } else {
      // Stop listening
      setIsListening(false)
      setCurrentNote(null)
      setCurrentFrequency(null)
      setCents(0)
    }
  }

  return (
    <AuthenticatedLayout>
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">Vocal Tuner</h1>
          <p className="text-muted-foreground">
            Practice your pitch accuracy with real-time feedback
          </p>
        </div>

        {/* Main Tuner Display */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Chromatic Tuner</CardTitle>
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>
              Sing or play a note to see pitch accuracy
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Note Display */}
            <div className="mb-8 text-center">
              {currentNote ? (
                <>
                  <div className="mb-4 text-8xl font-bold">{currentNote}</div>
                  <div className="text-2xl text-muted-foreground">
                    {currentFrequency?.toFixed(2)} Hz
                  </div>
                </>
              ) : (
                <div className="py-12 text-2xl text-muted-foreground">
                  {isListening ? 'Listening...' : 'Click start to begin'}
                </div>
              )}
            </div>

            {/* Pitch Meter */}
            <div className="mb-8">
              <div className="relative h-8 rounded-lg bg-muted">
                {/* Center Line */}
                <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-foreground/20" />

                {/* Indicator */}
                {currentNote && (
                  <div
                    className="absolute top-1 h-6 w-2 rounded-full bg-primary transition-all duration-100"
                    style={{
                      left: `calc(50% + ${cents}%)`,
                      transform: 'translateX(-50%)',
                    }}
                  />
                )}
              </div>
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>-50¢</span>
                <span>0¢</span>
                <span>+50¢</span>
              </div>
            </div>

            {/* Accuracy Badge */}
            {currentNote && (
              <div className="mb-6 text-center">
                {Math.abs(cents) < 5 ? (
                  <Badge className="bg-green-600">In Tune</Badge>
                ) : Math.abs(cents) < 15 ? (
                  <Badge variant="secondary">Close</Badge>
                ) : cents < 0 ? (
                  <Badge variant="destructive">Too Flat</Badge>
                ) : (
                  <Badge variant="destructive">Too Sharp</Badge>
                )}
              </div>
            )}

            {/* Control Button */}
            <div className="text-center">
              <Button
                size="lg"
                onClick={toggleListening}
                className="w-full sm:w-auto"
              >
                {isListening ? (
                  <>
                    <MicOff className="mr-2 h-5 w-5" />
                    Stop
                  </>
                ) : (
                  <>
                    <Mic className="mr-2 h-5 w-5" />
                    Start Tuner
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">A4 Frequency</p>
                <p className="text-sm text-muted-foreground">
                  Reference pitch (Hz)
                </p>
              </div>
              <Badge variant="secondary">{settings.tuner.a4Frequency} Hz</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Notation</p>
                <p className="text-sm text-muted-foreground">
                  Sharp (#) or Flat (♭)
                </p>
              </div>
              <Badge variant="secondary">
                {settings.tuner.notation === 'sharp' ? 'Sharp' : 'Flat'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card>
          <CardHeader>
            <CardTitle>Tips for Using the Tuner</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Find a quiet environment for best results</li>
              <li>• Hold notes steady for at least 2-3 seconds</li>
              <li>• Start with comfortable mid-range notes</li>
              <li>• Practice matching pitch before attempting songs</li>
              <li>• Use headphones to avoid feedback</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  )
}
