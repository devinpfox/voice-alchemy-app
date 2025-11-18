# Supabase Storage Setup for Course Videos

## Step 1: Create Storage Buckets

Go to your Supabase Dashboard → Storage and create the following buckets:

### 1. `course-videos` bucket
- **Public**: Yes (so students can access videos)
- **File size limit**: 500 MB (or higher based on your needs)
- **Allowed MIME types**: video/mp4, video/webm, video/quicktime

### 2. `course-thumbnails` bucket
- **Public**: Yes
- **File size limit**: 5 MB
- **Allowed MIME types**: image/jpeg, image/png, image/webp

## Step 2: Set up Storage Policies

Run these SQL commands in your Supabase SQL Editor:

```sql
-- =====================================================
-- STORAGE POLICIES FOR course-videos BUCKET
-- =====================================================

-- Allow authenticated users to upload videos
create policy "Instructors can upload course videos"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'course-videos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow public access to view videos
create policy "Anyone can view course videos"
on storage.objects for select
to public
using (bucket_id = 'course-videos');

-- Allow instructors to update their own videos
create policy "Instructors can update their videos"
on storage.objects for update
to authenticated
using (
  bucket_id = 'course-videos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow instructors to delete their own videos
create policy "Instructors can delete their videos"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'course-videos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- =====================================================
-- STORAGE POLICIES FOR course-thumbnails BUCKET
-- =====================================================

-- Allow authenticated users to upload thumbnails
create policy "Instructors can upload thumbnails"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'course-thumbnails'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow public access to view thumbnails
create policy "Anyone can view thumbnails"
on storage.objects for select
to public
using (bucket_id = 'course-thumbnails');

-- Allow instructors to update their own thumbnails
create policy "Instructors can update their thumbnails"
on storage.objects for update
to authenticated
using (
  bucket_id = 'course-thumbnails'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow instructors to delete their own thumbnails
create policy "Instructors can delete their thumbnails"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'course-thumbnails'
  and (storage.foldername(name))[1] = auth.uid()::text
);
```

## Step 3: File Organization Structure

Videos and thumbnails will be organized by instructor ID:

```
course-videos/
  └── {instructor_id}/
      └── {course_id}/
          └── {lesson_id}/
              └── video.mp4

course-thumbnails/
  └── {instructor_id}/
      └── {course_id}/
          └── thumbnail.jpg
```

## Step 4: Get Public URLs

After upload, get public URLs like this:

```typescript
const { data } = supabase
  .storage
  .from('course-videos')
  .getPublicUrl(`${instructorId}/${courseId}/${lessonId}/video.mp4`)

// data.publicUrl will be the video URL to save in the database
```

## Notes

- The policies ensure instructors can only manage their own files (organized by their user ID)
- Public access is read-only for viewing videos
- Consider adding file size validation in your upload API
- For production, you may want to add CDN caching
