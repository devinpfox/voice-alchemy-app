# Voice Alchemy Academy - Implementation Roadmap

## 🎯 Current Status: Clean MVP Foundation

✅ Payment code removed
✅ Redundant directories cleaned up
✅ Core pages structure in place
✅ Chromatic tuner fully integrated
✅ Architecture documented

---

## 📅 Phase 1: Core Student Experience (Week 1-2)

### 1.1 Weekly Notes System (e-Workbook)
**Priority**: CRITICAL
**Estimated Time**: 3-4 days

**Tasks**:
- [ ] Create notes database schema in Supabase
- [ ] Build note creation UI (`/notes/page.tsx`)
- [ ] Implement weekly note structure:
  - Check-in
  - Warm-ups
  - Practice log
  - Session notes
  - Homework
  - Freeform notes
- [ ] Add month grouping
- [ ] Enable auto-save
- [ ] Add rich text editor (optional: Tiptap or Lexical)

**Files to Create**:
```
src/app/notes/
├─ page.tsx (notes list)
├─ [weekId]/page.tsx (individual week)
└─ actions.ts (server actions)
```

---

### 1.2 Calendar Integration
**Priority**: HIGH
**Estimated Time**: 2-3 days

**Tasks**:
- [ ] Create sessions table in Supabase
- [ ] Build calendar UI (`/calendar/page.tsx`)
- [ ] Display upcoming sessions
- [ ] Show recurring events
- [ ] Add "Join Session" button
- [ ] Sync with live sessions

**Files to Create**:
```
src/app/calendar/
├─ page.tsx
└─ components/
   ├─ CalendarView.tsx
   └─ SessionCard.tsx
```

**Library**: Consider using `react-big-calendar` or `fullcalendar`

---

### 1.3 File Upload System
**Priority**: HIGH
**Estimated Time**: 2 days

**Tasks**:
- [ ] Set up Supabase Storage bucket
- [ ] Create file upload component
- [ ] Build file gallery page (`/files/page.tsx`)
- [ ] Support audio, video, image uploads
- [ ] Add file preview
- [ ] Organize by date/type
- [ ] Teacher file access

**Files to Create**:
```
src/app/files/
├─ page.tsx
└─ components/
   ├─ FileUploader.tsx
   └─ FileGallery.tsx
src/lib/
└─ storage.ts (Supabase Storage helpers)
```

---

## 📅 Phase 2: Teacher Dashboard (Week 3)

### 2.1 Student Management
**Priority**: CRITICAL
**Estimated Time**: 3-4 days

**Tasks**:
- [ ] Create student-teacher relationship table
- [ ] Build student list view
- [ ] Create student detail page
- [ ] Display student notes
- [ ] Show student files
- [ ] View progress metrics
- [ ] Add goal-setting interface
- [ ] Homework assignment UI

**Files to Create**:
```
src/app/dashboard/instructor/
└─ students/
   ├─ page.tsx (student list)
   └─ [studentId]/
      ├─ page.tsx (overview)
      ├─ notes/page.tsx
      ├─ files/page.tsx
      └─ progress/page.tsx
```

---

### 2.2 Content Editor
**Priority**: MEDIUM
**Estimated Time**: 2-3 days

**Tasks**:
- [ ] Enhance course upload form
- [ ] Add video processing/upload
- [ ] Build course editor UI
- [ ] Create quiz builder
- [ ] Vocabulary list creator
- [ ] Module organizer

**Files to Update**:
```
src/app/courses/upload/page.tsx (enhance)
src/components/CourseUpload/CourseUpload.tsx (enhance)
```

---

## 📅 Phase 3: Real-time Features (Week 4)

### 3.1 Supabase Realtime - Messaging
**Priority**: HIGH
**Estimated Time**: 2-3 days

**Tasks**:
- [ ] Set up Supabase Realtime subscriptions
- [ ] Wire up real-time message updates
- [ ] Add typing indicators
- [ ] Implement read receipts
- [ ] Push notifications (web)
- [ ] File attachments in messages

**Files to Update**:
```
src/app/messages/[userId]/page.tsx
src/lib/supabase/realtime.ts (new)
```

---

### 3.2 Live Session Enhancement
**Priority**: MEDIUM
**Estimated Time**: 2 days

**Tasks**:
- [ ] Integrate Daily.co client SDK
- [ ] Enable webcam/mic controls
- [ ] Add screen sharing
- [ ] Real-time session notes (collaborative)
- [ ] Recording functionality
- [ ] Session chat

**Files to Update**:
```
src/app/live/[sessionId]/page.tsx
src/components/WebcamComponent/WebcamComponent.tsx
```

**Library**: Install `@daily-co/daily-js`

---

## 📅 Phase 4: Community & Advanced (Week 5-6)

