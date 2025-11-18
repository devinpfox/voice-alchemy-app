'use client'

import { useState, useEffect } from 'react'
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Play, Pause, Plus, Minus } from 'lucide-react'
import { useToolStore } from '@/store/useToolStore'

export default function MetronomePage() {
  const { settings, updateMetronomeSettings } = useToolStore()
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentBeat, setCurrentBeat] = useState(0)

  const bpm = settings.metronome.bpm
  const { beats, noteValue } = settings.metronome.timeSignature

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentBeat((prev) => (prev + 1) % beats)
      }, (60 / bpm) * 1000)

      return () => clearInterval(interval)
    }
  }, [isPlaying, bpm, beats])

  const toggleMetronome = () => {
    setIsPlaying(!isPlaying)
    if (!isPlaying) {
      setCurrentBeat(0)
    }
  }

  const adjustBPM = (delta: number) => {
    const newBPM = Math.max(40, Math.min(240, bpm + delta))
    updateMetronomeSettings({ bpm: newBPM })
  }

  const setBPMPreset = (preset: number) => {
    updateMetronomeSettings({ bpm: preset })
  }

  const setTimeSignature = (beats: number, noteValue: number) => {
    updateMetronomeSettings({ timeSignature: { beats, noteValue } })
    setCurrentBeat(0)
  }

  return (
    <AuthenticatedLayout>
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">Metronome</h1>
          <p className="text-muted-foreground">
            Keep perfect time during your practice sessions
          </p>
        </div>

        {/* Main Metronome Display */}
        <Card>
          <CardHeader>
            <CardTitle>Digital Metronome</CardTitle>
            <CardDescription>
              Adjust tempo and time signature for your practice
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* BPM Display */}
            <div className="mb-8 text-center">
              <div className="mb-2 text-sm text-muted-foreground">Tempo</div>
              <div className="mb-4 text-7xl font-bold">{bpm}</div>
              <Badge variant="secondary" className="text-base">BPM</Badge>
            </div>

            {/* BPM Controls */}
            <div className="mb-8 flex items-center justify-center gap-4">
              <Button
                size="lg"
                variant="outline"
                onClick={() => adjustBPM(-10)}
              >
                <Minus className="h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => adjustBPM(-1)}
              >
                -1
              </Button>
              <Button
                size="lg"
                onClick={toggleMetronome}
                className="w-32"
              >
                {isPlaying ? (
                  <>
                    <Pause className="mr-2 h-5 w-5" />
                    Stop
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-5 w-5" />
                    Start
                  </>
                )}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => adjustBPM(1)}
              >
                +1
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => adjustBPM(10)}
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>

            {/* Beat Indicator */}
            <div className="mb-8 flex justify-center gap-2">
              {Array.from({ length: beats }).map((_, idx) => (
                <div
                  key={idx}
                  className={`h-4 w-4 rounded-full transition-all ${
                    isPlaying && idx === currentBeat
                      ? idx === 0
                        ? 'bg-red-600 scale-125'
                        : 'bg-primary scale-125'
                      : 'bg-muted'
                  }`}
                />
              ))}
            </div>

            {/* Time Signature Display */}
            <div className="text-center">
              <div className="inline-block rounded-lg border-2 p-4">
                <div className="text-3xl font-bold leading-none">{beats}</div>
                <div className="border-t-2 border-foreground/20 my-1" />
                <div className="text-3xl font-bold leading-none">{noteValue}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* BPM Presets */}
        <Card>
          <CardHeader>
            <CardTitle>Tempo Presets</CardTitle>
            <CardDescription>
              Quick access to common tempos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-4">
              {[
                { label: 'Largo', bpm: 50 },
                { label: 'Adagio', bpm: 70 },
                { label: 'Andante', bpm: 90 },
                { label: 'Moderato', bpm: 108 },
                { label: 'Allegro', bpm: 132 },
                { label: 'Vivace', bpm: 156 },
                { label: 'Presto', bpm: 180 },
                { label: 'Prestissimo', bpm: 208 },
              ].map((preset) => (
                <Button
                  key={preset.label}
                  variant={bpm === preset.bpm ? 'default' : 'outline'}
                  onClick={() => setBPMPreset(preset.bpm)}
                  className="flex flex-col h-auto py-3"
                >
                  <span className="text-xs font-normal">{preset.label}</span>
                  <span className="font-bold">{preset.bpm}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Time Signatures */}
        <Card>
          <CardHeader>
            <CardTitle>Time Signature</CardTitle>
            <CardDescription>
              Select your preferred time signature
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-4">
              {[
                { beats: 2, noteValue: 4, label: '2/4' },
                { beats: 3, noteValue: 4, label: '3/4' },
                { beats: 4, noteValue: 4, label: '4/4' },
                { beats: 5, noteValue: 4, label: '5/4' },
                { beats: 6, noteValue: 8, label: '6/8' },
                { beats: 7, noteValue: 8, label: '7/8' },
                { beats: 9, noteValue: 8, label: '9/8' },
                { beats: 12, noteValue: 8, label: '12/8' },
              ].map((sig) => (
                <Button
                  key={sig.label}
                  variant={
                    beats === sig.beats && noteValue === sig.noteValue
                      ? 'default'
                      : 'outline'
                  }
                  onClick={() => setTimeSignature(sig.beats, sig.noteValue)}
                  className="text-lg font-bold"
                >
                  {sig.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card>
          <CardHeader>
            <CardTitle>Practice Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Start at a slower tempo and gradually increase</li>
              <li>• Practice with the metronome regularly to improve timing</li>
              <li>• Focus on the downbeat (first beat of each measure)</li>
              <li>• Use different time signatures to challenge yourself</li>
              <li>• Try subdividing beats for complex rhythms</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  )
}
