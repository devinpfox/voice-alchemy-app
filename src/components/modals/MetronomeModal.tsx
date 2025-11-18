'use client';

import { useState } from 'react';

interface MetronomeModalProps {
  onClose: () => void;
}

export default function MetronomeModal({ onClose }: MetronomeModalProps) {
  const [bpm, setBpm] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-[#322c4e] border-2 border-[#d0bf86] p-6 rounded-lg shadow-lg max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Metronome</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-[#d0bf86] text-2xl font-bold"
          >
            &times;
          </button>
        </div>

        <div className="text-center mb-6">
          <div className="text-6xl font-bold text-[#d0bf86] mb-4">{bpm}</div>
          <p className="text-white/70 text-sm">Beats Per Minute</p>
        </div>

        <div className="mb-6">
          <input
            type="range"
            min="40"
            max="240"
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-white/50 text-xs mt-1">
            <span>40</span>
            <span>240</span>
          </div>
        </div>

        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="custom-button mb-4"
        >
          {isPlaying ? 'Stop' : 'Start'}
        </button>

        <button onClick={onClose} className="custom-button">Close</button>
      </div>
    </div>
  )
}