### 4.1 Community Board
**Priority**: MEDIUM
**Estimated Time**: 3 days

**Tasks**:
- [ ] Create community tables (threads, posts)
- [ ] Build forum UI
- [ ] Teacher thread creation
- [ ] Student replies
- [ ] Topic requests
- [ ] Moderation tools

**Files to Create**:
```
src/app/community/
├─ page.tsx (thread list)
├─ [threadId]/page.tsx (thread detail)
└─ components/
   ├─ ThreadList.tsx
   └─ PostCard.tsx
```

---

### 4.2 Practice Tool Integrations
**Priority**: LOW-MEDIUM
**Estimated Time**: Ongoing

**Tasks**:
- [ ] Replace metronome placeholder
- [ ] Integrate ear-training widget (from Babar)
- [ ] Add pitch trainer
- [ ] Integrate piano/keyboard
- [ ] Add rhythm trainer
- [ ] Build warmup sequences

**Strategy**: Each tool is added independently as a module

---

### 4.3 Progress Analytics
**Priority**: MEDIUM
**Estimated Time**: 2-3 days

**Tasks**:
- [ ] Create analytics dashboard
- [ ] Track practice time
- [ ] Course completion metrics
- [ ] Note frequency
- [ ] Streak tracking
- [ ] Teacher reports

**Files to Create**:
```
src/app/dashboard/student/analytics/page.tsx
src/app/dashboard/instructor/analytics/page.tsx
```

---

## 🛠️ Technical Debt & Optimization

### Ongoing Tasks
- [ ] Add comprehensive error handling
- [ ] Implement loading states everywhere
- [ ] Add form validation
- [ ] Optimize image/video loading
- [ ] Add SEO metadata
- [ ] Implement proper TypeScript types
- [ ] Write tests (Jest + React Testing Library)
- [ ] Add accessibility (ARIA labels, keyboard nav)
- [ ] Mobile responsiveness audit

---

## 📱 Mobile Considerations

### React Native Conversion (Future)
When converting to React Native:
- Reuse all business logic
- Adapt UI components to React Native
- Use Expo for easier development
- Supabase works the same
- Daily.co has React Native SDK

**Estimate**: 2-3 weeks for mobile port

---

## 🚀 Deployment Checklist

### Before Launch
- [ ] Set up production Supabase project
- [ ] Configure Daily.co production account
- [ ] Set up environment variables
- [ ] Configure CDN for media files
- [ ] Enable Supabase RLS (Row Level Security)
- [ ] Set up error tracking (Sentry)
- [ ] Configure analytics (PostHog/Mixpanel)
- [ ] Set up monitoring (Vercel/Railway)
- [ ] Domain and SSL setup
- [ ] Beta testing with 5-10 users

---

## 📊 Success Metrics

### MVP Success Criteria
- [ ] 10+ students actively using notes
- [ ] 5+ completed courses uploaded
- [ ] Daily active messaging
- [ ] 90%+ tool uptime
- [ ] <2s page load times
- [ ] Positive user feedback

---

## 🎯 Quick Wins (Do These First!)

1. **Calendar** - Students need to see upcoming classes
2. **Weekly Notes** - Core to the learning experience
3. **File Upload** - Students want to submit recordings
4. **Real-time Messaging** - Improves engagement
5. **Student Detail Page** - Teachers need to review progress

---

## 📞 Daily.co Integration Steps

1. **Install SDK**:
   ```bash
   npm install @daily-co/daily-js
   ```

2. **Update WebcamComponent**:
   ```tsx
   import DailyIframe from '@daily-co/daily-js';

   const callFrame = DailyIframe.createFrame({
     url: roomUrl,
     showLeaveButton: true,
   });
   ```

3. **Test Video Call**:
   - Create room via `/api/daily/create-room`
   - Join with multiple browsers
   - Verify audio/video

---

## 🔄 Iterative Development Approach

**Week 1**: Notes + Calendar
**Week 2**: File Upload + Student Management
**Week 3**: Teacher Dashboard enhancements
**Week 4**: Real-time Messaging
**Week 5**: Live Sessions polish
**Week 6**: Community Board + Tools

**Total MVP Timeline**: 6 weeks for full-featured platform

---

## 📝 Notes

- Start with Supabase schema design
- Keep tools modular
- Test with real users early
- Iterate based on feedback
- Don't over-engineer

---

**Priority Order**:
1. Notes System ⭐⭐⭐
2. Calendar ⭐⭐⭐
3. File Upload ⭐⭐⭐
4. Student Management ⭐⭐⭐
5. Real-time Messaging ⭐⭐
6. Community Board ⭐
7. Tool Integrations ⭐

**Get the core experience right first, then add features!**
