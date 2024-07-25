import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';

import { Toaster } from 'react-hot-toast';
import { UserProvider } from '@auth0/nextjs-auth0/client';

import Layout from '@/components/layout';
import '@/styles/globals.css';
import { OFFLINE } from '@/utils/constants';

Modal.setAppElement('#__next');

const MyApp = ({ Component, pageProps }) => {
  // const offline_user = window.localStorage.getItem('offline_user');
  // const offline_user = null;
  const [offlineUser, setOfflineUser] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const offlineUserFromStorage =
        window.localStorage.getItem('offline_user');
      setOfflineUser(offlineUserFromStorage);
    }
  }, []);

  return (
    <UserProvider>
      <Layout>
        <Component {...pageProps} />
        <Toaster position="top center" duration={4000} />
      </Layout>
    </UserProvider>
  );
};

export default MyApp;
