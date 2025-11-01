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
      overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center"
      style={{
        content: {
          backgroundColor: 'white',
          border: 'none',
          borderRadius: '0.5rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          padding: 0,
          margin: 'auto',
          width: '90%',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* Header Section - Fixed */}
      <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-200 p-6">
        <h2 className="text-xl font-semibold">{title}</h2>
        <div className="flex flex-col items-end gap-1">
          <Button
            colour="red"
            onClick={onRequestClose}
            text={text}
            type="button"
          />
          <span className="text-xs text-gray-500">or press Esc</span>
        </div>
      </div>

      {/* Content Section - Scrollable */}
      <div className="flex-1 overflow-y-auto p-6">{children}</div>
    </ReactModal>
  );
}
