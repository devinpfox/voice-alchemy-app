'use client'

import { useState, useCallback } from 'react'
import { Upload, X, Video, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDropzone } from 'react-dropzone'

interface VideoUploaderProps {
  onUploadComplete: (url: string) => void
  courseId?: string
  lessonId?: string
  currentVideoUrl?: string
}

export function VideoUploader({ onUploadComplete, courseId, lessonId, currentVideoUrl }: VideoUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [videoUrl, setVideoUrl] = useState<string | null>(currentVideoUrl || null)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return

    const file = acceptedFiles[0]

    // Validate file type
    if (!file.type.startsWith('video/')) {
      setError('Please upload a valid video file')
      return
    }

    // Validate file size (500MB max)
    if (file.size > 500 * 1024 * 1024) {
      setError('Video file must be less than 500MB')
      return
    }

    setError(null)
    setUploading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'video')
      if (courseId) formData.append('courseId', courseId)
      if (lessonId) formData.append('lessonId', lessonId)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const data = await response.json()
      setVideoUrl(data.url)
      onUploadComplete(data.url)
      setUploadProgress(100)
    } catch (err) {
      console.error('Upload error:', err)
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }, [courseId, lessonId, onUploadComplete])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi', '.webm']
    },
    maxFiles: 1,
    disabled: uploading
  })

  const handleRemove = () => {
    setVideoUrl(null)
    setUploadProgress(0)
    setError(null)
  }

  if (videoUrl) {
    return (
      <div className="space-y-3">
        <div className="relative rounded-lg border-2 border-green-500 bg-green-50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Video className="h-8 w-8 text-green-600" />
              <div>
                <p className="font-medium text-green-900">Video uploaded successfully</p>
                <p className="text-sm text-green-700">Ready to save</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              className="text-green-700 hover:text-green-900"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <video src={videoUrl} controls className="w-full rounded-lg" />
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-primary/50'
        } ${uploading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="font-medium">Uploading video...</p>
            <div className="w-full max-w-xs">
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-12 w-12 text-muted-foreground" />
            <p className="font-medium">
              {isDragActive ? 'Drop video here...' : 'Drag & drop video here'}
            </p>
            <p className="text-sm text-muted-foreground">
              or click to browse (MP4, MOV, WebM • Max 500MB)
            </p>
          </div>
        )}
      </div>
      {error && (
        <div className="rounded-lg border-2 border-red-500 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
    </div>
  )
}
