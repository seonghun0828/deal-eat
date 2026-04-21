import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "DealEat",
  description: "Weekly Korean fast food deal feed",
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

