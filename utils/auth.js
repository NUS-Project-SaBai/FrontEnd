import React from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import Redirect from "../pages/api/redirect";

const withAuth = (Component) => {
  return (props) => {
    const { user, isLoading } = useUser();

    if (isLoading) {
      return <p>Loading...</p>;
    }

    if (!user) {
      return <Redirect ssr to="/api/auth/login" />;
    }
    window.localStorage.setItem("userID", parseInt(user?.name));
    return <Component user={user} isLoading={isLoading} {...props} />;
  };
};

export default withAuth;
