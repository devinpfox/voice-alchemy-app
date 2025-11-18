# Voice Alchemy Academy - MVP Architecture (Payment-Free)

## 📋 Overview

This document outlines the clean, streamlined architecture for Voice Alchemy Academy MVP - a vocal training platform for students and teachers with **NO payment integrations**.

---

## 🎯 Core Principles

1. **Payment-Free**: All payment/checkout/pricing code removed
2. **Modular Tools**: Practice tools are plug-and-play components
3. **Student-First**: Focus on learning journey and progress tracking
4. **Teacher-Enabled**: Simple tools for instructors to manage and guide students
5. **Clean Codebase**: No broken features, no redundant components

---

## 🏗️ Application Structure

### Student Features (Core MVP)

#### 1. Student Dashboard (`/dashboard` or `/`)
**Purpose**: Central hub showing the student's complete learning journey

**Components**:
- ✅ Class Progress widget (`MyProgress`)
- ✅ Upcoming session/class reminder
- ✅ Recent notes preview
- ✅ Quick access buttons:
  - My Classes
  - Goals & To-dos
  - Video Library
  - Practice Tools
  - Messages
  - Calendar

**Files**:
- `src/app/page.tsx` (main homepage)
- `src/app/dashboard/student/page.tsx`
- `src/components/MyProgress/MyProgress.tsx`
- `src/components/Button/Button.tsx`

---

#### 2. e-Workbook / Weekly Notes
**Purpose**: Structured weekly practice notes

**Structure**:
```
Week 1 (Nov 1-7, 2024)
├─ Check-in
├─ Warm-ups
├─ Practice log
├─ Session notes
├─ Homework
└─ Freeform notes
```

**Status**: ⚠️ TO BE IMPLEMENTED
- Should stack vertically (no popups)
- Auto-group by month
- Persistent storage via Supabase

**Proposed Location**: `src/app/notes/page.tsx`

---

#### 3. Practice Tools (Modular)
**Purpose**: Vocal training widgets - MUST be plug-and-play

**Tools**:
- ✅ **Chromatic Tuner** (`/Instuner` - fully integrated via iframe)
- ⚡ **Metronome** (placeholder at `/tools/metronome`)
- ⚡ **Ear Training** (placeholder at `/tools/ear-training`)
- ⚡ **Pitch Training** (placeholder at `/tools/pitch-training`)
- ⚡ **Warmups** (placeholder at `/tools/warmups`)
- ⚡ **Piano/Keyboard** (to be added)
- ⚡ **Rhythm Trainer** (to be added)

**Current Implementation**:
```
src/
├─ app/tools/
│  ├─ tuner/page.tsx
│  ├─ metronome/page.tsx
│  ├─ ear-training/page.tsx
│  ├─ pitch-training/page.tsx
│  └─ warmups/page.tsx
├─ components/
│  ├─ ChromaticTuner/ChromaticTuner.tsx ✅ (iframe wrapper)
│  └─ modals/
│     └─ MetronomeModal.tsx
└─ public/
   └─ Instuner/ ✅ (full chromatic tuner widget)
```

**Architecture**:
- Each tool is a standalone component
- Can be loaded in modal OR dedicated page
- Easy to plug in new tools
- No dependencies between tools

---

#### 4. Video Library
**Purpose**: Watch structured lessons and masterclasses

**Features**:
- Browse courses
- Watch video lessons
- Take notes beside video
- Track progress through modules

**Files**:
- `src/app/courses/page.tsx` (course list)
- `src/app/courses/[courseId]/page.tsx` (course detail)
- `src/app/courses/[courseId]/lesson/[lessonId]/page.tsx` (video player)
- `src/components/VideoLibrary/VideoLibrary.tsx` (modal)

**Status**: ✅ Structure exists, needs content integration

---

#### 5. Messaging
**Purpose**: Direct student ↔ teacher communication

**Features**:
- Inbox/thread list
- Direct messages
- Text + attachments
- Unread notifications

**Files**:
- `src/app/messages/page.tsx` (inbox)
- `src/app/messages/[userId]/page.tsx` (conversation)
- `src/components/ContactsList/ContactsList.tsx`
- `src/components/ChatboxComponent/ChatboxComponent.tsx`

**Status**: ✅ UI complete, needs Supabase real-time integration

---

#### 6. File Uploads
**Purpose**: Students upload practice recordings, assignments, etc.

**Status**: ⚠️ TO BE IMPLEMENTED
- Should integrate with Supabase Storage
- Allow audio, video, image uploads
- Organize by date/assignment

**Proposed Location**: `src/app/files/page.tsx`

---

#### 7. Calendar
**Purpose**: View all upcoming classes and sessions

**Status**: ⚠️ TO BE IMPLEMENTED
- Show recurring mentorship sessions
- Display one-time events
- Sync with live session bookings

**Proposed Location**: `src/app/calendar/page.tsx`

---

#### 8. Community Board
**Purpose**: Discussion forum (teacher-moderated)

**Status**: ⚠️ TO BE IMPLEMENTED
- Teachers/admin create threads
- Students reply
- Request topics

**Proposed Location**: `src/app/community/page.tsx`

---

### Teacher Features (Core MVP)

#### 1. Teacher Dashboard (`/dashboard/instructor`)
**Purpose**: Overview of all students and upcoming sessions

**Features**:
- Student list
- Upcoming sessions
- Recent activity
- Quick actions

