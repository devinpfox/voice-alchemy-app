'use client'

import { useState, useRef, useEffect } from 'react'
import ReactPlayer from 'react-player'
import { Loader2 } from 'lucide-react'

interface TrackedVideoPlayerProps {
  videoUrl: string
  lessonId: string
  watchRequired: boolean
  onProgressUpdate?: (progress: number) => void
  onComplete?: () => void
  initialProgress?: number
}

export function TrackedVideoPlayer({
  videoUrl,
  lessonId,
  watchRequired,
  onProgressUpdate,
  onComplete,
  initialProgress = 0
}: TrackedVideoPlayerProps) {
  const playerRef = useRef<ReactPlayer>(null)
  const [progress, setProgress] = useState(initialProgress)
  const [duration, setDuration] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [seeking, setSeeking] = useState(false)
  const [lastSavedProgress, setLastSavedProgress] = useState(initialProgress)
  const [maxWatchedProgress, setMaxWatchedProgress] = useState(initialProgress)

  // Update progress every 5 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      if (progress > lastSavedProgress + 5) {
        try {
          await fetch('/api/progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              lesson_id: lessonId,
              video_progress: progress
            })
          })
          setLastSavedProgress(progress)
          onProgressUpdate?.(progress)
        } catch (error) {
          console.error('Failed to save progress:', error)
        }
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [progress, lastSavedProgress, lessonId, onProgressUpdate])

  // Check if video is complete
  useEffect(() => {
    if (progress >= 95 && onComplete) {
      onComplete()
    }
  }, [progress, onComplete])

  const handleProgress = (state: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }) => {
    if (!seeking) {
      const progressPercent = state.played * 100
      setProgress(progressPercent)

      // Track max watched progress
      if (progressPercent > maxWatchedProgress) {
        setMaxWatchedProgress(progressPercent)
      }
    }
  }

  const handleSeek = (seconds: number) => {
    if (!watchRequired) {
      return
    }

    // Prevent seeking ahead of what's been watched
    const seekProgress = (seconds / duration) * 100
    if (seekProgress > maxWatchedProgress + 5) {
      // Allow seeking up to 5% ahead
      const maxAllowedSeconds = ((maxWatchedProgress + 5) / 100) * duration
      playerRef.current?.seekTo(maxAllowedSeconds, 'seconds')
      return
    }
  }

  const handleDuration = (dur: number) => {
    setDuration(dur)
  }

  return (
    <div className="relative w-full">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
        <ReactPlayer
          ref={playerRef}
          url={videoUrl}
          width="100%"
          height="100%"
          playing={playing}
          controls={true}
          onProgress={handleProgress}
          onDuration={handleDuration}
          onSeek={handleSeek}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => {
            setProgress(100)
            onComplete?.()
          }}
          config={{
            file: {
              attributes: {
                controlsList: watchRequired ? 'nodownload' : undefined
              }
            }
          }}
        />
      </div>

      {/* Progress Bar */}
      <div className="mt-3">
        <div className="mb-1 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Watch Progress</span>
          <span className="font-medium">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        {watchRequired && progress < 95 && (
          <p className="mt-2 text-xs text-muted-foreground">
            You must watch at least 95% of the video to unlock the quiz
          </p>
        )}
      </div>
    </div>
  )
}
