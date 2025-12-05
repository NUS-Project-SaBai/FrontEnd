'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ClearLocalStorage() {
  const router = useRouter();

  useEffect(() => {
    localStorage.clear();
    router.back();
  }, [router]);

  return <p>Clearing local storage and going back...</p>;
}
