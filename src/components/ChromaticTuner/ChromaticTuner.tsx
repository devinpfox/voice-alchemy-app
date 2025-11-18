'use client';

import React from 'react';

export default function ChromaticTuner() {
  return (
    <div className="chromatic-tuner-container">
      <iframe
        src="/Instuner/tune1.html"
        title="Chromatic Tuner"
        className="chromatic-tuner-iframe"
        style={{
          width: '100%',
          height: '500px',
          border: 'none',
          borderRadius: '8px',
          backgroundColor: 'white'
        }}
        allow="microphone"
      />
    </div>
  );
}
