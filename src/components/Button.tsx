'use client';
import { useState } from 'react';

export function Button({
  text,
  onClick = () => {},
  type = 'button',
  colour = 'white',
}: {
  text: string;
  onClick?: () => void;
  type?: 'submit' | 'button' | 'reset';
  colour?: 'green' | 'red' | 'blue' | 'white';
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
      className={
        `text m-0.5 rounded-md border-2 p-2 shadow-sm hover:shadow hover:outline hover:outline-black ` +
        (colour == 'white' ? 'bg-white' : `bg-${colour}-500 text-white`)
      }
      type={type}
      onClick={handleClick}
      disabled={isLoading}
    >
      {text}
    </button>
  );
}
