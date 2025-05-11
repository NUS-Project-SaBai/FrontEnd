'use client';
import { useUser } from '@auth0/nextjs-auth0';

export default function Home() {
  const { user } = useUser();
  console.log(
    'appBaseUrl:',
    process.env.VERCEL_URL,
    process.env.APP_BASE_URL,
    process.env.VERCEL_URL || process.env.APP_BASE_URL
  );
  return <p>Hi {user?.nickname}</p>;
}
