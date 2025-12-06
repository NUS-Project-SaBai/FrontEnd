'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ClearLocalStorage() {
  const router = useRouter();

  useEffect(() => {
    if (confirm('Are you sure you want to clear local storage?')) {
      localStorage.clear();
    }
    router.back();
  }, [router]);

  return <p>Clearing local storage and going back...</p>;
}
