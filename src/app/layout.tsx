import { Auth0Provider } from '@auth0/nextjs-auth0';
import { Metadata } from 'next';

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
        <body>{children}</body>
      </Auth0Provider>
    </html>
  );
}
