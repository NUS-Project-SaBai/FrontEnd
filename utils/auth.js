import { useUser } from '@auth0/nextjs-auth0/client';
import Redirect from '../pages/api/redirect';
import { OFFLINE } from './constants';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const withAuth = Component => {
  const AuthComponent = props => {
    const router = useRouter();
    const { user, isLoading } = useUser();
    const [offlineUser, setOfflineUser] = useState(null);

    useEffect(() => {
      // Fetch offlineUser from localStorage when component mounts
      let offlineUserFromStorage = null;
      if (typeof window !== 'undefined') {
        console.log('here');
        offlineUserFromStorage = window.localStorage.getItem('offline_user');
        console.log(offlineUserFromStorage);
        setOfflineUser(offlineUserFromStorage);
      }
      console.log('offlineUser:', offlineUser);

      if (OFFLINE && !offlineUserFromStorage) {
        console.log('offlineUser:', offlineUser);
        router.push('/login');
      }
      // Redirect logic for authenticated user
      if (!isLoading && !user && !OFFLINE) {
        router.push('/api/auth/login');
      }
    }, []); // Empty dependency array ensures this effect runs only once

    // useEffect(() => {
    //   // Redirect logic for offline user
    //   if (OFFLINE && !offlineUser) {
    //     console.log('offlineUser:', offlineUser);
    //     router.push('/test');
    //   }
    //   // Redirect logic for authenticated user
    //   if (!isLoading && !user && !OFFLINE) {
    //     router.push('/api/auth/login');
    //   }
    // }, [user, isLoading, offlineUser, router]);

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

// const withAuth = Component => {
//   return props => {
//     // const offlineUser = window.localStorage.getItem('offline_user');

//     const [offlineUser, setOfflineUser] = useState(null);

//     useEffect(() => {
//       if (typeof window !== 'undefined') {
//         const offlineUserFromStorage =
//           window.localStorage.getItem('offline_user');
//         setOfflineUser(offlineUserFromStorage);
//       }
//     }, []);

//     if (OFFLINE && !offlineUser) {
//       console.log('offlineUser:', offlineUser);
//       return <Redirect ssr to="/test" />;
//     } else if (OFFLINE) {
//       return <Component {...props} />;
//     }

//     const { user, isLoading } = useUser();

//     if (isLoading) {
//       return <p>Loading...</p>;
//     }

//     if (!user && !OFFLINE) {
//       return <Redirect ssr to="/api/auth/login" />;
//     }

//     return <Component {...props} />;
//   };
// };

// export default withAuth;
