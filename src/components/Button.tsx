'use client';
import { LoadingUI } from '@/components/LoadingUI';
import {
  ButtonHTMLAttributes,
  MouseEvent,
  ReactNode,
  useEffect,
  useState,
} from 'react';

export function Button({
  text,
  onClick = () => {},
  type = 'button',
  colour = 'white',
  Icon = <></>,
  moreStyles = '',
  ...props
}: {
  text: string;
  onClick?: (e: MouseEvent) => void;
  type?: 'submit' | 'button' | 'reset';
  colour?: 'green' | 'red' | 'blue' | 'white' | 'indigo';
  Icon?: ReactNode;
  moreStyles?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const [isLoading, setIsLoading] = useState(true);
  // makes the button interactive only when it is hydrated
  useEffect(() => {
    setIsLoading(false);
  }, []);

  const handleClick = async (e: MouseEvent) => {
    try {
      setIsLoading(true);
      onClick(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className={
        (isLoading
          ? 'rounded-md bg-gray-300 opacity-50 hover:cursor-default'
          : `rounded-md p-2 shadow-sm hover:shadow hover:outline hover:outline-gray-400 ` +
            (colour == 'white'
              ? 'bg-white'
              : `bg-${colour}-500 border-0 text-white`)) + moreStyles
      }
      type={type}
      onClick={handleClick}
      disabled={isLoading}
      {...props}
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
