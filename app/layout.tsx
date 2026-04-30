import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { GoogleTagManager } from '@next/third-parties/google';

import { getSiteUrl } from '@/lib/site';

import './globals.css';

const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
const siteUrl = getSiteUrl();
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '700'],
});

export const metadata: Metadata = {
  title: '버거딜 | Burger Deal',
  description: '진짜 쓸만한 버거 할인들만 모았습니다.',
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: 'Burger Deal',
    title: '버거딜 | Burger Deal',
    description: '매주 햄버거 할인 큐레이션 해드립니다!',
    url: '/',
    images: [
      {
        url: '/assets/og_image.png',
        width: 1200,
        height: 630,
        alt: 'Burger Deal 대표 이미지',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '버거딜 | Burger Deal',
    description: '매주 햄버거 할인 큐레이션 해드립니다!',
    images: ['/assets/og_image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
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
      <body className={inter.className}>
        {children}
        {gtmId ? <GoogleTagManager gtmId={gtmId} /> : null}
      </body>
    </html>
  );
}