**Files**:
- `src/app/dashboard/instructor/page.tsx`

**Status**: ✅ Basic structure exists

---

#### 2. Student Management
**Purpose**: View/manage individual student profiles

**Features**:
- Open student workbook
- Review weekly notes
- View uploaded files
- Set goals/homework
- Track progress

**Status**: ⚠️ TO BE IMPLEMENTED
**Proposed Location**: `src/app/dashboard/instructor/students/[studentId]/page.tsx`

---

#### 3. Course & Content Management
**Purpose**: Create and manage courses, quizzes, vocabulary

**Features**:
- Upload course videos
- Create quizzes
- Build vocabulary lists
- Organize modules

**Files**:
- `src/app/courses/upload/page.tsx` ✅
- `src/components/CourseUpload/CourseUpload.tsx` ✅

**Status**: ✅ Upload form ready, needs content editor

---

#### 4. Class Flow Management
**Purpose**: Manage live sessions and student interactions

**Features**:
- View student notes during session
- Update homework live
- Upload reference files
- (Video call integration via Daily.co)

**Files**:
- `src/app/live/[sessionId]/page.tsx` ✅
- `src/components/WebcamComponent/WebcamComponent.tsx` ✅
- `src/lib/daily.ts` ✅

**Status**: ✅ Live session page ready, needs Daily.co SDK integration

---

#### 5. Teacher Messaging
**Purpose**: Communicate with students

**Files**: Same as student messaging (role-based UI)

**Status**: ✅ Ready

---

## 🔧 Technical Architecture

### Database (Supabase)

**Tables** (proposed):
```sql
- users (id, email, role, name, avatar_url, bio)
- courses (id, title, description, instructor_id, thumbnail_url)
- lessons (id, course_id, title, video_url, order)
- student_progress (id, student_id, lesson_id, completed_at)
- notes (id, student_id, week, content, created_at)
- messages (id, from_user_id, to_user_id, content, read, created_at)
- files (id, user_id, file_url, file_type, uploaded_at)
- sessions (id, instructor_id, student_id, scheduled_at, room_id)
- community_threads (id, title, author_id, created_at)
- community_posts (id, thread_id, author_id, content, created_at)
```

### API Routes

```
/api/
├─ auth/
│  └─ callback/ ✅ (Supabase auth)
├─ daily/
│  └─ create-room/ ✅ (video sessions)
├─ courses/ (to be added)
├─ notes/ (to be added)
├─ files/ (to be added)
└─ messages/ (to be added)
```

### State Management

**Zustand Stores**:
- `useUserStore.ts` ✅
- `useCourseStore.ts` ✅
- `useToolStore.ts` ✅
- `useSessionStore.ts` ✅

---

## 🧹 Cleanup Completed

### ✅ Removed
- ❌ Payment integrations (removed from settings)
- ❌ Empty/redundant directories (`/library`, `/masterclasses`, `/messaging`)
- ❌ Old ChromaticTunerWidget (replaced with real tuner)

### ✅ Kept & Updated
- ✅ Core student dashboard
- ✅ Core teacher dashboard
- ✅ Messaging system (UI ready)
- ✅ Course structure (ready for content)
- ✅ Live sessions (Daily.co integrated)
- ✅ Chromatic tuner (full Instuner widget)
- ✅ Settings (payment method removed, bio added)
- ✅ File upload components (ready to wire up)

---

## 🎯 Next Implementation Steps

### Priority 1: Core Student Features
1. **Weekly Notes System** - Implement e-workbook
2. **Calendar** - Show upcoming sessions
3. **File Upload Integration** - Connect to Supabase Storage

### Priority 2: Core Teacher Features
1. **Student Detail Page** - View individual student progress
2. **Notes Review** - Teacher can view/comment on student notes
3. **Assignment System** - Set and track homework

### Priority 3: Community & Advanced
1. **Community Board** - Forum functionality
2. **Tool Integrations** - Replace placeholders with actual widgets
3. **Daily.co Client SDK** - Full video calling

---

## 📦 Modular Tool Architecture

### How to Add a New Tool

1. **Create the tool component**:
   ```tsx
   // src/components/tools/MyNewTool/MyNewTool.tsx
   export default function MyNewTool() {
     return <div>My Tool UI</div>;
   }
   ```

2. **Create a dedicated page** (optional):
   ```tsx
   // src/app/tools/my-tool/page.tsx
   import MyNewTool from '@/components/tools/MyNewTool/MyNewTool';

   export default function MyToolPage() {
     return <MyNewTool />;
   }
   ```

3. **Add to homepage button grid**:
   ```tsx
   <Button label="MY NEW TOOL" onClick={() => router.push('/tools/my-tool')} />
   ```

4. **Or use in a modal** (for quick access):
   ```tsx
   {isMyToolOpen && <MyToolModal onClose={handleClose} />}
   ```

---

## 🚀 Running the MVP

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

**Environment Variables Required**:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
DAILY_API_KEY=your_daily_api_key
```

---

## 📝 Notes

- **No payment features**: This is intentional for the MVP
- **Modular tools**: Easy to add/remove practice widgets
- **Supabase-first**: All data stored in Supabase
- **Daily.co for video**: Professional video calling
- **Mobile-ready**: Responsive design with bottom toolbar navigation

---

**Last Updated**: November 14, 2024
**Version**: 1.0 (Payment-Free MVP)
