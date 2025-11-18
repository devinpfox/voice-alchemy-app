# ✅ Admin Role Update Complete

## Changes Made

I've successfully updated the entire course management system to use **"admin"** role instead of "instructor" role. This aligns with your existing database structure where you have **"student"** and **"admin"** roles.

---

## 🔄 What Was Updated

### 1. Database Schema ✅
**New File**: `supabase_course_schema_admin.sql`

- Created helper function `is_admin()` that checks if user has 'admin' role
- Updated all RLS policies to use `is_admin()` function
- Admins can create, update, and delete their own courses
- Admins can manage modules, lessons, and quizzes for their courses
- Students can still enroll and view published courses

**Key Changes**:
```sql
-- Helper function
create or replace function is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from profiles
    where id = auth.uid()
    and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- Example RLS Policy
create policy "Admins can create courses"
  on courses for insert
  with check (auth.uid() = instructor_id and is_admin());
```

### 2. Auth Helper Functions ✅
**New File**: `src/lib/auth-helpers.ts`

Created two helper functions:
- `isAdmin()` - Returns boolean if user has admin role
- `requireAdmin()` - Throws error if user is not admin (use in API routes)

```typescript
export async function requireAdmin() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    throw new Error('Admin access required')
  }

  return { user, profile }
}
```

### 3. API Routes Updated ✅

All course management API routes now check for admin role:

#### Updated Routes:
- ✅ **`/api/courses` (POST)** - Create course (admin only)
- ✅ **`/api/courses/[courseId]` (PUT, DELETE)** - Update/delete course (admin only)
- ✅ **`/api/modules` (POST, PUT, DELETE)** - Manage modules (admin only)
- ✅ **`/api/lessons` (POST, PUT, DELETE)** - Manage lessons (admin only)
- ✅ **`/api/upload` (POST)** - Upload videos/thumbnails (admin only)

#### Student Routes (unchanged):
- ✅ `/api/courses` (GET) - Anyone can view published courses
- ✅ `/api/enrollments` - Students can enroll/view enrollments
- ✅ `/api/progress` - Students can track their progress
- ✅ `/api/quizzes/[quizId]/attempt` - Students can take quizzes

**Example Update**:
```typescript
// Before:
const { data: { user }, error: authError } = await supabase.auth.getUser()
if (authError || !user) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

// After:
import { requireAdmin } from '@/lib/auth-helpers'

const { user } = await requireAdmin() // Checks role = 'admin'
```

---

## 🚀 How to Use

### Step 1: Run New Database Schema

**IMPORTANT**: Use the new schema file that includes admin role checks:

```bash
# Go to Supabase Dashboard → SQL Editor
# Run the contents of: supabase_course_schema_admin.sql
```

This will:
- Create all tables (if not exists)
- Add the `is_admin()` helper function
- Set up RLS policies that check for admin role

### Step 2: Verify User Roles

Make sure your profiles table has the correct roles:

```sql
-- Check current roles
SELECT id, email, role FROM profiles;

-- Update a user to admin (for teachers)
UPDATE profiles
SET role = 'admin'
WHERE email = 'teacher@example.com';

-- Verify
SELECT email, role FROM profiles WHERE role = 'admin';
```

### Step 3: Test Course Creation

1. **Login as Admin**:
   - User with `role = 'admin'` in profiles table
   - Navigate to `/courses/create`
   - Should be able to create courses

2. **Login as Student**:
   - User with `role = 'student'` in profiles table
   - Try navigating to `/courses/create`
   - Should get 403 Forbidden error

---

## 🔐 Security Model

### Admin Users Can:
- ✅ Create courses
- ✅ Upload videos and thumbnails
- ✅ Create modules and lessons
- ✅ Build quizzes
- ✅ Publish/unpublish courses
- ✅ Edit their own courses only
- ✅ Delete their own courses only
- ✅ View student progress for their courses

### Student Users Can:
- ✅ View all published courses
- ✅ Enroll in courses
- ✅ Watch videos
- ✅ Take quizzes
- ✅ Track their own progress
- ❌ Cannot create/edit courses
- ❌ Cannot upload videos
- ❌ Cannot access `/courses/create`

