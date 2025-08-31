'use client';
import { ReactNode } from 'react';
import ReactModal from 'react-modal';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  text: string;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  ariaHideApp?: boolean;
}

export function Modal({
  isOpen,
  onRequestClose,
  title,
  children,
  text,
  size = 'md',
  className = '',
  ariaHideApp = false,
}: ModalProps) {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-3xl',
    xl: 'max-w-4xl',
  };

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      ariaHideApp={ariaHideApp}
      className={`${sizeClasses[size]} ${className}`}
    >
      {/* Header Section */}
      <div className="flex items-center justify-between border-b border-gray-200 p-6">
        <h2 className="text-xl font-semibold">{title}</h2>
        <div className="flex items-center gap-2">
          <Button
            colour="red"
            onClick={onRequestClose}
            text={text}
            type="button"
          />
        </div>
      </div>

      {/* Content Section - can pass in react components as children */}
      <div className="items-center p-6">{children}</div>
    </ReactModal>
  );
}
