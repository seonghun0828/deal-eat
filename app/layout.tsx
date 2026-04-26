import type { Metadata } from 'next';
import { GoogleTagManager } from '@next/third-parties/google';

import './globals.css';

const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

export const metadata: Metadata = {
  title: '버거딜 | Burger Deal',
  description: '매주 햄버거 할인 큐레이션 해드립니다!',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        {children}
        {gtmId ? <GoogleTagManager gtmId={gtmId} /> : null}
      </body>
    </html>
  );
}
