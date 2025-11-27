'use client';
import { LoadingUI } from '@/components/LoadingUI';
import {
  BASE_BUTTON_STYLES,
  ButtonSize,
  ButtonStyle,
  ButtonVariant,
  COLOUR_MAP,
  SIZE_MAP,
} from './buttonStyles';
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
  colour?: ButtonVariant;
  size?: ButtonSize;
  variant?: ButtonStyle;
  Icon?: ReactNode;
  fullWidth?: boolean;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

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

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={!hydrated || isLoading || props.disabled}
      className={`${BASE_BUTTON_STYLES} gap-2 ${sizeStyles} ${colorStyles} ${
        fullWidth ? 'w-full' : ''
      } ${className ?? ''}`}
      {...props}
    >
      {isLoading ? (
        <LoadingUI
          spinnerClassName={`h-3.5 w-3.5 border-blue-900`}
          className="flex h-3 items-center space-x-1"
          message="Loading...."
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
