import { useUser } from '@auth0/nextjs-auth0/client';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const withAuth = Component => {
  const AuthComponent = props => {
    const router = useRouter();
    const { user, isLoading } = useUser();

    useEffect(() => {
      // Redirect logic for authenticated user
      if (!isLoading && !user) {
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
