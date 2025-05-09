'use client';
import { useUser } from '@auth0/nextjs-auth0';

export default function Home() {
  const { user } = useUser();
  return <p>Hi {user?.nickname}</p>;
}
