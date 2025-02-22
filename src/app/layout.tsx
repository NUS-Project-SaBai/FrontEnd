import { Auth0Provider } from '@auth0/nextjs-auth0';
import { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata: Metadata = {
  title: "Sa'bai Biometrics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Auth0Provider>
        <body>
          <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
          {children}
        </body>
      </Auth0Provider>
    </html>
  );
}
