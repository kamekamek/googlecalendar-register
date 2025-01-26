import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Googleカレンダー一括登録',
  description: 'テキストからGoogleカレンダーに一括登録するツール',
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' }
    ],
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
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
} 