'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

export function LoadingLink({
  href,
  children,
  className,
  ...props
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <div
      {...props}
      onClick={e => {
        e.preventDefault();
        startTransition(() => {
          router.push(href);
        });
      }}
      className={`relative ${className}`}
    >
      {isPending && (
        <div className="absolute inset-0 z-10 flex flex-col gap-2 items-center justify-center bg-white/30 backdrop-blur-sm">
          <div
            className={`h-6 w-6 animate-spin rounded-full border-y-2 border-blue-500`}
          />
          <p className="font-semibold text-gray-700">Loading...</p>
        </div>
      )}

      {children}
    </div>
  );
}
