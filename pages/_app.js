import React from 'react';
import Modal from 'react-modal';

import { Toaster } from 'react-hot-toast';
import { UserProvider } from '@auth0/nextjs-auth0/client';

import Layout from '@/components/layout';
import '@/styles/globals.css';

Modal.setAppElement('#__next');

// Set to VERCEL_URL or override with AUTH0_BASE_URL
process.env.AUTH0_BASE_URL =
  process.env.AUTH0_BASE_URL || process.env.VERCEL_URL;

const MyApp = ({ Component, pageProps }) => {
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
