'use client';

interface DictionaryModalProps {
  onClose: () => void;
}

export default function DictionaryModal({ onClose }: DictionaryModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-[#322c4e] border-2 border-[#d0bf86] p-6 rounded-lg shadow-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Vocal Dictionary</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-[#d0bf86] text-2xl font-bold"
          >
            &times;
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-white/10 p-4 rounded-lg">
            <h3 className="text-[#d0bf86] font-semibold mb-2">Vibrato</h3>
            <p className="text-white/80 text-sm">A regular, pulsating change of pitch used to add expression to vocal music.</p>
          </div>

          <div className="bg-white/10 p-4 rounded-lg">
            <h3 className="text-[#d0bf86] font-semibold mb-2">Resonance</h3>
            <p className="text-white/80 text-sm">The amplification and enrichment of vocal tone by sympathetic vibration in the throat, mouth, and nasal cavities.</p>
          </div>

          <div className="bg-white/10 p-4 rounded-lg">
            <h3 className="text-[#d0bf86] font-semibold mb-2">Head Voice</h3>
            <p className="text-white/80 text-sm">The upper register of the voice, characterized by lighter, more resonant tones.</p>
          </div>
        </div>

        <button onClick={onClose} className="custom-button mt-6">Close</button>
      </div>
    </div>
  )
}
