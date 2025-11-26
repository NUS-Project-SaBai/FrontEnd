'use client';
import { LoadingUI } from '@/components/LoadingUI';
import {
  ButtonHTMLAttributes,
  MouseEvent,
  ReactNode,
  useEffect,
  useState,
} from 'react';

type ButtonProps = {
  text?: string;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void | Promise<void>;
  type?: 'submit' | 'button' | 'reset';
  colour?: 'green' | 'red' | 'orange' | 'blue' | 'white' | 'indigo';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'solid' | 'outline' | 'ghost';
  Icon?: ReactNode;
  fullWidth?: boolean;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const COLOUR_MAP: Record<
  NonNullable<ButtonProps['colour']>,
  {
    solid: string;
    outline: string;
    ghost: string;
  }
> = {
  green: {
    solid:
      'bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-600',
    outline:
      'border border-green-600 text-green-700 hover:bg-green-50 focus-visible:ring-green-600',
    ghost: 'text-green-700 hover:bg-green-50 focus-visible:ring-green-600',
  },
  red: {
    solid: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600',
    outline:
      'border border-red-600 text-red-700 hover:bg-red-50 focus-visible:ring-red-600',
    ghost: 'text-red-700 hover:bg-red-50 focus-visible:ring-red-600',
  },
  orange: {
    solid:
      'bg-orange-600 text-white hover:bg-orange-700 focus-visible:ring-orange-600',
    outline:
      'border border-orange-600 text-orange-700 hover:bg-orange-50 focus-visible:ring-orange-600',
    ghost: 'text-orange-700 hover:bg-orange-50 focus-visible:ring-orange-600',
  },
  blue: {
    solid:
      'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-600',
    outline:
      'border border-blue-600 text-blue-700 hover:bg-blue-50 focus-visible:ring-blue-600',
    ghost: 'text-blue-700 hover:bg-blue-50 focus-visible:ring-blue-600',
  },
  indigo: {
    solid:
      'bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:ring-indigo-600',
    outline:
      'border border-indigo-600 text-indigo-700 hover:bg-indigo-50 focus-visible:ring-indigo-600',
    ghost: 'text-indigo-700 hover:bg-indigo-50 focus-visible:ring-indigo-600',
  },
  white: {
    solid:
      'bg-white border border-gray-300 text-gray-800 hover:bg-gray-50 focus-visible:ring-gray-400',
    outline:
      'border border-gray-300 text-gray-800 hover:bg-gray-50 focus-visible:ring-gray-400',
    ghost: 'text-gray-800 hover:bg-gray-100 focus-visible:ring-gray-400',
  },
};

const SIZE_MAP: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'px-2 py-0.5 md:px-3 sm:py-1.5 text-sm',
  md: 'px-3 py-1.5 md:px-4 md:py-2 text-sm',
  lg: 'px-4 py-2 md:px-5 md:py-3 text-base',
};

export function Button({
  text,
  onClick,
  type = 'button',
  colour = 'white',
  variant = 'solid',
  size = 'md',
  Icon,
  fullWidth,
  className,
  ...props
}: ButtonProps) {
  const [hydrated, setHydrated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Prevent SSR hydration mismatch
  useEffect(() => setHydrated(true), []);

  const handleClick = async (e: MouseEvent<HTMLButtonElement>) => {
    if (!onClick || !hydrated) return;
    const maybePromise = onClick(e);
    if (maybePromise instanceof Promise) {
      try {
        setIsLoading(true);
        await maybePromise;
      } finally {
        setIsLoading(false);
      }
    }
  };

  const colorStyles = COLOUR_MAP[colour][variant];
  const sizeStyles = SIZE_MAP[size];
  const baseStyles =
    'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={!hydrated || isLoading || props.disabled}
      className={`${baseStyles} ${sizeStyles} ${colorStyles} ${
        fullWidth ? 'w-full' : ''
      } ${className ?? ''}`}
      {...props}
    >
      {isLoading ? (
        // You can replace this with your own spinner or <LoadingUI />
        <LoadingUI
          spinnerClassName={`h-3.5 w-3.5 border-blue-900`}
          className="flex h-3 items-center space-x-1"
          message="Saving...."
        />
      ) : (
        <>
          {text && <span>{text}</span>}
          {Icon && <span className="flex items-center">{Icon}</span>}
        </>
      )}
    </button>
  );
}
