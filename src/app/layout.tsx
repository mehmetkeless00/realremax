import type { ReactNode } from 'react';
import './globals.css';
import { Montserrat } from 'next/font/google';
import { getLocale } from 'next-intl/server';

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
});

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const locale = await getLocale(); // next-intl v4 request config'ten gelir
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${montserrat.variable} font-sans text-fg antialiased`}>
        {children}
      </body>
    </html>
  );
}
