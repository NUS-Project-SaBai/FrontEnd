import { SideMenu } from '@/components/SideMenu';
import { VillageProvider } from '@/context/VillageContext';
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
        <VillageProvider>
          <body className="flex h-screen">
            <SideMenu />
            <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
            <div className="flex-auto overflow-auto">{children}</div>
          </body>
        </VillageProvider>
      </Auth0Provider>
    </html>
  );
}
