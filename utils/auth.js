import { useUser } from '@auth0/nextjs-auth0/client';
import { OFFLINE } from './constants';
import { useEffect } from 'react';
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
    }, []);

    if (isLoading) {
      return <p>Loading...</p>;
    }

    return <Component {...props} />;
  };

  return AuthComponent;
};

export default withAuth;
