import { useUser } from '@auth0/nextjs-auth0/client';
import Redirect from '../pages/api/redirect';

const withAuth = Component => {
  return props => {
    const { user, isLoading } = useUser();

    if (isLoading) {
      return <p>Loading...</p>;
    }

    if (!user) {
      return <Redirect ssr to="/api/auth/login" />;
    }
    return <Component {...props} />;
  };
};

export default withAuth;
