'use client';
import { useState } from 'react';

export function Button({
  text,
  onClick,
  type = 'button',
}: {
  text: string;
  onClick: () => void;
  type?: 'submit' | 'button' | 'reset';
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    try {
      setIsLoading(true);
      await onClick();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className={`rounded-md border p-2 shadow-sm`}
      type={type}
      onClick={handleClick}
      disabled={isLoading}
    >
      {text}
    </button>
  );
}
