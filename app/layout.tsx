import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: '딜잇 | Deal Eat',
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
      <body>{children}</body>
    </html>
  );
}
