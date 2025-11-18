import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth-helpers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Check if user is admin (only teachers/admins can upload)
    const { user } = await requireAdmin()

    const supabase = await createClient()

    const formData = await request.formData()
    const file = formData.get('file') as File
    const fileType = formData.get('type') as string // 'video' or 'thumbnail'
    const courseId = formData.get('courseId') as string
    const lessonId = formData.get('lessonId') as string

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (fileType === 'video') {
      if (!file.type.startsWith('video/')) {
        return NextResponse.json(
          { error: 'File must be a video' },
          { status: 400 }
        )
      }
      // Limit video size to 500MB
      if (file.size > 500 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'Video file must be less than 500MB' },
          { status: 400 }
        )
      }
    } else if (fileType === 'thumbnail') {
      if (!file.type.startsWith('image/')) {
        return NextResponse.json(
          { error: 'File must be an image' },
          { status: 400 }
        )
      }
      // Limit image size to 5MB
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'Image file must be less than 5MB' },
          { status: 400 }
        )
      }
    }

    // Generate file path based on type
    const bucket = fileType === 'video' ? 'course-videos' : 'course-thumbnails'
    const fileExtension = file.name.split('.').pop()
    const timestamp = Date.now()

    let filePath: string

    if (fileType === 'video' && lessonId) {
      filePath = `${user.id}/${courseId}/${lessonId}/${timestamp}.${fileExtension}`
    } else {
      filePath = `${user.id}/${courseId}/${timestamp}.${fileExtension}`
    }

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from(bucket)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json(
        { error: `Upload failed: ${uploadError.message}` },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: urlData } = supabase
      .storage
      .from(bucket)
      .getPublicUrl(filePath)

    return NextResponse.json({
      url: urlData.publicUrl,
      path: filePath,
      bucket
    })

  } catch (error) {
    console.error('Upload error:', error)
    if (error instanceof Error && (error.message === 'Unauthorized' || error.message === 'Admin access required')) {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
