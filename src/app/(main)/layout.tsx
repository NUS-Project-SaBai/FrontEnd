import { SideMenu } from '@/components/SideMenu';
import { PatientListProvider } from '@/context/PatientListContext';
import { VillageProvider } from '@/context/VillageContext';
import { Auth0Provider } from '@auth0/nextjs-auth0';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Sa'Bai Biometrics",
};

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Auth0Provider>
      <VillageProvider>
        <PatientListProvider>
          <div
            className="vsc-initialized flex h-screen flex-col overflow-hidden md:flex-row" /* add vsc-initialized to fix hydration error triggered by the Video Speed Controller Chrome extension https://stackoverflow.com/a/53400956/7577786 */
          >
            <SideMenu />
            <div className="flex-auto overflow-auto">{children}</div>
          </div>
        </PatientListProvider>
      </VillageProvider>
    </Auth0Provider>
  );
}
