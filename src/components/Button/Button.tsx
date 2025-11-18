import React from 'react';

interface ButtonProps {
  label: string;
  onClick?: () => void;
}

export default function Button({ label, onClick }: ButtonProps) {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <button className="button" onClick={handleClick}>
      {label}
    </button>
  );
}
