import { useUser } from '@auth0/nextjs-auth0/client';
import { OFFLINE } from './constants';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const withAuth = Component => {
  const AuthComponent = props => {
    const router = useRouter();
    const { user, isLoading } = useUser();

    useEffect(() => {
      // Fetch offlineUser from localStorage when component mounts
      let offlineUserFromStorage = null;
      if (typeof window !== 'undefined') {
        offlineUserFromStorage = window.localStorage.getItem('offline_user');
      }

      if (OFFLINE && !offlineUserFromStorage) {
        router.push('/login');
      }
      // Redirect logic for authenticated user
      if (!isLoading && !user && !OFFLINE) {
        router.push('/api/auth/login');
      }
    }, []); // Empty dependency array ensures this effect runs only once

    // Render loading state while checking authentication
    if (isLoading) {
      return <p>Loading...</p>;
    }

    // Render the wrapped component if authenticated
    return <Component {...props} />;
  };

  // Wrap withAuth component with Next.js specific logic
  return AuthComponent;
};

export default withAuth;
