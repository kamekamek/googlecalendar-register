import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Googleカレンダー一括登録',
  description: 'テキストからGoogleカレンダーに一括登録するツール',
  manifest: '/manifest.json',
  themeColor: '#0a0a0a',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'カレンダー登録',
  },
  icons: {
    icon: [{ url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' }],
    apple: [{ url: '/icons/icon-192x192.png' }],
  },
  verification: {
    google: 'SqrhZW6D8zk5AB_Lp2cyHQrOukiDjzlsL0Gl3Uy4lgI',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <script src="/register-sw.js" defer />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}    