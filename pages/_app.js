import Modal from 'react-modal';

import { Toaster } from 'react-hot-toast';
import { UserProvider } from '@auth0/nextjs-auth0/client';

import Layout from '@/components/layout';
import '@/styles/globals.css';
import { useLoading, LoadingProvider } from '@/context/LoadingContext';
import Loading from '@/components/Loading';
import { VillageProvider } from '@/context/VillageContext';

Modal.setAppElement('#__next');

// Set to VERCEL_URL or override with AUTH0_BASE_URL
process.env.AUTH0_BASE_URL =
  process.env.AUTH0_BASE_URL || process.env.VERCEL_URL;

const LoadingComponentWrapper = ({ children }) => {
  const { loading } = useLoading();
  return (
    <>
      {loading && <Loading />}
      {children}
    </>
  );
};

const MyApp = ({ Component, pageProps }) => {
  return (
    <UserProvider>
      <LoadingProvider>
        <VillageProvider>
          <LoadingComponentWrapper>
            <Layout>
              <Component {...pageProps} />
              <Toaster position="top center" duration={4000} />
            </Layout>
          </LoadingComponentWrapper>
        </VillageProvider>
      </LoadingProvider>
    </UserProvider>
  );
};

export default MyApp;
