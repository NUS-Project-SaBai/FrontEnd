import { SideMenu } from '@/components/SideMenu';
import { VillageProvider } from '@/context/VillageContext';
import { Auth0Provider } from '@auth0/nextjs-auth0';
import { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata: Metadata = {
  title: "Sa'Bai Biometrics",
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
          <body
            className="vsc-initialized flex h-screen" /* add vsc-initialized to fix hydration error triggered by the Video Speed Controller Chrome extension https://stackoverflow.com/a/53400956/7577786 */
          >
            <SideMenu />
            <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
            <div className="flex-auto overflow-auto">{children}</div>
          </body>
        </VillageProvider>
      </Auth0Provider>
    </html>
  );
}
