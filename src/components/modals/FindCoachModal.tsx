'use client';

interface FindCoachModalProps {
  onClose: () => void;
}

export default function FindCoachModal({ onClose }: FindCoachModalProps) {
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
          <h2 className="text-2xl font-bold text-white">Find a Coach</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-[#d0bf86] text-2xl font-bold"
          >
            &times;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/10 p-4 rounded-lg hover:bg-white/20 transition-colors cursor-pointer">
            <div className="flex items-center mb-3">
              <div className="w-16 h-16 rounded-full bg-gray-600 mr-4"></div>
              <div>
                <h3 className="text-white font-semibold">Sarah Johnson</h3>
                <p className="text-white/60 text-sm">Classical & Opera</p>
              </div>
            </div>
            <p className="text-white/70 text-sm mb-2">15 years experience teaching vocal techniques</p>
            <div className="flex justify-between items-center">
              <span className="text-[#d0bf86] text-sm">$50/hour</span>
              <button className="text-[#d0bf86] text-sm hover:underline">View Profile</button>
            </div>
          </div>

          <div className="bg-white/10 p-4 rounded-lg hover:bg-white/20 transition-colors cursor-pointer">
            <div className="flex items-center mb-3">
              <div className="w-16 h-16 rounded-full bg-gray-600 mr-4"></div>
              <div>
                <h3 className="text-white font-semibold">Michael Chen</h3>
                <p className="text-white/60 text-sm">Pop & Contemporary</p>
              </div>
            </div>
            <p className="text-white/70 text-sm mb-2">Specializes in modern vocal techniques and performance</p>
            <div className="flex justify-between items-center">
              <span className="text-[#d0bf86] text-sm">$45/hour</span>
              <button className="text-[#d0bf86] text-sm hover:underline">View Profile</button>
            </div>
          </div>
        </div>

        <button onClick={onClose} className="custom-button mt-6">Close</button>
      </div>
    </div>
  )
}
