'use client';

import React from 'react';

interface MyProgressProps {
  label?: string;
  onClick?: () => void;
}

export default function MyProgress({ label, onClick }: MyProgressProps = {}) {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <button className="progress" onClick={handleClick}>
      {label}
    </button>
  );
}
