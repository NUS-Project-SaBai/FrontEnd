'use client';
import { ReactNode, useEffect, useState } from 'react';
import { LoadingUI } from './LoadingUI';

export function Button({
  text,
  onClick = () => {},
  type = 'button',
  colour = 'white',
  Icon = <></>,
}: {
  text: string;
  onClick?: () => void;
  type?: 'submit' | 'button' | 'reset';
  colour?: 'green' | 'red' | 'blue' | 'white' | 'indigo';
  Icon?: ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  // makes the button interactive only when it is hydrated
  useEffect(() => {
    setIsLoading(false);
  }, []);

  const handleClick = async () => {
    try {
      setIsLoading(true);
      onClick();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className={
        isLoading
          ? 'rounded-md bg-gray-300 opacity-50 hover:cursor-default'
          : `rounded-md p-2 shadow-sm hover:shadow hover:outline hover:outline-gray-400 ` +
            (colour == 'white'
              ? 'bg-white'
              : `bg-${colour}-500 border-0 text-white`)
      }
      type={type}
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <LoadingUI />
      ) : (
        <div>
          {Icon}
          {text}
        </div>
      )}
    </button>
  );
}
