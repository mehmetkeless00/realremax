import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import ToastContainer from '@/components/ToastContainer';
import GlobalHeader from '@/components/GlobalHeader';
import GlobalFooter from '@/components/GlobalFooter';

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Remax Unified Platform',
  description:
    'Unified real estate platform for property search and management',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} font-sans text-fg antialiased`}>
        <GlobalHeader />
        <main>{children}</main>
        <GlobalFooter />
        <ToastContainer />
      </body>
    </html>
  );
}
