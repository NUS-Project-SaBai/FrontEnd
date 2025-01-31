import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function IndexPage() {
  const router = useRouter();

  useEffect(() => {
    // User is logged in
    router.push('/registration');
  }, [router]);

  return null;
};