### Database Security (RLS):
- Row-level security enforced at database level
- Even if someone bypasses API, database will reject unauthorized actions
- Admins can only manage their own courses
- Students can only see their own progress

---

## 📝 Code Changes Summary

### Files Created:
1. `supabase_course_schema_admin.sql` - New schema with admin checks
2. `src/lib/auth-helpers.ts` - Helper functions for role checking
3. `ADMIN_ROLE_UPDATE.md` - This documentation

### Files Modified:
1. `src/app/api/courses/route.ts` - Added requireAdmin()
2. `src/app/api/courses/[courseId]/route.ts` - Added requireAdmin()
3. `src/app/api/modules/route.ts` - Added requireAdmin()
4. `src/app/api/lessons/route.ts` - Added requireAdmin()
5. `src/app/api/upload/route.ts` - Added requireAdmin()

### Files Unchanged (work as-is):
- All UI components (VideoUploader, QuizBuilder, etc.)
- Student pages and components
- Progress tracking
- Quiz system
- Enrollment system

---

## ✅ Testing Checklist

### Admin Testing:
- [ ] Login as user with `role = 'admin'`
- [ ] Navigate to `/courses/create` (should work)
- [ ] Create a test course (should succeed)
- [ ] Upload video (should work)
- [ ] Create quiz (should work)
- [ ] Publish course (should work)

### Student Testing:
- [ ] Login as user with `role = 'student'`
- [ ] View published courses (should work)
- [ ] Enroll in course (should work)
- [ ] Watch videos (should work)
- [ ] Take quizzes (should work)
- [ ] Try to access `/courses/create` (should get 403 error)

### Database Testing:
- [ ] Run: `SELECT * FROM profiles WHERE role = 'admin'`
- [ ] Verify admin users exist
- [ ] Try creating course as student (should be blocked by RLS)

---

## 🐛 Troubleshooting

### "Admin access required" error when creating courses?

**Check 1: User Role**
```sql
SELECT email, role FROM profiles WHERE id = auth.uid();
```
Should return `role = 'admin'`

**Check 2: Update Role**
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';
```

**Check 3: Check RLS Function**
```sql
SELECT is_admin(); -- Should return true for admin users
```

### Course creation still not working?

1. Clear browser cache
2. Logout and login again
3. Check browser console for errors
4. Verify database schema was run correctly

### Students can't enroll?

Make sure the RLS policies allow students to enroll:
```sql
-- This should exist in your schema
create policy "Students can enroll in published courses"
  on course_enrollments for insert
  with check (
    auth.uid() = student_id
    and exists (
      select 1 from courses
      where courses.id = course_enrollments.course_id
      and courses.is_published = true
    )
  );
```

---

## 🎯 Key Points

1. **"admin" = Teacher/Instructor** in your system
2. **All course management** requires admin role
3. **Students** can only consume content, not create
4. **Database enforces** security with RLS
5. **API validates** role before any operation
6. **Column name** `instructor_id` stays the same (still references admin users)

---

## 📊 Before vs After

| Feature | Before | After |
|---------|--------|-------|
| **Role Name** | "instructor" | "admin" |
| **Auth Check** | Basic user check | Role validation |
| **Create Course** | Any authenticated user | Admin only |
| **Upload Video** | Any authenticated user | Admin only |
| **Database Security** | User ID only | User ID + role check |
| **API Protection** | Manual checks | Helper function |

---

## ✨ Benefits

1. **Aligned with your database** - Uses existing "admin" role
2. **Better security** - Role checked at DB and API level
3. **Clearer code** - `requireAdmin()` is self-documenting
4. **Easy to maintain** - Single place to update role logic
5. **Production ready** - Proper error handling and messages

---

## 🚀 You're Ready!

Everything is set up and ready to go. Just:

1. ✅ Run `supabase_course_schema_admin.sql` in your Supabase SQL editor
2. ✅ Make sure your teacher accounts have `role = 'admin'` in profiles table
3. ✅ Test course creation at `/courses/create`

The system will automatically enforce that only admin users can create and manage courses!
