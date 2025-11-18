import { create } from 'zustand'

interface Lesson {
  id: string
  title: string
  description: string | null
  video_url: string | null
  duration: number | null
  order: number
  module_id: string
}

interface Module {
  id: string
  title: string
  description: string | null
  order: number
  course_id: string
  lessons: Lesson[]
}

interface Course {
  id: string
  title: string
  description: string | null
  instructor_id: string
  thumbnail_url: string | null
  level: 'beginner' | 'intermediate' | 'advanced'
  modules: Module[]
}

interface CourseState {
  currentCourse: Course | null
  currentModule: Module | null
  currentLesson: Lesson | null
  enrolledCourses: Course[]
  progress: Record<string, number>
  setCourse: (course: Course | null) => void
  setModule: (module: Module | null) => void
  setLesson: (lesson: Lesson | null) => void
  setEnrolledCourses: (courses: Course[]) => void
  updateProgress: (lessonId: string, progress: number) => void
}

export const useCourseStore = create<CourseState>((set) => ({
  currentCourse: null,
  currentModule: null,
  currentLesson: null,
  enrolledCourses: [],
  progress: {},
  setCourse: (course) => set({ currentCourse: course }),
  setModule: (module) => set({ currentModule: module }),
  setLesson: (lesson) => set({ currentLesson: lesson }),
  setEnrolledCourses: (courses) => set({ enrolledCourses: courses }),
  updateProgress: (lessonId, progress) =>
    set((state) => ({
      progress: { ...state.progress, [lessonId]: progress },
    })),
}))
