'use client';

interface VideoLibraryModalProps {
  onClose: () => void;
}

export default function VideoLibraryModal({ onClose }: VideoLibraryModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-[#322c4e] border-2 border-[#d0bf86] p-6 rounded-lg shadow-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Video Library</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-[#d0bf86] text-2xl font-bold"
          >
            &times;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/10 p-4 rounded-lg hover:bg-white/20 transition-colors cursor-pointer">
            <div className="aspect-video bg-gray-700 rounded mb-2 flex items-center justify-center">
              <span className="text-white/50">Video Thumbnail</span>
            </div>
            <h3 className="text-white font-semibold">Vocal Warmup Exercises</h3>
            <p className="text-white/60 text-sm">15 minutes</p>
          </div>

          <div className="bg-white/10 p-4 rounded-lg hover:bg-white/20 transition-colors cursor-pointer">
            <div className="aspect-video bg-gray-700 rounded mb-2 flex items-center justify-center">
              <span className="text-white/50">Video Thumbnail</span>
            </div>
            <h3 className="text-white font-semibold">Breath Control Techniques</h3>
            <p className="text-white/60 text-sm">20 minutes</p>
          </div>
        </div>

        <button onClick={onClose} className="custom-button mt-6">Close</button>
      </div>
    </div>
  )
}
