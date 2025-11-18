import { create } from 'zustand'

interface Participant {
  id: string
  user_id: string
  full_name: string
  avatar_url: string | null
  role: 'instructor' | 'student'
  joined_at: string
}

interface Note {
  id: string
  content: string
  author_id: string
  created_at: string
  updated_at: string
}

interface LiveSession {
  id: string
  title: string
  instructor_id: string
  scheduled_at: string
  duration: number
  status: 'scheduled' | 'live' | 'ended'
  participants: Participant[]
  notes: Note[]
}

interface SessionState {
  currentSession: LiveSession | null
  upcomingSessions: LiveSession[]
  isConnected: boolean
  setSession: (session: LiveSession | null) => void
  setUpcomingSessions: (sessions: LiveSession[]) => void
  addParticipant: (participant: Participant) => void
  removeParticipant: (userId: string) => void
  addNote: (note: Note) => void
  updateNote: (noteId: string, content: string) => void
  setConnected: (isConnected: boolean) => void
}

export const useSessionStore = create<SessionState>((set) => ({
  currentSession: null,
  upcomingSessions: [],
  isConnected: false,
  setSession: (session) => set({ currentSession: session }),
  setUpcomingSessions: (sessions) => set({ upcomingSessions: sessions }),
  addParticipant: (participant) =>
    set((state) => ({
      currentSession: state.currentSession
        ? {
            ...state.currentSession,
            participants: [...state.currentSession.participants, participant],
          }
        : null,
    })),
  removeParticipant: (userId) =>
    set((state) => ({
      currentSession: state.currentSession
        ? {
            ...state.currentSession,
            participants: state.currentSession.participants.filter(
              (p) => p.user_id !== userId
            ),
          }
        : null,
    })),
  addNote: (note) =>
    set((state) => ({
      currentSession: state.currentSession
        ? {
            ...state.currentSession,
            notes: [...state.currentSession.notes, note],
          }
        : null,
    })),
  updateNote: (noteId, content) =>
    set((state) => ({
      currentSession: state.currentSession
        ? {
            ...state.currentSession,
            notes: state.currentSession.notes.map((note) =>
              note.id === noteId
                ? { ...note, content, updated_at: new Date().toISOString() }
                : note
            ),
          }
        : null,
    })),
  setConnected: (isConnected) => set({ isConnected }),
}))
