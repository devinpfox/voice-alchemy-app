import { create } from 'zustand'

interface ToolSettings {
  tuner: {
    a4Frequency: number
    notation: 'sharp' | 'flat'
  }
  metronome: {
    bpm: number
    timeSignature: { beats: number; noteValue: number }
    volume: number
  }
  pitchTraining: {
    minNote: string
    maxNote: string
    showKeyboard: boolean
  }
  earTraining: {
    difficulty: 'easy' | 'medium' | 'hard'
    intervalTypes: string[]
  }
}

interface ToolState {
  settings: ToolSettings
  audioContext: AudioContext | null
  isAudioInitialized: boolean
  updateTunerSettings: (settings: Partial<ToolSettings['tuner']>) => void
  updateMetronomeSettings: (settings: Partial<ToolSettings['metronome']>) => void
  updatePitchTrainingSettings: (settings: Partial<ToolSettings['pitchTraining']>) => void
  updateEarTrainingSettings: (settings: Partial<ToolSettings['earTraining']>) => void
  initializeAudio: () => void
}

export const useToolStore = create<ToolState>((set) => ({
  settings: {
    tuner: {
      a4Frequency: 440,
      notation: 'sharp',
    },
    metronome: {
      bpm: 120,
      timeSignature: { beats: 4, noteValue: 4 },
      volume: 0.7,
    },
    pitchTraining: {
      minNote: 'C3',
      maxNote: 'C5',
      showKeyboard: true,
    },
    earTraining: {
      difficulty: 'medium',
      intervalTypes: ['major', 'minor', 'perfect'],
    },
  },
  audioContext: null,
  isAudioInitialized: false,
  updateTunerSettings: (settings) =>
    set((state) => ({
      settings: {
        ...state.settings,
        tuner: { ...state.settings.tuner, ...settings },
      },
    })),
  updateMetronomeSettings: (settings) =>
    set((state) => ({
      settings: {
        ...state.settings,
        metronome: { ...state.settings.metronome, ...settings },
      },
    })),
  updatePitchTrainingSettings: (settings) =>
    set((state) => ({
      settings: {
        ...state.settings,
        pitchTraining: { ...state.settings.pitchTraining, ...settings },
      },
    })),
  updateEarTrainingSettings: (settings) =>
    set((state) => ({
      settings: {
        ...state.settings,
        earTraining: { ...state.settings.earTraining, ...settings },
      },
    })),
  initializeAudio: () => {
    if (typeof window !== 'undefined') {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)()
      set({ audioContext: context, isAudioInitialized: true })
    }
  },
}))
